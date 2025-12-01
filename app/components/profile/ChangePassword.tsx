import { useState } from 'react';
import { Form, useActionData } from 'react-router';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';

interface ChangePasswordProps {}

export function ChangePassword({}: ChangePasswordProps) {
  const actionData = useActionData() as { success?: boolean; error?: string; message?: string } | undefined;
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Paper className="p-6">
      <Typography variant="h5" className="font-bold text-gray-800 mb-4">
        Change Password
      </Typography>

      {actionData?.success && (
        <Alert severity="success" className="mb-4">
          {actionData.message}
        </Alert>
      )}

      {actionData?.error && (
        <Alert severity="error" className="mb-4">
          {actionData.error}
        </Alert>
      )}

      <Form method="post">
        <input type="hidden" name="action" value="changePassword" />
        
        <Box>
          {/* Current Password */}
          <Box className="mb-4">
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              required
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
                        onClick={() => togglePasswordVisibility('current')}
                        edge="end"
                      >
                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* New Password */}
          <Box className="mb-4">
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              required
              helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
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
                        onClick={() => togglePasswordVisibility('new')}
                        edge="end"
                      >
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Confirm Password */}
          <Box className="mb-4">
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              required
              helperText="Must match the new password"
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
                        onClick={() => togglePasswordVisibility('confirm')}
                        edge="end"
                      >
                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Submit Button */}
          <Box className="pt-4">
            <Button
              type="submit"
              variant="contained"
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Change Password
            </Button>
          </Box>
        </Box>
      </Form>

      {/* Security Notice */}
      <Box className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Typography variant="body2" className="text-yellow-800">
          <strong>Security Notice:</strong> After changing your password, you'll need to log in again 
          on all devices. Make sure to use a strong, unique password.
        </Typography>
      </Box>
    </Paper>
  );
}
