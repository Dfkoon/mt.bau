// Mapping between course names and their corresponding quiz IDs
// This allows linking from Study Materials to Quiz page
// We use course names because IDs in coursesData are numeric (1, 2, 3...)

export const courseNameToQuizMapping = {
    // --- College Mandatory ---
    // Programming
    'Object Oriented Programming': 'oop',
    'برمجة موجهة للكائنات': 'oop',
    'AI Programming': 'ai_programming',
    'برمجة الذكاء الاصطناعي': 'ai_programming',
    
    // Data & Algorithms
    'Databases': 'databases',
    'قواعد بيانات': 'databases',
    'Data Structures': 'data_structures',
    'هياكل بيانات': 'data_structures',
    'Algorithms Analysis and Design': 'algorithms',
    'تحليل وتصميم خوارزميات': 'algorithms',
    
    // Systems & Hardware
    'Digital Logic Design': 'digital_logic_design',
    'تصميم المنطق الرقمي': 'digital_logic_design',
    'Operating Systems for Engineering': 'operating_systems',
    'نظم تشغيل الهندسة': 'operating_systems',
    'Computer Networks (1)': 'comp_networks_1',
    'شبكات حاسوب (1)': 'comp_networks_1',
    'Principles of Information Security and Cyberspace': 'info_security',
    'مبادئ أمن المعلومات والفضاء الإلكتروني': 'info_security',

    // Mathematics & Science
    'Calculus (1)': 'calculus_1',
    'التفاضل والتكامل (1)': 'calculus_1',
    'Numerical Analysis Principles': 'numerical_analysis',
    'مبادئ التحليل العددي': 'numerical_analysis',
    'Discrete Mathematics': 'discrete_math',
    'الرياضيات المنفصلة': 'discrete_math',
    'Probability and Statistics': 'prob_stats',
    'الاحتمالات والإحصاء': 'prob_stats',

    // --- University Mandatory ---
    'Computer Skills and E-Learning': 'comp_skills',
    'مهارات الحاسوب والتعليم الإلكتروني': 'comp_skills',
    'Applied English (2)': 'applied_english_102',
    'لغة إنجليزية تطبيقية (2)': 'applied_english_102',
    'Innovation, Entrepreneurship and Creativity': 'entrepreneurship',
    'الابتكار والريادة والإبداع': 'entrepreneurship',
    'Entrepreneurship and Innovation (English)': 'entrepreneurship',
    'الريادة والابتكار (باللغة الإنجليزية)': 'entrepreneurship',
    'Military Sciences': 'military_science',
    'العلوم العسكرية': 'military_science',

    // --- University Optional ---
    'Islamic Culture': 'islam_and_life',
    'الثقافة الإسلامية': 'islam_and_life',
    'Introduction to Psychology': 'psych_basics',
    'مدخل إلى علم النفس': 'psych_basics',
    'Digital Society': 'digital_society',
    'مجتمع رقمي': 'digital_society',

    // --- Specialized Electives ---
    'Machine Learning': 'machine_learning',
    'تعلم الآلة': 'machine_learning',
    'Machine Learning Lab': 'ml_lab',
    'مختبر تعلم الآلة': 'ml_lab',
    'IoT and its Security': 'cyber_iot',
    'انترنت الأشياء وأمنها': 'cyber_iot',
    'Biometrics and Security': 'biometrics_security',
    'أمن وقياسات بيولوجية': 'biometrics_security',
    'Introduction to Law': 'intro_law',
    'مدخل الى علم القانون': 'intro_law',
    'Penal Code - General Section': 'criminal_law_general',
    'قانون العقوبات القسم العام': 'criminal_law_general',
    
    // --- College Specific ---
    'Computer Skills (2) for Scientific Colleges': 'comp_skills_2_science',
    'مهارات حاسوب (2) لطلبة الكليات العلمية': 'comp_skills_2_science',
    
    // --- Information Retrieval Systems ---
    'Information Retrieval Systems': 'information_retrieval',
    'نظم استرجاع المعلومات': 'information_retrieval',
    'نظم استرجاع معلومات': 'information_retrieval',

    // --- Operating Systems for Digital Forensics ---
    'Operating Systems for Digital Forensics': 'df_operating_systems',
    'نظم تشغيل للتحقيقات الجنائية': 'df_operating_systems',
    'نظم تشغيل للتحقيقات الجنائية الرقمية': 'df_operating_systems',

    // --- Principles of Cybersecurity ---
    'Principles of Cybersecurity': 'principles_of_cybersecurity',
    'مبادئ أمن سيبراني': 'principles_of_cybersecurity',
    'مبادئ الأمن السيبراني': 'principles_of_cybersecurity',
};

// Helper function to get quiz ID for a course by its name
export const getQuizForCourse = (course) => {
    if (!course) return null;

    // Try to match using course name in both languages
    const arabicName = course.name;
    const englishName = course.nameEn || course.name;

    return courseNameToQuizMapping[arabicName] || courseNameToQuizMapping[englishName] || null;
};
