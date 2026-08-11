import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './GlobalSearchModal.css';

const SEARCH_ITEMS = [
  // Pages
  { id: 'p-materials', titleAr: 'المواد الدراسي والدوسيات', titleEn: 'Study Materials & Handouts', categoryAr: 'صفح', categoryEn: 'Page', link: '/materials', icon: '📚', keywords: 'مواد ط دوسي تليص اسئل بكالوريوس دبلوم' },
  { id: 'p-plans', titleAr: 'الطط الدراسي التفاعلي', titleEn: 'Interactive Academic Plans', categoryAr: 'صفح', categoryEn: 'Page', link: '/plans', icon: '🗺️', keywords: 'ط طط تصص ساعات مواد اجباري اتياري' },
  { id: 'p-grading', titleAr: 'حاسب المعدل والنظام الأكاديمي', titleEn: 'GPA Calculator & Grading System', categoryAr: 'أدا', categoryEn: 'Tool', link: '/grading', icon: '', keywords: 'معدل حساب نقاط تقدير فصلي تراكمي علامات' },
  { id: 'p-quiz', titleAr: 'بنك الأسئل الشامل والاتبارات', titleEn: 'Question Bank & Quizzes', categoryAr: 'أدا', categoryEn: 'Tool', link: '/quiz', icon: '✍️', keywords: 'اسئل امتحانات كويز سنوات سنوات سابق بنك' },
  { id: 'p-calendar', titleAr: 'التقويم الأكاديمي والمواعيد', titleEn: 'Academic Calendar & Schedule', categoryAr: 'معلومات', categoryEn: 'Info', link: '/calendar', icon: '📅', keywords: 'تقويم مواعيد سحب إضاف نهائي فاينل ميد دبلوم بكالوريوس' },
  { id: 'p-exchange', titleAr: 'سوق وتبادل المواد والكتب', titleEn: 'Material Exchange & Books Marketplace', categoryAr: 'دم', categoryEn: 'Service', link: '/exchange', icon: '🔄', keywords: 'تبادل كتب دوسيات مشاريع تبرع شراء بيع سوق' },
  { id: 'p-faq', titleAr: 'الأسئل الشائع والإجابات', titleEn: 'FAQ & Student Answers', categoryAr: 'مساعد', categoryEn: 'Help', link: '/faq', icon: '❓', keywords: 'اسئل مساعد استفسارات نظام تحويل إنذار غياب' },
  { id: 'p-about', titleAr: 'من نحن - فريق مكانك الجامعي', titleEn: 'About Us - Makanak Al-Jami\'i', categoryAr: 'صفح', categoryEn: 'Page', link: '/about', icon: '👥', keywords: 'من نحن معلومات فريق رؤي رسال' },

  // Tools & Sections
  { id: 't-nashmi', titleAr: 'المرشد الذكي "نشمي" (AI)', titleEn: 'Nashmi AI Student Advisor', categoryAr: 'ذكاء اصطناعي', categoryEn: 'AI', link: '/#lemon-chat', icon: '🤖', keywords: 'نشمي ذكاء اصطناعي مساعد استفسار ذكي ai bot' },
  { id: 't-tip', titleAr: 'نصيح الأسبوع الأكاديمي', titleEn: 'Weekly Academic Tip', categoryAr: 'نصائح', categoryEn: 'Tips', link: '/#weekly-tip', icon: '💡', keywords: 'نصيح دراس تنظيم وقت امتحانات ذاكر' },
  { id: 't-events', titleAr: 'الفعاليات والأحداث القادم', titleEn: 'Upcoming Events & Deadlines', categoryAr: 'أحداث', categoryEn: 'Events', link: '/#events', icon: '📢', keywords: 'فعاليات ورشات مواعيد مهم اعلانات' },
  { id: 't-gpa-calc', titleAr: 'حاسب المعدل الفصلي والتراكمي', titleEn: 'Semester & Cumulative GPA Calculator', categoryAr: 'أدا', categoryEn: 'Tool', link: '/grading#gpa-calculator', icon: '⚖️', keywords: 'حساب معدل تراكمي فصلي ريج نقاط' },

  // Common Subjects
  { id: 's-math1', titleAr: 'تفاضل وتكامل (1 & 2)', titleEn: 'Calculus (1 & 2)', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=تفاضل', icon: '📐', keywords: 'تفاضل رياضيات مادتين حساب دبلوم بكالوريوس' },
  { id: 's-phys1', titleAr: 'فيزياء عام (1 & 2)', titleEn: 'General Physics (1 & 2)', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=فيزياء', icon: '⚛️', keywords: 'فيزياء علوم تجارب معمل' },
  { id: 's-prog', titleAr: 'أساسيات البرمج (C++ / Python)', titleEn: 'Programming Fundamentals (C++ / Python)', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=برمج', icon: '💻', keywords: 'برمج كود حاسوب it c++ python سي بلس بلس' },
  { id: 's-arabic', titleAr: 'اللغ العربي (المهارات اللغوي)', titleEn: 'Arabic Language Skills', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=عربي', icon: '📖', keywords: 'عربي لغ عربي متطلب اجباري جامع' },
  { id: 's-english', titleAr: 'اللغ الإنجليزي (101 & 102)', titleEn: 'English Language Skills', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=انجليزي', icon: '🌐', keywords: 'انجليزي انجليزي 101 english grammar' },
  { id: 's-national', titleAr: 'التربي الوطني والثقاف الإسلامي', titleEn: 'National Education & Islamic Culture', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=وطني', icon: '🏛️', keywords: 'تربي وطني اسلامي ثقاف متطلبات جامع' }
];

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items
  const filteredItems = SEARCH_ITEMS.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const title = (isAr ? item.titleAr : item.titleEn).toLowerCase();
    const keywords = (item.keywords || '').toLowerCase();
    return title.includes(q) || keywords.includes(q);
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle modal with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      listRef.current.children[selectedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const handleSelect = (item) => {
    onClose();
    if (item.link.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const hash = item.link.replace('/#', '#');
        window.location.hash = hash;
      }, 100);
    } else {
      navigate(item.link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-container" onClick={(e) => e.stopPropagation()}>
        <div className="global-search-header">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="global-search-input"
            placeholder={isAr ? 'ابحث عن مادة، حساب معدل، أسئل، دمات (Ctrl + K)...' : 'Search subjects, tools, materials (Ctrl + K)...'}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {query && (
            <button className="clear-search-btn" onClick={() => setQuery('')}>
              ✕
            </button>
          )}
          <span className="esc-badge">ESC</span>
        </div>

        <div className="global-search-results" ref={listRef}>
          {filteredItems.length === 0 ? (
            <div className="no-search-results">
              <span className="no-results-icon">🔎</span>
              <p>{isAr ? 'لم نجد نتائج مطابق لبحثك' : 'No matching results found'}</p>
              <small>{isAr ? 'جرب البحث عن اسم مادة، حساب معدل، أو أسئل' : 'Try searching for subject name, GPA, or quiz'}</small>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="item-icon">{item.icon}</span>
                <div className="item-details">
                  <span className="item-title">{isAr ? item.titleAr : item.titleEn}</span>
                  <span className="item-category">{isAr ? item.categoryAr : item.categoryEn}</span>
                </div>
                <span className="item-arrow">{isAr ? '←' : '→'}</span>
              </div>
            ))
          )}
        </div>

        <div className="global-search-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> {isAr ? 'للتنقل' : 'Navigate'}</span>
          <span><kbd>↵</kbd> {isAr ? 'فتح' : 'Open'}</span>
          <span><kbd>Ctrl+K</kbd> {isAr ? 'فتح / إغلاق' : 'Toggle'}</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
