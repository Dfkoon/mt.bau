import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { nashmiData } from '../data/nashmiData';
import { chatWithNashmi } from '../services/aiService';
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

    const handleShare = async () => {
        const shareData = {
            title: SITE_NAME,
            text: isAr
                ? 'اكتشف مكانك الجامعي — منصة طلاب جامعة البلقاء التطبيقية 🎓'
                : 'Discover MT.BAU — The student platform for BAU students 🎓',
            url: SITE_URL
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(SITE_URL);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2200);
            }
        } catch { /* user cancelled */ }
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
                    {/* Share button — appears above nashmi */}
                    <button
                        className="share-fab-btn"
                        onClick={handleShare}
                        title={isAr ? 'شارك الموقع' : 'Share website'}
                        aria-label={isAr ? 'مشاركة الموقع' : 'Share website'}
                    >
                        {shareCopied
                            ? <span className="share-fab-icon">✅</span>
                            : <svg className="share-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3" />
                                <circle cx="6" cy="12" r="3" />
                                <circle cx="18" cy="19" r="3" />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                              </svg>
                        }
                        {shareCopied && (
                            <span className="share-toast">
                                {isAr ? 'تم نسخ الرابط!' : 'Link copied!'}
                            </span>
                        )}
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
