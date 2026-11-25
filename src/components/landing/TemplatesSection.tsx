import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SAMPLE_RESUME } from '../../data/sampleResume';
import { TemplateId } from '../../types/resume';
import { ResumePreview } from '../builder/ResumePreview';

interface TemplatesSectionProps {
  onSelectTemplate: (template: TemplateId) => void;
}

const TEMPLATE_ITEMS: {
  id: TemplateId;
  name: string;
  subtitle: string;
  bestFor: string;
}[] = [
  {
    id: 'classic',
    name: 'Classic ATS',
    subtitle: 'Centered header · Traditional hairline dividers',
    bestFor: 'Finance, legal, operations, and enterprise roles requiring conventional hierarchy.',
  },
  {
    id: 'modern',
    name: 'Modern Indigo',
    subtitle: 'Indigo section headings · Clean left-aligned layout',
    bestFor: 'Software engineering, product management, and SaaS teams.',
  },
  {
    id: 'executive',
    name: 'Executive Minimal',
    subtitle: 'Bold structural rules · Purple & slate accents',
    bestFor: 'Senior leadership, directors, and principal technical contributors.',
  },
];

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  onSelectTemplate,
}) => {
  return (
    <section id="templates" className="py-14 sm:py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-9">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-purple-600 mb-2">
              Three ATS-Tested Layouts
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              Clean templates designed for effortless scanning.
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-sm">
            Switch layouts anytime inside the editor without re-entering a single word of your career history.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {TEMPLATE_ITEMS.map((tpl) => (
            <div
              key={tpl.id}
              className="group rounded-2xl bg-slate-50/70 border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col"
            >
              {/* Miniature Live Document Frame */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs h-[270px] relative">
                <div className="pointer-events-none select-none origin-top-left scale-[0.72] w-[138.8%]">
                  <ResumePreview
                    resume={SAMPLE_RESUME}
                    templateOverride={tpl.id}
                    compact
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent"
                  aria-hidden="true"
                />
              </div>

              {/* Card Copy */}
              <div className="mt-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    {tpl.subtitle}
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {tpl.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    {tpl.bestFor}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tpl.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors duration-150 cursor-pointer whitespace-nowrap"
                  >
                    <span>Use {tpl.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
