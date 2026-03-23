import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';

function generateVoterId() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `IND-2026-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, dob, username, password,
      gender, address, height, blood_group, eye_color,
      favorite_subject, trust_reason, child_income,
      partner_name, crush_count, mobile_usage, early_riser,
      photo_url, signature_url
    } = body;

    if (!name || !dob || !username || !password) {
      return NextResponse.json({ error: 'Name, DOB, username, and password are required.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check if username exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken.' }, { status: 400 });
    }

    const password_hash = await hashPassword(password);
    const voter_id = generateVoterId();

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        name, dob, username, password_hash, status: 'pending',
        voter_id, gender, address, height, blood_group, eye_color,
        favorite_subject, trust_reason, child_income,
        partner_name, crush_count, mobile_usage, early_riser,
        photo_url: photo_url || null,
        signature_url: signature_url || null
      }])
      .select('id, name, username, status, voter_id')
      .single();

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
    }

    return NextResponse.json({ user: newUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
