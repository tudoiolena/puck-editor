import type { Data } from '@measured/puck';
import { prisma } from './db.server';
import { sendFormSubmissionEmail } from './email';

export interface Form {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  slug: string;
  puckContent: Data;
  isPublished: boolean;
  settings: FormSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSettings {
  emailNotifications?: boolean;
  notificationEmail?: string;
  thankYouMessage?: string;
  requireEmail?: boolean;
  allowMultipleSubmissions?: boolean;
}

export interface FormSubmission {
  id: number;
  formId: number;
  email: string;
  submissionData: Record<string, any>;
  ipAddress: string | null;
  submittedAt: Date;
}

/**
 * Get a form by ID
 */
export async function getForm(id: number, userId: number): Promise<Form | null> {
  const form = await prisma.form.findFirst({
    where: {
      id,
      user_id: userId,
      deleted_at: null,
    },
  });

  if (!form) return null;

  return {
    id: form.id,
    userId: form.user_id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    puckContent: form.puck_content as Data,
    isPublished: form.is_published,
    settings: (form.settings as FormSettings) || {},
    createdAt: form.created_at,
    updatedAt: form.updated_at,
  };
}

/**
 * Get a form by slug (for public access)
 */
export async function getFormBySlug(slug: string): Promise<Form | null> {
  const form = await prisma.form.findFirst({
    where: {
      slug,
      is_published: true,
      deleted_at: null,
    },
  });

  if (!form) return null;

  return {
    id: form.id,
    userId: form.user_id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    puckContent: form.puck_content as Data,
    isPublished: form.is_published,
    settings: (form.settings as FormSettings) || {},
    createdAt: form.created_at,
    updatedAt: form.updated_at,
  };
}

/**
 * Get all forms for a user
 */
export async function getUserForms(userId: number): Promise<Form[]> {
  const forms = await prisma.form.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    orderBy: {
      updated_at: 'desc',
    },
    include: {
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });

  return forms.map((form) => ({
    id: form.id,
    userId: form.user_id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    puckContent: form.puck_content as Data,
    isPublished: form.is_published,
    settings: (form.settings as FormSettings) || {},
    createdAt: form.created_at,
    updatedAt: form.updated_at,
  }));
}

/**
 * Create a new form
 */
export async function createForm(
  userId: number,
  data: {
    title: string;
    description?: string;
    slug: string;
    puckContent?: Data;
    settings?: FormSettings;
  }
): Promise<Form> {
  const defaultPuckContent: Data = {
    content: [],
    root: {
      props: {
        title: data.title,
      },
    },
  };

  const form = await prisma.form.create({
    data: {
      user_id: userId,
      title: data.title,
      description: data.description || null,
      slug: data.slug,
      puck_content: (data.puckContent || defaultPuckContent) as any,
      settings: (data.settings || {}) as any,
    },
  });

  return {
    id: form.id,
    userId: form.user_id,
    title: form.title,
    description: form.description,
    slug: form.slug,
    puckContent: form.puck_content as Data,
    isPublished: form.is_published,
    settings: (form.settings as FormSettings) || {},
    createdAt: form.created_at,
    updatedAt: form.updated_at,
  };
}

/**
 * Update a form
 */
export async function updateForm(
  id: number,
  userId: number,
  data: {
    title?: string;
    description?: string;
    slug?: string;
    puckContent?: Data;
    isPublished?: boolean;
    settings?: FormSettings;
  }
): Promise<Form | null> {
  const form = await prisma.form.updateMany({
    where: {
      id,
      user_id: userId,
      deleted_at: null,
    },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.slug && { slug: data.slug }),
      ...(data.puckContent && { puck_content: data.puckContent as any }),
      ...(data.isPublished !== undefined && { is_published: data.isPublished }),
      ...(data.settings && { settings: data.settings as any }),
      updated_at: new Date(),
    },
  });

  if (form.count === 0) return null;

  return getForm(id, userId);
}

/**
 * Save form content (used by Puck editor)
 */
export async function saveFormContent(
  id: number,
  userId: number,
  puckContent: Data
): Promise<void> {
  await prisma.form.updateMany({
    where: {
      id,
      user_id: userId,
      deleted_at: null,
    },
    data: {
      puck_content: puckContent as any,
      updated_at: new Date(),
    },
  });
}

/**
 * Publish/unpublish a form
 */
export async function toggleFormPublish(
  id: number,
  userId: number,
  isPublished: boolean
): Promise<void> {
  await prisma.form.updateMany({
    where: {
      id,
      user_id: userId,
      deleted_at: null,
    },
    data: {
      is_published: isPublished,
      updated_at: new Date(),
    },
  });
}

/**
 * Soft delete a form
 */
export async function deleteForm(id: number, userId: number): Promise<void> {
  await prisma.form.updateMany({
    where: {
      id,
      user_id: userId,
      deleted_at: null,
    },
    data: {
      deleted_at: new Date(),
    },
  });
}

/**
 * Copy a form
 */
export async function copyForm(
  id: number,
  userId: number,
  newTitle?: string
): Promise<Form | null> {
  const originalForm = await getForm(id, userId);
  if (!originalForm) return null;

  const title = newTitle || `${originalForm.title} (Copy)`;
  const slug = `${originalForm.slug}-copy-${Date.now()}`;

  return createForm(userId, {
    title,
    description: originalForm.description || undefined,
    slug,
    puckContent: originalForm.puckContent,
    settings: originalForm.settings,
  });
}

/**
 * Submit a form
 */
