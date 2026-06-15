import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedLogo from './AnimatedLogo';
import './Footer.css';

const Footer = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const location = useLocation();

    // Secret coordinator gateway states
    const [showGatewayInput, setShowGatewayInput] = useState(false);
    const [gatewayCode, setGatewayCode] = useState('');
    const [gatewayError, setGatewayError] = useState(false);

    const handleGatewaySubmit = (e) => {
        e.preventDefault();
        if (gatewayCode.trim() === 'makanak2025') {
            // Success: dispatch custom event to open coordinator login modal
            window.dispatchEvent(new CustomEvent('open-staff-login'));
            setGatewayCode('');
            setShowGatewayInput(false);
            setGatewayError(false);
        } else {
            setGatewayError(true);
            setGatewayCode('');
            // Reset error state after animation completes
            setTimeout(() => setGatewayError(false), 800);
        }
    };

    const handleMarkDoubleClick = () => {
        setShowGatewayInput(prev => !prev);
        setGatewayCode('');
        setGatewayError(false);
    };

    return (
        <footer id="contact" className="footer">
            <div className="footer-container">
                <div className="footer-charity-banner">
                    <span className="charity-icon">🕊️</span>
                    <span className="charity-text">{t('footer.charity')}</span>
                </div>

                <div className="footer-top">
                    <div className="footer-brand">
                        <div style={{ marginBottom: '1rem' }}>
                            <img src="static_logo.png" alt="Logo" style={{ height: '80px', width: 'auto' }} />
                        </div>
                        <h2 className="logo-text"><span className="highlight">{t('hero.title.highlight')}</span></h2>
                        <p className="brand-desc">
                            {t('footer.brand.desc')}
                        </p>
                    </div>

                    <div className="footer-links-col">
                        <h3>{t('footer.quicklinks')}</h3>
                        <ul>
                            <li><a href="#hero">{t('nav.home')}</a></li>
                            <li><a href="#events">{t('nav.calendar')}</a></li>
                            <li><a href="#updates">{t('nav.materials')}</a></li>
                            <li><a href="#services">{t('nav.plans')}</a></li>
                            {location.pathname === '/exchange' && (
                                <li className="coordinator-footer-item">
                                    <div className="coordinator-trigger-row">
                                        <span className="coordinator-label">
                                            {isAr ? 'دخول المنسقين' : 'Coordinator Login'}
                                        </span>
                                        <span 
                                            className="coordinator-mark" 
                                            onDoubleClick={handleMarkDoubleClick}
                                            title={isAr ? 'انقر مرتين للوصول' : 'Double click to access'}
                                        >
                                            🔒
                                        </span>
                                    </div>
                                    {showGatewayInput && (
                                        <form onSubmit={handleGatewaySubmit} className="coordinator-gateway-form">
                                            <input
                                                type="password"
                                                className={`coordinator-gateway-input ${gatewayError ? 'shake-err' : ''}`}
                                                value={gatewayCode}
                                                onChange={e => setGatewayCode(e.target.value)}
                                                placeholder={isAr ? 'كود الدخول' : 'Access code'}
                                                autoComplete="new-password"
                                                autoFocus
                                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleGatewaySubmit(e); } }}
                                            />
                                            <button type="submit" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, overflow: 'hidden' }} tabIndex={-1} aria-hidden="true" />
                                        </form>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h3>{t('footer.contact')}</h3>
                        <ul>
                            <li><a href="mailto:makanak.bau.jo@gmail.com">makanak.bau.jo@gmail.com</a></li>
                            <li><a href="tel:0782934685">0782934685</a></li>
                            <li>السلط، الأردن</li>
                        </ul>
                    </div>

                    <div className="footer-social">
                        <h3>{t('footer.follow')}</h3>
                        <div className="social-icons">
                            <a href="https://web.facebook.com/share/g/1DPBxG5J9t/" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://t.me/introtoai1" target="_blank" rel="noopener noreferrer" className="social-icon telegram" aria-label="Telegram">
                                <i className="fab fa-telegram-plane"></i>
                            </a>
                            <a href="https://chat.whatsapp.com/Jkjv6AZyuCf8n3QYntFCX4" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp" aria-label="WhatsApp">
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>{t('footer.rights')}</p>
                    <div className="footer-bottom-links">
                        <a href="#/legal" className="legal-link">{t('nav.legal')}</a>
                    </div>
                    <div className="developer-tag">{t('footer.dev')}</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
