"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard, IconCashier, IconCustomerDisplay, IconQueue,
  IconKitchen, IconProducts, IconTable, IconSelfOrder,
  IconLoyalty, IconIngredients, IconOrders, IconSettings,
} from "./Icons";

const menuItems = [
  { href: "/", label: "Dashboard", icon: IconDashboard },
  { href: "/cashier", label: "Kasir", icon: IconCashier },
  { href: "/customer-display", label: "Customer Display", icon: IconCustomerDisplay },
  { href: "/queue", label: "Antrian", icon: IconQueue },
  { href: "/kitchen", label: "Dapur", icon: IconKitchen },
  { href: "/products", label: "Produk", icon: IconProducts },
  { href: "/tables", label: "Meja & QR", icon: IconTable },
  { href: "/self-order", label: "Self Order", icon: IconSelfOrder },
  { href: "/loyalty", label: "Loyalty", icon: IconLoyalty },
  { href: "/ingredients", label: "Stok Bahan", icon: IconIngredients },
  { href: "/orders", label: "Riwayat", icon: IconOrders },
  { href: "/settings", label: "Pengaturan", icon: IconSettings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] min-h-screen bg-white border-r border-primary-100/80 flex flex-col">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-200 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-text">Nexo POS</h1>
            <p className="text-xs text-text-muted">Kasir Digital</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary-100/80 text-primary-800"
                  : "text-text-secondary hover:bg-surface-200 hover:text-text"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? "text-primary-600" : "text-text-muted"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 m-3 rounded-lg bg-surface-200 border border-primary-100/40">
        <p className="text-xs text-text-muted text-center">
          Nexo POS v1.0
        </p>
      </div>
    </aside>
  );
}
