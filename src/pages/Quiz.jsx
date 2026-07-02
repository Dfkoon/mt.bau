import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { quizData as baseQuizData, quizCategories } from '../data/quizData';
import { extraQuizData } from '../data/quizDataExtra';
import FileUploader from '../components/FileUploader';
import { submitQuestionReport } from '../services/quizReportService';
import { logQuizCompletion } from '../services/analyticsService';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import watermarkLogo from '../assets/logo-watermark.png';
import quizHero from '../assets/heros/quiz_hero.png';
import { Highlight, themes } from 'prism-react-renderer';
import { motion, AnimatePresence } from 'framer-motion';
import './Quiz.css';

// Pure HTML5 Canvas Confetti for celebration upon passing the quiz
const Confetti = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = [
            '#4caf50', '#8bc34a', '#2196f3', '#00bcd4',
            '#ffeb3b', '#ffc107', '#ff9800', '#e91e63',
            '#9c27b0', '#673ab7', '#00c853', '#00e5ff'
        ];

        const particles = [];
        const particleCount = 150;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 4,
                d: Math.random() * canvas.height,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10 - 5,
                tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                tiltAngle: 0
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, idx) => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle);
                p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                ctx.stroke();
            });

            let active = false;
            particles.forEach(p => {
                if (p.y < canvas.height) active = true;
            });

            if (active) {
                animationId = requestAnimationFrame(draw);
            }
        };

        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 99999
            }}
        />
    );
};


const CodeBlock = ({ code, language = 'cpp' }) => (
    <Highlight
        theme={themes.vsDark}
        code={code.trim()}
        language={language}
    >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre style={{
                ...style,
                padding: '1.25rem',
                borderRadius: '0.75rem',
                overflow: 'auto',
                direction: 'ltr',
                textAlign: 'left',
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.95rem',
                lineHeight: '1.6',
                backgroundColor: '#1e1e1e',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                margin: '1rem 0'
            }}>
                {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                        ))}
                    </div>
                ))}
            </pre>
        )}
    </Highlight>
);

const renderTextWithCode = (text) => {
    if (!text) return null;

    // Modern multi-language support for markdown code blocks
    // Note: We split by the regex but use a capturing group so matches are included in the array
    const parts = text.split(/```(?:java|cpp|javascript|sql|python)?([\s\S]*?)```/i);

    if (parts.length > 1) {
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return <CodeBlock key={index} code={part} />;
            }

            // For non-code parts, handle HTML or plain text with newlines
            if (part.includes('<br>') || part.includes('<pre>') || part.includes('<code>') || part.includes('<div') || part.includes('<svg')) {
                return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
            }

            // Standard text: preserve newlines
            return (
                <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
                    {part}
                </span>
            );
        });
    }

    // fallback for plain HTML or pure text
    if (text.includes('<br>') || text.includes('<pre>') || text.includes('<code>') || text.includes('<div') || text.includes('<svg')) {
        return <span dangerouslySetInnerHTML={{ __html: text }} />;
    }

    return <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>;
};

// Web Audio API for satisfying click sound without external assets
const playClickSound = () => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        console.log('Audio playback failed or not supported', e);
    }
};

const playSuccessSound = () => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        [440, 554, 659].forEach((freq, i) => { // A Major chord
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (i * 0.1));
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime + (i * 0.1));
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (i * 0.1) + 1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + (i * 0.1));
            osc.stop(audioCtx.currentTime + (i * 0.1) + 1);
        });
    } catch (e) { }
};

const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
    }
};

