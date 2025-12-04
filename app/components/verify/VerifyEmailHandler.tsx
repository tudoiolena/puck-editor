import { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography, Alert, CircularProgress, Button } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { useSearchParams, Link, useFetcher } from 'react-router';
import { ROUTES } from '../../constants/routes';

interface VerificationResult {
  success: boolean;
  message: string;
}

export function VerifyEmailHandler() {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const fetcher = useFetcher();
  const token = searchParams.get('token');
  const hasSubmittedRef = useRef(false);

  // Trigger verification on mount if token exists
  useEffect(() => {
    if (token && !hasSubmittedRef.current && fetcher.state === 'idle' && !fetcher.data) {
      hasSubmittedRef.current = true;
      const formData = new FormData();
      formData.append('token', token);

      fetcher.submit(formData, {
        method: 'POST',
        action: '/verify-email',
      });
    }
  }, [token]);

  // Handle fetcher state changes
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setResult(fetcher.data as VerificationResult);
    }
  }, [fetcher.state, fetcher.data]);

  // Show error if no token
  if (!token) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl text-center">
          <Error className="text-red-500 mb-4" style={{ fontSize: 60 }} />
          <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
            Invalid Link
          </Typography>
          <Alert severity="error" className="mb-4">
            No verification token provided.
          </Alert>
          <Button
            component={Link}
            to={ROUTES.REGISTER}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Registration
          </Button>
        </Paper>
      </Box>
    );
  }

  // Show loading while submitting or if no result yet
  if (fetcher.state === 'submitting' || fetcher.state === 'loading' || !result) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl text-center">
          <CircularProgress className="mb-4" />
          <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
            Verifying Email
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Please wait while we verify your email address...
          </Typography>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl text-center">
        {result?.success ? (
          <>
            <CheckCircle className="text-green-500 mb-4" style={{ fontSize: 80 }} />
            <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
              Email Verified!
            </Typography>
            <Alert severity="success" className="mb-4">
              {result.message}
            </Alert>
            <Button
              component={Link}
              to={ROUTES.LOGIN}
              variant="contained"
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Login
            </Button>
          </>
        ) : (
          <>
            <Error className="text-red-500 mb-4" style={{ fontSize: 80 }} />
            <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
              Verification Failed
            </Typography>
            <Alert severity="error" className="mb-4">
              {result?.message || 'An error occurred during verification.'}
            </Alert>
            <Button
              component={Link}
              to={ROUTES.REGISTER}
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
