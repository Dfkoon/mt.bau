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
    if (lang === 'ar') return PATH_LABELS[path] || path;
    const en = {
        '/': 'Home', '/materials': 'Study Materials', '/plans': 'Academic Plans',
        '/quiz': 'Quizzes', '/calendar': 'Calendar', '/grading': 'Grading',
        '/exchange': 'Exchange', '/about': 'About', '/faq': 'FAQ',
        '/materials/click': 'Materials (Download)', '/quiz/complete': 'Quiz (Completed)',
    };
    return en[path] || path;
};

const DIFF_LABELS = {
    1: { ar: 'سهل جداً 😌', en: 'Very Easy 😌', color: '#10b981' },
    2: { ar: 'سهل 🙂',      en: 'Easy 🙂',      color: '#34d399' },
    3: { ar: 'متوسط 😐',    en: 'Medium 😐',    color: '#f59e0b' },
    4: { ar: 'صعب 😤',      en: 'Hard 😤',      color: '#f97316' },
    5: { ar: 'صعب جداً 😱', en: 'Very Hard 😱', color: '#e02b20' },
};

const AdminAnalytics = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [pageViews, setPageViews] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingsLoading, setRatingsLoading] = useState(true);
    const [ratingsTab, setRatingsTab] = useState('star'); // 'star' | 'difficulty'

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

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const q = query(collection(db, 'material_ratings'), orderBy('timestamp', 'desc'), limit(5000));
                const snap = await getDocs(q);
                setRatings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (err) {
                console.error("Failed to load ratings:", err);
            } finally {
                setRatingsLoading(false);
            }
        };
        fetchRatings();
    }, []);

    if (loading) {
        return (
            <div className="admin-loading-container">
                <div className="admin-spinner" />
                <p>{isAr ? 'جاري تحميل التحليلات والإحصائيات...' : 'Loading analytics and metrics...'}</p>
            </div>
        );
    }

    // ── Page view metrics ──
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

    const totalOpens = pageViews.filter(v => v.type === 'material_view').length;

    // ── Ratings metrics ──
    const starRatings   = ratings.filter(r => r.type === 'star');
    const diffRatings   = ratings.filter(r => r.type === 'difficulty');

    // Star: group by itemTitle → compute avg
    const starByItem = {};
    starRatings.forEach(r => {
        const key = r.itemTitle || r.itemId || '—';
        if (!starByItem[key]) starByItem[key] = { sum: 0, count: 0 };
        starByItem[key].sum   += r.rating;
        starByItem[key].count += 1;
    });
    const sortedStarItems = Object.entries(starByItem)
        .map(([title, { sum, count }]) => ({ title, avg: sum / count, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    // Difficulty: group by itemTitle → distribution
    const diffByItem = {};
    diffRatings.forEach(r => {
        const key = r.itemTitle || r.itemId || '—';
        if (!diffByItem[key]) diffByItem[key] = { counts: {}, total: 0 };
        diffByItem[key].counts[r.rating] = (diffByItem[key].counts[r.rating] || 0) + 1;
        diffByItem[key].total += 1;
    });
    const sortedDiffItems = Object.entries(diffByItem)
        .map(([title, data]) => {
            const topLevel = Object.entries(data.counts).sort((a, b) => b[1] - a[1])[0];
            return { title, total: data.total, topLevel: parseInt(topLevel?.[0]) || 0, counts: data.counts };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 15);

    const renderStars = (avg) => Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < Math.floor(avg) ? '#f59e0b' : (i === Math.floor(avg) && avg % 1 >= 0.5 ? '#fbbf24' : '#ccc'), fontSize: '0.95rem' }}>
            {i < Math.floor(avg) ? '★' : (i === Math.floor(avg) && avg % 1 >= 0.5 ? '⭐' : '☆')}
        </span>
    ));

    return (
        <div className="admin-panel-section admin-fade-in">

            {/* ── KPI Cards ── */}
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
                <div className="admin-mini-kpi-card">
                    <span className="mini-kpi-icon">⭐</span>
                    <div className="mini-kpi-info">
                        <h3>{starRatings.length}</h3>
                        <p>{isAr ? 'تقييمات النجوم' : 'Star Ratings'}</p>
                    </div>
                </div>
                <div className="admin-mini-kpi-card">
                    <span className="mini-kpi-icon">⚡</span>
                    <div className="mini-kpi-info">
                        <h3>{diffRatings.length}</h3>
                        <p>{isAr ? 'تقييمات الصعوبة' : 'Difficulty Ratings'}</p>
                    </div>
                </div>
            </div>

            {/* ── Page & Course Charts ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div className="admin-glass-card">
                    <h3 className="admin-section-title">📈 <span>{isAr ? 'أكثر الصفحات زيارةً' : 'Most Visited Pages'}</span></h3>
                    <div className="analytics-chart">
                        {sortedPaths.length === 0 ? <p className="no-data-msg">{isAr ? 'لا توجد بيانات بعد' : 'No data yet'}</p>
                            : sortedPaths.map(([path, count]) => (
                                <div key={path} className="chart-bar-row">
                                    <span className="chart-bar-label">{getPathLabel(path, language)}</span>
                                    <div className="chart-bar-track"><div className="chart-bar-fill" style={{ width: `${(count / maxPathCount) * 100}%` }} /></div>
                                    <span className="chart-bar-count">{count}</span>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="admin-glass-card">
                    <h3 className="admin-section-title">📂 <span>{isAr ? 'أكثر المواد الدراسية فتحاً' : 'Most Opened Study Materials'}</span></h3>
                    <div className="analytics-chart">
                        {sortedCourses.length === 0 ? <p className="no-data-msg">{isAr ? 'لا توجد بيانات بعد' : 'No data yet'}</p>
                            : sortedCourses.map(([name, count]) => (
                                <div key={name} className="chart-bar-row">
                                    <span className="chart-bar-label">{name}</span>
                                    <div className="chart-bar-track"><div className="chart-bar-fill" style={{ width: `${(count / maxCourseCount) * 100}%` }} /></div>
                                    <span className="chart-bar-count">{count}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* ── Quizzes Chart ── */}
            <div className="admin-glass-card" style={{ marginTop: '1.5rem' }}>
                <h3 className="admin-section-title">🎯 <span>{isAr ? 'الاختبارات الأكثر إتماماً' : 'Most Completed Quizzes'}</span></h3>
                <div className="analytics-chart">
                    {sortedQuizzes.length === 0 ? <p className="no-data-msg">{isAr ? 'لا توجد بيانات بعد' : 'No data yet'}</p>
                        : sortedQuizzes.map(([title, count]) => (
                            <div key={title} className="chart-bar-row">
                                <span className="chart-bar-label">{title}</span>
                                <div className="chart-bar-track">
                                    <div className="chart-bar-fill" style={{ width: `${(count / maxQuizCount) * 100}%`, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)' }} />
                                </div>
                                <span className="chart-bar-count">{count}</span>
                            </div>
                        ))}
                </div>
            </div>

            {/* ══════════════════════════════════════
                  STUDENT RATINGS SECTION
             ══════════════════════════════════════ */}
            <div className="admin-glass-card" style={{ marginTop: '1.5rem' }}>
                {/* Header + tab switcher */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                    <h3 className="admin-section-title" style={{ margin: 0 }}>
                        ⭐ <span>{isAr ? 'تقييمات الطلاب للمواد' : 'Student Course Ratings'}</span>
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setRatingsTab('star')}
                            style={{
                                padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: '0.82rem', fontFamily: 'inherit',
                                background: ratingsTab === 'star' ? '#f59e0b' : 'rgba(0,0,0,0.07)',
                                color: ratingsTab === 'star' ? '#fff' : 'inherit', transition: 'all 0.2s',
                            }}
                        >
                            ★ {isAr ? 'تقييم النجوم' : 'Star Ratings'} ({starRatings.length})
                        </button>
                        <button
                            onClick={() => setRatingsTab('difficulty')}
                            style={{
                                padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: '0.82rem', fontFamily: 'inherit',
                                background: ratingsTab === 'difficulty' ? '#e02b20' : 'rgba(0,0,0,0.07)',
                                color: ratingsTab === 'difficulty' ? '#fff' : 'inherit', transition: 'all 0.2s',
                            }}
                        >
                            ⚡ {isAr ? 'صعوبة المادة' : 'Difficulty'} ({diffRatings.length})
                        </button>
                    </div>
                </div>

                {ratingsLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                        <div className="admin-spinner" style={{ width: 28, height: 28, margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '0.85rem' }}>{isAr ? 'جاري تحميل التقييمات...' : 'Loading ratings...'}</p>
                    </div>

                ) : ratingsTab === 'star' ? (
                    /* ── Star Ratings Tab ── */
                    sortedStarItems.length === 0 ? (
                        <p className="no-data-msg">{isAr ? 'لم يُقيّم أي طالب بعد' : 'No student ratings yet'}</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {sortedStarItems.map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '10px 14px', background: 'rgba(0,0,0,0.03)',
                                    borderRadius: '10px', flexWrap: 'wrap'
                                }}>
                                    {/* Rank */}
                                    <span style={{ fontWeight: 900, fontSize: '0.8rem', opacity: 0.35, minWidth: '20px' }}>#{i + 1}</span>
                                    {/* Title */}
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', flex: 1, minWidth: '100px' }}>{item.title}</span>
                                    {/* Stars visual */}
                                    <div style={{ display: 'flex', gap: '1px' }}>{renderStars(item.avg)}</div>
                                    {/* Avg number */}
                                    <span style={{ fontWeight: 900, fontSize: '1rem', color: '#f59e0b', minWidth: '36px' }}>
                                        {item.avg.toFixed(1)}
                                    </span>
                                    {/* Vote count */}
                                    <span style={{
                                        fontSize: '0.75rem', opacity: 0.55,
                                        background: 'rgba(0,0,0,0.06)', padding: '2px 10px',
                                        borderRadius: '12px', fontWeight: 700
                                    }}>
                                        {item.count} {isAr ? 'تقييم' : 'ratings'}
                                    </span>
                                    {/* Rating bar */}
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.07)', borderRadius: '4px', marginTop: '2px' }}>
                                        <div style={{
                                            height: '100%', borderRadius: '4px',
                                            width: `${(item.avg / 5) * 100}%`,
                                            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                                            transition: 'width 0.4s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )

                ) : (
                    /* ── Difficulty Ratings Tab ── */
                    sortedDiffItems.length === 0 ? (
                        <p className="no-data-msg">{isAr ? 'لم يُقيّم أي طالب الصعوبة بعد' : 'No difficulty ratings yet'}</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {sortedDiffItems.map((item, i) => (
                                <div key={i} style={{
                                    padding: '12px 14px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px'
                                }}>
                                    {/* Title row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                            <span style={{ opacity: 0.35, fontSize: '0.8rem', marginLeft: 4 }}>#{i + 1}</span> {item.title}
                                        </span>
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            {item.topLevel > 0 && (
                                                <span style={{
                                                    background: (DIFF_LABELS[item.topLevel]?.color || '#ccc') + '22',
                                                    color: DIFF_LABELS[item.topLevel]?.color,
                                                    padding: '2px 10px', borderRadius: '12px',
                                                    fontSize: '0.78rem', fontWeight: 800
                                                }}>
                                                    {isAr ? DIFF_LABELS[item.topLevel]?.ar : DIFF_LABELS[item.topLevel]?.en}
                                                </span>
                                            )}
                                            <span style={{ fontSize: '0.72rem', opacity: 0.45, fontWeight: 700 }}>
                                                {item.total} {isAr ? 'تقييم' : 'ratings'}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Mini bar chart showing distribution across 5 levels */}
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '44px' }}>
                                        {[1, 2, 3, 4, 5].map(lvl => {
                                            const cnt   = item.counts[lvl] || 0;
                                            const pct   = item.total > 0 ? (cnt / item.total) * 100 : 0;
                                            const color = DIFF_LABELS[lvl]?.color || '#ccc';
                                            return (
                                                <div key={lvl} title={`${isAr ? DIFF_LABELS[lvl]?.ar : DIFF_LABELS[lvl]?.en}: ${cnt}`}
                                                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color, opacity: cnt > 0 ? 1 : 0.3 }}>{cnt > 0 ? cnt : ''}</span>
                                                    <div style={{
                                                        width: '100%', borderRadius: '4px 4px 0 0',
                                                        height: `${Math.max(pct * 0.28, cnt > 0 ? 5 : 2)}px`,
                                                        background: color, opacity: cnt > 0 ? 1 : 0.15,
                                                        transition: 'height 0.4s ease'
                                                    }} />
                                                    <span style={{ fontSize: '0.72rem' }}>
                                                        {['😌', '🙂', '😐', '😤', '😱'][lvl - 1]}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminAnalytics;
