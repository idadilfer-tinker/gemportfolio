export type MediaType = 'image' | 'video';

export interface MediaAsset {
  type: MediaType;
  url: string;
  alt: string;
  label?: string; // e.g. "assets/home/oia.jpg"
  screenName?: string;
  caption?: string;
  aspectRatio?: '4:3' | '16:9' | '1:1' | '9:16' | 'custom';
  fileSize?: number; // bytes
  fileFormat?: string;
  dimensions?: { width: number; height: number };
}

export interface AudioConfig {
  enabled: boolean;
  url: string; // e.g. "assets/audio/oia-narration.mp3" or data uri
  label: string;
  duration?: number; // seconds
  fileSize?: number;
  transcript: {
    challenge: string;
    approach: string;
    built: string;
  };
}

export interface CaseStudySection {
  label: string; // e.g. "The challenge", "My approach", "What I built"
  headline: string; // Short italic framing line
  body: string; // Narrative copy with bold lead-in
  media: MediaAsset;
}

export interface CaseStudyMeta {
  role: string;
  year: string;
  type: string;
  status: string;
}

export interface CaseStudyOutcome {
  metrics: Array<{ num: string; label: string }>;
  callout: string;
}

export interface CaseStudy {
  eyebrow: string;
  title: string;
  dek: string;
  meta: CaseStudyMeta;
  audio: AudioConfig;
  challenge: CaseStudySection;
  approach: CaseStudySection;
  built: CaseStudySection;
  outcome: CaseStudyOutcome;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  meta: string; // e.g. "AI surgery planner · Web and WhatsApp · 2026 · Founder"
  description1: string;
  description2: string;
  homeMedia: MediaAsset;
  externalWebsiteUrl?: string;
  pressUrl?: string;
  hasCaseStudy: boolean;
  caseStudy: CaseStudy;
}

export interface AuthorProfile {
  name: string;
  role: string;
  intro: string;
  email: string;
  linkedin: string;
  instagram: string;
  cvUrl: string;
  copyrightYear: number;
}

export interface PortfolioData {
  author: AuthorProfile;
  projects: Project[];
}

export interface MediaValidationResult {
  isValid: boolean;
  level: 'optimal' | 'warning' | 'error';
  title: string;
  message: string;
  specs: {
    format: string;
    sizeFormatted: string;
    dimensionsFormatted?: string;
    aspectRatioFormatted?: string;
  };
  recommendations: string[];
}
