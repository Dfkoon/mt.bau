import React, { useState, useEffect } from 'react';

const MAINTENANCE_END = new Date('2026-08-07T13:00:00+03:00');

function getTimeLeft() {
  const now = new Date();
  const diff = MAINTENANCE_END - now;
  if (diff <= 0) return null;
  const h = Math.floor(diff / 1000 / 3600);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { h, m, s };
}

export default function MaintenanceBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
      if (!t) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (dismissed) return null;
  if (!timeLeft) return null; // hide after deadline passes

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}>
        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          border: '2.5px solid #e53e3e',
          boxShadow: '0 24px 60px rgba(229,62,62,0.18), 0 4px 24px rgba(0,0,0,0.12)',
          padding: '40px 36px 32px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          direction: 'rtl',
          fontFamily: "'Tajawal', 'Segoe UI', sans-serif",
          animation: 'mbPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {/* Icon */}
          <div style={{ fontSize: '64px', marginBottom: '12px', lineHeight: 1 }}>🛠️</div>

          {/* Title */}
          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#1a1a2e',
            margin: '0 0 10px',
            letterSpacing: '-0.5px',
          }}>
            الموقع تحت الصيان
          </h2>

          {/* Subtitle */}
          <p style={{
            color: '#555',
            fontSize: '15px',
            lineHeight: 1.7,
            margin: '0 0 24px',
          }}>
            نعمل الآن على تحديث الموقع وإضاف ميزات جديد.
            <br />
            سنعود غداً <strong>الجمع</strong> الساع <strong>1:00 الظهر</strong> 🚀
          </p>

          {/* Countdown */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '28px',
          }}>
            {[
              { label: 'ساع', val: pad(timeLeft.h) },
              { label: 'دقيق', val: pad(timeLeft.m) },
              { label: 'ثاني', val: pad(timeLeft.s) },
            ].map(({ label, val }) => (
              <div key={label} style={{
                background: 'linear-gradient(135deg, #fff0f0, #ffe0e0)',
                border: '1.5px solid #f8b4b4',
                borderRadius: '14px',
                padding: '12px 16px',
                minWidth: '72px',
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#c53030',
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily: 'monospace',
                }}>
                  {val}
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #fff5f5, #fed7d7)',
            color: '#c53030',
            border: '1.5px solid #fc8181',
            borderRadius: '50px',
            padding: '8px 24px',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '20px',
          }}>
            🔧 تحت الصيان والتحديث
          </div>

          {/* Dismiss button */}
          <br />
          <button
            onClick={() => setDismissed(true)}
            style={{
              marginTop: '8px',
              background: 'none',
              border: '1.5px solid #ddd',
              borderRadius: '10px',
              padding: '8px 20px',
              color: '#999',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#aaa'; e.target.style.color = '#555'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#ddd'; e.target.style.color = '#999'; }}
          >
            تصفح الموقع على مسؤوليتك
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap');
        @keyframes mbPopIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
