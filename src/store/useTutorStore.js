// src/store/useTutorStore.js
import { create } from 'zustand'; // <-- INI SUDAH DIPERBAIKI
import { getTutors, addTutor, updateTutor, deleteTutor } from '../services/tutorService';
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


const useTutorStore = create((set, get) => ({
  tutors: [],       // Ini akan menyimpan data asli dari Firestore
  loading: false,
  error: null,
  
  // --- STATE BARU ---
  filteredTutors: [], // Ini yang akan ditampilkan di UI
  searchQuery: '',    // Untuk input teks pencarian
  statusFilter: 'all',  // Untuk dropdown filter (all, active, inactive)
  // ------------------

  fetchTutors: async () => {
    set({ loading: true, error: null });
    try {
      const tutors = await getTutors();
      set({ tutors, filteredTutors: tutors, loading: false }); // <-- Set keduanya saat fetch
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to fetch tutors.');
    }
  },

  // --- FUNGSI BARU UNTUK FILTERING ---
  applyFilters: () => {
    const { tutors, searchQuery, statusFilter } = get();
    
    let tempFiltered = [...tutors];

    // 1. Filter berdasarkan Status
    if (statusFilter !== 'all') {
      tempFiltered = tempFiltered.filter(tutor => tutor.status === statusFilter);
    }

    // 2. Filter berdasarkan Pencarian (Nama, Email, Subjek)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      tempFiltered = tempFiltered.filter(tutor => 
        (tutor.name && tutor.name.toLowerCase().includes(lowerCaseQuery)) ||
        (tutor.email && tutor.email.toLowerCase().includes(lowerCaseQuery)) ||
        (tutor.subject && tutor.subject.toLowerCase().includes(lowerCaseQuery))
      );
    }
    
    set({ filteredTutors: tempFiltered });
  },

  // --- Aksi untuk mengubah filter ---
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters(); // Terapkan filter setiap kali ketikan berubah
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status });
    get().applyFilters(); // Terapkan filter setiap kali dropdown berubah
  },
  // ---------------------------------

  // Modifikasi fungsi CRUD agar memperbarui 'tutors' dan 'filteredTutors'
  createTutor: async (tutor) => {
    set({ loading: true });
    const success = await handleAsyncOp(async () => {
      const newTutor = await addTutor(tutor);
      set((state) => ({ 
        tutors: [newTutor, ...state.tutors], // <-- Tambah di depan agar urutan 'terbaru' tetap
        loading: false 
      }));
      get().applyFilters(); // Terapkan filter lagi
      toast.success('Tutor added successfully!');
    });
    set({ loading: false });
    return success;
  },

  editTutor: async (id, updatedTutor) => {
    set({ loading: true });
    const success = await handleAsyncOp(async () => {
      await updateTutor(id, updatedTutor);
      set((state) => ({
        tutors: state.tutors.map((t) => 
          t.id === id ? { ...t, ...updatedTutor } : t
        ),
        loading: false,
      }));
      get().applyFilters(); // Terapkan filter lagi
      toast.success('Tutor updated successfully!');
    });
    set({ loading: false });
    return success;
  },

  removeTutor: async (id) => {
    try {
      await deleteTutor(id);
      set((state) => ({
        tutors: state.tutors.filter((t) => t.id !== id),
      }));
      get().applyFilters(); // Terapkan filter lagi
      toast.success('Tutor deleted.');
    } catch (error) {
      set({ error: error.message });
      toast.error('Failed to delete tutor.');
    }
  },
}));

export default useTutorStore;