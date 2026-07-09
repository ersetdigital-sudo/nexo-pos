import { create } from "zustand";

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

// API helper
const api = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

// Store
interface POSStore {
  // Loading state
  isLoading: boolean;
  isInitialized: boolean;
  initializeStore: () => Promise<void>;

  // Products
  products: Product[];
  categories: string[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart (local only - no need to persist to DB)
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
  // WhatsApp
  waToken: string;
  waSenderNumber: string;
  waTemplate: string;
  waAutoSend: boolean;
  // Printer
  printerType: string;
  printerPaperWidth: string;
  printerName: string;
  // Payment
  paymentMerchantId: string;
  paymentApiKey: string;
  paymentProvider: string;
  paymentAutoQris: boolean;
  // Barcode
  barcodeFormat: string;
  barcodeLabelSize: string;
  barcodeShowPrice: boolean;
  // Scanner
  scannerType: string;
  scannerAutoAdd: boolean;
  scannerSound: boolean;
  // Settings action
  setSettings: (settings: Record<string, unknown>) => void;
  sendWhatsAppReceipt: (data: { phone: string; orderNumber: string; customerName: string; items: { name: string; quantity: number; subtotal: number }[]; total: number; pointsEarned: number }) => Promise<{ success: boolean; error?: string }>;
}

export const useStore = create<POSStore>()((set, get) => ({
  // Loading
  isLoading: true,
  isInitialized: false,

  // Initialize - fetch all data from API
  initializeStore: async () => {
    if (get().isInitialized) return;
    try {
      const [products, orders, customers, tables, ingredients, settings] = await Promise.all([
        api("/api/products"),
        api("/api/orders"),
        api("/api/customers"),
        api("/api/tables"),
        api("/api/ingredients"),
        api("/api/settings"),
      ]);

      set({
        products,
        orders: orders.map((o: Order) => ({ ...o, createdAt: new Date(o.createdAt) })),
        customers,
        tables,
        ingredientStock: ingredients,
        storeName: settings.storeName,
        storePhone: settings.storePhone,
        taxRate: settings.taxRate,
        loyaltyPointsPerAmount: settings.loyaltyPointsPerAmount,
        waToken: settings.waToken || "",
        waSenderNumber: settings.waSenderNumber || "",
        waTemplate: settings.waTemplate || "",
        waAutoSend: settings.waAutoSend || false,
        printerType: settings.printerType || "bluetooth",
        printerPaperWidth: settings.printerPaperWidth || "58mm",
        printerName: settings.printerName || "",
        paymentMerchantId: settings.paymentMerchantId || "",
        paymentApiKey: settings.paymentApiKey || "",
        paymentProvider: settings.paymentProvider || "midtrans",
        paymentAutoQris: settings.paymentAutoQris || false,
        barcodeFormat: settings.barcodeFormat || "EAN-13",
        barcodeLabelSize: settings.barcodeLabelSize || "30mm x 20mm",
        barcodeShowPrice: settings.barcodeShowPrice !== false,
        scannerType: settings.scannerType || "usb",
        scannerAutoAdd: settings.scannerAutoAdd !== false,
        scannerSound: settings.scannerSound !== false,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Failed to initialize store:", error);
      // Fallback: still set loading to false so UI shows
      set({ isLoading: false, isInitialized: true });
    }
  },

  // Products
  products: [],
  categories: ["Semua", "Makanan", "Minuman", "Snack"],

  addProduct: (product) => {
    set((state) => ({ products: [...state.products, product] }));
    api("/api/products", { method: "POST", body: JSON.stringify(product) }).catch(console.error);
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
    api("/api/products", { method: "PUT", body: JSON.stringify({ id, ...updates }) }).catch(console.error);
  },

  deleteProduct: (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
    api(`/api/products?id=${id}`, { method: "DELETE" }).catch(console.error);
  },

  // Cart (syncs to display API for cross-device customer display)
  cart: [],
  addToCart: (product, variations) => set((state) => {
    const existingItem = state.cart.find(
      (item) => item.product.id === product.id && JSON.stringify(item.selectedVariations) === JSON.stringify(variations)
    );
    let newCart;
    if (existingItem) {
      newCart = state.cart.map((item) =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
          : item
      );
    } else {
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
      newCart = [...state.cart, newItem];
    }
    // Sync to display API
    api("/api/display/cart", { method: "POST", body: JSON.stringify({ cart: newCart }) }).catch(console.error);
    return { cart: newCart };
  }),

  removeFromCart: (itemId) => set((state) => {
    const newCart = state.cart.filter((item) => item.id !== itemId);
    api("/api/display/cart", { method: "POST", body: JSON.stringify({ cart: newCart }) }).catch(console.error);
    return { cart: newCart };
  }),

  updateCartQuantity: (itemId, quantity) => set((state) => {
    const newCart = quantity <= 0
      ? state.cart.filter((item) => item.id !== itemId)
      : state.cart.map((item) =>
          item.id === itemId ? { ...item, quantity, subtotal: quantity * (item.subtotal / item.quantity) } : item
        );
    api("/api/display/cart", { method: "POST", body: JSON.stringify({ cart: newCart }) }).catch(console.error);
    return { cart: newCart };
  }),

  clearCart: () => {
    set({ cart: [] });
    api("/api/display/cart", { method: "DELETE" }).catch(console.error);
  },

  // Orders
  orders: [],

  addOrder: (order) => {
    set((state) => {
      const updatedProducts = state.products.map((product) => {
        const orderItem = order.items.find((item) => item.product.id === product.id);
        if (orderItem) {
          return { ...product, stock: Math.max(0, product.stock - orderItem.quantity) };
        }
        return product;
      });
      return { orders: [order, ...state.orders], products: updatedProducts };
    });
    api("/api/orders", { method: "POST", body: JSON.stringify(order) }).catch(console.error);
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status, ...(status === "completed" ? { completedAt: new Date() } : {}) } : o
      ),
    }));
    api("/api/orders", { method: "PUT", body: JSON.stringify({ id: orderId, status }) }).catch(console.error);
  },

