import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './GlobalSearchModal.css';

const SEARCH_ITEMS = [
  // Pages
  { id: 'p-materials', titleAr: 'المواد الدراسية والدوسيات', titleEn: 'Study Materials & Handouts', categoryAr: 'صفحة', categoryEn: 'Page', link: '/materials', icon: '📚', keywords: 'مواد خطة دوسية تلخيص اسئلة بكالوريوس دبلوم' },
  { id: 'p-plans', titleAr: 'الخطط الدراسية التفاعلية', titleEn: 'Interactive Academic Plans', categoryAr: 'صفحة', categoryEn: 'Page', link: '/plans', icon: '🗺️', keywords: 'خطة خطط تخصص ساعات مواد اجبارية اختياري' },
  { id: 'p-grading', titleAr: 'حاسبة المعدل والنظام الأكاديمي', titleEn: 'GPA Calculator & Grading System', categoryAr: 'أداة', categoryEn: 'Tool', link: '/grading', icon: '🧮', keywords: 'معدل حساب نقاط تقدير فصلي تراكمي علامات' },
  { id: 'p-quiz', titleAr: 'بنك الأسئلة الشامل والاختبارات', titleEn: 'Question Bank & Quizzes', categoryAr: 'أداة', categoryEn: 'Tool', link: '/quiz', icon: '✍️', keywords: 'اسئلة امتحانات كويز سنوات سنوات سابقة بنك' },
  { id: 'p-calendar', titleAr: 'التقويم الأكاديمي والمواعيد', titleEn: 'Academic Calendar & Schedule', categoryAr: 'معلومات', categoryEn: 'Info', link: '/calendar', icon: '📅', keywords: 'تقويم مواعيد سحب إضافة نهائي فاينل ميد دبلوم بكالوريوس' },
  { id: 'p-exchange', titleAr: 'سوق وتبادل المواد والكتب', titleEn: 'Material Exchange & Books Marketplace', categoryAr: 'خدمة', categoryEn: 'Service', link: '/exchange', icon: '🔄', keywords: 'تبادل كتب دوسيات مشاريع تبرع شراء بيع سوق' },
  { id: 'p-faq', titleAr: 'الأسئلة الشائعة والإجابات', titleEn: 'FAQ & Student Answers', categoryAr: 'مساعدة', categoryEn: 'Help', link: '/faq', icon: '❓', keywords: 'اسئلة مساعدة استفسارات نظام تحويل إنذار غياب' },
  { id: 'p-about', titleAr: 'من نحن - فريق مكانك الجامعي', titleEn: 'About Us - Makanak Al-Jami\'i', categoryAr: 'صفحة', categoryEn: 'Page', link: '/about', icon: '👥', keywords: 'من نحن معلومات فريق رؤية رسالة' },

  // Tools & Sections
  { id: 't-nashmi', titleAr: 'المرشد الذكي "نشمي" (AI)', titleEn: 'Nashmi AI Student Advisor', categoryAr: 'ذكاء اصطناعي', categoryEn: 'AI', link: '/#lemon-chat', icon: '🤖', keywords: 'نشمي ذكاء اصطناعي مساعد استفسار ذكي ai bot' },
  { id: 't-tip', titleAr: 'نصيحة الأسبوع الأكاديمية', titleEn: 'Weekly Academic Tip', categoryAr: 'نصائح', categoryEn: 'Tips', link: '/#weekly-tip', icon: '💡', keywords: 'نصيحة دراسة تنظيم وقت امتحانات ذاكرة' },
  { id: 't-events', titleAr: 'الفعاليات والأحداث القادمة', titleEn: 'Upcoming Events & Deadlines', categoryAr: 'أحداث', categoryEn: 'Events', link: '/#events', icon: '📢', keywords: 'فعاليات ورشات مواعيد مهمة اعلانات' },
  { id: 't-gpa-calc', titleAr: 'حاسبة المعدل الفصلي والتراكمي', titleEn: 'Semester & Cumulative GPA Calculator', categoryAr: 'أداة', categoryEn: 'Tool', link: '/grading#gpa-calculator', icon: '⚖️', keywords: 'حساب معدل تراكمي فصلي خريج نقاط' },

  // Common Subjects
  { id: 's-math1', titleAr: 'تفاضل وتكامل (1 & 2)', titleEn: 'Calculus (1 & 2)', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=تفاضل', icon: '📐', keywords: 'تفاضل رياضيات مادتين حساب دبلوم بكالوريوس' },
  { id: 's-phys1', titleAr: 'فيزياء عامة (1 & 2)', titleEn: 'General Physics (1 & 2)', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=فيزياء', icon: '⚛️', keywords: 'فيزياء علوم تجارب معمل' },
  { id: 's-prog', titleAr: 'أساسيات البرمجة (C++ / Python)', titleEn: 'Programming Fundamentals (C++ / Python)', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=برمجة', icon: '💻', keywords: 'برمجة كود حاسوب it c++ python سي بلس بلس' },
  { id: 's-arabic', titleAr: 'اللغة العربية (المهارات اللغوية)', titleEn: 'Arabic Language Skills', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=عربي', icon: '📖', keywords: 'عربي لغة عربية متطلب اجباري جامعة' },
  { id: 's-english', titleAr: 'اللغة الإنجليزية (101 & 102)', titleEn: 'English Language Skills', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=انجليزي', icon: '🌐', keywords: 'انجليزي انجليزي 101 english grammar' },
  { id: 's-national', titleAr: 'التربية الوطنية والثقافة الإسلامية', titleEn: 'National Education & Islamic Culture', categoryAr: 'مادة', categoryEn: 'Subject', link: '/materials?search=وطنية', icon: '🏛️', keywords: 'تربية وطنية اسلامية ثقافة متطلبات جامعة' }
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
            placeholder={isAr ? 'ابحث عن مادة، حساب معدل، أسئلة، خدمات (Ctrl + K)...' : 'Search subjects, tools, materials (Ctrl + K)...'}
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
              <p>{isAr ? 'لم نجد نتائج مطابقة لبحثك' : 'No matching results found'}</p>
              <small>{isAr ? 'جرب البحث عن اسم مادة، حساب معدل، أو أسئلة' : 'Try searching for subject name, GPA, or quiz'}</small>
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
