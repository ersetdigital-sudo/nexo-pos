"use client";

import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";

export default function QueuePage() {
  const { orders, updateOrderStatus } = useStore();

  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");
  const pendingOrders = orders.filter((o) => o.status === "pending");

  return (
    <MainLayout title="📋 Antrian Pesanan">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-gray-400 border-2 border-text"></div>
            <h2 className="text-xl font-black">Menunggu ({pendingOrders.length})</h2>
          </div>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="card-brutal animate-slide-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-black">#{order.orderNumber}</span>
                  <span className="badge-brutal bg-gray-200">Baru</span>
                </div>
                <div className="text-sm space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.product.name} x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                {order.tableNumber && (
                  <div className="text-sm font-bold text-secondary mb-2">Meja {order.tableNumber}</div>
                )}
                <button
                  onClick={() => updateOrderStatus(order.id, "preparing")}
                  className="btn-brutal-primary w-full text-sm py-2"
                >
                  🍳 Mulai Proses
                </button>
              </div>
            ))}
            {pendingOrders.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">✅</div>
                <p className="font-medium">Tidak ada pesanan baru</p>
              </div>
            )}
          </div>
        </div>

        {/* Preparing */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-warning border-2 border-text"></div>
            <h2 className="text-xl font-black">Diproses ({preparingOrders.length})</h2>
          </div>
          <div className="space-y-3">
            {preparingOrders.map((order) => (
              <div key={order.id} className="card-brutal border-warning animate-pulse-glow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-black">#{order.orderNumber}</span>
                  <span className="badge-brutal bg-warning text-white">Proses</span>
                </div>
                <div className="text-sm space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.product.name} x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                {order.tableNumber && (
                  <div className="text-sm font-bold text-secondary mb-2">Meja {order.tableNumber}</div>
                )}
                <button
                  onClick={() => updateOrderStatus(order.id, "ready")}
                  className="btn-brutal-success w-full text-sm py-2"
                >
                  ✅ Siap Diambil
                </button>
              </div>
            ))}
            {preparingOrders.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🍳</div>
                <p className="font-medium">Tidak ada yang diproses</p>
              </div>
            )}
          </div>
        </div>

        {/* Ready */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-success border-2 border-text"></div>
            <h2 className="text-xl font-black">Siap ({readyOrders.length})</h2>
          </div>
          <div className="space-y-3">
            {readyOrders.map((order) => (
              <div key={order.id} className="card-brutal border-success bg-green-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-black">#{order.orderNumber}</span>
                  <span className="badge-brutal bg-success text-white">Siap</span>
                </div>
                <div className="text-sm space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i}>
                      {item.product.name} x{item.quantity}
                    </div>
                  ))}
                </div>
                {order.tableNumber && (
                  <div className="text-sm font-bold text-secondary mb-2">Meja {order.tableNumber}</div>
                )}
                <button
                  onClick={() => updateOrderStatus(order.id, "completed")}
                  className="btn-brutal-secondary w-full text-sm py-2"
                >
                  🎉 Selesai
                </button>
              </div>
            ))}
            {readyOrders.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">📭</div>
                <p className="font-medium">Belum ada yang siap</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
