import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useLanguage } from '../../contexts/LanguageContext';

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

const fmtDate = (ts) => {
    if (!ts) return '—';
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return d.toLocaleDateString('ar-JO') + ' ' + d.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' });
};

const TypeBadge = ({ type }) => {
    const map = {
        visit: { label: 'زيارة', cls: 'badge-visit', en: 'Visit' },
        material_view: { label: 'مادة', cls: 'badge-material', en: 'Material' },
        quiz_completed: { label: 'اختبار', cls: 'badge-quiz', en: 'Quiz' },
    };
    const b = map[type] || { label: type, cls: 'badge-visit', en: type };
    return <span className={`badge ${b.cls}`}>{b.label}</span>;
};

const AdminActivityLog = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Fetch latest 400 logs
                const qLogs = query(collection(db, 'page_views'), orderBy('timestamp', 'desc'), limit(400));
                const snap = await getDocs(qLogs);
                setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (err) {
                console.error("Failed to load activity logs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) {
        return (
            <div className="admin-loading-container">
                <div className="admin-spinner" />
                <p>{isAr ? 'جاري تحميل سجل النشاط...' : 'Loading activity log...'}</p>
            </div>
        );
    }

    const filtered = logs.filter(v => filterType === 'all' || v.type === filterType);

    return (
        <div className="admin-panel-section admin-fade-in" style={{ direction: 'rtl', textAlign: 'right' }}>
            <h3 className="admin-section-title">📋 <span>{isAr ? 'سجل الطلاب والأنشطة' : 'Student Activity Log'}</span></h3>

            <div className="admin-filter-row" style={{ marginBottom: '1.5rem' }}>
                <div className="filter-group">
                    <label>{isAr ? 'تصفية حسب نوع النشاط:' : 'Filter by activity type:'}</label>
                    <select className="admin-filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <option value="all">{isAr ? 'كل الأنشطة' : 'All Activities'}</option>
                        <option value="visit">{isAr ? 'زيارات الصفحات' : 'Page Visits'}</option>
                        <option value="material_view">{isAr ? 'فتح المواد الدراسية' : 'Study Materials'}</option>
                        <option value="quiz_completed">{isAr ? 'إتمام الاختبارات' : 'Quiz Completions'}</option>
                    </select>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{isAr ? 'النوع' : 'Type'}</th>
                            <th>{isAr ? 'الطالب' : 'Student'}</th>
                            <th>{isAr ? 'التفاصيل والحدث' : 'Details'}</th>
                            <th>{isAr ? 'التاريخ والوقت' : 'Date & Time'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                                    {isAr ? 'لا توجد سجلات مطابقة حالياً' : 'No matching logs found'}
                                </td>
                            </tr>
                        ) : (
                            filtered.map(v => (
                                <tr key={v.id}>
                                    <td><TypeBadge type={v.type} /></td>
                                    <td>
                                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                                            👤 {v.studentName && v.studentName !== 'Guest' ? v.studentName : (isAr ? 'زائر مجهول' : 'Guest')}
                                        </div>
                                        {v.studentPhone && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>📞 {v.studentPhone}</div>}
                                    </td>
                                    <td>
                                        {v.type === 'visit' && (
                                            <span style={{ fontSize: '0.85rem' }}>💻 {isAr ? 'زار صفحة:' : 'Visited page:'} <strong>{getPathLabel(v.path, language)}</strong></span>
                                        )}
                                        {v.type === 'material_view' && (
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>📂 {v.courseName}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{v.materialName}</div>
                                            </div>
                                        )}
                                        {v.type === 'quiz_completed' && (
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>🎯 {v.quizTitle || v.quizId}</div>
                                                <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 'bold', marginTop: '2px' }}>📊 {isAr ? `النتيجة: ${v.score}` : `Score: ${v.score}`}</div>
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
    );
};

export default AdminActivityLog;
