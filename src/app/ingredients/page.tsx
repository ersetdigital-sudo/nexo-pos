"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";
import { IconPlus, IconX, IconIngredients, IconTrendUp } from "@/components/Icons";

export default function IngredientsPage() {
  const { ingredientStock, updateIngredientStock } = useStore();
  const [showRestock, setShowRestock] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState("");

  const handleRestock = (id: string) => {
    const amount = parseInt(restockAmount);
    if (amount <= 0) return;
    updateIngredientStock(id, amount);
    setShowRestock(null); setRestockAmount("");
  };

  const totalValue = ingredientStock.reduce((sum, i) => sum + i.currentStock * i.costPerUnit, 0);
  const lowStockCount = ingredientStock.filter((i) => i.currentStock <= i.minimumStock).length;

  return (
    <MainLayout title="Stok Bahan Baku">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 md:mb-6">
        <div className="bento-card !p-3 sm:!p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconIngredients className="w-4 h-4 text-primary-500" />
            <span className="text-xs sm:text-sm text-text-muted">Total Bahan</span>
          </div>
          <div className="text-lg sm:text-3xl font-bold text-text">{ingredientStock.length}</div>
          <p className="text-xs text-text-muted mt-1">jenis bahan</p>
        </div>
        <div className="bento-card !p-3 sm:!p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconTrendUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs sm:text-sm text-text-muted">Nilai Inventaris</span>
          </div>
          <div className="text-base sm:text-2xl font-bold text-text">Rp {totalValue.toLocaleString("id-ID")}</div>
        </div>

        <div className={`bento-card !p-3 sm:!p-5 ${lowStockCount > 0 ? "border-red-200 bg-red-50/50" : "border-emerald-200 bg-emerald-50/50"}`}>
          <span className="text-xs sm:text-sm text-text-muted">Stok Rendah</span>
          <div className={`text-lg sm:text-3xl font-bold mt-1 ${lowStockCount > 0 ? "text-red-600" : "text-emerald-600"}`}>{lowStockCount}</div>
          <p className="text-xs text-text-muted mt-1">perlu restok</p>
        </div>
      </div>

      {/* Table */}
      <div className="bento-card overflow-x-auto p-0">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-primary-100/60 bg-primary-50/50">
              <th className="text-left py-3 sm:py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-text-secondary">Bahan</th>
              <th className="text-right py-3 sm:py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-text-secondary">Stok</th>
              <th className="text-right py-3 sm:py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-text-secondary">Minimum</th>
              <th className="text-right py-3 sm:py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-text-secondary">Harga/Unit</th>
              <th className="text-center py-3 sm:py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-text-secondary">Status</th>
              <th className="text-center py-3 sm:py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-text-secondary">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {ingredientStock.map((ingredient) => {
              const isLow = ingredient.currentStock <= ingredient.minimumStock;
              return (
                <tr key={ingredient.id} className={`border-b border-primary-100/40 hover:bg-primary-50/30 transition-colors ${isLow ? "bg-red-50/30" : ""}`}>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-5 font-medium text-xs sm:text-sm text-text">{ingredient.name}</td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-5 text-right font-mono text-xs sm:text-sm font-semibold text-text-secondary">{ingredient.currentStock} {ingredient.unit}</td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-5 text-right font-mono text-xs sm:text-sm text-text-muted">{ingredient.minimumStock} {ingredient.unit}</td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-5 text-right text-xs sm:text-sm text-text-secondary">Rp {ingredient.costPerUnit.toLocaleString("id-ID")}</td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-5 text-center">
                    <span className={isLow ? "badge-danger" : "badge-success"}>{isLow ? "Rendah" : "Aman"}</span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-5 text-center">
                    <button onClick={() => setShowRestock(ingredient.id)} className="btn-outline text-xs py-1.5 px-3 min-h-[44px]">
                      <IconPlus className="w-3 h-3" /> Restok
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


      {/* Restock Modal */}
      {showRestock && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bento-card-lg w-full max-w-sm rounded-t-2xl sm:rounded-2xl safe-bottom">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold text-text">Restok Bahan</h2>
              <button onClick={() => setShowRestock(null)} className="p-2 rounded-lg hover:bg-primary-50 min-h-[44px] min-w-[44px] flex items-center justify-center">
                <IconX className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-text text-sm sm:text-base">{ingredientStock.find((i) => i.id === showRestock)?.name}</p>
              <p className="text-xs sm:text-sm text-text-muted">Stok saat ini: {ingredientStock.find((i) => i.id === showRestock)?.currentStock} {ingredientStock.find((i) => i.id === showRestock)?.unit}</p>
            </div>
            <div className="space-y-3">
              <input type="number" className="input text-[16px] sm:text-sm" placeholder="Jumlah restok" value={restockAmount} onChange={(e) => setRestockAmount(e.target.value)} />
              <button onClick={() => handleRestock(showRestock)} className="btn-success w-full py-3 min-h-[44px]">Konfirmasi Restok</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
