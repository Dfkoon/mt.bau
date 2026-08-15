import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import SmartAdvisor from '../components/SmartAdvisor';
import toast from 'react-hot-toast';
import './AcademicPlans.css';

// Import new plan images
import dataScienceNew from '../assets/plans/data-science-new.png';
import infoSecurityNew from '../assets/plans/info-security-new.png';
import digitalForensicsNew from '../assets/plans/digital-forensics-new.png';
import vrTreeNew from '../assets/plans/vr_tree_new.png';
import aiRoboticsNew from '../assets/plans/ai-robotics-new.png';
import plansHero from '../assets/heros/academic_plans_hero.png';

// Import old (tree) plan images
import dataScienceTree from '../assets/plans/data_science_tree.jpg';
import vrTree from '../assets/plans/vr_tree.jpg';
import cyberTree from '../assets/plans/cyber_tree.jpg';
import aiRoboticsTree from '../assets/plans/ai_robotics_tree.jpg';
import forensicsTree from '../assets/plans/forensics_tree.jpg';

// Expected Career Opportunities Data
const CAREER_DATA = [
    {
        majorId: 'cybersecurity',
        nameAr: 'أمن المعلومات والفضاء الإلكتروني',
        nameEn: 'Info & Cybersecurity',
        icon: '🛡️',
        color: '#ef4444',
        accentBg: 'rgba(239, 68, 68, 0.08)',
        badgeText: '12 مهنة متوقعة',
        careers: [
            { ar: 'أخصائي أمن معلومات', en: 'Information Security Specialist' },
            { ar: 'محلل أمني', en: 'Security Analyst' },
            { ar: 'خبير اختبار الاختراق والقرصنة الأخلاقية', en: 'Penetration Tester / Ethical Hacker' },
            { ar: 'مدير أمن المعلومات التنفيذي', en: 'Chief Information Security Officer (CISO)' },
            { ar: 'مهندس أمن الشبكات', en: 'Network Security Engineer' },
            { ar: 'خبير استجابة للحوادث السيبرانية', en: 'Incident Responder' },
            { ar: 'مستشار أمني سيبراني', en: 'Security Consultant' },
            { ar: 'خبير حماية البيانات والخصوصية', en: 'Data Protection Officer' },
            { ar: 'باحث في الثغرات البرمجية والأمنية', en: 'Vulnerability Researcher' },
            { ar: 'أخصائي أمن الحوسبة السحابية', en: 'Cloud Security Specialist' },
            { ar: 'خبير أمن إنترنت الأشياء', en: 'IoT Security Expert' },
            { ar: 'محقق جرائم إلكترونية', en: 'Cybercrime Investigator' },
        ]
    },
    {
        majorId: 'datascience',
        nameAr: 'علم البيانات والذكاء الاصطناعي',
        nameEn: 'Data Science & AI',
        icon: '📊',
        color: '#3b82f6',
        accentBg: 'rgba(59, 130, 246, 0.08)',
        badgeText: '12 مهنة متوقعة',
        careers: [
            { ar: 'عالم بيانات', en: 'Data Scientist' },
            { ar: 'مهندس بيانات', en: 'Data Engineer' },
            { ar: 'محلل بيانات', en: 'Data Analyst' },
            { ar: 'خبير تعلم الآلة', en: 'Machine Learning Engineer' },
            { ar: 'أخصائي ذكاء اصطناعي', en: 'AI Specialist' },
            { ar: 'مدير قواعد البيانات', en: 'Database Administrator' },
            { ar: 'محلل ذكاء الأعمال', en: 'Business Intelligence Analyst' },
            { ar: 'خبير معالجة اللغة الطبيعية', en: 'NLP Specialist' },
            { ar: 'باحث في البيانات', en: 'Data Researcher' },
            { ar: 'أخصائي تصور وتمثيل البيانات', en: 'Data Visualization Specialist' },
            { ar: 'مهندس نظم البيانات الضخمة', en: 'Big Data Engineer' },
            { ar: 'مستشار تحليلات', en: 'Analytics Consultant' },
        ]
    },
    {
        majorId: 'digitalforensics',
        nameAr: 'التحقيقات الجنائية الرقمية',
        nameEn: 'Digital Forensics',
        icon: '🔍',
        color: '#f59e0b',
        accentBg: 'rgba(245, 158, 11, 0.08)',
        badgeText: '12 مهنة متوقعة',
        careers: [
            { ar: 'محقق أدلة رقمية', en: 'Digital Forensics Investigator' },
            { ar: 'خبير استعادة البيانات المفقودة', en: 'Data Recovery Specialist' },
            { ar: 'محقق جرائم إلكترونية', en: 'Cybercrime Investigator' },
            { ar: 'أخصائي أدلة جنائية رقمية', en: 'Digital Evidence Analyst' },
            { ar: 'خبير تحليل الهواتف الذكية', en: 'Mobile Forensics Expert' },
            { ar: 'محقق في جرائم الاحتيال الإلكتروني', en: 'Fraud Examiner' },
            { ar: 'مختبر أدلة رقمية جنائية', en: 'Forensic Lab Technician' },
            { ar: 'مستشار أمني جنائي رقمي', en: 'Forensic Security Consultant' },
            { ar: 'محقق في جرائم الابتزاز الإلكتروني', en: 'Cyber Extortion Investigator' },
            { ar: 'خبير تحليل شبكات جنائي', en: 'Network Forensics Analyst' },
            { ar: 'محقق في جرائم التشفير والعملات الرقمية', en: 'Cryptocurrency Investigator' },
            { ar: 'خبير التحقيق في انتهاكات الخصوصية', en: 'Privacy Violation Investigator' },
        ]
    },
    {
        majorId: 'vr',
        nameAr: 'الواقع الافتراضي والمعزز',
        nameEn: 'Virtual Reality & AR',
        icon: '🥽',
        color: '#a855f7',
        accentBg: 'rgba(168, 85, 247, 0.08)',
        badgeText: '4 مهن متوقعة',
        careers: [
            { ar: 'مصمم رسومات الحاسوب الثابتة والمتحركة والتفاعلية', en: '2D/3D & Interactive Graphics Designer' },
            { ar: 'مصمم أنظمة الواقع الافتراضي والمحاكاة', en: 'VR Systems & Simulation Designer' },
            { ar: 'مصمم ألعاب إلكترونية ذكية', en: 'Smart Game Developer & Designer' },
            { ar: 'مطور برامج وتطبيقات واقع افتراضي أو معزز', en: 'VR/AR Software Developer' },
        ]
    },
    {
        majorId: 'airobotics',
        nameAr: 'الذكاء الاصطناعي والروبوتات',
        nameEn: 'AI & Robotics',
        icon: '🤖',
        color: '#10b981',
        accentBg: 'rgba(16, 185, 129, 0.08)',
        badgeText: '5 مهن متوقعة',
        careers: [
            { ar: 'أخصائي روبوتات وأتمتة', en: 'Robotics & Automation Specialist' },
            { ar: 'مطور برامج وأنظمة ذكية', en: 'AI Software Developer' },
            { ar: 'مطور نظم مضمنة ذكية', en: 'Smart Embedded Systems Developer' },
            { ar: 'محلل برامج وأنظمة ذكية', en: 'Smart Systems Analyst' },
            { ar: 'باحث في علوم الذكاء الاصطناعي والروبوتات وتطبيقاتها', en: 'AI & Robotics Researcher' },
        ]
    }
];

