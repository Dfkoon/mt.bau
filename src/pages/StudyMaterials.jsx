import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { coursesData, categories, faculties } from '../data/coursesData';
import { Link, useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import MaterialStatusChecker from '../components/MaterialStatusChecker';
import { getQuizForCourse } from '../data/quizMapping';
import { logMaterialDownload } from '../services/analyticsService';
import './StudyMaterials.css';
import '../pages/AcademicPlans.css'; // Importing for CTA styles if needed, though they should be in index.css

const StudyMaterials = () => {
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const [selectedFaculty, setSelectedFaculty] = useState('ai');
    const [selectedSpecialization, setSelectedSpecialization] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchScope, setSearchScope] = useState('category'); // 'category', 'faculty', 'all'
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [showUploader, setShowUploader] = useState(false);

    // Icons mapping for specializations to give them a premium look
    const specIcons = {
        df: '🕵️',
        cyber: '🔒',
        ai_robo: '🤖',
        vr: '🥽',
        ds: '📊',
        cs: '💻',
        cga: '🎨',
        cis: '🗄️',
        se: '🏗️'
    };

    const faculty = faculties.find(f => f.id === selectedFaculty) || faculties[0];

    // Reset specialization when faculty changes
    const handleFacultyChange = (facultyId) => {
        const newFaculty = faculties.find(f => f.id === facultyId);
        setSelectedFaculty(facultyId);
        setSelectedCategory('mandatoryUniversity');
        setSelectedSpecialization(newFaculty?.specializations?.[0]?.id || null);
        setExpandedCourse(null);
    };

    const availableCategories = categories.filter(cat => {
        if (cat.faculty === 'all') return true;
        if (cat.faculty === selectedFaculty) {
            if (cat.specialization) {
                return cat.specialization === selectedSpecialization;
            }
            return true;
        }
        return false;
    });

    const getCoursesForSearch = (forceGlobal = false) => {
        const isSearching = searchQuery.trim().length > 0;

        if ((isSearching && searchScope === 'all') || forceGlobal === 'all') {
            return categories.flatMap(cat =>
                (coursesData[cat.id] || [])
                    .filter(course => !course.specialization || course.specialization === selectedSpecialization)
                    .map(course => ({
                        ...course,
                        categoryId: cat.id,
                        categoryName: language === 'ar' ? cat.name : cat.nameEn
                    }))
            );
        }

        if ((isSearching && (searchScope === 'faculty' || forceGlobal === true)) || !selectedCategory) {
            return availableCategories.flatMap(cat =>
                (coursesData[cat.id] || [])
                    .filter(course => !course.specialization || course.specialization === selectedSpecialization)
                    .map(course => ({
                        ...course,
                        categoryId: cat.id,
                        categoryName: language === 'ar' ? cat.name : cat.nameEn
                    }))
            );
        }

        return (coursesData[selectedCategory] || [])
            .filter(course => !course.specialization || course.specialization === selectedSpecialization)
            .map(course => ({
                ...course,
                categoryId: selectedCategory
            }));
    };

    const filteredCourses = getCoursesForSearch().filter(course => {
        const courseName = language === 'ar' ? course.name : (course.nameEn || course.name);
        return courseName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const toggleCourse = (uniqueId) => {
        setExpandedCourse(expandedCourse === uniqueId ? null : uniqueId);
    };

    const getResourceIcon = (type) => {
        const icons = {
            pdf: '📄', pdf2: '📄', pdf3: '📄', slides: '📊', book: '📚', summary: '📝', summary2: '📝', summary3: '📝', summary4: '📝',
            questions: '❓', questions2: '❓', questions3: '❓', solutions: '✅', video: '🎥', video2: '🎥', video3: '🎥',
            quiz: '📋', interactive_quiz: '🎯', cisco: '🌐', link: '🔗', assignments: '📝', notes: '🗒️', notebook: '📓', syllabus: '📅', projects: '🏗️', charts: '📊'
        };
        return icons[type] || '📎';
    };

    const getResourceLabel = (type) => {
        const baseType = type.replace(/\d+$/, '');
        const label = t(`resource.${baseType}`) || baseType;
        const number = type.match(/\d+$/);
        return number ? `${label} ${number[0]}` : label;
    };

    const handleSuggestionClick = (course) => {
        setSearchQuery(language === 'ar' ? course.name : (course.nameEn || course.name));
        setShowSuggestions(false);

        const category = categories.find(c => c.id === course.categoryId);
        if (!category) return;

        if (category.faculty !== 'all' && category.faculty !== selectedFaculty) {
            setSelectedFaculty(category.faculty);
            if (category.specialization) {
                setSelectedSpecialization(category.specialization);
            }
        } else if (category.specialization && category.specialization !== selectedSpecialization) {
            setSelectedSpecialization(category.specialization);
        }

        setSelectedCategory(course.categoryId);

        setTimeout(() => {
            const courseId = `course-${course.categoryId}-${course.id}`;
            const element = document.getElementById(courseId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setExpandedCourse(courseId);
            }
        }, 300);
    };

    return (
        <div className="study-materials-page">
            <section className="materials-hero" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${faculty.bg})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">{language === 'ar' ? faculty.name : faculty.nameEn}</h1>
                    <p className="hero-subtitle">{t('materials.hero.subtitle')}</p>
                </div>
            </section>

            <div className="faculty-switcher">
                {faculties.map(f => (
                    <button key={f.id} className={`faculty-btn ${selectedFaculty === f.id ? 'active' : ''}`} onClick={() => handleFacultyChange(f.id)}>
                        <span className="faculty-label">{language === 'ar' ? f.name : f.nameEn}</span>
                    </button>
                ))}
            </div>

            {faculty.specializations && faculty.specializations.length > 0 && (
                <div className="specialization-switcher fade-in">
                    <div className="major-selection-alert fade-in">
                        <div className="alert-icon">💡</div>
                        <div className="alert-text">{language === 'ar' ? 'يرجى اختيار تخصصك أولاً' : 'Please select your major first'}</div>
                    </div>
                    <div className="spec-options-grid">
                        {faculty.specializations.map(spec => (
                            <motion.div
                                key={spec.id}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className={`spec-card ${selectedSpecialization === spec.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedSpecialization(spec.id);
                                    setSelectedCategory('mandatoryUniversity');
                                    setExpandedCourse(null);
                                }}
                            >
                                <div className="spec-card-icon">{specIcons[spec.id] || '📚'}</div>
                                <span className="spec-card-name">{language === 'ar' ? spec.name : spec.nameEn}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <div className="material-status-section">
                <div className="section-header">
                    <h2>{language === 'ar' ? 'تابع حالة المواد الخاصة بك' : 'Quickly Track Your Material Status'}</h2>
                    <p>
                        {language === 'ar'
                            ? 'استخدم رقم الهاتف المسجل لديك لتعرف بسرعة حالة المواد التي تبرعت بها أو حجزتها.'
                            : 'Use your registered phone number to quickly see the status of materials you donated or booked.'}
                    </p>
                </div>
                <MaterialStatusChecker isAr={language === 'ar'} />
            </div>

            <div className="search-container">
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder={t('materials.search.placeholder')}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                        onFocus={() => setShowSuggestions(true)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>

                {showSuggestions && searchQuery.trim().length > 0 && (
                    <div className="search-suggestions glass-card fade-in">
                        {filteredCourses.slice(0, 8).map(course => (
                            <div key={`${course.categoryId}-${course.id}`} className="suggestion-item" onClick={() => handleSuggestionClick(course)}>
                                <span className="suggestion-icon">{course.icon}</span>
                                <div className="suggestion-info">
                                    <span className="suggestion-name">{language === 'ar' ? course.name : (course.nameEn || course.name)}</span>
                                    <span className="suggestion-category">{course.categoryName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="search-scope-selector">
                    <button
                        className={`scope-btn ${searchScope === 'category' ? 'active' : ''}`}
                        onClick={() => setSearchScope('category')}
                    >
                        {t('materials.search_scope.category')}
                    </button>
                    <button
                        className={`scope-btn ${searchScope === 'faculty' ? 'active' : ''}`}
                        onClick={() => setSearchScope('faculty')}
                    >
                        {t('materials.search_scope.faculty')}
                    </button>
                    <button
                        className={`scope-btn ${searchScope === 'all' ? 'active' : ''}`}
                        onClick={() => setSearchScope('all')}
                    >
                        {t('materials.search_scope.all')}
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="category-tabs">
                {availableCategories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedCategory(cat.id);
                            setExpandedCourse(null);
                        }}
                        style={{
                            '--category-color': cat.color
                        }}
                    >
                        {language === 'ar' ? cat.name : (cat.nameEn || cat.name)}
                    </button>
                ))}
            </div>

            {/* Courses Grid */}
            <div className="courses-container">
                {filteredCourses.length === 0 ? (
                    <div className="no-results">
                        <span className="no-results-icon">🔍</span>
                        <h3>{t('materials.no_results.title')}</h3>
                        <p>{t('materials.no_results.text')}</p>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {filteredCourses.map(course => {
                            const courseUniqueId = `${course.categoryId}-${course.id}`;
                            return (
                                <div
                                    key={courseUniqueId}
                                    id={`course-${courseUniqueId}`}
                                    className={`course-card glass-card ${expandedCourse === courseUniqueId ? 'expanded' : ''}`}
                                    onClick={() => toggleCourse(courseUniqueId)}
                                >
                                    <div className="course-header">
                                        <div className="course-icon">{course.icon}</div>
                                        <div className="course-info">
                                            <h3 className="course-name">
                                                {language === 'ar' ? course.name : (course.nameEn || course.name)}
                                            </h3>
                                            {course.categoryName && (
                                                <span className="course-category-tag">{course.categoryName}</span>
                                            )}
                                        </div>
                                        <span className="expand-icon">◀</span>
                                    </div>

                                    {expandedCourse === courseUniqueId && (Object.keys(course.files).length > 0 || getQuizForCourse(course)) && (
                                        <div className="course-links">
                                            {Object.entries(course.files).map(([type, url]) => (
                                                <a
                                                    key={type}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`resource-link ${type}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        logMaterialDownload(
                                                            language === 'ar' ? (course.nameAr || course.name) : course.name,
                                                            getResourceLabel(type)
                                                        );
                                                    }}
                                                >
                                                    <span className="link-icon">{getResourceIcon(type)}</span>
                                                    <span>{getResourceLabel(type)}</span>
                                                </a>
                                            ))}

                                            {/* Interactive Quiz Button */}
                                            {getQuizForCourse(course) && (
                                                <button
                                                    className="resource-link interactive_quiz"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/quiz#${getQuizForCourse(course)}`);
                                                    }}
                                                >
                                                    <span className="link-icon">🎯</span>
                                                    <span>{t('resource.interactive_quiz')}</span>
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {expandedCourse === courseUniqueId && Object.keys(course.files).length === 0 && !getQuizForCourse(course) && (
                                        <div className="course-links">
                                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                                                {t('materials.no_sources')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Unified CTA Section */}
                <div className="plans-cta-section fade-in" style={{ marginTop: '4rem' }}>
                    <div className="quiz-contribution-container">
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
                </div>

                {/* Link to Academic Plans */}
                <div className="info-banner glass-card" style={{ marginTop: '2rem' }}>
                    <h3>{language === 'ar' ? 'ملاحظة هامة' : 'Important Note'}</h3>
                    <p>
                        {language === 'ar'
                            ? 'إذا كنت تبحث عن الخطط الدراسية الشجرية المعتمدة (2025)، يمكنك العثور عليها في صفحة الخطط الدراسية.'
                            : 'If you are looking for the approved academic tree plans (2025), you can find them in the Academic Plans page.'}
                    </p>
                    <Link to="/plans" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                        {language === 'ar' ? 'انتقل إلى الخطط الدراسية' : 'Go to Academic Plans'}
                    </Link>
                </div>

                {/* File Uploader */}
                {showUploader && <FileUploader onClose={() => setShowUploader(false)} />}
            </div>
        </div>
    );
};

export default StudyMaterials;
