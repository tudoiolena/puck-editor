import { useLoaderData, Link } from 'react-router';
import { Box, Button } from '@mui/material';
import { Edit } from '@mui/icons-material';
import type { Route } from './+types/dashboard';
import { PuckRender } from '../components/puck/PuckRender';
import { DashboardAppBar } from '../components/dashboard/DashboardAppBar';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard - My App' },
    { name: 'description', content: 'User dashboard' },
  ];
}

export { loader } from '../loaders/dashboard';
export { action } from '../actions/dashboard';

export default function Dashboard() {
  const loaderData = useLoaderData() as { 
    user: { id: number; email: string; first_name: string; last_name: string; email_verified: boolean };
    pageData: any;
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* App Bar */}
      <DashboardAppBar user={loaderData.user} />

      {/* Main Content */}
      <Box className="relative">
        {/* Edit Button - Floating */}
        <Box className="sticky top-4 z-10 flex justify-end px-6 py-4">
          <Button
            component={Link}
            to="/puck/dashboard"
            variant="contained"
            startIcon={<Edit />}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            Edit Page
          </Button>
        </Box>

        {/* Puck Rendered Content */}
        <Box className="max-w-7xl mx-auto px-6 pb-12">
          <PuckRender data={loaderData.pageData} />
        </Box>
      </Box>
    </Box>
  );
}

