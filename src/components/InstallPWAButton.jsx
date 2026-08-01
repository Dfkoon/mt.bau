import React, { useState, useEffect } from 'react';

const InstallPWAButton = ({ isAr }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [installed, setInstalled] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Don't show if already dismissed recently
        const lastDismissed = localStorage.getItem('pwa_install_dismissed');
        if (lastDismissed) {
            const daysSince = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
            if (daysSince < 7) {
                setDismissed(true);
                return;
            }
        }

        // Check if already in standalone mode (already installed)
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            setInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Listen for appinstalled
        window.addEventListener('appinstalled', () => {
            setInstalled(true);
            setShowBanner(false);
        });

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstalled(true);
            setShowBanner(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        setDismissed(true);
        localStorage.setItem('pwa_install_dismissed', Date.now().toString());
    };

    if (installed || dismissed || !showBanner) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: 'min(420px, 95vw)',
            background: 'linear-gradient(135deg, rgba(15, 25, 50, 0.97), rgba(20, 35, 70, 0.97))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            borderRadius: '18px',
            padding: '1.1rem 1.4rem',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            direction: isAr ? 'rtl' : 'ltr',
            animation: 'slideUpFade 0.4s ease-out'
        }}>
            <style>{`
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>

            {/* Icon */}
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                overflow: 'hidden',
                flexShrink: 0,
                background: 'rgba(251,191,36,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem'
            }}>
                📱
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '0.2rem' }}>
                    {isAr ? '📲 ثبّت مكانك الجامعي' : '📲 Install Makanak'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>
                    {isAr
                        ? 'احصل على وصول فوري بدون متصفح من شاشة هاتفك'
                        : 'Get instant access from your home screen, no browser needed'}
                </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                <button
                    onClick={handleInstall}
                    style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        color: '#1a1a1a',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.45rem 1rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        boxShadow: '0 2px 8px rgba(251,191,36,0.4)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isAr ? '✅ ثبّت الآن' : '✅ Install'}
                </button>
                <button
                    onClick={handleDismiss}
                    style={{
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.4)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px',
                        padding: '0.35rem 0.8rem',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        transition: 'color 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                    {isAr ? 'لاحقاً' : 'Later'}
                </button>
            </div>
        </div>
    );
};

export default InstallPWAButton;
