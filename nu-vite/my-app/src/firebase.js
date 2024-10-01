// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRjASdEi-IsHD-8RX-rgwxFGYnDkWVaSc",
  authDomain: "buian-mpp.firebaseapp.com",
  projectId: "buian-mpp",
  storageBucket: "buian-mpp.appspot.com",
  messagingSenderId: "781790945974",
  appId: "1:781790945974:web:1e7b2a280c74a11db8bc17",
  measurementId: "G-SGHFGLNY7Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log(auth)

export { app, auth, db };
