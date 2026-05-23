"use client";

import { useStore } from "@/store";
import { IconCart, IconLoyalty, IconCash, IconQris, IconCard } from "@/components/Icons";

export default function CustomerDisplayPage() {
  const { cart, orders, storeName, taxRate } = useStore();

  const activeOrder = orders.find(
    (o) => o.status === "pending" || o.status === "preparing"
  );

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-surface-200 flex flex-col">
      {/* Header */}
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold text-text">{storeName}</h1>
        <p className="text-text-muted font-medium mt-1">Customer Display</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-8 pb-8">
        {/* Current Transaction */}
        <div className="flex-1">
          <div className="h-full bento-card-lg">
            <h2 className="text-xl font-bold text-text mb-5 flex items-center gap-2">
              <IconCart className="w-5 h-5 text-primary-500" />
              Pesanan Anda
            </h2>

            {cart.length === 0 && !activeOrder ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-50 border border-primary-100/60 flex items-center justify-center">
                  <IconCart className="w-10 h-10 text-text-muted" />
                </div>
                <p className="text-2xl font-bold text-text-secondary">Selamat Datang!</p>
                <p className="text-text-muted mt-2">Pesanan akan tampil di sini</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(activeOrder?.items || cart).map((item, idx) => (
                  <div key={item.id || idx}
                    className="flex justify-between items-center p-4 rounded-xl bg-primary-50 border border-primary-100/40 animate-slide-up">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.product.image}</span>
                      <div>
                        <div className="font-semibold text-text">{item.product.name}</div>
                        {item.selectedVariations && item.selectedVariations.length > 0 && (
                          <div className="text-sm text-primary-600">
                            {item.selectedVariations.map((v) => {
                              const variation = item.product.variations?.find((pv) => pv.id === v.variationId);
                              return variation?.options.find((o) => o.id === v.optionId)?.label;
                            }).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-muted">x{item.quantity}</div>
                      <div className="font-bold text-text">Rp {item.subtotal.toLocaleString("id-ID")}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="bento-card-lg">
            <h3 className="font-bold text-text mb-4">Ringkasan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>Rp {(activeOrder?.total || subtotal).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Pajak</span>
                <span>Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="pt-3 border-t border-primary-100/60">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-text">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    Rp {(activeOrder?.total || total).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-card-accent">
            <div className="flex items-center gap-2 mb-2">
              <IconLoyalty className="w-4 h-4 text-primary-600" />
              <h3 className="font-bold text-primary-800">Loyalty Points</h3>
            </div>
            <p className="text-sm text-primary-700">
              Setiap pembelian mendapatkan poin reward!
            </p>
          </div>

          <div className="bento-card">
            <h3 className="font-semibold text-text mb-3">Metode Pembayaran</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-primary-50 border border-primary-100/40">
                <IconCash className="w-5 h-5 mx-auto text-text-secondary mb-1" />
                <span className="text-xs text-text-secondary">Tunai</span>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary-50 border border-primary-100/40">
                <IconQris className="w-5 h-5 mx-auto text-text-secondary mb-1" />
                <span className="text-xs text-text-secondary">QRIS</span>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary-50 border border-primary-100/40">
                <IconCard className="w-5 h-5 mx-auto text-text-secondary mb-1" />
                <span className="text-xs text-text-secondary">Kartu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-primary-100/60">
        <p className="text-sm text-text-muted">Terima kasih telah berbelanja di <span className="text-text font-medium">{storeName}</span></p>
      </div>
    </div>
  );
}
