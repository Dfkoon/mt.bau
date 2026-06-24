/**
 * courseStatusService.js - API Reference
 * مرجع كامل لجميع الدوال المتاحة
 */

// ============================================
// 1. SAVING DATA | حفظ البيانات
// ============================================

/**
 * saveCourseBooking(bookingData)
 * حفظ طلب حجز مقرر جديد
 * 
 * @param {Object} bookingData - بيانات الحجز
 * @param {string} bookingData.studentName - اسم الطالب
 * @param {string} bookingData.phoneNumber - رقم الهاتف
 * @param {string} bookingData.courseName - اسم المقرر
 * @param {string} bookingData.courseCode - رمز المقرر (اختياري)
 * @param {string} bookingData.faculty - الكلية (اختياري)
 * @param {string} bookingData.email - البريد الإلكتروني (اختياري)
 * @param {string} bookingData.notes - ملاحظات (اختياري)
 * 
 * @returns {Promise<Object>} { success: boolean, bookingId: string, data: Object }
 * 
 * @example
 * const result = await saveCourseBooking({
 *     studentName: 'أحمد محمد',
 *     phoneNumber: '0790000000',
 *     courseName: 'تحليل 1',
 *     courseCode: 'MATH101',
 *     faculty: 'الهندسة',
 *     email: 'ahmed@bau.edu.jo'
 * });
 * 
 * if (result.success) {
 *     console.log('تم حفظ الحجز:', result.bookingId);
 * }
 */


/**
 * saveCourseDonation(donationData)
 * حفظ طلب تبرع بمواد جديد
 * 
 * @param {Object} donationData - بيانات التبرع
 * @param {string} donationData.donorName - اسم المتبرع
 * @param {string} donationData.phoneNumber - رقم الهاتف
 * @param {Array<string>} donationData.courseNames - أسماء المقررات
 * @param {string} donationData.faculty - الكلية (اختياري)
 * @param {string} donationData.email - البريد الإلكتروني (اختياري)
 * @param {Array<string>} donationData.resourcesOffered - نوع الموارد (اختياري)
 * @param {string} donationData.notes - ملاحظات (اختياري)
 * 
 * @returns {Promise<Object>} { success: boolean, donationId: string, data: Object }
 * 
 * @example
 * const result = await saveCourseDonation({
 *     donorName: 'فاطمة علي',
 *     phoneNumber: '0791111111',
 *     courseNames: ['تحليل 2', 'برمجة 1'],
 *     faculty: 'الهندسة',
 *     email: 'fatima@bau.edu.jo',
 *     resourcesOffered: ['notes', 'summaries', 'exams']
 * });
 * 
 * if (result.success) {
 *     console.log('تم حفظ التبرع:', result.donationId);
 * }
 */

// ============================================
// 2. SEARCHING DATA | البحث عن البيانات
// ============================================

/**
 * searchBookingsByPhone(phoneNumber)
 * البحث عن جميع حجوزات طالب برقم الهاتف
 * 
 * @param {string} phoneNumber - رقم الهاتف
 * 
 * @returns {Promise<Object>} {
 *     success: boolean,
 *     data: Array<Object>,
 *     count: number,
 *     error?: string
 * }
 * 
 * @example
 * const result = await searchBookingsByPhone('0790000000');
 * 
 * if (result.success) {
 *     console.log(`عدد الحجوزات: ${result.count}`);
 *     result.data.forEach(booking => {
 *         console.log(`${booking.courseName} - ${booking.status}`);
 *     });
 * }
 */


/**
 * searchDonationsByPhone(phoneNumber)
 * البحث عن جميع تبرعات المتبرع برقم الهاتف
 * 
 * @param {string} phoneNumber - رقم الهاتف
 * 
 * @returns {Promise<Object>} {
 *     success: boolean,
 *     data: Array<Object>,
 *     count: number,
 *     error?: string
 * }
 * 
 * @example
 * const result = await searchDonationsByPhone('0791111111');
 * 
 * if (result.success) {
 *     result.data.forEach(donation => {
 *         console.log(`المقررات: ${donation.courseNames.join(', ')}`);
 *         console.log(`الحالة: ${donation.status}`);
 *     });
 * }
 */


/**
 * getBookingById(bookingId)
 * الحصول على تفاصيل حجز معين بـ ID
 * 
 * @param {string} bookingId - معرّف الحجز
 * 
 * @returns {Promise<Object>} {
 *     success: boolean,
 *     data: Object,
 *     error?: string
 * }
 * 
 * @example
 * const result = await getBookingById('booking-123');
 * 
 * if (result.success) {
 *     console.log('اسم الطالب:', result.data.studentName);
 *     console.log('الحالة:', result.data.status);
 * }
 */

