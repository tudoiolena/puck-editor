import { getUserIdFromRequest } from '../lib/auth';
import { prisma } from '../lib/db.server';
import { getUserForms } from '../lib/forms.server';
import { redirect } from 'react-router';
import { ROUTES } from '../constants/routes';

export async function loader({ request }: { request: Request }) {
  try {
    // Verify session and get user ID
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return redirect(ROUTES.LOGIN);
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
