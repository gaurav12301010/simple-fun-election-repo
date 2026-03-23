import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status');

  let query = supabase.from("candidates").select("*").order("created_at", { ascending: true });
  
  if (statusParam !== 'all') {
    query = query.eq('status', 'approved');
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    
    // Check if user is verified
    const { data: userRecord } = await supabase.from('users').select('status').eq('id', session.id as string).single();
    if (!userRecord || userRecord.status !== 'verified') {
      return NextResponse.json({ error: "Only verified voters can stand for election." }, { status: 403 });
    }

    // Check if they already applied
    const { data: existing } = await supabase.from('candidates').select('id').eq('user_id', session.id as string).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: "You have already registered as a candidate." }, { status: 400 });
    }

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
      .insert([{ 
        user_id: session.id,
        name, 
        short_form: short_form.toUpperCase(), 
        party, 
        agenda, 
        logo_url, 
        status: "pending" 
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
