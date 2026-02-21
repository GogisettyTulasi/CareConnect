import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { getMyRequests } from '../services/requestService';
import { useSnackbar } from '../context/SnackbarContext';

function friendlyMessage(err) {
  const msg = err?.message || '';
  if (msg.toLowerCase().includes('network')) return 'Something went wrong. Please try again.';
  return msg || 'Something went wrong. Please try again.';
}

const STATUS_COLOR = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'error',
  PICKED_UP: 'info',
};

export default function MyRequests() {
  const { showError } = useSnackbar();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    getMyRequests()
      .then((data) => {
        if (!cancelled) setRequests(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = friendlyMessage(err);
          setError(msg);
          showError(msg);
          setRequests([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [showError]);

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
        My requests
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track your requests for donated items.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Card>
        <CardContent>
          {requests.length === 0 ? (
            <Typography color="text.secondary">You have no requests yet. Browse items to request something.</Typography>
          ) : (
            <List disablePadding>
              {requests.map((req) => (
                <ListItem
                  key={req.id}
                  divider
                  sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}
                >
                  <ListItemText
                    primary={req.donation?.title ?? 'Donation'}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {req.donation?.category ?? '-'} • {req.message || 'No message'}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction sx={{ position: 'relative', transform: 'none', mt: 1 }}>
                    <Chip
                      label={req.status || 'PENDING'}
                      size="small"
                      color={STATUS_COLOR[req.status] || 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
