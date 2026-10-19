import { NextResponse } from "next/server";
import { z } from "zod";
import { adminClient } from "@/lib/supabase";

const schema = z.object({ name: z.string().trim().min(1).max(100), email: z.email().max(254), subject: z.enum(["Product question", "Order inquiry", "Other"]), message: z.string().trim().min(10).max(2000), website: z.string().optional() });
export async function POST(request: Request) {
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Please check your form fields." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  try { const { error } = await adminClient().from("contact_messages").insert({ name: parsed.data.name, email: parsed.data.email, subject: parsed.data.subject, message: parsed.data.message }); if (error) throw error; return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Message could not be saved." }, { status: 503 }); }
}
