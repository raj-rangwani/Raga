import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD0-xSBAhOm7jJWRDtNeV08b5DTWxNIzvc",
  authDomain: "raga-135.firebaseapp.com",
  projectId: "raga-135",
  storageBucket: "raga-135.firebasestorage.app",
  messagingSenderId: "1049179673680",
  appId: "1:1049179673680:web:a772bed112c1cb16656d55"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app