// ============================================
// 3. UPDATING STATUS | تحديث الحالات
// ============================================

/**
 * updateBookingStatus(bookingId, status, approverInfo)
 * تحديث حالة الحجز (للإداريين فقط)
 * 
 * @param {string} bookingId - معرّف الحجز
 * @param {string} status - الحالة الجديدة: 'approved' | 'rejected' | 'pending'
 * @param {Object} approverInfo - معلومات المراجع (اختياري)
 * @param {string} approverInfo.name - اسم المراجع
 * @param {string} approverInfo.notes - ملاحظات المراجعة
 * 
 * @returns {Promise<Object>} {
 *     success: boolean,
 *     message: string,
 *     error?: string
 * }
 * 
 * @example
 * const result = await updateBookingStatus('booking-123', 'approved', {
 *     name: 'أم التطبيقات',
 *     notes: 'تم التحقق والموافقة بناءً على معايير الجودة'
 * });
 * 
 * if (result.success) {
 *     toast.success('تم تحديث الحالة');
 * }
 */


/**
 * updateDonationStatus(donationId, status, approverInfo)
 * تحديث حالة التبرع (للإداريين فقط)
 * 
 * @param {string} donationId - معرّف التبرع
 * @param {string} status - الحالة الجديدة: 'approved' | 'rejected' | 'pending'
 * @param {Object} approverInfo - معلومات المراجع (اختياري)
 * @param {string} approverInfo.name - اسم المراجع
 * @param {string} approverInfo.notes - ملاحظات المراجعة
 * 
 * @returns {Promise<Object>} {
 *     success: boolean,
 *     message: string,
 *     error?: string
 * }
 * 
 * @example
 * const result = await updateDonationStatus('donation-456', 'rejected', {
 *     name: 'أم التطبيقات',
 *     notes: 'لا يتوافق مع معايير الجودة'
 * });
 * 
 * if (result.success) {
 *     console.log('تم رفض التبرع');
 * }
 */

// ============================================
// 4. ADMIN OPERATIONS | عمليات الإدارة
// ============================================

/**
 * getPendingBookings()
 * الحصول على جميع الحجوزات المعلقة (للإداريين)
 * 
 * @returns {Promise<Object>} {
 *     success: boolean,
 *     data: Array<Object>,
 *     count: number,
 *     error?: string
 * }
 * 
 * @example
 * const result = await getPendingBookings();
 * 
 * if (result.success) {
 *     console.log(`عدد الطلبات المعلقة: ${result.count}`);
 *     result.data.forEach(booking => {
 *         console.log(`${booking.studentName}: ${booking.courseName}`);
 *     });
 * }
 */


/**
 * getPendingDonations()
 * الحصول على جميع التبرعات المعلقة (للإداريين)
 * 
 * @returns {Promise<Object>} {
 *     success: boolean,
 *     data: Array<Object>,
 *     count: number,
 *     error?: string
 * }
 * 
 * @example
 * const result = await getPendingDonations();
 * 
 * if (result.success) {
 *     console.log(`عدد التبرعات المعلقة: ${result.count}`);
 * }
 */

// ============================================
// 5. ERROR HANDLING | معالجة الأخطاء
// ============================================

/**
 * أمثلة على معالجة الأخطاء:
 * 
 * محاولة 1: Using try-catch
 * ================================
 */
async function example1() {
    try {
        const result = await saveCourseBooking({
            studentName: 'أحمد',
            phoneNumber: '0790000000',
            courseName: 'تحليل 1'
        });

        if (!result.success) {
            console.error('خطأ:', result.error);
            toast.error('فشل حفظ الطلب');
            return;
        }

        console.log('تم الحفظ بنجاح');
        toast.success('تم حفظ الطلب');
    } catch (error) {
        console.error('خطأ غير متوقع:', error);
        toast.error('حدث خطأ غير متوقع');
    }
}

/**
 * محاولة 2: Using .then().catch()
 * ================================
 */
function example2() {
    saveCourseBooking({
        studentName: 'أحمد',
        phoneNumber: '0790000000',
        courseName: 'تحليل 1'
    })
        .then(result => {
            if (result.success) {
                toast.success('تم حفظ الطلب');
            } else {
                toast.error(result.error);
            }
        })
        .catch(error => {
            console.error('خطأ:', error);
            toast.error('حدث خطأ');
        });
}

// ============================================
// 6. RESPONSE FORMATS | صيغ الاستجابات
// ============================================

