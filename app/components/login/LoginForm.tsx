import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Form, useActionData } from 'react-router';
import { Box, Button, Paper, Alert, CircularProgress, Typography } from '@mui/material';
import { LoginHeader } from './LoginHeader';
import { LoginFields } from './LoginFields';
import { validateLoginForm, hasErrors, type LoginFormData, type LoginFormErrors } from './loginValidation';

export function LoginForm() {
  const navigate = useNavigate();
  const actionData = useActionData() as { error?: string } | undefined;
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({
    email: '',
    password: '',
  });

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: '' });
  };

  // Client-side validation before submission
  const handleSubmit = (event: FormEvent) => {
    const errors = validateLoginForm(formData);
    setFormErrors(errors);
    
    if (hasErrors(errors)) {
      event.preventDefault();
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
        <LoginHeader />

        {actionData?.error && (
          <Alert severity="error" className="mb-4">
            {actionData.error}
          </Alert>
        )}

        <Form method="post" onSubmit={handleSubmit}>
          <Box>
            {/* Hidden fields to send form data to the action */}
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="password" value={formData.password} />
            
            <LoginFields
              formData={formData}
              formErrors={formErrors}
              loading={false}
              onChange={handleChange}
            />

            <Box className="flex justify-end mt-4">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 no-underline">
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 py-3 mt-4"
            >
              Sign In
            </Button>
          </Box>
        </Form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold no-underline">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}