// src/components/BookingTable.jsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Terima prop 'bookings'
const BookingTable = ({ bookings, onEdit, onDelete}) => {
  

  const handleDelete = (id) => {
    onDelete(id);
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
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          {/* Ganti Kolom Tabel */}
          <TableRow>
            <TableCell>Tutor</TableCell>
            <TableCell>Student</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Ganti 'tutor' menjadi 'booking' */}
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              {/* Ganti Data Sel */}
              <TableCell>{booking.tutorName}</TableCell>
              <TableCell>{booking.studentName}</TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>{booking.startTime}</TableCell>
              <TableCell>{booking.endTime}</TableCell>
              <TableCell>
                <Chip
                  label={booking.status}
                  color={getStatusColor(booking.status)}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Box>
                  <IconButton onClick={() => onEdit(booking)} color="secondary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(booking.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingTable;