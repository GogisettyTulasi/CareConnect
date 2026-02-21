import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Grid, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { createDonation } from '../services/donationService';
import { useSnackbar } from '../context/SnackbarContext';

const CATEGORIES = ['Food', 'Clothes', 'Books', 'Toys', 'Furniture', 'Electronics', 'Other'];

export default function DonateItem() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const { showSuccess, showError } = useSnackbar();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    setLoading(true);
    try {
      await createDonation({
        title: title.trim(),
        category,
        description: description.trim() || undefined,
        quantity: Number(quantity),
      });
      showSuccess('Item listed successfully');
      setTitle('');
      setCategory('Food');
      setDescription('');
      setQuantity(1);
      setError('');
    } catch (err) {
      const msg = (err?.message || '').toLowerCase().includes('network') ? 'Something went wrong. Please try again.' : (err?.message || 'Something went wrong. Please try again.');
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const heroSide = (
    <Box
      sx={{
        background: `linear-gradient(160deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        borderRadius: 3,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 380,
        color: 'white',
      }}
    >
      <VolunteerActivismIcon sx={{ fontSize: 64, mb: 2, opacity: 0.95 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Your donation matters
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.95 }}>
        List food, clothes, or other items. Someone in need can request them, and coordinators will help with pickup.
      </Typography>
    </Box>
  );

  const formCard = (
    <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Donate an item
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fill in the details below. Keep descriptions clear and honest.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Rice and lentils, Winter jackets"
            margin="normal"
            required
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
            sx={{ mb: 1.5 }}
          >
            {CATEGORIES.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            margin="normal"
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            inputProps={{ min: 1, max: 999 }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value || 1)}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ py: 1.5 }}>
            {loading ? 'Listing…' : 'List donation'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Donate
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Add a new item to share with your community.
      </Typography>
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={5}>
          {heroSide}
        </Grid>
        <Grid item xs={12} md={7}>
          {formCard}
        </Grid>
      </Grid>
    </Box>
  );
}
