import React, { useState } from 'react';
import {
  Download,
  FileDown,
  Upload,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { exportResumeToPdf } from '../../utils/pdfExporter';
import {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  TemplateId,
} from '../../types/resume';
import { createBlankResume, SAMPLE_RESUME } from '../../data/sampleResume';
import { ResumePreview } from './ResumePreview';
import { AtsCheckerPanel } from './AtsCheckerPanel';
import { analyzeResumeATS } from '../../utils/atsAnalyzer';

interface ResumeBuilderProps {
  resume: ResumeData;
  resumes: ResumeData[];
  onSelectResume: (id: string) => void;
  onChange: (updated: ResumeData) => void;
  onOpenUpload: () => void;
  onNotify: (message: string) => void;
  onExportedPdf?: (filename: string) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  resume,
  resumes,
  onSelectResume,
  onChange,
  onOpenUpload,
  onNotify,
  onExportedPdf,
}) => {
  const [editorTab, setEditorTab] = useState<'content' | 'ats'>('content');
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit');
  const [jobDescription, setJobDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [zoom, setZoom] = useState<number>(100);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const analysis = analyzeResumeATS(resume, jobDescription);

  const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
    onChange({
      ...resume,
      personal: { ...resume.personal, [field]: value },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    };
    onChange({
      ...resume,
      experience: [...resume.experience, newExp],
      updatedAt: new Date().toISOString(),
    });
  };

  const updateExperience = (id: string, patch: Partial<ExperienceItem>) => {
    onChange({
      ...resume,
      experience: resume.experience.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...resume,
      experience: resume.experience.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
    };
    onChange({
      ...resume,
      education: [...resume.education, newEdu],
      updatedAt: new Date().toISOString(),
    });
  };

  const updateEducation = (id: string, patch: Partial<EducationItem>) => {
    onChange({
      ...resume,
      education: resume.education.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...resume,
      education: resume.education.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      roleOrTech: '',
      link: '',
      description: '',
    };
    onChange({
      ...resume,
      projects: [...resume.projects, newProj],
      updatedAt: new Date().toISOString(),
    });
  };

  const updateProject = (id: string, patch: Partial<ProjectItem>) => {
    onChange({
      ...resume,
      projects: resume.projects.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...resume,
      projects: resume.projects.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  const addSkillsFromInput = (raw: string) => {
    const incoming = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !resume.skills.includes(s));
    if (incoming.length === 0) return;
    onChange({
      ...resume,
      skills: [...resume.skills, ...incoming],
      updatedAt: new Date().toISOString(),
    });
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    onChange({
      ...resume,
      skills: resume.skills.filter((s) => s !== skill),
      updatedAt: new Date().toISOString(),
    });
  };

  const addCertification = () => {
    const trimmed = certInput.trim();
    if (!trimmed) return;
    onChange({
      ...resume,
      certifications: [...resume.certifications, trimmed],
      updatedAt: new Date().toISOString(),
    });
    setCertInput('');
  };

  const removeCertification = (index: number) => {
    onChange({
      ...resume,
      certifications: resume.certifications.filter((_, idx) => idx !== index),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (resume.personal.fullName || resume.title || 'resume')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    link.download = `${safeName}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify('Resume JSON exported.');
  };

  const handleExportPdf = () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      const { filename, pageCount } = exportResumeToPdf(resume);
      onExportedPdf?.(filename);
      onNotify(
        `Downloaded ${filename} (${pageCount} ${pageCount === 1 ? 'page' : 'pages'}).`
      );
    } catch (err) {
      onNotify(
        err instanceof Error
          ? `PDF export failed: ${err.message}`
          : 'PDF export failed. Please try again.'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  const templates: { id: TemplateId; label: string }[] = [
    { id: 'classic', label: 'Classic' },
    { id: 'modern', label: 'Modern' },
    { id: 'executive', label: 'Executive' },
  ];

  return (
    <div className="bg-[#F6F5FD] flex flex-col">
      {/* Compact Builder Action Toolbar */}
      <div className="no-print bg-white/95 backdrop-blur-xs border-b border-indigo-100/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          {resumes.length > 1 && (
            <select
              aria-label="Switch saved resume"
              value={resume.id}
              onChange={(e) => onSelectResume(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-[#FAF9FF] border border-indigo-100 rounded-lg px-2.5 py-1.5 max-w-[180px] truncate focus:border-indigo-500 focus:outline-none"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title || 'Untitled Resume'}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            value={resume.title}
            onChange={(e) =>
              onChange({
                ...resume,
                title: e.target.value,
                updatedAt: new Date().toISOString(),
              })
            }
            aria-label="Resume document title"
            className="text-sm font-semibold text-slate-900 bg-[#FAF9FF] border border-indigo-100 hover:border-indigo-200 focus:border-indigo-500 focus:bg-white rounded-lg px-3 py-1.5 min-w-[160px] max-w-[260px] truncate focus:outline-none transition-colors"
          />

          <span className="hidden xl:inline text-xs text-indigo-400 whitespace-nowrap">
            Auto-saved locally
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Template Switcher */}
          <div className="hidden md:inline-flex items-center gap-1 p-1 bg-[#F3F1FC] border border-indigo-100 rounded-xl">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...resume,
                    template: tpl.id,
                    updatedAt: new Date().toISOString(),
                  })
                }
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  resume.template === tpl.id
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-indigo-700'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-950 bg-white hover:bg-indigo-50/70 border border-indigo-200/80 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-indigo-50/70 border border-indigo-200/80 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 rounded-xl shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Mobile View Switcher */}
      <div className="no-print lg:hidden bg-white border-b border-indigo-100 px-4 py-2 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 p-1 bg-[#F3F1FC] rounded-xl w-full">
          <button
            type="button"
            onClick={() => setMobilePane('edit')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
              mobilePane === 'edit' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Editor & ATS
          </button>
          <button
            type="button"
            onClick={() => setMobilePane('preview')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
              mobilePane === 'preview' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Live Preview ({analysis.overallScore}%)
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12">
        {/* Left Editor Column */}
        <section
          aria-label="Resume Editor"
          className={`no-print lg:col-span-6 xl:col-span-5 border-r border-indigo-100/90 bg-[#F6F5FD] p-4 sm:p-6 overflow-y-auto lg:h-[calc(100vh-7.75rem)] ${
            mobilePane === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Sub-navigation & Quick Reset Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="inline-flex items-center gap-1 p-1 bg-white border border-indigo-100 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setEditorTab('content')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  editorTab === 'content'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-indigo-700'
                }`}
              >
                Resume Content
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('ats')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  editorTab === 'ats'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-indigo-700'
                }`}
              >
                ATS Checker ({analysis.overallScore}%)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onChange({ ...SAMPLE_RESUME, template: resume.template });
                  onNotify('Sample engineering resume loaded.');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...createBlankResume(), template: resume.template });
                  onNotify('Cleared to blank resume.');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Blank</span>
              </button>
            </div>
          </div>

          {editorTab === 'ats' ? (
            <AtsCheckerPanel
              resume={resume}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              onAddSkill={(kw) => {
                if (!resume.skills.includes(kw)) {
                  onChange({
                    ...resume,
                    skills: [...resume.skills, kw],
                    updatedAt: new Date().toISOString(),
                  });
                  onNotify(`Added "${kw}" to skills.`);
                }
              }}
            />
          ) : (
            <div className="space-y-6">
              {/* Mobile Template Picker */}
              <div className="md:hidden rounded-xl bg-white border border-slate-200 p-4">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Template Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...resume,
                          template: tpl.id,
                          updatedAt: new Date().toISOString(),
                        })
                      }
                      className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                        resume.template === tpl.id
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Personal Info */}
              <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs hover:border-indigo-200/90 transition-colors space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={resume.personal.fullName}
                      onChange={(e) => updatePersonal('fullName', e.target.value)}
                      placeholder="Elena Rostova"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Target Job Title
                    </label>
                    <input
                      type="text"
                      value={resume.personal.jobTitle}
                      onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                      placeholder="Senior Software Engineer"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={resume.personal.email}
                      onChange={(e) => updatePersonal('email', e.target.value)}
                      placeholder="elena@example.com"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={resume.personal.phone}
                      onChange={(e) => updatePersonal('phone', e.target.value)}
                      placeholder="(415) 555-0192"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={resume.personal.location}
                      onChange={(e) => updatePersonal('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={resume.personal.linkedin}
                      onChange={(e) => updatePersonal('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Website / Portfolio
                    </label>
                    <input
                      type="text"
                      value={resume.personal.website}
                      onChange={(e) => updatePersonal('website', e.target.value)}
                      placeholder="yourportfolio.dev"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Professional Summary */}
              <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs hover:border-indigo-200/90 transition-colors space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {resume.summary.trim() ? resume.summary.trim().split(/\s+/).length : 0} words
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={resume.summary}
                  onChange={(e) =>
                    onChange({
                      ...resume,
                      summary: e.target.value,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  placeholder="Write 2–4 concise sentences summarizing your years of experience, domain focus, and top measurable achievements."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 3. Work Experience */}
              <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs hover:border-indigo-200/90 transition-colors space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Work Experience</h3>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="space-y-6 divide-y divide-slate-200">
                  {resume.experience.map((exp, idx) => (
                    <div key={exp.id} className={idx > 0 ? 'pt-5 space-y-3' : 'space-y-3'}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                          Position {idx + 1}
                        </span>
                        {resume.experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                          placeholder="Job Title (e.g. Senior Engineer)"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          placeholder="Company Name"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                          placeholder="Start (e.g. Mar 2023)"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            disabled={exp.current}
                            value={exp.current ? 'Present' : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                            placeholder="End (e.g. Feb 2025)"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500 focus:border-indigo-500 focus:outline-none"
                          />
                          <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) =>
                                updateExperience(exp.id, { current: e.target.checked })
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            Current
                          </label>
                        </div>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          placeholder="Location (e.g. San Francisco, CA)"
                          className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      {/* Bullet Points */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600">
                            Achievement Bullets
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateExperience(exp.id, {
                                bullets: [...exp.bullets, ''],
                              })
                            }
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                          >
                            + Add Bullet
                          </button>
                        </div>

                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => {
                                const nextBullets = [...exp.bullets];
                                nextBullets[bIdx] = e.target.value;
                                updateExperience(exp.id, { bullets: nextBullets });
                              }}
                              placeholder="Led migration to TypeScript, reducing runtime defects by 32%..."
                              className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                            />
                            {exp.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextBullets = exp.bullets.filter((_, i) => i !== bIdx);
                                  updateExperience(exp.id, { bullets: nextBullets });
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                                aria-label="Delete bullet"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Skills */}
              <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs hover:border-indigo-200/90 transition-colors space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Skills</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkillsFromInput(skillInput);
                      }
                    }}
                    placeholder="Add skills (comma-separated, e.g. React, Python, SQL)"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addSkillsFromInput(skillInput)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {resume.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {resume.skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => removeSkill(skill)}
                        title="Click to remove skill"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>{skill}</span>
                        <span className="text-slate-400">×</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Education */}
              <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs hover:border-indigo-200/90 transition-colors space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Education</h3>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                <div className="space-y-4 divide-y divide-slate-200">
                  {resume.education.map((edu, idx) => (
                    <div key={edu.id} className={idx > 0 ? 'pt-4 space-y-2.5' : 'space-y-2.5'}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                          Credential {idx + 1}
                        </span>
                        {resume.education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(edu.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(edu.id, { institution: e.target.value })
                          }
                          placeholder="University / Institution"
                          className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          placeholder="Degree (e.g. B.S.)"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                          placeholder="Field (e.g. Computer Science)"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={edu.graduationDate}
                          onChange={(e) =>
                            updateEducation(edu.id, { graduationDate: e.target.value })
                          }
                          placeholder="Graduation (e.g. May 2020)"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={edu.gpa ?? ''}
                          onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                          placeholder="GPA (optional)"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Projects */}
              <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs hover:border-indigo-200/90 transition-colors space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Projects (Optional)</h3>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {resume.projects.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Add relevant technical projects, open-source tools, or case studies.
                  </p>
                ) : (
                  <div className="space-y-4 divide-y divide-slate-200">
                    {resume.projects.map((proj, idx) => (
                      <div key={proj.id} className={idx > 0 ? 'pt-4 space-y-2.5' : 'space-y-2.5'}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500">
                            Project {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeProject(proj.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                            placeholder="Project Name"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={proj.roleOrTech}
                            onChange={(e) =>
                              updateProject(proj.id, { roleOrTech: e.target.value })
                            }
                            placeholder="Stack / Role (e.g. React · Go)"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={proj.link ?? ''}
                            onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                            placeholder="URL (optional)"
                            className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                          />
                          <textarea
                            rows={2}
                            value={proj.description}
                            onChange={(e) =>
                              updateProject(proj.id, { description: e.target.value })
                            }
                            placeholder="Concise description of outcome or architecture..."
                            className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 7. Certifications */}
              <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs hover:border-indigo-200/90 transition-colors space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Certifications (Optional)</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCertification();
                      }
                    }}
                    placeholder="e.g. AWS Solutions Architect – Associate (2025)"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {resume.certifications.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {resume.certifications.map((cert, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                      >
                        <span>{cert}</span>
                        <button
                          type="button"
                          onClick={() => removeCertification(idx)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          aria-label="Remove certification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Right Live Preview Column */}
        <section
          aria-label="Live Resume Preview"
          className={`lg:col-span-6 xl:col-span-7 bg-[#EDEBF8]/75 bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] [background-size:20px_20px] p-4 sm:p-8 overflow-y-auto lg:h-[calc(100vh-7.75rem)] flex flex-col items-center ${
            mobilePane === 'preview' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Preview Controls Bar */}
          <div className="no-print w-full max-w-[780px] flex items-center justify-between gap-4 mb-4 text-xs text-slate-700">
            <div className="bg-white/90 backdrop-blur-xs border border-indigo-100 rounded-lg px-3 py-1.5 shadow-2xs">
              <span>ATS Score: </span>
              <span className="font-mono font-bold text-indigo-700 tabular-nums">
                {analysis.overallScore}%
              </span>
              <span className="mx-2 text-indigo-200" aria-hidden="true">
                ·
              </span>
              <span className="tabular-nums font-medium">{analysis.wordCount} words</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/95 border border-indigo-100 rounded-lg p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(75, z - 10))}
                className="p-1 text-slate-600 hover:text-indigo-700 rounded cursor-pointer"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono tabular-nums text-[11px] font-medium">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(110, z + 10))}
                className="p-1 text-slate-600 hover:text-indigo-700 rounded cursor-pointer"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Paper Sheet */}
          <div
            className="print-only-container w-full max-w-[780px] bg-white border border-indigo-100 shadow-xl shadow-indigo-950/10 rounded-xl overflow-hidden origin-top transition-transform duration-150"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <ResumePreview resume={resume} />
          </div>
        </section>
      </div>
    </div>
  );
};
