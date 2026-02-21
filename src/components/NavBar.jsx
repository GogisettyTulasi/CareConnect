import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BrowseIcon from '@mui/icons-material/Storefront';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const APP_NAME = 'CareConnect';
const BASE_NAV_ITEMS = [
  { path: '/donate', label: 'Donate', icon: <AddCircleOutlineIcon /> },
  { path: '/browse', label: 'Browse Items', icon: <BrowseIcon /> },
];
const MY_DONATIONS_ITEM = { path: '/my-donations', label: 'My Donations', icon: <Inventory2Icon /> };
const MY_REQUESTS_ITEM = { path: '/my-requests', label: 'My Requests', icon: <RequestPageIcon /> };

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout, isAdmin, isCoordinator } = useAuth();
  const isNormalUser = !isAdmin && !isCoordinator;
  const navItems = [...BASE_NAV_ITEMS, ...(isNormalUser ? [MY_DONATIONS_ITEM] : []), MY_REQUESTS_ITEM];

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDrawerOpen(false);
  };

  const navContent = (
    <>
      <List sx={{ pt: 2 }}>
        {navItems.map(({ path, label, icon }) => (
          <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === path}
              onClick={() => handleNav(path)}
              sx={{ borderRadius: 1, mx: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAdmin && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === '/admin'}
              onClick={() => handleNav('/admin')}
              sx={{ borderRadius: 1, mx: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItemButton>
          </ListItem>
        )}
        {isCoordinator && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === '/coordinator'}
              onClick={() => handleNav('/coordinator')}
              sx={{ borderRadius: 1, mx: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText primary="Coordinator Panel" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1, mx: 1 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 1, display: { md: 'none' } }}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="button"
            onClick={() => handleNav('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'inherit',
              padding: 0,
              marginRight: 2,
            }}
          >
            <VolunteerActivismIcon sx={{ fontSize: 28 }} />
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: { xs: 120, sm: 200 },
              }}
            >
              {APP_NAME}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {/* Desktop nav - hidden on mobile */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {navItems.map(({ path, label }) => (
              <Button
                key={path}
                color="inherit"
                onClick={() => handleNav(path)}
                sx={{
                  textTransform: 'none',
                  fontWeight: location.pathname === path ? 600 : 500,
                  opacity: location.pathname === path ? 1 : 0.9,
                }}
              >
                {label}
              </Button>
            ))}
            {isAdmin && (
              <Button
                color="inherit"
                onClick={() => handleNav('/admin')}
                sx={{ textTransform: 'none', fontWeight: location.pathname === '/admin' ? 600 : 500 }}
              >
                Admin Panel
              </Button>
            )}
            {isCoordinator && (
              <Button
                color="inherit"
                onClick={() => handleNav('/coordinator')}
                sx={{ textTransform: 'none', fontWeight: location.pathname === '/coordinator' ? 600 : 500 }}
              >
                Coordinator Panel
              </Button>
            )}
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ textTransform: 'none', ml: 0.5 }}
            >
              Logout
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{
              display: { xs: 'none', sm: 'block' },
              ml: 1,
              maxWidth: 140,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.name || user?.email}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, boxSizing: 'border-box' },
        }}
      >
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <VolunteerActivismIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            {APP_NAME}
          </Typography>
        </Toolbar>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 1 }}>
          {navContent}
        </Box>
      </Drawer>
    </>
  );
}
