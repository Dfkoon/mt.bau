import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const PageTitleUpdater = () => {
    const location = useLocation();
    const { t, language } = useLanguage();

    useEffect(() => {
        const path = location.pathname;
        let titleKey = 'nav.home'; // Default to home

        // Map paths to translation keys
        if (path === '/') titleKey = 'nav.home';
        else if (path === '/materials') titleKey = 'nav.materials';
        else if (path === '/plans') titleKey = 'nav.plans';
        else if (path.startsWith('/quiz')) titleKey = 'nav.quiz';
        else if (path === '/calendar') titleKey = 'nav.calendar';
        else if (path === '/grading') titleKey = 'nav.grading';
        else if (path === '/exchange' || path === '/exchange-admin') titleKey = 'nav.exchange';
        else if (path === '/news') titleKey = 'nav.updates';

        const pageTitle = t(titleKey);
        const siteName = language === 'ar' ? 'مكانك الجامعي' : 'Makanak Al-Jami\'i';

        document.title = `${pageTitle} | ${siteName}`;
    }, [location, language, t]);

    return null;
};

export default PageTitleUpdater;
