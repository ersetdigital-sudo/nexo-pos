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
    <aside className="w-[260px] min-h-screen bg-gradient-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Nexo POS</h1>
            <p className="text-[11px] font-medium text-dark-400">Kasir Digital Modern</p>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-white/10 text-white shadow-soft"
                  : "text-dark-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? "text-primary-400" : "text-dark-500 group-hover:text-dark-300"}`} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 mx-3 mb-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-[11px] font-medium text-dark-500 text-center">
          Nexo POS v1.0 &bull; Modern Kasir
        </p>
      </div>
    </aside>
  );
}
