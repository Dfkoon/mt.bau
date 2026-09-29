import React, { useState, useEffect } from 'react';
import './Offline.css';

const Offline = () => {
    const [dots, setDots] = useState('');
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleRetry = () => {
        setIsRetrying(true);
        setRetryCount(c => c + 1);
        setTimeout(() => {
            if (navigator.onLine) {
                window.location.reload();
            } else {
                setIsRetrying(false);
            }
        }, 2000);
    };

    const handleGoHome = () => {
        window.location.href = import.meta.env.BASE_URL || '/mt.bau/';
    };

    return (
        <div className="offline-page" dir="rtl">
            {/* Animated background particles */}
            <div className="offline-particles">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className={`offline-particle offline-particle-${i + 1}`} />
                ))}
            </div>

            <div className="offline-container">

                {/* Animated WiFi / no-signal illustration */}
                <div className="offline-illustration">
                    <div className="offline-wifi-wrap">
                        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" className="offline-svg">
                            {/* Ground */}
                            <ellipse cx="100" cy="148" rx="70" ry="8" fill="rgba(251,191,36,0.15)" />

                            {/* Character body */}
                            <g className="offline-character">
                                {/* Body */}
                                <rect x="78" y="90" width="44" height="50" rx="10" fill="#fbbf24" />
                                {/* Head */}
                                <circle cx="100" cy="78" r="22" fill="#fde68a" />
                                {/* Eyes */}
                                <circle cx="92" cy="76" r="3" fill="#1e293b" />
                                <circle cx="108" cy="76" r="3" fill="#1e293b" />
                                {/* Sad mouth */}
                                <path d="M 92 88 Q 100 84 108 88" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                                {/* Left arm */}
                                <rect x="60" y="95" width="18" height="10" rx="5" fill="#fbbf24" />
                                {/* Right arm */}
                                <rect x="122" y="95" width="18" height="10" rx="5" fill="#fbbf24" />
                                {/* Legs */}
                                <rect x="82" y="136" width="14" height="12" rx="5" fill="#f59e0b" />
                                <rect x="104" y="136" width="14" height="12" rx="5" fill="#f59e0b" />
                            </g>

                            {/* Broken WiFi arcs */}
                            <g className="offline-wifi-arcs">
                                {/* Outer arc - broken */}
                                <path d="M 48 50 Q 100 10 152 50" stroke="#ef4444" strokeWidth="5" fill="none"
                                    strokeLinecap="round" strokeDasharray="15 8" opacity="0.7" />
                                {/* Middle arc - broken */}
                                <path d="M 62 63 Q 100 33 138 63" stroke="#f97316" strokeWidth="5" fill="none"
                                    strokeLinecap="round" strokeDasharray="12 6" opacity="0.6" />
                                {/* Inner arc */}
                                <path d="M 76 76 Q 100 58 124 76" stroke="#eab308" strokeWidth="5" fill="none"
                                    strokeLinecap="round" strokeDasharray="8 5" opacity="0.5" />
                                {/* Dot */}
                                <circle cx="100" cy="88" r="5" fill="#ef4444" />
                            </g>

                            {/* X mark */}
                            <g className="offline-x-mark" transform="translate(155, 15)">
                                <circle cx="12" cy="12" r="14" fill="#ef4444" opacity="0.9" />
                                <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="3" strokeLinecap="round" />
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Text */}
                <div className="offline-text">
                    <h1 className="offline-title">لا يوجد اتصال بالإنترنت</h1>
                    <p className="offline-subtitle">
                        يبدو أن الاتصال انقطع. تحقق من اتصالك بالشبكة وحاول مجدداً{dots}
                    </p>
                </div>

                {/* Tips */}
                <div className="offline-tips">
                    <div className="offline-tip">
                        <span className="offline-tip-icon">📶</span>
                        <span>تحقق من اتصالك بالـ WiFi أو البيانات</span>
                    </div>
                    <div className="offline-tip">
                        <span className="offline-tip-icon">✈️</span>
                        <span>تأكد من إيقاف وضع الطيران</span>
                    </div>
                    <div className="offline-tip">
                        <span className="offline-tip-icon">🔄</span>
                        <span>أعد تشغيل الراوتر إذا استمرت المشكلة</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="offline-actions">
                    <button
                        className={`offline-btn-retry ${isRetrying ? 'offline-btn-retrying' : ''}`}
                        onClick={handleRetry}
                        disabled={isRetrying}
                    >
                        {isRetrying ? (
                            <>
                                <span className="offline-spinner" />
                                جاري إعادة الاتصال...
                            </>
                        ) : (
                            <>
                                🔄 إعادة المحاولة
                                {retryCount > 0 && <span className="offline-retry-count">({retryCount})</span>}
                            </>
                        )}
                    </button>
                    <button className="offline-btn-home" onClick={handleGoHome}>
                        🏠 الصفحة الرئيسية
                    </button>
                </div>

                {/* Footer note */}
                <p className="offline-note">
                    مكانك الجامعي يدعم العمل offline — بعض المحتوى قد يكون محفوظاً لديك 💾
                </p>
            </div>
        </div>
    );
};

export default Offline;
