// src/services/bookingService.js
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,       // <-- 1. IMPORT INI
  orderBy      // <-- 2. IMPORT INI
} from 'firebase/firestore';

const bookingsCollection = collection(db, 'bookings');

export const getBookings = async () => {
  // 2. Buat query untuk mengurutkan
  const q = query(bookingsCollection, orderBy("createdAt", "desc"));

  // 3. Gunakan 'q' (query) di sini
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date, 
    };
  });
};

export const addBooking = async (booking) => {
  const docRef = await addDoc(bookingsCollection, {
    ...booking,
    createdAt: serverTimestamp(), // <-- Field ini yang kita pakai untuk urutkan
  });
  return { id: docRef.id, ...booking };
};

// Fungsi updateBooking dan deleteBooking tidak perlu diubah
export const updateBooking = async (id, updatedBooking) => {
  const bookingDoc = doc(db, 'bookings', id);
  await updateDoc(bookingDoc, updatedBooking);
};

export const deleteBooking = async (id) => {
  const bookingDoc = doc(db, 'bookings', id);
  await deleteDoc(bookingDoc);
};