import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET all orders
export async function GET() {
  try {
    const [orders] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    const [orderItems] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM order_items"
    );

    const result = orders.map((order) => {
      const items = orderItems
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          id: item.id,
          product: {
            id: item.product_id,
            name: item.product_name,
            price: Number(item.product_price),
          },
          quantity: item.quantity,
          subtotal: Number(item.subtotal),
          notes: item.notes,
          selectedVariations: item.selected_variations
            ? JSON.parse(item.selected_variations)
            : undefined,
        }));

      return {
        id: order.id,
        orderNumber: order.order_number,
        items,
        total: Number(order.total),
        status: order.status,
        paymentMethod: order.payment_method,
        tableNumber: order.table_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        loyaltyPointsEarned: order.loyalty_points_earned,
        loyaltyPointsUsed: order.loyalty_points_used,
        createdAt: order.created_at,
        completedAt: order.completed_at,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id, orderNumber, items, total, status, paymentMethod,
      tableNumber, customerName, customerPhone,
      loyaltyPointsEarned, loyaltyPointsUsed,
    } = body;

    await pool.query<ResultSetHeader>(
      `INSERT INTO orders (id, order_number, total, status, payment_method, table_number, customer_name, customer_phone, loyalty_points_earned, loyalty_points_used)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, orderNumber, total, status || "pending", paymentMethod, tableNumber || null, customerName || null, customerPhone || null, loyaltyPointsEarned || 0, loyaltyPointsUsed || 0]
    );

    // Insert order items
    for (const item of items) {
      await pool.query<ResultSetHeader>(
        `INSERT INTO order_items (id, order_id, product_id, product_name, product_price, quantity, subtotal, notes, selected_variations)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          id,
          item.product.id,
          item.product.name,
          item.product.price,
          item.quantity,
          item.subtotal,
          item.notes || null,
          item.selectedVariations ? JSON.stringify(item.selectedVariations) : null,
        ]
      );

      // Reduce product stock
      await pool.query<ResultSetHeader>(
        "UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?",
        [item.quantity, item.product.id]
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// PUT update order status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Order ID and status required" }, { status: 400 });
    }

    const completedAt = status === "completed" ? new Date() : null;

    await pool.query<ResultSetHeader>(
      "UPDATE orders SET status = ?, completed_at = ? WHERE id = ?",
      [status, completedAt, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/orders error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