const Quiz = () => {
    const { language, t } = useLanguage();
    const { quizId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showUploader, setShowUploader] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    // Timer and mobile navigation states
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [printMode, setPrintMode] = useState(null);

    // ── Admin-edits from Firestore (question_edits collection) ──
    const [questionEdits, setQuestionEdits] = useState({});

    useEffect(() => {
        if (!quizId) { setQuestionEdits({}); return; }
        getDocs(query(collection(db, 'question_edits'), where('quizId', '==', quizId)))
            .then(snap => {
                const map = {};
                snap.forEach(d => { map[d.data().questionId] = d.data(); });
                setQuestionEdits(map);
            })
            .catch(() => { }); // silently fail — local data is fallback
    }, [quizId]);

    // Merge base quiz data with any extra quizzes (e.g., past-year DB questions)
    const quizData = useMemo(() => ({ ...baseQuizData, ...extraQuizData }), [baseQuizData]);

    // Get current quiz data (merged with admin edits)
    const rawQuiz = quizId ? quizData[quizId] : null;
    const currentQuiz = useMemo(() => {
        if (!rawQuiz) return null;
        if (Object.keys(questionEdits).length === 0) return rawQuiz;
        return {
            ...rawQuiz,
            questions: rawQuiz.questions.map(q => {
                const edit = questionEdits[q.id];
                if (!edit) return q;
                return {
                    ...q,
                    questionAr: edit.questionAr || q.questionAr,
                    questionEn: edit.questionEn || q.questionEn,
                    options: edit.options?.length > 0 ? edit.options : q.options,
                    correctAnswer: edit.correctAnswer || q.correctAnswer,
                };
            }),
        };
    }, [rawQuiz, questionEdits]);

    // Find the parent subject/category for the current quiz (used in breadcrumbs)
    const currentSubject = quizId ? quizCategories.find(cat => {
        // Level 1: Direct match
        if (cat.id === quizId) return true;

        // Level 2: Match in parts
        if (cat.parts && cat.parts.some(p => p.id === quizId)) return true;

        // Level 3: Match in sub-parts of parts
        if (cat.parts) {
            return cat.parts.some(p => {
                const partObj = quizData[p.id];
                return partObj && partObj.parts && partObj.parts.some(subPart => subPart.id === quizId);
            });
        }

        return false;
    }) : null;
    const currentSubjectName = currentSubject
        ? (language === 'ar' ? (currentSubject.nameAr || currentSubject.name) : currentSubject.name)
        : '';

    // Filter categories based on search
    const filteredCategories = quizCategories.filter(category => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            category.name.toLowerCase().includes(search) ||
            category.nameAr.includes(searchTerm)
        );
    });

    // Reset state and initialize timer when quiz changes
    useEffect(() => {
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setShowResults(false);
        setScore(0);
        setFlaggedQuestions(new Set());
        setIsMobileDrawerOpen(false);
        if (quizId) setSelectedCategory(null);
        window.scrollTo(0, 0);

        if (quizId && currentQuiz && !currentQuiz.parts && currentQuiz.questions?.length > 0) {
            const timeLimit = currentQuiz.questions.length * 90; // 90 seconds per question
            setTimeLeft(timeLimit);
            setTimerActive(true);
        } else {
            setTimerActive(false);
            setTimeLeft(0);
        }
    }, [quizId, currentQuiz]);

    // Handle back navigation state to restore selected subject category
    useEffect(() => {
        if (!quizId) {
            if (location.state?.selectedCategoryId) {
                const cat = quizCategories.find(c => c.id === location.state.selectedCategoryId);
                if (cat) {
                    setSelectedCategory(cat);
                }
            } else {
                setSelectedCategory(null);
            }
        }
    }, [quizId, location.state]);

    // Timer countdown effect
    // Calculate Score — defined BEFORE the timer effect that calls it
    const finishQuiz = React.useCallback(() => {
        let calculatedScore = 0;
        let totalMarks = 0;

        currentQuiz.questions.forEach(q => {
            totalMarks += q.marks || 1;
            if (q.type === 'matching') {
                const subQuestions = q.subQuestions || [];
                const subMarks = (q.marks || 1) / subQuestions.length;
                subQuestions.forEach(sub => {
                    const userSubAns = userAnswers[q.id]?.[sub.id];
                    if (userSubAns === sub.correctAnswer) {
                        calculatedScore += subMarks;
                    }
                });
            } else {
                if (userAnswers[q.id] === q.correctAnswer) {
                    calculatedScore += q.marks || 1;
                }
            }
        });

        setScore(calculatedScore);
        setShowResults(true);
        setTimerActive(false);
        window.scrollTo(0, 0);

        // Log quiz completion to analytics
        logQuizCompletion(
            quizId,
            currentQuiz.titleAr || currentQuiz.title || quizId,
            `${calculatedScore.toFixed(2)}/${totalMarks.toFixed(2)}`
        );

        if (calculatedScore / totalMarks >= 0.5) {
            playSuccessSound();
        }
    }, [currentQuiz, userAnswers]);

    useEffect(() => {
        let interval = null;
        if (timerActive && timeLeft > 0 && !showResults) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive && !showResults) {
            toast.error(
                language === 'ar'
                    ? 'انتهى الوقت! تم إنهاء الاختبار وتصحيح إجاباتك تلقائياً.'
                    : 'Time is up! Your quiz has been automatically submitted.',
                { duration: 5000, icon: '⏰' }
            );
            finishQuiz();
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft, showResults, finishQuiz, language]);

    // Ensure page starts from top when changing categories internally
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedCategory]);



    // Handle clearing print mode
    useEffect(() => {
        const handleAfterPrint = () => setPrintMode(null);
        window.addEventListener('afterprint', handleAfterPrint);
        return () => window.removeEventListener('afterprint', handleAfterPrint);
    }, []);

    const handlePrint = (mode) => {
        setPrintMode(mode);
        setTimeout(() => window.print(), 150);
    };

    // Handle Answer Selection
    const handleAnswerSelect = React.useCallback((questionId, answer) => {
        playClickSound();
        triggerHaptic();
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    }, []);

    // Keyboard Navigation Effect
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!timerActive || showResults || !currentQuiz) return;

            const question = currentQuiz.questions[currentQuestionIndex];

            // Navigate between questions
            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                setCurrentQuestionIndex(prev => Math.min(currentQuiz.questions.length - 1, prev + 1));
            } else if (e.key === 'ArrowLeft') {
                setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
            }

            // Select answers using numbers 1-4 for MCQ/TF
            if (question && (question.type === 'mcq' || question.type === 'true_false')) {
                const num = parseInt(e.key);
                if (!isNaN(num) && num > 0) {
                    let optId = null;
                    if (question.type === 'mcq' && question.options && question.options[num - 1]) {
                        optId = question.options[num - 1].id;
                    } else if (question.type === 'true_false') {
                        if (num === 1) optId = 'true';
                        if (num === 2) optId = 'false';
                    }
                    if (optId) handleAnswerSelect(question.id, optId);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [timerActive, showResults, currentQuiz, currentQuestionIndex, handleAnswerSelect]);

    // finishQuiz is now defined above the timer useEffect that calls it

    // Restart Quiz
    const restartQuiz = () => {
        setUserAnswers({});
        setShowResults(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setFlaggedQuestions(new Set());
        if (currentQuiz) {
            const timeLimit = currentQuiz.questions.length * 90;
            setTimeLeft(timeLimit);
            setTimerActive(true);
        }
        window.scrollTo(0, 0);
    };

    // Toggle Flag
    const toggleFlag = (q) => {
        const qId = q.id;
        const willBeFlagged = !flaggedQuestions.has(qId);

        setFlaggedQuestions(prev => {
            const next = new Set(prev);
            if (next.has(qId)) next.delete(qId);
            else next.add(qId);
            return next;
        });

        // If newly flagged, send report to admin
        if (willBeFlagged) {
            // Find subject name for context
            const subject = quizCategories.find(cat =>
                cat.id === quizId || (cat.parts && cat.parts.some(p => p.id === quizId))
            );
            const subName = subject ? (language === 'ar' ? (subject.nameAr || subject.name) : subject.name) : '';

            const reportData = {
                quizId: quizId,
                quizTitle: currentQuiz.titleAr || currentQuiz.title,
                subjectName: subName,
                reportType: 'incorrect_answer',
                questionId: qId,
                questionAr: q.questionAr || '',
                questionEn: q.questionEn || '',
                type: q.type,
                options: q.options || [],
                correctAnswer: q.correctAnswer || '',
            };

            submitQuestionReport(reportData).then(res => {
                if (res.success) {
                    toast.success(language === 'ar' ? 'تم إرسال بلاغ للمراجعة' : 'Report sent for review', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        icon: '🚩'
                    });
                }
            });
        }
    };

    // If viewing a specific quiz
    if (quizId && currentQuiz) {
        // If the quiz serves as a container for sub-parts (like "Chapter Quizzes" -> "Quiz 1, Quiz 2")
        if (currentQuiz.parts && currentQuiz.parts.length > 0) {
            return (
                <div className="quiz-page">
                    <section className="quiz-hero" style={{ backgroundImage: `url(${quizHero})` }}>
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                            <h1 className="hero-title">{t('quiz.hero.title')}</h1>
                            <p className="hero-subtitle">{t('quiz.hero.subtitle')}</p>
                        </div>
                    </section>

                    <div className="quiz-selection-container">
                        <div className="parts-selection fade-in">
                            <button
                                className="back-btn"
                                onClick={() => {
                                    if (currentSubject) {
                                        navigate('/quiz', { state: { selectedCategoryId: currentSubject.id } });
                                    } else {
                                        navigate('/quiz');
                                    }
                                }}
                            >
                                {language === 'ar' ? '← العودة' : '← Back'}
                            </button>
                            <h2 className="selection-title">
                                {language === 'ar' ? (currentQuiz.titleAr || currentQuiz.title) : currentQuiz.title}
                            </h2>
                            <div className="quiz-categories-grid">
                                {currentQuiz.parts.map(part => {
                                    // Identify if the part refers to a valid quiz with questions
                                    const partId = part.id;
                                    const partData = quizData[partId];
                                    const hasQuestions = partData?.questions?.length > 0;

                                    return (
                                        <Link
                                            key={part.id}
                                            to={hasQuestions ? `/quiz/${partId}` : '#'}
                                            onClick={(e) => !hasQuestions && e.preventDefault()}
                                            className={`quiz-category-card glass-card ${!hasQuestions ? 'disabled-quiz-card' : ''}`}
                                            style={{ '--category-color': currentQuiz.color }}
                                        >
                                            <div className="category-icon">{part.icon || currentQuiz.icon}</div>
                                            <h3>{language === 'ar' ? part.titleAr : part.title}</h3>
                                            <p>{partData?.questions?.length || 0} {t('quiz.selection.questions')}</p>
                                            <span className="start-btn">
                                                {hasQuestions
                                                    ? t('quiz.selection.start')
                                                    : (language === 'ar' ? 'لم تتوفر بعد' : 'Not available yet')}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // If results shown
        if (showResults) {
            const totalQuestions = currentQuiz.questions.length;
            const percentage = (score / totalQuestions) * 100;

            return (
                <div className="quiz-page-container print-area moodle-quiz-page-container">
                    {/* Confetti celebration when score is >= 50% */}
                    {percentage >= 50 && <Confetti />}

                    {/* Watermark for Print - Top level for repetition */}
                    <div className="print-watermark">
                        <img src={watermarkLogo} alt="Watermark" />
                        <p>COPYRIGHT © MAKANAK PROJECT</p>
                        <p style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.6 }}>KOON BAU - ALL RIGHTS RESERVED</p>
                    </div>

                    {/* Moodle Style Summary & Review */}
                    <div className="moodle-theme-wrapper" dir={language === 'ar' ? 'rtl' : 'ltr'}>

                        {/* Moodle Top Navbar removed per user request */}

                        {/* Moodle Breadcrumbs */}
                        <div className="moodle-breadcrumbs no-print">
                            <Link to="/quiz" state={{ selectedCategoryId: currentSubject?.id }} className="moodle-breadcrumb-item moodle-breadcrumb-link" style={{ textDecoration: 'none', color: '#0f6cbf' }}>{language === 'ar' ? 'الاختبارات القصيرة' : 'Quizzes'}</Link>
                            {currentSubjectName && currentSubject && currentSubject.id !== quizId && (
                                <>
                                    <span className="moodle-breadcrumb-separator">/</span>
                                    <span
                                        className="moodle-breadcrumb-item"
                                        style={{ color: '#0f6cbf', cursor: 'pointer' }}
                                        onClick={() => navigate('/quiz', { state: { selectedCategoryId: currentSubject.id } })}
                                    >
                                        {currentSubjectName}
                                    </span>
                                </>
                            )}
                            <span className="moodle-breadcrumb-separator">/</span>
                            <span className="moodle-breadcrumb-item">{language === 'ar' ? (currentQuiz.titleAr || currentQuiz.title) : currentQuiz.title}</span>
                        </div>

                        {/* Quiz Title Header */}
                        <div className="moodle-quiz-header">
                            <div className="moodle-quiz-icon-pink">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 11l3 3L22 4"></path>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                            </div>
                            <h1 className="moodle-quiz-title">
                                {language === 'ar' ? (currentQuiz.titleAr || currentQuiz.title) : currentQuiz.title}
                            </h1>
                        </div>

                        {/* Quiz Metadata Description Card */}
                        <div className="moodle-quiz-meta-card no-print">
                            <div className="moodle-meta-row">
                                <span className="moodle-meta-label">{language === 'ar' ? '📅 وقت الفتح:' : '📅 Opened:'}</span>
                                <span className="moodle-meta-value">{language === 'ar' ? 'متاح دائماً' : 'Always available'}</span>
                            </div>
                            <div className="moodle-meta-row">
                                <span className="moodle-meta-label">{language === 'ar' ? '📅 وقت الغلق:' : '📅 Closed:'}</span>
                                <span className="moodle-meta-value">{language === 'ar' ? 'يعتمد على انتهاء المحاولة' : 'Depends on attempt completion'}</span>
                            </div>
                            <hr className="moodle-meta-divider" />
                            <p className="moodle-meta-instruction">
                                {language === 'ar'
                                    ? 'أجب على الأسئلة في دفتر ملاحظاتك وارفع صورة لإجاباتك.'
                                    : 'Answer the short-answer questions in your notebook and upload a picture of your answers.'}
                            </p>
                        </div>

                        <div className="moodle-quiz-info-list no-print">
                            <p><strong>{language === 'ar' ? 'المحاولات المسموح بها:' : 'Attempts allowed:'}</strong> {language === 'ar' ? 'غير محدود' : 'Unlimited'}</p>
                            <p><strong>{language === 'ar' ? 'الحد الزمني:' : 'Time limit:'}</strong> {Math.floor((totalQuestions * 90) / 60)} {language === 'ar' ? 'دقيقة' : 'mins'}</p>
                            <p><strong>{language === 'ar' ? 'درجة النجاح:' : 'Grade to pass:'}</strong> {(totalQuestions * 0.5).toFixed(2)} {language === 'ar' ? 'من' : 'out of'} {totalQuestions}.00</p>
                        </div>

                        <div className="moodle-results-container">
                            <h2 className="moodle-final-grade">
                                {language === 'ar' ? `علامتك النهائية في هذا الاختبار هي ${score.toFixed(2)}/${totalQuestions}.00.` : `Your final grade for this quiz is ${score.toFixed(2)}/${totalQuestions}.00.`}
                            </h2>

                            <h3 className="moodle-attempts-title">
                                {language === 'ar' ? 'محاولاتك' : 'Your attempts'}
                            </h3>

                            <table className="moodle-attempts-table">
                                <thead>
                                    <tr>
                                        <th colSpan="2">{language === 'ar' ? 'المحاولة 1' : 'Attempt 1'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="moodle-label">{language === 'ar' ? 'الحالة' : 'Status'}</td>
                                        <td>{language === 'ar' ? 'منتهي' : 'Finished'}</td>
                                    </tr>
                                    <tr>
                                        <td className="moodle-label">{language === 'ar' ? 'بدأ في' : 'Started'}</td>
                                        <td>{new Date(Date.now() - (totalQuestions * 90 * 1000) + (timeLeft * 1000)).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                                    </tr>
                                    <tr>
                                        <td className="moodle-label">{language === 'ar' ? 'اكتمل في' : 'Completed'}</td>
                                        <td>{new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                                    </tr>
                                    <tr>
                                        <td className="moodle-label">{language === 'ar' ? 'المدة' : 'Duration'}</td>
                                        <td>{Math.floor(((totalQuestions * 90) - timeLeft) / 60)} {language === 'ar' ? 'دقائق' : 'mins'} {((totalQuestions * 90) - timeLeft) % 60} {language === 'ar' ? 'ثواني' : 'secs'}</td>
                                    </tr>
                                    <tr>
                                        <td className="moodle-label">{language === 'ar' ? 'العلامة' : 'Grade'}</td>
                                        <td><strong>{score.toFixed(2)}</strong> {language === 'ar' ? 'من' : 'out of'} {totalQuestions.toFixed(2)} (<strong>{Math.round(percentage)}</strong>%)</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2" className="moodle-review-link">
                                            <a href="#quiz-review-section" onClick={(e) => { e.preventDefault(); document.getElementById('quiz-review-section').scrollIntoView({ behavior: 'smooth' }); }}>{language === 'ar' ? 'مراجعة' : 'Review'}</a>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="moodle-back-btn-container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: language === 'ar' ? 'flex-end' : 'flex-start', marginTop: '1.5rem' }}>
                                <button
                                    onClick={() => {
                                        if (currentSubject) {
                                            navigate('/quiz', { state: { selectedCategoryId: currentSubject.id } });
                                        } else {
                                            navigate('/quiz');
                                        }
                                    }}
                                    className="moodle-back-btn"
                                >
                                    {language === 'ar' ? 'العودة إلى المقرر الدراسي' : 'Back to the course'}
                                </button>
                                <button onClick={restartQuiz} className="moodle-back-btn" style={{ backgroundColor: '#0f6cbf', color: 'white', borderColor: '#0a4a84' }}>
                                    🔄 {language === 'ar' ? 'إعادة الاختبار' : 'Restart Quiz'}
                                </button>
                                <button onClick={() => handlePrint('student')} className="moodle-back-btn" style={{ backgroundColor: '#f8f9fa' }}>
                                    🖨️ {language === 'ar' ? 'طباعة إجاباتي' : 'Print my answers'}
                                </button>
                                <button onClick={() => handlePrint('model')} className="moodle-back-btn" style={{ backgroundColor: '#e7f3f5', borderColor: '#c8e1e5', color: '#0f6cbf' }}>
                                    🖨️ {language === 'ar' ? 'طباعة الإجابات النموذجية' : 'Print model answers'}
                                </button>
                            </div>
                        </div>

                        {/* Moodle Review Layout */}
                        <div id="quiz-review-section" className="moodle-review-section">
                            <div className="moodle-review-layout">
                                {/* Left Content (Questions) */}
                                <div className="moodle-questions-column">
                                    {currentQuiz.questions.map((q, idx) => {
                                        const originalUserAnswer = userAnswers[q.id];
                                        let effectiveUserAnswer = originalUserAnswer;

                                        if (printMode === 'model') {
                                            if (q.type === 'matching') {
                                                const matchingCorrect = {};
                                                (q.subQuestions || []).forEach(sub => {
                                                    matchingCorrect[sub.id] = sub.correctAnswer;
                                                });
                                                effectiveUserAnswer = matchingCorrect;
                                            } else {
                                                effectiveUserAnswer = q.correctAnswer;
                                            }
                                        }

                                        const userAnswer = effectiveUserAnswer;

                                        let isCorrect = false;
                                        if (q.type === 'matching') {
                                            const subQuestions = q.subQuestions || [];
                                            let correctCount = 0;
                                            subQuestions.forEach(sub => {
                                                if (userAnswer?.[sub.id] === sub.correctAnswer) correctCount++;
                                            });
                                            isCorrect = correctCount === subQuestions.length;
                                        } else {
                                            isCorrect = userAnswer === q.correctAnswer;
                                        }

                                        const displayLang = currentQuiz.forceEnglish || quizId === 'comp_skills' ? 'en' : language;

                                        return (
                                            <div key={q.id} className="moodle-question-block" id={`question-${idx + 1}`}>
                                                <div className="moodle-q-info-box">
                                                    <div className="moodle-q-num"><strong>{language === 'ar' ? 'سؤال ' : 'Question '} {idx + 1}</strong></div>
                                                    <div className="moodle-q-status">{isCorrect ? (language === 'ar' ? 'صحيح' : 'Correct') : (language === 'ar' ? 'غير صحيح' : 'Incorrect')}</div>
                                                    <div className="moodle-q-mark">{language === 'ar' ? `العلامة ${isCorrect ? (q.marks || 1.00).toFixed(2) : '0.00'} من ${(q.marks || 1.00).toFixed(2)}` : `Mark ${isCorrect ? (q.marks || 1.00).toFixed(2) : '0.00'} out of ${(q.marks || 1.00).toFixed(2)}`}</div>
                                                    <div className="moodle-q-flag">
                                                        <span className="flag-icon">⚑</span> {language === 'ar' ? 'تعليم السؤال' : 'Flag question'}
                                                    </div>
                                                </div>

                                                <div className="moodle-q-content-box">
                                                    <div className={`moodle-q-text-area ${displayLang === 'en' ? 'force-ltr' : ''}`}>
                                                        <div className="moodle-q-text-main">
                                                            {renderTextWithCode(displayLang === 'ar' ? (q.questionAr || q.questionEn) : q.questionEn)}
                                                        </div>

                                                        {q.image && (
                                                            <div className="question-image-container" style={{ textAlign: 'center', margin: '1rem 0' }}>
                                                                <img
                                                                    src={q.image}
                                                                    alt="Question Illustration"
                                                                    style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                                                                />
                                                            </div>
                                                        )}

                                                        {q.questionEnPartB && (
                                                            <div className="moodle-q-text-main" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                                                                {renderTextWithCode(displayLang === 'ar' ? q.questionArPartB : q.questionEnPartB)}
                                                            </div>
                                                        )}

                                                        {q.tableData && (
                                                            <div className="question-table-container" style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                {q.tableData.title && (
                                                                    <h3 style={{ marginBottom: '0.5rem', alignSelf: 'flex-start', marginLeft: '10%' }}>{q.tableData.title}</h3>
                                                                )}
                                                                <table style={{
                                                                    borderCollapse: 'collapse',
                                                                    backgroundColor: '#f8f9fa',
                                                                    color: '#333',
                                                                    borderRadius: '8px',
                                                                    overflow: 'hidden',
                                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                                    minWidth: '200px'
                                                                }}>
                                                                    <thead>
                                                                        <tr style={{ backgroundColor: '#e9ecef', borderBottom: '2px solid #ced4da' }}>
                                                                            {q.tableData.headers.map((header, idx) => (
                                                                                <th key={idx} style={{ padding: '0.75rem 1.5rem', borderRight: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{header}</th>
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {q.tableData.rows.map((row, rIdx) => (
                                                                            <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                                                                {row.map((cell, cIdx) => (
                                                                                    <td key={cIdx} style={{ padding: '0.75rem 1.5rem', borderRight: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{cell}</td>
                                                                                ))}
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}

                                                        {q.multiTables && (
                                                            <div className="question-multi-tables-container" style={{ margin: '1.5rem 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                                                                {q.multiTables.map((tbl, tIdx) => (
                                                                    <div key={tIdx} className="single-table-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                        {tbl.title && (
                                                                            <h3 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{tbl.title}</h3>
                                                                        )}
                                                                        <table style={{
                                                                            borderCollapse: 'collapse',
                                                                            backgroundColor: '#f8f9fa',
                                                                            color: '#333',
                                                                            borderRadius: '8px',
                                                                            overflow: 'hidden',
                                                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                                            minWidth: '150px'
                                                                        }}>
                                                                            <thead>
                                                                                <tr style={{ backgroundColor: '#e9ecef', borderBottom: '2px solid #ced4da' }}>
                                                                                    {tbl.headers.map((header, idx) => (
                                                                                        <th key={idx} style={{ padding: '0.5rem 1rem', borderRight: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{header}</th>
                                                                                    ))}
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {tbl.rows.map((row, rIdx) => (
                                                                                    <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                                                                        {row.map((cell, cIdx) => (
                                                                                            <td key={cIdx} style={{ padding: '0.5rem 1rem', borderRight: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{cell}</td>
                                                                                        ))}
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* User Answer Display */}
                                                        <div className="moodle-q-options-display">
                                                            {q.type === 'mcq' && q.options.map((o, oIdx) => {
                                                                const letter = String.fromCharCode(97 + oIdx); // a, b, c, d
                                                                const isSelected = userAnswer === o.id;
                                                                const isOptionCorrect = o.id === q.correctAnswer;
                                                                return (
                                                                    <div key={o.id} className="moodle-radio-display">
                                                                        <input type="radio" checked={isSelected} readOnly />
                                                                        <label className={isSelected && isOptionCorrect ? 'moodle-correct-text' : (isSelected ? 'moodle-wrong-text' : '')}>
                                                                            <span className="moodle-option-letter">{letter}.</span>{' '}
                                                                            {o.tableData ? (
                                                                                <div className="option-table-wrapper" style={{ display: 'inline-block', verticalAlign: 'middle', overflowX: 'auto' }}>
                                                                                    <table className="question-interactive-table opt-table">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                {o.tableData.headers.map((h, i) => (
                                                                                                    <th key={i}>{h}</th>
                                                                                                ))}
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {o.tableData.rows.map((r, i) => (
                                                                                                <tr key={i}>
                                                                                                    {r.map((c, j) => (
                                                                                                        <td key={j}>{c}</td>
                                                                                                    ))}
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            ) : (
                                                                                renderTextWithCode(displayLang === 'ar' ? (o.textAr || o.textEn) : o.textEn)
                                                                            )}
                                                                            {isSelected && isCorrect && <span className="moodle-check-icon"> ✔</span>}
                                                                            {isSelected && !isCorrect && <span className="moodle-cross-icon"> ❌</span>}
                                                                            {!isSelected && isOptionCorrect && <span className="moodle-check-icon"> (✔)</span>}
                                                                        </label>
                                                                    </div>
                                                                );
                                                            })}

                                                            {(q.type === 'tf' || q.type === 'true_false') && [
                                                                { id: true, text: displayLang === 'ar' ? 'صح' : 'True' },
                                                                { id: false, text: displayLang === 'ar' ? 'خطأ' : 'False' }
                                                            ].map((val, oIdx) => {
                                                                const letter = String.fromCharCode(97 + oIdx); // a, b
                                                                const isSelected = userAnswer === val.id;
                                                                const isOptionCorrect = val.id === q.correctAnswer;
                                                                return (
                                                                    <div key={val.id.toString()} className="moodle-radio-display">
                                                                        <input type="radio" checked={isSelected} readOnly />
                                                                        <label className={isSelected && isOptionCorrect ? 'moodle-correct-text' : (isSelected ? 'moodle-wrong-text' : '')}>
                                                                            <span className="moodle-option-letter">{letter}.</span>{' '}
                                                                            {val.text}
                                                                            {isSelected && isCorrect && <span className="moodle-check-icon"> ✔</span>}
                                                                            {isSelected && !isCorrect && <span className="moodle-cross-icon"> ❌</span>}
                                                                            {!isSelected && isOptionCorrect && <span className="moodle-check-icon"> (✔)</span>}
                                                                        </label>
                                                                    </div>
                                                                );
                                                            })}

                                                            {q.type === 'matching' && (q.subQuestions || []).map((sub, sIdx) => {
                                                                const userSubAns = userAnswer?.[sub.id];
                                                                const isSubCorrect = userSubAns === sub.correctAnswer;
                                                                const correctOptText = q.options.find(o => o.id === sub.correctAnswer)?.textEn || q.options.find(o => o.id === sub.correctAnswer)?.textAr || sub.correctAnswer;
                                                                const userOptText = q.options.find(o => o.id === userSubAns)?.textEn || q.options.find(o => o.id === userSubAns)?.textAr || userSubAns || (language === 'ar' ? 'لم يتم الاختيار' : 'Not chosen');

                                                                return (
                                                                    <div key={sub.id} className="moodle-matching-review-row" style={{ display: 'flex', gap: '1rem', margin: '0.5rem 0', alignItems: 'center', flexWrap: 'wrap' }}>
                                                                        <span style={{ fontWeight: 'bold' }}>{sIdx + 1}. {renderTextWithCode(displayLang === 'ar' ? sub.textAr : sub.textEn)}</span>
                                                                        <span style={{ margin: '0 10px' }}>➔</span>
                                                                        <span className={isSubCorrect ? 'moodle-correct-text' : 'moodle-wrong-text'} style={{ padding: '2px 8px', borderRadius: '4px', background: isSubCorrect ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)', color: isSubCorrect ? '#28a745' : '#dc3545' }}>
                                                                            {userOptText}
                                                                            {isSubCorrect ? ' ✔' : ` ❌ (${language === 'ar' ? 'الإجابة الصحيحة هي' : 'Correct is'}: ${correctOptText})`}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="moodle-q-feedback-box">
                                                        <div className="feedback-answer-state">
                                                            {language === 'ar' ? 'إجابتك ' : 'Your answer is '}{isCorrect ? (language === 'ar' ? 'صحيحة.' : 'correct.') : (language === 'ar' ? 'غير صحيحة.' : 'incorrect.')}
                                                        </div>
                                                        <div className="feedback-correct-answer">
                                                            {language === 'ar' ? 'الإجابة الصحيحة هي: ' : 'The correct answer is: '}
                                                            {q.type === 'mcq'
                                                                ? renderTextWithCode(displayLang === 'ar' ? (q.options.find(o => o.id === q.correctAnswer)?.textAr || q.options.find(o => o.id === q.correctAnswer)?.textEn) : q.options.find(o => o.id === q.correctAnswer)?.textEn)
                                                                : q.type === 'matching'
                                                                    ? (language === 'ar' ? 'موضحة باللون الأخضر أعلاه' : 'indicated in green above')
                                                                    : (q.correctAnswer === true ? (displayLang === 'ar' ? 'صح' : 'True') : (displayLang === 'ar' ? 'خطأ' : 'False'))}
                                                        </div>
                                                        {(q.explanation || q.explanationAr) && (
                                                            <div className="explanation" style={{ marginTop: '1rem', borderLeft: language === 'en' ? '4px solid #FFC107' : 'none', borderRight: language === 'ar' ? '4px solid #FFC107' : 'none' }}>
                                                                <strong>{language === 'ar' ? 'التعليل: ' : 'Explanation: '}</strong>
                                                                {renderTextWithCode(displayLang === 'ar' ? (q.explanationAr || q.explanation) : (q.explanation || q.explanationAr))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Right Content (Quiz Navigation Sidebar) */}
                                <div className="moodle-nav-column">
                                    <div className="moodle-nav-block">
                                        <div className="moodle-close-drawer-row">
                                            <button className="moodle-close-drawer-btn" style={{ visibility: 'hidden' }}>✕</button>
                                            <span>{language === 'ar' ? 'إغلاق درج الكتل' : 'Close block drawer'}</span>
                                        </div>
                                        <h3 className="moodle-nav-title">{language === 'ar' ? 'التنقل عبر الاختبار' : 'Quiz navigation'}</h3>
                                        <div className="moodle-nav-grid">
                                            {currentQuiz.questions.map((q, idx) => {
                                                const originalUserAnswer = userAnswers[q.id];
                                                let effectiveUserAnswer = originalUserAnswer;

                                                if (printMode === 'model') {
                                                    if (q.type === 'matching') {
                                                        const matchingCorrect = {};
                                                        (q.subQuestions || []).forEach(sub => {
                                                            matchingCorrect[sub.id] = sub.correctAnswer;
                                                        });
                                                        effectiveUserAnswer = matchingCorrect;
                                                    } else {
                                                        effectiveUserAnswer = q.correctAnswer;
                                                    }
                                                }

                                                const userAnswer = effectiveUserAnswer;

                                                let isCorrect = false;
                                                if (q.type === 'matching') {
                                                    const subQuestions = q.subQuestions || [];
                                                    let correctCount = 0;
                                                    subQuestions.forEach(sub => {
                                                        if (userAnswer?.[sub.id] === sub.correctAnswer) correctCount++;
                                                    });
                                                    isCorrect = correctCount === subQuestions.length;
                                                } else {
                                                    isCorrect = userAnswer === q.correctAnswer;
                                                }
                                                const isFlagged = flaggedQuestions.has(q.id);

                                                return (
                                                    <a
                                                        href={`#question-${idx + 1}`}
                                                        key={q.id}
                                                        className={`moodle-nav-item-review ${isCorrect ? 'correct' : 'wrong'}`}
                                                    >
                                                        <span className="nav-num">{idx + 1}</span>
                                                        {isCorrect ? (
                                                            <span className="nav-status-badge correct">✔</span>
                                                        ) : (
                                                            <>
                                                                <span className="nav-status-badge wrong">✘</span>
                                                                <span className="nav-corner-tag"></span>
                                                            </>
                                                        )}
                                                        {isFlagged && <span className="nav-flag-indicator-review">🚩</span>}
                                                    </a>
                                                );
                                            })}
                                        </div>
                                        <div className="moodle-nav-links">
                                            <a href="#show-one" onClick={(e) => e.preventDefault()}>{language === 'ar' ? 'إظهار صفحة واحدة في كل مرة' : 'Show one page at a time'}</a>
                                            <a href="#finish-review" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>{language === 'ar' ? 'إنهاء المراجعة' : 'Finish review'}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const question = currentQuiz.questions[currentQuestionIndex];
        const isEnglishContent = currentQuiz.forceEnglish || quizId === 'comp_skills';
        const displayLang = isEnglishContent ? 'en' : language;

        // Helper to format remaining time
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        return (
            <div className="moodle-theme-wrapper active-quiz-mode" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {/* Moodle Top Navbar removed per user request */}

                {/* Moodle Breadcrumbs */}
                <div className="moodle-breadcrumbs no-print">
                    <Link to="/quiz" state={{ selectedCategoryId: currentSubject?.id }} className="moodle-breadcrumb-item moodle-breadcrumb-link" style={{ textDecoration: 'none', color: '#0f6cbf' }}>{language === 'ar' ? 'الاختبارات القصيرة' : 'Quizzes'}</Link>
                    {currentSubjectName && currentSubject && currentSubject.id !== quizId && (
                        <>
                            <span className="moodle-breadcrumb-separator">/</span>
                            <span
                                className="moodle-breadcrumb-item"
                                style={{ color: '#0f6cbf', cursor: 'pointer' }}
                                onClick={() => navigate('/quiz', { state: { selectedCategoryId: currentSubject.id } })}
                            >
                                {currentSubjectName}
                            </span>
                        </>
                    )}
                    <span className="moodle-breadcrumb-separator">/</span>
                    <span className="moodle-breadcrumb-item">{language === 'ar' ? (currentQuiz.titleAr || currentQuiz.title) : currentQuiz.title}</span>
                </div>

                {/* Moodle Quiz Header */}
                <div className="moodle-quiz-header">
                    <div className="moodle-quiz-icon-pink">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                    </div>
                    <h1 className="moodle-quiz-title">
                        {language === 'ar' ? (currentQuiz.titleAr || currentQuiz.title) : currentQuiz.title}
                    </h1>
                </div>

                <div className="moodle-review-layout">
                    {/* Main Quiz Content */}
                    <div className="moodle-questions-column">
                        {/* AI Note Banner - only shown when noteAr is set on the quiz */}
                        {currentQuiz.noteAr && (
                            <div className="quiz-instructional-banner fade-in no-print" style={{
                                background: 'linear-gradient(135deg, rgba(244,67,54,0.12), rgba(255,152,0,0.10))',
                                borderLeft: '4px solid #F44336',
                                borderRadius: '10px',
                                marginBottom: '0.75rem'
                            }}>
                                <div className="banner-icon">🤖</div>
                                <div className="banner-text" style={{ fontWeight: 600, color: 'var(--text-primary, #333)' }}>
                                    {currentQuiz.noteAr}
                                </div>
                            </div>
                        )}

                        {/* Instructional Notice Banner */}
                        <div className="quiz-instructional-banner fade-in no-print">
                            <div className="banner-icon">💡</div>
                            <div className="banner-text">
                                {language === 'ar'
                                    ? 'عند مواجهتك سؤالاً تعتقد أن به خطأً، يرجى تعليم السؤال لنقوم بمراجعته.'
                                    : 'If you encounter a question you believe has an error, please "Flag" it for immediate review.'}
                            </div>
                        </div>

                        <div className="moodle-question-block" id={`question-${currentQuestionIndex + 1}`}>
                            {/* Left Info Box (Moodle Style) */}
                            <div className="moodle-q-info-box">
                                <div className="moodle-q-num">
                                    <strong>{language === 'ar' ? 'سؤال' : 'Question'} {currentQuestionIndex + 1}</strong>
                                </div>
                                <div className="moodle-q-status">
                                    {userAnswers[question.id] !== undefined
                                        ? (language === 'ar' ? 'تمت الإجابة' : 'Answered')
                                        : (language === 'ar' ? 'لم تتم الإجابة بعد' : 'Not yet answered')}
                                </div>
                                <div className="moodle-q-mark">
                                    {language === 'ar' ? 'الدرجة من 1.00' : 'Marked out of 1.00'}
                                </div>

                                {/* Mobile Timer Badge */}
                                <div className={`mobile-timer-badge no-print ${timeLeft <= 60 ? 'timer-danger' : ''}`} style={{ margin: '10px 0', display: 'none' }}>
                                    <span className="timer-badge-icon">⏱️</span>
                                    <span className="timer-badge-text">{formatTime(timeLeft)}</span>
                                </div>

                                <button
                                    className={`moodle-q-flag-btn ${flaggedQuestions.has(question.id) ? 'active' : ''}`}
                                    onClick={() => toggleFlag(question)}
                                >
                                    <span className="flag-icon">⚑</span>{' '}
                                    {flaggedQuestions.has(question.id)
                                        ? (language === 'ar' ? 'إزالة العلامة' : 'Remove flag')
                                        : (language === 'ar' ? 'تعليم السؤال' : 'Flag question')}
                                </button>
                            </div>

                            {/* Question Content Box */}
                            <div className="moodle-q-content-box">
                                <div className={`moodle-q-text-area ${isEnglishContent ? 'force-ltr' : ''}`}>
                                    <div className="moodle-q-text-main">
                                        {renderTextWithCode(displayLang === 'ar' ? (question.questionAr || question.questionEn) : question.questionEn)}
                                    </div>

                                    {question.image && (
                                        <div className="question-image-container" style={{ textAlign: 'center', margin: '1rem 0' }}>
                                            <img
                                                src={question.image}
                                                alt="Question Illustration"
                                                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                                            />
                                        </div>
                                    )}

                                    {question.questionEnPartB && (
                                        <div className="moodle-q-text-main" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                                            {renderTextWithCode(displayLang === 'ar' ? question.questionArPartB : question.questionEnPartB)}
                                        </div>
                                    )}

                                    {question.tableData && (
                                        <div className="question-table-container" style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            {question.tableData.title && (
                                                <h3 style={{ marginBottom: '0.5rem', alignSelf: 'flex-start', marginLeft: '10%' }}>{question.tableData.title}</h3>
                                            )}
                                            <table style={{
                                                borderCollapse: 'collapse',
                                                backgroundColor: '#f8f9fa',
                                                color: '#333',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                minWidth: '200px'
                                            }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: '#e9ecef', borderBottom: '2px solid #ced4da' }}>
                                                        {question.tableData.headers.map((header, idx) => (
                                                            <th key={idx} style={{ padding: '0.75rem 1.5rem', borderRight: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{header}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {question.tableData.rows.map((row, rIdx) => (
                                                        <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                                            {row.map((cell, cIdx) => (
                                                                <td key={cIdx} style={{ padding: '0.75rem 1.5rem', borderRight: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{cell}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {question.multiTables && (
                                        <div className="question-multi-tables-container" style={{ margin: '1.5rem 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                                            {question.multiTables.map((tbl, tIdx) => (
                                                <div key={tIdx} className="single-table-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    {tbl.title && (
                                                        <h3 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{tbl.title}</h3>
                                                    )}
                                                    <table style={{
                                                        borderCollapse: 'collapse',
                                                        backgroundColor: '#f8f9fa',
                                                        color: '#333',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                        minWidth: '150px'
                                                    }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: '#e9ecef', borderBottom: '2px solid #ced4da' }}>
                                                                {tbl.headers.map((header, idx) => (
                                                                    <th key={idx} style={{ padding: '0.5rem 1rem', borderRight: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{header}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tbl.rows.map((row, rIdx) => (
                                                                <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                                                    {row.map((cell, cIdx) => (
                                                                        <td key={cIdx} style={{ padding: '0.5rem 1rem', borderRight: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>{cell}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="moodle-q-options-display">
                                        {question.type === 'mcq' ? (
                                            question.options.map((opt, oIdx) => {
                                                const letter = String.fromCharCode(97 + oIdx); // a, b, c, d
                                                const isSelected = userAnswers[question.id] === opt.id;
                                                return (
                                                    <div
                                                        key={opt.id}
                                                        className={`moodle-radio-display ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => handleAnswerSelect(question.id, opt.id)}
                                                    >
                                                        <input type="radio" checked={isSelected} readOnly />
                                                        <label>
                                                            <span className="moodle-option-letter">{letter}.</span>{' '}
                                                            {opt.tableData ? (
                                                                <div className="option-table-wrapper" style={{ overflowX: 'auto', display: 'inline-block', verticalAlign: 'middle' }}>
                                                                    <table className="question-interactive-table opt-table">
                                                                        <thead>
                                                                            <tr>
                                                                                {opt.tableData.headers.map((h, i) => (
                                                                                    <th key={i}>{h}</th>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {opt.tableData.rows.map((r, i) => (
                                                                                <tr key={i}>
                                                                                    {r.map((c, j) => (
                                                                                        <td key={j}>{c}</td>
                                                                                    ))}
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                renderTextWithCode(displayLang === 'ar' ? (opt.textAr || opt.textEn) : opt.textEn)
                                                            )}
                                                        </label>
                                                    </div>
                                                );
                                            })
                                        ) : question.type === 'matching' ? (
                                            <div className="moodle-matching-container">
                                                {(question.subQuestions || []).map((sub, sIdx) => {
                                                    const currentAnswer = userAnswers[question.id]?.[sub.id] || '';
                                                    return (
                                                        <div key={sub.id} className="moodle-matching-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.8rem 0', gap: '1rem', flexWrap: 'wrap' }}>
                                                            <div className="sub-q-text">
                                                                <span className="sub-num">{sIdx + 1}.</span>{' '}
                                                                {renderTextWithCode(displayLang === 'ar' ? sub.textAr : sub.textEn)}
                                                            </div>
                                                            <div className="moodle-select-wrapper">
                                                                <select
                                                                    className="moodle-select"
                                                                    value={currentAnswer}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setUserAnswers(prev => ({
                                                                            ...prev,
                                                                            [question.id]: {
                                                                                ...(prev[question.id] || {}),
                                                                                [sub.id]: val
                                                                            }
                                                                        }));
                                                                    }}
                                                                >
                                                                    <option value="">{language === 'ar' ? 'اختر...' : 'Choose...'}</option>
                                                                    {question.options.map(opt => (
                                                                        <option key={opt.id} value={opt.id}>
                                                                            {displayLang === 'ar' ? (opt.textAr || opt.id) : (opt.textEn || opt.id)}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            [
                                                { id: true, text: displayLang === 'ar' ? 'صح' : 'True' },
                                                { id: false, text: displayLang === 'ar' ? 'خطأ' : 'False' }
                                            ].map((val, oIdx) => {
                                                const letter = String.fromCharCode(97 + oIdx); // a, b
                                                const isSelected = userAnswers[question.id] === val.id;
                                                return (
                                                    <div
                                                        key={val.id.toString()}
                                                        className={`moodle-radio-display ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => handleAnswerSelect(question.id, val.id)}
                                                    >
                                                        <input type="radio" checked={isSelected} readOnly />
                                                        <label>
                                                            <span className="moodle-option-letter">{letter}.</span>{' '}
                                                            {val.text}
                                                        </label>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls / Navigation buttons inside main column */}
                        <div className="quiz-footer moodle-quiz-footer no-print">
                            <div className="footer-controls">
                                <button
                                    className="nav-btn exit-quiz-btn"
                                    onClick={() => {
                                        if (window.confirm(language === 'ar' ? 'هل أنت متأكد من الخروج؟ سيتم فقدان تقدمك.' : 'Are you sure you want to exit? Your progress will be lost.')) {
                                            setUserAnswers({});
                                            setCurrentQuestionIndex(0);
                                            setFlaggedQuestions(new Set());
                                            setSelectedCategory(null);
                                            navigate('/quiz', { state: { selectedCategoryId: currentSubject?.id } });
                                        }
                                    }}
                                >
                                    {language === 'ar' ? 'العودة للقائمة' : 'Back to List'}
                                </button>

                                <button
                                    className="nav-btn prev"
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    {language === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
                                </button>

                                <span className="question-counter">
                                    {currentQuestionIndex + 1} / {currentQuiz.questions.length}
                                </span>

                                {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
                                    <button
                                        className="nav-btn finish"
                                        onClick={finishQuiz}
                                        style={{ backgroundColor: '#0f6cbf', color: '#fff' }}
                                    >
                                        {language === 'ar' ? 'إنهاء المحاولة...' : 'Finish attempt...'}
                                    </button>
                                ) : (
                                    <button
                                        className="nav-btn next"
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(currentQuiz.questions.length - 1, prev + 1))}
                                        style={{ backgroundColor: '#0f6cbf', color: '#fff' }}
                                    >
                                        {language === 'ar' ? 'الصفحة التالية' : 'Next page'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right column: Navigation sidebar */}
                    <div className="moodle-nav-column no-print">
                        <div className="moodle-nav-block">
                            <div className="moodle-timer-section">
                                <span className="timer-label">⏱️ {language === 'ar' ? 'الوقت المتبقي:' : 'Time Left:'}</span>
                                <span className={`timer-value ${timeLeft <= 60 ? 'timer-danger' : ''}`}>{formatTime(timeLeft)}</span>
                            </div>
                            <div className="moodle-close-drawer-row">
                                <button className="moodle-close-drawer-btn" style={{ visibility: 'hidden' }}>✕</button>
                                <span>{language === 'ar' ? 'إغلاق درج الكتل' : 'Close block drawer'}</span>
                            </div>
                            <h3 className="moodle-nav-title">{language === 'ar' ? 'التنقل عبر الاختبار' : 'Quiz navigation'}</h3>
                            <div className="moodle-nav-grid">
                                {currentQuiz.questions.map((q, idx) => {
                                    const isAnswered = userAnswers[q.id] !== undefined;
                                    const isCurrent = currentQuestionIndex === idx;
                                    const isFlagged = flaggedQuestions.has(q.id);

                                    return (
                                        <button
                                            key={q.id}
                                            className={`moodle-active-nav-item ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                        >
                                            <span className="nav-num">{idx + 1}</span>
                                            {isFlagged && <span className="nav-flag-indicator">🚩</span>}
                                            <span className="nav-status-shade"></span>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="moodle-nav-links">
                                <a href="#finish-attempt" onClick={(e) => { e.preventDefault(); finishQuiz(); }}>
                                    {language === 'ar' ? 'إنهاء المحاولة...' : 'Finish attempt...'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Navigation FAB button for mobile/tablet */}
                <button
                    className="mobile-nav-toggle-fab no-print"
                    onClick={() => setIsMobileDrawerOpen(true)}
                    style={{ backgroundColor: '#0f6cbf' }}
                >
                    <span className="fab-icon">🧭</span>
                    <span className="fab-badge">{currentQuestionIndex + 1}/{currentQuiz.questions.length}</span>
                </button>

                {/* Mobile BottomSheet Navigation Drawer */}
                <AnimatePresence>
                    {isMobileDrawerOpen && (
                        <>
                            <motion.div
                                className="mobile-drawer-backdrop no-print"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileDrawerOpen(false)}
                            />
                            <motion.div
                                className="mobile-drawer-sheet no-print"
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            >
                                <div className="drawer-handle" onClick={() => setIsMobileDrawerOpen(false)} />
                                <div className="drawer-header">
                                    <span className="drawer-icon">🧭</span>
                                    <h3>{language === 'ar' ? 'خريطة الأسئلة والتنقل' : 'Question Map & Navigation'}</h3>
                                    <button className="close-drawer-btn" onClick={() => setIsMobileDrawerOpen(false)}>✕</button>
                                </div>

                                <div className="drawer-timer-section">
                                    <span className="timer-label">⏱️ {language === 'ar' ? 'الوقت المتبقي:' : 'Time Left:'}</span>
                                    <span className={`timer-value ${timeLeft <= 60 ? 'timer-danger' : ''}`}>{formatTime(timeLeft)}</span>
                                </div>

                                <div className="moodle-nav-grid" style={{ padding: '1rem', justifyContent: 'center' }}>
                                    {currentQuiz.questions.map((q, idx) => {
                                        const isAnswered = userAnswers[q.id] !== undefined;
                                        const isFlagged = flaggedQuestions.has(q.id);
                                        const isCurrent = currentQuestionIndex === idx;

                                        return (
                                            <button
                                                key={q.id}
                                                className={`moodle-active-nav-item ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
                                                onClick={() => {
                                                    setCurrentQuestionIndex(idx);
                                                    setIsMobileDrawerOpen(false);
                                                }}
                                            >
                                                <span className="nav-num">{idx + 1}</span>
                                                {isFlagged && <span className="nav-flag-indicator">🚩</span>}
                                                <span className="nav-status-shade"></span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="drawer-footer">
                                    <button className="finish-btn-premium" onClick={() => {
                                        setIsMobileDrawerOpen(false);
                                        finishQuiz();
                                    }} style={{ backgroundColor: '#0f6cbf' }}>
                                        <span className="btn-icon">🏁</span>
                                        {language === 'ar' ? 'إنهاء المحاولة وتصحيح الاختبار' : 'Finish Attempt & Score'}
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div >
        );
    }




    // Default: Show Categories or Selected Category Parts
    return (
        <div className="quiz-page">
            <section className="quiz-hero" style={{ backgroundImage: `url(${quizHero})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">{t('quiz.hero.title')}</h1>
                    <p className="hero-subtitle">{t('quiz.hero.subtitle')}</p>
                </div>
            </section>

            <div className="quiz-selection-container">
                {selectedCategory ? (
                    <div className="parts-selection fade-in">
                        <button className="back-btn" onClick={() => setSelectedCategory(null)}>
                            {language === 'ar' ? '← العودة للمواد' : '← Back to Subjects'}
                        </button>
                        <h2 className="selection-title">
                            {language === 'ar' ? selectedCategory.nameAr : selectedCategory.name}
                        </h2>
                        <div className="quiz-categories-grid">
                            {[...selectedCategory.parts].reverse().map(part => {
                                // Handle accordion/group structure
                                if (part.isGroup && part.subParts) {
                                    return part.subParts.map(subPart => {
                                        const subPartData = quizData[subPart.id];
                                        const hasQuestions = subPartData?.questions?.length > 0;
                                        return (
                                            <Link
                                                key={subPart.id}
                                                to={hasQuestions ? `/quiz/${subPart.id}` : '#'}
                                                onClick={(e) => !hasQuestions && e.preventDefault()}
                                                className={`quiz-category-card glass-card ${!hasQuestions ? 'disabled-quiz-card' : ''}`}
                                                style={{ '--category-color': selectedCategory.color }}
                                            >
                                                <div className="category-icon">{selectedCategory.icon}</div>
                                                <h3>{language === 'ar' ? subPart.titleAr : subPart.title}</h3>
                                                <p>{subPartData?.questions?.length || 0} {language === 'ar' ? 'أسئلة' : 'Questions'}</p>
                                                <span className="start-btn">
                                                    {hasQuestions ? (language === 'ar' ? 'ابدأ الاختبار' : 'Start') : (language === 'ar' ? 'لم تتوفر بعد' : 'Not available')}
                                                </span>
                                            </Link>
                                        );
                                    });
                                }

                                // Handle regular parts
                                const partData = quizData[part.id];
                                const hasQuestions = partData?.questions?.length > 0;
                                const hasSubParts = partData?.parts?.length > 0;
                                const isAvailable = hasQuestions || hasSubParts;

                                return (
                                    <Link
                                        key={part.id}
                                        to={isAvailable ? `/quiz/${part.id}` : '#'}
                                        onClick={(e) => !isAvailable && e.preventDefault()}
                                        className={`quiz-category-card glass-card ${!isAvailable ? 'disabled-quiz-card' : ''}`}
                                        style={{ '--category-color': selectedCategory.color }}
                                    >
                                        <div className="category-icon">{selectedCategory.icon}</div>
                                        <h3>{language === 'ar' ? part.titleAr : part.title}</h3>
                                        <p>
                                            {hasSubParts
                                                ? `${partData.parts.length} ${language === 'ar' ? 'أجزاء' : 'Parts'}`
                                                : `${partData?.questions?.length || 0} ${t('quiz.selection.questions')}`
                                            }
                                        </p>
                                        <span className="start-btn">
                                            {isAvailable
                                                ? (hasSubParts ? (language === 'ar' ? 'عرض الأجزاء' : 'View Parts') : t('quiz.selection.start'))
                                                : (language === 'ar' ? 'لم تتوفر بعد' : 'Not available yet')}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="selection-title">{t('quiz.selection.title')}</h2>

                        {/* Disclaimer Banner */}
                        <div className="quiz-disclaimer-banner fade-in">
                            <span className="disclaimer-icon">💡</span>
                            <p>
                                {language === 'ar'
                                    ? 'تنويه: الأسئلة الموجودة هنا هي عبارة عن أسئلة سنوات سابقة تم تحويلها لنمط اختبار تفاعلي'
                                    : 'Note: The questions provided here are past paper questions adapted into an interactive test format'
                                }
                            </p>
                        </div>

                        <p className="selection-note fade-in">{t('quiz.selection.note')}</p>

                        {/* Search Bar */}
                        <div className="search-bar-container fade-in">
                            <div className="search-input-wrapper">
                                <span className="search-field-icon">🔍</span>
                                <input
                                    type="text"
                                    className="quiz-search-input"
                                    placeholder={language === 'ar' ? 'ابحث عن مادة... (مثلاً: برمجة، رياضيات)' : 'Search for a subject... (e.g., Programming, Math)'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Subjects Quick Index */}
                        {searchTerm === '' && (
                            <div className="subjects-index-container fade-in">
                                <div className="index-header">
                                    <span className="index-icon">📚</span>
                                    <h3 className="index-title">{language === 'ar' ? 'فهرس المواد المتاحة' : 'Available Subjects Index'}</h3>
                                </div>
                                <div className="subjects-chips-grid">
                                    {[...quizCategories].reverse().map((category, index) => (
                                        <button
                                            key={category.id}
                                            className="subject-chip-premium"
                                            onClick={() => {
                                                const element = document.getElementById(`category-${category.id}`);
                                                if (element) {
                                                    const yOffset = -150;
                                                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                                    window.scrollTo({ top: y, behavior: 'smooth' });

                                                    element.classList.add('highlight-pulse');
                                                    setTimeout(() => element.classList.remove('highlight-pulse'), 2000);
                                                }
                                            }}
                                        >
                                            <span className="chip-icon-mini">{category.icon}</span>
                                            <span className="chip-text">{language === 'ar' ? category.nameAr : category.name}</span>
                                            <span className="chip-count">
                                                {index + 1}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredCategories.length > 0 ? (
                            <div className="quiz-categories-grid">
                                {[...filteredCategories].reverse().map(category => {
                                    const hasQuestions = quizData[category.id]?.questions?.length > 0;
                                    const hasParts = category.parts && category.parts.length > 0;

                                    if (hasParts) {
                                        return (
                                            <div
                                                key={category.id}
                                                id={`category-${category.id}`}
                                                className="quiz-category-card glass-card"
                                                style={{ '--category-color': category.color }}
                                                onClick={() => setSelectedCategory(category)}
                                            >
                                                {category.isNew && <span className="new-badge">NEW</span>}
                                                <div className="category-icon">{category.icon}</div>
                                                <h3>{language === 'ar' ? category.nameAr : category.name}</h3>
                                                <p>{category.parts.length} {language === 'ar' ? 'أجزاء' : 'Parts'}</p>
                                                <span className="start-btn">{language === 'ar' ? 'عرض الأجزاء' : 'View Parts'}</span>
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={category.id}
                                            id={`category-${category.id}`}
                                            to={hasQuestions ? `/quiz/${category.id}` : '#'}
                                            onClick={(e) => !hasQuestions && e.preventDefault()}
                                            className={`quiz-category-card glass-card ${!hasQuestions ? 'disabled-quiz-card' : ''}`}
                                            style={{ '--category-color': category.color }}
                                        >
                                            {category.isNew && <span className="new-badge">NEW</span>}
                                            <div className="category-icon">{category.icon}</div>
                                            <h3>{language === 'ar' ? category.nameAr : category.name}</h3>
                                            <p>
                                                {quizData[category.id]?.questions?.length || 0} {t('quiz.selection.questions')}
                                            </p>
                                            <span className="start-btn">
                                                {hasQuestions
                                                    ? t('quiz.selection.start')
                                                    : (language === 'ar' ? 'لم تتوفر بعد' : 'Not available yet')}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="no-search-results fade-in">
                                <div className="no-results-icon">😕</div>
                                <h3>{language === 'ar' ? 'نعتذر، لم يتم العثور على المادة' : 'Sorry, no subject found'}</h3>
                                <p>
                                    {language === 'ar'
                                        ? 'نحن نعمل باستمرار على إضافة مواد جديدة. إذا كنت تبحث عن مادة محددة، يمكنك مراسلتنا لاقتراحها!'
                                        : "We are constantly adding new materials. If you're looking for a specific subject, please suggest it to us!"
                                    }
                                </p>
                                <button className="clear-results-btn" onClick={() => setSearchTerm('')}>
                                    {language === 'ar' ? 'عرض كافة المواد' : 'View all subjects'}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!selectedCategory && (
                    <div className="quiz-contribution-container fade-in">
                        <div className="quiz-contribution-cta unified-cta glass-card">
                            <div className="cta-content">
                                <div className="cta-icon-wrapper">
                                    <div className="cta-icon-bg"></div>
                                    <span className="cta-icon">✨</span>
                                </div>
                                <div className="cta-text">
                                    <h3>{language === 'ar' ? 'ساهم في إثراء محتوى مكانك ✨' : 'Share & Enrich Makanak Content ✨'}</h3>
                                    <p>
                                        {language === 'ar'
                                            ? 'نرحب بمساهماتكم سواء كانت أسئلة سنوات، كويزات، ملخصات، أو روابط مفيدة. ساعد زملائك وكن جزءاً من مسيرة الخير.'
                                            : 'We welcome your contributions! Share past papers, quizzes, summaries, or helpful links to benefit all students.'}
                                    </p>
                                </div>
                            </div>
                            <div className="cta-actions">
                                <button
                                    onClick={() => setShowUploader(true)}
                                    className="cta-pill primary-action"
                                >
                                    <span className="pill-icon">📤</span>
                                    <span className="pill-text">{language === 'ar' ? 'أرفق ملفات أو روابط' : 'Attach Files or Links'}</span>
                                </button>
                                <div className="secondary-actions">
                                    <a href="https://wa.me/962782934685" target="_blank" rel="noopener noreferrer" className="cta-pill whatsapp-lite">
                                        <span className="pill-icon">📱</span>
                                        <span className="pill-text">WhatsApp</span>
                                    </a>
                                    <Link to="/#suggestions" className="cta-pill suggestions-lite">
                                        <span className="pill-icon">📩</span>
                                        <span className="pill-text">{language === 'ar' ? 'الاقتراحات' : 'Suggestions'}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* File Uploader Modal */}
                {showUploader && <FileUploader onClose={() => setShowUploader(false)} />}
            </div>
        </div>
    );
};

export default Quiz;
