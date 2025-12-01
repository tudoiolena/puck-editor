/**
 * Application route constants
 * Use these constants instead of hardcoded route strings throughout the application
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Authenticated routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  STATISTICS: '/statistics',

  // Form management routes
  FORMS: {
    NEW: '/dashboard/forms/new',
    EDIT: (id: number | string) => `/dashboard/forms/${id}/edit`,
    SUBMISSIONS: (id: number | string) => `/dashboard/forms/${id}/submissions`,
    SUBMISSION_DETAIL: (formId: number | string, submissionId: number | string) =>
      `/dashboard/forms/${formId}/submissions/${submissionId}`,
  },

  // Public form routes
  PUBLIC_FORM: (slug: string) => `/f/${slug}`,
  PUBLIC_FORM_THANK_YOU: (slug: string) => `/f/${slug}/thank-you`,

  // Upload routes
  UPLOAD: (filename: string) => `/uploads/${filename}`,
} as const;

// Helper functions for route building
export const buildRoute = {
  formEdit: (id: number | string) => ROUTES.FORMS.EDIT(id),
  formSubmissions: (id: number | string) => ROUTES.FORMS.SUBMISSIONS(id),
  formSubmissionDetail: (formId: number | string, submissionId: number | string) =>
    ROUTES.FORMS.SUBMISSION_DETAIL(formId, submissionId),
  publicForm: (slug: string) => ROUTES.PUBLIC_FORM(slug),
  publicFormThankYou: (slug: string) => ROUTES.PUBLIC_FORM_THANK_YOU(slug),
  upload: (filename: string) => ROUTES.UPLOAD(filename),
};

