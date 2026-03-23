import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const short_form = formData.get("short_form") as string;
    const party = formData.get("party") as string;
    const agenda = formData.get("agenda") as string;
    const file = formData.get("logo") as File;

    if (!name || !short_form || !party || !agenda || !file) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: urlData } = supabase.storage.from("logos").getPublicUrl(fileName);
    const logo_url = urlData.publicUrl;

    const { data, error } = await supabase
      .from("candidates")
      .insert([{ name, short_form: short_form.toUpperCase(), party, agenda, logo_url, status: "pending" }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
