"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/cashier", label: "Kasir", icon: "💰" },
  { href: "/customer-display", label: "Customer Display", icon: "📺" },
  { href: "/queue", label: "Antrian", icon: "📋" },
  { href: "/kitchen", label: "Dapur", icon: "🍳" },
  { href: "/products", label: "Produk", icon: "📦" },
  { href: "/tables", label: "Meja & QR", icon: "🪑" },
  { href: "/self-order", label: "Self Order", icon: "📱" },
  { href: "/loyalty", label: "Loyalty", icon: "⭐" },
  { href: "/ingredients", label: "Stok Bahan", icon: "🧪" },
  { href: "/orders", label: "Riwayat", icon: "📃" },
  { href: "/settings", label: "Pengaturan", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r-2 border-text flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b-2 border-text bg-primary">
        <h1 className="text-2xl font-black tracking-tight">NEXO POS</h1>
        <p className="text-xs font-semibold opacity-75">Kasir Digital Modern</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 font-semibold text-sm border-2 transition-all duration-100 ${
                isActive
                  ? "bg-primary border-text shadow-brutal-sm translate-x-0"
                  : "border-transparent hover:border-text hover:shadow-brutal-sm hover:bg-yellow-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t-2 border-text bg-gray-50">
        <p className="text-xs font-medium text-gray-500 text-center">
          v1.0.0 &bull; Made with 🔥
        </p>
      </div>
    </aside>
  );
}
