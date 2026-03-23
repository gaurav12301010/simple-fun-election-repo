import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { verifyPassword, setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, username, password_hash, status')
      .eq('username', username)
      .single();
      
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // Set JWT cookie session
    await setSession({ id: user.id, username: user.username, status: user.status });

    return NextResponse.json({ 
      user: { id: user.id, name: user.name, username: user.username, status: user.status } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
