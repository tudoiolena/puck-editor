import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { Link } from 'react-router';
import type { Route } from './+types/dashboard.forms.new';
import { DashboardAppBar } from '../components/dashboard/DashboardAppBar';
import { getUserIdFromRequest } from '../lib/auth';
import { createForm, generateUniqueSlug } from '../lib/forms.server';
import { ROUTES } from '../constants/routes';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Create New Form - Form Builder' },
    { name: 'description', content: 'Create a new form' },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  return { userId };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  const formData = await request.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  // Validation
  if (!title || title.trim().length === 0) {
    return { error: 'Title is required' };
  }

  if (title.length > 100) {
    return { error: 'Title must be less than 100 characters' };
  }

  try {
    // Generate unique slug from title
    const slug = await generateUniqueSlug(title, userId);

    // Create the form
    const form = await createForm(userId, {
      title: title.trim(),
      description: description?.trim() || undefined,
      slug,
    });

    // Redirect to edit page
    return redirect(ROUTES.FORMS.EDIT(form.id));
  } catch (error) {
    console.error('Error creating form:', error);
    return { error: 'Failed to create form. Please try again.' };
  }
}

export default function NewForm({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const isSubmitting = navigation.state === 'submitting';

  // Generate slug preview from title
  const slugPreview = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* App Bar - Note: we don't have user data here, could enhance loader */}
      <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <Box className="max-w-7xl mx-auto px-6 py-4">
          <Typography variant="h6" className="text-white font-bold">
            Form Builder
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <Box className="mb-6">
          <Button
            component={Link}
            to={ROUTES.DASHBOARD}
            startIcon={<ArrowBack />}
            className="mb-4 text-gray-600"
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Create New Form
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Give your form a name and description to get started
          </Typography>
        </Box>

        {/* Form */}
        <Paper className="p-6">
          <Form method="post">
            <Box className="space-y-6">
              {/* Error Message */}
              {actionData?.error && (
                <Box className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <Typography className="text-red-800 text-sm">{actionData.error}</Typography>
                </Box>
              )}

              {/* Title Field */}
              <TextField
                fullWidth
                label="Form Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Contact Form, Survey, Application"
                helperText="This will be displayed at the top of your form"
                disabled={isSubmitting}
              />

              {/* Slug Preview */}
              {slugPreview && (
                <Box className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <Typography variant="caption" className="text-blue-800 font-semibold">
                    Form URL Preview:
                  </Typography>
                  <Typography variant="body2" className="text-blue-900 mt-1 font-mono">
                    {window.location.origin}/f/{slugPreview}
                  </Typography>
                </Box>
              )}

              {/* Description Field */}
              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                placeholder="Brief description of what this form is for"
                helperText="Help users understand the purpose of your form"
                disabled={isSubmitting}
              />

              {/* Actions */}
              <Box className="flex gap-3 justify-end pt-4">
                <Button
                  component={Link}
                  to={ROUTES.DASHBOARD}
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                  disabled={isSubmitting || !title.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Creating...' : 'Create Form'}
                </Button>
              </Box>
            </Box>
          </Form>
        </Paper>
      </Box>
    </Box>
  );
}
