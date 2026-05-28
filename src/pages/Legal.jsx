import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Legal.css';

const Legal = () => {
    const { language, t } = useLanguage();
    const isAr = language === 'ar';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <div className="legal-hero-overlay"></div>
                <div className="legal-hero-content">
                    <h1>{isAr ? 'حقوق الملكية والخصوصية' : 'Copyright & Privacy'} ⚖️</h1>
                    <p>{isAr ? 'المعلومات القانونية وسياسة استخدام منصة مكانك الجامعي' : 'Legal information and usage policy for Makanak Al-Jami\'i'}</p>
                </div>
            </div>

            <div className="legal-container">
                <section className="legal-section glass-card animate-fade">
                    <h2>{isAr ? '🛡️ الملكية الفكرية' : '🛡️ Intellectual Property'}</h2>
                    <p>
                        {isAr
                            ? 'جميع المحتويات المتوفرة على منصة "مكانك الجامعي"، بما في ذلك التصاميم، النصوص، البرمجيات، الصور، والشعارات، هي ملكية حصرية للمطور "حسين Koon" وفريق العمل، ومحمية بموجب قوانين الملكية الفكرية المعمول بها.'
                            : 'All content available on the "Makanak Al-Jami\'i" platform, including designs, text, software, images, and logos, is the exclusive property of developer "Hussien Koon" and the team, protected under applicable intellectual property laws.'}
                    </p>
                    <p>
                        {isAr
                            ? 'يُمنع منعاً باتاً نسخ، إعادة إنتاج، أو توزيع أي جزء من الموقع لأغراض تجارية دون الحصول على إذن خطي مسبق.'
                            : 'It is strictly prohibited to copy, reproduce, or distribute any part of the site for commercial purposes without prior written permission.'}
                    </p>
                </section>

                <section className="legal-section glass-card animate-fade" style={{ animationDelay: '0.1s' }}>
                    <h2>{isAr ? '📜 سياسة الاستخدام' : '📜 Terms of Use'}</h2>
                    <ul>
                        <li>
                            {isAr
                                ? 'يتم توفير المحتوى والمواد الدراسية للأغراض التعليمية فقط لمساعدة الطلاب.'
                                : 'Content and study materials are provided for educational purposes only to assist students.'}
                        </li>
                        <li>
                            {isAr
                                ? 'الموقع غير مسؤول عن أي محتوى خارجي يتم الوصول إليه عبر الروابط الموجودة.'
                                : 'The site is not responsible for any external content reached via existing links.'}
                        </li>
                        <li>
                            {isAr
                                ? 'يجب استخدام "نشمي شات" لأغراض أكاديمية ومهذبة، وأي إساءة ستعرض المستخدم للمساءلة.'
                                : '"Nashmi Chat" must be used for academic and polite purposes; any abuse will hold the user accountable.'}
                        </li>
                    </ul>
                </section>

                <section className="legal-section glass-card animate-fade" style={{ animationDelay: '0.2s' }}>
                    <h2>{isAr ? '🔒 سياسة الخصوصية' : '🔒 Privacy Policy'}</h2>
                    <p>
                        {isAr
                            ? 'نحن نحترم خصوصيتك. الموقع لا يقوم بجمع أي بيانات شخصية حساسة دون علمك. البيانات التي يتم جمعها في قسم "الاقتراحات" أو "تبادل المواد" تُستخدم فقط لغرض التواصل وتحسين الخدمة.'
                            : 'We respect your privacy. The site does not collect sensitive personal data without your knowledge. Data collected in the "Suggestions" or "Material Exchange" sections is used only for communication and service improvement.'}
                    </p>
                </section>

                <section className="legal-section glass-card animate-fade" style={{ animationDelay: '0.3s' }}>
                    <h2>{isAr ? '⚖️ إخلاء المسؤولية' : '⚖️ Disclaimer'}</h2>
                    <p>
                        {isAr
                            ? 'مشروع "مكانك الجامعي" هو مبادرة طلابية تطوعية غير رسمية، ولا يمثل جامعة البلقاء التطبيقية بشكل رسمي. جميع المعلومات الواردة هي اجتهادات شخصية لمساعدة الطلاب.'
                            : '"Makanak Al-Jami\'i" project is an unofficial voluntary student initiative and does not officially represent Al-Balqa Applied University. All information provided consists of personal efforts to help students.'}
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Legal;
