import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const validPassword = process.env.ADMIN_PASSWORD || 'secret123';
    
    if (password === validPassword) {
      const cookieStore = await cookies();
      cookieStore.set('electx_admin', validPassword, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Check auth
  const cookieStore = await cookies();
  const validPassword = process.env.ADMIN_PASSWORD || 'secret123';
  const authenticated = cookieStore.get('electx_admin')?.value === validPassword;
  return NextResponse.json({ authenticated });
}
