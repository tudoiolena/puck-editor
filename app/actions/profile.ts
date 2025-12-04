import { updateProfileSchema, changePasswordSchema } from '../lib/validation';
import { getUserIdFromRequest, verifyPassword, hashPassword } from '../lib/auth';
import { prisma } from '../lib/db.server';
import { redirect } from 'react-router';
import { saveProfilePicture } from '../lib/fileUpload';
import { ROUTES } from '../constants/routes';

export async function action({ request }: { request: Request }) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  const formData = await request.formData();
  const actionType = formData.get('action') as string;

  console.log('Profile action called:', actionType);

  try {
    switch (actionType) {
      case 'updateProfile':
        return await handleUpdateProfile(userId, formData);
      case 'changePassword':
        return await handleChangePassword(userId, formData);
      case 'uploadProfilePicture':
        return await handleUploadProfilePicture(userId, formData);
      default:
        return { error: 'Unknown action' };
    }
  } catch (error) {
    console.error('Profile action error:', error);
    return { error: 'An error occurred. Please try again.' };
  }
}

async function handleUpdateProfile(userId: number, formData: FormData) {
  const data = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
  };

  console.log('Updating profile for user:', userId, data);

  // Validate input data
  const validatedData = updateProfileSchema.parse(data);

  // Update user profile
  await prisma.user.update({
    where: { id: userId },
    data: {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
    },
  });

  console.log('Profile updated successfully');
  return { success: true, message: 'Profile updated successfully' };
}

async function handleChangePassword(userId: number, formData: FormData) {
  const data = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  console.log('Changing password for user:', userId);

  // Validate input data
  const validatedData = changePasswordSchema.parse(data);

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: 'User not found' };
  }

  // Verify current password
  const currentPasswordValid = await verifyPassword(
    validatedData.currentPassword,
    user.password_hash
  );

  if (!currentPasswordValid) {
    return { error: 'Current password is incorrect' };
  }

  // Hash new password
  const newPasswordHash = await hashPassword(validatedData.newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: {
      password_hash: newPasswordHash,
    },
  });

  console.log('Password changed successfully');
  return { success: true, message: 'Password changed successfully' };
}

async function handleUploadProfilePicture(userId: number, formData: FormData) {
  const file = formData.get('profilePicture') as File;

  if (!file || file.size === 0) {
    return { error: 'No file uploaded' };
  }

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profile_picture: true },
  });

  if (!user) {
    return { error: 'User not found' };
  }

  try {
    // Process and convert image to base64 (validation happens inside saveProfilePicture)
    const base64Image = await saveProfilePicture(file);

    // Update database with base64 image data
    await prisma.user.update({
      where: { id: userId },
      data: {
        profile_picture: base64Image,
      },
    });

    // No file deletion needed - old image is automatically replaced in database
    console.log('Profile picture uploaded successfully (stored in database)');
    return redirect(`${ROUTES.PROFILE}?updated=true`);
  } catch (error: unknown) {
    console.error('Error uploading profile picture:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to upload profile picture. Please try again.';
    return {
      error: errorMessage,
    };
  }
}
