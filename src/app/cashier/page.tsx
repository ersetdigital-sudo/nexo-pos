"use client";

import { useState } from "react";
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
    clearCart(); setShowPayment(false); setCashAmount(""); setSelectedTable(""); setCustomerPhone("");
    alert(`Pesanan #${orderNumber} berhasil dibuat!`);
  };

  return (
    <div className="flex h-screen bg-surface-200">
      {/* Left - Products */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 bg-white border-b border-primary-100/60 flex items-center justify-between px-5">
          <Link href="/" className="btn-ghost text-sm py-2 px-3"><IconChevronLeft className="w-4 h-4" /> Kembali</Link>
          <h1 className="text-lg font-semibold text-text">Kasir</h1>
          <div className="badge-success">Aktif</div>
        </div>

        <div className="p-4 bg-white border-b border-primary-100/60 space-y-3">
          <div className="relative">
            <IconSearch className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari produk atau scan barcode..." className="input pl-10"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  selectedCategory === cat ? "bg-primary-200 text-primary-800" : "bg-surface-200 text-text-secondary hover:bg-primary-50"
                }`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <button key={product.id} onClick={() => handleProductClick(product)}
                className="bento-card-hover text-left group">
                <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
                  {product.image}
                </div>
                <div className="font-medium text-sm text-text leading-tight mb-1">{product.name}</div>
                <div className="font-semibold text-sm text-primary-700">Rp {product.price.toLocaleString("id-ID")}</div>
                {product.variations && product.variations.length > 0 && (
                  <span className="badge-primary mt-2 text-[10px]">+ Varian</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Cart */}
      <div className="w-[370px] flex flex-col bg-white border-l border-primary-100/60">
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
              <p className="font-medium text-text-secondary">Keranjang kosong</p>
              <p className="text-sm text-text-muted mt-0.5">Pilih produk untuk memulai</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-surface-50 border border-primary-100/40 group animate-fade-in">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-text truncate">{item.product.name}</div>
                    {item.selectedVariations && item.selectedVariations.length > 0 && (
                      <div className="text-xs text-primary-600 mt-0.5">
                        {item.selectedVariations.map((v) => {
                          const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                          return variation?.options.find((o) => o.id === v.optionId)?.label;
                        }).join(", ")}
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeFromCart(item.id)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all">
                    <IconTrash className="w-3.5 h-3.5 text-danger" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-md bg-white border border-primary-100 flex items-center justify-center hover:bg-primary-50 transition-colors">
                      <IconMinus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-medium text-sm">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-md bg-white border border-primary-100 flex items-center justify-center hover:bg-primary-50 transition-colors">
                      <IconPlus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-sm text-text">Rp {item.subtotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-primary-100/60 p-4 space-y-3">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Subtotal</span><span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Pajak ({(taxRate * 100).toFixed(0)}%)</span><span className="font-medium">Rp {tax.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-primary-100/40">
            <span className="font-semibold text-text">Total</span>
            <span className="font-bold text-lg text-primary-700">Rp {total.toLocaleString("id-ID")}</span>
          </div>
          <button onClick={() => setShowPayment(true)} disabled={cart.length === 0}
            className="btn-primary w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed">Bayar Sekarang</button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bento-card-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-text">Pembayaran</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 rounded-lg hover:bg-surface-200"><IconX className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div className="text-center p-5 rounded-xl bg-primary-50 border border-primary-100">
                <p className="text-sm text-text-secondary">Total Bayar</p>
                <p className="text-2xl font-bold text-primary-800 mt-1">Rp {total.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: "cash", label: "Tunai", Icon: IconCash }, { value: "qris", label: "QRIS", Icon: IconQris }, { value: "card", label: "Kartu", Icon: IconCard }].map((m) => (
                    <button key={m.value} onClick={() => setPaymentMethod(m.value as typeof paymentMethod)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        paymentMethod === m.value ? "border-primary-300 bg-primary-50" : "border-primary-100 hover:bg-surface-200"
                      }`}>
                      <m.Icon className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === m.value ? "text-primary-700" : "text-text-muted"}`} />
                      <span className={`text-xs font-medium ${paymentMethod === m.value ? "text-primary-800" : "text-text-secondary"}`}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {paymentMethod === "cash" && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Jumlah Uang</label>
                  <input type="number" className="input" placeholder="Masukkan jumlah..." value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} />
                  {cashAmount && parseInt(cashAmount) >= total && (
                    <div className="mt-2 p-3 rounded-lg bg-green-50 border border-green-100">
                      <span className="text-sm font-medium text-success">Kembalian: Rp {(parseInt(cashAmount) - total).toLocaleString("id-ID")}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[50000, 100000, 150000, 200000, 250000, 500000].map((a) => (
                      <button key={a} onClick={() => setCashAmount(String(a))}
                        className="p-2 rounded-md border border-primary-100 text-xs font-medium text-text-secondary hover:bg-primary-50">{(a/1000)}K</button>
                    ))}
                  </div>
                </div>
              )}
              {paymentMethod === "qris" && (
                <div className="text-center p-6 rounded-lg border border-primary-100 bg-surface-50">
                  <div className="w-36 h-36 mx-auto bg-white rounded-lg border border-primary-100 flex items-center justify-center mb-3">
                    <IconQris className="w-14 h-14 text-text-muted" />
                  </div>
                  <p className="text-sm font-medium text-text-secondary">Scan QRIS untuk bayar</p>
                  <p className="text-xs text-text-muted mt-1">Semua e-wallet & m-banking</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nomor Meja</label>
                <select className="input" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                  <option value="">Tanpa Meja / Takeaway</option>
                  {tables.filter((t) => t.status === "available").map((t) => (
                    <option key={t.id} value={t.number}>Meja {t.number} ({t.seats} kursi)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">No. HP Pelanggan</label>
                <input type="tel" className="input" placeholder="08xxxxxxxxxx" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
              <button onClick={handleCheckout} className="btn-success w-full py-3">Konfirmasi Pembayaran</button>
            </div>
          </div>
        </div>
      )}

      {/* Variation Modal */}
      {showVariations && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bento-card-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-text">Pilih Varian</h2>
              <button onClick={() => setShowVariations(null)} className="p-2 rounded-lg hover:bg-surface-200"><IconX className="w-5 h-5 text-text-muted" /></button>
            </div>
            <p className="font-medium text-text">{showVariations.name}</p>
            <p className="text-sm text-text-muted mb-4">Rp {showVariations.price.toLocaleString("id-ID")}</p>
            <div className="space-y-4">
              {showVariations.variations?.map((variation) => (
                <div key={variation.id}>
                  <label className="block text-sm font-medium text-text-secondary mb-2">{variation.name}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {variation.options.map((option) => {
                      const isSelected = selectedVariations?.find((v) => v.variationId === variation.id)?.optionId === option.id;
                      return (
                        <button key={option.id}
                          onClick={() => setSelectedVariations((prev) => prev?.map((v) => v.variationId === variation.id ? { ...v, optionId: option.id } : v))}
                          className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                            isSelected ? "border-primary-300 bg-primary-50 text-primary-800" : "border-primary-100 text-text-secondary hover:bg-surface-200"
                          }`}>
                          {option.label}
                          {option.priceAdjustment > 0 && (
                            <span className="block text-[11px] text-primary-600 mt-0.5">+Rp {option.priceAdjustment.toLocaleString("id-ID")}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleAddWithVariations} className="btn-primary w-full py-3 mt-5">Tambahkan ke Keranjang</button>
          </div>
        </div>
      )}
    </div>
  );
}
