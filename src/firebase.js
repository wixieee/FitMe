// Імпортуємо необхідні функції з Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ← ДОДАНО GoogleAuthProvider
import { getStorage } from "firebase/storage";

// Конфігурація для твого Firebase проекту
const firebaseConfig = {
  apiKey: "AIzaSyAPg6zLlpBqPsMk0W0K5aXyvHzoJJQ_8o4",
  authDomain: "fitmeproject-d7ed7.firebaseapp.com",
  projectId: "fitmeproject-d7ed7",
  storageBucket: "fitmeproject-d7ed7.appspot.com",
  messagingSenderId: "322993540874",
  appId: "1:322993540874:web:7080ba541da1400a0134f3",
  measurementId: "G-92FBCYHF11"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider(); // ← ДОДАНО провайдер

// Експортуємо об'єкти
export { app, analytics, db, auth, storage, googleProvider };
