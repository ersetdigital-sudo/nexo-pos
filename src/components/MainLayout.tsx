"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { LayoutDashboard, ShoppingBag, MonitorSmartphone, History, Settings } from "lucide-react";

export default function MainLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-200">
      {/* Desktop floating sidebar - hidden on mobile */}
      <div className="hidden lg:block sticky top-0 h-screen p-4 pr-0 flex-shrink-0">
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      </div>

      {/* Mobile overlay menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative h-full p-3 w-[280px] animate-slide-up">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} subtitle={subtitle} onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 px-4 md:px-6 pt-1 pb-24 lg:pb-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/cashier", label: "Kasir", icon: ShoppingBag },
    { href: "/display", label: "Display", icon: MonitorSmartphone },
    { href: "/orders", label: "Riwayat", icon: History },
    { href: "/settings", label: "Lainnya", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 lg:hidden safe-bottom">
      <div className="flex items-center justify-around h-16 rounded-2xl bg-white/90 backdrop-blur-xl border border-line shadow-float">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1.5 px-1"
            >
              <span
                className={`w-9 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? "bg-primary-100" : ""
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-primary-600" : "text-text-muted"}`} />
              </span>
              <span
                className={`text-[10px] font-medium leading-tight ${
                  isActive ? "text-primary-700" : "text-text-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
