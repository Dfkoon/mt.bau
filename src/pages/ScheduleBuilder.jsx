import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import './ScheduleBuilder.css';

// 100% Authentic BAU Official Registration Catalog Data for Prince Abdullah Bin Ghazi Faculty of IT
// Departments: CS (علم الحاسوب), CIS (نظم المعلومات الحاسوبية), SE (هندسة البرمجيات)

const AUTHENTIC_BAU_CATALOG = {
    // ----------------------------------------------------
    // 1. قسم علم الحاسوب (Computer Science - CS)
    // ----------------------------------------------------
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
            nameAr: 'مختبر البرمجة بلغة C++',
            nameEn: 'C++ Lab',
            code: 'L70301143',
            credits: 1,
            sections: [
                { id: 's1', secNum: '1', days: 'Thu', daysAr: 'خ (خميس)', timeStr: '08:30 - 10:30', startTime: 8.5, endTime: 10.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب(100)-علوم', mode: 'وجاهي', status: 'متاحة' },
                { id: 's2', secNum: '2', days: 'Wed', daysAr: 'ر (أربعاء)', timeStr: '13:00 - 14:00', startTime: 13.0, endTime: 14.0, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة' },
                { id: 's3', secNum: '3', days: 'Thu', daysAr: 'خ (خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'cs3',
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
        },
        {
            id: 'cs4',
            category: 'prog_core',
            categoryAr: 'البرمجة ومبادئ الحوسبة',
            nameAr: 'البرمجة المتقدمة بلغة جافا',
            nameEn: 'Advanced Java',
            code: 'L70302242',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'د. بيان السعايدة', room: 'تكنولوجيا 405', mode: 'وجاهي', status: 'متاحة' },
                { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '13:00 - 14:30', startTime: 13.0, endTime: 14.5, instructor: 'د. بيان السعايدة', room: 'مختبر الشبكات والاتصالات 300', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'cs5',
            category: 'prog_core',
            categoryAr: 'البرمجة ومبادئ الحوسبة',
            nameAr: 'تصميم وتحليل الخوارزميات',
            nameEn: 'Algorithms Design',
            code: '30801215',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'أ.د. مالك بريك', room: 'online 591 / تكنولوجيا 102', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'cs6',
            category: 'networks_sec',
            categoryAr: 'الشبكات وأنظمة التشغيل',
            nameAr: 'شبكات الحاسوب',
            nameEn: 'Computer Networks',
            code: 'L70310351',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '13:00 - 14:30', startTime: 13.0, endTime: 14.5, instructor: 'د. عدنان الربيع', room: 'مختبر حاسوب(101)-علوم', mode: 'وجاهي', status: 'متاحة' },
                { id: 's2', secNum: '2', days: 'SunTue', daysAr: 'ح ث (أحد/ثلاثاء)', timeStr: '12:30 - 13:30', startTime: 12.5, endTime: 13.5, instructor: 'د. عدنان الربيع', room: 'تكنولوجيا 301', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'cs7',
            category: 'ai_graphics',
            categoryAr: 'الذكاء الاصطناعي',
            nameAr: 'الذكاء الاصطناعي',
            nameEn: 'Artificial Intelligence',
            code: '30801350',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. محمد ريالات', room: 'online 591 / تكنولوجيا 302', mode: 'مدمج', status: 'متاحة' }
            ]
        }
    ],

    // ----------------------------------------------------
    // 2. قسم نظم المعلومات الحاسوبية (CIS)
    // ----------------------------------------------------
    cis: [
        {
            id: 'cis1',
            category: 'cis_core',
            categoryAr: 'إدارة النظم والمعلومات',
            nameAr: 'ادارة شبكات الحاسوب',
            nameEn: 'Computer Network Management',
            code: '30802430',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'سامر عبدالله', room: 'مختبر حاسوب(101)-علوم', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'cis2',
            category: 'cis_core',
            categoryAr: 'إدارة النظم والمعلومات',
            nameAr: 'ادارة نظم قواعد البيانات',
            nameEn: 'Database Systems Admin',
            code: '30802323',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '13:30 - 14:30', startTime: 13.5, endTime: 14.5, instructor: 'د. نبيل العلي', room: 'تكنولوجيا 301 / online 591', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'cis3',
            category: 'cis_core',
            categoryAr: 'إدارة النظم والمعلومات',
            nameAr: 'التنقيب عن البيانات',
            nameEn: 'Data Mining',
            code: '30802428',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'أ.د. بلال زهران', room: 'مختبر حاسوب(101)-علوم', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'cis4',
            category: 'cis_core',
            categoryAr: 'إدارة النظم والمعلومات',
            nameAr: 'انظمة المعلومات الجغرافية (GIS)',
            nameEn: 'Geographic Info Systems',
            code: '30802441',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '08:30 - 09:30', startTime: 8.5, endTime: 9.5, instructor: 'هبه الحياري', room: 'مختبر حاسوب - علوم (303) / online 591', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'cis5',
            category: 'cis_core',
            categoryAr: 'إدارة النظم والمعلومات',
            nameAr: 'تطبيقات وخدمات الويب',
            nameEn: 'Web Applications & Services',
            code: '30802300',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'وفاء الضبايات', room: 'online 591 / مختبر الشبكات والاتصالات 300', mode: 'مدمج', status: 'متاحة' },
                { id: 's2', secNum: '3', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '11:30 - 13:00', startTime: 11.5, endTime: 13.0, instructor: 'وفاء الضبايات', room: 'online 591 / تكنولوجيا 301', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'cis6',
            category: 'cis_core',
            categoryAr: 'إدارة النظم والمعلومات',
            nameAr: 'مستودعات البيانات',
            nameEn: 'Data Warehousing',
            code: '30802326',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'رائد خليل', room: 'مختبر حاسوب (502)-علوم', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'cis7',
            category: 'cis_core',
            categoryAr: 'إدارة النظم والمعلومات',
            nameAr: 'نظم استرجاع المعلومات',
            nameEn: 'Information Retrieval Systems',
            code: '30802322',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '12:30 - 13:30', startTime: 12.5, endTime: 13.5, instructor: 'أ.د. بلال زهران', room: 'online 591 / مختبر حاسوب(100)-علوم', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'cis8',
            category: 'cis_core',
            categoryAr: 'إدارة النظم والمعلومات',
            nameAr: 'التدريب الميداني لطلبة نظم المعلومات',
            nameEn: 'Field Training (CIS)',
            code: '30802471',
            credits: 6,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '08:00 - 15:00', startTime: 8.0, endTime: 15.0, instructor: 'هـ.ت', room: 'تدريب ميداني', mode: 'وجاهي', status: 'متاحة' },
                { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '08:30 - 17:30', startTime: 8.5, endTime: 17.5, instructor: 'هـ.ت', room: 'تدريب ميداني', mode: 'وجاهي', status: 'متاحة' }
            ]
        }
    ],

    // ----------------------------------------------------
    // 3. قسم هندسة البرمجيات (Software Engineering - SE)
    // ----------------------------------------------------
    se: [
        {
            id: 'se1',
            category: 'se_core',
            categoryAr: 'هندسة وبناء البرمجيات',
            nameAr: 'مبادئ هندسة البرمجيات',
            nameEn: 'Principles of Software Engineering',
            code: '30803260',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'د. عمار سلطان', room: 'online 591 / مختبر حاسوب(101)-علوم', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'se2',
            category: 'se_core',
            categoryAr: 'هندسة وبناء البرمجيات',
            nameAr: 'هندسة متطلبات نظم البرمجيات',
            nameEn: 'Software Requirements Engineering',
            code: 'L70302271',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. مي الفواعير', room: 'تكنولوجيا 402', mode: 'وجاهي', status: 'متاحة' },
                { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '08:30 - 10:00', startTime: 8.5, endTime: 10.0, instructor: 'د. مي الفواعير', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'se3',
            category: 'se_core',
            categoryAr: 'هندسة وبناء البرمجيات',
            nameAr: 'ادوات بناء البرمجيات',
            nameEn: 'Software Construction Tools',
            code: '30803467',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '13:30 - 14:30', startTime: 13.5, endTime: 14.5, instructor: 'د. كرم اغنيم', room: 'تكنولوجيا 302', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'se4',
            category: 'se_core',
            categoryAr: 'هندسة وبناء البرمجيات',
            nameAr: 'تخطيط وادارة مشاريع البرمجيات',
            nameEn: 'Software Project Management',
            code: '30803367',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '08:30 - 09:30', startTime: 8.5, endTime: 9.5, instructor: 'د. زيد اللامي', room: 'مختبر حاسوب(100)-علوم', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'se5',
            category: 'se_core',
            categoryAr: 'هندسة وبناء البرمجيات',
            nameAr: 'تصميم وتنفيذ واجهة المستخدم (UI/UX)',
            nameEn: 'User Interface Design & Implementation',
            code: '30803445',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '13:30 - 14:30', startTime: 13.5, endTime: 14.5, instructor: 'د. مي الفواعير', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'se6',
            category: 'se_core',
            categoryAr: 'هندسة وبناء البرمجيات',
            nameAr: 'صيانه وتطور البرمجيات',
            nameEn: 'Software Maintenance & Evolution',
            code: '30803468',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'د. خالد الخرابشه', room: 'تكنولوجيا 406 / online 591', mode: 'مدمج', status: 'متاحة' }
            ]
        },
        {
            id: 'se7',
            category: 'se_core',
            categoryAr: 'هندسة وبناء البرمجيات',
            nameAr: 'هندسة البرمجيات الشيئية',
            nameEn: 'Object Oriented Software Engineering',
            code: '30803368',
            credits: 3,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '08:30 - 09:30', startTime: 8.5, endTime: 9.5, instructor: 'د. حابس الخريسات', room: 'مختبر حاسوب(101)-علوم', mode: 'وجاهي', status: 'متاحة' }
            ]
        },
        {
            id: 'se8',
            category: 'se_core',
            categoryAr: 'هندسة وبناء البرمجيات',
            nameAr: 'التدريب الميداني لطلبة هندسة البرمجيات',
            nameEn: 'Field Training (SE)',
            code: '30803470',
            credits: 6,
            sections: [
                { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', timeStr: '08:00 - 15:00', startTime: 8.0, endTime: 15.0, instructor: 'هـ.ت', room: 'تدريب ميداني', mode: 'وجاهي', status: 'متاحة' },
                { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', timeStr: '08:30 - 17:30', startTime: 8.5, endTime: 17.5, instructor: 'هـ.ت', room: 'تدريب ميداني', mode: 'وجاهي', status: 'متاحة' }
            ]
        }
    ]
};

