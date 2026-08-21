/**
 * Seed data — konten awal yang MENGACU pada desain Pencil.
 * Dipakai sebagai fallback ketika WordPress (WPGraphQL) belum diisi data.
 * Saat data sudah di-input di WP, fungsi di lib/api.ts akan mengambil dari GraphQL.
 */
import type {
  BlogPost,
  Experiment,
  FAQItem,
  Project,
  SiteConfig,
} from "@/types";

export const SITE_CONFIG: SiteConfig = {
  name: "Ahmad Afan Affaidin",
  role: "WordPress Developer & AI-Driven",
  location: "Surabaya, Indonesia",
  email: "hello@haloafan.com",
  whatsapp: "+62 857-0344-1199",
  whatsappRaw: "6285703441199",
  socials: {
    linkedin: "https://www.linkedin.com/in/afanaffaidin/",
    instagram: "https://www.instagram.com/afan_work/",
    dribbble: "https://dribbble.com/afanwork",
    github: "https://github.com/afanaffaidin21",
  },
  stats: { years: "5+", projects: "15+", clients: "10+" },
};

const wp = "https://cms.haloafan.com/wp-content/uploads/2026/05";

export const SEED_PROJECTS: Project[] = [
  {
    id: "usg",
    slug: "universitas-sunan-gresik",
    title: "Universitas Sunan Gresik",
    client: "Universitas Sunan Gresik",
    year: "2025",
    category: "academic",
    role: "Freelance WordPress Developer",
    timeline: "Aug — Oct 2025",
    description:
      "Redesigning the official website to improve visual appeal, usability, and overall user experience.",
    problem:
      "The previous site had outdated visuals, unstructured content, and a navigation flow that made it hard for prospective students to find what they needed.",
    process: [
      {
        number: "01",
        title: "Design in Figma",
        description:
          "Wireframes and a full UI layout based on academic website best practices, keeping content structure simple for editors.",
      },
      {
        number: "02",
        title: "Develop",
        description:
          "Responsive build with WordPress, Elementor, Astra Pro, and JetEngine for dynamic, maintainable content.",
      },
      {
        number: "03",
        title: "Secure & Configure",
        description:
          "Domain and hosting setup, security headers, URL redirects, and Google reCAPTCHA for spam protection.",
      },
      {
        number: "04",
        title: "Launch",
        description:
          "Pixel-accurate Figma-to-Editor translation with AI-assisted copy structure, then production handover.",
      },
    ],
    stack: [
      "WordPress",
      "Elementor Pro",
      "Astra Pro",
      "JetEngine",
      "Figma",
      "Security",
    ],
    results: [
      "Pixel-accurate Figma slicing matching institutional standards",
      "Hardened WP security with security headers & reCAPTCHA",
      "Dynamic structured content with JetEngine for easy editing",
    ],
    stats: [
      { number: "100%", label: "Responsive across devices" },
      { number: "GRADE A", label: "GTMetrix speed target" },
      { number: "3 MO", label: "Design to launch" },
    ],
    screenshots: [`${wp}/USG-2-1024x702.jpg`],
    liveUrl: "https://haloafan.com/universitas-sunan-gresik/",
    featuredImage: `${wp}/USG-2-1024x702.jpg`,
  },
  {
    id: "menulis",
    slug: "menulis-id",
    title: "Menulis.ID",
    client: "Menulis.ID",
    year: "2025",
    category: "blogging",
    role: "Freelance WordPress Developer",
    timeline: "2025",
    description:
      "Redesigning a blogging platform centered around content creation and publishing.",
    problem:
      "The platform needed a cleaner reading experience and a content structure that made publishing effortless.",
    process: [
      {
        number: "01",
        title: "Audit",
        description: "Mapping existing content structure and user flows.",
      },
      {
        number: "02",
        title: "Redesign",
        description:
          "Fresh layout with focus on readability and content hierarchy.",
      },
      {
        number: "03",
        title: "Build & Optimize",
        description:
          "Custom theme, ACF fields, and AJAX search & filter for speed.",
      },
    ],
    stack: ["WordPress", "Custom Theme", "ACF", "AJAX", "Speed Optimization"],
    results: [
      "Custom theme with centralized, maintainable code",
      "AJAX search & filter without page reloads",
      "Performance optimization toward Grade A",
    ],
    stats: [
      { number: "FAST", label: "AJAX-first interactions" },
      { number: "100%", label: "Content structure redesigned" },
    ],
    screenshots: [`${wp}/Menulis-id-2-1024x702.jpg`],
    liveUrl: "https://haloafan.com/menulis-id/",
    featuredImage: `${wp}/Menulis-id-2-1024x702.jpg`,
  },
  {
    id: "karyapratama",
    slug: "karyapratama-packaging",
    title: "Karyapratama Packaging",
    client: "Karyapratama Packaging",
    year: "2024",
    category: "company-profile",
    role: "Freelance WordPress Developer",
    timeline: "Nov — Dec 2024",
    description:
      "Developing a company profile website for a business specializing in packaging solutions.",
    problem:
      "The manufacturer needed a professional presence with an interactive product catalog and clear brand story.",
    process: [
      {
        number: "01",
        title: "Setup",
        description:
          "Domain, hosting, and server configuration from zero.",
      },
      {
        number: "02",
        title: "Develop",
        description:
          "Company profile with interactive product catalog and security hardening.",
      },
      {
        number: "03",
        title: "SEO & Handover",
        description:
          "SEO-ready copywriting and full client handover.",
      },
    ],
    stack: ["WordPress", "Elementor Pro", "JetEngine", "Canva", "SEO"],
    results: [
      "Turn-key domain, server, and WP deployment",
      "Intuitive industrial product catalog structure",
      "SEO-ready copywriting with GPT AI assistance",
    ],
    stats: [
      { number: "TURN-KEY", label: "From zero to launch" },
      { number: "SEO", label: "Ready from day one" },
    ],
    screenshots: [`${wp}/Karya-Pratama-2-1024x702.jpg`],
    liveUrl: "https://haloafan.com/karyapratama-packaging/",
    featuredImage: `${wp}/Karya-Pratama-2-1024x702.jpg`,
  },
];

