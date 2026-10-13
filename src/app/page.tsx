'use client';

import React, { useRef, useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import {
  User,
  Target,
  FileText,
  GraduationCap,
  Briefcase,
  Globe,
  PencilRuler,
  Settings,
  Printer,
  Search,
  Camera,
  Plus,
  ChevronDown,
  Phone,
  LogOut
} from 'lucide-react';
import EditModal from '../components/EditModal';
import ResumePDF from '../components/ResumePDF';
import AuthScreen from '../components/AuthScreen';
import { DEFAULT_PHOTO } from '../types/resume';

export default function Page() {
  const { data, updateHeader, setResumeData, setTemplate, setTemplateLanguage } = useResumeStore();
  
  // Auth state
  const [user, setUser] = useState<{ id: string; email: string; isAdmin: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeLoaded, setResumeLoaded] = useState(false);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  // 1. Initial auth check
  React.useEffect(() => {
    setMounted(true);
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          
          // Load their specific resume
          const resumeRes = await fetch('/api/resume');
          if (resumeRes.ok) {
            const resumeData = await resumeRes.json();
            setResumeData(resumeData);
            setResumeLoaded(true);
          }
        }
      } catch (err) {
        console.error('Falha na autenticação inicial:', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [setResumeData]);

  // 2. Zustand Store Subscriber for Auto-Saving to Database
  React.useEffect(() => {
    if (!resumeLoaded) return;

    // Subscribe to state updates
    const unsubscribe = useResumeStore.subscribe((state) => {
      state.saveToServer();
    });

    return () => unsubscribe();
  }, [resumeLoaded]);

  // Handle successful login/signup from AuthScreen
  const handleAuthSuccess = async (userData: { id: string; email: string; isAdmin: boolean }) => {
    setUser(userData);
    setLoading(true);
    try {
      const resumeRes = await fetch('/api/resume');
      if (resumeRes.ok) {
        const resumeData = await resumeRes.json();
        setResumeData(resumeData);
        setResumeLoaded(true);
      }
    } catch (err) {
      console.error('Falha ao carregar currículo após login:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        setResumeLoaded(false);
      }
    } catch (err) {
      console.error('Falha ao deslogar:', err);
    }
  };

  // File Upload to Base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeader({ photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger print
  const handlePrint = () => {
    const originalTitle = document.title;
    
    // Normalize and remove accents / special characters from the name
    const rawName = data.header.name || 'sem nome';
    const cleanedName = rawName
      .normalize('NFD') // splits accented letters into letter + accent
      .replace(/[\u0300-\u036f]/g, '') // removes accent marks
      .replace(/[^\w\s-]/g, '') // removes everything except letters, digits, spaces, and hyphens
      .replace(/\s+/g, ' ') // collapses consecutive spaces
      .trim();

    // Set temporary page title for default PDF filename
    document.title = `curriculo - ${cleanedName.toLowerCase()}`;
    
    window.print();
    
    // Restore original page title
    document.title = originalTitle;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 font-sans">
        Carregando currículo...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 font-sans">
        Autenticando...
      </div>
    );
  }

  // If not authenticated, render login/signup card
  if (!user) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  return (
    <main className="min-h-screen bg-white">
      
      {/* Connected Account Bar (Hidden on print) */}
      <div className="print:hidden bg-gray-50 border-b border-gray-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-gray-600 font-sans">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>Conectado como: <strong className="text-gray-800">{user.email}</strong></span>
          {user.isAdmin && (
            <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Admin
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors font-semibold cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Sair da Conta
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. WEB APP EDITOR INTERFACE (HIDDEN ON PRINT)             */}
      {/* ========================================================= */}
      <div className="print:hidden w-full max-w-5xl mx-auto px-6 py-8">
        
        {/* Top Panel / Header Info */}
        <div className="flex flex-col items-center text-center relative mb-12">
          
          {/* Action Buttons Float Top Right */}
          <div className="md:absolute md:top-2 md:right-0 flex gap-4 mt-6 md:mt-0">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex flex-col items-center justify-center w-24 h-24 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <Search className="w-6 h-6 text-gray-400 group-hover:text-gray-600 mb-2" />
              <span className="text-[11px] text-gray-500 font-medium leading-tight">Visualizar<br />Currículo</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex flex-col items-center justify-center w-24 h-24 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <Printer className="w-6 h-6 text-gray-400 group-hover:text-gray-600 mb-2" />
              <span className="text-[11px] text-gray-500 font-medium leading-tight">Imprimir<br />currículo</span>
            </button>
          </div>

          {/* Template Selector Bar */}
          <div className="flex items-center gap-2 mb-8 bg-gray-50/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/90 shadow-sm text-xs">
            <span className="font-semibold text-gray-600">Modelo do PDF:</span>
            <button
              type="button"
              onClick={() => setTemplate('classic')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                (data.template || 'classic') === 'classic'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
              }`}
            >
              Modelo 1 (Clássico / Foto)
            </button>
            <button
              type="button"
              onClick={() => setTemplate('modern')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                data.template === 'modern'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
              }`}
            >
              Modelo 2 (Moderno / Executivo)
            </button>
          </div>

          {/* Avatar Container */}
          <div className="relative w-32 h-32 rounded-full border-4 border-gray-100 shadow-inner flex items-center justify-center bg-gray-50 overflow-visible group">
            <img
              src={data.header.photo || DEFAULT_PHOTO}
              alt="Foto do perfil"
              className="w-full h-full rounded-full object-cover"
            />
            
            {/* Camera Badge Overlay (triggers input file) */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 left-1 w-9 h-9 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-xs border border-gray-300 hover:bg-gray-50 transition-colors rounded px-4 py-1.5 text-gray-700 font-medium cursor-pointer"
          >
            Alterar foto
          </button>

          {/* Name & Title */}
          <div className="mt-4 flex flex-col items-center">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveSection('header')}>
              <h1 className="text-3xl font-semibold text-gray-800 hover:text-orange-600 transition-colors">
                {data.header.name || 'Seu Nome'}
              </h1>
              <div className="flex items-center text-gray-400 group-hover:text-orange-600">
                <Settings className="w-5 h-5 ml-1" />
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{data.header.email || 'seu-email@gmail.com'}</p>
            <p className="text-xs font-bold text-gray-500 tracking-widest mt-2 uppercase">{data.header.currentRole || 'Cargo Desejado'}</p>
          </div>

        </div>

        {/* Dashboard Grid Sections */}
        <div className="space-y-8">
          
          {/* 1. Dados Pessoais & Objetivos Profissionais (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg border border-orange-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Dados Pessoais</h2>
                </div>
                <button
                  onClick={() => setActiveSection('personal')}
                  className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  &gt; Editar
                </button>
              </div>

              <div className="pl-12 space-y-1.5 text-sm text-gray-600">
                <p className="font-bold text-gray-800">
                  {data.personal.age ? `${data.personal.age} anos` : 'Idade não informada'}, {data.personal.gender || 'Gênero não informado'}
                </p>
                <p className="italic text-gray-500 text-xs">
                  Última Atualização: {data.personal.lastUpdated || 'Não atualizado'}
                </p>
                <p>{data.personal.neighborhood || 'Bairro não informado'}</p>
                <p>{data.personal.cityState || 'Cidade / Estado'}</p>
                <div className="flex items-center gap-2 mt-2 font-medium text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{data.personal.phone || 'Telefone não cadastrado'}</span>
                </div>
              </div>
            </div>

            {/* Objetivos Profissionais */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg border border-orange-500 flex items-center justify-center">
                    <Target className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Objetivos Profissionais</h2>
                </div>
                <button
                  onClick={() => setActiveSection('goals')}
                  className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  &gt; Editar
                </button>
              </div>

              <div className="pl-12 space-y-3.5 text-sm text-gray-600">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-0.5">Cargo</h4>
                  {data.goals.targetRoles.length === 0 ? (
                    <p className="italic text-gray-400">Nenhum cargo especificado</p>
                  ) : (
                    data.goals.targetRoles.map((role, idx) => (
                      <p key={idx} className="font-medium text-gray-800">{role}</p>
                    ))
                  )}
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-0.5 flex items-center gap-1.5">
                    Salário
                    {data.goals.hideSalaryOnPDF && (
                      <span className="text-[10px] text-orange-500 font-semibold normal-case bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded animate-fade-in">
                        Oculto no PDF
                      </span>
                    )}
                  </h4>
                  <p className="text-gray-800">Mínimo aceitavel: {data.goals.salaryMin || 'Não informado'}</p>
                  <p className="text-gray-800">Pretendido: {data.goals.salaryDesired || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-0.5">Período Pretendido</h4>
                  <p className="text-gray-800">{data.goals.period || 'Não informado'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* 2. Resumo do Currículo */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg border border-orange-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Resumo do currículo</h2>
              </div>
              <button
                onClick={() => setActiveSection('summary')}
                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
              >
                &gt; Editar
              </button>
            </div>

            <p className="pl-12 text-sm text-gray-600 leading-relaxed text-justify">
              {data.summary || 'Insira um resumo profissional...'}
            </p>
          </div>

          {/* 3. Escolaridade */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg border border-orange-500 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Escolaridade</h2>
              </div>
              <button
                onClick={() => setActiveSection('education')}
                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
              >
                &gt; Editar | Adicionar
              </button>
            </div>

            <div className="pl-12 space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="space-y-0.5 border-l-2 border-orange-100 pl-4">
                  <p className="font-bold text-gray-800 text-[15px]">{edu.institution}</p>
                  <p className="text-gray-600 text-sm">{edu.degree}</p>
                  <p className="text-gray-400 text-xs">{edu.period}</p>
                </div>
              ))}
              {data.education.length === 0 && (
                <p className="italic text-gray-400 text-sm">Nenhuma escolaridade inserida.</p>
              )}
            </div>
          </div>

          {/* 4. Cursos Importantes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg border border-orange-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Cursos importantes</h2>
              </div>
              <button
                onClick={() => setActiveSection('courses')}
                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
              >
                &gt; Editar | Adicionar
              </button>
            </div>

            <div className="pl-12 space-y-4">
              <p className="text-xs text-gray-400">
                Informe para os recrutadores os cursos e treinamentos que realizou.
              </p>
              
              {data.courses.length > 0 && (
                <div className="space-y-3 mt-2">
                  {data.courses.map((course) => (
                    <div key={course.id} className="space-y-0.5 border-l-2 border-gray-100 pl-4">
                      <p className="font-bold text-gray-800 text-[15px]">{course.name}</p>
                      <p className="text-gray-600 text-sm">{course.institution}</p>
                      <p className="text-gray-400 text-xs">{course.period}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setActiveSection('courses')}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-800 text-gray-800 text-xs font-semibold rounded hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar curso
              </button>
            </div>
          </div>

          {/* 5. Experiências Profissionais */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg border border-orange-500 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Experiências profissionais</h2>
              </div>
              <button
                onClick={() => setActiveSection('experiences')}
                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
              >
                &gt; Editar | Adicionar
              </button>
            </div>

            <div className="pl-12 space-y-6">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <p className="font-bold text-gray-800 text-[15px]">{exp.role}</p>
                  <p className="text-gray-500 text-xs font-medium">
                    <span className="text-gray-700">{exp.company}</span>, {exp.sector}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Salário final: {exp.salaryFinal} ( {exp.period} )
                  </p>
                  <p className="text-sm text-gray-600 text-justify mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
              {data.experiences.length === 0 && (
                <p className="italic text-gray-400 text-sm">Nenhuma experiência profissional inserida.</p>
              )}
            </div>
          </div>

          {/* 6. Idiomas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg border border-orange-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Idiomas</h2>
              </div>
              <button
                onClick={() => setActiveSection('languages')}
                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
              >
                &gt; Editar
              </button>
            </div>

            <div className="pl-12 space-y-1">
              {data.languages.map((lang) => (
                <p key={lang.id} className="text-sm text-gray-600">
                  <span className="font-bold text-gray-800">{lang.language}</span> - {lang.level}
                </p>
              ))}
              {data.languages.length === 0 && (
                <p className="italic text-gray-400 text-sm">Nenhum idioma inserido.</p>
              )}
            </div>
          </div>

          {/* 7. Habilidades e Qualificações */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg border border-orange-500 flex items-center justify-center">
                  <PencilRuler className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Habilidades e qualificações</h2>
              </div>
              <button
                onClick={() => setActiveSection('skills')}
                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
              >
                &gt; Editar
              </button>
            </div>

            <div className="pl-12 flex flex-wrap gap-2.5">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-gray-300 px-4 py-1 text-sm text-gray-600 rounded-full bg-white font-medium shadow-sm"
                >
                  {skill}
                </span>
              ))}
              {data.skills.length === 0 && (
                <p className="italic text-gray-400 text-sm">Nenhuma habilidade inserida.</p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. PRINT LAYOUT ONLY (HIDDEN ON SCREEN, VISIBLE ON PRINT) */}
      {/* ========================================================= */}
      <div className="hidden print:block w-full">
        <ResumePDF data={data} template={data.template} templateLanguage={data.templateLanguage} />
      </div>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE EDIT MODALS                                */}
      {/* ========================================================= */}
      <EditModal
        section={activeSection}
        onClose={() => setActiveSection(null)}
      />

      {/* ========================================================= */}
      {/* 4. MODAL FOR PDF VISUALIZATION (PREVIEW ON SCREEN)        */}
      {/* ========================================================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
            {/* Top Toolbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Search className="w-5 h-5 text-orange-500" />
                  Visualização Prévia
                </h3>

                {/* Template Selector Segmented Control */}
                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
                  <button
                    onClick={() => setTemplate('classic')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      (data.template || 'classic') === 'classic'
                        ? 'bg-white text-gray-900 shadow font-semibold'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Modelo 1 (Clássico)
                  </button>
                  <button
                    onClick={() => setTemplate('modern')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      data.template === 'modern'
                        ? 'bg-white text-blue-600 shadow font-semibold'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Modelo 2 (Moderno)
                  </button>
                </div>

                {/* Language toggle when Modern template is selected */}
                {data.template === 'modern' && (
                  <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
                    <span className="text-[11px] text-gray-400 px-1.5 font-medium">Títulos:</span>
                    <button
                      onClick={() => setTemplateLanguage('pt')}
                      className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                        (data.templateLanguage || 'pt') === 'pt'
                          ? 'bg-white text-gray-900 shadow font-semibold'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      PT
                    </button>
                    <button
                      onClick={() => setTemplateLanguage('en')}
                      className={`px-2 py-1 rounded font-medium transition-all cursor-pointer ${
                        data.templateLanguage === 'en'
                          ? 'bg-white text-blue-600 shadow font-semibold'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
            {/* PDF Sheet Preview */}
            <div className="flex-1 p-8 overflow-y-auto bg-gray-500/10 flex justify-center">
              <div className="bg-white shadow-lg p-10 min-h-[1050px] w-full max-w-[800px] border border-gray-200">
                <ResumePDF data={data} template={data.template} templateLanguage={data.templateLanguage} />
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