  getActiveOrders: () => get().orders.filter((o) => o.status !== "completed" && o.status !== "cancelled"),
  getKitchenOrders: () => get().orders.filter((o) => o.status === "pending" || o.status === "preparing"),
  getReadyOrders: () => get().orders.filter((o) => o.status === "ready"),

  // Customers
  customers: [],

  addCustomer: (customer) => {
    set((state) => ({ customers: [...state.customers, customer] }));
    api("/api/customers", { method: "POST", body: JSON.stringify(customer) }).catch(console.error);
  },

  updateCustomerPoints: (customerId, points) => {
    set((state) => ({
      customers: state.customers.map((c) => (c.id === customerId ? { ...c, loyaltyPoints: c.loyaltyPoints + points } : c)),
    }));
    api("/api/customers", { method: "PUT", body: JSON.stringify({ id: customerId, loyaltyPoints: points }) }).catch(console.error);
  },

  // Tables
  tables: [],

  updateTableStatus: (tableId, status, orderId) => {
    set((state) => ({
      tables: state.tables.map((t) => (t.id === tableId ? { ...t, status, currentOrderId: orderId } : t)),
    }));
    api("/api/tables", { method: "PUT", body: JSON.stringify({ id: tableId, status, currentOrderId: orderId }) }).catch(console.error);
  },

  // Ingredients
  ingredientStock: [],

  updateIngredientStock: (id, quantity) => {
    set((state) => ({
      ingredientStock: state.ingredientStock.map((i) => (i.id === id ? { ...i, currentStock: i.currentStock + quantity } : i)),
    }));
    api("/api/ingredients", { method: "PUT", body: JSON.stringify({ id, quantity }) }).catch(console.error);
  },

  // Settings
  storeName: "Dapur Bunda",
  storePhone: "08123456789",
  taxRate: 0.11,
  loyaltyPointsPerAmount: 10000,
  waToken: "",
  waSenderNumber: "",
  waTemplate: "Halo {nama}!\n\nTerima kasih sudah berbelanja di {toko}.\n\nStruk #{nomor_order}\n{detail_pesanan}\n\nTotal: Rp {total}\nPoin didapat: {poin}\n\nSampai jumpa lagi!",
  waAutoSend: false,
  printerType: "bluetooth",
  printerPaperWidth: "58mm",
  printerName: "",
  paymentMerchantId: "",
  paymentApiKey: "",
  paymentProvider: "midtrans",
  paymentAutoQris: false,
  barcodeFormat: "EAN-13",
  barcodeLabelSize: "30mm x 20mm",
  barcodeShowPrice: true,
  scannerType: "usb",
  scannerAutoAdd: true,
  scannerSound: true,

  setSettings: (settings) => {
    set((state) => ({ ...state, ...settings }));
    api("/api/settings", { method: "PUT", body: JSON.stringify(settings) }).catch(console.error);
  },

  sendWhatsAppReceipt: async (data) => {
    try {
      const result = await api("/api/whatsapp/send", { method: "POST", body: JSON.stringify(data) });
      return { success: true };
    } catch (error) {
      console.error("Failed to send WA receipt:", error);
      return { success: false, error: String(error) };
    }
  },
}));
