// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Your primary color
    },
    secondary: {
      main: '#2196F3', // Your secondary color
    },
    background: {
      default: '#F9FAFB', // Light background
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Your specified font
  },
  shape: {
    borderRadius: 8, // Rounded corners
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)', // Subtle shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});