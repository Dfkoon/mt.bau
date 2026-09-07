import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Legal.css';

const Legal = () => {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = isAr ? [
        {
            number: '01',
            title: 'الخصوصية وحماية البيانات',
            paragraphs: [
                'نحترم خصوصية زوار منصة مكانك الجامعي ونسعى إلى التعامل مع البيانات بمسؤولية ووضوح.',
                'قد تُستخدم البيانات التي يرسلها المستخدم عبر نماذج الاقتراحات أو تبادل المواد أو التواصل فقط لغرض تشغيل الخدمة، الرد على الطلبات، تحسين المنصة، ومنع إساءة الاستخدام. لا نبيع البيانات الشخصية ولا نشاركها لأغراض إعلانية غير مرتبطة بالخدمة.',
                'قد تعتمد بعض الخدمات على Firebase أو مزودين تقنيين آخرين لتخزين البيانات وتشغيلها. يخضع التعامل مع هذه البيانات لسياسات مزودي الخدمة وإعدادات الأمان المعتمدة لديهم.'
            ]
        },
        {
            number: '02',
            title: 'شروط الاستخدام',
            paragraphs: [
                'باستخدامك المنصة، فإنك توافق على استخدام محتواها وخدماتها لأغراض تعليمية وشخصية مشروعة، والالتزام بالأنظمة والتعليمات المعمول بها.',
                'يُمنع استخدام المنصة لنشر محتوى مسيء أو مضلل أو منتهك لحقوق الآخرين، أو لمحاولة تعطيل الخدمة، أو الوصول غير المصرح به إلى البيانات والأنظمة.',
                'يجوز لنا تعديل الخدمات أو إيقاف بعض ميزاتها أو تحديث هذه الشروط عند الحاجة. يُعد استمرار استخدام المنصة بعد نشر التحديثات موافقة على الشروط المعدلة.'
            ]
        },
        {
            number: '03',
            title: 'الملكية الفكرية وحقوق المحتوى',
            paragraphs: [
                'تشمل حقوق المنصة تصميمها وبرمجياتها وهويتها البصرية ونصوصها الأصلية. لا يجوز نسخ هذه العناصر أو إعادة نشرها أو استخدامها تجاريًا دون إذن كتابي مسبق.',
                'قد تتضمن المنصة مواد أو روابط يساهم بها الطلاب أو جهات أخرى. يتحمل مقدم المحتوى مسؤولية امتلاكه الحق في مشاركته، ويحق لنا إزالة أي محتوى يخالف الحقوق أو الأنظمة عند الإبلاغ عنه.'
            ]
        },
        {
            number: '04',
            title: 'إخلاء المسؤولية',
            paragraphs: [
                'مكانك الجامعي مبادرة طلابية مستقلة وغير رسمية، ولا تمثل جامعة البلقاء التطبيقية أو أي جهة حكومية تمثيلًا رسميًا.',
                'تُقدم المواعيد والمعلومات والمواد التعليمية للمساعدة والإرشاد فقط، وقد تتغير أو تحتوي على أخطاء. يجب الرجوع إلى المصادر الرسمية للجامعة ووحدة القبول والتسجيل قبل اتخاذ أي قرار أكاديمي أو إداري.',
                'لا نضمن استمرارية الخدمة دون انقطاع، ولا نتحمل مسؤولية القرارات أو الأضرار الناتجة عن الاعتماد الحصري على محتوى المنصة أو الروابط الخارجية.'
            ]
        },
        {
            number: '05',
            title: 'الخدمات والروابط الخارجية',
            paragraphs: [
                'قد تحتوي المنصة على روابط أو أدوات تابعة لمواقع وخدمات خارجية. تُدرج هذه الروابط لتسهيل الوصول ولا تعني اعتماد محتواها أو ضمان توفرها أو مسؤوليتنا عن ممارساتها.',
                'ينبغي مراجعة شروط الاستخدام وسياسات الخصوصية الخاصة بأي خدمة خارجية قبل إدخال بياناتك أو استخدامها.'
            ]
        },
        {
            number: '06',
            title: 'التواصل والتحديثات',
            paragraphs: [
                'للاستفسارات المتعلقة بالخصوصية أو المحتوى أو حقوق الاستخدام، يمكن التواصل معنا عبر البريد الإلكتروني: makanak.bau.jo@gmail.com.',
                'آخر تحديث لهذه الصفحة: سبتمبر 2026.'
            ]
        }
    ] : [
        {
            number: '01',
            title: 'Privacy and Data Protection',
            paragraphs: [
                "We respect the privacy of Makanak Al-Jami'i visitors and aim to handle data responsibly and transparently.",
                'Data submitted through suggestions, material exchange, or contact forms may be used to operate the service, respond to requests, improve the platform, and prevent misuse. We do not sell personal data or share it for unrelated advertising purposes.',
                'Some services may rely on Firebase or other technical providers for storage and operation. Their own privacy and security policies also apply to data processed through those services.'
            ]
        },
        {
            number: '02',
            title: 'Terms of Use',
            paragraphs: [
                'By using this platform, you agree to use its content and services for lawful personal and educational purposes and to follow applicable rules and regulations.',
                'You may not use the platform to publish abusive or misleading content, violate the rights of others, disrupt the service, or gain unauthorized access to data or systems.',
                'We may update services, suspend features, or revise these terms when necessary. Continued use after an update constitutes acceptance of the revised terms.'
            ]
        },
        {
            number: '03',
            title: 'Intellectual Property and Content Rights',
            paragraphs: [
                "The platform's design, software, visual identity, and original text are protected works. They may not be copied, republished, or used commercially without prior written permission.",
                'The platform may include content submitted by students or other parties. Contributors are responsible for having the right to share their content, and we may remove material that violates rights or applicable rules.'
            ]
        },
        {
            number: '04',
            title: 'Disclaimer',
            paragraphs: [
                "Makanak Al-Jami'i is an independent, unofficial student initiative and does not officially represent Al-Balqa Applied University or any government entity.",
                'Dates, information, and study materials are provided for guidance only and may change or contain errors. Always verify academic and administrative decisions with official university sources and the Admissions and Registration Unit.',
                'We do not guarantee uninterrupted service and are not responsible for decisions or damages resulting from exclusive reliance on platform content or external links.'
            ]
        },
        {
            number: '05',
            title: 'External Services and Links',
            paragraphs: [
                'The platform may include links or tools operated by external services. These are provided for convenience and do not imply endorsement, availability guarantees, or responsibility for their practices.',
                'Review the terms and privacy policies of external services before entering personal information or using them.'
            ]
        },
        {
            number: '06',
            title: 'Contact and Updates',
            paragraphs: [
                'For questions about privacy, content, or usage rights, contact us at: makanak.bau.jo@gmail.com.',
                'Last updated: September 2026.'
            ]
        }
    ];

    return (
        <div className="legal-page">
            <header className="legal-hero">
                <div className="legal-hero-content">
                    <p className="legal-kicker">{isAr ? 'معلومات المنصة' : 'PLATFORM INFORMATION'}</p>
                    <h1>{isAr ? 'الخصوصية والقوانين' : 'Privacy and Legal'}</h1>
                    <p>{isAr ? 'الشروط والسياسات المنظمة لاستخدام مكانك الجامعي.' : "Policies and terms governing the use of Makanak Al-Jami'i."}</p>
                </div>
            </header>

            <main className="legal-container">
                <div className="legal-intro">
                    <span>{isAr ? 'آخر تحديث: سبتمبر 2026' : 'Last updated: September 2026'}</span>
                    <p>
                        {isAr
                            ? 'نوضح هنا كيفية استخدام المنصة، وطبيعة البيانات التي قد تُعالج، وحدود مسؤوليتنا، وحقوق المحتوى.'
                            : 'This page explains how the platform may be used, how data may be handled, the limits of our responsibility, and content rights.'}
                    </p>
                </div>

                <div className="legal-sections">
                    {sections.map((section) => (
                        <section className="legal-section" key={section.number}>
                            <div className="legal-section-number">{section.number}</div>
                            <div>
                                <h2>{section.title}</h2>
                                {section.paragraphs.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Legal;
