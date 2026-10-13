'use client';

import React from 'react';
import { ResumeData, TemplateLanguage } from '../types/resume';

interface ResumeModernPDFProps {
  data: ResumeData;
  templateLanguage?: TemplateLanguage;
}

export default function ResumeModernPDF({ data, templateLanguage }: ResumeModernPDFProps) {
  const { header, personal, goals, summary, education, courses, experiences, languages, skills } = data;
  const lang = templateLanguage || data.templateLanguage || 'pt';

  const titles = {
    pt: {
      summary: 'RESUMO PROFISSIONAL',
      experience: 'EXPERIÊNCIA PROFISSIONAL',
      education: 'FORMAÇÃO ACADÊMICA',
      courses: 'CURSOS & CERTIFICAÇÕES',
      skillsAndLanguages: 'HABILIDADES & IDIOMAS',
      technicalSkills: 'Habilidades Técnicas',
      languages: 'Idiomas',
      finalSalary: 'Salário final',
    },
    en: {
      summary: 'PROFESSIONAL SUMMARY',
      experience: 'PROFESSIONAL EXPERIENCE',
      education: 'EDUCATION',
      courses: 'COURSES & CERTIFICATIONS',
      skillsAndLanguages: 'SKILLS & LANGUAGES',
      technicalSkills: 'Technical Skills',
      languages: 'Languages',
      finalSalary: 'Final salary',
    },
  };

  const t = titles[lang] || titles.pt;

  // Split description text into clean bullet points
  const getBulletPoints = (text: string) => {
    if (!text) return [];
    if (text.includes('\n')) {
      return text.split('\n').map((l) => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
    }
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length > 1) {
      return sentences.map((s) => s.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
    }
    return [text.replace(/^[•\-\*]\s*/, '').trim()];
  };

  // Format location / contact line
  const locationParts = [personal.cityState, personal.neighborhood].filter(Boolean);
  const locationStr = locationParts.join(', ');
  const contactParts = [locationStr, personal.phone, header.email].filter(Boolean);

  // Target roles line
  const rolesStr = goals.targetRoles && goals.targetRoles.length > 0
    ? goals.targetRoles.join(' | ')
    : header.currentRole;

  return (
    <div className="w-full max-w-[800px] bg-white mx-auto text-[#171717] font-sans px-8 py-6 text-sm leading-relaxed">
      
      {/* Centered Modern Header (No Photo) */}
      <div className="flex flex-col items-center text-center mb-6">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight mb-1 font-sans">
          {header.name || 'Seu Nome'}
        </h1>
        
        {contactParts.length > 0 && (
          <p className="text-xs text-gray-600 mb-1 tracking-normal font-sans">
            {contactParts.join(' | ')}
          </p>
        )}

        {rolesStr && (
          <p className="text-xs font-medium text-gray-800 tracking-normal font-sans">
            {rolesStr}
          </p>
        )}
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-5 break-inside-avoid">
          <h2 className="text-xs font-bold text-[#1d4ed8] tracking-wider uppercase mb-2 font-sans break-after-avoid">
            {t.summary}
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed text-justify font-sans">
            {summary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-[#1d4ed8] tracking-wider uppercase mb-2.5 font-sans break-after-avoid">
            {t.experience}
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                {/* Title + Company (Left) and Period (Right) */}
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-xs">
                    <span className="font-bold text-gray-900">{exp.role}</span>
                    <span className="text-gray-400 mx-1.5 font-light">|</span>
                    <span className="text-gray-600 font-normal">{exp.company}{exp.sector ? `, ${exp.sector}` : ''}</span>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2 font-normal">
                    {exp.period}
                  </span>
                </div>

                {/* Optional Final Salary */}
                {exp.salaryFinal && exp.salaryFinal.trim() !== '' && (
                  <p className="text-[11px] text-gray-500 mb-1">
                    {t.finalSalary}: {exp.salaryFinal}
                  </p>
                )}

                {/* Bullet Points */}
                <ul className="space-y-1 text-xs text-gray-700 leading-relaxed pl-0.5 mt-1">
                  {getBulletPoints(exp.description).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-900 select-none font-bold text-[10px] mt-0.5 flex-shrink-0">•</span>
                      <span className="flex-1 text-justify">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-[#1d4ed8] tracking-wider uppercase mb-2.5 font-sans break-after-avoid">
            {t.education}
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-xs">{edu.degree}</span>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{edu.period}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses & Certifications (if any) */}
      {courses.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-[#1d4ed8] tracking-wider uppercase mb-2.5 font-sans break-after-avoid">
            {t.courses}
          </h2>
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-xs">{course.name}</span>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{course.period}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{course.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Languages (2 Columns) */}
      {(skills.length > 0 || languages.length > 0) && (
        <div className="mb-5 break-inside-avoid">
          <h2 className="text-xs font-bold text-[#1d4ed8] tracking-wider uppercase mb-2.5 font-sans break-after-avoid">
            {t.skillsAndLanguages}
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Column 1: Technical Skills */}
            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-2">
                {t.technicalSkills}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-gray-800 text-[11px] font-medium px-2.5 py-1 rounded border border-gray-200/60"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length === 0 && (
                  <p className="text-xs text-gray-400 italic">Nenhuma habilidade cadastrada.</p>
                )}
              </div>
            </div>

            {/* Column 2: Languages */}
            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-2">
                {t.languages}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((langItem) => (
                  <span
                    key={langItem.id}
                    className="bg-gray-100 text-gray-800 text-[11px] font-medium px-2.5 py-1 rounded border border-gray-200/60"
                  >
                    {langItem.language} ({langItem.level})
                  </span>
                ))}
                {languages.length === 0 && (
                  <p className="text-xs text-gray-400 italic">Nenhum idioma cadastrado.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
