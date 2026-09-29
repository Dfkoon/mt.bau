import React, { useState, useEffect } from 'react';
import './Offline.css';
import cavemanGif from '../assets/caveman_404.gif';

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

    const displayCode = !isOnline ? "404" : code;
    const defaultTitle = !isOnline 
        ? "Look like you're lost" 
        : (code === "404" ? "Look like you're lost" : "Look like you're lost");
    
    const defaultSubtitle = !isOnline
        ? `the page you are looking for not available! Check your connection${dots}`
        : "the page you are looking for not available!";

    return (
        <section className="page_404">
            <div className="container_404">
                <div className="row_404">
                    <div className="col_404">
                        
                        {/* كارت 404 بالضبط كما في صورة الريفرنس */}
                        <div className="card_404">
                            <h1 className="text-center">{displayCode}</h1>
                            
                            <div 
                                className="four_zero_four_bg"
                                style={{ backgroundImage: `url(${cavemanGif})` }}
                            >
                            </div>

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
                                            {isRetrying ? "Retrying..." : "Retry Connection"}
                                        </button>
                                    )}

                                    {showHome && (
                                        <button 
                                            type="button" 
                                            onClick={handleGoHome} 
                                            className="link_404"
                                        >
                                            Go to Home
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Offline;
