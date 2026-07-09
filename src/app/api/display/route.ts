import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET current display data (active cart + latest order)
export async function GET() {
  try {
    // Get current cart from display_cart table
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

    // Get last completed order (for "thank you" screen, last 2 min)
    const [lastCompleted] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM orders 
       WHERE status = 'completed' 
       AND completed_at >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)
       ORDER BY completed_at DESC LIMIT 1`
    );

    // Get recent pending/preparing order (for "processing" screen)
    const [recentOrders] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM orders 
       WHERE status IN ('pending', 'preparing') 
       AND created_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
       ORDER BY created_at DESC LIMIT 1`
    );

    let lastOrder = null;
    if (lastCompleted.length > 0) {
      lastOrder = {
        orderNumber: lastCompleted[0].order_number,
        total: Number(lastCompleted[0].total),
        status: lastCompleted[0].status,
      };
    } else if (recentOrders.length > 0 && cartRows.length === 0) {
      lastOrder = {
        orderNumber: recentOrders[0].order_number,
        total: Number(recentOrders[0].total),
        status: recentOrders[0].status,
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
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("GET /api/display error:", errMsg);
    return NextResponse.json({
      cart: [],
      storeName: "Dapur Bunda",
      taxRate: 0.11,
      lastOrder: null,
      _error: errMsg,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }
}
