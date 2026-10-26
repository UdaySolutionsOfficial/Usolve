export interface ServiceItem {
  id: string;
  title: string;
  category: 'development' | 'digital-growth' | 'ai-automation';
  shortDescription: string;
  whatItDoes: string;
  whoItHelps: string;
  problemItSolves: string;
  iconName: string;
  features: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  shortSummary: string;
  liveUrl: string;
  verifiedDetails: string[];
  techStack: string[];
  imageSrc?: string;
  tagline?: string;
  isFeatured?: boolean;
}

export interface FounderItem {
  name: string;
  role: string;
  image?: string;
  initials: string;
  bio: string;
  focusAreas: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'services' | 'process' | 'technical';
}

export interface ContactFormData {
  fullName: string;
  email: string;
  serviceType: string;
  message: string;
}
