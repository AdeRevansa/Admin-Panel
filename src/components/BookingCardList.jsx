// src/components/BookingCardList.jsx

import React from 'react';
import useBookingStore from '../store/useBookingStore'; // <-- Gunakan useBookingStore
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  CardActions,
  Button,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Terima 'bookings' sebagai prop
const BookingCardList = ({ bookings, onEdit }) => {
  const { removeBooking } = useBookingStore(); // <-- Gunakan removeBooking

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      removeBooking(id);
    }
  };

  // Helper untuk warna chip status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {bookings.map((booking) => (
        <Card key={booking.id} variant="outlined">
          <CardContent>
            {/* Header: Student dan Status */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="h6" component="div">
                {booking.studentName}
              </Typography>
              <Chip
                label={booking.status}
                color={getStatusColor(booking.status)}
                size="small"
              />
            </Box>

            {/* Info */}
            <Typography color="text.secondary" gutterBottom>
              Tutor: <strong>{booking.tutorName}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              Date: <strong>{booking.date}</strong>
            </Typography>
            <Typography variant="body2">
              Time: <strong>{booking.startTime} - {booking.endTime}</strong>
            </Typography>
          </CardContent>
          <Divider />
          
          {/* Aksi (Tombol) */}
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => onEdit(booking)}
              color="secondary"
            >
              Edit
            </Button>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(booking.id)}
              color="error"
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default BookingCardList;