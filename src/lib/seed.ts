/** Static profile facts that are not managed by the WordPress content types. */
import type { SiteConfig } from "@/types";

export const SITE_CONFIG: SiteConfig = {
  name: "Ahmad Afan Affaidin",
  role: "WordPress Developer & Web Engineer",
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
  { title: 'AI-Assisted Workflow', description: 'AI-assisted copywriting, rapid bug analysis, and documentation that ships faster.', icon: 'sparkles' },
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
