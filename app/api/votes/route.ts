import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Always fetch LIVE status from DB — the JWT status is stale (baked at login time)
    const supabase = getSupabaseAdmin();
    const { data: liveUser } = await supabase
      .from('users')
      .select('status')
      .eq('id', session.id as string)
      .single();

    if (!liveUser || liveUser.status !== 'verified') {
      return NextResponse.json({ error: 'Your account is not verified.' }, { status: 403 });
    }

    const { candidate_id } = await request.json();
    if (!candidate_id) {
      return NextResponse.json({ error: 'Candidate selection required.' }, { status: 400 });
    }

    // Reuse the supabase client already created above
    
    // Check if user already voted (Supabase UNIQUE constraint also handles this but good to have nice message)
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', session.id)
      .single();

    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted!' }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from('votes')
      .insert([{ user_id: session.id, candidate_id }])
      .select()
      .single();

    if (insertError) {
      // Postgres error code 23505 is unique_violation
      if (insertError.code === '23505') {
         return NextResponse.json({ error: 'You have already voted!' }, { status: 400 });
      }
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  // Just return the count for the results page maybe?
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('votes').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
