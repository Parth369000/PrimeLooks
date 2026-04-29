import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies, headers } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'prime_looks_secret_development_key';
const key = new TextEncoder().encode(secretKey);
const masterDomain = (process.env.MASTER_DOMAIN || 'app.localhost').toLowerCase();

export interface SessionPayload extends JWTPayload {
  adminId: number;
  username: string;
  role: 'SUPER_ADMIN' | 'STORE_ADMIN';
  storeId: number | null;
  storeDomain: string | null;
}

export interface StoreAdminSession extends SessionPayload {
  role: 'STORE_ADMIN';
  storeId: number;
  storeDomain: string;
}

function isValidSessionPayload(payload: JWTPayload): payload is SessionPayload {
  return (
    typeof payload.adminId === 'number' &&
    typeof payload.username === 'string' &&
    (payload.role === 'SUPER_ADMIN' || payload.role === 'STORE_ADMIN') &&
    (typeof payload.storeId === 'number' || payload.storeId === null || typeof payload.storeId === 'undefined') &&
    (typeof payload.storeDomain === 'string' || payload.storeDomain === null || typeof payload.storeDomain === 'undefined')
  );
}

export function normalizeHostname(hostname: string | null | undefined): string | null {
  if (!hostname) return null;
  return hostname.replace(/:\d+$/, '').replace(/^www\./, '').toLowerCase();
}

export function isMasterHostname(hostname: string | null): boolean {
  return hostname === masterDomain;
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return isValidSessionPayload(payload)
      ? {
          ...payload,
          storeId: payload.storeId ?? null,
          storeDomain: payload.storeDomain ?? null,
        }
      : null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function getRequestHostname(): Promise<string | null> {
  const requestHeaders = await headers();
  return normalizeHostname(
    requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')
  );
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireSuperAdminSession(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden');
  }
  return session;
}

export async function requireStoreAdminSession(expectedDomain?: string): Promise<StoreAdminSession> {
  const session = await requireSession();
  const hostname = await getRequestHostname();

  if (session.role !== 'STORE_ADMIN' || !session.storeId || !session.storeDomain) {
    throw new Error('Forbidden');
  }

  if (hostname && isMasterHostname(hostname)) {
    throw new Error('Forbidden');
  }

  if (hostname && hostname !== session.storeDomain) {
    throw new Error('Forbidden');
  }

  if (expectedDomain && decodeURIComponent(expectedDomain).toLowerCase() !== session.storeDomain.toLowerCase()) {
    throw new Error('Forbidden');
  }

  return session as StoreAdminSession;
}

export async function setSession(
  adminId: number,
  username: string,
  role: 'SUPER_ADMIN' | 'STORE_ADMIN',
  storeId: number | null,
  storeDomain: string | null
) {
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  const sessionData: SessionPayload = {
    adminId,
    username,
    role,
    storeId,
    storeDomain,
    expires: expires.toISOString(),
  };
  const session = await encrypt(sessionData);

  const cookieStore = await cookies();
  cookieStore.set('admin_session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', '', { expires: new Date(0), path: '/' });
}
