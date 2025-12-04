import { Box, Typography } from '@mui/material';

export function LoginHeader() {
  return (
    <Box className="text-center mb-6">
      <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
        Welcome Back
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        Sign in to continue to your account
      </Typography>
    </Box>
  );
}
