"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowUpRight, ReceiptText } from "lucide-react";
import type { Order } from "@/store";

const statusChip: Record<Order["status"], { label: string; cls: string }> = {
  pending: { label: "Menunggu", cls: "bg-surface-300 text-text-secondary" },
  preparing: { label: "Diproses", cls: "bg-warning/10 text-warning" },
  ready: { label: "Siap", cls: "bg-secondary-100 text-secondary-600" },
  completed: { label: "Selesai", cls: "bg-success/10 text-success" },
  cancelled: { label: "Batal", cls: "bg-danger/10 text-danger" },
};

export default function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
      className="bento-card-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-surface-300 flex items-center justify-center">
            <ReceiptText className="w-5 h-5 text-text-secondary" />
          </span>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-text leading-tight">Pesanan Terbaru</h3>
            <p className="text-xs text-text-muted">Transaksi hari ini</p>
          </div>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors py-2"
        >
          Semua
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-surface-300 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-text-muted" />
          </div>
          <p className="font-medium text-sm text-text-secondary">Belum ada pesanan hari ini</p>
          <p className="text-xs text-text-muted mt-1">Mulai transaksi pertama di Kasir</p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-80 overflow-y-auto -mx-2 px-2">
          {orders.slice(0, 8).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl hover:bg-surface-200 transition-colors border border-transparent hover:border-line"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700 flex-shrink-0">
                  #{order.orderNumber.slice(-3)}
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-xs sm:text-sm text-text block truncate">
                    #{order.orderNumber}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {order.items.length} item · Rp {order.total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap flex-shrink-0 ${statusChip[order.status].cls}`}
              >
                {statusChip[order.status].label}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
