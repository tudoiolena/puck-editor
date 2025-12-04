import type { Route } from './+types/register';
import { RegisterForm } from '../components/register/RegisterForm';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Sign Up - My App' }, { name: 'description', content: 'Create a new account' }];
}

export { action } from '../actions/register';

export default function Register() {
  return <RegisterForm />;
}
