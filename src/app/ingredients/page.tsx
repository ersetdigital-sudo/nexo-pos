"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore } from "@/store";

export default function IngredientsPage() {
  const { ingredientStock, updateIngredientStock } = useStore();
  const [showRestock, setShowRestock] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState("");

  const handleRestock = (id: string) => {
    const amount = parseInt(restockAmount);
    if (amount <= 0) return;
    updateIngredientStock(id, amount);
    setShowRestock(null);
    setRestockAmount("");
  };

  const totalValue = ingredientStock.reduce(
    (sum, i) => sum + i.currentStock * i.costPerUnit,
    0
  );

  const lowStockCount = ingredientStock.filter(
    (i) => i.currentStock <= i.minimumStock
  ).length;

  return (
    <MainLayout title="🧪 Stok Bahan Baku">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500">Total Bahan</div>
          <div className="text-3xl font-black">{ingredientStock.length}</div>
          <div className="text-xs text-gray-400">jenis bahan</div>
        </div>
        <div className="card-brutal">
          <div className="text-sm font-semibold text-gray-500">Nilai Inventaris</div>
          <div className="text-2xl font-black text-secondary">Rp {totalValue.toLocaleString("id-ID")}</div>
        </div>
        <div className={`card-brutal ${lowStockCount > 0 ? "border-danger bg-red-50" : "border-success bg-green-50"}`}>
          <div className="text-sm font-semibold text-gray-500">Stok Rendah</div>
          <div className={`text-3xl font-black ${lowStockCount > 0 ? "text-danger" : "text-success"}`}>
            {lowStockCount}
          </div>
          <div className="text-xs text-gray-400">perlu restok</div>
        </div>
      </div>

      {/* Ingredient Table */}
      <div className="card-brutal overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-text">
              <th className="text-left py-3 px-4 font-black">Bahan</th>
              <th className="text-right py-3 px-4 font-black">Stok</th>
              <th className="text-right py-3 px-4 font-black">Minimum</th>
              <th className="text-right py-3 px-4 font-black">Harga/Unit</th>
              <th className="text-center py-3 px-4 font-black">Status</th>
              <th className="text-center py-3 px-4 font-black">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {ingredientStock.map((ingredient) => {
              const isLow = ingredient.currentStock <= ingredient.minimumStock;
              return (
                <tr key={ingredient.id} className={`border-b ${isLow ? "bg-red-50" : ""}`}>
                  <td className="py-3 px-4 font-bold">{ingredient.name}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    {ingredient.currentStock} {ingredient.unit}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-500">
                    {ingredient.minimumStock} {ingredient.unit}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    Rp {ingredient.costPerUnit.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`badge-brutal ${isLow ? "bg-danger text-white" : "bg-success text-white"}`}>
                      {isLow ? "RENDAH" : "AMAN"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setShowRestock(ingredient.id)}
                      className="btn-brutal-primary text-xs py-1 px-3"
                    >
                      + Restok
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-brutal bg-white w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black">📦 Restok Bahan</h2>
              <button onClick={() => setShowRestock(null)} className="text-2xl font-bold">×</button>
            </div>
            <div className="mb-4">
              <p className="font-bold">
                {ingredientStock.find((i) => i.id === showRestock)?.name}
              </p>
              <p className="text-sm text-gray-500">
                Stok saat ini: {ingredientStock.find((i) => i.id === showRestock)?.currentStock}{" "}
                {ingredientStock.find((i) => i.id === showRestock)?.unit}
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="number"
                className="input-brutal"
                placeholder="Jumlah restok"
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
              />
              <button
                onClick={() => handleRestock(showRestock)}
                className="btn-brutal-success w-full py-3"
              >
                ✅ Konfirmasi Restok
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
