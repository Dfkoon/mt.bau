import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import './SecureGateway.css';

// ─── 2FA (TOTP) Helpers ───────────────────────────────────────────────────
function base32tohex(base32) {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    let hex = "";
    base32 = base32.replace(/=+$/, "");
    for (let i = 0; i < base32.length; i++) {
        const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        if (val === -1) throw new Error("Invalid Base32 character");
        bits += val.toString(2).padStart(5, '0');
    }
    for (let i = 0; i + 4 <= bits.length; i += 4) {
        const chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16);
    }
    return hex;
}

function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let c = 0; c < hex.length; c += 2) {
        bytes[c / 2] = parseInt(hex.substr(c, 2), 16);
    }
    return bytes;
}

async function getTOTPToken(secret, timeOffset = 0) {
    try {
        const secretClean = secret.replace(/\s+/g, '').toUpperCase();
        const keyBytes = hexToBytes(base32tohex(secretClean));

        const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "HMAC", hash: { name: "SHA-1" } },
            false,
            ["sign"]
        );

        const counter = Math.floor((Date.now() / 1000 + timeOffset) / 30);
        const counterBytes = new Uint8Array(8);
        let temp = counter;
        for (let i = 7; i >= 0; i--) {
            counterBytes[i] = temp & 0xff;
            temp = Math.floor(temp / 256);
        }

        const signature = await window.crypto.subtle.sign(
            "HMAC",
            cryptoKey,
            counterBytes
        );

        const digest = new Uint8Array(signature);
        const offset = digest[digest.length - 1] & 0xf;

        const binary =
            ((digest[offset] & 0x7f) << 24) |
            ((digest[offset + 1] & 0xff) << 16) |
            ((digest[offset + 2] & 0xff) << 8) |
            (digest[offset + 3] & 0xff);

        const otp = binary % 1000000;
        return otp.toString().padStart(6, '0');
    } catch (e) {
        console.error("Error generating TOTP token:", e);
        return "";
    }
}

// ── CAPTCHA helpers ───────────────────────────────────────────────────
function generateCaptchaText() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let r = '';
    for (let i = 0; i < 5; i++) r += chars[Math.floor(Math.random() * chars.length)];
    return r;
}

