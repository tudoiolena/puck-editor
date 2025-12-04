import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('login', 'routes/login.tsx'),
  route('register', 'routes/register.tsx'),
  route('verify-email', 'routes/verify-email.tsx'),
  route('forgot-password', 'routes/forgot-password.tsx'),
  route('reset-password', 'routes/reset-password.tsx'),
  route('dashboard', 'routes/dashboard.tsx'),
  route('profile', 'routes/profile.tsx'),
  route('statistics', 'routes/statistics.tsx'),
  route('uploads/:filename', 'routes/uploads.$filename.tsx'),
  route('dashboard/forms/new', 'routes/dashboard.forms.new.tsx'),
  route('dashboard/forms/:id/edit', 'routes/dashboard.forms.$id.edit.tsx'),
  route('dashboard/forms/:id/submissions', 'routes/dashboard.forms.$id.submissions.tsx'),
  route(
    'dashboard/forms/:id/submissions/:submissionId',
    'routes/dashboard.forms.$id.submissions.$submissionId.tsx'
  ),
  route('f/:slug', 'routes/f.$slug.tsx'),
  route('f/:slug/thank-you', 'routes/f.$slug.thank-you.tsx'),
] satisfies RouteConfig;
