import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, Form, useActionData } from 'react-router';
import { ROUTES } from '../constants/routes';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Email, ArrowBack, CheckCircle } from '@mui/icons-material';
import type { Route } from './+types/forgot-password';
import { validateEmail } from '../utils/auth';
import { action } from '../actions/forgot-password';

export { action };

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Forgot Password - My App' },
    { name: 'description', content: 'Reset your password' },
  ];
}

export default function ForgotPassword() {
  const actionData = useActionData<typeof action>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setEmailError('');
  };

  const validateForm = (): boolean => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Handle form submission with React Router Form
  const handleSubmit = (event: FormEvent) => {
    if (!validateForm()) {
      event.preventDefault();
      return;
    }
    setLoading(true);
  };

  // Show success state if action was successful
  if (actionData?.success || success) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
          <Box className="text-center">
            <CheckCircle className="text-green-500 mb-4" style={{ fontSize: 80 }} />
            <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
              Check Your Email
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-4">
              We've sent a password reset link to <strong>{email}</strong>
            </Typography>
            <Alert severity="success" className="mb-4">
              Please check your email and click the link to reset your password.
            </Alert>
            <Typography variant="body2" className="text-gray-500 mb-4">
              The link will expire in 1 hour.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to={ROUTES.LOGIN}
              startIcon={<ArrowBack />}
              className="bg-green-600 hover:bg-green-700"
            >
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
        <Box className="mb-4">
          <Button
            component={Link}
            to="/login"
            startIcon={<ArrowBack />}
            className="text-gray-600 hover:text-gray-800 mb-4"
          >
            Back to Login
          </Button>
        </Box>

        <Box className="text-center mb-6">
          <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
            Forgot Password?
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            No worries! Enter your email and we'll send you reset instructions.
          </Typography>
        </Box>

        {actionData && !actionData.success && (
          <Alert severity="error" className="mb-4">
            {actionData.message}
          </Alert>
        )}

        <Form method="post" onSubmit={handleSubmit}>
          <Box>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="text-gray-400" />
                    </InputAdornment>
                  ),
                },
              }}
              disabled={loading}
              autoFocus
              sx={{ mb: 4 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 py-3"
            >
              {loading ? (
                <>
                  <CircularProgress size={24} className="mr-2" color="inherit" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </Box>
        </Form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold no-underline"
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
