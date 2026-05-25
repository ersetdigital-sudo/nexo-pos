"use client";

import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconTrendUp, IconCart, IconUsers, IconCash, IconQris, IconCard, IconProducts, IconTable, IconLoyalty, IconOrders } from "@/components/Icons";

export default function AnalyticsPage() {
  const { orders, products, customers, tables } = useStore();

  // --- Calculations ---
  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const cancelRate = totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0;

  // Top Products
  const productSales: Record<string, { name: string; image: string; qty: number; revenue: number }> = {};
  orders.filter(o => o.status !== "cancelled").forEach((order) => {
    order.items.forEach((item) => {
      const key = item.product.id;
      if (!productSales[key]) {
        productSales[key] = { name: item.product.name, image: item.product.image, qty: 0, revenue: 0 };
      }
      productSales[key].qty += item.quantity;
      productSales[key].revenue += item.subtotal;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 8);
  const maxQty = topProducts.length > 0 ? topProducts[0].qty : 1;

  // Payment Method Breakdown
  const paymentBreakdown = { cash: 0, qris: 0, card: 0 };
  completedOrders.forEach((o) => { paymentBreakdown[o.paymentMethod] += o.total; });
  const totalPayment = paymentBreakdown.cash + paymentBreakdown.qris + paymentBreakdown.card;

  // Order Type (Dine In vs Take Away)
  const dineInOrders = orders.filter((o) => o.tableNumber && o.status !== "cancelled").length;
  const takeAwayOrders = orders.filter((o) => !o.tableNumber && o.status !== "cancelled").length;
  const totalTypeOrders = dineInOrders + takeAwayOrders;

  // Category Breakdown
  const categorySales: Record<string, number> = {};
  orders.filter(o => o.status !== "cancelled").forEach((order) => {
    order.items.forEach((item) => {
      const cat = item.product.category;
      categorySales[cat] = (categorySales[cat] || 0) + item.subtotal;
    });
  });
  const categoryData = Object.entries(categorySales).sort((a, b) => b[1] - a[1]);
  const maxCatRevenue = categoryData.length > 0 ? categoryData[0][1] : 1;

  // Top Customers
  const customerSpending: Record<string, { name: string; phone: string; total: number; orders: number }> = {};
  completedOrders.forEach((o) => {
    const key = o.customerName || "Walk-in";
    if (!customerSpending[key]) {
      customerSpending[key] = { name: key, phone: o.customerPhone || "-", total: 0, orders: 0 };
    }
    customerSpending[key].total += o.total;
    customerSpending[key].orders += 1;
  });
  const topCustomers = Object.values(customerSpending).sort((a, b) => b.total - a.total).slice(0, 5);

  // Status Distribution
  const statusCounts = {
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    completed: completedOrders.length,
    cancelled: cancelledOrders,
  };

  // Hourly Sales (simulate from createdAt)
  const hourlySales: number[] = Array(24).fill(0);
  completedOrders.forEach((o) => {
    const hour = new Date(o.createdAt).getHours();
    hourlySales[hour] += o.total;
  });
  const maxHourlySale = Math.max(...hourlySales, 1);

  return (
    <MainLayout title="Analitik">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 md:mb-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <IconTrendUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            </div>
            <span className="text-[10px] sm:text-xs text-[#6B7280]">Total Revenue</span>
          </div>
          <div className="text-base sm:text-xl font-bold text-[#111827]">Rp {totalRevenue.toLocaleString("id-ID")}</div>
          <p className="text-[10px] sm:text-xs text-green-600 mt-0.5">{completedOrders.length} transaksi selesai</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <IconCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
            <span className="text-[10px] sm:text-xs text-[#6B7280]">Total Orders</span>
          </div>
          <div className="text-base sm:text-xl font-bold text-[#111827]">{totalOrders}</div>
          <p className="text-[10px] sm:text-xs text-[#6B7280] mt-0.5">semua status</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <IconOrders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316]" />
            </div>
            <span className="text-[10px] sm:text-xs text-[#6B7280]">Rata-rata Order</span>
          </div>
          <div className="text-base sm:text-xl font-bold text-[#F97316]">Rp {avgOrderValue.toLocaleString("id-ID")}</div>
          <p className="text-[10px] sm:text-xs text-[#6B7280] mt-0.5">per transaksi</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <IconOrders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
            </div>
            <span className="text-[10px] sm:text-xs text-[#6B7280]">Cancel Rate</span>
          </div>
          <div className="text-base sm:text-xl font-bold text-[#111827]">{cancelRate}%</div>
          <p className="text-[10px] sm:text-xs text-red-500 mt-0.5">{cancelledOrders} pesanan dibatalkan</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5">
          <h3 className="font-bold text-sm sm:text-base text-[#111827] mb-4 flex items-center gap-2">
            <IconProducts className="w-4 h-4 text-[#F97316]" />
            Menu Terlaris
          </h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-8">Belum ada data penjualan</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl w-8 text-center flex-shrink-0">{item.image}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-medium text-[#111827] truncate mr-2">{item.name}</span>
                      <span className="text-[10px] sm:text-xs text-[#6B7280] flex-shrink-0">{item.qty} terjual</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#F97316] to-[#FDBA74] rounded-full transition-all" style={{ width: `${(item.qty / maxQty) * 100}%` }} />
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">Rp {item.revenue.toLocaleString("id-ID")}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Payment Breakdown */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5">
            <h3 className="font-bold text-sm text-[#111827] mb-3 flex items-center gap-2">
              <IconCash className="w-4 h-4 text-green-600" />
              Metode Pembayaran
            </h3>
            <div className="space-y-3">
              {[
                { label: "Cash", value: paymentBreakdown.cash, icon: IconCash, color: "bg-gray-200", textColor: "text-gray-700" },
                { label: "QRIS", value: paymentBreakdown.qris, icon: IconQris, color: "bg-purple-200", textColor: "text-purple-700" },
                { label: "Card", value: paymentBreakdown.card, icon: IconCard, color: "bg-blue-200", textColor: "text-blue-700" },
              ].map((method) => {
                const pct = totalPayment > 0 ? Math.round((method.value / totalPayment) * 100) : 0;
                const Icon = method.icon;
                return (
                  <div key={method.label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${method.textColor}`} />
                        <span className="text-xs font-medium text-[#374151]">{method.label}</span>
                      </div>
                      <span className="text-xs text-[#6B7280]">{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${method.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">Rp {method.value.toLocaleString("id-ID")}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Type */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5">
            <h3 className="font-bold text-sm text-[#111827] mb-3 flex items-center gap-2">
              <IconTable className="w-4 h-4 text-blue-600" />
              Tipe Pesanan
            </h3>
            <div className="flex gap-3">
              <div className="flex-1 text-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-lg sm:text-xl font-bold text-blue-700">{dineInOrders}</div>
                <div className="text-[10px] sm:text-xs text-blue-600">Dine In</div>
                <div className="text-[10px] text-[#6B7280] mt-0.5">{totalTypeOrders > 0 ? Math.round((dineInOrders / totalTypeOrders) * 100) : 0}%</div>
              </div>
              <div className="flex-1 text-center p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="text-lg sm:text-xl font-bold text-green-700">{takeAwayOrders}</div>
                <div className="text-[10px] sm:text-xs text-green-600">Take Away</div>
                <div className="text-[10px] text-[#6B7280] mt-0.5">{totalTypeOrders > 0 ? Math.round((takeAwayOrders / totalTypeOrders) * 100) : 0}%</div>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5">
            <h3 className="font-bold text-sm text-[#111827] mb-3">Status Pesanan</h3>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[
                { label: "Pending", count: statusCounts.pending, color: "bg-gray-100 text-gray-700" },
                { label: "Proses", count: statusCounts.preparing, color: "bg-amber-50 text-amber-700" },
                { label: "Siap", count: statusCounts.ready, color: "bg-blue-50 text-blue-700" },
                { label: "Selesai", count: statusCounts.completed, color: "bg-green-50 text-green-700" },
                { label: "Batal", count: statusCounts.cancelled, color: "bg-red-50 text-red-700" },
              ].map((s) => (
                <div key={s.label} className={`p-2 rounded-lg ${s.color}`}>
                  <div className="text-sm sm:text-base font-bold">{s.count}</div>
                  <div className="text-[9px] sm:text-[10px] font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-5">
        {/* Hourly Sales */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5">
          <h3 className="font-bold text-sm sm:text-base text-[#111827] mb-4 flex items-center gap-2">
            <IconTrendUp className="w-4 h-4 text-blue-600" />
            Penjualan per Jam
          </h3>
          <div className="flex items-end gap-0.5 sm:gap-1 h-32 sm:h-40">
            {hourlySales.map((sale, hour) => (
              <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm relative group" style={{ height: `${Math.max((sale / maxHourlySale) * 100, 2)}%` }}>
                  <div className={`w-full h-full rounded-t-sm ${sale > 0 ? "bg-gradient-to-t from-[#F97316] to-[#FDBA74]" : "bg-gray-100"}`} />
                  {sale > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Rp{(sale / 1000).toFixed(0)}K
                    </div>
                  )}
                </div>
                {hour % 3 === 0 && <span className="text-[8px] sm:text-[9px] text-[#6B7280]">{hour}</span>}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] sm:text-[10px] text-[#6B7280] mt-2">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        {/* Category & Top Customers */}
        <div className="space-y-4">
          {/* Category Revenue */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5">
            <h3 className="font-bold text-sm text-[#111827] mb-3 flex items-center gap-2">
              <IconProducts className="w-4 h-4 text-purple-600" />
              Revenue per Kategori
            </h3>
            <div className="space-y-2.5">
              {categoryData.map(([cat, revenue]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#374151]">{cat}</span>
                    <span className="text-[10px] text-[#6B7280]">Rp {revenue.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-purple-200 rounded-full" style={{ width: `${(revenue / maxCatRevenue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5">
            <h3 className="font-bold text-sm text-[#111827] mb-3 flex items-center gap-2">
              <IconUsers className="w-4 h-4 text-[#F97316]" />
              Top Pelanggan
            </h3>
            {topCustomers.length === 0 ? (
              <p className="text-xs text-[#6B7280] text-center py-4">Belum ada data</p>
            ) : (
              <div className="space-y-2.5">
                {topCustomers.map((cust, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#FFF0E6] flex items-center justify-center text-[10px] font-bold text-[#F97316] flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#111827] truncate">{cust.name}</div>
                        <div className="text-[10px] text-[#6B7280]">{cust.orders} order</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#111827] flex-shrink-0 ml-2">Rp {cust.total.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
