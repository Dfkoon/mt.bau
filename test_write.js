import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCwEYy_wNXXmvq_jDHD-8xvD90ZEVUwHVA",
    authDomain: "koon-609da.firebaseapp.com",
    projectId: "koon-609da",
    storageBucket: "koon-609da.firebasestorage.app",
    messagingSenderId: "999499144055",
    appId: "1:999499144055:web:de58d0ab0b1dcc11b05f72"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    console.log("Testing write to campaignArchives...");
    const docRef = await addDoc(collection(db, 'campaignArchives'), { test: "hello", time: new Date() });
    console.log("Write successful! Doc ID:", docRef.id);
}

run().catch(console.error);
