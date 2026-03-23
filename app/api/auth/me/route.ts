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
    // Fetch all columns to prevent missing data on profile page
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.id as string)
      .single();

    if (error || !user) {
      return NextResponse.json({ user: null });
    }
    
    // Fetch linked candidate data, if any
    const { data: candidate } = await supabase
      .from('candidates')
      .select('*')
      .eq('user_id', session.id as string)
      .maybeSingle();

    return NextResponse.json({ user: { ...user, candidate: candidate || null } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
