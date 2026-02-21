import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

function friendlyError(err) {
  const msg = typeof err === 'string' ? err : err?.message || '';
  if (!msg || msg.toLowerCase().includes('network')) return 'Something went wrong. Please try again.';
  return msg;
}

export default function Signup() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { signup, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), password });
      showSuccess('Signup successful');
      navigate('/', { replace: true });
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formCard = (
    <Card elevation={2} sx={{ maxWidth: 420, width: '100%', borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <VolunteerActivismIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h5" fontWeight={600}>
            Create account
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join CareConnect to donate or request items in your community.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            autoFocus
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            helperText="At least 6 characters"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="toggle password">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            error={!!confirmPassword && password !== confirmPassword}
            helperText={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
            sx={{ mb: 2 }}
          />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ py: 1.5, mb: 2 }}>
            {loading ? 'Creating account…' : 'Sign up'}
          </Button>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already have an account?{' '}
            <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const heroSide = (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        borderRadius: 3,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 320,
        color: 'white',
      }}
    >
      <VolunteerActivismIcon sx={{ fontSize: 56, mb: 2, opacity: 0.95 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        One account. Many ways to give.
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        Donate items, browse available donations, or request what you need—all in one place.
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr',
          gap: 4,
          alignItems: 'center',
          maxWidth: 900,
          width: '100%',
        }}
      >
        {!isSmall && heroSide}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>{formCard}</Box>
        {isSmall && heroSide}
      </Box>
    </Box>
  );
}
