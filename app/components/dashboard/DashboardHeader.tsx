import { Link } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { ROUTES } from '../../constants/routes';

export function DashboardHeader() {
  return (
    <Box className="flex justify-between items-center mb-8">
      <Box>
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          My Forms
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Create and manage your forms
        </Typography>
      </Box>
      <Button
        component={Link}
        to={ROUTES.FORMS.NEW}
        variant="contained"
        startIcon={<Add />}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        Create New Form
      </Button>
    </Box>
  );
}
