import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-fallback-key-for-dev');

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function signToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('electx_session')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function setSession(payload: any) {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set('electx_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('electx_session');
}
