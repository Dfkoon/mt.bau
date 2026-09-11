import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo';
import './Footer.css';

const Footer = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

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
                            <li><Link to="/">{t('nav.home')}</Link></li>
                            <li><Link to="/calendar">{t('nav.calendar')}</Link></li>
                            <li><Link to="/materials">{t('nav.materials')}</Link></li>
                            <li><Link to="/plans">{t('nav.plans')}</Link></li>
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
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            </a>
                            <a href="https://t.me/introtoai1" target="_blank" rel="noopener noreferrer" className="social-icon telegram" aria-label="Telegram">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.147l3.465 1.198 1.308 4.09a1.125 1.125 0 0 0 1.905.374l1.93-2.066 3.799 2.795a2.25 2.25 0 0 0 3.53-1.37l2.751-15.75a2.25 2.25 0 0 0-1.292-2.133zM9.75 15.938l-.826 2.58-.63-1.97 5.793-5.538-4.337 4.928zm1.687 1.77.434-1.355 1.023.753-1.457.602zm4.47.537-3.799-2.795 5.923-6.736-2.124 9.531z"/></svg>
                            </a>
                            <a href="https://chat.whatsapp.com/Jkjv6AZyuCf8n3QYntFCX4" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp" aria-label="WhatsApp">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>{t('footer.rights')}</p>
                    <div className="footer-bottom-links">
                        <Link to="/legal" className="legal-link">{t('nav.legal')}</Link>
                    </div>
                    <div className="developer-tag">{t('footer.dev')}</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
