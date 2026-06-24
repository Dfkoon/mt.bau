import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getUserProfile } from '../utils/exchangeLocalStorage';

/**
 * Log a generic page view or user interaction to Firestore.
 * @param {string} path - The URL path or action category
 * @param {Object} details - Additional metadata to record
 */
export const logPageView = async (path, details = {}) => {
    try {
        const profile = getUserProfile();
        
        // Simple safety check: don't flood Firestore in case of infinite loops
        // Only log if path is valid
        if (!path) return;

        // Skip logging if the user is authenticated admin to keep stats clean
        let isAdmin = false;
        try {
            const saved = sessionStorage.getItem('exchange_staff');
            if (saved) {
                const user = JSON.parse(saved);
                if (user?.role === 'admin') {
                    isAdmin = true;
                }
            }
        } catch (e) {
            // Ignore sessionStorage errors
        }

        if (isAdmin) return;

        const viewData = {
            path,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            language: localStorage.getItem('language') || 'ar',
            studentName: profile?.name || 'Guest',
            studentPhone: profile?.phone || '',
            type: details.type || 'visit',
            ...details
        };

        await addDoc(collection(db, 'page_views'), viewData);
    } catch (error) {
        console.error('Error logging page view:', error);
    }
};

/**
 * Log when a student clicks on/downloads a study material.
 * @param {string} courseName - The name of the course
 * @param {string} materialName - The name of the material
 */
export const logMaterialDownload = async (courseName, materialName) => {
    return logPageView('/materials/click', {
        type: 'material_view',
        courseName,
        materialName
    });
};

/**
 * Log when a student successfully completes a quiz attempt.
 * @param {string} quizId - The identifier of the quiz
 * @param {string} quizTitle - The title of the quiz
 * @param {string} score - The final grade achieved (e.g. "8/10")
 */
export const logQuizCompletion = async (quizId, quizTitle, score) => {
    return logPageView('/quiz/complete', {
        type: 'quiz_completed',
        quizId,
        quizTitle,
        score
    });
};
