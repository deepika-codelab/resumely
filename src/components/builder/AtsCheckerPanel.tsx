import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { analyzeResumeATS } from '../../utils/atsAnalyzer';
import { SAMPLE_JOB_DESCRIPTION } from '../../data/sampleResume';

interface AtsCheckerPanelProps {
  resume: ResumeData;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  onAddSkill: (skill: string) => void;
}

export const AtsCheckerPanel: React.FC<AtsCheckerPanelProps> = ({
  resume,
  jobDescription,
  onJobDescriptionChange,
  onAddSkill,
}) => {
  const analysis = analyzeResumeATS(resume, jobDescription);

  const passedCount = analysis.checks.filter((c) => c.status === 'pass').length;

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              ATS Readiness Audit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {passedCount} of {analysis.checks.length} structural benchmarks passed ·{' '}
              <span className="tabular-nums">{analysis.wordCount}</span> words
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold tracking-tight text-indigo-600 font-mono tabular-nums">
              {analysis.overallScore}%
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              Composite Match
            </div>
          </div>
        </div>

        {/* Clean Progress Bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(4, analysis.overallScore))}%` }}
          />
        </div>
      </div>

      {/* Job Description Keyword Matcher */}
      <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Target Job Description
            </h4>
            <p className="text-xs text-slate-500">
              Paste a job posting to scan keyword alignment.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJobDescriptionChange(SAMPLE_JOB_DESCRIPTION)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer whitespace-nowrap"
          >
            Load Sample JD
          </button>
        </div>

        <textarea
          rows={5}
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description requirements here..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />

        {analysis.keywordMatchRate !== null && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Keyword Coverage</span>
              <span className="font-mono font-semibold text-indigo-600 tabular-nums">
                {analysis.matchedKeywords.length} /{' '}
                {analysis.matchedKeywords.length + analysis.missingKeywords.length} terms (
                {analysis.keywordMatchRate}%)
              </span>
            </div>

            {analysis.matchedKeywords.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-emerald-700 mb-1">
                  Matched in Resume
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.matchedKeywords.join(' · ')}
                </p>
              </div>
            )}

            {analysis.missingKeywords.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-amber-700 mb-1.5">
                  Missing Terms (click to add to Skills)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingKeywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => onAddSkill(kw)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      + {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diagnostic Rule Checklist */}
      <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-slate-900">Structure & Impact Checks</h4>
        <div className="divide-y divide-slate-100">
          {analysis.checks.map((check) => (
            <div key={check.id} className="py-3 first:pt-1 last:pb-1 flex items-start gap-3">
              {check.status === 'pass' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : check.status === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-xs font-semibold text-slate-900">{check.label}</div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{check.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
