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
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode?.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;


  const handleProductClick = (product: Product) => {
    if (product.variations && product.variations.length > 0) {
      setShowVariations(product);
      setSelectedVariations(
        product.variations.map((v) => ({ variationId: v.id, optionId: v.options[0].id }))
      );
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
      id: `order-${Date.now()}`,
      orderNumber,
      items: [...cart],
      total,
      status: "pending" as const,
      paymentMethod,
      tableNumber: selectedTable ? parseInt(selectedTable) : undefined,
      customerName: customer?.name,
      customerPhone: customerPhone || undefined,
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsUsed: 0,
      createdAt: new Date(),
    };

    addOrder(order);
    if (customer) updateCustomerPoints(customer.id, pointsEarned);
    if (selectedTable) {
      const table = tables.find((t) => t.number === parseInt(selectedTable));
      if (table) updateTableStatus(table.id, "occupied", order.id);
    }

    clearCart();
    setShowPayment(false);
    setCashAmount("");
    setSelectedTable("");
    setCustomerPhone("");
    alert(`Pesanan #${orderNumber} berhasil dibuat!`);
  };


  return (
    <div className="flex h-screen bg-dark-50">
      {/* Left - Products */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-dark-100 flex items-center justify-between px-5">
          <Link href="/" className="btn-ghost text-sm py-2 px-3">
            <IconChevronLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="text-lg font-bold text-dark-800">Kasir</h1>
          <div className="badge-success">Aktif</div>
        </div>

        {/* Search & Filter */}
        <div className="p-4 bg-white border-b border-dark-100 space-y-3">
          <div className="relative">
            <IconSearch className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari produk atau scan barcode..."
              className="input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-primary-600 text-white shadow-soft"
                    : "bg-dark-100 text-dark-600 hover:bg-dark-200"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <button key={product.id} onClick={() => handleProductClick(product)}
                className="card-hover p-4 text-left group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  {product.image}
                </div>
                <div className="font-semibold text-sm text-dark-800 leading-tight mb-1">{product.name}</div>
                <div className="font-bold text-primary-600 text-sm">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>
                {product.variations && product.variations.length > 0 && (
                  <span className="badge-primary mt-2 text-[10px]">+ Varian</span>
                )}
                <div className="text-[11px] text-dark-400 mt-1">Stok: {product.stock}</div>
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Right - Cart */}
      <div className="w-[380px] flex flex-col bg-white border-l border-dark-100">
        <div className="p-4 border-b border-dark-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconCart className="w-5 h-5 text-primary-600" />
              <h2 className="font-bold text-dark-800">Keranjang</h2>
            </div>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors">
                Hapus Semua
              </button>
            )}
          </div>
          <p className="text-xs text-dark-400 mt-0.5">{cart.length} item</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-dark-50 flex items-center justify-center">
                <IconCart className="w-7 h-7 text-dark-300" />
              </div>
              <p className="font-medium text-dark-400">Keranjang kosong</p>
              <p className="text-sm text-dark-300 mt-0.5">Pilih produk untuk memulai</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-dark-50 group animate-fade-in">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-dark-800 truncate">{item.product.name}</div>
                    {item.selectedVariations && item.selectedVariations.length > 0 && (
                      <div className="text-xs text-primary-600 mt-0.5">
                        {item.selectedVariations.map((v) => {
                          const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                          const option = variation?.options.find((o) => o.id === v.optionId);
                          return option?.label;
                        }).join(", ")}
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeFromCart(item.id)}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all">
                    <IconTrash className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-dark-200 flex items-center justify-center hover:bg-dark-100 transition-colors">
                      <IconMinus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-semibold text-sm">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-dark-200 flex items-center justify-center hover:bg-dark-100 transition-colors">
                      <IconPlus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-sm text-dark-800">
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>


        {/* Cart Footer */}
        <div className="border-t border-dark-100 p-4 space-y-3">
          <div className="flex justify-between text-sm text-dark-500">
            <span>Subtotal</span>
            <span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm text-dark-500">
            <span>Pajak ({(taxRate * 100).toFixed(0)}%)</span>
            <span className="font-medium">Rp {tax.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-dark-100">
            <span className="font-bold text-dark-800">Total</span>
            <span className="font-bold text-lg text-primary-600">Rp {total.toLocaleString("id-ID")}</span>
          </div>
          <button onClick={() => setShowPayment(true)} disabled={cart.length === 0}
            className="btn-primary w-full py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            Bayar Sekarang
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-dark-800">Pembayaran</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 rounded-lg hover:bg-dark-50">
                <IconX className="w-5 h-5 text-dark-400" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Total */}
              <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                <p className="text-sm opacity-80">Total Bayar</p>
                <p className="text-3xl font-bold mt-1">Rp {total.toLocaleString("id-ID")}</p>
              </div>

              {/* Method */}
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "cash", label: "Tunai", Icon: IconCash },
                    { value: "qris", label: "QRIS", Icon: IconQris },
                    { value: "card", label: "Kartu", Icon: IconCard },
                  ].map((m) => (
                    <button key={m.value} onClick={() => setPaymentMethod(m.value as typeof paymentMethod)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === m.value
                          ? "border-primary-400 bg-primary-50 shadow-soft"
                          : "border-dark-200 hover:border-dark-300"
                      }`}>
                      <m.Icon className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === m.value ? "text-primary-600" : "text-dark-400"}`} />
                      <span className={`text-xs font-medium ${paymentMethod === m.value ? "text-primary-700" : "text-dark-500"}`}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>


              {/* Cash Amount */}
              {paymentMethod === "cash" && (
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Jumlah Uang</label>
                  <input type="number" className="input" placeholder="Masukkan jumlah..."
                    value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} />
                  {cashAmount && parseInt(cashAmount) >= total && (
                    <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-sm font-semibold text-emerald-700">
                        Kembalian: Rp {(parseInt(cashAmount) - total).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[50000, 100000, 150000, 200000, 250000, 500000].map((a) => (
                      <button key={a} onClick={() => setCashAmount(String(a))}
                        className="p-2 rounded-lg border border-dark-200 text-xs font-medium text-dark-600 hover:bg-dark-50 transition-colors">
                        {(a / 1000)}K
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QRIS */}
              {paymentMethod === "qris" && (
                <div className="text-center p-6 rounded-xl border border-dark-200">
                  <div className="w-40 h-40 mx-auto bg-dark-50 rounded-xl flex items-center justify-center mb-3">
                    <IconQris className="w-16 h-16 text-dark-300" />
                  </div>
                  <p className="text-sm font-medium text-dark-600">Scan QRIS untuk bayar</p>
                  <p className="text-xs text-dark-400 mt-1">Semua e-wallet & m-banking</p>
                </div>
              )}

              {/* Table & Customer */}
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Nomor Meja</label>
                <select className="input" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                  <option value="">Tanpa Meja / Takeaway</option>
                  {tables.filter((t) => t.status === "available").map((t) => (
                    <option key={t.id} value={t.number}>Meja {t.number} ({t.seats} kursi)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">No. HP Pelanggan</label>
                <input type="tel" className="input" placeholder="08xxxxxxxxxx"
                  value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                <p className="text-xs text-dark-400 mt-1">Untuk struk WA & loyalty points</p>
              </div>

              <button onClick={handleCheckout} className="btn-success w-full py-3">
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Variation Modal */}
      {showVariations && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-dark-800">Pilih Varian</h2>
              <button onClick={() => setShowVariations(null)} className="p-2 rounded-lg hover:bg-dark-50">
                <IconX className="w-5 h-5 text-dark-400" />
              </button>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-dark-800">{showVariations.name}</p>
              <p className="text-sm text-dark-400">Rp {showVariations.price.toLocaleString("id-ID")}</p>
            </div>

            <div className="space-y-4">
              {showVariations.variations?.map((variation) => (
                <div key={variation.id}>
                  <label className="block text-sm font-medium text-dark-600 mb-2">{variation.name}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {variation.options.map((option) => {
                      const isSelected = selectedVariations?.find(
                        (v) => v.variationId === variation.id
                      )?.optionId === option.id;
                      return (
                        <button key={option.id}
                          onClick={() => {
                            setSelectedVariations((prev) =>
                              prev?.map((v) => v.variationId === variation.id ? { ...v, optionId: option.id } : v)
                            );
                          }}
                          className={`p-2.5 rounded-xl border text-sm font-medium transition-all ${
                            isSelected
                              ? "border-primary-400 bg-primary-50 text-primary-700"
                              : "border-dark-200 text-dark-600 hover:border-dark-300"
                          }`}>
                          {option.label}
                          {option.priceAdjustment > 0 && (
                            <span className="block text-[11px] text-primary-500 mt-0.5">
                              +Rp {option.priceAdjustment.toLocaleString("id-ID")}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleAddWithVariations} className="btn-primary w-full py-3 mt-5">
              Tambahkan ke Keranjang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
