// src/store/useAuthStore.js
import { create } from 'zustand';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const useAuthStore = create((set) => ({
  user: null,
  loading: true, // Start loading to check auth status

  // Login action
  login: async (email, password) => {
    set({ loading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  // Logout action
  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ user: null, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Logout error:", error);
    }
  },

  // Check auth state on app load
  checkAuth: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ user: user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    });
  },
}));

// Initialize auth check when store is created
useAuthStore.getState().checkAuth();

export default useAuthStore;