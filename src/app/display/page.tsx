"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconCustomerDisplay, IconQueue, IconKitchen, IconClock, IconCheck, IconFire, IconCart } from "@/components/Icons";

type Tab = "customer" | "queue" | "kitchen";

export default function DisplayPage() {
  const [activeTab, setActiveTab] = useState<Tab>("queue");

  const tabs = [
    { id: "queue" as Tab, label: "Antrian", icon: IconQueue },
    { id: "kitchen" as Tab, label: "Dapur", icon: IconKitchen },
    { id: "customer" as Tab, label: "Pelanggan", icon: IconCustomerDisplay },
  ];

  return (
    <MainLayout title="Display">
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all min-h-[44px] ${
                activeTab === tab.id
                  ? "bg-primary-200 text-primary-800 shadow-bento"
                  : "bg-white border border-primary-100/60 text-text-secondary hover:bg-primary-50"
              }`}>
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "queue" && <QueueDisplay />}
      {activeTab === "kitchen" && <KitchenDisplay />}
      {activeTab === "customer" && <CustomerDisplay />}
    </MainLayout>
  );
}

/* ==================== QUEUE DISPLAY ==================== */
function QueueDisplay() {
  const { orders, updateOrderStatus } = useStore();
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");
  const pendingOrders = orders.filter((o) => o.status === "pending");

  const Column = ({ title, count, color, children }: { title: string; count: number; color: string; children: React.ReactNode }) => (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <h2 className="text-sm sm:text-base font-bold text-text">{title}</h2>
        <span className="badge-neutral">{count}</span>
      </div>
      <div className="space-y-2 sm:space-y-3">{children}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <Column title="Menunggu" count={pendingOrders.length} color="bg-gray-400">
        {pendingOrders.map((order) => (
          <div key={order.id} className="bento-card animate-slide-up">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-lg sm:text-2xl font-bold text-text">#{order.orderNumber}</span>
              <span className="badge-neutral">Baru</span>
            </div>
            <div className="text-xs sm:text-sm space-y-1 sm:space-y-1.5 mb-3 text-text-secondary">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between"><span className="truncate mr-2">{item.product.name}</span><span className="font-medium flex-shrink-0">x{item.quantity}</span></div>
              ))}
            </div>
            {order.tableNumber && <p className="text-xs sm:text-sm font-medium text-primary-600 mb-2 sm:mb-3">Meja {order.tableNumber}</p>}
            <button onClick={() => updateOrderStatus(order.id, "preparing")} className="btn-primary w-full text-xs sm:text-sm py-2.5 min-h-[44px]">
              <IconFire className="w-4 h-4" /> Mulai Proses
            </button>
          </div>
        ))}
        {pendingOrders.length === 0 && (
          <div className="text-center py-8 sm:py-10 text-text-muted">
            <IconCheck className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium">Tidak ada pesanan baru</p>
          </div>
        )}
      </Column>

      <Column title="Diproses" count={preparingOrders.length} color="bg-amber-500">
        {preparingOrders.map((order) => (
          <div key={order.id} className="bento-card border-amber-200 bg-amber-50/50">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-lg sm:text-2xl font-bold text-text">#{order.orderNumber}</span>
              <span className="badge-warning">Proses</span>
            </div>
            <div className="text-xs sm:text-sm space-y-1 sm:space-y-1.5 mb-3 text-text-secondary">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between"><span className="truncate mr-2">{item.product.name}</span><span className="font-medium flex-shrink-0">x{item.quantity}</span></div>
              ))}
            </div>
            {order.tableNumber && <p className="text-xs sm:text-sm font-medium text-primary-600 mb-2 sm:mb-3">Meja {order.tableNumber}</p>}
            <button onClick={() => updateOrderStatus(order.id, "ready")} className="btn-success w-full text-xs sm:text-sm py-2.5 min-h-[44px]">
              <IconCheck className="w-4 h-4" /> Siap Diambil
            </button>
          </div>
        ))}
        {preparingOrders.length === 0 && (
          <div className="text-center py-8 sm:py-10 text-text-muted">
            <IconClock className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium">Tidak ada yang diproses</p>
          </div>
        )}
      </Column>

      <Column title="Siap" count={readyOrders.length} color="bg-emerald-500">
        {readyOrders.map((order) => (
          <div key={order.id} className="bento-card border-emerald-200 bg-emerald-50/50">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-lg sm:text-2xl font-bold text-text">#{order.orderNumber}</span>
              <span className="badge-success">Siap</span>
            </div>
            <div className="text-xs sm:text-sm space-y-1 sm:space-y-1.5 mb-3 text-text-secondary">
              {order.items.map((item, i) => (<div key={i}>{item.product.name} x{item.quantity}</div>))}
            </div>
            {order.tableNumber && <p className="text-xs sm:text-sm font-medium text-primary-600 mb-2 sm:mb-3">Meja {order.tableNumber}</p>}
            <button onClick={() => updateOrderStatus(order.id, "completed")} className="btn-secondary w-full text-xs sm:text-sm py-2.5 min-h-[44px]">
              <IconCheck className="w-4 h-4" /> Selesai
            </button>
          </div>
        ))}
        {readyOrders.length === 0 && (
          <div className="text-center py-8 sm:py-10 text-text-muted">
            <IconCheck className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium">Belum ada yang siap</p>
          </div>
        )}
      </Column>
    </div>
  );
}

/* ==================== KITCHEN DISPLAY ==================== */
function KitchenDisplay() {
  const { orders, updateOrderStatus } = useStore();
  const kitchenOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing");

  if (kitchenOrders.length === 0) {
    return (
      <div className="text-center py-16 sm:py-24">
        <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <IconCheck className="w-8 sm:w-10 h-8 sm:h-10 text-emerald-500" />
        </div>
        <p className="text-lg sm:text-xl font-bold text-text-secondary">Semua Selesai!</p>
        <p className="text-xs sm:text-sm text-text-muted mt-2">Menunggu pesanan baru masuk...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {kitchenOrders.map((order) => (
        <div key={order.id}
          className={`bento-card transition-all ${
            order.status === "preparing" ? "border-amber-200 bg-amber-50/30" : ""
          }`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl sm:text-2xl font-bold text-text">#{order.orderNumber}</span>
            <span className={order.status === "preparing" ? "badge-warning" : "badge-neutral"}>
              {order.status === "preparing" ? "Proses" : "Baru"}
            </span>
          </div>
          {order.tableNumber && (
            <p className="text-xs sm:text-sm font-semibold text-primary-600 mb-2">Meja {order.tableNumber}</p>
          )}
          <div className="space-y-1.5 sm:space-y-2 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="p-2 sm:p-2.5 rounded-lg bg-surface-200 border border-primary-100/40">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-xs sm:text-sm text-text truncate mr-2">{item.product.name}</span>
                  <span className="text-base sm:text-lg font-bold text-primary-700 flex-shrink-0">x{item.quantity}</span>
                </div>
                {item.selectedVariations && item.selectedVariations.length > 0 && (
                  <p className="text-[10px] sm:text-xs text-amber-600 mt-0.5">
                    {item.selectedVariations.map((v) => {
                      const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                      return variation?.options.find((o) => o.id === v.optionId)?.label;
                    }).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-text-muted mb-3">
            <IconClock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {new Date(order.createdAt).toLocaleTimeString("id-ID")}
          </div>
          {order.status === "pending" ? (
            <button onClick={() => updateOrderStatus(order.id, "preparing")}
              className="btn-primary w-full text-xs sm:text-sm py-2.5 min-h-[44px] bg-amber-100 text-amber-800 hover:bg-amber-200">
              <IconFire className="w-4 h-4" /> Mulai Masak
            </button>
          ) : (
            <button onClick={() => updateOrderStatus(order.id, "ready")}
              className="btn-success w-full text-xs sm:text-sm py-2.5 min-h-[44px]">
              <IconCheck className="w-4 h-4" /> Selesai
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/* ==================== CUSTOMER DISPLAY ==================== */
function CustomerDisplay() {
  const { cart, orders, storeName, taxRate } = useStore();
  const activeOrder = orders.find((o) => o.status === "pending" || o.status === "preparing");
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="lg:col-span-2 bento-card-lg !p-4 sm:!p-6">
        <h2 className="text-base sm:text-lg font-bold text-text mb-4 flex items-center gap-2">
          <IconCart className="w-4 sm:w-5 h-4 sm:h-5 text-primary-500" />
          Pesanan Saat Ini
        </h2>
        {cart.length === 0 && !activeOrder ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-14 sm:w-16 h-14 sm:h-16 mx-auto mb-3 rounded-xl bg-primary-50 border border-primary-100/60 flex items-center justify-center">
              <IconCart className="w-7 sm:w-8 h-7 sm:h-8 text-text-muted" />
            </div>
            <p className="text-base sm:text-lg font-bold text-text-secondary">Selamat Datang!</p>
            <p className="text-xs sm:text-sm text-text-muted mt-1">Pesanan akan tampil di sini</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {(activeOrder?.items || cart).map((item, idx) => (
              <div key={item.id || idx}
                className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-primary-50 border border-primary-100/40">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{item.product.image}</span>
                  <div className="min-w-0">
                    <div className="font-medium text-sm sm:text-base text-text truncate">{item.product.name}</div>
                    {item.selectedVariations && item.selectedVariations.length > 0 && (
                      <div className="text-[10px] sm:text-xs text-primary-600 truncate">
                        {item.selectedVariations.map((v) => {
                          const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                          return variation?.options.find((o) => o.id === v.optionId)?.label;
                        }).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-xs text-text-muted">x{item.quantity}</div>
                  <div className="font-bold text-sm sm:text-base text-text">Rp {item.subtotal.toLocaleString("id-ID")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="bento-card-lg !p-4 sm:!p-6">
          <h3 className="font-bold text-sm sm:text-base text-text mb-3">Ringkasan</h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span><span>Rp {(activeOrder?.total || subtotal).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Pajak</span><span>Rp {tax.toLocaleString("id-ID")}</span>
            </div>
            <div className="pt-2 sm:pt-3 border-t border-primary-100/60">
              <div className="flex justify-between">
                <span className="text-base sm:text-lg font-bold text-text">Total</span>
                <span className="text-lg sm:text-xl font-bold text-primary-700">Rp {(activeOrder?.total || total).toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bento-card-accent">
          <h3 className="font-bold text-xs sm:text-sm text-primary-800 mb-1">Loyalty Points</h3>
          <p className="text-[10px] sm:text-xs text-primary-700">Setiap pembelian mendapatkan poin reward!</p>
        </div>
      </div>
    </div>
  );
}
