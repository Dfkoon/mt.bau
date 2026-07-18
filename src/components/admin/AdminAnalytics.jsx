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

const AdminAnalytics = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [pageViews, setPageViews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchViews = async () => {
            try {
                const pv = query(collection(db, 'page_views'), orderBy('timestamp', 'desc'), limit(10000));
                const s = await getDocs(pv);
                setPageViews(s.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (err) {
                console.error("Failed to load analytics page views:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchViews();
    }, []);

    if (loading) {
        return (
            <div className="admin-loading-container">
                <div className="admin-spinner" />
                <p>{isAr ? 'جاري تحميل التحليلات والإحصائيات...' : 'Loading analytics and metrics...'}</p>
            </div>
        );
    }

    // ── Calculate metrics ──
    const pathCounts = {};
    pageViews.filter(v => v.type === 'visit' && v.path).forEach(v => {
        pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
    });
    const sortedPaths = Object.entries(pathCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const maxPathCount = sortedPaths[0]?.[1] || 1;

    const courseCounts = {};
    pageViews.filter(v => v.type === 'material_view' && v.courseName).forEach(v => {
        courseCounts[v.courseName] = (courseCounts[v.courseName] || 0) + 1;
    });
    const sortedCourses = Object.entries(courseCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const maxCourseCount = sortedCourses[0]?.[1] || 1;

    const quizCounts = {};
    pageViews.filter(v => v.type === 'quiz_completed' && v.quizTitle).forEach(v => {
        quizCounts[v.quizTitle] = (quizCounts[v.quizTitle] || 0) + 1;
    });
    const sortedQuizzes = Object.entries(quizCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const maxQuizCount = sortedQuizzes[0]?.[1] || 1;

    // Total metrics card values
    const totalOpens = pageViews.filter(v => v.type === 'material_view').length;

    return (
        <div className="admin-panel-section admin-fade-in">
            {/* Embedded Cards specifically for stats tab details */}
            <div className="admin-mini-kpi-grid">
                <div className="admin-mini-kpi-card">
                    <span className="mini-kpi-icon">📂</span>
                    <div className="mini-kpi-info">
                        <h3>{totalOpens}</h3>
                        <p>{isAr ? 'فتح المواد الدراسية' : 'Material Opens'}</p>
                    </div>
                </div>
                <div className="admin-mini-kpi-card">
                    <span className="mini-kpi-icon">📝</span>
                    <div className="mini-kpi-info">
                        <h3>{pageViews.filter(v => v.type === 'quiz_completed').length}</h3>
                        <p>{isAr ? 'إجتياز الاختبارات' : 'Quiz Completions'}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                {/* Pages Chart */}
                <div className="admin-glass-card">
                    <h3 className="admin-section-title">📈 <span>{isAr ? 'أكثر الصفحات زيارةً' : 'Most Visited Pages'}</span></h3>
                    <div className="analytics-chart">
                        {sortedPaths.length === 0 ? (
                            <p className="no-data-msg">{isAr ? 'لا توجد بيانات بعد' : 'No data yet'}</p>
                        ) : (
                            sortedPaths.map(([path, count]) => (
                                <div key={path} className="chart-bar-row">
                                    <span className="chart-bar-label">{getPathLabel(path, language)}</span>
                                    <div className="chart-bar-track">
                                        <div className="chart-bar-fill" style={{ width: `${(count / maxPathCount) * 100}%` }} />
                                    </div>
                                    <span className="chart-bar-count">{count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Materials Chart */}
                <div className="admin-glass-card">
                    <h3 className="admin-section-title">📂 <span>{isAr ? 'أكثر المواد الدراسية فتحاً' : 'Most Opened Study Materials'}</span></h3>
                    <div className="analytics-chart">
                        {sortedCourses.length === 0 ? (
                            <p className="no-data-msg">{isAr ? 'لا توجد بيانات بعد' : 'No data yet'}</p>
                        ) : (
                            sortedCourses.map(([name, count]) => (
                                <div key={name} className="chart-bar-row">
                                    <span className="chart-bar-label">{name}</span>
                                    <div className="chart-bar-track">
                                        <div className="chart-bar-fill" style={{ width: `${(count / maxCourseCount) * 100}%` }} />
                                    </div>
                                    <span className="chart-bar-count">{count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quizzes Chart */}
            <div className="admin-glass-card" style={{ marginTop: '1.5rem' }}>
                <h3 className="admin-section-title">🎯 <span>{isAr ? 'الاختبارات الأكثر إتماماً' : 'Most Completed Quizzes'}</span></h3>
                <div className="analytics-chart">
                    {sortedQuizzes.length === 0 ? (
                        <p className="no-data-msg">{isAr ? 'لا توجد بيانات بعد' : 'No data yet'}</p>
                    ) : (
                        sortedQuizzes.map(([title, count]) => (
                            <div key={title} className="chart-bar-row">
                                <span className="chart-bar-label">{title}</span>
                                <div className="chart-bar-track">
                                    <div className="chart-bar-fill" style={{ width: `${(count / maxQuizCount) * 100}%`, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)' }} />
                                </div>
                                <span className="chart-bar-count">{count}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
