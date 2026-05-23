"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";

export default function TablesPage() {
  const { tables, updateTableStatus, orders } = useStore();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const getTableOrder = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table?.currentOrderId) return null;
    return orders.find((o) => o.id === table.currentOrderId);
  };

  return (
    <MainLayout title="🪑 Meja & QR Code">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success border-2 border-text"></div>
              <span className="text-sm font-medium">Tersedia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-danger border-2 border-text"></div>
              <span className="text-sm font-medium">Terpakai</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning border-2 border-text"></div>
              <span className="text-sm font-medium">Reservasi</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                className={`card-brutal text-center transition-all hover:-translate-y-1 ${
                  table.status === "available"
                    ? "bg-green-50 border-success"
                    : table.status === "occupied"
                    ? "bg-red-50 border-danger"
                    : "bg-yellow-50 border-warning"
                } ${selectedTable === table.id ? "shadow-brutal-lg -translate-x-1 -translate-y-1" : ""}`}
              >
                <div className="text-3xl mb-1">🪑</div>
                <div className="text-2xl font-black">{table.number}</div>
                <div className="text-xs font-medium text-gray-500">{table.seats} kursi</div>
                <div
                  className={`mt-2 text-xs font-bold ${
                    table.status === "available"
                      ? "text-success"
                      : table.status === "occupied"
                      ? "text-danger"
                      : "text-warning"
                  }`}
                >
                  {table.status === "available" ? "Kosong" : table.status === "occupied" ? "Terpakai" : "Reservasi"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Table Detail / QR */}
        <div className="space-y-4">
          {selectedTable ? (
            <>
              <div className="card-brutal">
                <h3 className="font-black text-lg mb-3">
                  Meja {tables.find((t) => t.id === selectedTable)?.number}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Kapasitas</span>
                    <span className="font-bold">{tables.find((t) => t.id === selectedTable)?.seats} kursi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-bold capitalize">{tables.find((t) => t.id === selectedTable)?.status}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => updateTableStatus(selectedTable, "available")}
                    className="btn-brutal-success w-full text-sm py-2"
                  >
                    Tandai Kosong
                  </button>
                  <button
                    onClick={() => updateTableStatus(selectedTable, "reserved")}
                    className="btn-brutal-primary w-full text-sm py-2"
                  >
                    Reservasi
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="card-brutal text-center">
                <h3 className="font-black mb-3">📱 QR Code Meja</h3>
                <div className="w-48 h-48 mx-auto bg-white border-4 border-text flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🔲</div>
                    <p className="text-xs font-bold">MEJA {tables.find((t) => t.id === selectedTable)?.number}</p>
                    <p className="text-xs text-gray-400">Scan untuk order</p>
                  </div>
                </div>
                <button className="btn-brutal-secondary w-full text-sm py-2">
                  🖨️ Cetak QR Code
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Pelanggan scan untuk self-order
                </p>
              </div>

              {/* Active Order */}
              {getTableOrder(selectedTable) && (
                <div className="card-brutal border-secondary">
                  <h3 className="font-bold text-sm mb-2">Pesanan Aktif</h3>
                  <div className="text-sm space-y-1">
                    {getTableOrder(selectedTable)?.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.product.name}</span>
                        <span className="font-bold">x{item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 mt-2 font-black">
                      Total: Rp {getTableOrder(selectedTable)?.total.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card-brutal text-center py-12">
              <div className="text-5xl mb-3">👆</div>
              <p className="font-bold">Pilih Meja</p>
              <p className="text-sm text-gray-500 mt-1">Klik meja untuk melihat detail & QR code</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
