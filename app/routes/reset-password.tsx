import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
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
import { authAPI, validatePassword, getPasswordStrength } from '../utils/auth';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Reset Password - My App' },
    { name: 'description', content: 'Create a new password' },
  ];
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await authAPI.resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { state: { message: 'Password reset successful! You can now log in with your new password.' } });
        }, 3000);
      } else {
        setError(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
              to="/forgot-password"
              className="bg-blue-600 hover:bg-blue-700 mr-2"
            >
              Request New Link
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (success) {
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
            <Typography variant="body2" className="text-gray-500 mt-4">
              Redirecting to login page...
            </Typography>
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

        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
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
              }}
              disabled={loading}
              autoFocus
            />

            {formData.password && (
              <Box className="mt-2">
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
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              InputProps={{
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
              }}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 py-3 mt-4"
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
        </form>

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

