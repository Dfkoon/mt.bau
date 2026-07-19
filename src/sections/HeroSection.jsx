import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Ballpit from '../components/Ballpit';
import CountUp from '../components/CountUp';
import { getTotalStudentVisits } from '../services/analyticsService';
import './HeroSection.css';

const HeroSection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [ballCount, setBallCount] = useState(75);
    const [heroVisitorsCount, setHeroVisitorsCount] = useState(Number(import.meta.env.VITE_HERO_VISITORS_COUNT ?? 730));
    const heroMaterialsCount = Number(import.meta.env.VITE_HERO_MATERIALS_COUNT ?? 100);

    useEffect(() => {
        const handleResize = () => {
            setBallCount(window.innerWidth < 768 ? 35 : 75);
        };

        const loadVisitorCount = async () => {
            const count = await getTotalStudentVisits();
            if (count > 0) {
                setHeroVisitorsCount(count);
            }
        };

        loadVisitorCount();

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section id="hero" className="hero-section">
            <div className="hero-background">
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
                    <span className="frame-corner frame-bl" />
                    <span className="frame-corner frame-br" />
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
                            +<CountUp to={heroMaterialsCount} duration={2.5} className="count-up-text" />
                        </span>
                        <span className="stat-label">{t('hero.stat.materials')}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">
                            +<CountUp to={heroVisitorsCount} duration={2.5} className="count-up-text" />
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
