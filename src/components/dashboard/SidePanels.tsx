"use client";

import { motion } from "framer-motion";
import { PackageOpen, Star, Wallet, AlertTriangle } from "lucide-react";
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
      className="bento-card"
    >
      {children}
    </motion.div>
  );
}

export function LowStockPanel({ items }: { items: IngredientStock[] }) {
  return (
    <PanelShell delay={0.2}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-9 h-9 rounded-full bg-danger/10 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-danger" />
        </span>
        <h3 className="font-semibold text-sm text-text">Stok Rendah</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-text-muted">Semua stok aman</p>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 5).map((ing) => (
            <div key={ing.id} className="flex justify-between items-center gap-2 text-sm">
              <span className="text-text-secondary truncate">{ing.name}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-danger/10 text-danger text-[11px] font-semibold flex-shrink-0">
                {ing.currentStock} {ing.unit}
              </span>
            </div>
          ))}
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

  return (
    <PanelShell delay={0.25}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
          <Star className="w-4 h-4 text-primary-600" />
        </span>
        <h3 className="font-semibold text-sm text-text">Produk Terlaris</h3>
      </div>
      {top.length === 0 ? (
        <p className="text-sm text-text-muted">Belum ada penjualan</p>
      ) : (
        <div className="space-y-2.5">
          {top.map((p, i) => (
            <div key={p.name} className="flex items-center gap-2.5 text-sm">
              <span className="w-6 h-6 rounded-md bg-surface-300 text-text-secondary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-text-secondary truncate flex-1">{p.name}</span>
              <span className="text-xs font-semibold text-text flex-shrink-0">{p.qty}x</span>
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
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-success" />
        </span>
        <h3 className="font-semibold text-sm text-text">Ringkasan Hari Ini</h3>
      </div>
      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-center gap-2 text-sm">
            <span className="text-text-muted">{row.label}</span>
            <span className="font-semibold text-text text-right">{row.value}</span>
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
        <span className="w-9 h-9 rounded-full bg-surface-300 flex items-center justify-center">
          <PackageOpen className="w-4 h-4 text-text-secondary" />
        </span>
        <p className="text-sm text-text-muted">Tambahkan produk untuk mulai berjualan</p>
      </div>
    </PanelShell>
  );
}
