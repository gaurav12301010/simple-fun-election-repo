import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ user: null });
    }

    const supabase = getSupabaseAdmin();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, dob, username, status, admin_message')
      .eq('id', session.id as string)
      .single();

    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
