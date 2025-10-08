import type { Route } from './+types/login';
import { LoginForm } from '../components/login/LoginForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Login - My App' },
    { name: 'description', content: 'Login to your account' },
  ];
}

export { action } from '../actions/login';

export default function Login() {
  return <LoginForm />;
}

