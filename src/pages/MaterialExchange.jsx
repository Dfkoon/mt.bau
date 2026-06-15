import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, getDoc, updateDoc, setDoc, deleteDoc, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';
import exchangeHero from '../assets/heros/exchange_hero.png';
import { sendDonationToSheets, sendBookingToSheets } from '../services/googleSheetsService';
import './MaterialExchange.css';

// Campaign timing is now dynamic — loaded from Firestore system_configs/global_settings

const STAFF_USERS = {
    admin: { role: 'admin',       nameAr: 'الأدمن', nameEn: 'Admin', gender: null     },
    ahmad: { role: 'coordinator', nameAr: 'أحمد',   nameEn: 'Ahmad', gender: 'male'   },
    sara:  { role: 'coordinator', nameAr: 'سارة',   nameEn: 'Sara',  gender: 'female' }
};

const MaterialExchange = () => {
    const { language, t } = useLanguage();
    const isAr = language === 'ar';

    // ── PUBLIC STATE ─────────────────────────────────────────────
    const [formData, setFormData] = useState({ studentName: '', phoneNumber: '', email: '', studentGender: '', materials: [] });
    const [currentMaterial, setCurrentMaterial] = useState({ name: '', description: '' });
    const [allMaterials, setAllMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [systemSettings, setSystemSettings] = useState({
        campaignPhase: 'suspended',
        secretGatewayCode: 'makanak2025',
        exchangeSuspendedMessageAr: 'تفتح الحملة أبوابها مع بداية كل فصل دراسي جديد تزامناً مع فترة السحب والإضافة.',
        exchangeSuspendedMessageEn: 'It resumes at the start of each new semester during the add and drop period.',
        adminPassword: 'admin2024',
        ahmadPassword: 'ahmad2024',
        saraPassword:  'sara2024',
        ahmadNameAr:   'أحمد',
        ahmadNameEn:   'Ahmad',
        saraNameAr:    'سارة',
        saraNameEn:    'Sara',
        coordinatorMaleTasks:    '',
        coordinatorFemaleTasks:  '',
        sharedCoordinatorTasks:  '',
        donationEndTime:  '',   // ISO datetime string — end of collection/donation period
        bookingStartTime: ''    // ISO datetime string — start of booking/exchange period
    });
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [bookingData, setBookingData] = useState({ name: '', phone: '', gender: '' });

    // ── TRACKER & ANALYTICS ──────────────────────────────────────
    const [trackerSearchQuery, setTrackerSearchQuery] = useState('');
    const [trackerResults, setTrackerResults] = useState(null);
    const [publicActiveTab, setPublicActiveTab] = useState('donate'); // 'donate' | 'track'

    // ── ADMIN / COORDINATOR FILTERS ──────────────────────────────
    const [adminSubFilter, setAdminSubFilter] = useState('all'); // 'all' | 'ahmad' | 'sara'
    const [coordinatorSubTab, setCoordinatorSubTab] = useState('delegated'); // 'main' | 'delegated'
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDonationForEdit, setSelectedDonationForEdit] = useState(null);
    const [showDelegateModal, setShowDelegateModal] = useState(false);
    const [donationToDelegate, setDonationToDelegate] = useState(null);

    // ── STAFF AUTH STATE ──────────────────────────────────────────
    const [loggedInUser, setLoggedInUser] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem('exchange_staff')) || null; }
        catch { return null; }
    });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginStep, setLoginStep] = useState(1); // 1 = secret code, 2 = credentials
    const [secretCodeInput, setSecretCodeInput] = useState('');
    const [secretCodeError, setSecretCodeError] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    
    // ── CAPTCHA STATE ──────────────────────────────────────────────
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState(false);
    const canvasRef = useRef(null);

    const SECRET_GATEWAY_CODE = 'makanak2025';

    // ── DASHBOARD STATE ───────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('donations');
    const [allDonations, setAllDonations] = useState([]);
    const [checkedTasks, setCheckedTasks] = useState(new Set());
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [sectionSaving, setSectionSaving] = useState('');
    const [editSettings, setEditSettings] = useState({});

    // ── AUDIT LOG STATE ───────────────────────────────────────────
    const [auditLogs, setAuditLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);

    // ── ARCHIVE STATE ─────────────────────────────────────────────
    const [archives, setArchives] = useState([]);
    const [archiveName, setArchiveName] = useState('');
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [selectedArchive, setSelectedArchive] = useState(null);
    const [archivesLoading, setArchivesLoading] = useState(false);
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(result);
        setCaptchaInput('');
        setCaptchaError(false);
    };

    const drawCaptcha = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        ctx.fillStyle = isDark ? '#1f2937' : '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        const gridSize = 15;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';
        for (let i = 0; i < 6; i++) {
            ctx.lineWidth = 1.5 + Math.random() * 1.5;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.font = 'bold 28px Courier New, monospace';
        ctx.textBaseline = 'middle';
        
        const colors = isDark 
            ? ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#ff9ff3', '#00d2d3']
            : ['#d63031', '#0984e3', '#00b894', '#fdcb6e', '#6c5ce7', '#db0a5b', '#018576'];

        for (let i = 0; i < captchaText.length; i++) {
            const char = captchaText[i];
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.save();
            const x = 20 + i * 28 + Math.random() * 5;
            const y = canvas.height / 2 + (Math.random() - 0.5) * 8;
            const angle = (Math.random() - 0.5) * 0.4;
            
            ctx.translate(x, y);
            ctx.rotate(angle);
            
            const scaleX = 0.9 + Math.random() * 0.2;
            const scaleY = 0.9 + Math.random() * 0.2;
            ctx.scale(scaleX, scaleY);
            
            ctx.fillText(char, -10, 0);
            ctx.restore();
        }
    };
    // ── EFFECTS ───────────────────────────────────────────────────
    useEffect(() => {
        const targetISO = systemSettings.bookingStartTime || systemSettings.donationEndTime || '';
        const calculateTimeLeft = () => {
            if (!targetISO) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const now = new Date();
            const target = new Date(targetISO);
            const difference = target - now;
            if (difference > 0) {
                setTimeLeft({
                    days:    Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours:   Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };
        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();
        return () => clearInterval(timer);
    }, [systemSettings.bookingStartTime, systemSettings.donationEndTime]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settingsRef = doc(db, 'system_configs', 'global_settings');
                const docSnap = await getDoc(settingsRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const phase = data.campaignPhase || 'suspended';
                    setSystemSettings(prev => ({
                        ...prev,
                        campaignPhase:           phase,
                        isExchangeActive:        phase !== 'suspended',
                        secretGatewayCode:       data.secretGatewayCode       || 'makanak2025',
                        exchangeSuspendedMessageAr: data.exchangeSuspendedMessageAr || prev.exchangeSuspendedMessageAr,
                        exchangeSuspendedMessageEn: data.exchangeSuspendedMessageEn || prev.exchangeSuspendedMessageEn,
                        adminPassword:           data.adminPassword           || prev.adminPassword,
                        ahmadPassword:           data.ahmadPassword           || prev.ahmadPassword,
                        saraPassword:            data.saraPassword            || prev.saraPassword,
                        ahmadNameAr:             data.ahmadNameAr             || prev.ahmadNameAr,
                        ahmadNameEn:             data.ahmadNameEn             || prev.ahmadNameEn,
                        saraNameAr:              data.saraNameAr              || prev.saraNameAr,
                        saraNameEn:              data.saraNameEn              || prev.saraNameEn,
                        coordinatorMaleTasks:    data.coordinatorMaleTasks    || '',
                        coordinatorFemaleTasks:  data.coordinatorFemaleTasks  || '',
                        sharedCoordinatorTasks:  data.sharedCoordinatorTasks  || '',
                        donationEndTime:         data.donationEndTime         || '',
                        bookingStartTime:        data.bookingStartTime        || ''
                    }));
                    setBookingOpen(phase === 'exchange');
                    setEditSettings({
                        campaignPhase:              phase,
                        secretGatewayCode:          data.secretGatewayCode          || 'makanak2025',
                        adminPassword:              data.adminPassword              || 'admin2024',
                        ahmadPassword:              data.ahmadPassword              || 'ahmad2024',
                        saraPassword:               data.saraPassword               || 'sara2024',
                        ahmadNameAr:                data.ahmadNameAr                || 'أحمد',
                        ahmadNameEn:                data.ahmadNameEn                || 'Ahmad',
                        saraNameAr:                 data.saraNameAr                 || 'سارة',
                        saraNameEn:                 data.saraNameEn                 || 'Sara',
                        coordinatorMaleTasks:       data.coordinatorMaleTasks       || '',
                        coordinatorFemaleTasks:     data.coordinatorFemaleTasks     || '',
                        sharedCoordinatorTasks:     data.sharedCoordinatorTasks     || '',
                        exchangeSuspendedMessageAr: data.exchangeSuspendedMessageAr || '',
                        exchangeSuspendedMessageEn: data.exchangeSuspendedMessageEn || '',
                        donationEndTime:            data.donationEndTime            || '',
                        bookingStartTime:           data.bookingStartTime           || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setSettingsLoaded(true);
            }
        };
        fetchSettings();
        fetchDonations();
        fetchArchives();
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            fetchAllDonations();
            fetchAuditLogs();
        }
    }, [loggedInUser]);

    useEffect(() => {
        if (activeTab === 'logs') {
            fetchAuditLogs();
        }
    }, [activeTab]);

    useEffect(() => {
        const handleOpenStaffLogin = () => {
            setShowLoginModal(true);
            setLoginStep(2); // Go directly to username/password form
            setLoginError('');
            setLoginForm({ username: '', password: '' });
            setCaptchaInput('');
            setCaptchaError(false);
        };
        window.addEventListener('open-staff-login', handleOpenStaffLogin);
        return () => {
            window.removeEventListener('open-staff-login', handleOpenStaffLogin);
        };
    }, []);

    useEffect(() => {
        if (showLoginModal && loginStep === 2) {
            generateCaptcha();
        }
    }, [showLoginModal, loginStep]);

    useEffect(() => {
        if (showLoginModal && loginStep === 2 && captchaText) {
            drawCaptcha();
        }
    }, [captchaText, showLoginModal, loginStep]);

    // ── PUBLIC FUNCTIONS ──────────────────────────────────────────
    const toEnglishNumerals = (str) => {
        const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        const en = ['0','1','2','3','4','5','6','7','8','9'];
        let result = str;
        ar.forEach((a, i) => { result = result.replace(new RegExp(a, 'g'), en[i]); });
        return result;
    };

    const getFriendlyStatusName = (status, role) => {
        if (role === 'donor') {
            switch (status) {
                case 'pending': return isAr ? 'بانتظار موافقة الإدارة' : 'Pending Admin Approval';
                case 'approved': return isAr ? 'معتمد ومتاح للحجز' : 'Approved & Available';
                case 'reserved': return isAr ? 'تم حجزه من قبل طالب' : 'Reserved by student';
                case 'completed': return isAr ? 'تم تسليم المادة للطالب' : 'Delivered to student';
                default: return status;
            }
        } else {
            switch (status) {
                case 'reserved': return isAr ? 'محجوز - بانتظار تسليمه لك' : 'Booked - Awaiting delivery';
                case 'completed': return isAr ? 'تم الاستلام بنجاح 🎉' : 'Successfully Delivered 🎉';
                default: return status;
            }
        }
    };

    const handleTrackRequest = () => {
        if (!trackerSearchQuery.trim()) {
            toast.error(isAr ? 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني' : 'Please enter phone number or email');
            return;
        }
        const queryStr = toEnglishNumerals(trackerSearchQuery.trim().toLowerCase());
        
        // Find donor matches or taker matches in allMaterials
        const results = [];
        allMaterials.forEach(m => {
            const donorPhone = (m.phoneNumber || '').trim().toLowerCase();
            const donorEmail = (m.email || '').trim().toLowerCase();
            const takerPhone = (m.materialItem?.takerInfo?.phone || '').trim().toLowerCase();
            const takerEmail = (m.materialItem?.takerInfo?.email || '').trim().toLowerCase();
            
            const isDonor = donorPhone === queryStr || donorEmail === queryStr;
            const isTaker = takerPhone === queryStr || takerEmail === queryStr;
            
            const coordName = m.studentGender === 'male' 
                ? (systemSettings.ahmadNameAr || 'أحمد') 
                : (systemSettings.saraNameAr || 'سارة');
                
            if (isDonor) {
                results.push({
                    userRole: 'donor',
                    materialName: m.materialItem.name,
                    materialDescription: m.materialItem.description || '',
                    itemStatus: m.materialItem.status || m.status,
                    createdAt: m.createdAt ? (m.createdAt.seconds * 1000 || new Date(m.createdAt).getTime()) : Date.now(),
                    coordinatorName: coordName
                });
            }
            if (isTaker) {
                results.push({
                    userRole: 'booker',
                    materialName: m.materialItem.name,
                    materialDescription: m.materialItem.description || '',
                    itemStatus: m.materialItem.status || m.status,
                    createdAt: m.materialItem.takerInfo?.bookedAt ? (m.materialItem.takerInfo.bookedAt.seconds * 1000 || new Date(m.materialItem.takerInfo.bookedAt).getTime()) : Date.now(),
                    coordinatorName: coordName
                });
            }
        });
        
        // Sort by date descending
        results.sort((a, b) => b.createdAt - a.createdAt);
        setTrackerResults(results);
    };

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'materialDonations'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const donationsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            const materialsList = donationsData.flatMap(donation => {
                const materials = donation.materials || (donation.itemName ? [donation.itemName] : []);
                return materials.map((m, idx) => {
                    const materialObj = typeof m === 'object' && m !== null ? m : { name: m, status: donation.status };
                    if (!materialObj.status) materialObj.status = donation.status;
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
                toast.error(isAr ? 'خطأ في الصلاحيات' : 'Permission Error');
            } else {
                toast.error(isAr ? 'فشل في تحميل البيانات' : 'Failed to fetch donations');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchAllDonations = async () => {
        setDashboardLoading(true);
        try {
            const q = query(collection(db, 'materialDonations'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setAllDonations(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error('Error fetching all donations:', error);
        } finally {
            setDashboardLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phoneNumber') {
            setFormData(prev => ({ ...prev, [name]: toEnglishNumerals(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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
        setFormData(prev => ({ ...prev, materials: prev.materials.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.studentName.trim() || !formData.phoneNumber.trim() || !formData.studentGender || formData.materials.length === 0) {
            toast.error(isAr ? 'يرجى ملء جميع الحقول واختيار الجنس وإضافة مادة واحدة على الأقل' : 'Please fill all fields, select gender, and add at least one material');
            return;
        }
        const nameParts = formData.studentName.trim().split(/\s+/);
        if (nameParts.length < 2) {
            toast.error(isAr ? 'يرجى إدخال الاسم الثنائي على الأقل' : 'Please enter at least your first and last name');
            return;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            toast.error(isAr ? 'يجب أن يتكون رقم الهاتف من 10 خانات بالضبط (مثال: 0790000000)' : 'Phone number must be exactly 10 digits (e.g. 0790000000)');
            return;
        }
        if (!agreedToTerms) {
            toast.error(isAr ? 'يرجى الموافقة على الشروط والأحكام' : 'Please agree to the terms and conditions');
            return;
        }
        setLoading(true);
        try {
            const materialsObjects = formData.materials.map(m => ({
                name: typeof m === 'string' ? m.trim() : m.name,
                description: typeof m === 'object' ? m.description : '',
                status: 'pending'
            }));
            await addDoc(collection(db, 'materialDonations'), {
                studentName: formData.studentName.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                email: formData.email?.trim() || null,
                studentGender: formData.studentGender,
                materials: materialsObjects,
                createdAt: serverTimestamp(),
                status: 'pending'
            });
            sendDonationToSheets({
                studentName: formData.studentName.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                email: formData.email?.trim() || '',
                studentGender: formData.studentGender,
                materials: formData.materials,
                status: 'pending'
            }).catch(err => console.warn('Google Sheets backup failed:', err));
            toast.success(isAr ? 'تم استلام طلب التبرع بنجاح! سيتم مراجعته من قبل المسؤولين' : 'Donation request received! It will be reviewed by admins');
            setFormData({ studentName: '', phoneNumber: '', email: '', studentGender: '', materials: [] });
            setCurrentMaterial({ name: '', description: '' });
            setAgreedToTerms(false);
            fetchDonations();
        } catch (error) {
            console.error('Error adding donation:', error);
            toast.error(isAr ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again');
        } finally {
            setLoading(false);
        }
    };

    const openBookingModal = (material) => {
        if (!systemSettings.isExchangeActive) {
            toast(
                () => (
                    <div className="suspension-alert">
                        <p>{isAr ? systemSettings.exchangeSuspendedMessageAr : systemSettings.exchangeSuspendedMessageEn}</p>
                    </div>
                ),
                { duration: 6000, position: 'top-center', style: { background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', padding: '16px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', textAlign: 'center' } }
            );
            return;
        }
        if (!bookingOpen) {
            toast.error(isAr ? 'عذراً، حجز المواد لم يبدأ بعد' : 'Sorry, material booking has not started yet');
            return;
        }
        setSelectedMaterial(material);
        setShowBookingModal(true);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (bookingData.name.trim().split(/\s+/).length < 2) {
            toast.error(isAr ? 'يرجى إدخال الاسم الثنائي على الأقل' : 'Please enter at least two parts of your name');
            return;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(bookingData.phone)) {
            toast.error(isAr ? 'يجب أن يتكون رقم الهاتف من 10 خانات بالضبط (مثال: 0790000000)' : 'Phone number must be exactly 10 digits (e.g. 0790000000)');
            return;
        }
        if (!bookingData.gender) {
            toast.error(isAr ? 'يرجى اختيار الجنس' : 'Please select gender');
            return;
        }
        setLoading(true);
        try {
            const { doc: docRef, runTransaction } = await import('firebase/firestore');
            const donationRef = docRef(db, 'materialDonations', selectedMaterial.id);
            await runTransaction(db, async (transaction) => {
                const donationDoc = await transaction.get(donationRef);
                if (!donationDoc.exists()) throw new Error('Document does not exist!');
                const currentData = donationDoc.data();
                const materials = currentData.materials || [];
                const updatedMaterials = [...materials];
                const materialToUpdate = updatedMaterials[selectedMaterial.originalIndex];
                if (!materialToUpdate) throw new Error('Material not found in donation record.');
                const normalizedStatus = typeof materialToUpdate === 'object' ? materialToUpdate.status : currentData.status;
                if (normalizedStatus === 'reserved' || normalizedStatus === 'completed') throw new Error('ALREADY_RESERVED');
                if (typeof updatedMaterials[selectedMaterial.originalIndex] !== 'object') {
                    updatedMaterials[selectedMaterial.originalIndex] = { name: updatedMaterials[selectedMaterial.originalIndex], status: 'reserved' };
                } else {
                    updatedMaterials[selectedMaterial.originalIndex] = { ...materialToUpdate, status: 'reserved' };
                }
                updatedMaterials[selectedMaterial.originalIndex].takerInfo = {
                    name: bookingData.name.trim(),
                    phone: bookingData.phone.trim(),
                    email: bookingData.email?.trim() || '',
                    gender: bookingData.gender,
                    bookedAt: new Date()
                };
                const allReserved = updatedMaterials.every(m => {
                    const s = typeof m === 'object' ? m.status : 'pending';
                    return s === 'reserved' || s === 'completed';
                });
                transaction.update(donationRef, {
                    materials: updatedMaterials,
                    status: allReserved ? 'reserved' : 'approved',
                    lastUpdated: new Date()
                });
            });
            sendBookingToSheets({
                studentName: bookingData.name.trim(),
                phoneNumber: bookingData.phone.trim(),
                email: bookingData.email?.trim() || '',
                studentGender: bookingData.gender === 'male' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female'),
                materialName: selectedMaterial.materialName,
                donorName: selectedMaterial.donorName || 'Unknown',
                donorPhone: selectedMaterial.donorPhone || 'Unknown',
                status: 'reserved'
            }).catch(err => console.warn('Google Sheets backup failed:', err));
            toast.success(isAr ? 'تم حجز المادة بنجاح!' : 'Material booked successfully!', { duration: 5000 });
            setShowBookingModal(false);
            setBookingData({ name: '', phone: '', gender: '' });
            fetchDonations();
        } catch (error) {
            console.error('Error booking material:', error);
            if (error.message === 'ALREADY_RESERVED') {
                toast.error(isAr ? 'عذراً، هذه المادة تم حجزها للتو من قبل شخص آخر' : 'Sorry, this material was just booked by someone else');
                fetchDonations();
            } else {
                toast.error(isAr ? 'فشل حجز المادة' : 'Failed to book material');
            }
        } finally {
            setLoading(false);
        }
    };

    // ── STAFF FUNCTIONS ───────────────────────────────────────────
    const handleLogin = (e) => {
        e.preventDefault();
        
        // 1. Verify CAPTCHA first
        if (captchaInput.trim().toUpperCase() !== captchaText) {
            setCaptchaError(true);
            toast.error(isAr ? 'رمز التحقق غير صحيح' : 'Incorrect verification code');
            generateCaptcha();
            return;
        }

        const { username, password } = loginForm;
        const passwords = {
            admin: systemSettings.adminPassword || 'admin2024',
            ahmad: systemSettings.ahmadPassword || 'ahmad2024',
            sara:  systemSettings.saraPassword  || 'sara2024'
        };
        const staffUsersDynamic = {
            admin: { role: 'admin',       nameAr: 'الأدمن', nameEn: 'Admin', gender: null     },
            ahmad: { role: 'coordinator', nameAr: systemSettings.ahmadNameAr || 'أحمد', nameEn: systemSettings.ahmadNameEn || 'Ahmad', gender: 'male'   },
            sara:  { role: 'coordinator', nameAr: systemSettings.saraNameAr || 'سارة', nameEn: systemSettings.saraNameEn || 'Sara',  gender: 'female' }
        };

        const inputUserTrimmed = username.trim().toLowerCase();
        let matchedKey = null;

        const adminNameAr = 'الأدمن'.trim().toLowerCase();
        const adminNameEn = 'admin';

        const ahmadNameAr = (systemSettings.ahmadNameAr || 'أحمد').trim().toLowerCase();
        const ahmadNameEn = (systemSettings.ahmadNameEn || 'Ahmad').trim().toLowerCase();

        const saraNameAr = (systemSettings.saraNameAr || 'سارة').trim().toLowerCase();
        const saraNameEn = (systemSettings.saraNameEn || 'Sara').trim().toLowerCase();

        if (inputUserTrimmed === 'admin' || inputUserTrimmed === adminNameAr || inputUserTrimmed === adminNameEn) {
            matchedKey = 'admin';
        } else if (inputUserTrimmed === 'ahmad' || inputUserTrimmed === ahmadNameAr || inputUserTrimmed === ahmadNameEn) {
            matchedKey = 'ahmad';
        } else if (inputUserTrimmed === 'sara' || inputUserTrimmed === saraNameAr || inputUserTrimmed === saraNameEn) {
            matchedKey = 'sara';
        }

        if (matchedKey && passwords[matchedKey] === password) {
            const user = { ...staffUsersDynamic[matchedKey], username: matchedKey };
            setLoggedInUser(user);
            sessionStorage.setItem('exchange_staff', JSON.stringify(user));
            setShowLoginModal(false);
            setLoginForm({ username: '', password: '' });
            setLoginError('');
            setCaptchaInput('');
            setCaptchaError(false);
        } else {
            setLoginError(isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Incorrect username or password');
            generateCaptcha();
        }
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        sessionStorage.removeItem('exchange_staff');
        setActiveTab('donations');
    };

    const handleApproveDonation = async (donationId) => {
        try {
            await updateDoc(doc(db, 'materialDonations', donationId), { status: 'approved' });
            toast.success(isAr ? 'تمت الموافقة على التبرع' : 'Donation approved');
            fetchAllDonations();
            
            const don = allDonations.find(d => d.id === donationId);
            const donorName = don ? don.studentName : '';
            addAuditLog(
                `وافق على تبرع الطالب (${donorName}) بالكامل`, 
                `Approved the entire donation from student (${donorName})`, 
                { donationId, donorName }
            );
        } catch {
            toast.error(isAr ? 'فشل تحديث الحالة' : 'Failed to update status');
        }
    };

    const handleSaveEditDonation = async (e) => {
        e.preventDefault();
        if (!selectedDonationForEdit) return;
        setLoading(true);
        try {
            const donationRef = doc(db, 'materialDonations', selectedDonationForEdit.id);
            const materials = selectedDonationForEdit.materials || [];
            let overallStatus = 'pending';
            const hasApproved = materials.some(m => m.status === 'approved');
            const hasReserved = materials.some(m => m.status === 'reserved');
            const hasCompleted = materials.some(m => m.status === 'completed');
            
            if (hasCompleted && !hasReserved && !hasApproved && !materials.some(m => m.status === 'pending')) {
                overallStatus = 'completed';
            } else if (hasReserved || hasCompleted) {
                overallStatus = 'reserved';
            } else if (hasApproved) {
                overallStatus = 'approved';
            }
            
            const updateFields = {
                studentName: selectedDonationForEdit.studentName.trim(),
                phoneNumber: selectedDonationForEdit.phoneNumber.trim(),
                studentGender: selectedDonationForEdit.studentGender,
                materials: selectedDonationForEdit.materials,
                status: overallStatus,
                lastUpdated: new Date()
            };
            
            if (selectedDonationForEdit.publishedToCoordinators !== undefined) {
                updateFields.publishedToCoordinators = selectedDonationForEdit.publishedToCoordinators;
            }
            
            await updateDoc(donationRef, updateFields);
            toast.success(isAr ? 'تم حفظ التعديلات بنجاح ✅' : 'Changes saved successfully ✅');
            setShowEditModal(false);
            setSelectedDonationForEdit(null);
            fetchAllDonations();
            fetchDonations();
            
            addAuditLog(
                `قام بتعديل تفاصيل تبرع الطالب (${selectedDonationForEdit.studentName}) وتحديث حالة المواد`,
                `Edited donation details for student (${selectedDonationForEdit.studentName}) and updated materials status`,
                { donationId: selectedDonationForEdit.id, donorName: selectedDonationForEdit.studentName }
            );
        } catch (error) {
            console.error('Error saving edited donation:', error);
            toast.error(isAr ? 'حدث خطأ أثناء حفظ التعديلات' : 'Error saving changes');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDelegateModal = (donation) => {
        setDonationToDelegate(donation);
        setShowDelegateModal(true);
    };

    const handleDelegateToCoordinator = async (donationId, coordinatorUsername) => {
        try {
            await updateDoc(doc(db, 'materialDonations', donationId), {
                publishedToCoordinators: true,
                delegatedTo: coordinatorUsername
            });
            const coordName = coordinatorUsername === 'ahmad'
                ? (systemSettings.ahmadNameAr || 'أحمد')
                : (systemSettings.saraNameAr || 'سارة');
            toast.success(isAr ? `✅ تم تفويض الطلب إلى ${coordName}` : `✅ Delegated to ${coordinatorUsername}`);
            setShowDelegateModal(false);
            setDonationToDelegate(null);
            fetchAllDonations();
            
            const don = allDonations.find(d => d.id === donationId);
            const donorName = don ? don.studentName : '';
            addAuditLog(
                `فوّض تبرع الطالب (${donorName}) إلى المنسق (${coordName})`,
                `Delegated donation from student (${donorName}) to coordinator (${coordinatorUsername})`,
                { donationId, coordinatorUsername, donorName }
            );
        } catch (error) {
            console.error('Error delegating:', error);
            toast.error(isAr ? 'فشل التفويض' : 'Delegation failed');
        }
    };

    const handleRevokeDelegation = async (donationId) => {
        try {
            await updateDoc(doc(db, 'materialDonations', donationId), {
                publishedToCoordinators: false,
                delegatedTo: null
            });
            toast.success(isAr ? '🔄 تم إلغاء التفويض' : '🔄 Delegation revoked');
            fetchAllDonations();
            
            const don = allDonations.find(d => d.id === donationId);
            const donorName = don ? don.studentName : '';
            addAuditLog(
                `ألغى تفويض تبرع الطالب (${donorName})`,
                `Revoked delegation for donation from student (${donorName})`,
                { donationId, donorName }
            );
        } catch (error) {
            console.error('Error revoking delegation:', error);
            toast.error(isAr ? 'فشل إلغاء التفويض' : 'Failed to revoke');
        }
    };

    const handleDeleteDonation = async (donationId) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
        try {
            const don = allDonations.find(d => d.id === donationId);
            const donorName = don ? don.studentName : '';
            await deleteDoc(doc(db, 'materialDonations', donationId));
            toast.success(isAr ? 'تم حذف التبرع' : 'Donation deleted');
            fetchAllDonations();
            
            addAuditLog(
                `حذف تبرع الطالب (${donorName}) نهائياً`,
                `Deleted donation from student (${donorName}) permanently`,
                { donationId, donorName }
            );
        } catch {
            toast.error(isAr ? 'فشل الحذف' : 'Failed to delete');
        }
    };

    const handleUpdateCampaignPhase = async (newPhase) => {
        setSystemSettings(prev => ({
            ...prev,
            campaignPhase: newPhase,
            isExchangeActive: newPhase !== 'suspended'
        }));
        setBookingOpen(newPhase === 'exchange');
        setEditSettings(prev => ({ ...prev, campaignPhase: newPhase }));
        try {
            const settingsRef = doc(db, 'system_configs', 'global_settings');
            await setDoc(settingsRef, { campaignPhase: newPhase }, { merge: true });
            toast.success(isAr ? 'تم تحديث حالة الحملة بنجاح ✅' : 'Campaign status updated successfully ✅');
            
            addAuditLog(
                `غيّر حالة مرحلة الحملة إلى (${newPhase === 'suspended' ? 'موقوفة 🛑' : newPhase === 'collection' ? 'جمع وتبرع 📥' : 'تبادل وحجز 🔄'})`,
                `Changed campaign phase status to (${newPhase})`,
                { newPhase }
            );
        } catch (error) {
            console.error('Error updating campaign phase:', error);
            toast.error(isAr ? 'فشل تحديث حالة الحملة' : 'Failed to update campaign status');
        }
    };

    const handleSaveSettings = async () => {
        setSettingsSaving(true);
        // Update in memory immediately
        setSystemSettings(prev => ({ ...prev, ...editSettings }));
        try {
            const settingsRef = doc(db, 'system_configs', 'global_settings');
            await setDoc(settingsRef, editSettings, { merge: true });
            toast.success(isAr ? 'تم حفظ الإعدادات بنجاح ✅' : 'Settings saved successfully ✅');
            
            addAuditLog(
                `قام بتحديث الإعدادات العامة للحملة`,
                `Updated general campaign settings`
            );
        } catch {
            toast.error(isAr ? 'فشل حفظ الإعدادات' : 'Failed to save settings');
        } finally {
            setSettingsSaving(false);
        }
    };

    // ── PER-SECTION SAVE ─────────────────────────────────────────
    const handleSaveSectionSettings = async (sectionId, fieldsArray) => {
        setSectionSaving(sectionId);
        const updateData = {};
        fieldsArray.forEach(field => {
            updateData[field] = editSettings[field] !== undefined ? editSettings[field] : '';
        });
        // ✅ Update in memory IMMEDIATELY — new passwords/codes work right away in the same session
        setSystemSettings(prev => ({ ...prev, ...updateData }));
        try {
            const settingsRef = doc(db, 'system_configs', 'global_settings');
            // setDoc with merge works even if the document doesn't exist yet
            await setDoc(settingsRef, updateData, { merge: true });
            toast.success(isAr ? 'تم الحفظ بنجاح ✅' : 'Saved ✅');
            
            addAuditLog(
                `قام بتحديث إعدادات القسم (${sectionId})`,
                `Updated settings for section (${sectionId})`,
                { sectionId }
            );
        } catch {
            toast.error(isAr ? 'فشل الحفظ — البيانات مُحدَّثة محلياً' : 'Save failed — data updated locally');
        } finally {
            setSectionSaving('');
        }
    };

    // ── ARCHIVE FUNCTIONS ─────────────────────────────────────────
    const fetchArchives = async () => {
        setArchivesLoading(true);
        try {
            const q = query(collection(db, 'campaignArchives'), orderBy('archivedAt', 'desc'));
            const snap = await getDocs(q);
            setArchives(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.error('Error fetching archives:', e);
        } finally {
            setArchivesLoading(false);
        }
    };

    // ── AUDIT LOG FUNCTIONS ───────────────────────────────────────
    const addAuditLog = async (actionAr, actionEn, details = {}) => {
        if (!loggedInUser) return;
        try {
            await addDoc(collection(db, 'materialExchangeLogs'), {
                operatorId: loggedInUser.username,
                operatorNameAr: loggedInUser.nameAr || loggedInUser.username,
                operatorNameEn: loggedInUser.nameEn || loggedInUser.username,
                actionAr,
                actionEn,
                details,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            console.error('Error adding audit log:', error);
        }
    };

    const fetchAuditLogs = async () => {
        setLogsLoading(true);
        try {
            const q = query(
                collection(db, 'materialExchangeLogs'), 
                orderBy('timestamp', 'desc'),
                limit(50)
            );
            const snapshot = await getDocs(q);
            setAuditLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLogsLoading(false);
        }
    };

    const handleArchiveCampaign = async () => {
        if (!archiveName.trim()) {
            toast.error(isAr ? 'يرجى إدخال اسم الأرشيف' : 'Please enter an archive name');
            return;
        }
        try {
            await addDoc(collection(db, 'campaignArchives'), {
                label: archiveName.trim(),
                archivedAt: new Date(),
                totalDonations: allDonations.length,
                donationsData: allDonations.map(d => ({
                    id: d.id || '',
                    studentName: d.studentName || '',
                    phoneNumber: d.phoneNumber || '',
                    studentGender: d.studentGender || '',
                    status: d.status || '',
                    materials: (d.materials || []).map(m => {
                        if (typeof m === 'object' && m !== null) {
                            return {
                                name: m.name || '',
                                description: m.description || '',
                                status: m.status || 'pending',
                                takerInfo: m.takerInfo ? {
                                    name: m.takerInfo.name || '',
                                    phone: m.takerInfo.phone || '',
                                    gender: m.takerInfo.gender || ''
                                } : null
                            };
                        }
                        return { name: String(m), description: '', status: 'pending', takerInfo: null };
                    }),
                    createdAt: d.createdAt || null
                }))
            });

            // Delete all current active donations from materialDonations collection
            const deletePromises = allDonations.map(d => deleteDoc(doc(db, 'materialDonations', d.id)));
            await Promise.all(deletePromises);

            toast.success(isAr
                ? `✅ تم أرشفة ${allDonations.length} تبرع بنجاح تحت "${archiveName.trim()}"`
                : `✅ Archived ${allDonations.length} donations as "${archiveName.trim()}"`);
            setShowArchiveModal(false);
            setArchiveName('');
            fetchArchives();
            fetchDonations();
            fetchAllDonations();
            
            addAuditLog(
                `قام بأرشفة كافة التبرعات (${allDonations.length}) تحت اسم الأرشيف "${archiveName.trim()}" وبدء دورة جديدة`,
                `Archived all active donations (${allDonations.length}) under archive label "${archiveName.trim()}" and started a new cycle`,
                { archiveName: archiveName.trim(), count: allDonations.length }
            );
        } catch (e) {
            console.error('Archive error:', e);
            toast.error(isAr ? 'فشلت عملية الأرشفة' : 'Archiving failed');
        }
    };

    // ── EXPORT FUNCTIONS ──────────────────────────────────────────
    const exportToCSV = (donations, filename) => {
        const headersAr = ['الاسم', 'الهاتف', 'الجنس', 'المواد', 'الحالة'];
        const headersEn = ['Name', 'Phone', 'Gender', 'Materials', 'Status'];
        const headers = isAr ? headersAr : headersEn;
        const statusMap = {
            pending:   isAr ? 'معلق' : 'Pending',
            approved:  isAr ? 'معتمد' : 'Approved',
            reserved:  isAr ? 'محجوز' : 'Reserved',
            completed: isAr ? 'مكتمل' : 'Completed'
        };
        const rows = donations.map(d => [
            d.studentName || '',
            d.phoneNumber || '',
            d.studentGender === 'male' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female'),
            (d.materials || []).map(m => typeof m === 'object' ? m.name : m).join(' | '),
            statusMap[d.status] || d.status || ''
        ]);
        const csv = [headers, ...rows]
            .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(isAr ? '✅ تم تصدير ملف Excel/CSV' : '✅ CSV exported');
    };

    const exportToPDF = (donations, filename) => {
        const statusMap = {
            pending:   isAr ? 'معلق' : 'Pending',
            approved:  isAr ? 'معتمد' : 'Approved',
            reserved:  isAr ? 'محجوز' : 'Reserved',
            completed: isAr ? 'مكتمل' : 'Completed'
        };
        const tableRows = donations.map(d => `
            <tr>
                <td>${d.studentName || ''}</td>
                <td dir="ltr">${d.phoneNumber || ''}</td>
                <td>${d.studentGender === 'male' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female')}</td>
                <td>${(d.materials || []).map(m => typeof m === 'object' ? m.name : m).join(', ')}</td>
                <td>${statusMap[d.status] || d.status || ''}</td>
            </tr>`).join('');
        const title = isAr ? 'جدول تبرعات المواد الدراسية' : 'Material Donations Table';
        const dateStr = new Date().toLocaleDateString(isAr ? 'ar-JO' : 'en-US');
        const win = window.open('', '_blank');
        win.document.write(`<!DOCTYPE html><html dir="${isAr ? 'rtl' : 'ltr'}">
<head><meta charset="utf-8"><title>${filename}</title><style>
body{font-family:'Arial',sans-serif;padding:24px;direction:${isAr ? 'rtl' : 'ltr'};}
h2{color:#2c3e50;border-bottom:3px solid #27ae60;padding-bottom:8px;}
.meta{color:#666;margin-bottom:16px;font-size:14px;}
table{width:100%;border-collapse:collapse;margin-top:12px;}
th{background:linear-gradient(135deg,#27ae60,#2ecc71);color:#fff;padding:10px 8px;text-align:${isAr ? 'right' : 'left'};}
td{padding:9px 8px;border-bottom:1px solid #eee;}
tr:nth-child(even){background:#f8fffe;}
.no-print{margin-bottom:16px;}
@media print{.no-print{display:none;} body{padding:0;}}
</style></head>
<body>
<button class="no-print" onclick="window.print()" style="padding:8px 20px;background:#27ae60;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:15px;">
🖨️ ${isAr ? 'طباعة / حفظ PDF' : 'Print / Save as PDF'}</button>
<h2>📚 ${title}</h2>
<p class="meta">📅 ${isAr ? 'تاريخ التصدير:' : 'Export Date:'} ${dateStr} &nbsp;|&nbsp; 📦 ${isAr ? 'عدد التبرعات:' : 'Total:'} ${donations.length}</p>
<table><thead><tr>
<th>${isAr ? 'الاسم' : 'Name'}</th><th>${isAr ? 'الهاتف' : 'Phone'}</th>
<th>${isAr ? 'الجنس' : 'Gender'}</th><th>${isAr ? 'المواد' : 'Materials'}</th>
<th>${isAr ? 'الحالة' : 'Status'}</th>
</tr></thead><tbody>${tableRows}</tbody></table>
</body></html>`);
        win.document.close();
        toast.success(isAr ? '✅ تم فتح نافذة الطباعة' : '✅ Print window opened');
    };

    const getCoordinatorTasks = () => {
        if (!loggedInUser) return [];
        let tasksStr = systemSettings.sharedCoordinatorTasks || '';
        if (loggedInUser.gender === 'male')   tasksStr += '\n' + (systemSettings.coordinatorMaleTasks   || '');
        if (loggedInUser.gender === 'female')  tasksStr += '\n' + (systemSettings.coordinatorFemaleTasks || '');
        if (loggedInUser.role === 'admin') {
            tasksStr = '👥 مهام عامة:\n' + (systemSettings.sharedCoordinatorTasks || '—') +
                       '\n♂️ مهام أحمد:\n' + (systemSettings.coordinatorMaleTasks   || '—') +
                       '\n♀️ مهام سارة:\n' + (systemSettings.coordinatorFemaleTasks  || '—');
        }
        return tasksStr.split('\n').map(t => t.trim()).filter(Boolean);
    };

    const getDashboardAlerts = () => {
        const alerts = [];
        const pending = allDonations.filter(d => d.status === 'pending');
        if (pending.length > 0) {
            alerts.push({
                type: 'warning',
                icon: '⏳',
                text: isAr ? `${pending.length} طلب تبرع بانتظار المراجعة` : `${pending.length} donation(s) pending review`
            });
        }
        const tasks = getCoordinatorTasks();
        const unchecked = tasks.filter((_, i) => !checkedTasks.has(i));
        if (unchecked.length > 0) {
            alerts.push({
                type: 'info',
                icon: '📋',
                text: isAr ? `لديك ${unchecked.length} مهمة لم تكتمل بعد` : `You have ${unchecked.length} incomplete task(s)`
            });
        }
        return alerts;
    };

    // Derived
    const availableMaterials = allMaterials.filter(m => !m.isReserved && ['approved', 'pending'].includes(m.materialItem.status));
    const reservedMaterials  = allMaterials.filter(m => m.materialItem.status === 'reserved');

    // ── STAFF DASHBOARD ───────────────────────────────────────────
    if (loggedInUser) {
        const staffUsersDynamic = {
            admin: { role: 'admin',       nameAr: 'الأدمن', nameEn: 'Admin', gender: null     },
            ahmad: { role: 'coordinator', nameAr: systemSettings.ahmadNameAr || 'أحمد', nameEn: systemSettings.ahmadNameEn || 'Ahmad', gender: 'male'   },
            sara:  { role: 'coordinator', nameAr: systemSettings.saraNameAr || 'سارة', nameEn: systemSettings.saraNameEn || 'Sara',  gender: 'female' }
        };
        const isAdminUser       = loggedInUser.role === 'admin';
        const totalDonations    = allDonations.length;
        const pendingDonations  = allDonations.filter(d => d.status === 'pending');
        const approvedDonations = allDonations.filter(d => d.status === 'approved');
        const coordinatorTasks  = getCoordinatorTasks();
        const dashAlerts        = getDashboardAlerts();
        const reservedCount     = allDonations.reduce((acc, d) => {
            const mats = d.materials || [];
            return acc + mats.filter(m => (typeof m === 'object' ? m.status : d.status) === 'reserved').length;
        }, 0);

        return (
            <div className="material-exchange-page staff-mode">
                <div className="staff-dashboard-container">

                    {/* ─── Gradient Header ──────────────────────── */}
                    <div className="dashboard-header-card">
                        <div className="dashboard-header-left">
                            <div className="dashboard-title-group">
                                <h1 className="dashboard-main-title">
                                    🏛️ {isAr ? 'لوحة إدارة حملة التبادل' : 'Exchange Campaign Dashboard'}
                                </h1>
                                <p className="dashboard-subtitle">
                                    {isAr ? 'مرحباً،' : 'Welcome,'}{' '}
                                    <strong>{isAr ? (staffUsersDynamic[loggedInUser.username]?.nameAr || loggedInUser.nameAr) : (staffUsersDynamic[loggedInUser.username]?.nameEn || loggedInUser.nameEn)}</strong>
                                    <span className={`user-role-badge role-${loggedInUser.role}`}>
                                        {isAr
                                            ? (isAdminUser ? '👑 أدمن' : '🎯 منسق')
                                            : (isAdminUser ? '👑 Admin' : '🎯 Coordinator')}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="dashboard-header-right">
                            <button className="dashboard-refresh-btn" onClick={fetchAllDonations} title={isAr ? 'تحديث' : 'Refresh'}>
                                🔄
                            </button>
                            <button className="dashboard-logout-btn" onClick={handleLogout}>
                                🚪 {isAr ? 'خروج' : 'Logout'}
                            </button>
                        </div>
                    </div>

                    {/* ─── Stats Row ────────────────────────────── */}
                    <div className="dashboard-stats-row">
                        <div className="stat-card" style={{'--stat-color':'#3498db','--stat-rgb':'52,152,219'}}>
                            <div className="stat-icon">📦</div>
                            <div className="stat-info">
                                <span className="stat-value">{totalDonations}</span>
                                <span className="stat-label">{isAr ? 'إجمالي التبرعات' : 'Total Donations'}</span>
                            </div>
                        </div>
                        <div className="stat-card" style={{'--stat-color':'#f39c12','--stat-rgb':'243,156,18'}}>
                            <div className="stat-icon">⏳</div>
                            <div className="stat-info">
                                <span className="stat-value">{pendingDonations.length}</span>
                                <span className="stat-label">{isAr ? 'بانتظار المراجعة' : 'Pending'}</span>
                            </div>
                        </div>
                        <div className="stat-card" style={{'--stat-color':'#2ecc71','--stat-rgb':'46,204,113'}}>
                            <div className="stat-icon">✅</div>
                            <div className="stat-info">
                                <span className="stat-value">{approvedDonations.length}</span>
                                <span className="stat-label">{isAr ? 'معتمدة' : 'Approved'}</span>
                            </div>
                        </div>
                        <div className="stat-card" style={{'--stat-color':'#9b59b6','--stat-rgb':'155,89,182'}}>
                            <div className="stat-icon">🔒</div>
                            <div className="stat-info">
                                <span className="stat-value">{reservedCount}</span>
                                <span className="stat-label">{isAr ? 'مواد محجوزة' : 'Reserved'}</span>
                            </div>
                        </div>
                    </div>

                    {/* ─── Alerts & Tasks ───────────────────────── */}
                    <div className="dashboard-alerts-board">
                        <div className="alerts-board-header">
                            <span className="alerts-board-icon">🔔</span>
                            <h2>{isAr ? 'الإشعارات والمهام المطلوبة' : 'Notifications & Required Tasks'}</h2>
                        </div>
                        <div className="alerts-board-body">
                            {dashAlerts.length > 0 && (
                                <div className="alerts-list">
                                    {dashAlerts.map((alert, i) => (
                                        <div key={i} className={`alert-item alert-${alert.type}`}>
                                            <span className="alert-icon">{alert.icon}</span>
                                            <span className="alert-text">{alert.text}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {coordinatorTasks.length > 0 ? (
                                <div className="tasks-checklist">
                                    <h3 className="tasks-title">
                                        📋 {isAr ? 'مهامك' : 'Your Tasks'}
                                    </h3>
                                    <ul className="tasks-list">
                                        {coordinatorTasks.map((task, i) => (
                                            <li
                                                key={i}
                                                className={`task-item ${checkedTasks.has(i) ? 'task-done' : ''}`}
                                                onClick={() => setCheckedTasks(prev => {
                                                    const next = new Set(prev);
                                                    next.has(i) ? next.delete(i) : next.add(i);
                                                    return next;
                                                })}
                                            >
                                                <span className="task-checkbox">{checkedTasks.has(i) ? '✅' : '⬜'}</span>
                                                <span className="task-text">{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="no-tasks-placeholder">
                                    <span>💼</span>
                                    <p>{isAr ? 'لا توجد مهام محددة حالياً' : 'No tasks assigned yet'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ─── Tabs ─────────────────────────────────── */}
                    <div className="dashboard-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('donations')}
                        >
                            📦 {isAr ? 'إدارة التبرعات' : 'Manage Donations'}
                            {pendingDonations.length > 0 && (
                                <span className="tab-badge">{pendingDonations.length}</span>
                            )}
                        </button>
                        {isAdminUser && (
                            <button
                                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                ⚙️ {isAr ? 'الإعدادات' : 'Settings'}
                            </button>
                        )}
                        {isAdminUser && (
                            <button
                                className={`tab-btn ${activeTab === 'archive' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('archive'); fetchArchives(); }}
                            >
                                🗄️ {isAr ? 'أرشيف الحملات' : 'Campaign Archive'}
                                {archives.length > 0 && (
                                    <span className="tab-badge archive-badge">{archives.length}</span>
                                )}
                            </button>
                        )}
                    </div>

                    {/* ─── Tab Content ──────────────────────────── */}
                    <div className="dashboard-content">

                        {/* DONATIONS TAB */}
                        {activeTab === 'donations' && (
                            <div className="donations-management">
                                
                                {/* ─── Sub-Filters / Selection Group ─── */}
                                {isAdminUser ? (
                                    <div className="admin-gender-filter">
                                        <button 
                                            className={`filter-pill ${adminSubFilter === 'all' ? 'active' : ''}`}
                                            onClick={() => setAdminSubFilter('all')}
                                        >
                                            👥 {isAr ? 'كل التبرعات' : 'All Donations'}
                                        </button>
                                        <button 
                                            className={`filter-pill ${adminSubFilter === 'ahmad' ? 'active' : ''}`}
                                            onClick={() => setAdminSubFilter('ahmad')}
                                        >
                                            ♂️ {isAr ? `قسم الذكور (المنسق: ${systemSettings.ahmadNameAr || 'أحمد'})` : `Male Section (${systemSettings.ahmadNameEn || 'Ahmad'})`}
                                        </button>
                                        <button 
                                            className={`filter-pill ${adminSubFilter === 'sara' ? 'active' : ''}`}
                                            onClick={() => setAdminSubFilter('sara')}
                                        >
                                            ♀️ {isAr ? `قسم الإناث (المنسقة: ${systemSettings.saraNameAr || 'سارة'})` : `Female Section (${systemSettings.saraNameEn || 'Sara'})`}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="coordinator-tabs-group">
                                        <button 
                                            className={`coord-tab-btn ${coordinatorSubTab === 'delegated' ? 'active' : ''}`}
                                            onClick={() => setCoordinatorSubTab('delegated')}
                                        >
                                            ⚡ {isAr ? 'المواد المفوضة لي (صلاحية كاملة)' : 'My Delegated Materials (Full Control)'}
                                        </button>
                                        <button 
                                            className={`coord-tab-btn ${coordinatorSubTab === 'main' ? 'active' : ''}`}
                                            onClick={() => setCoordinatorSubTab('main')}
                                        >
                                            👁️ {isAr ? 'الجدول الرئيسي لقسمك (للاطلاع فقط)' : 'Main Section Table (View Only)'}
                                        </button>
                                    </div>
                                )}

                                {/* ─── Export Toolbar ─── */}
                                {(() => {
                                    const exportDonations = isAdminUser
                                        ? (adminSubFilter === 'all'
                                            ? allDonations
                                            : adminSubFilter === 'ahmad'
                                                ? allDonations.filter(d => d.studentGender === 'male')
                                                : allDonations.filter(d => d.studentGender === 'female'))
                                        : allDonations.filter(d =>
                                            coordinatorSubTab === 'delegated'
                                                ? d.delegatedTo === loggedInUser.username
                                                : d.studentGender === loggedInUser.gender && (!d.delegatedTo || d.delegatedTo === loggedInUser.username)
                                          );
                                    const exportLabel = isAdminUser
                                        ? (adminSubFilter === 'all' ? 'all' : adminSubFilter === 'ahmad' ? (systemSettings.ahmadNameAr || 'أحمد') : (systemSettings.saraNameAr || 'سارة'))
                                        : (isAr ? loggedInUser.nameAr : loggedInUser.nameEn);
                                    return (
                                        <div className="export-toolbar">
                                            <span className="export-toolbar-label">
                                                📊 {isAr ? `تصدير (${exportDonations.length} سجل)` : `Export (${exportDonations.length} records)`}
                                            </span>
                                            <button
                                                className="export-btn export-csv-btn"
                                                onClick={() => exportToCSV(exportDonations, `donations-${exportLabel}`)}
                                                title={isAr ? 'تصدير إلى Excel/CSV' : 'Export to Excel/CSV'}
                                            >
                                                📊 {isAr ? 'تصدير Excel' : 'Export Excel'}
                                            </button>
                                            <button
                                                className="export-btn export-pdf-btn"
                                                onClick={() => exportToPDF(exportDonations, `donations-${exportLabel}`)}
                                                title={isAr ? 'طباعة / تصدير PDF' : 'Print / Export PDF'}
                                            >
                                                🖨️ {isAr ? 'طباعة / PDF' : 'Print / PDF'}
                                            </button>
                                        </div>
                                    );
                                })()}

                                {dashboardLoading ? (
                                    <div className="dashboard-loading">
                                        <div className="loading-spinner"></div>
                                        <p>{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Pending */}
                                        <div className="donations-section">
                                            <h3 className="section-label pending-label">
                                                ⏳ {isAr ? 'طلبات بانتظار المراجعة' : 'Pending Review'}
                                                <span className="count-badge">
                                                    {
                                                        isAdminUser 
                                                            ? (adminSubFilter === 'all' 
                                                                ? allDonations.filter(d => d.status === 'pending').length 
                                                                : adminSubFilter === 'ahmad' 
                                                                    ? allDonations.filter(d => d.status === 'pending' && d.studentGender === 'male').length
                                                                    : allDonations.filter(d => d.status === 'pending' && d.studentGender === 'female').length)
                                                            : (coordinatorSubTab === 'delegated'
                                                                ? allDonations.filter(d => d.status === 'pending' && d.delegatedTo === loggedInUser.username).length
                                                                : allDonations.filter(d => d.status === 'pending' && d.studentGender === loggedInUser.gender && (!d.delegatedTo || d.delegatedTo === loggedInUser.username)).length)
                                                    }
                                                </span>
                                            </h3>
                                            {
                                                ((isAdminUser && adminSubFilter === 'all' && allDonations.filter(d => d.status === 'pending').length === 0) ||
                                                 (isAdminUser && adminSubFilter === 'ahmad' && allDonations.filter(d => d.status === 'pending' && d.studentGender === 'male').length === 0) ||
                                                 (isAdminUser && adminSubFilter === 'sara' && allDonations.filter(d => d.status === 'pending' && d.studentGender === 'female').length === 0) ||
                                                 (!isAdminUser && coordinatorSubTab === 'delegated' && allDonations.filter(d => d.status === 'pending' && d.delegatedTo === loggedInUser.username).length === 0) ||
                                                 (!isAdminUser && coordinatorSubTab === 'main' && allDonations.filter(d => d.status === 'pending' && d.studentGender === loggedInUser.gender && (!d.delegatedTo || d.delegatedTo === loggedInUser.username)).length === 0)) ? (
                                                    <div className="empty-state">✅ {isAr ? 'لا توجد طلبات معلقة' : 'No pending requests'}</div>
                                                ) : (
                                                <div className="donations-table-wrapper">
                                                    <table className="donations-table">
                                                        <thead>
                                                            <tr>
                                                                <th>{isAr ? 'الطالب المتبرع' : 'Donor Student'}</th>
                                                                <th>{isAr ? 'الجنس' : 'Gender'}</th>
                                                                <th>{isAr ? 'الهاتف' : 'Phone'}</th>
                                                                <th>{isAr ? 'المواد' : 'Materials'}</th>
                                                                <th>{isAr ? 'حالة التبرع' : 'Donation Status'}</th>
                                                                {isAdminUser && <th>{isAr ? 'التفويض للمنسقين' : 'Coordinators Delegation'}</th>}
                                                                <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {(isAdminUser 
                                                                ? (adminSubFilter === 'all' 
                                                                    ? allDonations.filter(d => d.status === 'pending')
                                                                    : adminSubFilter === 'ahmad' 
                                                                        ? allDonations.filter(d => d.status === 'pending' && d.studentGender === 'male')
                                                                        : allDonations.filter(d => d.status === 'pending' && d.studentGender === 'female'))
                                                                : (coordinatorSubTab === 'delegated' ? allDonations.filter(d => d.status === 'pending' && d.delegatedTo === loggedInUser.username) : allDonations.filter(d => d.status === 'pending' && d.studentGender === loggedInUser.gender && (!d.delegatedTo || d.delegatedTo === loggedInUser.username)))
                                                            ).map(donation => (
                                                                <tr key={donation.id}>
                                                                    <td><strong>{donation.studentName}</strong></td>
                                                                    <td>
                                                                        <span className={`gender-badge gender-${donation.studentGender}`}>
                                                                            {donation.studentGender === 'male' ? (isAr ? '♂️ ذكر' : '♂️ Male') : (isAr ? '♀️ أنثى' : '♀️ Female')}
                                                                        </span>
                                                                    </td>
                                                                    <td dir="ltr">{donation.phoneNumber}</td>
                                                                    <td>
                                                                        {(donation.materials || []).map((m, i) => (
                                                                            <span key={i} className="material-chip">
                                                                                {typeof m === 'object' ? m.name : m}
                                                                            </span>
                                                                        ))}
                                                                    </td>
                                                                    <td>
                                                                        <span className="status-badge status-pending">
                                                                            {isAr ? 'معلق' : 'Pending'}
                                                                        </span>
                                                                    </td>
                                                                    {isAdminUser && (
                                                                        <td>
                                                                            {donation.publishedToCoordinators ? (
                                                                                <div className="delegation-cell">
                                                                                    <span className="delegated-to-badge">
                                                                                        {donation.delegatedTo === 'ahmad'
                                                                                            ? `♂️ ${systemSettings.ahmadNameAr || 'أحمد'}`
                                                                                            : donation.delegatedTo === 'sara'
                                                                                                ? `♀️ ${systemSettings.saraNameAr || 'سارة'}`
                                                                                            : '📢 مفوّض'}
                                                                                    </span>
                                                                                    <button
                                                                                        className="action-btn revoke-btn"
                                                                                        onClick={() => handleRevokeDelegation(donation.id)}
                                                                                    >
                                                                                        🔄 {isAr ? 'إلغاء' : 'Revoke'}
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    className="action-btn publish-btn"
                                                                                    onClick={() => handleOpenDelegateModal(donation)}
                                                                                >
                                                                                    📢 {isAr ? 'تفويض للمنسق' : 'Delegate'}
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    )}
                                                                    <td className="actions-cell">
                                                                        {(isAdminUser || (!isAdminUser && coordinatorSubTab === 'delegated')) ? (
                                                                            <>
                                                                                <button className="action-btn approve-btn" onClick={() => handleApproveDonation(donation.id)}>
                                                                                    ✅ {isAr ? 'موافقة' : 'Approve'}
                                                                                </button>
                                                                                <button className="action-btn edit-btn" onClick={() => { setSelectedDonationForEdit(JSON.parse(JSON.stringify(donation))); setShowEditModal(true); }}>
                                                                                    ✏️ {isAr ? 'تعديل' : 'Edit'}
                                                                                </button>
                                                                                <button className="action-btn delete-btn" onClick={() => handleDeleteDonation(donation.id)}>
                                                                                    🗑️ {isAr ? 'حذف' : 'Delete'}
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <span className="view-only-tag">👁️ {isAr ? 'للاطلاع فقط' : 'View Only'}</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>

                                        {/* Approved & Reserved */}
                                        <div className="donations-section">
                                            <h3 className="section-label approved-label">
                                                ✅ {isAr ? 'التبرعات المعتمدة، المحجوزة والمستلمة' : 'Approved, Reserved & Completed Donations'}
                                                <span className="count-badge">
                                                    {
                                                        isAdminUser 
                                                            ? (adminSubFilter === 'all' 
                                                                ? allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status)).length 
                                                                : adminSubFilter === 'ahmad' 
                                                                    ? allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.studentGender === 'male').length
                                                                    : allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.studentGender === 'female').length)
                                                            : (coordinatorSubTab === 'delegated' ? allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.delegatedTo === loggedInUser.username).length : allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.studentGender === loggedInUser.gender && (!d.delegatedTo || d.delegatedTo === loggedInUser.username)).length)
                                                    }
                                                </span>
                                            </h3>
                                            {
                                                ((isAdminUser && adminSubFilter === 'all' && allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status)).length === 0) ||
                                                 (isAdminUser && adminSubFilter === 'ahmad' && allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.studentGender === 'male').length === 0) ||
                                                 (isAdminUser && adminSubFilter === 'sara' && allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.studentGender === 'female').length === 0) ||
                                                 (!isAdminUser && coordinatorSubTab === 'delegated' && allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.delegatedTo === loggedInUser.username).length === 0) || (!isAdminUser && coordinatorSubTab === 'main' && allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.studentGender === loggedInUser.gender && (!d.delegatedTo || d.delegatedTo === loggedInUser.username)).length === 0)) ? (
                                                    <div className="empty-state">📦 {isAr ? 'لا توجد تبرعات معتمدة بعد' : 'No approved donations yet'}</div>
                                                ) : (
                                                <div className="donations-table-wrapper">
                                                    <table className="donations-table">
                                                        <thead>
                                                            <tr>
                                                                <th>{isAr ? 'الطالب المتبرع' : 'Donor Student'}</th>
                                                                <th>{isAr ? 'الجنس' : 'Gender'}</th>
                                                                <th>{isAr ? 'الهاتف' : 'Phone'}</th>
                                                                <th>{isAr ? 'المواد' : 'Materials'}</th>
                                                                <th>{isAr ? 'الحالة' : 'Status'}</th>
                                                                {isAdminUser && <th>{isAr ? 'التفويض للمنسقين' : 'Coordinators Delegation'}</th>}
                                                                <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {(isAdminUser 
                                                                ? (adminSubFilter === 'all' 
                                                                    ? allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status))
                                                                    : adminSubFilter === 'ahmad' 
                                                                        ? allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.studentGender === 'male')
                                                                        : allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.studentGender === 'female'))
                                                                : (coordinatorSubTab === 'delegated' ? allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.delegatedTo === loggedInUser.username) : allDonations.filter(d => ['approved', 'reserved', 'completed'].includes(d.status) && d.studentGender === loggedInUser.gender && (!d.delegatedTo || d.delegatedTo === loggedInUser.username)))
                                                            ).map(donation => (
                                                                <tr key={donation.id}>
                                                                    <td><strong>{donation.studentName}</strong></td>
                                                                    <td>
                                                                        <span className={`gender-badge gender-${donation.studentGender}`}>
                                                                            {donation.studentGender === 'male' ? (isAr ? '♂️ ذكر' : '♂️ Male') : (isAr ? '♀️ أنثى' : '♀️ Female')}
                                                                        </span>
                                                                    </td>
                                                                    <td dir="ltr">{donation.phoneNumber}</td>
                                                                    <td>
                                                                        {(donation.materials || []).map((m, i) => {
                                                                            const status = typeof m === 'object' ? m.status : '';
                                                                            return (
                                                                                <span key={i} className={`material-chip ${status === 'reserved' ? 'chip-reserved' : status === 'completed' ? 'chip-completed' : ''}`}>
                                                                                    {typeof m === 'object' ? m.name : m}
                                                                                    {status === 'reserved' && ' 🔒'}
                                                                                    {status === 'completed' && ' ✅'}
                                                                                </span>
                                                                            );
                                                                        })}
                                                                    </td>
                                                                    <td>
                                                                        <span className={`status-badge status-${donation.status}`}>
                                                                            {donation.status === 'reserved' ? (isAr ? '🔒 محجوز' : '🔒 Reserved') :
                                                                             donation.status === 'approved' ? (isAr ? '✅ معتمد' : '✅ Approved') :
                                                                             donation.status === 'completed' ? (isAr ? '📦 تم التسليم' : '📦 Completed') :
                                                                             donation.status}
                                                                        </span>
                                                                    </td>
                                                                    {isAdminUser && (
                                                                        <td>
                                                                            {donation.publishedToCoordinators ? (
                                                                                <div className="delegation-cell">
                                                                                    <span className="delegated-to-badge">
                                                                                        {donation.delegatedTo === 'ahmad'
                                                                                            ? `♂️ ${systemSettings.ahmadNameAr || 'أحمد'}`
                                                                                            : donation.delegatedTo === 'sara'
                                                                                                ? `♀️ ${systemSettings.saraNameAr || 'سارة'}`
                                                                                            : '📢 مفوّض'}
                                                                                    </span>
                                                                                    <button
                                                                                        className="action-btn revoke-btn"
                                                                                        onClick={() => handleRevokeDelegation(donation.id)}
                                                                                    >
                                                                                        🔄 {isAr ? 'إلغاء' : 'Revoke'}
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    className="action-btn publish-btn"
                                                                                    onClick={() => handleOpenDelegateModal(donation)}
                                                                                >
                                                                                    📢 {isAr ? 'تفويض للمنسق' : 'Delegate'}
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    )}
                                                                    <td className="actions-cell">
                                                                        {(isAdminUser || (!isAdminUser && coordinatorSubTab === 'delegated')) ? (
                                                                            <>
                                                                                <button className="action-btn edit-btn" onClick={() => { setSelectedDonationForEdit(JSON.parse(JSON.stringify(donation))); setShowEditModal(true); }}>
                                                                                    ✏️ {isAr ? 'تعديل' : 'Edit'}
                                                                                </button>
                                                                                <button className="action-btn delete-btn" onClick={() => handleDeleteDonation(donation.id)}>
                                                                                    🗑️ {isAr ? 'حذف' : 'Delete'}
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <span className="view-only-tag">👁️ {isAr ? 'للاطلاع فقط' : 'View Only'}</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* SETTINGS TAB (Admin only) */}
                        {activeTab === 'settings' && isAdminUser && (
                            <div className="settings-panel">
                                <h3 className="settings-title">⚙️ {isAr ? 'إعدادات النظام' : 'System Settings'}</h3>

                                {/* ─── Campaign Control Center ─── */}
                                <div className="campaign-control-card">
                                    <div className="campaign-control-header">
                                        <div className="campaign-control-title-group">
                                            <span className="campaign-control-icon">🚀</span>
                                            <div>
                                                <h4>{isAr ? 'مركز التحكم بحالة الحملة' : 'Campaign Control Center'}</h4>
                                                <p className="campaign-control-desc">{isAr ? 'تحكم في مرحلة الحملة الحالية — التغييرات تنعكس فوراً على الموقع' : 'Control the active campaign phase — changes reflect instantly'}</p>
                                            </div>
                                        </div>
                                        <div className="campaign-current-badge">
                                            <span className="current-badge-label">{isAr ? 'الحالة الآن' : 'Now'}</span>
                                            <span className={`status-pill phase-${systemSettings.campaignPhase}`}>
                                                {systemSettings.campaignPhase === 'suspended' && (isAr ? '🛑 موقوفة' : '🛑 Suspended')}
                                                {systemSettings.campaignPhase === 'collection' && (isAr ? '📥 جمع وتبرع' : '📥 Collection')}
                                                {systemSettings.campaignPhase === 'exchange' && (isAr ? '🔄 تبادل وحجز' : '🔄 Exchange')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="campaign-phases-row">
                                        {/* Phase 1: Suspended */}
                                        <button
                                            className={`phase-card ${systemSettings.campaignPhase === 'suspended' ? 'phase-active phase-active-suspended' : ''}`}
                                            onClick={() => handleUpdateCampaignPhase('suspended')}
                                        >
                                            <span className="phase-card-icon">🛑</span>
                                            <span className="phase-card-title">{isAr ? 'إيقاف الحملة' : 'Suspend'}</span>
                                            <span className="phase-card-desc">{isAr ? 'النموذج والحجز معطّلان' : 'Form & booking disabled'}</span>
                                            {systemSettings.campaignPhase === 'suspended' && <span className="phase-active-dot"></span>}
                                        </button>

                                        {/* Arrow */}
                                        <span className="phase-arrow">›</span>

                                        {/* Phase 2: Collection */}
                                        <button
                                            className={`phase-card ${systemSettings.campaignPhase === 'collection' ? 'phase-active phase-active-collection' : ''}`}
                                            onClick={() => handleUpdateCampaignPhase('collection')}
                                        >
                                            <span className="phase-card-icon">📥</span>
                                            <span className="phase-card-title">{isAr ? 'جمع المواد' : 'Collection'}</span>
                                            <span className="phase-card-desc">{isAr ? 'النموذج مفعّل، الحجز لاحقاً' : 'Form active, booking later'}</span>
                                            {systemSettings.campaignPhase === 'collection' && <span className="phase-active-dot"></span>}
                                        </button>

                                        {/* Arrow */}
                                        <span className="phase-arrow">›</span>

                                        {/* Phase 3: Exchange */}
                                        <button
                                            className={`phase-card ${systemSettings.campaignPhase === 'exchange' ? 'phase-active phase-active-exchange' : ''}`}
                                            onClick={() => handleUpdateCampaignPhase('exchange')}
                                        >
                                            <span className="phase-card-icon">🔄</span>
                                            <span className="phase-card-title">{isAr ? 'تبادل المواد' : 'Exchange'}</span>
                                            <span className="phase-card-desc">{isAr ? 'الحجز مفتوح للطلاب' : 'Booking open for students'}</span>
                                            {systemSettings.campaignPhase === 'exchange' && <span className="phase-active-dot"></span>}
                                        </button>
                                    </div>

                                    {/* Campaign messages in-place editor */}
                                    <div className="campaign-messages-row">
                                        <div className="settings-field">
                                            <label>🔔 {isAr ? 'رسالة الإيقاف (عربي)' : 'Suspension Message (AR)'}</label>
                                            <textarea className="settings-textarea" rows="2"
                                                value={editSettings.exchangeSuspendedMessageAr || ''}
                                                onChange={e => setEditSettings(p => ({ ...p, exchangeSuspendedMessageAr: e.target.value }))} />
                                        </div>
                                        <div className="settings-field">
                                            <label>🔔 {isAr ? 'رسالة الإيقاف (إنجليزي)' : 'Suspension Message (EN)'}</label>
                                            <textarea className="settings-textarea" rows="2"
                                                value={editSettings.exchangeSuspendedMessageEn || ''}
                                                onChange={e => setEditSettings(p => ({ ...p, exchangeSuspendedMessageEn: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="card-save-row">
                                        <button
                                            className="card-save-btn"
                                            onClick={() => handleSaveSectionSettings('messages', ['exchangeSuspendedMessageAr','exchangeSuspendedMessageEn'])}
                                            disabled={sectionSaving === 'messages'}
                                        >
                                            {sectionSaving === 'messages' ? '⏳' : '💾'} {isAr ? 'حفظ الرسائل' : 'Save Messages'}
                                        </button>
                                    </div>
                                </div>

                                {/* ─── Campaign Schedule Card ─── */}
                                <div className="campaign-schedule-card">
                                    <div className="campaign-control-header">
                                        <div className="campaign-control-title-group">
                                            <span className="campaign-control-icon">📅</span>
                                            <div>
                                                <h4>{isAr ? 'جدول توقيت الحملة' : 'Campaign Schedule'}</h4>
                                                <p className="campaign-control-desc">
                                                    {isAr
                                                        ? 'حدد تواريخ بدء وانتهاء كل مرحلة — يُحدَّث العداد التنازلي تلقائياً'
                                                        : 'Set start and end dates for each phase — countdown updates automatically'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="schedule-fields-row">
                                        <div className="settings-field schedule-field">
                                            <label>
                                                <span className="schedule-phase-badge collection-badge">📥</span>
                                                {isAr ? 'انتهاء فترة الجمع والتبرع' : 'Donation / Collection End'}
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className="settings-input schedule-input"
                                                value={editSettings.donationEndTime
                                                    ? editSettings.donationEndTime.substring(0, 16)
                                                    : ''}
                                                onChange={e => setEditSettings(p => ({ ...p, donationEndTime: e.target.value }))}
                                            />
                                            {editSettings.donationEndTime && (
                                                <span className="schedule-preview">
                                                    ⏱ {new Date(editSettings.donationEndTime).toLocaleString(isAr ? 'ar-JO' : 'en-JO', { dateStyle: 'full', timeStyle: 'short' })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="schedule-divider-arrow">›</div>
                                        <div className="settings-field schedule-field">
                                            <label>
                                                <span className="schedule-phase-badge exchange-badge">🔄</span>
                                                {isAr ? 'بدء فترة الحجز والتبادل' : 'Booking / Exchange Start'}
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className="settings-input schedule-input"
                                                value={editSettings.bookingStartTime
                                                    ? editSettings.bookingStartTime.substring(0, 16)
                                                    : ''}
                                                onChange={e => setEditSettings(p => ({ ...p, bookingStartTime: e.target.value }))}
                                            />
                                            {editSettings.bookingStartTime && (
                                                <span className="schedule-preview">
                                                    ⏱ {new Date(editSettings.bookingStartTime).toLocaleString(isAr ? 'ar-JO' : 'en-JO', { dateStyle: 'full', timeStyle: 'short' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="card-save-row">
                                        <button
                                            className="card-save-btn"
                                            onClick={() => handleSaveSectionSettings('schedule', ['donationEndTime', 'bookingStartTime'])}
                                            disabled={sectionSaving === 'schedule'}
                                        >
                                            {sectionSaving === 'schedule' ? '⏳' : '💾'} {isAr ? 'حفظ جدول التوقيت' : 'Save Schedule'}
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-grid">
                                    {/* Passwords Card */}
                                    <div className="settings-card">
                                        <div className="settings-card-header">
                                            <h4>🔐 {isAr ? 'كلمات المرور والوصول' : 'Passwords & Access'}</h4>
                                            <span className="settings-card-hint">{isAr ? 'تُحفظ بشكل مستقل' : 'Saved independently'}</span>
                                        </div>
                                        <div className="settings-field">
                                            <label>🔑 {isAr ? 'كود العبور السري الأول' : 'First Secret Gateway Code'}</label>
                                            <input type="text" className="settings-input" value={editSettings.secretGatewayCode || ''} onChange={e => setEditSettings(p => ({ ...p, secretGatewayCode: e.target.value }))} />
                                        </div>
                                        <div className="settings-field">
                                            <label>👑 {isAr ? 'كلمة مرور الأدمن' : 'Admin Password'}</label>
                                            <input type="text" className="settings-input" value={editSettings.adminPassword || ''} onChange={e => setEditSettings(p => ({ ...p, adminPassword: e.target.value }))} />
                                        </div>
                                        <div className="settings-field">
                                            <label>♂️ {isAr ? `كلمة مرور المنسق (${systemSettings.ahmadNameAr || 'أحمد'})` : `Coordinator (${systemSettings.ahmadNameEn || 'Ahmad'}) Password`}</label>
                                            <input type="text" className="settings-input" value={editSettings.ahmadPassword || ''} onChange={e => setEditSettings(p => ({ ...p, ahmadPassword: e.target.value }))} />
                                        </div>
                                        <div className="settings-field">
                                            <label>♀️ {isAr ? `كلمة مرور المنسقة (${systemSettings.saraNameAr || 'سارة'})` : `Coordinator (${systemSettings.saraNameEn || 'Sara'}) Password`}</label>
                                            <input type="text" className="settings-input" value={editSettings.saraPassword || ''} onChange={e => setEditSettings(p => ({ ...p, saraPassword: e.target.value }))} />
                                        </div>
                                        <div className="card-save-row">
                                            <button className="card-save-btn"
                                                onClick={() => handleSaveSectionSettings('passwords', ['secretGatewayCode','adminPassword','ahmadPassword','saraPassword'])}
                                                disabled={sectionSaving === 'passwords'}
                                            >
                                                {sectionSaving === 'passwords' ? '⏳' : '💾'} {isAr ? 'حفظ كلمات المرور' : 'Save Passwords'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Coordinator Names Card */}
                                    <div className="settings-card">
                                        <div className="settings-card-header">
                                            <h4>👥 {isAr ? 'أسماء المنسقين' : 'Coordinator Names'}</h4>
                                            <span className="settings-card-hint">{isAr ? 'تُحدَّث تلقائياً بعد الحفظ' : 'Auto-updates on save'}</span>
                                        </div>
                                        <div className="settings-field">
                                            <label>♂️ {isAr ? 'اسم المنسق بالعربية' : 'Male Coord. Arabic Name'}</label>
                                            <input type="text" className="settings-input" value={editSettings.ahmadNameAr || ''} onChange={e => setEditSettings(p => ({ ...p, ahmadNameAr: e.target.value }))} />
                                        </div>
                                        <div className="settings-field">
                                            <label>♂️ {isAr ? 'اسم المنسق بالإنجليزية' : 'Male Coord. English Name'}</label>
                                            <input type="text" className="settings-input" value={editSettings.ahmadNameEn || ''} onChange={e => setEditSettings(p => ({ ...p, ahmadNameEn: e.target.value }))} />
                                        </div>
                                        <div className="settings-field">
                                            <label>♀️ {isAr ? 'اسم المنسقة بالعربية' : 'Female Coord. Arabic Name'}</label>
                                            <input type="text" className="settings-input" value={editSettings.saraNameAr || ''} onChange={e => setEditSettings(p => ({ ...p, saraNameAr: e.target.value }))} />
                                        </div>
                                        <div className="settings-field">
                                            <label>♀️ {isAr ? 'اسم المنسقة بالإنجليزية' : 'Female Coord. English Name'}</label>
                                            <input type="text" className="settings-input" value={editSettings.saraNameEn || ''} onChange={e => setEditSettings(p => ({ ...p, saraNameEn: e.target.value }))} />
                                        </div>
                                        <div className="card-save-row">
                                            <button className="card-save-btn"
                                                onClick={() => handleSaveSectionSettings('names', ['ahmadNameAr','ahmadNameEn','saraNameAr','saraNameEn'])}
                                                disabled={sectionSaving === 'names'}
                                            >
                                                {sectionSaving === 'names' ? '⏳' : '💾'} {isAr ? 'حفظ الأسماء' : 'Save Names'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tasks Card — Male */}
                                    <div className="settings-card">
                                        <div className="settings-card-header">
                                            <h4>♂️ {isAr ? `مهام ${systemSettings.ahmadNameAr || 'أحمد'} (منسق الذكور)` : `${systemSettings.ahmadNameEn || 'Ahmad'}'s Tasks`}</h4>
                                            <span className="settings-card-hint">{isAr ? 'يراها المنسق فقط' : 'Seen by him only'}</span>
                                        </div>
                                        <div className="settings-field">
                                            <label>👥 {isAr ? 'مهام مشتركة (يراها كلا المنسقين)' : 'Shared Tasks (both see)'}</label>
                                            <textarea className="settings-textarea" rows="3"
                                                placeholder={isAr ? 'مهمة لكل سطر...' : 'One task per line...'}
                                                value={editSettings.sharedCoordinatorTasks || ''}
                                                onChange={e => setEditSettings(p => ({ ...p, sharedCoordinatorTasks: e.target.value }))}
                                            />
                                        </div>
                                        <div className="settings-field">
                                            <label>♂️ {isAr ? 'مهام خاصة بمنسق الذكور فقط' : 'Male Coordinator Exclusive Tasks'}</label>
                                            <textarea className="settings-textarea" rows="4"
                                                placeholder={isAr ? 'مهمة لكل سطر...' : 'One task per line...'}
                                                value={editSettings.coordinatorMaleTasks || ''}
                                                onChange={e => setEditSettings(p => ({ ...p, coordinatorMaleTasks: e.target.value }))}
                                            />
                                        </div>
                                        <div className="card-save-row">
                                            <button className="card-save-btn"
                                                onClick={() => handleSaveSectionSettings('maleTasks', ['sharedCoordinatorTasks','coordinatorMaleTasks'])}
                                                disabled={sectionSaving === 'maleTasks'}
                                            >
                                                {sectionSaving === 'maleTasks' ? '⏳' : '💾'} {isAr ? 'حفظ مهام الذكور' : 'Save Male Tasks'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tasks Card — Female */}
                                    <div className="settings-card">
                                        <div className="settings-card-header">
                                            <h4>♀️ {isAr ? `مهام ${systemSettings.saraNameAr || 'سارة'} (منسقة الإناث)` : `${systemSettings.saraNameEn || 'Sara'}'s Tasks`}</h4>
                                            <span className="settings-card-hint">{isAr ? 'تراها المنسقة فقط' : 'Seen by her only'}</span>
                                        </div>
                                        <div className="settings-field">
                                            <label>♀️ {isAr ? 'مهام خاصة بمنسقة الإناث فقط' : 'Female Coordinator Exclusive Tasks'}</label>
                                            <textarea className="settings-textarea" rows="7"
                                                placeholder={isAr ? 'مهمة لكل سطر...' : 'One task per line...'}
                                                value={editSettings.coordinatorFemaleTasks || ''}
                                                onChange={e => setEditSettings(p => ({ ...p, coordinatorFemaleTasks: e.target.value }))}
                                            />
                                        </div>
                                        <div className="card-save-row">
                                            <button className="card-save-btn"
                                                onClick={() => handleSaveSectionSettings('femaleTasks', ['coordinatorFemaleTasks'])}
                                                disabled={sectionSaving === 'femaleTasks'}
                                            >
                                                {sectionSaving === 'femaleTasks' ? '⏳' : '💾'} {isAr ? 'حفظ مهام الإناث' : 'Save Female Tasks'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ARCHIVE TAB (Admin only) */}
                        {activeTab === 'archive' && isAdminUser && (
                            <div className="archive-panel">
                                <div className="archive-panel-header">
                                    <div>
                                        <h3>🗄️ {isAr ? 'أرشيف حملات تبادل المواد' : 'Material Exchange Campaign Archive'}</h3>
                                        <p>{isAr ? 'احفظ بيانات الفصل الحالي وابدأ حملة جديدة بدون فقدان البيانات القديمة' : 'Save the current semester data and start fresh without losing old data'}</p>
                                    </div>
                                    <button className="archive-new-btn" onClick={() => setShowArchiveModal(true)}>
                                        📦 {isAr ? 'أرشفة الحملة الحالية' : 'Archive Current Campaign'}
                                    </button>
                                </div>

                                {/* Current campaign summary */}
                                <div className="archive-current-summary">
                                    <div className="archive-summary-stat">
                                        <span className="archive-summary-num">{allDonations.length}</span>
                                        <span className="archive-summary-lbl">{isAr ? 'إجمالي التبرعات الحالية' : 'Current Donations'}</span>
                                    </div>
                                    <div className="archive-summary-stat">
                                        <span className="archive-summary-num">{allDonations.filter(d => d.status === 'pending').length}</span>
                                        <span className="archive-summary-lbl">{isAr ? 'بانتظار المراجعة' : 'Pending'}</span>
                                    </div>
                                    <div className="archive-summary-stat">
                                        <span className="archive-summary-num">{allDonations.filter(d => d.status === 'approved').length}</span>
                                        <span className="archive-summary-lbl">{isAr ? 'معتمدة' : 'Approved'}</span>
                                    </div>
                                    <div className="archive-summary-stat">
                                        <span className="archive-summary-num">{allDonations.filter(d => d.status === 'reserved').length}</span>
                                        <span className="archive-summary-lbl">{isAr ? 'محجوزة' : 'Reserved'}</span>
                                    </div>
                                </div>

                                {/* Archive list */}
                                <h4 className="archive-list-title">📚 {isAr ? 'الأرشيف السابق' : 'Previous Archives'}</h4>
                                {archivesLoading ? (
                                    <div className="dashboard-loading"><div className="loading-spinner"></div></div>
                                ) : archives.length === 0 ? (
                                    <div className="empty-state">
                                        🗄️ {isAr ? 'لا يوجد أرشيف بعد. أرشف الحملة الحالية عند نهاية الفصل الدراسي.' : 'No archives yet. Archive the current campaign at the end of the semester.'}
                                    </div>
                                ) : (
                                    <div className="archives-list">
                                        {archives.map(arch => {
                                            const archDate = arch.archivedAt?.toDate ? arch.archivedAt.toDate() : arch.archivedAt ? new Date(arch.archivedAt) : null;
                                            const archDonations = arch.donationsData || [];
                                            return (
                                                <div key={arch.id} className="archive-item-card">
                                                    <div className="archive-item-left">
                                                        <div className="archive-item-icon">🗃️</div>
                                                        <div className="archive-item-info">
                                                            <h4>{arch.label}</h4>
                                                            <p>
                                                                📅 {archDate ? archDate.toLocaleDateString(isAr ? 'ar-JO' : 'en-US') : '—'}
                                                                &nbsp;·&nbsp; 📦 {arch.totalDonations || archDonations.length} {isAr ? 'تبرع' : 'donations'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="archive-item-actions">
                                                        <button className="export-btn export-csv-btn"
                                                            onClick={() => exportToCSV(archDonations, arch.label)}>
                                                            📊 {isAr ? 'Excel' : 'Excel'}
                                                        </button>
                                                        <button className="export-btn export-pdf-btn"
                                                            onClick={() => exportToPDF(archDonations, arch.label)}>
                                                            🖨️ PDF
                                                        </button>
                                                        <button className="archive-expand-btn"
                                                            onClick={() => setSelectedArchive(selectedArchive?.id === arch.id ? null : arch)}>
                                                            {selectedArchive?.id === arch.id ? '▲' : '▼'} {isAr ? 'تفاصيل' : 'Details'}
                                                        </button>
                                                    </div>
                                                    {selectedArchive?.id === arch.id && archDonations.length > 0 && (
                                                        <div className="archive-detail-table-wrapper">
                                                            <table className="donations-table archive-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>{isAr ? 'الاسم' : 'Name'}</th>
                                                                        <th>{isAr ? 'الهاتف' : 'Phone'}</th>
                                                                        <th>{isAr ? 'الجنس' : 'Gender'}</th>
                                                                        <th>{isAr ? 'المواد' : 'Materials'}</th>
                                                                        <th>{isAr ? 'الحالة' : 'Status'}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {archDonations.map((d, i) => (
                                                                        <tr key={i}>
                                                                            <td><strong>{d.studentName}</strong></td>
                                                                            <td dir="ltr">{d.phoneNumber}</td>
                                                                            <td>
                                                                                <span className={`gender-badge gender-${d.studentGender}`}>
                                                                                    {d.studentGender === 'male' ? (isAr ? '♂️ ذكر' : '♂️ Male') : (isAr ? '♀️ أنثى' : '♀️ Female')}
                                                                                </span>
                                                                            </td>
                                                                            <td>{(d.materials || []).map(m => typeof m === 'object' ? m.name : m).join(', ')}</td>
                                                                            <td><span className={`status-badge status-${d.status}`}>{d.status}</span></td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Archive Campaign Modal ─── */}
                {showArchiveModal && (
                    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowArchiveModal(false); }}>
                        <div className="booking-modal glass-card archive-modal" onClick={e => e.stopPropagation()}>
                            <button className="close-modal" onClick={() => setShowArchiveModal(false)}>×</button>
                            <div className="modal-header">
                                <h2>🗄️ {isAr ? 'أرشفة الحملة الحالية' : 'Archive Current Campaign'}</h2>
                                <p>{isAr ? `سيتم حفظ ${allDonations.length} تبرع حالي في الأرشيف تحت الاسم الذي تحدده أدناه` : `${allDonations.length} current donations will be saved under the name you specify`}</p>
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'اسم الأرشيف (مثال: الفصل الثاني 2024-2025)' : 'Archive Label (e.g. Semester 2 2024-2025)'}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={archiveName}
                                    onChange={e => setArchiveName(e.target.value)}
                                    placeholder={isAr ? 'الفصل الدراسي الصيفي 2025...' : 'Summer Semester 2025...'}
                                    autoFocus
                                />
                            </div>
                            <div className="archive-modal-warning">
                                ⚠️ {isAr ? 'تنبيه: سيتم حفظ نسخة من البيانات الحالية وحذفها نهائياً للبدء بحملة وفصل جديد.' : 'Warning: Current donations will be archived and cleared permanently to start a new campaign.'}
                            </div>
                            <button className="submit-btn full-width" onClick={handleArchiveCampaign}>
                                📦 {isAr ? 'تأكيد الأرشفة' : 'Confirm Archive'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── Delegate to Coordinator Modal ─── */}
                {showDelegateModal && donationToDelegate && (
                    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowDelegateModal(false); setDonationToDelegate(null); } }}>
                        <div className="booking-modal glass-card delegate-modal" onClick={e => e.stopPropagation()}>
                            <button className="close-modal" onClick={() => { setShowDelegateModal(false); setDonationToDelegate(null); }}>×</button>
                            <div className="modal-header">
                                <h2>📢 {isAr ? 'تفويض إلى منسق' : 'Delegate to Coordinator'}</h2>
                                <p>
                                    {isAr ? 'تبرع من:' : 'Donation by:'}{' '}
                                    <strong>{donationToDelegate.studentName}</strong>{' '}
                                    <span className={`gender-badge gender-${donationToDelegate.studentGender}`}>
                                        {donationToDelegate.studentGender === 'male' ? '♂️' : '♀️'}
                                    </span>
                                </p>
                                <p className="delegate-hint">
                                    {isAr
                                        ? 'اختر المنسق الذي ستُفوّض إليه هذا الطلب للمتابعة والتسليم:'
                                        : 'Choose the coordinator to handle this donation:'}
                                </p>
                            </div>
                            <div className="delegate-options">
                                {(donationToDelegate.studentGender === 'male' || !donationToDelegate.studentGender) && (
                                    <button
                                        className="delegate-option-btn male-option"
                                        onClick={() => handleDelegateToCoordinator(donationToDelegate.id, 'ahmad')}
                                    >
                                        <span className="delegate-option-icon">♂️</span>
                                        <div className="delegate-option-info">
                                            <strong>{systemSettings.ahmadNameAr || 'أحمد'}</strong>
                                            <span>{isAr ? 'منسق قسم الذكور' : 'Male Section Coordinator'}</span>
                                        </div>
                                    </button>
                                )}
                                {(donationToDelegate.studentGender === 'female' || !donationToDelegate.studentGender) && (
                                    <button
                                        className="delegate-option-btn female-option"
                                        onClick={() => handleDelegateToCoordinator(donationToDelegate.id, 'sara')}
                                    >
                                        <span className="delegate-option-icon">♀️</span>
                                        <div className="delegate-option-info">
                                            <strong>{systemSettings.saraNameAr || 'سارة'}</strong>
                                            <span>{isAr ? 'منسقة قسم الإناث' : 'Female Section Coordinator'}</span>
                                        </div>
                                    </button>
                                )}
                            </div>
                            <p className="delegate-gender-notice">
                                {donationToDelegate.studentGender === 'male'
                                    ? (isAr ? 'ℹ️ هذا الطلب من متبرع ذكر، يُفضل تفويضه لمنسق الذكور.' : 'ℹ️ This is a male donor, recommended to delegate to male coordinator.')
                                    : donationToDelegate.studentGender === 'female'
                                        ? (isAr ? 'ℹ️ هذا الطلب من متبرعة، يُفضل تفويضه لمنسقة الإناث.' : 'ℹ️ This is a female donor, recommended to delegate to female coordinator.')
                                        : (isAr ? '⚠️ لم يتم تحديد جنس المتبرع، يمكنك الاختيار يدوياً.' : '⚠️ Donor gender not specified, you can choose manually.')}
                            </p>
                        </div>
                    </div>
                )}

                {/* ─── Edit Donation Modal ─── */}
                {showEditModal && selectedDonationForEdit && (
                    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowEditModal(false); setSelectedDonationForEdit(null); } }}>
                        <div className="booking-modal glass-card edit-donation-modal" onClick={e => e.stopPropagation()}>
                            <button className="close-modal" onClick={() => { setShowEditModal(false); setSelectedDonationForEdit(null); }}>×</button>
                            <div className="modal-header">
                                <h2>✏️ {isAr ? 'تعديل بيانات طلب التبرع' : 'Edit Donation Record'}</h2>
                                <p>{isAr ? 'تحديث معلومات المتبرع والمواد وحالة الحجز بالكامل' : 'Update donor info, materials, and reservation status'}</p>
                            </div>
                            <form className="booking-form" onSubmit={handleSaveEditDonation}>
                                <div className="form-group">
                                    <label>{isAr ? 'اسم المتبرع' : 'Donor Name'}</label>
                                    <input
                                        type="text"
                                        required
                                        value={selectedDonationForEdit.studentName}
                                        onChange={e => setSelectedDonationForEdit({ ...selectedDonationForEdit, studentName: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'رقم هاتف المتبرع' : 'Donor Phone'}</label>
                                    <input
                                        type="text"
                                        required
                                        value={selectedDonationForEdit.phoneNumber}
                                        onChange={e => setSelectedDonationForEdit({ ...selectedDonationForEdit, phoneNumber: toEnglishNumerals(e.target.value) })}
                                        className="form-input"
                                        maxLength="10"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'جنس المتبرع' : 'Donor Gender'}</label>
                                    <select
                                        value={selectedDonationForEdit.studentGender}
                                        onChange={e => setSelectedDonationForEdit({ ...selectedDonationForEdit, studentGender: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="male">{isAr ? 'ذكر' : 'Male'}</option>
                                        <option value="female">{isAr ? 'أنثى' : 'Female'}</option>
                                    </select>
                                </div>

                                {loggedInUser.role === 'admin' && (
                                    <div className="form-group terms-checkbox-container" style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            id="publishedCheckbox"
                                            checked={selectedDonationForEdit.publishedToCoordinators || false}
                                            onChange={e => setSelectedDonationForEdit({ ...selectedDonationForEdit, publishedToCoordinators: e.target.checked })}
                                        />
                                        <label htmlFor="publishedCheckbox" style={{ margin: 0, cursor: 'pointer' }}>
                                            📢 {isAr ? 'نشر وتفويض للمنسقين' : 'Publish/Delegate to Coordinators'}
                                        </label>
                                    </div>
                                )}

                                <div className="edit-modal-materials-section">
                                    <h3 style={{ margin: '15px 0 10px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '5px' }}>📚 {isAr ? 'المواد وحالات الحجز' : 'Materials & Reservation Status'}</h3>
                                    {(selectedDonationForEdit.materials || []).map((material, index) => {
                                        const status = typeof material === 'object' ? material.status : 'pending';
                                        const name = typeof material === 'object' ? material.name : material;
                                        const description = typeof material === 'object' ? material.description : '';
                                        const taker = typeof material === 'object' ? (material.takerInfo || {}) : {};

                                        const updateMaterialField = (field, val) => {
                                            const updatedMats = [...selectedDonationForEdit.materials];
                                            if (typeof updatedMats[index] !== 'object') {
                                                updatedMats[index] = { name: updatedMats[index], status: 'pending' };
                                            }
                                            updatedMats[index] = { ...updatedMats[index], [field]: val };
                                            setSelectedDonationForEdit({ ...selectedDonationForEdit, materials: updatedMats });
                                        };

                                        const updateTakerField = (field, val) => {
                                            const updatedMats = [...selectedDonationForEdit.materials];
                                            if (typeof updatedMats[index] !== 'object') {
                                                updatedMats[index] = { name: updatedMats[index], status: 'pending' };
                                            }
                                            const curTaker = updatedMats[index].takerInfo || {};
                                            updatedMats[index] = {
                                                ...updatedMats[index],
                                                takerInfo: { ...curTaker, [field]: val }
                                            };
                                            setSelectedDonationForEdit({ ...selectedDonationForEdit, materials: updatedMats });
                                        };

                                        return (
                                            <div key={index} className="edit-material-block" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                                                <div className="material-details-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={e => updateMaterialField('name', e.target.value)}
                                                        className="form-input material-name-input"
                                                        placeholder={isAr ? 'اسم المادة' : 'Material name'}
                                                        style={{ flex: 1 }}
                                                        required
                                                    />
                                                    <select
                                                        value={status}
                                                        onChange={e => updateMaterialField('status', e.target.value)}
                                                        className="form-input material-status-select"
                                                        style={{ width: '150px' }}
                                                    >
                                                        <option value="pending">{isAr ? '⏳ معلّقة' : 'Pending'}</option>
                                                        <option value="approved">{isAr ? '✅ معتمدة' : 'Approved'}</option>
                                                        <option value="reserved">{isAr ? '🔒 محجوزة' : 'Reserved'}</option>
                                                        <option value="completed">{isAr ? '📦 تم تسليمها' : 'Completed'}</option>
                                                    </select>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={description}
                                                    onChange={e => updateMaterialField('description', e.target.value)}
                                                    className="form-input material-desc-input"
                                                    placeholder={isAr ? 'وصف المادة (اختياري)' : 'Description (optional)'}
                                                />
                                                {['reserved', 'completed'].includes(status) && (
                                                    <div className="taker-info-fields" style={{ marginTop: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>👤 {isAr ? 'معلومات المستلم (الحاجز)' : 'Taker/Booker Info'}</h4>
                                                        <div className="taker-fields-row" style={{ display: 'flex', gap: '8px' }}>
                                                            <input
                                                                type="text"
                                                                value={taker.name || ''}
                                                                onChange={e => updateTakerField('name', e.target.value)}
                                                                className="form-input"
                                                                placeholder={isAr ? 'اسم المستلم' : 'Taker Name'}
                                                                style={{ flex: 1 }}
                                                                required
                                                            />
                                                            <input
                                                                type="tel"
                                                                value={taker.phone || ''}
                                                                onChange={e => updateTakerField('phone', toEnglishNumerals(e.target.value))}
                                                                className="form-input"
                                                                placeholder={isAr ? 'رقم هاتف المستلم' : 'Taker Phone'}
                                                                style={{ flex: 1 }}
                                                                required
                                                                maxLength="10"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <button type="submit" className="submit-btn full-width" disabled={loading} style={{ marginTop: '20px' }}>
                                    {loading ? (isAr ? '⏳ جاري الحفظ...' : 'Saving...') : (isAr ? '💾 حفظ التعديلات' : 'Save Changes')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }


    return (
        <div className="material-exchange-page">

            {/* Login Modal — two-step secret gateway */}
            {showLoginModal && (
                <div className="modal-overlay" onClick={e => {
                    if (e.target === e.currentTarget) {
                        setShowLoginModal(false);
                        setLoginStep(1);
                        setSecretCodeInput('');
                        setSecretCodeError(false);
                        setLoginError('');
                        setCaptchaInput('');
                        setCaptchaError(false);
                    }
                }}>
                    <div className="login-modal glass-card">
                        <button className="close-modal" onClick={() => {
                            setShowLoginModal(false);
                            setLoginStep(1);
                            setSecretCodeInput('');
                            setSecretCodeError(false);
                            setLoginError('');
                            setCaptchaInput('');
                            setCaptchaError(false);
                        }}>×</button>

                        {/* ── Step 1: Secret Code ── */}
                        {loginStep === 1 && (
                            <>
                                <div className="modal-header">
                                    <h2>🔒 {isAr ? 'بوابة الوصول' : 'Access Gateway'}</h2>
                                    <p>{isAr ? 'أدخل الكود للمتابعة' : 'Enter the code to continue'}</p>
                                </div>
                                <form className="login-form" onSubmit={e => {
                                    e.preventDefault();
                                    if (secretCodeInput.trim() === (systemSettings.secretGatewayCode || 'makanak2025')) {
                                        setLoginStep(2);
                                        setSecretCodeInput('');
                                        setSecretCodeError(false);
                                    } else {
                                        setSecretCodeError(true);
                                        setSecretCodeInput('');
                                    }
                                }}>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className={`form-input ${secretCodeError ? 'input-error-shake' : ''}`}
                                            value={secretCodeInput}
                                            onChange={e => { setSecretCodeInput(e.target.value); setSecretCodeError(false); }}
                                            autoComplete="off"
                                            autoFocus
                                        />
                                        {secretCodeError && (
                                            <div className="login-error">⚠️ {isAr ? 'الكود غير صحيح' : 'Incorrect code'}</div>
                                        )}
                                    </div>
                                    <button type="submit" className="submit-btn">
                                        {isAr ? 'تأكيد' : 'Confirm'}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* ── Step 2: Username & Password ── */}
                        {loginStep === 2 && (
                            <>
                                <div className="modal-header">
                                    <h2>🔐 {isAr ? 'دخول الفريق' : 'Staff Login'}</h2>
                                    <p>{isAr ? 'خاص بفريق الإدارة والمنسقين فقط' : 'For management team and coordinators only'}</p>
                                </div>
                                <form className="login-form" onSubmit={handleLogin}>
                                    <div className="form-group">
                                        <label>{isAr ? 'اسم المستخدم' : 'Username'}</label>
                                        <input
                                            type="text"
                                            name="staff_username_unique_makanak"
                                            className="form-input"
                                            value={loginForm.username}
                                            onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                                            autoComplete="new-username"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{isAr ? 'كلمة المرور' : 'Password'}</label>
                                        <input
                                            type="password"
                                            name="staff_password_unique_makanak"
                                            className="form-input"
                                            value={loginForm.password}
                                            onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    {/* Text-based Canvas CAPTCHA */}
                                    <div className="form-group">
                                        <label>{isAr ? 'التحقق البشري' : 'Human Verification'}</label>
                                        <div className="captcha-wrapper">
                                            <div className="captcha-canvas-container">
                                                <canvas 
                                                    ref={canvasRef} 
                                                    width="160" 
                                                    height="50" 
                                                    className="captcha-canvas"
                                                />
                                                <button 
                                                    type="button" 
                                                    className="captcha-refresh-btn"
                                                    onClick={generateCaptcha}
                                                    title={isAr ? 'تحديث الرمز' : 'Refresh code'}
                                                >
                                                    🔄
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                className={`form-input captcha-input-field ${captchaError ? 'input-error-shake' : ''}`}
                                                value={captchaInput}
                                                onChange={e => {
                                                    setCaptchaInput(e.target.value);
                                                    setCaptchaError(false);
                                                }}
                                                placeholder={isAr ? 'أدخل الرمز أعلاه' : 'Enter the code above'}
                                                autoComplete="off"
                                                maxLength="6"
                                            />
                                        </div>
                                    </div>

                                    {loginError && <div className="login-error">⚠️ {loginError}</div>}
                                    <button 
                                        type="submit" 
                                        className="submit-btn"
                                    >
                                        {isAr ? 'تسجيل الدخول' : 'Login'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Hero */}
            <section className="exchange-hero" style={{ backgroundImage: `url(${exchangeHero})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>
                        {isAr ? 'تبادل المواد الدراسية 📚' : 'Material Exchange 📚'}
                    </h1>
                    <p>{isAr ? 'منصة لتبادل الكتب والدوسيات بين الطلاب.. فيد واستفيد!' : 'A platform to exchange books and notes between students.. Give and Take!'}</p>
                </div>
            </section>

            <div className="exchange-main-container">

                {/* Donation Form */}
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
                            <p>{isAr ? systemSettings.exchangeSuspendedMessageAr : systemSettings.exchangeSuspendedMessageEn}</p>
                            <div className="suspension-footer">
                                <span>{isAr ? 'نراكم الفصل القادم! 👋' : 'See you next semester! 👋'}</span>
                            </div>
                        </div>
                    ) : (
                        <form className="material-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{isAr ? 'اسم الطالب' : 'Student Name'}</label>
                                    <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} placeholder={isAr ? 'مثال: أحمد محمد' : 'e.g. Ahmad Mohammad'} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'رقم التواصل (واتساب)' : 'Contact Number (WhatsApp)'}</label>
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="07xxxxxxxx" className="form-input" dir="ltr" maxLength="10" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label>{t('exchange.form.email')}</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@university.edu.jo" className="form-input" dir="ltr" />
                                </div>
                            </div>
                            {/* ── Gender Selection ── */}
                            <div className="form-group full-width">
                                <label className="gender-field-label">
                                    {isAr ? 'الجنس' : 'Gender'}
                                    <span className="required-star">*</span>
                                    <span
                                        className="gender-hint-icon"
                                        title={isAr
                                            ? 'اختيار الجنس يُمكّن المنسق المختص بقسمك (ذكور/إناث) من التواصل معك وتسليم المواد بشكل منظم وسريع'
                                            : 'Selecting gender allows the right coordinator (male/female section) to contact you and deliver materials efficiently'}
                                    >
                                        ℹ️
                                    </span>
                                </label>
                                <div className="gender-select-row">
                                    <button
                                        type="button"
                                        className={`gender-select-btn ${formData.studentGender === 'male' ? 'gender-active-male' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, studentGender: 'male' }))}
                                    >
                                        <span>{isAr ? 'ذكر' : 'Male'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`gender-select-btn ${formData.studentGender === 'female' ? 'gender-active-female' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, studentGender: 'female' }))}
                                    >
                                        <span>{isAr ? 'أنثى' : 'Female'}</span>
                                    </button>
                                </div>
                                <small className="gender-field-hint">
                                    💡 {isAr
                                        ? 'يُستخدم الجنس لتصنيف موادك وإيصالها للمنسق المختص بقسمك لتسهيل عملية التسليم والتواصل'
                                        : 'Gender is used to route your materials to the right coordinator for organized delivery and communication'}
                                </small>
                            </div>
                            <div className="form-group full-width">
                                <label>{isAr ? 'المواد المتوفرة' : 'Available Materials'}</label>
                                <div className="material-input-container">
                                    <input type="text" value={currentMaterial.name} onChange={e => setCurrentMaterial(prev => ({ ...prev, name: e.target.value }))} placeholder={isAr ? 'اسم المادة (مثال: كتاب الفيزياء 1)' : 'Material name (e.g. Physics 1 Book)'} className="form-input" />
                                    <textarea value={currentMaterial.description} onChange={e => setCurrentMaterial(prev => ({ ...prev, description: e.target.value }))} placeholder={isAr ? 'وصف المادة (اختياري): مثال: سلايدات كاملة، سلايدات الميد فقط، كتاب + شرح، إلخ...' : 'Material description (optional): e.g. Complete slides, Midterm only, Book + notes, etc.'} className="form-input material-description" rows="2" />
                                    <button type="button" onClick={handleAddMaterial} className="add-btn">{isAr ? 'إضافة' : 'Add'}</button>
                                </div>
                                <small className="form-hint">💡 {isAr ? 'يمكنك إضافة أكثر من مادة بالنقر على "إضافة" عدة مرات' : 'You can add multiple materials by clicking "Add" multiple times'}</small>
                                {formData.materials.length > 0 && (
                                    <div className="added-materials-list">
                                        {formData.materials.map((material, index) => (
                                            <div key={index} className="added-material-item">
                                                <div className="material-item-icon">📚</div>
                                                <div className="material-item-details">
                                                    <strong>{typeof material === 'string' ? material : material.name}</strong>
                                                    {material.description && <p>{material.description}</p>}
                                                </div>
                                                <button type="button" onClick={() => handleRemoveMaterial(index)} className="remove-material-btn" title={isAr ? 'حذف' : 'Remove'}>×</button>
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
                                <input type="checkbox" id="termsCheckbox" className="terms-checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
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

                {/* Materials List */}
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
                                    <div className="countdown-item"><span className="time-val">{timeLeft.days}</span><span className="time-label">{isAr ? 'يوم' : 'Days'}</span></div>
                                    <div className="countdown-item"><span className="time-val">{timeLeft.hours}</span><span className="time-label">{isAr ? 'ساعة' : 'Hrs'}</span></div>
                                    <div className="countdown-item"><span className="time-val">{timeLeft.minutes}</span><span className="time-label">{isAr ? 'دقيقة' : 'Min'}</span></div>
                                    <div className="countdown-item"><span className="time-val">{timeLeft.seconds}</span><span className="time-label">{isAr ? 'ثانية' : 'Sec'}</span></div>
                                </div>
                                {systemSettings.bookingStartTime ? (
                                    <p className="booking-info-text">
                                        {isAr
                                            ? `الفترة الحالية مخصصة حصراً لجمع وتبرع المواد، على أن يبدأ حجزها بتاريخ ${new Date(systemSettings.bookingStartTime).toLocaleString('ar-JO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}. ⏳`
                                            : `This period is exclusively for donations. Booking opens on ${new Date(systemSettings.bookingStartTime).toLocaleString('en-JO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}. ⏳`}
                                    </p>
                                ) : (
                                    <p className="booking-info-text">{t('exchange.booking.starts_at')}</p>
                                )}
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
                            {availableMaterials.map(item => (
                                <div key={item.uniqueKey} className="donation-card">
                                    <div className="donation-main">
                                        <div className="material-icon">📚</div>
                                        <div className="donation-details"><h3>{item.materialItem.name}</h3></div>
                                    </div>
                                    <button 
                                        className={`btn-book ${!bookingOpen ? 'locked' : ''}`} 
                                        onClick={() => { if (bookingOpen) openBookingModal(item); }} 
                                        disabled={!bookingOpen} 
                                        title={!bookingOpen ? (isAr ? 'حملة الحجز مغلقة حالياً' : 'Booking campaign is currently closed') : ''} 
                                    > 
                                        {isAr ? 'حجز المادة' : 'Book Material'} 
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
                                        <div className="donation-details"><h3>{item.materialName}</h3></div>
                                        <button className="btn-book disabled" disabled>{isAr ? 'تم الحجز' : 'Reserved'}</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Team Section */}
                <section className="coordination-team-section glass-card">
                    <div className="coordination-badge">
                        <span className="badge-icon">🤝</span>
                        <span>{isAr ? 'فريق التنسيق المعتمد' : 'Certified Coordination Team'}</span>
                    </div>
                    <div className="coordination-content">
                        <h3>{isAr ? 'آلية الإشراف والتوزيع' : 'Supervision & Distribution Mechanism'}</h3>
                        <p className="coordination-description">
                            {isAr 
                                ? 'هناك فريق تنسيق معتمد يقوم بالإشراف وتنسيق عملية التبرع والحجز، حيث يتم التواصل مع الطلاب الذكور من قبل المنسق المعني، والطالبات الإناث من قبل المنسقة المعنية، وذلك لضمان الخصوصية والتنظيم والسرعة في تسليم المواد.'
                                : 'There is a certified coordination team supervising and coordinating the donation and booking process: male students are contacted by the male coordinator, and female students by the female coordinator, ensuring privacy, organization, and speed in material delivery.'}
                        </p>
                        <div className="coordination-features">
                            <div className="coord-feature-item">
                                <span className="feature-icon">♂️</span>
                                <div className="feature-text">
                                    <h4>{isAr ? 'قسم الذكور' : 'Male Section'}</h4>
                                    <p>{isAr ? `بإشراف المنسق المعني (${systemSettings.ahmadNameAr || 'أحمد'})` : `Supervised by male coordinator (${systemSettings.ahmadNameEn || 'Ahmad'})`}</p>
                                </div>
                            </div>
                            <div className="coord-feature-item">
                                <span className="feature-icon">♀️</span>
                                <div className="feature-text">
                                    <h4>{isAr ? 'قسم الإناث' : 'Female Section'}</h4>
                                    <p>{isAr ? `بإشراف المنسقة المعنية (${systemSettings.saraNameAr || 'سارة'})` : `Supervised by female coordinator (${systemSettings.saraNameEn || 'Sara'})`}</p>
                                </div>
                            </div>
                        </div>
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
                            <div className="material-to-book"><span>📖</span><strong>{selectedMaterial?.materialName}</strong></div>
                        </div>
                        <form className="booking-form" onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label>{isAr ? 'الاسم (من مقطعين على الأقل)' : 'Full Name (at least 2 parts)'}</label>
                                <input type="text" required value={bookingData.name} onChange={e => setBookingData({ ...bookingData, name: e.target.value })} placeholder={isAr ? 'مثال: محمد أحمد' : 'e.g. Mohammad Ahmad'} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'رقم الهاتف للتواصل واستلام المادة' : 'Contact Number'}</label>
                                <input type="tel" required value={bookingData.phone} onChange={e => setBookingData({ ...bookingData, phone: toEnglishNumerals(e.target.value) })} placeholder="07xxxxxxxx" className="form-input" dir="ltr" />
                            </div>
                            {/* ── Gender Selection ── */}
                            <div className="form-group">
                                <label className="gender-field-label">
                                    {isAr ? 'الجنس' : 'Gender'}
                                    <span className="required-star">*</span>
                                    <span
                                        className="gender-hint-icon"
                                        title={isAr
                                            ? 'اختيار الجنس يساعد المنسق المختص بقسمك على التواصل معك وإتمام عملية الاستلام بشكل منظم'
                                            : 'Selecting gender helps the right coordinator contact you to arrange material pickup'}
                                    >
                                        ℹ️
                                    </span>
                                </label>
                                <div className="gender-select-row">
                                    <button
                                        type="button"
                                        className={`gender-select-btn ${bookingData.gender === 'male' ? 'gender-active-male' : ''}`}
                                        onClick={() => setBookingData(prev => ({ ...prev, gender: 'male' }))}
                                    >
                                        <span>{isAr ? 'ذكر' : 'Male'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`gender-select-btn ${bookingData.gender === 'female' ? 'gender-active-female' : ''}`}
                                        onClick={() => setBookingData(prev => ({ ...prev, gender: 'female' }))}
                                    >
                                        <span>{isAr ? 'أنثى' : 'Female'}</span>
                                    </button>
                                </div>
                                <small className="gender-field-hint">
                                    💡 {isAr
                                        ? 'يُستخدم لتحديد المنسق المختص الذي سيتواصل معك لتسليمك المادة'
                                        : 'Used to identify the right coordinator who will contact you for material pickup'}
                                </small>
                            </div>
                            <button type="submit" className="submit-btn full-width" disabled={loading}>
                                {loading ? (isAr ? 'جاري الحجز...' : 'Booking...') : (isAr ? 'تأكيد الحجز' : 'Confirm Booking')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Donation Modal moved to staff dashboard above */}
            {false && showEditModal && selectedDonationForEdit && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowEditModal(false); setSelectedDonationForEdit(null); } }}>
                    <div className="booking-modal glass-card edit-donation-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => { setShowEditModal(false); setSelectedDonationForEdit(null); }}>×</button>
                        <div className="modal-header">
                            <h2>✏️ {isAr ? 'تعديل بيانات طلب التبرع' : 'Edit Donation Record'}</h2>
                            <p>{isAr ? 'تحديث معلومات المتبرع والمواد وحالة الحجز بالكامل' : 'Update donor info, materials, and reservation status'}</p>
                        </div>
                        <form className="booking-form" onSubmit={handleSaveEditDonation}>
                            <div className="form-group">
                                <label>{isAr ? 'اسم المتبرع' : 'Donor Name'}</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={selectedDonationForEdit.studentName} 
                                    onChange={e => setSelectedDonationForEdit({ ...selectedDonationForEdit, studentName: e.target.value })} 
                                    className="form-input" 
                                />
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'رقم هاتف المتبرع' : 'Donor Phone'}</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={selectedDonationForEdit.phoneNumber} 
                                    onChange={e => setSelectedDonationForEdit({ ...selectedDonationForEdit, phoneNumber: toEnglishNumerals(e.target.value) })} 
                                    className="form-input" 
                                    maxLength="10"
                                />
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'جنس المتبرع' : 'Donor Gender'}</label>
                                <select 
                                    value={selectedDonationForEdit.studentGender} 
                                    onChange={e => setSelectedDonationForEdit({ ...selectedDonationForEdit, studentGender: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="male">{isAr ? 'ذكر' : 'Male'}</option>
                                    <option value="female">{isAr ? 'أنثى' : 'Female'}</option>
                                </select>
                            </div>

                            {loggedInUser.role === 'admin' && (
                                <div className="form-group terms-checkbox-container" style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input 
                                        type="checkbox" 
                                        id="publishedCheckbox" 
                                        checked={selectedDonationForEdit.publishedToCoordinators || false} 
                                        onChange={e => setSelectedDonationForEdit({ ...selectedDonationForEdit, publishedToCoordinators: e.target.checked })} 
                                    />
                                    <label htmlFor="publishedCheckbox" style={{ margin: 0, cursor: 'pointer' }}>
                                        📢 {isAr ? 'نشر وتفويض للمنسقين' : 'Publish/Delegate to Coordinators'}
                                    </label>
                                </div>
                            )}

                            <div className="edit-modal-materials-section">
                                <h3 style={{ margin: '15px 0 10px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '5px' }}>📚 {isAr ? 'المواد وحالات الحجز' : 'Materials & Reservation Status'}</h3>
                                {(selectedDonationForEdit.materials || []).map((material, index) => {
                                    const status = typeof material === 'object' ? material.status : 'pending';
                                    const name = typeof material === 'object' ? material.name : material;
                                    const description = typeof material === 'object' ? material.description : '';
                                    const taker = typeof material === 'object' ? (material.takerInfo || {}) : {};

                                    const updateMaterialField = (field, val) => {
                                        const updatedMats = [...selectedDonationForEdit.materials];
                                        if (typeof updatedMats[index] !== 'object') {
                                            updatedMats[index] = { name: updatedMats[index], status: 'pending' };
                                        }
                                        updatedMats[index] = { ...updatedMats[index], [field]: val };
                                        setSelectedDonationForEdit({ ...selectedDonationForEdit, materials: updatedMats });
                                    };

                                    const updateTakerField = (field, val) => {
                                        const updatedMats = [...selectedDonationForEdit.materials];
                                        if (typeof updatedMats[index] !== 'object') {
                                            updatedMats[index] = { name: updatedMats[index], status: 'pending' };
                                        }
                                        const curTaker = updatedMats[index].takerInfo || {};
                                        updatedMats[index] = {
                                            ...updatedMats[index],
                                            takerInfo: { ...curTaker, [field]: val }
                                        };
                                        setSelectedDonationForEdit({ ...selectedDonationForEdit, materials: updatedMats });
                                    };

                                    return (
                                        <div key={index} className="edit-material-block" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                                            <div className="material-details-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                                <input 
                                                    type="text" 
                                                    value={name} 
                                                    onChange={e => updateMaterialField('name', e.target.value)} 
                                                    className="form-input material-name-input"
                                                    placeholder={isAr ? 'اسم المادة' : 'Material name'}
                                                    style={{ flex: 1 }}
                                                    required
                                                />
                                                <select 
                                                    value={status} 
                                                    onChange={e => updateMaterialField('status', e.target.value)}
                                                    className="form-input material-status-select"
                                                    style={{ width: '150px' }}
                                                >
                                                    <option value="pending">{isAr ? '⏳ معلّقة' : 'Pending'}</option>
                                                    <option value="approved">{isAr ? '✅ معتمدة' : 'Approved'}</option>
                                                    <option value="reserved">{isAr ? '🔒 محجوزة' : 'Reserved'}</option>
                                                    <option value="completed">{isAr ? '📦 تم تسليمها' : 'Completed'}</option>
                                                </select>
                                            </div>
                                            <input 
                                                type="text" 
                                                value={description} 
                                                onChange={e => updateMaterialField('description', e.target.value)} 
                                                className="form-input material-desc-input"
                                                placeholder={isAr ? 'وصف المادة (اختياري)' : 'Description (optional)'}
                                            />
                                            {/* Taker Info (Booker) */}
                                            {['reserved', 'completed'].includes(status) && (
                                                <div className="taker-info-fields" style={{ marginTop: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>👤 {isAr ? 'معلومات المستلم (الحاجز)' : 'Taker/Booker Info'}</h4>
                                                    <div className="taker-fields-row" style={{ display: 'flex', gap: '8px' }}>
                                                        <input 
                                                            type="text" 
                                                            value={taker.name || ''} 
                                                            onChange={e => updateTakerField('name', e.target.value)} 
                                                            className="form-input" 
                                                            placeholder={isAr ? 'اسم المستلم' : 'Taker Name'} 
                                                            style={{ flex: 1 }}
                                                            required
                                                        />
                                                        <input 
                                                            type="tel" 
                                                            value={taker.phone || ''} 
                                                            onChange={e => updateTakerField('phone', toEnglishNumerals(e.target.value))} 
                                                            className="form-input" 
                                                            placeholder={isAr ? 'رقم هاتف المستلم' : 'Taker Phone'} 
                                                            style={{ flex: 1 }}
                                                            required
                                                            maxLength="10"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <button type="submit" className="submit-btn full-width" disabled={loading} style={{ marginTop: '20px' }}>
                                {loading ? (isAr ? '⏳ جاري الحفظ...' : 'Saving...') : (isAr ? '💾 حفظ التعديلات' : 'Save Changes')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialExchange;
