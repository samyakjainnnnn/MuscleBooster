// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZ2R8TxwTNYAUBMocF3A6rWTJyDtjuCfY",
  authDomain: "buildyourself-e85c7.firebaseapp.com",
  projectId: "buildyourself-e85c7",
  storageBucket: "buildyourself-e85c7.appspot.com",
  messagingSenderId: "846382006046",
  appId: "1:846382006046:web:68f2308d4219061869530f",
  measurementId: "G-3NXMGLSL2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize storage

export { auth, app, storage };
