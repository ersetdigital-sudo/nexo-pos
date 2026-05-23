"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useStore, Product, ProductVariation } from "@/store";

export default function ProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Makanan",
    image: "🍽️",
    barcode: "",
    stock: "0",
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
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      image: formData.image,
      barcode: formData.barcode || undefined,
      stock: parseInt(formData.stock),
      variations: variations.length > 0 ? variations : undefined,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", category: "Makanan", image: "🍽️", barcode: "", stock: "0" });
    setVariations([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
      image: product.image,
      barcode: product.barcode || "",
      stock: String(product.stock),
    });
    setVariations(product.variations || []);
    setShowForm(true);
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        id: `var-${Date.now()}`,
        name: "",
        options: [{ id: `opt-${Date.now()}`, label: "", priceAdjustment: 0 }],
      },
    ]);
  };

  const addOption = (variationIdx: number) => {
    const updated = [...variations];
    updated[variationIdx].options.push({
      id: `opt-${Date.now()}-${Math.random()}`,
      label: "",
      priceAdjustment: 0,
    });
    setVariations(updated);
  };

  const emojiOptions = ["🍛", "🍜", "🍗", "🍢", "🥗", "🍞", "🍌", "🧀", "🧋", "🍊", "☕", "🥑", "🍕", "🍔", "🌮", "🍰", "🧁", "🍩", "🥤", "🍽️"];

  return (
    <MainLayout title="📦 Manajemen Produk">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Cari produk..."
          className="input-brutal max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-sm font-bold border-2 border-text ${
                filterCategory === cat ? "bg-primary shadow-brutal-sm" : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-brutal-primary ml-auto">
          + Tambah Produk
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card-brutal">
            <div className="flex items-start justify-between mb-2">
              <span className="text-4xl">{product.image}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(product)}
                  className="w-8 h-8 border-2 border-text flex items-center justify-center text-sm hover:bg-primary"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (confirm("Hapus produk ini?")) deleteProduct(product.id);
                  }}
                  className="w-8 h-8 border-2 border-text flex items-center justify-center text-sm hover:bg-danger hover:text-white"
                >
                  🗑️
                </button>
              </div>
            </div>
            <h3 className="font-bold text-sm mb-1">{product.name}</h3>
            <div className="font-black text-lg text-secondary">
              Rp {product.price.toLocaleString("id-ID")}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="badge-brutal bg-gray-100">{product.category}</span>
              <span className="font-medium text-gray-500">Stok: {product.stock}</span>
            </div>
            {product.variations && product.variations.length > 0 && (
              <div className="mt-2 text-xs text-secondary font-semibold">
                {product.variations.length} varian
              </div>
            )}
            {product.barcode && (
              <div className="mt-1 text-xs font-mono text-gray-400">BC: {product.barcode}</div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-brutal bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">
                {editingProduct ? "✏️ Edit Produk" : "➕ Tambah Produk Baru"}
              </h2>
              <button onClick={resetForm} className="text-2xl font-bold hover:text-danger">×</button>
            </div>

            <div className="space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-bold mb-2">Icon Produk</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, image: emoji })}
                      className={`text-2xl p-1 border-2 ${
                        formData.image === emoji ? "border-text bg-primary" : "border-transparent"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Nama Produk</label>
                <input
                  className="input-brutal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama produk..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    className="input-brutal"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Stok</label>
                  <input
                    type="number"
                    className="input-brutal"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-1">Kategori</label>
                  <select
                    className="input-brutal"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.filter((c) => c !== "Semua").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Barcode</label>
                  <input
                    className="input-brutal"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Variations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold">Varian Produk</label>
                  <button onClick={addVariation} className="text-xs btn-brutal-secondary py-1 px-2">
                    + Varian
                  </button>
                </div>
                {variations.map((variation, vIdx) => (
                  <div key={variation.id} className="border-2 border-gray-200 p-3 mb-2">
                    <input
                      className="input-brutal mb-2 text-sm"
                      placeholder="Nama varian (cth: Level Pedas)"
                      value={variation.name}
                      onChange={(e) => {
                        const updated = [...variations];
                        updated[vIdx].name = e.target.value;
                        setVariations(updated);
                      }}
                    />
                    {variation.options.map((opt, oIdx) => (
                      <div key={opt.id} className="flex gap-2 mb-1">
                        <input
                          className="input-brutal text-sm flex-1"
                          placeholder="Opsi"
                          value={opt.label}
                          onChange={(e) => {
                            const updated = [...variations];
                            updated[vIdx].options[oIdx].label = e.target.value;
                            setVariations(updated);
                          }}
                        />
                        <input
                          type="number"
                          className="input-brutal text-sm w-24"
                          placeholder="+Harga"
                          value={opt.priceAdjustment}
                          onChange={(e) => {
                            const updated = [...variations];
                            updated[vIdx].options[oIdx].priceAdjustment = parseInt(e.target.value) || 0;
                            setVariations(updated);
                          }}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(vIdx)}
                      className="text-xs font-bold text-secondary hover:underline mt-1"
                    >
                      + Opsi
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={handleSubmit} className="btn-brutal-success w-full py-3">
                {editingProduct ? "💾 Simpan Perubahan" : "➕ Tambah Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
