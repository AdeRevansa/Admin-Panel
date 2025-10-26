// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tutors from './pages/Tutors';
import Bookings from './pages/Bookings';
import Layout from './components/Layout';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <Routes>
      {/* Rute Login harus DI LUAR Layout */}
      <Route path="/login" element={<Login />} />

      {/* Rute yang dilindungi ada DI DALAM Layout */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;