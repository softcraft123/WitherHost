import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnalF9hDHPace6qF_7IfzzTB0CAcQAjEo",
  authDomain: "witherhost-4145c.firebaseapp.com",
  projectId: "witherhost-4145c",
  storageBucket: "witherhost-4145c.appspot.com",
  messagingSenderId: "821119247028",
  appId: "1:821119247028:web:a1b2c3d4e5f6g7h8i9j0k1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
