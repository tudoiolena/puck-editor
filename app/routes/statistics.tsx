import { useState } from 'react';
import { useLoaderData, Link } from 'react-router';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  GetApp,
  Visibility,
  VisibilityOff,
  OpenInNew,
} from '@mui/icons-material';
import { DashboardAppBar } from '../components/dashboard/DashboardAppBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import type { Route } from './+types/statistics';
import { ROUTES } from '../constants/routes';

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: 'Statistics - Form Builder Analytics' },
    { name: 'description', content: 'View comprehensive analytics and statistics for your forms' },
  ];
}

export { loader } from '../loaders/statistics';

export default function Statistics() {
  const loaderData = useLoaderData() as typeof import('../loaders/statistics').loader;
  
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Handle CSV export
  const handleCSVExport = () => {
    const { statistics } = loaderData;
    
    // Create CSV content
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Forms', statistics.totalForms],
      ['Published Forms', statistics.publishedForms],
      ['Draft Forms', statistics.draftForms],
      ['Total Submissions', statistics.totalSubmissions],
      ['Submissions (Last 7 Days)', statistics.recentActivity.last7Days],
      ['Submissions (Last 30 Days)', statistics.recentActivity.last30Days],
      [''],
      ['Form Performance'],
      ['Form Title', 'Published', 'Submissions', 'Last Submission'],
      ...statistics.formPerformance.map(form => [
        form.title,
        form.isPublished ? 'Yes' : 'No',
        form.submissionCount,
        form.lastSubmission ? new Date(form.lastSubmission).toLocaleDateString() : 'Never',
      ]),
    ];

    const csvString = csvContent.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    // Download CSV
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `form-statistics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handle PDF export (placeholder - would need a PDF library)
  const handlePDFExport = () => {
    alert('PDF export functionality would be implemented here with a PDF generation library');
  };

  const { user, statistics } = loaderData;

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardAppBar user={user} />

      <Box className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Form Statistics & Analytics
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Comprehensive analytics for all your forms
          </Typography>
        </Box>

        {/* Export Buttons */}
        <Box className="mb-6 flex gap-3">
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={handleCSVExport}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={handlePDFExport}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Export PDF
          </Button>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={4} className="mb-8">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="h-full">
              <CardContent className="text-center">
                <Assessment className="text-blue-600 text-4xl mb-2" />
                <Typography variant="h4" className="font-bold text-gray-800">
                  {statistics.totalForms}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Total Forms
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="h-full">
              <CardContent className="text-center">
                <Visibility className="text-green-600 text-4xl mb-2" />
                <Typography variant="h4" className="font-bold text-gray-800">
                  {statistics.publishedForms}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Published Forms
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="h-full">
              <CardContent className="text-center">
                <TrendingUp className="text-purple-600 text-4xl mb-2" />
                <Typography variant="h4" className="font-bold text-gray-800">
                  {statistics.totalSubmissions}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Total Submissions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="h-full">
              <CardContent className="text-center">
                <TrendingDown className="text-orange-600 text-4xl mb-2" />
                <Typography variant="h4" className="font-bold text-gray-800">
                  {statistics.recentActivity.last7Days}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Last 7 Days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} className="mb-8">
          {/* Submissions Over Time */}
          <Grid item xs={12} lg={8}>
            <Paper className="p-6">
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                Submissions Over Time (Last 30 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics.dailySubmissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <RechartsTooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Form Performance Pie Chart */}
          <Grid item xs={12} lg={4}>
            <Paper className="p-6">
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                Form Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Published', value: statistics.publishedForms, color: '#10B981' },
                      { name: 'Draft', value: statistics.draftForms, color: '#F59E0B' },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {[
                      { name: 'Published', value: statistics.publishedForms, color: '#10B981' },
                      { name: 'Draft', value: statistics.draftForms, color: '#F59E0B' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box className="mt-4 flex justify-center gap-4">
                <Box className="flex items-center gap-2">
                  <Box className="w-3 h-3 bg-green-500 rounded"></Box>
                  <Typography variant="body2">Published ({statistics.publishedForms})</Typography>
                </Box>
                <Box className="flex items-center gap-2">
                  <Box className="w-3 h-3 bg-yellow-500 rounded"></Box>
                  <Typography variant="body2">Draft ({statistics.draftForms})</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Form Performance Table */}
        <Paper className="p-6">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Form Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Form Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Submissions</TableCell>
                  <TableCell>Last Submission</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.formPerformance.map((form) => (
                  <TableRow key={form.id} hover>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {form.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={form.isPublished ? <Visibility /> : <VisibilityOff />}
                        label={form.isPublished ? 'Published' : 'Draft'}
                        size="small"
                        color={form.isPublished ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" className="font-medium">
                        {form.submissionCount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600">
                        {form.lastSubmission 
                          ? new Date(form.lastSubmission).toLocaleDateString()
                          : 'Never'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Submissions">
                        <IconButton
                          component={Link}
                          to={ROUTES.FORMS.SUBMISSIONS(form.id)}
                          size="small"
                          className="text-blue-600"
                        >
                          <Assessment />
                        </IconButton>
                      </Tooltip>
                      {form.isPublished && (
                        <Tooltip title="View Form">
                          <IconButton
                            component="a"
                            href={ROUTES.PUBLIC_FORM(form.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            className="text-green-600"
                          >
                            <OpenInNew />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}

