/**
 * مثال: كيفية دمج نظام فحص حالة المقررات
 * Example: How to integrate Course Status Checker System
 */

// ============================================
// 1️⃣ الخطوة الأولى: استيراد المكونات والخدمات
// ============================================

import React, { useState } from 'react';
import CourseStatusChecker from '../components/CourseStatusChecker';
import { saveCourseBooking, saveCourseDonation } from '../services/courseStatusService';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

// ============================================
// 2️⃣ الخطوة الثانية: مثال لصفحة الحجز
// ============================================

export const BookingFormExample = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [isStatusCheckerOpen, setIsStatusCheckerOpen] = useState(false);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        
        const bookingData = {
            studentName: e.target.name.value,
            phoneNumber: e.target.phone.value,
            courseName: e.target.course.value,
            courseCode: e.target.code.value,
            faculty: e.target.faculty.value,
            email: e.target.email.value
        };

        // حفظ الحجز في Firestore
        const result = await saveCourseBooking(bookingData);
        
        if (result.success) {
            toast.success(isAr ? 'تم حفظ الحجز بنجاح' : 'Booking saved successfully');
            e.target.reset();
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="booking-form-container">
            <h2>{isAr ? 'حجز مادة' : 'Book a Course'}</h2>
            
            <form onSubmit={handleBookingSubmit}>
                <input 
                    name="name" 
                    placeholder={isAr ? 'اسمك' : 'Your name'}
                    required 
                />
                <input 
                    name="phone" 
                    type="tel"
                    placeholder={isAr ? 'رقم هاتفك' : 'Your phone'}
                    required 
                />
                <input 
                    name="course"
                    placeholder={isAr ? 'اسم المقرر' : 'Course name'}
                    required 
                />
                <input 
                    name="code"
                    placeholder={isAr ? 'رمز المقرر' : 'Course code'}
                />
                <input 
                    name="faculty"
                    placeholder={isAr ? 'الكلية' : 'Faculty'}
                />
                <input 
                    name="email" 
                    type="email"
                    placeholder={isAr ? 'بريدك الإلكتروني' : 'Your email'}
                />
                <button type="submit">{isAr ? 'حفظ الحجز' : 'Save Booking'}</button>
            </form>

            {/* زر للفحص عن حالة الحجزات السابقة */}
            <button onClick={() => setIsStatusCheckerOpen(true)}>
                📊 {isAr ? 'فحص حالة حجوزاتي' : 'Check My Bookings'}
            </button>

            {/* مكون الفحص */}
            <CourseStatusChecker 
                isOpen={isStatusCheckerOpen}
                onClose={() => setIsStatusCheckerOpen(false)}
            />
        </div>
    );
};

// ============================================
// 3️⃣ الخطوة الثالثة: مثال لصفحة التبرع
// ============================================

export const DonationFormExample = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [isStatusCheckerOpen, setIsStatusCheckerOpen] = useState(false);

    const handleDonationSubmit = async (e) => {
        e.preventDefault();
        
        const courseList = e.target.courses.value.split(',').map(c => c.trim());
        const resourcesList = Array.from(e.target.querySelectorAll('input[name="resources"]:checked'))
            .map(r => r.value);

        const donationData = {
            donorName: e.target.name.value,
            phoneNumber: e.target.phone.value,
            courseNames: courseList,
            faculty: e.target.faculty.value,
            email: e.target.email.value,
            resourcesOffered: resourcesList
        };

        // حفظ التبرع في Firestore
        const result = await saveCourseDonation(donationData);
        
        if (result.success) {
            toast.success(isAr ? 'تم حفظ التبرع بنجاح' : 'Donation saved successfully');
            e.target.reset();
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="donation-form-container">
            <h2>{isAr ? 'التبرع بمواد' : 'Donate Materials'}</h2>
            
            <form onSubmit={handleDonationSubmit}>
                <input 
                    name="name" 
                    placeholder={isAr ? 'اسمك' : 'Your name'}
                    required 
                />
                <input 
                    name="phone" 
                    type="tel"
                    placeholder={isAr ? 'رقم هاتفك' : 'Your phone'}
                    required 
                />
                <textarea 
                    name="courses"
                    placeholder={isAr ? 'أسماء المقررات (مفصولة بفواصل)' : 'Course names (comma separated)'}
                    required 
                />
                <input 
                    name="faculty"
                    placeholder={isAr ? 'الكلية' : 'Faculty'}
                />
                <input 
                    name="email" 
                    type="email"
                    placeholder={isAr ? 'بريدك الإلكتروني' : 'Your email'}
                />

                {/* الموارد المقدمة */}
                <fieldset>
                    <legend>{isAr ? 'الموارد المقدمة' : 'Resources Offered'}</legend>
                    <label>
                        <input type="checkbox" name="resources" value="notes" />
                        {isAr ? 'ملاحظات' : 'Notes'}
                    </label>
                    <label>
                        <input type="checkbox" name="resources" value="summaries" />
                        {isAr ? 'ملخصات' : 'Summaries'}
                    </label>
                    <label>
                        <input type="checkbox" name="resources" value="exams" />
                        {isAr ? 'أسئلة امتحانات' : 'Past Exams'}
                    </label>
                    <label>
                        <input type="checkbox" name="resources" value="solutions" />
                        {isAr ? 'حلول' : 'Solutions'}
                    </label>
                </fieldset>

                <button type="submit">{isAr ? 'حفظ التبرع' : 'Save Donation'}</button>
            </form>

            {/* زر للفحص عن حالة التبرعات السابقة */}
            <button onClick={() => setIsStatusCheckerOpen(true)}>
                📊 {isAr ? 'فحص حالة تبرعاتي' : 'Check My Donations'}
            </button>

            <CourseStatusChecker 
                isOpen={isStatusCheckerOpen}
                onClose={() => setIsStatusCheckerOpen(false)}
            />
        </div>
    );
};

