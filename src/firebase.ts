import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCtrOS3qKdOrqhQSPLNbxFG_ZIH5H22cXs",
    authDomain: "assignment5-f081b.firebaseapp.com",
    projectId: "assignment5-f081b",
    storageBucket: "assignment5-f081b.firebasestorage.app",
    messagingSenderId: "275732253661",
    appId: "1:275732253661:web:00969d6fd35aceb2f88434"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
