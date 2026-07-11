"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth, hasAccess } from "@/lib/useAuth";
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
  LogOut,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
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
  const { user, logout } = useAuth();

  // Filter menu items based on role
  const visibleMenuItems = user
    ? menuItems.filter((item) => hasAccess(user.role, item.href))
    : menuItems;

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
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto scrollbar-hide">
        {visibleMenuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center ${
                collapsed ? "justify-center px-0" : "gap-3 px-3"
              } py-2 rounded-xl text-sm font-medium transition-colors duration-300 min-h-[44px] group ${
                isActive
                  ? "text-white"
                  : "text-text-secondary hover:bg-surface-300 hover:text-text"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-primary-500 shadow-bento-md"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isActive
                    ? "bg-white/20"
                    : "bg-surface-300 group-hover:bg-white group-hover:scale-105"
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] transition-colors duration-300 ${
                    isActive ? "text-white" : "text-text-secondary group-hover:text-text"
                  }`}
                />
              </span>
              {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      {user && (
        <div className={`px-3 py-2 ${collapsed ? "text-center" : ""}`}>
          {!collapsed && (
            <div className="px-3 py-2 rounded-lg bg-surface-200 mb-2">
              <p className="text-xs font-semibold text-text truncate">{user.name}</p>
              <p className="text-[10px] text-text-muted capitalize">{user.role}</p>
            </div>
          )}
          <button
            onClick={logout}
            className={`w-full flex items-center ${
              collapsed ? "justify-center" : "gap-3 px-3"
            } py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors min-h-[40px]`}
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      )}

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
