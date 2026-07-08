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
      // General
      storeName: settings.store_name || "Dapur Bunda",
      storePhone: settings.store_phone || "",
      taxRate: parseFloat(settings.tax_rate || "0.11"),
      loyaltyPointsPerAmount: parseInt(settings.loyalty_points_per_amount || "10000"),
      // WhatsApp (Fonnte)
      waToken: settings.wa_token || "",
      waSenderNumber: settings.wa_sender_number || "",
      waTemplate: settings.wa_template || "Halo {nama}!\n\nTerima kasih sudah berbelanja di {toko}.\n\nStruk #{nomor_order}\n{detail_pesanan}\n\nTotal: Rp {total}\nPoin didapat: {poin}\n\nSampai jumpa lagi!",
      waAutoSend: settings.wa_auto_send === "true",
      // Printer
      printerType: settings.printer_type || "bluetooth",
      printerPaperWidth: settings.printer_paper_width || "58mm",
      printerName: settings.printer_name || "",
      // Payment
      paymentMerchantId: settings.payment_merchant_id || "",
      paymentApiKey: settings.payment_api_key || "",
      paymentProvider: settings.payment_provider || "midtrans",
      paymentAutoQris: settings.payment_auto_qris === "true",
      // Barcode
      barcodeFormat: settings.barcode_format || "EAN-13",
      barcodeLabelSize: settings.barcode_label_size || "30mm x 20mm",
      barcodeShowPrice: settings.barcode_show_price !== "false",
      // Scanner
      scannerType: settings.scanner_type || "usb",
      scannerAutoAdd: settings.scanner_auto_add !== "false",
      scannerSound: settings.scanner_sound !== "false",
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
      waToken: "wa_token",
      waSenderNumber: "wa_sender_number",
      waTemplate: "wa_template",
      waAutoSend: "wa_auto_send",
      printerType: "printer_type",
      printerPaperWidth: "printer_paper_width",
      printerName: "printer_name",
      paymentMerchantId: "payment_merchant_id",
      paymentApiKey: "payment_api_key",
      paymentProvider: "payment_provider",
      paymentAutoQris: "payment_auto_qris",
      barcodeFormat: "barcode_format",
      barcodeLabelSize: "barcode_label_size",
      barcodeShowPrice: "barcode_show_price",
      scannerType: "scanner_type",
      scannerAutoAdd: "scanner_auto_add",
      scannerSound: "scanner_sound",
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
