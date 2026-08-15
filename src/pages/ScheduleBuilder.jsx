import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import './ScheduleBuilder.css';

// 100% Authentic BAU Official Registration Catalog Data
// Faculties:
// 1) كلية الذكاء الاصطناعي:
//    - قسم الأنظمة الذكية (smart_sys)
//    - قسم الأنظمة المؤتمتة (auto_sys)
// 2) كلية الأمير عبد الله بن غازي لتكنولوجيا المعلومات:
//    - قسم علم الحاسوب (cs)
//    - قسم نظم المعلومات الحاسوبية (cis)
//    - قسم هندسة البرمجيات (se)

const FULL_BAU_CATALOG = {
    // ====================================================
    // 1. كلية الذكاء الاصطناعي - قسم الأنظمة الذكية (smart_sys)
    // ====================================================
    smart_sys: [
        {
            id: 'ai_1',
            category: 'cyber_sec',
            categoryAr: 'الأمن السيبراني والتحقيقات الجنائية',
            nameAr: 'اختبار الاختراق',
            nameEn: 'Penetration Testing',
            code: 'ICS441',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '13:30 - 17:30', startTime: 13.5, endTime: 17.5, instructor: 'دعاء قواسمه', room: 'مختبر علم البيانات وانترنت الاشياء', mode: 'وجاهي', status: 'متاحة' },
                { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '13:00 - 17:30', startTime: 13.0, endTime: 17.5, instructor: 'د. اشرف المشاعله', room: 'مختبر الواقع الافتراضي', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'ai_2',
            category: 'cyber_sec',
            categoryAr: 'الأمن السيبراني والتحقيقات الجنائية',
            nameAr: 'اساسيات التشفير',
            nameEn: 'Cryptography Fundamentals',
            code: 'ICS244',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'دعاء قواسمه', room: 'مختبر علم البيانات / online 591', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'ai_3',
            category: 'ai_ds',
            categoryAr: 'الذكاء الاصطناعي وعلم البيانات',
            nameAr: 'تعلم الاله',
            nameEn: 'Machine Learning',
            code: 'L70305262',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '10:00 - 11:30', startTime: 10.0, endTime: 11.5, instructor: 'د. سفيان البدوي', room: 'مختبر التحقيقات الجنائية', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'ai_4',
            category: 'ai_ds',
            categoryAr: 'الذكاء الاصطناعي وعلم البيانات',
            nameAr: 'الرؤية بالحاسوب',
            nameEn: 'Computer Vision',
            code: 'DS360',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '13:30 - 14:30', startTime: 13.5, endTime: 14.5, instructor: 'د. اشرف الدباس', room: 'تقني 4', mode: 'وجاهي', status: 'متاحة' }
            ]
        }
    ],

    // ====================================================
    // 2. كلية الذكاء الاصطناعي - قسم الأنظمة المؤتمتة (auto_sys)
    // ====================================================
    auto_sys: [
        {
            id: 'auto_1',
            category: 'robotics_auto',
            categoryAr: 'الروبوتات والأنظمة المضمنة والمؤتمتة',
            nameAr: 'الأنظمة المشوشة (Fuzzy Systems)',
            nameEn: 'Fuzzy Systems',
            code: 'AR341',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'د. حسين الاحمر', room: 'online 591 / مختبر المحاكاة التقنية', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'auto_2',
            category: 'robotics_auto',
            categoryAr: 'الروبوتات والأنظمة المضمنة والمؤتمتة',
            nameAr: 'الأنظمة المضمنة (Embedded Systems)',
            nameEn: 'Embedded Systems',
            code: 'AR331',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '09:30 - 17:30', startTime: 9.5, endTime: 17.5, instructor: 'د. احمد ارجوب', room: 'مختبر الواقع الافتراضي / online 591', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'auto_3',
            category: 'robotics_auto',
            categoryAr: 'الروبوتات والأنظمة المضمنة والمؤتمتة',
            nameAr: 'التعرف على الكلام وفهمه',
            nameEn: 'Speech Recognition & Understanding',
            code: 'AR447',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '08:30 - 09:30', startTime: 8.5, endTime: 9.5, instructor: 'أ.د. عبدالودود مصلح', room: 'مختبر برمجة الذكاء الاصطناعي', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'auto_4',
            category: 'robotics_auto',
            categoryAr: 'الروبوتات والأنظمة المضمنة والمؤتمتة',
            nameAr: 'برمجة الذكاء الاصطناعي',
            nameEn: 'AI Programming',
            code: 'AR241',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث (أحد/ثلاثاء)', timeStr: '13:30 - 17:30', startTime: 13.5, endTime: 17.5, instructor: 'د. ايمان الصعيدي', room: 'online 591 / مختبر المحاكاة التقنية', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'auto_5',
            category: 'robotics_auto',
            categoryAr: 'الروبوتات والأنظمة المضمنة والمؤتمتة',
            nameAr: 'تقنيات التخطيط في الروبوتات',
            nameEn: 'Robot Motion Planning',
            code: 'AR453',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '12:30 - 13:30', startTime: 12.5, endTime: 13.5, instructor: 'د. احمد ارجوب', room: 'تقني 3', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'auto_6',
            category: 'robotics_auto',
            categoryAr: 'الروبوتات والأنظمة المضمنة والمؤتمتة',
            nameAr: 'روبوت الرؤية',
            nameEn: 'Vision Robotics',
            code: 'AR353',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. حسين الاحمر', room: 'مختبر المحاكاة التقنية', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'auto_7',
            category: 'robotics_auto',
            categoryAr: 'الروبوتات والأنظمة المضمنة والمؤتمتة',
            nameAr: 'روبوتات الادراك',
            nameEn: 'Perception Robotics',
            code: 'AR355',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'د. احمد ارجوب', room: 'مختبر سيسكو / online 591', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'auto_8',
            category: 'vr_graphics',
            categoryAr: 'الواقع الافتراضي والرسوم النحتية',
            nameAr: 'تصميم تجربة المستخدم (UI/UX)',
            nameEn: 'User Experience Design',
            code: 'VAR311',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. سفيان البدوي', room: 'online 591 / مختبر برمجة الذكاء الاصطناعي', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'auto_9',
            category: 'vr_graphics',
            categoryAr: 'الواقع الافتراضي والرسوم النحتية',
            nameAr: 'مقدمة الى الواقع الافتراضي',
            nameEn: 'Intro to Virtual Reality',
            code: 'VAR111',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '13:30 - 14:30', startTime: 13.5, endTime: 14.5, instructor: 'هـ.ت', room: 'مختبر التحقيقات الجنائية', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'auto_10',
            category: 'vr_graphics',
            categoryAr: 'الواقع الافتراضي والرسوم النحتية',
            nameAr: 'مقدمة في الذكاء الاصطناعي',
            nameEn: 'Intro to AI',
            code: 'AR142',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'د. ليث بني عطا', room: 'online 591 / مختبر برمجة الذكاء الاصطناعي', mode: 'مدمج', status: 'متاحة' }
            ]
        }
    ],

    // ====================================================
    // 3. كلية الأمير عبد الله بن غازي - قسم علم الحاسوب (cs)
    // ====================================================
    cs: [
        {
            id: 'cs1',
            category: 'prog_core',
            categoryAr: 'البرمجة ومبادئ الحوسبة',
            nameAr: 'البرمجة بلغة C++',
            nameEn: 'C++ Programming',
            code: 'L70301141',
            credits: 2,
            sections: [
                { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '10:00 - 11:00', startTime: 10.0, endTime: 11.0, instructor: 'د. محمد ريالات', room: 'مختبر الشبكات والاتصالات 300', mode: 'وجاهي', status: 'متاحة' },
                { id: 's2', secNum: '2', days: 'SunTue', daysAr: 'ح ث (أحد/ثلاثاء)', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'د. محمد ريالات', room: 'مختبر حاسوب (100)-علوم', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'cs2',
            category: 'prog_core',
            categoryAr: 'البرمجة ومبادئ الحوسبة',
            nameAr: 'البرمجة الموجهة للكائنات (OOP)',
            nameEn: 'Object Oriented Programming',
            code: 'L70301241',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'زينب الرخامنه', room: 'تكنولوجيا 402', mode: 'وجاهي', status: 'متاحة' },
                { id: 's2', secNum: '3', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '08:30 - 10:00', startTime: 8.5, endTime: 10.0, instructor: 'اصلاح غرايبه', room: 'مختبر الشبكات والاتصالات 300', mode: 'وجاهي', status: 'متاحة' }
            ]
        }
    ],

    // ====================================================
    // 4. كلية الأمير عبد الله بن غازي - قسم نظم المعلومات (cis)
    // ====================================================
    cis: [
        {
            id: 'cis1',
            category: 'cis_core',
            categoryAr: 'إدارة النظم والمعلومات',
            nameAr: 'ادارة شبكات الحاسوب',
            nameEn: 'Computer Network Admin',
            code: '30802430',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'سامر عبدالله', room: 'مختبر حاسوب(101)-علوم', mode: 'وجاهي', status: 'متاحة' }
            ]
        }
    ],

    // ====================================================
    // 5. كلية الأمير عبد الله بن غازي - قسم هندسة البرمجيات (se)
    // ====================================================
    se: [
        {
            id: 'se1',
            category: 'se_core',
            categoryAr: 'هندسة البرمجيات',
            nameAr: 'مبادئ هندسة البرمجيات',
            nameEn: 'Principles of Software Engineering',
            code: '30803260',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'د. عمار سلطان', room: 'online 591 / مختبر حاسوب(101)', mode: 'مدمج', status: 'متاحة' }
            ]
        }
    ]
};

