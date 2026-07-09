"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Search, Menu, Plus, Wifi, ShoppingBag, AlertTriangle, CheckCircle } from "lucide-react";
import { useStore } from "@/store";
import { useAuth } from "@/lib/useAuth";

interface Notification {
  id: string;
  type: "order" | "stock" | "ready";
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

export default function Header({
  title,
  subtitle,
  onMenuToggle,
}: {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}) {
  const { orders, ingredientStock } = useStore();
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Generate notifications from store data
  useEffect(() => {
    const notifs: Notification[] = [];

    // Recent pending orders (last 30 min)
    const recentOrders = orders.filter(
      (o) => o.status === "pending" && new Date(o.createdAt) > new Date(Date.now() - 30 * 60 * 1000)
    );
    recentOrders.slice(0, 5).forEach((order) => {
      notifs.push({
        id: `order-${order.id}`,
        type: "order",
        title: "Pesanan Baru",
        message: `#${order.orderNumber} - ${order.items.length} item (Rp ${order.total.toLocaleString("id-ID")})`,
        time: new Date(order.createdAt),
        read: false,
      });
    });

    // Ready orders
    const readyOrders = orders.filter((o) => o.status === "ready");
    readyOrders.slice(0, 3).forEach((order) => {
      notifs.push({
        id: `ready-${order.id}`,
        type: "ready",
        title: "Pesanan Siap",
        message: `#${order.orderNumber} siap diambil`,
        time: new Date(order.createdAt),
        read: false,
      });
    });

    // Low stock ingredients
    const lowStock = ingredientStock.filter((i) => i.currentStock <= i.minimumStock);
    lowStock.slice(0, 3).forEach((item) => {
      notifs.push({
        id: `stock-${item.id}`,
        type: "stock",
        title: "Stok Rendah",
        message: `${item.name}: ${item.currentStock} ${item.unit} tersisa`,
        time: new Date(),
        read: false,
      });
    });

    setNotifications(notifs);
  }, [orders, ingredientStock]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.length;

  const getIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingBag className="w-4 h-4 text-primary-500" />;
      case "stock": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "ready": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-text-muted" />;
    }
  };

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 1) return "Baru saja";
    if (diff < 60) return `${diff} menit lalu`;
    if (diff < 1440) return `${Math.floor(diff / 60)} jam lalu`;
    return `${Math.floor(diff / 1440)} hari lalu`;
  };

  return (
    <header className="sticky top-0 z-20 bg-surface-200/80 backdrop-blur-xl border-b border-line/60">
      <div className="flex items-center justify-between gap-3 px-4 md:px-6 h-[68px]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-surface-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-text-secondary" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base md:text-lg font-bold text-text truncate leading-tight tracking-tight">
              {title}
            </h2>
            <p className="text-[11px] text-text-muted truncate hidden sm:block">
              {subtitle ?? today}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Search */}
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

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-xl bg-white border border-line shadow-bento hover:shadow-bento-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Notifikasi"
            >
              <Bell className="w-[18px] h-[18px] text-text-secondary" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 min-w-[16px] h-[16px] px-1 bg-danger rounded-full ring-2 ring-white flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-line shadow-lg overflow-hidden z-50">
                <div className="p-3 border-b border-line flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-text">Notifikasi</h3>
                  <span className="text-xs text-text-muted">{unreadCount} baru</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="w-8 h-8 mx-auto text-text-muted mb-2" />
                      <p className="text-sm text-text-muted">Tidak ada notifikasi</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="flex items-start gap-3 p-3 hover:bg-surface-200 transition-colors border-b border-line/40 last:border-0">
                        <div className="w-8 h-8 rounded-lg bg-surface-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text">{notif.title}</p>
                          <p className="text-xs text-text-secondary truncate">{notif.message}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">{timeAgo(notif.time)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
            {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
          </button>
        </div>
      </div>
    </header>
  );
}
