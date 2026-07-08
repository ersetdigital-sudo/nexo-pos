"use client";

import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatTone = "orange" | "green" | "neutral" | "red";

const toneStyles: Record<StatTone, { iconBg: string; iconColor: string }> = {
  orange: { iconBg: "bg-primary-100", iconColor: "text-primary-600" },
  green: { iconBg: "bg-success/10", iconColor: "text-success" },
  neutral: { iconBg: "bg-surface-300", iconColor: "text-text-secondary" },
  red: { iconBg: "bg-danger/10", iconColor: "text-danger" },
};

function AnimatedValue({
  value,
  format,
}: {
  value: string | number;
  format?: (n: number) => string;
}) {
  const reducedMotion = useReducedMotion();
  const isNumeric = typeof value === "number";
  const [display, setDisplay] = useState(() =>
    isNumeric ? (format ? format(0) : "0") : String(value)
  );

  useEffect(() => {
    if (!isNumeric) {
      setDisplay(String(value));
      return;
    }
    if (reducedMotion) {
      setDisplay(format ? format(value) : Math.round(value).toLocaleString("id-ID"));
      return;
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v) => {
        const rounded = Math.round(v);
        setDisplay(format ? format(rounded) : rounded.toLocaleString("id-ID"));
      },
    });
    return () => controls.stop();
  }, [value, isNumeric, format, reducedMotion]);

  return <>{display}</>;
}

export default function StatCard({
  label,
  value,
  format,
  description,
  icon: Icon,
  tone = "neutral",
  trend,
  trendUp,
  index = 0,
}: {
  label: string;
  value: string | number;
  format?: (n: number) => string;
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
      className="bento-card !p-4 sm:!p-5 hover:shadow-bento-md hover:border-surface-400 h-full flex flex-row items-center gap-4 sm:flex-col sm:items-stretch sm:justify-between sm:gap-3"
    >
      {/* Icon - left on mobile, top row on desktop */}
      <div className="flex items-center justify-between gap-2 flex-shrink-0 sm:flex-shrink">
        <span
          className={`w-12 h-12 rounded-2xl ${styles.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300`}
        >
          <Icon className={`w-[22px] h-[22px] ${styles.iconColor}`} />
        </span>
        {trend && (
          <span
            className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
              trendUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            }`}
          >
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>

      {/* Value + label */}
      <div className="min-w-0 flex-1">
        <div className="text-[22px] sm:text-[28px] font-extrabold text-text tracking-tight leading-none truncate tabular-nums">
          <AnimatedValue value={value} format={format} />
        </div>
        <p className="mt-1 sm:mt-1.5 text-xs font-medium text-text-secondary truncate">
          {label} <span className="font-normal text-text-muted">· {description}</span>
        </p>
      </div>

      {/* Trend badge - right side on mobile only */}
      {trend && (
        <span
          className={`sm:hidden inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
            trendUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </span>
      )}
    </motion.div>
  );
}
