import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET all ingredient stock
export async function GET() {
  try {
    const [ingredients] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM ingredient_stock ORDER BY name"
    );

    const result = ingredients.map((i) => ({
      id: i.id,
      name: i.name,
      currentStock: Number(i.current_stock),
      unit: i.unit,
      minimumStock: Number(i.minimum_stock),
      costPerUnit: Number(i.cost_per_unit),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ingredients error:", error);
    return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
  }
}

// PUT update ingredient stock
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, quantity } = body;

    if (!id || quantity === undefined) {
      return NextResponse.json({ error: "Ingredient ID and quantity required" }, { status: 400 });
    }

    await pool.query<ResultSetHeader>(
      "UPDATE ingredient_stock SET current_stock = current_stock + ? WHERE id = ?",
      [quantity, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/ingredients error:", error);
    return NextResponse.json({ error: "Failed to update ingredient" }, { status: 500 });
  }
}
