import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// POST send WhatsApp receipt via Fonnte
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, orderNumber, customerName, items, total, pointsEarned } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    // Get WA settings from DB
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM settings WHERE setting_key IN ('wa_token', 'wa_sender_number', 'wa_template', 'store_name')"
    );

    const settings: Record<string, string> = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    const token = settings.wa_token;
    if (!token) {
      return NextResponse.json({ error: "WhatsApp token not configured. Set it in Settings → WhatsApp." }, { status: 400 });
    }

    const storeName = settings.store_name || "Dapur Bunda";
    const template = settings.wa_template || "Halo {nama}!\n\nTerima kasih sudah berbelanja di {toko}.\n\nStruk #{nomor_order}\n{detail_pesanan}\n\nTotal: Rp {total}\nPoin didapat: {poin}\n\nSampai jumpa lagi!";

    // Build detail pesanan
    const detailPesanan = items
      .map((item: { name: string; quantity: number; subtotal: number }) =>
        `• ${item.name} x${item.quantity} = Rp ${item.subtotal.toLocaleString("id-ID")}`
      )
      .join("\n");

    // Replace template variables
    const message = template
      .replace(/{nama}/g, customerName || "Pelanggan")
      .replace(/{toko}/g, storeName)
      .replace(/{nomor_order}/g, orderNumber || "-")
      .replace(/{detail_pesanan}/g, detailPesanan)
      .replace(/{total}/g, total?.toLocaleString("id-ID") || "0")
      .replace(/{poin}/g, String(pointsEarned || 0));

    // Format phone number (ensure starts with 62)
    let formattedPhone = phone.replace(/[^0-9]/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    }

    // Send via Fonnte API
    const fonntResponse = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: new URLSearchParams({
        target: formattedPhone,
        message: message,
      }),
    });

    const result = await fonntResponse.json();

    if (!fonntResponse.ok || result.status === false) {
      console.error("Fonnte API error:", result);
      return NextResponse.json(
        { error: "Failed to send WhatsApp message", detail: result.reason || result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "WhatsApp receipt sent!" });
  } catch (error) {
    console.error("POST /api/whatsapp/send error:", error);
    return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 });
  }
}