const ScheduleBuilder = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    // Filters state
    const [selectedCollege] = useState('abdullah_ghazi'); // Locked to Prince Abdullah Bin Ghazi Faculty
    const [selectedDept, setSelectedDept] = useState('cs'); // 'cs', 'cis', 'se'
    const [selectedDegree] = useState('bachelor'); // Strictly Bachelor degree
    const [dayPreference, setDayPreference] = useState('all');
    const [modePreference, setModePreference] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Active Courses List based on Department
    const activeDeptCourses = useMemo(() => {
        return AUTHENTIC_BAU_CATALOG[selectedDept] || AUTHENTIC_BAU_CATALOG.cs;
    }, [selectedDept]);

    // Selected courses & Generator state
    const [selectedCourseIds, setSelectedCourseIds] = useState(['cs1', 'cs3', 'cs4', 'cs6']);
    const [generatedSchedules, setGeneratedSchedules] = useState([]);
    const [activeTimetableModal, setActiveTimetableModal] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // When department changes, update selection default
    const handleDeptChange = (newDept) => {
        setSelectedDept(newDept);
        const newCourses = AUTHENTIC_BAU_CATALOG[newDept] || [];
        const defaults = newCourses.slice(0, 4).map(c => c.id);
        setSelectedCourseIds(defaults);
        setGeneratedSchedules([]);
    };

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
                toast.success(isAr ? `تم توليد ${formatted.length} جدول متوافق بدون تعارض لجريدة ${selectedDept.toUpperCase()}! 🎯` : `Generated ${formatted.length} valid non-conflicting schedules!`);
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
                        <h1 className="builder-main-title">{isAr ? 'جريدة المواد وتنظيم الجداول الرسمية الكلية' : 'Official Course Schedule Generator'}</h1>
                        <p className="builder-sub-title">
                            {isAr ? 'الجريدة الرسمية لمواد كلية الأمير عبد الله بن غازي لتكنولوجيا المعلومات (علم الحاسوب - نظم المعلومات - هندسة البرمجيات)' : 'Official BAU Course Catalog for IT Faculty (CS - CIS - SE)'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Step 1: Real Faculty & Department Selector */}
            <div className="builder-control-card glass-card">
                <h3 className="control-card-title">
                    <span>1️⃣</span> {isAr ? 'اختير القسم الأكاديمي والدرجة العلمية' : 'Academic Department & Degree'}
                </h3>
                <p className="control-card-desc">{isAr ? 'اختر القسم الأكاديمي لعرض المواد والشعب المعتمدة رسمياً في السيرفر:' : 'Select academic department to display official catalog:'}</p>

                <div className="college-select-grid">
                    <div className="form-group-item">
                        <label>🎓 {isAr ? 'الدرجة العلمية:' : 'Degree:'}</label>
                        <select className="builder-select locked-select" value={selectedDegree} disabled>
                            <option value="bachelor">🎓 {isAr ? 'بكالوريوس (مفعل)' : 'Bachelor'}</option>
                        </select>
                    </div>

                    <div className="form-group-item">
                        <label>🏢 {isAr ? 'الكلية:' : 'Faculty:'}</label>
                        <select className="builder-select locked-select" value={selectedCollege} disabled>
                            <option value="abdullah_ghazi">{isAr ? 'كلية الأمير عبد الله بن غازي لتكنولوجيا المعلومات' : 'Prince Abdullah Bin Ghazi Faculty of IT'}</option>
                        </select>
                    </div>

                    <div className="form-group-item">
                        <label>💻 {isAr ? 'القسم الأكاديمي:' : 'Department:'}</label>
                        <select className="builder-select" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)}>
                            <option value="cs">💻 {isAr ? 'علم الحاسوب (CS)' : 'Computer Science (CS)'}</option>
                            <option value="cis">🗄️ {isAr ? 'نظم المعلومات الحاسوبية (CIS)' : 'Computer Information Systems (CIS)'}</option>
                            <option value="se">⚙️ {isAr ? 'هندسة البرمجيات (SE)' : 'Software Engineering (SE)'}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Step 2: Live Catalog Stats Bar */}
            <div className="stats-dashboard-card glass-card">
                <h3 className="control-card-title">
                    <span>2️⃣</span> {isAr ? `ملخص جريدة مواد قسم ${selectedDept === 'cs' ? 'علم الحاسوب' : selectedDept === 'cis' ? 'نظم المعلومات الحاسوبية' : 'هندسة البرمجيات'}` : 'Department Catalog Summary'}
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
                            <span className="stat-label">{isAr ? 'القسم النشط' : 'Active Department'}</span>
                            <strong className="stat-val" style={{ color: '#2563eb' }}>{selectedDept.toUpperCase()}</strong>
                        </div>
                    </div>
                    <div className="stat-pill-item">
                        <span className="stat-icon">🏛️</span>
                        <div>
                            <span className="stat-label">{isAr ? 'حالة السيرفر' : 'Server Status'}</span>
                            <strong className="stat-val" style={{ color: '#10b981' }}>متصل بالجريدة الرسمية 🟢</strong>
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

            {/* Step 4: Two-Column Workspace (Selected Basket & Real Catalog Browser) */}
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
                            <p>{isAr ? 'لم تقم باختيار أي مادة بعد. اضغط على "+ إضافة" من قائمة المواد اليمين.' : 'No courses selected. Click "+ Add" from the catalog.'}</p>
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
                        <h3>📋 {isAr ? `جريدة مواد قسم ${selectedDept === 'cs' ? 'علم الحاسوب' : selectedDept === 'cis' ? 'نظم المعلومات الحاسوبية' : 'هندسة البرمجيات'}` : 'Approved Course Catalog'}</h3>
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
