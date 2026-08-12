import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { faqData } from '../data/faqData';
import './FAQ.css';

const FAQ = () => {
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (id) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    const filterFAQs = () => {
        if (!searchTerm) return faqData;

        const filtered = {};
        Object.keys(faqData).forEach(key => {
            const category = faqData[key];
            const matchingQuestions = category.questions.filter(q =>
                q.q[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.a[language].toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (matchingQuestions.length > 0) {
                filtered[key] = { ...category, questions: matchingQuestions };
            }
        });
        return filtered;
    };

    const displayedFAQs = filterFAQs();
    const categories = Object.keys(displayedFAQs);

    return (
        <div className="faq-page">
            {/* Coming Soon Overlay */}
            <div className="coming-soon-overlay">
                <div className="coming-soon-box">
                    <div className="coming-soon-icon-large">🚀</div>
                    <h1>{language === 'ar' ? 'قريباً' : 'Coming Soon'}</h1>
                    <p>
                        {language === 'ar'
                            ? 'نعمل حالياً على بناء قاعد الأسئلة الشائعة لتغطي كاف استفساراتكم.'
                            : 'We are building the FAQ database to cover all your questions.'}
                    </p>
                    <div className="coming-soon-badge">
                        {language === 'ar' ? 'تحت الصيان' : 'Under Maintenance'}
                    </div>
                </div>
            </div>

            <div className="content-blur-wrapper">
                <div className="faq-hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1454165833767-026cc35a1651?auto=format&fit=crop&q=80')` }}>
                    <div className="hero-overlay"></div>
                    <h1>{language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h1>
                    <p>{language === 'ar' ? 'اعثر على أجوب لأكثر الأسئلة تكراراً' : 'Find answers to common questions'}</p>

                    <div className="faq-search">
                        <input
                            type="text"
                            placeholder={language === 'ar' ? 'ابحث عن سؤال...' : 'Search for a question...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>

                <div className="faq-content">
                    {categories.length === 0 ? (
                        <div className="no-results">
                            <p>{language === 'ar' ? 'لا توجد نتائج مطابق لبحثك' : 'No results found matching your search'}</p>
                        </div>
                    ) : (
                        categories.map(catKey => {
                            const category = displayedFAQs[catKey];
                            return (
                                <div key={catKey} className="faq-category">
                                    <h2>{category.title[language]}</h2>
                                    <div className="faq-list">
                                        {category.questions.map(item => (
                                            <div key={item.id} className={`faq-item ${openIndex === item.id ? 'active' : ''}`}>
                                                <button
                                                    className="faq-question"
                                                    onClick={() => toggleAccordion(item.id)}
                                                >
                                                    {item.q[language]}
                                                    <span className="faq-icon">{openIndex === item.id ? '−' : '+'}</span>
                                                </button>
                                                <AnimatePresence>
                                                    {openIndex === item.id && (
                                                        <motion.div
                                                            className="faq-answer"
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <p>{item.a[language]}</p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
