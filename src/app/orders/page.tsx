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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bento-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconOrders className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-text-muted">Total Pesanan</span>
          </div>
          <div className="text-3xl font-bold text-text">{orders.length}</div>
        </div>
        <div className="bento-card-accent p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconTrendUp className="w-4 h-4 text-primary-700" />
            <span className="text-sm text-primary-700">Total Pendapatan</span>
          </div>
          <div className="text-2xl font-bold text-primary-800">Rp {totalRevenue.toLocaleString("id-ID")}</div>
        </div>
        <div className="bento-card p-5">
          <span className="text-sm text-text-muted">Rata-rata / Order</span>
          <div className="text-2xl font-bold text-text mt-1">
            Rp {orders.length > 0 ? Math.round(totalRevenue / Math.max(orders.filter(o => o.status === "completed").length, 1)).toLocaleString("id-ID") : "0"}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        {statuses.map((s) => (
          <button key={s.value} onClick={() => setFilterStatus(s.value)}
            className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
              filterStatus === s.value ? "bg-primary-200 text-primary-800 shadow-bento" : "bg-surface-100 text-text-secondary hover:bg-primary-50"
            }`}>{s.label}</button>
        ))}
      </div>

      {/* Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="bento-card text-center py-16">
              <IconOrders className="w-12 h-12 mx-auto text-text-muted mb-3" />
              <p className="font-medium text-text-secondary">Belum ada pesanan</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <button key={order.id} onClick={() => setSelectedOrder(order.id)}
                className={`bento-card w-full text-left transition-all hover:shadow-bento-md ${selectedOrder === order.id ? "ring-2 ring-primary-300" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100/40 flex items-center justify-center text-sm font-bold text-primary-600">
                      #{order.orderNumber.slice(-3)}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-text">Order #{order.orderNumber}</span>
                      <span className="text-xs text-text-muted ml-2">{order.items.length} item</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">Rp {order.total.toLocaleString("id-ID")}</span>
                    <span className={`badge ${
                      order.status === "completed" ? "badge-success" : order.status === "preparing" ? "badge-warning" :
                      order.status === "ready" ? "badge-primary" : order.status === "cancelled" ? "badge-danger" : "badge-neutral"
                    }`}>{order.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                  <span>{order.paymentMethod.toUpperCase()}</span>
                  {order.tableNumber && <span>Meja {order.tableNumber}</span>}
                  <span>{new Date(order.createdAt).toLocaleString("id-ID")}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div>
          {selectedOrderData ? (
            <div className="bento-card sticky top-24">
              <h3 className="font-bold text-text mb-4">Detail #{selectedOrderData.orderNumber}</h3>
              <div className="space-y-2 mb-4">
                {selectedOrderData.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{item.product.image} {item.product.name} x{item.quantity}</span>
                    <span className="font-medium">Rp {item.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-primary-100/60 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">Rp {selectedOrderData.total.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <div className="text-sm space-y-1.5 text-text-secondary mb-4">
                <p>{selectedOrderData.paymentMethod.toUpperCase()}</p>
                {selectedOrderData.tableNumber && <p>Meja {selectedOrderData.tableNumber}</p>}
                {selectedOrderData.customerName && <p>{selectedOrderData.customerName}</p>}
                <p>+{selectedOrderData.loyaltyPointsEarned} poin</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-outline text-xs py-2 flex-1"><IconWhatsapp className="w-3.5 h-3.5" /> Kirim WA</button>
                <button className="btn-outline text-xs py-2 flex-1"><IconPrinter className="w-3.5 h-3.5" /> Cetak</button>
              </div>
            </div>
          ) : (
            <div className="bento-card text-center py-16">
              <IconOrders className="w-10 h-10 mx-auto text-text-muted mb-3" />
              <p className="font-medium text-text-secondary">Pilih pesanan</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
