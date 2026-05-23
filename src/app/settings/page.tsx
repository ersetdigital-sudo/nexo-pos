"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconSettings, IconPrinter, IconQris, IconWhatsapp, IconBarcode, IconScanner, IconCheck, IconWifi } from "@/components/Icons";

export default function SettingsPage() {
  const { storeName, storePhone, taxRate, loyaltyPointsPerAmount, setSettings } = useStore();

  const [localSettings, setLocalSettings] = useState({
    storeName, storePhone, taxRate: String(taxRate * 100), loyaltyPointsPerAmount: String(loyaltyPointsPerAmount),
  });
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    setSettings({
      storeName: localSettings.storeName, storePhone: localSettings.storePhone,
      taxRate: parseFloat(localSettings.taxRate) / 100, loyaltyPointsPerAmount: parseInt(localSettings.loyaltyPointsPerAmount),
    });
    alert("Pengaturan berhasil disimpan!");
  };

  const tabs = [
    { id: "general", label: "Umum", Icon: IconSettings },
    { id: "printer", label: "Printer", Icon: IconPrinter },
    { id: "payment", label: "Pembayaran", Icon: IconQris },
    { id: "whatsapp", label: "WhatsApp", Icon: IconWhatsapp },
    { id: "barcode", label: "Barcode", Icon: IconBarcode },
    { id: "scanner", label: "Scanner", Icon: IconScanner },
  ];


  return (
    <MainLayout title="Pengaturan">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab nav */}
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === tab.id ? "bg-primary-50 text-primary-700 shadow-soft" : "text-dark-500 hover:bg-dark-50 hover:text-dark-700"
              }`}>
              <tab.Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-primary-500" : "text-dark-400"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark-800 mb-6">Pengaturan Umum</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1.5">Nama Toko</label>
                  <input className="input" value={localSettings.storeName} onChange={(e) => setLocalSettings({ ...localSettings, storeName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1.5">No. Telepon Toko</label>
                  <input className="input" value={localSettings.storePhone} onChange={(e) => setLocalSettings({ ...localSettings, storePhone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1.5">Pajak (%)</label>
                  <input type="number" className="input" value={localSettings.taxRate} onChange={(e) => setLocalSettings({ ...localSettings, taxRate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1.5">Poin Loyalty per Rupiah</label>
                  <input type="number" className="input" value={localSettings.loyaltyPointsPerAmount} onChange={(e) => setLocalSettings({ ...localSettings, loyaltyPointsPerAmount: e.target.value })} />
                  <p className="text-xs text-dark-400 mt-1">1 poin per setiap Rp {parseInt(localSettings.loyaltyPointsPerAmount).toLocaleString("id-ID")}</p>
                </div>
                <button onClick={handleSave} className="btn-success py-3 px-6">Simpan Pengaturan</button>
              </div>
            </div>
          )}

          {activeTab === "printer" && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark-800 mb-6">Thermal Printer</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2">Support Printer</h3>
                  <ul className="text-sm space-y-1 text-amber-700">
                    <li>• Bluetooth Thermal Printer (58mm/80mm)</li>
                    <li>• USB Thermal Printer</li>
                    <li>• Network Printer (LAN)</li>
                    <li>• Star Micronics, Epson TM, Xprinter</li>
                  </ul>
                </div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">Tipe Koneksi</label>
                  <select className="input"><option>Bluetooth</option><option>USB</option><option>Network/LAN</option></select></div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">Lebar Kertas</label>
                  <select className="input"><option>58mm</option><option>80mm</option></select></div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">Nama Printer</label>
                  <input className="input" placeholder="Pilih printer..." /></div>
                <div className="flex gap-3">
                  <button className="btn-outline"><IconScanner className="w-4 h-4" /> Scan Printer</button>
                  <button className="btn-primary"><IconPrinter className="w-4 h-4" /> Test Print</button>
                </div>
              </div>
            </div>
          )}


          {activeTab === "payment" && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark-800 mb-6">Pembayaran QRIS</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 rounded-xl bg-primary-50 border border-primary-200">
                  <h3 className="font-semibold text-primary-800 mb-1">QRIS Universal</h3>
                  <p className="text-sm text-primary-700">Terima pembayaran dari semua e-wallet & mobile banking: GoPay, OVO, DANA, ShopeePay, LinkAja.</p>
                </div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">Merchant ID</label><input className="input" placeholder="ID merchant QRIS..." /></div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">API Key</label><input className="input" type="password" placeholder="API key..." /></div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">Provider</label>
                  <select className="input"><option>Midtrans</option><option>Xendit</option><option>DOKU</option><option>iPaymu</option></select></div>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded border-dark-300 text-primary-600" /><span className="text-sm font-medium text-dark-600">Auto-generate QRIS per transaksi</span></label>
                <button className="btn-success py-3 px-6">Simpan Konfigurasi</button>
              </div>
            </div>
          )}

          {activeTab === "whatsapp" && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark-800 mb-6">WhatsApp Receipt</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <h3 className="font-semibold text-emerald-800 mb-1">Struk Digital via WhatsApp</h3>
                  <p className="text-sm text-emerald-700">Kirim struk langsung ke WhatsApp pelanggan. Hemat kertas!</p>
                </div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">WhatsApp Business API</label><input className="input" placeholder="Token API..." /></div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">No. Pengirim</label><input className="input" placeholder="628xxxxxxxxxx" /></div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">Template Pesan</label>
                  <textarea className="input h-32 resize-none" defaultValue={`Halo {nama}!\n\nTerima kasih sudah berbelanja di {toko}.\n\nStruk #{nomor_order}\n{detail_pesanan}\n\nTotal: Rp {total}\nPoin didapat: {poin}\n\nSampai jumpa lagi!`} /></div>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 rounded border-dark-300 text-primary-600" /><span className="text-sm font-medium text-dark-600">Auto kirim setelah pembayaran</span></label>
                <button className="btn-success py-3 px-6">Simpan</button>
              </div>
            </div>
          )}

          {activeTab === "barcode" && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark-800 mb-6">Barcode & Label</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 rounded-xl bg-dark-50 border border-dark-200">
                  <h3 className="font-semibold text-dark-800 mb-2">Fitur Barcode</h3>
                  <ul className="text-sm space-y-1 text-dark-600">
                    <li>• Cetak barcode produk (EAN-13, Code 128)</li>
                    <li>• Auto-generate barcode untuk produk baru</li>
                    <li>• Print label dengan harga</li>
                    <li>• Batch printing untuk banyak produk</li>
                  </ul>
                </div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">Format Barcode</label>
                  <select className="input"><option>EAN-13</option><option>Code 128</option><option>QR Code</option><option>UPC-A</option></select></div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">Ukuran Label</label>
                  <select className="input"><option>30mm x 20mm</option><option>40mm x 30mm</option><option>50mm x 25mm</option></select></div>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 rounded border-dark-300 text-primary-600" /><span className="text-sm font-medium text-dark-600">Sertakan harga di label</span></label>
                <div className="flex gap-3">
                  <button className="btn-primary"><IconBarcode className="w-4 h-4" /> Cetak Label</button>
                  <button className="btn-outline">Batch Print</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scanner" && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark-800 mb-6">Scanner Integration</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                  <h3 className="font-semibold text-sky-800 mb-2">Barcode Scanner</h3>
                  <ul className="text-sm space-y-1 text-sky-700">
                    <li>• Plug & Play scanner USB/Bluetooth</li>
                    <li>• Auto-scan saat di halaman kasir</li>
                    <li>• Support 1D & 2D barcode</li>
                    <li>• Scan kamera (mobile device)</li>
                  </ul>
                </div>
                <div><label className="block text-sm font-medium text-dark-600 mb-1.5">Tipe Scanner</label>
                  <select className="input"><option>USB Barcode Scanner</option><option>Bluetooth Scanner</option><option>Camera (Built-in)</option></select></div>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 rounded border-dark-300 text-primary-600" /><span className="text-sm font-medium text-dark-600">Auto tambah ke keranjang saat scan</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 rounded border-dark-300 text-primary-600" /><span className="text-sm font-medium text-dark-600">Suara notifikasi saat scan</span></label>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><IconWifi className="w-4 h-4 text-emerald-600" /></div>
                  <div><p className="font-semibold text-emerald-800 text-sm">Scanner Ready</p><p className="text-xs text-emerald-600">Keyboard mode scanner terdeteksi otomatis</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
