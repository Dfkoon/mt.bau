import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './ThemeLanguageToggle.css';

const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
);

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
);

const ThemeLanguageToggle = () => {
    const { theme, setTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();

    const themes = [
        { id: 'light', icon: <SunIcon />, label: { ar: 'أبيض', en: 'White Mode' } },
        { id: 'dark', icon: <MoonIcon />, label: { ar: 'أسود', en: 'Black Mode' } }
    ];

    const cycleTheme = () => {
        const currentIndex = themes.findIndex(t => t.id === theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex].id);
    };

    const currentThemeData = themes.find(t => t.id === theme) || themes[0];

    return (
        <div className="toggle-controls">
            {/* Theme Toggle */}
            <button
                className={`nav-toggle-btn theme-toggle ${theme}`}
                onClick={cycleTheme}
                aria-label="Cycle theme"
            >
                <div className="toggle-icon-container">
                    {currentThemeData.icon}
                </div>
                <span className="tooltip-text">
                    {language === 'ar' ? currentThemeData.label.ar : currentThemeData.label.en}
                </span>
            </button>

            {/* Language Toggle */}
            <button
                className="nav-toggle-btn language-toggle"
                onClick={toggleLanguage}
                aria-label="Toggle language"
            >
                <div className="toggle-icon-container">
                    {language === 'ar' ? (
                        <span className="lang-text">EN</span>
                    ) : (
                        <span className="lang-text ar-font">ع</span>
                    )}
                </div>
            </button>
        </div>
    );
};

export default ThemeLanguageToggle;
