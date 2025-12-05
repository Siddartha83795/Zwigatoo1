// src/lib/firestore.ts
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, DocumentData } from 'firebase/firestore';
import type { Outlet } from './types'; // Assuming types.ts defines Outlet

function getFirestoreDB() {
  if (!db) {
    throw new Error('Firestore DB not initialized. Ensure Firebase is configured and running.');
  }
  return db;
}

// Helper to convert Firestore DocumentData to Outlet type, ensuring 'id' is present
const docToOutlet = (doc: DocumentData): Outlet => {
  return { ...doc.data(), id: doc.id } as Outlet;
}

// Get all outlets
export async function getOutlets(): Promise<Outlet[]> {
  // If db is null, it means we are likely in a server-side build environment
  // where client-side Firebase is not initialized, and security rules might
  // prevent unauthenticated access. Return mock data to allow build to proceed.
  if (!db) {
    console.warn("getOutlets: Firestore DB not initialized. Returning mock data for build process.");
    // Return a small array of mock outlets for generateStaticParams
    return [
      { id: 'mock-outlet-1', name: 'Mock Cafe 1', description: 'A delightful mock cafe.', imageId: 'mock-img-1', isActive: true, baseDeliveryTime: 10 },
      { id: 'mock-outlet-2', name: 'Mock Eatery 2', description: 'Another fine mock eatery.', imageId: 'mock-img-2', isActive: true, baseDeliveryTime: 15 },
    ];
  }

  const firestoreDb = getFirestoreDB();
  const outletsCollectionRef = collection(firestoreDb, 'outlets');
  const q = query(outletsCollectionRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docToOutlet);
}

// Get a single outlet by ID
export async function getOutletById(id: string): Promise<Outlet | null> {
  if (!db) {
    console.warn(`getOutletById: Firestore DB not initialized. Returning mock data for ID: ${id} during build process.`);
    // Return a mock outlet for prerendering
    return { id: id, name: `Mock Outlet ${id}`, description: 'Mock description', imageId: 'mock-img', isActive: true, baseDeliveryTime: 10 };
  }
  const firestoreDb = getFirestoreDB();
  const docRef = doc(firestoreDb, 'outlets', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docToOutlet(docSnap);
  } else {
    return null;
  }
}

// Add a new outlet
export async function addOutlet(outletData: Omit<Outlet, 'id'>): Promise<Outlet> {
  const firestoreDb = getFirestoreDB();
  const outletsCollectionRef = collection(firestoreDb, 'outlets');
  const newDocRef = doc(outletsCollectionRef);
  await setDoc(newDocRef, outletData);
  return { id: newDocRef.id, ...outletData } as Outlet;
}

// Update an existing outlet
export async function updateOutlet(id: string, newData: Partial<Outlet>): Promise<void> {
  const firestoreDb = getFirestoreDB();
  const docRef = doc(firestoreDb, 'outlets', id);
  await updateDoc(docRef, newData);
}

// Delete an outlet
export async function deleteOutlet(id: string): Promise<void> {
  const firestoreDb = getFirestoreDB();
  const docRef = doc(firestoreDb, 'outlets', id);
  await deleteDoc(docRef);
}