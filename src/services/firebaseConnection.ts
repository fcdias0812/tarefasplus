import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdKt2Q6pX2tveykjeR0mS8_-bWLhDKPIg",
  authDomain: "tarefasplus-564f2.firebaseapp.com",
  projectId: "tarefasplus-564f2",
  storageBucket: "tarefasplus-564f2.firebasestorage.app",
  messagingSenderId: "27069211690",
  appId: "1:27069211690:web:8d9913dd9cd8cfde3e4f53",
  measurementId: "G-E87NLY1DN9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
