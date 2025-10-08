import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Form, useActionData, useSearchParams } from 'react-router';
import { Box, Button, Paper, Alert, CircularProgress, Typography } from '@mui/material';
import { RegisterHeader } from './RegisterHeader';
import { NameFields } from './NameFields';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { ConfirmPasswordField } from './ConfirmPasswordField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { RegistrationSuccess } from './RegistrationSuccess';
import { validateRegisterForm, hasErrors, type RegisterFormData, type RegisterFormErrors } from './registerValidation';

export function RegisterForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actionData = useActionData() as { error?: string } | undefined;
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Check if registration was successful
  const isSuccess = searchParams.get('success') === 'true';

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: '' });
  };

  // Client-side validation before submission
  const handleSubmit = (event: FormEvent) => {
    const errors = validateRegisterForm(formData);
    setFormErrors(errors);
    
    if (hasErrors(errors)) {
      event.preventDefault();
    }
  };

  if (isSuccess) {
    return <RegistrationSuccess email={formData.email} />;
  }

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
        <RegisterHeader />

        {actionData?.error && (
          <Alert severity="error" className="mb-4">
            {actionData.error}
          </Alert>
        )}

        <Form method="post" onSubmit={handleSubmit}>
          <Box>
            {/* Hidden fields to send form data to the action */}
            <input type="hidden" name="firstName" value={formData.firstName} />
            <input type="hidden" name="lastName" value={formData.lastName} />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="password" value={formData.password} />
            <input type="hidden" name="confirmPassword" value={formData.confirmPassword} />
            <NameFields
              firstName={formData.firstName}
              lastName={formData.lastName}
              firstNameError={formErrors.firstName}
              lastNameError={formErrors.lastName}
              loading={false}
              onFirstNameChange={(value) => handleChange('firstName', value)}
              onLastNameChange={(value) => handleChange('lastName', value)}
            />

            <Box className="mt-4">
              <EmailField
                value={formData.email}
                error={formErrors.email}
                loading={false}
                onChange={(value) => handleChange('email', value)}
              />
            </Box>

            <Box className="mt-4">
              <PasswordField
                value={formData.password}
                error={formErrors.password}
                loading={false}
                onChange={(value) => handleChange('password', value)}
              />
            </Box>

            {formData.password && (
              <PasswordStrengthIndicator password={formData.password} />
            )}

            <Box className="mt-4">
              <ConfirmPasswordField
                value={formData.confirmPassword}
                error={formErrors.confirmPassword}
                loading={false}
                onChange={(value) => handleChange('confirmPassword', value)}
              />
            </Box>

            <Box className="mt-6">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="bg-purple-600 hover:bg-purple-700 py-3"
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-800 font-semibold no-underline">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
