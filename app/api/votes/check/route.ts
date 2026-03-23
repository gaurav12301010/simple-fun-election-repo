import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || !session.id) {
    return NextResponse.json({ voted: false });
  }

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('votes')
    .select('candidate_id')
    .eq('user_id', session.id as string)
    .single();

  return NextResponse.json({ voted: !!data, candidate_id: data?.candidate_id || null });
}
