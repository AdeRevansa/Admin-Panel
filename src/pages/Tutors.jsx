// src/pages/Tutors.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  useMediaQuery,
  Pagination,
  TextField,   // <-- 1. IMPORT
  InputAdornment, // <-- 2. IMPORT
  FormControl,  // <-- 3. IMPORT
  InputLabel,   // <-- 4. IMPORT
  Select,       // <-- 5. IMPORT
  MenuItem,     // <-- 6. IMPORT
  Grid,         // <-- 7. IMPORT
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useTutorStore from '../store/useTutorStore';
import TutorTable from '../components/TutorTable';
import TutorModal from '../components/TutorModal';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'; // <-- 8. IMPORT SearchIcon
import TutorCardList from '../components/TutorCardList';
import ConfirmDialog from '../components/ConfirmDialog';

const ROWS_PER_PAGE = 5;

const Tutors = () => {
  // 9. Ambil state dan fungsi BARU dari store
  const { 
    filteredTutors, // <-- Ganti 'tutors' menjadi 'filteredTutors'
    loading, 
    fetchTutors, 
    removeTutor,
    searchQuery,      // <-- Ambil
    statusFilter,     // <-- Ambil
    setSearchQuery,   // <-- Ambil
    setStatusFilter   // <-- Ambil
  } = useTutorStore(); 
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTutor, setCurrentTutor] = useState(null);
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Kita panggil fetchTutors hanya sekali saat load
    // Gunakan filteredTutors.length untuk cek, tapi fetchTutors memuat 'tutors'
    fetchTutors();
  }, [fetchTutors]); // <-- Hapus dependency lain agar tidak fetch ulang

  // 10. Reset page ke 1 setiap kali filter berubah
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);


  const handleOpenModal = (tutor = null) => {
    setCurrentTutor(tutor);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setCurrentTutor(null);
    setModalOpen(false);
  };
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleOpenConfirm = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };
  const handleCloseConfirm = () => {
    setSelectedId(null);
    setConfirmOpen(false);
  };
  const handleConfirmDelete = () => {
    if (selectedId) {
      removeTutor(selectedId);
    }
    handleCloseConfirm();
  };
  
  // 11. Ganti 'tutors' menjadi 'filteredTutors' di sini
  const paginatedTutors = filteredTutors.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  // 12. Dan di sini
  const pageCount = Math.ceil(filteredTutors.length / ROWS_PER_PAGE);

  return (
    <Box>
      {/* --- Toolbar DENGAN FILTER --- */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          
          {/* Title */}
          <Grid item xs={12} md="auto">
            <Typography variant="h5" component="h2">
              Manage Tutors
            </Typography>
          </Grid>
          
          {/* Filter Inputs */}
          <Grid item xs={12} md="auto" sx={{ display: 'flex', gap: 2, flexGrow: 1, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Search Input */}
            <TextField
              label="Search (Name, Email, Subject)"
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
            {/* Status Filter Dropdown */}
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Add Button */}
          <Grid item xs={12} md="auto">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              fullWidth={isMobile} // Buat tombol full-width di mobile
            >
              Add Tutor
            </Button>
          </Grid>
          
        </Grid>
      </Paper>

      {/* --- Konten (Loading, Empty, Data) --- */}
      {/* 13. Ganti 'tutors.length' menjadi 'filteredTutors.length' */}
      {loading ? ( // <-- Tampilkan loading jika 'loading' true
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredTutors.length === 0 ? ( // <-- Cek 'filteredTutors'
        <Paper sx={{ p: 5 }}>
          <Typography align="center">
            {searchQuery || statusFilter !== 'all' ? 'No tutors match your filters.' : 'No tutors yet — click "Add Tutor" to get started.'}
          </Typography>
        </Paper>
      ) : (
        <Box>
          {isMobile ? (
            <TutorCardList
              tutors={paginatedTutors} // <-- Ini sudah benar (menggunakan paginatedTutors)
              onEdit={handleOpenModal}
              onDelete={handleOpenConfirm}
            />
          ) : (
            <Paper sx={{ p: 3 }}>
              <TutorTable
                tutors={paginatedTutors} // <-- Ini sudah benar
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

      {/* --- Modals (Tidak Berubah) --- */}
      <TutorModal
        open={modalOpen}
        onClose={handleCloseModal}
        tutor={currentTutor}
      />
      <ConfirmDialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete Tutor"
        message="Are you sure you want to delete this tutor? This action cannot be undone."
      />
    </Box>
  );
};

export default Tutors;