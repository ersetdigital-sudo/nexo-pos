"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconQris, IconPrinter, IconTable } from "@/components/Icons";
import QRCode from "qrcode";

export default function TablesPage() {
  const { tables, updateTableStatus, orders, storeName } = useStore();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrSvgString, setQrSvgString] = useState<string>("");

  const getTableOrder = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table?.currentOrderId) return null;
    return orders.find((o) => o.id === table.currentOrderId);
  };

  const selected = tables.find((t) => t.id === selectedTable);

  const getQRUrl = useCallback((tableNumber: number) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://nexo-pos-six.vercel.app";
    return `${baseUrl}/self-order?table=${tableNumber}`;
  }, []);

  // Generate real QR code when table is selected
  useEffect(() => {
    if (!selected) {
      setQrDataUrl("");
      setQrSvgString("");
      return;
    }
    const url = getQRUrl(selected.number);

    // Generate as data URL (PNG) for display
    QRCode.toDataURL(url, {
      width: 256,
      margin: 4,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then((dataUrl) => {
      setQrDataUrl(dataUrl);
    });

    // Generate as SVG string for print/download
    QRCode.toString(url, {
      type: "svg",
      width: 256,
      margin: 4,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then((svg) => {
      setQrSvgString(svg);
    });
  }, [selected, getQRUrl]);

  const handleDownloadQR = () => {
    if (!selected || !qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-meja-${selected.number}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintQR = () => {
    if (!selected || !qrSvgString) return;
    const qrUrl = getQRUrl(selected.number);
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>QR Meja ${selected.number}</title>
      <style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,sans-serif;}
      .card{text-align:center;padding:40px;border:2px dashed #E5D5C5;border-radius:16px;}
      .logo{font-size:14px;font-weight:700;color:#111827;margin-bottom:8px;}
      .num{font-size:32px;font-weight:800;color:#111827;margin:16px 0 8px;}
      .sub{font-size:12px;color:#6B7280;}
      .qr{margin:24px auto;width:256px;height:256px;}
      .qr svg{width:256px;height:256px;}
      .url{font-size:10px;color:#9CA3AF;margin-top:16px;word-break:break-all;}
      @media print{body{margin:0;}.card{border:none;}}</style></head>
      <body><div class="card">
      <div class="logo">${storeName}</div>
      <div class="num">MEJA ${selected.number}</div>
      <div class="sub">Scan untuk Self-Order</div>
      <div class="qr">${qrSvgString}</div>
      <div class="url">${qrUrl}</div>
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
                <div className="w-[200px] h-[200px] sm:w-[256px] sm:h-[256px] mx-auto mb-3 rounded-xl overflow-hidden border border-primary-100/60 bg-white flex items-center justify-center">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt={`QR Code Meja ${selected.number}`} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-text-muted">Generating...</span>
                  )}
                </div>
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
