import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ResumeData, TemplateId } from '../../types/resume';
import { SAMPLE_RESUME } from '../../data/sampleResume';
import { ResumePreview } from '../builder/ResumePreview';

interface TemplatesViewProps {
  activeResume: ResumeData;
  onApplyTemplate: (template: TemplateId, openBuilder: boolean) => void;
}

const TEMPLATE_CATALOG: {
  id: TemplateId;
  category: 'traditional' | 'modern' | 'executive';
  name: string;
  description: string;
  highlights: string[];
}[] = [
  {
    id: 'classic',
    category: 'traditional',
    name: 'Classic ATS',
    description: 'Clean and professional layout for corporate applications.',
    highlights: [
      'Simple and readable',
      'ATS-friendly structure',
      'Ideal for corporate roles',
    ],
  },
  {
    id: 'modern',
    category: 'modern',
    name: 'Modern Indigo',
    description: 'Fresh, balanced design with subtle indigo accents.',
    highlights: [
      'Clear left-aligned header',
      'Easy-to-scan sections',
      'Great for tech & product roles',
    ],
  },
  {
    id: 'executive',
    category: 'executive',
    name: 'Executive Minimal',
    description: 'Polished layout built to highlight senior experience.',
    highlights: [
      'Strong section headings',
      'Refined purple accents',
      'Great for leadership & strategy',
    ],
  },
];

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  activeResume,
  onApplyTemplate,
}) => {
  const [filter, setFilter] = useState<'all' | 'traditional' | 'modern' | 'executive'>('all');
  const [previewWithSample, setPreviewWithSample] = useState(false);

  const hasUserContent = Boolean(
    activeResume.personal.fullName.trim() || activeResume.summary.trim()
  );
  const previewData = !previewWithSample && hasUserContent ? activeResume : SAMPLE_RESUME;

  const visibleTemplates =
    filter === 'all'
      ? TEMPLATE_CATALOG
      : TEMPLATE_CATALOG.filter((t) => t.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5 py-3.5 space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            ATS Resume Templates
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
            Choose a clean, ATS-friendly layout for your resume and switch anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Segmented Filter */}
          <div className="inline-flex items-center gap-1 p-1 bg-white border border-indigo-100 rounded-xl shadow-2xs">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'traditional', label: 'Classic' },
                { id: 'modern', label: 'Modern' },
                { id: 'executive', label: 'Executive' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-indigo-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {hasUserContent && (
            <button
              type="button"
              onClick={() => setPreviewWithSample((prev) => !prev)}
              className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200/80 rounded-xl transition-colors cursor-pointer"
            >
              {previewWithSample ? 'Preview My Resume' : 'Preview Sample Data'}
            </button>
          )}
        </div>
      </div>

      {/* Templates Grid: 1-col mobile, 2-col desktop, content-hugging */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
        {visibleTemplates.map((tpl) => {
          const isCurrent = activeResume.template === tpl.id;
          return (
            <article
              key={tpl.id}
              className={`rounded-2xl bg-white border p-2.5 shadow-xs hover:shadow-md hover:shadow-indigo-950/6 transition-all duration-200 flex flex-col ${
                isCurrent
                  ? 'border-indigo-400 ring-2 ring-indigo-500/20'
                  : 'border-indigo-100/90 hover:border-indigo-300'
              }`}
            >
              {/* Compact Lavender Preview Stage */}
              <div className="rounded-xl bg-gradient-to-b from-[#F5F3FF] to-[#EDE9FE]/55 border border-indigo-100 p-1.5">
                <div className="rounded-lg overflow-hidden border border-indigo-100/80 bg-white max-h-[190px] relative shadow-2xs">
                  <div className="pointer-events-none select-none origin-top-left scale-[0.68] w-[147.06%]">
                    <ResumePreview
                      resume={previewData}
                      templateOverride={tpl.id}
                      compact
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Compact Metadata & Benefits */}
              <div className="px-1 pt-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[15px] font-bold text-slate-900 leading-tight">
                    {tpl.name}
                  </h2>
                  {isCurrent && (
                    <span className="text-xs font-semibold text-indigo-600 shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-snug">
                  {tpl.description}
                </p>

                <ul className="mt-2 space-y-1">
                  {tpl.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-1.5 text-xs text-slate-700 leading-tight"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="mt-2.5 pt-2.5 px-1 border-t border-indigo-100/70 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onApplyTemplate(tpl.id, true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Use in Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => onApplyTemplate(tpl.id, false)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/85 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Apply
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
