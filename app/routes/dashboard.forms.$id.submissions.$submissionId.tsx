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
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import type { Route } from './+types/dashboard.forms.$id.submissions.$submissionId';
import { DashboardAppBar } from '../components/dashboard/DashboardAppBar';
import { getUserIdFromRequest } from '../lib/auth';
import { getForm, getSubmission } from '../lib/forms.server';
import { prisma } from '../lib/db.server';
import { ROUTES } from '../constants/routes';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Submission Details' },
    { name: 'description', content: 'View submission details' },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const userId = getUserIdFromRequest(request);
  
  if (!userId) {
    return redirect(ROUTES.LOGIN);
  }

  const formId = parseInt(params.id || '');
  const submissionId = parseInt(params.submissionId || '');
  
  if (isNaN(formId) || isNaN(submissionId)) {
    return redirect(ROUTES.DASHBOARD);
  }

  const form = await getForm(formId, userId);
  
  if (!form) {
    return redirect(ROUTES.DASHBOARD);
  }

  const submission = await getSubmission(submissionId, formId, userId);
  
  if (!submission) {
    return redirect(ROUTES.FORMS.SUBMISSIONS(formId));
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

  return {
    user,
    form: {
      id: form.id,
      title: form.title,
    },
    submission: {
      id: submission.id,
      email: submission.email,
      submittedAt: submission.submittedAt.toISOString(),
      ipAddress: submission.ipAddress,
      data: submission.submissionData,
    },
  };
}

export default function SubmissionDetail({ loaderData }: Route.ComponentProps) {
  // Format the data for display
  const dataEntries = Object.entries(loaderData.submission.data).map(([key, value]) => ({
    key,
    value: Array.isArray(value) ? value.join(', ') : value,
  }));

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* App Bar */}
      {loaderData.user && <DashboardAppBar user={loaderData.user} />}

      {/* Main Content */}
      <Box className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <Box className="mb-6">
          <Button
            component={Link}
            to={ROUTES.FORMS.SUBMISSIONS(loaderData.form.id)}
            startIcon={<ArrowBack />}
            className="mb-4 text-gray-600"
          >
            Back to Submissions
          </Button>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Submission Details
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            {loaderData.form.title} - Submission #{loaderData.submission.id}
          </Typography>
        </Box>

        {/* Submission Info */}
        <Paper className="p-6 mb-6">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Submission Information
          </Typography>
          <Box className="grid grid-cols-2 gap-4">
            <Box>
              <Typography variant="caption" className="text-gray-500 uppercase">
                Submitted By
              </Typography>
              <Typography variant="body1" className="font-medium">
                {loaderData.submission.email}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" className="text-gray-500 uppercase">
                Submitted At
              </Typography>
              <Typography variant="body1" className="font-medium">
                {new Date(loaderData.submission.submittedAt).toLocaleString()}
              </Typography>
            </Box>
            {loaderData.submission.ipAddress && (
              <Box>
                <Typography variant="caption" className="text-gray-500 uppercase">
                  IP Address
                </Typography>
                <Typography variant="body1" className="font-medium font-mono text-sm">
                  {loaderData.submission.ipAddress}
                </Typography>
              </Box>
            )}
            <Box>
              <Typography variant="caption" className="text-gray-500 uppercase">
                Submission ID
              </Typography>
              <Typography variant="body1" className="font-medium">
                #{loaderData.submission.id}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Form Data */}
        <Paper className="p-6">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Form Data
          </Typography>
          
          {dataEntries.length === 0 ? (
            <Typography className="text-gray-500 text-center py-8">
              No form data available
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Field</strong></TableCell>
                    <TableCell><strong>Value</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataEntries.map((entry, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell className="w-1/3">
                        <Chip label={entry.key} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography className="whitespace-pre-wrap break-words">
                          {entry.value?.toString() || <em className="text-gray-400">empty</em>}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Actions */}
        <Box className="mt-6 flex justify-end gap-3">
          <Button
            component={Link}
            to={ROUTES.FORMS.SUBMISSIONS(loaderData.form.id)}
            variant="outlined"
          >
            View All Submissions
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

