"use client";

import { useStore } from "@/store";

export default function CustomerDisplayPage() {
  const { cart, orders, storeName, taxRate } = useStore();

  const activeOrder = orders.find(
    (o) => o.status === "pending" || o.status === "preparing"
  );

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <div className="bg-primary border-b-4 border-text p-6 text-center">
        <h1 className="text-4xl font-black">{storeName}</h1>
        <p className="text-lg font-semibold opacity-75">Customer Display</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Current Transaction */}
        <div className="flex-1">
          <div className="card-brutal h-full">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              🛒 Pesanan Anda
            </h2>

            {cart.length === 0 && !activeOrder ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-4">🍽️</div>
                <p className="text-2xl font-bold text-gray-400">Selamat Datang!</p>
                <p className="text-lg text-gray-300 mt-2">Pesanan akan tampil di sini</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(activeOrder?.items || cart).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex justify-between items-center p-4 border-2 border-gray-200 animate-slide-in"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.product.image}</span>
                      <div>
                        <div className="font-bold text-lg">{item.product.name}</div>
                        {item.selectedVariations && item.selectedVariations.length > 0 && (
                          <div className="text-sm text-secondary font-medium">
                            {item.selectedVariations.map((v) => {
                              const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                              const option = variation?.options.find((o) => o.id === v.optionId);
                              return option?.label;
                            }).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">x{item.quantity}</div>
                      <div className="font-black text-lg">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="card-brutal bg-white">
            <h3 className="font-black text-lg mb-4">Ringkasan</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">Rp {(activeOrder?.total || subtotal).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Pajak</span>
                <span className="font-bold">Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="border-t-2 border-text pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-xl font-black">TOTAL</span>
                  <span className="text-2xl font-black text-secondary">
                    Rp {(activeOrder?.total || total).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty */}
          <div className="card-brutal bg-secondary text-white">
            <h3 className="font-bold mb-2">⭐ Loyalty Points</h3>
            <p className="text-sm opacity-90">
              Setiap pembelian mendapatkan poin reward! Tunjukkan nomor HP Anda.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="card-brutal">
            <h3 className="font-bold mb-3">Metode Pembayaran</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 border-2 border-gray-200">
                <div className="text-2xl">💵</div>
                <div className="text-xs font-bold">Tunai</div>
              </div>
              <div className="text-center p-2 border-2 border-gray-200">
                <div className="text-2xl">📱</div>
                <div className="text-xs font-bold">QRIS</div>
              </div>
              <div className="text-center p-2 border-2 border-gray-200">
                <div className="text-2xl">💳</div>
                <div className="text-xs font-bold">Kartu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-text text-white text-center py-3">
        <p className="font-semibold">Terima kasih telah berbelanja di {storeName} 🙏</p>
      </div>
    </div>
  );
}
