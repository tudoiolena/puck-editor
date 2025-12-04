import { redirect } from 'react-router';
import { getUserIdFromRequest } from '../lib/auth';
import { getUserStatistics } from '../lib/forms.server';
import { prisma } from '../lib/db.server';
import { ROUTES } from '../constants/routes';

export async function loader({ request }: { request: Request }) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  // Get user info for app bar
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

  // Get statistics
  const statistics = await getUserStatistics(userId);

  return {
    user,
    statistics,
  };
}
