import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './AboutUs.css';

const AboutUs = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const features = [
        {
            icon: '📚',
            title: isAr ? 'مواد دراسي' : 'Study Materials',
            desc: isAr ? 'ملصات وموارد تعليمي لجميع المواد' : 'Summaries and educational resources for all subjects'
        },
        {
            icon: '📅',
            title: isAr ? 'التقويم الأكاديمي' : 'Academic Calendar',
            desc: isAr ? 'جدول المواعيد والأحداث الجامعي' : 'Schedule of university dates and events'
        },
        {
            icon: '✍️',
            title: isAr ? 'اتبارات تفاعلي' : 'Interactive Quizzes',
            desc: isAr ? 'اتبارات تدريبي لتقييم مستواك' : 'Practice tests to assess your level'
        },
        {
            icon: '🤖',
            title: isAr ? 'مساعد نشمي الذكي' : 'Nashmi AI Assistant',
            desc: isAr ? 'مساعد ذكي للإجاب على استفساراتك' : 'Smart assistant to answer your questions'
        },
        {
            icon: '🔄',
            title: isAr ? 'تبادل المواد' : 'Material Exchange',
            desc: isAr ? 'منص لتبادل الملصات والموارد' : 'Platform to exchange summaries and resources'
        },
        {
            icon: '🖐️',
            title: isAr ? 'بصم مكانك الجامعي' : "Makanak Al-Jami'i's Touch",
            desc: isAr ? 'مواقع وأدوات مفيد للطلاب' : 'Useful sites and tools for students'
        }
    ];

    const goals = [
        {
            icon: '🎯',
            title: isAr ? 'تسهيل الوصول للمعلومات' : 'Easy Access to Information',
            desc: isAr ? 'جمع كل ما يحتاجه الطالب في مكان واحد' : 'Gathering everything a student needs in one place'
        },
        {
            icon: '🤝',
            title: isAr ? 'بناء مجتمع طلابي' : 'Building Student Community',
            desc: isAr ? 'تشجيع التعاون وتبادل المعرف بين الطلاب' : 'Encouraging collaboration and knowledge sharing among students'
        },
        {
            icon: '💡',
            title: isAr ? 'الابتكار والتطوير' : 'Innovation & Development',
            desc: isAr ? 'استدام أحدث التقنيات لتحسين التجرب التعليمي' : 'Using latest technologies to improve educational experience'
        },
        {
            icon: '🌟',
            title: isAr ? 'التميز الأكاديمي' : 'Academic Excellence',
            desc: isAr ? 'مساعد الطلاب على تحقيق أفضل النتائج' : 'Helping students achieve the best results'
        }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80')` }}>
                <div className="about-hero-overlay"></div>
                <div className="about-hero-content">
                    <h1 className="about-hero-title">
                        {isAr ? 'من نحن 🎓' : 'About Us 🎓'}
                    </h1>
                    <p className="about-hero-subtitle">
                        {isAr
                            ? 'منص طلابي شامل لدم طلاب جامع البلقاء التطبيقي'
                            : 'A comprehensive student platform serving Al-Balqa Applied University students'}
                    </p>
                </div>
            </div>

            <div className="about-container">
                {/* Who We Are */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            {isAr ? '🌟 من نحن' : '🌟 Who We Are'}
                        </h2>
                    </div>
                    <div className="about-content glass-card">
                        <p className="about-text">
                            {isAr
                                ? 'مشروع "مكانك الجامعي" هو مبادر طلابي تطوعي بدأت من فكر بسيط: كيف يمكننا تسهيل الحيا الجامعي على الطلاب؟ من هنا انطلقنا لبناء منص شامل تجمع كل ما يحتاجه الطالب في مكان واحد - من المواد الدراسي والاتبارات التفاعلي، إلى التقويم الأكاديمي والمساعد الذكي.'
                                : "Makanak Al-Jami'i is a voluntary student initiative that started from a simple idea: How can we make university life easier for students? From here, we set out to build a comprehensive platform that brings together everything a student needs in one place - from study materials and interactive tests, to the academic calendar and smart assistant."}
                        </p>
                        <p className="about-text">
                            {isAr
                                ? 'نحن نؤمن بأن التعليم يجب أن يكون متاحاً وسهل الوصول للجميع. لذلك، قمنا بتطوير هذه المنص باستدام أحدث التقنيات لتوفير تجرب مستدم سلس ومريح.'
                                : 'We believe that education should be accessible and easy to reach for everyone. Therefore, we developed this platform using the latest technologies to provide a smooth and comfortable user experience.'}
                        </p>
                    </div>
                </section>

                {/* What We Offer */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            {isAr ? '🎁 ماذا نقدم' : '🎁 What We Offer'}
                        </h2>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card glass-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-desc">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Our Goals */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            {isAr ? '🎯 أهدافنا' : '🎯 Our Goals'}
                        </h2>
                    </div>
                    <div className="goals-grid">
                        {goals.map((goal, index) => (
                            <div key={index} className="goal-card glass-card">
                                <div className="goal-icon">{goal.icon}</div>
                                <h3 className="goal-title">{goal.title}</h3>
                                <p className="goal-desc">{goal.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>


                {/* Platform Stats */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            {isAr ? '📈 أرقام مكانك' : '📈 Makanak in Numbers'}
                        </h2>
                    </div>
                    <div className="about-stats-grid">
                        {[
                            { num: '500+', labelAr: 'ملف دراسي', labelEn: 'Study Files' },
                            { num: '1200+', labelAr: 'سؤال تفاعلي', labelEn: 'Interactive Questions' },
                            { num: '10+', labelAr: 'تصص وقسم', labelEn: 'Majors & Departments' },
                            { num: '24/7', labelAr: 'مساعد نشمي', labelEn: 'Nashmi AI Support' },
                        ].map((s, i) => (
                            <div key={i} className="about-stat-card glass-card">
                                <span className="stat-big-num">{s.num}</span>
                                <span className="stat-label">{isAr ? s.labelAr : s.labelEn}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Roadmap */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            {isAr ? '🗺️ ارط الطريق' : '🗺️ Roadmap'}
                        </h2>
                        <p className="section-subtitle">
                            {isAr ? 'ما أنجزناه وما ننوي إضافته' : 'What we accomplished and what we plan to add'}
                        </p>
                    </div>
                    <div className="about-roadmap">
                        {[
                            { done: true, labelAr: 'إطلاق المنص وتوفير المواد الدراسي', labelEn: 'Platform launch with study materials' },
                            { done: true, labelAr: 'الكويز التفاعلي مع تصحيح فوري', labelEn: 'Interactive quiz with instant grading' },
                            { done: true, labelAr: 'مساعد نشمي الذكي + محادث محفوظ', labelEn: 'Nashmi AI assistant with chat memory' },
                            { done: true, labelAr: 'حاسب المعدل ومطط المعدل الهدف', labelEn: 'GPA calculator & Target GPA planner' },
                            { done: true, labelAr: 'مؤقت الدراس (بومودورو) بدال صفح الكويز', labelEn: 'Study timer (Pomodoro) inside quiz page' },
                            { done: false, labelAr: 'إشعارات المهام والامتحانات القادم', labelEn: 'Task & exam reminders notifications' },
                            { done: false, labelAr: 'نس الهاتف المتكامل (PWA كامل)', labelEn: 'Full mobile app (complete PWA)' },
                            { done: false, labelAr: 'لوح تحليلات متقدم للطلاب', labelEn: 'Advanced student analytics dashboard' },
                        ].map((item, i) => (
                            <div key={i} className={`roadmap-item ${item.done ? 'done' : 'planned'}`}>
                                <span className="roadmap-dot">{item.done ? '✅' : '🔜'}</span>
                                <span className="roadmap-text">{isAr ? item.labelAr : item.labelEn}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact/Contribute */}
                <section className="about-section">
                    <div className="cta-card glass-card">
                        <h2 className="cta-title">
                            {isAr ? '💬 تواصل معنا' : '💬 Get in Touch'}
                        </h2>
                        <p className="cta-text">
                            {isAr
                                ? 'لديك اقتراح؟ وجدت مشكل؟ تريد المساهم في تطوير المنص؟ نحن نرحب بجميع الأفكار والملاحظات!'
                                : 'Have a suggestion? Found a problem? Want to contribute to the platform? We welcome all ideas and feedback!'}
                        </p>
                        <div className="cta-buttons">
                            <a href="mailto:contact@makanak.edu" className="cta-btn primary">
                                {isAr ? '📧 راسلنا' : '📧 Email Us'}
                            </a>
                            <a href="/feedback" className="cta-btn secondary">
                                {isAr ? '💭 شاركنا رأيك' : '💭 Share Feedback'}
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
