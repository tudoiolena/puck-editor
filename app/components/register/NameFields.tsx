import { TextField, InputAdornment, Box } from '@mui/material';
import { Person } from '@mui/icons-material';

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  firstNameError: string;
  lastNameError: string;
  loading: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export function NameFields({ 
  firstName, 
  lastName, 
  firstNameError, 
  lastNameError, 
  loading, 
  onFirstNameChange, 
  onLastNameChange 
}: NameFieldsProps) {
  return (
    <Box className="flex gap-2">
      <TextField
        fullWidth
        label="First Name"
        value={firstName}
        onChange={(e) => onFirstNameChange(e.target.value)}
        error={!!firstNameError}
        helperText={firstNameError}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Person className="text-gray-400" />
              </InputAdornment>
            ),
          },
        }}
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Last Name"
        value={lastName}
        onChange={(e) => onLastNameChange(e.target.value)}
        error={!!lastNameError}
        helperText={lastNameError}
        disabled={loading}
      />
    </Box>
  );
}
