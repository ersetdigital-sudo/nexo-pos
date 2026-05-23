"use client";

import { useState, useEffect, useRef } from "react";
import { useStore, Product, CartItem } from "@/store";
import Link from "next/link";
import { IconSearch, IconCart, IconPlus, IconMinus, IconTrash, IconX, IconChevronLeft, IconCash, IconQris, IconCard } from "@/components/Icons";

export default function CashierPage() {
  const {
    products, categories, cart, addToCart, removeFromCart,
    updateCartQuantity, clearCart, addOrder, tables,
    updateTableStatus, customers, updateCustomerPoints,
    taxRate, loyaltyPointsPerAmount,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "card">("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showVariations, setShowVariations] = useState<Product | null>(null);
  const [selectedVariations, setSelectedVariations] = useState<CartItem["selectedVariations"]>([]);

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === "Semua" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode?.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  // Broadcast cart changes to Customer Display (realtime sync)
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel("nexo-pos-display");

    // Send store info on connect
    channelRef.current.postMessage({
      type: "STORE_INFO",
      storeName: "Nexo POS",
      taxRate,
    });

    // Listen for data requests from customer display
    channelRef.current.onmessage = (event) => {
      if (event.data.type === "REQUEST_DATA") {
        channelRef.current?.postMessage({ type: "CART_UPDATE", cart });
      }
    };

    return () => { channelRef.current?.close(); };
  }, []);

  // Broadcast cart updates whenever cart changes
  useEffect(() => {
    if (channelRef.current) {
      channelRef.current.postMessage({ type: "CART_UPDATE", cart });
    }
    // Also save to localStorage for cross-tab fallback
    localStorage.setItem("nexo-display-cart", JSON.stringify(cart));
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  const handleProductClick = (product: Product) => {
    if (product.variations && product.variations.length > 0) {
      setShowVariations(product);
      setSelectedVariations(product.variations.map((v) => ({ variationId: v.id, optionId: v.options[0].id })));
    } else {
      addToCart(product);
    }
  };

  const handleAddWithVariations = () => {
    if (showVariations) {
      addToCart(showVariations, selectedVariations);
      setShowVariations(null);
      setSelectedVariations([]);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderNumber = String(Date.now()).slice(-6);
    const customer = customers.find((c) => c.phone === customerPhone);
    const pointsEarned = Math.floor(total / loyaltyPointsPerAmount);
    const order = {
      id: `order-${Date.now()}`, orderNumber, items: [...cart], total,
      status: "pending" as const, paymentMethod,
      tableNumber: selectedTable ? parseInt(selectedTable) : undefined,
      customerName: customer?.name, customerPhone: customerPhone || undefined,
      loyaltyPointsEarned: pointsEarned, loyaltyPointsUsed: 0, createdAt: new Date(),
    };
    addOrder(order);
    if (customer) updateCustomerPoints(customer.id, pointsEarned);
    if (selectedTable) {
      const table = tables.find((t) => t.number === parseInt(selectedTable));
      if (table) updateTableStatus(table.id, "occupied", order.id);
    }

    // Broadcast order to Customer Display
    channelRef.current?.postMessage({
      type: "ORDER_CREATED",
      order: { orderNumber, total, status: "pending" },
    });
    localStorage.setItem("nexo-display-order", JSON.stringify({ orderNumber, total, status: "pending", timestamp: Date.now() }));

    clearCart(); setShowPayment(false); setShowMobileCart(false);
    setCashAmount(""); setSelectedTable(""); setCustomerPhone("");
    alert(`Pesanan #${orderNumber} berhasil dibuat!`);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-surface-200">
      {/* Main - Products */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 bg-white border-b border-primary-100/60 flex items-center justify-between px-3 sm:px-5 flex-shrink-0">
          <Link href="/" className="btn-ghost text-sm py-2 px-2 sm:px-3 min-h-[44px]">
            <IconChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Kembali</span>
          </Link>
          <h1 className="text-base sm:text-lg font-semibold text-text">Kasir</h1>
          <div className="badge-success text-[10px] sm:text-xs">Aktif</div>
        </div>

        {/* Search & Filter */}
        <div className="p-3 sm:p-4 bg-white border-b border-primary-100/60 space-y-2 sm:space-y-3 flex-shrink-0">
          <div className="relative">
            <IconSearch className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari produk atau scan barcode..."
              className="input pl-9 sm:pl-10 text-[16px] sm:text-sm"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-all min-h-[36px] ${
                  selectedCategory === cat ? "bg-primary-200 text-primary-800" : "bg-surface-200 text-text-secondary hover:bg-primary-50"
                }`}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Product Grid - 2 cols on mobile, 3-4 on larger */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {filteredProducts.map((product) => (
              <button key={product.id} onClick={() => handleProductClick(product)}
                className="bento-card-hover !p-3 sm:!p-4 text-left group">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-primary-50 flex items-center justify-center text-lg sm:text-xl mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
                  {product.image}
                </div>
                <div className="font-medium text-xs sm:text-sm text-text leading-tight mb-1 line-clamp-2">{product.name}</div>
                <div className="font-semibold text-xs sm:text-sm text-primary-700">Rp {product.price.toLocaleString("id-ID")}</div>
                {product.variations && product.variations.length > 0 && (
                  <span className="badge-primary mt-1.5 text-[9px] sm:text-[10px]">+ Varian</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Cart Bar (fixed bottom) */}
        {cart.length > 0 && (
          <div className="lg:hidden flex-shrink-0 bg-white border-t border-primary-100/60 p-3 safe-bottom">
            <button onClick={() => setShowMobileCart(true)}
              className="btn-primary w-full py-3.5 text-sm justify-between">
              <div className="flex items-center gap-2">
                <IconCart className="w-4 h-4" />
                <span>{cartItemCount} item</span>
              </div>
              <span className="font-bold">Rp {total.toLocaleString("id-ID")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop Cart Panel - hidden on mobile */}
      <div className="hidden lg:flex w-[370px] flex-col bg-white border-l border-primary-100/60">
        <div className="p-4 border-b border-primary-100/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconCart className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-text">Keranjang</h2>
            </div>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs font-medium text-danger hover:underline">Hapus Semua</button>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5">{cart.length} item</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-surface-200 flex items-center justify-center">
                <IconCart className="w-7 h-7 text-text-muted" />
              </div>
              <p className="font-medium text-text-secondary text-sm">Keranjang kosong</p>
              <p className="text-xs text-text-muted mt-0.5">Pilih produk untuk memulai</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItemCard key={item.id} item={item} onRemove={removeFromCart} onUpdateQty={updateCartQuantity} />
            ))
          )}
        </div>
        <CartFooter subtotal={subtotal} tax={tax} taxRate={taxRate} total={total} cartEmpty={cart.length === 0} onPay={() => setShowPayment(true)} />
      </div>

      {/* Mobile Cart Drawer */}
      {showMobileCart && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileCart(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col safe-bottom">
            <div className="p-4 border-b border-primary-100/60 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <IconCart className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-text">Keranjang ({cartItemCount})</h2>
              </div>
              <button onClick={() => setShowMobileCart(false)} className="p-2 rounded-lg hover:bg-primary-50 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <IconX className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.map((item) => (
                <CartItemCard key={item.id} item={item} onRemove={removeFromCart} onUpdateQty={updateCartQuantity} />
              ))}
            </div>
            <CartFooter subtotal={subtotal} tax={tax} taxRate={taxRate} total={total} cartEmpty={cart.length === 0} onPay={() => { setShowMobileCart(false); setShowPayment(true); }} />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="bento-card-lg w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl !p-4 sm:!p-6 safe-bottom">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-text">Pembayaran</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 rounded-lg hover:bg-surface-200 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <IconX className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center p-4 sm:p-5 rounded-xl bg-primary-50 border border-primary-100">
                <p className="text-xs sm:text-sm text-text-secondary">Total Bayar</p>
                <p className="text-xl sm:text-2xl font-bold text-primary-800 mt-1">Rp {total.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: "cash", label: "Tunai", Icon: IconCash }, { value: "qris", label: "QRIS", Icon: IconQris }, { value: "card", label: "Kartu", Icon: IconCard }].map((m) => (
                    <button key={m.value} onClick={() => setPaymentMethod(m.value as typeof paymentMethod)}
                      className={`p-3 rounded-lg border text-center transition-all min-h-[60px] ${
                        paymentMethod === m.value ? "border-primary-300 bg-primary-50" : "border-primary-100 hover:bg-surface-200"
                      }`}>
                      <m.Icon className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === m.value ? "text-primary-700" : "text-text-muted"}`} />
                      <span className={`text-[11px] sm:text-xs font-medium ${paymentMethod === m.value ? "text-primary-800" : "text-text-secondary"}`}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {paymentMethod === "cash" && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-2">Jumlah Uang</label>
                  <input type="number" className="input text-[16px]" placeholder="Masukkan jumlah..." value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} />
                  {cashAmount && parseInt(cashAmount) >= total && (
                    <div className="mt-2 p-3 rounded-lg bg-green-50 border border-green-100">
                      <span className="text-xs sm:text-sm font-medium text-success">Kembalian: Rp {(parseInt(cashAmount) - total).toLocaleString("id-ID")}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[50000, 100000, 200000].map((a) => (
                      <button key={a} onClick={() => setCashAmount(String(a))}
                        className="p-2 rounded-md border border-primary-100 text-xs font-medium text-text-secondary hover:bg-primary-50 min-h-[40px]">{(a/1000)}K</button>
                    ))}
                  </div>
                </div>
              )}
              {paymentMethod === "qris" && (
                <div className="text-center p-4 rounded-lg border border-primary-100 bg-surface-50">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto bg-white rounded-lg border border-primary-100 flex items-center justify-center mb-3">
                    <IconQris className="w-12 h-12 sm:w-14 sm:h-14 text-text-muted" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-text-secondary">Scan QRIS untuk bayar</p>
                </div>
              )}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-2">Nomor Meja</label>
                <select className="input text-[16px]" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                  <option value="">Tanpa Meja / Takeaway</option>
                  {tables.filter((t) => t.status === "available").map((t) => (
                    <option key={t.id} value={t.number}>Meja {t.number} ({t.seats} kursi)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-2">No. HP Pelanggan</label>
                <input type="tel" className="input text-[16px]" placeholder="08xxxxxxxxxx" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
              <button onClick={handleCheckout} className="btn-success w-full py-3.5 min-h-[48px]">Konfirmasi Pembayaran</button>
            </div>
          </div>
        </div>
      )}

      {/* Variation Modal */}
      {showVariations && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="bento-card-lg w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl !p-4 sm:!p-6 safe-bottom">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-text">Pilih Varian</h2>
              <button onClick={() => setShowVariations(null)} className="p-2 rounded-lg hover:bg-surface-200 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <IconX className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <p className="font-medium text-sm text-text">{showVariations.name}</p>
            <p className="text-xs text-text-muted mb-4">Rp {showVariations.price.toLocaleString("id-ID")}</p>
            <div className="space-y-4">
              {showVariations.variations?.map((variation) => (
                <div key={variation.id}>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-2">{variation.name}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {variation.options.map((option) => {
                      const isSelected = selectedVariations?.find((v) => v.variationId === variation.id)?.optionId === option.id;
                      return (
                        <button key={option.id}
                          onClick={() => setSelectedVariations((prev) => prev?.map((v) => v.variationId === variation.id ? { ...v, optionId: option.id } : v))}
                          className={`p-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
                            isSelected ? "border-primary-300 bg-primary-50 text-primary-800" : "border-primary-100 text-text-secondary hover:bg-surface-200"
                          }`}>
                          {option.label}
                          {option.priceAdjustment > 0 && (
                            <span className="block text-[10px] sm:text-[11px] text-primary-600 mt-0.5">+Rp {option.priceAdjustment.toLocaleString("id-ID")}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleAddWithVariations} className="btn-primary w-full py-3.5 mt-4 min-h-[48px]">Tambahkan ke Keranjang</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable Cart Item Card */
function CartItemCard({ item, onRemove, onUpdateQty }: { item: CartItem; onRemove: (id: string) => void; onUpdateQty: (id: string, qty: number) => void }) {
  return (
    <div className="p-3 rounded-lg bg-surface-50 border border-primary-100/40 group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-xs sm:text-sm text-text truncate">{item.product.name}</div>
          {item.selectedVariations && item.selectedVariations.length > 0 && (
            <div className="text-[10px] sm:text-xs text-primary-600 mt-0.5">
              {item.selectedVariations.map((v) => {
                const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                return variation?.options.find((o) => o.id === v.optionId)?.label;
              }).join(", ")}
            </div>
          )}
        </div>
        <button onClick={() => onRemove(item.id)}
          className="p-1.5 rounded-lg hover:bg-red-50 transition-all min-w-[32px] min-h-[32px] flex items-center justify-center">
          <IconTrash className="w-3.5 h-3.5 text-danger" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button onClick={() => onUpdateQty(item.id, item.quantity - 1)}
            className="w-8 h-8 rounded-md bg-white border border-primary-100 flex items-center justify-center hover:bg-primary-50 transition-colors">
            <IconMinus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
          <button onClick={() => onUpdateQty(item.id, item.quantity + 1)}
            className="w-8 h-8 rounded-md bg-white border border-primary-100 flex items-center justify-center hover:bg-primary-50 transition-colors">
            <IconPlus className="w-3 h-3" />
          </button>
        </div>
        <span className="font-semibold text-xs sm:text-sm text-text">Rp {item.subtotal.toLocaleString("id-ID")}</span>
      </div>
    </div>
  );
}

/* Reusable Cart Footer */
function CartFooter({ subtotal, tax, taxRate, total, cartEmpty, onPay }: {
  subtotal: number; tax: number; taxRate: number; total: number; cartEmpty: boolean; onPay: () => void;
}) {
  return (
    <div className="border-t border-primary-100/60 p-3 sm:p-4 space-y-2 sm:space-y-3 flex-shrink-0">
      <div className="flex justify-between text-xs sm:text-sm text-text-secondary">
        <span>Subtotal</span><span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
      </div>
      <div className="flex justify-between text-xs sm:text-sm text-text-secondary">
        <span>Pajak ({(taxRate * 100).toFixed(0)}%)</span><span className="font-medium">Rp {tax.toLocaleString("id-ID")}</span>
      </div>
      <div className="flex justify-between pt-2 border-t border-primary-100/40">
        <span className="font-semibold text-sm text-text">Total</span>
        <span className="font-bold text-base sm:text-lg text-primary-700">Rp {total.toLocaleString("id-ID")}</span>
      </div>
      <button onClick={onPay} disabled={cartEmpty}
        className="btn-primary w-full py-3.5 min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed">Bayar Sekarang</button>
    </div>
  );
}
