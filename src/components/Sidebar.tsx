"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MonitorSmartphone,
  Package,
  QrCode,
  Smartphone,
  ChartNoAxesCombined,
  Award,
  Boxes,
  History,
  Settings,
  Zap,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cashier", label: "Kasir", icon: ShoppingBag },
  { href: "/display", label: "Display", icon: MonitorSmartphone },
  { href: "/products", label: "Produk", icon: Package },
  { href: "/tables", label: "Meja & QR", icon: QrCode },
  { href: "/self-order", label: "Self Order", icon: Smartphone },
  { href: "/analytics", label: "Analitik", icon: ChartNoAxesCombined },
  { href: "/loyalty", label: "Loyalty", icon: Award },
  { href: "/ingredients", label: "Stok Bahan", icon: Boxes },
  { href: "/orders", label: "Riwayat", icon: History },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export default function Sidebar({
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        collapsed ? "w-[84px]" : "w-[260px]"
      } h-full flex flex-col rounded-2xl bg-white border border-line shadow-float transition-all duration-200 overflow-hidden`}
    >
      {/* Logo */}
      <div className={`p-5 pb-4 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0 shadow-bento">
          <Zap className="w-5 h-5 text-white" fill="currentColor" strokeWidth={0} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-base font-bold text-text leading-tight truncate">Nexo POS</h1>
            <p className="text-xs text-text-muted truncate">Kasir Digital</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={`flex items-center ${
                collapsed ? "justify-center px-0" : "gap-3 px-3"
              } py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] group ${
                isActive
                  ? "bg-primary-500 text-white shadow-bento-md"
                  : "text-text-secondary hover:bg-surface-300 hover:text-text"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive
                    ? "bg-white/20"
                    : "bg-surface-300 group-hover:bg-white"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-text-secondary"}`} />
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      {onToggleCollapse && (
        <div className="p-3 pt-2">
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center ${
              collapsed ? "justify-center" : "justify-between px-3"
            } py-2.5 rounded-xl text-xs font-medium text-text-muted hover:bg-surface-300 hover:text-text transition-colors min-h-[44px]`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!collapsed && <span>Ciutkan</span>}
            {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </button>
        </div>
      )}
    </aside>
  );
}
