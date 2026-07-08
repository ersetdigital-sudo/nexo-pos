"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconSettings, IconPrinter, IconQris, IconWhatsapp, IconBarcode, IconScanner, IconCheck, IconWifi } from "@/components/Icons";

function IconDisplay({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function IconCopy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export default function SettingsPage() {
  const store = useStore();
  const { setSettings } = store;

  const [activeTab, setActiveTab] = useState("general");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [testWaPhone, setTestWaPhone] = useState("");

  // Local form states
  const [general, setGeneral] = useState({
    storeName: store.storeName,
    storePhone: store.storePhone,
    taxRate: String(store.taxRate * 100),
    loyaltyPointsPerAmount: String(store.loyaltyPointsPerAmount),
  });
  const [wa, setWa] = useState({
    waToken: store.waToken,
    waSenderNumber: store.waSenderNumber,
    waTemplate: store.waTemplate,
    waAutoSend: store.waAutoSend,
  });
  const [printer, setPrinter] = useState({
    printerType: store.printerType,
    printerPaperWidth: store.printerPaperWidth,
    printerName: store.printerName,
  });
  const [payment, setPayment] = useState({
    paymentMerchantId: store.paymentMerchantId,
    paymentApiKey: store.paymentApiKey,
    paymentProvider: store.paymentProvider,
    paymentAutoQris: store.paymentAutoQris,
  });
  const [barcode, setBarcode] = useState({
    barcodeFormat: store.barcodeFormat,
    barcodeLabelSize: store.barcodeLabelSize,
    barcodeShowPrice: store.barcodeShowPrice,
  });
  const [scanner, setScanner] = useState({
    scannerType: store.scannerType,
    scannerAutoAdd: store.scannerAutoAdd,
    scannerSound: store.scannerSound,
  });

  // Sync local state when store loads
  useEffect(() => {
    setGeneral({
      storeName: store.storeName,
      storePhone: store.storePhone,
      taxRate: String(store.taxRate * 100),
      loyaltyPointsPerAmount: String(store.loyaltyPointsPerAmount),
    });
    setWa({ waToken: store.waToken, waSenderNumber: store.waSenderNumber, waTemplate: store.waTemplate, waAutoSend: store.waAutoSend });
    setPrinter({ printerType: store.printerType, printerPaperWidth: store.printerPaperWidth, printerName: store.printerName });
    setPayment({ paymentMerchantId: store.paymentMerchantId, paymentApiKey: store.paymentApiKey, paymentProvider: store.paymentProvider, paymentAutoQris: store.paymentAutoQris });
    setBarcode({ barcodeFormat: store.barcodeFormat, barcodeLabelSize: store.barcodeLabelSize, barcodeShowPrice: store.barcodeShowPrice });
    setScanner({ scannerType: store.scannerType, scannerAutoAdd: store.scannerAutoAdd, scannerSound: store.scannerSound });
  }, [store.isInitialized]);

  const showSaved = () => {
    setSaveMsg("✓ Tersimpan!");
    setTimeout(() => setSaveMsg(""), 2000);
  };

  const handleSaveGeneral = () => {
    setSettings({
      storeName: general.storeName,
      storePhone: general.storePhone,
      taxRate: parseFloat(general.taxRate) / 100,
      loyaltyPointsPerAmount: parseInt(general.loyaltyPointsPerAmount),
    });
    showSaved();
  };

  const handleSaveWa = () => {
    setSettings(wa);
    showSaved();
  };

  const handleSavePrinter = () => {
    setSettings(printer);
    showSaved();
  };

  const handleSavePayment = () => {
    setSettings(payment);
    showSaved();
  };

  const handleSaveBarcode = () => {
    setSettings(barcode);
    showSaved();
  };

  const handleSaveScanner = () => {
    setSettings(scanner);
    showSaved();
  };

  const handleTestWa = async () => {
    if (!testWaPhone) { alert("Masukkan nomor HP untuk test"); return; }
    const result = await store.sendWhatsAppReceipt({
      phone: testWaPhone,
      orderNumber: "TEST-001",
      customerName: "Test Customer",
      items: [{ name: "Nasi Goreng Spesial", quantity: 1, subtotal: 25000 }, { name: "Es Teh Manis", quantity: 2, subtotal: 10000 }],
      total: 35000,
      pointsEarned: 3,
    });
    if (result.success) alert("✓ Pesan WhatsApp berhasil dikirim!");
    else alert("✗ Gagal kirim: " + (result.error || "Cek token Fonnte"));
  };

  const getBaseUrl = () => {
    if (typeof window !== "undefined") return window.location.origin;
    return "";
  };

  const handleCopyLink = (path: string) => {
    const url = `${getBaseUrl()}${path}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(path);
      setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  const tabs = [
    { id: "general", label: "Umum", Icon: IconSettings },
    { id: "display", label: "Display", Icon: IconDisplay },
    { id: "printer", label: "Printer", Icon: IconPrinter },
    { id: "payment", label: "Pembayaran", Icon: IconQris },
    { id: "whatsapp", label: "WhatsApp", Icon: IconWhatsapp },
    { id: "barcode", label: "Barcode", Icon: IconBarcode },
    { id: "scanner", label: "Scanner", Icon: IconScanner },
  ];

  return (
    <MainLayout title="Pengaturan">
      {saveMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg animate-pulse">
          {saveMsg}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Tab nav */}
        <div className="flex overflow-x-auto lg:flex-col lg:overflow-visible gap-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[44px] lg:w-full lg:text-left ${
                activeTab === tab.id ? "bg-primary-50 text-primary-800 border border-primary-200 shadow-bento" : "text-text-secondary hover:bg-primary-50/50 hover:text-text"
              }`}>
              <tab.Icon className={`w-4 h-4 flex-shrink-0 ${activeTab === tab.id ? "text-primary-600" : "text-text-muted"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">

          {activeTab === "general" && (
            <div className="bento-card-lg !p-4 sm:!p-6">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">Pengaturan Umum</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Nama Toko</label>
                  <input className="input text-[16px] sm:text-sm" value={general.storeName} onChange={(e) => setGeneral({ ...general, storeName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">No. Telepon Toko</label>
                  <input className="input text-[16px] sm:text-sm" value={general.storePhone} onChange={(e) => setGeneral({ ...general, storePhone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Pajak (%)</label>
                  <input type="number" className="input text-[16px] sm:text-sm" value={general.taxRate} onChange={(e) => setGeneral({ ...general, taxRate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Poin Loyalty per Rupiah</label>
                  <input type="number" className="input text-[16px] sm:text-sm" value={general.loyaltyPointsPerAmount} onChange={(e) => setGeneral({ ...general, loyaltyPointsPerAmount: e.target.value })} />
                  <p className="text-xs text-text-muted mt-1">1 poin per setiap Rp {parseInt(general.loyaltyPointsPerAmount || "0").toLocaleString("id-ID")}</p>
                </div>
                <button onClick={handleSaveGeneral} className="btn-success py-3 px-6 min-h-[44px]">Simpan Pengaturan</button>
              </div>
            </div>
          )}

          {activeTab === "display" && (
            <div className="bento-card-lg !p-4 sm:!p-6">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">Link Display</h2>
              <p className="text-xs sm:text-sm text-text-secondary mb-5">Buka link berikut di perangkat terpisah (tablet, monitor, TV) untuk menampilkan layar display.</p>
              <div className="space-y-4 max-w-lg">
                {[
                  { path: "/customer-display", label: "Customer Display", desc: "Tampilan pesanan untuk pelanggan di meja kasir" },
                  { path: "/display", label: "Order Display", desc: "Tampilan pesanan masuk untuk dapur/bar" },
                  { path: "/kitchen", label: "Kitchen Display", desc: "Tampilan khusus dapur dengan kontrol status" },
                  { path: "/queue", label: "Queue Display", desc: "Tampilan antrian pesanan untuk pelanggan" },
                  { path: "/self-order", label: "Self Order", desc: "Halaman pemesanan mandiri oleh pelanggan" },
                ].map((item) => (
                  <div key={item.path} className="p-3 sm:p-4 rounded-xl border border-primary-100/60 bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base text-text">{item.label}</h3>
                        <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                        <p className="text-xs text-text-secondary mt-2 break-all font-mono bg-surface-200 rounded-lg px-2.5 py-1.5">{getBaseUrl()}{item.path}</p>
                      </div>
                      <button
                        onClick={() => handleCopyLink(item.path)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
                          copiedLink === item.path
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-primary-50 text-primary-800 border border-primary-200 hover:bg-primary-100 active:scale-95"
                        }`}
                      >
                        {copiedLink === item.path ? (
                          <><IconCheck className="w-3.5 h-3.5" /> Copied!</>
                        ) : (
                          <><IconCopy className="w-3.5 h-3.5" /> Copy</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "printer" && (
            <div className="bento-card-lg !p-4 sm:!p-6">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">Thermal Printer</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2 text-sm sm:text-base">Support Printer</h3>
                  <ul className="text-xs sm:text-sm space-y-1 text-amber-700">
                    <li>• Bluetooth Thermal Printer (58mm/80mm)</li>
                    <li>• USB Thermal Printer</li>
                    <li>• Network Printer (LAN)</li>
                    <li>• Star Micronics, Epson TM, Xprinter</li>
                  </ul>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Tipe Koneksi</label>
                  <select className="input text-[16px] sm:text-sm" value={printer.printerType} onChange={(e) => setPrinter({ ...printer, printerType: e.target.value })}>
                    <option value="bluetooth">Bluetooth</option>
                    <option value="usb">USB</option>
                    <option value="network">Network/LAN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Lebar Kertas</label>
                  <select className="input text-[16px] sm:text-sm" value={printer.printerPaperWidth} onChange={(e) => setPrinter({ ...printer, printerPaperWidth: e.target.value })}>
                    <option value="58mm">58mm</option>
                    <option value="80mm">80mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Nama Printer</label>
                  <input className="input text-[16px] sm:text-sm" placeholder="Nama printer..." value={printer.printerName} onChange={(e) => setPrinter({ ...printer, printerName: e.target.value })} />
                </div>
                <button onClick={handleSavePrinter} className="btn-success py-3 px-6 min-h-[44px]">Simpan Konfigurasi Printer</button>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="bento-card-lg !p-4 sm:!p-6">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">Pembayaran QRIS</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-3 sm:p-4 rounded-xl bg-primary-50 border border-primary-200">
                  <h3 className="font-semibold text-primary-800 mb-1 text-sm sm:text-base">QRIS Universal</h3>
                  <p className="text-xs sm:text-sm text-primary-700">Terima pembayaran dari semua e-wallet & mobile banking: GoPay, OVO, DANA, ShopeePay, LinkAja.</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Merchant ID</label>
                  <input className="input text-[16px] sm:text-sm" placeholder="ID merchant QRIS..." value={payment.paymentMerchantId} onChange={(e) => setPayment({ ...payment, paymentMerchantId: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">API Key</label>
                  <input className="input text-[16px] sm:text-sm" type="password" placeholder="API key..." value={payment.paymentApiKey} onChange={(e) => setPayment({ ...payment, paymentApiKey: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Provider</label>
                  <select className="input text-[16px] sm:text-sm" value={payment.paymentProvider} onChange={(e) => setPayment({ ...payment, paymentProvider: e.target.value })}>
                    <option value="midtrans">Midtrans</option>
                    <option value="xendit">Xendit</option>
                    <option value="doku">DOKU</option>
                    <option value="ipaymu">iPaymu</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" className="w-4 h-4 rounded border-primary-200 text-primary-600" checked={payment.paymentAutoQris} onChange={(e) => setPayment({ ...payment, paymentAutoQris: e.target.checked })} />
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">Auto-generate QRIS per transaksi</span>
                </label>
                <button onClick={handleSavePayment} className="btn-success py-3 px-6 min-h-[44px]">Simpan Konfigurasi</button>
              </div>
            </div>
          )}

          {activeTab === "whatsapp" && (
            <div className="bento-card-lg !p-4 sm:!p-6">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">WhatsApp Receipt (Fonnte)</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <h3 className="font-semibold text-emerald-800 mb-1 text-sm sm:text-base">Struk Digital via WhatsApp</h3>
                  <p className="text-xs sm:text-sm text-emerald-700">Kirim struk langsung ke WhatsApp pelanggan via Fonnte. Hemat kertas!</p>
                  <p className="text-xs text-emerald-600 mt-1">Daftar di <a href="https://fonnte.com" target="_blank" rel="noopener" className="underline font-medium">fonnte.com</a> untuk mendapatkan token API.</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Token Fonnte</label>
                  <input className="input text-[16px] sm:text-sm" type="password" placeholder="Token dari dashboard Fonnte..." value={wa.waToken} onChange={(e) => setWa({ ...wa, waToken: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">No. Pengirim (device yang terdaftar di Fonnte)</label>
                  <input className="input text-[16px] sm:text-sm" placeholder="628xxxxxxxxxx" value={wa.waSenderNumber} onChange={(e) => setWa({ ...wa, waSenderNumber: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Template Pesan</label>
                  <textarea className="input text-[16px] sm:text-sm h-40 resize-none" value={wa.waTemplate} onChange={(e) => setWa({ ...wa, waTemplate: e.target.value })} />
                  <p className="text-xs text-text-muted mt-1">Variabel: {"{nama}"} {"{toko}"} {"{nomor_order}"} {"{detail_pesanan}"} {"{total}"} {"{poin}"}</p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" className="w-4 h-4 rounded border-primary-200 text-primary-600" checked={wa.waAutoSend} onChange={(e) => setWa({ ...wa, waAutoSend: e.target.checked })} />
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">Auto kirim setelah pembayaran</span>
                </label>
                <button onClick={handleSaveWa} className="btn-success py-3 px-6 min-h-[44px]">Simpan Konfigurasi WA</button>

                {/* Test send */}
                <div className="pt-4 border-t border-line mt-4">
                  <h3 className="font-semibold text-sm text-text mb-2">Test Kirim WhatsApp</h3>
                  <div className="flex gap-2">
                    <input className="input text-[16px] sm:text-sm flex-1" placeholder="08xxxxxxxxxx" value={testWaPhone} onChange={(e) => setTestWaPhone(e.target.value)} />
                    <button onClick={handleTestWa} className="btn-primary min-h-[44px] px-4 whitespace-nowrap">Kirim Test</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "barcode" && (
            <div className="bento-card-lg !p-4 sm:!p-6">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">Barcode & Label</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-3 sm:p-4 rounded-xl bg-surface-300 border border-primary-100/60">
                  <h3 className="font-semibold text-text mb-2 text-sm sm:text-base">Fitur Barcode</h3>
                  <ul className="text-xs sm:text-sm space-y-1 text-text-secondary">
                    <li>• Cetak barcode produk (EAN-13, Code 128)</li>
                    <li>• Auto-generate barcode untuk produk baru</li>
                    <li>• Print label dengan harga</li>
                    <li>• Batch printing untuk banyak produk</li>
                  </ul>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Format Barcode</label>
                  <select className="input text-[16px] sm:text-sm" value={barcode.barcodeFormat} onChange={(e) => setBarcode({ ...barcode, barcodeFormat: e.target.value })}>
                    <option value="EAN-13">EAN-13</option>
                    <option value="Code 128">Code 128</option>
                    <option value="QR Code">QR Code</option>
                    <option value="UPC-A">UPC-A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Ukuran Label</label>
                  <select className="input text-[16px] sm:text-sm" value={barcode.barcodeLabelSize} onChange={(e) => setBarcode({ ...barcode, barcodeLabelSize: e.target.value })}>
                    <option value="30mm x 20mm">30mm x 20mm</option>
                    <option value="40mm x 30mm">40mm x 30mm</option>
                    <option value="50mm x 25mm">50mm x 25mm</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" className="w-4 h-4 rounded border-primary-200 text-primary-600" checked={barcode.barcodeShowPrice} onChange={(e) => setBarcode({ ...barcode, barcodeShowPrice: e.target.checked })} />
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">Sertakan harga di label</span>
                </label>
                <button onClick={handleSaveBarcode} className="btn-success py-3 px-6 min-h-[44px]">Simpan Konfigurasi</button>
              </div>
            </div>
          )}

          {activeTab === "scanner" && (
            <div className="bento-card-lg !p-4 sm:!p-6">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">Scanner Integration</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-3 sm:p-4 rounded-xl bg-sky-50 border border-sky-200">
                  <h3 className="font-semibold text-sky-800 mb-2 text-sm sm:text-base">Barcode Scanner</h3>
                  <ul className="text-xs sm:text-sm space-y-1 text-sky-700">
                    <li>• Plug & Play scanner USB/Bluetooth</li>
                    <li>• Auto-scan saat di halaman kasir</li>
                    <li>• Support 1D & 2D barcode</li>
                    <li>• Scan kamera (mobile device)</li>
                  </ul>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Tipe Scanner</label>
                  <select className="input text-[16px] sm:text-sm" value={scanner.scannerType} onChange={(e) => setScanner({ ...scanner, scannerType: e.target.value })}>
                    <option value="usb">USB Barcode Scanner</option>
                    <option value="bluetooth">Bluetooth Scanner</option>
                    <option value="camera">Camera (Built-in)</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" className="w-4 h-4 rounded border-primary-200 text-primary-600" checked={scanner.scannerAutoAdd} onChange={(e) => setScanner({ ...scanner, scannerAutoAdd: e.target.checked })} />
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">Auto tambah ke keranjang saat scan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" className="w-4 h-4 rounded border-primary-200 text-primary-600" checked={scanner.scannerSound} onChange={(e) => setScanner({ ...scanner, scannerSound: e.target.checked })} />
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">Suara notifikasi saat scan</span>
                </label>
                <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <IconWifi className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800 text-xs sm:text-sm">Scanner Ready</p>
                    <p className="text-xs text-emerald-600">Keyboard mode scanner terdeteksi otomatis</p>
                  </div>
                </div>
                <button onClick={handleSaveScanner} className="btn-success py-3 px-6 min-h-[44px]">Simpan Konfigurasi</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}
