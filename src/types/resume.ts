export type TemplateId = 'classic' | 'modern' | 'executive';

export type WorkspaceView = 'dashboard' | 'builder' | 'analyzer' | 'templates';

export type AppView = 'landing' | WorkspaceView;

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  type: 'create' | 'edit' | 'export' | 'import' | 'analyze' | 'template';
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  roleOrTech: string;
  link?: string;
  description: string;
}

export interface ResumeData {
  id: string;
  title: string;
  template: TemplateId;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: string[];
  updatedAt: string;
}

export interface ATSCheckItem {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'missing';
  detail: string;
  category: 'structure' | 'content' | 'impact';
}

export interface ATSAnalysisResult {
  overallScore: number;
  checks: ATSCheckItem[];
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordMatchRate: number | null;
  wordCount: number;
}
