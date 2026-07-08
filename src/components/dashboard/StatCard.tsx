"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatTone = "orange" | "green" | "neutral" | "red";

const toneStyles: Record<StatTone, { iconBg: string; iconColor: string }> = {
  orange: { iconBg: "bg-primary-100", iconColor: "text-primary-600" },
  green: { iconBg: "bg-success/10", iconColor: "text-success" },
  neutral: { iconBg: "bg-surface-300", iconColor: "text-text-secondary" },
  red: { iconBg: "bg-danger/10", iconColor: "text-danger" },
};

export default function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "neutral",
  trend,
  trendUp,
  index = 0,
}: {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: StatTone;
  trend?: string;
  trendUp?: boolean;
  index?: number;
}) {
  const styles = toneStyles[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="bento-card hover:shadow-bento-md"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <span className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${styles.iconBg} flex items-center justify-center`}>
          <Icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 ${styles.iconColor}`} />
        </span>
        <button
          className="p-1.5 -m-1 rounded-lg text-text-muted hover:bg-surface-300 hover:text-text transition-colors"
          aria-label={`Menu ${label}`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xl sm:text-3xl font-bold text-text tracking-tight leading-none truncate">
        {value}
      </div>

      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className="text-[13px] font-medium text-text-secondary">{label}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
              trendUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            }`}
          >
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted mt-0.5">{description}</p>
    </motion.div>
  );
}
