import { NextResponse } from "next/server";
import { getProducts } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Products are temporarily unavailable." }, { status: 503 });
  }
}
