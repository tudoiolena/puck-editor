import { Box, Typography, Paper, Alert } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface RegistrationSuccessProps {
  email: string;
}

export function RegistrationSuccess({ email }: RegistrationSuccessProps) {
  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
        <Box className="text-center">
          <CheckCircle className="text-green-500 mb-4" style={{ fontSize: 80 }} />
          <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
            Registration Successful!
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-4">
            We've sent a verification email to <strong>{email}</strong>
          </Typography>
          <Alert severity="success" className="mb-4">
            Please check your email and click the verification link to activate your account.
          </Alert>
          <Typography variant="body2" className="text-gray-500">
            Redirecting to login page...
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
