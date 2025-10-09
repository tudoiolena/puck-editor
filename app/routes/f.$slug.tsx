import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import type { Route } from './+types/f.$slug';
import { PuckRender } from '../components/puck/PuckRender';
import { getFormBySlug } from '../lib/forms.server';
import { submitForm } from '../lib/forms.server';

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

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;
  
  if (!slug) {
    return { form: null, error: 'Invalid form URL' };
  }

  const form = await getFormBySlug(slug);
  
  if (!form) {
    return { form: null, error: 'Form not found or is not published' };
  }

  return { form: {
    id: form.id,
    title: form.title,
    description: form.description,
    puckContent: form.puckContent,
    settings: form.settings,
  }};
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

  const formData = await request.formData();
  
  // Extract all form fields
  const submissionData: Record<string, any> = {};
  
  for (const [key, value] of formData.entries()) {
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

  // Validate required email if settings require it
  const email = submissionData.email as string;
  
  if (form.settings?.requireEmail && (!email || !email.includes('@'))) {
    return { error: 'Please provide a valid email address' };
  }

  try {
    // Get IP address from request
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     request.headers.get('x-real-ip') || 
                     undefined;

    // Submit the form
    await submitForm(form.id, email || 'anonymous@example.com', submissionData, ipAddress);
    
    // Redirect to thank you page
    return redirect(`/f/${slug}/thank-you`);
  } catch (error) {
    console.error('Form submission error:', error);
    return { error: 'Failed to submit form. Please try again.' };
  }
}

export default function PublicForm({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

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
        </Paper>

        {/* Error Message */}
        {actionData?.error && (
          <Alert severity="error" className="mb-6">
            {actionData.error}
          </Alert>
        )}

        {/* Form */}
        <Paper className="p-8">
          <Form method="post">
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

