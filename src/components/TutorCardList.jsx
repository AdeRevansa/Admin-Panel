// src/components/TutorCardList.jsx

import React from 'react';
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

const TutorCardList = ({ tutors, onEdit, onDelete }) => {

  // 2. Ubah FUNGSI 'handleDelete' menjadi ini:
  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {tutors.map((tutor) => (
        <Card key={tutor.id} variant="outlined">
          <CardContent>
            {/* Bagian Header Kartu: Nama dan Status */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="h6" component="div">
                {tutor.name}
              </Typography>
              <Chip
                label={tutor.status}
                color={tutor.status === 'active' ? 'success' : 'default'}
                size="small"
              />
            </Box>

            {/* Bagian Info */}
            <Typography color="text.secondary" gutterBottom>
              {tutor.email}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              Subject: <strong>{tutor.subject}</strong>
            </Typography>
            <Typography variant="body2">
              Rate: <strong>${tutor.hourlyRate} / hour</strong>
            </Typography>
          </CardContent>
          <Divider />
          
          {/* Bagian Aksi (Tombol) */}
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => onEdit(tutor)}
              color="secondary"
            >
              Edit
            </Button>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(tutor.id)}
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

export default TutorCardList;