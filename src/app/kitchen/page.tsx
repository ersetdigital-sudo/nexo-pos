"use client";

import { useStore } from "@/store";
import { IconClock, IconCheck, IconFire } from "@/components/Icons";

export default function KitchenPage() {
  const { orders, updateOrderStatus } = useStore();

  const kitchenOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "preparing"
  );

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-200 flex items-center justify-center">
            <IconFire className="w-5 h-5 text-primary-800" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Kitchen Display</h1>
            <p className="text-xs sm:text-sm text-gray-400">{kitchenOrders.length} pesanan aktif</p>
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-mono font-bold text-gray-300">
          {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="text-center py-32">
          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
            <IconCheck className="w-12 h-12 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-300">Semua Selesai!</p>
          <p className="text-sm text-gray-500 mt-2">Menunggu pesanan baru masuk...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {kitchenOrders.map((order) => (
            <div key={order.id}
              className={`rounded-xl p-3 sm:p-5 border transition-all duration-200 animate-fade-in ${
                order.status === "preparing"
                  ? "bg-amber-950/40 border-amber-500/40"
                  : "bg-gray-800 border-gray-700"
              }`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-white">#{order.orderNumber}</span>
                <span className={`badge ${order.status === "preparing" ? "badge-warning" : "badge-neutral"}`}>
                  {order.status === "preparing" ? "Proses" : "Baru"}
                </span>
              </div>

              {order.tableNumber && (
                <div className="text-xs sm:text-sm font-semibold text-primary-200 mb-3">Meja {order.tableNumber}</div>
              )}

              <div className="space-y-2 mb-5">
                {order.items.map((item, i) => (
                  <div key={i} className="p-2 sm:p-3 rounded-lg bg-gray-900/60 border border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm sm:text-base text-white truncate mr-2">{item.product.name}</span>
                      <span className="text-lg sm:text-xl font-bold text-primary-200 flex-shrink-0">x{item.quantity}</span>
                    </div>
                    {item.selectedVariations && item.selectedVariations.length > 0 && (
                      <p className="text-xs text-amber-300 mt-1">
                        {item.selectedVariations.map((v) => {
                          const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                          return variation?.options.find((o) => o.id === v.optionId)?.label;
                        }).join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <IconClock className="w-3.5 h-3.5" />
                {new Date(order.createdAt).toLocaleTimeString("id-ID")}
              </div>

              {order.status === "pending" ? (
                <button onClick={() => updateOrderStatus(order.id, "preparing")}
                  className="w-full py-3 rounded-lg bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors shadow-bento min-h-[48px]">
                  Mulai Masak
                </button>
              ) : (
                <button onClick={() => updateOrderStatus(order.id, "ready")}
                  className="w-full py-3 rounded-lg bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-bento min-h-[48px]">
                  Selesai
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
