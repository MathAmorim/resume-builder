'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { X, Plus, Trash2, Edit2, Check, RotateCcw } from 'lucide-react';
import { EducationItem, CourseItem, ExperienceItem, LanguageItem } from '../types/resume';

interface EditModalProps {
  section: string | null;
  onClose: () => void;
}

export default function EditModal({ section, onClose }: EditModalProps) {
  const { data, updateHeader, updatePersonal, updateGoals, updateSummary,
    addEducation, updateEducation, deleteEducation,
    addCourse, updateCourse, deleteCourse,
    addExperience, updateExperience, deleteExperience,
    addLanguage, updateLanguage, deleteLanguage,
    addSkill, removeSkill } = useResumeStore();

  // Local state for basic section forms
  const [personalForm, setPersonalForm] = useState(data.personal);
  const [goalsForm, setGoalsForm] = useState({
    targetRoles: data.goals.targetRoles.join(', '),
    salaryMin: data.goals.salaryMin,
    salaryDesired: data.goals.salaryDesired,
    period: data.goals.period,
    hideSalaryOnPDF: data.goals.hideSalaryOnPDF || false,
  });
  const [headerForm, setHeaderForm] = useState(data.header);
  const [summaryText, setSummaryText] = useState(data.summary);

  // States for adding new items
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', period: '' });
  const [newCourse, setNewCourse] = useState({ name: '', institution: '', period: '' });
  const [newExp, setNewExp] = useState({ role: '', company: '', sector: '', salaryFinal: '', period: '', description: '' });
  const [newLang, setNewLang] = useState({ language: '', level: '' });
  const [newSkillText, setNewSkillText] = useState('');

  // States for editing existing items
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [editingEduForm, setEditingEduForm] = useState<Omit<EducationItem, 'id'>>({ institution: '', degree: '', period: '' });

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingCourseForm, setEditingCourseForm] = useState<Omit<CourseItem, 'id'>>({ name: '', institution: '', period: '' });

  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingExpForm, setEditingExpForm] = useState<Omit<ExperienceItem, 'id'>>({ role: '', company: '', sector: '', salaryFinal: '', period: '', description: '' });

  const [editingLangId, setEditingLangId] = useState<string | null>(null);
  const [editingLangForm, setEditingLangForm] = useState<Omit<LanguageItem, 'id'>>({ language: '', level: '' });

  // Sync state with store data when modal opens
  useEffect(() => {
    setPersonalForm(data.personal);
    setGoalsForm({
      targetRoles: data.goals.targetRoles.join(', '),
      salaryMin: data.goals.salaryMin,
      salaryDesired: data.goals.salaryDesired,
      period: data.goals.period,
      hideSalaryOnPDF: data.goals.hideSalaryOnPDF || false,
    });
    setHeaderForm(data.header);
    setSummaryText(data.summary);
    
    // Reset editing states
    setEditingEduId(null);
    setEditingCourseId(null);
    setEditingExpId(null);
    setEditingLangId(null);
  }, [data, section]);

  if (!section) return null;

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonal(personalForm);
    onClose();
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    const rolesArray = goalsForm.targetRoles.split(',').map(r => r.trim()).filter(Boolean);
    updateGoals({
      targetRoles: rolesArray,
      salaryMin: goalsForm.salaryMin,
      salaryDesired: goalsForm.salaryDesired,
      period: goalsForm.period,
      hideSalaryOnPDF: goalsForm.hideSalaryOnPDF,
    });
    onClose();
  };

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeader(headerForm);
    onClose();
  };

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    updateSummary(summaryText);
    onClose();
  };

  // Inline edit handlers for Education
  const startEditEdu = (item: EducationItem) => {
    setEditingEduId(item.id);
    setEditingEduForm({ institution: item.institution, degree: item.degree, period: item.period });
  };
  const saveEditEdu = (id: string) => {
    updateEducation(id, editingEduForm);
    setEditingEduId(null);
  };

  // Inline edit handlers for Course
  const startEditCourse = (item: CourseItem) => {
    setEditingCourseId(item.id);
    setEditingCourseForm({ name: item.name, institution: item.institution, period: item.period });
  };
  const saveEditCourse = (id: string) => {
    updateCourse(id, editingCourseForm);
    setEditingCourseId(null);
  };

  // Inline edit handlers for Experience
  const startEditExp = (item: ExperienceItem) => {
    setEditingExpId(item.id);
    setEditingExpForm({
      role: item.role,
      company: item.company,
      sector: item.sector,
      salaryFinal: item.salaryFinal,
      period: item.period,
      description: item.description
    });
  };
  const saveEditExp = (id: string) => {
    updateExperience(id, editingExpForm);
    setEditingExpId(null);
  };

  // Inline edit handlers for Language
  const startEditLang = (item: LanguageItem) => {
    setEditingLangId(item.id);
    setEditingLangForm({ language: item.language, level: item.level });
  };
  const saveEditLang = (id: string) => {
    updateLanguage(id, editingLangForm);
    setEditingLangId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {section === 'header' && 'Editar Cabeçalho'}
            {section === 'personal' && 'Editar Dados Pessoais'}
            {section === 'goals' && 'Editar Objetivos Profissionais'}
            {section === 'summary' && 'Editar Resumo'}
            {section === 'education' && 'Gerenciar Escolaridade'}
            {section === 'courses' && 'Gerenciar Cursos'}
            {section === 'experiences' && 'Gerenciar Experiências Profissionais'}
            {section === 'languages' && 'Gerenciar Idiomas'}
            {section === 'skills' && 'Gerenciar Habilidades e Qualificações'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* HEADER FORM */}
          {section === 'header' && (
            <form onSubmit={handleSaveHeader} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={headerForm.name}
                  onChange={e => setHeaderForm({ ...headerForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={headerForm.email}
                  onChange={e => setHeaderForm({ ...headerForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Atual</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={headerForm.currentRole}
                  onChange={e => setHeaderForm({ ...headerForm, currentRole: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* PERSONAL DATA FORM */}
          {section === 'personal' && (
            <form onSubmit={handleSavePersonal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                  <input
                    type="number"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={personalForm.age}
                    onChange={e => setPersonalForm({ ...personalForm, age: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={personalForm.gender}
                    onChange={e => setPersonalForm({ ...personalForm, gender: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={personalForm.neighborhood}
                    onChange={e => setPersonalForm({ ...personalForm, neighborhood: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade / Estado</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: São Paulo / SP"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={personalForm.cityState}
                    onChange={e => setPersonalForm({ ...personalForm, cityState: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={personalForm.phone}
                    onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Última Atualização</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 07/07/2026"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={personalForm.lastUpdated}
                    onChange={e => setPersonalForm({ ...personalForm, lastUpdated: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* PROFESSIONAL GOALS FORM */}
          {section === 'goals' && (
            <form onSubmit={handleSaveGoals} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargos de Interesse (separados por vírgula)</label>
                <input
                  type="text"
                  required
                  placeholder="Analista de Suporte, Analista de Redes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={goalsForm.targetRoles}
                  onChange={e => setGoalsForm({ ...goalsForm, targetRoles: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salário Mínimo Aceitável</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: R$ 2.500,00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={goalsForm.salaryMin}
                    onChange={e => setGoalsForm({ ...goalsForm, salaryMin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salário Pretendido</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: R$ 3.500,00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={goalsForm.salaryDesired}
                    onChange={e => setGoalsForm({ ...goalsForm, salaryDesired: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período Pretendido</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Integral"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={goalsForm.period}
                  onChange={e => setGoalsForm({ ...goalsForm, period: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="hideSalaryOnPDF"
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:outline-none cursor-pointer"
                  checked={goalsForm.hideSalaryOnPDF}
                  onChange={e => setGoalsForm({ ...goalsForm, hideSalaryOnPDF: e.target.checked })}
                />
                <label htmlFor="hideSalaryOnPDF" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Ocultar salário no PDF final
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* SUMMARY FORM */}
          {section === 'summary' && (
            <form onSubmit={handleSaveSummary} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apresentação do candidato</label>
                <textarea
                  required
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={summaryText}
                  onChange={e => setSummaryText(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* EDUCATION LIST & ADD / EDIT */}
          {section === 'education' && (
            <div className="space-y-6">
              {/* List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm">Escolaridades Cadastradas</h3>
                {data.education.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma escolaridade cadastrada.</p>
                ) : (
                  <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
                    {data.education.map(edu => {
                      const isEditing = editingEduId === edu.id;
                      return (
                        <div key={edu.id} className="p-4 text-sm bg-white">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-0.5">Instituição</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  value={editingEduForm.institution}
                                  onChange={e => setEditingEduForm({ ...editingEduForm, institution: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-0.5">Curso / Grau</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  value={editingEduForm.degree}
                                  onChange={e => setEditingEduForm({ ...editingEduForm, degree: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-0.5">Período</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  value={editingEduForm.period}
                                  onChange={e => setEditingEduForm({ ...editingEduForm, period: e.target.value })}
                                />
                              </div>
                              <div className="flex gap-2 justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingEduId(null)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveEditEdu(edu.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Salvar Item
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="pr-4">
                                <p className="font-semibold text-gray-800">{edu.institution}</p>
                                <p className="text-gray-600 mt-0.5">{edu.degree}</p>
                                <p className="text-gray-400 text-xs mt-1">{edu.period}</p>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditEdu(edu)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteEducation(edu.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form Add */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm">Adicionar Escolaridade</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Instituição</label>
                    <input
                      type="text"
                      placeholder="Ex: Universidade Federal de Exemplo - Campus Central"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={newEdu.institution}
                      onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Curso / Grau</label>
                    <input
                      type="text"
                      placeholder="Ex: Computação/Informática - Bacharelado em Ciência da Computação"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={newEdu.degree}
                      onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Período</label>
                    <input
                      type="text"
                      placeholder="Ex: 01/02/2017 - Não concluído."
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={newEdu.period}
                      onChange={e => setNewEdu({ ...newEdu, period: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newEdu.institution || !newEdu.degree || !newEdu.period) return;
                      addEducation(newEdu);
                      setNewEdu({ institution: '', degree: '', period: '' });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Adicionar na Lista
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* COURSES LIST & ADD / EDIT */}
          {section === 'courses' && (
            <div className="space-y-6">
              {/* List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm">Cursos Importantes Cadastrados</h3>
                {data.courses.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum curso cadastrado.</p>
                ) : (
                  <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
                    {data.courses.map(course => {
                      const isEditing = editingCourseId === course.id;
                      return (
                        <div key={course.id} className="p-4 text-sm bg-white">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-0.5">Nome do Curso</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  value={editingCourseForm.name}
                                  onChange={e => setEditingCourseForm({ ...editingCourseForm, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-0.5">Instituição</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  value={editingCourseForm.institution}
                                  onChange={e => setEditingCourseForm({ ...editingCourseForm, institution: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-0.5">Período / Carga Horária</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  value={editingCourseForm.period}
                                  onChange={e => setEditingCourseForm({ ...editingCourseForm, period: e.target.value })}
                                />
                              </div>
                              <div className="flex gap-2 justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingCourseId(null)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveEditCourse(course.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Salvar Item
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-gray-800">{course.name}</p>
                                <p className="text-gray-600 mt-0.5">{course.institution}</p>
                                <p className="text-gray-400 text-xs mt-1">{course.period}</p>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditCourse(course)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteCourse(course.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form Add */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm">Adicionar Curso</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nome do Curso / Treinamento</label>
                    <input
                      type="text"
                      placeholder="Ex: Introdução ao Red Hat Linux"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={newCourse.name}
                      onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Instituição</label>
                    <input
                      type="text"
                      placeholder="Ex: Udemy / Coursera"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={newCourse.institution}
                      onChange={e => setNewCourse({ ...newCourse, institution: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Período / Carga Horária</label>
                    <input
                      type="text"
                      placeholder="Ex: 01/2026 (40 horas)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={newCourse.period}
                      onChange={e => setNewCourse({ ...newCourse, period: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCourse.name || !newCourse.institution || !newCourse.period) return;
                      addCourse(newCourse);
                      setNewCourse({ name: '', institution: '', period: '' });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Adicionar na Lista
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EXPERIENCES LIST & ADD / EDIT */}
          {section === 'experiences' && (
            <div className="space-y-6">
              {/* List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm">Experiências Cadastradas</h3>
                {data.experiences.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma experiência cadastrada.</p>
                ) : (
                  <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
                    {data.experiences.map(exp => {
                      const isEditing = editingExpId === exp.id;
                      return (
                        <div key={exp.id} className="p-4 text-sm bg-white">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Cargo</label>
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={editingExpForm.role}
                                    onChange={e => setEditingExpForm({ ...editingExpForm, role: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Empresa</label>
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={editingExpForm.company}
                                    onChange={e => setEditingExpForm({ ...editingExpForm, company: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Setor</label>
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={editingExpForm.sector}
                                    onChange={e => setEditingExpForm({ ...editingExpForm, sector: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Salário Final</label>
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={editingExpForm.salaryFinal}
                                    onChange={e => setEditingExpForm({ ...editingExpForm, salaryFinal: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-0.5">Período</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  value={editingExpForm.period}
                                  onChange={e => setEditingExpForm({ ...editingExpForm, period: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-0.5">Descrição detalhada</label>
                                <textarea
                                  rows={4}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  value={editingExpForm.description}
                                  onChange={e => setEditingExpForm({ ...editingExpForm, description: e.target.value })}
                                />
                              </div>
                              <div className="flex gap-2 justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingExpId(null)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveEditExp(exp.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Salvar Item
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="pr-4">
                                <p className="font-semibold text-gray-800">{exp.role}</p>
                                <p className="text-gray-600 mt-0.5">{exp.company} - {exp.sector}</p>
                                <p className="text-gray-500 text-xs mt-0.5">Salário: {exp.salaryFinal} | Período: {exp.period}</p>
                                <p className="text-gray-500 text-xs mt-2 text-justify line-clamp-3 leading-relaxed">{exp.description}</p>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditExp(exp)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteExperience(exp.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form Add */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm">Adicionar Experiência Profissional</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Cargo</label>
                      <input
                        type="text"
                        placeholder="Ex: Professor"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newExp.role}
                        onChange={e => setNewExp({ ...newExp, role: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Empresa / Instituição</label>
                      <input
                        type="text"
                        placeholder="Ex: Empresa Exemplo Ltda"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newExp.company}
                        onChange={e => setNewExp({ ...newExp, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Setor de Atuação</label>
                      <input
                        type="text"
                        placeholder="Ex: Educação / Telecomunicações"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newExp.sector}
                        onChange={e => setNewExp({ ...newExp, sector: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Salário Final</label>
                      <input
                        type="text"
                        placeholder="Ex: R$ 500,00"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newExp.salaryFinal}
                        onChange={e => setNewExp({ ...newExp, salaryFinal: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Período de Atuação</label>
                    <input
                      type="text"
                      placeholder="Ex: 05/08/2019 - 27/11/2019"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={newExp.period}
                      onChange={e => setNewExp({ ...newExp, period: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Descrição detalhada das atividades</label>
                    <textarea
                      rows={3}
                      placeholder="Atividades desempenhadas..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={newExp.description}
                      onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newExp.role || !newExp.company || !newExp.period) return;
                      addExperience(newExp);
                      setNewExp({ role: '', company: '', sector: '', salaryFinal: '', period: '', description: '' });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Adicionar na Lista
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LANGUAGES LIST & ADD / EDIT */}
          {section === 'languages' && (
            <div className="space-y-6">
              {/* List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm">Idiomas Cadastrados</h3>
                {data.languages.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum idioma cadastrado.</p>
                ) : (
                  <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
                    {data.languages.map(lang => {
                      const isEditing = editingLangId === lang.id;
                      return (
                        <div key={lang.id} className="p-4 text-sm bg-white">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Idioma</label>
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={editingLangForm.language}
                                    onChange={e => setEditingLangForm({ ...editingLangForm, language: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Nível / Proficiência</label>
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={editingLangForm.level}
                                    onChange={e => setEditingLangForm({ ...editingLangForm, level: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingLangId(null)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveEditLang(lang.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Salvar Item
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-800">{lang.language}</p>
                                <p className="text-gray-500 text-xs mt-0.5">Nível: {lang.level}</p>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditLang(lang)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteLanguage(lang.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form Add */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm">Adicionar Idioma</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Idioma</label>
                      <input
                        type="text"
                        placeholder="Ex: Inglês"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newLang.language}
                        onChange={e => setNewLang({ ...newLang, language: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nível / Proficiência</label>
                      <input
                        type="text"
                        placeholder="Ex: Técnico, Intermediário, Fluente"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newLang.level}
                        onChange={e => setNewLang({ ...newLang, level: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newLang.language || !newLang.level) return;
                      addLanguage(newLang);
                      setNewLang({ language: '', level: '' });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Adicionar na Lista
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SKILLS TAG SYSTEM */}
          {section === 'skills' && (
            <div className="space-y-6">
              {/* List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm">Habilidades Cadastradas</h3>
                {data.skills.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma habilidade cadastrada.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                    {data.skills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 border border-gray-300 rounded-full px-3 py-1 text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-gray-400 hover:text-red-500 rounded-full p-0.5 focus:outline-none cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Add tag form */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm">Adicionar Habilidade / Qualificação</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Docker, Python, Liderança"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={newSkillText}
                    onChange={e => setNewSkillText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newSkillText.trim()) {
                          addSkill(newSkillText);
                          setNewSkillText('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSkillText.trim()) {
                        addSkill(newSkillText);
                        setNewSkillText('');
                      }
                    }}
                    className="flex items-center justify-center px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
                <p className="text-xs text-gray-400">Dica: Digite a habilidade e clique em Adicionar ou pressione Enter.</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
