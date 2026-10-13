'use client';

import { ResumeData, ResumeTemplate, TemplateLanguage, DEFAULT_PHOTO } from '../types/resume';
import { Phone } from 'lucide-react';
import ResumeModernPDF from './ResumeModernPDF';

interface ResumePDFProps {
  data: ResumeData;
  template?: ResumeTemplate;
  templateLanguage?: TemplateLanguage;
}

export default function ResumePDF({ data, template, templateLanguage }: ResumePDFProps) {
  const activeTemplate = template || data.template || 'classic';

  if (activeTemplate === 'modern') {
    return <ResumeModernPDF data={data} templateLanguage={templateLanguage || data.templateLanguage} />;
  }

  const { header, personal, goals, summary, education, courses, experiences, languages, skills } = data;

  // Helper to render the profile photo (falls back to the default placeholder)
  const renderProfilePhoto = (photoUrl: string) => (
    <img
      src={photoUrl || DEFAULT_PHOTO}
      alt="Foto Perfil"
      className="w-24 h-24 rounded-full object-cover"
    />
  );

  return (
    <div className="w-full max-w-[800px] bg-white mx-auto text-[#171717] font-sans p-2 text-sm leading-relaxed">
      
      {/* Header Circle & Basic Info */}
      <div className="flex flex-col items-center text-center mb-8">
        {/* Outer styled circular line containing the thumbnail photo */}
        <div className="w-28 h-28 rounded-full border border-gray-400 flex items-center justify-center mb-3">
          {renderProfilePhoto(header.photo)}
        </div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-wide font-sans">{header.name}</h1>
        <p className="text-sm text-gray-600 mt-0.5">{header.email}</p>
        <p className="text-xs font-bold text-gray-900 tracking-wider mt-1">{header.currentRole}</p>
      </div>

      {/* Two Column Grid for Personal Data & Goals */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-6">
        {/* Left Column: Dados Pessoais */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 pb-1 mb-2 border-b border-dashed border-gray-300">
            Dados Pessoais
          </h2>
          <div className="space-y-1 text-gray-700 text-xs">
            <p className="font-bold text-gray-900">
              {personal.age} anos, {personal.gender}
            </p>
            <p className="italic text-gray-500">
              Última Atualização: {personal.lastUpdated}
            </p>
            <p>{personal.neighborhood}</p>
            <p>{personal.cityState}</p>
            
            {/* Phone */}
            <div className="flex items-center gap-1.5 mt-2 text-gray-800 font-sans">
              <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span>{personal.phone}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Objetivos Profissionais */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 pb-1 mb-2 border-b border-dashed border-gray-300">
            Objetivos Profissionais
          </h2>
          <div className="space-y-2 text-gray-700 text-xs">
            <div>
              <p className="text-gray-400 uppercase font-semibold tracking-wider text-[10px]">Cargo</p>
              {goals.targetRoles.map((role, idx) => (
                <p key={idx} className="text-gray-900 font-medium">{role}</p>
              ))}
            </div>
            {!goals.hideSalaryOnPDF && (
              <div>
                <p className="text-gray-400 uppercase font-semibold tracking-wider text-[10px]">Salário</p>
                <p className="text-gray-900">
                  Mínimo aceitavel: {goals.salaryMin}
                </p>
                <p className="text-gray-900">
                  Pretendido: {goals.salaryDesired}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-400 uppercase font-semibold tracking-wider text-[10px]">Período Pretendido</p>
              <p className="text-gray-900">{goals.period}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo do Currículo */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-gray-800 pb-1 mb-2 border-b border-dashed border-gray-300">
          Resumo do currículo
        </h2>
        <p className="text-xs text-gray-700 leading-relaxed text-justify">
          {summary}
        </p>
      </div>

      {/* Escolaridade */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-gray-800 pb-1 mb-2 border-b border-dashed border-gray-300 break-after-avoid">
          Escolaridade
        </h2>
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={edu.id} className={`pb-3 break-inside-avoid ${index < education.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <p className="font-bold text-gray-900 text-xs">{edu.institution}</p>
              <p className="text-gray-600 text-xs mt-0.5">{edu.degree}</p>
              <p className="text-gray-400 text-xs mt-0.5">{edu.period}</p>
            </div>
          ))}
          {education.length === 0 && (
            <p className="text-xs text-gray-400">Nenhuma escolaridade cadastrada.</p>
          )}
        </div>
      </div>

      {/* Cursos Importantes (if any added) */}
      {courses.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-800 pb-1 mb-2 border-b border-dashed border-gray-300 break-after-avoid">
            Cursos importantes
          </h2>
          <div className="space-y-3">
            {courses.map((course, index) => (
              <div key={course.id} className={`pb-3 break-inside-avoid ${index < courses.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <p className="font-bold text-gray-900 text-xs">{course.name}</p>
                <p className="text-gray-600 text-xs mt-0.5">{course.institution}</p>
                <p className="text-gray-400 text-xs mt-0.5">{course.period}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experiências Profissionais */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-gray-800 pb-1 mb-2 border-b border-dashed border-gray-300 break-after-avoid">
          Experiências profissionais
        </h2>
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={exp.id} className={`pb-4 break-inside-avoid ${index < experiences.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <p className="font-bold text-gray-900 text-xs">{exp.role}</p>
              <p className="text-gray-600 text-xs mt-0.5">
                <span className="font-semibold">{exp.company}</span>, {exp.sector}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                {exp.salaryFinal && exp.salaryFinal.trim() !== '' ? (
                  `Salário final: ${exp.salaryFinal} ( ${exp.period} )`
                ) : (
                  `( ${exp.period} )`
                )}
              </p>
              <p className="text-gray-600 text-xs mt-2 text-justify leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
          {experiences.length === 0 && (
            <p className="text-xs text-gray-400">Nenhuma experiência cadastrada.</p>
          )}
        </div>
      </div>

      {/* Idiomas */}
      <div className="mb-5 break-inside-avoid">
        <h2 className="text-sm font-bold text-gray-800 pb-1 mb-2 border-b border-dashed border-gray-300 break-after-avoid">
          Idiomas
        </h2>
        <div className="space-y-1">
          {languages.map((lang) => (
            <p key={lang.id} className="text-xs text-gray-800">
              <span className="font-bold text-gray-900">{lang.language}</span> - {lang.level}
            </p>
          ))}
          {languages.length === 0 && (
            <p className="text-xs text-gray-400">Nenhum idioma cadastrado.</p>
          )}
        </div>
      </div>

      {/* Habilidades e Qualificações */}
      <div className="mb-5 break-inside-avoid">
        <h2 className="text-sm font-bold text-gray-800 pb-1 mb-2 border-b border-dashed border-gray-300 break-after-avoid">
          Habilidades e qualificações
        </h2>
        <div className="flex flex-wrap gap-x-2 gap-y-2 mt-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="border border-gray-300 px-3 py-0.5 text-xs text-gray-700 rounded-full bg-white font-medium"
            >
              {skill}
            </span>
          ))}
          {skills.length === 0 && (
            <p className="text-xs text-gray-400">Nenhuma habilidade cadastrada.</p>
          )}
        </div>
      </div>

    </div>
  );
}
