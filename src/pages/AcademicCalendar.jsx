import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { academicCalendarData, semesterCategories } from '../data/calendarData';
import calendarHero from '../assets/heros/calendar_hero.png';
import './AcademicCalendar.css';

const AcademicCalendar = () => {
    const { language, t } = useLanguage();
    const [selectedSemester, setSelectedSemester] = useState('firstSemester');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, exams, holidays, deadlines

    const currentSemester = academicCalendarData[selectedSemester];

    const eventTypeLabels = {
        ar: {
            academic: 'أكاديمي',
            exam: 'امتحان',
            holiday: 'عطلة',
            deadline: 'موعد مهم'
        },
        en: {
            academic: 'Academic',
            exam: 'Exam',
            holiday: 'Holiday',
            deadline: 'Important date'
        }
    };

    // Helper to parse date string for comparison (simplified)
    const parseEventDate = (dateStr) => {
        try {
            // Take the last part of a range "2026/1/22-1/10" -> "2026/1/22" (EndDate usually)
            const parts = dateStr.split('-');
            const fullDatePart = parts.find(p => p.match(/\d{4}\/\d{1,2}\/\d{1,2}/)) || parts[0];

            const dateParts = fullDatePart.split('/');
            const year = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]);
            const day = parseInt(dateParts[2]);
            return new Date(year, month - 1, day);
        } catch (e) {
            return new Date();
        }
    };

    const isUpcoming = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = parseEventDate(dateStr);
        return eventDate >= today;
    };

    // Filtered Events Logic
    const filteredEvents = useMemo(() => {
        if (!currentSemester) return [];

        return currentSemester.events.filter(event => {
            const eventName = language === 'ar' ? event.event : (event.eventEn || event.event);
            const dayName = language === 'ar' ? event.day : (event.dayEn || event.day);

            // 1. Search Filter
            const matchesSearch =
                eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.date.includes(searchQuery) ||
                dayName.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Type Filter
            if (filterType === 'all') return true;
            return event.type === filterType.slice(0, -1); // 'exams' -> 'exam', 'holidays' -> 'holiday', 'deadlines' -> 'deadline'
        });
    }, [currentSemester, searchQuery, filterType, language]);

    // Upcoming Events (Top 3)
    const upcomingEvents = useMemo(() => {
        if (!currentSemester) return [];
        return currentSemester.events
            .filter(e => isUpcoming(e.date))
            .slice(0, 3);
    }, [currentSemester]);

    if (!currentSemester) {
        return <div className="loading">{t('common.loading') || 'Loading...'}</div>;
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="academic-calendar-page">
            {/* Hero Section */}
            <section className="calendar-hero" style={{ backgroundImage: `url(${calendarHero})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">{t('calendar.hero.title')}</h1>
                    <p className="hero-subtitle">
                        {t('calendar.hero.subtitle')}
                    </p>
                    <p className="hero-note">{t('calendar.hero.note')}</p>
                </div>
            </section>

            {/* Central Control Dashboard */}
            <div className="control-dashboard glass-card" data-aos="fade-up">
                {/* Upcoming Quick View */}
                {upcomingEvents.length > 0 && (
                    <div className="quick-upcoming">
                        <div className="quick-header">
                            <h4>{t('calendar.upcoming.title')}</h4>
                        </div>
                        <div className="quick-events-track">
                            {upcomingEvents.map((event, idx) => (
                                <div key={idx} className="quick-item">
                                    <span className="quick-date">{event.date}</span>
                                    <span className="quick-name">
                                        {language === 'ar' ? event.event : (event.eventEn || event.event)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="dashboard-main-controls">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder={t('calendar.search.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <button
                            className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            {t('calendar.filters.all')}
                        </button>
                        <button
                            className={`filter-chip ${filterType === 'exams' ? 'active' : ''}`}
                            onClick={() => setFilterType('exams')}
                        >
                            {t('calendar.filters.exams')}
                        </button>
                        <button
                            className={`filter-chip ${filterType === 'holidays' ? 'active' : ''}`}
                            onClick={() => setFilterType('holidays')}
                        >
                            {t('calendar.filters.holidays')}
                        </button>
                    </div>

                    <div className="view-actions">
                        <button className="print-btn" onClick={handlePrint} title={t('calendar.actions.print')}>
                            {language === 'ar' ? 'طباعة التقويم' : 'Print calendar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Semester Tabs - Modernized */}
            <div className="semester-navigation">
                {semesterCategories.map(semester => (
                    <button
                        key={semester.id}
                        className={`nav-tab ${selectedSemester === semester.id ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedSemester(semester.id);
                            setSearchQuery('');
                            setFilterType('all');
                        }}
                        style={{ '--accent-color': semester.color }}
                    >
                        <span className="nav-text">
                            {language === 'ar' ? semester.name : (semester.nameEn || semester.name)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Calendar Content */}
            <div className="calendar-container">
                <div className="semester-header">
                    <h2>{language === 'ar' ? currentSemester.name : (currentSemester.nameEn || currentSemester.name)}</h2>
                    <span className="semester-year">{currentSemester.year}</span>
                </div>

                {filteredEvents.length === 0 ? (
                    <div className="no-results">
                        <h3>{t('calendar.no_results.title')}</h3>
                        <p>{t('calendar.no_results.text')}</p>
                    </div>
                ) : (
                    <div className="calendar-table-wrap">
                        <table className="calendar-table">
                            <thead>
                                <tr>
                                    <th>{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                                    <th>{language === 'ar' ? 'اليوم' : 'Day'}</th>
                                    <th>{language === 'ar' ? 'نوع الحدث' : 'Type'}</th>
                                    <th>{language === 'ar' ? 'الحدث' : 'Event'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.map((event, index) => (
                                    <tr key={`${event.date}-${index}`}>
                                        <td className="calendar-table-date">{event.date}</td>
                                        <td className="calendar-table-day">
                                            {language === 'ar' ? event.day : (event.dayEn || event.day)}
                                        </td>
                                        <td>
                                            <span className={`event-type event-type-${event.type}`}>
                                                {eventTypeLabels[language]?.[event.type] || eventTypeLabels.en[event.type]}
                                            </span>
                                        </td>
                                        <td className="calendar-table-event">
                                            {language === 'ar' ? event.event : (event.eventEn || event.event)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Info Banner */}
            <div className="info-banner glass-card">
                <h3>{t('calendar.note.title')}</h3>
                <p>
                    {t('calendar.note.text').split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </p>
            </div>
        </div>
    );
};

export default AcademicCalendar;
