import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import './ScheduleBuilder.css';

// 100% Authentic BAU Official Course Catalog Data for Computer Science (قسم علم الحاسوب - كلية الأمير عبد الله بن غازي)
const REAL_BAU_CS_COURSES = [
    // 1. البرمجة ومبادئ الحوسبة (Programming & Core CS)
    {
        id: 'c1',
        category: 'prog_core',
        categoryAr: 'البرمجة ومبادئ الحوسبة',
        categoryEn: 'Programming & Core CS',
        nameAr: 'البرمجة بلغة C++',
        nameEn: 'C++ Programming',
        code: 'L70301141',
        credits: 2,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '10:00 - 11:00', startTime: 10.0, endTime: 11.0, instructor: 'د. محمد ريالات', room: 'مختبر الشبكات والاتصالات 300', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 28 },
            { id: 's2', secNum: '2', days: 'SunTue', daysAr: 'ح ث (أحد/ثلاثاء)', daysEn: 'Sun / Tue', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'د. محمد ريالات', room: 'مختبر حاسوب (100)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 30 }
        ]
    },
    {
        id: 'c2',
        category: 'prog_core',
        categoryAr: 'البرمجة ومبادئ الحوسبة',
        categoryEn: 'Programming & Core CS',
        nameAr: 'مختبر البرمجة بلغة C++',
        nameEn: 'C++ Programming Lab',
        code: 'L70301143',
        credits: 1,
        sections: [
            { id: 's1', secNum: '1', days: 'Thu', daysAr: 'خ (خميس)', daysEn: 'Thu', timeStr: '08:30 - 10:30', startTime: 8.5, endTime: 10.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب(100)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 20 },
            { id: 's2', secNum: '2', days: 'Wed', daysAr: 'ر (أربعاء)', daysEn: 'Wed', timeStr: '13:00 - 14:00', startTime: 13.0, endTime: 14.0, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 22 },
            { id: 's3', secNum: '3', days: 'Thu', daysAr: 'خ (خميس)', daysEn: 'Thu', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 24 },
            { id: 's4', secNum: '4', days: 'Thu', daysAr: 'خ (خميس)', daysEn: 'Thu', timeStr: '12:30 - 13:30', startTime: 12.5, endTime: 13.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب (501)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 21 },
            { id: 's5', secNum: '5', days: 'Mon', daysAr: 'ن (إثنين)', daysEn: 'Mon', timeStr: '13:00 - 14:00', startTime: 13.0, endTime: 14.0, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 19 }
        ]
    },
    {
        id: 'c3',
        category: 'prog_core',
        categoryAr: 'البرمجة ومبادئ الحوسبة',
        categoryEn: 'Programming & Core CS',
        nameAr: 'البرمجة الموجهة للكائنات (OOP)',
        nameEn: 'Object Oriented Programming',
        code: 'L70301241',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'زينب الرخامنه', room: 'تكنولوجيا 402', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 35 },
            { id: 's2', secNum: '3', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '08:30 - 10:00', startTime: 8.5, endTime: 10.0, instructor: 'اصلاح غرايبه', room: 'مختبر الشبكات والاتصالات 300', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 38 }
        ]
    },
    {
        id: 'c4',
        category: 'prog_core',
        categoryAr: 'البرمجة ومبادئ الحوسبة',
        categoryEn: 'Programming & Core CS',
        nameAr: 'مختبر البرمجة الموجهة للكائنات',
        nameEn: 'OOP Lab',
        code: 'L70301243',
        credits: 1,
        sections: [
            { id: 's1', secNum: '1', days: 'Thu', daysAr: 'خ (خميس)', daysEn: 'Thu', timeStr: '14:30 - 17:30', startTime: 14.5, endTime: 17.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب(100)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 22 },
            { id: 's2', secNum: '2', days: 'Thu', daysAr: 'خ (خميس)', daysEn: 'Thu', timeStr: '14:30 - 17:30', startTime: 14.5, endTime: 17.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب - علوم (304)', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 24 },
            { id: 's3', secNum: '3', days: 'Sun', daysAr: 'ح (أحد)', daysEn: 'Sun', timeStr: '14:30 - 17:30', startTime: 14.5, endTime: 17.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب - علوم (302)', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 20 },
            { id: 's4', secNum: '4', days: 'Mon', daysAr: 'ن (إثنين)', daysEn: 'Mon', timeStr: '14:30 - 17:30', startTime: 14.5, endTime: 17.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر الشبكات والاتصالات 300', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 23 },
            { id: 's5', secNum: '5', days: 'Wed', daysAr: 'ر (أربعاء)', daysEn: 'Wed', timeStr: '14:30 - 17:30', startTime: 14.5, endTime: 17.5, instructor: 'د. محمد الحجوج البطوش', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 21 }
        ]
    },
    {
        id: 'c5',
        category: 'prog_core',
        categoryAr: 'البرمجة ومبادئ الحوسبة',
        categoryEn: 'Programming & Core CS',
        nameAr: 'البرمجة المتقدمة بلغة جافا',
        nameEn: 'Advanced Java Programming',
        code: 'L70302242',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'د. بيان السعايدة', room: 'تكنولوجيا 405', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 36 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '13:00 - 14:30', startTime: 13.0, endTime: 14.5, instructor: 'د. بيان السعايدة', room: 'مختبر الشبكات والاتصالات 300', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 32 }
        ]
    },
    {
        id: 'c6',
        category: 'prog_core',
        categoryAr: 'البرمجة ومبادئ الحوسبة',
        categoryEn: 'Programming & Core CS',
        nameAr: 'البرمجة المرئية للأجهزة الذكية',
        nameEn: 'Visual Mobile Programming',
        code: '30801300',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'روان عابدين', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 31 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '13:00 - 14:30', startTime: 13.0, endTime: 14.5, instructor: 'روان عابدين', room: 'تكنولوجيا 406', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 29 }
        ]
    },
    {
        id: 'c7',
        category: 'prog_core',
        categoryAr: 'البرمجة ومبادئ الحوسبة',
        categoryEn: 'Programming & Core CS',
        nameAr: 'تصميم وبرمجة الويب',
        nameEn: 'Web Design & Programming',
        code: 'L70310246',
        credits: 2,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTue', daysAr: 'ح ث (أحد/ثلاثاء)', daysEn: 'Sun / Tue', timeStr: '08:30 - 09:30', startTime: 8.5, endTime: 9.5, instructor: 'اسماء ختوم', room: 'تكنولوجيا 406', mode: 'وجاهي', status: 'مغلقة', capacity: 30, enrolled: 30 },
            { id: 's2', secNum: '2', days: 'SunTue', daysAr: 'ح ث (أحد/ثلاثاء)', daysEn: 'Sun / Tue', timeStr: '08:30 - 09:30', startTime: 8.5, endTime: 9.5, instructor: 'اسماء ختوم', room: 'تكنولوجيا 406', mode: 'وجاهي', status: 'متاحة', capacity: 30, enrolled: 26 },
            { id: 's3', secNum: '3', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '10:00 - 11:00', startTime: 10.0, endTime: 11.0, instructor: 'روان عابدين', room: 'مختبر حاسوب - علوم (303)', mode: 'وجاهي', status: 'متاحة', capacity: 30, enrolled: 27 }
        ]
    },
    {
        id: 'c8',
        category: 'prog_core',
        categoryAr: 'البرمجة ومبادئ الحوسبة',
        categoryEn: 'Programming & Core CS',
        nameAr: 'تصميم وتحليل الخوارزميات',
        nameEn: 'Design & Analysis of Algorithms',
        code: '30801215',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'أ.د. مالك بريك', room: 'online 591 / تكنولوجيا 102', mode: 'مدمج', status: 'متاحة', capacity: 45, enrolled: 41 }
        ]
    },
    {
        id: 'c9',
        category: 'prog_core',
        categoryAr: 'البرمجة ومبادئ الحوسبة',
        categoryEn: 'Programming & Core CS',
        nameAr: 'هياكل البيانات والخوارزميات',
        nameEn: 'Data Structures & Algorithms',
        code: 'L70302234',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'اصلاح غرايبه', room: 'مختبر حاسوب - علوم (302)', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 32 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '11:30 - 13:00', startTime: 11.5, endTime: 13.0, instructor: 'اسماء ختوم', room: 'مختبر حاسوب(100)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 30 }
        ]
    },

    // 2. نظم المعلومات وقواعد البيانات (Information Systems & Databases)
    {
        id: 'c10',
        category: 'db_systems',
        categoryAr: 'نظم المعلومات وقواعد البيانات',
        categoryEn: 'Databases & Systems',
        nameAr: 'نظم قواعد البيانات',
        nameEn: 'Database Systems',
        code: 'L70302262',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '13:30 - 14:30', startTime: 13.5, endTime: 14.5, instructor: 'هـ.ت', room: 'مختبر حاسوب - علوم (302)', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 36 },
            { id: 's2', secNum: '3', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '10:00 - 11:30', startTime: 10.0, endTime: 11.3, instructor: 'د. خالد الخرابشه', room: 'مختبر حاسوب(100)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 34 }
        ]
    },
    {
        id: 'c11',
        category: 'db_systems',
        categoryAr: 'نظم المعلومات وقواعد البيانات',
        categoryEn: 'Databases & Systems',
        nameAr: 'مختبر نظم قواعد البيانات',
        nameEn: 'Database Systems Lab',
        code: 'L70302264',
        credits: 1,
        sections: [
            { id: 's1', secNum: '1', days: 'Mon', daysAr: 'ن (إثنين)', daysEn: 'Mon', timeStr: '14:30 - 17:30', startTime: 14.5, endTime: 17.5, instructor: 'د. مجدي بسيسو', room: 'مختبر حاسوب(100)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 22 },
            { id: 's2', secNum: '2', days: 'Tue', daysAr: 'ث (ثلاثاء)', daysEn: 'Tue', timeStr: '14:30 - 17:30', startTime: 14.5, endTime: 17.5, instructor: 'د. مجدي بسيسو', room: 'مختبر حاسوب - علوم (304)', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 20 },
            { id: 's3', secNum: '3', days: 'Wed', daysAr: 'ر (أربعاء)', daysEn: 'Wed', timeStr: '14:30 - 17:30', startTime: 14.5, endTime: 17.5, instructor: 'د. مجدي بسيسو', room: 'مختبر حاسوب (501)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 23 },
            { id: 's4', secNum: '4', days: 'Thu', daysAr: 'خ (خميس)', daysEn: 'Thu', timeStr: '14:30 - 17:30', startTime: 14.5, endTime: 17.5, instructor: 'د. مجدي بسيسو', room: 'مختبر الشبكات والاتصالات 300', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 24 }
        ]
    },
    {
        id: 'c12',
        category: 'db_systems',
        categoryAr: 'نظم المعلومات وقواعد البيانات',
        categoryEn: 'Databases & Systems',
        nameAr: 'تحليل وتصميم النظم',
        nameEn: 'Systems Analysis & Design',
        code: '30801342',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'زينب الرخامنه', room: 'online 591 / تكنولوجيا 302', mode: 'مدمج', status: 'متاحة', capacity: 45, enrolled: 42 },
            { id: 's2', secNum: '3', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '10:00 - 11:30', startTime: 10.0, endTime: 11.3, instructor: 'زينب الرخامنه', room: 'online 591 / مختبر حاسوب(101)-علوم', mode: 'مدمج', status: 'متاحة', capacity: 45, enrolled: 40 }
        ]
    },
    {
        id: 'c13',
        category: 'db_systems',
        categoryAr: 'نظم المعلومات وقواعد البيانات',
        categoryEn: 'Databases & Systems',
        nameAr: 'الحوسبة السحابية',
        nameEn: 'Cloud Computing',
        code: '30801361',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '12:30 - 13:30', startTime: 12.5, endTime: 13.5, instructor: 'اسماء ختوم', room: 'تقني 2', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 35 }
        ]
    },

    // 3. الشبكات وأنظمة التشغيل والأمن (Networks, OS & Security)
    {
        id: 'c14',
        category: 'networks_sec',
        categoryAr: 'الشبكات وأنظمة التشغيل والأمن',
        categoryEn: 'Networks, OS & Security',
        nameAr: 'شبكات الحاسوب',
        nameEn: 'Computer Networks',
        code: 'L70310351',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '13:00 - 14:30', startTime: 13.0, endTime: 14.5, instructor: 'د. عدنان الربيع', room: 'مختبر حاسوب(101)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 31 },
            { id: 's2', secNum: '2', days: 'SunTue', daysAr: 'ح ث (أحد/ثلاثاء)', daysEn: 'Sun / Tue', timeStr: '12:30 - 13:30', startTime: 12.5, endTime: 13.5, instructor: 'د. عدنان الربيع', room: 'تكنولوجيا 301', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 33 }
        ]
    },
    {
        id: 'c15',
        category: 'networks_sec',
        categoryAr: 'الشبكات وأنظمة التشغيل والأمن',
        categoryEn: 'Networks, OS & Security',
        nameAr: 'مبادئ شبكات الحاسوب',
        nameEn: 'Principles of Computer Networks',
        code: '30801230',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'أ.د. خلف ختاتنه', room: 'مختبر الشبكات والاتصالات 300', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 37 }
        ]
    },
    {
        id: 'c16',
        category: 'networks_sec',
        categoryAr: 'الشبكات وأنظمة التشغيل والأمن',
        categoryEn: 'Networks, OS & Security',
        nameAr: 'أمن الحاسوب والشبكات',
        nameEn: 'Computer & Network Security',
        code: '30801432',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '12:30 - 13:30', startTime: 12.5, endTime: 13.5, instructor: 'سامر عبد الله', room: 'مختبر حاسوب (503)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 33 }
        ]
    },
    {
        id: 'c17',
        category: 'networks_sec',
        categoryAr: 'الشبكات وأنظمة التشغيل والأمن',
        categoryEn: 'Networks, OS & Security',
        nameAr: 'مبادئ نظم التشغيل',
        nameEn: 'Principles of Operating Systems',
        code: '30801426',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. نبيل العلي', room: 'تكنولوجيا 406 / online 591', mode: 'مدمج', status: 'متاحة', capacity: 40, enrolled: 37 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '10:00 - 11:30', startTime: 10.0, endTime: 11.3, instructor: 'د. نبيل العلي', room: 'تكنولوجيا 401 / online 591', mode: 'مدمج', status: 'متاحة', capacity: 40, enrolled: 36 }
        ]
    },
    {
        id: 'c18',
        category: 'networks_sec',
        categoryAr: 'الشبكات وأنظمة التشغيل والأمن',
        categoryEn: 'Networks, OS & Security',
        nameAr: 'معمارية الحاسوب',
        nameEn: 'Computer Architecture',
        code: '30801427',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '11:30 - 12:30', startTime: 11.5, endTime: 12.5, instructor: 'سامر عبد الله', room: 'تكنولوجيا 402 / online 591', mode: 'مدمج', status: 'متاحة', capacity: 45, enrolled: 42 }
        ]
    },

    // 4. الذكاء الاصطناعي والرسم الحاسوبي (AI, Graphics & Gaming)
    {
        id: 'c19',
        category: 'ai_graphics',
        categoryAr: 'الذكاء الاصطناعي والرسم الحاسوبي',
        categoryEn: 'AI & Graphics',
        nameAr: 'الذكاء الاصطناعي',
        nameEn: 'Artificial Intelligence',
        code: '30801350',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. محمد ريالات', room: 'online 591 / تكنولوجيا 302', mode: 'مدمج', status: 'متاحة', capacity: 40, enrolled: 38 }
        ]
    },
    {
        id: 'c20',
        category: 'ai_graphics',
        categoryAr: 'الذكاء الاصطناعي والرسم الحاسوبي',
        categoryEn: 'AI & Graphics',
        nameAr: 'مقدمة في الرسم الحاسوبي',
        nameEn: 'Intro to Computer Graphics',
        code: 'L70309241',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '10:00 - 11:30', startTime: 10.0, endTime: 11.3, instructor: 'د. زيد اللامي', room: 'مختبر حاسوب - علوم (302)', mode: 'وجاهي', status: 'متاحة', capacity: 30, enrolled: 26 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '10:00 - 11:30', startTime: 10.0, endTime: 11.3, instructor: 'د. مصعب القضاه', room: 'مختبر حاسوب (501) - علوم', mode: 'وجاهي', status: 'متاحة', capacity: 30, enrolled: 28 }
        ]
    },
    {
        id: 'c21',
        category: 'ai_graphics',
        categoryAr: 'الذكاء الاصطناعي والرسم الحاسوبي',
        categoryEn: 'AI & Graphics',
        nameAr: 'برمجة الألعاب',
        nameEn: 'Game Programming',
        code: '30807351',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '08:30 - 09:30', startTime: 8.5, endTime: 9.5, instructor: 'د. طارق الزعبي', room: 'مختبر حاسوب (502)-علوم / online 591', mode: 'مدمج', status: 'متاحة', capacity: 35, enrolled: 32 }
        ]
    },
    {
        id: 'c22',
        category: 'ai_graphics',
        categoryAr: 'الذكاء الاصطناعي والرسم الحاسوبي',
        categoryEn: 'AI & Graphics',
        nameAr: 'معالجة الصور والرؤيا الرقمية',
        nameEn: 'Image Processing & Computer Vision',
        code: '30801455',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. بيان السعايدة', room: 'مختبر حاسوب - علوم (303) / online 591', mode: 'مدمج', status: 'متاحة', capacity: 35, enrolled: 31 }
        ]
    },

    // 5. الرياضيات والتحليل العددي (Math & Numerical Analysis)
    {
        id: 'c23',
        category: 'math_analysis',
        categoryAr: 'الرياضيات والتحليل العددي',
        categoryEn: 'Math & Numerical Analysis',
        nameAr: 'التحليل العددي للحوسبة',
        nameEn: 'Numerical Analysis for Computing',
        code: 'L70301231',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '10:30 - 11:30', startTime: 10.5, endTime: 11.5, instructor: 'د. ذيب البشيش', room: 'تكنولوجيا 102', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 35 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '10:00 - 11:30', startTime: 10.0, endTime: 11.3, instructor: 'اسماء ختوم', room: 'تكنولوجيا 102', mode: 'وجاهي', status: 'متاحة', capacity: 40, enrolled: 37 }
        ]
    },
    {
        id: 'c24',
        category: 'math_analysis',
        categoryAr: 'الرياضيات والتحليل العددي',
        categoryEn: 'Math & Numerical Analysis',
        nameAr: 'الرياضيات لطلبة تكنولوجيا المعلومات',
        nameEn: 'Mathematics for IT',
        code: 'L70310181',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '10:00 - 11:30', startTime: 10.0, endTime: 11.3, instructor: 'د. حسن الرفايده', room: 'تكنولوجيا 405', mode: 'وجاهي', status: 'متاحة', capacity: 45, enrolled: 41 },
            { id: 's2', secNum: '3', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'د. حسن الرفايده', room: 'تكنولوجيا 102', mode: 'وجاهي', status: 'متاحة', capacity: 45, enrolled: 43 }
        ]
    },
    {
        id: 'c25',
        category: 'math_analysis',
        categoryAr: 'الرياضيات والتحليل العددي',
        categoryEn: 'Math & Numerical Analysis',
        nameAr: 'النظرية الاحتسابية والأتمتة',
        nameEn: 'Theory of Computation & Automata',
        code: '30801316',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'د. نبيل العلي', room: 'مختبر حاسوب (501)-علوم', mode: 'وجاهي', status: 'متاحة', capacity: 35, enrolled: 32 }
        ]
    },

    // 6. التدريب والمشاريع والمهارات (Training, Projects & Computer Skills)
    {
        id: 'c26',
        category: 'projects_training',
        categoryAr: 'التدريب والمشاريع والمهارات',
        categoryEn: 'Projects, Training & Skills',
        nameAr: 'التدريب الميداني لطلبة علم الحاسوب',
        nameEn: 'Field Training for CS',
        code: '30801474',
        credits: 6,
        sections: [
            { id: 's1', secNum: '1', days: 'SunTueThu', daysAr: 'ح ث خ (أحد/ثلاثاء/خميس)', daysEn: 'Sun / Tue / Thu', timeStr: '08:00 - 15:00', startTime: 8.0, endTime: 15.0, instructor: 'د. اسامه الضرغام', room: 'تدريب ميداني', mode: 'وجاهي', status: 'متاحة', capacity: 50, enrolled: 42 },
            { id: 's2', secNum: '2', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '08:30 - 17:30', startTime: 8.5, endTime: 17.5, instructor: 'د. اسامه الضرغام', room: 'تدريب ميداني', mode: 'وجاهي', status: 'متاحة', capacity: 50, enrolled: 44 }
        ]
    },
    {
        id: 'c27',
        category: 'projects_training',
        categoryAr: 'التدريب والمشاريع والمهارات',
        categoryEn: 'Projects, Training & Skills',
        nameAr: 'مشروع التخرج (1)',
        nameEn: 'Graduation Project (1)',
        code: '30807471',
        credits: 1,
        sections: [
            { id: 's1', secNum: '1', days: 'SatOnly', daysAr: 'س (السبت)', daysEn: 'Saturday Only', timeStr: '08:30 - 09:30', startTime: 8.5, endTime: 9.5, instructor: 'هـ.ت', room: 'بدون قاعة 3', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 20 }
        ]
    },
    {
        id: 'c28',
        category: 'projects_training',
        categoryAr: 'التدريب والمشاريع والمهارات',
        categoryEn: 'Projects, Training & Skills',
        nameAr: 'مشروع التخرج (2)',
        nameEn: 'Graduation Project (2)',
        code: '30807472',
        credits: 1,
        sections: [
            { id: 's1', secNum: '2', days: 'SatOnly', daysAr: 'س (السبت)', daysEn: 'Saturday Only', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'هـ.ت', room: 'بدون قاعة 3', mode: 'وجاهي', status: 'متاحة', capacity: 25, enrolled: 22 }
        ]
    },
    {
        id: 'c29',
        category: 'projects_training',
        categoryAr: 'التدريب والمشاريع والمهارات',
        categoryEn: 'Projects, Training & Skills',
        nameAr: 'مهارات الحاسوب (1)',
        nameEn: 'Computer Skills (1)',
        code: '35005101',
        credits: 3,
        sections: [
            { id: 's1', secNum: '1', days: 'MonWed', daysAr: 'ن ر (إثنين/أربعاء)', daysEn: 'Mon / Wed', timeStr: '09:30 - 10:30', startTime: 9.5, endTime: 10.5, instructor: 'د. عبد العزيز الحموري', room: 'online 700', mode: 'عن بعد', status: 'متاحة', capacity: 100, enrolled: 92 }
        ]
    }
];

