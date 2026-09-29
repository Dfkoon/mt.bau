import React, { useState, useEffect } from 'react';
import Offline from '../pages/Offline';

/**
 * GlobalOfflineScreen:
 * يراقب حالة الإنترنت بالجهاز/المتصفح مباشرة وبشكل فوري:
 * أول ما ينقطع النت، يستبدل الشاشة الحالية بشاشة رجل الكهف كاملة بالعربي
 * وبمجرد عودة النت، تعود الصفحة لحالتها الطبيعية فوراً!
 */
const GlobalOfflineScreen = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOnline) {
        return (
            <Offline 
                code="انقطع الاتصال"
                title="يبدو أنك فقدت الاتصال بالإنترنت!"
                subtitle="تعذر الوصول إلى الموقع، يرجى التحقق من اتصالك بالشبكة وإعادة المحاولة."
                showHome={false}
            />
        );
    }

    return children;
};

export default GlobalOfflineScreen;
