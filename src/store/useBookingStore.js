// src/store/useBookingStore.js
import { create } from 'zustand'; // <-- INI SUDAH DIPERBAIKI
import { getBookings, addBooking, updateBooking, deleteBooking } from '../services/bookingService';
import toast from 'react-hot-toast';

// Fungsi helper untuk perbaikan modal (jika Anda belum menambahkannya)
const handleAsyncOp = async (op) => {
  try {
    await op();
    return true;
  } catch (error) {
    toast.error(error.message || 'An error occurred.');
    return false;
  }
};

const useBookingStore = create((set, get) => ({
  bookings: [],         // Data asli dari Firestore
  filteredBookings: [], // Data yang akan ditampilkan di UI
  loading: false,
  error: null,

  // --- STATE BARU UNTUK FILTER ---
  searchQuery: '',  // Untuk pencarian nama murid
  dateFilter: '',   // Untuk filter tanggal (format YYYY-MM-DD)
  // -----------------------------

  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const bookings = await getBookings();
      set({ bookings, filteredBookings: bookings, loading: false }); // Set keduanya
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to fetch bookings.');
    }
  },

  // --- FUNGSI BARU UNTUK FILTERING ---
  applyFilters: () => {
    const { bookings, searchQuery, dateFilter } = get();
    
    let tempFiltered = [...bookings];

    // 1. Filter berdasarkan Tanggal
    if (dateFilter) {
      tempFiltered = tempFiltered.filter(booking => booking.date === dateFilter);
    }

    // 2. Filter berdasarkan Pencarian (Nama Murid)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      tempFiltered = tempFiltered.filter(booking => 
        booking.studentName.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    set({ filteredBookings: tempFiltered });
  },

  // --- Aksi untuk mengubah filter ---
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters(); // Terapkan filter
  },

  setDateFilter: (date) => {
    set({ dateFilter: date });
    get().applyFilters(); // Terapkan filter
  },
  // ---------------------------------

  // Modifikasi fungsi CRUD agar memanggil applyFilters
  createBooking: async (booking) => {
    set({ loading: true });
    const success = await handleAsyncOp(async () => {
      const newBooking = await addBooking(booking);
      set((state) => ({ 
        bookings: [newBooking, ...state.bookings], // Tambah di depan
        loading: false 
      }));
      get().applyFilters(); // Terapkan filter
      toast.success('Booking added successfully!');
    });
    set({ loading: false });
    return success;
  },

  editBooking: async (id, updatedBooking) => {
    set({ loading: true });
    const success = await handleAsyncOp(async () => {
      await updateBooking(id, updatedBooking);
      set((state) => ({
        bookings: state.bookings.map((b) => 
          b.id === id ? { ...b, ...updatedBooking } : b
        ),
        loading: false,
      }));
      get().applyFilters(); // Terapkan filter
      toast.success('Booking updated successfully!');
    });
    set({ loading: false });
    return success;
  },

  removeBooking: async (id) => {
    // Fungsi ini sudah benar dari langkah 'ConfirmDialog'
    // (Asumsi tidak perlu 'loading' state)
    try {
      await deleteBooking(id);
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id),
      }));
      get().applyFilters(); // Terapkan filter
      toast.success('Booking deleted.');
    } catch (error) {
      set({ error: error.message });
      toast.error('Failed to delete booking.');
    }
  },
}));

export default useBookingStore;