// ============================================
// 4️⃣ الخطوة الرابعة: مثال لـ Navbar مع زر الفحص
// ============================================

export const NavbarWithStatusChecker = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [isStatusCheckerOpen, setIsStatusCheckerOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="nav-links">
                {/* الروابط الأخرى */}
                <a href="/">{isAr ? 'الرئيسية' : 'Home'}</a>
                <a href="/plans">{isAr ? 'الخطط' : 'Plans'}</a>
            </div>

            <div className="nav-actions">
                <button 
                    className="status-check-btn"
                    onClick={() => setIsStatusCheckerOpen(true)}
                    title={isAr ? 'فحص حالة طلباتك' : 'Check your requests status'}
                >
                    📊 {isAr ? 'فحص الحالة' : 'Check Status'}
                </button>
            </div>

            <CourseStatusChecker 
                isOpen={isStatusCheckerOpen}
                onClose={() => setIsStatusCheckerOpen(false)}
            />
        </nav>
    );
};

// ============================================
// 5️⃣ الخطوة الخامسة: صفحة الإدارة
// ============================================

import AdminCourseStatusManager from '../components/AdminCourseStatusManager';

export const AdminDashboardPage = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    return (
        <div className="admin-dashboard">
            <div className="page-header">
                <h1>{isAr ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}</h1>
            </div>

            <section className="admin-section">
                <AdminCourseStatusManager />
            </section>
        </div>
    );
};

// ============================================
// 6️⃣ أمثلة على استدعاءات الخدمة
// ============================================

/**
 * مثال: البحث عن حالة الحجوزات
 */
export const searchExample = async () => {
    import { searchBookingsByPhone } from '../services/courseStatusService';
    
    const result = await searchBookingsByPhone('0790000000');
    
    if (result.success) {
        console.log('الحجوزات:', result.data);
        // result.data = [
        //     {
        //         id: 'booking123',
        //         studentName: 'أحمد',
        //         courseName: 'تحليل 1',
        //         status: 'pending',
        //         ...
        //     }
        // ]
    }
};

/**
 * مثال: البحث عن حالة التبرعات
 */
export const searchDonationsExample = async () => {
    import { searchDonationsByPhone } from '../services/courseStatusService';
    
    const result = await searchDonationsByPhone('0791111111');
    
    if (result.success) {
        console.log('التبرعات:', result.data);
        // result.data = [
        //     {
        //         id: 'donation456',
        //         donorName: 'فاطمة',
        //         courseNames: ['تحليل 2', 'برمجة 1'],
        //         status: 'approved',
        //         ...
        //     }
        // ]
    }
};

/**
 * مثال: تحديث حالة الحجز (للإداريين)
 */
export const updateBookingExample = async () => {
    import { updateBookingStatus } from '../services/courseStatusService';
    
    const result = await updateBookingStatus('booking123', 'approved', {
        name: 'أم التطبيقات',
        notes: 'تم التحقق والموافقة'
    });
    
    if (result.success) {
        console.log('تم تحديث الحالة');
    }
};

// ============================================
// 7️⃣ نصائح مهمة
// ============================================

/*
✅ نصائح للاستخدام الصحيح:

1. تأكد من استيراد الخدمة والمكونات بشكل صحيح
2. استخدم try-catch عند استدعاء الدوال غير المتزامنة
3. أظهر رسائل توضيحية للمستخدم (toast notifications)
4. احفظ بيانات المستخدم محلياً أثناء الانتظار

⚠️ تحذيرات:

1. ❌ لا تخزن بيانات حساسة في localStorage
2. ❌ لا تسمح بتحديث الحالة من صفحة الطالب
3. ❌ تأكد من التحقق من صلاحيات المستخدم
4. ❌ لا تنسَ معالجة الأخطاء

🔐 الأمان:

1. استخدم Firebase Authentication
2. فعّل قواعد الأمان في Firestore
3. حافظ على مفاتيح Firebase آمنة في .env
4. قيّد وصول الإدارة بالتحقق من الدور
*/