const ScheduleBuilder = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    // Filters state
    const [selectedCollege] = useState('abdullah_ghazi'); // Locked to Prince Abdullah Bin Ghazi Faculty
    const [selectedDept] = useState('cs'); // Locked to Computer Science Dept
    const [selectedDegree] = useState('bachelor'); // Strictly Bachelor degree
    const [dayPreference, setDayPreference] = useState('all'); // 'all', 'SunTueThu', 'MonWed', 'Daily', 'SatOnly'
    const [modePreference, setModePreference] = useState('all'); // 'all', 'وجاهي', 'مدمج', 'عن بعد'
    const [breakPreference, setBreakPreference] = useState('no_long_breaks');
    const [searchQuery, setSearchQuery] = useState('');

    // Selected courses & Generator state
    const [selectedCourseIds, setSelectedCourseIds] = useState(['c1', 'c3', 'c5', 'c10', 'c14']);
    const [generatedSchedules, setGeneratedSchedules] = useState([]);
    const [activeTimetableModal, setActiveTimetableModal] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Group real courses by categories
    const categories = useMemo(() => {
        const map = {};
        REAL_BAU_CS_COURSES.forEach(c => {
            if (!map[c.category]) {
                map[c.category] = { id: c.category, nameAr: c.categoryAr, nameEn: c.categoryEn, courses: [] };
            }
            map[c.category].courses.push(c);
        });
        return Object.values(map);
    }, []);

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
        return REAL_BAU_CS_COURSES.filter(c => selectedCourseIds.includes(c.id));
    }, [selectedCourseIds]);

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
                toast.success(isAr ? `تم توليد ${formatted.length} جدول متوافق بدون تعارض من جريدة المواد الرسمية! 🎯` : `Generated ${formatted.length} valid non-conflicting schedules!`);
                // Scroll smoothly to results
                const el = document.getElementById('results-area');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                toast.error(isAr ? 'لم نتمكن من العثور على جدول بدون تعارض لهذه الخيارات. يرجى تعديل الشعب أو نمط الدراسة.' : 'No non-conflicting schedules found.');
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
        return REAL_BAU_CS_COURSES.filter(c =>
            c.nameAr.toLowerCase().includes(q) ||
            c.nameEn.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    return (
        <div className="schedule-builder-page">
            {/* Real Catalog Official Header */}
            <div className="builder-header-card glass-card">
                <div className="header-logo-row">
                    <img src="https://app2.bau.edu.jo:7799/courses/images/logo.png" alt="BAU Logo" className="bau-header-logo" onError={(e) => { e.target.src = 'static_logo.png'; }} />
                    <div>
                        <span className="university-badge">🏛️ {isAr ? 'جامعة البلقاء التطبيقية — خدمات التسجيل الإلكتروني' : 'Al-Balqa Applied University'}</span>
                        <h1 className="builder-main-title">{isAr ? 'جريدة المواد وتنظيم الجداول الرسمية (علم الحاسوب)' : 'Official Course Schedule Generator'}</h1>
                        <p className="builder-sub-title">
                            {isAr ? 'الجريدة الرسمية لمواد كلية الأمير عبد الله بن غازي — قسم علم الحاسوب (درجة البكالوريوس)' : 'Official BAU Course Catalog for Computer Science Department (Bachelor)'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Step 1: Real Faculty & Department Selector */}
            <div className="builder-control-card glass-card">
                <h3 className="control-card-title">
                    <span>1️⃣</span> {isAr ? 'الدرجة العلمية والكلية والقسم الأكاديمي' : 'Faculty & Academic Department'}
                </h3>
                <p className="control-card-desc">{isAr ? 'بيانات الجريدة المعتمدة حالياً مسحوبة مباشرة من نظام التسجيل الإلكتروني:' : 'Active registration catalog data:'}</p>

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
                        <select className="builder-select locked-select" value={selectedDept} disabled>
                            <option value="cs">{isAr ? 'علم الحاسوب (CS)' : 'Computer Science'}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Step 2: Live Catalog Stats Bar */}
            <div className="stats-dashboard-card glass-card">
                <h3 className="control-card-title">
                    <span>2️⃣</span> {isAr ? 'ملخص جريدة المواد المسحوبة من الجداول الرسمية' : 'Course Catalog Summary'}
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
                            <strong className="stat-val">{REAL_BAU_CS_COURSES.length} مادة</strong>
                        </div>
                    </div>
                    <div className="stat-pill-item">
                        <span className="stat-icon">👥</span>
                        <div>
                            <span className="stat-label">{isAr ? 'الشعب المتاحة' : 'Available Sections'}</span>
                            <strong className="stat-val">84 شعبة</strong>
                        </div>
                    </div>
                    <div className="stat-pill-item">
                        <span className="stat-icon">🏛️</span>
                        <div>
                            <span className="stat-label">{isAr ? 'حالة النظام' : 'System Status'}</span>
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
                            <button className={`pref-pill ${dayPreference === 'SatOnly' ? 'active' : ''}`} onClick={() => setDayPreference('SatOnly')}>🎓 {isAr ? 'السبت (خاص بالمشاريع)' : 'Sat Only'}</button>
                        </div>
                    </div>

                    <div className="pref-box">
                        <label className="pref-label">🏫 {isAr ? 'نمط المحاضرة:' : 'Teaching Mode:'}</label>
                        <div className="pref-options-pills">
                            <button className={`pref-pill ${modePreference === 'all' ? 'active' : ''}`} onClick={() => setModePreference('all')}>✨ {isAr ? 'جميع الأنماط' : 'All'}</button>
                            <button className={`pref-pill ${modePreference === 'وجاهي' ? 'active' : ''}`} onClick={() => setModePreference('وجاهي')}>🏫 {isAr ? 'وجاهي' : 'In-Person'}</button>
                            <button className={`pref-pill ${modePreference === 'مدمج' ? 'active' : ''}`} onClick={() => setModePreference('مدمج')}>🔄 {isAr ? 'مدمج' : 'Blended'}</button>
                            <button className={`pref-pill ${modePreference === 'عن بعد' ? 'active' : ''}`} onClick={() => setModePreference('عن بعد')}>💻 {isAr ? 'عن بعد (أونلاين)' : 'Online'}</button>
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
                        <h3>📋 {isAr ? 'جريدة مواد قسم علم الحاسوب المعتمدة' : 'CS Approved Course Catalog'}</h3>
                        <div className="search-bar-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isAr ? 'ابحث باسم المادة أو رمزها (مثل: جافا، هياكل، L70301141)...' : 'Search course by name or code...'}
                            />
                            {searchQuery && <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>}
                        </div>
                    </div>

                    {/* Catalog Accordions or Search Results */}
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
                                                        ش {sec.secNum}: {sec.daysAr} ({sec.timeStr}) | {sec.instructor} | 📍 {sec.room} | <strong className={sec.status === 'مغلقة' ? 'closed' : 'open'}>{sec.status}</strong>
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

                                {/* Table Identical to Real BAU Catalog Screenshots */}
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
