/**
 * Cloudinary Upload Service
 * Handles file uploads to Cloudinary for student contributions
 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
const PLACEHOLDER_CLOUD_NAME = 'your_cloudinary_cloud_name';
const PLACEHOLDER_UPLOAD_PRESET = 'your_upload_preset';

/**
 * Upload a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with URL and public_id
 */
export const uploadToCloudinary = async (file, options = {}) => {
    if (!CLOUD_NAME || CLOUD_NAME === PLACEHOLDER_CLOUD_NAME) {
        const err = new Error('CLOUDINARY_CONFIG_MISSING');
        err.code = 'CLOUDINARY_CONFIG_MISSING';
        err.friendly = {
            ar: 'إعدادات Cloudinary غير مضبوطة على الخادم. تواصل مع الإدارة.',
            en: 'Cloudinary settings are not configured. Contact the admin.'
        };
        throw err;
    }
    if (!UPLOAD_PRESET || UPLOAD_PRESET === PLACEHOLDER_UPLOAD_PRESET) {
        const err = new Error('CLOUDINARY_PRESET_MISSING');
        err.code = 'CLOUDINARY_PRESET_MISSING';
        err.friendly = {
            ar: 'قالب التحميل (upload preset) غير مضبوط. تواصل مع الدعم.',
            en: 'Upload preset is not configured. Contact support.'
        };
        throw err;
    }

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        if (options.folder) formData.append('folder', options.folder);
        if (options.tags) formData.append('tags', options.tags.join(','));

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, { method: 'POST', body: formData });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Cloudinary API Error:', errorData || response.statusText);

            // Try to map common Cloudinary messages to friendly/localized messages
            const remoteMsg = errorData?.error?.message || response.statusText || 'Upload failed';

            const err = new Error('CLOUDINARY_UPLOAD_ERROR');
            err.code = 'CLOUDINARY_UPLOAD_ERROR';
            if (/unknown api key/i.test(remoteMsg) || /invalid api key/i.test(remoteMsg)) {
                err.friendly = {
                    ar: 'مفتاح Cloudinary غير صحيح أو غير معروف. تحقق من إعدادات البيئة.',
                    en: 'Cloudinary API key is invalid or unknown. Check your environment settings.'
                };
                err.remote = remoteMsg;
                throw err;
            }

            if (/upload preset/i.test(remoteMsg) || /invalid preset/i.test(remoteMsg)) {
                err.friendly = {
                    ar: 'قالب التحميل غير صحيح أو غير موجود. تحقق من `VITE_CLOUDINARY_UPLOAD_PRESET`.',
                    en: 'Upload preset is invalid or missing. Check `VITE_CLOUDINARY_UPLOAD_PRESET`.'
                };
                err.remote = remoteMsg;
                throw err;
            }

            // Generic fallback
            err.friendly = {
                ar: `فشل رفع الملف: ${remoteMsg}`,
                en: `File upload failed: ${remoteMsg}`
            };
            err.remote = remoteMsg;
            throw err;
        }

        const data = await response.json();
        return {
            url: data.secure_url,
            publicId: data.public_id,
            format: data.format,
            resourceType: data.resource_type,
            bytes: data.bytes
        };
    } catch (error) {
        console.error('Cloudinary Service Error:', error);
        throw error;
    }
};

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
    const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

    const errors = [];

    if (file.size > maxSize) {
        errors.push(`حجم الملف يجب أن يكون أقل من ${maxSize / 1024 / 1024} ميجابايت`);
    }

    if (!allowedTypes.includes(file.type)) {
        errors.push(`نوع الملف يجب أن يكون: صورة أو PDF`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

export default {
    uploadToCloudinary,
    validateFile
};
