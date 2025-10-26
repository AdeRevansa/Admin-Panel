// src/components/BookingModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, CircularProgress,
  MenuItem, Select, FormControl, InputLabel,
  Autocomplete // <-- 1. IMPORT Autocomplete
} from '@mui/material';
import useBookingStore from '../store/useBookingStore';
import useTutorStore from '../store/useTutorStore';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const BookingModal = ({ open, onClose, booking }) => {
  const { createBooking, editBooking, loading } = useBookingStore();
  const { tutors, fetchTutors } = useTutorStore();
  
  const [formData, setFormData] = useState({
    tutorName: '',
    studentName: '',
    date: '',
    startTime: '',
    endTime: '',
    status: 'scheduled',
  });

  // State untuk menyimpan "objek" tutor yang dipilih dari Autocomplete
  // Kita perlu ini karena Autocomplete bekerja lebih baik dengan objek
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    if (booking) {
      setFormData(booking);
      // Saat mengedit, cari objek tutor yang sesuai berdasarkan nama
      const currentTutor = tutors.find(t => t.name === booking.tutorName);
      setSelectedTutor(currentTutor || null);
    } else {
      setFormData({
        tutorName: '',
        studentName: '',
        date: '',
        startTime: '',
        endTime: '',
        status: 'scheduled',
      });
      setSelectedTutor(null); // Reset pilihan tutor
    }
  }, [booking, open, tutors]); // Tambahkan 'tutors' sebagai dependensi

  useEffect(() => {
    if (tutors.length === 0) {
      fetchTutors();
    }
  }, [tutors, fetchTutors]);

  // handleChange untuk input standar (Student Name, Status)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tutorName || !formData.studentName || !formData.date || !formData.startTime) {
      alert('Please fill all required fields');
      return;
    }
    const dataToSave = { ...formData };
    let success = false;
    if (booking) {
      success = await editBooking(booking.id, dataToSave);
    } else {
      success = await createBooking(dataToSave);
    }
    if (success) {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" gutterBottom>
          {booking ? 'Edit Booking' : 'Add New Booking'}
        </Typography>
        
        {/* --- 2. GANTI <FormControl> "Tutor Name" DENGAN INI --- */}
        <Autocomplete
          fullWidth
          options={tutors} // <-- Data array-nya (berisi objek tutor)
          
          // Ini memberi tahu Autocomplete cara menampilkan teks (Nama + Subjek)
          getOptionLabel={(option) => `${option.name} (${option.subject})`}
          
          // Ini memberi tahu Autocomplete cara membandingkan saat mencari
          // Kita cari berdasarkan 'name' DAN 'subject'
          filterOptions={(options, state) =>
            options.filter(
              (option) =>
                option.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                option.subject.toLowerCase().includes(state.inputValue.toLowerCase())
            )
          }

          // Nilai yang dipilih (objek tutor)
          value={selectedTutor}

          // Handler saat pilihan berubah
          onChange={(event, newValue) => {
            setSelectedTutor(newValue); // Simpan objek tutor
            // Simpan HANYA NAMA-nya ke formData untuk disimpan ke database
            setFormData((prev) => ({
              ...prev,
              tutorName: newValue ? newValue.name : ''
            }));
          }}

          // Handler saat pengguna mengetik (opsional, tapi bagus)
          onInputChange={(event, newInputValue) => {
            // Jika pengguna mengetik tapi tidak memilih, kita tidak ingin
            // menyimpan teks ketikan itu sebagai nama tutor
            if (!selectedTutor || newInputValue !== `${selectedTutor.name} (${selectedTutor.subject})`) {
               setFormData((prev) => ({
                 ...prev,
                 tutorName: ''
               }));
            }
          }}

          // Ini adalah <TextField> yang dilihat pengguna
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Tutor (Name or Subject)"
              margin="normal"
              required
              error={!formData.tutorName && !!selectedTutor} // Tampilkan error jika diperlukan
            />
          )}

          // Pesan jika tidak ada tutor
          noOptionsText={tutors.length === 0 ? "Please add a tutor first" : "No tutor found"}
          disabled={tutors.length === 0}
        />
        {/* --- AKHIR DARI PENGGANTIAN --- */}

        <TextField
          label="Student Name"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        
        {/* (Sisa input DatePicker, TimePicker, dan Status tetap sama) */}
        <DatePicker
          label="Date"
          value={formData.date ? dayjs(formData.date) : null}
          onChange={(newValue) => {
            setFormData((prev) => ({
              ...prev,
              date: newValue ? newValue.format('YYYY-MM-DD') : ''
            }));
          }}
          slotProps={{ 
            textField: { fullWidth: true, margin: "normal", required: true } 
          }}
        />

        <TimePicker
          label="Start Time"
          value={formData.startTime ? dayjs(`1970-01-01T${formData.startTime}`) : null}
          onChange={(newValue) => {
            setFormData((prev) => ({
              ...prev,
              startTime: newValue ? newValue.format('HH:mm') : ''
            }));
          }}
          slotProps={{ 
            textField: { fullWidth: true, margin: "normal", required: true } 
          }}
        />

        <TimePicker
          label="End Time"
          value={formData.endTime ? dayjs(`1970-01-01T${formData.endTime}`) : null}
          onChange={(newValue) => {
            setFormData((prev) => ({
              ...prev,
              endTime: newValue ? newValue.format('HH:mm') : ''
            }));
          }}
          slotProps={{ 
            textField: { fullWidth: true, margin: "normal" } 
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (booking ? 'Save Changes' : 'Add Booking')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BookingModal;