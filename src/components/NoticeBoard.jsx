import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import './NoticeBoard.css';

const TYPE_ICONS = {
    info: { icon: 'ℹ️', color: '#3b82f6', bg: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.04))' },
    warning: { icon: '⚠️', color: '#f59e0b', bg: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.04))' },
    success: { icon: '✅', color: '#10b981', bg: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.04))' },
    alert: { icon: '🔔', color: '#e02b20', bg: 'linear-gradient(135deg,rgba(224,43,32,0.12),rgba(224,43,32,0.04))' },
};

/**
 * NoticeBoard – popup modal triggered on first visit.
 * Reads from Firestore `notices` collection (active == true).
 * Fields: { titleAr, titleEn, bodyAr, bodyEn, type, active, pinned, expiresAt, createdAt }
 */
const NoticeBoard = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [notices, setNotices] = useState([]);
    const [dismissed, setDismissed] = useState(() => {
        try { return JSON.parse(localStorage.getItem('koon_dismissed_notices') || '[]'); }
        catch { return []; }
    });
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'notices'),
            where('active', '==', true)
        );
        const unsub = onSnapshot(q, snap => {
            const now = Date.now();
            const list = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(n => !n.expiresAt || n.expiresAt.toMillis?.() > now || n.expiresAt > now)
                .sort((a, b) => {
                    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
                    const aTime = a.createdAt?.toMillis?.() || new Date(a.createdAt || 0).getTime();
                    const bTime = b.createdAt?.toMillis?.() || new Date(b.createdAt || 0).getTime();
                    return bTime - aTime;
                });
            setNotices(list);
            setLoading(false);
        }, (error) => {
            console.error('NoticeBoard: failed to load active notices:', error);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Open popup automatically after loading if there are un-dismissed notices
    useEffect(() => {
        if (!loading && notices.length > 0) {
            const visible = notices.filter(n => !dismissed.includes(n.id));
            if (visible.length > 0) {
                // Small delay for smoother UX after page load
                const timer = setTimeout(() => setOpen(true), 800);
                return () => clearTimeout(timer);
            }
        }
    }, [loading, notices]);

    const dismissCurrent = () => {
        const visible = notices.filter(n => !dismissed.includes(n.id));
        if (visible[currentIndex]) {
            const next = [...dismissed, visible[currentIndex].id];
            setDismissed(next);
            try { localStorage.setItem('koon_dismissed_notices', JSON.stringify(next)); } catch { /**/ }
        }
        // Move to next or close
        const remaining = visible.length - 1;
        if (remaining > currentIndex) {
            setCurrentIndex(i => i);
        } else if (remaining > 0) {
            setCurrentIndex(0);
        } else {
            setOpen(false);
        }
    };

    const dismissAll = () => {
        const visible = notices.filter(n => !dismissed.includes(n.id));
        const ids = visible.map(n => n.id);
        const next = [...dismissed, ...ids];
        setDismissed(next);
        try { localStorage.setItem('koon_dismissed_notices', JSON.stringify(next)); } catch { /**/ }
        setOpen(false);
    };

    const skipCurrent = () => {
        dismissCurrent();
    };

    const goToSection = () => {
        if (!notice.targetPath) return;
        dismissCurrent();
        window.location.hash = notice.targetPath;
    };

    const visible = notices.filter(n => !dismissed.includes(n.id));

    if (loading || !open || visible.length === 0) return null;

    const notice = visible[currentIndex] || visible[0];
    const t = TYPE_ICONS[notice.type] || TYPE_ICONS.info;
    const hasMultiple = visible.length > 1;

    return (
        <div className="nb-overlay" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) dismissAll(); }}>
            <div className="nb-modal" style={{ '--nb-color': t.color, '--nb-bg': t.bg }}>

                {/* Header strip */}
                <div className="nb-header" style={{ background: t.color }}>
                    <span className="nb-header-icon">{t.icon}</span>
                    <span className="nb-header-label">{isAr ? 'إعلان من الفريق' : 'Team Announcement'}</span>
                    {notice.pinned && <span className="nb-pin">📌</span>}
                    <button className="nb-close" onClick={dismissAll} aria-label={isAr ? 'إغلاق' : 'Close'}>✕</button>
                </div>

                {/* Body */}
                <div className="nb-body" style={{ background: t.bg }}>
                    {(isAr ? notice.titleAr : notice.titleEn) && (
                        <h3 className="nb-title" style={{ color: t.color }}>{isAr ? notice.titleAr : notice.titleEn}</h3>
                    )}
                    {(isAr ? notice.bodyAr : notice.bodyEn) && (
                        <p className="nb-text">{isAr ? notice.bodyAr : notice.bodyEn}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="nb-footer">
                    {hasMultiple && (
                        <div className="nb-pagination">
                            {visible.map((_, i) => (
                                <button
                                    key={i}
                                    className={`nb-dot ${i === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(i)}
                                    style={{ background: i === currentIndex ? t.color : undefined }}
                                />
                            ))}
                        </div>
                    )}
                    <div className="nb-actions">
                        <button className="nb-btn-skip" onClick={skipCurrent}>
                            {isAr ? 'تطي' : 'Skip'}
                        </button>
                        {notice.targetPath && (
                            <button className="nb-btn-dismiss" onClick={goToSection} style={{ '--btn-color': t.color }}>
                                {isAr ? 'الذهاب إلى القسم المذكور' : 'Go to mentioned section'}
                            </button>
                        )}
                        {hasMultiple && currentIndex < visible.length - 1 && (
                            <button className="nb-btn-next" onClick={() => setCurrentIndex(i => i + 1)}>
                                {isAr ? 'التالي ←' : 'Next →'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeBoard;
