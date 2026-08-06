import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import './NoticeBoard.css';

const TYPE_ICONS = {
    info:    { icon: 'ℹ️', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
    warning: { icon: '⚠️', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    success: { icon: '✅', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    alert:   { icon: '🔔', color: '#e02b20', bg: 'rgba(224,43,32,0.08)'  },
};

/**
 * NoticeBoard – reads from Firestore `notices` collection.
 * Only shows notices where active == true and (expiresAt is null OR expiresAt > now).
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'notices'),
            where('active', '==', true),
            orderBy('pinned', 'desc'),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, snap => {
            const now = Date.now();
            const list = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(n => !n.expiresAt || n.expiresAt.toMillis?.() > now || n.expiresAt > now);
            setNotices(list);
            setLoading(false);
        }, () => setLoading(false));
        return () => unsub();
    }, []);

    const dismiss = (id) => {
        const next = [...dismissed, id];
        setDismissed(next);
        try { localStorage.setItem('koon_dismissed_notices', JSON.stringify(next)); } catch { /**/ }
    };

    const visible = notices.filter(n => !dismissed.includes(n.id));

    if (loading || visible.length === 0) return null;

    return (
        <div className="notice-board" role="region" aria-label={isAr ? 'الإعلانات' : 'Notices'}>
            {visible.map(n => {
                const t = TYPE_ICONS[n.type] || TYPE_ICONS.info;
                return (
                    <div
                        key={n.id}
                        className={`notice-item ${n.pinned ? 'pinned' : ''}`}
                        style={{ background: t.bg, borderColor: t.color }}
                        role="alert"
                    >
                        <span className="notice-icon">{t.icon}</span>
                        <div className="notice-body">
                            {(isAr ? n.titleAr : n.titleEn) && (
                                <strong className="notice-title">{isAr ? n.titleAr : n.titleEn}</strong>
                            )}
                            {(isAr ? n.bodyAr : n.bodyEn) && (
                                <p className="notice-text">{isAr ? n.bodyAr : n.bodyEn}</p>
                            )}
                        </div>
                        {n.pinned && (
                            <span className="notice-pin" title={isAr ? 'مثبت' : 'Pinned'}>📌</span>
                        )}
                        <button
                            className="notice-close-btn"
                            onClick={() => dismiss(n.id)}
                            aria-label={isAr ? 'إغلاق الإعلان' : 'Dismiss notice'}
                        >
                            ×
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default NoticeBoard;
