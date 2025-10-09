import { useLoaderData, useFetcher } from 'react-router';
import { Box, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import type { Route } from './+types/dashboard';
import { DashboardAppBar } from '../components/dashboard/DashboardAppBar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { FormList } from '../components/dashboard/FormList';
import { EmptyState } from '../components/dashboard/EmptyState';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard - Form Builder' },
    { name: 'description', content: 'Manage your forms' },
  ];
}

export { loader } from '../loaders/dashboard';
export { action } from '../actions/dashboard';

export default function Dashboard() {
  const loaderData = useLoaderData() as { 
    user: { id: number; email: string; first_name: string; last_name: string; email_verified: boolean };
    forms: Array<{
      id: number;
      title: string;
      description: string | null;
      slug: string;
      isPublished: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
  
  const fetcher = useFetcher();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle action responses
  if (fetcher.data?.success) {
    if (!snackbar.open) {
      setSnackbar({
        open: true,
        message: fetcher.data.message,
        severity: 'success',
      });
    }
  } else if (fetcher.data?.error) {
    if (!snackbar.open) {
      setSnackbar({
        open: true,
        message: fetcher.data.error,
        severity: 'error',
      });
    }
  }

  const handleDelete = (formId: number) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      fetcher.submit(
        { action: 'delete', formId: formId.toString() },
        { method: 'POST' }
      );
    }
  };

  const handleCopy = (formId: number) => {
    fetcher.submit(
      { action: 'copy', formId: formId.toString() },
      { method: 'POST' }
    );
  };

  const handleTogglePublish = (formId: number, currentStatus: boolean) => {
    fetcher.submit(
      { 
        action: 'publish', 
        formId: formId.toString(),
        isPublished: (!currentStatus).toString()
      },
      { method: 'POST' }
    );
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardAppBar user={loaderData.user} />

      <Box className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader />

        {loaderData.forms.length === 0 ? (
          <EmptyState />
        ) : (
          <FormList
            forms={loaderData.forms}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onTogglePublish={handleTogglePublish}
            isLoading={fetcher.state !== 'idle'}
          />
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

