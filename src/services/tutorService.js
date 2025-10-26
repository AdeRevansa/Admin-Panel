// src/services/tutorService.js
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

const tutorsCollection = collection(db, 'tutors');

export const getTutors = async () => {
  // 3. Buat query untuk mengurutkan
  const q = query(tutorsCollection, orderBy("createdAt", "desc")); 

  // 4. Gunakan 'q' (query) di sini, bukan 'tutorsCollection'
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTutor = async (tutor) => {
  const docRef = await addDoc(tutorsCollection, {
    ...tutor,
    createdAt: serverTimestamp(), // <-- Field ini yang kita pakai untuk urutkan
  });
  return { id: docRef.id, ...tutor };
};

// Fungsi updateTutor dan deleteTutor tidak perlu diubah
export const updateTutor = async (id, updatedTutor) => {
  const tutorDoc = doc(db, 'tutors', id);
  await updateDoc(tutorDoc, updatedTutor);
};

export const deleteTutor = async (id) => {
  const tutorDoc = doc(db, 'tutors', id);
  await deleteDoc(tutorDoc);
};