// dinehub-app-main/scripts/uploadOutletsToFirestore.ts
import * as admin from 'firebase-admin';
import { outlets as staticOutlets } from '../src/lib/data'; // Import static data

// --- Firebase Admin SDK Initialization ---
// You need to set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// to the path of your service account key JSON file when running this script.
// Example: GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json" ts-node uploadOutletsToFirestore.ts
if (admin.apps.length === 0) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

async function uploadOutlets() {
  console.log('Starting upload of static outlets data to Firestore...');
  const collectionRef = db.collection('outlets');

  for (const outlet of staticOutlets) {
    try {
      // Set the document ID explicitly using outlet.id
      await collectionRef.doc(outlet.id).set(outlet);
      console.log(`Uploaded outlet: ${outlet.name} (ID: ${outlet.id})`);
    } catch (error) {
      console.error(`Error uploading outlet ${outlet.name} (ID: ${outlet.id}):`, error);
    }
  }

  console.log('Finished uploading static outlets data to Firestore.');
}

uploadOutlets()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error during upload:', error);
    process.exit(1);
  });
