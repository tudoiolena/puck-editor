import { TextField, InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';

interface EmailFieldProps {
  value: string;
  error: string;
  loading: boolean;
  onChange: (value: string) => void;
}

export function EmailField({ value, error, loading, onChange }: EmailFieldProps) {
  return (
    <TextField
      fullWidth
      label="Email Address"
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Email className="text-gray-400" />
            </InputAdornment>
          ),
        },
      }}
      disabled={loading}
    />
  );
}
