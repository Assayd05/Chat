import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

console.log(import.meta.env.VITE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-d7057.firebaseapp.com",
  projectId: "reactchat-d7057",
  storageBucket: "reactchat-d7057.appspot.com",
  messagingSenderId: "130647232138",
  appId: "1:130647232138:web:05940be565381fbc206773"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()