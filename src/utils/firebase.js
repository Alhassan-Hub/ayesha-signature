import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// We are hardcoding the keys so Next.js can't ignore them!
const firebaseConfig = {
  apiKey: "AIzaSyCNs843-EXQEvqJQfhZVTQ2qRnVD4_1n3g",
  authDomain: "ayeshas-signature.firebaseapp.com",
  projectId: "ayeshas-signature",
  storageBucket: "ayeshas-signature.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Database and Storage tools
export const db = getFirestore(app);
export const storage = getStorage(app);