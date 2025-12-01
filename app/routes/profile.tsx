import { useState } from 'react';
import { Link, useLoaderData, useSearchParams } from 'react-router';
import { ROUTES } from '../constants/routes';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Breadcrumbs,
} from '@mui/material';
import { ArrowBack, Person, Lock } from '@mui/icons-material';
import type { Route } from './+types/profile';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { ChangePassword } from '../components/profile/ChangePassword';
import { DashboardAppBar } from '../components/dashboard/DashboardAppBar';
import { action } from '../actions/profile';
import { loader } from '../loaders/profile';

export { action, loader };

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Profile Settings - My App' },
    { name: 'description', content: 'Manage your profile and account settings' },
  ];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(() => {
    const tab = searchParams.get('tab');
    return tab === 'password' ? 1 : 0;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchParams(newValue === 1 ? { tab: 'password' } : {});
  };

  if (!loaderData || !loaderData.user) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Paper className="p-8 text-center">
          <Typography variant="h6" className="text-red-600">
            User not found
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* App Bar */}
      <DashboardAppBar user={loaderData.user} />

      {/* Main Content */}
      <Box className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-6">
          <Button
            component={Link}
            to={ROUTES.DASHBOARD}
            startIcon={<ArrowBack />}
            className="text-gray-600 hover:text-gray-800"
          >
            Dashboard
          </Button>
          <Typography className="text-gray-500">Profile Settings</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Profile Settings
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Manage your profile information and account settings
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper className="mb-6">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile settings tabs"
            className="border-b border-gray-200"
          >
            <Tab
              icon={<Person />}
              label="Profile Information"
              id="profile-tab-0"
              aria-controls="profile-tabpanel-0"
            />
            <Tab
              icon={<Lock />}
              label="Change Password"
              id="profile-tab-1"
              aria-controls="profile-tabpanel-1"
            />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <ProfileInfo user={loaderData.user} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <ChangePassword />
        </TabPanel>
      </Box>
    </Box>
  );
}
