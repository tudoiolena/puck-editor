import { Link, useFetcher } from 'react-router';
import { Box, Button, Typography, Card, CardContent, CardActions, Chip } from '@mui/material';
import { Edit, Delete, ContentCopy, Visibility, VisibilityOff, List, OpenInNew } from '@mui/icons-material';

interface FormCardProps {
  form: {
    id: number;
    title: string;
    description: string | null;
    slug: string;
    isPublished: boolean;
    updatedAt: Date;
  };
  onDelete: (id: number) => void;
  onCopy: (id: number) => void;
  onTogglePublish: (id: number, currentStatus: boolean) => void;
  isLoading: boolean;
}

export function FormCard({ form, onDelete, onCopy, onTogglePublish, isLoading }: FormCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-shadow">
      <CardContent className="flex-grow">
        <Box className="flex justify-between items-start mb-3">
          <Typography variant="h6" className="font-semibold text-gray-800">
            {form.title}
          </Typography>
          <Chip
            icon={form.isPublished ? <Visibility /> : <VisibilityOff />}
            label={form.isPublished ? 'Published' : 'Draft'}
            size="small"
            color={form.isPublished ? 'success' : 'default'}
          />
        </Box>
        {form.description && (
          <Typography variant="body2" className="text-gray-600 mb-3">
            {form.description}
          </Typography>
        )}
        <Box className="mb-3 flex gap-2">
          <Button
            component={Link}
            to={`/dashboard/forms/${form.id}/submissions`}
            size="small"
            startIcon={<List />}
            variant="outlined"
            className="text-sm"
          >
            Submissions
          </Button>
          {form.isPublished && (
            <Button
              component="a"
              href={`/f/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              startIcon={<OpenInNew />}
              variant="outlined"
              className="text-sm text-green-600 border-green-600"
            >
              View Form
            </Button>
          )}
        </Box>
        <Typography variant="caption" className="text-gray-500">
          Updated: {new Date(form.updatedAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          })}
        </Typography>
      </CardContent>
      <CardActions className="p-4 pt-0 flex justify-between">
        <Box>
          <Button
            component={Link}
            to={`/dashboard/forms/${form.id}/edit`}
            size="small"
            startIcon={<Edit />}
            className="text-blue-600"
          >
            Edit
          </Button>
          <Button
            size="small"
            startIcon={<ContentCopy />}
            className="text-gray-600"
            onClick={() => onCopy(form.id)}
            disabled={isLoading}
          >
            Copy
          </Button>
        </Box>
        <Box>
          <Button
            size="small"
            onClick={() => onTogglePublish(form.id, form.isPublished)}
            className={form.isPublished ? 'text-orange-600' : 'text-green-600'}
            disabled={isLoading}
          >
            {form.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
          <Button
            size="small"
            startIcon={<Delete />}
            className="text-red-600"
            onClick={() => onDelete(form.id)}
            disabled={isLoading}
          >
            Delete
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

