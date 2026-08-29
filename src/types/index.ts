/**
 * Tipe data yang merepresentasikan konten dari WordPress (WPGraphQL).
 * Struktur ini mengikuti skema CPT pada docs/architecture.md §3.
 * Diperbarui saat Phase 3 (Build) setelah skema GraphQL final.
 */

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  role: string;
  timeline: string;
  description: string;
  problem: string;
  process: { number: string; title: string; description: string }[];
  stack: string[];
  results: string[];
  stats: { number: string; label: string }[];
  screenshots: string[];
  liveUrl: string;
  featuredImage: string;
}

export interface Experiment {
  id: string;
  slug: string;
  title: string;
  index: string;
  description: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  roleCompany: string;
  quote: string;
  avatar: string;
  projectLink?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  modified?: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags: string[];
  readingMinutes: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  location: string;
  email: string;
  whatsapp: string;
  whatsappRaw: string;
  socials: { linkedin: string; instagram: string; dribbble: string; github: string };
  stats: { years: string; projects: string; clients: string };
}
