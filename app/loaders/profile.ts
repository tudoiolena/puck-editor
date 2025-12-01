import { redirect } from 'react-router';
import { getUserIdFromRequest } from '../lib/auth';
import { prisma } from '../lib/db.server';
import { ROUTES } from '../constants/routes';

export async function loader({ request }: { request: Request }) {
  const userId = getUserIdFromRequest(request);
  
  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  // Get user data with profile information
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      profile_picture: true,
      email_verified: true,
      created_at: true,
    },
  });

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_picture: user.profile_picture,
      email_verified: user.email_verified,
      created_at: user.created_at,
    },
  };
}
