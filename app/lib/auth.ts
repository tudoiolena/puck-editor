import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db.server';
import crypto from 'crypto';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_VERIFICATION_SECRET =
  process.env.JWT_VERIFICATION_SECRET || 'fallback-verification-secret';
const JWT_PASSWORD_RESET_SECRET =
  process.env.JWT_PASSWORD_RESET_SECRET || 'fallback-password-reset-secret';
const SESSION_DURATION_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAuthToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Generate a secure random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Get client IP address from request
 */
function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return null;
}

/**
 * Get user agent from request
 */
function getUserAgent(request: Request): string | null {
  return request.headers.get('user-agent') || null;
}

/**
 * Create a new user session in the database
 */
export async function createSession(
  userId: number,
  request: Request
): Promise<{ sessionToken: string; expiresAt: Date }> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await prisma.userSession.create({
    data: {
      user_id: userId,
      session_token: sessionToken,
      ip_address: getClientIp(request),
      user_agent: getUserAgent(request),
      expires_at: expiresAt,
    },
  });

  return { sessionToken, expiresAt };
}

/**
 * Verify a session token and return user ID if valid
 * This checks the database for the session and validates expiration
 */
export async function verifySession(sessionToken: string): Promise<number | null> {
  try {
    if (!sessionToken) {
      return null;
    }

    // Check if session exists in database
    const session = await prisma.userSession.findUnique({
      where: { session_token: sessionToken },
      select: {
        user_id: true,
        expires_at: true,
      },
    });

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expires_at < new Date()) {
      // Clean up expired session
      await prisma.userSession.delete({
        where: { session_token: sessionToken },
      });
      return null;
    }

    return session.user_id;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

/**
 * Delete a session from the database
 */
export async function deleteSession(sessionToken: string): Promise<void> {
  try {
    await prisma.userSession.deleteMany({
      where: { session_token: sessionToken },
    });
  } catch (error) {
    console.error('Session deletion error:', error);
    // Don't throw - session might already be deleted
  }
}

/**
 * Delete all sessions for a user (useful for logout from all devices)
 */
export async function deleteAllUserSessions(userId: number): Promise<void> {
  try {
    await prisma.userSession.deleteMany({
      where: { user_id: userId },
    });
  } catch (error) {
    console.error('Delete all sessions error:', error);
    throw error;
  }
}

/**
 * Clean up expired sessions (can be called periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.userSession.deleteMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  } catch (error) {
    console.error('Cleanup expired sessions error:', error);
    return 0;
  }
}

export function generateVerificationToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_VERIFICATION_SECRET, { expiresIn: '24h' });
}

export function verifyVerificationToken(token: string): { userId: number; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_VERIFICATION_SECRET) as any;
    return { userId: decoded.userId, email: decoded.email };
  } catch (error) {
    return null;
  }
}

export function verifyAuthToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
}

export function generatePasswordResetToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_PASSWORD_RESET_SECRET, { expiresIn: '1h' });
}

export function verifyPasswordResetToken(token: string): { userId: number; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_PASSWORD_RESET_SECRET) as any;
    return { userId: decoded.userId, email: decoded.email };
  } catch (error) {
    return null;
  }
}

/**
 * Get session token from request cookies
 */
export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie');
  const sessionToken = cookieHeader
    ?.split(';')
    .find((cookie) => cookie.trim().startsWith('auth-token='))
    ?.split('=')[1];

  return sessionToken || null;
}

/**
 * Get user ID from request by verifying session
 * This is the main function to use for authentication checks
 */
export async function getUserIdFromRequest(request: Request): Promise<number | null> {
  const sessionToken = getSessionTokenFromRequest(request);
  if (!sessionToken) {
    return null;
  }

  return await verifySession(sessionToken);
}
