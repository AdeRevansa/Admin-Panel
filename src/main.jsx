// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'; // <-- Hanya di-import SATU KALI
import { Toaster } from 'react-hot-toast';
import { theme } from './theme';
import './index.css';

// Import untuk Date Picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline /> {/* <-- Dan dipakai di sini */}
          <App />
          <Toaster position="bottom-center" />
        </BrowserRouter>
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>,
);