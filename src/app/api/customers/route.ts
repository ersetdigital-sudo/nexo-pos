import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET all customers
export async function GET() {
  try {
    const [customers] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM customers ORDER BY name"
    );

    const result = customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      loyaltyPoints: c.loyalty_points,
      totalSpent: Number(c.total_spent),
      visitCount: c.visit_count,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// POST create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, loyaltyPoints, totalSpent, visitCount } = body;

    await pool.query<ResultSetHeader>(
      "INSERT INTO customers (id, name, phone, loyalty_points, total_spent, visit_count) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, phone, loyaltyPoints || 0, totalSpent || 0, visitCount || 0]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

// PUT update customer points
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, loyaltyPoints, totalSpent, visitCount } = body;

    if (!id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
    }

    const fields: string[] = [];
    const values: unknown[] = [];

    if (loyaltyPoints !== undefined) { fields.push("loyalty_points = loyalty_points + ?"); values.push(loyaltyPoints); }
    if (totalSpent !== undefined) { fields.push("total_spent = total_spent + ?"); values.push(totalSpent); }
    if (visitCount !== undefined) { fields.push("visit_count = visit_count + ?"); values.push(visitCount); }

    if (fields.length > 0) {
      values.push(id);
      await pool.query<ResultSetHeader>(
        `UPDATE customers SET ${fields.join(", ")} WHERE id = ?`,
        values
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/customers error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
