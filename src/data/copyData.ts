import { SubjectItem } from '../types';

export const COMPANY_INFO = {
  name: 'Brainiac Educonsult',
  logoUrl: '/logo.png',
  logoDirectUrl: 'https://i.ibb.co/SDbkFWBX/Brainiac-logo-transparent.png',
  slogan: 'Building Brighter Minds, Creating Better Futures.',
  primaryPhone: '08131055940',
  secondaryPhone: '08137755594',
  whatsappNumber: '08131055940',
  whatsappFormatted: '2348131055940',
  secondaryWhatsappFormatted: '2348137755594',
  tagline: 'Unlock Your Academic Potential with Brainiac Educonsult',
  subheading: 'Helping Students Excel in WAEC, NECO, JAMB, IGCSE & More',
  heroHeadline: 'Stop Struggling. Start Excelling.',
  heroDescription:
    "Do you want outstanding results in your examinations without stress? At Brainiac Educonsult, we don't just teach—we equip students with the knowledge, confidence, and strategies they need to succeed.",
  commitmentText:
    "Whether you're preparing for WAEC, NECO, JAMB, IGCSE, JUPEB, or A-Level, our experienced tutors are committed to helping you achieve exceptional results. Your success is our priority.",
  ctaText: 'Enroll today and take the first step toward academic excellence.',
};

export const WHY_CHOOSE_US = [
  {
    title: 'Expert Tutors',
    description:
      'Our highly qualified and experienced instructors simplify difficult concepts, making learning engaging and enjoyable.',
    icon: 'GraduationCap',
    highlight: 'Qualified Specialists',
  },
  {
    title: 'Proven Teaching Methods',
    description:
      'We combine effective teaching techniques, practical exercises, exam-focused revision, and continuous assessments to maximize student performance.',
    icon: 'BrainCircuit',
    highlight: 'Exam-Focused Synergy',
  },
  {
    title: 'Flexible Learning Options',
    description:
      'Choose the learning style that works best for you: Physical Classes, Live Online Classes, Recorded Lessons, and One-on-One Coaching.',
    icon: 'Sliders',
    highlight: '4 Convenient Modes',
  },
  {
    title: 'Comprehensive Exam Preparation',
    description:
      'We prepare students rigorously for WAEC, NECO, JAMB, IGCSE, JUPEB, and A-Level Examinations.',
    icon: 'Award',
    highlight: 'Complete Coverage',
  },
  {
    title: 'Personalized Support',
    description:
      'Every student learns differently. That’s why we provide individual attention to help each learner reach their full potential.',
    icon: 'UserCheck',
    highlight: 'Tailored Attention',
  },
];

export const LEARNING_MODES = [
  {
    id: 'physical',
    title: 'Physical Classes',
    badge: 'Interactive & Social',
    description: 'Structure, hands-on classroom experience with interactive peer collaboration and face-to-face tutor guidance.',
    features: ['Conducive learning environment', 'Small class sizes for individual focus', 'On-site continuous mock tests', 'Direct physical mentorship'],
  },
  {
    id: 'online',
    title: 'Live Online Classes',
    badge: 'Real-time & Flexible',
    description: 'Attend live interactive classes from anywhere in Nigeria or abroad with crystal clear HD video and digital whiteboards.',
    features: ['Interactive Q&A sessions', 'Digital study materials provided', 'Recorded backups for revision', 'Flexible schedules'],
  },
  {
    id: 'recorded',
    title: 'Recorded Lessons',
    badge: 'Self-Paced Mastery',
    description: 'Learn at your own pace with our comprehensive library of topic-by-topic video tutorials covering complete exam syllabi.',
    features: ['24/7 unlimited playback access', 'Segmented by exam topic', 'Includes solved past question videos', 'Ideal for busy schedules'],
  },
  {
    id: 'oneonone',
    title: 'One-on-One Coaching',
    badge: '100% Customized',
    description: 'Intensive personalized tutoring focused strictly on your weak areas and learning speed.',
    features: ['Custom learning roadmap', 'Dedicated personal mentor', 'Flexible timing of choice', 'Fast-tracked improvement'],
  },
];

