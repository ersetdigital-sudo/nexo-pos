import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcryptjs";

// GET - Setup first admin user (only works if no users exist)
// Access: /api/auth/setup
export async function GET() {
  try {
    // Check if any users exist
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users"
    );

    if (existing[0].count > 0) {
      return NextResponse.json({ error: "Setup sudah selesai. Users sudah ada." }, { status: 400 });
    }

    // Create admin user with password 'admin123'
    const passwordHash = await bcrypt.hash("admin123", 10);

    await pool.query<ResultSetHeader>(
      "INSERT INTO users (id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)",
      ["user-admin", "admin", passwordHash, "Administrator", "admin"]
    );

    return NextResponse.json({
      success: true,
      message: "Admin user created!",
      credentials: {
        username: "admin",
        password: "admin123",
        note: "Segera ganti password setelah login!",
      },
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("GET /api/auth/setup error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
