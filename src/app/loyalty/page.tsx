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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 md:mb-6">
        <div className="bento-card-accent !p-3 sm:!p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconUsers className="w-4 h-4 text-primary-700" />
            <span className="text-xs sm:text-sm text-primary-700">Total Member</span>
          </div>
          <div className="text-lg sm:text-3xl font-bold text-primary-800">{customers.length}</div>
        </div>
        <div className="bento-card !p-3 sm:!p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconLoyalty className="w-4 h-4 text-amber-500" />
            <span className="text-xs sm:text-sm text-text-muted">Total Poin</span>
          </div>
          <div className="text-base sm:text-2xl font-bold text-text">{totalPoints.toLocaleString("id-ID")}</div>
        </div>

        <div className="bento-card !p-3 sm:!p-5">
          <span className="text-xs sm:text-sm text-text-muted">Poin per</span>
          <div className="text-sm sm:text-xl font-bold text-text mt-1">Rp {loyaltyPointsPerAmount.toLocaleString("id-ID")}</div>
          <span className="text-xs text-text-muted">= 1 poin</span>
        </div>
        <div className="bento-card-accent !p-3 sm:!p-5">
          <span className="text-xs sm:text-sm text-primary-700">Reward</span>
          <div className="text-sm sm:text-xl font-bold text-primary-800 mt-1">100 poin = 10K</div>
          <span className="text-xs text-primary-600">diskon belanja</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <IconSearch className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Cari member..." className="input pl-10 text-[16px] sm:text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary ml-auto min-h-[44px]"><IconPlus className="w-4 h-4" /> <span className="hidden sm:inline">Tambah Member</span><span className="sm:hidden">Tambah</span></button>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bento-card-hover !p-3 sm:!p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-text truncate">{customer.name}</h3>
                <p className="text-xs sm:text-sm text-text-muted">{customer.phone}</p>
              </div>
              <span className="badge-warning font-bold text-xs flex-shrink-0 ml-2">{customer.loyaltyPoints} pts</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm mb-4">
              <div>
                <span className="text-text-muted text-xs">Total Belanja</span>
                <p className="font-semibold text-text-secondary text-xs sm:text-sm">Rp {customer.totalSpent.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <span className="text-text-muted text-xs">Kunjungan</span>
                <p className="font-semibold text-text-secondary">{customer.visitCount}x</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedCustomer(customer.id)} className="btn-primary text-xs py-2 flex-1 min-h-[44px]">Tukar Poin</button>
              <button className="btn-outline text-xs py-2 px-3 min-h-[44px]"><IconWhatsapp className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>


      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bento-card-lg w-full max-w-sm rounded-t-2xl sm:rounded-2xl safe-bottom">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold text-text">Tambah Member</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-primary-50 min-h-[44px] min-w-[44px] flex items-center justify-center">
                <IconX className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-3">
              <input className="input text-[16px] sm:text-sm" placeholder="Nama Lengkap" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
              <input className="input text-[16px] sm:text-sm" placeholder="No. WhatsApp (08...)" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
              <button onClick={handleAddCustomer} className="btn-success w-full py-3 min-h-[44px]">Daftarkan</button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bento-card-lg w-full max-w-sm rounded-t-2xl sm:rounded-2xl safe-bottom">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold text-text">Tukar Poin</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-lg hover:bg-primary-50 min-h-[44px] min-w-[44px] flex items-center justify-center">
                <IconX className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="text-center mb-4">
              <p className="font-semibold text-text text-sm sm:text-base">{customers.find((c) => c.id === selectedCustomer)?.name}</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary-600 mt-2">{customers.find((c) => c.id === selectedCustomer)?.loyaltyPoints} poin</p>
            </div>
            <div className="space-y-3">
              <input type="number" className="input text-[16px] sm:text-sm" placeholder="Jumlah poin ditukar" value={redeemPoints} onChange={(e) => setRedeemPoints(e.target.value)} />
              {redeemPoints && parseInt(redeemPoints) > 0 && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs sm:text-sm font-semibold text-green-700 text-center">
                  Diskon: Rp {(parseInt(redeemPoints) * 100).toLocaleString("id-ID")}
                </div>
              )}
              <button onClick={() => handleRedeem(selectedCustomer)} className="btn-success w-full py-3 min-h-[44px]">Tukar Sekarang</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
