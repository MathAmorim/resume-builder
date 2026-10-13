// Foto padrão exibida quando o usuário não enviou uma foto (arquivo em /public)
export const DEFAULT_PHOTO = '/photo-placeholder.jpg';

export interface HeaderData {
  photo: string; // Base64 data URI of the profile photo or empty string
  name: string;
  email: string;
  currentRole: string;
}

export interface PersonalData {
  age: number;
  gender: string;
  lastUpdated: string;
  neighborhood: string;
  cityState: string;
  phone: string;
}

export interface GoalData {
  targetRoles: string[];
  salaryMin: string;
  salaryDesired: string;
  period: string;
  hideSalaryOnPDF?: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
}

export interface CourseItem {
  id: string;
  name: string;
  institution: string;
  period: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  sector: string;
  salaryFinal: string;
  period: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  level: string;
}

export type ResumeTemplate = 'classic' | 'modern';
export type TemplateLanguage = 'pt' | 'en';

export interface ResumeData {
  header: HeaderData;
  personal: PersonalData;
  goals: GoalData;
  summary: string;
  education: EducationItem[];
  courses: CourseItem[];
  experiences: ExperienceItem[];
  languages: LanguageItem[];
  skills: string[];
  template?: ResumeTemplate;
  templateLanguage?: TemplateLanguage;
}
