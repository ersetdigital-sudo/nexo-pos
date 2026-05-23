"use client";

import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconClock, IconCheck, IconFire } from "@/components/Icons";

export default function QueuePage() {
  const { orders, updateOrderStatus } = useStore();

  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");
  const pendingOrders = orders.filter((o) => o.status === "pending");

  const Column = ({ title, count, color, children }: { title: string; count: number; color: string; children: React.ReactNode }) => (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <h2 className="text-base sm:text-lg font-bold text-text">{title}</h2>
        <span className="badge-neutral">{count}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  return (
    <MainLayout title="Antrian Pesanan">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Column title="Menunggu" count={pendingOrders.length} color="bg-gray-400">
          {pendingOrders.map((order) => (
            <div key={order.id} className="bento-card !p-3 sm:!p-4 animate-slide-up">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg sm:text-2xl font-bold text-text">#{order.orderNumber}</span>
                <span className="badge-neutral">Baru</span>
              </div>
              <div className="text-xs sm:text-sm space-y-1.5 mb-3 text-text-secondary">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="truncate mr-2">{item.product.name}</span><span className="font-medium flex-shrink-0">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              {order.tableNumber && <p className="text-xs sm:text-sm font-medium text-primary-600 mb-3">Meja {order.tableNumber}</p>}
              <button onClick={() => updateOrderStatus(order.id, "preparing")} className="btn-primary w-full text-sm py-2.5 min-h-[44px]">
                <IconFire className="w-4 h-4" /> Mulai Proses
              </button>
            </div>
          ))}
          {pendingOrders.length === 0 && (
            <div className="text-center py-10 text-text-muted">
              <IconCheck className="w-10 h-10 mx-auto mb-2" />
              <p className="font-medium text-xs sm:text-sm">Tidak ada pesanan baru</p>
            </div>
          )}
        </Column>

        <Column title="Diproses" count={preparingOrders.length} color="bg-amber-500">
          {preparingOrders.map((order) => (
            <div key={order.id} className="bento-card !p-3 sm:!p-4 border-amber-200 bg-amber-50/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg sm:text-2xl font-bold text-text">#{order.orderNumber}</span>
                <span className="badge-warning">Proses</span>
              </div>
              <div className="text-xs sm:text-sm space-y-1.5 mb-3 text-text-secondary">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="truncate mr-2">{item.product.name}</span><span className="font-medium flex-shrink-0">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              {order.tableNumber && <p className="text-xs sm:text-sm font-medium text-primary-600 mb-3">Meja {order.tableNumber}</p>}
              <button onClick={() => updateOrderStatus(order.id, "ready")} className="btn-success w-full text-sm py-2.5 min-h-[44px]">
                <IconCheck className="w-4 h-4" /> Siap Diambil
              </button>
            </div>
          ))}
          {preparingOrders.length === 0 && (
            <div className="text-center py-10 text-text-muted">
              <IconClock className="w-10 h-10 mx-auto mb-2" />
              <p className="font-medium text-xs sm:text-sm">Tidak ada yang diproses</p>
            </div>
          )}
        </Column>

        <Column title="Siap" count={readyOrders.length} color="bg-emerald-500">
          {readyOrders.map((order) => (
            <div key={order.id} className="bento-card !p-3 sm:!p-4 border-emerald-200 bg-emerald-50/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg sm:text-2xl font-bold text-text">#{order.orderNumber}</span>
                <span className="badge-success">Siap</span>
              </div>
              <div className="text-xs sm:text-sm space-y-1.5 mb-3 text-text-secondary">
                {order.items.map((item, i) => (
                  <div key={i} className="truncate">{item.product.name} x{item.quantity}</div>
                ))}
              </div>
              {order.tableNumber && <p className="text-xs sm:text-sm font-medium text-primary-600 mb-3">Meja {order.tableNumber}</p>}
              <button onClick={() => updateOrderStatus(order.id, "completed")} className="btn-secondary w-full text-sm py-2.5 min-h-[44px]">
                <IconCheck className="w-4 h-4" /> Selesai
              </button>
            </div>
          ))}
          {readyOrders.length === 0 && (
            <div className="text-center py-10 text-text-muted">
              <IconCheck className="w-10 h-10 mx-auto mb-2" />
              <p className="font-medium text-xs sm:text-sm">Belum ada yang siap</p>
            </div>
          )}
        </Column>
      </div>
    </MainLayout>
  );
}
