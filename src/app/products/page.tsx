"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore, Product, ProductVariation } from "@/store";
import { IconSearch, IconPlus, IconEdit, IconTrash, IconX } from "@/components/Icons";

export default function ProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [stockAdjust, setStockAdjust] = useState<{ id: string; value: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "", price: "", category: "Makanan", image: "🍽️", imageUrl: "", barcode: "", stock: "0",
  });
  const [variations, setVariations] = useState<ProductVariation[]>([]);

  const filteredProducts = products.filter((p) => {
    const matchCategory = filterCategory === "Semua" || p.category === filterCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.price) return;
    const productData: Product = {
      id: editingProduct?.id || `product-${Date.now()}`,
      name: formData.name, price: parseInt(formData.price),
      category: formData.category, image: formData.image,
      imageUrl: formData.imageUrl || undefined,
      barcode: formData.barcode || undefined, stock: parseInt(formData.stock),
      variations: variations.length > 0 ? variations : undefined,
    };
    if (editingProduct) updateProduct(editingProduct.id, productData);
    else addProduct(productData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", category: "Makanan", image: "🍽️", imageUrl: "", barcode: "", stock: "0" });
    setVariations([]); setEditingProduct(null); setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: String(product.price), category: product.category, image: product.image, imageUrl: product.imageUrl || "", barcode: product.barcode || "", stock: String(product.stock) });
    setVariations(product.variations || []); setShowForm(true);
  };


  const addVariation = () => {
    setVariations([...variations, { id: `var-${Date.now()}`, name: "", options: [{ id: `opt-${Date.now()}`, label: "", priceAdjustment: 0 }] }]);
  };

  const addOption = (vIdx: number) => {
    const updated = [...variations];
    updated[vIdx].options.push({ id: `opt-${Date.now()}-${Math.random()}`, label: "", priceAdjustment: 0 });
    setVariations(updated);
  };

  const emojiOptions = ["🍛", "🍜", "🍗", "🍢", "🥗", "🍞", "🍌", "🧀", "🧋", "🍊", "☕", "🥑", "🍕", "🍔", "🌮", "🍰", "🧁", "🍩", "🥤", "🍽️"];

  return (
    <MainLayout title="Manajemen Produk">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <IconSearch className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Cari produk..." className="input pl-10 text-[16px] sm:text-sm"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto order-last sm:order-none">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap min-h-[44px] ${
                filterCategory === cat ? "bg-primary-200 text-primary-800 shadow-bento" : "bg-surface-100 text-text-secondary hover:bg-primary-50"
              }`}>{cat}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary ml-auto min-h-[44px]">
          <IconPlus className="w-4 h-4" /> <span className="hidden sm:inline">Tambah Produk</span><span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bento-card-hover group !p-3 sm:!p-4">
            <div className="flex items-start justify-between mb-3">
              {product.imageUrl ? (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-primary-100/40 flex-shrink-0">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-50 border border-primary-100/40 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  {product.image}
                </div>
              )}
              <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(product)}
                  className="p-2 rounded-lg hover:bg-primary-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <IconEdit className="w-4 h-4 text-text-muted" />
                </button>
                <button onClick={() => { if (confirm("Hapus produk ini?")) deleteProduct(product.id); }}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <IconTrash className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-xs sm:text-sm text-text mb-1 truncate">{product.name}</h3>
            <div className="font-bold text-primary-600 text-sm">Rp {product.price.toLocaleString("id-ID")}</div>
            <div className="flex items-center justify-between mt-3">
              <span className="badge-neutral text-xs">{product.category}</span>
              <div className="flex items-center gap-1.5">
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="badge-warning text-[9px]">Low</span>
                )}
                {product.stock === 0 && (
                  <span className="badge-danger text-[9px]">Habis</span>
                )}
                {stockAdjust?.id === product.id ? (
                  <form onSubmit={(e) => { e.preventDefault(); const newStock = parseInt(stockAdjust.value); if (!isNaN(newStock) && newStock >= 0) { updateProduct(product.id, { stock: newStock }); } setStockAdjust(null); }}
                    className="flex items-center gap-1">
                    <input type="number" autoFocus className="w-14 px-1.5 py-0.5 text-xs border border-primary-200 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-primary-300"
                      value={stockAdjust.value} onChange={(e) => setStockAdjust({ ...stockAdjust, value: e.target.value })}
                      onBlur={() => { const newStock = parseInt(stockAdjust.value); if (!isNaN(newStock) && newStock >= 0) { updateProduct(product.id, { stock: newStock }); } setStockAdjust(null); }}
                      min="0" />
                  </form>
                ) : (
                  <button onClick={() => setStockAdjust({ id: product.id, value: String(product.stock) })}
                    className={`text-xs px-1.5 py-0.5 rounded-md transition-colors ${product.stock === 0 ? 'text-red-600 bg-red-50 hover:bg-red-100' : product.stock <= 5 ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-text-muted hover:bg-primary-50 hover:text-text'}`}>
                    Stok: {product.stock}
                  </button>
                )}
              </div>
            </div>
            {product.variations && product.variations.length > 0 && (
              <span className="badge-primary mt-2 text-[10px]">{product.variations.length} varian</span>
            )}
            {product.barcode && (
              <p className="text-[11px] font-mono text-text-muted mt-1 truncate">BC: {product.barcode}</p>
            )}
          </div>
        ))}
      </div>


      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bento-card-lg w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl safe-bottom">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-text">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button onClick={resetForm} className="p-2 rounded-lg hover:bg-primary-50 min-h-[44px] min-w-[44px] flex items-center justify-center">
                <IconX className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-2">Icon Produk</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button key={emoji} onClick={() => setFormData({ ...formData, image: emoji })}
                      className={`text-xl sm:text-2xl p-1.5 rounded-lg border transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        formData.image === emoji ? "border-primary-300 bg-primary-50 scale-110" : "border-transparent hover:bg-primary-50"
                      }`}>{emoji}</button>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Foto Produk (URL)</label>
                <input className="input text-[16px] sm:text-sm" value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://contoh.com/foto-produk.jpg" />
                <p className="text-[10px] sm:text-xs text-text-muted mt-1">Paste URL gambar produk. Jika diisi, foto akan tampil menggantikan emoji.</p>
                {formData.imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-primary-100/60 flex-shrink-0">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = ""; (e.target as HTMLImageElement).alt = "Error"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-green-600 font-medium">Preview foto</p>
                      <p className="text-[10px] text-text-muted truncate">{formData.imageUrl}</p>
                      <button onClick={() => setFormData({ ...formData, imageUrl: "" })}
                        className="text-[10px] text-red-500 hover:underline mt-1">Hapus foto</button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Nama Produk</label>
                <input className="input text-[16px] sm:text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama produk..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Harga (Rp)</label>
                  <input type="number" className="input text-[16px] sm:text-sm" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="25000" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Stok</label>
                  <input type="number" className="input text-[16px] sm:text-sm" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Kategori</label>
                  <select className="input text-[16px] sm:text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    {categories.filter((c) => c !== "Semua").map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1.5">Barcode</label>
                  <input className="input text-[16px] sm:text-sm" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} placeholder="Optional" />
                </div>
              </div>

              {/* Variations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-medium text-text-secondary">Varian Produk</label>
                  <button onClick={addVariation} className="text-xs font-medium text-primary-600 hover:text-primary-800 min-h-[44px] flex items-center">+ Tambah Varian</button>
                </div>
                {variations.map((variation, vIdx) => (
                  <div key={variation.id} className="p-3 rounded-xl bg-primary-50 border border-primary-100/60 mb-2">
                    <input className="input text-[16px] sm:text-sm mb-2" placeholder="Nama varian (cth: Level Pedas)" value={variation.name}
                      onChange={(e) => { const u = [...variations]; u[vIdx].name = e.target.value; setVariations(u); }} />
                    {variation.options.map((opt, oIdx) => (
                      <div key={opt.id} className="flex gap-2 mb-1.5">
                        <input className="input text-[16px] sm:text-sm flex-1" placeholder="Opsi" value={opt.label}
                          onChange={(e) => { const u = [...variations]; u[vIdx].options[oIdx].label = e.target.value; setVariations(u); }} />
                        <input type="number" className="input text-[16px] sm:text-sm w-24" placeholder="+Harga" value={opt.priceAdjustment}
                          onChange={(e) => { const u = [...variations]; u[vIdx].options[oIdx].priceAdjustment = parseInt(e.target.value) || 0; setVariations(u); }} />
                      </div>
                    ))}
                    <button onClick={() => addOption(vIdx)} className="text-xs font-medium text-primary-600 hover:underline mt-1 min-h-[44px] flex items-center">+ Opsi</button>
                  </div>
                ))}
              </div>
              <button onClick={handleSubmit} className="btn-success w-full py-3 min-h-[44px]">
                {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
