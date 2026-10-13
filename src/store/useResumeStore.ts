import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ResumeData,
  HeaderData,
  PersonalData,
  GoalData,
  EducationItem,
  CourseItem,
  ExperienceItem,
  LanguageItem,
  ResumeTemplate,
  TemplateLanguage,
  DEFAULT_PHOTO,
} from '../types/resume';

interface ResumeState {
  data: ResumeData;
  updateHeader: (header: Partial<HeaderData>) => void;
  updatePersonal: (personal: Partial<PersonalData>) => void;
  updateGoals: (goals: Partial<GoalData>) => void;
  updateSummary: (summary: string) => void;
  
  // Education
  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  
  // Courses
  addCourse: (item: Omit<CourseItem, 'id'>) => void;
  updateCourse: (id: string, item: Partial<CourseItem>) => void;
  deleteCourse: (id: string) => void;
  
  // Experiences
  addExperience: (item: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, item: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  
  // Languages
  addLanguage: (item: Omit<LanguageItem, 'id'>) => void;
  updateLanguage: (id: string, item: Partial<LanguageItem>) => void;
  deleteLanguage: (id: string) => void;
  
  // Skills
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  setSkills: (skills: string[]) => void;
  setResumeData: (data: ResumeData) => void;
  setTemplate: (template: ResumeTemplate) => void;
  setTemplateLanguage: (lang: TemplateLanguage) => void;
  saveToServer: () => Promise<void>;
}

const initialMockData: ResumeData = {
  header: {
    photo: DEFAULT_PHOTO,
    name: '',
    email: '',
    currentRole: '',
  },
  personal: {
    age: 0,
    gender: '',
    lastUpdated: '',
    neighborhood: '',
    cityState: '',
    phone: '',
  },
  goals: {
    targetRoles: [],
    salaryMin: '',
    salaryDesired: '',
    period: '',
    hideSalaryOnPDF: false,
  },
  summary: '',
  education: [],
  courses: [],
  experiences: [],
  languages: [],
  skills: [],
  template: 'classic',
  templateLanguage: 'pt',
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
  data: initialMockData,
  
  updateHeader: (header) =>
    set((state) => ({
      data: {
        ...state.data,
        header: { ...state.data.header, ...header },
      },
    })),

  updatePersonal: (personal) =>
    set((state) => ({
      data: {
        ...state.data,
        personal: { ...state.data.personal, ...personal },
      },
    })),

  updateGoals: (goals) =>
    set((state) => ({
      data: {
        ...state.data,
        goals: { ...state.data.goals, ...goals },
      },
    })),

  updateSummary: (summary) =>
    set((state) => ({
      data: {
        ...state.data,
        summary,
      },
    })),

  // Education
  addEducation: (item) =>
    set((state) => ({
      data: {
        ...state.data,
        education: [
          ...state.data.education,
          { ...item, id: `edu-${Date.now()}` },
        ],
      },
    })),

  updateEducation: (id, item) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.map((edu) =>
          edu.id === id ? { ...edu, ...item } : edu
        ),
      },
    })),

  deleteEducation: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.filter((edu) => edu.id !== id),
      },
    })),

  // Courses
  addCourse: (item) =>
    set((state) => ({
      data: {
        ...state.data,
        courses: [
          ...state.data.courses,
          { ...item, id: `course-${Date.now()}` },
        ],
      },
    })),

  updateCourse: (id, item) =>
    set((state) => ({
      data: {
        ...state.data,
        courses: state.data.courses.map((c) =>
          c.id === id ? { ...c, ...item } : c
        ),
      },
    })),

  deleteCourse: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        courses: state.data.courses.filter((c) => c.id !== id),
      },
    })),

  // Experiences
  addExperience: (item) =>
    set((state) => ({
      data: {
        ...state.data,
        experiences: [
          ...state.data.experiences,
          { ...item, id: `exp-${Date.now()}` },
        ],
      },
    })),

  updateExperience: (id, item) =>
    set((state) => ({
      data: {
        ...state.data,
        experiences: state.data.experiences.map((exp) =>
          exp.id === id ? { ...exp, ...item } : exp
        ),
      },
    })),

  deleteExperience: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        experiences: state.data.experiences.filter((exp) => exp.id !== id),
      },
    })),

  // Languages
  addLanguage: (item) =>
    set((state) => ({
      data: {
        ...state.data,
        languages: [
          ...state.data.languages,
          { ...item, id: `lang-${Date.now()}` },
        ],
      },
    })),

  updateLanguage: (id, item) =>
    set((state) => ({
      data: {
        ...state.data,
        languages: state.data.languages.map((lang) =>
          lang.id === id ? { ...lang, ...item } : lang
        ),
      },
    })),

  deleteLanguage: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        languages: state.data.languages.filter((lang) => lang.id !== id),
      },
    })),

  // Skills
  addSkill: (skill) =>
    set((state) => {
      const trimmed = skill.trim();
      if (!trimmed || state.data.skills.includes(trimmed)) return state;
      return {
        data: {
          ...state.data,
          skills: [...state.data.skills, trimmed],
        },
      };
    }),

  removeSkill: (skill) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.filter((s) => s !== skill),
      },
    })),

  setSkills: (skills) =>
    set((state) => ({
      data: {
        ...state.data,
        skills,
      },
    })),

  setResumeData: (data) =>
    set(() => ({
      data: {
        ...data,
        template: data.template || 'classic',
        templateLanguage: data.templateLanguage || 'pt',
      },
    })),

  setTemplate: (template) =>
    set((state) => ({
      data: {
        ...state.data,
        template,
      },
    })),

  setTemplateLanguage: (templateLanguage) =>
    set((state) => ({
      data: {
        ...state.data,
        templateLanguage,
      },
    })),

  saveToServer: async () => {
    const data = useResumeStore.getState().data;
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('Erro ao salvar no servidor');
      }
    } catch (err) {
      console.error('Error saving resume to database:', err);
    }
  },
  }),
  {
    name: 'resume-builder-storage',
  }
));
