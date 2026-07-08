"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChartNoAxesCombined, MoreHorizontal } from "lucide-react";
import type { Order } from "@/store";

const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-[240px] rounded-xl bg-surface-300 animate-pulse" />,
});

export default function RevenueChart({ orders }: { orders: Order[] }) {
  const { categories, series } = useMemo(() => {
    const days: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toDateString();
      const total = orders
        .filter(
          (o) => o.status === "completed" && new Date(o.createdAt).toDateString() === dayStr
        )
        .reduce((sum, o) => sum + o.total, 0);
      days.push({
        label: d.toLocaleDateString("id-ID", { weekday: "short" }),
        total,
      });
    }
    return {
      categories: days.map((d) => d.label),
      series: [{ name: "Pendapatan", data: days.map((d) => d.total) }],
    };
  }, [orders]);

  const options = useMemo(
    () => ({
      chart: {
        type: "area" as const,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "Inter, system-ui, sans-serif",
        animations: { enabled: true, speed: 600 },
      },
      colors: ["#FF8A3D"],
      stroke: { curve: "smooth" as const, width: 3 },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] },
      },
      dataLabels: { enabled: false },
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
      },
    }),
    [categories]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
      className="bento-card-lg"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <ChartNoAxesCombined className="w-5 h-5 text-primary-600" />
          </span>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-text leading-tight">Pendapatan</h3>
            <p className="text-xs text-text-muted">7 hari terakhir</p>
          </div>
        </div>
        <button
          className="p-1.5 rounded-lg text-text-muted hover:bg-surface-300 hover:text-text transition-colors"
          aria-label="Menu grafik pendapatan"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <ApexChart options={options} series={series} type="area" height={240} width="100%" />
    </motion.div>
  );
}
