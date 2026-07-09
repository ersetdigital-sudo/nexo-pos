import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// GET current display data (active cart + latest order)
export async function GET() {
  try {
    // Get the most recent active/pending order (last 5 minutes)
    const [recentOrders] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM orders 
       WHERE status IN ('pending', 'preparing') 
       AND created_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
       ORDER BY created_at DESC LIMIT 1`
    );

    // Get last completed order (for "thank you" screen)
    const [lastCompleted] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM orders 
       WHERE status = 'completed' 
       AND completed_at >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)
       ORDER BY completed_at DESC LIMIT 1`
    );

    // Get current cart from display_cart table (live cart being built)
    const [cartRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM display_cart ORDER BY added_at DESC"
    );

    // Get store settings
    const [settingsRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM settings WHERE setting_key IN ('store_name', 'tax_rate')"
    );
    const settings: Record<string, string> = {};
    settingsRows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    let lastOrder = null;
    if (lastCompleted.length > 0) {
      lastOrder = {
        orderNumber: lastCompleted[0].order_number,
        total: Number(lastCompleted[0].total),
        status: lastCompleted[0].status,
      };
    } else if (recentOrders.length > 0) {
      // Get items for recent active order
      const [orderItems] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM order_items WHERE order_id = ?",
        [recentOrders[0].id]
      );

      lastOrder = {
        orderNumber: recentOrders[0].order_number,
        total: Number(recentOrders[0].total),
        status: recentOrders[0].status,
        items: orderItems.map((item) => ({
          id: item.id,
          product: {
            id: item.product_id,
            name: item.product_name,
            price: Number(item.product_price),
            image: "",
          },
          quantity: item.quantity,
          subtotal: Number(item.subtotal),
        })),
      };
    }

    // Cart data
    const cart = cartRows.map((row) => ({
      id: row.id,
      product: {
        id: row.product_id,
        name: row.product_name,
        price: Number(row.product_price),
        image: row.product_image || "",
      },
      quantity: row.quantity,
      subtotal: Number(row.subtotal),
      selectedVariations: row.selected_variations ? JSON.parse(row.selected_variations) : undefined,
    }));

    return NextResponse.json({
      cart,
      storeName: settings.store_name || "Dapur Bunda",
      taxRate: parseFloat(settings.tax_rate || "0.11"),
      lastOrder,
    });
  } catch (error) {
    console.error("GET /api/display error:", error);
    return NextResponse.json({
      cart: [],
      storeName: "Dapur Bunda",
      taxRate: 0.11,
      lastOrder: null,
    });
  }
}