export async function submitForm(
  formId: number,
  email: string,
  submissionData: Record<string, any>,
  ipAddress?: string
): Promise<FormSubmission> {
  const submission = await prisma.formSubmission.create({
    data: {
      form_id: formId,
      email,
      submission_data: submissionData as any,
      ip_address: ipAddress || null,
    },
  });

  // Send email notification if enabled
  const form = await getForm(formId, 0); // We need the form settings, but we don't have userId here.
  // Actually, we should fetch the form with the user to get the email
  const formWithUser = await prisma.form.findUnique({
    where: { id: formId },
    include: { user: true },
  });

  if (formWithUser) {
    const settings = formWithUser.settings as FormSettings;

    if (settings?.emailNotifications) {
      const recipientEmail = settings.notificationEmail || formWithUser.user.email;
      const dashboardUrl = `${process.env.APP_URL}/dashboard/forms/${formId}/submissions/${submission.id}`;

      // Send email asynchronously (don't await to not block response)
      sendFormSubmissionEmail(
        recipientEmail,
        formWithUser.title,
        email,
        submissionData,
        dashboardUrl
      ).catch((err) => console.error('Failed to send notification email:', err));
    }
  }

  return {
    id: submission.id,
    formId: submission.form_id,
    email: submission.email,
    submissionData: submission.submission_data as Record<string, any>,
    ipAddress: submission.ip_address,
    submittedAt: submission.submitted_at,
  };
}

/**
 * Get all submissions for a form
 */
export async function getFormSubmissions(
  formId: number,
  userId: number,
  filters?: {
    email?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<FormSubmission[]> {
  // Verify the form belongs to the user
  const form = await getForm(formId, userId);
  if (!form) return [];

  const submissions = await prisma.formSubmission.findMany({
    where: {
      form_id: formId,
      ...(filters?.email && { email: { contains: filters.email, mode: 'insensitive' as const } }),
      ...(filters?.startDate && { submitted_at: { gte: filters.startDate } }),
      ...(filters?.endDate && { submitted_at: { lte: filters.endDate } }),
    },
    orderBy: {
      submitted_at: 'desc',
    },
  });

  return submissions.map((sub) => ({
    id: sub.id,
    formId: sub.form_id,
    email: sub.email,
    submissionData: sub.submission_data as Record<string, any>,
    ipAddress: sub.ip_address,
    submittedAt: sub.submitted_at,
  }));
}

/**
 * Get a single submission
 */
export async function getSubmission(
  id: number,
  formId: number,
  userId: number
): Promise<FormSubmission | null> {
  // Verify the form belongs to the user
  const form = await getForm(formId, userId);
  if (!form) return null;

  const submission = await prisma.formSubmission.findFirst({
    where: {
      id,
      form_id: formId,
    },
  });

  if (!submission) return null;

  return {
    id: submission.id,
    formId: submission.form_id,
    email: submission.email,
    submissionData: submission.submission_data as Record<string, any>,
    ipAddress: submission.ip_address,
    submittedAt: submission.submitted_at,
  };
}

/**
 * Get submissions count for a form
 */
export async function getFormSubmissionsCount(formId: number, userId: number): Promise<number> {
  // Verify the form belongs to the user
  const form = await getForm(formId, userId);
  if (!form) return 0;

  return prisma.formSubmission.count({
    where: {
      form_id: formId,
    },
  });
}

/**
 * Generate a unique slug from title
 */
export async function generateUniqueSlug(title: string, userId: number): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.form.findFirst({
      where: {
        slug,
        user_id: userId,
        deleted_at: null,
      },
    });

    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Get user statistics
 */
export async function getUserStatistics(userId: number) {
  // Get all forms for user
  const forms = await prisma.form.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    include: {
      submissions: true,
    },
  });

  // Calculate basic stats
  const totalForms = forms.length;
  const publishedForms = forms.filter((form) => form.is_published).length;
  const draftForms = totalForms - publishedForms;
  const totalSubmissions = forms.reduce((sum, form) => sum + form.submissions.length, 0);

  // Get submissions by date for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentSubmissions = await prisma.formSubmission.findMany({
    where: {
      form: {
        user_id: userId,
        deleted_at: null,
      },
      submitted_at: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      submitted_at: 'asc',
    },
  });

  // Group submissions by date
  const submissionsByDate = recentSubmissions.reduce(
    (acc, submission) => {
      const date = submission.submitted_at.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Get form performance data
  const formPerformance = forms
    .map((form) => ({
      id: form.id,
      title: form.title,
      slug: form.slug,
      isPublished: form.is_published,
      submissionCount: form.submissions.length,
      lastSubmission:
        form.submissions.length > 0
          ? new Date(Math.max(...form.submissions.map((s) => s.submitted_at.getTime())))
          : null,
    }))
    .sort((a, b) => b.submissionCount - a.submissionCount);

  // Calculate conversion rates (simplified - assumes published forms get traffic)
  const conversionData = formPerformance.map((form) => ({
    ...form,
    conversionRate:
      form.isPublished && totalSubmissions > 0
        ? ((form.submissionCount / totalSubmissions) * 100).toFixed(1)
        : '0',
  }));

  // Get daily submission counts for chart
  const dailySubmissions = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailySubmissions.push({
      date: dateStr,
      count: submissionsByDate[dateStr] || 0,
    });
  }

  return {
    totalForms,
    publishedForms,
    draftForms,
    totalSubmissions,
    formPerformance,
    conversionData,
    dailySubmissions,
    recentActivity: {
      last7Days: recentSubmissions.filter((s) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return s.submitted_at >= weekAgo;
      }).length,
      last30Days: recentSubmissions.length,
    },
  };
}
