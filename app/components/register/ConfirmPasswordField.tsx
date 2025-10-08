import { useState, type MouseEvent } from 'react';
import { 
  FormControl, 
  InputLabel, 
  OutlinedInput, 
  InputAdornment, 
  IconButton, 
  FormHelperText 
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';

interface ConfirmPasswordFieldProps {
  value: string;
  error: string;
  loading: boolean;
  onChange: (value: string) => void;
}

export function ConfirmPasswordField({ value, error, loading, onChange }: ConfirmPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl fullWidth variant="outlined" error={!!error}>
      <InputLabel htmlFor="register-confirm-password">Confirm Password</InputLabel>
      <OutlinedInput
        id="register-confirm-password"
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Confirm Password"
        startAdornment={
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? 'hide the password' : 'display the password'
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        disabled={loading}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
