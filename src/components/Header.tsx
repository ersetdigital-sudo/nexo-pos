"use client";

import Link from "next/link";
import { Bell, Search, Menu, Plus, Wifi } from "lucide-react";

export default function Header({ title, onMenuToggle }: { title: string; onMenuToggle?: () => void }) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 bg-surface-200/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2 px-4 md:px-6 h-16">
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-surface-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-text-secondary" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base md:text-lg font-bold text-text truncate leading-tight">{title}</h2>
            <p className="text-[11px] text-text-muted truncate hidden sm:block">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Search - full bar on desktop, icon on mobile */}
          <div className="hidden md:flex items-center gap-2 px-3.5 h-11 w-56 lg:w-64 rounded-xl bg-white border border-line shadow-bento focus-within:ring-2 focus-within:ring-primary-200/60 transition-all">
            <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
            <input
              type="search"
              placeholder="Cari produk, pesanan..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted !min-h-0 !text-sm"
            />
          </div>
          <button
            className="md:hidden p-2 rounded-xl hover:bg-surface-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-text-muted" />
          </button>

          {/* Online badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 h-9 rounded-full bg-white border border-line shadow-bento">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-xs font-medium text-text-secondary">Online</span>
            <Wifi className="w-3.5 h-3.5 text-success" />
          </div>

          {/* Notification */}
          <button
            className="relative p-2 rounded-xl bg-white border border-line shadow-bento hover:shadow-bento-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Notifikasi"
          >
            <Bell className="w-[18px] h-[18px] text-text-secondary" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
          </button>

          {/* Quick action */}
          <Link
            href="/cashier"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 h-11 rounded-xl bg-primary-500 text-white text-sm font-semibold shadow-bento-md hover:bg-primary-600 hover:shadow-bento-hover active:scale-[0.97] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Transaksi
          </Link>

          {/* Profile */}
          <button
            className="w-10 h-10 rounded-full bg-secondary-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-bento hover:shadow-bento-md transition-all"
            aria-label="Profil pengguna"
          >
            NP
          </button>
        </div>
      </div>
    </header>
  );
}
