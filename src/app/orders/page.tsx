"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconOrders, IconTrendUp, IconWhatsapp, IconPrinter } from "@/components/Icons";

export default function OrdersPage() {
  const { orders } = useStore();
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => filterStatus === "all" || o.status === filterStatus);
  const totalRevenue = orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.total, 0);

  const statuses = [
    { value: "all", label: "Semua" }, { value: "pending", label: "Pending" },
    { value: "preparing", label: "Proses" }, { value: "ready", label: "Siap" },
    { value: "completed", label: "Selesai" }, { value: "cancelled", label: "Batal" },
  ];

  const selectedOrderData = orders.find((o) => o.id === selectedOrder);

  return (
    <MainLayout title="Riwayat Pesanan">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 md:mb-6">
        <div className="bento-card !p-3 sm:!p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconOrders className="w-4 h-4 text-primary-500" />
            <span className="text-xs sm:text-sm text-text-muted">Total Pesanan</span>
          </div>
          <div className="text-lg sm:text-3xl font-bold text-text">{orders.length}</div>
        </div>
        <div className="bento-card-accent !p-3 sm:!p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconTrendUp className="w-4 h-4 text-primary-700" />
            <span className="text-xs sm:text-sm text-primary-700">Total Pendapatan</span>
          </div>
          <div className="text-base sm:text-2xl font-bold text-primary-800">Rp {totalRevenue.toLocaleString("id-ID")}</div>
        </div>
        <div className="bento-card !p-3 sm:!p-5">
          <span className="text-xs sm:text-sm text-text-muted">Rata-rata / Order</span>
          <div className="text-base sm:text-2xl font-bold text-text mt-1">
            Rp {orders.length > 0 ? Math.round(totalRevenue / Math.max(orders.filter(o => o.status === "completed").length, 1)).toLocaleString("id-ID") : "0"}
          </div>
        </div>
      </div>


      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 sm:mb-5">
        {statuses.map((s) => (
          <button key={s.value} onClick={() => setFilterStatus(s.value)}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap min-h-[44px] ${
              filterStatus === s.value ? "bg-primary-200 text-primary-800 shadow-bento" : "bg-surface-100 text-text-secondary hover:bg-primary-50"
            }`}>{s.label}</button>
        ))}
      </div>

      {/* Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="bento-card text-center py-10 sm:py-16">
              <IconOrders className="w-12 h-12 mx-auto text-text-muted mb-3" />
              <p className="font-medium text-text-secondary text-sm sm:text-base">Belum ada pesanan</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <button key={order.id} onClick={() => setSelectedOrder(order.id)}
                className={`bento-card !p-3 sm:!p-4 w-full text-left transition-all hover:shadow-bento-md min-h-[44px] ${selectedOrder === order.id ? "ring-2 ring-primary-300" : ""}`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary-50 border border-primary-100/40 flex items-center justify-center text-xs sm:text-sm font-bold text-primary-600 flex-shrink-0">
                      #{order.orderNumber.slice(-3)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-xs sm:text-sm text-text">Order #{order.orderNumber}</span>
                      <span className="text-xs text-text-muted ml-1 sm:ml-2">{order.items.length} item</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="font-semibold text-xs sm:text-sm">Rp {order.total.toLocaleString("id-ID")}</span>
                    <span className={`badge text-xs ${
                      order.status === "completed" ? "badge-success" : order.status === "preparing" ? "badge-warning" :
                      order.status === "ready" ? "badge-primary" : order.status === "cancelled" ? "badge-danger" : "badge-neutral"
                    }`}>{order.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs text-text-muted flex-wrap">
                  <span>{order.paymentMethod.toUpperCase()}</span>
                  {order.tableNumber && <span>Meja {order.tableNumber}</span>}
                  <span className="truncate">{new Date(order.createdAt).toLocaleString("id-ID")}</span>
                </div>
              </button>
            ))
          )}
        </div>


        {/* Detail */}
        <div>
          {selectedOrderData ? (
            <div className="bento-card !p-3 sm:!p-4 sticky top-24">
              <h3 className="font-bold text-text mb-3 sm:mb-4 text-sm sm:text-base">Detail #{selectedOrderData.orderNumber}</h3>
              <div className="space-y-2 mb-4">
                {selectedOrderData.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs sm:text-sm">
                    <span className="text-text-secondary truncate mr-2">{item.product.image} {item.product.name} x{item.quantity}</span>
                    <span className="font-medium flex-shrink-0">Rp {item.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-primary-100/60 mb-4">
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">Rp {selectedOrderData.total.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <div className="text-xs sm:text-sm space-y-1.5 text-text-secondary mb-4">
                <p>{selectedOrderData.paymentMethod.toUpperCase()}</p>
                {selectedOrderData.tableNumber && <p>Meja {selectedOrderData.tableNumber}</p>}
                {selectedOrderData.customerName && <p className="truncate">{selectedOrderData.customerName}</p>}
                <p>+{selectedOrderData.loyaltyPointsEarned} poin</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-outline text-xs py-2 flex-1 min-h-[44px]"><IconWhatsapp className="w-3.5 h-3.5" /> Kirim WA</button>
                <button className="btn-outline text-xs py-2 flex-1 min-h-[44px]"><IconPrinter className="w-3.5 h-3.5" /> Cetak</button>
              </div>
            </div>
          ) : (
            <div className="bento-card text-center py-10 sm:py-16">
              <IconOrders className="w-10 h-10 mx-auto text-text-muted mb-3" />
              <p className="font-medium text-text-secondary text-sm">Pilih pesanan</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
