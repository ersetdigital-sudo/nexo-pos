"use client";

import { useState } from "react";
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
  const { storeName, storePhone, taxRate, loyaltyPointsPerAmount, setSettings } = useStore();

  const [localSettings, setLocalSettings] = useState({
    storeName, storePhone, taxRate: String(taxRate * 100), loyaltyPointsPerAmount: String(loyaltyPointsPerAmount),
  });
  const [activeTab, setActiveTab] = useState("general");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleSave = () => {
    setSettings({
      storeName: localSettings.storeName, storePhone: localSettings.storePhone,
      taxRate: parseFloat(localSettings.taxRate) / 100, loyaltyPointsPerAmount: parseInt(localSettings.loyaltyPointsPerAmount),
    });
    alert("Pengaturan berhasil disimpan!");
  };

  const getBaseUrl = () => {
    if (typeof window !== "undefined") return window.location.origin;
    return "https://nexo-pos-six.vercel.app";
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
                  <input className="input text-[16px] sm:text-sm" value={localSettings.storeName} onChange={(e) => setLocalSettings({ ...localSettings, storeName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">No. Telepon Toko</label>
                  <input className="input text-[16px] sm:text-sm" value={localSettings.storePhone} onChange={(e) => setLocalSettings({ ...localSettings, storePhone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Pajak (%)</label>
                  <input type="number" className="input text-[16px] sm:text-sm" value={localSettings.taxRate} onChange={(e) => setLocalSettings({ ...localSettings, taxRate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Poin Loyalty per Rupiah</label>
                  <input type="number" className="input text-[16px] sm:text-sm" value={localSettings.loyaltyPointsPerAmount} onChange={(e) => setLocalSettings({ ...localSettings, loyaltyPointsPerAmount: e.target.value })} />
                  <p className="text-xs text-text-muted mt-1">1 poin per setiap Rp {parseInt(localSettings.loyaltyPointsPerAmount).toLocaleString("id-ID")}</p>
                </div>
                <button onClick={handleSave} className="btn-success py-3 px-6 min-h-[44px]">Simpan Pengaturan</button>
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
                  <select className="input text-[16px] sm:text-sm"><option>Bluetooth</option><option>USB</option><option>Network/LAN</option></select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Lebar Kertas</label>
                  <select className="input text-[16px] sm:text-sm"><option>58mm</option><option>80mm</option></select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Nama Printer</label>
                  <input className="input text-[16px] sm:text-sm" placeholder="Pilih printer..." />
                </div>
                <div className="flex gap-3">
                  <button className="btn-outline min-h-[44px]"><IconScanner className="w-4 h-4" /> Scan Printer</button>
                  <button className="btn-primary min-h-[44px]"><IconPrinter className="w-4 h-4" /> Test Print</button>
                </div>
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
                  <input className="input text-[16px] sm:text-sm" placeholder="ID merchant QRIS..." />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">API Key</label>
                  <input className="input text-[16px] sm:text-sm" type="password" placeholder="API key..." />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Provider</label>
                  <select className="input text-[16px] sm:text-sm"><option>Midtrans</option><option>Xendit</option><option>DOKU</option><option>iPaymu</option></select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" className="w-4 h-4 rounded border-primary-200 text-primary-600" />
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">Auto-generate QRIS per transaksi</span>
                </label>
                <button className="btn-success py-3 px-6 min-h-[44px]">Simpan Konfigurasi</button>
              </div>
            </div>
          )}

          {activeTab === "whatsapp" && (
            <div className="bento-card-lg !p-4 sm:!p-6">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">WhatsApp Receipt</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <h3 className="font-semibold text-emerald-800 mb-1 text-sm sm:text-base">Struk Digital via WhatsApp</h3>
                  <p className="text-xs sm:text-sm text-emerald-700">Kirim struk langsung ke WhatsApp pelanggan. Hemat kertas!</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">WhatsApp Business API</label>
                  <input className="input text-[16px] sm:text-sm" placeholder="Token API..." />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">No. Pengirim</label>
                  <input className="input text-[16px] sm:text-sm" placeholder="628xxxxxxxxxx" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Template Pesan</label>
                  <textarea className="input text-[16px] sm:text-sm h-32 resize-none" defaultValue={`Halo {nama}!\n\nTerima kasih sudah berbelanja di {toko}.\n\nStruk #{nomor_order}\n{detail_pesanan}\n\nTotal: Rp {total}\nPoin didapat: {poin}\n\nSampai jumpa lagi!`} />
                </div>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-primary-200 text-primary-600" />
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">Auto kirim setelah pembayaran</span>
                </label>
                <button className="btn-success py-3 px-6 min-h-[44px]">Simpan</button>
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
                  <select className="input text-[16px] sm:text-sm"><option>EAN-13</option><option>Code 128</option><option>QR Code</option><option>UPC-A</option></select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Ukuran Label</label>
                  <select className="input text-[16px] sm:text-sm"><option>30mm x 20mm</option><option>40mm x 30mm</option><option>50mm x 25mm</option></select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-primary-200 text-primary-600" />
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">Sertakan harga di label</span>
                </label>
                <div className="flex gap-3">
                  <button className="btn-primary min-h-[44px]"><IconBarcode className="w-4 h-4" /> Cetak Label</button>
                  <button className="btn-outline min-h-[44px]">Batch Print</button>
                </div>
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
                  <select className="input text-[16px] sm:text-sm"><option>USB Barcode Scanner</option><option>Bluetooth Scanner</option><option>Camera (Built-in)</option></select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-primary-200 text-primary-600" />
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">Auto tambah ke keranjang saat scan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-primary-200 text-primary-600" />
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
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
