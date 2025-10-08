import { useState, type MouseEvent } from 'react';
import { Form } from 'react-router';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountCircle,
  ExitToApp,
  Settings,
  Notifications,
} from '@mui/icons-material';

interface DashboardAppBarProps {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function DashboardAppBar({ user }: DashboardAppBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    // Navigate to profile page (you can implement this later)
    console.log('Navigate to profile');
  };

  const handleSettings = () => {
    handleClose();
    // Navigate to settings page (you can implement this later)
    console.log('Navigate to settings');
  };

  return (
    <AppBar position="static" className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <Toolbar>
        <DashboardIcon className="mr-2" />
        <Typography variant="h6" component="div" className="flex-grow font-bold">
          My Dashboard
        </Typography>
        
        <IconButton color="inherit" className="mr-2">
          <Notifications />
        </IconButton>
        
        <IconButton
          size="large"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box className="px-4 py-2">
            <Typography variant="subtitle2" className="font-bold">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {user.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <AccountCircle className="mr-2" />
            Profile
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <Settings className="mr-2" />
            Settings
          </MenuItem>
          <Divider />
          <Form method="post">
            <input type="hidden" name="action" value="logout" />
            <MenuItem component="button" type="submit">
              <ExitToApp className="mr-2" />
              Logout
            </MenuItem>
          </Form>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

