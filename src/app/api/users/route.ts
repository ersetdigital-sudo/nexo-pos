import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// GET all users (admin only)
export async function GET() {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT id, username, name, role, is_active, created_at FROM users ORDER BY created_at DESC"
    );
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const { username, password, name, role } = await request.json();

    if (!username || !password || !name || !role) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    // Check if username exists
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE username = ?", [username]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
    }

    const id = `user-${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query<ResultSetHeader>(
      "INSERT INTO users (id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)",
      [id, username, passwordHash, name, role]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PUT update user (admin only)
export async function PUT(request: NextRequest) {
  try {
    const { id, name, role, password, is_active } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const fields: string[] = [];
    const values: unknown[] = [];

    if (name !== undefined) { fields.push("name = ?"); values.push(name); }
    if (role !== undefined) { fields.push("role = ?"); values.push(role); }
    if (is_active !== undefined) { fields.push("is_active = ?"); values.push(is_active); }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      fields.push("password_hash = ?");
      values.push(hash);
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.query<ResultSetHeader>(
        `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
        values
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Don't allow deleting yourself
    await pool.query<ResultSetHeader>("DELETE FROM users WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
