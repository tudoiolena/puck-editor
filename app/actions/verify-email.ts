import { verifyVerificationToken } from '../lib/auth';
import { prisma } from '../lib/db.server';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const token = formData.get('token') as string;

  console.log('Verification action called with token:', token ? 'present' : 'missing');

  if (!token) {
    return {
      success: false,
      message: 'Verification token is missing.',
    };
  }

  try {
    // Verify the JWT token
    console.log('Verifying token...');
    const decoded = verifyVerificationToken(token);
    console.log('Token decoded:', decoded);
    
    if (!decoded) {
      console.log('Token verification failed');
      return {
        success: false,
        message: 'The verification link may have expired or is invalid.',
      };
    }

    // Find the user
    console.log('Looking for user with ID:', decoded.userId);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      console.log('User not found in database');
      return {
        success: false,
        message: 'User not found.',
      };
    }

    // Check if already verified
    console.log('Email verified status:', user.email_verified);
    if (user.email_verified) {
      console.log('User already verified');
      return {
        success: true,
        message: 'Your email has already been verified.',
      };
    }

    // Check if token matches and is not expired
    console.log('Stored token:', user.verification_token ? 'present' : 'missing');
    console.log('Provided token:', token ? 'present' : 'missing');
    console.log('Token matches:', user.verification_token === token);
    console.log('Expires at:', user.verification_expires_at);
    console.log('Current time:', new Date());
    console.log('Token expired:', user.verification_expires_at && user.verification_expires_at < new Date());
    
    if (user.verification_token !== token || !user.verification_expires_at || user.verification_expires_at < new Date()) {
      console.log('Token validation failed');
      return {
        success: false,
        message: 'The verification link may have expired or is invalid.',
      };
    }

    // Update user as verified and clear verification token
    console.log('Updating user verification status...');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email_verified: true,
        verification_token: null,
        verification_expires_at: null,
      },
    });
    console.log('User verification status updated successfully');

    return {
      success: true,
      message: 'Your email has been successfully verified!',
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      message: 'An error occurred during verification. Please try again.',
    };
  }
}