export const SEED_EXPERIMENTS: Experiment[] = [
  {
    id: "gym-tracker",
    slug: "gym-tracker",
    title: "Gym Tracker",
    index: "01",
    description: "A workout logging app with progress charts and streak tracking.",
    tags: ["Next.js", "Tailwind", "Charts"],
  },
  {
    id: "ai-prompt-studio",
    slug: "ai-prompt-studio",
    title: "AI Prompt Studio",
    index: "02",
    description: "A small toolkit for crafting, testing, and iterating LLM prompts.",
    tags: ["React", "OpenAI", "Prompts"],
  },
  {
    id: "pomodoro-focus",
    slug: "pomodoro-focus",
    title: "Pomodoro Focus",
    index: "03",
    description: "A distraction-free focus timer with session analytics.",
    tags: ["Next.js", "Tailwind", "Timer"],
  },
  {
    id: "weather-dashboard",
    slug: "weather-dashboard",
    title: "Weather Dashboard",
    index: "04",
    description: "Live weather with clean minimal visuals and location search.",
    tags: ["TypeScript", "API", "Geo"],
  },
  {
    id: "screenshot-comparator",
    slug: "screenshot-comparator",
    title: "Screenshot Comparator",
    index: "05",
    description: "Drag-and-drop before/after image comparison tool.",
    tags: ["React", "Canvas", "Diff"],
  },
  {
    id: "markdown-vault",
    slug: "markdown-vault",
    title: "Markdown Vault",
    index: "06",
    description: "A local-first note vault with fuzzy search and tagging.",
    tags: ["Next.js", "MDX", "Search"],
  },
];

