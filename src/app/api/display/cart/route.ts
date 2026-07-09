import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

// POST - Update display cart (called from cashier when cart changes)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cart } = body;

    // Clear existing cart
    await pool.query<ResultSetHeader>("DELETE FROM display_cart");

    // Insert new cart items
    if (cart && cart.length > 0) {
      for (const item of cart) {
        await pool.query<ResultSetHeader>(
          `INSERT INTO display_cart (id, product_id, product_name, product_price, product_image, quantity, subtotal, selected_variations, added_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            item.id,
            item.product.id,
            item.product.name,
            item.product.price,
            item.product.image || "",
            item.quantity,
            item.subtotal,
            item.selectedVariations ? JSON.stringify(item.selectedVariations) : null,
          ]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/display/cart error:", error);
    return NextResponse.json({ error: "Failed to update display cart" }, { status: 500 });
  }
}

// DELETE - Clear display cart
export async function DELETE() {
  try {
    await pool.query<ResultSetHeader>("DELETE FROM display_cart");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/display/cart error:", error);
    return NextResponse.json({ error: "Failed to clear display cart" }, { status: 500 });
  }
}
