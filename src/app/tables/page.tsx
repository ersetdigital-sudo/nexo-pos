"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconQris, IconPrinter, IconTable } from "@/components/Icons";

function generateQRCodeSVG(text: string, size: number = 200): string {
  const modules = 25;
  const cellSize = size / modules;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  svg += `<rect width="${size}" height="${size}" fill="white"/>`;

  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return h;
  };

  const seed = hash(text);
  const pattern: boolean[][] = Array(modules).fill(null).map(() => Array(modules).fill(false));

  const drawFinder = (sx: number, sy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (y === 0 || y === 6 || x === 0 || x === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) {
          pattern[sy + y][sx + x] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(modules - 7, 0);
  drawFinder(0, modules - 7);

  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      if (pattern[y][x]) continue;
      if ((x < 8 && y < 8) || (x >= modules - 8 && y < 8) || (x < 8 && y >= modules - 8)) continue;
      const val = hash(`${text}-${x}-${y}-${seed}`) & 0xFFFF;
      if (val % 3 !== 0) pattern[y][x] = true;
    }
  }

  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      if (pattern[y][x]) {
        svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#111827" rx="0.5"/>`;
      }
    }
  }
  svg += `</svg>`;
  return svg;
}

export default function TablesPage() {
  const { tables, updateTableStatus, orders, storeName } = useStore();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const getTableOrder = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table?.currentOrderId) return null;
    return orders.find((o) => o.id === table.currentOrderId);
  };

  const selected = tables.find((t) => t.id === selectedTable);

  const getQRUrl = (tableNumber: number) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://nexo-pos-six.vercel.app";
    return `${baseUrl}/self-order?table=${tableNumber}`;
  };

  const handleDownloadQR = () => {
    if (!selected) return;
    const svgContent = generateQRCodeSVG(getQRUrl(selected.number), 400);
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-meja-${selected.number}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintQR = () => {
    if (!selected) return;
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>QR Meja ${selected.number}</title>
      <style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,sans-serif;}
      .card{text-align:center;padding:40px;border:2px dashed #E5D5C5;border-radius:16px;}
      .logo{font-size:14px;font-weight:700;color:#111827;margin-bottom:8px;}
      .num{font-size:32px;font-weight:800;color:#111827;margin:16px 0 8px;}
      .sub{font-size:12px;color:#6B7280;}
      .qr{margin:24px auto;}
      .url{font-size:10px;color:#9CA3AF;margin-top:16px;word-break:break-all;}
      @media print{body{margin:0;}.card{border:none;}}</style></head>
      <body><div class="card">
      <div class="logo">${storeName}</div>
      <div class="num">MEJA ${selected.number}</div>
      <div class="sub">Scan untuk Self-Order</div>
      <div class="qr">${generateQRCodeSVG(getQRUrl(selected.number), 250)}</div>
      <div class="url">${getQRUrl(selected.number)}</div>
      </div><script>window.onload=function(){window.print();}</script></body></html>`);
    printWindow.document.close();
  };

  return (
    <MainLayout title="Meja & QR Code">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 sm:gap-5 mb-4 sm:mb-5 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 whitespace-nowrap"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs sm:text-sm text-text-secondary">Tersedia</span></div>
            <div className="flex items-center gap-2 whitespace-nowrap"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs sm:text-sm text-text-secondary">Terpakai</span></div>
            <div className="flex items-center gap-2 whitespace-nowrap"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-xs sm:text-sm text-text-secondary">Reservasi</span></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {tables.map((table) => (
              <button key={table.id} onClick={() => setSelectedTable(table.id)}
                className={`bento-card !p-3 sm:!p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-bento-md min-h-[44px] ${
                  table.status === "available" ? "border-emerald-200 bg-emerald-50/50" :
                  table.status === "occupied" ? "border-red-200 bg-red-50/50" : "border-amber-200 bg-amber-50/50"
                } ${selectedTable === table.id ? "ring-2 ring-primary-300 shadow-bento-lg" : ""}`}>
                <IconTable className={`w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-1 ${
                  table.status === "available" ? "text-emerald-500" : table.status === "occupied" ? "text-red-500" : "text-amber-500"
                }`} />
                <div className="text-xl sm:text-2xl font-bold text-text">{table.number}</div>
                <div className="text-xs text-text-muted">{table.seats} kursi</div>
                <div className={`text-xs font-medium mt-1 ${
                  table.status === "available" ? "text-emerald-600" : table.status === "occupied" ? "text-red-600" : "text-amber-600"
                }`}>{table.status === "available" ? "Kosong" : table.status === "occupied" ? "Terpakai" : "Reservasi"}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {selected ? (
            <>
              <div className="bento-card !p-3 sm:!p-4">
                <h3 className="font-bold text-text mb-3 text-sm sm:text-base">Meja {selected.number}</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-text-muted">Kapasitas</span><span className="font-medium">{selected.seats} kursi</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Status</span><span className="font-medium capitalize">{selected.status}</span></div>
                </div>
                <div className="mt-4 space-y-2">
                  <button onClick={() => updateTableStatus(selectedTable!, "available")} className="btn-success w-full text-sm py-2.5 min-h-[44px]">Tandai Kosong</button>
                  <button onClick={() => updateTableStatus(selectedTable!, "reserved")} className="btn-outline w-full text-sm py-2.5 min-h-[44px]">Reservasi</button>
                </div>
              </div>

              <div className="bento-card !p-3 sm:!p-4 text-center">
                <h3 className="font-bold text-text mb-3 flex items-center justify-center gap-2 text-sm sm:text-base">
                  <IconQris className="w-4 h-4 text-primary-500" /> QR Code Meja
                </h3>
                <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-3 rounded-xl overflow-hidden border border-primary-100/60 bg-white p-2"
                  dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(getQRUrl(selected.number), 160) }} />
                <p className="text-[10px] text-text-muted mb-3 break-all px-2">{getQRUrl(selected.number)}</p>
                <div className="flex gap-2">
                  <button onClick={handlePrintQR} className="btn-primary flex-1 text-xs sm:text-sm py-2.5 min-h-[44px]">
                    <IconPrinter className="w-4 h-4" /> Print
                  </button>
                  <button onClick={handleDownloadQR} className="btn-outline flex-1 text-xs sm:text-sm py-2.5 min-h-[44px]">
                    Download
                  </button>
                </div>
                <p className="text-[10px] sm:text-xs text-text-muted mt-2">Pelanggan scan untuk self-order</p>
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
