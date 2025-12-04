import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import type { Route } from './+types/f.$slug';
import { PuckRender } from '../components/puck/PuckRender';
import { getFormBySlug } from '../lib/forms.server';
import { submitForm } from '../lib/forms.server';
import { getUserIdFromRequest } from '../lib/auth';
import { prisma } from '../lib/db.server';
import { promises as fs } from 'fs';
import path from 'path';

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData.form) {
    return [
      { title: 'Form Not Found' },
      { name: 'description', content: 'The requested form could not be found' },
    ];
  }

  return [
    { title: `${loaderData.form.title} - Form` },
    { name: 'description', content: loaderData.form.description || 'Fill out this form' },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const slug = params.slug;

  if (!slug) {
    return { form: null, error: 'Invalid form URL', userEmail: null };
  }

  const form = await getFormBySlug(slug);

  if (!form) {
    return { form: null, error: 'Form not found or is not published', userEmail: null };
  }

  // Check if user is authenticated
  const userId = await getUserIdFromRequest(request);
  let userEmail: string | null = null;

  if (userId) {
    // Get authenticated user's email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    userEmail = user?.email || null;
  }

  return {
    form: {
      id: form.id,
      title: form.title,
      description: form.description,
      puckContent: form.puckContent,
      settings: form.settings,
    },
    userEmail,
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const slug = params.slug;

  if (!slug) {
    return { error: 'Invalid form URL' };
  }

  const form = await getFormBySlug(slug);

  if (!form) {
    return { error: 'Form not found' };
  }

  // Check if user is authenticated
  const userId = await getUserIdFromRequest(request);
  let authenticatedEmail: string | null = null;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    authenticatedEmail = user?.email || null;
  }

  const formData = await request.formData();

  // Extract all form fields
  const submissionData: Record<string, any> = {};
  const uploadedFiles: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    // Handle file uploads
    if (value instanceof File && value.size > 0) {
      // Save uploaded file
      try {
        const fileName = `form_${form.id}_${Date.now()}_${value.name}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'forms');

        // Create directory if it doesn't exist
        await fs.mkdir(uploadDir, { recursive: true });

        // Save file
        const filePath = path.join(uploadDir, fileName);
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await fs.writeFile(filePath, buffer);

        // Store file path in submission data
        uploadedFiles[key] = `/uploads/forms/${fileName}`;
        submissionData[key] = `/uploads/forms/${fileName}`;

        console.log(`File uploaded: ${key} -> ${uploadedFiles[key]}`);
      } catch (error) {
        console.error(`Error uploading file ${key}:`, error);
        return { error: `Failed to upload file: ${key}` };
      }
    } else if (typeof value === 'string') {
      // Handle multiple values for checkboxes
      if (submissionData[key]) {
        if (Array.isArray(submissionData[key])) {
          submissionData[key].push(value);
        } else {
          submissionData[key] = [submissionData[key], value];
        }
      } else {
        submissionData[key] = value;
      }
    }
  }

  // Use authenticated user's email if available, otherwise use email from form data
  const email = authenticatedEmail || (submissionData.email as string);

  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address' };
  }

  try {
    // Get IP address from request
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      undefined;

    // Submit the form
    await submitForm(form.id, email || 'anonymous@example.com', submissionData, ipAddress);

    // Redirect to thank you page
    return redirect(`/share/${slug}/thank-you`);
  } catch (error) {
    console.error('Form submission error:', error);
    return { error: 'Failed to submit form. Please try again.' };
  }
}

export default function PublicForm({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [userEmail, setUserEmail] = useState(loaderData.userEmail || '');
  const [emailError, setEmailError] = useState('');
  const [emailValidated, setEmailValidated] = useState(!!loaderData.userEmail); // True if authenticated user

  // Use authenticated user's email if available
  const authenticatedEmail = loaderData.userEmail || '';

  // Handle form not found
  if (!loaderData.form) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Paper className="max-w-md w-full p-8 text-center">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Form Not Found
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            {loaderData.error || 'The form you are looking for does not exist or is not published.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(userEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    // Mark email as validated - this will show the form
    setEmailValidated(true);
  };

  // Show email collection step if email is required and not yet collected
  // Skip if user is authenticated (they already have an email)
  const requireEmail = loaderData.form.settings?.requireEmail !== false; // Default to true
  const isAuthenticated = !!authenticatedEmail;

  // Only show email collection if email is required AND user is not authenticated AND email not validated
  if (requireEmail && !emailValidated && !isAuthenticated) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Paper className="max-w-md w-full p-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-2 text-center">
            {loaderData.form.title}
          </Typography>
          {loaderData.form.description && (
            <Typography variant="body2" className="text-gray-600 mb-6 text-center">
              {loaderData.form.description}
            </Typography>
          )}

          <Typography variant="h6" className="font-semibold text-gray-700 mb-2">
            Enter Your Email
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-4">
            Please provide your email address to continue filling out this form.
          </Typography>

          <form onSubmit={handleEmailSubmit}>
            <Box className="space-y-4">
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  setEmailError('');
                }}
                error={!!emailError}
                helperText={emailError}
                autoFocus
                required
                sx={{ mb: 3, mt: 3 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="bg-blue-600 hover:bg-blue-700"
                size="large"
              >
                Continue to Form
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    );
  }

  // Use authenticated user's email, or validated email from state
  const submissionEmail = authenticatedEmail || (emailValidated ? userEmail : '');

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <Box className="max-w-3xl mx-auto">
        {/* Header */}
        <Paper className="p-8 mb-6">
          <Typography variant="h4" className="font-bold text-gray-900 mb-2">
            {loaderData.form.title}
          </Typography>
          {loaderData.form.description && (
            <Typography variant="body1" className="text-gray-600">
              {loaderData.form.description}
            </Typography>
          )}
          {submissionEmail && (
            <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
              <Typography variant="body2" className="text-blue-800">
                <strong>Email:</strong> {submissionEmail}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Error Message */}
        {actionData?.error && (
          <Alert severity="error" className="mb-6">
            {actionData.error}
          </Alert>
        )}

        {/* Form */}
        <Paper className="p-8">
          <Form method="post" encType="multipart/form-data">
            {/* Hidden email field - always include if we have an email */}
            {submissionEmail && <input type="hidden" name="email" value={submissionEmail} />}

            {/* Render the form content from Puck */}
            <PuckRender data={loaderData.form.puckContent} />

            {/* Loading overlay */}
            {isSubmitting && (
              <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Paper className="p-6 flex flex-col items-center">
                  <CircularProgress className="mb-4" />
                  <Typography>Submitting your form...</Typography>
                </Paper>
              </Box>
            )}
          </Form>
        </Paper>

        {/* Footer */}
        <Box className="text-center mt-6">
          <Typography variant="caption" className="text-gray-500">
            Powered by Form Builder
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
