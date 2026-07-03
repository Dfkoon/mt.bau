import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { db } from '../config/firebase';
import {
    collection, query, orderBy, limit, getDocs,
    doc, updateDoc, deleteDoc, where, onSnapshot,
    setDoc, serverTimestamp
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import FileUploader from '../components/FileUploader';
import { subscribeToContributions, approveContribution, deleteContribution } from '../services/contributionsService';
import { quizCategories, quizData as staticBaseQuizData } from '../data/quizData';
import { extraQuizData as staticExtraQuizData } from '../data/quizDataExtra';
import './AdminDashboard.css';

// ── CAPTCHA helpers ──────────────────────────────────────────────────
function generateText() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let r = '';
    for (let i = 0; i < 5; i++) r += chars[Math.floor(Math.random() * chars.length)];
    return r;
}

function drawCanvas(canvas, text) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.fillStyle = isDark ? '#1f2937' : '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
    const fontSize = Math.floor(canvas.height * 0.55);
    ctx.font = `bold ${fontSize}px Courier New, monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const colors = isDark
        ? ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#ff9ff3']
        : ['#d63031', '#0984e3', '#00b894', '#fdcb6e', '#6c5ce7', '#db0a5b'];
    const spacing = canvas.width / (text.length + 1);
    for (let i = 0; i < text.length; i++) {
        ctx.save();
        ctx.fillStyle = colors[i % colors.length];
        const x = spacing * 0.85 + i * spacing + (Math.random() - 0.5) * 8;
        const y = canvas.height / 2 + (Math.random() - 0.5) * 6;
        ctx.translate(x, y);
        ctx.rotate((Math.random() - 0.5) * 0.35);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
    }
}

// ── Path label helper ─────────────────────────────────────────────────
const PATH_LABELS = {
    '/': 'الرئيسية',
    '/materials': 'المواد الدراسية',
    '/plans': 'الخطط الدراسية',
    '/quiz': 'الاختبارات',
    '/calendar': 'التقويم',
    '/grading': 'الدرجات',
    '/exchange': 'تبادل المواد',
    '/about': 'من نحن',
    '/faq': 'الأسئلة الشائعة',
    '/materials/click': 'مواد (تحميل)',
    '/quiz/complete': 'اختبار (إتمام)',
};
const getPathLabel = (path, lang) => {
    if (lang === 'ar') {
        return PATH_LABELS[path] || path;
    }
    const en = {
        '/': 'Home', '/materials': 'Study Materials', '/plans': 'Academic Plans',
        '/quiz': 'Quizzes', '/calendar': 'Calendar', '/grading': 'Grading',
        '/exchange': 'Exchange', '/about': 'About', '/faq': 'FAQ',
        '/materials/click': 'Materials (Download)', '/quiz/complete': 'Quiz (Completed)',
    };
    return en[path] || path;
};

// ── Type badge ────────────────────────────────────────────────────────
function TypeBadge({ type }) {
    const map = {
        visit: { label: 'زيارة', cls: 'badge-visit', en: 'Visit' },
        material_view: { label: 'مادة', cls: 'badge-material', en: 'Material' },
        quiz_completed: { label: 'اختبار', cls: 'badge-quiz', en: 'Quiz' },
    };
    const b = map[type] || { label: type, cls: 'badge-visit', en: type };
    return <span className={`badge ${b.cls}`}>{b.label}</span>;
}

// ── Date formatter ────────────────────────────────────────────────────
function fmtDate(ts) {
    if (!ts) return '—';
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return d.toLocaleDateString('ar-JO') + ' ' + d.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' });
}

// ══════════════════════════════════════════════════════════════════════
const AdminDashboard = ({ isEmbedded = false }) => {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    // ── Auth state ──
    const [loggedIn, setLoggedIn] = useState(() => {
        try {
            const s = sessionStorage.getItem('exchange_staff');
            if (s) { const u = JSON.parse(s); if (u?.role === 'admin') return true; }
        } catch { /* ignore */ }
        return false;
    });
    const [adminPwd, setAdminPwd] = useState('');
    const [loginErr, setLoginErr] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaErr, setCaptchaErr] = useState(false);
    const canvasRef = useRef(null);

    // ── Admin password from Firestore ──
    const [adminPasswordFromDB, setAdminPasswordFromDB] = useState('admin2024');
    useEffect(() => {
        (async () => {
            try {
                const snap = await getDocs(query(collection(db, 'system_configs')));
                snap.forEach(d => {
                    if (d.id === 'global_settings' && d.data().adminPassword) {
                        setAdminPasswordFromDB(d.data().adminPassword);
                    }
                });
            } catch { /* ignore */ }
        })();
    }, []);

    // Generate captcha
    const genCaptcha = useCallback(() => {
        const t = generateText();
        setCaptchaText(t);
        setCaptchaInput('');
        setCaptchaErr(false);
        setTimeout(() => drawCanvas(canvasRef.current, t), 50);
    }, []);

    useEffect(() => { if (!loggedIn) genCaptcha(); }, [loggedIn, genCaptcha]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (captchaInput.trim().toUpperCase() !== captchaText) {
            setCaptchaErr(true); genCaptcha();
            return;
        }
        if (adminPwd === adminPasswordFromDB) {
            sessionStorage.setItem('exchange_staff', JSON.stringify({ role: 'admin', username: 'admin' }));
            // Sign in anonymously to Firebase Auth so Firestore security rules
            // (request.auth != null) allow reads of protected collections
            try {
                const auth = getAuth();
                if (!auth.currentUser) await signInAnonymously(auth);
            } catch (authErr) {
                console.warn('Anonymous Firebase auth failed (non-critical):', authErr.code);
            }
            setLoggedIn(true);
            toast.success(isAr ? '🔓 مرحباً بك في لوحة التحكم' : '🔓 Welcome to the dashboard');
        } else {
            setLoginErr(isAr ? 'كلمة مرور خاطئة' : 'Incorrect password');
            genCaptcha();
        }
    };

    // ── Dashboard data state ──
    const [activeTab, setActiveTab] = useState('analytics');
    const [pageViews, setPageViews] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [contributions, setContributions] = useState([]);
    const [contributionsLoading, setContributionsLoading] = useState(true);
    const [showAdminUploader, setShowAdminUploader] = useState(false);
    const [selectedGeneralPage, setSelectedGeneralPage] = useState('system_settings');
    // ── Question-edit modal ──
    const [editingReport, setEditingReport] = useState(null);
    const [editForm, setEditForm] = useState({ questionAr: '', questionEn: '', options: [], correctAnswer: '' });
    const [editSaving, setEditSaving] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const imageInputRef = useRef(null);

    const [isAuthed, setIsAuthed] = useState(false);

    // ── Quiz Management States ──
    const [qManageSubjects, setQManageSubjects] = useState([]);
    const [qManageParts, setQManageParts] = useState([]);
    const [qManageQuestions, setQManageQuestions] = useState([]);

    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedPartId, setSelectedPartId] = useState('');

    const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
    const [subjectForm, setSubjectForm] = useState({ id: '', name: '', nameAr: '', icon: '📚', color: '#6366F1', languageMode: 'both' });

    const [showAddPartModal, setShowAddPartModal] = useState(false);
    const [partForm, setPartForm] = useState({ id: '', title: '', titleAr: '', isGroup: false });

    const [editingQuestion, setEditingQuestion] = useState(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [questionForm, setQuestionForm] = useState({ id: '', type: 'mcq', questionAr: '', questionEn: '', options: [], correctAnswer: '', marks: 1.0, image: '', image2: '' });
    
    // Hidden file inputs for question image upload from device inside quizzes tab
    const quizImageInputRef = useRef(null);
    const [quizImageUploading, setQuizImageUploading] = useState(false);
    const [quizImageProgress, setQuizImageProgress] = useState(0);

    const quizImage2InputRef = useRef(null);
    const [quizImage2Uploading, setQuizImage2Uploading] = useState(false);
    const [quizImage2Progress, setQuizImage2Progress] = useState(0);

    // ── Per-option undo history (Ctrl+Z) ──
    const optionHistories = useRef({}); // { idx: ['val0','val1',...] }
    const pushOptionHistory = (idx, value) => {
        if (!optionHistories.current[idx]) optionHistories.current[idx] = [];
        const hist = optionHistories.current[idx];
        if (hist[hist.length - 1] !== value) {
            hist.push(value);
            if (hist.length > 80) hist.shift();
        }
    };
    const undoOptionChange = (idx, field) => {
        const hist = optionHistories.current[idx] || [];
        if (hist.length > 1) {
            hist.pop();
            updateQuestionOption(idx, field, hist[hist.length - 1]);
        } else if (hist.length === 1) {
            hist.pop();
            updateQuestionOption(idx, field, '');
        }
    };

    // ── Listen to Firebase Auth state changes ──
    useEffect(() => {
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) setIsAuthed(true);
            else setIsAuthed(false);
        });
        return () => unsub();
    }, []);

    // ── Ensure Firebase Auth is set whenever admin is logged in (even from sessionStorage) ──
    useEffect(() => {
        if (!loggedIn) return;
        const auth = getAuth();
        if (!auth.currentUser) {
            signInAnonymously(auth).catch(err =>
                console.warn('Anonymous Firebase auth failed (non-critical):', err.code)
            );
        }
    }, [loggedIn]);

    // ── Load general data on login ──
    useEffect(() => {
        if (!loggedIn) return;

        // Page views (latest 10000 for highly accurate statistics)
        const pv = query(collection(db, 'page_views'), orderBy('timestamp', 'desc'), limit(10000));
        getDocs(pv).then(s => {
            setPageViews(s.docs.map(d => ({ id: d.id, ...d.data() })));
        }).catch(console.error);

        // Suggestions (realtime)
        const unsubSug = onSnapshot(
            query(collection(db, 'suggestions'), orderBy('timestamp', 'desc'), limit(100)),
            s => setSuggestions(s.docs.map(d => ({ id: d.id, ...d.data() }))),
            err => console.error('suggestions read error:', err.code)
        );

        // Testimonials (realtime)
        const unsubTest = onSnapshot(
            query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'), limit(100)),
            s => setTestimonials(s.docs.map(d => ({ id: d.id, ...d.data() }))),
            err => console.error('testimonials read error:', err.code)
        );

        return () => { unsubSug(); unsubTest(); };
    }, [loggedIn]);

    // ── Load question reports on auth ──
    useEffect(() => {
        if (!loggedIn) return;

        setLoading(true);

        const unsubRep = onSnapshot(
            query(collection(db, 'question_reports'), orderBy('createdAt', 'desc'), limit(100)),
            s => {
                const data = s.docs.map(d => ({ id: d.id, ...d.data() }));
                setReports(data);
                setLoading(false);
            },
            err => {
                console.error('question_reports read error:', err.code, err.message);
                toast.error(isAr ? `خطأ في تحميل البلاغات: ${err.code}` : `Reports load error: ${err.code}`);
                setLoading(false);
            }
        );

        return () => unsubRep();
    }, [loggedIn]);

    // ── Load quiz subjects and parts for management ──
    useEffect(() => {
        if (!loggedIn) return;

        const unsubSubjects = onSnapshot(collection(db, 'quiz_subjects'), (snap) => {
            const list = [];
            snap.forEach(d => list.push(d.data()));
            setQManageSubjects(list);
        }, err => console.error('Subjects read error:', err));

        const unsubParts = onSnapshot(collection(db, 'quiz_parts'), (snap) => {
            const list = [];
            snap.forEach(d => list.push(d.data()));
            setQManageParts(list);
        }, err => console.error('Parts read error:', err));

        return () => {
            unsubSubjects();
            unsubParts();
        };
    }, [loggedIn]);

    // ── Load questions for selected part ──
    useEffect(() => {
        if (!selectedPartId || !loggedIn) {
            setQManageQuestions([]);
            return;
        }
        const q = query(collection(db, 'quiz_questions'), where('partId', '==', selectedPartId));
        const unsubQuestions = onSnapshot(q, (snap) => {
            const list = [];
            snap.forEach(d => list.push(d.data()));
            setQManageQuestions(list);
        }, err => console.error('Questions read error:', err));

        return () => unsubQuestions();
    }, [selectedPartId, loggedIn]);

    useEffect(() => {
        if (!loggedIn) return;
        setContributionsLoading(true);
        const unsubContributions = subscribeToContributions((data) => {
            setContributions(data);
            setContributionsLoading(false);
        });
        return () => unsubContributions();
    }, [loggedIn]);

    // ── KPI calculations ──
    const totalVisits = pageViews.filter(v => v.type === 'visit').length;
    const materialViews = pageViews.filter(v => v.type === 'material_view').length;
    const quizCompletions = pageViews.filter(v => v.type === 'quiz_completed').length;
    const uniqueStudents = new Set(pageViews.filter(v => v.studentPhone).map(v => v.studentPhone)).size;

    // ── Path frequency for charts ──
    const pathCounts = {};
    pageViews.filter(v => v.type === 'visit').forEach(v => {
        pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
    });
    const sortedPaths = Object.entries(pathCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maxPathCount = sortedPaths[0]?.[1] || 1;

    // ── Popular courses ──
    const courseCounts = {};
    pageViews.filter(v => v.type === 'material_view' && v.courseName).forEach(v => {
        courseCounts[v.courseName] = (courseCounts[v.courseName] || 0) + 1;
    });
    const sortedCourses = Object.entries(courseCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxCourseCount = sortedCourses[0]?.[1] || 1;

    // ── Actions ──
    const resolveSuggestion = async (id) => {
        try {
            await updateDoc(doc(db, 'suggestions', id), { status: 'resolved', read: true });
            toast.success(isAr ? 'تم حل الشكوى' : 'Marked as resolved');
        } catch { toast.error(isAr ? 'خطأ في التحديث' : 'Update failed'); }
    };

    const deleteSuggestion = async (id) => {
        if (!window.confirm(isAr ? 'هل تريد حذف هذه الرسالة؟' : 'Delete this message?')) return;
        try { await deleteDoc(doc(db, 'suggestions', id)); toast.success('✅'); } catch { toast.error('خطأ'); }
    };

    const toggleTestimonialApproval = async (id, current) => {
        try {
            await updateDoc(doc(db, 'testimonials', id), { approved: !current });
            toast.success(isAr ? (current ? 'تم إلغاء الظهور' : 'تم الموافقة') : (current ? 'Hidden' : 'Approved'));
        } catch { toast.error(isAr ? 'خطأ في التحديث' : 'Update failed'); }
    };

    const resolveReport = async (id) => {
        try {
            await updateDoc(doc(db, 'question_reports', id), { status: 'resolved' });
            toast.success(isAr ? 'تم وضع علامة محلول' : 'Marked resolved');
        } catch { toast.error('خطأ'); }
    };

    const deleteReport = async (id) => {
        if (!window.confirm(isAr ? 'حذف هذا البلاغ؟' : 'Delete this report?')) return;
        try { await deleteDoc(doc(db, 'question_reports', id)); toast.success('✅'); } catch { toast.error('خطأ'); }
    };

    // ── Question edit modal helpers ──
    const openEditModal = (r) => {
        setEditingReport(r);
        setEditForm({
            questionAr: r.questionAr || '',
            questionEn: r.questionEn || '',
            options: r.options ? r.options.map(o => ({ ...o })) : [],
            correctAnswer: r.correctAnswer || '',
            image: r.image || '',
        });
    };
    const closeEditModal = () => setEditingReport(null);

    const updateOption = (idx, field, val) =>
        setEditForm(prev => ({
            ...prev,
            options: prev.options.map((o, i) => i === idx ? { ...o, [field]: val } : o),
        }));

    const deleteOption = (idx) =>
        setEditForm(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== idx),
            // If deleted option was correct answer, clear correctAnswer
            correctAnswer: prev.correctAnswer === (prev.options[idx]?.id) ? '' : prev.correctAnswer,
        }));

    const addOption = () => {
        const newId = `opt_${Date.now()}`;
        setEditForm(prev => ({
            ...prev,
            options: [
                ...prev.options,
                { id: newId, textAr: '', textEn: '' }
            ],
        }));
    };

    const saveQuestionEdit = async () => {
        if (!editingReport) return;
        setEditSaving(true);
        try {
            const editKey = `${editingReport.quizId}_${editingReport.questionId}`;
            const payload = {
                quizId: editingReport.quizId,
                questionId: editingReport.questionId,
                questionAr: editForm.questionAr,
                questionEn: editForm.questionEn,
                options: editForm.options,
                correctAnswer: editForm.correctAnswer,
                updatedAt: serverTimestamp(),
            };
            if (editForm.image) payload.image = editForm.image;
            else payload.image = null;

            await setDoc(doc(db, 'question_edits', editKey), payload);
            await updateDoc(doc(db, 'question_reports', editingReport.id), {
                status: 'resolved',
                questionAr: editForm.questionAr,
                questionEn: editForm.questionEn,
                options: editForm.options,
                correctAnswer: editForm.correctAnswer,
                ...(editForm.image ? { image: editForm.image } : { image: null }),
            });
            toast.success(isAr ? '✅ تم حفظ تعديل السؤال' : '✅ Question edit saved');
            closeEditModal();
        } catch (e) {
            console.error(e);
            toast.error(isAr ? 'خطأ في الحفظ' : 'Save failed');
        } finally {
            setEditSaving(false);
        }
    };

    // ── Quiz Management Helpers & Memos ──
    const allSubjects = useMemo(() => {
        const list = [...quizCategories];
        qManageSubjects.forEach(sub => {
            if (!list.some(c => c.id === sub.id)) {
                list.push({ ...sub, isDynamic: true });
            }
        });
        return list;
    }, [qManageSubjects]);

    const activeSubject = allSubjects.find(s => s.id === selectedSubjectId);
    
    const allParts = useMemo(() => {
        if (!selectedSubjectId) return [];
        const staticParts = activeSubject?.parts || [];
        const list = [...staticParts];
        
        const dynamicParts = qManageParts.filter(p => p.subjectId === selectedSubjectId);
        dynamicParts.forEach(dp => {
            if (!list.some(p => p.id === dp.id)) {
                list.push({ ...dp, isDynamic: true });
            }
        });
        return list;
    }, [selectedSubjectId, activeSubject, qManageParts]);

    const allQuestions = useMemo(() => {
        if (!selectedPartId) return [];
        const staticQuizObj = staticBaseQuizData[selectedPartId] || staticExtraQuizData[selectedPartId] || {};
        const staticQs = staticQuizObj.questions || [];
        const list = [...staticQs];

        qManageQuestions.forEach(dbQ => {
            const idx = list.findIndex(q => q.id === dbQ.id);
            if (idx >= 0) {
                list[idx] = { ...list[idx], ...dbQ, isDynamic: true };
            } else {
                list.push({ ...dbQ, isDynamic: true });
            }
        });
        return list;
    }, [selectedPartId, qManageQuestions]);

    const saveSubject = async () => {
        if (!subjectForm.id || !subjectForm.name || !subjectForm.nameAr) {
            toast.error(isAr ? 'يرجى ملء جميع الحقول الإلزامية' : 'Please fill all required fields');
            return;
        }
        try {
            const subId = subjectForm.id.toLowerCase().trim();
            await setDoc(doc(db, 'quiz_subjects', subId), {
                id: subId,
                name: subjectForm.name.trim(),
                nameAr: subjectForm.nameAr.trim(),
                icon: subjectForm.icon,
                color: subjectForm.color,
                languageMode: subjectForm.languageMode, // 'both', 'en', 'ar'
                isNew: true,
                createdAt: serverTimestamp()
            });
            toast.success(isAr ? '✅ تم حفظ المادة بنجاح' : '✅ Subject saved successfully');
            setShowAddSubjectModal(false);
            setSubjectForm({ id: '', name: '', nameAr: '', icon: '📚', color: '#6366F1', languageMode: 'both' });
        } catch (e) {
            console.error(e);
            toast.error(isAr ? `❌ فشل حفظ المادة: ${e.message || e}` : `❌ Failed to save subject: ${e.message || e}`);
        }
    };

    const deleteSubject = async (subId) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذه المادة؟ سيتم حذف كافة الأجزاء والأسئلة التابعة لها!' : 'Are you sure? This will delete all parts and questions in this subject!')) return;
        try {
            await deleteDoc(doc(db, 'quiz_subjects', subId));
            const partsSnap = await getDocs(query(collection(db, 'quiz_parts'), where('subjectId', '==', subId)));
            const promises = [];
            partsSnap.forEach(d => promises.push(deleteDoc(d.ref)));
            const qSnap = await getDocs(query(collection(db, 'quiz_questions'), where('subjectId', '==', subId)));
            qSnap.forEach(d => promises.push(deleteDoc(d.ref)));
            await Promise.all(promises);
            setSelectedSubjectId('');
            setSelectedPartId('');
            toast.success(isAr ? '🗑️ تم حذف المادة وكافة بياناتها' : '🗑️ Subject and all related data deleted');
        } catch (e) {
            console.error(e);
            toast.error(isAr ? 'فشل حذف المادة' : 'Failed to delete subject');
        }
    };

    const savePart = async () => {
        if (!selectedSubjectId) {
            toast.error(isAr ? '⚠️ يرجى اختيار المادة أولاً' : '⚠️ Please select a subject first');
            return;
        }
        if (!partForm.id || !partForm.title || !partForm.titleAr) {
            toast.error(isAr ? '⚠️ يرجى ملء جميع الحقول الإلزامية' : '⚠️ Please fill all required fields');
            return;
        }
        try {
            // Sanitize partId to be URL-safe (replace spaces with underscores)
            const partId = partForm.id.toLowerCase().trim().replace(/\s+/g, '_');
            await setDoc(doc(db, 'quiz_parts', partId), {
                id: partId,
                subjectId: selectedSubjectId,
                title: partForm.title.trim(),
                titleAr: partForm.titleAr.trim(),
                isGroup: partForm.isGroup || false,
                subParts: partForm.isGroup ? [] : null,
                createdAt: serverTimestamp()
            });
            toast.success(isAr ? '✅ تم حفظ الجزء بنجاح' : '✅ Quiz part saved successfully');
            setShowAddPartModal(false);
            setPartForm({ id: '', title: '', titleAr: '', isGroup: false });
        } catch (e) {
            console.error(e);
            toast.error(isAr ? `❌ فشل حفظ الجزء: ${e.message || e}` : `❌ Failed to save quiz part: ${e.message || e}`);
        }
    };

    const deletePart = async (partId) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الجزء؟ سيتم حذف جميع الأسئلة التابعة له!' : 'Are you sure? This will delete all questions in this part!')) return;
        try {
            await deleteDoc(doc(db, 'quiz_parts', partId));
            const qSnap = await getDocs(query(collection(db, 'quiz_questions'), where('partId', '==', partId)));
            const promises = [];
            qSnap.forEach(d => promises.push(deleteDoc(d.ref)));
            await Promise.all(promises);
            setSelectedPartId('');
            toast.success(isAr ? '🗑️ تم حذف الجزء وكافة أسئلته' : '🗑️ Part and questions deleted');
        } catch (e) {
            console.error(e);
            toast.error(isAr ? 'فشل حذف الجزء' : 'Failed to delete part');
        }
    };

    // Helper to translate text using MyMemory Translation API
    const translateText = async (text, direction) => {
        if (!text || !text.trim()) return '';
        const langpair = direction === 'ar2en' ? 'ar|en' : 'en|ar';
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.responseData?.translatedText) {
                // MyMemory can return HTML character references sometimes
                const parser = new DOMParser();
                const dom = parser.parseFromString(data.responseData.translatedText, 'text/html');
                return dom.body.textContent;
            }
            return '';
        } catch (err) {
            console.error('Translation failed:', err);
            return '';
        }
    };

    const handleQuestionTypeChange = (newType) => {
        setQuestionForm(prev => {
            let options = [...prev.options];
            let correctAnswer = prev.correctAnswer;
            let subQuestions = prev.subQuestions || [];
            if (newType === 'true_false') {
                options = [
                    { id: 'a', textAr: 'صح', textEn: 'True' },
                    { id: 'b', textAr: 'خطأ', textEn: 'False' }
                ];
                if (correctAnswer !== 'a' && correctAnswer !== 'b') correctAnswer = 'a';
                subQuestions = [];
            } else if (newType === 'matching') {
                // Keep existing options as the answer pool, add initial subQuestions if empty
                if (!subQuestions.length) {
                    subQuestions = [
                        { id: 'sq1', textAr: '', textEn: '', correctAnswer: '' },
                        { id: 'sq2', textAr: '', textEn: '', correctAnswer: '' },
                    ];
                }
                if (!options.length || (prev.type === 'true_false')) {
                    options = [
                        { id: 'a', textAr: '', textEn: '' },
                        { id: 'b', textAr: '', textEn: '' },
                        { id: 'c', textAr: '', textEn: '' },
                    ];
                }
                correctAnswer = '';
            } else if (prev.type === 'true_false' || prev.type === 'matching') {
                // Switching back to MCQ
                options = [
                    { id: 'a', textAr: '', textEn: '' },
                    { id: 'b', textAr: '', textEn: '' },
                    { id: 'c', textAr: '', textEn: '' },
                    { id: 'd', textAr: '', textEn: '' }
                ];
                correctAnswer = 'a';
                subQuestions = [];
            }
            return { ...prev, type: newType, options, correctAnswer, subQuestions };
        });
    };

    const openQuestionModal = (q = null) => {
        if (q) {
            setEditingQuestion(q);
            setQuestionForm({
                id: q.id || '',
                type: q.type || 'mcq',
                questionAr: q.questionAr || '',
                questionEn: q.questionEn || '',
                options: q.options ? q.options.map(o => ({ ...o })) : [],
                subQuestions: q.subQuestions ? q.subQuestions.map(s => ({ ...s })) : [],
                correctAnswer: q.correctAnswer || '',
                marks: q.marks || 1.0,
                image: q.image || '',
                image2: q.image2 || '',
            });
        } else {
            setEditingQuestion(null);
            setQuestionForm({
                id: '',
                type: 'mcq',
                questionAr: '',
                questionEn: '',
                options: [
                    { id: 'a', textAr: '', textEn: '' },
                    { id: 'b', textAr: '', textEn: '' },
                    { id: 'c', textAr: '', textEn: '' },
                    { id: 'd', textAr: '', textEn: '' }
                ],
                subQuestions: [],
                correctAnswer: 'a',
                marks: 1.0,
                image: '',
                image2: '',
            });
        }
        setShowQuestionModal(true);
    };

    const updateQuestionOption = (idx, field, val) => {
        setQuestionForm(prev => ({
            ...prev,
            options: prev.options.map((o, i) => i === idx ? { ...o, [field]: val } : o)
        }));
    };

    const deleteQuestionOption = (idx) => {
        setQuestionForm(prev => {
            const options = prev.options.filter((_, i) => i !== idx);
            const deletedOptId = prev.options[idx]?.id;
            const correctAnswer = prev.correctAnswer === deletedOptId ? '' : prev.correctAnswer;
            return { ...prev, options, correctAnswer };
        });
    };

    const addQuestionOption = () => {
        const nextLetter = String.fromCharCode(97 + questionForm.options.length);
        const newId = questionForm.options.some(o => o.id === nextLetter) ? `opt_${Date.now()}` : nextLetter;
        setQuestionForm(prev => ({
            ...prev,
            options: [...prev.options, { id: newId, textAr: '', textEn: '', image: '' }]
        }));
    };

    // Ref map for option textEn inputs so we can read selectionStart/End
    const optionInputRefs = useRef({});

    const insertFormatIntoOption = (idx, field, tagType, extra) => {
        const el = optionInputRefs.current[`${idx}-${field}`];
        const currentVal = questionForm.options[idx]?.[field] || '';

        // For table, no selection needed — just append
        if (tagType === 'table') {
            const relName = prompt(isAr ? 'أدخل اسم الجدول / العلاقة (مثال: B):' : 'Enter relation name (e.g. B):');
            if (relName === null) return;
            const attrsInput = prompt(isAr ? 'أدخل الحقول مفصولة بفاصلة. ضع نجمة (*) قبل الحقل لتسطيره كمفتاح أساسي (مثال: *s1, b1, x, y):' : 'Enter attributes separated by commas. Put an asterisk (*) before an attribute to underline it (e.g., *s1, b1, x, y):');
            if (attrsInput === null) return;
            const cells = attrsInput.split(',').map(attr => {
                const trimmed = attr.trim();
                return trimmed.startsWith('*')
                    ? `<td><u>${trimmed.substring(1)}</u></td>`
                    : `<td>${trimmed}</td>`;
            });
            const tableTag = `<table class="relation-table"><tr><td>${relName || 'Relation'}</td>${cells.join('')}</tr></table>`;
            pushOptionHistory(idx, currentVal);
            updateQuestionOption(idx, field, currentVal + tableTag);
            return;
        }

        // Read selection from the real DOM input element
        const start = el ? el.selectionStart : currentVal.length;
        const end   = el ? el.selectionEnd   : currentVal.length;
        const selected = currentVal.substring(start, end);
        const placeholder = tagType === 'code' ? 'code' : 'نص';
        const text = selected || placeholder;

        let wrapped = '';
        if (tagType === 'bold')      wrapped = `<strong>${text}</strong>`;
        else if (tagType === 'italic')    wrapped = `<em>${text}</em>`;
        else if (tagType === 'underline') wrapped = `<u>${text}</u>`;
        else if (tagType === 'code')      wrapped = `<code>${text}</code>`;
        else if (tagType === 'color')     wrapped = `<span style="color:${extra};">${text}</span>`;
        else if (tagType === 'highlight') wrapped = `<mark style="background:${extra};color:#000;">${text}</mark>`;
        else return;

        const newVal = currentVal.substring(0, start) + wrapped + currentVal.substring(end);
        pushOptionHistory(idx, currentVal);
        updateQuestionOption(idx, field, newVal);

        // Restore caret after React re-render
        setTimeout(() => {
            if (!el) return;
            el.focus();
            const newCaret = start + wrapped.length;
            el.selectionStart = newCaret;
            el.selectionEnd   = newCaret;
        }, 0);
    };

    // ── Format selected text in question textarea (bold, italic, color, etc.) ──
    const questionArRef = React.useRef(null);
    const questionEnRef = React.useRef(null);

    const insertFormatIntoQuestion = (field, tagType, extra) => {
        const ref = field === 'questionAr' ? questionArRef : questionEnRef;
        const el = ref.current;
        if (!el) return;

        const start = el.selectionStart;
        const end   = el.selectionEnd;
        const currentVal = field === 'questionAr' ? questionForm.questionAr : questionForm.questionEn;
        const selected = currentVal.substring(start, end);

        let wrapped = '';
        if (tagType === 'bold')      wrapped = `<strong>${selected || 'نص'}</strong>`;
        else if (tagType === 'italic')    wrapped = `<em>${selected || 'نص'}</em>`;
        else if (tagType === 'underline') wrapped = `<u>${selected || 'نص'}</u>`;
        else if (tagType === 'color')     wrapped = `<span style="color:${extra};">${selected || 'نص'}</span>`;
        else if (tagType === 'highlight') wrapped = `<mark style="background:${extra};color:#000;">${selected || 'نص'}</mark>`;
        else if (tagType === 'code')      wrapped = `<code>${selected || 'code'}</code>`;

        const newVal = currentVal.substring(0, start) + wrapped + currentVal.substring(end);
        setQuestionForm(prev => ({ ...prev, [field]: newVal }));

        // restore caret after React re-render
        setTimeout(() => {
            el.focus();
            el.selectionStart = start + wrapped.length;
            el.selectionEnd   = start + wrapped.length;
        }, 0);
    };

    // Colors available in the question text color picker
    const QUESTION_COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
    const HIGHLIGHT_COLORS = ['#fde68a','#bbf7d0','#bfdbfe','#fca5a5','#e9d5ff','#fed7aa'];

    const handleOptionImageChange = async (idx, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error(isAr ? 'حجم الصورة يجب أن يكون أقل من 5 ميجا بايت' : 'Image must be under 5MB');
            return;
        }
        try {
            const compressed = await new Promise((resolve, reject) => {
                const img = new Image();
                const url = URL.createObjectURL(file);
                img.onload = () => {
                    URL.revokeObjectURL(url);
                    const MAX = 600;
                    let w = img.width, h = img.height;
                    if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
                    const canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = reject;
                img.src = url;
            });
            updateQuestionOption(idx, 'image', compressed);
            toast.success(isAr ? '✅ تم تحميل صورة الخيار' : '✅ Option image loaded');
        } catch (err) {
            console.error(err);
            toast.error(isAr ? 'خطأ في معالجة الصورة' : 'Image processing error');
        }
        e.target.value = '';
    };

    const saveQuestion = async () => {
        if (!selectedPartId) return;
        if (!questionForm.questionAr && !questionForm.questionEn) {
            toast.error(isAr ? 'يرجى إدخال نص السؤال (عربي أو إنجليزي)' : 'Please enter question text');
            return;
        }
        if (questionForm.type !== 'matching' && questionForm.options.length < 2) {
            toast.error(isAr ? 'يجب إدخال خيارين على الأقل' : 'Please add at least 2 options');
            return;
        }
        if (questionForm.type === 'matching') {
            if (questionForm.options.length < 2) {
                toast.error(isAr ? 'يجب إدخال خيارين على الأقل في قائمة الإجابات' : 'Please add at least 2 answer options');
                return;
            }
            if (questionForm.subQuestions.length < 1) {
                toast.error(isAr ? 'يجب إدخال جملة فرعية واحدة على الأقل' : 'Please add at least 1 sub-question');
                return;
            }
        } else if (!questionForm.correctAnswer) {
            toast.error(isAr ? 'يرجى اختيار الإجابة الصحيحة' : 'Please select the correct answer');
            return;
        }

        try {
            const qId = questionForm.id || `q_${Date.now()}`;
            const docRef = doc(db, 'quiz_questions', `${selectedPartId}_${qId}`);
            const docData = {
                id: qId,
                partId: selectedPartId,
                subjectId: selectedSubjectId,
                type: questionForm.type,
                questionAr: questionForm.questionAr.trim(),
                questionEn: questionForm.questionEn.trim(),
                options: questionForm.options,
                marks: Number(questionForm.marks) || 1,
                image: questionForm.image || null,
                image2: questionForm.image2 || null,
                createdAt: serverTimestamp()
            };
            if (questionForm.type === 'matching') {
                docData.subQuestions = questionForm.subQuestions;
                docData.correctAnswer = null;
            } else {
                docData.correctAnswer = questionForm.correctAnswer;
            }
            await setDoc(docRef, docData);
            toast.success(isAr ? '✅ تم حفظ السؤال بنجاح' : '✅ Question saved successfully');
            setShowQuestionModal(false);
            setEditingQuestion(null);
        } catch (e) {
            console.error(e);
            toast.error(isAr ? `❌ فشل حفظ السؤال: ${e.message || e}` : `❌ Failed to save question: ${e.message || e}`);
        }
    };

    const deleteQuestion = async (qId) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this question?')) return;
        try {
            await deleteDoc(doc(db, 'quiz_questions', `${selectedPartId}_${qId}`));
            toast.success(isAr ? '🗑️ تم حذف السؤال' : '🗑️ Question deleted');
        } catch (e) {
            console.error(e);
            toast.error(isAr ? 'فشل حذف السؤال' : 'Failed to delete question');
        }
    };

    // ── Filtered suggestions ──
    const filteredSuggestions = suggestions.filter(s => {
        if (filterType !== 'all' && s.type !== filterType) return false;
        if (filterStatus !== 'all' && s.status !== filterStatus) return false;
        return true;
    });

    // ── Filtered activity ──
    const filteredActivity = pageViews.filter(v => {
        if (filterType === 'all') return true;
        return v.type === filterType;
    });

    const generalAdminPages = [
        {
            id: 'system_settings',
            titleAr: 'إعدادات النظام',
            titleEn: 'System Settings',
            descAr: 'ضبط الإعدادات العامة للموقع والتطبيق.',
            descEn: 'Configure general site and app settings.',
        },
        {
            id: 'user_management',
            titleAr: 'إدارة المستخدمين',
            titleEn: 'User Management',
            descAr: 'عرض وتعديل صلاحيات الموظفين والمستخدمين.',
            descEn: 'View and edit staff and user permissions.',
        },
        {
            id: 'content_management',
            titleAr: 'إدارة المحتوى',
            titleEn: 'Content Management',
            descAr: 'إدارة الصفحات الداخلية والمحتوى العام.',
            descEn: 'Manage internal pages and general content.',
        },
        {
            id: 'student_contributions',
            titleAr: 'مساهمات الطلاب',
            titleEn: 'Student Contributions',
            descAr: 'عرض وإدارة المساهمات الواردة من قسم إثراء محتوى مكانك.',
            descEn: 'View and manage contributions submitted through the content enrichment section.',
        },
        {
            id: 'reports_archive',
            titleAr: 'التقارير والأرشيف',
            titleEn: 'Reports & Archive',
            descAr: 'مراجعة سجل النظام والتقارير الهامة.',
            descEn: 'Review system logs and important reports.',
        },
    ];

    const selectedGeneralPageData = generalAdminPages.find(p => p.id === selectedGeneralPage) || generalAdminPages[0];

    // ────────────────────────────────────────────────────────────────────
    // LOGIN SCREEN
    // ────────────────────────────────────────────────────────────────────
    if (!loggedIn) return (
        <div className="admin-login-screen">
            <div className="admin-login-card">
                <div className="admin-login-logo">🛡️</div>
                <h1 className="admin-login-title">{isAr ? 'لوحة التحكم' : 'Admin Dashboard'}</h1>
                <p className="admin-login-subtitle">{isAr ? 'أدخل كلمة مرور المشرف للمتابعة' : 'Enter admin password to continue'}</p>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">{isAr ? 'كلمة المرور' : 'Password'}</label>
                        <input
                            type="password"
                            className={`form-input${loginErr ? ' input-error-shake' : ''}`}
                            value={adminPwd}
                            onChange={e => { setAdminPwd(e.target.value); setLoginErr(''); }}
                            placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter password'}
                            autoComplete="current-password"
                        />
                        {loginErr && <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '0.3rem' }}>{loginErr}</p>}
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">{isAr ? 'رمز التحقق' : 'Verification Code'}</label>
                        <div className="captcha-wrapper">
                            <div className="captcha-canvas-container">
                                <canvas ref={canvasRef} width="240" height="70" className="captcha-canvas" />
                                <button type="button" className="captcha-refresh-btn" onClick={genCaptcha} title={isAr ? 'تحديث الرمز' : 'Refresh'}>🔄</button>
                            </div>
                            <input
                                type="text"
                                className={`form-input captcha-input-field${captchaErr ? ' input-error-shake' : ''}`}
                                value={captchaInput}
                                onChange={e => { setCaptchaInput(e.target.value); setCaptchaErr(false); }}
                                placeholder={isAr ? 'أدخل الرمز أعلاه' : 'Enter the code above'}
                                autoComplete="off"
                                maxLength="6"
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn full-width" style={{ marginTop: '0.5rem' }}>
                        {isAr ? '🔓 دخول' : '🔓 Login'}
                    </button>
                </form>
            </div>
        </div>
    );

    // ────────────────────────────────────────────────────────────────────
    // DASHBOARD
    // ────────────────────────────────────────────────────────────────────
    const tabs = [
        { id: 'analytics', label: isAr ? '📊 إحصائيات الزيارات' : '📊 Analytics' },
        { id: 'general', label: isAr ? '🛠️ الإدارة العامة' : '🛠️ General Admin' },
        { id: 'quizzes', label: isAr ? '🎯 إدارة الاختبارات' : '🎯 Quizzes' },
        { id: 'feedback', label: isAr ? '💬 الآراء والشكاوى' : '💬 Feedback' },
        { id: 'testimonials', label: isAr ? '⭐ التقييمات' : '⭐ Testimonials' },
        { id: 'reports', label: isAr ? '🚩 بلاغات الأسئلة' : '🚩 Reports' },
        { id: 'activity', label: isAr ? '📋 سجل الطلاب' : '📋 Activity Log' },
    ];

    return (
        <>
            <div className={isEmbedded ? "admin-dashboard-embedded" : "admin-dashboard-page"} style={isEmbedded ? { paddingTop: 0 } : {}}>
                <div className={isEmbedded ? "" : "admin-dashboard-inner"}>

                    {/* ── Header ── */}
                    {!isEmbedded && (
                        <div className="admin-dash-header">
                            <h1 className="admin-dash-title">
                                {isAr ? '🛡️ لوحة التحكم الشاملة' : '🛡️ Admin Dashboard'}
                            </h1>
                            <button className="admin-dash-logout-btn" onClick={() => {
                                sessionStorage.removeItem('exchange_staff');
                                setLoggedIn(false);
                            }}>
                                {isAr ? '🚪 تسجيل خروج' : '🚪 Logout'}
                            </button>
                        </div>
                    )}

                    {/* ── KPI Cards ── */}
                    <div className="admin-kpi-row">
                        <div className="admin-kpi-card">
                            <div className="kpi-icon">👁️</div>
                            <div className="kpi-value">{totalVisits}</div>
                            <div className="kpi-label">{isAr ? 'إجمالي الزيارات' : 'Total Page Views'}</div>
                        </div>
                        <div className="admin-kpi-card">
                            <div className="kpi-icon">👥</div>
                            <div className="kpi-value">{uniqueStudents}</div>
                            <div className="kpi-label">{isAr ? 'طلاب موثّقون' : 'Identified Students'}</div>
                        </div>
                        <div className="admin-kpi-card">
                            <div className="kpi-icon">📂</div>
                            <div className="kpi-value">{materialViews}</div>
                            <div className="kpi-label">{isAr ? 'فتح مواد دراسية' : 'Material Opens'}</div>
                        </div>
                        <div className="admin-kpi-card">
                            <div className="kpi-icon">✅</div>
                            <div className="kpi-value">{quizCompletions}</div>
                            <div className="kpi-label">{isAr ? 'اختبارات مكتملة' : 'Quizzes Completed'}</div>
                        </div>
                        <div className="admin-kpi-card">
                            <div className="kpi-icon">💬</div>
                            <div className="kpi-value">{suggestions.length}</div>
                            <div className="kpi-label">{isAr ? 'رسائل واقتراحات' : 'Suggestions'}</div>
                        </div>
                        <div className="admin-kpi-card">
                            <div className="kpi-icon">🚩</div>
                            <div className="kpi-value">{reports.filter(r => r.status === 'pending').length}</div>
                            <div className="kpi-label">{isAr ? 'بلاغات معلّقة' : 'Pending Reports'}</div>
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="admin-tabs">
                        {tabs.map(t => (
                            <button key={t.id} className={`admin-tab-btn${activeTab === t.id ? ' active' : ''}`}
                                onClick={() => setActiveTab(t.id)}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ══════════════════════════════════════════════════════ */}
                    {/* TAB: Analytics                                         */}
                    {/* ══════════════════════════════════════════════════════ */}
                    {activeTab === 'analytics' && (
                        <div className="admin-panel-section">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

                                {/* Pages chart */}
                                <div className="admin-glass-card">
                                    <h3 className="admin-section-title">📈 <span>{isAr ? 'أكثر الصفحات زيارةً' : 'Most Visited Pages'}</span></h3>
                                    <div className="analytics-chart">
                                        {sortedPaths.length === 0
                                            ? <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{isAr ? 'لا توجد بيانات بعد' : 'No data yet'}</p>
                                            : sortedPaths.map(([path, count]) => (
                                                <div key={path} className="chart-bar-row">
                                                    <span className="chart-bar-label">{getPathLabel(path, language)}</span>
                                                    <div className="chart-bar-track">
                                                        <div className="chart-bar-fill" style={{ width: `${(count / maxPathCount) * 100}%` }} />
                                                    </div>
                                                    <span className="chart-bar-count">{count}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                {/* Popular courses chart */}
                                <div className="admin-glass-card">
                                    <h3 className="admin-section-title">📂 <span>{isAr ? 'أكثر المواد الدراسية فتحاً' : 'Most Opened Study Materials'}</span></h3>
                                    <div className="analytics-chart">
                                        {sortedCourses.length === 0
                                            ? <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{isAr ? 'لا توجد بيانات بعد' : 'No data yet'}</p>
                                            : sortedCourses.map(([name, count]) => (
                                                <div key={name} className="chart-bar-row">
                                                    <span className="chart-bar-label">{name}</span>
                                                    <div className="chart-bar-track">
                                                        <div className="chart-bar-fill" style={{ width: `${(count / maxCourseCount) * 100}%` }} />
                                                    </div>
                                                    <span className="chart-bar-count">{count}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Popular quizzes */}
                            {(() => {
                                const qc = {};
                                pageViews.filter(v => v.type === 'quiz_completed' && v.quizTitle).forEach(v => {
                                    qc[v.quizTitle] = (qc[v.quizTitle] || 0) + 1;
                                });
                                const sorted = Object.entries(qc).sort((a, b) => b[1] - a[1]).slice(0, 6);
                                const mx = sorted[0]?.[1] || 1;
                                return sorted.length > 0 && (
                                    <div className="admin-glass-card" style={{ marginTop: '1.5rem' }}>
                                        <h3 className="admin-section-title">🎯 <span>{isAr ? 'الاختبارات الأكثر إتماماً' : 'Most Completed Quizzes'}</span></h3>
                                        <div className="analytics-chart">
                                            {sorted.map(([title, count]) => (
                                                <div key={title} className="chart-bar-row">
                                                    <span className="chart-bar-label">{title}</span>
                                                    <div className="chart-bar-track">
                                                        <div className="chart-bar-fill" style={{ width: `${(count / mx) * 100}%`, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)' }} />
                                                    </div>
                                                    <span className="chart-bar-count">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════════ */}
                    {/* TAB: General Administration                            */}
                    {/* ══════════════════════════════════════════════════════ */}
                    {activeTab === 'general' && (
                        <div className="admin-panel-section">
                            <div className="admin-section-intro">
                                <h3 className="admin-section-title">🛠️ <span>{isAr ? 'إدارة عامة' : 'General Administration'}</span></h3>
                                <p className="admin-section-description">
                                    {isAr
                                        ? 'اختر أحد الصفحات التالية للدخول إلى أدوات الإدارة العامة داخل لوحة التحكم.'
                                        : 'Choose one of the pages below to access general admin tools inside the dashboard.'
                                    }
                                </p>
                            </div>

                            <div className="admin-general-grid">
                                {generalAdminPages.map(page => (
                                    <button
                                        key={page.id}
                                        className={`admin-general-card${selectedGeneralPage === page.id ? ' active' : ''}`}
                                        onClick={() => setSelectedGeneralPage(page.id)}
                                    >
                                        <div className="admin-general-card-title">{isAr ? page.titleAr : page.titleEn}</div>
                                        <p>{isAr ? page.descAr : page.descEn}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="admin-general-page-panel admin-glass-card">
                                <h4 className="admin-general-page-title">{isAr ? selectedGeneralPageData.titleAr : selectedGeneralPageData.titleEn}</h4>
                                <p className="admin-general-page-desc">{isAr ? selectedGeneralPageData.descAr : selectedGeneralPageData.descEn}</p>

                                {selectedGeneralPage === 'system_settings' && (
                                    <div className="admin-general-page-body">
                                        <div className="admin-general-block">
                                            <h5>{isAr ? 'وضع الصيانة' : 'Maintenance Mode'}</h5>
                                            <p>{isAr ? 'تبديل وضع الصيانة للموقع وتعطيل الوصول العام مؤقتاً.' : 'Toggle site maintenance mode and temporarily disable public access.'}</p>
                                        </div>
                                        <div className="admin-general-block">
                                            <h5>{isAr ? 'كلمة مرور المشرف' : 'Admin Password'}</h5>
                                            <p>{isAr ? 'تحقق من كلمة المرور الحالية أو قم بتحديثها من خلال إعدادات النظام.' : 'Review the current admin password or update it via system settings.'}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedGeneralPage === 'user_management' && (
                                    <div className="admin-general-page-body">
                                        <div className="admin-general-block">
                                            <h5>{isAr ? 'صلاحيات الموظفين' : 'Staff Permissions'}</h5>
                                            <p>{isAr ? 'عرض وإدارة صلاحيات الوصول الخاصة بالموظفين والمشرفين.' : 'View and manage access permissions for staff and admins.'}</p>
                                        </div>
                                        <div className="admin-general-block">
                                            <h5>{isAr ? 'الوصول المؤقت' : 'Temporary Access'}</h5>
                                            <p>{isAr ? 'تهيئة حسابات وصول مؤقتة للفرق المساندة عند الحاجة.' : 'Configure temporary access accounts for support teams when needed.'}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedGeneralPage === 'content_management' && (
                                    <div className="admin-general-page-body">
                                        <div className="admin-general-block">
                                            <h5>{isAr ? 'المحتوى العام' : 'General Content'}</h5>
                                            <p>{isAr ? 'تحرير نصوص الصفحات وتحديث المعلومات المنشورة للمستخدمين.' : 'Edit page copy and update published information for users.'}</p>
                                        </div>
                                        <div className="admin-general-block">
                                            <h5>{isAr ? 'الصفحات الداخلية' : 'Internal Pages'}</h5>
                                            <p>{isAr ? 'إدارة قائمة الصفحات التي تظهر داخل لوحة الإدارة والموقع.' : 'Manage the internal pages available in the dashboard and site.'}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedGeneralPage === 'student_contributions' && (
                                    <div className="admin-general-page-body admin-contributions-panel">
                                        <div className="admin-general-block">
                                            <h5>{isAr ? 'مساهمات الطلاب الواردة' : 'Incoming Student Contributions'}</h5>
                                            <p>{isAr ? 'هذه المساهمات تأتي من قسم "ساهم في إثراء محتوى مكانك" في صفحات المواد والاختبارات.' : 'These contributions come from the "Share & Enrich Makanak Content" section on the study materials and quiz pages.'}</p>
                                            <button
                                                className="admin-action-btn approve"
                                                style={{ marginTop: '1rem' }}
                                                onClick={() => setShowAdminUploader(true)}
                                            >
                                                📤 {isAr ? 'فتح نموذج المساهمة' : 'Open Contribution Uploader'}
                                            </button>
                                        </div>
                                        <div className="contributions-filter-row">
                                            <select className="admin-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                                <option value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
                                                <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                                                <option value="approved">{isAr ? 'مُوافق عليها' : 'Approved'}</option>
                                            </select>
                                        </div>

                                        {contributionsLoading ? (
                                            <div className="admin-empty-state">
                                                <div className="empty-icon">⏳</div>
                                                <p>{isAr ? 'جارٍ تحميل المساهمات...' : 'Loading contributions...'}</p>
                                            </div>
                                        ) : contributions.filter(c => filterStatus === 'all' ? true : c.status === filterStatus).length === 0 ? (
                                            <div className="admin-empty-state">
                                                <div className="empty-icon">📭</div>
                                                <p>{isAr ? 'لا توجد مساهمات بهذه الحالة حالياً' : 'No contributions for this status yet'}</p>
                                            </div>
                                        ) : (
                                            contributions.filter(c => filterStatus === 'all' ? true : c.status === filterStatus).map(contribution => (
                                                <div key={contribution.id} className={`contribution-card ${contribution.status === 'approved' ? 'approved' : 'pending'}`}>
                                                    <div className="contribution-card-header">
                                                        <div>
                                                            <strong>{contribution.studentName || (isAr ? 'طالب مجهول' : 'Anonymous Student')}</strong>
                                                            <span className="contribution-meta">{contribution.subjectName || (isAr ? 'عام' : 'General')} · {contribution.contributionType || (isAr ? 'نوع غير محدد' : 'Unspecified')}</span>
                                                        </div>
                                                        <span className={`badge ${contribution.status === 'approved' ? 'badge-approved' : 'badge-pending'}`}>{contribution.status === 'approved' ? (isAr ? 'مُوافق عليها' : 'Approved') : (isAr ? 'قيد الانتظار' : 'Pending')}</span>
                                                    </div>
                                                    <div className="contribution-card-body">
                                                        <p>{contribution.fileType === 'link' ? (
                                                            <a href={contribution.fileUrl} target="_blank" rel="noopener noreferrer">{contribution.fileUrl}</a>
                                                        ) : (
                                                            <a href={contribution.fileUrl} target="_blank" rel="noopener noreferrer">{isAr ? 'رابط الملف المرفوع' : 'Uploaded file link'}</a>
                                                        )}</p>
                                                        <p className="contribution-date">{fmtDate(contribution.createdAt)}</p>
                                                    </div>
                                                    <div className="contribution-card-actions">
                                                        {contribution.status !== 'approved' && (
                                                            <button className="admin-action-btn approve" onClick={async () => {
                                                                const result = await approveContribution(contribution.id);
                                                                if (result.success) toast.success(isAr ? 'تمت الموافقة على المساهمة' : 'Contribution approved');
                                                            }}>
                                                                ✅ {isAr ? 'موافقة' : 'Approve'}
                                                            </button>
                                                        )}
                                                        <button className="admin-action-btn reject" onClick={async () => {
                                                            const result = await deleteContribution(contribution.id);
                                                            if (result.success) toast.success(isAr ? 'تم حذف المساهمة' : 'Contribution deleted');
                                                        }}>
                                                            🗑️ {isAr ? 'حذف' : 'Delete'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {selectedGeneralPage === 'reports_archive' && (
                                    <div className="admin-general-page-body">
                                        <div className="admin-general-block">
                                            <h5>{isAr ? 'سجل النشاط' : 'Activity Log'}</h5>
                                            <p>{isAr ? 'عرض السجلات والأحداث المهمة داخل النظام.' : 'View important system events and history.'}</p>
                                        </div>
                                        <div className="admin-general-block">
                                            <h5>{isAr ? 'أرشيف التقارير' : 'Reports Archive'}</h5>
                                            <p>{isAr ? 'الوصول إلى تقارير سابقة وحفظ ملاحظات الإدارة.' : 'Access previous reports and store admin notes.'}</p>
                                        </div>
                                    </div>
                                )}

                                {showAdminUploader && <FileUploader onClose={() => setShowAdminUploader(false)} />}
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════════ */}
                    {/* TAB: Feedback & Suggestions                            */}
                    {/* ══════════════════════════════════════════════════════ */}
                    {activeTab === 'feedback' && (
                        <div className="admin-panel-section">
                            <div className="admin-filter-row">
                                <select className="admin-filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                                    <option value="all">{isAr ? 'كل الأنواع' : 'All Types'}</option>
                                    <option value="suggestion">{isAr ? 'اقتراح' : 'Suggestion'}</option>
                                    <option value="complaint">{isAr ? 'شكوى' : 'Complaint'}</option>
                                    <option value="question">{isAr ? 'سؤال' : 'Question'}</option>
                                </select>
                                <select className="admin-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                    <option value="all">{isAr ? 'كل الحالات' : 'All'}</option>
                                    <option value="new">{isAr ? 'جديد' : 'New'}</option>
                                    <option value="resolved">{isAr ? 'محلول' : 'Resolved'}</option>
                                </select>
                            </div>

                            {filteredSuggestions.length === 0 ? (
                                <div className="admin-empty-state">
                                    <div className="empty-icon">💬</div>
                                    <p>{isAr ? 'لا توجد رسائل بعد' : 'No messages yet'}</p>
                                </div>
                            ) : (
                                filteredSuggestions.map(s => (
                                    <div key={s.id} className={`suggestion-admin-card${s.status === 'resolved' ? ' resolved' : ''}`}>
                                        <div className="suggestion-admin-header">
                                            <span className="suggestion-admin-name">{s.name || (isAr ? 'مجهول' : 'Anonymous')}</span>
                                            <span className={`badge ${s.type === 'complaint' ? 'badge-complaint' : 'badge-suggestion'}`}>
                                                {s.type === 'complaint' ? (isAr ? 'شكوى' : 'Complaint') : s.type === 'question' ? (isAr ? 'سؤال' : 'Question') : (isAr ? 'اقتراح' : 'Suggestion')}
                                            </span>
                                            <span className={`badge ${s.status === 'resolved' ? 'badge-resolved' : 'badge-pending'}`}>
                                                {s.status === 'resolved' ? (isAr ? 'محلول' : 'Resolved') : (isAr ? 'جديد' : 'New')}
                                            </span>
                                            <span className="suggestion-admin-date">{fmtDate(s.timestamp)}</span>
                                        </div>
                                        <div className="suggestion-admin-message">{s.message}</div>
                                        {s.contact && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>📧 {s.contact}</p>}
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {s.status !== 'resolved' && (
                                                <button className="admin-action-btn resolve" onClick={() => resolveSuggestion(s.id)}>
                                                    ✅ {isAr ? 'حل' : 'Resolve'}
                                                </button>
                                            )}
                                            <button className="admin-action-btn delete" onClick={() => deleteSuggestion(s.id)}>
                                                🗑️ {isAr ? 'حذف' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════════ */}
                    {/* TAB: Testimonials                                      */}
                    {/* ══════════════════════════════════════════════════════ */}
                    {activeTab === 'testimonials' && (
                        <div className="admin-panel-section">
                            {testimonials.length === 0 ? (
                                <div className="admin-empty-state">
                                    <div className="empty-icon">⭐</div>
                                    <p>{isAr ? 'لا توجد تقييمات بعد' : 'No testimonials yet'}</p>
                                </div>
                            ) : (
                                testimonials.map(t => (
                                    <div key={t.id} className="testimonial-admin-card">
                                        <div className="testimonial-admin-quote">"{t.quote || t.message}"</div>
                                        <div className="testimonial-admin-meta">
                                            <span>👤 {t.author || t.name || '—'} {t.major && `• ${t.major}`}</span>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <span className={`badge ${t.approved ? 'badge-approved' : 'badge-unapproved'}`}>
                                                    {t.approved ? (isAr ? '✅ معروض' : '✅ Visible') : (isAr ? '⛔ مخفي' : '⛔ Hidden')}
                                                </span>
                                                <button
                                                    className={`admin-action-btn ${t.approved ? 'unapprove' : 'approve'}`}
                                                    onClick={() => toggleTestimonialApproval(t.id, t.approved)}
                                                >
                                                    {t.approved ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'عرض' : 'Approve')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════════ */}
                    {/* TAB: Question Reports                                  */}
                    {/* ══════════════════════════════════════════════════════ */}
                    {activeTab === 'reports' && (
                        <div className="admin-panel-section">
                            {reports.length === 0 ? (
                                <div className="admin-empty-state">
                                    <div className="empty-icon">🚩</div>
                                    <p>{isAr ? 'لا توجد بلاغات حتى الآن' : 'No flagged questions yet'}</p>
                                </div>
                            ) : (
                                reports.map(r => (
                                    <div key={r.id} className="report-card">
                                        <div className="report-card-header">
                                            <span className="report-card-quiz-title">{r.quizTitle || r.quizId}</span>
                                            {r.subjectName && <span className="report-card-subject">• {r.subjectName}</span>}
                                            <span className={`badge ${r.status === 'resolved' ? 'badge-resolved' : 'badge-pending'}`}>
                                                {r.status === 'resolved' ? (isAr ? 'محلول' : 'Resolved') : (isAr ? 'معلّق' : 'Pending')}
                                            </span>
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: 'auto' }}>{fmtDate(r.createdAt)}</span>
                                        </div>
                                        {r.questionAr && (
                                            <div className="report-card-question">
                                                <strong>{isAr ? 'السؤال (عربي):' : 'Question (AR):'}</strong><br />
                                                {r.questionAr}
                                            </div>
                                        )}
                                        {r.questionEn && (
                                            <div className="report-card-question">
                                                <strong>{isAr ? 'السؤال (إنجليزي):' : 'Question (EN):'}</strong><br />
                                                {r.questionEn}
                                            </div>
                                        )}
                                        {r.questionId && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>🆔 {r.questionId}</p>}
                                        {r.studentNote && (
                                            <div className="report-card-note" style={{
                                                background: '#fff9db',
                                                borderRight: isAr ? '4px solid #fab005' : 'none',
                                                borderLeft: isAr ? 'none' : '4px solid #fab005',
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                margin: '0.75rem 0',
                                                fontSize: '0.88rem',
                                                color: '#2b2b2b',
                                                textAlign: isAr ? 'right' : 'left'
                                            }}>
                                                <strong>{isAr ? 'ملاحظة الطالب: ' : 'Student Note: '}</strong>
                                                <span>{r.studentNote}</span>
                                            </div>
                                        )}
                                        <div className="report-card-actions">
                                            <button className="admin-action-btn edit-q" onClick={() => openEditModal(r)}>
                                                ✏️ {isAr ? 'تعديل السؤال' : 'Edit Question'}
                                            </button>
                                            {r.status !== 'resolved' && (
                                                <button className="admin-action-btn resolve" onClick={() => resolveReport(r.id)}>
                                                    ✅ {isAr ? 'تم الحل' : 'Mark Resolved'}
                                                </button>
                                            )}
                                            <button className="admin-action-btn delete" onClick={() => deleteReport(r.id)}>
                                                🗑️ {isAr ? 'حذف' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════════ */}
                    {/* TAB: Student Activity Log                              */}
                    {/* ══════════════════════════════════════════════════════ */}
                    {activeTab === 'activity' && (
                        <div className="admin-panel-section">
                            <div className="admin-filter-row">
                                <select className="admin-filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                                    <option value="all">{isAr ? 'كل النشاطات' : 'All Activities'}</option>
                                    <option value="visit">{isAr ? 'زيارات' : 'Visits'}</option>
                                    <option value="material_view">{isAr ? 'مواد دراسية' : 'Study Materials'}</option>
                                    <option value="quiz_completed">{isAr ? 'اختبارات' : 'Quizzes'}</option>
                                </select>
                            </div>

                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>{isAr ? 'النوع' : 'Type'}</th>
                                            <th>{isAr ? 'الطالب' : 'Student'}</th>
                                            <th>{isAr ? 'التفاصيل' : 'Details'}</th>
                                            <th>{isAr ? 'التاريخ والوقت' : 'Date & Time'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredActivity.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                                    {isAr ? 'لا توجد بيانات' : 'No data yet'}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredActivity.slice(0, 100).map(v => (
                                                <tr key={v.id}>
                                                    <td><TypeBadge type={v.type} /></td>
                                                    <td>
                                                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{v.studentName && v.studentName !== 'Guest' ? v.studentName : (isAr ? 'زائر' : 'Guest')}</div>
                                                        {v.studentPhone && <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>📞 {v.studentPhone}</div>}
                                                    </td>
                                                    <td style={{ maxWidth: '260px' }}>
                                                        {v.type === 'visit' && <span style={{ fontSize: '0.85rem' }}>{getPathLabel(v.path, language)}</span>}
                                                        {v.type === 'material_view' && (
                                                            <div>
                                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v.courseName}</div>
                                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{v.materialName}</div>
                                                            </div>
                                                        )}
                                                        {v.type === 'quiz_completed' && (
                                                            <div>
                                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v.quizTitle || v.quizId}</div>
                                                                <div style={{ fontSize: '0.78rem', color: '#fbbf24' }}>📊 {v.score}</div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                        {fmtDate(v.timestamp)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════════ */}
                    {/* TAB: Quizzes Management                                */}
                    {/* ══════════════════════════════════════════════════════ */}
                    {activeTab === 'quizzes' && (
                        <div className="admin-panel-section quizzes-management-section">
                            <div className="qmanage-layout">
                                
                                {/* Column 1: Subjects List */}
                                <div className="qmanage-column subjects-col">
                                    <div className="qmanage-col-header">
                                        <h4>📚 {isAr ? 'المواد الدراسية' : 'Subjects'}</h4>
                                        <button className="qmanage-add-btn" onClick={() => setShowAddSubjectModal(true)}>
                                            ➕ {isAr ? 'مادة جديدة' : 'New Subject'}
                                        </button>
                                    </div>
                                    <div className="qmanage-list">
                                        {allSubjects.map(sub => (
                                            <div 
                                                key={sub.id} 
                                                className={`qmanage-item-card ${selectedSubjectId === sub.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSelectedSubjectId(sub.id);
                                                    setSelectedPartId('');
                                                }}
                                            >
                                                <span className="qmanage-item-icon">{sub.icon || '📚'}</span>
                                                <div className="qmanage-item-info">
                                                    <span className="qmanage-item-name">{isAr ? sub.nameAr : sub.name}</span>
                                                    <span className="qmanage-item-id">ID: {sub.id}</span>
                                                </div>
                                                {sub.isDynamic && (
                                                    <button 
                                                        className="qmanage-item-delete-btn" 
                                                        onClick={(e) => { e.stopPropagation(); deleteSubject(sub.id); }}
                                                        title={isAr ? 'حذف المادة بالكامل' : 'Delete entire subject'}
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Column 2: Quiz Parts */}
                                <div className="qmanage-column parts-col">
                                    <div className="qmanage-col-header">
                                        <h4>🎯 {isAr ? 'الأجزاء / الاختبارات' : 'Quizzes / Parts'}</h4>
                                        {selectedSubjectId ? (
                                            <button className="qmanage-add-btn" onClick={() => setShowAddPartModal(true)}>
                                                ➕ {isAr ? 'اختبار جديد' : 'New Quiz'}
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                {isAr ? 'اختر مادة أولاً' : 'Select a subject first'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="qmanage-list">
                                        {selectedSubjectId ? (
                                            allParts.length === 0 ? (
                                                <div className="qmanage-empty">{isAr ? 'لا توجد اختبارات مضافة بعد' : 'No quiz parts yet'}</div>
                                            ) : (
                                                allParts.map(part => (
                                                    <div 
                                                        key={part.id} 
                                                        className={`qmanage-item-card ${selectedPartId === part.id ? 'active' : ''}`}
                                                        onClick={() => setSelectedPartId(part.id)}
                                                    >
                                                        <div className="qmanage-item-info">
                                                            <span className="qmanage-item-name">{isAr ? part.titleAr : part.title}</span>
                                                            <span className="qmanage-item-id">ID: {part.id}</span>
                                                        </div>
                                                        {part.isDynamic && (
                                                            <button 
                                                                className="qmanage-item-delete-btn" 
                                                                onClick={(e) => { e.stopPropagation(); deletePart(part.id); }}
                                                                title={isAr ? 'حذف الجزء بالكامل' : 'Delete entire part'}
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            )
                                        ) : (
                                            <div className="qmanage-empty">{isAr ? 'يرجى اختيار مادة من اليمين' : 'Please select a subject from left'}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Column 3: Questions List */}
                                <div className="qmanage-column questions-col">
                                    <div className="qmanage-col-header">
                                        <h4>📋 {isAr ? 'أسئلة الاختبار' : 'Questions List'}</h4>
                                        {selectedPartId ? (
                                            <button className="qmanage-add-btn" onClick={() => openQuestionModal()}>
                                                ➕ {isAr ? 'إضافة سؤال' : 'New Question'}
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                {isAr ? 'اختر اختباراً أولاً' : 'Select a quiz first'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="qmanage-list">
                                        {selectedPartId ? (
                                            allQuestions.length === 0 ? (
                                                <div className="qmanage-empty">{isAr ? 'لا توجد أسئلة في هذا الجزء بعد' : 'No questions in this part yet'}</div>
                                            ) : (
                                                allQuestions.map((q, idx) => (
                                                    <div key={q.id || idx} className="qmanage-question-card">
                                                        <div className="qmanage-question-card-header">
                                                            <span className="qmanage-q-badge">Q{idx + 1}</span>
                                                            <span className="qmanage-q-badge badge-points">{q.marks || 1} pt</span>
                                                            {q.isDynamic && <span className="qmanage-q-badge badge-db">Db</span>}
                                                            
                                                            <div style={{ marginRight: isAr ? 'auto' : '0', marginLeft: isAr ? '0' : 'auto', display: 'flex', gap: '0.4rem' }}>
                                                                <button className="qmanage-q-action-btn" onClick={() => openQuestionModal(q)}>✏️</button>
                                                                {q.isDynamic && (
                                                                    <button className="qmanage-q-action-btn delete" onClick={() => deleteQuestion(q.id)}>🗑️</button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="qmanage-question-card-body">
                                                            <p className="qmanage-q-text text-ar">{q.questionAr || '—'}</p>
                                                            <p className="qmanage-q-text text-en">{q.questionEn || '—'}</p>
                                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
                                                                {q.image && (
                                                                    <div className="qmanage-q-img-preview" style={{ flex: '1 1 auto', maxWidth: '200px', margin: 0 }}>
                                                                        <img src={q.image} alt="Question visual 1" style={{ width: '100%', borderRadius: '6px' }} />
                                                                    </div>
                                                                )}
                                                                {q.image2 && (
                                                                    <div className="qmanage-q-img-preview" style={{ flex: '1 1 auto', maxWidth: '200px', margin: 0 }}>
                                                                        <img src={q.image2} alt="Question visual 2" style={{ width: '100%', borderRadius: '6px' }} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="qmanage-q-options">
                                                                {q.options?.map(opt => (
                                                                    <div key={opt.id} className={`qmanage-q-option ${q.correctAnswer === opt.id ? 'correct' : ''}`}>
                                                                        <span className="opt-marker">{opt.id.toUpperCase()}</span>
                                                                        <span className="opt-text" dangerouslySetInnerHTML={{ __html: isAr ? (opt.textAr || opt.textEn) : opt.textEn }} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )
                                        ) : (
                                            <div className="qmanage-empty">{isAr ? 'يرجى اختيار جزء/اختبار لعرض أسئلته' : 'Please select a quiz to see questions'}</div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ══ Question Edit Modal ══ */}
            {editingReport && (
                <div className="qedit-overlay" onClick={closeEditModal}>
                    <div className="qedit-modal" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="qedit-header">
                            <div className="qedit-header-info">
                                <span className="qedit-badge-quiz">{editingReport.quizTitle || editingReport.quizId}</span>
                                {editingReport.subjectName && <span className="qedit-badge-sub">• {editingReport.subjectName}</span>}
                                <span className="qedit-badge-id">🆔 Q{editingReport.questionId}</span>
                            </div>
                            <button className="qedit-close" onClick={closeEditModal}>✕</button>
                        </div>

                        <div className="qedit-title">
                            ✏️ {isAr ? 'تعديل السؤال والخيارات' : 'Edit Question & Options'}
                        </div>

                        <div className="qedit-body">

                            {/* Question text Arabic */}
                            <div className="qedit-field">
                                <label className="qedit-label">
                                    🇸🇦 {isAr ? 'نص السؤال — عربي' : 'Question Text — Arabic'}
                                </label>
                                <textarea
                                    className="qedit-textarea"
                                    value={editForm.questionAr}
                                    onChange={e => setEditForm(prev => ({ ...prev, questionAr: e.target.value }))}
                                    dir="rtl"
                                    rows={3}
                                    placeholder={isAr ? 'اكتب السؤال بالعربية...' : 'Arabic question text...'}
                                />
                            </div>

                            {/* Question text English */}
                            <div className="qedit-field">
                                <label className="qedit-label">
                                    🇬🇧 {isAr ? 'نص السؤال — إنجليزي' : 'Question Text — English'}
                                </label>
                                <textarea
                                    className="qedit-textarea"
                                    value={editForm.questionEn}
                                    onChange={e => setEditForm(prev => ({ ...prev, questionEn: e.target.value }))}
                                    dir="ltr"
                                    rows={3}
                                    placeholder="English question text..."
                                />
                            </div>

                            {/* Image device upload zone */}
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                                {/* Image 1 */}
                                <div className="qedit-field" style={{ flex: '1 1 200px', margin: 0 }}>
                                    <label className="qedit-label">🖼️ {isAr ? 'صورة السؤال الأولى (اختياري)' : 'Question Image 1 (optional)'}</label>
                                    <input
                                        ref={quizImageInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            if (file.size > 10 * 1024 * 1024) {
                                                toast.error(isAr ? 'حجم الصورة يجب أن يكون أقل من 10 ميجا بايت' : 'Image must be under 10MB');
                                                return;
                                            }
                                            setQuizImageUploading(true);
                                            setQuizImageProgress(20);
                                            try {
                                                const compressed = await new Promise((resolve, reject) => {
                                                    const img = new Image();
                                                    const url = URL.createObjectURL(file);
                                                    img.onload = () => {
                                                        URL.revokeObjectURL(url);
                                                        const MAX = 800;
                                                        let w = img.width, h = img.height;
                                                        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
                                                        const canvas = document.createElement('canvas');
                                                        canvas.width = w; canvas.height = h;
                                                        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                                                        resolve(canvas.toDataURL('image/jpeg', 0.78));
                                                    };
                                                    img.onerror = reject;
                                                    img.src = url;
                                                });
                                                setQuizImageProgress(100);
                                                setQuestionForm(prev => ({ ...prev, image: compressed }));
                                                toast.success(isAr ? '✅ تم تحميل الصورة الأولى بنجاح' : '✅ Image 1 loaded successfully');
                                            } catch (err) {
                                                console.error(err);
                                                toast.error(isAr ? 'خطأ في معالجة الصورة' : 'Image processing error');
                                            } finally {
                                                setQuizImageUploading(false);
                                                setQuizImageProgress(0);
                                            }
                                            e.target.value = '';
                                        }}
                                    />
                                    {!questionForm.image && !quizImageUploading && (
                                        <div className="qedit-image-dropzone" onClick={() => quizImageInputRef.current?.click()}>
                                            <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                                            <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem' }}>{isAr ? 'اضغط لاختيار صورة 1' : 'Click to choose image 1'}</p>
                                        </div>
                                    )}
                                    {quizImageUploading && (
                                        <div className="qedit-image-uploading">
                                            <div className="qedit-upload-bar">
                                                <div className="qedit-upload-bar-fill" style={{ width: `${quizImageProgress}%` }} />
                                            </div>
                                            <span>{isAr ? `جاري الرفع... ${quizImageProgress}%` : `Uploading... ${quizImageProgress}%`}</span>
                                        </div>
                                    )}
                                    {questionForm.image && !quizImageUploading && (
                                        <div style={{ marginTop: '0.6rem', textAlign: 'center' }}>
                                            <img src={questionForm.image} alt="preview" style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)' }} />
                                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <button type="button" className="qedit-add-option" style={{ width: 'auto', padding: '0.2rem 0.6rem', fontSize: '0.75rem', margin: 0 }} onClick={() => quizImageInputRef.current?.click()}>🔄 {isAr ? 'تغيير' : 'Change'}</button>
                                                <button type="button" className="qedit-opt-delete" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', margin: 0 }} onClick={() => setQuestionForm(prev => ({ ...prev, image: '' }))}>{isAr ? 'حذف 🗑' : 'Remove'}</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Image 2 */}
                                <div className="qedit-field" style={{ flex: '1 1 200px', margin: 0 }}>
                                    <label className="qedit-label">🖼️ {isAr ? 'صورة السؤال الثانية (اختياري)' : 'Question Image 2 (optional)'}</label>
                                    <input
                                        ref={quizImage2InputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            if (file.size > 10 * 1024 * 1024) {
                                                toast.error(isAr ? 'حجم الصورة يجب أن يكون أقل من 10 ميجا بايت' : 'Image must be under 10MB');
                                                return;
                                            }
                                            setQuizImage2Uploading(true);
                                            setQuizImage2Progress(20);
                                            try {
                                                const compressed = await new Promise((resolve, reject) => {
                                                    const img = new Image();
                                                    const url = URL.createObjectURL(file);
                                                    img.onload = () => {
                                                        URL.revokeObjectURL(url);
                                                        const MAX = 800;
                                                        let w = img.width, h = img.height;
                                                        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
                                                        const canvas = document.createElement('canvas');
                                                        canvas.width = w; canvas.height = h;
                                                        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                                                        resolve(canvas.toDataURL('image/jpeg', 0.78));
                                                    };
                                                    img.onerror = reject;
                                                    img.src = url;
                                                });
                                                setQuizImage2Progress(100);
                                                setQuestionForm(prev => ({ ...prev, image2: compressed }));
                                                toast.success(isAr ? '✅ تم تحميل الصورة الثانية بنجاح' : '✅ Image 2 loaded successfully');
                                            } catch (err) {
                                                console.error(err);
                                                toast.error(isAr ? 'خطأ في معالجة الصورة' : 'Image processing error');
                                            } finally {
                                                setQuizImage2Uploading(false);
                                                setQuizImage2Progress(0);
                                            }
                                            e.target.value = '';
                                        }}
                                    />
                                    {!questionForm.image2 && !quizImage2Uploading && (
                                        <div className="qedit-image-dropzone" onClick={() => quizImage2InputRef.current?.click()}>
                                            <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                                            <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem' }}>{isAr ? 'اضغط لاختيار صورة 2' : 'Click to choose image 2'}</p>
                                        </div>
                                    )}
                                    {quizImage2Uploading && (
                                        <div className="qedit-image-uploading">
                                            <div className="qedit-upload-bar">
                                                <div className="qedit-upload-bar-fill" style={{ width: `${quizImage2Progress}%` }} />
                                            </div>
                                            <span>{isAr ? `جاري الرفع... ${quizImage2Progress}%` : `Uploading... ${quizImage2Progress}%`}</span>
                                        </div>
                                    )}
                                    {questionForm.image2 && !quizImage2Uploading && (
                                        <div style={{ marginTop: '0.6rem', textAlign: 'center' }}>
                                            <img src={questionForm.image2} alt="preview 2" style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)' }} />
                                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <button type="button" className="qedit-add-option" style={{ width: 'auto', padding: '0.2rem 0.6rem', fontSize: '0.75rem', margin: 0 }} onClick={() => quizImage2InputRef.current?.click()}>🔄 {isAr ? 'تغيير' : 'Change'}</button>
                                                <button type="button" className="qedit-opt-delete" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', margin: 0 }} onClick={() => setQuestionForm(prev => ({ ...prev, image2: '' }))}>{isAr ? 'حذف 🗑' : 'Remove'}</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Options — with add/delete */}
                            <div className="qedit-field">
                                <label className="qedit-label">
                                    📋 {isAr ? 'الخيارات — اختر الإجابة الصحيحة' : 'Options — select the correct answer'}
                                </label>
                                <div className="qedit-options-list">
                                    {editForm.options.map((opt, idx) => (
                                        <div
                                            key={opt.id || idx}
                                            className={`qedit-option ${editForm.correctAnswer === opt.id ? 'qedit-option--correct' : ''}`}
                                        >
                                            {/* Option label + correct radio + delete */}
                                            <div className="qedit-option-top">
                                                <span className="qedit-opt-id">{(opt.id || String.fromCharCode(65 + idx)).toUpperCase()}</span>
                                                <label className="qedit-correct-label">
                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={editForm.correctAnswer === opt.id}
                                                        onChange={() => setEditForm(prev => ({ ...prev, correctAnswer: opt.id }))}
                                                    />
                                                    {isAr ? 'الإجابة الصحيحة ✅' : 'Correct Answer ✅'}
                                                </label>
                                                <button
                                                    className="qedit-opt-delete"
                                                    onClick={() => deleteOption(idx)}
                                                    title={isAr ? 'حذف الخيار' : 'Delete option'}
                                                >🗑️</button>
                                            </div>
                                            {/* Arabic option text */}
                                            {(opt.textAr !== undefined || editForm.questionAr) && (
                                                <input
                                                    className="qedit-opt-input"
                                                    value={opt.textAr || ''}
                                                    onChange={e => updateOption(idx, 'textAr', e.target.value)}
                                                    placeholder={isAr ? 'نص الخيار (عربي)' : 'Option text (AR)'}
                                                    dir="rtl"
                                                />
                                            )}
                                            {/* English option text */}
                                            <input
                                                className="qedit-opt-input"
                                                value={opt.textEn || ''}
                                                onChange={e => updateOption(idx, 'textEn', e.target.value)}
                                                placeholder="Option text (EN)"
                                                dir="ltr"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {/* Add Option Button */}
                                <button className="qedit-add-option" onClick={addOption}>
                                    + {isAr ? 'إضافة خيار جديد' : 'Add New Option'}
                                </button>
                            </div>

                            {/* Question Image — file upload from device */}
                            <div className="qedit-field">
                                <label className="qedit-label">
                                    🖼️ {isAr ? 'صورة السؤال (اختياري)' : 'Question Image (optional)'}
                                </label>

                                {/* Hidden file input — compresses and stores as base64 */}
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (file.size > 10 * 1024 * 1024) {
                                            toast.error(isAr ? 'حجم الصورة يجب أن يكون أقل من 10 ميجا بايت' : 'Image must be under 10MB');
                                            return;
                                        }
                                        setImageUploading(true);
                                        setImageUploadProgress(20);
                                        try {
                                            // Compress image client-side using Canvas
                                            const compressed = await new Promise((resolve, reject) => {
                                                const img = new Image();
                                                const url = URL.createObjectURL(file);
                                                img.onload = () => {
                                                    URL.revokeObjectURL(url);
                                                    const MAX = 800;
                                                    let w = img.width, h = img.height;
                                                    if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
                                                    const canvas = document.createElement('canvas');
                                                    canvas.width = w; canvas.height = h;
                                                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                                                    resolve(canvas.toDataURL('image/jpeg', 0.78));
                                                };
                                                img.onerror = reject;
                                                img.src = url;
                                            });
                                            setImageUploadProgress(100);
                                            setEditForm(prev => ({ ...prev, image: compressed }));
                                            toast.success(isAr ? '✅ تم تحميل الصورة بنجاح' : '✅ Image loaded successfully');
                                        } catch (err) {
                                            console.error(err);
                                            toast.error(isAr ? 'خطأ في معالجة الصورة' : 'Image processing error');
                                        } finally {
                                            setImageUploading(false);
                                            setImageUploadProgress(0);
                                        }
                                        e.target.value = '';
                                    }}
                                />

                                {/* Upload Zone */}
                                {!editForm.image && !imageUploading && (
                                    <div
                                        className="qedit-image-dropzone"
                                        onClick={() => imageInputRef.current?.click()}
                                    >
                                        <span style={{ fontSize: '2rem' }}>🖼️</span>
                                        <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem' }}>
                                            {isAr ? 'اضغط لاختيار صورة من جهازك' : 'Click to choose an image from your device'}
                                        </p>
                                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', opacity: 0.5 }}>
                                            {isAr ? 'حد أقصى 5 ميجابايت' : 'Max 5MB'}
                                        </p>
                                    </div>
                                )}

                                {/* Upload progress */}
                                {imageUploading && (
                                    <div className="qedit-image-uploading">
                                        <div className="qedit-upload-bar">
                                            <div className="qedit-upload-bar-fill" style={{ width: `${imageUploadProgress}%` }} />
                                        </div>
                                        <span>{isAr ? `جاري الرفع... ${imageUploadProgress}%` : `Uploading... ${imageUploadProgress}%`}</span>
                                    </div>
                                )}

                                {/* Image preview */}
                                {editForm.image && !imageUploading && (
                                    <div style={{ marginTop: '0.6rem', textAlign: 'center' }}>
                                        <img
                                            src={editForm.image}
                                            alt="preview"
                                            style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)' }}
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                className="qedit-add-option"
                                                style={{ width: 'auto', padding: '0.3rem 0.8rem' }}
                                                onClick={() => imageInputRef.current?.click()}
                                            >
                                                🔄 {isAr ? 'تغيير الصورة' : 'Change Image'}
                                            </button>
                                            <button
                                                className="qedit-opt-delete"
                                                onClick={() => setEditForm(prev => ({ ...prev, image: '' }))}
                                            >
                                                {isAr ? 'حذف 🗑️' : 'Remove 🗑️'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="qedit-footer">
                            <button className="qedit-btn-cancel" onClick={closeEditModal} disabled={editSaving}>
                                {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button className="qedit-btn-save" onClick={saveQuestionEdit} disabled={editSaving}>
                                {editSaving ? <span className="qedit-spinner" /> : '💾'}
                                {isAr ? 'حفظ التعديل' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Add Subject Modal ══ */}
            {showAddSubjectModal && (
                <div className="qedit-overlay" onClick={() => setShowAddSubjectModal(false)}>
                    <div className="qedit-modal" onClick={e => e.stopPropagation()}>
                        <div className="qedit-header">
                            <span className="qedit-badge-quiz">{isAr ? 'إضافة مادة جديدة' : 'Add New Subject'}</span>
                            <button className="qedit-close" onClick={() => setShowAddSubjectModal(false)}>✕</button>
                        </div>
                        <div className="qedit-body">
                            <div className="qedit-field">
                                <label className="qedit-label">{isAr ? 'رمز المادة (ID فريد بالإنجليزية)' : 'Subject ID (unique, e.g. networks_2)'}</label>
                                <input
                                    className="qedit-opt-input"
                                    value={subjectForm.id}
                                    onChange={e => setSubjectForm(prev => ({ ...prev, id: e.target.value }))}
                                    placeholder="e.g. data_science"
                                />
                            </div>
                            <div className="qedit-field">
                                <label className="qedit-label">{isAr ? 'اسم المادة باللغة العربية' : 'Subject Name (Arabic)'}</label>
                                <input
                                    className="qedit-opt-input"
                                    value={subjectForm.nameAr}
                                    onChange={e => setSubjectForm(prev => ({ ...prev, nameAr: e.target.value }))}
                                    placeholder="مثال: علم البيانات"
                                    dir="rtl"
                                />
                            </div>
                            <div className="qedit-field">
                                <label className="qedit-label">{isAr ? 'اسم المادة باللغة الإنجليزية' : 'Subject Name (English)'}</label>
                                <input
                                    className="qedit-opt-input"
                                    value={subjectForm.name}
                                    onChange={e => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. Data Science"
                                />
                            </div>
                            <div className="qedit-field" style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="qedit-label">{isAr ? 'أيقونة (Emoji)' : 'Icon (Emoji)'}</label>
                                    <input
                                        className="qedit-opt-input"
                                        value={subjectForm.icon}
                                        onChange={e => setSubjectForm(prev => ({ ...prev, icon: e.target.value }))}
                                        placeholder="e.g. 📊"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="qedit-label">{isAr ? 'اللون (Hex)' : 'Color (Hex)'}</label>
                                    <input
                                        className="qedit-opt-input"
                                        type="color"
                                        value={subjectForm.color}
                                        onChange={e => setSubjectForm(prev => ({ ...prev, color: e.target.value }))}
                                        style={{ height: '42px', padding: '2px' }}
                                    />
                                </div>
                            </div>
                            <div className="qedit-field">
                                <label className="qedit-label">{isAr ? 'لغة الاختبار للمساق' : 'Quiz Language Mode'}</label>
                                <select
                                    className="qedit-opt-input"
                                    value={subjectForm.languageMode || 'both'}
                                    onChange={e => setSubjectForm(prev => ({ ...prev, languageMode: e.target.value }))}
                                >
                                    <option value="both">{isAr ? 'ثنائي اللغة (عربي + إنجليزي)' : 'Bilingual (Arabic + English)'}</option>
                                    <option value="en">{isAr ? 'إنجليزي فقط' : 'English Only'}</option>
                                    <option value="ar">{isAr ? 'عربي فقط' : 'Arabic Only'}</option>
                                </select>
                            </div>
                        </div>
                        <div className="qedit-footer">
                            <button className="qedit-btn-cancel" onClick={() => setShowAddSubjectModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                            <button className="qedit-btn-save" onClick={saveSubject}>💾 {isAr ? 'حفظ المادة' : 'Save Subject'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Add Quiz/Part Modal ══ */}
            {showAddPartModal && (
                <div className="qedit-overlay" onClick={() => setShowAddPartModal(false)}>
                    <div className="qedit-modal" onClick={e => e.stopPropagation()}>
                        <div className="qedit-header">
                            <span className="qedit-badge-quiz">{isAr ? 'إضافة اختبار/جزء جديد' : 'Add New Quiz / Part'}</span>
                            <button className="qedit-close" onClick={() => setShowAddPartModal(false)}>✕</button>
                        </div>
                        <div className="qedit-body">
                            <div className="qedit-field">
                                <label className="qedit-label">{isAr ? 'رمز الجزء (ID فريد بالإنجليزية)' : 'Quiz ID (unique, e.g. networks_2_quiz1)'}</label>
                                <input
                                    className="qedit-opt-input"
                                    value={partForm.id}
                                    onChange={e => setPartForm(prev => ({ ...prev, id: e.target.value }))}
                                    placeholder="e.g. data_science_mid"
                                />
                            </div>
                            <div className="qedit-field">
                                <label className="qedit-label">{isAr ? 'عنوان الاختبار باللغة العربية' : 'Quiz Title (Arabic)'}</label>
                                <input
                                    className="qedit-opt-input"
                                    value={partForm.titleAr}
                                    onChange={e => setPartForm(prev => ({ ...prev, titleAr: e.target.value }))}
                                    placeholder="مثال: أسئلة سنوات ميد"
                                    dir="rtl"
                                />
                            </div>
                            <div className="qedit-field">
                                <label className="qedit-label">{isAr ? 'عنوان الاختبار باللغة الإنجليزية' : 'Quiz Title (English)'}</label>
                                <input
                                    className="qedit-opt-input"
                                    value={partForm.title}
                                    onChange={e => setPartForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g. Midterm Exams"
                                />
                            </div>
                        </div>
                        <div className="qedit-footer">
                            <button className="qedit-btn-cancel" onClick={() => setShowAddPartModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                            <button className="qedit-btn-save" onClick={savePart}>💾 {isAr ? 'حفظ الاختبار' : 'Save Quiz'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Add/Edit Question Modal ══ */}
            {showQuestionModal && (
                <div className="qedit-overlay" onClick={() => setShowQuestionModal(false)}>
                    <div className="qedit-modal" onClick={e => e.stopPropagation()}>
                        <div className="qedit-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                <span className="qedit-badge-quiz">
                                    {editingQuestion ? (isAr ? 'تعديل سؤال' : 'Edit Question') : (isAr ? 'إضافة سؤال جديد' : 'Add New Question')}
                                </span>
                                {editingQuestion && (() => {
                                    const qIdx = allQuestions.findIndex(q => q.id === editingQuestion.id);
                                    return qIdx !== -1 ? (
                                        <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '6px', padding: '0.1rem 0.5rem', color: 'var(--primary-light, #a5b4fc)' }}>
                                            Q{qIdx + 1} / {allQuestions.length}
                                        </span>
                                    ) : null;
                                })()}
                            </div>
                            {/* Prev / Next navigation */}
                            {editingQuestion && (() => {
                                const qIdx = allQuestions.findIndex(q => q.id === editingQuestion.id);
                                return (
                                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                                        <button
                                            type="button"
                                            disabled={qIdx <= 0}
                                            onClick={() => { if (qIdx > 0) openQuestionModal(allQuestions[qIdx - 1]); }}
                                            style={{ padding: '0.2rem 0.55rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: qIdx <= 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)', cursor: qIdx <= 0 ? 'not-allowed' : 'pointer', opacity: qIdx <= 0 ? 0.4 : 1 }}
                                            title={isAr ? 'السؤال السابق' : 'Previous question'}
                                        >◀</button>
                                        <button
                                            type="button"
                                            disabled={qIdx >= allQuestions.length - 1}
                                            onClick={() => { if (qIdx < allQuestions.length - 1) openQuestionModal(allQuestions[qIdx + 1]); }}
                                            style={{ padding: '0.2rem 0.55rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: qIdx >= allQuestions.length - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)', cursor: qIdx >= allQuestions.length - 1 ? 'not-allowed' : 'pointer', opacity: qIdx >= allQuestions.length - 1 ? 0.4 : 1 }}
                                            title={isAr ? 'السؤال التالي' : 'Next question'}
                                        >▶</button>
                                    </div>
                                );
                            })()}
                            <button className="qedit-close" onClick={() => setShowQuestionModal(false)}>✕</button>
                        </div>
                        <div className="qedit-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <div className="qedit-field" style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="qedit-label">{isAr ? 'الدرجات/العلامات' : 'Marks/Points'}</label>
                                    <input
                                        className="qedit-opt-input"
                                        type="number"
                                        step="0.5"
                                        value={questionForm.marks}
                                        onChange={e => setQuestionForm(prev => ({ ...prev, marks: e.target.value }))}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="qedit-label">{isAr ? 'نوع السؤال' : 'Question Type'}</label>
                                    <select
                                        className="qedit-opt-input"
                                        value={questionForm.type}
                                        onChange={e => handleQuestionTypeChange(e.target.value)}
                                    >
                                        <option value="mcq">MCQ</option>
                                        <option value="true_false">{isAr ? 'صح أم خطأ (True/False)' : 'True / False'}</option>
                                        <option value="matching">{isAr ? 'تعبئة الفراغات بقائمة (Matching)' : 'Fill in the Blank (Matching)'}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="qedit-field">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <label className="qedit-label" style={{ margin: 0 }}>🇸🇦 {isAr ? 'نص السؤال — عربي' : 'Question Text — Arabic'}</label>
                                    <button 
                                        type="button" 
                                        className="qmanage-add-btn" 
                                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                        onClick={async () => {
                                            if (!questionForm.questionAr) { toast.error(isAr ? 'يرجى كتابة النص بالعربي أولاً' : 'Please type Arabic text first'); return; }
                                            toast(isAr ? 'جاري الترجمة...' : 'Translating...');
                                            const trans = await translateText(questionForm.questionAr, 'ar2en');
                                            if (trans) {
                                                setQuestionForm(prev => ({ ...prev, questionEn: trans }));
                                                toast.success(isAr ? 'تمت الترجمة!' : 'Translated!');
                                            } else {
                                                toast.error(isAr ? 'فشلت الترجمة' : 'Translation failed');
                                            }
                                        }}
                                    >
                                        🤖 {isAr ? 'ترجم إلى الإنجليزية' : 'Translate to English'}
                                    </button>
                                </div>
                                {/* ── Formatting toolbar for Arabic question ── */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.35rem', alignItems: 'center' }}>
                                    {[['B','bold','<strong>'],['I','italic','<em>'],['U','underline','<u>'],['</>','code','<code>']].map(([label, tag]) => (
                                        <button key={tag} type="button"
                                            onMouseDown={e => { e.preventDefault(); insertFormatIntoQuestion('questionAr', tag); }}
                                            style={{ fontWeight: tag==='bold'?'bold':'normal', fontStyle: tag==='italic'?'italic':'normal',
                                                textDecoration: tag==='underline'?'underline':'none', fontFamily: tag==='code'?'monospace':'inherit',
                                                fontSize: '0.75rem', padding: '0.15rem 0.4rem', border: '1px solid rgba(255,255,255,0.15)',
                                                background: 'rgba(255,255,255,0.06)', borderRadius: '4px', cursor: 'pointer', color: 'inherit' }}>
                                            {label}
                                        </button>
                                    ))}
                                    <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 0.1rem' }} />
                                    {QUESTION_COLORS.map(c => (
                                        <button key={c} type="button"
                                            onMouseDown={e => { e.preventDefault(); insertFormatIntoQuestion('questionAr', 'color', c); }}
                                            title={`Color ${c}`}
                                            style={{ width: '16px', height: '16px', borderRadius: '50%', background: c, border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }} />
                                    ))}
                                    <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 0.1rem' }} />
                                    {HIGHLIGHT_COLORS.map(c => (
                                        <button key={c} type="button"
                                            onMouseDown={e => { e.preventDefault(); insertFormatIntoQuestion('questionAr', 'highlight', c); }}
                                            title={`Highlight ${c}`}
                                            style={{ width: '16px', height: '16px', borderRadius: '3px', background: c, border: '2px solid rgba(0,0,0,0.2)', cursor: 'pointer', padding: 0 }} />
                                    ))}
                                </div>
                                <textarea
                                    ref={questionArRef}
                                    className="qedit-textarea"
                                    value={questionForm.questionAr}
                                    onChange={e => setQuestionForm(prev => ({ ...prev, questionAr: e.target.value }))}
                                    dir="rtl"
                                    rows={3}
                                    placeholder="اكتب السؤال هنا..."
                                />
                                {/* Live preview when HTML tags present */}
                                {/[<]/.test(questionForm.questionAr) && (
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        <span style={{ opacity: 0.6 }}>👁️ معاينة: </span>
                                        <span dangerouslySetInnerHTML={{ __html: questionForm.questionAr }} dir="rtl" />
                                    </div>
                                )}
                            </div>
                            <div className="qedit-field">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <label className="qedit-label" style={{ margin: 0 }}>🇬🇧 {isAr ? 'نص السؤال — إنجليزي' : 'Question Text — English'}</label>
                                    <button 
                                        type="button" 
                                        className="qmanage-add-btn" 
                                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                        onClick={async () => {
                                            if (!questionForm.questionEn) { toast.error(isAr ? 'يرجى كتابة النص بالإنجليزي أولاً' : 'Please type English text first'); return; }
                                            toast(isAr ? 'جاري الترجمة...' : 'Translating...');
                                            const trans = await translateText(questionForm.questionEn, 'en2ar');
                                            if (trans) {
                                                setQuestionForm(prev => ({ ...prev, questionAr: trans }));
                                                toast.success(isAr ? 'تمت الترجمة!' : 'Translated!');
                                            } else {
                                                toast.error(isAr ? 'فشلت الترجمة' : 'Translation failed');
                                            }
                                        }}
                                    >
                                        🤖 {isAr ? 'ترجم إلى العربية' : 'Translate to Arabic'}
                                    </button>
                                </div>
                                {/* ── Formatting toolbar for English question ── */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.35rem', alignItems: 'center' }}>
                                    {[['B','bold'],['I','italic'],['U','underline'],['</>','code']].map(([label, tag]) => (
                                        <button key={tag} type="button"
                                            onMouseDown={e => { e.preventDefault(); insertFormatIntoQuestion('questionEn', tag); }}
                                            style={{ fontWeight: tag==='bold'?'bold':'normal', fontStyle: tag==='italic'?'italic':'normal',
                                                textDecoration: tag==='underline'?'underline':'none', fontFamily: tag==='code'?'monospace':'inherit',
                                                fontSize: '0.75rem', padding: '0.15rem 0.4rem', border: '1px solid rgba(255,255,255,0.15)',
                                                background: 'rgba(255,255,255,0.06)', borderRadius: '4px', cursor: 'pointer', color: 'inherit' }}>
                                            {label}
                                        </button>
                                    ))}
                                    <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 0.1rem' }} />
                                    {QUESTION_COLORS.map(c => (
                                        <button key={c} type="button"
                                            onMouseDown={e => { e.preventDefault(); insertFormatIntoQuestion('questionEn', 'color', c); }}
                                            title={`Color ${c}`}
                                            style={{ width: '16px', height: '16px', borderRadius: '50%', background: c, border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }} />
                                    ))}
                                    <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 0.1rem' }} />
                                    {HIGHLIGHT_COLORS.map(c => (
                                        <button key={c} type="button"
                                            onMouseDown={e => { e.preventDefault(); insertFormatIntoQuestion('questionEn', 'highlight', c); }}
                                            title={`Highlight ${c}`}
                                            style={{ width: '16px', height: '16px', borderRadius: '3px', background: c, border: '2px solid rgba(0,0,0,0.2)', cursor: 'pointer', padding: 0 }} />
                                    ))}
                                </div>
                                <textarea
                                    ref={questionEnRef}
                                    className="qedit-textarea"
                                    value={questionForm.questionEn}
                                    onChange={e => setQuestionForm(prev => ({ ...prev, questionEn: e.target.value }))}
                                    dir="ltr"
                                    rows={3}
                                    placeholder="Type question here..."
                                />
                                {/* Live preview when HTML tags present */}
                                {/[<]/.test(questionForm.questionEn) && (
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        <span style={{ opacity: 0.6 }}>👁️ Preview: </span>
                                        <span dangerouslySetInnerHTML={{ __html: questionForm.questionEn }} dir="ltr" />
                                    </div>
                                )}
                            </div>

                            {/* ══ SubQuestions editor — shown only for matching type ══ */}
                            {questionForm.type === 'matching' && (
                                <div className="qedit-field" style={{ background: 'rgba(99,102,241,0.06)', borderRadius: '10px', padding: '0.8rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                        <label className="qedit-label" style={{ margin: 0 }}>
                                            📝 {isAr ? 'الجمل الفرعية (كل جملة لها فراغ)' : 'Sub-sentences (each has a blank)'}
                                        </label>
                                        <button
                                            type="button"
                                            className="qmanage-add-btn"
                                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                                            onClick={() => {
                                                const newId = `sq${Date.now()}`;
                                                setQuestionForm(prev => ({
                                                    ...prev,
                                                    subQuestions: [...(prev.subQuestions || []), { id: newId, textAr: '', textEn: '', correctAnswer: '' }]
                                                }));
                                            }}
                                        >
                                            + {isAr ? 'إضافة جملة' : 'Add Row'}
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        {(questionForm.subQuestions || []).map((sub, sIdx) => (
                                            <div key={sub.id} style={{ background: 'rgba(0,0,0,0.12)', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-primary, #6366f1)' }}>
                                                        {sIdx + 1}.
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="qedit-opt-delete"
                                                        style={{ margin: 0 }}
                                                        onClick={() => setQuestionForm(prev => ({
                                                            ...prev,
                                                            subQuestions: prev.subQuestions.filter((_, i) => i !== sIdx)
                                                        }))}
                                                    >🗑️</button>
                                                </div>
                                                <input
                                                    className="qedit-opt-input"
                                                    value={sub.textAr || ''}
                                                    onChange={e => setQuestionForm(prev => ({
                                                        ...prev,
                                                        subQuestions: prev.subQuestions.map((s, i) => i === sIdx ? { ...s, textAr: e.target.value } : s)
                                                    }))}
                                                    placeholder={isAr ? 'نص الجملة بالعربي (اكتب ___ للفراغ)' : 'Arabic text (use ___ for blank)'}
                                                    dir="rtl"
                                                    style={{ marginBottom: '0.3rem' }}
                                                />
                                                <input
                                                    className="qedit-opt-input"
                                                    value={sub.textEn || ''}
                                                    onChange={e => setQuestionForm(prev => ({
                                                        ...prev,
                                                        subQuestions: prev.subQuestions.map((s, i) => i === sIdx ? { ...s, textEn: e.target.value } : s)
                                                    }))}
                                                    placeholder="English text (use ___ for blank)"
                                                    dir="ltr"
                                                    style={{ marginBottom: '0.3rem' }}
                                                />
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                                                    <span style={{ color: 'var(--text-secondary, #888)' }}>{isAr ? 'الإجابة الصحيحة:' : 'Correct answer:'}</span>
                                                    <select
                                                        className="qedit-opt-input"
                                                        style={{ flex: 1, padding: '0.2rem 0.4rem', fontSize: '0.78rem' }}
                                                        value={sub.correctAnswer || ''}
                                                        onChange={e => setQuestionForm(prev => ({
                                                            ...prev,
                                                            subQuestions: prev.subQuestions.map((s, i) => i === sIdx ? { ...s, correctAnswer: e.target.value } : s)
                                                        }))}
                                                    >
                                                        <option value="">{isAr ? '— اختر —' : '— choose —'}</option>
                                                        {(questionForm.options || []).map(opt => (
                                                            <option key={opt.id} value={opt.id}>
                                                                {opt.textEn || opt.textAr || opt.id}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Options list */}
                            <div className="qedit-field">
                                <label className="qedit-label">
                                    {questionForm.type === 'matching'
                                        ? `🗂️ ${isAr ? 'قائمة الإجابات المشتركة (يختار الطالب منها لكل فراغ)' : 'Shared Answer Pool (student picks for each blank)'}`
                                        : `📋 ${isAr ? 'الخيارات — حدد الإجابة الصحيحة' : 'Options — select correct answer'}`
                                    }
                                </label>
                                <div className="qedit-options-list">
                                    {questionForm.options.map((opt, idx) => (
                                        <div key={opt.id || idx} className={`qedit-option ${questionForm.correctAnswer === opt.id ? 'qedit-option--correct' : ''}`}>
                                            <div className="qedit-option-top">
                                                <span className="qedit-opt-id">{(opt.id || String.fromCharCode(65 + idx)).toUpperCase()}</span>
                                                {questionForm.type !== 'matching' && (
                                                    <label className="qedit-correct-label">
                                                        <input
                                                            type="radio"
                                                            name="quizCorrectAnswer"
                                                            checked={questionForm.correctAnswer === opt.id}
                                                            onChange={() => setQuestionForm(prev => ({ ...prev, correctAnswer: opt.id }))}
                                                        />
                                                        {isAr ? 'صحيحة ✅' : 'Correct ✅'}
                                                    </label>
                                                )}
                                                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', marginRight: isAr ? 'auto' : '0', marginLeft: isAr ? '0' : 'auto' }}>
                                                    <button
                                                        type="button"
                                                        className="qmanage-add-btn"
                                                        style={{ padding: '0.15rem 0.4rem', fontSize: '0.68rem' }}
                                                        onClick={async () => {
                                                            if (opt.textAr) {
                                                                toast(isAr ? 'جاري الترجمة...' : 'Translating...');
                                                                const res = await translateText(opt.textAr, 'ar2en');
                                                                if (res) { updateQuestionOption(idx, 'textEn', res); toast.success(isAr ? 'تمت الترجمة!' : 'Translated!'); }
                                                            } else if (opt.textEn) {
                                                                toast(isAr ? 'جاري الترجمة...' : 'Translating...');
                                                                const res = await translateText(opt.textEn, 'en2ar');
                                                                if (res) { updateQuestionOption(idx, 'textAr', res); toast.success(isAr ? 'تمت الترجمة!' : 'Translated!'); }
                                                            } else {
                                                                toast.error(isAr ? 'اكتب نص الخيار أولاً' : 'Type option text first');
                                                            }
                                                        }}
                                                    >
                                                        🤖 {isAr ? 'ترجم' : 'Translate'}
                                                    </button>
                                                    {questionForm.type !== 'true_false' && questionForm.type !== 'matching' && (
                                                        <button className="qedit-opt-delete" style={{ margin: 0 }} onClick={() => deleteQuestionOption(idx)}>🗑️</button>
                                                    )}
                                                </div>
                                            </div>
                                            <input
                                                className="qedit-opt-input"
                                                value={opt.textAr || ''}
                                                onChange={e => updateQuestionOption(idx, 'textAr', e.target.value)}
                                                placeholder={isAr ? 'نص الخيار عربي (اختياري)' : 'Arabic option text (optional)'}
                                                dir="rtl"
                                                disabled={questionForm.type === 'true_false'}
                                            />
                                            <input
                                                className="qedit-opt-input"
                                                ref={el => { optionInputRefs.current[`${idx}-textEn`] = el; }}
                                                value={opt.textEn || ''}
                                                onChange={e => {
                                                    pushOptionHistory(idx, opt.textEn || '');
                                                    updateQuestionOption(idx, 'textEn', e.target.value);
                                                }}
                                                onKeyDown={e => {
                                                    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                                                        e.preventDefault();
                                                        undoOptionChange(idx, 'textEn');
                                                    }
                                                }}
                                                placeholder="English option text"
                                                dir="ltr"
                                                disabled={questionForm.type === 'true_false'}
                                            />
                                            {/* Live preview when HTML table is present */}
                                            {(opt.textEn || '').includes('relation-table') && (
                                                <div style={{ marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{isAr ? '👁️ معاينة:' : '👁️ Preview:'}</span>
                                                    <span dangerouslySetInnerHTML={{ __html: opt.textEn }} style={{ direction: 'ltr' }} />
                                                    <button
                                                        type="button"
                                                        className="qedit-opt-delete"
                                                        style={{ padding: '0.1rem 0.35rem', fontSize: '0.68rem', margin: 0, width: 'auto' }}
                                                        onClick={() => updateQuestionOption(idx, 'textEn', '')}
                                                    >
                                                        🗑️ {isAr ? 'حذف الجدول' : 'Clear Table'}
                                                    </button>
                                                </div>
                                            )}
                                            {/* ── Option formatting toolbar — all question types ── */}
                                            {questionForm.type !== 'true_false' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                                                    <div className="qedit-opt-toolbar" style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                                        {/* Undo */}
                                                        <button type="button"
                                                            onMouseDown={e => { e.preventDefault(); undoOptionChange(idx, 'textEn'); }}
                                                            title={isAr ? 'تراجع (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
                                                            style={{ fontSize: '0.8rem', padding: '0.15rem 0.38rem', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', cursor: 'pointer', color: 'inherit' }}>
                                                            ↩
                                                        </button>
                                                        <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)', margin: '0 0.1rem' }} />
                                                        {/* Bold / Italic / Underline / Code */}
                                                        {[['B','bold'],['I','italic'],['U','underline'],['</>','code']].map(([lbl, tag]) => (
                                                            <button key={tag} type="button"
                                                                onMouseDown={e => { e.preventDefault(); insertFormatIntoOption(idx, 'textEn', tag); }}
                                                                style={{ fontWeight: tag==='bold'?'bold':'normal', fontStyle: tag==='italic'?'italic':'normal',
                                                                    textDecoration: tag==='underline'?'underline':'none', fontFamily: tag==='code'?'monospace':'inherit',
                                                                    fontSize: '0.72rem', padding: '0.15rem 0.38rem', border: '1px solid rgba(255,255,255,0.15)',
                                                                    background: 'rgba(255,255,255,0.06)', borderRadius: '4px', cursor: 'pointer', color: 'inherit' }}>
                                                                {lbl}
                                                            </button>
                                                        ))}
                                                        <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)', margin: '0 0.1rem' }} />
                                                        {/* Text colors */}
                                                        {QUESTION_COLORS.map(c => (
                                                            <button key={c} type="button"
                                                                className="color-dot"
                                                                onMouseDown={e => { e.preventDefault(); insertFormatIntoOption(idx, 'textEn', 'color', c); }}
                                                                title={`Color ${c}`}
                                                                style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }} />
                                                        ))}
                                                        <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)', margin: '0 0.1rem' }} />
                                                        {/* Highlight colors */}
                                                        {HIGHLIGHT_COLORS.map(c => (
                                                            <button key={c} type="button"
                                                                className="color-dot"
                                                                onMouseDown={e => { e.preventDefault(); insertFormatIntoOption(idx, 'textEn', 'highlight', c); }}
                                                                title={`Highlight ${c}`}
                                                                style={{ width: '14px', height: '14px', borderRadius: '3px', background: c, border: '2px solid rgba(0,0,0,0.25)', cursor: 'pointer', padding: 0 }} />
                                                        ))}
                                                        <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)', margin: '0 0.1rem' }} />
                                                        {/* Relation table */}
                                                        <button type="button"
                                                            onClick={() => insertFormatIntoOption(idx, 'textEn', 'table')}
                                                            style={{ fontSize: '0.68rem', padding: '0.15rem 0.38rem', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', cursor: 'pointer' }}>
                                                            🗂️
                                                        </button>
                                                        {/* Image upload */}
                                                        <button type="button"
                                                            onClick={() => document.getElementById(`opt-file-input-${idx}`).click()}
                                                            style={{ fontSize: '0.68rem', padding: '0.15rem 0.38rem', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', cursor: 'pointer' }}>
                                                            🖼️
                                                        </button>
                                                        <input type="file" id={`opt-file-input-${idx}`} accept="image/*"
                                                            style={{ display: 'none' }} onChange={(e) => handleOptionImageChange(idx, e)} />
                                                    </div>
                                                    {opt.image && (
                                                        <div className="qedit-opt-img-preview" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                                                            <img src={opt.image} alt="Option preview" style={{ maxHeight: '60px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                            <button
                                                                type="button"
                                                                className="qedit-opt-delete"
                                                                style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem', margin: 0, width: 'auto' }}
                                                                onClick={() => updateQuestionOption(idx, 'image', '')}
                                                            >
                                                                🗑️ {isAr ? 'إزالة الصورة' : 'Remove Image'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {/* Delete button for matching pool items */}
                                            {questionForm.type === 'matching' && (
                                                <button
                                                    type="button"
                                                    className="qedit-opt-delete"
                                                    style={{ margin: '0.2rem 0 0', alignSelf: 'flex-end' }}
                                                    onClick={() => deleteQuestionOption(idx)}
                                                >
                                                    🗑️ {isAr ? 'حذف' : 'Remove'}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {questionForm.type !== 'true_false' && (
                                    <button className="qedit-add-option" onClick={addQuestionOption}>
                                        + {isAr
                                            ? (questionForm.type === 'matching' ? 'إضافة للقائمة' : 'إضافة خيار')
                                            : (questionForm.type === 'matching' ? 'Add to Pool' : 'Add Option')
                                        }
                                    </button>
                                )}
                            </div>

                            {/* Image device upload zone */}
                            <div className="qedit-field">
                                <label className="qedit-label">🖼️ {isAr ? 'صورة السؤال (اختياري)' : 'Question Image (optional)'}</label>
                                <input
                                    ref={quizImageInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (file.size > 10 * 1024 * 1024) {
                                            toast.error(isAr ? 'حجم الصورة يجب أن يكون أقل من 10 ميجا بايت' : 'Image must be under 10MB');
                                            return;
                                        }
                                        setQuizImageUploading(true);
                                        setQuizImageProgress(20);
                                        try {
                                            const compressed = await new Promise((resolve, reject) => {
                                                const img = new Image();
                                                const url = URL.createObjectURL(file);
                                                img.onload = () => {
                                                    URL.revokeObjectURL(url);
                                                    const MAX = 800;
                                                    let w = img.width, h = img.height;
                                                    if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
                                                    const canvas = document.createElement('canvas');
                                                    canvas.width = w; canvas.height = h;
                                                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                                                    resolve(canvas.toDataURL('image/jpeg', 0.78));
                                                };
                                                img.onerror = reject;
                                                img.src = url;
                                            });
                                            setQuizImageProgress(100);
                                            setQuestionForm(prev => ({ ...prev, image: compressed }));
                                            toast.success(isAr ? '✅ تم تحميل الصورة بنجاح' : '✅ Image loaded successfully');
                                        } catch (err) {
                                            console.error(err);
                                            toast.error(isAr ? 'خطأ في معالجة الصورة' : 'Image processing error');
                                        } finally {
                                            setQuizImageUploading(false);
                                            setQuizImageProgress(0);
                                        }
                                        e.target.value = '';
                                    }}
                                />
                                {!questionForm.image && !quizImageUploading && (
                                    <div className="qedit-image-dropzone" onClick={() => quizImageInputRef.current?.click()}>
                                        <span style={{ fontSize: '2rem' }}>🖼️</span>
                                        <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem' }}>{isAr ? 'اضغط لاختيار صورة من جهازك' : 'Click to choose an image from your device'}</p>
                                    </div>
                                )}
                                {quizImageUploading && (
                                    <div className="qedit-image-uploading">
                                        <div className="qedit-upload-bar">
                                            <div className="qedit-upload-bar-fill" style={{ width: `${quizImageProgress}%` }} />
                                        </div>
                                        <span>{isAr ? `جاري الرفع... ${quizImageProgress}%` : `Uploading... ${quizImageProgress}%`}</span>
                                    </div>
                                )}
                                {questionForm.image && !quizImageUploading && (
                                    <div style={{ marginTop: '0.6rem', textAlign: 'center' }}>
                                        <img src={questionForm.image} alt="preview" style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)' }} />
                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button className="qedit-add-option" style={{ width: 'auto', padding: '0.3rem 0.8rem' }} onClick={() => quizImageInputRef.current?.click()}>🔄 {isAr ? 'تغيير الصورة' : 'Change Image'}</button>
                                            <button className="qedit-opt-delete" onClick={() => setQuestionForm(prev => ({ ...prev, image: '' }))}>{isAr ? 'حذف 🗑' : 'Remove 🗑'}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="qedit-footer">
                            <button className="qedit-btn-cancel" onClick={() => setShowQuestionModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                            <button className="qedit-btn-save" onClick={saveQuestion}>💾 {isAr ? 'حفظ السؤال' : 'Save Question'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminDashboard;
