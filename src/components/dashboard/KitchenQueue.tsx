"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat, ArrowUpRight, Clock, Flame, CheckCircle2 } from "lucide-react";
import type { Order } from "@/store";

export default function KitchenQueue({ orders }: { orders: Order[] }) {
  const waiting = orders.filter((o) => o.status === "pending");
  const preparing = orders.filter((o) => o.status === "preparing");
  const ready = orders.filter((o) => o.status === "ready");

  const stages = [
    { label: "Menunggu", count: waiting.length, icon: Clock, cls: "text-text-secondary", bg: "bg-surface-300" },
    { label: "Dimasak", count: preparing.length, icon: Flame, cls: "text-warning", bg: "bg-warning/10" },
    { label: "Siap", count: ready.length, icon: CheckCircle2, cls: "text-success", bg: "bg-success/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25, ease: "easeOut" }}
      className="bento-card-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-warning" />
          </span>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-text leading-tight">Antrian Dapur</h3>
            <p className="text-xs text-text-muted">Status pesanan aktif</p>
          </div>
        </div>
        <Link
          href="/kitchen"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors py-2"
        >
          Dapur
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.label}
              className="rounded-xl border border-line bg-surface-100 p-3 sm:p-4 text-center hover:shadow-bento transition-shadow"
            >
              <span className={`w-8 h-8 rounded-full ${stage.bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4 h-4 ${stage.cls}`} />
              </span>
              <div className="text-lg sm:text-2xl font-bold text-text leading-none">{stage.count}</div>
              <p className="text-[10px] sm:text-xs text-text-muted mt-1">{stage.label}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
