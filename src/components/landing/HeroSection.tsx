import React, { useState } from 'react';
import {
  ArrowRight,
  Upload,
  CheckCircle2,
  FileText,
  ShieldCheck,
  LayoutTemplate,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_RESUME } from '../../data/sampleResume';
import { TemplateId } from '../../types/resume';
import { ResumePreview } from '../builder/ResumePreview';

interface HeroSectionProps {
  onCreateResume: (template?: TemplateId) => void;
  onUploadResume: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onCreateResume,
  onUploadResume,
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId>('modern');

  const templates: { id: TemplateId; label: string }[] = [
    { id: 'classic', label: 'Classic ATS' },
    { id: 'modern', label: 'Modern Indigo' },
    { id: 'executive', label: 'Executive' },
  ];

  const metrics = [
    {
      value: '99.4%',
      label: 'Parser Readability',
      detail: 'Workday, Greenhouse & Lever',
      icon: Sparkles,
    },
    {
      value: '3',
      label: 'ATS-Safe Templates',
      detail: 'Zero multi-column traps',
      icon: LayoutTemplate,
    },
    {
      value: '< 2 min',
      label: 'Resume Import',
      detail: 'JSON, TXT, Markdown & PDF',
      icon: Clock,
    },
    {
      value: '100%',
      label: 'Local Privacy',
      detail: 'Zero forced sign-ups',
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-[#F5F3FF] via-[#FAF9FF] to-white pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-indigo-100/80"
    >
      {/* Architectural Dot Grid + Soft Lavender Bloom */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] [background-size:24px_24px] opacity-35"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 w-[640px] h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12),rgba(79,70,229,0.06),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* Left Column: Core Proposition & Primary CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-sm font-semibold text-indigo-600 tracking-tight">
              ATS-Verified Resume Authoring · Single-Column Precision
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-slate-900 leading-[1.1] text-balance">
              Build resumes that{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                pass screening
              </span>{' '}
              and earn interviews.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Structure your work history with clean, parser-safe typography, run instant keyword diagnostics against target job descriptions, and export crisp vector PDFs—all in one focused workspace.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => onCreateResume(previewTemplate)}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/25 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
              >
                <FileText className="w-4 h-4" />
                <span>Create Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onUploadResume}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-indigo-950 bg-white hover:bg-indigo-50/70 border border-indigo-200 hover:border-indigo-300 rounded-xl shadow-xs transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
              >
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Upload Resume</span>
              </button>
            </div>

            {/* Quiet Unboxed Proof Line */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs sm:text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                No account required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                Selectable text PDF export
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                Live ATS keyword audit
              </span>
            </div>
          </div>

          {/* Right Column: Live Interactive ATS Resume Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white border border-indigo-200/80 p-4 sm:p-5 shadow-xl shadow-indigo-950/10">
              {/* Interactive Template Switcher Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-indigo-100">
                <div className="text-xs font-medium text-indigo-950/70">
                  Live Document Preview · Letter Size
                </div>

                <div
                  role="tablist"
                  aria-label="Preview resume template"
                  className="inline-flex items-center gap-1 p-1 bg-white/80 border border-indigo-100 rounded-lg shadow-2xs"
                >
                  {templates.map((tpl) => {
                    const active = previewTemplate === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setPreviewTemplate(tpl.id)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-indigo-700'
                        }`}
                      >
                        {tpl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Miniature Real Resume Paper */}
              <div className="rounded-xl overflow-hidden border border-indigo-100/90 bg-white shadow-sm max-h-[430px] overflow-y-auto">
                <ResumePreview
                  resume={SAMPLE_RESUME}
                  templateOverride={previewTemplate}
                  compact
                />
              </div>

              {/* Clean Parsing Summary Footer */}
              <div className="mt-3.5 pt-3 border-t border-indigo-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span>Single-column semantic layout · Zero hidden tables</span>
                <button
                  type="button"
                  onClick={() => onCreateResume(previewTemplate)}
                  className="font-semibold text-indigo-600 hover:text-purple-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Edit this sample →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quantitative Proof Strip */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-2xl bg-white/95 border border-indigo-100/90 px-5 py-4 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-2xl sm:text-[1.75rem] font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tabular-nums font-display leading-tight">
                    {metric.value}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {metric.label}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {metric.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
