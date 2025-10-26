// src/pages/Dashboard.jsx
import React, { useEffect, useMemo } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Avatar,
  Divider,
  useTheme
} from '@mui/material';
import { 
  People, 
  EventAvailable, 
  Update, 
  Event 
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useTutorStore from '../store/useTutorStore';
import useBookingStore from '../store/useBookingStore';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

// --- 1. KOMPONEN STATCARD DIPERBARUI AGAR RESPONSIVE ---
const StatCard = ({ title, value, icon, color, onClick}) => (
  <Paper 
  onClick={onClick} 
  sx={{ 
    p: 2, 
    display: 'flex', 
    alignItems: 'center', 
    height: '100%',
    cursor: onClick ? 'pointer' : 'default', // --- MODIFIKASI ---
      '&:hover': {
        boxShadow: onClick ? 6 : 1, // --- MODIFIKASI (Efek hover)
      },
    // Tampilan Kolom di HP (ikon di atas, teks di bawah)
    flexDirection: { xs: 'column', sm: 'row' },
    // Teks di tengah di HP
    textAlign: { xs: 'center', sm: 'left' }
  }}>
    <Box sx={{ 
      p: 2, 
      bgcolor: `${color}.main`, 
      color: 'white', 
      borderRadius: 1.5,
      // Margin diubah agar sesuai layout baru
      mr: { xs: 0, sm: 2 },
      mb: { xs: 1, sm: 0 }
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
    </Box>
  </Paper>
);
// --- AKHIR PERUBAHAN STATCARD ---

const Dashboard = () => {
  const { tutors, loading: tutorsLoading, fetchTutors } = useTutorStore();
  const { bookings, loading: bookingsLoading, fetchBookings } = useBookingStore();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (tutors.length === 0) fetchTutors();
    if (bookings.length === 0) fetchBookings();
  }, [fetchTutors, fetchBookings, tutors.length, bookings.length]);

  // --- (Logika useMemo Anda untuk data tetap sama, sudah benar) ---
  const upcomingSessionsCount = useMemo(() => {
    const today = dayjs();
    const threeDaysFromNow = today.add(3, 'day');
    return bookings.filter(b => {
      const bookingDate = dayjs(b.date);
      return b.status === 'scheduled' && 
             bookingDate.isAfter(today.subtract(1, 'day')) &&
             bookingDate.isBefore(threeDaysFromNow.add(1, 'day'));
    }).length;
  }, [bookings]);

  const upcomingBookingsList = useMemo(() => {
    const today = dayjs();
    return bookings
      .filter(b => b.status === 'scheduled' && dayjs(b.date).isAfter(today.subtract(1, 'day')))
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
      .slice(0, 5);
  }, [bookings]);

  const weeklyChartData = useMemo(() => {
    const weeklyCounts = {
      'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0,
    };
    const today = dayjs();
    const startOfWeek = today.startOf('isoWeek');
    const endOfWeek = today.endOf('isoWeek');
    const thisWeeksBookings = bookings.filter(b => {
      const bookingDate = dayjs(b.date);
      return bookingDate.isAfter(startOfWeek.subtract(1, 'day')) &&
             bookingDate.isBefore(endOfWeek.add(1, 'day'));
    });
    for (const booking of thisWeeksBookings) {
      const dayName = dayjs(booking.date).format('ddd'); 
      if (weeklyCounts.hasOwnProperty(dayName)) {
        weeklyCounts[dayName]++;
      }
    }
    const formattedData = [
      { name: 'Mon', Bookings: weeklyCounts.Mon },
      { name: 'Tue', Bookings: weeklyCounts.Tue },
      { name: 'Wed', Bookings: weeklyCounts.Wed },
      { name: 'Thu', Bookings: weeklyCounts.Thu },
      { name: 'Fri', Bookings: weeklyCounts.Fri },
      { name: 'Sat', Bookings: weeklyCounts.Sat },
      { name: 'Sun', Bookings: weeklyCounts.Sun },
    ];
    return formattedData;
  }, [bookings]);
  
  const loading = tutorsLoading || bookingsLoading;

  if (loading && (tutors.length === 0 || bookings.length === 0)) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      {/* 1. Stat Cards (DITENGahkan & 1 Baris di HP) */}
      <Grid 
        container 
        spacing={2} // Spasi antar kartu dikecilkan
        sx={{ mb: 3 }}
        justifyContent="center"
      >
        {/* xs={4} berarti 3 item per baris (12 / 4 = 3) */}
        <Grid item xs={4} md="auto">
          <StatCard
            title="Total Tutors"
            value={tutors.length}
            icon={<People />}
            color="primary"
            onClick={() => navigate('/tutors')}
          />
        </Grid>
        <Grid item xs={4} md="auto">
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            icon={<EventAvailable />}
            color="secondary"
            onClick={() => navigate('/bookings')}
          />
        </Grid>
        <Grid item xs={4} md="auto">
          <StatCard
            title="Upcoming (Next 3 Days)"
            value={upcomingSessionsCount}
            icon={<Update />}
            color="warning"
            onClick={() => navigate('/bookings')}
          />
        </Grid>
      </Grid>

      {/* --- 2. LAYOUT BARU (STACKING VERTIKAL) --- */}
      
      {/* Bagian Upcoming Bookings (DI ATAS) */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}> {/* mb: 3 memberi jarak ke chart */}
        <Typography variant="h6" gutterBottom>
          Upcoming Bookings
        </Typography>
        {upcomingBookingsList.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4, mb: 4 }}>
            No upcoming bookings.
          </Typography>
        ) : (
          <List disablePadding>
            {upcomingBookingsList.map((booking, index) => (
              <React.Fragment key={booking.id}>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                      <Event fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary={booking.studentName} 
                    secondary={`${booking.date} at ${booking.startTime} (with ${booking.tutorName})`} 
                  />
                </ListItem>
                {index < upcomingBookingsList.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Bagian Chart (DI BAWAH) */}
      <Paper sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          This Week's Bookings
        </Typography>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={weeklyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Bookings" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      
    </Box>
  );
};

export default Dashboard;