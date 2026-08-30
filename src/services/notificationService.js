import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Sends a real-time notification to the admin panel by writing to Firestore.
 *
 * @param {string} type    - Notification type, e.g. 'new_donation', 'new_booking', 'new_application'
 * @param {string} title   - Short title shown in the notification bell (Arabic)
 * @param {string} message - Detailed message body (Arabic)
 * @param {object} data    - Extra payload (e.g. studentName, phone, materialName …)
 */
export async function sendAdminNotification(type, title, message, data = {}) {
    try {
        await addDoc(collection(db, 'adminNotifications'), {
            type,
            title,
            message,
            data,
            read: false,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        // Non-critical — never block the main flow
        console.warn('[notificationService] Failed to send admin notification:', error);
    }
}
