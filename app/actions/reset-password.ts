import { resetPasswordSchema } from '../lib/validation';
import { verifyPasswordResetToken, hashPassword } from '../lib/auth';
import { prisma } from '../lib/db.server';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = {
    token: formData.get('token') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  console.log('Reset password action called with token:', data.token ? 'present' : 'missing');

  if (!data.token) {
    return {
      success: false,
      message: 'Invalid or missing reset token.',
    };
  }

  try {
    // Validate input data
    console.log('Validating input data...');
    const validatedData = resetPasswordSchema.parse(data);
    console.log('Validation passed');

    // Verify the reset token
    console.log('Verifying reset token...');
    const decoded = verifyPasswordResetToken(validatedData.token);
    console.log('Token decoded:', decoded);
    
    if (!decoded) {
      console.log('Token verification failed');
      return {
        success: false,
        message: 'Invalid or expired reset token.',
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

    // Check if token matches and is not expired
    console.log('Checking stored token and expiration...');
    console.log('Stored token:', user.password_reset_token ? 'present' : 'missing');
    console.log('Provided token:', validatedData.token ? 'present' : 'missing');
    console.log('Token matches:', user.password_reset_token === validatedData.token);
    console.log('Expires at:', user.password_reset_expires_at);
    console.log('Current time:', new Date());
    console.log('Token expired:', user.password_reset_expires_at && user.password_reset_expires_at < new Date());
    
    if (user.password_reset_token !== validatedData.token || !user.password_reset_expires_at || user.password_reset_expires_at < new Date()) {
      console.log('Invalid or expired token');
      return {
        success: false,
        message: 'Invalid or expired reset token.',
      };
    }

    // Hash the new password
    console.log('Hashing new password...');
    const passwordHash = await hashPassword(validatedData.password);
    console.log('Password hashed successfully');

    // Update user password and clear reset token
    console.log('Updating user password and clearing reset token...');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: passwordHash,
        password_reset_token: null,
        password_reset_expires_at: null,
      },
    });
    console.log('Password updated successfully');

    return {
      success: true,
      message: 'Password reset successfully.',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        message: 'Please check your input and try again.',
      };
    }

    return {
      success: false,
      message: 'Failed to reset password. Please try again.',
    };
  }
}
