"use client";

import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import KitchenQueue from "@/components/dashboard/KitchenQueue";
import {
  LowStockPanel,
  PopularProductsPanel,
  TodaySummaryPanel,
} from "@/components/dashboard/SidePanels";
import { Wallet, ShoppingBag, Users, Package, Utensils, Clock } from "lucide-react";

export default function DashboardPage() {
  const { orders, products, customers, tables, ingredientStock } = useStore();

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
  );
  const completedToday = todayOrders.filter((o) => o.status === "completed");
  const todayRevenue = completedToday.reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  );
  const queueOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "preparing" || o.status === "ready"
  );
  const occupiedTables = tables.filter((t) => t.status === "occupied");
  const lowStockIngredients = ingredientStock.filter(
    (i) => i.currentStock <= i.minimumStock
  );
  const itemsSoldToday = completedToday.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const avgOrder = completedToday.length > 0 ? todayRevenue / completedToday.length : 0;

  // Yesterday comparison for trend indicators
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  const yesterdayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === yesterdayStr
  );
  const yesterdayRevenue = yesterdayOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  const pctTrend = (today: number, prev: number) => {
    if (prev === 0) return today > 0 ? "+100%" : undefined;
    const pct = ((today - prev) / prev) * 100;
    return `${pct >= 0 ? "+" : ""}${Math.round(pct)}%`;
  };
  const revenueTrend = pctTrend(todayRevenue, yesterdayRevenue);
  const ordersTrend = pctTrend(todayOrders.length, yesterdayOrders.length);

  const formatRupiah = (n: number) =>
    n >= 1000000
      ? `Rp ${(n / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`
      : `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <MainLayout title="Dashboard" subtitle="Ringkasan performa bisnis Anda hari ini">
      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-5 md:mb-8">
        <div className="col-span-2 md:col-span-1">
          <StatCard
            index={0}
            label="Pendapatan"
            value={todayRevenue}
            format={formatRupiah}
            description="hari ini"
            icon={Wallet}
            tone="orange"
            trend={revenueTrend}
            trendUp={todayRevenue >= yesterdayRevenue}
          />
        </div>
        <StatCard
          index={1}
          label="Pesanan"
          value={todayOrders.length}
          description={`${activeOrders.length} aktif`}
          icon={ShoppingBag}
          tone="neutral"
          trend={ordersTrend}
          trendUp={todayOrders.length >= yesterdayOrders.length}
        />
        <StatCard
          index={2}
          label="Member"
          value={customers.length}
          description="terdaftar"
          icon={Users}
          tone="green"
        />
        <StatCard
          index={3}
          label="Produk"
          value={products.length}
          description="item aktif"
          icon={Package}
          tone="neutral"
        />
        <StatCard
          index={4}
          label="Meja"
          value={`${occupiedTables.length}/${tables.length}`}
          description="terisi"
          icon={Utensils}
          tone="orange"
        />
        <StatCard
          index={5}
          label="Antrian"
          value={queueOrders.length}
          description="menunggu"
          icon={Clock}
          tone={queueOrders.length > 0 ? "red" : "neutral"}
        />
      </div>

      {/* Main content: left 70% / right 30% on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6">
          <RevenueChart orders={orders} />
          <RecentOrders orders={orders} />
          <KitchenQueue orders={orders} />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
          <LowStockPanel items={lowStockIngredients} />
          <PopularProductsPanel orders={orders} />
          <TodaySummaryPanel
            revenue={todayRevenue}
            transactions={completedToday.length}
            itemsSold={itemsSoldToday}
            avgOrder={avgOrder}
          />
        </div>
      </div>
    </MainLayout>
  );
}
