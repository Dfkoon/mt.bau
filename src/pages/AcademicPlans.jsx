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

const AcademicPlans = () => {
    const { t, language } = useLanguage();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [planType, setPlanType] = useState('new'); // 'new' or 'old'
    const [showUploader, setShowUploader] = useState(false);

    // Old Plans (from previous code, marked as Old)
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
            name: 'أمن معلومات والفضاء الإلكتروني',
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
            name: 'تحقيقات جنائي رقمي',
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
            name: 'التحقيقات الجنائي الرقمي',
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
            toast(language === 'ar' ? 'نعمل حالياً على تحديث هذه الط 🛠️' : 'We are currently updating this plan 🛠️', {
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
                    {language === 'ar' ? 'الخطط الجديد (2025)' : 'New Plans (2025)'}
                </button>
                <button
                    className={`toggle-btn ${planType === 'old' ? 'active' : ''}`}
                    onClick={() => setPlanType('old')}
                >
                    <span className="toggle-icon">📜</span>
                    {language === 'ar' ? 'الخطط القديم' : 'Old Plans'}
                </button>
            </div>

            {/* Plans Grid */}
            <div className="plans-container">
                <div className="section-header">
                    <h2>
                        {planType === 'new' ? (language === 'ar' ? 'الخطط الشجري الحديث' : 'Modern Tree Plans') : (language === 'ar' ? 'الخطط الدراسي السابق' : 'Previous Academic Plans')}
                    </h2>
                    <p>
                        {planType === 'new'
                            ? (language === 'ar' ? 'هذه هي الخطط المعتمد للعام الدراسي 2025/2026' : 'These are the approved plans for the 2025/2026 academic year')
                            : (language === 'ar' ? 'هذه الخطط للطلاب المقبولين في الأعوام السابق' : 'These plans are for students admitted in previous years')}
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
                            <h3 className="plan-name">{language === 'ar' ? plan.name : plan.nameEn}</h3>
                            <p className="plan-name-en">{language === 'ar' ? plan.nameEn : plan.name}</p>

                            <div className={`plan-badge ${plan.status === 'construction' ? 'badge-warning' : 'badge-new'}`}>
                                {plan.status === 'construction'
                                    ? (language === 'ar' ? 'قيد التحديث' : 'Updating')
                                    : (planType === 'new' ? (language === 'ar' ? 'جديد 2025' : 'New 2025') : (language === 'ar' ? 'قديم' : 'Old'))}
                            </div>

                            <button className="view-btn">
                                {plan.status === 'construction'
                                    ? (language === 'ar' ? 'قريباً' : 'Coming Soon')
                                    : (t('plans.btn.view') + ' 👁️')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

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
                            <h2>{language === 'ar' ? selectedPlan.name : selectedPlan.nameEn}</h2>
                            <p>{language === 'ar' ? selectedPlan.nameEn : selectedPlan.name}</p>
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
                                        📄 {language === 'ar' ? 'الط التفصيلي (PDF)' : 'Detailed Plan (PDF)'}
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
