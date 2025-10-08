import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_VERIFICATION_SECRET = process.env.JWT_VERIFICATION_SECRET || 'fallback-verification-secret';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAuthToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
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
