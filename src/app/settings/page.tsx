"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";

export default function SettingsPage() {
  const { storeName, storePhone, taxRate, loyaltyPointsPerAmount, setSettings } = useStore();

  const [localSettings, setLocalSettings] = useState({
    storeName,
    storePhone,
    taxRate: String(taxRate * 100),
    loyaltyPointsPerAmount: String(loyaltyPointsPerAmount),
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    setSettings({
      storeName: localSettings.storeName,
      storePhone: localSettings.storePhone,
      taxRate: parseFloat(localSettings.taxRate) / 100,
      loyaltyPointsPerAmount: parseInt(localSettings.loyaltyPointsPerAmount),
    });
    alert("✅ Pengaturan berhasil disimpan!");
  };

  const tabs = [
    { id: "general", label: "⚙️ Umum", icon: "⚙️" },
    { id: "printer", label: "🖨️ Printer", icon: "🖨️" },
    { id: "payment", label: "💳 Pembayaran", icon: "💳" },
    { id: "whatsapp", label: "📱 WhatsApp", icon: "📱" },
    { id: "barcode", label: "📊 Barcode", icon: "📊" },
    { id: "scanner", label: "🔍 Scanner", icon: "🔍" },
  ];

  return (
    <MainLayout title="⚙️ Pengaturan">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 font-bold border-2 border-text transition-all ${
                activeTab === tab.id
                  ? "bg-primary shadow-brutal-sm"
                  : "bg-white hover:bg-yellow-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <div className="card-brutal">
              <h2 className="text-xl font-black mb-6">⚙️ Pengaturan Umum</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-bold mb-1">Nama Toko</label>
                  <input
                    className="input-brutal"
                    value={localSettings.storeName}
                    onChange={(e) => setLocalSettings({ ...localSettings, storeName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">No. Telepon Toko</label>
                  <input
                    className="input-brutal"
                    value={localSettings.storePhone}
                    onChange={(e) => setLocalSettings({ ...localSettings, storePhone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Pajak (%)</label>
                  <input
                    type="number"
                    className="input-brutal"
                    value={localSettings.taxRate}
                    onChange={(e) => setLocalSettings({ ...localSettings, taxRate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Poin Loyalty per Rupiah</label>
                  <input
                    type="number"
                    className="input-brutal"
                    value={localSettings.loyaltyPointsPerAmount}
                    onChange={(e) => setLocalSettings({ ...localSettings, loyaltyPointsPerAmount: e.target.value })}
                  />
                  <p className="text-xs text-gray-400 mt-1">1 poin per setiap Rp {parseInt(localSettings.loyaltyPointsPerAmount).toLocaleString("id-ID")}</p>
                </div>
                <button onClick={handleSave} className="btn-brutal-success py-3 px-6">
                  💾 Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {activeTab === "printer" && (
            <div className="card-brutal">
              <h2 className="text-xl font-black mb-6">🖨️ Thermal Printer</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 border-2 border-text bg-yellow-50">
                  <h3 className="font-bold mb-2">Support Printer</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Bluetooth Thermal Printer (58mm/80mm)</li>
                    <li>• USB Thermal Printer</li>
                    <li>• Network Printer (LAN)</li>
                    <li>• Star Micronics, Epson TM, Xprinter</li>
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Tipe Koneksi</label>
                  <select className="input-brutal">
                    <option>Bluetooth</option>
                    <option>USB</option>
                    <option>Network/LAN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Lebar Kertas</label>
                  <select className="input-brutal">
                    <option>58mm</option>
                    <option>80mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Nama Printer</label>
                  <input className="input-brutal" placeholder="Pilih printer..." />
                </div>
                <div className="flex gap-3">
                  <button className="btn-brutal-primary">🔍 Scan Printer</button>
                  <button className="btn-brutal-secondary">🖨️ Test Print</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="card-brutal">
              <h2 className="text-xl font-black mb-6">💳 Pembayaran QRIS</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 border-2 border-secondary bg-indigo-50">
                  <h3 className="font-bold text-secondary mb-2">📱 QRIS Universal</h3>
                  <p className="text-sm text-gray-600">
                    Terima pembayaran dari semua e-wallet & mobile banking: GoPay, OVO, DANA, ShopeePay, LinkAja, dan lainnya.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Merchant ID</label>
                  <input className="input-brutal" placeholder="ID merchant QRIS..." />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">API Key</label>
                  <input className="input-brutal" type="password" placeholder="API key..." />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Provider</label>
                  <select className="input-brutal">
                    <option>Midtrans</option>
                    <option>Xendit</option>
                    <option>DOKU</option>
                    <option>iPaymu</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="autoQris" className="w-5 h-5 border-2 border-text" />
                  <label htmlFor="autoQris" className="text-sm font-bold">Auto-generate QRIS per transaksi</label>
                </div>
                <button className="btn-brutal-success py-3 px-6">💾 Simpan Konfigurasi</button>
              </div>
            </div>
          )}

          {activeTab === "whatsapp" && (
            <div className="card-brutal">
              <h2 className="text-xl font-black mb-6">📱 WhatsApp Receipt</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 border-2 border-success bg-green-50">
                  <h3 className="font-bold text-success mb-2">Struk Digital via WhatsApp</h3>
                  <p className="text-sm text-gray-600">
                    Kirim struk pembelian langsung ke WhatsApp pelanggan. Hemat kertas, ramah lingkungan! 🌿
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">WhatsApp Business API</label>
                  <input className="input-brutal" placeholder="Token API..." />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">No. Pengirim</label>
                  <input className="input-brutal" placeholder="628xxxxxxxxxx" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Template Pesan</label>
                  <textarea
                    className="input-brutal h-32"
                    defaultValue={`Halo {nama}! 👋\n\nTerima kasih sudah berbelanja di {toko}.\n\n📋 Struk #{nomor_order}\n{detail_pesanan}\n\n💰 Total: Rp {total}\n⭐ Poin didapat: {poin}\n\nSampai jumpa lagi! 🙏`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="autoWa" className="w-5 h-5 border-2 border-text" defaultChecked />
                  <label htmlFor="autoWa" className="text-sm font-bold">Auto kirim setelah pembayaran</label>
                </div>
                <button className="btn-brutal-success py-3 px-6">💾 Simpan</button>
              </div>
            </div>
          )}

          {activeTab === "barcode" && (
            <div className="card-brutal">
              <h2 className="text-xl font-black mb-6">📊 Barcode & Label</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 border-2 border-text bg-gray-50">
                  <h3 className="font-bold mb-2">Fitur Barcode</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Cetak barcode produk (EAN-13, Code 128)</li>
                    <li>• Auto-generate barcode untuk produk baru</li>
                    <li>• Print label dengan harga</li>
                    <li>• Batch printing untuk banyak produk</li>
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Format Barcode</label>
                  <select className="input-brutal">
                    <option>EAN-13</option>
                    <option>Code 128</option>
                    <option>QR Code</option>
                    <option>UPC-A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Ukuran Label</label>
                  <select className="input-brutal">
                    <option>30mm x 20mm</option>
                    <option>40mm x 30mm</option>
                    <option>50mm x 25mm</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="includePrice" className="w-5 h-5 border-2 border-text" defaultChecked />
                  <label htmlFor="includePrice" className="text-sm font-bold">Sertakan harga di label</label>
                </div>
                <div className="flex gap-3">
                  <button className="btn-brutal-primary">🏷️ Cetak Label</button>
                  <button className="btn-brutal-secondary">📋 Batch Print</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scanner" && (
            <div className="card-brutal">
              <h2 className="text-xl font-black mb-6">🔍 Scanner Integration</h2>
              <div className="space-y-4 max-w-md">
                <div className="p-4 border-2 border-text bg-blue-50">
                  <h3 className="font-bold mb-2">Barcode Scanner</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Plug & Play dengan scanner USB/Bluetooth</li>
                    <li>• Auto-scan saat di halaman kasir</li>
                    <li>• Support 1D & 2D barcode</li>
                    <li>• Scan kamera (mobile device)</li>
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Tipe Scanner</label>
                  <select className="input-brutal">
                    <option>USB Barcode Scanner</option>
                    <option>Bluetooth Scanner</option>
                    <option>Camera (Built-in)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="autoAdd" className="w-5 h-5 border-2 border-text" defaultChecked />
                  <label htmlFor="autoAdd" className="text-sm font-bold">Auto tambah ke keranjang saat scan</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="scanSound" className="w-5 h-5 border-2 border-text" defaultChecked />
                  <label htmlFor="scanSound" className="text-sm font-bold">Suara notifikasi saat scan</label>
                </div>
                <div className="p-4 border-2 border-success bg-green-50 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-bold text-success">Scanner Ready</p>
                      <p className="text-xs text-gray-500">Keyboard mode scanner terdeteksi secara otomatis</p>
                    </div>
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
