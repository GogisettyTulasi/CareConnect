import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { getDonations } from '../services/donationService';
import { createRequest } from '../services/requestService';
import { useSnackbar } from '../context/SnackbarContext';

const STATUS_COLOR = {
  AVAILABLE: 'success',
  RESERVED: 'warning',
  PICKED_UP: 'default',
};

function friendlyError(err) {
  const msg = err?.message || '';
  if (msg.toLowerCase().includes('network')) return 'Something went wrong. Please try again.';
  return msg || 'Something went wrong. Please try again.';
}

export default function BrowseItems() {
  const { showSuccess, showError } = useSnackbar();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestingId, setRequestingId] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDonations();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      showError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleRequest = async (donationId) => {
    setError('');
    setRequestingId(donationId);
    try {
      await createRequest({ donationId, message: 'I would like to receive this item.' });
      showSuccess('Request submitted successfully');
      await loadItems();
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      showError(msg);
    } finally {
      setRequestingId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Browse items
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Request items you need. Donors and coordinators will follow up.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {items.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">No donations available yet. Check back later or add your own.</Typography>
          </Grid>
        )}
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Chip
                    label={item.status || 'AVAILABLE'}
                    size="small"
                    color={STATUS_COLOR[item.status] || 'default'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.category}
                </Typography>
                {item.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.description}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Qty: {item.quantity ?? 1}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                {item.status === 'AVAILABLE' && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleRequest(item.id)}
                    disabled={!!requestingId}
                  >
                    {requestingId === item.id ? 'Submitting…' : 'Request'}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
