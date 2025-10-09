import { Box } from '@mui/material';
import { FormCard } from './FormCard';

interface Form {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormListProps {
  forms: Form[];
  onDelete: (id: number) => void;
  onCopy: (id: number) => void;
  onTogglePublish: (id: number, currentStatus: boolean) => void;
  isLoading: boolean;
}

export function FormList({ forms, onDelete, onCopy, onTogglePublish, isLoading }: FormListProps) {
  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          onDelete={onDelete}
          onCopy={onCopy}
          onTogglePublish={onTogglePublish}
          isLoading={isLoading}
        />
      ))}
    </Box>
  );
}