/**
 * استجابة ناجحة (Search):
 * {
 *     success: true,
 *     data: [
 *         {
 *             id: "abc123",
 *             studentName: "أحمد",
 *             phoneNumber: "0790000000",
 *             courseName: "تحليل 1",
 *             status: "pending",
 *             submittedAt: Date,
 *             approvedAt: null,
 *             ...
 *         }
 *     ],
 *     count: 3
 * }
 */

/**
 * استجابة فاشلة:
 * {
 *     success: false,
 *     data: [],
 *     error: "خطأ في الاتصال بقاعدة البيانات",
 *     count: 0
 * }
 */

// ============================================
// 7. STATUS VALUES | قيم الحالات
// ============================================

const STATUS = {
    PENDING: 'pending',      // قيد الانتظار
    APPROVED: 'approved',    // موافق عليه
    REJECTED: 'rejected'     // مرفوض
};

/**
 * الاستخدام:
 * await updateBookingStatus(id, STATUS.APPROVED);
 */

// ============================================
// 8. PRACTICAL EXAMPLES | أمثلة عملية
// ============================================

/**
 * مثال 1: حفظ وتتبع طلب
 */
async function exampleSaveAndTrack() {
    // 1. حفظ الطلب
    const saveResult = await saveCourseBooking({
        studentName: 'أحمد محمد',
        phoneNumber: '0790000000',
        courseName: 'تحليل 1',
        faculty: 'الهندسة'
    });

    if (!saveResult.success) {
        console.error('فشل الحفظ');
        return;
    }

    console.log('تم حفظ الطلب:', saveResult.bookingId);

    // 2. البحث بنفس الرقم
    const searchResult = await searchBookingsByPhone('0790000000');

    if (searchResult.success) {
        console.log('عدد الطلبات:', searchResult.count);
        searchResult.data.forEach(booking => {
            console.log(`${booking.courseName} - ${booking.status}`);
        });
    }
}

/**
 * مثال 2: منطق الإدارة
 */
async function exampleAdminApproval() {
    // الحصول على الطلبات المعلقة
    const pending = await getPendingBookings();

    if (!pending.success || pending.count === 0) {
        console.log('لا توجد طلبات معلقة');
        return;
    }

    // معالجة أول طلب
    const firstBooking = pending.data[0];

    // الموافقة عليه
    const result = await updateBookingStatus(
        firstBooking.id,
        'approved',
        {
            name: 'أم التطبيقات',
            notes: 'تم التحقق والموافقة'
        }
    );

    if (result.success) {
        console.log('تم الموافقة على الطلب');
    }
}

/**
 * مثال 3: تصفية البيانات
 */
async function exampleFiltering() {
    const result = await searchBookingsByPhone('0790000000');

    if (!result.success) return;

    // تصفية الحجوزات الموافق عليها
    const approved = result.data.filter(b => b.status === 'approved');
    console.log('عدد الحجوزات الموافق عليها:', approved.length);

    // تصفية الحجوزات المعلقة
    const pending = result.data.filter(b => b.status === 'pending');
    console.log('عدد الحجوزات المعلقة:', pending.length);

    // تصفية المقررات معينة
    const mathBookings = result.data.filter(b => b.courseName.includes('تحليل'));
    console.log('حجوزات مقررات التحليل:', mathBookings.length);
}

// ============================================
// 9. TIPS & TRICKS | نصائح وحيل
// ============================================

/**
 * ✅ الممارسات الجيدة:
 * 
 * 1. تحقق دائماً من result.success
 *    if (!result.success) { ... }
 * 
 * 2. معالجة الأخطاء بشكل صحيح
 *    try { ... } catch (error) { ... }
 * 
 * 3. أظهر رسائل واضحة للمستخدم
 *    toast.success() / toast.error()
 * 
 * 4. احفظ البيانات محلياً أثناء الانتظار
 *    localStorage.setItem('lastBooking', JSON.stringify(data))
 * 
 * 5. استخدم setState بشكل صحيح
 *    setLoading(true); ... setLoading(false);
 */

/**
 * ❌ ما يجب تجنبه:
 * 
 * 1. لا تتجاهل الأخطاء
 * 2. لا تخزن بيانات حساسة في localStorage
 * 3. لا تسمح بتعديل الحالة من الواجهة العامة
 * 4. لا تنسَ إغلاق النماذج بعد النجاح
 * 5. لا تفترض أن الاتصال سيكون سريعاً دائماً
 */

export {
    // تصدير جميع الدوال
    saveCourseBooking,
    saveCourseDonation,
    searchBookingsByPhone,
    searchDonationsByPhone,
    getBookingById,
    updateBookingStatus,
    updateDonationStatus,
    getPendingBookings,
    getPendingDonations
};
