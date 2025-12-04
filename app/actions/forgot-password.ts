import { forgotPasswordSchema } from '../lib/validation';
import { generatePasswordResetToken } from '../lib/auth';
import { sendPasswordResetEmail } from '../lib/email';
import { prisma } from '../lib/db.server';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = {
    email: formData.get('email') as string,
  };

  console.log('Forgot password action called with email:', data.email);

  try {
    // Validate input data
    console.log('Validating input data...');
    const validatedData = forgotPasswordSchema.parse(data);
    console.log('Validation passed');

    // Find the user
    console.log('Looking for user with email:', validatedData.email);
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    console.log('User found:', user ? 'yes' : 'no');

    // Always return success to prevent email enumeration attacks
    // Even if user doesn't exist, we return success but don't send email
    if (!user) {
      console.log('User not found, but returning success for security');
      return {
        success: true,
        message: "If an account with that email exists, we've sent a password reset link.",
      };
    }

    // Generate password reset token
    console.log('Generating password reset token for user ID:', user.id);
    const resetToken = generatePasswordResetToken(user.id, user.email);
    const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    console.log('Password reset token generated successfully');

    // Save reset token to database
    console.log('Saving reset token to database...');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_reset_token: resetToken,
        password_reset_expires_at: resetExpiresAt,
      },
    });
    console.log('Reset token saved to database');

    // Send password reset email
    console.log('Sending password reset email...');
    await sendPasswordResetEmail(user.email, user.first_name, resetToken);
    console.log('Password reset email sent successfully');

    return {
      success: true,
      message: "If an account with that email exists, we've sent a password reset link.",
    };
  } catch (error) {
    console.error('Forgot password error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    return {
      success: false,
      message: 'Failed to process password reset request. Please try again.',
    };
  }
}
