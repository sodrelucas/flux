import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD897peeK5N2s0cvDl0UwB-t3VkBd0oTTs",
  authDomain: "flux-a062f.firebaseapp.com",
  projectId: "flux-a062f",
  storageBucket: "flux-a062f.firebasestorage.app",
  messagingSenderId: "789259769542",
  appId: "1:789259769542:web:d3f67f901e996d57b3a9c7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
