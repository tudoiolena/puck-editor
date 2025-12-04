import { registerSchema } from '../lib/validation';
import { hashPassword, generateVerificationToken } from '../lib/auth';
import { sendVerificationEmail } from '../lib/email';
import { prisma } from '../lib/db.server';
import { redirect } from 'react-router';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  try {
    // Validate input data
    const validatedData = registerSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        error: 'An account with this email already exists.',
      };
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Generate verification token
    const verificationToken = generateVerificationToken(0, validatedData.email); // userId will be 0 initially
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password_hash: passwordHash,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        verification_token: verificationToken,
        verification_expires_at: verificationExpiresAt,
      },
    });

    // Update verification token with actual user ID
    const finalVerificationToken = generateVerificationToken(user.id, user.email);
    await prisma.user.update({
      where: { id: user.id },
      data: { verification_token: finalVerificationToken },
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.first_name, finalVerificationToken);

    // Redirect to success page
    return redirect('/register?success=true');
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return {
        error: 'Please check your input and try again.',
        validationErrors: error.message,
      };
    }

    return {
      error: 'Registration failed. Please try again.',
    };
  }
}
