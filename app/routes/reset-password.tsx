import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useSearchParams, useNavigate, Form, useActionData } from 'react-router';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, CheckCircle, Cancel } from '@mui/icons-material';
import type { Route } from './+types/reset-password';
import { validatePassword, getPasswordStrength } from '../utils/auth';
import { action } from '../actions/reset-password';
import { ROUTES } from '../constants/routes';

export { action };

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Reset Password - My App' },
    { name: 'description', content: 'Create a new password' },
  ];
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const passwordValidation = validatePassword(formData.password);
  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
    setFormErrors({ ...formErrors, [field]: '' });
  };

  const validateForm = (): boolean => {
    const errors = {
      password: '',
      confirmPassword: '',
    };

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      errors.password = 'Password does not meet requirements';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return !errors.password && !errors.confirmPassword;
  };

  const handleSubmit = (event: FormEvent) => {
    if (!token) {
      event.preventDefault();
      return;
    }

    if (!validateForm()) {
      event.preventDefault();
      return;
    }

    setLoading(true);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.strength) {
      case 'weak': return 'error';
      case 'medium': return 'warning';
      case 'strong': return 'success';
      default: return 'primary';
    }
  };

  const getPasswordStrengthValue = () => {
    return (passwordStrength.score / 6) * 100;
  };

  if (!token) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
          <Box className="text-center">
            <Cancel className="text-red-500 mb-4" style={{ fontSize: 80 }} />
            <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
              Invalid Reset Link
            </Typography>
            <Alert severity="error" className="mb-4">
              This password reset link is invalid or has expired.
            </Alert>
            <Typography variant="body2" className="text-gray-600 mb-4">
              Please request a new password reset link.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to={ROUTES.FORGOT_PASSWORD}
              className="bg-blue-600 hover:bg-blue-700 mr-2"
            >
              Request New Link
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // Show success state if action was successful
  if (actionData?.success || success) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
          <Box className="text-center">
            <CheckCircle className="text-green-500 mb-4" style={{ fontSize: 80 }} />
            <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
              Password Reset Successful!
            </Typography>
            <Alert severity="success" className="mb-4">
              Your password has been successfully reset.
            </Alert>
            <Typography variant="body2" className="text-gray-600 mb-4">
              You can now log in with your new password.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to={ROUTES.LOGIN}
              className="bg-blue-600 hover:bg-blue-700 mt-4"
            >
              Go to Login Page
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
        <Box className="text-center mb-6">
          <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
            Reset Your Password
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Enter your new password below
          </Typography>
        </Box>

        {actionData && !actionData.success && (
          <Alert severity="error" className="mb-4">
            {actionData.message}
          </Alert>
        )}

        <Form method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="token" value={token || ''} />
          <Box>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={!!formErrors.password}
              helperText={formErrors.password}
              slotProps={{
                input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                },
              }}
              disabled={loading}
              autoFocus
              sx={{ mb: 3 }}
            />

            {formData.password && (
              <Box sx={{ mb: 4 }}>
                <Box className="flex justify-between items-center mb-1">
                  <Typography variant="caption" className="text-gray-600">
                    Password Strength:
                  </Typography>
                  <Typography 
                    variant="caption" 
                    className={`font-semibold ${
                      passwordStrength.strength === 'weak' ? 'text-red-600' :
                      passwordStrength.strength === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}
                  >
                    {passwordStrength.strength.toUpperCase()}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getPasswordStrengthValue()}
                  color={getPasswordStrengthColor()}
                  className="h-2 rounded"
                />
                
                {!passwordValidation.isValid && (
                  <List dense className="mt-2">
                    {passwordValidation.errors.map((error, index) => (
                      <ListItem key={index} className="py-0 px-0">
                        <ListItemIcon className="min-w-0 mr-2">
                          <Cancel className="text-red-500" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={error}
                          primaryTypographyProps={{ variant: 'caption', className: 'text-red-600' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              slotProps={{
                input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                },
              }}
              disabled={loading}
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
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </Box>
        </Form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold no-underline">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

