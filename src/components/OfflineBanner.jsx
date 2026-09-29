import React, { useState, useEffect, useCallback } from 'react';
import './OfflineBanner.css';

/**
 * OfflineBanner — shows a sticky banner when the user loses internet,
 * and a success toast when they reconnect.
 */
const OfflineBanner = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showReconnected, setShowReconnected] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    const handleOnline = useCallback(() => {
        setIsOnline(true);
        if (wasOffline) {
            setShowReconnected(true);
            setTimeout(() => setShowReconnected(false), 4000);
        }
        setWasOffline(false);
        setIsRetrying(false);
    }, [wasOffline]);

    const handleOffline = useCallback(() => {
        setIsOnline(false);
        setWasOffline(true);
        setShowReconnected(false);
    }, []);

    useEffect(() => {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [handleOnline, handleOffline]);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => {
            if (navigator.onLine) {
                window.location.reload();
            } else {
                setIsRetrying(false);
            }
        }, 2000);
    };

    return (
        <>
            {/* ── Offline Banner ── */}
            <div
                className={`offline-banner ${!isOnline ? 'offline-banner--visible' : ''}`}
                role="alert"
                aria-live="assertive"
                dir="rtl"
            >
                <div className="offline-banner__inner">
                    <div className="offline-banner__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="2" y1="2" x2="22" y2="22" />
                            <path d="M8.5 16.5a5 5 0 0 1 7 0" />
                            <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
                            <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
                            <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
                            <path d="M5 12.5a10 10 0 0 1 5.24-2.71" />
                            <circle cx="12" cy="20" r="1" />
                        </svg>
                    </div>

                    <div className="offline-banner__text">
                        <strong>لا يوجد اتصال بالإنترنت</strong>
                        <span>تحقق من اتصالك وحاول مجدداً</span>
                    </div>

                    <div className="offline-banner__actions">
                        <button
                            className="offline-banner__details"
                            onClick={() => { window.location.hash = '#/offline'; }}
                            aria-label="عرض التفاصيل"
                        >
                            تفاصيل ℹ️
                        </button>

                        <button
                            className={`offline-banner__retry ${isRetrying ? 'offline-banner__retry--spinning' : ''}`}
                            onClick={handleRetry}
                            disabled={isRetrying}
                            aria-label="إعادة المحاولة"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10" />
                                <path d="M3.51 15a9 9 0 1 0 .49-3" />
                            </svg>
                            {isRetrying ? 'جاري...' : 'إعادة'}
                        </button>
                    </div>
                </div>

                {/* Animated progress line at bottom */}
                <div className="offline-banner__pulse" />
            </div>

            {/* ── Reconnected Toast ── */}
            <div
                className={`offline-reconnected ${showReconnected ? 'offline-reconnected--visible' : ''}`}
                role="status"
                dir="rtl"
            >
                <span className="offline-reconnected__icon">✅</span>
                <span>تم استعادة الاتصال!</span>
            </div>
        </>
    );
};

export default OfflineBanner;
