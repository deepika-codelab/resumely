import React from 'react';
import { ArrowRight, FileText, Upload } from 'lucide-react';

interface WorkflowSectionProps {
  onCreateResume: () => void;
  onUploadResume: () => void;
}

const STEPS = [
  {
    number: '01.',
    title: 'Start from Scratch or Upload',
    description:
      'Open a clean blank template, load our sample engineering resume, or upload an existing PDF, TXT, Markdown, or JSON file to pre-fill your sections in seconds.',
  },
  {
    number: '02.',
    title: 'Refine Bullets & Audit Keywords',
    description:
      'Edit your work history beside a live Letter-size preview. Paste your target job description into the ATS Checker to spot missing skills and strengthen measurable outcomes.',
  },
  {
    number: '03.',
    title: 'Export Vector PDF or Save JSON',
    description:
      'Download a clean, selectable-text PDF with one click or export a portable JSON copy so your data stays yours across every application.',
  },
];

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({
  onCreateResume,
  onUploadResume,
}) => {
  return (
    <section
      id="workflow"
      className="py-14 sm:py-16 bg-gradient-to-b from-white to-[#FAF9FF] border-t border-indigo-100/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <p className="text-sm font-semibold text-purple-600 mb-2">
            Three-Step Workflow
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
            From rough draft to application-ready in minutes.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl bg-gradient-to-b from-[#FAF9FF] to-white border border-indigo-100/90 p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200"
            >
              <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 font-mono tabular-nums mb-3">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Final Conversion Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-7 sm:p-10 shadow-xl shadow-indigo-950/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div
            className="pointer-events-none absolute -right-20 -top-24 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              Ready to build your next ATS-friendly resume?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-indigo-100 leading-relaxed">
              Start fresh in the editor or import your existing resume file to modernize its structure immediately.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCreateResume}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-indigo-700 bg-white hover:bg-indigo-50 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              <span>Create Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onUploadResume}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl backdrop-blur-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Resume</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
