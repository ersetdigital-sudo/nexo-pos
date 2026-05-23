"use client";

import { useState } from "react";
import { useStore, Product, CartItem } from "@/store";

export default function SelfOrderPage() {
  const { products, categories, addOrder, storeName } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const filteredProducts = products.filter(
    (p) => selectedCategory === "Semua" || p.category === selectedCategory
  );

  const addToLocalCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: `self-${Date.now()}`,
          product,
          quantity: 1,
          subtotal: product.price,
        },
      ]);
    }
  };

  const removeFromLocalCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const num = String(Date.now()).slice(-6);
    const order = {
      id: `self-order-${Date.now()}`,
      orderNumber: num,
      items: cart,
      total,
      status: "pending" as const,
      paymentMethod: "qris" as const,
      tableNumber: tableNumber ? parseInt(tableNumber) : undefined,
      customerName: customerName || "Self Order",
      loyaltyPointsEarned: 0,
      loyaltyPointsUsed: 0,
      createdAt: new Date(),
    };

    addOrder(order);
    setOrderNumber(num);
    setOrderPlaced(true);
    setCart([]);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="card-brutal bg-white text-center max-w-md w-full p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-black mb-2">Pesanan Diterima!</h1>
          <div className="text-5xl font-black text-secondary my-4">#{orderNumber}</div>
          <p className="text-gray-500 mb-6">
            Pesanan Anda sedang diproses. Silakan tunggu nomor antrian Anda dipanggil.
          </p>
          <button
            onClick={() => {
              setOrderPlaced(false);
              setCustomerName("");
              setTableNumber("");
            }}
            className="btn-brutal-primary py-3 px-8"
          >
            🔄 Order Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary border-b-4 border-text p-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">{storeName}</h1>
            <p className="text-sm font-semibold opacity-75">📱 Self Order</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="btn-brutal bg-white relative"
          >
            🛒 ({cart.length})
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-[72px] z-20 bg-white border-b-2 border-text p-3 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-bold border-2 border-text whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-primary shadow-brutal-sm"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card-brutal flex gap-3">
              <div className="text-4xl">{product.image}</div>
              <div className="flex-1">
                <h3 className="font-bold">{product.name}</h3>
                <div className="font-black text-secondary">
                  Rp {product.price.toLocaleString("id-ID")}
                </div>
                <button
                  onClick={() => addToLocalCart(product)}
                  className="btn-brutal-primary text-xs py-1 px-3 mt-2"
                >
                  + Tambah
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-text p-4 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <div className="font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)} item</div>
              <div className="font-black text-lg text-secondary">
                Rp {total.toLocaleString("id-ID")}
              </div>
            </div>
            <button onClick={() => setShowCart(true)} className="btn-brutal-success py-3 px-6">
              Lihat Pesanan →
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="card-brutal bg-white w-full max-w-md max-h-[90vh] overflow-y-auto sm:rounded-none">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">🛒 Pesanan Anda</h2>
              <button onClick={() => setShowCart(false)} className="text-2xl font-bold">×</button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🛒</div>
                <p>Keranjang kosong</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.product.image}</span>
                        <div>
                          <div className="font-bold text-sm">{item.product.name}</div>
                          <div className="text-sm text-gray-500">x{item.quantity}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Rp {item.subtotal.toLocaleString("id-ID")}</span>
                        <button
                          onClick={() => removeFromLocalCart(item.id)}
                          className="text-danger font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-4">
                  <input
                    className="input-brutal"
                    placeholder="Nama Anda"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <input
                    className="input-brutal"
                    placeholder="Nomor Meja (opsional)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>

                <div className="border-t-2 border-text pt-3 mb-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-black text-secondary">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <button onClick={handlePlaceOrder} className="btn-brutal-success w-full py-3 text-lg">
                  ✅ Pesan Sekarang
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