export const SEED_POSTS: BlogPost[] = [
  {
    id: "building-layouts",
    slug: "building-layouts-without-elementor",
    title: "Building Layouts Without Elementor",
    date: "May 21, 2026",
    category: "Learn Journey",
    excerpt:
      "The deeper I explore Gutenberg, the more I feel it has huge potential for the future of modern WordPress workflows.",
    content:
      "For the past few years, my default tool for building WordPress layouts was Elementor. The deeper I explore Gutenberg, the more I feel it has huge potential for the future of modern WordPress workflows.",
    featuredImage: `${wp}/Block-Theme-Structure-theme-json.png`,
    tags: ["Gutenberg", "Block Themes", "WordPress", "FSE"],
    readingMinutes: 6,
  },
  {
    id: "block-theme-structure",
    slug: "understanding-block-theme-structure-theme-json",
    title: "Understanding Block Theme Structure & theme.json",
    date: "May 20, 2026",
    category: "Learn Journey",
    excerpt:
      "After spending time learning Gutenberg, I reached a point where modern WordPress started feeling completely different.",
    content:
      "With block themes, the entire site — header, footer, templates — is composed from the same building blocks you use to write a post.",
    featuredImage: `${wp}/Block-Theme-Structure-theme-json.png`,
    tags: ["Block Themes", "theme.json", "WordPress"],
    readingMinutes: 7,
  },
  {
    id: "gutenberg-deep",
    slug: "understanding-gutenberg-editor-more-deeply",
    title: "Understanding Gutenberg Editor More Deeply",
    date: "May 19, 2026",
    category: "Learn Journey",
    excerpt:
      "To truly understand modern WordPress development, you need to deeply understand Gutenberg — it is no longer just a content editor.",
    content:
      "Gutenberg is no longer just a content editor — it is the architecture underneath modern WordPress.",
    featuredImage: `${wp}/Understanding-Gutenberg-Editor-More-Deeply.png`,
    tags: ["Gutenberg", "Editor", "WordPress"],
    readingMinutes: 8,
  },
  {
    id: "gutenberg-philosophy",
    slug: "understanding-the-philosophy-behind-gutenberg-modern-wordpress",
    title: "The Philosophy Behind Gutenberg & Modern WordPress",
    date: "May 18, 2026",
    category: "Learn Journey",
    excerpt:
      "Like many WordPress developers, I was used to drag-and-drop builders. Modern WordPress changed that perspective.",
    content:
      "Modern WordPress changed how I think about layout, patterns, and reusable design tokens.",
    featuredImage: `${wp}/ba6d7436-cb6b-439c-b4f0-ea396ca9ef5c.png`,
    tags: ["Gutenberg", "Philosophy", "WordPress"],
    readingMinutes: 6,
  },
];

export const SEED_FAQ: FAQItem[] = [
  {
    id: "fulltime",
    question: "Are you available to hire full time?",
    answer:
      "At the moment I am not looking for full-time opportunities, but I am always open to discussing interesting collaborations and projects.",
  },
  {
    id: "pricing",
    question: "How does your pricing work?",
    answer:
      "Every project is quoted based on scope, complexity, and timeline. After a short discovery call I'll send you a clear proposal with fixed pricing — no surprises.",
  },
  {
    id: "timeline",
    question: "What is your typical project timeline?",
    answer:
      "Most projects take 2–6 weeks depending on scope. You'll receive a clear timeline in the proposal before we start.",
  },
];

export interface FocusItem {
  title: string;
  description: string;
  icon: string;
}
export const SEED_FOCUS: FocusItem[] = [
  { title: 'Custom WordPress Dev', description: 'Custom themes, plugins, ACF, and pixel-perfect slicing from Figma.', icon: 'code-xml' },
  { title: 'Performance & Speed', description: 'GTMetrix Grade A targets, Core Web Vitals, caching, and asset optimization.', icon: 'zap' },
  { title: 'Troubleshooting & Support', description: 'Hundreds of resolved tickets — plugin conflicts, JS bugs, layout shifts, and staging.', icon: 'wrench' },
  { title: 'Security & Setup', description: 'Turn-key domain, hosting, SSL, security headers, and reCAPTCHA protection.', icon: 'shield-check' },
  { title: 'AI-Driven Workflows', description: 'AI-assisted copywriting, rapid bug analysis, and documentation that ships faster.', icon: 'sparkles' },
  { title: 'Headless & Next.js', description: 'Modern WordPress as a headless CMS with Next.js frontends for maximum speed.', icon: 'layers' },
];

export interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  description: string;
  tags: string[];
}
export const SEED_EXPERIENCE: ExperienceItem[] = [
  { period: 'Apr 2022 — Present', company: 'Onero Solutions', role: 'Web Developer & Technical Support Specialist', description: 'Daily support tickets, staging management, custom plugins, and GTMetrix optimization for enterprise clients.', tags: ['WordPress', 'WooCommerce', 'PHP', 'Nestify'] },
  { period: 'Feb 2026 — Mar 2026', company: 'We Are Social Singapore', role: 'Freelance WordPress Developer', description: 'Complex interactive UI components via PHP/ACF & AJAX for a global creative agency.', tags: ['WordPress', 'ACF', 'AJAX', 'Figma'] },
  { period: 'Aug 2025 — Oct 2025', company: 'Universitas Sunan Gresik', role: 'Freelance WordPress Developer', description: 'Turnkey institutional academic website from Figma design to hosting security.', tags: ['Elementor Pro', 'Astra Pro', 'JetEngine', 'Security'] },
  { period: 'Nov 2024 — Dec 2024', company: 'Karyapratama Packaging', role: 'Freelance WordPress Developer', description: 'Company profile website with interactive product catalog and SEO-ready copy.', tags: ['Elementor', 'JetEngine', 'Canva', 'SEO'] },
  { period: 'Jan 2021 — Mar 2021', company: 'Universitas Airlangga', role: 'Intern WordPress Developer', description: 'Faculty portal homepage — won 1st Place Best Study Program Website.', tags: ['WordPress', 'Elementor', 'UI Design'] },
];

export interface SkillCategory {
  label: string;
  skills: string[];
}
export const SEED_SKILLS: SkillCategory[] = [
  { label: 'CORE WORDPRESS & BACKEND', skills: ['WordPress Development', 'WooCommerce', 'PHP & Theme Customization', 'Custom Plugins', 'ACF', 'MySQL'] },
  { label: 'FRONTEND & UI CRAFT', skills: ['JavaScript & jQuery', 'AJAX Dynamic Slicing', 'HTML / CSS / Shortcodes', 'Figma Pixel Slicing', 'Responsive UI', 'Astra Pro'] },
  { label: 'SERVER & PERFORMANCE', skills: ['GTMetrix & Core Web Vitals', 'Hosting (Nestify, cPanel)', 'Staging & Deployment', 'Security & reCAPTCHA', 'Crocoblock JetEngine', 'Caching & Hardening'] },
  { label: 'TOOLS & AI WORKFLOW', skills: ['AI-Assisted Development', 'GPT Copywriting', 'Troubleshooting & Debugging', 'Technical Documentation', 'Next.js & Tailwind', 'WPGraphQL Headless'] },
];

export const SEED_EDUCATION = {
  institution: 'Universitas Airlangga',
  degree: 'Bachelor of Computer Science (S.Kom) · GPA 3.34/4.00',
  period: '2017 — 2021',
  thesis: 'Thesis: Sentiment analysis of public opinion on online learning during COVID-19 using Naive Bayes & K-Nearest Neighbor.',
  award: '1st Winner — Best Study Program Website (UNAIR)',
};

export interface AchievementItem {
  number: string;
  title: string;
  subtitle: string;
  metric: string;
  detail: string;
}
export const SEED_ACHIEVEMENTS: AchievementItem[] = [
  { number: '01', title: '1st Winner Best Website', subtitle: 'Universitas Airlangga', metric: 'TOP 1 / AWARD', detail: 'Won the university-wide study program website redesign competition.' },
  { number: '02', title: 'Global Agency Collaboration', subtitle: 'We Are Social Singapore', metric: 'GLOBAL AGENCY', detail: 'Trusted to refactor complex frontend & interactive components for an international agency.' },
  { number: '03', title: '3+ Years Tech Support', subtitle: 'Onero Solutions', metric: '3+ YEARS / 100+ TICKETS', detail: 'Resolved hundreds of WooCommerce & WordPress support tickets at enterprise scale.' },
];


export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
}
export const SEED_TESTIMONIALS: TestimonialItem[] = [
  { name: 'Client A', role: 'Universitas Sunan Gresik', quote: 'The redesigned website looks modern and works flawlessly. Communication was clear and the result exceeded our expectations.' },
  { name: 'Client B', role: 'Menulis.ID', quote: 'Fast, responsive, and exactly what we needed. A professional who understands both design and code.' },
  { name: 'Client C', role: 'Karyapratama Packaging', quote: 'From zero to a polished company profile site in weeks. Highly recommended for WordPress work.' },
];
