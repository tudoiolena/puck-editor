import { useState, type MouseEvent } from 'react';
import { Form, Link } from 'react-router';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountCircle,
  ExitToApp,
  Settings,
  Notifications,
  Analytics,
} from '@mui/icons-material';
import { ROUTES } from '../../constants/routes';

interface DashboardAppBarProps {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    profile_picture?: string | null;
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
  };

  const handleSettings = () => {
    handleClose();
    // Navigate to settings page (you can implement this later)
    console.log('Navigate to settings');
  };

  // Generate initials for avatar fallback
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

  return (
    <AppBar position="static" className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <Toolbar>
        <Box
          component={Link}
          to={ROUTES.DASHBOARD}
          className="flex items-center flex-grow cursor-pointer hover:opacity-90 transition-opacity"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
        <DashboardIcon className="mr-2" />
          <Typography variant="h6" component="div" className="font-bold">
          My Dashboard
        </Typography>
        </Box>
        
        <IconButton color="inherit" className="mr-2">
          <Notifications />
        </IconButton>
        
        <IconButton
          size="large"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar
            src={user.profile_picture || undefined}
            className="w-8 h-8"
            sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
          >
            {!user.profile_picture && initials}
          </Avatar>
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
          <Box className="px-4 py-2 flex items-center gap-3">
            <Avatar
              src={user.profile_picture || undefined}
              className="w-10 h-10"
              sx={{ bgcolor: 'primary.main' }}
            >
              {!user.profile_picture && initials}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" className="font-bold">
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <MenuItem component={Link} to={ROUTES.PROFILE} onClick={handleProfile}>
            <AccountCircle className="mr-2" />
            Profile
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <Settings className="mr-2" />
            Settings
          </MenuItem>
          <MenuItem component={Link} to={ROUTES.STATISTICS} onClick={handleClose}>
            <Analytics className="mr-2" />
            Statistics
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

