import { Box, Typography } from '@mui/material';

export function RegisterHeader() {
  return (
    <Box className="text-center mb-6">
      <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
        Create Account
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        Sign up to get started
      </Typography>
    </Box>
  );
}