export const EXAM_PROGRAMS = [
  {
    code: 'WAEC',
    name: 'WAEC Examination',
    fullName: 'West African Senior School Certificate Examination',
    description: 'Master core subjects with deep syllabus coverage, past question analysis, and practical lab prep.',
  },
  {
    code: 'NECO',
    name: 'NECO Examination',
    fullName: 'National Examinations Council',
    description: 'Targeted preparation focused on high mark distribution, speed techniques, and essay writing skills.',
  },
  {
    code: 'JAMB',
    name: 'JAMB UTME',
    fullName: 'Joint Admissions and Matriculation Board',
    description: 'CBT practice software training, time management drills, shortcut methods, and 300+ target strategies.',
  },
  {
    code: 'IGCSE',
    name: 'IGCSE Cambridge',
    fullName: 'International General Certificate of Secondary Education',
    description: 'International curriculum standards, critical thinking development, past paper mark scheme mastery.',
  },
  {
    code: 'JUPEB',
    name: 'JUPEB Direct Entry',
    fullName: 'Joint Universities Preliminary Examinations Board',
    description: 'University 200-level admission prep, advanced level sciences & arts, university-style lecture drills.',
  },
  {
    code: 'A-Level',
    name: 'A-Level Examinations',
    fullName: 'Advanced Level Qualifications',
    description: 'Rigorous deep-dive subject mastery designed to guarantee top A/B grades for premium degree courses.',
  },
];

export const SUBJECTS_LIST: SubjectItem[] = [
  {
    id: 'math',
    name: 'Mathematics',
    category: 'Sciences',
    iconName: 'Calculator',
    description: 'Algebra, Geometry, Trigonometry, Calculus, Statistics, and Word Problems simplified with step-by-step shortcuts.',
    keyTopics: ['Algebraic Processes', 'Trigonometry & Geometry', 'Calculus Basics', 'Statistics & Probability'],
  },
  {
    id: 'eng',
    name: 'English Language',
    category: 'Arts & General',
    iconName: 'BookOpen',
    description: 'Grammar mechanics, essay composition techniques, comprehension breakdown, summary writing, and oral English practice.',
    keyTopics: ['Lexis & Structure', 'Comprehension & Summary', 'Essay Writing Mastery', 'Oral English Phonetics'],
  },
  {
    id: 'phy',
    name: 'Physics',
    category: 'Sciences',
    iconName: 'Zap',
    description: 'Mechanics, Heat, Waves, Electricity & Magnetism, Modern Physics, and practical calculationsdemystified.',
    keyTopics: ['Motion & Forces', 'Wave Motion & Sound', 'Electricity & Magnetism', 'Practical Physics Labs'],
  },
  {
    id: 'chem',
    name: 'Chemistry',
    category: 'Sciences',
    iconName: 'FlaskConical',
    description: 'Atomic structure, Stoichiometry, Organic Chemistry, Chemical Equilibria, and Qualitative/Quantitative analysis.',
    keyTopics: ['Periodic Table & Bonding', 'Organic Chemistry', 'Chemical Energetics', 'Volumetric Analysis'],
  },
  {
    id: 'bio',
    name: 'Biology',
    category: 'Sciences',
    iconName: 'Dna',
    description: 'Cell biology, Genetics, Ecology, Human Physiology, Plant Processes, and practical biological diagrams.',
    keyTopics: ['Organization of Life', 'Genetics & Evolution', 'Ecology & Environment', 'Human Systems'],
  },
  {
    id: 'econ',
    name: 'Economics',
    category: 'Commercial',
    iconName: 'TrendingUp',
    description: 'Micro & Macro Economics, Demand/Supply elasticity, Money & Banking, National Income, and Economic calculations.',
    keyTopics: ['Price Determination', 'Market Structures', 'International Trade', 'Public Finance'],
  },
  {
    id: 'govt',
    name: 'Government',
    category: 'Arts & General',
    iconName: 'Landmark',
    description: 'Political concepts, constitutions, organs of government, West African political history, and international relations.',
    keyTopics: ['Basic Political Concepts', 'Constitutional Development', 'Public Administration', 'Foreign Policy'],
  },
  {
    id: 'lit',
    name: 'Literature-in-English',
    category: 'Arts & General',
    iconName: 'Feather',
    description: 'Analysis of prescribed African and non-African prose, drama, poetry, literary devices, and essay structuring.',
    keyTopics: ['Prescribed Drama Texts', 'African Poetry Analysis', 'Literary Terms & Devices', 'Essay Composition'],
  },
  {
    id: 'acc',
    name: 'Financial Accounting',
    category: 'Commercial',
    iconName: 'Receipt',
    description: 'Double entry principles, Final accounts, Partnership accounting, Company accounts, and Financial ratios.',
    keyTopics: ['Double Entry Bookkeeping', 'Final Accounts of Sole Trader', 'Partnership Accounts', 'Control Accounts'],
  },
  {
    id: 'comm',
    name: 'Commerce',
    category: 'Commercial',
    iconName: 'ShoppingBag',
    description: 'Trade operations, Auxiliary services to trade, Business units, Consumer protection, and E-commerce dynamics.',
    keyTopics: ['Home & Foreign Trade', 'Banking & Insurance', 'Business Organizations', 'Stock Exchange'],
  },
  {
    id: 'crs',
    name: 'Christian Religious Studies (CRS)',
    category: 'Arts & General',
    iconName: 'BookMarked',
    description: 'In-depth textual study of Old and New Testament themes, leadership, faith, morality, and exam essay questions.',
    keyTopics: ['Sovereignty of God', 'Themes from the Gospels', 'Apostolic Church Era', 'Christian Ethics'],
  },
];

