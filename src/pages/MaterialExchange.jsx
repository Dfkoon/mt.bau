import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import exchangeHero from '../assets/heros/exchange_hero.png';
import { sendDonationToSheets, sendBookingToSheets } from '../services/googleSheetsService';
import './MaterialExchange.css';

const BOOKING_START_TIME = new Date('2026-02-15T09:00:00');

const MaterialExchange = () => {
    const { language, t } = useLanguage();
    const isAr = language === 'ar';
    const [formData, setFormData] = useState({
        studentName: '',
        phoneNumber: '',
        email: '',
        materials: []
    });
    const [currentMaterial, setCurrentMaterial] = useState({ name: '', description: '' });

    // Restore missing state
    const [allMaterials, setAllMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    
    // System Settings from Firebase
    const [systemSettings, setSystemSettings] = useState({
        isExchangeActive: false,
        exchangeSuspendedMessageAr: 'تفتح الحملة أبوابها مع بداية كل فصل دراسي جديد تزامناً مع فترة السحب والإضافة.',
        exchangeSuspendedMessageEn: 'It resumes at the start of each new semester during the add and drop period.'
    });
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(new Date() >= BOOKING_START_TIME);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = BOOKING_START_TIME - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
                setBookingOpen(false);
            } else {
                setBookingOpen(true);
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Initial call
        return () => clearInterval(timer);
    }, []);

    // Booking Modal State
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [bookingData, setBookingData] = useState({
        name: '',
        phone: ''
    });

    const toEnglishNumerals = (str) => {
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        const englishNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        let result = str;
        arabicNumerals.forEach((arabic, index) => {
            result = result.replace(new RegExp(arabic, 'g'), englishNumerals[index]);
        });
        return result;
    };

    // Load donations from Firebase (only approved ones for public view)
    const fetchDonations = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'materialDonations'),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const donationsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const materialsList = donationsData.flatMap(donation => {
                const materials = donation.materials || (donation.itemName ? [donation.itemName] : []);
                return materials.map((m, idx) => {
                    const materialObj = typeof m === 'object' && m !== null ? m : { name: m, status: donation.status };
                    if (!materialObj.status) materialObj.status = donation.status;

                    // Only show items that are NOT deleted and NOT completed
                    // Show pending and approved items as available
                    return {
                        ...donation,
                        materialItem: materialObj,
                        originalIndex: idx,
                        uniqueKey: `${donation.id}-${idx}`,
                        materialName: materialObj.name,
                        isReserved: materialObj.status === 'reserved' || materialObj.status === 'completed'
                    };
                });
            });

            setAllMaterials(materialsList);
        } catch (error) {
            console.error('Error fetching donations:', error);
            if (error.code === 'permission-denied') {
                toast.error(language === 'ar' ? 'خطأ في الصلاحيات: يرجى التحقق من قواعد البيانات' : 'Permission Error: Check Firestore Rules');
            } else {
                toast.error(language === 'ar' ? 'فشل في تحميل البيانات' : 'Failed to fetch donations');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settingsRef = doc(db, 'system_configs', 'global_settings');
                const docSnap = await getDoc(settingsRef);
                if (docSnap.exists()) {
                    setSystemSettings({
                        // Force false until campaign starts (requested by user). To restore firebase control, use: docSnap.data().isExchangeActive ?? false
                        isExchangeActive: false,
                        exchangeSuspendedMessageAr: docSnap.data().exchangeSuspendedMessageAr || 'تفتح الحملة أبوابها مع بداية كل فصل دراسي جديد تزامناً مع فترة السحب والإضافة.',
                        exchangeSuspendedMessageEn: docSnap.data().exchangeSuspendedMessageEn || 'It resumes at the start of each new semester during the add and drop period.'
                    });
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setSettingsLoaded(true);
            }
        };

        fetchSettings();
        fetchDonations();
    }, []);

    const availableMaterials = allMaterials.filter(m => !m.isReserved && ['approved', 'pending'].includes(m.materialItem.status));
    const reservedMaterials = allMaterials.filter(m => m.materialItem.status === 'reserved');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Convert Arabic numerals to English for phone number
        if (name === 'phoneNumber') {
            setFormData(prev => ({
                ...prev,
                [name]: toEnglishNumerals(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddMaterial = () => {
        if (currentMaterial.name.trim()) {
            setFormData(prev => ({
                ...prev,
                materials: [...prev.materials, {
                    name: currentMaterial.name.trim(),
                    description: currentMaterial.description.trim() || ''
                }]
            }));
            setCurrentMaterial({ name: '', description: '' });
        }
    };

    const handleRemoveMaterial = (index) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.studentName.trim() || !formData.phoneNumber.trim() || formData.materials.length === 0) {
            toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول وإضافة مادة واحدة على الأقل' : 'Please fill all fields and add at least one material');
            return;
        }

        const nameParts = formData.studentName.trim().split(/\s+/);
        if (nameParts.length < 2) {
            toast.error(language === 'ar' ? 'يرجى إدخال الاسم الثنائي على الأقل' : 'Please enter at least your first and last name');
            return;
        }

        // التحقق من رقم الهاتف: يجب أن يكون 10 خانات بالضبط
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            toast.error(language === 'ar' ? 'يجب أن يتكون رقم الهاتف من 10 خانات بالضبط (مثال: 0790000000)' : 'Phone number must be exactly 10 digits (e.g. 0790000000)');
            return;
        }

        if (!agreedToTerms) {
            toast.error(language === 'ar' ? 'يرجى الموافقة على الشروط والأحكام' : 'Please agree to the terms and conditions');
            return;
        }

        setLoading(true);

        try {
            // Store materials as objects to support reservation status and description
            const materialsObjects = formData.materials.map(m => ({
                name: typeof m === 'string' ? m.trim() : m.name,
                description: typeof m === 'object' ? m.description : '',
                status: 'pending'
            }));

            await addDoc(collection(db, 'materialDonations'), {
                studentName: formData.studentName.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                email: formData.email?.trim() || null,
                materials: materialsObjects,
                createdAt: serverTimestamp(),
                status: 'pending' // Set to pending for admin review
            });

            // Send to Google Sheets as backup
            sendDonationToSheets({
                studentName: formData.studentName.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                email: formData.email?.trim() || '',
                materials: formData.materials,
                status: 'pending'
            }).catch(err => console.warn('Google Sheets backup failed:', err));

            toast.success(language === 'ar' ? 'تم استلام طلب التبرع بنجاح! سيتم مراجعته من قبل المسؤولين' : 'Donation request received! It will be reviewed by admins');

            setFormData({ studentName: '', phoneNumber: '', email: '', materials: [] });
            setCurrentMaterial('');
            setAgreedToTerms(false);

            // Refresh the materials list to show the new donation immediately
            fetchDonations();

        } catch (error) {
            console.error('Error adding donation:', error);
            toast.error(language === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again');
        } finally {
            setLoading(false);
        }
    };

    const openBookingModal = (material) => {
        if (!systemSettings.isExchangeActive) {
            toast(
                (t) => (
                    <div className="suspension-alert">
                        <p>{isAr ? systemSettings.exchangeSuspendedMessageAr : systemSettings.exchangeSuspendedMessageEn}</p>
                    </div>
                ),
                {
                    duration: 6000,
                    position: 'top-center',
                    style: {
                        background: '#fff3cd',
                        color: '#856404',
                        border: '1px solid #ffeeba',
                        padding: '16px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        textAlign: 'center'
                    }
                }
            );
            return;
        }
        if (!bookingOpen) {
            toast.error(language === 'ar' ? 'عذراً، حجز المواد لم يبدأ بعد' : 'Sorry, material booking has not started yet');
            return;
        }
        setSelectedMaterial(material);
        setShowBookingModal(true);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (bookingData.name.trim().split(/\s+/).length < 2) {
            toast.error(language === 'ar' ? 'يرجى إدخال الاسم الثنائي على الأقل' : 'Please enter at least two parts of your name');
            return;
        }

        setLoading(true);
        try {
            const { doc, runTransaction } = await import('firebase/firestore');
            const donationRef = doc(db, 'materialDonations', selectedMaterial.id);

            await runTransaction(db, async (transaction) => {
                const donationDoc = await transaction.get(donationRef);
                if (!donationDoc.exists()) {
                    throw new Error("Document does not exist!");
                }

                const currentData = donationDoc.data();
                const materials = currentData.materials || [];
                const updatedMaterials = [...materials];

                // Check if the specific material is still available
                const materialToUpdate = updatedMaterials[selectedMaterial.originalIndex];
                if (!materialToUpdate) {
                    throw new Error("Material not found in donation record.");
                }

                // If already reserved, abort
                const normalizedStatus = typeof materialToUpdate === 'object' ? materialToUpdate.status : currentData.status;
                if (normalizedStatus === 'reserved' || normalizedStatus === 'completed') {
                    throw new Error("ALREADY_RESERVED");
                }

                // Update specific material in the array
                if (typeof updatedMaterials[selectedMaterial.originalIndex] !== 'object') {
                    updatedMaterials[selectedMaterial.originalIndex] = {
                        name: updatedMaterials[selectedMaterial.originalIndex],
                        status: 'reserved'
                    };
                } else {
                    updatedMaterials[selectedMaterial.originalIndex] = {
                        ...materialToUpdate,
                        status: 'reserved'
                    };
                }

                // Add taker info
                updatedMaterials[selectedMaterial.originalIndex].takerInfo = {
                    name: bookingData.name.trim(),
                    phone: bookingData.phone.trim(),
                    email: bookingData.email?.trim() || '',
                    bookedAt: new Date()
                };

                // Check if ALL materials are now reserved
                const allReserved = updatedMaterials.every(m => {
                    const status = typeof m === 'object' ? m.status : 'pending';
                    return status === 'reserved' || status === 'completed';
                });
                const newDocStatus = allReserved ? 'reserved' : 'approved';

                transaction.update(donationRef, {
                    materials: updatedMaterials,
                    status: newDocStatus,
                    lastUpdated: new Date()
                });
            });

            // Send to Google Sheets as backup
            sendBookingToSheets({
                studentName: bookingData.name.trim(),
                phoneNumber: bookingData.phone.trim(),
                email: bookingData.email?.trim() || '',
                materialName: selectedMaterial.materialName,
                donorName: selectedMaterial.donorName || 'Unknown',
                donorPhone: selectedMaterial.donorPhone || 'Unknown',
                status: 'reserved'
            }).catch(err => console.warn('Google Sheets backup failed:', err));

            toast.success(language === 'ar' ? 'تم حجز المادة بنجاح!' : 'Material booked successfully!', { duration: 5000 });
            setShowBookingModal(false);
            setBookingData({ name: '', phone: '' });
            fetchDonations();
        } catch (error) {
            console.error('Error booking material:', error);
            if (error.message === "ALREADY_RESERVED") {
                toast.error(language === 'ar' ? 'عذراً، هذه المادة تم حجزها للتو من قبل شخص آخر' : 'Sorry, this material was just booked by someone else');
                fetchDonations(); // Refresh list
            } else {
                toast.error(language === 'ar' ? 'فشل حجز المادة' : 'Failed to book material');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="material-exchange-page">
            <section className="exchange-hero" style={{ backgroundImage: `url(${exchangeHero})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>{isAr ? 'تبادل المواد الدراسية 📚' : 'Material Exchange 📚'}</h1>
                    <p>
                        {isAr
                            ? 'منصة لتبادل الكتب والدوسيات بين الطلاب.. فيد واستفيد!'
                            : 'A platform to exchange books and notes between students.. Give and Take!'}
                    </p>
                </div>
            </section>

            <div className="exchange-main-container">
                <div className="add-material-section glass-card">
                    <div className="section-header">
                        <h2>{isAr ? 'تبرع الآن بالمواد' : 'Donate Materials Now'}</h2>
                        <p>{isAr ? 'شارك كتبك ودوسياتك مع زملائك' : 'Share your books and notes with peers'}</p>
                    </div>

                    {!settingsLoaded ? (
                        <div className="campaign-suspension-notice" style={{ opacity: 0.5 }}>
                            <p>{isAr ? 'جاري تحميل الإعدادات...' : 'Loading settings...'}</p>
                        </div>
                    ) : !systemSettings.isExchangeActive ? (
                        <div className="campaign-suspension-notice">
                            <div className="suspension-icon">📢</div>
                            <h3>{isAr ? 'الحملة متوقفة حالياً' : 'Campaign Currently Suspended'}</h3>
                            <p>
                                {isAr ? systemSettings.exchangeSuspendedMessageAr : systemSettings.exchangeSuspendedMessageEn}
                            </p>
                            <div className="suspension-footer">
                                <span>{isAr ? 'نراكم الفصل القادم! 👋' : 'See you next semester! 👋'}</span>
                            </div>
                        </div>
                    ) : (
                        <form className="material-form" onSubmit={handleSubmit}>
                            {/* ... existing form content ... */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{isAr ? 'اسم الطالب' : 'Student Name'}</label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        placeholder={isAr ? 'مثال: أحمد محمد' : 'e.g. Ahmad Mohammad'}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>{isAr ? 'رقم التواصل (واتساب)' : 'Contact Number (WhatsApp)'}</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="07xxxxxxxx"
                                        className="form-input"
                                        dir="ltr"
                                        maxLength="10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label>{t('exchange.form.email')}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder={isAr ? 'example@university.edu.jo' : 'example@university.edu.jo'}
                                        className="form-input"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>{isAr ? 'المواد المتوفرة' : 'Available Materials'}</label>
                                <div className="material-input-container">
                                    <input
                                        type="text"
                                        value={currentMaterial.name}
                                        onChange={(e) => setCurrentMaterial(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder={isAr ? 'اسم المادة (مثال: كتاب الفيزياء 1)' : 'Material name (e.g. Physics 1 Book)'}
                                        className="form-input"
                                    />
                                    <textarea
                                        value={currentMaterial.description}
                                        onChange={(e) => setCurrentMaterial(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder={isAr ? 'وصف المادة (اختياري): مثال: سلايدات كاملة، سلايدات الميد فقط، كتاب + شرح، إلخ...' : 'Material description (optional): e.g. Complete slides, Midterm only, Book + notes, etc.'}
                                        className="form-input material-description"
                                        rows="2"
                                    />
                                    <button type="button" onClick={handleAddMaterial} className="add-btn">
                                        {isAr ? 'إضافة' : 'Add'}
                                    </button>
                                </div>
                                <small className="form-hint">
                                    {isAr ? '💡 يمكنك إضافة أكثر من مادة بالنقر على "إضافة" عدة مرات' : '💡 You can add multiple materials by clicking "Add" multiple times'}
                                </small>

                                {formData.materials.length > 0 && (
                                    <div className="added-materials-list">
                                        {formData.materials.map((material, index) => (
                                            <div key={index} className="added-material-item">
                                                <div className="material-item-icon">📚</div>
                                                <div className="material-item-details">
                                                    <strong>{typeof material === 'string' ? material : material.name}</strong>
                                                    {material.description && (
                                                        <p>{material.description}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMaterial(index)}
                                                    className="remove-material-btn"
                                                    title={isAr ? 'حذف' : 'Remove'}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="disclaimer-box">
                                <h4 className="disclaimer-title">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    {isAr ? 'تنويه هام / شروط التبرع' : 'Important Note / T&C'}
                                </h4>
                                <p className="disclaimer-content">
                                    {isAr
                                        ? 'المواد التي يتم التبرع بها تصبح من ضمن المواد المحجوزة لدى الموقع، وتبقى تحت تصرف مسؤول الموقع إلى حين انتهاء الحملة. يتم التواصل مع المتبرعين أو الحاجزين من قبل مسؤول الموقع فقط. الموقع يخلي مسؤوليته عن أي تواصل يتم من قبل أي شخص آخر باسم الموقع.'
                                        : 'Donated materials become part of the reserved materials of the website and remain under the disposal of the website administrator until the end of the campaign. Communication with donors or reservers is done only by the website administrator. We disclaim responsibility for any communication by any person in the name of the website.'}
                                </p>
                            </div>

                            <div className="terms-checkbox-container">
                                <input
                                    type="checkbox"
                                    id="termsCheckbox"
                                    className="terms-checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />
                                <label htmlFor="termsCheckbox" className="terms-label">
                                    {isAr ? 'أقر بأنني قرأت ووافقت على الشروط والأحكام أعلاه' : 'I acknowledge that I have read and agreed to the above terms and conditions'}
                                </label>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading || !agreedToTerms}>
                                <span>{loading ? (isAr ? 'جاري النشر...' : 'Publishing...') : (isAr ? 'نشر المواد' : 'Publish Materials')}</span>
                                <span>{loading ? '⏳' : '🚀'}</span>
                            </button>
                        </form>
                    )}
                </div>

                <div className="materials-section glass-card">
                    <div className="section-header">
                        <h2>
                            {isAr ? 'المواد المتوفرة' : 'Available Materials'}
                            {systemSettings.isExchangeActive && bookingOpen && <span className="live-badge">● {isAr ? 'مباشر الآن' : 'Live Now'}</span>}
                        </h2>
                        <p>{isAr ? 'تصفح المواد المتاحة للتبادل' : 'Browse available materials for exchange'}</p>
                    </div>

                    {systemSettings.isExchangeActive && !bookingOpen && (
                        <div className="booking-notice-banner glass-card animate-pulse">
                            <span className="notice-icon">⏳</span>
                            <div className="notice-text">
                                <h3>{isAr ? 'فترة جمع المواد والتبرع 📚' : 'Material Collection & Donation Period 📚'}</h3>
                                <div className="countdown-timer">
                                    <div className="countdown-item">
                                        <span className="time-val">{timeLeft.days}</span>
                                        <span className="time-label">{isAr ? 'يوم' : 'Days'}</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="time-val">{timeLeft.hours}</span>
                                        <span className="time-label">{isAr ? 'ساعة' : 'Hrs'}</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="time-val">{timeLeft.minutes}</span>
                                        <span className="time-label">{isAr ? 'دقيقة' : 'Min'}</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="time-val">{timeLeft.seconds}</span>
                                        <span className="time-label">{isAr ? 'ثانية' : 'Sec'}</span>
                                    </div>
                                </div>
                                <p className="booking-info-text">{t('exchange.booking.starts_at')}</p>
                            </div>
                        </div>
                    )}

                    {!settingsLoaded ? (
                        <div className="no-materials" style={{ opacity: 0.5 }}>
                            <div className="empty-icon">⏳</div>
                            <h3>{isAr ? 'جاري التحميل...' : 'Loading...'}</h3>
                        </div>
                    ) : !systemSettings.isExchangeActive ? (
                        <div className="no-materials">
                            <div className="empty-icon">🔧</div>
                            <h3>{isAr ? 'النظام قيد التطوير' : 'System Under Development'}</h3>
                            <p>{isAr ? 'نعمل على إطلاق نظام جديد ومتكامل قريباً' : 'We are launching a new integrated system soon'}</p>
                        </div>
                    ) : availableMaterials.length > 0 ? (
                        <div className="materials-grid">
                            {availableMaterials.map((item) => (
                                <div key={item.uniqueKey} className="donation-card">
                                    <div className="donation-main">
                                        <div className="material-icon">📚</div>
                                        <div className="donation-details">
                                            <h3>{item.materialItem.name}</h3>
                                        </div>
                                    </div>
                                    <button
                                        className={`btn-book ${!bookingOpen ? 'locked' : ''}`}
                                        onClick={() => openBookingModal(item)}
                                    >
                                        {!bookingOpen ? (isAr ? 'قريباً' : 'Soon') : (isAr ? 'حجز المادة' : 'Book Material')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-materials">
                            <div className="empty-icon">📦</div>
                            <h3>{isAr ? 'لا توجد مواد معروضة حالياً' : 'No materials available yet'}</h3>
                            <p>{isAr ? 'كن أول المبادرين!' : 'Be the first!'}</p>
                        </div>
                    )}

                    {systemSettings.isExchangeActive && reservedMaterials.length > 0 && (
                        <div className="reserved-materials-container">
                            <div className="section-divider-wrapper">
                                <hr className="section-divider" />
                                <span className="divider-text">{isAr ? 'مواد نفذت (غير متاحة حالياً)' : 'Out of Stock (Currently Unavailable)'}</span>
                            </div>
                            <div className="materials-grid">
                                {reservedMaterials.map((item, index) => (
                                    <div key={index} className="donation-card reserved-card">
                                        <div className="material-icon">📚</div>
                                        <div className="donation-details">
                                            <h3>{item.materialName}</h3>
                                        </div>
                                        <button className="btn-book disabled" disabled>
                                            {isAr ? 'تم الحجز' : 'Reserved'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Coordination & Distribution Team Section */}
                <section className="distribution-team-section glass-card">
                    <div className="section-header">
                        <h2>👥 {isAr ? 'فريق التنسيق والتوزيع' : 'Coordination & Distribution Team'}</h2>
                        <p>
                            {isAr 
                                ? 'نُخبة من متطوعي مَكانك لضمان وصول المواد لمستحقيها بكل أمانة وتنظيم' 
                                : 'A group of Makanak volunteers ensuring materials reach those who need them with integrity and organization'}
                        </p>
                    </div>

                    <div className="team-container-relative">
                        {/* Blur Overlay */}
                        <div className="team-coming-soon-overlay">
                            <div className="overlay-content">
                                <span className="soon-badge">{isAr ? 'قريباً جداً' : 'Coming Soon'}</span>
                                <h3>{isAr ? 'نظام جديد ومتكامل لتبادل المواد' : 'A New Integrated System for Material Exchange'}</h3>
                                <p>{isAr ? 'نعمل حالياً على بناء تجربة ذكية لتسهيل عملية التوزيع' : 'We are currently building a smart experience to facilitate the distribution process'}</p>
                            </div>
                        </div>

                        <div className="team-grid">
                            <div className="team-member-card male-coord">
                                <div className="member-avatar-wrapper">
                                    <img src="/assets/avatars/flork_cool.png" alt="Male Coordinator" className="member-avatar" />
                                    <span className="status-indicator"></span>
                                </div>
                                <div className="member-details">
                                    <h3>{isAr ? 'أحمد (منسق الحملة)' : 'Ahmad (Campaign Coordinator)'}</h3>
                                    <div className="member-role">
                                        <span className="role-tag">{isAr ? 'مسؤول التنسيق' : 'Coordination Lead'}</span>
                                    </div>
                                    <p>
                                        {isAr 
                                            ? 'يتولى مسؤولية كشوفات مواد التخصصات الهندسية والتقنية والتواصل مع الطلاب لتنظيم عملية التسليم.' 
                                            : 'Responsible for engineering and technical majors material lists and contacting students to organize delivery.'}
                                    </p>
                                    <div className="contact-info">
                                        <span className="whatsapp-status">
                                            <i className="fab fa-whatsapp"></i> {isAr ? 'متاح عبر الواتساب' : 'Available on WhatsApp'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="team-member-card female-coord">
                                <div className="member-avatar-wrapper">
                                    <img src="/assets/avatars/flork_heart.png" alt="Female Coordinator" className="member-avatar" />
                                    <span className="status-indicator"></span>
                                </div>
                                <div className="member-details">
                                    <h3>{isAr ? 'سارة (منسقة الحملة)' : 'Sara (Campaign Coordinator)'}</h3>
                                    <div className="member-role">
                                        <span className="role-tag">{isAr ? 'مسؤولة التنسيق' : 'Coordination Lead'}</span>
                                    </div>
                                    <p>
                                        {isAr 
                                            ? 'تتولى مسؤولية كشوفات المتطلبات الجامعية والمواد الاختيارية وضمان توزيعها بشكل عادل ومنظم.' 
                                            : 'Responsible for university requirements and elective courses material lists, ensuring fair and organized distribution.'}
                                    </p>
                                    <div className="contact-info">
                                        <span className="whatsapp-status">
                                            <i className="fab fa-whatsapp"></i> {isAr ? 'متاحة عبر الواتساب' : 'Available on WhatsApp'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="team-footer-note">
                        <p>
                            <i className="fas fa-info-circle"></i> 
                            {isAr 
                                ? 'سيتم التواصل معكم من قبل فريق التوزيع رسمياً عبر أرقام هواتفكم المسجلة فور صدور الكشوفات.' 
                                : 'The distribution team will contact you officially via your registered phone numbers once the lists are issued.'}
                        </p>
                    </div>
                </section>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal-overlay">
                    <div className="booking-modal glass-card">
                        <button className="close-modal" onClick={() => setShowBookingModal(false)}>×</button>
                        <div className="modal-header">
                            <h2>{isAr ? 'حجز المادة' : 'Book Material'}</h2>
                            <p>{isAr ? 'يرجى ملء معلوماتك لحجز المادة وسنتواصل معك قريباً' : 'Please fill in your details to book the material'}</p>
                            <div className="material-to-book">
                                <span>📖</span>
                                <strong>{selectedMaterial?.materialName}</strong>
                            </div>
                        </div>
                        <form className="booking-form" onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label>{isAr ? 'الاسم (من مقطعين على الأقل)' : 'Full Name (at least 2 parts)'}</label>
                                <input
                                    type="text"
                                    required
                                    value={bookingData.name}
                                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                    placeholder={isAr ? 'مثال: محمد أحمد' : 'e.g. Mohammad Ahmad'}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'رقم الهاتف للتواصل واستلام المادة' : 'Contact Number'}</label>
                                <input
                                    type="tel"
                                    required
                                    value={bookingData.phone}
                                    onChange={(e) => setBookingData({ ...bookingData, phone: toEnglishNumerals(e.target.value) })}
                                    placeholder="07xxxxxxxx"
                                    className="form-input"
                                    dir="ltr"
                                />
                            </div>
                            <button type="submit" className="submit-btn full-width" disabled={loading}>
                                {loading ? (isAr ? 'جاري الحجز...' : 'Booking...') : (isAr ? 'تأكيد الحجز' : 'Confirm Booking')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialExchange;
