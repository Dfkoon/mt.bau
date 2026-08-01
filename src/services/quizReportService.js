import { db } from '../config/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const REPORTS_COLLECTION = 'question_reports';

/**
 * Submits a report for a specific quiz question to Firestore.
 * @param {Object} reportData - The data to store
 */
export const submitQuestionReport = async (reportData) => {
    try {
        const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
            ...reportData,
            text: `Report: [${reportData.quizId}] ${reportData.questionAr || reportData.questionEn}`, // Required by firestore.rules validation
            studentNote: (reportData.studentNote || '').trim(),
            status: 'pending',
            createdAt: serverTimestamp(),
        });
        console.log('Question report submitted with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error reporting question:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Updates the student note for an existing question report in Firestore.
 * @param {string} reportId - The Firestore document ID
 * @param {string} noteText - The note text to update
 */
export const updateQuestionReportNote = async (reportId, noteText) => {
    try {
        if (!reportId) return { success: false, error: 'No reportId provided' };
        const reportRef = doc(db, REPORTS_COLLECTION, reportId);
        await updateDoc(reportRef, {
            studentNote: (noteText || '').trim(),
            updatedAt: serverTimestamp()
        });
        console.log('Question report note updated for ID:', reportId);
        return { success: true };
    } catch (error) {
        console.error('Error updating question report note:', error);
        return { success: false, error: error.message };
    }
};
