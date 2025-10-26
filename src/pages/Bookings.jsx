// src/pages/Bookings.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  useMediaQuery,
  Pagination,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useBookingStore from '../store/useBookingStore';
import BookingTable from '../components/BookingTable';
import BookingModal from '../components/BookingModal';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import BookingCardList from '../components/BookingCardList';
import ConfirmDialog from '../components/ConfirmDialog';

// --- 1. IMPORT BARU ---
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
// ----------------------

const ROWS_PER_PAGE = 10;

const Bookings = () => {
  const { 
    filteredBookings, 
    loading, 
    fetchBookings, 
    removeBooking,
    searchQuery,
    dateFilter,
    setSearchQuery,
    setDateFilter
  } = useBookingStore(); 

  const [modalOpen, setModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, dateFilter]);

  // --- (Semua handler tetap sama) ---
  const handleOpenModal = (booking = null) => { setCurrentBooking(booking); setModalOpen(true); };
  const handleCloseModal = () => { setCurrentBooking(null); setModalOpen(false); };
  const handlePageChange = (event, newPage) => { setPage(newPage); };
  const handleOpenConfirm = (id) => { setSelectedId(id); setConfirmOpen(true); };
  const handleCloseConfirm = () => { setSelectedId(null); setConfirmOpen(false); };
  const handleConfirmDelete = () => { if (selectedId) { removeBooking(selectedId); } handleCloseConfirm(); };

  const paginatedBookings = filteredBookings.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const pageCount = Math.ceil(filteredBookings.length / ROWS_PER_PAGE);

  return (
    <Box>
      {/* Toolbar DENGAN FILTER */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          
          <Grid item xs={12} md="auto">
            <Typography variant="h5" component="h2">
              Manage Bookings
            </Typography>
          </Grid>
          
          <Grid item xs={12} md="auto" sx={{ display: 'flex', gap: 2, flexGrow: 1, flexDirection: { xs: 'column', md: 'row' } }}>
            <TextField
              label="Search Student Name"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            {/* --- 2. GANTI <TextField type="date"> DENGAN INI --- */}
            <DatePicker
              label="Filter by Date"
              // Konversi string dari state ke dayjs
              value={dateFilter ? dayjs(dateFilter) : null}
              onChange={(newValue) => {
                // Konversi dayjs kembali ke string
                setDateFilter(newValue ? newValue.format('YYYY-MM-DD') : '');
              }}
              sx={{ minWidth: 180 }}
              // Terapkan styling 'small' ke TextField di dalamnya
              slotProps={{ textField: { size: 'small' } }}
            />
            
          </Grid>

          <Grid item xs={12} md="auto">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              fullWidth={isMobile}
            >
              Add Booking
            </Button>
          </Grid>
          
        </Grid>
      </Paper>

      {/* --- (Sisa kode (Konten, Modals) tetap sama) --- */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredBookings.length === 0 ? (
        <Paper sx={{ p: 5 }}>
          <Typography align="center">
            {searchQuery || dateFilter ? 'No bookings match your filters.' : 'No bookings yet — click "Add Booking" to get started.'}
          </Typography>
        </Paper>
      ) : (
        <Box>
          {isMobile ? (
            <BookingCardList
              bookings={paginatedBookings}
              onEdit={handleOpenModal}
              onDelete={handleOpenConfirm}
            />
          ) : (
            <Paper sx={{ p: 3 }}>
              <BookingTable
                bookings={paginatedBookings}
                onEdit={handleOpenModal}
                onDelete={handleOpenConfirm}
              />
            </Paper>
          )}

          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}

      <BookingModal
        open={modalOpen}
        onClose={handleCloseModal}
        booking={currentBooking}
      />
      <ConfirmDialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
      />
    </Box>
  );
};

export default Bookings;