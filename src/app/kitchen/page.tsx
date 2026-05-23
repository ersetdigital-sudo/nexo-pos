"use client";

import { useStore } from "@/store";

export default function KitchenPage() {
  const { orders, updateOrderStatus } = useStore();

  const kitchenOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "preparing"
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black text-primary">🍳 KITCHEN DISPLAY</h1>
          <div className="badge-brutal bg-success text-white border-white">
            {kitchenOrders.length} aktif
          </div>
        </div>
        <div className="text-lg font-mono">
          {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-8xl mb-4">👨‍🍳</div>
          <p className="text-3xl font-bold text-gray-400">Belum Ada Pesanan</p>
          <p className="text-lg text-gray-500 mt-2">Menunggu pesanan masuk...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kitchenOrders.map((order) => (
            <div
              key={order.id}
              className={`border-4 p-4 ${
                order.status === "preparing"
                  ? "border-warning bg-warning/10"
                  : "border-white bg-white/5"
              }`}
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-3xl font-black">#{order.orderNumber}</span>
                <span
                  className={`px-2 py-1 text-xs font-black border-2 ${
                    order.status === "preparing"
                      ? "bg-warning text-white border-warning"
                      : "bg-white text-gray-900 border-white"
                  }`}
                >
                  {order.status === "preparing" ? "PROSES" : "BARU"}
                </span>
              </div>

              {/* Table / Customer */}
              {order.tableNumber && (
                <div className="text-primary font-black mb-2">MEJA {order.tableNumber}</div>
              )}

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="border-b border-white/20 pb-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">
                        {item.product.image} {item.product.name}
                      </span>
                      <span className="text-2xl font-black text-primary">x{item.quantity}</span>
                    </div>
                    {item.selectedVariations && item.selectedVariations.length > 0 && (
                      <div className="text-sm text-yellow-300 mt-1">
                        → {item.selectedVariations.map((v) => {
                          const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                          const option = variation?.options.find((o) => o.id === v.optionId);
                          return option?.label;
                        }).join(", ")}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-sm text-red-300 mt-1">📝 {item.notes}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Time */}
              <div className="text-xs text-gray-400 mb-3">
                Masuk: {new Date(order.createdAt).toLocaleTimeString("id-ID")}
              </div>

              {/* Action */}
              {order.status === "pending" ? (
                <button
                  onClick={() => updateOrderStatus(order.id, "preparing")}
                  className="w-full py-3 bg-warning text-white border-2 border-white font-black text-lg hover:bg-yellow-500 transition-colors"
                >
                  🍳 MULAI MASAK
                </button>
              ) : (
                <button
                  onClick={() => updateOrderStatus(order.id, "ready")}
                  className="w-full py-3 bg-success text-white border-2 border-white font-black text-lg hover:bg-green-500 transition-colors"
                >
                  ✅ SELESAI
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