function drawCaptchaCanvas(canvas, text) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.fillStyle = isDark ? '#1a1f2e' : '#f0f2f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Noise lines
    for (let i = 0; i < 7; i++) {
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
    // Noise dots
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }
    const fontSize = Math.floor(canvas.height * 0.55);
    ctx.font = `bold ${fontSize}px Courier New, monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const colors = isDark
        ? ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#ff9ff3']
        : ['#d63031', '#0984e3', '#00b894', '#e17055', '#6c5ce7', '#e84393'];
    const spacing = canvas.width / (text.length + 1);
    for (let i = 0; i < text.length; i++) {
        ctx.save();
        ctx.fillStyle = colors[i % colors.length];
        const x = spacing * 0.85 + i * spacing + (Math.random() - 0.5) * 8;
        const y = canvas.height / 2 + (Math.random() - 0.5) * 6;
        ctx.translate(x, y);
        ctx.rotate((Math.random() - 0.5) * 0.38);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
    }
}

// ── Rate limiter (localStorage-based) ────────────────────────────────
const RATE_KEY = '_sgw_meta';
const MAX_ATTEMPTS = 4;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

function getRateMeta() {
    try {
        const raw = localStorage.getItem(RATE_KEY);
        if (!raw) return { attempts: 0, lockedUntil: 0 };
        return JSON.parse(raw);
    } catch { return { attempts: 0, lockedUntil: 0 }; }
}

function setRateMeta(data) {
    try { localStorage.setItem(RATE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function resetRateMeta() {
    try { localStorage.removeItem(RATE_KEY); } catch { /* ignore */ }
}

// ── Main Component ────────────────────────────────────────────────────
const SecureGateway = () => {
    const navigate = useNavigate();

    // Steps: 1 = Gateway Code, 2 = Username/Password, 3 = TOTP/2FA
    const [loginStep, setLoginStep] = useState(1);

    // Form inputs
    const [accessCode, setAccessCode] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [totpInput, setTotpInput] = useState('');

    // Captcha states
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const canvasRef = useRef(null);

    // Honeypot
    const [honeypot, setHoneypot] = useState('');

    // UI Feedback
    const [shake, setShake] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Rate Limiting
    const [attempts, setAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState(0);
    const [lockCountdown, setLockCountdown] = useState(0);

    // Global configurations loaded from Firestore
    const [systemSettings, setSystemSettings] = useState({});
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // ── Load system settings ──────────────────────────────────────────
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const snap = await getDoc(doc(db, 'system_configs', 'global_settings'));
                if (snap.exists()) {
                    setSystemSettings(snap.data());
                }
            } catch (err) {
                console.error("Failed to load gateway system settings:", err);
            } finally {
                setSettingsLoaded(true);
            }
        };
        fetchSettings();
    }, []);

    // ── CAPTCHA init ──────────────────────────────────────────────────
    const refreshCaptcha = useCallback(() => {
        const text = generateCaptchaText();
        setCaptchaText(text);
        setCaptchaInput('');
    }, []);

    useEffect(() => {
        refreshCaptcha();
    }, [refreshCaptcha]);

    useEffect(() => {
        if (captchaText && canvasRef.current) {
            drawCaptchaCanvas(canvasRef.current, captchaText);
        }
    }, [captchaText, loginStep]); // redraw when step changes

    // ── Rate limit init ───────────────────────────────────────────────
    useEffect(() => {
        const meta = getRateMeta();
        setAttempts(meta.attempts);
        setLockedUntil(meta.lockedUntil);
    }, []);

    // ── Lockout countdown timer ───────────────────────────────────────
    useEffect(() => {
        if (!lockedUntil || Date.now() >= lockedUntil) {
            setLockCountdown(0);
            return;
        }
        const tick = () => {
            const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
            if (remaining <= 0) {
                setLockCountdown(0);
                setLockedUntil(0);
                setAttempts(0);
                resetRateMeta();
            } else {
                setLockCountdown(remaining);
            }
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [lockedUntil]);

    // ── Shaker helper ─────────────────────────────────────────────────
    const triggerShake = (msg) => {
        setErrorMsg(msg);
        setShake(true);
        setTimeout(() => setShake(false), 600);
    };

    // ── Failed attempts recorder ──────────────────────────────────────
    const recordFailedAttempt = (msg) => {
        const meta = getRateMeta();
        const newAttempts = meta.attempts + 1;
        const newMeta = {
            attempts: newAttempts,
            lockedUntil: newAttempts >= MAX_ATTEMPTS
                ? Date.now() + LOCKOUT_MS
                : meta.lockedUntil || 0,
        };
        setRateMeta(newMeta);
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
            setLockedUntil(newMeta.lockedUntil);
            triggerShake('تم تجاوز الحد الأقصى للمحاولات. الوصول مقفل لمدة 5 دقائق.');
        } else {
            triggerShake(`${msg} (محاولة ${newAttempts} من ${MAX_ATTEMPTS})`);
        }
    };

    // ── Step 1: Gateway Code validation ──────────────────────────────
    const handleStep1Submit = async (e) => {
        e.preventDefault();
        if (honeypot.trim() !== '') return;

        const meta = getRateMeta();
        if (meta.lockedUntil && Date.now() < meta.lockedUntil) return;

        if (!settingsLoaded) return;

        setIsLoading(true);
        setErrorMsg('');

        await new Promise(r => setTimeout(r, 400 + Math.random() * 300));

        // Verify CAPTCHA
        if (captchaInput.trim().toUpperCase() !== captchaText) {
            setIsLoading(false);
            recordFailedAttempt('رمز التحقق غير صحيح. حاول مرة أخرى.');
            refreshCaptcha();
            return;
        }

        // Verify secret code
        const liveGatewayCode = systemSettings.secretGatewayCode || 'makanak2025';
        if (accessCode.trim() !== liveGatewayCode) {
            setIsLoading(false);
            recordFailedAttempt('كود الدخول غير صحيح.');
            refreshCaptcha();
            return;
        }

        // Gateway Code verified -> transition to Step 2
        resetRateMeta();
        setIsLoading(false);
        setLoginStep(2);
        setCaptchaInput('');
        refreshCaptcha();
    };

    // ── Step 2: Username & Password validation ───────────────────────
    const [pendingStaffKey, setPendingStaffKey] = useState('');
    const [pendingStaffTotpSecret, setPendingStaffTotpSecret] = useState('');

    const handleStep2Submit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        await new Promise(r => setTimeout(r, 400 + Math.random() * 300));

        // Verify Captcha
        if (captchaInput.trim().toUpperCase() !== captchaText) {
            setIsLoading(false);
            triggerShake('رمز التحقق غير صحيح.');
            refreshCaptcha();
            return;
        }

        const username = usernameInput.trim().toLowerCase();
        const password = passwordInput;

        const passwords = {
            admin: systemSettings.adminPassword || 'admin2024',
            ahmad: systemSettings.ahmadPassword || 'ahmad2024',
            sara: systemSettings.saraPassword || 'sara2024'
        };

        const staffUsersDynamic = {
            admin: { role: 'admin', nameAr: 'الأدمن', nameEn: 'Admin', gender: null },
            ahmad: { role: 'coordinator', nameAr: systemSettings.ahmadNameAr || 'أحمد', nameEn: systemSettings.ahmadNameEn || 'Ahmad', gender: 'male' },
            sara: { role: 'coordinator', nameAr: systemSettings.saraNameAr || 'سارة', nameEn: systemSettings.saraNameEn || 'Sara', gender: 'female' }
        };

        let matchedKey = null;
        const adminNameAr = 'الأدمن'.trim().toLowerCase();
        const ahmadNameAr = (systemSettings.ahmadNameAr || 'أحمد').trim().toLowerCase();
        const saraNameAr = (systemSettings.saraNameAr || 'سارة').trim().toLowerCase();

        if (username === 'admin' || username === adminNameAr || username === 'الأدمن') {
            matchedKey = 'admin';
        } else if (username === 'ahmad' || username === ahmadNameAr || username === 'أحمد') {
            matchedKey = 'ahmad';
        } else if (username === 'sara' || username === saraNameAr || username === 'سارة') {
            matchedKey = 'sara';
        }

        if (matchedKey && passwords[matchedKey] === password) {
            const user = staffUsersDynamic[matchedKey];
            
            // Get 2FA TOTP secret
            let totpSecret = '';
            if (matchedKey === 'admin') totpSecret = systemSettings.admin2faSecret || '';
            else if (matchedKey === 'ahmad') totpSecret = systemSettings.ahmad2faSecret || '';
            else if (matchedKey === 'sara') totpSecret = systemSettings.sara2faSecret || '';

            if (totpSecret) {
                setPendingStaffKey(matchedKey);
                setPendingStaffTotpSecret(totpSecret);
                setIsLoading(false);
                setLoginStep(3); // transition to Step 3 (2FA)
                setTotpInput('');
                return;
            } else {
                // No 2FA secret set -> Direct login (fallback)
                executeLogin(matchedKey, user);
            }
        } else {
            setIsLoading(false);
            triggerShake('اسم المستخدم أو كلمة المرور غير صحيحة.');
            refreshCaptcha();
        }
    };

    // ── Step 3: 2FA TOTP Validation ──────────────────────────────────
    const handleStep3Submit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        await new Promise(r => setTimeout(r, 400));

        if (!pendingStaffTotpSecret) {
            setIsLoading(false);
            return;
        }

        const codeCurrent = await getTOTPToken(pendingStaffTotpSecret, 0);
        const codePrev = await getTOTPToken(pendingStaffTotpSecret, -30);
        const codeNext = await getTOTPToken(pendingStaffTotpSecret, 30);

        const userVal = totpInput.trim();
        if (userVal === codeCurrent || userVal === codePrev || userVal === codeNext) {
            const staffUsersDynamic = {
                admin: { role: 'admin', nameAr: 'الأدمن', nameEn: 'Admin', gender: null },
                ahmad: { role: 'coordinator', nameAr: systemSettings.ahmadNameAr || 'أحمد', nameEn: systemSettings.ahmadNameEn || 'Ahmad', gender: 'male' },
                sara: { role: 'coordinator', nameAr: systemSettings.saraNameAr || 'سارة', nameEn: systemSettings.saraNameEn || 'Sara', gender: 'female' }
            };
            const user = staffUsersDynamic[pendingStaffKey];
            executeLogin(pendingStaffKey, user);
        } else {
            setIsLoading(false);
            triggerShake('رمز التحقق الثنائي غير صحيح.');
        }
    };

    // ── Login Finalization ───────────────────────────────────────────
    const executeLogin = async (username, user) => {
        try {
            // Sign in anonymously to Firebase Auth for security rules (non-blocking)
            try {
                const auth = getAuth();
                if (!auth.currentUser) {
                    await signInAnonymously(auth);
                }
            } catch (authErr) {
                console.warn('Anonymous Firebase auth failed (non-critical):', authErr.code || authErr);
            }

            // Write staff status to Firestore (non-blocking)
            const statusRef = doc(db, 'staff_status', username);
            setDoc(statusRef, {
                online: true,
                lastSeen: Date.now(),
                lastLogin: Date.now(),
                username: username,
                nameAr: user.nameAr,
                nameEn: user.nameEn,
                role: user.role
            }, { merge: true }).catch(err => {
                console.warn('Writing staff status to Firestore failed:', err);
            });

            // Store session
            sessionStorage.setItem('exchange_staff', JSON.stringify({ ...user, username }));

            setIsSuccess(true);
            setIsLoading(false);

            // Redirect based on role
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.hash = '/admin';
                } else {
                    window.location.hash = '/exchange';
                }
            }, 1200);
        } catch (err) {
            console.error("Login finalization failed:", err);
            setIsLoading(false);
            triggerShake('حدث خطأ أثناء إتمام عملية تسجيل الدخول.');
        }
    };

    const isLocked = lockedUntil > 0 && Date.now() < lockedUntil;

    // ── Render ────────────────────────────────────────────────────────
    return (
        <div className="sgw-root">
            <div className="sgw-orb sgw-orb-1" />
            <div className="sgw-orb sgw-orb-2" />
            <div className="sgw-orb sgw-orb-3" />

            <div className="sgw-card-wrapper">
                <div className={`sgw-card ${shake ? 'sgw-shake' : ''} ${isSuccess ? 'sgw-success-state' : ''}`}>

                    {/* Header */}
                    <div className="sgw-header">
                        <div className="sgw-shield">
                            {isSuccess ? '✅' : isLocked ? '🔐' : '🛡️'}
                        </div>
                        <h1 className="sgw-title">
                            {isSuccess 
                                ? 'تم الدخول بنجاح' 
                                : isLocked 
                                    ? `الوصول مقفل — يُرفع بعد ${lockCountdown} ثانية` 
                                    : loginStep === 1 
                                        ? 'بوابة الدخول' 
                                        : loginStep === 2 
                                            ? 'تسجيل دخول منسق' 
                                            : 'التحقق بخطوتين'}
                        </h1>
                    </div>

                    {/* Success animation */}
                    {isSuccess && (
                        <div className="sgw-success-anim">
                            <div className="sgw-checkmark-circle">
                                <svg viewBox="0 0 52 52" className="sgw-checkmark-svg">
                                    <circle className="sgw-check-circle" cx="26" cy="26" r="25" fill="none" />
                                    <path className="sgw-check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Locked state */}
                    {isLocked && !isSuccess && (
                        <div className="sgw-locked-panel">
                            <div className="sgw-lock-icon">🔒</div>
                            <p className="sgw-lock-msg">
                                تم تجاوز عدد المحاولات المسموح بها.<br />
                                سيُرفع القفل تلقائياً خلال:
                            </p>
                            <div className="sgw-countdown">{lockCountdown}s</div>
                        </div>
                    )}

                    {/* Forms */}
                    {!isLocked && !isSuccess && (
                        <>
                            {/* STEP 1: Secret Gateway Code */}
                            {loginStep === 1 && (
                                <form className="sgw-form" onSubmit={handleStep1Submit} autoComplete="off">
                                    {/* Honeypot */}
                                    <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                                        <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} />
                                    </div>

                                    <div className="sgw-field">
                                        <label className="sgw-label">كود الدخول</label>
                                        <div className="sgw-input-wrapper">
                                            <span className="sgw-input-icon">🔑</span>
                                            <input
                                                type="password"
                                                className="sgw-input"
                                                value={accessCode}
                                                onChange={e => setAccessCode(e.target.value)}
                                                placeholder="أدخل كود الدخول"
                                                autoComplete="new-password"
                                                disabled={isLoading}
                                                required
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    {/* CAPTCHA */}
                                    <div className="sgw-field">
                                        <label className="sgw-label">رمز التحقق البصري</label>
                                        <div className="sgw-captcha-row">
                                            <canvas ref={canvasRef} width={180} height={52} className="sgw-captcha-canvas" />
                                            <button type="button" className="sgw-captcha-refresh" onClick={refreshCaptcha} disabled={isLoading}>🔄</button>
                                        </div>
                                        <input
                                            type="text"
                                            className="sgw-input sgw-captcha-input"
                                            value={captchaInput}
                                            onChange={e => setCaptchaInput(e.target.value.toUpperCase())}
                                            placeholder="اكتب الرمز الظاهر أعلاه"
                                            autoComplete="off"
                                            disabled={isLoading}
                                            maxLength={5}
                                            required
                                            dir="ltr"
                                        />
                                    </div>

                                    {attempts > 0 && (
                                        <div className="sgw-attempts-indicator">
                                            {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
                                                <div key={i} className={`sgw-attempt-dot ${i < attempts ? 'sgw-attempt-used' : ''}`} />
                                            ))}
                                            <span className="sgw-attempts-label">{MAX_ATTEMPTS - attempts} محاولة متبقية</span>
                                        </div>
                                    )}

                                    {errorMsg && <div className="sgw-error">⚠️ {errorMsg}</div>}

                                    <button type="submit" className={`sgw-submit-btn ${isLoading ? 'sgw-loading' : ''}`} disabled={isLoading || !accessCode || !captchaInput}>
                                        {isLoading ? <span className="sgw-spinner" /> : 'تحقق'}
                                    </button>
                                </form>
                            )}

                            {/* STEP 2: Coordinator Credentials */}
                            {loginStep === 2 && (
                                <form className="sgw-form" onSubmit={handleStep2Submit} autoComplete="off">
                                    <div className="sgw-field">
                                        <label className="sgw-label">اسم المستخدم</label>
                                        <div className="sgw-input-wrapper">
                                            <span className="sgw-input-icon">👤</span>
                                            <input
                                                type="text"
                                                className="sgw-input"
                                                value={usernameInput}
                                                onChange={e => setUsernameInput(e.target.value)}
                                                placeholder="اسم المستخدم"
                                                disabled={isLoading}
                                                required
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    <div className="sgw-field">
                                        <label className="sgw-label">كلمة المرور</label>
                                        <div className="sgw-input-wrapper">
                                            <span className="sgw-input-icon">🔒</span>
                                            <input
                                                type="password"
                                                className="sgw-input"
                                                value={passwordInput}
                                                onChange={e => setPasswordInput(e.target.value)}
                                                placeholder="كلمة المرور"
                                                disabled={isLoading}
                                                required
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    {/* CAPTCHA */}
                                    <div className="sgw-field">
                                        <label className="sgw-label">رمز التحقق البصري</label>
                                        <div className="sgw-captcha-row">
                                            <canvas ref={canvasRef} width={180} height={52} className="sgw-captcha-canvas" />
                                            <button type="button" className="sgw-captcha-refresh" onClick={refreshCaptcha} disabled={isLoading}>🔄</button>
                                        </div>
                                        <input
                                            type="text"
                                            className="sgw-input sgw-captcha-input"
                                            value={captchaInput}
                                            onChange={e => setCaptchaInput(e.target.value.toUpperCase())}
                                            placeholder="اكتب الرمز الظاهر أعلاه"
                                            autoComplete="off"
                                            disabled={isLoading}
                                            maxLength={5}
                                            required
                                            dir="ltr"
                                        />
                                    </div>

                                    {errorMsg && <div className="sgw-error">⚠️ {errorMsg}</div>}

                                    <button type="submit" className={`sgw-submit-btn ${isLoading ? 'sgw-loading' : ''}`} disabled={isLoading || !usernameInput || !passwordInput || !captchaInput}>
                                        {isLoading ? <span className="sgw-spinner" /> : 'دخول'}
                                    </button>
                                </form>
                            )}

                            {/* STEP 3: Two-Factor Authentication (2FA) */}
                            {loginStep === 3 && (
                                <form className="sgw-form" onSubmit={handleStep3Submit} autoComplete="off">
                                    <div className="sgw-field">
                                        <label className="sgw-label">رمز التحقق (2FA)</label>
                                        <div className="sgw-input-wrapper">
                                            <span className="sgw-input-icon">📱</span>
                                            <input
                                                type="text"
                                                className="sgw-input"
                                                value={totpInput}
                                                onChange={e => setTotpInput(e.target.value.replace(/\D/g, ''))}
                                                placeholder="أدخل الرمز المكون من 6 أرقام"
                                                maxLength={6}
                                                disabled={isLoading}
                                                required
                                                dir="ltr"
                                                style={{ letterSpacing: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}
                                            />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'rgba(200,215,255,0.4)', marginTop: '4px', textAlign: 'center' }}>
                                            الرجاء إدخال الرمز من تطبيق المصادقة الخاص بك.
                                        </p>
                                    </div>

                                    {errorMsg && <div className="sgw-error">⚠️ {errorMsg}</div>}

                                    <button type="submit" className={`sgw-submit-btn ${isLoading ? 'sgw-loading' : ''}`} disabled={isLoading || totpInput.length < 6}>
                                        {isLoading ? <span className="sgw-spinner" /> : 'تأكيد الرمز'}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecureGateway;
