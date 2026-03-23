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

  // 1. Aggregate vote counts per candidate
  const { data: allVotes, error: votesError } = await supabase
    .from('votes')
    .select('candidate_id, user_id, created_at');
  if (votesError) return NextResponse.json({ error: votesError.message }, { status: 500 });

  const { data: candidates, error: candError } = await supabase
    .from('candidates')
    .select('id, name');
  if (candError) return NextResponse.json({ error: candError.message }, { status: 500 });

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name, username');
  if (usersError) return NextResponse.json({ error: usersError.message }, { status: 500 });

  // Build lookup maps
  const candidateMap: Record<string, string> = {};
  candidates.forEach((c: any) => { candidateMap[c.id] = c.name; });

  const userMap: Record<string, { name: string; username: string }> = {};
  users.forEach((u: any) => { userMap[u.id] = { name: u.name, username: u.username }; });

  // 2. Vote counts summary
  const counts: Record<string, number> = {};
  allVotes.forEach((v: any) => {
    counts[v.candidate_id] = (counts[v.candidate_id] || 0) + 1;
  });

  const summary = candidates.map((c: any) => ({
    id: c.id,
    name: c.name,
    votes: counts[c.id] || 0,
  })).sort((a, b) => b.votes - a.votes);

  // 3. Detailed audit log: who voted for whom
  const auditLog = allVotes.map((v: any) => ({
    voter_name: userMap[v.user_id]?.name || 'Unknown',
    voter_username: userMap[v.user_id]?.username || '?',
    candidate_name: candidateMap[v.candidate_id] || 'Unknown',
    voted_at: v.created_at,
  })).sort((a: any, b: any) => new Date(b.voted_at).getTime() - new Date(a.voted_at).getTime());

  return NextResponse.json({ summary, auditLog });
}
