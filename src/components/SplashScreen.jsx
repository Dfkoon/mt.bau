import React, { useState, useEffect, useRef } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [phase, setPhase] = useState('in');
    const [filled, setFilled] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        // ── Stroke-draw animation ──────────────────────
        const initStroke = () => {
            const el = textRef.current;
            if (!el) return;

            let len = 0;
            try { len = el.getComputedTextLength(); } catch (e) {}

            if (len <= 0) {
                // Font not ready yet — retry
                setTimeout(initStroke, 80);
                return;
            }

            el.style.strokeDasharray  = `${len}`;
            el.style.strokeDashoffset = `${len}`;

            // Two rAFs so the initial dashoffset is painted before we add transition
            requestAnimationFrame(() => requestAnimationFrame(() => {
                if (!textRef.current) return;
                textRef.current.style.transition =
                    'stroke-dashoffset 2.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
                textRef.current.style.strokeDashoffset = '0';

                // After stroke finishes → fade in fill
                setTimeout(() => setFilled(true), 2900);
            }));
        };

        // Wait for Sacramento font to be ready
        if (document.fonts?.ready) {
            document.fonts.ready.then(() => setTimeout(initStroke, 120));
        } else {
            setTimeout(initStroke, 500);
        }

        // ── Phase timers (30 s total) ──────────────────
        const holdTimer = setTimeout(() => setPhase('hold'), 600);
        const outTimer  = setTimeout(() => setPhase('out'),  29000);
        const doneTimer = setTimeout(() => onFinish(),       29700);

        return () => {
            clearTimeout(holdTimer);
            clearTimeout(outTimer);
            clearTimeout(doneTimer);
        };
    }, [onFinish]);

    return (
        <div className={`splash-root splash-${phase}`}>
            {/* Animated orbs */}
            <div className="splash-orb splash-orb-1" />
            <div className="splash-orb splash-orb-2" />
            <div className="splash-orb splash-orb-3" />

            {/* Glass card */}
            <div className="splash-glass">
                <svg
                    className="splash-svg"
                    viewBox="0 0 540 140"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#ffffff" />
                            <stop offset="30%"  stopColor="#f8cdd8" />
                            <stop offset="55%"  stopColor="#e84080" />
                            <stop offset="75%"  stopColor="#f8cdd8" />
                            <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>

                        {/* Animated shimmer gradient */}
                        <linearGradient id="sgAnim" x1="-100%" y1="0%" x2="100%" y2="0%"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0%"   stopColor="#ffffff" />
                            <stop offset="40%"  stopColor="#f8cdd8" />
                            <stop offset="60%"  stopColor="#e84080" />
                            <stop offset="100%" stopColor="#ffffff" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                from="-540 0"
                                to="540 0"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </linearGradient>
                    </defs>

                    <text
                        ref={textRef}
                        x="270"
                        y="108"
                        textAnchor="middle"
                        fontFamily="'Sacramento', cursive"
                        fontSize="96"
                        /* fill changes from none → gradient once stroke drawing finishes */
                        fill={filled ? 'url(#sgAnim)' : 'none'}
                        stroke="url(#sg)"
                        strokeWidth="1.2"
                        style={{
                            transition: filled ? 'fill 0.5s ease' : 'none',
                            paintOrder: 'stroke fill',
                        }}
                    >
                        makanak
                    </text>
                </svg>

                <span className="splash-tagline">منصتك الجامعية</span>
            </div>
        </div>
    );
};

export default SplashScreen;
