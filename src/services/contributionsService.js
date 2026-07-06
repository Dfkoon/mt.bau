import { db, storage } from '../config/firebase';
import { collection, addDoc, doc, deleteDoc, query, orderBy, serverTimestamp, onSnapshot, updateDoc } from 'firebase/firestore';
import { uploadToCloudinary, validateFile } from './cloudinaryService';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const CONTRIBUTIONS_COLLECTION = 'quizContributions';

// Upload file to Cloudinary and save metadata to Firestore
export const submitContribution = async (file, subjectName = 'General', contributionType = 'unspecified', studentName = 'مساهمة مجهولة', onProgress, onTask) => {
    try {
        // 1. Validate File
        const validation = validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        console.log(`Starting Cloudinary upload for: ${file.name}`);

        // 2. Upload to Cloudinary
        // Note: prefer Cloudinary when configured, otherwise fallback to Firebase Storage
        if (onProgress) onProgress(10); // Start

        let result;
        const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
        if (CLOUD_NAME && CLOUD_NAME !== 'your_cloudinary_cloud_name') {
            try {
                result = await uploadToCloudinary(file, {
                    folder: 'koon-contributions',
                    tags: ['student-contribution', contributionType, subjectName]
                });
            } catch (cloudErr) {
                console.warn('Cloudinary upload failed, falling back to Firebase Storage:', cloudErr);
            }
        }

        // If Cloudinary not used or failed, upload to Firebase Storage
        if (!result) {
            // create storage path
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const path = `contributions/${timestamp}_${safeName}`;
            const sRef = storageRef(storage, path);

            // upload with resumable task
            const uploadTask = uploadBytesResumable(sRef, file);

            if (onTask) onTask(uploadTask);

            result = await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', (snapshot) => {
                    const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    if (onProgress) onProgress(10 + Math.round(prog * 0.8));
                }, (err) => {
                    console.error('Firebase Storage upload error:', err);

                    // Map common Firebase Storage error codes to friendly messages
                    const mapped = new Error('FIREBASE_STORAGE_ERROR');
                    mapped.code = err.code || 'storage/unknown';
                    mapped.remote = err;
                    mapped.friendly = {
                        ar: 'فشل رفع الملف على الخادم. تحقق من صلاحيات التخزين أو حاول لاحقاً.',
                        en: 'File upload failed on server. Check storage permissions or try again.'
                    };

                    if (err.code === 'storage/unauthorized') {
                        mapped.friendly = {
                            ar: 'غير مسموح بالرفع. راجع قواعد Firebase Storage.',
                            en: 'Upload not allowed. Review Firebase Storage rules.'
                        };
                    } else if (err.code === 'storage/canceled') {
                        mapped.friendly = { ar: 'تم إلغاء الرفع.', en: 'Upload canceled.' };
                    } else if (err.code === 'storage/quota-exceeded') {
                        mapped.friendly = { ar: 'نفدت سعة التخزين.', en: 'Storage quota exceeded.' };
                    }

                    return reject(mapped);
                }, async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve({ url, publicId: path, format: file.type, bytes: file.size });
                });
            });
        }

        // 3. Save metadata to Firestore
        console.log(`Saving metadata to Firestore for ${file.name}...`);
        const docRef = await addDoc(collection(db, CONTRIBUTIONS_COLLECTION), {
            subjectName: subjectName,
            studentName: studentName || 'مساهمة مجهولة',
            fileName: file.name,
            fileUrl: result.url,
            publicId: result.publicId,
            fileType: result.format || file.type,
            contributionType: contributionType,
            fileSize: result.bytes || file.size,
            status: 'pending',
            createdAt: serverTimestamp(),
        });

        if (onProgress) onProgress(100); // Done ONLY after both upload & metadata save are complete

        console.log(`Metadata saved for ${file.name}, docId: ${docRef.id}`);
        return { success: true, id: docRef.id, url: result.url };

    } catch (error) {
        console.error('Contribution submission failed:', error);

        // If the thrown error contains friendly/localized messages, include them in the response
        if (error && error.friendly) {
            return { success: false, error: error.code || error.message, messageAr: error.friendly.ar, messageEn: error.friendly.en };
        }

        return { success: false, error: error.message || 'Submission failed' };
    }
};

// Save a link-only contribution to Firestore
export const submitLinkContribution = async (linkUrl, subjectName = 'General', contributionType = 'unspecified', studentName = '') => {
    try {
        const docRef = await addDoc(collection(db, CONTRIBUTIONS_COLLECTION), {
            subjectName: subjectName,
            studentName: studentName || 'مساهمة مجهولة',
            fileUrl: linkUrl, // Use fileUrl field to store the link
            contributionType,
            fileType: 'link', // Explicitly mark as a link
            fileName: 'External Link',
            status: 'pending',
            createdAt: serverTimestamp(),
        });
        return { success: true, id: docRef.id, url: linkUrl };
    } catch (error) {
        console.error('Link contribution failed:', error);
        if (error && error.friendly) {
            return { success: false, error: error.code || error.message, messageAr: error.friendly.ar, messageEn: error.friendly.en };
        }
        return { success: false, error: error.message || 'Link submission failed' };
    }
};

// Subscribe to all contributions (Admin Real-time)
export const subscribeToContributions = (callback) => {
    const q = query(collection(db, CONTRIBUTIONS_COLLECTION), orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const contributions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(contributions);
    }, (error) => {
        console.error('Error in contributions subscription:', error);
        callback([]);
    });
};

// Approve a contribution
export const approveContribution = async (contributionId) => {
    try {
        await updateDoc(doc(db, CONTRIBUTIONS_COLLECTION, contributionId), {
            status: 'approved'
        });
        return { success: true };
    } catch (error) {
        console.error('Error approving contribution:', error);
        return { success: false, error: error.message };
    }
};

// Reject a contribution
export const rejectContribution = async (contributionId, storagePath) => {
    // Rejection for contributions = Deletion from database
    // Note: We are NOT deleting from Cloudinary here automatically to avoid security complexity on client-side.
    // Ideally, a periodic cleanup script or a secure backend endpoint would handle this using the publicId.
    return await deleteContribution(contributionId, storagePath);
};

// Delete a contribution (including its file in Storage - skipping Storage for Cloudinary for now)
export const deleteContribution = async (contributionId, storagePath) => {
    try {
        // 1. Delete from Storage (Skipped for Cloudinary client-side for now)
        // if (storagePath) { ... }

        // 2. Delete from Firestore
        await deleteDoc(doc(db, CONTRIBUTIONS_COLLECTION, contributionId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting contribution:', error);
        return { success: false, error: error.message };
    }
};