const AcademicPlans = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [planType, setPlanType] = useState('new'); // 'new' or 'old'
    const [showUploader, setShowUploader] = useState(false);

    // Career section state
    const [activeCareerTab, setActiveCareerTab] = useState('all');
    const [careerSearchQuery, setCareerSearchQuery] = useState('');

    // Old Plans
    const oldPlans = [
        {
            id: 'old-1',
            name: 'علم البيانات',
            nameEn: 'Data Science',
            icon: '📊',
            image: dataScienceTree,
            pdf: 'https://www.bau.edu.jo/bauar/Colleges/AI/media/101.pdf',
            color: '#2196F3'
        },
        {
            id: 'old-2',
            name: 'الواقع الافتراضي',
            nameEn: 'Virtual Reality',
            icon: '🥽',
            image: vrTree,
            pdf: 'https://www.bau.edu.jo/bauar/Colleges/AI/media/VR%20Arabic.pdf',
            color: '#9C27B0'
        },
        {
            id: 'old-3',
            name: 'أمن المعلومات والفضاء الإلكتروني',
            nameEn: 'Cyber Security',
            icon: '🔒',
            image: cyberTree,
            pdf: 'https://www.bau.edu.jo/bauar/Colleges/AI/media/100.pdf',
            color: '#F44336'
        },
        {
            id: 'old-4',
            name: 'الذكاء الاصطناعي والروبوتات',
            nameEn: 'AI & Robotics',
            icon: '🤖',
            image: aiRoboticsTree,
            pdf: 'https://www.bau.edu.jo/bauar/colleges/ai/media/105.pdf',
            color: '#4CAF50'
        },
        {
            id: 'old-5',
            name: 'التحقيقات الجنائية الرقمية',
            nameEn: 'Digital Forensics',
            icon: '🔍',
            image: forensicsTree,
            pdf: 'https://www.bau.edu.jo/bauar/Colleges/AI/media/102.pdf',
            color: '#FF9800'
        }
    ];

    // New Plans (2025/2026)
    const newPlans = [
        {
            id: 'new-1',
            name: 'أمن المعلومات والفضاء الإلكتروني',
            nameEn: 'Info & Cyber Security',
            icon: '🛡️',
            image: infoSecurityNew,
            color: '#F44336',
            status: 'active'
        },
        {
            id: 'new-2',
            name: 'علم البيانات',
            nameEn: 'Data Science',
            icon: '📊',
            image: dataScienceNew,
            color: '#2196F3',
            status: 'active'
        },
        {
            id: 'new-3',
            name: 'التحقيقات الجنائية الرقمية',
            nameEn: 'Digital Forensics',
            icon: '🔍',
            image: digitalForensicsNew,
            color: '#FF9800',
            status: 'active'
        },
        {
            id: 'new-4',
            name: 'الذكاء الاصطناعي والروبوتات',
            nameEn: 'AI & Robotics',
            icon: '🤖',
            image: aiRoboticsNew,
            color: '#4CAF50',
            status: 'active'
        },
        {
            id: 'new-5',
            name: 'الواقع الافتراضي',
            nameEn: 'Virtual Reality',
            icon: '🥽',
            image: vrTreeNew,
            color: '#9C27B0',
            status: 'active'
        }
    ];

    const currentPlans = planType === 'new' ? newPlans : oldPlans;

    const openModal = (plan) => {
        if (plan.status === 'construction') {
            toast(isAr ? 'نعمل حالياً على تحديث هذه الخطة 🛠️' : 'We are currently updating this plan 🛠️', {
                icon: '🚧',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }
        setSelectedPlan(plan);
    };

    const closeModal = () => {
        setSelectedPlan(null);
    };

    // Filter career data based on active tab & search query
    const filteredCareerData = CAREER_DATA.filter(major => {
        if (activeCareerTab !== 'all' && major.majorId !== activeCareerTab) return false;
        return true;
    }).map(major => {
        if (!careerSearchQuery.trim()) return major;
        const q = careerSearchQuery.toLowerCase().trim();
        const matchedCareers = major.careers.filter(c =>
            c.ar.toLowerCase().includes(q) || c.en.toLowerCase().includes(q)
        );
        return { ...major, careers: matchedCareers };
    }).filter(major => major.careers.length > 0);

    const totalCareersCount = CAREER_DATA.reduce((acc, curr) => acc + curr.careers.length, 0);

    return (
        <div className="academic-plans-page">
            {/* Hero Section */}
            <section className="plans-hero" style={{ backgroundImage: `url(${plansHero})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">{t('plans.hero.title')}</h1>
                    <p className="hero-subtitle">{t('plans.hero.subtitle')}</p>
                </div>
            </section>

            {/* Plan Type Toggle */}
            <div className="plan-type-toggle">
                <button
                    className={`toggle-btn ${planType === 'new' ? 'active' : ''}`}
                    onClick={() => setPlanType('new')}
                >
                    <span className="toggle-icon">✨</span>
                    {isAr ? 'الخطط الجديدة (2025)' : 'New Plans (2025)'}
                </button>
                <button
                    className={`toggle-btn ${planType === 'old' ? 'active' : ''}`}
                    onClick={() => setPlanType('old')}
                >
                    <span className="toggle-icon">📜</span>
                    {isAr ? 'الخطط القديمة' : 'Old Plans'}
                </button>
            </div>

            {/* Plans Grid */}
            <div className="plans-container">
                <div className="section-header">
                    <h2>
                        {planType === 'new' ? (isAr ? 'الخطط الشجرية الحديثة' : 'Modern Tree Plans') : (isAr ? 'الخطط الدراسية السابقة' : 'Previous Academic Plans')}
                    </h2>
                    <p>
                        {planType === 'new'
                            ? (isAr ? 'هذه هي الخطط المعتمدة للعام الدراسي 2025/2026' : 'These are the approved plans for the 2025/2026 academic year')
                            : (isAr ? 'هذه الخطط للطلاب المقبولين في الأعوام السابقة' : 'These plans are for students admitted in previous years')}
                    </p>
                </div>

                <div className="plans-grid">
                    {currentPlans.map(plan => (
                        <div
                            key={plan.id}
                            className={`plan-card glass-card ${plan.status === 'construction' ? 'construction' : ''}`}
                            onClick={() => openModal(plan)}
                            style={{ '--plan-color': plan.color }}
                        >
                            <div className="plan-icon">{plan.icon}</div>
                            <h3 className="plan-name">{isAr ? plan.name : plan.nameEn}</h3>
                            <p className="plan-name-en">{isAr ? plan.nameEn : plan.name}</p>

                            <div className={`plan-badge ${plan.status === 'construction' ? 'badge-warning' : 'badge-new'}`}>
                                {plan.status === 'construction'
                                    ? (isAr ? 'قيد التحديث' : 'Updating')
                                    : (planType === 'new' ? (isAr ? 'جديد 2025' : 'New 2025') : (isAr ? 'قديم' : 'Old'))}
                            </div>

                            <button className="view-btn">
                                {plan.status === 'construction'
                                    ? (isAr ? 'قريباً' : 'Coming Soon')
                                    : (t('plans.btn.view') + ' 👁️')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* CAREERS & JOB OPPORTUNITIES SECTION (المهن والفرص الوظيفية المتوقعة) */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            <section className="careers-section">
                <div className="careers-container">
                    <div className="careers-header">
                        <div className="careers-badge">
                            <span>💼</span> {isAr ? 'دليل سوق العمل والوظائف' : 'Career & Job Guide'}
                        </div>
                        <h2 className="careers-title">
                            {isAr ? 'المهن والفرص الوظيفية المتوقعة خريجي كل تخصص' : 'Expected Careers & Job Roles by Major'}
                        </h2>
                        <p className="careers-subtitle">
                            {isAr
                                ? 'استكشف آفاق المستقبل الوظيفي والمسميات المهنية المستهدفة لكل تخصص من تخصصات كلية الذكاء الاصطناعي'
                                : 'Explore future career prospects and targeted job titles for each AI Faculty specialization'}
                        </p>
                    </div>

                    {/* Filter Controls: Tabs & Search */}
                    <div className="careers-controls">
                        <div className="careers-tabs">
                            <button
                                className={`career-tab-btn ${activeCareerTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveCareerTab('all')}
                            >
                                🌟 {isAr ? 'جميع التخصصات' : 'All Majors'} ({totalCareersCount})
                            </button>
                            {CAREER_DATA.map(m => (
                                <button
                                    key={m.majorId}
                                    className={`career-tab-btn ${activeCareerTab === m.majorId ? 'active' : ''}`}
                                    onClick={() => setActiveCareerTab(m.majorId)}
                                    style={{ '--tab-color': m.color }}
                                >
                                    <span>{m.icon}</span> {isAr ? m.nameAr : m.nameEn}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="career-search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                value={careerSearchQuery}
                                onChange={(e) => setCareerSearchQuery(e.target.value)}
                                placeholder={isAr ? 'ابحث عن مسمى وظيفي (مثال: محقق، أخصائي، Analyst)...' : 'Search for job title (e.g. Analyst, Engineer)...'}
                            />
                            {careerSearchQuery && (
                                <button className="clear-search-btn" onClick={() => setCareerSearchQuery('')}>✕</button>
                            )}
                        </div>
                    </div>

                    {/* Careers Display Grid */}
                    {filteredCareerData.length === 0 ? (
                        <div className="careers-empty-state glass-card">
                            <span className="empty-icon">🔎</span>
                            <h3>{isAr ? 'لم نثمل على نتائج مطابقة لبحثك' : 'No matching careers found'}</h3>
                            <p>{isAr ? 'جرب البحث بمفردات أخرى أو اختر تخصصاً آخر من القائمة' : 'Try searching with different terms or select another major'}</p>
                            <button className="reset-search-btn" onClick={() => { setCareerSearchQuery(''); setActiveCareerTab('all'); }}>
                                🔄 {isAr ? 'إعادة إظهار الكل' : 'Reset View'}
                            </button>
                        </div>
                    ) : (
                        <div className="careers-majors-wrapper">
                            {filteredCareerData.map(major => (
                                <div key={major.majorId} className="major-careers-card glass-card" style={{ '--major-color': major.color }}>
                                    <div className="major-card-header" style={{ background: major.accentBg }}>
                                        <div className="major-title-group">
                                            <span className="major-header-icon">{major.icon}</span>
                                            <div>
                                                <h3 className="major-header-title">{isAr ? major.nameAr : major.nameEn}</h3>
                                                <span className="major-header-sub">{isAr ? major.nameEn : major.nameAr}</span>
                                            </div>
                                        </div>
                                        <span className="major-count-badge" style={{ background: major.color }}>
                                            {major.careers.length} {isAr ? 'مهنة' : 'careers'}
                                        </span>
                                    </div>

                                    <div className="careers-grid">
                                        {major.careers.map((career, idx) => (
                                            <div key={idx} className="career-item-pill">
                                                <span className="career-number" style={{ color: major.color }}>
                                                    #{String(idx + 1).padStart(2, '0')}
                                                </span>
                                                <div className="career-titles">
                                                    <strong className="career-ar">{career.ar}</strong>
                                                    <span className="career-en">{career.en}</span>
                                                </div>
                                                <span className="career-arrow">✦</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Smart Advisor Section */}
            <SmartAdvisor />

            {/* Info Banner */}
            <div className="info-banner glass-card" style={{ marginTop: '5rem' }}>
                <h3>{t('plans.note.title')}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{t('plans.note.text')}</p>
            </div>

            {/* Modal */}
            {selectedPlan && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeModal}>✕</button>
                        <div className="modal-header">
                            <span className="modal-icon">{selectedPlan.icon}</span>
                            <h2>{isAr ? selectedPlan.name : selectedPlan.nameEn}</h2>
                            <p>{isAr ? selectedPlan.nameEn : selectedPlan.name}</p>
                            <span className="modal-badge">
                                {planType === 'new' ? '2025 ✨' : 'Old version 📜'}
                            </span>
                        </div>
                        <div className="modal-body">
                            {selectedPlan.image && (
                                <img
                                    src={selectedPlan.image}
                                    alt={selectedPlan.name}
                                    className="plan-image"
                                />
                            )}
                            <div className="image-actions">
                                {selectedPlan.image && (
                                    <>
                                        <a
                                            href={selectedPlan.image}
                                            download={`${selectedPlan.nameEn}-${planType}.png`}
                                            className="download-btn"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {t('plans.btn.download')}
                                        </a>
                                        <a
                                            href={selectedPlan.image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="open-btn"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {t('plans.btn.open')}
                                        </a>
                                    </>
                                )}
                                {selectedPlan.pdf && (
                                    <a
                                        href={selectedPlan.pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pdf-btn"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        📄 {isAr ? 'الخطة التفصيلية (PDF)' : 'Detailed Plan (PDF)'}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* File Uploader */}
            {showUploader && <FileUploader onClose={() => setShowUploader(false)} />}
        </div>
    );
};

export default AcademicPlans;
