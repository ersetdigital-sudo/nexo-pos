"use client";

import { useState } from "react";
import { useStore, Product, CartItem } from "@/store";
import Link from "next/link";

export default function CashierPage() {
  const {
    products,
    categories,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addOrder,
    tables,
    updateTableStatus,
    customers,
    updateCustomerPoints,
    taxRate,
    loyaltyPointsPerAmount,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "card">("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [selectedTable, setSelectedTable] = useState<string>("");
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

    if (customer) {
      updateCustomerPoints(customer.id, pointsEarned);
    }

    if (selectedTable) {
      const table = tables.find((t) => t.number === parseInt(selectedTable));
      if (table) {
        updateTableStatus(table.id, "occupied", order.id);
      }
    }

    clearCart();
    setShowPayment(false);
    setCashAmount("");
    setSelectedTable("");
    setCustomerPhone("");
    alert(`✅ Pesanan #${orderNumber} berhasil dibuat!`);
  };

  return (
    <div className="flex h-screen">
      {/* Left - Products */}
      <div className="flex-1 flex flex-col border-r-2 border-text">
        {/* Header */}
        <div className="h-14 bg-white border-b-2 border-text flex items-center justify-between px-4">
          <Link href="/" className="btn-brutal-primary text-sm py-1 px-3">
            ← Kembali
          </Link>
          <h1 className="text-lg font-black">💰 KASIR</h1>
          <div className="badge-brutal bg-success text-white">Siap</div>
        </div>

        {/* Search & Categories */}
        <div className="p-4 bg-white border-b-2 border-text space-y-3">
          <input
            type="text"
            placeholder="🔍 Cari produk atau scan barcode..."
            className="input-brutal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-sm font-bold border-2 border-text transition-all ${
                  selectedCategory === cat
                    ? "bg-primary shadow-brutal-sm"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="card-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-left"
              >
                <div className="text-3xl mb-2">{product.image}</div>
                <div className="font-bold text-sm leading-tight mb-1">{product.name}</div>
                <div className="font-black text-primary">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>
                {product.variations && product.variations.length > 0 && (
                  <div className="mt-1 text-xs text-secondary font-semibold">+ Varian</div>
                )}
                <div className="text-xs text-gray-400 mt-1">Stok: {product.stock}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Cart */}
      <div className="w-96 flex flex-col bg-white">
        <div className="p-4 border-b-2 border-text bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-lg">🛒 Keranjang</h2>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs text-danger font-bold hover:underline">
                Hapus Semua
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500 font-medium">{cart.length} item</div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-semibold">Keranjang kosong</p>
              <p className="text-sm">Pilih produk untuk memulai</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="border-2 border-gray-200 p-3 hover:border-text transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-sm">{item.product.name}</div>
                    {item.selectedVariations && item.selectedVariations.length > 0 && (
                      <div className="text-xs text-secondary mt-0.5">
                        {item.selectedVariations.map((v) => {
                          const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                          const option = variation?.options.find((o) => o.id === v.optionId);
                          return option?.label;
                        }).join(", ")}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-danger font-bold text-lg leading-none hover:scale-110"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 border-2 border-text font-bold flex items-center justify-center hover:bg-primary"
                    >
                      -
                    </button>
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 border-2 border-text font-bold flex items-center justify-center hover:bg-primary"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-black">
                    Rp {(item.subtotal * item.quantity / (item.quantity || 1)).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        <div className="border-t-2 border-text p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-bold">Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Pajak ({(taxRate * 100).toFixed(0)}%)</span>
            <span className="font-bold">Rp {tax.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-lg border-t-2 border-text pt-2">
            <span className="font-bold">TOTAL</span>
            <span className="font-black text-secondary">Rp {total.toLocaleString("id-ID")}</span>
          </div>
          <button
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className="btn-brutal-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💳 Bayar Sekarang
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-brutal bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">💳 Pembayaran</h2>
              <button onClick={() => setShowPayment(false)} className="text-2xl font-bold hover:text-danger">×</button>
            </div>

            <div className="space-y-4">
              {/* Total */}
              <div className="text-center p-4 bg-primary border-2 border-text">
                <div className="text-sm font-semibold">Total Bayar</div>
                <div className="text-3xl font-black">Rp {total.toLocaleString("id-ID")}</div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-bold mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "cash", label: "💵 Tunai" },
                    { value: "qris", label: "📱 QRIS" },
                    { value: "card", label: "💳 Kartu" },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value as typeof paymentMethod)}
                      className={`p-3 border-2 border-text font-bold text-sm transition-all ${
                        paymentMethod === method.value
                          ? "bg-primary shadow-brutal-sm"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash Amount */}
              {paymentMethod === "cash" && (
                <div>
                  <label className="block text-sm font-bold mb-2">Jumlah Uang</label>
                  <input
                    type="number"
                    className="input-brutal"
                    placeholder="Masukkan jumlah..."
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                  />
                  {cashAmount && parseInt(cashAmount) >= total && (
                    <div className="mt-2 p-2 bg-success/10 border-2 border-success text-success font-bold text-sm">
                      Kembalian: Rp {(parseInt(cashAmount) - total).toLocaleString("id-ID")}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[50000, 100000, 150000, 200000, 250000, 500000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCashAmount(String(amount))}
                        className="p-2 border-2 border-text text-xs font-bold hover:bg-primary transition-all"
                      >
                        {(amount / 1000)}K
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QRIS Display */}
              {paymentMethod === "qris" && (
                <div className="text-center p-6 border-2 border-text">
                  <div className="text-6xl mb-3">📱</div>
                  <p className="font-bold">Scan QRIS di bawah</p>
                  <div className="w-48 h-48 mx-auto my-4 bg-gray-100 border-2 border-text flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl">🔲</div>
                      <p className="text-xs text-gray-500 mt-1">QR Code</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Mendukung semua e-wallet & m-banking</p>
                </div>
              )}

              {/* Table Selection */}
              <div>
                <label className="block text-sm font-bold mb-2">Nomor Meja (opsional)</label>
                <select
                  className="input-brutal"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                >
                  <option value="">Tanpa Meja / Takeaway</option>
                  {tables.filter((t) => t.status === "available").map((t) => (
                    <option key={t.id} value={t.number}>
                      Meja {t.number} ({t.seats} kursi)
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-sm font-bold mb-2">No. HP Pelanggan (opsional)</label>
                <input
                  type="tel"
                  className="input-brutal"
                  placeholder="08xxxxxxxxxx"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">Untuk struk WhatsApp & loyalty points</p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="btn-brutal-success w-full py-3 text-lg"
              >
                ✅ Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variation Modal */}
      {showVariations && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-brutal bg-white w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black">🎨 Pilih Varian</h2>
              <button onClick={() => setShowVariations(null)} className="text-2xl font-bold hover:text-danger">×</button>
            </div>

            <div className="mb-3">
              <div className="font-bold">{showVariations.name}</div>
              <div className="text-sm text-gray-500">Rp {showVariations.price.toLocaleString("id-ID")}</div>
            </div>

            <div className="space-y-4">
              {showVariations.variations?.map((variation) => (
                <div key={variation.id}>
                  <label className="block text-sm font-bold mb-2">{variation.name}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {variation.options.map((option) => {
                      const isSelected = selectedVariations?.find(
                        (v) => v.variationId === variation.id
                      )?.optionId === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSelectedVariations((prev) =>
                              prev?.map((v) =>
                                v.variationId === variation.id ? { ...v, optionId: option.id } : v
                              )
                            );
                          }}
                          className={`p-2 border-2 border-text text-sm font-bold transition-all ${
                            isSelected ? "bg-primary shadow-brutal-sm" : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          {option.label}
                          {option.priceAdjustment > 0 && (
                            <span className="block text-xs text-secondary">
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

            <button
              onClick={handleAddWithVariations}
              className="btn-brutal-primary w-full py-3 mt-4"
            >
              Tambahkan ke Keranjang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
