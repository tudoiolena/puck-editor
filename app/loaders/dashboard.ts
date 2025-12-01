import { verifyAuthToken } from '../lib/auth';
import { prisma } from '../lib/db.server';
import { getUserForms } from '../lib/forms.server';
import { redirect } from 'react-router';
import { ROUTES } from '../constants/routes';

export async function loader({ request }: { request: Request }) {
  try {
    // Get the auth token from cookies
    const cookieHeader = request.headers.get('Cookie');
    const authToken = cookieHeader
      ?.split(';')
      .find(cookie => cookie.trim().startsWith('auth-token='))
      ?.split('=')[1];

    if (!authToken) {
      return redirect(ROUTES.LOGIN);
    }

    // Verify the token
    const decoded = verifyAuthToken(authToken);
    if (!decoded) {
      return redirect(ROUTES.LOGIN);
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        profile_picture: true,
        email_verified: true,
      },
    });

    if (!user) {
      return redirect(ROUTES.LOGIN);
    }

    // Get user's forms
    const forms = await getUserForms(user.id);

    return { user, forms };
  } catch (error) {
    console.error('Dashboard loader error:', error);
    return redirect('/login');
  }
}
