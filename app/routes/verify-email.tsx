import type { Route } from './+types/verify-email';
import { VerifyEmailHandler } from '../components/verify/VerifyEmailHandler';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Verify Email - My App' },
    { name: 'description', content: 'Verify your email address' },
  ];
}

export { action } from '../actions/verify-email';

export default function VerifyEmail() {
  return <VerifyEmailHandler />;
}
