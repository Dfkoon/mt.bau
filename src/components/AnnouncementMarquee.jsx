import { useLanguage } from '../contexts/LanguageContext';
import './AnnouncementMarquee.css';

const AnnouncementMarquee = () => {
    const { t } = useLanguage();
    
    const messages = [
        t('marquee.text1'),
        t('marquee.text2'),
        t('marquee.text3'),
        t('marquee.text4')
    ].filter(msg => msg && msg.trim() !== '');

    // Build a single row of items with separators
    const renderItems = () => messages.map((msg, index) => (
        <span key={index} className="marquee-item">
            {msg}
            <img src="/static_logo.png" alt="•" className="marquee-separator" />
        </span>
    ));

    return (
        <div className="marquee-container">
            <div className="marquee-label">{t('marquee.label')}</div>
            <div className="marquee-track-wrapper">
                {/* Two identical copies so the scroll loops perfectly without any gap */}
                <div className="marquee-track">
                    {renderItems()}
                    {renderItems()}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementMarquee;
