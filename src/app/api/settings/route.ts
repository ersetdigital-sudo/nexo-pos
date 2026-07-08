import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET all settings
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM settings"
    );

    const settings: Record<string, string> = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    return NextResponse.json({
      storeName: settings.store_name || "Nexo POS",
      storePhone: settings.store_phone || "",
      taxRate: parseFloat(settings.tax_rate || "0.11"),
      loyaltyPointsPerAmount: parseInt(settings.loyalty_points_per_amount || "10000"),
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const keyMap: Record<string, string> = {
      storeName: "store_name",
      storePhone: "store_phone",
      taxRate: "tax_rate",
      loyaltyPointsPerAmount: "loyalty_points_per_amount",
    };

    for (const [key, value] of Object.entries(body)) {
      const dbKey = keyMap[key];
      if (dbKey) {
        await pool.query<ResultSetHeader>(
          "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
          [dbKey, String(value), String(value)]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
