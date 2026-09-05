import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCwEYy_wNXXmvq_jDHD-8xvD9OZEVUwHVA",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "koon-609da.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "koon-609da",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "koon-609da.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "999499144055",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:999499144055:web:de58d0ab0b1dcc11b05f72",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5G25S6VXNR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

let analytics = null;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        // Only initialize Analytics in production and when a real API key is provided.
        // This avoids "INVALID_ARGUMENT: API key not valid" errors during local dev when
        // the default/hardcoded API key is not valid for this environment.
        const isProd = Boolean(import.meta.env.PROD);
        const hasApiKey = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

        if (supported && isProd && firebaseConfig.measurementId && hasApiKey) {
            try {
                analytics = getAnalytics(app);
            } catch (err) {
                console.warn("Firebase Analytics skipped:", err?.message || err);
            }
        } else {
            // Skip analytics in development or when API key is not set/valid.
            // console.debug("Firebase Analytics not initialized (dev mode or missing API key)");
        }
    }).catch((err) => {
        console.warn("Firebase Analytics check failed:", err?.message || err);
    });
}

export { db, storage, auth, analytics };
