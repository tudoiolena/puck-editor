import { useState } from 'react';
import { Form, useActionData } from 'react-router';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  IconButton,
} from '@mui/material';
import { Edit, PhotoCamera, Save, Cancel } from '@mui/icons-material';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string | null;
}

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const actionData = useActionData() as { success?: boolean; error?: string; message?: string; filePath?: string } | undefined;
  
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  // Simple profile picture handling - just use user.profile_picture directly
  const profilePictureUrl = user.profile_picture;
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Submit the form with the file immediately
    const form = event.target.closest('form');
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <Paper className="p-6">
      <Box className="flex items-start gap-6">
        {/* Profile Picture */}
        <Box className="flex flex-col items-center">
          <Box className="relative">
            <Avatar
              src={profilePictureUrl || undefined}
              className="w-24 h-24 text-2xl"
              sx={{ bgcolor: 'primary.main' }}
            >
              {!profilePictureUrl && initials}
            </Avatar>
            
            <IconButton
              component="label"
              className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white"
              size="small"
            >
              <PhotoCamera fontSize="small" />
              <Form method="post" encType="multipart/form-data">
                <input type="hidden" name="action" value="uploadProfilePicture" />
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }}
                />
              </Form>
            </IconButton>
          </Box>
        </Box>

        {/* Profile Information */}
        <Box className="flex-1">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Profile Information
          </Typography>

          {actionData?.success && (
            <Alert severity="success" className="mb-4">
              {actionData.message}
            </Alert>
          )}

          {actionData?.error && (
            <Alert severity="error" className="mb-4">
              {actionData.error}
            </Alert>
          )}

          <Form method="post">
            <input type="hidden" name="action" value="updateProfile" />
            
            <Box>
              {/* Email (Read-only) */}
              <Box className="mb-4">
                <TextField
                  fullWidth
                  label="Email Address"
                  value={user.email}
                  disabled
                  helperText="Email address cannot be changed"
                  variant="filled"
                />
              </Box>

              {/* First Name */}
              <Box className="mb-4">
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={isEditing ? firstName : user.first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </Box>

              {/* Last Name */}
              <Box className="mb-4">
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={isEditing ? lastName : user.last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </Box>

              {/* Action Buttons */}
              <Box className="flex gap-3 pt-4">
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => {
                        setIsEditing(false);
                        setFirstName(user.first_name);
                        setLastName(user.last_name);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Form>
        </Box>
      </Box>
    </Paper>
  );
}
