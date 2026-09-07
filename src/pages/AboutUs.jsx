import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './AboutUs.css';

const AboutUs = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const services = [
        {
            index: '01',
            title: isAr ? 'المصادر الدراسية' : 'Study Resources',
            desc: isAr ? 'محتوى دراسي منظم يساعدك على الوصول إلى ما تحتاجه بسرعة.' : 'Organized study content that helps you find what you need quickly.'
        },
        {
            index: '02',
            title: isAr ? 'التقويم الأكاديمي' : 'Academic Calendar',
            desc: isAr ? 'مواعيد الفصل والامتحانات والفعاليات في عرض واضح ومحدث.' : 'Semester dates, exams, and events in a clear, updated view.'
        },
        {
            index: '03',
            title: isAr ? 'الاختبارات التفاعلية' : 'Interactive Quizzes',
            desc: isAr ? 'أدوات تدريب تساعدك على قياس تقدمك والاستعداد بصورة أفضل.' : 'Practice tools that help you measure progress and prepare better.'
        },
        {
            index: '04',
            title: isAr ? 'المساعد الأكاديمي' : 'Academic Assistant',
            desc: isAr ? 'مساعدة ذكية للوصول إلى الإجابات والمعلومات الأكاديمية.' : 'Smart assistance for finding academic answers and information.'
        },
        {
            index: '05',
            title: isAr ? 'تبادل المواد' : 'Material Exchange',
            desc: isAr ? 'مساحة طلابية لمشاركة الملخصات والمواد بطريقة منظمة.' : 'A student space for sharing summaries and materials in an organized way.'
        },
        {
            index: '06',
            title: isAr ? 'أدوات الطالب' : 'Student Tools',
            desc: isAr ? 'مجموعة أدوات عملية لتسهيل الحياة الجامعية اليومية.' : 'Practical tools designed to simplify everyday university life.'
        }
    ];

    const principles = [
        {
            index: '01',
            title: isAr ? 'وضوح الوصول' : 'Clear Access',
            desc: isAr ? 'نرتب المعلومات والخدمات بحيث تصل إليها بأقل وقت وجهد.' : 'We organize information and services to reduce time and effort.'
        },
        {
            index: '02',
            title: isAr ? 'المعرفة المشتركة' : 'Shared Knowledge',
            desc: isAr ? 'نؤمن بأن مشاركة الخبرة تصنع مجتمعًا طلابيًا أقوى.' : 'We believe shared experience builds a stronger student community.'
        },
        {
            index: '03',
            title: isAr ? 'تطوير مستمر' : 'Continuous Improvement',
            desc: isAr ? 'نستمع للملاحظات ونطوّر المنصة وفق احتياجات الطلاب.' : 'We listen to feedback and evolve around students’ needs.'
        }
    ];

    const roadmap = [
        { done: true, label: isAr ? 'إطلاق المنصة وتوفير المصادر الدراسية' : 'Launch the platform and study resources' },
        { done: true, label: isAr ? 'إضافة التقويم والاختبارات التفاعلية' : 'Add the academic calendar and interactive quizzes' },
        { done: true, label: isAr ? 'تطوير المساعد الأكاديمي وأدوات المعدل' : 'Develop the academic assistant and GPA tools' },
        { done: false, label: isAr ? 'إطلاق إشعارات المواعيد والمهام' : 'Launch date and task notifications' },
        { done: false, label: isAr ? 'تطوير تجربة الهاتف والتطبيق المتكامل' : 'Improve the mobile and full PWA experience' }
    ];

    return (
        <div className="about-page">
            <header className="about-hero">
                <div className="about-hero-overlay"></div>
                <div className="about-hero-content">
                    <p className="about-hero-kicker">{isAr ? 'عن المنصة' : 'ABOUT THE PLATFORM'}</p>
                    <h1 className="about-hero-title">{isAr ? 'مكانك الجامعي' : "Makanak Al-Jami'i"}</h1>
                    <p className="about-hero-subtitle">
                        {isAr
                            ? 'منصة طلابية رقمية لخدمة طلبة جامعة البلقاء التطبيقية.'
                            : 'A digital student platform built for Al-Balqa Applied University students.'}
                    </p>
                </div>
            </header>

            <main className="about-container">
                <section className="about-intro about-section">
                    <div className="about-intro-label">{isAr ? '01 / التعريف' : '01 / OVERVIEW'}</div>
                    <div className="about-intro-content">
                        <h2>{isAr ? 'نقرّب المعرفة إلى الطالب.' : 'We bring knowledge closer to the student.'}</h2>
                        <div>
                            <p>
                                {isAr
                                    ? 'مكانك الجامعي مبادرة طلابية تطوعية تهدف إلى تنظيم الحياة الأكاديمية في منصة واحدة واضحة وسهلة الاستخدام.'
                                    : "Makanak Al-Jami'i is a voluntary student initiative focused on making academic life clearer and easier through one accessible platform."}
                            </p>
                            <p>
                                {isAr
                                    ? 'نجمع المصادر والأدوات والمواعيد التي يحتاجها الطالب، ونطوّرها باستمرار بناءً على التجربة والملاحظات.'
                                    : 'We bring together the resources, tools, and dates students need, improving them continuously through real feedback and use.'}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <div className="section-heading-row">
                        <div className="about-section-label">{isAr ? '02 / ما نقدمه' : '02 / WHAT WE OFFER'}</div>
                        <h2 className="section-title">{isAr ? 'أدوات مصممة ليومك الجامعي.' : 'Tools designed for university life.'}</h2>
                    </div>
                    <div className="services-grid">
                        {services.map((service) => (
                            <article className="service-card" key={service.index}>
                                <span className="card-index">{service.index}</span>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-section principles-section">
                    <div className="principles-heading">
                        <div className="about-section-label">{isAr ? '03 / مبادئنا' : '03 / PRINCIPLES'}</div>
                        <h2 className="section-title">{isAr ? 'بسيط، موثوق، ومتطور.' : 'Simple, reliable, and evolving.'}</h2>
                    </div>
                    <div className="principles-list">
                        {principles.map((principle) => (
                            <article className="principle-row" key={principle.index}>
                                <span className="card-index">{principle.index}</span>
                                <h3>{principle.title}</h3>
                                <p>{principle.desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-section numbers-section">
                    <div className="about-section-label">{isAr ? '04 / نطاق العمل' : '04 / AT A GLANCE'}</div>
                    <div className="numbers-grid">
                        <div><strong>500+</strong><span>{isAr ? 'ملف دراسي' : 'Study files'}</span></div>
                        <div><strong>1200+</strong><span>{isAr ? 'سؤال تفاعلي' : 'Interactive questions'}</span></div>
                        <div><strong>10+</strong><span>{isAr ? 'تخصص وقسم' : 'Majors and departments'}</span></div>
                        <div><strong>24/7</strong><span>{isAr ? 'مساندة أكاديمية' : 'Academic support'}</span></div>
                    </div>
                </section>

                <section className="about-section roadmap-section">
                    <div className="section-heading-row">
                        <div className="about-section-label">{isAr ? '05 / التطوير' : '05 / ROADMAP'}</div>
                        <h2 className="section-title">{isAr ? 'نبني خطوة بعد خطوة.' : 'Building step by step.'}</h2>
                    </div>
                    <div className="roadmap-list">
                        {roadmap.map((item, index) => (
                            <div className={`roadmap-item ${item.done ? 'done' : 'planned'}`} key={index}>
                                <span className="roadmap-status">{item.done ? 'تم' : 'قادم'}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="about-cta">
                    <div>
                        <p className="about-section-label">{isAr ? '06 / شاركنا' : '06 / CONTRIBUTE'}</p>
                        <h2>{isAr ? 'لديك فكرة تحسّن تجربة الطالب؟' : 'Have an idea that improves student life?'}</h2>
                        <p>{isAr ? 'نرحب بالملاحظات والمقترحات التي تساعدنا على تطوير المنصة.' : 'We welcome feedback and ideas that help us improve the platform.'}</p>
                    </div>
                    <a
                        className="about-cta-link"
                        href="https://wa.me/962782935485?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D9%84%D8%AF%D9%8A%20%D9%81%D9%83%D8%B1%D8%A9%20%D8%A3%D9%88%20%D9%85%D9%82%D8%AA%D8%B1%D8%AD%20%D8%AD%D9%88%D9%84%20%D8%A7%D9%84%D9%85%D9%86%D8%B5%D8%A9"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {isAr ? 'تواصل معنا' : 'Get in touch'}
                    </a>
                </section>
            </main>
        </div>
    );
};

export default AboutUs;
