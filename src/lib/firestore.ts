// src/lib/firestore.ts
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import type { Outlet } from './types'; // Assuming types.ts defines Outlet

const outletsCollectionRef = collection(db, 'outlets');

// Get all outlets
export async function getOutlets(): Promise<Outlet[]> {
  const q = query(outletsCollectionRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Outlet));
}

// Get a single outlet by ID
export async function getOutletById(id: string): Promise<Outlet | null> {
  const docRef = doc(db, 'outlets', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...docSnap.data(), id: docSnap.id } as Outlet;
  } else {
    return null;
  }
}

// Add a new outlet
export async function addOutlet(outletData: Omit<Outlet, 'id'>): Promise<Outlet> {
  const newDocRef = doc(outletsCollectionRef);
  await setDoc(newDocRef, outletData);
  return { id: newDocRef.id, ...outletData } as Outlet;
}

// Update an existing outlet
export async function updateOutlet(id: string, newData: Partial<Outlet>): Promise<void> {
  const docRef = doc(db, 'outlets', id);
  await updateDoc(docRef, newData);
}

// Delete an outlet
export async function deleteOutlet(id: string): Promise<void> {
  const docRef = doc(db, 'outlets', id);
  await deleteDoc(docRef);
}
