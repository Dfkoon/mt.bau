import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './FeedbackPopup.css';

const FeedbackPopup = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleRateNow = () => {
        // Navigate to home and pass state to scroll to testimonials
        navigate('/', { state: { scrollToReviews: true } });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="feedback-popup-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="feedback-popup-card glass-card"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="feedback-icon">⭐</div>
                        <h3 className="feedback-title">
                            {language === 'ar' ? 'ما رأيك في تجربتك؟' : 'How is your experience?'}
                        </h3>
                        <p className="feedback-text">
                            {language === 'ar'
                                ? 'نود سماع رأيك في الموقع لنقوم بتحسينه بشكل مستمر.'
                                : 'We would love to hear your feedback to help us improve constantly.'}
                        </p>

                        <div className="feedback-actions">
                            <button className="btn-rate" onClick={handleRateNow}>
                                {language === 'ar' ? 'شارك رأيك الآن' : 'Rate Us Now'}
                            </button>
                            <button className="btn-later" onClick={onClose}>
                                {language === 'ar' ? 'لاحقاً' : 'Later'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackPopup;
