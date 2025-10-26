// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields.');
    }

    const result = await login(email, password);

    if (result.success) {
      toast.success('Logged in successfully!');
      navigate('/dashboard'); // Arahkan ke dashboard setelah login
    } else {
      toast.error('Invalid email or password.');
    }
  };

  return (
    // --- KODE INI YANG MEMBUATNYA KE TENGAH ---
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',       // <-- Tengah secara vertikal
        justifyContent: 'center',  // <-- Tengah secara horizontal
        minHeight: '100vh',        // <-- Tinggi penuh 1 layar
        bgcolor: 'background.default',
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Admin Login
        </Typography>
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2, p: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
      </Paper>
    </Box>
    // --- AKHIR DARI KODE PENGAH ---
  );
};

export default Login;