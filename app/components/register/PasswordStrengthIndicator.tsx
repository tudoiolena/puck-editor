import { Box, Typography, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { validatePassword, getPasswordStrength } from '../../utils/auth';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const passwordValidation = validatePassword(password);
  const passwordStrength = getPasswordStrength(password);

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.strength) {
      case 'weak': return 'error';
      case 'medium': return 'warning';
      case 'strong': return 'success';
      default: return 'primary';
    }
  };

  const getPasswordStrengthValue = () => {
    return (passwordStrength.score / 6) * 100;
  };

  return (
    <Box className="mt-2">
      <Box className="flex justify-between items-center mb-1">
        <Typography variant="caption" className="text-gray-600">
          Password Strength:
        </Typography>
        <Typography 
          variant="caption" 
          className={`font-semibold ${
            passwordStrength.strength === 'weak' ? 'text-red-600' :
            passwordStrength.strength === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}
        >
          {passwordStrength.strength.toUpperCase()}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={getPasswordStrengthValue()}
        color={getPasswordStrengthColor()}
        className="h-2 rounded"
      />
      
      {!passwordValidation.isValid && (
        <List dense className="mt-2">
          {passwordValidation.errors.map((error, index) => (
            <ListItem key={index} className="py-0 px-0">
              <ListItemIcon className="min-w-0 mr-2">
                <Cancel className="text-red-500" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={error}
                primaryTypographyProps={{ variant: 'caption', className: 'text-red-600' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
