"use client";

import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import Link from "next/link";
import { IconCashier, IconKitchen, IconQueue, IconSelfOrder, IconTrendUp, IconUsers, IconTable, IconProducts, IconCart, IconIngredients, IconOrders, IconQris, IconWhatsapp, IconScanner, IconLoyalty } from "@/components/Icons";

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
      {/* Quick Actions - 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 md:mb-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}
              className="bento-card-hover flex items-center gap-2 sm:gap-3 group min-h-[56px]">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${action.bg} flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
              </div>
              <span className="font-medium text-xs sm:text-sm text-text leading-tight">{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Stats - 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 md:mb-6">
        {/* Revenue */}
        <div className="col-span-2 sm:col-span-1 bento-card-accent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-primary-200/60 flex items-center justify-center">
              <IconTrendUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-700" />
            </div>
            <span className="text-xs sm:text-sm text-text-secondary">Pendapatan</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-text">Rp {todayRevenue.toLocaleString("id-ID")}</div>
          <p className="text-[11px] sm:text-xs text-text-muted mt-0.5">{todayOrders.length} transaksi</p>
        </div>

        {/* Active Orders */}
        <div className="bento-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-secondary-50 flex items-center justify-center">
              <IconQueue className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-500" />
            </div>
            <span className="text-xs sm:text-sm text-text-secondary">Aktif</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-text">{activeOrders.length}</div>
          <p className="text-[11px] sm:text-xs text-text-muted mt-0.5">diproses</p>
        </div>

        {/* Tables */}
        <div className="bento-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-amber-50 flex items-center justify-center">
              <IconTable className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <span className="text-xs sm:text-sm text-text-secondary">Meja</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-text">{occupiedTables.length}<span className="text-sm sm:text-base text-text-muted">/{tables.length}</span></div>
          <p className="text-[11px] sm:text-xs text-text-muted mt-0.5">aktif</p>
        </div>

        {/* Customers */}
        <div className="bento-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-green-50 flex items-center justify-center">
              <IconUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            </div>
            <span className="text-xs sm:text-sm text-text-secondary">Member</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-text">{customers.length}</div>
          <p className="text-[11px] sm:text-xs text-text-muted mt-0.5">terdaftar</p>
        </div>
      </div>

      {/* Main Content - stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bento-card-lg !p-4 md:!p-6">
          <h3 className="font-semibold text-sm sm:text-base text-text mb-3 md:mb-4 flex items-center gap-2">
            <IconOrders className="w-4 h-4 text-primary-500" />
            Pesanan Terbaru
          </h3>
          {orders.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-xl bg-surface-200 flex items-center justify-center">
                <IconCart className="w-6 h-6 sm:w-7 sm:h-7 text-text-muted" />
              </div>
              <p className="font-medium text-sm text-text-secondary">Belum ada pesanan hari ini</p>
              <p className="text-xs text-text-muted mt-1">Mulai transaksi pertama di Kasir</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 md:max-h-72 overflow-y-auto">
              {orders.slice(0, 8).map((order) => (
                <div key={order.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-surface-50 hover:bg-surface-200 transition-colors gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-white border border-primary-100 flex items-center justify-center text-[10px] sm:text-xs font-bold text-primary-700 flex-shrink-0">
                      #{order.orderNumber.slice(-3)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-xs sm:text-sm text-text block truncate">#{order.orderNumber}</span>
                      <span className="text-[10px] sm:text-xs text-text-muted">{order.items.length} item</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="font-semibold text-xs sm:text-sm text-text hidden sm:block">Rp {order.total.toLocaleString("id-ID")}</span>
                    <span className={`badge text-[10px] sm:text-xs ${
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

        {/* Right column - horizontal scroll on mobile, stacked on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
          {/* Low Stock */}
          <div className="bento-card col-span-2 sm:col-span-1">
            <h3 className="font-semibold text-xs sm:text-sm text-text mb-2 sm:mb-3 flex items-center gap-2">
              <IconIngredients className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-danger" />
              Stok Rendah
            </h3>
            {lowStockIngredients.length === 0 ? (
              <p className="text-xs sm:text-sm text-text-muted">Semua stok aman</p>
            ) : (
              <div className="space-y-1.5 sm:space-y-2">
                {lowStockIngredients.map((ing) => (
                  <div key={ing.id} className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-text-secondary truncate mr-2">{ing.name}</span>
                    <span className="badge-danger flex-shrink-0 text-[10px]">{ing.currentStock} {ing.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products count */}
          <div className="bento-card-accent col-span-1">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <IconProducts className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
              <span className="font-medium text-xs sm:text-sm text-primary-800">Produk</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-primary-900">{products.length}</div>
            <p className="text-[10px] sm:text-xs text-primary-600 mt-0.5">item aktif</p>
          </div>

          {/* Features - hidden on small mobile, shown on sm+ */}
          <div className="bento-card col-span-2 sm:col-span-1">
            <h3 className="font-medium text-xs sm:text-sm text-text mb-2 sm:mb-3">Fitur Aktif</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 sm:gap-2.5 text-xs sm:text-sm text-text-secondary">
              <div className="flex items-center gap-2"><IconQris className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-400 flex-shrink-0" /> QRIS</div>
              <div className="flex items-center gap-2"><IconWhatsapp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" /> WA Receipt</div>
              <div className="flex items-center gap-2"><IconScanner className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" /> Barcode</div>
              <div className="flex items-center gap-2"><IconKitchen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" /> Kitchen</div>
              <div className="flex items-center gap-2"><IconLoyalty className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400 flex-shrink-0" /> Loyalty</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
