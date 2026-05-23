"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";

export default function LoyaltyPage() {
  const { customers, addCustomer, updateCustomerPoints, loyaltyPointsPerAmount } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [redeemPoints, setRedeemPoints] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    addCustomer({
      id: `customer-${Date.now()}`,
      name: newCustomer.name,
      phone: newCustomer.phone,
      loyaltyPoints: 0,
      totalSpent: 0,
      visitCount: 0,
    });
    setNewCustomer({ name: "", phone: "" });
    setShowForm(false);
  };

  const handleRedeem = (customerId: string) => {
    const points = parseInt(redeemPoints);
    if (points <= 0) return;
    const customer = customers.find((c) => c.id === customerId);
    if (!customer || customer.loyaltyPoints < points) {
      alert("Poin tidak mencukupi!");
      return;
    }
    updateCustomerPoints(customerId, -points);
    setRedeemPoints("");
    setSelectedCustomer(null);
    alert(`✅ ${points} poin berhasil ditukar!`);
  };

  const totalPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);

  return (
    <MainLayout title="⭐ Loyalty Points">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card-brutal bg-primary">
          <div className="text-sm font-semibold">Total Member</div>
          <div className="text-3xl font-black">{customers.length}</div>
        </div>
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500">Total Poin Beredar</div>
          <div className="text-3xl font-black text-secondary">{totalPoints.toLocaleString("id-ID")}</div>
        </div>
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500">Poin per</div>
          <div className="text-xl font-black">Rp {loyaltyPointsPerAmount.toLocaleString("id-ID")}</div>
          <div className="text-xs text-gray-400">= 1 poin</div>
        </div>
        <div className="card-brutal bg-secondary text-white">
          <div className="text-sm font-semibold">Reward</div>
          <div className="text-xl font-black">100 poin = 10K</div>
          <div className="text-xs opacity-75">diskon belanja</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Cari member (nama/HP)..."
          className="input-brutal max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setShowForm(true)} className="btn-brutal-primary ml-auto">
          + Tambah Member
        </button>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="card-brutal">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
              <div className="badge-brutal bg-primary font-black">
                {customer.loyaltyPoints} pts
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Total Belanja</span>
                <div className="font-bold">Rp {customer.totalSpent.toLocaleString("id-ID")}</div>
              </div>
              <div>
                <span className="text-gray-500">Kunjungan</span>
                <div className="font-bold">{customer.visitCount}x</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCustomer(customer.id)}
                className="btn-brutal-secondary text-xs py-1 px-3 flex-1"
              >
                Tukar Poin
              </button>
              <button className="btn-brutal text-xs py-1 px-3 bg-green-100">
                📱 WA
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-brutal bg-white w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black">➕ Tambah Member</h2>
              <button onClick={() => setShowForm(false)} className="text-2xl font-bold">×</button>
            </div>
            <div className="space-y-3">
              <input
                className="input-brutal"
                placeholder="Nama Lengkap"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
              <input
                className="input-brutal"
                placeholder="No. WhatsApp (08...)"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
              <button onClick={handleAddCustomer} className="btn-brutal-success w-full py-3">
                ✅ Daftarkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-brutal bg-white w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black">🎁 Tukar Poin</h2>
              <button onClick={() => setSelectedCustomer(null)} className="text-2xl font-bold">×</button>
            </div>
            <div className="text-center mb-4">
              <p className="font-bold">{customers.find((c) => c.id === selectedCustomer)?.name}</p>
              <p className="text-3xl font-black text-secondary mt-2">
                {customers.find((c) => c.id === selectedCustomer)?.loyaltyPoints} poin
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="number"
                className="input-brutal"
                placeholder="Jumlah poin ditukar"
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.value)}
              />
              {redeemPoints && parseInt(redeemPoints) > 0 && (
                <div className="p-3 bg-primary/20 border-2 border-primary text-sm font-bold text-center">
                  Diskon: Rp {(parseInt(redeemPoints) * 100).toLocaleString("id-ID")}
                </div>
              )}
              <button
                onClick={() => handleRedeem(selectedCustomer)}
                className="btn-brutal-success w-full py-3"
              >
                ✅ Tukar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
