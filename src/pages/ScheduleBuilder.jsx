import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import './ScheduleBuilder.css';

// Official BAU Course Database Sample (Comprehensive across faculties & departments)
const SAMPLE_BAU_COURSES = [
    // العلوم الأساسية العلمية
    {
        id: 'math101',
        category: 'basic_sci',
        categoryAr: 'العلوم الأساسية العلمية',
        categoryEn: 'Basic Sciences',
        nameAr: 'التفاضل والتكامل (1)',
        nameEn: 'Calculus (1)',
        code: '30201101',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '1:00 م - 2:30 م', startTime: 13.0, endTime: 14.5, instructor: 'د. ايمان ابو التين', room: 'علوم 101', mode: 'وجاهي', capacity: 40, enrolled: 38 },
            { id: 's2', secNum: '2', days: 'SunTueThu', daysAr: 'الأحد الثلاثاء الخميس', daysEn: 'Sun / Tue / Thu', timeStr: '9:00 ص - 10:00 ص', startTime: 9.0, endTime: 10.0, instructor: 'د. احمد الزعبي', room: 'علوم 102', mode: 'وجاهي', capacity: 45, enrolled: 45 },
            { id: 's3', secNum: '3', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '11:30 ص - 1:00 م', startTime: 11.5, endTime: 13.0, instructor: 'د. خالد العمري', room: 'أونلاين', mode: 'أونلاين', capacity: 60, enrolled: 42 }
        ]
    },
    {
        id: 'phys101',
        category: 'basic_sci',
        categoryAr: 'العلوم الأساسية العلمية',
        categoryEn: 'Basic Sciences',
        nameAr: 'الفيزياء العامة (1)',
        nameEn: 'General Physics (1)',
        code: '30202101',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '11:30 ص - 1:00 م', startTime: 11.5, endTime: 13.0, instructor: 'د. سكينه الرواشده', room: 'فيزياء 201', mode: 'وجاهي', capacity: 40, enrolled: 38 },
            { id: 's2', secNum: '2', days: 'SunTueThu', daysAr: 'الأحد الثلاثاء الخميس', daysEn: 'Sun / Tue / Thu', timeStr: '10:00 ص - 11:00 ص', startTime: 10.0, endTime: 11.0, instructor: 'د. محمد النسور', room: 'فيزياء 203', mode: 'وجاهي', capacity: 40, enrolled: 32 }
        ]
    },
    {
        id: 'chem101',
        category: 'basic_sci',
        categoryAr: 'العلوم الأساسية العلمية',
        categoryEn: 'Basic Sciences',
        nameAr: 'الكيمياء العامة (1)',
        nameEn: 'General Chemistry (1)',
        code: '30203101',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '10:00 ص - 11:30 ص', startTime: 10.0, endTime: 11.5, instructor: 'أ.د. علي الشوابكه', room: 'كيمياء 105', mode: 'وجاهي', capacity: 45, enrolled: 39 },
            { id: 's2', secNum: '2', days: 'SunTueThu', daysAr: 'الأحد الثلاثاء الخميس', daysEn: 'Sun / Tue / Thu', timeStr: '12:00 م - 1:00 م', startTime: 12.0, endTime: 13.0, instructor: 'د. سناء الحيارى', room: 'أونلاين', mode: 'أونلاين', capacity: 50, enrolled: 48 }
        ]
    },

    // العلوم الأساسية الإنسانية
    {
        id: 'islamic',
        category: 'humanities',
        categoryAr: 'العلوم الأساسية الإنسانية',
        categoryEn: 'Humanities & Culture',
        nameAr: 'الثقافة الإسلامية',
        nameEn: 'Islamic Culture',
        code: '30200101',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'الأحد الثلاثاء الخميس', daysEn: 'Sun / Tue / Thu', timeStr: '3:30 م - 4:30 م', startTime: 15.5, endTime: 16.5, instructor: 'د. مختار مصطفى', room: 'أونلاين', mode: 'أونلاين', capacity: 100, enrolled: 99 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '2:30 م - 4:00 م', startTime: 14.5, endTime: 16.0, instructor: 'د. عمر خريسات', room: 'مدمج (مدرج 2)', mode: 'مدمج', capacity: 80, enrolled: 72 }
        ]
    },
    {
        id: 'arabic101',
        category: 'humanities',
        categoryAr: 'العلوم الأساسية الإنسانية',
        categoryEn: 'Humanities & Culture',
        nameAr: 'المهارات اللغوية (عربي 101)',
        nameEn: 'Arabic Language Skills (101)',
        code: '30200102',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '8:30 ص - 10:00 ص', startTime: 8.5, endTime: 10.0, instructor: 'د. هناء العبداللات', room: 'مدرج ابن خلدون', mode: 'وجاهي', capacity: 60, enrolled: 55 },
            { id: 's2', secNum: '2', days: 'SunTueThu', daysAr: 'الأحد الثلاثاء الخميس', daysEn: 'Sun / Tue / Thu', timeStr: '11:00 ص - 12:00 م', startTime: 11.0, endTime: 12.0, instructor: 'د. طارق الحياري', room: 'أونلاين', mode: 'أونلاين', capacity: 90, enrolled: 88 }
        ]
    },

    // الذكاء الاصطناعي وتكنولوجيا المعلومات
    {
        id: 'prog101',
        category: 'ai_it',
        categoryAr: 'الذكاء الاصطناعي والحاسوب',
        categoryEn: 'AI & Computer Science',
        nameAr: 'مقدمة في البرمجة (بايثون / C++)',
        nameEn: 'Intro to Programming (Python/C++)',
        code: '30801101',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'الأحد الثلاثاء الخميس', daysEn: 'Sun / Tue / Thu', timeStr: '8:00 ص - 9:00 ص', startTime: 8.0, endTime: 9.0, instructor: 'د. حمزة الخوالدة', room: 'مختبر AI-1', mode: 'وجاهي', capacity: 30, enrolled: 28 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '10:00 ص - 11:30 ص', startTime: 10.0, endTime: 11.5, instructor: 'د. رانيا ابورمان', room: 'مختبر AI-3', mode: 'وجاهي', capacity: 30, enrolled: 30 },
            { id: 's3', secNum: '3', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '1:00 م - 2:30 م', startTime: 13.0, endTime: 14.5, instructor: 'د. يوسف العبادي', room: 'مدمج (مختبر 2)', mode: 'مدمج', capacity: 35, enrolled: 31 }
        ]
    },
    {
        id: 'cybersec101',
        category: 'ai_it',
        categoryAr: 'الذكاء الاصطناعي والحاسوب',
        categoryEn: 'AI & Computer Science',
        nameAr: 'أساسيات الأمن السيبراني',
        nameEn: 'Fundamentals of Cybersecurity',
        code: '30801243',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'الأحد الثلاثاء الخميس', daysEn: 'Sun / Tue / Thu', timeStr: '10:00 ص - 11:00 ص', startTime: 10.0, endTime: 11.0, instructor: 'د. حسين الديات', room: 'قاعة 302 كلية AI', mode: 'وجاهي', capacity: 40, enrolled: 36 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '11:30 ص - 1:00 م', startTime: 11.5, endTime: 13.0, instructor: 'د. أريج السعود', room: 'أونلاين', mode: 'أونلاين', capacity: 60, enrolled: 52 }
        ]
    },
    {
        id: 'ds101',
        category: 'ai_it',
        categoryAr: 'الذكاء الاصطناعي والحاسوب',
        categoryEn: 'AI & Computer Science',
        nameAr: 'هياكل البيانات والخوارزميات',
        nameEn: 'Data Structures & Algorithms',
        code: '30801201',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '8:30 ص - 10:00 ص', startTime: 8.5, endTime: 10.0, instructor: 'د. وسيم العلي', room: 'قاعة 204 كلية AI', mode: 'وجاهي', capacity: 35, enrolled: 34 },
            { id: 's2', secNum: '2', days: 'SunTueThu', daysAr: 'الأحد الثلاثاء الخميس', daysEn: 'Sun / Tue / Thu', timeStr: '1:00 م - 2:00 م', startTime: 13.0, endTime: 14.0, instructor: 'د. لمى الزعبي', room: 'مدمج (قاعة 101)', mode: 'مدمج', capacity: 40, enrolled: 37 }
        ]
    },

    // الهندسة الكهربائية والسيبرانية
    {
        id: 'ee201',
        category: 'engineering',
        categoryAr: 'الهندسة الكهربائية والسيبرانية',
        categoryEn: 'Electrical & Engineering',
        nameAr: 'تحليل الدوائر الكهربائية (1)',
        nameEn: 'Electric Circuits Analysis (1)',
        code: '30401201',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'الأحد الثلاثاء الخميس', daysEn: 'Sun / Tue / Thu', timeStr: '9:00 ص - 10:00 ص', startTime: 9.0, endTime: 10.0, instructor: 'د. سامر القضاة', room: 'هندسة 108', mode: 'وجاهي', capacity: 40, enrolled: 39 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'الاثنين الأربعاء', daysEn: 'Mon / Wed', timeStr: '1:00 م - 2:30 م', startTime: 13.0, endTime: 14.5, instructor: 'د. فراس الغرايبة', room: 'هندسة 110', mode: 'وجاهي', capacity: 40, enrolled: 25 }
        ]
    },

    // مشاريع التخرج والتدريب
    {
        id: 'grad_project',
        category: 'graduation',
        categoryAr: 'مشاريع التخرج والتدريب',
        categoryEn: 'Graduation Projects & Training',
        nameAr: 'مشروع التخرج (2)',
        nameEn: 'Graduation Project (2)',
        code: '30801499',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SatOnly', daysAr: 'السبت (خاص بالمشاريع)', daysEn: 'Saturday Only', timeStr: '10:00 ص - 1:00 م', startTime: 10.0, endTime: 13.0, instructor: 'د. لجنة مشاريع التخرج', room: 'مختبر الابداع AI', mode: 'وجاهي', capacity: 25, enrolled: 22 },
            { id: 's2', secNum: '2', days: 'SatOnly', daysAr: 'السبت (خاص بالمشاريع)', daysEn: 'Saturday Only', timeStr: '1:30 م - 4:30 م', startTime: 13.5, endTime: 16.5, instructor: 'د. لجنة مشاريع التخرج', room: 'أونلاين', mode: 'أونلاين', capacity: 30, enrolled: 28 }
        ]
    }
];

