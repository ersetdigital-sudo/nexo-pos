"use client";

import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import Link from "next/link";

const quickActions = [
  { href: "/cashier", label: "Buka Kasir", icon: "💰", color: "bg-primary" },
  { href: "/kitchen", label: "Dapur", icon: "🍳", color: "bg-orange-200" },
  { href: "/queue", label: "Antrian", icon: "📋", color: "bg-blue-200" },
  { href: "/self-order", label: "Self Order", icon: "📱", color: "bg-green-200" },
];

export default function DashboardPage() {
  const { orders, products, customers, tables, ingredientStock } = useStore();

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  );
  const occupiedTables = tables.filter((t) => t.status === "occupied");
  const lowStockIngredients = ingredientStock.filter(
    (i) => i.currentStock <= i.minimumStock
  );

  return (
    <MainLayout title="Dashboard">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`card-brutal ${action.color} hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm transition-all`}
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="font-bold text-sm">{action.label}</div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500 mb-1">Pendapatan Hari Ini</div>
          <div className="text-2xl font-black">Rp {todayRevenue.toLocaleString("id-ID")}</div>
          <div className="text-xs text-gray-400 mt-1">{todayOrders.length} transaksi</div>
        </div>
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500 mb-1">Pesanan Aktif</div>
          <div className="text-2xl font-black text-secondary">{activeOrders.length}</div>
          <div className="text-xs text-gray-400 mt-1">sedang diproses</div>
        </div>
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500 mb-1">Meja Terpakai</div>
          <div className="text-2xl font-black text-warning">{occupiedTables.length}/{tables.length}</div>
          <div className="text-xs text-gray-400 mt-1">meja aktif</div>
        </div>
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500 mb-1">Total Pelanggan</div>
          <div className="text-2xl font-black text-success">{customers.length}</div>
          <div className="text-xs text-gray-400 mt-1">terdaftar</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card-brutal">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            📃 Pesanan Terbaru
          </h3>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🛒</div>
              <p className="font-medium">Belum ada pesanan hari ini</p>
              <p className="text-sm">Mulai transaksi pertama di Kasir</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {orders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border-2 border-gray-200 hover:border-text transition-colors"
                >
                  <div>
                    <span className="font-bold">#{order.orderNumber}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {order.items.length} item
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      Rp {order.total.toLocaleString("id-ID")}
                    </span>
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
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {/* Low Stock Alert */}
          <div className="card-brutal border-danger">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              ⚠️ Stok Rendah
            </h3>
            {lowStockIngredients.length === 0 ? (
              <p className="text-sm text-gray-500">Semua stok aman</p>
            ) : (
              <div className="space-y-1">
                {lowStockIngredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="flex justify-between text-sm font-medium"
                  >
                    <span>{ing.name}</span>
                    <span className="text-danger font-bold">
                      {ing.currentStock} {ing.unit}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className="card-brutal bg-secondary text-white">
            <h3 className="font-bold mb-2">🚀 Fitur Unggulan</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• QRIS Payment</li>
              <li>• WhatsApp Receipt</li>
              <li>• Auto Barcode Scan</li>
              <li>• Kitchen Display</li>
              <li>• Loyalty Points</li>
            </ul>
          </div>

          <div className="card-brutal bg-primary">
            <h3 className="font-bold mb-1">📦 Total Produk</h3>
            <div className="text-3xl font-black">{products.length}</div>
            <p className="text-xs opacity-75">item aktif</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
