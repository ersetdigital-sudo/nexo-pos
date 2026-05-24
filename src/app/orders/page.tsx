"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore, Order } from "@/store";
import { IconOrders, IconTrendUp, IconWhatsapp, IconPrinter, IconX, IconCart, IconCash, IconQris, IconCard } from "@/components/Icons";

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const filteredOrders = orders.filter((o) => filterStatus === "all" || o.status === filterStatus);
  const totalRevenue = orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.total, 0);
  const completedCount = orders.filter((o) => o.status === "completed").length;

  const statuses = [
    { value: "all", label: "Semua" }, { value: "pending", label: "Pending" },
    { value: "preparing", label: "Proses" }, { value: "ready", label: "Siap" },
    { value: "completed", label: "Selesai" }, { value: "cancelled", label: "Batal" },
  ];

  const selectedOrderData = orders.find((o) => o.id === selectedOrder);

  const handleRowClick = (orderId: string) => {
    setSelectedOrder(orderId);
    // On mobile, show bottom sheet
    if (window.innerWidth < 1024) {
      setShowMobileDetail(true);
    }
  };

  const getPaymentBadgeClass = (method: string) => {
    switch (method) {
      case "cash": return "bg-gray-100 text-gray-600";
      case "qris": return "bg-purple-50 text-purple-700";
      case "card": return "bg-blue-50 text-blue-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getTypeBadgeClass = (tableNumber?: number) => {
    return tableNumber
      ? "bg-blue-50 text-blue-700"
      : "bg-green-50 text-green-700";
  };

  const handlePrintReceipt = () => {
    if (!selectedOrderData) return;
    setShowReceipt(true);
  };

  const printReceiptWindow = () => {
    if (!selectedOrderData) return;
    const items = selectedOrderData.items.map(i =>
      `${i.product.name.padEnd(18).slice(0, 18)} x${i.quantity}  Rp${i.subtotal.toLocaleString("id-ID")}`
    ).join("\n");
    const subtotal = selectedOrderData.items.reduce((s, i) => s + i.subtotal, 0);
    const tax = Math.round(subtotal * 0.11);

    const printWindow = window.open("", "_blank", "width=350,height=600");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Receipt #${selectedOrderData.orderNumber}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Courier New',monospace;font-size:12px;padding:20px;max-width:300px;margin:0 auto;color:#1C1C1C}
.center{text-align:center}.bold{font-weight:bold}.divider{border:none;border-top:1px dashed #ccc;margin:8px 0}
.row{display:flex;justify-content:space-between}.mt{margin-top:6px}.mb{margin-bottom:6px}
@media print{.no-print{display:none}body{padding:8px}}</style></head>
<body>
<div class="center bold" style="font-size:14px">NEXO POS</div>
<div class="center" style="font-size:10px;color:#6B7280">Jl. Digital No. 1, Jakarta</div>
<div class="center" style="font-size:10px;color:#6B7280">Tel: 08123456789</div>
<hr class="divider">
<div class="row"><span>No:</span><span class="bold">#${selectedOrderData.orderNumber}</span></div>
<div class="row"><span>Tgl:</span><span>${new Date(selectedOrderData.createdAt).toLocaleString("id-ID")}</span></div>
<div class="row"><span>Tipe:</span><span>${selectedOrderData.tableNumber ? "DINE IN - Meja " + selectedOrderData.tableNumber : "TAKE AWAY"}</span></div>
<div class="row"><span>Bayar:</span><span>${selectedOrderData.paymentMethod.toUpperCase()}</span></div>
${selectedOrderData.customerName ? `<div class="row"><span>Pelanggan:</span><span>${selectedOrderData.customerName}</span></div>` : ""}
<hr class="divider">
<div class="bold mb">PESANAN:</div>
${selectedOrderData.items.map(i => `<div class="row"><span>${i.product.name} x${i.quantity}</span><span>Rp${i.subtotal.toLocaleString("id-ID")}</span></div>`).join("")}
<hr class="divider">
<div class="row"><span>Subtotal</span><span>Rp${subtotal.toLocaleString("id-ID")}</span></div>
<div class="row"><span>Pajak (11%)</span><span>Rp${tax.toLocaleString("id-ID")}</span></div>
<div class="row bold" style="font-size:14px;margin-top:4px"><span>TOTAL</span><span>Rp${selectedOrderData.total.toLocaleString("id-ID")}</span></div>
<hr class="divider">
${selectedOrderData.loyaltyPointsEarned > 0 ? `<div class="center" style="font-size:10px">Poin didapat: +${selectedOrderData.loyaltyPointsEarned} pts</div>` : ""}
<div class="center mt" style="font-size:10px;color:#6B7280">Terima kasih atas kunjungan Anda!</div>
<div class="center" style="font-size:10px;color:#6B7280">── Powered by Nexo POS ──</div>
<div class="center mt no-print" style="margin-top:20px">
<button onclick="window.print()" style="background:#1C1C1C;color:white;border:none;padding:10px 24px;border-radius:6px;font-size:12px;cursor:pointer;font-family:inherit">Print Receipt</button>
<button onclick="window.close()" style="background:white;color:#1C1C1C;border:1px solid #E5E7EB;padding:10px 24px;border-radius:6px;font-size:12px;cursor:pointer;margin-left:8px;font-family:inherit">Close</button>
</div>
</body></html>`);
    printWindow.document.close();
  };

  return (
    <MainLayout title="Riwayat Pesanan">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 md:mb-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <IconOrders className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs text-[#6B7280]">Total Pesanan</span>
          </div>
          <div className="text-2xl font-bold text-[#1C1C1C]">{orders.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <IconTrendUp className="w-4 h-4 text-[#F97316]" />
            </div>
            <span className="text-xs text-[#6B7280]">Total Pendapatan</span>
          </div>
          <div className="text-2xl font-bold text-[#F97316]">Rp {totalRevenue.toLocaleString("id-ID")}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <IconCart className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs text-[#6B7280]">Rata-rata / Order</span>
          </div>
          <div className="text-2xl font-bold text-[#1C1C1C]">
            Rp {completedCount > 0 ? Math.round(totalRevenue / completedCount).toLocaleString("id-ID") : "0"}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {statuses.map((s) => (
          <button key={s.value} onClick={() => setFilterStatus(s.value)}
            className={`px-4 py-2 text-xs font-medium rounded-full border transition-all whitespace-nowrap min-h-[36px] ${
              filterStatus === s.value
                ? "bg-[#FFF0E6] text-[#F97316] border-[#F97316]"
                : "bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-gray-50"
            }`}>{s.label}</button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 min-w-0">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5E7EB] text-center py-16">
              <IconOrders className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-[#6B7280]">Belum ada pesanan</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-[#F3F4F6]">
                      <th className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wide text-[#6B7280] font-semibold border-b border-[#E5E7EB]">Order Info</th>
                      <th className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wide text-[#6B7280] font-semibold border-b border-[#E5E7EB] hidden md:table-cell">Customer</th>
                      <th className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wide text-[#6B7280] font-semibold border-b border-[#E5E7EB] hidden md:table-cell">Items Summary</th>
                      <th className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wide text-[#6B7280] font-semibold border-b border-[#E5E7EB]">Type & Payment</th>
                      <th className="text-right px-3 py-2.5 text-[11px] uppercase tracking-wide text-[#6B7280] font-semibold border-b border-[#E5E7EB]">Amount</th>
                      <th className="text-center px-3 py-2.5 text-[11px] uppercase tracking-wide text-[#6B7280] font-semibold border-b border-[#E5E7EB]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}
                        onClick={() => handleRowClick(order.id)}
                        className={`border-b border-[#E5E7EB] cursor-pointer transition-colors ${
                          selectedOrder === order.id ? "bg-[#FFF3EB]" : "hover:bg-[#FFF3EB]"
                        }`}>
                        <td className="px-3 py-2.5 border-r border-[#E5E7EB]">
                          <div className="font-semibold text-xs text-[#1C1C1C]">#{order.orderNumber}</div>
                          <div className="text-[10px] text-[#6B7280] mt-0.5">{new Date(order.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                        </td>
                        <td className="px-3 py-2.5 border-r border-[#E5E7EB] hidden md:table-cell">
                          <div className="text-xs text-[#1C1C1C]">{order.customerName || "Walk-in"}</div>
                          {order.customerPhone && <div className="text-[10px] text-[#6B7280]">{order.customerPhone}</div>}
                        </td>
                        <td className="px-3 py-2.5 border-r border-[#E5E7EB] hidden md:table-cell">
                          <div className="text-xs text-[#1C1C1C] truncate max-w-[180px]">
                            {order.items.map(i => `${i.product.name} x${i.quantity}`).join(", ")}
                          </div>
                          <div className="text-[10px] text-[#6B7280]">{order.items.length} item</div>
                        </td>
                        <td className="px-3 py-2.5 border-r border-[#E5E7EB]">
                          <div className="flex flex-wrap gap-1">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getTypeBadgeClass(order.tableNumber)}`}>
                              {order.tableNumber ? "DINE IN" : "TAKE AWAY"}
                            </span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getPaymentBadgeClass(order.paymentMethod)}`}>
                              {order.paymentMethod.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 border-r border-[#E5E7EB] text-right">
                          <span className="font-semibold text-xs text-[#1C1C1C]">Rp {order.total.toLocaleString("id-ID")}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            order.status === "completed" ? "bg-green-50 text-green-700" :
                            order.status === "preparing" ? "bg-amber-50 text-amber-700" :
                            order.status === "ready" ? "bg-blue-50 text-blue-700" :
                            order.status === "cancelled" ? "bg-red-50 text-red-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {order.status === "completed" ? "Selesai" :
                             order.status === "preparing" ? "Proses" :
                             order.status === "ready" ? "Siap" :
                             order.status === "cancelled" ? "Batal" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Detail Panel */}
        {selectedOrderData && (
          <div className="hidden lg:block w-[320px] flex-shrink-0">
            <OrderDetailPanel order={selectedOrderData} onPrint={handlePrintReceipt} onPrintWindow={printReceiptWindow} onClose={() => setSelectedOrder(null)} onStatusChange={(status) => updateOrderStatus(selectedOrderData.id, status)} />
          </div>
        )}
      </div>

      {/* Mobile Detail Bottom Sheet */}
      {showMobileDetail && selectedOrderData && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileDetail(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto safe-bottom">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="font-bold text-[#1C1C1C]">Detail #{selectedOrderData.orderNumber}</h3>
              <button onClick={() => setShowMobileDetail(false)} className="p-2 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <IconX className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <div className="p-4">
              <OrderDetailContent order={selectedOrderData} onPrint={printReceiptWindow} onStatusChange={(status) => updateOrderStatus(selectedOrderData.id, status)} />
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && selectedOrderData && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-[340px] max-h-[90vh] overflow-y-auto shadow-xl">
            <ReceiptView order={selectedOrderData} onClose={() => setShowReceipt(false)} onPrint={printReceiptWindow} />
          </div>
        </div>
      )}
    </MainLayout>
  );
}

/* ─── Detail Panel (Desktop) ─── */
function OrderDetailPanel({ order, onPrint, onPrintWindow, onClose, onStatusChange }: { order: Order; onPrint: () => void; onPrintWindow: () => void; onClose: () => void; onStatusChange: (status: Order["status"]) => void }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1C1C1C] text-sm">Detail Pesanan</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Tutup">
          <IconX className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>
      <OrderDetailContent order={order} onPrint={onPrintWindow} onStatusChange={onStatusChange} />
    </div>
  );
}

/* ─── Detail Content (shared mobile + desktop) ─── */
function OrderDetailContent({ order, onPrint, onStatusChange }: { order: Order; onPrint: () => void; onStatusChange: (status: Order["status"]) => void }) {
  const statusFlow: { value: Order["status"]; label: string; color: string }[] = [
    { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-700" },
    { value: "preparing", label: "Proses", color: "bg-amber-50 text-amber-700" },
    { value: "ready", label: "Siap", color: "bg-blue-50 text-blue-700" },
    { value: "completed", label: "Selesai", color: "bg-green-50 text-green-700" },
    { value: "cancelled", label: "Batal", color: "bg-red-50 text-red-700" },
  ];

  return (
    <>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>Order</span>
          <span className="font-semibold text-[#1C1C1C]">#{order.orderNumber}</span>
        </div>
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>Waktu</span>
          <span>{new Date(order.createdAt).toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>Tipe</span>
          <span>{order.tableNumber ? `Dine In - Meja ${order.tableNumber}` : "Take Away"}</span>
        </div>
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>Pembayaran</span>
          <span className="uppercase">{order.paymentMethod}</span>
        </div>
      </div>

      {/* Status Changer */}
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-wide text-[#6B7280] font-semibold mb-2">Ubah Status</div>
        <div className="flex flex-wrap gap-1.5">
          {statusFlow.map((s) => (
            <button
              key={s.value}
              onClick={() => onStatusChange(s.value)}
              disabled={order.status === s.value}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all min-h-[32px] border ${
                order.status === s.value
                  ? `${s.color} border-current ring-1 ring-current/20`
                  : "border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50"
              } disabled:opacity-60 disabled:cursor-default`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] pt-3 mb-3">
        <div className="text-[11px] uppercase tracking-wide text-[#6B7280] font-semibold mb-2">Item Pesanan</div>
        <div className="space-y-1.5">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-[#1C1C1C] truncate mr-2">{item.product.image} {item.product.name} <span className="text-[#6B7280]">x{item.quantity}</span></span>
              <span className="font-medium text-[#1C1C1C] flex-shrink-0">Rp {item.subtotal.toLocaleString("id-ID")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] pt-3 mb-4">
        <div className="flex justify-between text-sm font-bold">
          <span className="text-[#1C1C1C]">Total</span>
          <span className="text-[#F97316]">Rp {order.total.toLocaleString("id-ID")}</span>
        </div>
        {order.loyaltyPointsEarned > 0 && (
          <div className="flex justify-between text-[11px] text-[#6B7280] mt-1">
            <span>Poin Didapat</span>
            <span>+{order.loyaltyPointsEarned} pts</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#1C1C1C] hover:bg-gray-50 min-h-[44px] transition-colors">
          <IconWhatsapp className="w-4 h-4 text-green-600" /> Kirim WA
        </button>
        <button onClick={onPrint}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#1C1C1C] text-white text-xs font-medium hover:bg-gray-800 min-h-[44px] transition-colors">
          <IconPrinter className="w-4 h-4" /> Cetak Struk
        </button>
      </div>
    </>
  );
}

/* ─── Receipt Modal View ─── */
function ReceiptView({ order, onClose, onPrint }: { order: Order; onClose: () => void; onPrint: () => void }) {
  const subtotal = order.items.reduce((s, i) => s + i.subtotal, 0);
  const tax = Math.round(subtotal * 0.11);

  return (
    <div className="p-5">
      {/* Receipt Content - monospace */}
      <div className="font-mono text-xs text-[#1C1C1C] leading-relaxed">
        <div className="text-center font-bold text-sm mb-1">NEXO POS</div>
        <div className="text-center text-[10px] text-[#6B7280]">Jl. Digital No. 1, Jakarta</div>
        <div className="text-center text-[10px] text-[#6B7280] mb-2">Tel: 08123456789</div>
        <div className="text-[#6B7280] text-center">────────────────────────────</div>

        <div className="mt-2 space-y-0.5">
          <div className="flex justify-between"><span>No:</span><span className="font-bold">#{order.orderNumber}</span></div>
          <div className="flex justify-between"><span>Tgl:</span><span>{new Date(order.createdAt).toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between"><span>Tipe:</span><span>{order.tableNumber ? `DINE IN Meja ${order.tableNumber}` : "TAKE AWAY"}</span></div>
          <div className="flex justify-between"><span>Bayar:</span><span>{order.paymentMethod.toUpperCase()}</span></div>
          {order.customerName && <div className="flex justify-between"><span>Customer:</span><span>{order.customerName}</span></div>}
        </div>

        <div className="text-[#6B7280] text-center mt-2">────────────────────────────</div>

        <div className="mt-2 space-y-1">
          {order.items.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between">
                <span className="truncate mr-2">{item.product.name}</span>
                <span className="flex-shrink-0">x{item.quantity}</span>
              </div>
              <div className="text-right text-[#6B7280]">Rp {item.subtotal.toLocaleString("id-ID")}</div>
            </div>
          ))}
        </div>

        <div className="text-[#6B7280] text-center mt-2">────────────────────────────</div>

        <div className="mt-2 space-y-0.5">
          <div className="flex justify-between"><span>Subtotal</span><span>Rp {subtotal.toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between"><span>Pajak (11%)</span><span>Rp {tax.toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between font-bold text-sm mt-1"><span>TOTAL</span><span>Rp {order.total.toLocaleString("id-ID")}</span></div>
        </div>

        <div className="text-[#6B7280] text-center mt-2">────────────────────────────</div>

        {order.loyaltyPointsEarned > 0 && (
          <div className="text-center text-[10px] text-[#6B7280] mt-1">Poin: +{order.loyaltyPointsEarned} pts</div>
        )}
        <div className="text-center text-[10px] text-[#6B7280] mt-2">Terima kasih!</div>
        <div className="text-center text-[10px] text-[#6B7280]">── Powered by Nexo POS ──</div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-5">
        <button onClick={onPrint}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg bg-[#1C1C1C] text-white text-xs font-medium hover:bg-gray-800 min-h-[44px]">
          <IconPrinter className="w-4 h-4" /> Print Receipt
        </button>
        <button onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#1C1C1C] hover:bg-gray-50 min-h-[44px]">
          Close
        </button>
      </div>
    </div>
  );
}
