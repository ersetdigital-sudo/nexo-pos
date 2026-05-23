"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconQris, IconPrinter, IconTable } from "@/components/Icons";

export default function TablesPage() {
  const { tables, updateTableStatus, orders } = useStore();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const getTableOrder = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table?.currentOrderId) return null;
    return orders.find((o) => o.id === table.currentOrderId);
  };

  const selected = tables.find((t) => t.id === selectedTable);

  return (
    <MainLayout title="Meja & QR Code">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Table Grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 sm:gap-5 mb-4 sm:mb-5 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs sm:text-sm text-text-secondary">Tersedia</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs sm:text-sm text-text-secondary">Terpakai</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs sm:text-sm text-text-secondary">Reservasi</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {tables.map((table) => (
              <button key={table.id} onClick={() => setSelectedTable(table.id)}
                className={`bento-card !p-3 sm:!p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-bento-md min-h-[44px] ${
                  table.status === "available"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : table.status === "occupied"
                    ? "border-red-200 bg-red-50/50"
                    : "border-amber-200 bg-amber-50/50"
                } ${selectedTable === table.id ? "ring-2 ring-primary-300 shadow-bento-lg" : ""}`}>
                <IconTable className={`w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-1 ${
                  table.status === "available"
                    ? "text-emerald-500"
                    : table.status === "occupied"
                    ? "text-red-500"
                    : "text-amber-500"
                }`} />
                <div className="text-xl sm:text-2xl font-bold text-text">{table.number}</div>
                <div className="text-xs text-text-muted">{table.seats} kursi</div>
                <div className={`text-xs font-medium mt-1 ${
                  table.status === "available"
                    ? "text-emerald-600"
                    : table.status === "occupied"
                    ? "text-red-600"
                    : "text-amber-600"
                }`}>
                  {table.status === "available"
                    ? "Kosong"
                    : table.status === "occupied"
                    ? "Terpakai"
                    : "Reservasi"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="space-y-4">
          {selected ? (
            <>
              <div className="bento-card !p-3 sm:!p-4">
                <h3 className="font-bold text-text mb-3 text-sm sm:text-base">Meja {selected.number}</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Kapasitas</span>
                    <span className="font-medium">{selected.seats} kursi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Status</span>
                    <span className="font-medium capitalize">{selected.status}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => updateTableStatus(selectedTable!, "available")}
                    className="btn-success w-full text-sm py-2.5 min-h-[44px]"
                  >
                    Tandai Kosong
                  </button>
                  <button
                    onClick={() => updateTableStatus(selectedTable!, "reserved")}
                    className="btn-outline w-full text-sm py-2.5 min-h-[44px]"
                  >
                    Reservasi
                  </button>
                </div>
              </div>

              <div className="bento-card !p-3 sm:!p-4 text-center">
                <h3 className="font-bold text-text mb-3 flex items-center justify-center gap-2 text-sm sm:text-base">
                  <IconQris className="w-4 h-4 text-primary-500" /> QR Code Meja
                </h3>
                <div className="w-32 h-32 sm:w-44 sm:h-44 mx-auto bg-primary-50 rounded-2xl border border-primary-100/60 flex items-center justify-center mb-3">
                  <div className="text-center">
                    <IconQris className="w-10 sm:w-14 h-10 sm:h-14 text-text-muted mx-auto mb-2" />
                    <p className="text-xs font-semibold text-text-secondary">MEJA {selected.number}</p>
                  </div>
                </div>
                <button className="btn-primary w-full text-sm py-2.5 min-h-[44px]">
                  <IconPrinter className="w-4 h-4" /> Cetak QR Code
                </button>
                <p className="text-xs text-text-muted mt-2">Pelanggan scan untuk self-order</p>
              </div>
              {getTableOrder(selectedTable!) && (
                <div className="bento-card !p-3 sm:!p-4 border-primary-200">
                  <h3 className="font-semibold text-xs sm:text-sm text-text mb-2">Pesanan Aktif</h3>
                  <div className="text-xs sm:text-sm space-y-1.5">
                    {getTableOrder(selectedTable!)?.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-text-secondary">
                        <span className="truncate mr-2">{item.product.name}</span>
                        <span className="font-medium flex-shrink-0">x{item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-primary-100/60 font-bold text-text">
                      Total: Rp {getTableOrder(selectedTable!)?.total.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bento-card text-center py-10 sm:py-16">
              <IconTable className="w-12 h-12 mx-auto text-text-muted mb-3" />
              <p className="font-medium text-text-secondary text-sm sm:text-base">Pilih Meja</p>
              <p className="text-xs sm:text-sm text-text-muted mt-1">Klik meja untuk detail & QR code</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
