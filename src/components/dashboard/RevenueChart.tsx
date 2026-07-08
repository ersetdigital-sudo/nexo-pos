"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChartNoAxesCombined, TrendingDown, TrendingUp } from "lucide-react";
import type { Order } from "@/store";

const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-[240px] skeleton" />,
});

const formatRupiah = (n: number) =>
  n >= 1000000
    ? `Rp ${(n / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`
    : `Rp ${Math.round(n).toLocaleString("id-ID")}`;

export default function RevenueChart({ orders }: { orders: Order[] }) {
  const { categories, series, total, growth, avgTransaction } = useMemo(() => {
    const dayTotal = (offset: number) => {
      const d = new Date();
      d.setDate(d.getDate() - offset);
      const dayStr = d.toDateString();
      const dayOrders = orders.filter(
        (o) => o.status === "completed" && new Date(o.createdAt).toDateString() === dayStr
      );
      return {
        label: d.toLocaleDateString("id-ID", { weekday: "short" }),
        total: dayOrders.reduce((sum, o) => sum + o.total, 0),
        count: dayOrders.length,
      };
    };

    const days = [];
    for (let i = 6; i >= 0; i--) days.push(dayTotal(i));

    let prevTotal = 0;
    for (let i = 13; i >= 7; i--) prevTotal += dayTotal(i).total;

    const total = days.reduce((s, d) => s + d.total, 0);
    const count = days.reduce((s, d) => s + d.count, 0);
    const growth =
      prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : total > 0 ? 100 : 0;

    return {
      categories: days.map((d) => d.label),
      series: [{ name: "Pendapatan", data: days.map((d) => d.total) }],
      total,
      growth,
      avgTransaction: count > 0 ? total / count : 0,
    };
  }, [orders]);

  const options = useMemo(
    () => ({
      chart: {
        type: "area" as const,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "Inter, system-ui, sans-serif",
        animations: { enabled: true, speed: 700, easing: "easeout" as const },
      },
      colors: ["#FF8A3D"],
      stroke: { curve: "smooth" as const, width: 2.5, lineCap: "round" as const },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.28, opacityTo: 0, stops: [0, 100] },
      },
      dataLabels: { enabled: false },
      markers: {
        size: 0,
        strokeColors: "#FFFFFF",
        strokeWidth: 3,
        hover: { size: 6 },
      },
      grid: {
        borderColor: "#F1F3F6",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        padding: { left: 8, right: 8 },
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#94A3B8", fontSize: "12px" } },
        crosshairs: {
          stroke: { color: "#FFD6B8", width: 1, dashArray: 4 },
        },
      },
      yaxis: {
        labels: {
          style: { colors: "#94A3B8", fontSize: "11px" },
          formatter: (val: number) =>
            val >= 1000000
              ? `${(val / 1000000).toFixed(1)}jt`
              : val >= 1000
                ? `${Math.round(val / 1000)}rb`
                : `${val}`,
        },
      },
      tooltip: {
        y: { formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}` },
        marker: { show: false },
      },
    }),
    [categories]
  );

  const growthUp = growth >= 0;

  const summaryItems = [
    { label: "Total Pendapatan", value: formatRupiah(total) },
    {
      label: "Pertumbuhan",
      value: `${growthUp ? "+" : ""}${growth.toFixed(1)}%`,
      accent: true,
    },
    { label: "Rata-rata Transaksi", value: formatRupiah(avgTransaction) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
      className="bento-card-lg"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-primary-100 flex items-center justify-center">
            <ChartNoAxesCombined className="w-5 h-5 text-primary-600" />
          </span>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-text leading-tight">
              Pendapatan
            </h3>
            <p className="text-xs text-text-muted">7 hari terakhir</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
            growthUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          {growthUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {`${growthUp ? "+" : ""}${growth.toFixed(1)}%`}
        </span>
      </div>

      {/* Summary - stacked on mobile, 3 columns on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-3 mb-2 rounded-xl bg-surface-100 border border-line/70 divide-y sm:divide-y-0 sm:divide-x divide-line/70">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between sm:block px-4 py-3 min-w-0 gap-3"
          >
            <p className="text-xs sm:text-[11px] text-text-muted truncate">{item.label}</p>
            <p
              className={`sm:mt-0.5 text-sm sm:text-lg font-bold tracking-tight truncate tabular-nums flex-shrink-0 ${
                item.accent ? (growthUp ? "text-success" : "text-danger") : "text-text"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <ApexChart options={options} series={series} type="area" height={240} width="100%" />
    </motion.div>
  );
}
