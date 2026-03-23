import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();

  const { data: candidates, error: cErr } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: true });

  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });

  const { data: votes, error: vErr } = await supabase
    .from("votes")
    .select("candidate_id");

  if (vErr) return NextResponse.json({ error: vErr.message }, { status: 500 });

  const tally: Record<string, number> = {};
  for (const v of votes || []) {
    tally[v.candidate_id] = (tally[v.candidate_id] || 0) + 1;
  }

  const totalVotes = votes?.length || 0;

  const results = (candidates || []).map((c: { id: string; name: string; party: string; agenda: string; logo_url: string }) => ({
    ...c,
    vote_count: tally[c.id] || 0,
  }));

  results.sort((a: { vote_count: number }, b: { vote_count: number }) => b.vote_count - a.vote_count);

  return NextResponse.json({ results, totalVotes });
}
