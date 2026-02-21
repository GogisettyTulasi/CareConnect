import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, isCoordinator } = useAuth();
  const name = user?.name || user?.email?.split('@')[0] || 'User';

  const roleLabel =
    user?.role === 'ADMIN'
      ? 'Administrator'
      : user?.role === 'COORDINATOR'
        ? 'Coordinator'
        : 'Donor / Requester';

  const quickActions = [
    { label: 'Donate items', path: '/donate', icon: <AddCircleOutlineIcon />, primary: true },
    { label: 'Browse items', path: '/browse', icon: <StorefrontIcon /> },
    { label: 'My requests', path: '/my-requests', icon: <RequestPageIcon /> },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Hello, {name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        You are logged in as <strong>{roleLabel}</strong>.
      </Typography>

      <Grid container spacing={3}>
        {quickActions.map(({ label, path, icon, primary }) => (
          <Grid item xs={12} sm={6} md={4} key={path}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
              }}
              onClick={() => navigate(path)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ color: primary ? 'primary.main' : 'text.secondary', mb: 1 }}>
                  {React.cloneElement(icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {label}
                </Typography>
                <Button variant={primary ? 'contained' : 'outlined'} size="small" sx={{ mt: 1 }}>
                  Go
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {isAdmin && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
              }}
              onClick={() => navigate('/admin')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Admin Panel
                </Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1 }} color="secondary">
                  Manage
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
        {isCoordinator && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
              }}
              onClick={() => navigate('/coordinator')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Coordinator Panel
                </Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1 }} color="secondary">
                  Pickups
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
