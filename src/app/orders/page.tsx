"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";

export default function OrdersPage() {
  const { orders } = useStore();
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(
    (o) => filterStatus === "all" || o.status === filterStatus
  );

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  const statuses = [
    { value: "all", label: "Semua" },
    { value: "pending", label: "Pending" },
    { value: "preparing", label: "Proses" },
    { value: "ready", label: "Siap" },
    { value: "completed", label: "Selesai" },
    { value: "cancelled", label: "Batal" },
  ];

  const selectedOrderData = orders.find((o) => o.id === selectedOrder);

  return (
    <MainLayout title="📃 Riwayat Pesanan">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500">Total Pesanan</div>
          <div className="text-3xl font-black">{orders.length}</div>
        </div>
        <div className="card-brutal bg-primary">
          <div className="text-sm font-semibold">Total Pendapatan</div>
          <div className="text-2xl font-black">Rp {totalRevenue.toLocaleString("id-ID")}</div>
        </div>
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500">Rata-rata</div>
          <div className="text-2xl font-black text-secondary">
            Rp {orders.length > 0 ? Math.round(totalRevenue / Math.max(orders.filter(o => o.status === 'completed').length, 1)).toLocaleString("id-ID") : 0}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilterStatus(status.value)}
            className={`px-3 py-1.5 text-sm font-bold border-2 border-text ${
              filterStatus === status.value ? "bg-primary shadow-brutal-sm" : "bg-white"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="card-brutal text-center py-12">
              <div className="text-5xl mb-3">📭</div>
              <p className="font-bold text-gray-400">Belum ada pesanan</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                className={`card-brutal w-full text-left transition-all ${
                  selectedOrder === order.id ? "border-secondary shadow-brutal-lg" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black">#{order.orderNumber}</span>
                    <span className="text-sm text-gray-500">
                      {order.items.length} item
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black">Rp {order.total.toLocaleString("id-ID")}</span>
                    <span
                      className={`badge-brutal text-white ${
                        order.status === "completed"
                          ? "bg-success"
                          : order.status === "preparing"
                          ? "bg-warning"
                          : order.status === "ready"
                          ? "bg-secondary"
                          : order.status === "cancelled"
                          ? "bg-danger"
                          : "bg-gray-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>💳 {order.paymentMethod}</span>
                  {order.tableNumber && <span>🪑 Meja {order.tableNumber}</span>}
                  <span>🕒 {new Date(order.createdAt).toLocaleString("id-ID")}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Order Detail */}
        <div>
          {selectedOrderData ? (
            <div className="card-brutal sticky top-6">
              <h3 className="font-black text-lg mb-4">Detail #{selectedOrderData.orderNumber}</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  {selectedOrderData.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>
                        {item.product.image} {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-bold">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-text pt-2">
                  <div className="flex justify-between font-black text-lg">
                    <span>Total</span>
                    <span className="text-secondary">
                      Rp {selectedOrderData.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <div className="text-sm space-y-1 text-gray-600">
                  <div>💳 {selectedOrderData.paymentMethod.toUpperCase()}</div>
                  {selectedOrderData.tableNumber && <div>🪑 Meja {selectedOrderData.tableNumber}</div>}
                  {selectedOrderData.customerName && <div>👤 {selectedOrderData.customerName}</div>}
                  {selectedOrderData.customerPhone && <div>📱 {selectedOrderData.customerPhone}</div>}
                  <div>⭐ +{selectedOrderData.loyaltyPointsEarned} poin</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="btn-brutal text-xs py-1.5 px-3 bg-green-100 flex-1">
                    📱 Kirim WA
                  </button>
                  <button className="btn-brutal text-xs py-1.5 px-3 bg-gray-100 flex-1">
                    🖨️ Cetak
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-brutal text-center py-12">
              <div className="text-4xl mb-3">👆</div>
              <p className="font-bold text-gray-400">Pilih pesanan</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
