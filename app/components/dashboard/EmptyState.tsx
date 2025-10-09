import { Link } from 'react-router';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { Add } from '@mui/icons-material';

export function EmptyState() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Typography variant="h6" className="text-gray-600 mb-4">
          No forms yet
        </Typography>
        <Typography variant="body2" className="text-gray-500 mb-6">
          Create your first form to get started
        </Typography>
        <Button
          component={Link}
          to="/dashboard/forms/new"
          variant="contained"
          startIcon={<Add />}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create Form
        </Button>
      </CardContent>
    </Card>
  );
}

