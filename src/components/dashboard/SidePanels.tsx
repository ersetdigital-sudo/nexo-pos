"use client";

import { motion } from "framer-motion";
import { PackageOpen, Flame, Wallet, TriangleAlert, CheckCircle2 } from "lucide-react";
import type { IngredientStock, Order } from "@/store";

function PanelShell({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="bento-card hover:shadow-bento-md"
    >
      {children}
    </motion.div>
  );
}

function ProgressBar({
  pct,
  color,
  delay = 0,
}: {
  pct: number;
  color: string;
  delay?: number;
}) {
  return (
    <div className="h-1.5 rounded-full bg-surface-300 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

export function LowStockPanel({ items }: { items: IngredientStock[] }) {
  return (
    <PanelShell delay={0.2}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-10 h-10 rounded-2xl bg-danger/10 flex items-center justify-center">
          <TriangleAlert className="w-[18px] h-[18px] text-danger" />
        </span>
        <div>
          <h3 className="font-semibold text-sm text-text leading-tight">Stok Rendah</h3>
          <p className="text-[11px] text-text-muted">Perlu segera diisi ulang</p>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="flex items-center gap-2.5 rounded-xl bg-success/5 border border-success/10 px-3 py-3">
          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
          <p className="text-sm text-text-secondary">Semua stok aman</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {items.slice(0, 5).map((ing, i) => {
            const pct =
              ing.minimumStock > 0 ? (ing.currentStock / ing.minimumStock) * 100 : 0;
            return (
              <div key={ing.id}>
                <div className="flex justify-between items-center gap-2 text-sm mb-1.5">
                  <span className="text-text-secondary truncate font-medium">{ing.name}</span>
                  <span className="text-[11px] font-semibold text-danger flex-shrink-0 tabular-nums">
                    {ing.currentStock} {ing.unit}
                  </span>
                </div>
                <ProgressBar pct={pct} color="bg-danger" delay={0.25 + i * 0.06} />
              </div>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}

export function PopularProductsPanel({ orders }: { orders: Order[] }) {
  const counts = new Map<string, { name: string; qty: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const existing = counts.get(item.product.id);
      if (existing) existing.qty += item.quantity;
      else counts.set(item.product.id, { name: item.product.name, qty: item.quantity });
    }
  }
  const top = Array.from(counts.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);
  const maxQty = top.length > 0 ? top[0].qty : 1;

  return (
    <PanelShell delay={0.25}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center">
          <Flame className="w-[18px] h-[18px] text-primary-600" />
        </span>
        <div>
          <h3 className="font-semibold text-sm text-text leading-tight">Produk Terlaris</h3>
          <p className="text-[11px] text-text-muted">Berdasarkan jumlah terjual</p>
        </div>
      </div>
      {top.length === 0 ? (
        <p className="text-sm text-text-muted">Belum ada penjualan</p>
      ) : (
        <div className="space-y-3.5">
          {top.map((p, i) => (
            <div key={p.name}>
              <div className="flex items-center gap-2.5 text-sm mb-1.5">
                <span
                  className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${
                    i === 0
                      ? "bg-primary-100 text-primary-700"
                      : "bg-surface-300 text-text-secondary"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-text-secondary truncate flex-1 font-medium">{p.name}</span>
                <span className="text-xs font-semibold text-text flex-shrink-0 tabular-nums">
                  {p.qty}x
                </span>
              </div>
              <ProgressBar
                pct={(p.qty / maxQty) * 100}
                color={i === 0 ? "bg-primary-500" : "bg-primary-300"}
                delay={0.3 + i * 0.06}
              />
            </div>
          ))}
        </div>
      )}
    </PanelShell>
  );
}

export function TodaySummaryPanel({
  revenue,
  transactions,
  itemsSold,
  avgOrder,
}: {
  revenue: number;
  transactions: number;
  itemsSold: number;
  avgOrder: number;
}) {
  const rows = [
    { label: "Pendapatan", value: `Rp ${revenue.toLocaleString("id-ID")}` },
    { label: "Transaksi", value: `${transactions}` },
    { label: "Item terjual", value: `${itemsSold}` },
    { label: "Rata-rata order", value: `Rp ${Math.round(avgOrder).toLocaleString("id-ID")}` },
  ];

  return (
    <PanelShell delay={0.3}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center">
          <Wallet className="w-[18px] h-[18px] text-success" />
        </span>
        <div>
          <h3 className="font-semibold text-sm text-text leading-tight">Ringkasan Hari Ini</h3>
          <p className="text-[11px] text-text-muted">Performa penjualan</p>
        </div>
      </div>
      <div className="space-y-1">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center gap-2 text-sm rounded-lg px-2 py-1.5 -mx-2 hover:bg-surface-200 transition-colors"
          >
            <span className="text-text-muted">{row.label}</span>
            <span className="font-semibold text-text text-right tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export function EmptyProductsHint() {
  return (
    <PanelShell delay={0.25}>
      <div className="flex items-center gap-2.5">
        <span className="w-10 h-10 rounded-2xl bg-surface-300 flex items-center justify-center">
          <PackageOpen className="w-[18px] h-[18px] text-text-secondary" />
        </span>
        <p className="text-sm text-text-muted">Tambahkan produk untuk mulai berjualan</p>
      </div>
    </PanelShell>
  );
}
