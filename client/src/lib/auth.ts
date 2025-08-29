import { SignJWT, jwtVerify } from 'jose';
import { User } from '@/types/auth';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-for-development-only'
);

export async function signToken(payload: User): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as User;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function validateCredentials(username: string, password: string): User | null {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUsername && password === adminPassword) {
    return {
      username: adminUsername,
      role: 'admin'
    };
  }

  return null;
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

export async function authenticateRequest(request: Request): Promise<User | null> {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return null;
  }

  return verifyToken(token);
}