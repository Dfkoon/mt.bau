import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import GPACalculator from '../components/GPACalculator';
import gradingHero from '../assets/heros/grading_system_hero.png';
import './GradingSystem.css';

const GradingSystem = () => {
    const { language } = useLanguage();

    const isAr = language === 'ar';

    return (
        <div className="grading-system-page">
            {/* Main Hero Section */}
            <section className="grading-hero" style={{ backgroundImage: `url(${gradingHero})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>{isAr ? 'نظام العلامات' : 'Grading System'}</h1>
                    <p>{isAr ? 'استكشف أنظمة العلامات المختلفة والمعلومات المتعلقة بها' : 'Explore different grading systems and related information'}</p>
                </div>
            </section>

            <div className="grading-container">
                {/* Announcement Section */}
                <section className="announcement-section glass-card" data-aos="fade-up">
                    <h2 className="section-title">
                        {isAr ? 'تحديثات نظام العلامات 2025/2026' : 'Grading System Updates 2025/2026'}
                    </h2>
                    <div className="announcement-grid">
                        <div className="announcement-card success">
                            <span className="announcement-icon">✨</span>
                            <p>
                                {isAr
                                    ? 'تم إقرار تعديلات إيجابية على أوزان النقاط لدعم الطلبة وتحفيزهم، اعتباراً من الفصل الدراسي الأول للعام الدراسي 2025/2026.'
                                    : 'Positive amendments to grade weights have been approved to support and motivate students, effective from the first semester of the academic year 2025/2026.'}
                            </p>
                        </div>
                        <div className="announcement-card warning">
                            <span className="announcement-icon">⚠️</span>
                            <p>
                                {isAr
                                    ? 'تنبيه: تم رفع وزن علامة (D-) لتخفيف أثرها على المعدل التراكمي، مع التأكيد أنها تبقى علامة رسوب ولا تُعد من علامات النجاح.'
                                    : 'Note: The weight of the (D-) grade has been increased to reduce its impact on the GPA, but it remains a failing grade.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* GPA Calculator Section */}
                <section data-aos="fade-up">
                    <GPACalculator />
                </section>

                {/* New Grading System Table */}
                <section className="grading-section glass-card" data-aos="fade-up">
                    <h3>
                        {isAr ? 'نظام النقاط الجديد (' : 'New Point System ('}
                        <span className="highlight-text">2026/2025</span>
                        {isAr ? ')' : ')'}
                    </h3>
                    <p className="section-desc">
                        {isAr ? 'يوضح الجدول التالي الرموز والنقاط وحالة النجاح وفقاً للتعديلات الأخيرة:' : 'The following table shows symbols, points, and pass status according to the latest amendments:'}
                    </p>

                    <div className="table-responsive">
                        <table className="grading-table">
                            <thead>
                                <tr>
                                    <th>{isAr ? 'الرمز' : 'Symbol'}</th>
                                    <th>{isAr ? 'الحالة' : 'Status'}</th>
                                    <th>{isAr ? 'النقاط (الوزن)' : 'Points (Weight)'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { grade: 'A', status: isAr ? 'ناجح' : 'Pass', points: '4.00', class: 'pass' },
                                    { grade: 'A-', status: isAr ? 'ناجح' : 'Pass', points: '3.75', class: 'pass' },
                                    { grade: 'B+', status: isAr ? 'ناجح' : 'Pass', points: '3.50', class: 'pass' },
                                    { grade: 'B', status: isAr ? 'ناجح' : 'Pass', points: '3.25', class: 'pass' },
                                    { grade: 'B-', status: isAr ? 'ناجح' : 'Pass', points: '3.00', class: 'pass' },
                                    { grade: 'C+', status: isAr ? 'ناجح' : 'Pass', points: '2.75', class: 'pass' },
                                    { grade: 'C', status: isAr ? 'ناجح' : 'Pass', points: '2.50', class: 'pass' },
                                    { grade: 'C-', status: isAr ? 'ناجح' : 'Pass', points: '2.00', class: 'pass' },
                                    { grade: 'D+', status: isAr ? 'ناجح' : 'Pass', points: '1.75', class: 'pass' },
                                    { grade: 'D', status: isAr ? 'ناجح' : 'Pass', points: '1.25', class: 'pass' },
                                    { grade: 'D-', status: isAr ? 'راسب' : 'Fail', points: '1.00', class: 'fail' },
                                    { grade: 'F', status: isAr ? 'راسب' : 'Fail', points: '0.50', class: 'fail' },
                                ].map((row, index) => (
                                    <tr key={index} className={row.class === 'fail' ? 'row-fail' : ''}>
                                        <td className="grade-col">{row.grade}</td>
                                        <td>
                                            <span className={`status-badge ${row.class}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="points-col">{row.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Comparison Table (Old vs New) */}
                <section className="grading-section glass-card" data-aos="fade-up">
                    <h3>
                        {isAr ? 'مقارنة الأوزان (القديم vs الجديد)' : 'Weight Comparison (Old vs New)'}
                    </h3>
                    <p className="section-desc">
                        {isAr ? 'يوضح الجدول التالي التغييرات الإيجابية التي طرأت على أوزان العلامات:' : 'The following table shows the positive changes in grade weights:'}
                    </p>

                    <div className="table-responsive">
                        <table className="grading-table comparison-table">
                            <thead>
                                <tr>
                                    <th>{isAr ? 'الفئة' : 'Category'}</th>
                                    <th>{isAr ? 'الوزن القديم' : 'Old Weight'}</th>
                                    <th className="new-weight-header">{isAr ? 'الوزن الجديد' : 'New Weight'}</th>
                                    <th>{isAr ? 'الفرق' : 'Difference'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { grade: 'B', old: '3.00', new: '3.25', diff: '+0.25' },
                                    { grade: 'B-', old: '2.75', new: '3.00', diff: '+0.25' },
                                    { grade: 'C+', old: '2.50', new: '2.75', diff: '+0.25' },
                                    { grade: 'C', old: '2.00', new: '2.50', diff: '+0.50' },
                                    { grade: 'C-', old: '1.75', new: '2.00', diff: '+0.25' },
                                    { grade: 'D+', old: '1.50', new: '1.75', diff: '+0.25' },
                                    { grade: 'D', old: '1.00', new: '1.25', diff: '+0.25' },
                                    { grade: 'D-', old: '0.75', new: '1.00', diff: '+0.25' },
                                ].map((row, index) => (
                                    <tr key={index}>
                                        <td className="grade-col">{row.grade}</td>
                                        <td className="old-val">{row.old}</td>
                                        <td className="new-val">{row.new}</td>
                                        <td className="diff-val">{row.diff}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Letter Grading System */}
                <section className="grading-section glass-card" data-aos="fade-up">
                    <h3>{isAr ? 'نظام العلامات بالحروف' : 'Letter Grading System'}</h3>
                    <p className="section-desc">
                        {isAr ? 'يوضح الجدول التالي رموز التقديرات وفقًا لنظام العلامات بالحروف:' : 'The following table shows grade symbols according to the letter grading system:'}
                    </p>

                    <div className="table-responsive">
                        <table className="grading-table compact">
                            <thead>
                                <tr>
                                    <th>{isAr ? 'التقدير' : 'Grade'}</th>
                                    <th>{isAr ? 'النقاط' : 'Points'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { grade: isAr ? 'ممتاز' : 'Excellent', points: '4.0 – 3.65' },
                                    { grade: isAr ? 'جيد جداً' : 'Very Good', points: '3.64 – 3.0' },
                                    { grade: isAr ? 'جيد' : 'Good', points: '2.99 – 2.5' },
                                    { grade: isAr ? 'مقبول' : 'Satisfactory', points: '2.49 – 2.0' },
                                    { grade: isAr ? 'ضعيف' : 'Weak', points: isAr ? 'دون 2' : 'Below 2' },
                                ].map((row, index) => (
                                    <tr key={index}>
                                        <td className="grade-col">{row.grade}</td>
                                        <td className="points-col">{row.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default GradingSystem;
