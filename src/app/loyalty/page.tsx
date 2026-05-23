"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconSearch, IconPlus, IconLoyalty, IconUsers, IconX, IconWhatsapp } from "@/components/Icons";

export default function LoyaltyPage() {
  const { customers, addCustomer, updateCustomerPoints, loyaltyPointsPerAmount } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [redeemPoints, setRedeemPoints] = useState("");

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    addCustomer({ id: `customer-${Date.now()}`, name: newCustomer.name, phone: newCustomer.phone, loyaltyPoints: 0, totalSpent: 0, visitCount: 0 });
    setNewCustomer({ name: "", phone: "" }); setShowForm(false);
  };

  const handleRedeem = (customerId: string) => {
    const points = parseInt(redeemPoints);
    if (points <= 0) return;
    const customer = customers.find((c) => c.id === customerId);
    if (!customer || customer.loyaltyPoints < points) { alert("Poin tidak mencukupi!"); return; }
    updateCustomerPoints(customerId, -points);
    setRedeemPoints(""); setSelectedCustomer(null);
    alert(`${points} poin berhasil ditukar!`);
  };

  const totalPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);

  return (
    <MainLayout title="Loyalty Points">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white border-0 p-5">
          <div className="flex items-center gap-2 mb-2"><IconUsers className="w-4 h-4 opacity-80" /><span className="text-sm opacity-80">Total Member</span></div>
          <div className="text-3xl font-bold">{customers.length}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2"><IconLoyalty className="w-4 h-4 text-amber-500" /><span className="text-sm text-dark-400">Total Poin Beredar</span></div>
          <div className="text-2xl font-bold text-dark-800">{totalPoints.toLocaleString("id-ID")}</div>
        </div>
        <div className="card p-5">
          <span className="text-sm text-dark-400">Poin per</span>
          <div className="text-xl font-bold text-dark-800 mt-1">Rp {loyaltyPointsPerAmount.toLocaleString("id-ID")}</div>
          <span className="text-xs text-dark-400">= 1 poin</span>
        </div>
        <div className="card bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 p-5">
          <span className="text-sm opacity-80">Reward</span>
          <div className="text-xl font-bold mt-1">100 poin = 10K</div>
          <span className="text-xs opacity-70">diskon belanja</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <IconSearch className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Cari member..." className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary ml-auto"><IconPlus className="w-4 h-4" /> Tambah Member</button>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="card-hover">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-dark-800">{customer.name}</h3>
                <p className="text-sm text-dark-400">{customer.phone}</p>
              </div>
              <span className="badge bg-amber-50 text-amber-700 font-bold">{customer.loyaltyPoints} pts</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><span className="text-dark-400 text-xs">Total Belanja</span><p className="font-semibold text-dark-700">Rp {customer.totalSpent.toLocaleString("id-ID")}</p></div>
              <div><span className="text-dark-400 text-xs">Kunjungan</span><p className="font-semibold text-dark-700">{customer.visitCount}x</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedCustomer(customer.id)} className="btn-primary text-xs py-2 flex-1">Tukar Poin</button>
              <button className="btn-outline text-xs py-2 px-3"><IconWhatsapp className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-dark-800">Tambah Member</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-dark-50"><IconX className="w-5 h-5 text-dark-400" /></button>
            </div>
            <div className="space-y-3">
              <input className="input" placeholder="Nama Lengkap" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
              <input className="input" placeholder="No. WhatsApp (08...)" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
              <button onClick={handleAddCustomer} className="btn-success w-full py-3">Daftarkan</button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-dark-800">Tukar Poin</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-lg hover:bg-dark-50"><IconX className="w-5 h-5 text-dark-400" /></button>
            </div>
            <div className="text-center mb-4">
              <p className="font-semibold text-dark-800">{customers.find((c) => c.id === selectedCustomer)?.name}</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">{customers.find((c) => c.id === selectedCustomer)?.loyaltyPoints} poin</p>
            </div>
            <div className="space-y-3">
              <input type="number" className="input" placeholder="Jumlah poin ditukar" value={redeemPoints} onChange={(e) => setRedeemPoints(e.target.value)} />
              {redeemPoints && parseInt(redeemPoints) > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-700 text-center">
                  Diskon: Rp {(parseInt(redeemPoints) * 100).toLocaleString("id-ID")}
                </div>
              )}
              <button onClick={() => handleRedeem(selectedCustomer)} className="btn-success w-full py-3">Tukar Sekarang</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