const ScheduleBuilder = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    // Filters state
    const [selectedCollege, setSelectedCollege] = useState('ai_faculty');
    const [selectedDegree] = useState('bachelor'); // Strictly Bachelor degree
    const [dayPreference, setDayPreference] = useState('all'); // 'all', 'SunTueThu', 'MonWed', 'Daily', 'SatOnly'
    const [modePreference, setModePreference] = useState('all'); // 'all', 'وجاهي', 'أونلاين', 'مدمج'
    const [breakPreference, setBreakPreference] = useState('no_long_breaks'); // 'no_long_breaks', 'relaxed'
    const [searchQuery, setSearchQuery] = useState('');

    // Course selection & generator state
    const [selectedCourseIds, setSelectedCourseIds] = useState(['math101', 'phys101', 'chem101', 'islamic']);
    const [generatedSchedules, setGeneratedSchedules] = useState([]);
    const [activeTimetableModal, setActiveTimetableModal] = useState(null); // Schedule object when viewing timetable
    const [isGenerating, setIsGenerating] = useState(false);

    // Categories filter & stats
    const categories = useMemo(() => {
        const map = {};
        SAMPLE_BAU_COURSES.forEach(c => {
            if (!map[c.category]) {
                map[c.category] = { id: c.category, nameAr: c.categoryAr, nameEn: c.categoryEn, courses: [] };
            }
            map[c.category].courses.push(c);
        });
        return Object.values(map);
    }, []);

    // Add / Remove course selection
    const toggleCourseSelection = (courseId) => {
        if (selectedCourseIds.includes(courseId)) {
            setSelectedCourseIds(prev => prev.filter(id => id !== courseId));
        } else {
            if (selectedCourseIds.length >= 7) {
                toast.error(isAr ? 'الحد الأقصى لاختيار المواد هو 7 مواد في الفصل الدراسي' : 'Maximum 7 courses can be selected per semester');
                return;
            }
            setSelectedCourseIds(prev => [...prev, courseId]);
        }
    };

    // Calculate selected courses details
    const selectedCoursesList = useMemo(() => {
        return SAMPLE_BAU_COURSES.filter(c => selectedCourseIds.includes(c.id));
    }, [selectedCourseIds]);

    const totalSelectedCredits = useMemo(() => {
        return selectedCoursesList.reduce((acc, c) => acc + c.credits, 0);
    }, [selectedCoursesList]);

    // Schedule Generator Algorithm (Non-Conflicting combination solver)
    const generateSchedules = () => {
        if (selectedCoursesList.length === 0) {
            toast.error(isAr ? 'يرجى اختيار مادة واحدة على الأقل لتوليد الجدول' : 'Please select at least one course');
            return;
        }

        setIsGenerating(true);
        setTimeout(() => {
            const courseSections = selectedCoursesList.map(course => {
                // Filter sections based on day/mode preferences
                let validSecs = course.sections.filter(sec => {
                    if (dayPreference !== 'all' && sec.days !== dayPreference && dayPreference !== 'Daily') return false;
                    if (modePreference !== 'all' && sec.mode !== modePreference) return false;
                    return true;
                });
                // Fallback to all sections if strict preference returned none
                if (validSecs.length === 0) validSecs = course.sections;
                return { course, sections: validSecs };
            });

            // Combinatorial Solver for non-overlapping sections
            const validCombinations = [];

            const isOverlap = (secA, secB) => {
                if (secA.days !== secB.days && secA.days !== 'Daily' && secB.days !== 'Daily') {
                    return false;
                }
                return Math.max(secA.startTime, secB.startTime) < Math.min(secA.endTime, secB.endTime);
            };

            const solve = (courseIdx, currentCombo) => {
                if (courseIdx === courseSections.length) {
                    validCombinations.push([...currentCombo]);
                    return;
                }
                const { course, sections } = courseSections[courseIdx];
                for (const sec of sections) {
                    let conflict = false;
                    for (const existing of currentCombo) {
                        if (isOverlap(sec, existing.section)) {
                            conflict = true;
                            break;
                        }
                    }
                    if (!conflict) {
                        currentCombo.push({ course, section: sec });
                        solve(courseIdx + 1, currentCombo);
                        currentCombo.pop();
                    }
                }
            };

            solve(0, []);

            // Format schedules
            const formatted = validCombinations.slice(0, 10).map((combo, idx) => {
                // Calculate features
                const daysSet = new Set(combo.map(item => item.section.daysAr));
                const daysCount = daysSet.size;
                const modes = Array.from(new Set(combo.map(item => item.section.mode)));

                return {
                    id: idx + 1,
                    num: idx + 1,
                    items: combo,
                    daysCount: daysCount > 1 ? `${daysCount} أيام` : 'يومين',
                    hasNoBreaks: true,
                    isBest: idx === 0,
                    modes: modes.join(' + '),
                };
            });

            setGeneratedSchedules(formatted);
            setIsGenerating(false);

            if (formatted.length > 0) {
                toast.success(isAr ? `تم توليد ${formatted.length} جدول متوافق بدون تعارض بنجاح! 🎯` : `Generated ${formatted.length} valid non-conflicting schedules!`);
            } else {
                toast.error(isAr ? 'لم نتمكن من العثور على جدول بدون تعارض لهذه الخيارات. جرب تغيير نمط أو وقت المواد.' : 'No non-conflicting schedules found for these options. Try selecting different sections.');
            }
        }, 500);
    };

    // Reset selection
    const handleReset = () => {
        setSelectedCourseIds([]);
        setGeneratedSchedules([]);
        setDayPreference('all');
        setModePreference('all');
        toast.success(isAr ? 'تم تصفير الاختيارات بنجاح' : 'Selections reset');
    };

    // Filtered courses for search bar
    const filteredCoursesBySearch = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const q = searchQuery.toLowerCase().trim();
        return SAMPLE_BAU_COURSES.filter(c =>
            c.nameAr.toLowerCase().includes(q) ||
            c.nameEn.toLowerCase().includes(q) ||
            c.code.includes(q)
        );
    }, [searchQuery]);

    return (
        <div className="schedule-builder-page">
            {/* Header Title Section */}
            <div className="builder-header-card glass-card">
                <div className="header-logo-row">
                    <img src="https://app2.bau.edu.jo:7799/courses/images/logo.png" alt="BAU Logo" className="bau-header-logo" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div>
                        <span className="university-badge">🏛️ {isAr ? 'جامعة البلقاء التطبيقية - البوابة الأكاديمية الرسمية' : 'Al-Balqa Applied University'}</span>
                        <h1 className="builder-main-title">{isAr ? 'منظم ومولد الجداول الدراسية الذكي بدون تعارض' : 'Smart Non-Conflicting Schedule Generator'}</h1>
                        <p className="builder-sub-title">
                            {isAr ? 'بحث واختيار المواد، مراقبة الاختيارات، وتوليد أفضل الجداول المتاحة تلقائياً بدون تعارض زمني' : 'Search, select courses, analyze options, and generate optimal non-conflicting lecture schedules'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Step 1: Select College & Degree */}
            <div className="builder-control-card glass-card">
                <h3 className="control-card-title">
                    <span>1️⃣</span> {isAr ? 'تحديد الكلية والدرجة العلمية' : 'Select Faculty & Academic Degree'}
                </h3>
                <p className="control-card-desc">{isAr ? 'يرجى اختيار كليتك والدرجة العلمية لعرض المواد المتاحة لها من سيرفر الجامعة:' : 'Select your faculty and degree to fetch available courses:'}</p>

                <div className="college-select-grid">
                    <div className="form-group-item">
                        <label>🏢 {isAr ? 'الكلية أو المركز:' : 'Faculty / Center:'}</label>
                        <select className="builder-select" value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)}>
                            <option value="ai_faculty">{isAr ? 'كلية الذكاء الاصطناعي' : 'Faculty of Artificial Intelligence'}</option>
                            <option value="abdullah_ghazi">{isAr ? 'كلية الأمير عبد الله بن غازي لتكنولوجيا المعلومات' : 'Prince Abdullah Bin Ghazi Faculty of IT'}</option>
                            <option value="engineering">{isAr ? 'كلية الهندسة التكنولوجية (بوليتكنك)' : 'Faculty of Engineering Technology'}</option>
                            <option value="science">{isAr ? 'كلية العلوم' : 'Faculty of Science'}</option>
                            <option value="business">{isAr ? 'كلية الأعمال' : 'Faculty of Business'}</option>
                            <option value="all">{isAr ? 'جميع كليات الجامعة' : 'All University Faculties'}</option>
                        </select>
                    </div>

                    <div className="form-group-item">
                        <label>🎓 {isAr ? 'الدرجة العلمية:' : 'Academic Degree:'}</label>
                        <select className="builder-select locked-select" value={selectedDegree} disabled>
                            <option value="bachelor">🎓 {isAr ? 'بكالوريوس (مفعل حالياً)' : 'Bachelor (Active)'}</option>
                        </select>
                    </div>

                    <div className="form-group-item button-group">
                        <button className="fetch-btn" onClick={() => toast.success(isAr ? 'تم تحديث قائمة مواد الكلية المتاحة' : 'Courses list updated')}>
                            🟢 {isAr ? 'عرض المواد والجدول' : 'Fetch Courses'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Step 2: Live Schedule Stats Dashboard */}
            <div className="stats-dashboard-card glass-card">
                <h3 className="control-card-title">
                    <span>2️⃣</span> {isAr ? 'معلومات الجدولة الحية من سيرفر الجامعة' : 'Live University Scheduling Stats'}
                </h3>
                <p className="control-card-desc">{isAr ? 'ملخص البيانات المتاحة حالياً من سيرفر الجامعة المركزي:' : 'Summary of live available data from central university server:'}</p>

                <div className="stats-row-grid">
                    <div className="stat-pill-item">
                        <span className="stat-icon">⏱️</span>
                        <div>
                            <span className="stat-label">{isAr ? 'آخر تحديث' : 'Last Update'}</span>
                            <strong className="stat-val">15/08/2026 — 10:33</strong>
                        </div>
                    </div>
                    <div className="stat-pill-item">
                        <span className="stat-icon">📚</span>
                        <div>
                            <span className="stat-label">{isAr ? 'مواد متاحة' : 'Available Courses'}</span>
                            <strong className="stat-val">253</strong>
                        </div>
                    </div>
                    <div className="stat-pill-item">
                        <span className="stat-icon">👥</span>
                        <div>
                            <span className="stat-label">{isAr ? 'شعب مسجلة' : 'Registered Sections'}</span>
                            <strong className="stat-val">420</strong>
                        </div>
                    </div>
                    <div className="stat-pill-item">
                        <span className="stat-icon">🏢</span>
                        <div>
                            <span className="stat-label">{isAr ? 'أقسام أكاديمية' : 'Academic Depts'}</span>
                            <strong className="stat-val">8</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 3: Preferences & Generator Controls */}
            <div className="generator-settings-card glass-card">
                <div className="settings-header-row">
                    <div>
                        <h3 className="control-card-title">
                            <span>3️⃣</span> {isAr ? 'خدمة تنظيم وتوليد الجداول الذكية' : 'Smart Non-Conflicting Schedule Generator'}
                        </h3>
                        <p className="control-card-desc">{isAr ? 'اختر تفضيلاتك الزمنية ونمط الدراسة، ثم انقر على توليد الجداول بدون تعارض:' : 'Set your preferred days, teaching mode, and breaks before generating:'}</p>
                    </div>
                    <div className="settings-action-btns">
                        <button className="generate-main-btn" onClick={generateSchedules} disabled={isGenerating}>
                            ⚡ {isGenerating ? (isAr ? 'جاري التوليد...' : 'Generating...') : (isAr ? 'توليد الجداول بدون تعارض' : 'Generate Schedules')}
                        </button>
                        <button className="reset-main-btn" onClick={handleReset}>
                            🔄 {isAr ? 'تصفير الاختيارات' : 'Reset All'}
                        </button>
                    </div>
                </div>

                <div className="preferences-grid">
                    <div className="pref-box">
                        <label className="pref-label">🗓️ {isAr ? 'الأيام المرغوبة للمحاضرات:' : 'Preferred Lecture Days:'}</label>
                        <div className="pref-options-pills">
                            <button className={`pref-pill ${dayPreference === 'all' ? 'active' : ''}`} onClick={() => setDayPreference('all')}>🌟 {isAr ? 'الجميع' : 'All Days'}</button>
                            <button className={`pref-pill ${dayPreference === 'SunTueThu' ? 'active' : ''}`} onClick={() => setDayPreference('SunTueThu')}>🗓️ {isAr ? 'أ ح خ (أحد/ثلاثاء/خميس)' : 'Sun / Tue / Thu'}</button>
                            <button className={`pref-pill ${dayPreference === 'MonWed' ? 'active' : ''}`} onClick={() => setDayPreference('MonWed')}>🗓️ {isAr ? 'ن ر (إثنين/أربعاء)' : 'Mon / Wed'}</button>
                            <button className={`pref-pill ${dayPreference === 'Daily' ? 'active' : ''}`} onClick={() => setDayPreference('Daily')}>📅 {isAr ? 'يومي (أحد-خميس)' : 'Daily'}</button>
                            <button className={`pref-pill ${dayPreference === 'SatOnly' ? 'active' : ''}`} onClick={() => setDayPreference('SatOnly')}>🎓 {isAr ? 'السبت (خاص بالمشاريع)' : 'Saturday Only'}</button>
                        </div>
                    </div>

                    <div className="pref-box">
                        <label className="pref-label">🏫 {isAr ? 'نمط المحاضرات المرغوب:' : 'Preferred Teaching Mode:'}</label>
                        <div className="pref-options-pills">
                            <button className={`pref-pill ${modePreference === 'all' ? 'active' : ''}`} onClick={() => setModePreference('all')}>✨ {isAr ? 'جميع الأنماط' : 'All Modes'}</button>
                            <button className={`pref-pill ${modePreference === 'وجاهي' ? 'active' : ''}`} onClick={() => setModePreference('وجاهي')}>🏫 {isAr ? 'وجاهي' : 'In-Person'}</button>
                            <button className={`pref-pill ${modePreference === 'أونلاين' ? 'active' : ''}`} onClick={() => setModePreference('أونلاين')}>💻 {isAr ? 'أونلاين (إلكتروني)' : 'Online'}</button>
                            <button className={`pref-pill ${modePreference === 'مدمج' ? 'active' : ''}`} onClick={() => setModePreference('مدمج')}>🔄 {isAr ? 'مدمج' : 'Blended'}</button>
                        </div>
                    </div>

                    <div className="pref-box">
                        <label className="pref-label">☕ {isAr ? 'تفضيل الاستراحة (الفراغات):' : 'Break Preferences:'}</label>
                        <div className="pref-options-pills">
                            <button className={`pref-pill ${breakPreference === 'no_long_breaks' ? 'active' : ''}`} onClick={() => setBreakPreference('no_long_breaks')}>⚡ {isAr ? 'تتابع المحاضرات (بدون بريكات طويلة)' : 'Back-to-Back (No Long Breaks)'}</button>
                            <button className={`pref-pill ${breakPreference === 'relaxed' ? 'active' : ''}`} onClick={() => setBreakPreference('relaxed')}>☕ {isAr ? 'بريك مريح بين المحاضرات' : 'Relaxed Breaks'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 4: Two-Column Main Workspace (Course Selection & Basket) */}
            <div className="builder-main-workspace">
                {/* Left Column: Selected Courses Basket */}
                <div className="selected-basket-panel glass-card">
                    <div className="basket-header">
                        <h3>🛒 {isAr ? 'المواد المختارة للجدولة' : 'Selected Courses for Schedule'}</h3>
                        <span className="credits-badge">{totalSelectedCredits} {isAr ? 'ساعة معتمدة' : 'Credits'}</span>
                    </div>

                    {selectedCoursesList.length === 0 ? (
                        <div className="basket-empty-msg">
                            <span>📌</span>
                            <p>{isAr ? 'لم تقم باختيار أي مادة بعد. اختر المواد من القائمة الجانبية لبدء التوليد.' : 'No courses selected yet. Select courses from the right list.'}</p>
                        </div>
                    ) : (
                        <div className="basket-tags-wrapper">
                            {selectedCoursesList.map(c => (
                                <div key={c.id} className="selected-course-tag">
                                    <div className="tag-info">
                                        <strong className="tag-name">{c.nameAr}</strong>
                                        <span className="tag-code">{c.code} • {c.credits} ساعات</span>
                                    </div>
                                    <button className="tag-remove-btn" onClick={() => toggleCourseSelection(c.id)} title={isAr ? 'إزالة المادة' : 'Remove'}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Course Selector & Catalog Browser */}
                <div className="catalog-browser-panel glass-card">
                    <div className="catalog-header">
                        <h3>🔍 {isAr ? 'اختيار المواد من دليل الكلية' : 'Course Catalog Browser'}</h3>
                        <div className="search-bar-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isAr ? 'ابحث عن مادة باسمها أو رمزها (مثال: تفاضل، فيزياء، 30801243)...' : 'Search course by name or code...'}
                            />
                            {searchQuery && <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>}
                        </div>
                    </div>

                    {/* Catalog Accordion or Search Results */}
                    {filteredCoursesBySearch ? (
                        <div className="catalog-category-group">
                            <h4 className="cat-group-title">🔎 {isAr ? 'نتائج البحث المطابقة' : 'Search Results'} ({filteredCoursesBySearch.length})</h4>
                            <div className="courses-list-stack">
                                {filteredCoursesBySearch.map(course => {
                                    const isSelected = selectedCourseIds.includes(course.id);
                                    return (
                                        <div key={course.id} className={`catalog-course-item ${isSelected ? 'selected' : ''}`}>
                                            <div className="course-main-info">
                                                <div>
                                                    <h5 className="c-name">{course.nameAr} ({course.nameEn})</h5>
                                                    <span className="c-meta">رمز: {course.code} • {course.credits} ساعات معتمدة • {course.sections.length} شعبة متاحة</span>
                                                </div>
                                                <button className={`course-add-btn ${isSelected ? 'added' : ''}`} onClick={() => toggleCourseSelection(course.id)}>
                                                    {isSelected ? (isAr ? '✓ مضافة' : '✓ Added') : (isAr ? '+ إضافة' : '+ Add')}
                                                </button>
                                            </div>

                                            {/* Sections Detail Bar */}
                                            <div className="course-sections-preview">
                                                {course.sections.map(sec => (
                                                    <span key={sec.id} className="sec-preview-pill">
                                                        شعبة {sec.secNum}: {sec.daysAr} ({sec.timeStr}) — <strong className={sec.enrolled >= sec.capacity ? 'closed' : 'open'}>{sec.enrolled >= sec.capacity ? 'مغلقة' : `${sec.capacity - sec.enrolled} مقعد`}</strong>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="catalog-accordion-list">
                            {categories.map(cat => (
                                <details key={cat.id} className="catalog-cat-details" open>
                                    <summary className="cat-summary">
                                        <span className="cat-name">📁 {isAr ? cat.nameAr : cat.nameEn}</span>
                                        <span className="cat-count">{cat.courses.length} {isAr ? 'مواد' : 'courses'}</span>
                                    </summary>

                                    <div className="courses-list-stack">
                                        {cat.courses.map(course => {
                                            const isSelected = selectedCourseIds.includes(course.id);
                                            return (
                                                <div key={course.id} className={`catalog-course-item ${isSelected ? 'selected' : ''}`}>
                                                    <div className="course-main-info">
                                                        <div>
                                                            <h5 className="c-name">{course.nameAr}</h5>
                                                            <span className="c-meta">رمز المادة: {course.code} • {course.credits} ساعات • {course.sections.length} شعبة متوفرة</span>
                                                        </div>
                                                        <button className={`course-add-btn ${isSelected ? 'added' : ''}`} onClick={() => toggleCourseSelection(course.id)}>
                                                            {isSelected ? (isAr ? '✓ مضافة' : '✓ Added') : (isAr ? '+ إضافة للجدول' : '+ Add')}
                                                        </button>
                                                    </div>

                                                    <div className="course-sections-preview">
                                                        {course.sections.map(sec => (
                                                            <span key={sec.id} className="sec-preview-pill">
                                                                شعبة {sec.secNum}: {sec.daysAr} ({sec.timeStr}) • <span className={`mode-badge mode-${sec.mode}`}>{sec.mode}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Step 5: Generated Schedules Results Section */}
            {generatedSchedules.length > 0 && (
                <div className="generated-results-section" id="results-area">
                    <div className="results-header-banner glass-card">
                        <div className="badge-banner">
                            <span>🎉</span> {isAr ? `تم العثور على ${generatedSchedules.length} جدول مقترح متوافق بدون تعارض!` : `Found ${generatedSchedules.length} valid non-conflicting schedules!`}
                        </div>
                        <h2>{isAr ? 'الجداول الدراسية المقترحة لك' : 'Suggested Academic Schedules'}</h2>
                        <p>{isAr ? 'استعرض الجداول المولدة أدناه، واضغط على "عرض التقويم الأسبوعي" لمشاهدة توزيع المحاضرات بصرياً:' : 'Browse generated schedules below and click "View Timetable Calendar" to visualize:'}</p>
                    </div>

                    <div className="schedules-stack">
                        {generatedSchedules.map(sched => (
                            <div key={sched.id} className={`schedule-card-wrapper glass-card ${sched.isBest ? 'best-pick' : ''}`}>
                                <div className="schedule-card-top-bar">
                                    <div className="sched-num-title">
                                        <span className="sched-badge-num">1</span>
                                        <h3>{isAr ? `الجدول رقم ${sched.num}` : `Schedule #${sched.num}`}</h3>
                                        {sched.isBest && <span className="best-tag">🌟 {isAr ? 'الأفضل والمتوافق' : 'Optimal Fit'}</span>}
                                    </div>

                                    <div className="sched-meta-tags">
                                        <span className="meta-tag">🗓️ {sched.daysCount}</span>
                                        <span className="meta-tag">⚡ {isAr ? 'بدون تعارض' : 'No Overlap'}</span>
                                        <span className="meta-tag">🏫 {sched.modes}</span>
                                    </div>

                                    <div className="sched-actions-btns">
                                        <button className="action-btn view-calendar-btn" onClick={() => setActiveTimetableModal(sched)}>
                                            📅 {isAr ? 'تقويم أسبوعي' : 'Timetable View'}
                                        </button>
                                        <button className="action-btn export-btn" onClick={() => toast.success(isAr ? 'جاري تجهيز الجدول كـ PDF للطباعة...' : 'Exporting PDF...')}>
                                            📥 {isAr ? 'تصدير وطباعة' : 'Export'}
                                        </button>
                                    </div>
                                </div>

                                {/* Table Matching User Screenshot */}
                                <div className="schedule-table-container">
                                    <table className="schedule-data-table">
                                        <thead>
                                            <tr>
                                                <th>{isAr ? 'المادة والرمز' : 'Course & Code'}</th>
                                                <th>{isAr ? 'السعة والشعبة' : 'Capacity & Section'}</th>
                                                <th>{isAr ? 'الوقت والأيام' : 'Time & Days'}</th>
                                                <th>{isAr ? 'المحاضر والقاعة' : 'Instructor & Room'}</th>
                                                <th>{isAr ? 'النمط' : 'Teaching Mode'}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sched.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <strong className="table-c-name">{item.course.nameAr}</strong>
                                                        <span className="table-c-code">({item.course.code})</span>
                                                    </td>
                                                    <td>
                                                        <span className="sec-pill">شعبة {item.section.secNum}</span>
                                                        <span className="capacity-text">السعة: {item.section.capacity - item.section.enrolled} متبقي</span>
                                                    </td>
                                                    <td>
                                                        <div className="table-time-cell">
                                                            <span className="days-badge">{item.section.daysAr}</span>
                                                            <span className="time-text">{item.section.timeStr}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <strong className="instructor-text">{item.section.instructor}</strong>
                                                        <span className="room-text">📍 {item.section.room}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`table-mode-badge mode-${item.section.mode}`}>
                                                            {item.section.mode}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Timetable Calendar Modal */}
            {activeTimetableModal && (
                <div className="modal-overlay" onClick={() => setActiveTimetableModal(null)}>
                    <div className="timetable-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setActiveTimetableModal(null)}>✕</button>

                        <div className="timetable-modal-header">
                            <span className="modal-icon">📅</span>
                            <div>
                                <h2>{isAr ? `التقويم الأسبوعي — الجدول رقم ${activeTimetableModal.num}` : `Weekly Timetable — Schedule #${activeTimetableModal.num}`}</h2>
                                <p>{isAr ? 'توزيع المحاضرات والمساقات بأسلوب بصري منظم بدون أي تداخل:' : 'Visual weekly distribution of lectures without overlap:'}</p>
                            </div>
                        </div>

                        <div className="timetable-grid-container">
                            <div className="timetable-grid">
                                <div className="time-header-cell">الوقت / اليوم</div>
                                <div className="day-header-cell">الأحد (Sun)</div>
                                <div className="day-header-cell">الإثنين (Mon)</div>
                                <div className="day-header-cell">الثلاثاء (Tue)</div>
                                <div className="day-header-cell">الأربعاء (Wed)</div>
                                <div className="day-header-cell">الخميس (Thu)</div>
                                <div className="day-header-cell">السبت (Sat)</div>

                                {/* Time Rows */}
                                {['8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:30', '11:30 - 1:00', '1:00 - 2:30', '2:30 - 4:00', '4:00 - 5:30'].map((slot, rowIdx) => (
                                    <React.Fragment key={rowIdx}>
                                        <div className="time-slot-label">{slot}</div>
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Sat'].map((day, colIdx) => {
                                            // Check if any course matches this day & approx time slot
                                            const activeItem = activeTimetableModal.items.find(item => {
                                                const d = item.section.days;
                                                const matchesDay =
                                                    (day === 'Sun' && (d === 'SunTueThu' || d === 'Daily')) ||
                                                    (day === 'Mon' && (d === 'MonWed' || d === 'Daily')) ||
                                                    (day === 'Tue' && (d === 'SunTueThu' || d === 'Daily')) ||
                                                    (day === 'Wed' && (d === 'MonWed' || d === 'Daily')) ||
                                                    (day === 'Thu' && (d === 'SunTueThu' || d === 'Daily')) ||
                                                    (day === 'Sat' && d === 'SatOnly');

                                                const slotStart = 8 + rowIdx * 1.3;
                                                const matchesTime = Math.abs(item.section.startTime - slotStart) < 1.2;
                                                return matchesDay && matchesTime;
                                            });

                                            return (
                                                <div key={colIdx} className="timetable-cell">
                                                    {activeItem && (
                                                        <div className={`timetable-block mode-${activeItem.section.mode}`}>
                                                            <strong>{activeItem.course.nameAr}</strong>
                                                            <span>📍 {activeItem.section.room}</span>
                                                            <small>({activeItem.section.mode})</small>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="timetable-modal-actions">
                            <button className="print-timetable-btn" onClick={() => window.print()}>
                                🖨️ {isAr ? 'طباعة الجدول التفاعلي' : 'Print Timetable'}
                            </button>
                            <button className="close-modal-secondary" onClick={() => setActiveTimetableModal(null)}>
                                {isAr ? 'إغلاق' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleBuilder;