export const GAINS_LIST = [
  'Better understanding of difficult subjects',
  'Increased confidence in examinations',
  'Higher scores in school and external exams',
  'Access to experienced mentors',
  'Structured study plans',
  'Regular tests and performance tracking',
  'Lifetime learning skills that extend beyond examinations',
];

export const PARENTS_LOVE = [
  {
    title: 'Professional and dedicated tutors',
    desc: 'Our staff are passionate educators who go the extra mile for every student.',
    icon: 'CheckCircle2',
  },
  {
    title: 'Friendly learning environment',
    desc: 'A safe, motivating atmosphere where students feel comfortable asking questions.',
    icon: 'CheckCircle2',
  },
  {
    title: 'Affordable tuition',
    desc: 'Top-tier academic excellence delivered at competitive, accessible pricing.',
    icon: 'CheckCircle2',
  },
  {
    title: 'Small class sizes for effective learning',
    desc: 'Ensures no student is left behind or overlooked in the crowd.',
    icon: 'CheckCircle2',
  },
  {
    title: 'Consistent academic improvement',
    desc: 'Tracked grade jumps and noticeable boosts in test performance.',
    icon: 'CheckCircle2',
  },
  {
    title: 'Excellent student support',
    desc: 'Continuous feedback, mentorship, and parental progress updates.',
    icon: 'CheckCircle2',
  },
];

export const WHO_CAN_ENROLL = [
  { title: 'Secondary School Students', icon: 'School', sub: 'JS1 - SS3 continuous support' },
  { title: 'WAEC & NECO Candidates', icon: 'FileText', sub: 'Targeting 7+ A1/B2 distinctions' },
  { title: 'JAMB Candidates', icon: 'Target', sub: 'Aiming for 300+ score threshold' },
  { title: 'IGCSE Students', icon: 'Globe', sub: 'International Cambridge standard' },
  { title: 'JUPEB Students', icon: 'GraduationCap', sub: 'Direct 200-Level University Entry' },
  { title: 'A-Level Students', icon: 'Award', sub: 'Pre-university excellence' },
  { title: 'Extra Support Learners', icon: 'Sparkles', sub: 'Step-by-step foundation rebuilding' },
];

export const TESTIMONIALS = [
  {
    quote: "Brainiac Educonsult changed my entire perspective on Mathematics and Physics. I scored 318 in JAMB and got 7 A's in WAEC!",
    name: 'Chidiebere O.',
    role: 'JAMB & WAEC Student',
    score: '318 in JAMB | 7 A1s',
  },
  {
    quote: "As a parent, seeing my daughter's confidence grow in Chemistry and Biology was priceless. The tutors are patient and highly skilled.",
    name: 'Mrs. Adebayo',
    role: 'Parent of IGCSE Student',
    score: 'Straight A* Result',
  },
  {
    quote: "The physical classes and weekly mock exams prepared me so well for JUPEB. I secured admission directly into 200 level smoothly!",
    name: 'Emmanuel K.',
    role: 'JUPEB Student',
    score: '14 Points JUPEB',
  },
];
