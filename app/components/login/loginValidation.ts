import { validateEmail } from '../../utils/auth';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email: string;
  password: string;
}

export const validateLoginForm = (formData: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {
    email: '',
    password: '',
  };

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const hasErrors = (errors: LoginFormErrors): boolean => {
  return Object.values(errors).some((error) => error !== '');
};

