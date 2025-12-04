import { Box } from '@mui/material';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import type { LoginFormData, LoginFormErrors } from './loginValidation';

interface LoginFieldsProps {
  formData: LoginFormData;
  formErrors: LoginFormErrors;
  loading: boolean;
  onChange: (field: keyof LoginFormData, value: string) => void;
}

export function LoginFields({ formData, formErrors, loading, onChange }: LoginFieldsProps) {
  return (
    <Box>
      <EmailField
        value={formData.email}
        error={formErrors.email}
        loading={loading}
        onChange={(value) => onChange('email', value)}
      />

      <Box className="mt-4">
        <PasswordField
          value={formData.password}
          error={formErrors.password}
          loading={loading}
          onChange={(value) => onChange('password', value)}
        />
      </Box>
    </Box>
  );
}
