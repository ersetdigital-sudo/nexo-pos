"use client";

import { useState, useEffect } from "react";
import { CartItem } from "@/store";
import { IconCart, IconLoyalty, IconCash, IconQris, IconCard } from "@/components/Icons";

interface DisplayData {
  cart: CartItem[];
  storeName: string;
  taxRate: number;
  lastOrder?: {
    orderNumber: string;
    total: number;
    status: string;
  };
}

export default function CustomerDisplayPage() {
  const [data, setData] = useState<DisplayData>({
    cart: [],
    storeName: "Nexo POS",
    taxRate: 0.11,
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Listen for BroadcastChannel messages (same device, cross-tab)
    const channel = new BroadcastChannel("nexo-pos-display");

    channel.onmessage = (event) => {
      if (event.data.type === "CART_UPDATE") {
        setData((prev) => ({ ...prev, cart: event.data.cart }));
        setConnected(true);
      }
      if (event.data.type === "ORDER_CREATED") {
        setData((prev) => ({
          ...prev,
          cart: [],
          lastOrder: event.data.order,
        }));
      }
      if (event.data.type === "STORE_INFO") {
        setData((prev) => ({
          ...prev,
          storeName: event.data.storeName,
          taxRate: event.data.taxRate,
        }));
      }
    };

    // Also listen to localStorage changes (cross-tab fallback)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "nexo-display-cart" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData((prev) => ({ ...prev, cart: parsed }));
          setConnected(true);
        } catch {}
      }
      if (e.key === "nexo-display-order" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData((prev) => ({ ...prev, cart: [], lastOrder: parsed }));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorage);

    // Request initial data
    channel.postMessage({ type: "REQUEST_DATA" });

    // Check for existing localStorage data
    const existingCart = localStorage.getItem("nexo-display-cart");
    if (existingCart) {
      try {
        setData((prev) => ({ ...prev, cart: JSON.parse(existingCart) }));
        setConnected(true);
      } catch {}
    }

    return () => {
      channel.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const subtotal = data.cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * data.taxRate);
  const total = subtotal + tax;

  // Show order confirmation screen
  if (data.lastOrder) {
    return (
      <div className="min-h-screen bg-surface-200 flex flex-col items-center justify-center p-6">
        <div className="bento-card-lg text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">Pesanan Diterima!</h1>
          <p className="text-4xl sm:text-5xl font-bold text-primary-700 my-4">#{data.lastOrder.orderNumber}</p>
          <p className="text-base sm:text-lg font-semibold text-text-secondary">
            Total: Rp {data.lastOrder.total.toLocaleString("id-ID")}
          </p>
          <p className="text-sm text-text-muted mt-3">Pesanan sedang diproses...</p>
          <div className="mt-6 h-1 bg-primary-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-400 rounded-full animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-200 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 text-center border-b border-primary-100/60 bg-white">
        <h1 className="text-xl sm:text-3xl font-bold text-text">{data.storeName}</h1>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-amber-400 animate-pulse"}`} />
          <p className="text-xs sm:text-sm text-text-muted">
            {connected ? "Terhubung dengan Kasir" : "Menunggu koneksi kasir..."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bento-card-lg !p-4 sm:!p-6 h-full">
            <h2 className="text-base sm:text-lg font-bold text-text mb-4 flex items-center gap-2">
              <IconCart className="w-5 h-5 text-primary-500" />
              Pesanan Anda
              {data.cart.length > 0 && (
                <span className="badge-primary ml-auto">{data.cart.length} item</span>
              )}
            </h2>

            {data.cart.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 rounded-2xl bg-primary-50 border border-primary-100/60 flex items-center justify-center">
                  <IconCart className="w-8 sm:w-10 h-8 sm:h-10 text-text-muted" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-text-secondary">Selamat Datang!</p>
                <p className="text-sm text-text-muted mt-2">Pesanan akan tampil di sini secara otomatis</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {data.cart.map((item, idx) => (
                  <div key={item.id || idx}
                    className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-primary-50 border border-primary-100/40 animate-fade-in">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{item.product.image}</span>
                      <div className="min-w-0">
                        <div className="font-medium text-sm sm:text-base text-text truncate">{item.product.name}</div>
                        {item.selectedVariations && item.selectedVariations.length > 0 && (
                          <div className="text-xs text-primary-600 truncate">
                            {item.selectedVariations.map((v) => {
                              const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                              return variation?.options.find((o) => o.id === v.optionId)?.label;
                            }).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-xs text-text-muted">x{item.quantity}</div>
                      <div className="font-bold text-sm sm:text-base text-text">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-72 xl:w-80 space-y-4">
          <div className="bento-card-lg !p-4 sm:!p-6">
            <h3 className="font-bold text-text mb-3 text-sm sm:text-base">Ringkasan</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Pajak ({(data.taxRate * 100).toFixed(0)}%)</span>
                <span className="font-medium">Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="pt-3 border-t border-primary-100/60">
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold text-text">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary-700">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-card-accent">
            <div className="flex items-center gap-2 mb-1">
              <IconLoyalty className="w-4 h-4 text-primary-600" />
              <h3 className="font-bold text-primary-800 text-sm">Loyalty Points</h3>
            </div>
            <p className="text-xs text-primary-700">Tunjukkan no. HP untuk mengumpulkan poin!</p>
          </div>

          <div className="bento-card">
            <h3 className="font-medium text-text mb-3 text-sm">Pembayaran</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 rounded-lg bg-primary-50 border border-primary-100/40">
                <IconCash className="w-5 h-5 mx-auto text-text-secondary mb-1" />
                <span className="text-[10px] sm:text-xs text-text-secondary">Tunai</span>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-primary-50 border border-primary-100/40">
                <IconQris className="w-5 h-5 mx-auto text-text-secondary mb-1" />
                <span className="text-[10px] sm:text-xs text-text-secondary">QRIS</span>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-primary-50 border border-primary-100/40">
                <IconCard className="w-5 h-5 mx-auto text-text-secondary mb-1" />
                <span className="text-[10px] sm:text-xs text-text-secondary">Kartu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 border-t border-primary-100/60 bg-white">
        <p className="text-xs text-text-muted">
          Terima kasih telah berbelanja di <span className="font-medium text-text">{data.storeName}</span>
        </p>
      </div>
    </div>
  );
}
