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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-5 mb-5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-sm text-dark-500">Tersedia</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-sm text-dark-500">Terpakai</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-sm text-dark-500">Reservasi</span></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {tables.map((table) => (
              <button key={table.id} onClick={() => setSelectedTable(table.id)}
                className={`card text-center transition-all hover:-translate-y-1 ${
                  table.status === "available" ? "border-emerald-200 bg-emerald-50/50" :
                  table.status === "occupied" ? "border-red-200 bg-red-50/50" : "border-amber-200 bg-amber-50/50"
                } ${selectedTable === table.id ? "ring-2 ring-primary-400 shadow-elevated" : ""}`}>
                <IconTable className={`w-6 h-6 mx-auto mb-1 ${
                  table.status === "available" ? "text-emerald-500" :
                  table.status === "occupied" ? "text-red-500" : "text-amber-500"
                }`} />
                <div className="text-2xl font-bold text-dark-800">{table.number}</div>
                <div className="text-xs text-dark-400">{table.seats} kursi</div>
                <div className={`text-xs font-medium mt-1 ${
                  table.status === "available" ? "text-emerald-600" :
                  table.status === "occupied" ? "text-red-600" : "text-amber-600"
                }`}>
                  {table.status === "available" ? "Kosong" : table.status === "occupied" ? "Terpakai" : "Reservasi"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="space-y-4">
          {selected ? (
            <>
              <div className="card">
                <h3 className="font-bold text-dark-800 mb-3">Meja {selected.number}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-dark-400">Kapasitas</span><span className="font-medium">{selected.seats} kursi</span></div>
                  <div className="flex justify-between"><span className="text-dark-400">Status</span><span className="font-medium capitalize">{selected.status}</span></div>
                </div>
                <div className="mt-4 space-y-2">
                  <button onClick={() => updateTableStatus(selectedTable!, "available")} className="btn-success w-full text-sm py-2.5">Tandai Kosong</button>
                  <button onClick={() => updateTableStatus(selectedTable!, "reserved")} className="btn-outline w-full text-sm py-2.5">Reservasi</button>
                </div>
              </div>
              <div className="card text-center">
                <h3 className="font-bold text-dark-800 mb-3 flex items-center justify-center gap-2">
                  <IconQris className="w-4 h-4 text-primary-500" /> QR Code Meja
                </h3>
                <div className="w-44 h-44 mx-auto bg-dark-50 rounded-2xl border border-dark-100 flex items-center justify-center mb-3">
                  <div className="text-center">
                    <IconQris className="w-14 h-14 text-dark-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-dark-500">MEJA {selected.number}</p>
                  </div>
                </div>
                <button className="btn-primary w-full text-sm py-2.5">
                  <IconPrinter className="w-4 h-4" /> Cetak QR Code
                </button>
                <p className="text-xs text-dark-400 mt-2">Pelanggan scan untuk self-order</p>
              </div>
              {getTableOrder(selectedTable!) && (
                <div className="card border-primary-200">
                  <h3 className="font-semibold text-sm text-dark-800 mb-2">Pesanan Aktif</h3>
                  <div className="text-sm space-y-1.5">
                    {getTableOrder(selectedTable!)?.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-dark-600">
                        <span>{item.product.name}</span><span className="font-medium">x{item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-dark-100 font-bold text-dark-800">
                      Total: Rp {getTableOrder(selectedTable!)?.total.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-16">
              <IconTable className="w-12 h-12 mx-auto text-dark-200 mb-3" />
              <p className="font-medium text-dark-400">Pilih Meja</p>
              <p className="text-sm text-dark-300 mt-1">Klik meja untuk detail & QR code</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
