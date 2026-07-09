import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session_id")?.value;

    if (sessionId) {
      await pool.query<ResultSetHeader>("DELETE FROM sessions WHERE id = ?", [sessionId]);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("session_id");
    return response;
  } catch (error) {
    console.error("POST /api/auth/logout error:", error);
    const response = NextResponse.json({ success: true });
    response.cookies.delete("session_id");
    return response;
  }
}
