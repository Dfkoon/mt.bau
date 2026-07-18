import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

    useEffect(() => {
        // Phase 1: fade-in (0 → 0.6s)
        const holdTimer = setTimeout(() => setPhase('hold'), 600);
        // Phase 2: hold (0.6s → 2.4s)
        const outTimer = setTimeout(() => setPhase('out'), 2400);
        // Phase 3: fade-out done → remove (2.4s → 3s)
        const doneTimer = setTimeout(() => onFinish(), 3050);

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
                <p className="splash-word">makanak</p>
                <span className="splash-tagline">منصتك الجامعية</span>
            </div>
        </div>
    );
};

export default SplashScreen;
