import React, { useState, useEffect, useRef, useCallback } from 'react';
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

    const [isAuthed, setIsAuthed] = useState(false);

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
        });
    };
    const closeEditModal = () => setEditingReport(null);

    const updateOption = (idx, field, val) =>
        setEditForm(prev => ({
            ...prev,
            options: prev.options.map((o, i) => i === idx ? { ...o, [field]: val } : o),
        }));

    const saveQuestionEdit = async () => {
        if (!editingReport) return;
        setEditSaving(true);
        try {
            const editKey = `${editingReport.quizId}_${editingReport.questionId}`;
            await setDoc(doc(db, 'question_edits', editKey), {
                quizId: editingReport.quizId,
                questionId: editingReport.questionId,
                questionAr: editForm.questionAr,
                questionEn: editForm.questionEn,
                options: editForm.options,
                correctAnswer: editForm.correctAnswer,
                updatedAt: serverTimestamp(),
            });
            await updateDoc(doc(db, 'question_reports', editingReport.id), {
                status: 'resolved',
                questionAr: editForm.questionAr,
                questionEn: editForm.questionEn,
                options: editForm.options,
                correctAnswer: editForm.correctAnswer,
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

                            {/* Options */}
                            {editForm.options.length > 0 ? (
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
                                                {/* Option label + correct radio */}
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
                                </div>
                            ) : (
                                <div className="qedit-no-options">
                                    ⚠️ {isAr
                                        ? 'هذا السؤال لا يحتوي على خيارات مُخزَّنة. يمكنك تعديل نص السؤال فقط.'
                                        : 'No options stored for this question (question text editable only).'
                                    }
                                </div>
                            )}
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
        </>
    );
};

export default AdminDashboard;
