import React, { useState, useEffect } from 'react';

const InstallPWAButton = ({ isAr = true }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(iosDevice);

        // Check standalone mode
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        setIsStandalone(isStandaloneMode);

        // Listen for browser install prompt
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
            setShowGuideModal(true);
        }
    };

    if (isStandalone || dismissed) return null;

    return (
        <>
            {/* Sleek Premium Floating Pill */}
            <div style={{
                position: 'fixed',
                bottom: '1.4rem',
                left: isAr ? '1.4rem' : 'auto',
                right: isAr ? 'auto' : '1.4rem',
                zIndex: 99990,
                direction: isAr ? 'rtl' : 'ltr',
                animation: 'pwaSlideUp 0.4s ease-out'
            }}>
                <style>{`
                    @keyframes pwaSlideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.95), rgba(18, 38, 70, 0.95))',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1.5px solid rgba(251, 191, 36, 0.55)',
                    borderRadius: '50px',
                    padding: '6px 12px 6px 16px',
                    boxShadow: '0 10px 35px rgba(0,0,0,0.5), 0 0 20px rgba(251, 191, 36, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <button
                        onClick={handleClick}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            padding: '4px 0',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span style={{
                            fontSize: '1.2rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(251, 191, 36, 0.15)',
                            padding: '4px',
                            borderRadius: '50%'
                        }}>
                            📲
                        </span>
                        <span style={{ color: '#fbbf24', letterSpacing: '0.02em' }}>
                            {isAr ? 'التثبيت وإنشاء اختصار' : 'Install & Create Shortcut'}
                        </span>
                    </button>

                    <button
                        onClick={() => setDismissed(true)}
                        title={isAr ? 'إغلاق' : 'Close'}
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            color: 'rgba(255,255,255,0.5)',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Step-by-Step Guide Modal */}
            {showGuideModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.2rem',
                    direction: isAr ? 'rtl' : 'ltr'
                }} onClick={() => setShowGuideModal(false)}>
                    <div style={{
                        background: 'linear-gradient(145deg, #0a1727, #132742)',
                        border: '1.5px solid rgba(251,191,36,0.5)',
                        borderRadius: '24px',
                        padding: '1.8rem',
                        maxWidth: '420px',
                        width: '100%',
                        color: '#fff',
                        boxShadow: '0 25px 70px rgba(0,0,0,0.8), 0 0 30px rgba(251,191,36,0.15)',
                        animation: 'modalPop 0.3s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        <style>{`
                            @keyframes modalPop {
                                from { opacity: 0; transform: scale(0.92); }
                                to { opacity: 1; transform: scale(1); }
                            }
                        `}</style>

                        {/* Title */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ fontSize: '1.6rem' }}>📲</span>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fbbf24', fontWeight: 800 }}>
                                    {isAr ? 'التثبيت وإنشاء اختصار للتطبيق' : 'Install & Add Shortcut'}
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

                        {/* Instructions matching Chrome / Safari exact menus */}
                        {isIOS ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
                                    {isAr ? 'لتثبيت التطبيق على جهاز الآيفون (iPhone/iPad):' : 'To install on iPhone/iPad:'}
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                        <span style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 800, width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>1</span>
                                        <span>{isAr ? 'اضغط على زر المشاركة في أسفل Safari' : 'Tap Share button in Safari'} <strong style={{ color: '#fbbf24' }}>(⎋)</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <span style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 800, width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>2</span>
                                        <span>{isAr ? 'اختر "إضافة إلى الشاشة الرئيسية"' : 'Select "Add to Home Screen"'} <strong style={{ color: '#fbbf24' }}>(➕)</strong></span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
                                    {isAr ? 'خطوات التثبيت المباشرة من متصفح كروم / أندرويد:' : 'Direct installation steps for Chrome:'}
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                        <span style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 800, width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>1</span>
                                        <span>{isAr ? 'اضغط على نقاط القائمة الثلاث أعلى المتصفح' : 'Tap menu dots'} <strong style={{ color: '#fbbf24' }}>(⋮)</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <span style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 800, width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>2</span>
                                        <span>{isAr ? 'اختر الخيار:' : 'Choose:'} <strong style={{ color: '#55efc4' }}>"التثبيت وإنشاء اختصار" 📲</strong></span>
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
                                padding: '0.75rem',
                                borderRadius: '14px',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(251,191,36,0.3)'
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
