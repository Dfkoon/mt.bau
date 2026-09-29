import React, { useState, useEffect } from 'react';
import './Offline.css';

const Offline = ({ code = "404", title, subtitle, showHome = true }) => {
    const [dots, setDots] = useState('');
    const [isRetrying, setIsRetrying] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnlineStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => {
            if (navigator.onLine) {
                window.location.reload();
            } else {
                setIsRetrying(false);
            }
        }, 1500);
    };

    const handleGoHome = () => {
        window.location.hash = '#/';
    };

    // نحدد النصوص الافتراضية إذا ما تم تمريرها
    const displayCode = !isOnline ? "503" : code;
    const defaultTitle = !isOnline 
        ? "يبدو أنك فقدت الاتصال بالإنترنت!" 
        : (code === "404" ? "Look like you're lost" : "حدث خطأ غير متوقع");
    
    const defaultSubtitle = !isOnline
        ? `يرجى التحقق من اتصالك بالشبكة وإعادة المحاولة${dots}`
        : "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.";

    return (
        <section className="page_404" dir="rtl">
            <div className="container_404">
                <div className="row_404">
                    <div className="col_404">
                        
                        {/* الرقم الكبير في الخلفية */}
                        <div className="four_zero_four_bg">
                            <h1 className="text-center">{displayCode}</h1>
                            {/* gif / صورة الرجل الحجري المتحرك الشهير في تصميم 404 */}
                            <div className="caveman_character">
                                <div className="caveman_legs"></div>
                            </div>
                        </div>

                        {/* صندوق المحتوى والأزرار */}
                        <div className="content_box_404">
                            <h3 className="h2">
                                {title || defaultTitle}
                            </h3>

                            <p>{subtitle || defaultSubtitle}</p>

                            <div className="actions_404">
                                {!isOnline && (
                                    <button 
                                        type="button"
                                        onClick={handleRetry} 
                                        className="retry_link"
                                        disabled={isRetrying}
                                    >
                                        {isRetrying ? "جاري المحاولة..." : "إعادة المحاولة 🔄"}
                                    </button>
                                )}

                                {showHome && (
                                    <button 
                                        type="button" 
                                        onClick={handleGoHome} 
                                        className="link_404"
                                    >
                                        الذهاب للرئيسية 🏠
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Offline;
