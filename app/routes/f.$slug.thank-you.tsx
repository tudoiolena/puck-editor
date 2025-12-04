import { Box, Typography, Paper, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Link } from 'react-router';
import type { Route } from './+types/f.$slug.thank-you';
import { getFormBySlug } from '../lib/forms.server';

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: 'Thank You - Form Submitted' },
    { name: 'description', content: 'Your form has been successfully submitted' },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;

  if (!slug) {
    return { form: null };
  }

  const form = await getFormBySlug(slug);

  if (!form) {
    return { form: null };
  }

  return {
    form: {
      title: form.title,
      settings: form.settings,
    },
    slug,
  };
}

export default function ThankYou({ loaderData }: Route.ComponentProps) {
  const thankYouMessage =
    loaderData.form?.settings?.thankYouMessage ||
    'Thank you for your submission! We have received your response.';

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <Paper className="max-w-2xl w-full p-12 text-center">
        {/* Success Icon */}
        <Box className="flex justify-center mb-6">
          <CheckCircle className="text-green-600" style={{ fontSize: 80 }} />
        </Box>

        {/* Title */}
        <Typography variant="h4" className="font-bold text-gray-900 mb-4">
          Submission Received!
        </Typography>

        {/* Custom Message */}
        <Typography variant="body1" className="text-gray-600 mb-8 whitespace-pre-wrap">
          {thankYouMessage}
        </Typography>

        {/* Actions */}
        <Box className="flex gap-4 justify-center">
          {loaderData.slug && (
            <Button
              component={Link}
              to={`/share/${loaderData.slug}`}
              variant="outlined"
              className="text-blue-600 border-blue-600"
            >
              Submit Another Response
            </Button>
          )}
        </Box>

        {/* Footer */}
        <Box className="mt-12 pt-6 border-t border-gray-200">
          <Typography variant="caption" className="text-gray-500">
            Powered by Form Builder
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
