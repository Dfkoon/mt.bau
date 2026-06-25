import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { nashmiData } from '../data/nashmiData';
import { chatWithNashmi } from '../services/aiService';
import toast from 'react-hot-toast';
import './NashmiGuide.css';

const SITE_URL = 'https://mtbau.web.app';
const SITE_NAME = 'مكانك الجامعي | MT.BAU';

const NashmiGuide = () => {
    const { language, t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const isAr = language === 'ar';
    const messagesEndRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const shareMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        };
        if (showShareMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShareMenu]);

    const handleOptionClick = (platform) => {
        const url = encodeURIComponent(SITE_URL);
        const text = encodeURIComponent(
            isAr
                ? 'اكتشف مكانك الجامعي — منصة طلاب جامعة البلقاء التطبيقية 🎓'
                : 'Discover MT.BAU — The student platform for BAU students 🎓'
        );

        if (platform === 'copy') {
            navigator.clipboard.writeText(SITE_URL);
            toast.success(isAr ? 'تم نسخ الرابط بنجاح! 🔗' : 'Link copied successfully! 🔗');
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2200);
        } else if (platform === 'instagram') {
            navigator.clipboard.writeText(SITE_URL);
            toast.success(isAr 
                ? 'تم نسخ الرابط! افتح انستغرام لمشاركته مع أصدقائك 📸' 
                : 'Link copied! Open Instagram to share with friends 📸'
            );
            setTimeout(() => {
                window.open('https://www.instagram.com', '_blank');
            }, 1200);
        } else if (platform === 'whatsapp') {
            window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        } else if (platform === 'telegram') {
            window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
        }
        setShowShareMenu(false);
    };

    // Detailed page context for AI and preview bubbles
    const pageGuides = {
        '/': {
            ar: 'أهلاً بك في الصفحة الرئيسية! هون بتقدر تلاقي لمحة سريعة عن خدماتنا، وقسم "بصمة مكانك المميزة" اللي فيه أهم الروابط.',
            en: 'Welcome to the Homepage! Here you can find a quick overview of our services and the "Makanak Touch" section with essential links.',
            hint: 'User is on Homepage. Focus on general navigation and the new Resources Showcase/Services loop.'
        },
        '/materials': {
            ar: 'هون بنك الموارد! بدك ملخصات أو أسئلة سنوات؟ بس حدد تخصصك والمادة ورح تلاقي كل اشي جاهز.',
            en: 'This is the Resources Bank! Looking for summaries or past papers? Just select your major and course.',
            hint: 'User is looking for study materials. Help them find specific subjects or summaries.'
        },
        '/plans': {
            ar: 'وصلت لصفحة الخطط الدراسية؛ هون "شجرة المواد" لكل تخصص عشان تعرف شو تسجل وتوزع موادك صح.',
            en: 'You are at the Academic Plans page; see the "Course Tree" for each major to plan your registration correctly.',
            hint: 'User is planning their semester. Guide them through the course tree and prerequisites.'
        },
        '/quiz': {
            ar: 'قاعد بتدرس؟ هون بتقدر تختبر معلوماتك بكويزات تفاعلية وتعرف نتيجتك فوراً! جرب كويز بمادة تخصصك هسا.',
            en: 'Studying? Here you can test your knowledge with interactive quizzes and get instant results! Try a quiz for your major now.',
            hint: 'User is in the Quiz/Testing section. Encourage them to try a specific quiz (Calculus, AI, etc.).'
        },
        '/calendar': {
            ar: 'التقويم الجامعي؛ كل المواعيد الرسمية، العطل، والامتحانات موجودة هون عشان ترتب وقتك.',
            en: 'Academic Calendar; all official dates, holidays, and exams are here to help you manage your time.',
            hint: 'User is checking dates. Provide info on holidays or exam schedules.'
        },
        '/grading': {
            ar: 'بدك تحسب معدلك؟ هون حاسبة المعدل الفصلي والتراكمي حسب نظام جامعة البلقاء الجديد (4 نقاط).',
            en: 'Calculating GPS? Here is the Semester and Cumulative GPA calculator based on the new BAU 4.0 system.',
            hint: 'User is calculating grades. Explain the difference between New/Old system or Semester/Cumulative.'
        },
        '/exchange': {
            ar: 'قسم تبادل المواد؛ عندك كتب ما بدك اياها أو بتدور على مراجع؟ هون المكان المناسب للتبادل بين الطلاب.',
            en: 'Materials Exchange; have extra books or looking for references? This is the right place for student swapping.',
            hint: 'User is in the book exchange area. Explain how to list or find items.'
        },
        '/news': {
            ar: 'آخر الأخبار والإعلانات الرسمية؛ خليك دائماً مطلع على شو بصير بالجامعة والكلية.',
            en: 'Latest news and official announcements; stay updated with everything happening at BAU.',
            hint: 'User is checking news. Highlight recent faculty announcements.'
        },
        '/faq': {
            ar: 'عندك سؤال محيرك؟ جمعنالك أكثر الأسئلة الشائعة اللي بتهم الطلاب مع إجاباتها.',
            en: 'Got a question? We collected the most common student FAQs with detailed answers here.',
            hint: 'User is looking for help. Suggest common topics like registration or health insurance.'
        },
        '/about': {
            ar: 'تعرف على قصة "مكانك"! هون معلومات عن فريق العمل وأهدافنا في تطوير رحلتك الدراسية.',
            en: 'Discover the "Makanak" story! Here is info about the team and our goals to enhance your academic journey.',
            hint: 'User wants to know who we are. Mention Hussien Koon and the AI Faculty team.'
        },

    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isTyping]);

    useEffect(() => {
        const currentPath = location.pathname;
        const guide = pageGuides[currentPath] || pageGuides['/'];
        const introMsg = isAr ? guide.ar : guide.en;

        // Reset/Add intro message on page change
        setMessages([{
            id: 'intro-' + Date.now(),
            text: introMsg,
            sender: 'bot',
            timestamp: new Date()
        }]);

        if (!isOpen) {
            setHasUnread(true);
        }
    }, [location, language]);

    const normalizeText = (text) => {
        if (!text) return '';
        return text.toLowerCase().trim()
            .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه')
            .replace(/ى/g, 'ي').replace(/ئ/g, 'ي').replace(/ؤ/g, 'و');
    };

    const findSmartResponse = (query) => {
        const normQuery = normalizeText(query);
        let maxScore = 0;
        let bestResponse = null;

        // 1. Navigation Commands (High Confidence)
        const navTargets = [
            { path: '/grading', keywords: isAr ? ['معدل', 'احسب', 'علامات', 'تخرج'] : ['gpa', 'calculate', 'grade', 'grading'] },
            { path: '/materials', keywords: isAr ? ['مواد', 'ملخصات', 'دوسيات', 'دراسه'] : ['materials', 'study', 'summary', 'files'] },
            { path: '/plans', keywords: isAr ? ['خطه', 'خطة', 'شجره', 'مواد قسم'] : ['plan', 'map', 'tree'] },
            { path: '/calendar', keywords: isAr ? ['تقويم', 'موعد', 'متى', 'عطله'] : ['calendar', 'date', 'holiday'] },
            { path: '/quiz', keywords: isAr ? ['كويز', 'امتحان', 'اختبر'] : ['quiz', 'test', 'exam'] },

            { path: '/', keywords: isAr ? ['رئيسيه', 'بدايه'] : ['home', 'start'] }
        ];

        const goKeywords = isAr ? ['وديني', 'روح', 'افتح', 'بدي'] : ['go', 'open', 'show', 'take me'];

        const matchingTarget = navTargets.find(target =>
            target.keywords.some(k => normQuery === normalizeText(k)) ||
            (target.keywords.some(k => normQuery.includes(normalizeText(k))) && goKeywords.some(gk => normQuery.includes(normalizeText(gk))))
        );

        if (matchingTarget) {
            navigate(matchingTarget.path);
            return { text: isAr ? "على طول! هيني أخذتك عالصفحة اللي سألت عنها 🚀" : "Done! I've taken you to the page you asked for 🚀", score: 150 };
        }

        // 2. Context Questions (High Confidence)
        const contextKeywords = isAr ? ['هون', 'صفحه', 'ايش في', 'شو هاي'] : ['here', 'page', 'what is this', 'where am i'];
        if (contextKeywords.some(k => normQuery.includes(k))) {
            const currentPath = location.pathname;
            const guide = pageGuides[currentPath] || pageGuides['/'];
            return { text: isAr ? `ولا يهمك! إنت حالياً في صفحة: ${guide.ar}` : `You are currently in: ${guide.en}`, score: 120 };
        }

        // 3. Fallback to general NashmiData (Exact match only)
        nashmiData.forEach(item => {
            item.keywords.forEach(k => {
                const normK = normalizeText(k);
                if (normQuery === normK) {
                    maxScore = 100;
                    bestResponse = item.response;
                }
            });
        });

        if (maxScore >= 100) return { text: bestResponse, score: maxScore };

        // Lowest score fallback to trigger AI
        return { text: null, score: 0 };
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = {
            id: 'user-' + Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // 1. First run the smart response logic (Keywords/Nav)
        const { text: localText, score: localScore } = findSmartResponse(userMsg.text);

        // 2. Decide if we need real AI
        // If score is low (conversational), we call Groq
        const isFallback = localScore < 100;

        if (isFallback) {
            const currentPath = location.pathname;
            const guide = pageGuides[currentPath] || pageGuides['/'];
            const context = `${isAr ? guide.ar : guide.en}\nPage Hint: ${guide.hint || ''}\nCurrent Path: ${currentPath}`;

            const aiResult = await chatWithNashmi(userMsg.text, context, messages);

            const botMsg = {
                id: 'bot-' + Date.now(),
                text: aiResult.success ? aiResult.text : (isAr ? aiResult.messageAr : aiResult.messageEn),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } else {
            // Use local keyword/nav response
            setTimeout(() => {
                const botMsg = {
                    id: 'bot-' + Date.now(),
                    text: localText,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMsg]);
            }, 600);
        }

        setIsTyping(false);
    };

    const renderMessageContent = (msg, isPreview = false) => {
        if (!msg.text) return '';

        // For preview bubble, just strip markdown and show text
        if (isPreview) {
            return <p>{msg.text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/\*\*/g, '')}</p>;
        }

        return msg.text.split('\n').map((line, i) => (
            <span key={i} style={{ display: 'block', marginBottom: '4px' }}>
                {line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }

                    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (linkMatch) {
                        const [, label, url] = linkMatch;
                        return (
                            <a
                                key={j}
                                href={url}
                                style={{
                                    color: 'inherit',
                                    textDecoration: 'underline',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (url.startsWith('/')) {
                                        navigate(url);
                                    } else if (url.startsWith('#')) {
                                        const element = document.querySelector(url);
                                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        window.open(url, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                            >
                                {label}
                            </a>
                        );
                    }

                    return part;
                })}
            </span>
        ));
    };

    return (
        <div className={`nashmi-guide-wrapper ${isOpen ? 'chat-open' : ''}`}>
            {isOpen && (
                <div className="nashmi-chat-window glass-card">
                    <div className="chat-header">
                        <div className="bot-info">
                            <span className="bot-avatar">🤖</span>
                            <div className="bot-status">
                                <h4>{isAr ? 'نشمي المساعد' : 'Nashmi Guide'}</h4>
                                <span>{isAr ? 'متصل الآن' : 'Online'}</span>
                            </div>
                        </div>
                        <button className="close-chat" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                                {renderMessageContent(msg)}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-bubble bot typing">
                                <div className="typing-dots"><span></span><span></span><span></span></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-row" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder={isAr ? 'اسأل نشمي...' : 'Ask Nashmi...'}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" disabled={!inputValue.trim()}>
                            {isAr ? 'إرسال' : 'Send'}
                        </button>
                    </form>
                </div>
            )}

            {!isOpen && messages.length > 0 && messages[messages.length - 1].sender === 'bot' && hasUnread && (
                <div className="nashmi-preview-bubble" onClick={() => { setIsOpen(true); setHasUnread(false); }}>
                    {renderMessageContent(messages[messages.length - 1], true)}
                </div>
            )}

            {!isOpen && (
                <>
                    {/* Share Menu Card */}
                    {showShareMenu && (
                        <div className="share-menu-card glass-card" ref={shareMenuRef}>
                            <div className="share-menu-header">
                                <h4>{isAr ? 'مشاركة المنصة' : 'Share Platform'}</h4>
                                <button className="share-menu-close" onClick={() => setShowShareMenu(false)}>×</button>
                            </div>
                            <div className="share-options-grid">
                                <button className="share-opt-btn whatsapp" onClick={() => handleOptionClick('whatsapp')}>
                                    <span className="share-opt-icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 1.966 14.12 .94 11.501.94 6.062.94 1.638 5.31 1.636 10.74c-.001 1.708.452 3.378 1.311 4.848l-.995 3.635 3.705-.969zm13.911-7.72c-.27-.136-1.602-.79-1.85-.882-.25-.093-.43-.138-.612.136-.182.274-.706.882-.865 1.066-.16.183-.318.206-.59.07-2.61-.13-3.625-1.123-4.394-2.45-.19-.327-.02-.504.143-.667.146-.14.318-.372.477-.558.16-.186.213-.318.319-.528.107-.21.053-.394-.027-.53-.08-.136-.612-1.477-.838-2.024-.22-.53-.443-.457-.612-.466-.16-.008-.342-.01-.525-.01-.182 0-.479.068-.729.34-.25.274-.956.934-.956 2.278 0 1.345.979 2.642 1.116 2.827.137.185 1.927 2.942 4.669 4.123 2.742 1.18 2.742.787 3.238.74.496-.048 1.602-.656 1.83-.1.229-.53.229-.988.16-1.116-.07-.127-.25-.203-.52-.34z"/>
                                        </svg>
                                    </span>
                                    <span className="share-opt-label">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                                </button>
                                <button className="share-opt-btn facebook" onClick={() => handleOptionClick('facebook')}>
                                    <span className="share-opt-icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </span>
                                    <span className="share-opt-label">{isAr ? 'فيسبوك' : 'Facebook'}</span>
                                </button>
                                <button className="share-opt-btn instagram" onClick={() => handleOptionClick('instagram')}>
                                    <span className="share-opt-icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                                        </svg>
                                    </span>
                                    <span className="share-opt-label">{isAr ? 'انستغرام' : 'Instagram'}</span>
                                </button>
                                <button className="share-opt-btn telegram" onClick={() => handleOptionClick('telegram')}>
                                    <span className="share-opt-icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M11.944 0C5.344 0 0 5.344 0 12s5.344 12 11.944 12c6.6 0 12-5.344 12-12s-5.4-12-12-12zm5.562 8.161l-1.875 8.828c-.14.629-.514.784-.967.528l-2.86-2.107-1.38 1.327c-.153.153-.282.282-.577.282l.206-2.921 5.316-4.798c.23-.206-.051-.318-.358-.116L8.7 13.064l-2.833-.884c-.615-.192-.628-.615.128-.91l11.083-4.275c.513-.186.96.12.728 1.166z"/>
                                        </svg>
                                    </span>
                                    <span className="share-opt-label">{isAr ? 'تلغرام' : 'Telegram'}</span>
                                </button>
                                <button className="share-opt-btn copy-link" onClick={() => handleOptionClick('copy')}>
                                    <span className="share-opt-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                        </svg>
                                    </span>
                                    <span className="share-opt-label">{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Share button — appears above nashmi */}
                    <button
                        className={`share-fab-btn ${showShareMenu ? 'active' : ''}`}
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        title={isAr ? 'شارك الموقع' : 'Share website'}
                        aria-label={isAr ? 'مشاركة الموقع' : 'Share website'}
                    >
                        <svg className="share-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button>

                    <button
                        className={`nashmi-robot-btn ${hasUnread ? 'pulse' : ''}`}
                        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
                        title={t('nav.nashmi')}
                    >
                        <span className="robot-icon">🤖</span>
                        {hasUnread && <span className="notification-dot"></span>}
                    </button>
                </>
            )}
        </div>
    );
};

export default NashmiGuide;
