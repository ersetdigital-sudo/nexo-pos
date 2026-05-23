"use client";

import { useState } from "react";
import { useStore, Product, CartItem } from "@/store";
import { IconCart, IconPlus, IconX, IconCheck } from "@/components/Icons";

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
      setCart(cart.map((item) => item.id === existing.id
        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price } : item));
    } else {
      setCart([...cart, { id: `self-${Date.now()}`, product, quantity: 1, subtotal: product.price }]);
    }
  };

  const removeFromLocalCart = (itemId: string) => setCart(cart.filter((item) => item.id !== itemId));
  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const num = String(Date.now()).slice(-6);
    addOrder({
      id: `self-order-${Date.now()}`, orderNumber: num, items: cart, total,
      status: "pending", paymentMethod: "qris",
      tableNumber: tableNumber ? parseInt(tableNumber) : undefined,
      customerName: customerName || "Self Order",
      loyaltyPointsEarned: 0, loyaltyPointsUsed: 0, createdAt: new Date(),
    });
    setOrderNumber(num); setOrderPlaced(true); setCart([]);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center p-6">
        <div className="card text-center max-w-md w-full p-8 animate-slide-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <IconCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-dark-800 mb-2">Pesanan Diterima!</h1>
          <div className="text-4xl font-bold text-primary-600 my-4">#{orderNumber}</div>
          <p className="text-dark-400 mb-6">Pesanan Anda sedang diproses. Tunggu nomor antrian dipanggil.</p>
          <button onClick={() => { setOrderPlaced(false); setCustomerName(""); setTableNumber(""); }}
            className="btn-primary py-3 px-8">Order Lagi</button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-dark-50">
      {/* Header */}
      <div className="bg-white border-b border-dark-100 p-4 sticky top-0 z-30 shadow-soft">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-dark-800">{storeName}</h1>
            <p className="text-xs text-dark-400 font-medium">Self Order</p>
          </div>
          <button onClick={() => setShowCart(true)} className="btn-outline relative py-2">
            <IconCart className="w-4 h-4" />
            <span className="ml-1">({cart.length})</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-[65px] z-20 bg-white/80 backdrop-blur-md border-b border-dark-100 p-3 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat ? "bg-primary-600 text-white shadow-soft" : "bg-dark-100 text-dark-600"
              }`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card flex gap-3 items-center">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl flex-shrink-0">
                {product.image}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-dark-800 truncate">{product.name}</h3>
                <div className="font-bold text-primary-600 text-sm">Rp {product.price.toLocaleString("id-ID")}</div>
              </div>
              <button onClick={() => addToLocalCart(product)}
                className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0 hover:bg-primary-700 transition-colors">
                <IconPlus className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-dark-100 p-4 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-600">{cart.reduce((s, i) => s + i.quantity, 0)} item</p>
              <p className="font-bold text-primary-600">Rp {total.toLocaleString("id-ID")}</p>
            </div>
            <button onClick={() => setShowCart(true)} className="btn-success py-2.5 px-6">Lihat Pesanan</button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-b-none sm:rounded-b-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-dark-800">Pesanan Anda</h2>
              <button onClick={() => setShowCart(false)} className="p-2 rounded-lg hover:bg-dark-50">
                <IconX className="w-5 h-5 text-dark-400" />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <IconCart className="w-10 h-10 mx-auto text-dark-200 mb-2" />
                <p className="text-dark-400">Keranjang kosong</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.product.image}</span>
                        <div>
                          <p className="font-medium text-sm text-dark-800">{item.product.name}</p>
                          <p className="text-xs text-dark-400">x{item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Rp {item.subtotal.toLocaleString("id-ID")}</span>
                        <button onClick={() => removeFromLocalCart(item.id)} className="p-1 rounded hover:bg-red-50">
                          <IconX className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-4">
                  <input className="input" placeholder="Nama Anda" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                  <input className="input" placeholder="Nomor Meja (opsional)" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                </div>
                <div className="pt-3 border-t border-dark-100 mb-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary-600">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <button onClick={handlePlaceOrder} className="btn-success w-full py-3">Pesan Sekarang</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
