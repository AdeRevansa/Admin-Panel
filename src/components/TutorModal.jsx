// src/components/TutorModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, CircularProgress,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import useTutorStore from '../store/useTutorStore';

// Style untuk Box Modal (sudah benar)
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

const TutorModal = ({ open, onClose, tutor }) => {
  const { createTutor, editTutor, loading } = useTutorStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    hourlyRate: '',
    status: 'active',
  });

  // useEffect untuk mengisi form saat mode edit (sudah benar)
  useEffect(() => {
    if (tutor) {
      setFormData(tutor);
    } else {
      // Reset untuk "Add"
      setFormData({
        name: '',
        email: '',
        subject: '',
        hourlyRate: '',
        status: 'active',
      });
    }
  }, [tutor, open]);

  // handleChange (sudah benar)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- handleSubmit (Versi Perbaikan) ---
  // Ini hanya akan menutup modal jika operasi (create/edit) berhasil
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi (sudah benar)
    if (!formData.name || !formData.email || !formData.subject || !formData.hourlyRate) {
      alert('Please fill all fields'); // Anda bisa ganti ini dengan toast.error()
      return;
    }

    const dataToSave = {
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate) // Pastikan rate adalah angka
    };

    let success = false; // Tracker untuk status operasi

    if (tutor) {
      // Mode Edit: Tangkap hasil (true/false) dari store
      success = await editTutor(tutor.id, dataToSave);
    } else {
      // Mode Create: Tangkap hasil (true/false) dari store
      success = await createTutor(dataToSave);
    }

    if (success) {
      // Hanya tutup modal jika operasi berhasil
      onClose();
    }
    // Jika 'success' adalah false, modal akan tetap terbuka
    // dan notifikasi error dari store akan ditampilkan.
  };
  // --- Akhir handleSubmit ---

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" gutterBottom>
          {tutor ? 'Edit Tutor' : 'Add New Tutor'}
        </Typography>
        
        {/* --- Form Fields dengan atribut 'name' --- */}
        <TextField
          label="Name"
          name="name" // <-- Atribut name sudah ada
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email" // <-- Atribut name sudah ada
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Subject"
          name="subject" // <-- Atribut name sudah ada
          value={formData.subject}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Hourly Rate"
          name="hourlyRate" // <-- Atribut name sudah ada
          type="number"
          value={formData.hourlyRate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="status" // <-- Atribut name sudah ada
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        
        {/* --- Tombol Aksi --- */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (tutor ? 'Save Changes' : 'Add Tutor')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TutorModal;