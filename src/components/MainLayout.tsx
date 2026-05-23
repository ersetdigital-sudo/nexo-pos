"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-200">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile overlay menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-[280px] h-full animate-fade-in">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

function MobileBottomNav() {
  const { usePathname } = require("next/navigation");
  const { default: Link } = require("next/link");
  const { IconDashboard, IconCashier, IconProducts, IconOrders, IconSettings } = require("./Icons");

  const pathname = usePathname();

  const items = [
    { href: "/", label: "Home", icon: IconDashboard },
    { href: "/cashier", label: "Kasir", icon: IconCashier },
    { href: "/display", label: "Display", icon: IconProducts },
    { href: "/orders", label: "Riwayat", icon: IconOrders },
    { href: "/settings", label: "Lainnya", icon: IconSettings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-primary-100/60 lg:hidden safe-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-2 px-1 rounded-lg transition-colors ${
                isActive ? "text-primary-700" : "text-text-muted"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary-600" : ""}`} />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
