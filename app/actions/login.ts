import { loginSchema } from '../lib/validation';
import { verifyPassword, createSession } from '../lib/auth';
import { prisma } from '../lib/db.server';
import { redirect } from 'react-router';
import { ROUTES } from '../constants/routes';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log('Login action called with email:', data.email);
  console.log('Password provided:', data.password ? 'yes' : 'no');

  try {
    // Validate input data
    console.log('Validating input data...');
    const validatedData = loginSchema.parse(data);
    console.log('Validation passed');

    // Find the user
    console.log('Looking for user with email:', validatedData.email);
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      console.log('User not found in database');
      return {
        error: 'Invalid email or password.',
      };
    }

    // Verify password
    console.log('Verifying password...');
    const passwordValid = await verifyPassword(validatedData.password, user.password_hash);
    console.log('Password valid:', passwordValid);

    if (!passwordValid) {
      console.log('Password verification failed');
      return {
        error: 'Invalid email or password.',
      };
    }

    // Create session in database
    console.log('Creating session for user ID:', user.id);
    const { sessionToken, expiresAt } = await createSession(user.id, request);
    console.log('Session created successfully');

    // Calculate max age in seconds
    const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

    // Redirect to dashboard with session token in cookie
    console.log('Redirecting to dashboard...');
    return redirect(ROUTES.DASHBOARD, {
      headers: {
        'Set-Cookie': `auth-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return {
        error: 'Please check your input and try again.',
      };
    }

    return {
      error: 'Login failed. Please try again.',
    };
  }
}