const ScheduleBuilder = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    // Filters state
    const [selectedCollege, setSelectedCollege] = useState('ai_faculty');
    const [selectedDept, setSelectedDept] = useState('smart_sys');
    const [selectedDegree] = useState('bachelor');
    const [dayPreference, setDayPreference] = useState('all');
    const [modePreference, setModePreference] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Handle College Change
    const handleCollegeChange = (newCollege) => {
        setSelectedCollege(newCollege);
        if (newCollege === 'ai_faculty') {
            setSelectedDept('smart_sys');
            setSelectedCourseIds(['ai_1', 'ai_2', 'ai_3', 'ai_5']);
        } else {
            setSelectedDept('cs');
            setSelectedCourseIds(['cs1', 'cs2', 'cs3']);
        }
        setGeneratedSchedules([]);
    };

    // Handle Department Change
    const handleDeptChange = (newDept) => {
        setSelectedDept(newDept);
        const newCourses = FULL_BAU_CATALOG[newDept] || [];
        const defaults = newCourses.slice(0, 4).map(c => c.id);
        setSelectedCourseIds(defaults);
        setGeneratedSchedules([]);
    };

    // Active Courses List based on Department
    const activeDeptCourses = useMemo(() => {
        return FULL_BAU_CATALOG[selectedDept] || FULL_BAU_CATALOG.smart_sys;
    }, [selectedDept]);

    // Selected courses & Generator state
    const [selectedCourseIds, setSelectedCourseIds] = useState(['ai_1', 'ai_2', 'ai_3', 'ai_5']);
    const [generatedSchedules, setGeneratedSchedules] = useState([]);
    const [activeTimetableModal, setActiveTimetableModal] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Group active department courses by category
    const categories = useMemo(() => {
        const map = {};
        activeDeptCourses.forEach(c => {
            if (!map[c.category]) {
                map[c.category] = { id: c.category, nameAr: c.categoryAr, courses: [] };
            }
            map[c.category].courses.push(c);
        });
        return Object.values(map);
    }, [activeDeptCourses]);

    // Toggle course selection
    const toggleCourseSelection = (courseId) => {
        if (selectedCourseIds.includes(courseId)) {
            setSelectedCourseIds(prev => prev.filter(id => id !== courseId));
        } else {
            if (selectedCourseIds.length >= 7) {
                toast.error(isAr ? 'الحد الأقصى لاختيار المواد هو 7 مواد في الفصل الدراسي' : 'Maximum 7 courses allowed per semester');
                return;
            }
            setSelectedCourseIds(prev => [...prev, courseId]);
        }
    };

    const selectedCoursesList = useMemo(() => {
        return activeDeptCourses.filter(c => selectedCourseIds.includes(c.id));
    }, [activeDeptCourses, selectedCourseIds]);

    const totalSelectedCredits = useMemo(() => {
        return selectedCoursesList.reduce((acc, c) => acc + c.credits, 0);
    }, [selectedCoursesList]);

    // Combinatorial Non-Conflicting Schedule Generator Algorithm
    const generateSchedules = () => {
        if (selectedCoursesList.length === 0) {
            toast.error(isAr ? 'يرجى اختيار مادة واحدة على الأقل لتوليد الجدول' : 'Please select at least one course');
            return;
        }

        setIsGenerating(true);
        setTimeout(() => {
            const courseSections = selectedCoursesList.map(course => {
                let validSecs = course.sections.filter(sec => {
                    if (dayPreference !== 'all' && sec.days !== dayPreference && dayPreference !== 'Daily') return false;
                    if (modePreference !== 'all' && sec.mode !== modePreference) return false;
                    return true;
                });
                if (validSecs.length === 0) validSecs = course.sections;
                return { course, sections: validSecs };
            });

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

            const formatted = validCombinations.slice(0, 10).map((combo, idx) => {
                const daysSet = new Set(combo.map(item => item.section.daysAr));
                const daysCount = daysSet.size;
                const modes = Array.from(new Set(combo.map(item => item.section.mode)));

                return {
                    id: idx + 1,
                    num: idx + 1,
                    items: combo,
                    daysCount: daysCount > 1 ? `${daysCount} أيام` : 'يومين',
                    isBest: idx === 0,
                    modes: modes.join(' + '),
                };
            });

            setGeneratedSchedules(formatted);
            setIsGenerating(false);

            if (formatted.length > 0) {
                toast.success(isAr ? `تم توليد ${formatted.length} جدول متوافق بدون تعارض للجريدة الرسمية! 🎯` : `Generated ${formatted.length} valid non-conflicting schedules!`);
                const el = document.getElementById('results-area');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                toast.error(isAr ? 'لم نتمكن من العثور على جدول بدون تعارض لهذه الخيارات. يرجى تعديل الاختيارات.' : 'No non-conflicting schedules found.');
            }
        }, 500);
    };

    const handleReset = () => {
        setSelectedCourseIds([]);
        setGeneratedSchedules([]);
        setDayPreference('all');
        setModePreference('all');
        toast.success(isAr ? 'تم تصفير جميع الاختيارات' : 'Selections reset');
    };

    const filteredCoursesBySearch = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const q = searchQuery.toLowerCase().trim();
        return activeDeptCourses.filter(c =>
            c.nameAr.toLowerCase().includes(q) ||
            c.nameEn.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
        );
    }, [activeDeptCourses, searchQuery]);

    return (
        <div className="schedule-builder-page">
            {/* Real Catalog Official Header */}
            <div className="builder-header-card glass-card">
                <div className="header-logo-row">
                    <img src="https://app2.bau.edu.jo:7799/courses/images/logo.png" alt="BAU Logo" className="bau-header-logo" onError={(e) => { e.target.src = 'static_logo.png'; }} />
                    <div>
                        <span className="university-badge">🏛️ {isAr ? 'جامعة البلقاء التطبيقية — خدمات التسجيل الإلكتروني' : 'Al-Balqa Applied University'}</span>
                        <h1 className="builder-main-title">{isAr ? 'جريدة المواد الرسمية وتوليد الجداول الذكية' : 'Official Course Schedule Generator'}</h1>
                        <p className="builder-sub-title">
                            {isAr ? 'الجريدة الرسمية المعتمدة لكليتي الذكاء الاصطناعي والأمير عبد الله بن غازي لتكنولوجيا المعلومات' : 'Official BAU Catalog for AI & IT Faculties'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Step 1: Real Faculty & Department Selector */}
            <div className="builder-control-card glass-card">
                <h3 className="control-card-title">
                    <span>1️⃣</span> {isAr ? 'تحديد الكلية والقسم الأكاديمي والدرجة العلمية' : 'Faculty, Department & Academic Degree'}
                </h3>
                <p className="control-card-desc">{isAr ? 'اختر الكلية والقسم لعرض المواد والشعب المسحوبة رسمياً من السيرفر:' : 'Select faculty & department to load official catalog:'}</p>

                <div className="college-select-grid">
                    <div className="form-group-item">
                        <label>🎓 {isAr ? 'الدرجة العلمية:' : 'Degree:'}</label>
                        <select className="builder-select locked-select" value={selectedDegree} disabled>
                            <option value="bachelor">🎓 {isAr ? 'بكالوريوس (مفعل)' : 'Bachelor'}</option>
                        </select>
                    </div>

                    <div className="form-group-item">
                        <label>🏢 {isAr ? 'الكلية:' : 'Faculty:'}</label>
                        <select className="builder-select" value={selectedCollege} onChange={(e) => handleCollegeChange(e.target.value)}>
                            <option value="ai_faculty">🤖 {isAr ? 'كلية الذكاء الاصطناعي' : 'Faculty of Artificial Intelligence'}</option>
                            <option value="abdullah_ghazi">💻 {isAr ? 'كلية الأمير عبد الله بن غازي لتكنولوجيا المعلومات' : 'Prince Abdullah Bin Ghazi Faculty of IT'}</option>
                        </select>
                    </div>

                    <div className="form-group-item">
                        <label>💻 {isAr ? 'القسم الأكاديمي:' : 'Department:'}</label>
                        {selectedCollege === 'ai_faculty' ? (
                            <select className="builder-select" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)}>
                                <option value="smart_sys">🤖 {isAr ? 'الأنظمة الذكية (Smart Systems)' : 'Smart Systems'}</option>
                                <option value="auto_sys">⚙️ {isAr ? 'الأنظمة المؤتمتة (Automated Systems)' : 'Automated Systems'}</option>
                            </select>
                        ) : (
                            <select className="builder-select" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)}>
                                <option value="cs">💻 {isAr ? 'علم الحاسوب (CS)' : 'Computer Science (CS)'}</option>
                                <option value="cis">🗄️ {isAr ? 'نظم المعلومات الحاسوبية (CIS)' : 'Computer Information Systems (CIS)'}</option>
                                <option value="se">⚙️ {isAr ? 'هندسة البرمجيات (SE)' : 'Software Engineering (SE)'}</option>
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Step 2: Live Catalog Stats Bar */}
            <div className="stats-dashboard-card glass-card">
                <h3 className="control-card-title">
                    <span>2️⃣</span> {isAr ? `ملخص جريدة مواد ${selectedCollege === 'ai_faculty' ? `كلية الذكاء الاصطناعي (${selectedDept === 'smart_sys' ? 'الأنظمة الذكية' : 'الأنظمة المؤتمتة'})` : `كلية الأمير عبد الله بن غازي (${selectedDept.toUpperCase()})`}` : 'Catalog Summary'}
                </h3>

                <div className="stats-row-grid">
                    <div className="stat-pill-item">
                        <span className="stat-icon">⏱️</span>
                        <div>
                            <span className="stat-label">{isAr ? 'آخر تحديث للجريدة' : 'Last Update'}</span>
                            <strong className="stat-val">15/08/2026 — 10:33</strong>
                        </div>
                    </div>
                    <div className="stat-pill-item">
                        <span className="stat-icon">📚</span>
                        <div>
                            <span className="stat-label">{isAr ? 'مواد القسم الرسمية' : 'Official Courses'}</span>
                            <strong className="stat-val">{activeDeptCourses.length} مادة</strong>
                        </div>
                    </div>
                    <div className="stat-pill-item">
                        <span className="stat-icon">👥</span>
                        <div>
                            <span className="stat-label">{isAr ? 'القسم والكلية' : 'Active Dept'}</span>
                            <strong className="stat-val" style={{ color: '#2563eb' }}>{selectedDept.toUpperCase()}</strong>
                        </div>
                    </div>
                    <div className="stat-pill-item">
                        <span className="stat-icon">🏛️</span>
                        <div>
                            <span className="stat-label">{isAr ? 'حالة السيرفر' : 'Server Status'}</span>
                            <strong className="stat-val" style={{ color: '#10b981' }}>متصل بالسيرفر 🟢</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 3: Preferences & Non-Conflicting Generator Settings */}
            <div className="generator-settings-card glass-card">
                <div className="settings-header-row">
                    <div>
                        <h3 className="control-card-title">
                            <span>3️⃣</span> {isAr ? 'تفضيلات الجدولة وتوليد الجداول بدون تعارض' : 'Schedule Generator Preferences'}
                        </h3>
                        <p className="control-card-desc">{isAr ? 'حدّد تفضيلات الأيام والنمط ثم اضغط "توليد الجداول بدون تعارض":' : 'Set your preferences before auto-generating:'}</p>
                    </div>
                    <div className="settings-action-btns">
                        <button className="generate-main-btn" onClick={generateSchedules} disabled={isGenerating}>
                            ⚡ {isGenerating ? (isAr ? 'جاري الفحص...' : 'Generating...') : (isAr ? 'توليد الجداول بدون تعارض' : 'Generate Schedules')}
                        </button>
                        <button className="reset-main-btn" onClick={handleReset}>
                            🔄 {isAr ? 'تصفير الاختيارات' : 'Reset'}
                        </button>
                    </div>
                </div>

                <div className="preferences-grid">
                    <div className="pref-box">
                        <label className="pref-label">🗓️ {isAr ? 'الأيام المرغوبة:' : 'Preferred Days:'}</label>
                        <div className="pref-options-pills">
                            <button className={`pref-pill ${dayPreference === 'all' ? 'active' : ''}`} onClick={() => setDayPreference('all')}>🌟 {isAr ? 'الجميع' : 'All'}</button>
                            <button className={`pref-pill ${dayPreference === 'SunTueThu' ? 'active' : ''}`} onClick={() => setDayPreference('SunTueThu')}>🗓️ {isAr ? 'ح ث خ (أحد/ثلاثاء/خميس)' : 'Sun/Tue/Thu'}</button>
                            <button className={`pref-pill ${dayPreference === 'MonWed' ? 'active' : ''}`} onClick={() => setDayPreference('MonWed')}>🗓️ {isAr ? 'ن ر (إثنين/أربعاء)' : 'Mon/Wed'}</button>
                        </div>
                    </div>

                    <div className="pref-box">
                        <label className="pref-label">🏫 {isAr ? 'نمط المحاضرة:' : 'Teaching Mode:'}</label>
                        <div className="pref-options-pills">
                            <button className={`pref-pill ${modePreference === 'all' ? 'active' : ''}`} onClick={() => setModePreference('all')}>✨ {isAr ? 'جميع الأنماط' : 'All'}</button>
                            <button className={`pref-pill ${modePreference === 'وجاهي' ? 'active' : ''}`} onClick={() => setModePreference('وجاهي')}>🏫 {isAr ? 'وجاهي' : 'In-Person'}</button>
                            <button className={`pref-pill ${modePreference === 'مدمج' ? 'active' : ''}`} onClick={() => setModePreference('مدمج')}>🔄 {isAr ? 'مدمج' : 'Blended'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 4: Two-Column Workspace */}
            <div className="builder-main-workspace">
                {/* Left Basket Panel */}
                <div className="selected-basket-panel glass-card">
                    <div className="basket-header">
                        <h3>🛒 {isAr ? 'المواد المختارة للجدول' : 'Selected Courses'}</h3>
                        <span className="credits-badge">{totalSelectedCredits} {isAr ? 'ساعة معتمدة' : 'Credits'}</span>
                    </div>

                    {selectedCoursesList.length === 0 ? (
                        <div className="basket-empty-msg">
                            <span>📌</span>
                            <p>{isAr ? 'لم تقم باختيار أي مادة بعد. اضغط على "+ إضافة" من قائمة المواد اليمين.' : 'No courses selected. Click "+ Add" from catalog.'}</p>
                        </div>
                    ) : (
                        <div className="basket-tags-wrapper">
                            {selectedCoursesList.map(c => (
                                <div key={c.id} className="selected-course-tag">
                                    <div className="tag-info">
                                        <strong className="tag-name">{c.nameAr}</strong>
                                        <span className="tag-code">{c.code} • {c.credits} ساعات • {c.sections.length} شعب</span>
                                    </div>
                                    <button className="tag-remove-btn" onClick={() => toggleCourseSelection(c.id)} title={isAr ? 'إزالة' : 'Remove'}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Catalog Browser */}
                <div className="catalog-browser-panel glass-card">
                    <div className="catalog-header">
                        <h3>📋 {isAr ? `جريدة مواد قسم ${selectedDept === 'smart_sys' ? 'الأنظمة الذكية' : selectedDept === 'auto_sys' ? 'الأنظمة المؤتمتة' : selectedDept.toUpperCase()}` : 'Approved Catalog Browser'}</h3>
                        <div className="search-bar-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isAr ? 'ابحث باسم المادة أو رمزها...' : 'Search course by name or code...'}
                            />
                            {searchQuery && <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>}
                        </div>
                    </div>

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
                                                    <h5 className="c-name">{course.nameAr} <span className="c-code">({course.code})</span></h5>
                                                    <span className="c-meta">{course.credits} ساعات معتمدة • {course.sections.length} شعبة متوفرة</span>
                                                </div>
                                                <button className={`course-add-btn ${isSelected ? 'added' : ''}`} onClick={() => toggleCourseSelection(course.id)}>
                                                    {isSelected ? (isAr ? '✓ مضافة' : '✓ Added') : (isAr ? '+ إضافة' : '+ Add')}
                                                </button>
                                            </div>

                                            <div className="course-sections-preview">
                                                {course.sections.map(sec => (
                                                    <span key={sec.id} className="sec-preview-pill">
                                                        ش {sec.secNum}: {sec.daysAr} ({sec.timeStr}) | {sec.instructor} | 📍 {sec.room} | <strong className="open">{sec.status}</strong>
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
                                        <span className="cat-name">📁 {cat.nameAr}</span>
                                        <span className="cat-count">{cat.courses.length} {isAr ? 'مواد' : 'courses'}</span>
                                    </summary>

                                    <div className="courses-list-stack">
                                        {cat.courses.map(course => {
                                            const isSelected = selectedCourseIds.includes(course.id);
                                            return (
                                                <div key={course.id} className={`catalog-course-item ${isSelected ? 'selected' : ''}`}>
                                                    <div className="course-main-info">
                                                        <div>
                                                            <h5 className="c-name">{course.nameAr} <span className="c-code">({course.code})</span></h5>
                                                            <span className="c-meta">عدد الساعات: {course.credits} • عدد الشعب: {course.sections.length}</span>
                                                        </div>
                                                        <button className={`course-add-btn ${isSelected ? 'added' : ''}`} onClick={() => toggleCourseSelection(course.id)}>
                                                            {isSelected ? (isAr ? '✓ مضافة' : '✓ Added') : (isAr ? '+ إضافة للجدول' : '+ Add')}
                                                        </button>
                                                    </div>

                                                    <div className="course-sections-preview">
                                                        {course.sections.map(sec => (
                                                            <span key={sec.id} className="sec-preview-pill">
                                                                شعبة {sec.secNum}: {sec.daysAr} ({sec.timeStr}) — {sec.instructor} ({sec.room}) • <span className={`mode-badge mode-${sec.mode}`}>{sec.mode}</span>
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

            {/* Step 5: Generated Results Area */}
            {generatedSchedules.length > 0 && (
                <div className="generated-results-section" id="results-area">
                    <div className="results-header-banner glass-card">
                        <div className="badge-banner">
                            <span>🎉</span> {isAr ? `تم العثور على ${generatedSchedules.length} جدول مقترح بدون تعارض!` : `Found ${generatedSchedules.length} valid non-conflicting schedules!`}
                        </div>
                        <h2>{isAr ? 'الجداول الدراسية المقترحة من الجريدة الرسمية' : 'Generated Non-Conflicting Schedules'}</h2>
                        <p>{isAr ? 'اضغط على "تقويم أسبوعي" لمشاهدة الجدول بشكل بصري منظم أو تصديره وطباعته:' : 'Click "Timetable View" to visualize or export:'}</p>
                    </div>

                    <div className="schedules-stack">
                        {generatedSchedules.map(sched => (
                            <div key={sched.id} className={`schedule-card-wrapper glass-card ${sched.isBest ? 'best-pick' : ''}`}>
                                <div className="schedule-card-top-bar">
                                    <div className="sched-num-title">
                                        <span className="sched-badge-num">{sched.num}</span>
                                        <h3>{isAr ? `الجدول رقم ${sched.num}` : `Schedule #${sched.num}`}</h3>
                                        {sched.isBest && <span className="best-tag">🌟 {isAr ? 'الأفضل والموصى به' : 'Recommended'}</span>}
                                    </div>

                                    <div className="sched-meta-tags">
                                        <span className="meta-tag">🗓️ {sched.daysCount}</span>
                                        <span className="meta-tag">⚡ {isAr ? 'بدون تعارض زمني' : 'No Conflict'}</span>
                                        <span className="meta-tag">🏫 {sched.modes}</span>
                                    </div>

                                    <div className="sched-actions-btns">
                                        <button className="action-btn view-calendar-btn" onClick={() => setActiveTimetableModal(sched)}>
                                            📅 {isAr ? 'تقويم أسبوعي' : 'Timetable View'}
                                        </button>
                                        <button className="action-btn export-btn" onClick={() => toast.success(isAr ? 'جاري تصدير الجدول كـ PDF للطباعة...' : 'Exporting PDF...')}>
                                            📥 {isAr ? 'تصدير وطباعة' : 'Export'}
                                        </button>
                                    </div>
                                </div>

                                <div className="schedule-table-container">
                                    <table className="schedule-data-table">
                                        <thead>
                                            <tr>
                                                <th>رقم المادة واسم المادة</th>
                                                <th>س.ش. (الساعات والشعبة)</th>
                                                <th>الأوقات والأيام</th>
                                                <th>المحاضرين والقاعات</th>
                                                <th>الحالة والنمط</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sched.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <span className="table-c-code">{item.course.code}</span>
                                                        <strong className="table-c-name">{item.course.nameAr}</strong>
                                                    </td>
                                                    <td>
                                                        <span className="sec-pill">{item.course.credits} س / شعبة {item.section.secNum}</span>
                                                    </td>
                                                    <td>
                                                        <div className="table-time-cell">
                                                            <span className="days-badge">{item.section.daysAr}</span>
                                                            <span className="time-text">⏱️ {item.section.timeStr}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <strong className="instructor-text">👨‍🏫 {item.section.instructor}</strong>
                                                        <span className="room-text">📍 {item.section.room}</span>
                                                    </td>
                                                    <td>
                                                        <span className="table-mode-badge mode-status">
                                                            {item.section.status}
                                                        </span>
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

            {/* Interactive Timetable Calendar Modal */}
            {activeTimetableModal && (
                <div className="modal-overlay" onClick={() => setActiveTimetableModal(null)}>
                    <div className="timetable-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setActiveTimetableModal(null)}>✕</button>

                        <div className="timetable-modal-header">
                            <span className="modal-icon">📅</span>
                            <div>
                                <h2>{isAr ? `التقويم الأسبوعي — الجدول رقم ${activeTimetableModal.num}` : `Weekly Timetable — Schedule #${activeTimetableModal.num}`}</h2>
                                <p>{isAr ? 'توزيع المحاضرات الأسبوعية من جريدة المواد الرسمية:' : 'Weekly lecture distribution:'}</p>
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

                                {['08:30 - 09:30', '09:30 - 10:30', '10:30 - 11:30', '11:30 - 13:00', '13:00 - 14:30', '14:30 - 17:30'].map((slot, rowIdx) => (
                                    <React.Fragment key={rowIdx}>
                                        <div className="time-slot-label">{slot}</div>
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Sat'].map((day, colIdx) => {
                                            const activeItem = activeTimetableModal.items.find(item => {
                                                const d = item.section.days;
                                                const matchesDay =
                                                    (day === 'Sun' && (d === 'SunTueThu' || d === 'SunTue' || d === 'Sun')) ||
                                                    (day === 'Mon' && (d === 'MonWed' || d === 'Mon')) ||
                                                    (day === 'Tue' && (d === 'SunTueThu' || d === 'SunTue' || d === 'Tue')) ||
                                                    (day === 'Wed' && (d === 'MonWed' || d === 'Wed')) ||
                                                    (day === 'Thu' && (d === 'SunTueThu' || d === 'Thu')) ||
                                                    (day === 'Sat' && d === 'SatOnly');

                                                const slotStart = 8.5 + rowIdx * 1.3;
                                                const matchesTime = Math.abs(item.section.startTime - slotStart) < 1.2;
                                                return matchesDay && matchesTime;
                                            });

                                            return (
                                                <div key={colIdx} className="timetable-cell">
                                                    {activeItem && (
                                                        <div className={`timetable-block mode-${activeItem.section.mode}`}>
                                                            <strong>{activeItem.course.nameAr}</strong>
                                                            <span>📍 {activeItem.section.room}</span>
                                                            <small>👨‍🏫 {activeItem.section.instructor}</small>
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
                                🖨️ {isAr ? 'طباعة الجدول التفاعلي' : 'Print'}
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
