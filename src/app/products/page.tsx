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

  const [formData, setFormData] = useState({
    name: "", price: "", category: "Makanan", image: "🍽️", barcode: "", stock: "0",
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
      barcode: formData.barcode || undefined, stock: parseInt(formData.stock),
      variations: variations.length > 0 ? variations : undefined,
    };
    if (editingProduct) updateProduct(editingProduct.id, productData);
    else addProduct(productData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", category: "Makanan", image: "🍽️", barcode: "", stock: "0" });
    setVariations([]); setEditingProduct(null); setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: String(product.price), category: product.category, image: product.image, barcode: product.barcode || "", stock: String(product.stock) });
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
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <IconSearch className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Cari produk..." className="input pl-10"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                filterCategory === cat ? "bg-primary-600 text-white shadow-soft" : "bg-dark-100 text-dark-600 hover:bg-dark-200"
              }`}>{cat}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary ml-auto">
          <IconPlus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card-hover group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-2xl">
                {product.image}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(product)}
                  className="p-2 rounded-lg hover:bg-dark-50 transition-colors">
                  <IconEdit className="w-4 h-4 text-dark-400" />
                </button>
                <button onClick={() => { if (confirm("Hapus produk ini?")) deleteProduct(product.id); }}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                  <IconTrash className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-sm text-dark-800 mb-1">{product.name}</h3>
            <div className="font-bold text-primary-600">Rp {product.price.toLocaleString("id-ID")}</div>
            <div className="flex items-center justify-between mt-3">
              <span className="badge-neutral">{product.category}</span>
              <span className="text-xs text-dark-400">Stok: {product.stock}</span>
            </div>
            {product.variations && product.variations.length > 0 && (
              <span className="badge-primary mt-2 text-[10px]">{product.variations.length} varian</span>
            )}
            {product.barcode && (
              <p className="text-[11px] font-mono text-dark-300 mt-1">BC: {product.barcode}</p>
            )}
          </div>
        ))}
      </div>


      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-dark-800">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button onClick={resetForm} className="p-2 rounded-lg hover:bg-dark-50">
                <IconX className="w-5 h-5 text-dark-400" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Icon Produk</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button key={emoji} onClick={() => setFormData({ ...formData, image: emoji })}
                      className={`text-2xl p-1.5 rounded-lg border transition-all ${
                        formData.image === emoji ? "border-primary-400 bg-primary-50 scale-110" : "border-transparent hover:bg-dark-50"
                      }`}>{emoji}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-1.5">Nama Produk</label>
                <input className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama produk..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1.5">Harga (Rp)</label>
                  <input type="number" className="input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="25000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1.5">Stok</label>
                  <input type="number" className="input" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1.5">Kategori</label>
                  <select className="input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    {categories.filter((c) => c !== "Semua").map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-1.5">Barcode</label>
                  <input className="input" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} placeholder="Optional" />
                </div>
              </div>
              {/* Variations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-dark-600">Varian Produk</label>
                  <button onClick={addVariation} className="text-xs font-medium text-primary-600 hover:text-primary-800">+ Tambah Varian</button>
                </div>
                {variations.map((variation, vIdx) => (
                  <div key={variation.id} className="p-3 rounded-xl bg-dark-50 border border-dark-100 mb-2">
                    <input className="input mb-2 text-sm" placeholder="Nama varian (cth: Level Pedas)" value={variation.name}
                      onChange={(e) => { const u = [...variations]; u[vIdx].name = e.target.value; setVariations(u); }} />
                    {variation.options.map((opt, oIdx) => (
                      <div key={opt.id} className="flex gap-2 mb-1.5">
                        <input className="input text-sm flex-1" placeholder="Opsi" value={opt.label}
                          onChange={(e) => { const u = [...variations]; u[vIdx].options[oIdx].label = e.target.value; setVariations(u); }} />
                        <input type="number" className="input text-sm w-24" placeholder="+Harga" value={opt.priceAdjustment}
                          onChange={(e) => { const u = [...variations]; u[vIdx].options[oIdx].priceAdjustment = parseInt(e.target.value) || 0; setVariations(u); }} />
                      </div>
                    ))}
                    <button onClick={() => addOption(vIdx)} className="text-xs font-medium text-primary-600 hover:underline mt-1">+ Opsi</button>
                  </div>
                ))}
              </div>
              <button onClick={handleSubmit} className="btn-success w-full py-3">
                {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
