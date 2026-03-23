import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('electx_admin')?.value === (process.env.ADMIN_PASSWORD || 'secret123');
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('candidates').select('*').order('created_at', { ascending: false });
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { candidateId, status } = await request.json();
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('candidates')
      .update({ status })
      .eq('id', candidateId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
