import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET all tables
export async function GET() {
  try {
    const [tables] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM tables_meja ORDER BY number"
    );

    const result = tables.map((t) => ({
      id: t.id,
      number: t.number,
      seats: t.seats,
      status: t.status,
      currentOrderId: t.current_order_id,
      qrCode: t.qr_code,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/tables error:", error);
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}

// PUT update table status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, currentOrderId } = body;

    if (!id) {
      return NextResponse.json({ error: "Table ID required" }, { status: 400 });
    }

    await pool.query<ResultSetHeader>(
      "UPDATE tables_meja SET status = ?, current_order_id = ? WHERE id = ?",
      [status, currentOrderId || null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/tables error:", error);
    return NextResponse.json({ error: "Failed to update table" }, { status: 500 });
  }
}
