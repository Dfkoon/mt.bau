import React, { useState, useEffect } from 'react';

const InstallPWAButton = ({ isAr = true }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(iosDevice);

        // Check if already running in standalone mode (installed)
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        setIsStandalone(isStandaloneMode);

        // Listen for standard PWA install prompt on Android/Chrome/Edge
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            setIsStandalone(true);
            setDeferredPrompt(null);
        });

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsStandalone(true);
            }
            setDeferredPrompt(null);
        } else {
            // Show custom step-by-step guide for iOS or desktop where prompt is native
            setShowGuideModal(true);
        }
    };

    // Don't show button if already running inside the installed PWA
    if (isStandalone) return null;

    return (
        <>
            {/* Floating Install Pill Button */}
            <div style={{
                position: 'fixed',
                bottom: '1.2rem',
                left: isAr ? '1.2rem' : 'auto',
                right: isAr ? 'auto' : '1.2rem',
                zIndex: 9990,
                direction: isAr ? 'rtl' : 'ltr'
            }}>
                <button
                    onClick={handleClick}
                    style={{
                        background: 'linear-gradient(135deg, #102a45, #1e3a8a)',
                        border: '1.5px solid rgba(251, 191, 36, 0.6)',
                        color: '#fbbf24',
                        padding: '0.6rem 1.1rem',
                        borderRadius: '30px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(251, 191, 36, 0.25)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(251, 191, 36, 0.4)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(251, 191, 36, 0.25)';
                    }}
                >
                    <span style={{ fontSize: '1.1rem', animation: 'bouncePwa 2s infinite' }}>📲</span>
                    <span>{isAr ? 'ثبّت التطبيق' : 'Install App'}</span>
                </button>
                <style>{`
                    @keyframes bouncePwa {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                `}</style>
            </div>

            {/* Guide Modal for iOS or manual install instructions */}
            {showGuideModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.2rem',
                    direction: isAr ? 'rtl' : 'ltr'
                }} onClick={() => setShowGuideModal(false)}>
                    <div style={{
                        background: 'linear-gradient(145deg, #0d1b2a, #162a45)',
                        border: '1px solid rgba(251,191,36,0.4)',
                        borderRadius: '24px',
                        padding: '1.8rem',
                        maxWidth: '400px',
                        width: '100%',
                        color: '#fff',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                        animation: 'modalPop 0.3s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        <style>{`
                            @keyframes modalPop {
                                from { opacity: 0; transform: scale(0.9); }
                                to { opacity: 1; transform: scale(1); }
                            }
                        `}</style>

                        {/* Title */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ fontSize: '1.6rem' }}>📲</span>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fbbf24', fontWeight: 800 }}>
                                    {isAr ? 'طريقة تثبيت مكانك الجامعي' : 'How to Install Makanak App'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowGuideModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    color: '#fff',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content Instructions */}
                        {isIOS ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
                                    {isAr ? 'لتثبيت التطبيق على جهاز الآيفون (iPhone/iPad):' : 'To install on iPhone/iPad:'}
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                                        <span style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 800, width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
                                        <span>{isAr ? 'اضغط على زر المشاركة أسفل المتصفح Safari' : 'Tap the Share button in Safari'} <strong>(⎋)</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 800, width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
                                        <span>{isAr ? 'اختر "إضافة إلى الشاشة الرئيسية"' : 'Select "Add to Home Screen"'} <strong>(➕)</strong></span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
                                    {isAr ? 'لتثبيت التطبيق على متصفح أندرويد أو الكمبيوتر:' : 'To install on Android or Desktop:'}
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                                        <span style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 800, width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
                                        <span>{isAr ? 'اضغط على قائمة خيارات المتصفح' : 'Click the browser menu'} <strong>(⋮ أو 💻 في شريط العنوان)</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 800, width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
                                        <span>{isAr ? 'اختر "تثبيت التطبيق" أو "Install App"' : 'Select "Install App" or "Add to Home Screen"'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowGuideModal(false)}
                            style={{
                                width: '100%',
                                marginTop: '1.4rem',
                                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                border: 'none',
                                color: '#1a1a1a',
                                padding: '0.7rem',
                                borderRadius: '12px',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}
                        >
                            {isAr ? 'فهمت ذلك 👍' : 'Got it 👍'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstallPWAButton;
