import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Simple admin auth check via cookies (we'll set an admin cookie in the UI)
async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('electx_admin')?.value === (process.env.ADMIN_PASSWORD || 'secret123');
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { userId, status, admin_message } = await request.json();
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('users')
      .update({ status, admin_message: admin_message || null })
      .eq('id', userId);

    if (error) throw error;

    // If the user is rejected or sent for review, invalidate their vote
    if (status === 'rejected' || status === 'review') {
      await supabase.from('votes').delete().eq('user_id', userId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
