import React, { useState, useEffect } from 'react';

const BookingCountdown = ({ isAr }) => {
    const targetDate = new Date('2026-10-04T10:00:00');
    
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '1.5rem', margin: '2rem 0', textAlign: 'center' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '800' }}>
                {isAr ? 'تم تأجيل عملية حجز المواد إلى الأحد القادم بتاريخ 4/10/2026 الساعة العاشرة صباحاً' : 'Material booking is postponed to next Sunday 4/10/2026 at 10:00 AM'}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#b91c1c' }}>
                <div style={{ background: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <span>{timeLeft.days}</span>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{isAr ? 'يوم' : 'Days'}</div>
                </div>
                <div style={{ background: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <span>{timeLeft.hours}</span>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{isAr ? 'ساعة' : 'Hours'}</div>
                </div>
                <div style={{ background: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <span>{timeLeft.minutes}</span>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{isAr ? 'دقيقة' : 'Minutes'}</div>
                </div>
                <div style={{ background: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <span>{timeLeft.seconds}</span>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{isAr ? 'ثانية' : 'Seconds'}</div>
                </div>
            </div>
        </div>
    );
};

export default BookingCountdown;
