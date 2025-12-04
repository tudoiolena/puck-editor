import { useState } from 'react';
import { useLoaderData, Link, redirect } from 'react-router';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ArrowBack, Visibility, FileDownload, Search } from '@mui/icons-material';
import type { Route } from './+types/dashboard.forms.$id.submissions';
import { DashboardAppBar } from '../components/dashboard/DashboardAppBar';
import { getUserIdFromRequest } from '../lib/auth';
import { getForm, getFormSubmissions } from '../lib/forms.server';
import { prisma } from '../lib/db.server';
import { ROUTES } from '../constants/routes';

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `Submissions - ${loaderData.form.title}` },
    { name: 'description', content: 'View form submissions' },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  const formId = parseInt(params.id || '');

  if (isNaN(formId)) {
    return redirect(ROUTES.DASHBOARD);
  }

  const form = await getForm(formId, userId);

  if (!form) {
    return redirect(ROUTES.DASHBOARD);
  }

  // Get user for app bar
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      email_verified: true,
    },
  });

  // Get all submissions
  const submissions = await getFormSubmissions(formId, userId);

  return {
    user,
    form: {
      id: form.id,
      title: form.title,
      description: form.description,
      slug: form.slug,
    },
    submissions: submissions.map((sub) => ({
      id: sub.id,
      email: sub.email,
      submittedAt: sub.submittedAt.toISOString(),
      data: sub.submissionData,
    })),
  };
}

export default function Submissions({ loaderData }: Route.ComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Filter submissions
  const filteredSubmissions = loaderData.submissions.filter((submission) => {
    const matchesSearch =
      searchTerm === '' ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(submission.data).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      dateFilter === '' ||
      new Date(submission.submittedAt).toISOString().split('T')[0] === dateFilter;

    return matchesSearch && matchesDate;
  });

  const handleExport = () => {
    // Convert submissions to CSV
    if (filteredSubmissions.length === 0) {
      alert('No submissions to export');
      return;
    }

    // Get all unique keys from all submissions
    const allKeys = new Set<string>();
    filteredSubmissions.forEach((sub) => {
      Object.keys(sub.data).forEach((key) => allKeys.add(key));
    });

    // Create CSV header
    const headers = ['Submission ID', 'Email', 'Submitted At', ...Array.from(allKeys)];

    // Create CSV rows
    const rows = filteredSubmissions.map((sub) => {
      const row = [sub.id, sub.email, new Date(sub.submittedAt).toLocaleString()];

      // Add data columns
      allKeys.forEach((key) => {
        const value = sub.data[key];
        // Handle arrays (checkboxes)
        if (Array.isArray(value)) {
          row.push(value.join(', '));
        } else {
          row.push(value || '');
        }
      });

      return row;
    });

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${loaderData.form.slug}-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* App Bar */}
      {loaderData.user && <DashboardAppBar user={loaderData.user} />}

      {/* Main Content */}
      <Box className="max-w-7xl mx-auto px-6 py-8">
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
          <Box className="flex justify-between items-start">
            <Box>
              <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                Submissions
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-1">
                {loaderData.form.title}
              </Typography>
              <Chip
                label={`${filteredSubmissions.length} submission${filteredSubmissions.length !== 1 ? 's' : ''}`}
                color="primary"
                size="small"
              />
            </Box>
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={handleExport}
              disabled={filteredSubmissions.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper className="p-4 mb-6">
          <Box className="flex gap-4">
            <TextField
              placeholder="Search by email or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: <Search className="mr-2 text-gray-400" />,
                },
              }}
            />
            <TextField
              type="date"
              label="Filter by date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            {(searchTerm || dateFilter) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Paper>

        {/* Submissions Table */}
        {filteredSubmissions.length === 0 ? (
          <Paper className="p-12 text-center">
            <Typography variant="h6" className="text-gray-600 mb-2">
              No submissions yet
            </Typography>
            <Typography variant="body2" className="text-gray-500 mb-6">
              {searchTerm || dateFilter
                ? 'No submissions match your filters'
                : 'Submissions will appear here once users fill out your form'}
            </Typography>
            <Button
              component={Link}
              to={ROUTES.PUBLIC_FORM(loaderData.form.slug)}
              variant="outlined"
            >
              View Form
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Submitted</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Data Summary</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id} hover>
                    <TableCell>#{submission.id}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600">
                        {Object.keys(submission.data).length} fields
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          component={Link}
                          to={ROUTES.FORMS.SUBMISSION_DETAIL(loaderData.form.id, submission.id)}
                          size="small"
                          className="text-blue-600"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Footer Stats */}
        <Box className="mt-6 text-center">
          <Typography variant="caption" className="text-gray-500">
            Total: {loaderData.submissions.length} submission
            {loaderData.submissions.length !== 1 ? 's' : ''}
            {filteredSubmissions.length !== loaderData.submissions.length &&
              ` | Showing: ${filteredSubmissions.length}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
