import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET all products with variations
export async function GET() {
  try {
    const [products] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM products ORDER BY name"
    );

    // Get variations for all products
    const [variations] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM product_variations"
    );

    const [options] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM variation_options"
    );

    // Assemble products with variations
    const result = products.map((product) => {
      const productVariations = variations
        .filter((v) => v.product_id === product.id)
        .map((v) => ({
          id: v.id,
          name: v.name,
          options: options
            .filter((o) => o.variation_id === v.id)
            .map((o) => ({
              id: o.id,
              label: o.label,
              priceAdjustment: Number(o.price_adjustment),
            })),
        }));

      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        category: product.category,
        image: product.image,
        imageUrl: product.image_url,
        barcode: product.barcode,
        stock: product.stock,
        variations: productVariations.length > 0 ? productVariations : undefined,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, price, category, image, imageUrl, barcode, stock, variations } = body;

    await pool.query<ResultSetHeader>(
      "INSERT INTO products (id, name, price, category, image, image_url, barcode, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, name, price, category, image || "", imageUrl || null, barcode || null, stock || 0]
    );

    // Insert variations if any
    if (variations && variations.length > 0) {
      for (const variation of variations) {
        await pool.query<ResultSetHeader>(
          "INSERT INTO product_variations (id, product_id, name) VALUES (?, ?, ?)",
          [variation.id, id, variation.name]
        );
        for (const option of variation.options) {
          await pool.query<ResultSetHeader>(
            "INSERT INTO variation_options (id, variation_id, label, price_adjustment) VALUES (?, ?, ?, ?)",
            [option.id, variation.id, option.label, option.priceAdjustment || 0]
          );
        }
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const fields: string[] = [];
    const values: unknown[] = [];

    if (updates.name !== undefined) { fields.push("name = ?"); values.push(updates.name); }
    if (updates.price !== undefined) { fields.push("price = ?"); values.push(updates.price); }
    if (updates.category !== undefined) { fields.push("category = ?"); values.push(updates.category); }
    if (updates.image !== undefined) { fields.push("image = ?"); values.push(updates.image); }
    if (updates.imageUrl !== undefined) { fields.push("image_url = ?"); values.push(updates.imageUrl); }
    if (updates.barcode !== undefined) { fields.push("barcode = ?"); values.push(updates.barcode); }
    if (updates.stock !== undefined) { fields.push("stock = ?"); values.push(updates.stock); }

    if (fields.length > 0) {
      values.push(id);
      await pool.query<ResultSetHeader>(
        `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
        values
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await pool.query<ResultSetHeader>("DELETE FROM products WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
