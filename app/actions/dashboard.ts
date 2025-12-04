import { redirect } from 'react-router';
import { getUserIdFromRequest, getSessionTokenFromRequest, deleteSession } from '../lib/auth';
import { deleteForm, copyForm, toggleFormPublish } from '../lib/forms.server';
import { ROUTES } from '../constants/routes';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const action = formData.get('action') as string;

  // Handle logout
  if (action === 'logout') {
    // Get session token and delete it from database
    const sessionToken = getSessionTokenFromRequest(request);
    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    return redirect(ROUTES.LOGIN, {
      headers: {
        'Set-Cookie': 'auth-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      },
    });
  }

  // Get user ID for form operations
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  // Handle form operations
  const formId = parseInt(formData.get('formId') as string);

  if (isNaN(formId)) {
    return { error: 'Invalid form ID' };
  }

  try {
    switch (action) {
      case 'delete':
        await deleteForm(formId, userId);
        return { success: true, message: 'Form deleted successfully' };

      case 'copy': {
        const copiedForm = await copyForm(formId, userId);
        if (!copiedForm) {
          return { error: 'Form not found or access denied' };
        }
        return { success: true, message: 'Form copied successfully', formId: copiedForm.id };
      }

      case 'publish': {
        const isPublished = formData.get('isPublished') === 'true';
        await toggleFormPublish(formId, userId, isPublished);
        return {
          success: true,
          message: `Form ${isPublished ? 'published' : 'unpublished'} successfully`,
        };
      }

      default:
        return { error: 'Unknown action' };
    }
  } catch (error) {
    console.error('Dashboard action error:', error);
    return { error: 'An error occurred. Please try again.' };
  }
}
