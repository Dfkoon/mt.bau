import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Ballpit from '../components/Ballpit';
import CountUp from '../components/CountUp';
import './HeroSection.css';

const HeroSection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [ballCount, setBallCount] = useState(75);

    useEffect(() => {
        const handleResize = () => {
            setBallCount(window.innerWidth < 768 ? 35 : 75);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section id="hero" className="hero-section">
            <div className="hero-background">
                <div className="flag-wave-overlay">
                    <svg className="laser-flag" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                        {/* Red Laser Chevron */}
                        <path className="laser-line laser-red" d="M 0 0 L 500 250 L 0 500 Z" />

                        {/* TOP edge of flag - enters top-left corner of triangle */}
                        <path className="laser-line laser-black" d="M 0 0 Q 300 30, 600 10 T 1000 0" fill="none" />

                        {/* Divider: black/white — starts at triangle edge at y=166 → x=332 */}
                        <path className="laser-line laser-white" d="M 332 166 Q 600 146, 800 166 T 1000 166" fill="none" />

                        {/* Divider: white/green — starts at triangle edge at y=333 → x=334 */}
                        <path className="laser-line laser-green" d="M 334 333 Q 600 353, 800 333 T 1000 333" fill="none" />

                        {/* BOTTOM edge of flag - enters bottom-left corner of triangle */}
                        <path className="laser-line laser-black" d="M 0 500 Q 300 470, 600 490 T 1000 500" fill="none" />

                        {/* White Glowing Star (7-pointed star inside chevron) */}
                        <path className="laser-line laser-star" d="M 166 185 L 176 215 L 206 203 L 189 229 L 216 245 L 185 248 L 189 279 L 166 256 L 144 279 L 148 248 L 117 245 L 144 229 L 127 203 L 157 215 Z" />
                    </svg>
                </div>
                <div className="ballpit-wrapper">
                    <Ballpit
                        count={ballCount}
                        gravity={0.4}
                        friction={0.99}
                        wallBounce={0.95}
                        followCursor={true}
                        colors={['#000000', '#ffffff', '#007a3d', '#ce1126']}
                    />
                </div>
                <div className="overlay"></div>
            </div>

            <div className="hero-content animate-fade">
                <div className="title-frame">
                    <h1 className="hero-title">
                        {t('hero.title')} <span className="highlight">{t('hero.title.highlight')}</span>
                    </h1>
                </div>
                <p className="hero-subtitle">
                    {t('hero.subtitle')}
                </p>

                <div className="hero-btns">
                    <button className="btn-primary btn-lg" onClick={() => navigate('/materials')}>
                        {t('hero.btn.materials')}
                    </button>
                    <button className="btn-secondary btn-lg" onClick={() => navigate('/calendar')}>
                        {t('hero.btn.calendar')}
                    </button>
                </div>

                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-value">
                            +<CountUp to={100} duration={2.5} className="count-up-text" />
                        </span>
                        <span className="stat-label">{t('hero.stat.materials')}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">
                            +<CountUp to={500} duration={2.5} className="count-up-text" />
                        </span>
                        <span className="stat-label">{t('hero.stat.students')}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">24/7</span>
                        <span className="stat-label">{t('hero.stat.support')}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
