"use client";

import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import Link from "next/link";
import { IconCashier, IconKitchen, IconQueue, IconSelfOrder, IconTrendUp, IconUsers, IconTable, IconProducts, IconCart, IconIngredients, IconQris, IconWhatsapp, IconScanner, IconLoyalty } from "@/components/Icons";

const quickActions = [
  { href: "/cashier", label: "Buka Kasir", icon: IconCashier, gradient: "from-primary-500 to-primary-700" },
  { href: "/kitchen", label: "Dapur", icon: IconKitchen, gradient: "from-amber-500 to-orange-600" },
  { href: "/queue", label: "Antrian", icon: IconQueue, gradient: "from-sky-500 to-blue-600" },
  { href: "/self-order", label: "Self Order", icon: IconSelfOrder, gradient: "from-emerald-500 to-green-600" },
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
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}
              className="group card-hover p-4 flex flex-col items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-sm text-dark-700">{action.label}</span>
            </Link>
          );
        })}
      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-dark-400">Pendapatan Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <IconTrendUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-dark-900">Rp {todayRevenue.toLocaleString("id-ID")}</div>
          <p className="text-xs text-dark-400 mt-1">{todayOrders.length} transaksi</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-dark-400">Pesanan Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <IconQueue className="w-4 h-4 text-primary-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-dark-900">{activeOrders.length}</div>
          <p className="text-xs text-dark-400 mt-1">sedang diproses</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-dark-400">Meja Terpakai</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <IconTable className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-dark-900">{occupiedTables.length}<span className="text-base text-dark-400">/{tables.length}</span></div>
          <p className="text-xs text-dark-400 mt-1">meja aktif</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-dark-400">Total Pelanggan</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <IconUsers className="w-4 h-4 text-violet-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-dark-900">{customers.length}</div>
          <p className="text-xs text-dark-400 mt-1">member terdaftar</p>
        </div>
      </div>


      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-dark-800 mb-4 flex items-center gap-2">
            <IconQueue className="w-4 h-4 text-primary-500" />
            Pesanan Terbaru
          </h3>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-dark-50 flex items-center justify-center">
                <IconCart className="w-8 h-8 text-dark-300" />
              </div>
              <p className="font-medium text-dark-400">Belum ada pesanan hari ini</p>
              <p className="text-sm text-dark-300 mt-1">Mulai transaksi pertama di Kasir</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {orders.slice(0, 10).map((order) => (
                <div key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-50/50 hover:bg-dark-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white shadow-soft flex items-center justify-center text-sm font-bold text-primary-600">
                      #{order.orderNumber.slice(-3)}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-dark-800">Order #{order.orderNumber}</span>
                      <span className="text-xs text-dark-400 ml-2">{order.items.length} item</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">Rp {order.total.toLocaleString("id-ID")}</span>
                    <span className={`badge ${
                      order.status === "completed" ? "badge-success" :
                      order.status === "preparing" ? "badge-warning" :
                      order.status === "ready" ? "badge-primary" :
                      order.status === "cancelled" ? "badge-danger" : "badge-neutral"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          {/* Low Stock */}
          <div className="card">
            <h3 className="font-semibold text-dark-800 mb-3 flex items-center gap-2">
              <IconIngredients className="w-4 h-4 text-red-500" />
              Stok Rendah
            </h3>
            {lowStockIngredients.length === 0 ? (
              <p className="text-sm text-dark-400">Semua stok aman</p>
            ) : (
              <div className="space-y-2">
                {lowStockIngredients.map((ing) => (
                  <div key={ing.id} className="flex justify-between items-center text-sm">
                    <span className="text-dark-600">{ing.name}</span>
                    <span className="badge-danger">{ing.currentStock} {ing.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products */}
          <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white border-0">
            <div className="flex items-center gap-2 mb-2">
              <IconProducts className="w-4 h-4" />
              <h3 className="font-semibold">Total Produk</h3>
            </div>
            <div className="text-3xl font-bold">{products.length}</div>
            <p className="text-sm opacity-80 mt-1">item aktif di menu</p>
          </div>

          {/* Features */}
          <div className="card">
            <h3 className="font-semibold text-dark-800 mb-3">Fitur Aktif</h3>
            <div className="space-y-2 text-sm text-dark-500">
              <div className="flex items-center gap-2"><IconQris className="w-4 h-4 text-primary-500" /> QRIS Payment</div>
              <div className="flex items-center gap-2"><IconWhatsapp className="w-4 h-4 text-emerald-500" /> WhatsApp Receipt</div>
              <div className="flex items-center gap-2"><IconScanner className="w-4 h-4 text-amber-500" /> Auto Barcode Scan</div>
              <div className="flex items-center gap-2"><IconKitchen className="w-4 h-4 text-orange-500" /> Kitchen Display</div>
              <div className="flex items-center gap-2"><IconLoyalty className="w-4 h-4 text-yellow-500" /> Loyalty Points</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
