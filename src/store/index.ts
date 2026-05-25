import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface ProductVariation {
  id: string;
  name: string;
  options: { id: string; label: string; priceAdjustment: number }[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  imageUrl?: string;
  barcode?: string;
  variations?: ProductVariation[];
  ingredients?: { ingredientId: string; quantityUsed: number }[];
  stock: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariations?: { variationId: string; optionId: string }[];
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  paymentMethod: "cash" | "qris" | "card";
  tableNumber?: number;
  customerName?: string;
  customerPhone?: string;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  totalSpent: number;
  visitCount: number;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: "available" | "occupied" | "reserved";
  currentOrderId?: string;
  qrCode?: string;
}

export interface IngredientStock {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  minimumStock: number;
  costPerUnit: number;
}

// Store
interface POSStore {
  // Products
  products: Product[];
  categories: string[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variations?: CartItem["selectedVariations"]) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getActiveOrders: () => Order[];
  getKitchenOrders: () => Order[];
  getReadyOrders: () => Order[];

  // Customers
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomerPoints: (customerId: string, points: number) => void;

  // Tables
  tables: Table[];
  updateTableStatus: (tableId: string, status: Table["status"], orderId?: string) => void;

  // Ingredients
  ingredientStock: IngredientStock[];
  updateIngredientStock: (id: string, quantity: number) => void;

  // Settings
  storeName: string;
  storePhone: string;
  taxRate: number;
  loyaltyPointsPerAmount: number;
  setSettings: (settings: Partial<{ storeName: string; storePhone: string; taxRate: number; loyaltyPointsPerAmount: number }>) => void;
}

// Sample data
const sampleProducts: Product[] = [
  { id: "1", name: "Nasi Goreng Spesial", price: 25000, category: "Makanan", image: "🍛", imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop", stock: 50, barcode: "8901234567890", variations: [{ id: "v1", name: "Level Pedas", options: [{ id: "o1", label: "Tidak Pedas", priceAdjustment: 0 }, { id: "o2", label: "Sedang", priceAdjustment: 0 }, { id: "o3", label: "Pedas", priceAdjustment: 2000 }, { id: "o4", label: "Extra Pedas", priceAdjustment: 3000 }] }] },
  { id: "2", name: "Mie Ayam Bakso", price: 20000, category: "Makanan", image: "🍜", imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop", stock: 40, barcode: "8901234567891" },
  { id: "3", name: "Ayam Geprek", price: 22000, category: "Makanan", image: "🍗", imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=200&fit=crop", stock: 35, barcode: "8901234567892", variations: [{ id: "v2", name: "Sambal", options: [{ id: "o5", label: "Sambal Matah", priceAdjustment: 0 }, { id: "o6", label: "Sambal Bawang", priceAdjustment: 0 }, { id: "o7", label: "Sambal Ijo", priceAdjustment: 2000 }] }] },
  { id: "4", name: "Es Teh Manis", price: 5000, category: "Minuman", image: "🧋", imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop", stock: 100, barcode: "8901234567893" },
  { id: "5", name: "Es Jeruk Segar", price: 8000, category: "Minuman", image: "🍊", imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop", stock: 80, barcode: "8901234567894" },
  { id: "6", name: "Kopi Susu Gula Aren", price: 18000, category: "Minuman", image: "☕", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop", stock: 60, barcode: "8901234567895", variations: [{ id: "v3", name: "Ukuran", options: [{ id: "o8", label: "Regular", priceAdjustment: 0 }, { id: "o9", label: "Large", priceAdjustment: 5000 }] }, { id: "v4", name: "Suhu", options: [{ id: "o10", label: "Dingin", priceAdjustment: 0 }, { id: "o11", label: "Panas", priceAdjustment: 0 }] }] },
  { id: "7", name: "Sate Ayam 10 Tusuk", price: 30000, category: "Makanan", image: "🍢", imageUrl: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=200&h=200&fit=crop", stock: 25, barcode: "8901234567896" },
  { id: "8", name: "Gado-Gado", price: 18000, category: "Makanan", image: "🥗", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop", stock: 30, barcode: "8901234567897" },
  { id: "9", name: "Roti Bakar Coklat", price: 15000, category: "Snack", image: "🍞", imageUrl: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=200&h=200&fit=crop", stock: 45, barcode: "8901234567898" },
  { id: "10", name: "Pisang Goreng Keju", price: 12000, category: "Snack", image: "🍌", imageUrl: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=200&h=200&fit=crop", stock: 50, barcode: "8901234567899" },
  { id: "11", name: "Tahu Crispy", price: 10000, category: "Snack", image: "🧀", imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop", stock: 60, barcode: "8901234567900" },
  { id: "12", name: "Jus Alpukat", price: 15000, category: "Minuman", image: "🥑", imageUrl: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=200&h=200&fit=crop", stock: 40, barcode: "8901234567901" },
];

const sampleTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `table-${i + 1}`,
  number: i + 1,
  seats: i < 4 ? 2 : i < 8 ? 4 : 6,
  status: "available" as const,
}));

const sampleIngredients: IngredientStock[] = [
  { id: "ing1", name: "Beras", currentStock: 50, unit: "kg", minimumStock: 10, costPerUnit: 12000 },
  { id: "ing2", name: "Mie Telur", currentStock: 100, unit: "bungkus", minimumStock: 20, costPerUnit: 3000 },
  { id: "ing3", name: "Ayam", currentStock: 30, unit: "kg", minimumStock: 5, costPerUnit: 35000 },
  { id: "ing4", name: "Telur", currentStock: 200, unit: "butir", minimumStock: 50, costPerUnit: 2500 },
  { id: "ing5", name: "Gula Aren", currentStock: 10, unit: "kg", minimumStock: 2, costPerUnit: 45000 },
  { id: "ing6", name: "Kopi Robusta", currentStock: 5, unit: "kg", minimumStock: 1, costPerUnit: 80000 },
  { id: "ing7", name: "Susu Segar", currentStock: 20, unit: "liter", minimumStock: 5, costPerUnit: 18000 },
  { id: "ing8", name: "Minyak Goreng", currentStock: 15, unit: "liter", minimumStock: 3, costPerUnit: 17000 },
];

const sampleCustomers: Customer[] = [
  { id: "c1", name: "Budi Santoso", phone: "08123456789", loyaltyPoints: 250, totalSpent: 500000, visitCount: 12 },
  { id: "c2", name: "Siti Rahayu", phone: "08234567890", loyaltyPoints: 180, totalSpent: 360000, visitCount: 8 },
  { id: "c3", name: "Ahmad Wijaya", phone: "08345678901", loyaltyPoints: 420, totalSpent: 840000, visitCount: 20 },
];

// Dummy orders for demo
const sampleOrders: Order[] = [
  {
    id: "order-demo-1", orderNumber: "250523-001",
    items: [
      { id: "ci1", product: sampleProducts[0], quantity: 2, subtotal: 50000, selectedVariations: [{ variationId: "v1", optionId: "o3" }] },
      { id: "ci2", product: sampleProducts[4], quantity: 2, subtotal: 16000 },
    ],
    total: 73260, status: "completed", paymentMethod: "qris",
    tableNumber: 3, customerName: "Budi Santoso", customerPhone: "08123456789",
    loyaltyPointsEarned: 7, loyaltyPointsUsed: 0, createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "order-demo-2", orderNumber: "250523-002",
    items: [
      { id: "ci3", product: sampleProducts[2], quantity: 1, subtotal: 22000, selectedVariations: [{ variationId: "v2", optionId: "o5" }] },
      { id: "ci4", product: sampleProducts[5], quantity: 1, subtotal: 18000, selectedVariations: [{ variationId: "v3", optionId: "o9" }, { variationId: "v4", optionId: "o10" }] },
      { id: "ci5", product: sampleProducts[3], quantity: 1, subtotal: 5000 },
    ],
    total: 49950, status: "completed", paymentMethod: "cash",
    customerName: "Siti Rahayu", customerPhone: "08234567890",
    loyaltyPointsEarned: 4, loyaltyPointsUsed: 0, createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "order-demo-3", orderNumber: "250523-003",
    items: [
      { id: "ci6", product: sampleProducts[6], quantity: 1, subtotal: 30000 },
      { id: "ci7", product: sampleProducts[7], quantity: 1, subtotal: 18000 },
      { id: "ci8", product: sampleProducts[11], quantity: 2, subtotal: 30000 },
    ],
    total: 86580, status: "preparing", paymentMethod: "qris",
    tableNumber: 6, customerName: "Ahmad Wijaya", customerPhone: "08345678901",
    loyaltyPointsEarned: 8, loyaltyPointsUsed: 0, createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: "order-demo-4", orderNumber: "250523-004",
    items: [
      { id: "ci9", product: sampleProducts[5], quantity: 2, subtotal: 36000, selectedVariations: [{ variationId: "v3", optionId: "o8" }, { variationId: "v4", optionId: "o10" }] },
      { id: "ci10", product: sampleProducts[8], quantity: 1, subtotal: 15000 },
    ],
    total: 56610, status: "ready", paymentMethod: "card",
    tableNumber: 1, loyaltyPointsEarned: 5, loyaltyPointsUsed: 0, createdAt: new Date(Date.now() - 900000),
  },
  {
    id: "order-demo-5", orderNumber: "250523-005",
    items: [
      { id: "ci11", product: sampleProducts[1], quantity: 2, subtotal: 40000 },
      { id: "ci12", product: sampleProducts[10], quantity: 1, subtotal: 10000 },
      { id: "ci13", product: sampleProducts[3], quantity: 2, subtotal: 10000 },
    ],
    total: 66600, status: "pending", paymentMethod: "cash",
    tableNumber: 8, customerName: "Dewi Lestari",
    loyaltyPointsEarned: 6, loyaltyPointsUsed: 0, createdAt: new Date(Date.now() - 300000),
  },
  {
    id: "order-demo-6", orderNumber: "250523-006",
    items: [
      { id: "ci14", product: sampleProducts[9], quantity: 3, subtotal: 36000 },
      { id: "ci15", product: sampleProducts[4], quantity: 3, subtotal: 24000 },
    ],
    total: 66600, status: "completed", paymentMethod: "qris",
    customerName: "Rizky Pratama", customerPhone: "08456789012",
    loyaltyPointsEarned: 6, loyaltyPointsUsed: 0, createdAt: new Date(Date.now() - 10800000),
  },
  {
    id: "order-demo-7", orderNumber: "250523-007",
    items: [
      { id: "ci16", product: sampleProducts[0], quantity: 1, subtotal: 25000, selectedVariations: [{ variationId: "v1", optionId: "o4" }] },
      { id: "ci17", product: sampleProducts[5], quantity: 1, subtotal: 23000, selectedVariations: [{ variationId: "v3", optionId: "o9" }, { variationId: "v4", optionId: "o11" }] },
    ],
    total: 53280, status: "completed", paymentMethod: "cash",
    tableNumber: 5, customerName: "Fitri Handayani",
    loyaltyPointsEarned: 5, loyaltyPointsUsed: 0, createdAt: new Date(Date.now() - 14400000),
  },
  {
    id: "order-demo-8", orderNumber: "250523-008",
    items: [
      { id: "ci18", product: sampleProducts[2], quantity: 2, subtotal: 44000, selectedVariations: [{ variationId: "v2", optionId: "o7" }] },
      { id: "ci19", product: sampleProducts[11], quantity: 2, subtotal: 30000 },
      { id: "ci20", product: sampleProducts[9], quantity: 2, subtotal: 24000 },
    ],
    total: 108780, status: "cancelled", paymentMethod: "qris",
    tableNumber: 10, customerName: "Joko Widodo",
    loyaltyPointsEarned: 0, loyaltyPointsUsed: 0, createdAt: new Date(Date.now() - 18000000),
  },
];

export const useStore = create<POSStore>()(persist((set, get) => ({
  // Products
  products: sampleProducts,
  categories: ["Semua", "Makanan", "Minuman", "Snack"],
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

  // Cart
  cart: [],
  addToCart: (product, variations) => set((state) => {
    const existingItem = state.cart.find(
      (item) => item.product.id === product.id && JSON.stringify(item.selectedVariations) === JSON.stringify(variations)
    );
    if (existingItem) {
      return {
        cart: state.cart.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
            : item
        ),
      };
    }
    const variationAdjustment = variations?.reduce((acc, v) => {
      const variation = product.variations?.find((pv) => pv.id === v.variationId);
      const option = variation?.options.find((o) => o.id === v.optionId);
      return acc + (option?.priceAdjustment || 0);
    }, 0) || 0;
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      product,
      quantity: 1,
      selectedVariations: variations,
      subtotal: product.price + variationAdjustment,
    };
    return { cart: [...state.cart, newItem] };
  }),
  removeFromCart: (itemId) => set((state) => ({ cart: state.cart.filter((item) => item.id !== itemId) })),
  updateCartQuantity: (itemId, quantity) => set((state) => ({
    cart: quantity <= 0
      ? state.cart.filter((item) => item.id !== itemId)
      : state.cart.map((item) =>
          item.id === itemId ? { ...item, quantity, subtotal: quantity * (item.subtotal / item.quantity) } : item
        ),
  })),
  clearCart: () => set({ cart: [] }),

  // Orders
  orders: sampleOrders,
  addOrder: (order) => set((state) => {
    // Reduce stock for each item in the order
    const updatedProducts = state.products.map((product) => {
      const orderItem = order.items.find((item) => item.product.id === product.id);
      if (orderItem) {
        return { ...product, stock: Math.max(0, product.stock - orderItem.quantity) };
      }
      return product;
    });
    return { orders: [order, ...state.orders], products: updatedProducts };
  }),
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((o) =>
      o.id === orderId ? { ...o, status, ...(status === "completed" ? { completedAt: new Date() } : {}) } : o
    ),
  })),
  getActiveOrders: () => get().orders.filter((o) => o.status !== "completed" && o.status !== "cancelled"),
  getKitchenOrders: () => get().orders.filter((o) => o.status === "pending" || o.status === "preparing"),
  getReadyOrders: () => get().orders.filter((o) => o.status === "ready"),

  // Customers
  customers: sampleCustomers,
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  updateCustomerPoints: (customerId, points) => set((state) => ({
    customers: state.customers.map((c) => (c.id === customerId ? { ...c, loyaltyPoints: c.loyaltyPoints + points } : c)),
  })),

  // Tables
  tables: sampleTables,
  updateTableStatus: (tableId, status, orderId) => set((state) => ({
    tables: state.tables.map((t) => (t.id === tableId ? { ...t, status, currentOrderId: orderId } : t)),
  })),

  // Ingredients
  ingredientStock: sampleIngredients,
  updateIngredientStock: (id, quantity) => set((state) => ({
    ingredientStock: state.ingredientStock.map((i) => (i.id === id ? { ...i, currentStock: i.currentStock + quantity } : i)),
  })),

  // Settings
  storeName: "Nexo POS",
  storePhone: "08123456789",
  taxRate: 0.11,
  loyaltyPointsPerAmount: 10000,
  setSettings: (settings) => set((state) => ({ ...state, ...settings })),
}), {
  name: "nexo-pos-storage",
  partialize: (state) => ({
    orders: state.orders,
    products: state.products,
    customers: state.customers,
    tables: state.tables,
    ingredientStock: state.ingredientStock,
    storeName: state.storeName,
    storePhone: state.storePhone,
    taxRate: state.taxRate,
    loyaltyPointsPerAmount: state.loyaltyPointsPerAmount,
  }),
}));
