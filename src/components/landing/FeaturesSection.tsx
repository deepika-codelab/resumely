import React, { useState } from 'react';
import {
  FileCheck2,
  UploadCloud,
  Target,
  FileDown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME } from '../../data/sampleResume';
import { analyzeResumeATS } from '../../utils/atsAnalyzer';

interface FeaturesSectionProps {
  onCreateResume: () => void;
  onUploadResume: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onCreateResume,
  onUploadResume,
}) => {
  const [jdInput, setJdInput] = useState(SAMPLE_JOB_DESCRIPTION);
  const analysis = analyzeResumeATS(SAMPLE_RESUME, jdInput);

  return (
    <section id="features" className="py-14 sm:py-16 bg-[#F6F5FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mb-9 sm:mb-10">
          <p className="text-sm font-semibold text-indigo-600 mb-2">
            Built for Applicant Tracking Systems
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
            Every section engineered for clean parsing and recruiter clarity.
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Graphic-heavy resumes often scramble dates, skills, and titles inside hiring pipelines. Resumely enforces clean document semantics without sacrificing modern design.
          </p>
        </div>

        {/* Asymmetric Bento Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wide Feature Card 1 */}
          <div className="md:col-span-2 rounded-2xl bg-white border border-indigo-100/90 p-7 sm:p-8 shadow-sm shadow-indigo-950/5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/70 flex items-center justify-center text-indigo-600 mb-5">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                01. Single-Column ATS Architecture
              </h3>
              <p className="mt-2.5 text-slate-600 leading-relaxed max-w-2xl">
                Automated parsers read documents top-to-bottom, left-to-right. Every Resumely template eliminates multi-column tables, floating sidebars, and text boxes so Workday, Greenhouse, and Lever index your experience accurately.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-indigo-50 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <span>Standard Section Headings · Clean UTF-8 Hierarchy · Zero Embedded Images</span>
              <button
                type="button"
                onClick={onCreateResume}
                className="font-semibold text-indigo-600 hover:text-purple-700 cursor-pointer whitespace-nowrap transition-colors"
              >
                Open Editor →
              </button>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="rounded-2xl bg-white border border-indigo-100/90 p-7 sm:p-8 shadow-sm shadow-indigo-950/5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/70 flex items-center justify-center text-purple-600 mb-5">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                02. Smart Resume Upload
              </h3>
              <p className="mt-2.5 text-slate-600 leading-relaxed">
                Drop an existing PDF, TXT, Markdown, or JSON resume—or paste raw text—to automatically extract contact details, roles, dates, and skills into structured fields.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-indigo-50">
              <button
                type="button"
                onClick={onUploadResume}
                className="text-xs font-semibold text-purple-700 hover:text-indigo-700 cursor-pointer whitespace-nowrap transition-colors"
              >
                Upload Existing File →
              </button>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="rounded-2xl bg-white border border-indigo-100/90 p-7 sm:p-8 shadow-sm shadow-indigo-950/5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/70 flex items-center justify-center text-indigo-600 mb-5">
                <FileDown className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                03. Vector PDF & JSON Export
              </h3>
              <p className="mt-2.5 text-slate-600 leading-relaxed">
                Download crisp Letter-size PDFs with real selectable text, or export portable JSON backups to maintain multiple tailored versions across applications.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-indigo-50 text-xs text-slate-500">
              Clean Letter-size PDF output with zero editor chrome
            </div>
          </div>

          {/* Wide Interactive Feature Card 4: Live ATS Check Demo */}
          <div
            id="ats-check"
            className="md:col-span-2 rounded-2xl bg-white border border-indigo-100/90 p-7 sm:p-8 shadow-sm shadow-indigo-950/5 hover:shadow-md hover:border-indigo-200 transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row gap-7 items-stretch">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/70 flex items-center justify-center text-purple-600 mb-5">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    04. Real-Time Job Description Diagnostics
                  </h3>
                  <p className="mt-2.5 text-slate-600 leading-relaxed text-sm">
                    Paste any job posting to audit keyword coverage, quantified impact metrics, and action-verb strength before you submit.
                  </p>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="landing-jd-preview"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Try pasting a job description
                  </label>
                  <textarea
                    id="landing-jd-preview"
                    rows={4}
                    value={jdInput}
                    onChange={(e) => setJdInput(e.target.value)}
                    placeholder="Paste job requirements to test live keyword alignment..."
                    className="w-full rounded-xl border border-indigo-100 bg-[#FAF9FF] px-3.5 py-2.5 text-xs text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Right Side: Live Deterministic Results */}
              <div className="lg:w-[300px] shrink-0 rounded-xl bg-gradient-to-b from-[#F5F3FF] to-[#FAF9FF] border border-indigo-100 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between pb-3 border-b border-indigo-100">
                    <span className="text-xs font-semibold text-slate-700">
                      Sample Resume Match
                    </span>
                    <span className="text-2xl font-bold text-indigo-600 tabular-nums font-mono">
                      {analysis.keywordMatchRate ?? analysis.overallScore}%
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="text-xs font-semibold text-slate-700">
                      Matched Terms ({analysis.matchedKeywords.length})
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {analysis.matchedKeywords.slice(0, 8).join(' · ') ||
                        'Paste a job description to scan terms.'}
                    </p>

                    {analysis.missingKeywords.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Missing ({analysis.missingKeywords.length})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {analysis.missingKeywords.slice(0, 5).join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-indigo-100 flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {analysis.checks.filter((c) => c.status === 'pass').length} of{' '}
                    {analysis.checks.length} structure rules passed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
