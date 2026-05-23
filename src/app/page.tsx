"use client";

import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import Link from "next/link";
import { IconCashier, IconKitchen, IconQueue, IconSelfOrder, IconTrendUp, IconUsers, IconTable, IconProducts, IconCart, IconIngredients, IconQris, IconWhatsapp, IconScanner, IconLoyalty } from "@/components/Icons";

const quickActions = [
  { href: "/cashier", label: "Buka Kasir", icon: IconCashier, bg: "bg-primary-100" },
  { href: "/kitchen", label: "Dapur", icon: IconKitchen, bg: "bg-amber-50" },
  { href: "/queue", label: "Antrian", icon: IconQueue, bg: "bg-secondary-50" },
  { href: "/self-order", label: "Self Order", icon: IconSelfOrder, bg: "bg-green-50" },
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
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* Quick Actions - Full width */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}
                className="bento-card-hover flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 text-text-secondary" />
                </div>
                <span className="font-medium text-sm text-text">{action.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Revenue - Large card */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 bento-card-accent">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-primary-200/60 flex items-center justify-center">
              <IconTrendUp className="w-4 h-4 text-primary-700" />
            </div>
            <span className="text-sm text-text-secondary">Pendapatan Hari Ini</span>
          </div>
          <div className="text-2xl font-bold text-text">Rp {todayRevenue.toLocaleString("id-ID")}</div>
          <p className="text-xs text-text-muted mt-1">{todayOrders.length} transaksi</p>
        </div>

        {/* Active Orders */}
        <div className="col-span-6 md:col-span-3 lg:col-span-3 bento-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-secondary-50 flex items-center justify-center">
              <IconQueue className="w-4 h-4 text-secondary-500" />
            </div>
            <span className="text-sm text-text-secondary">Pesanan Aktif</span>
          </div>
          <div className="text-2xl font-bold text-text">{activeOrders.length}</div>
          <p className="text-xs text-text-muted mt-1">sedang diproses</p>
        </div>

        {/* Tables */}
        <div className="col-span-6 md:col-span-3 lg:col-span-3 bento-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center">
              <IconTable className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm text-text-secondary">Meja Terpakai</span>
          </div>
          <div className="text-2xl font-bold text-text">{occupiedTables.length}<span className="text-base text-text-muted">/{tables.length}</span></div>
          <p className="text-xs text-text-muted mt-1">meja aktif</p>
        </div>

        {/* Customers */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 bento-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
              <IconUsers className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-text-secondary">Total Pelanggan</span>
          </div>
          <div className="text-2xl font-bold text-text">{customers.length}</div>
          <p className="text-xs text-text-muted mt-1">member terdaftar</p>
        </div>

        {/* Recent Orders - Takes 8 cols */}
        <div className="col-span-12 lg:col-span-8 bento-card-lg">
          <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
            <IconOrders className="w-4 h-4 text-primary-500" />
            Pesanan Terbaru
          </h3>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-surface-200 flex items-center justify-center">
                <IconCart className="w-7 h-7 text-text-muted" />
              </div>
              <p className="font-medium text-text-secondary">Belum ada pesanan hari ini</p>
              <p className="text-sm text-text-muted mt-1">Mulai transaksi pertama di Kasir</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {orders.slice(0, 8).map((order) => (
                <div key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-50 hover:bg-surface-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-white border border-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                      #{order.orderNumber.slice(-3)}
                    </div>
                    <div>
                      <span className="font-medium text-sm text-text">Order #{order.orderNumber}</span>
                      <span className="text-xs text-text-muted ml-2">{order.items.length} item</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-text">Rp {order.total.toLocaleString("id-ID")}</span>
                    <span className={`badge ${
                      order.status === "completed" ? "badge-success" :
                      order.status === "preparing" ? "badge-warning" :
                      order.status === "ready" ? "badge-secondary" :
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

        {/* Right column - stacked cards */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Low Stock */}
          <div className="bento-card">
            <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
              <IconIngredients className="w-4 h-4 text-danger" />
              Stok Rendah
            </h3>
            {lowStockIngredients.length === 0 ? (
              <p className="text-sm text-text-muted">Semua stok aman</p>
            ) : (
              <div className="space-y-2">
                {lowStockIngredients.map((ing) => (
                  <div key={ing.id} className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">{ing.name}</span>
                    <span className="badge-danger">{ing.currentStock} {ing.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products count */}
          <div className="bento-card-accent">
            <div className="flex items-center gap-2 mb-2">
              <IconProducts className="w-4 h-4 text-primary-600" />
              <span className="font-medium text-sm text-primary-800">Total Produk</span>
            </div>
            <div className="text-2xl font-bold text-primary-900">{products.length}</div>
            <p className="text-xs text-primary-600 mt-1">item aktif di menu</p>
          </div>

          {/* Features */}
          <div className="bento-card">
            <h3 className="font-medium text-sm text-text mb-3">Fitur Aktif</h3>
            <div className="space-y-2.5 text-sm text-text-secondary">
              <div className="flex items-center gap-2"><IconQris className="w-4 h-4 text-secondary-400" /> QRIS Payment</div>
              <div className="flex items-center gap-2"><IconWhatsapp className="w-4 h-4 text-green-500" /> WhatsApp Receipt</div>
              <div className="flex items-center gap-2"><IconScanner className="w-4 h-4 text-amber-500" /> Auto Barcode Scan</div>
              <div className="flex items-center gap-2"><IconKitchen className="w-4 h-4 text-orange-400" /> Kitchen Display</div>
              <div className="flex items-center gap-2"><IconLoyalty className="w-4 h-4 text-primary-400" /> Loyalty Points</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
