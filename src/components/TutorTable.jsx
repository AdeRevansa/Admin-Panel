// src/components/TutorTable.jsx

import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// 1. Pastikan props-nya ada 'tutors', 'onEdit', 'onDelete'
const TutorTable = ({ tutors, onEdit, onDelete }) => {

  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Hourly Rate</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        {/* --- INI BAGIAN PALING KRUSIAL --- */}
        <TableBody>
          {/* 2. Pastikan Anda map 'tutors' dan menamakannya 'tutor' (singular) */}
          {tutors.map((tutor) => (
            <TableRow key={tutor.id}>
              
              {/* 3. Pastikan Anda memanggil properti DARI 'tutor' */}
              <TableCell>{tutor.name}</TableCell>
              <TableCell>{tutor.email}</TableCell>
              <TableCell>{tutor.subject}</TableCell>
              <TableCell>${tutor.hourlyRate}</TableCell>
              <TableCell>
                <Chip
                  label={tutor.status}
                  color={tutor.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Box>
                  <IconButton onClick={() => onEdit(tutor)} color="secondary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(tutor.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* --- AKHIR BAGIAN KRUSIAL --- */}
        
      </Table>
    </TableContainer>
  );
};

export default TutorTable;