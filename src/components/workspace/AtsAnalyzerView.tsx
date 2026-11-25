import React, { useRef, useState } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileEdit,
  FileText,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { analyzeResumeATS } from '../../utils/atsAnalyzer';
import { parseResumeFromText, parseUploadedResumeFile } from '../../utils/resumeParser';
import { SAMPLE_JOB_DESCRIPTION } from '../../data/sampleResume';

interface AtsAnalyzerViewProps {
  resumes: ResumeData[];
  activeResumeId: string;
  onSelectResume: (id: string) => void;
  onOpenInBuilder: (resume: ResumeData) => void;
  onAddSkillToResume: (resumeId: string, skill: string) => void;
  onImportAnalyzedResume: (resume: ResumeData) => void;
}

export const AtsAnalyzerView: React.FC<AtsAnalyzerViewProps> = ({
  resumes,
  activeResumeId,
  onSelectResume,
  onOpenInBuilder,
  onAddSkillToResume,
  onImportAnalyzedResume,
}) => {
  const [sourceMode, setSourceMode] = useState<'saved' | 'upload'>('saved');
  const [uploadedResume, setUploadedResume] = useState<ResumeData | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTION);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSavedResume =
    resumes.find((r) => r.id === activeResumeId) ?? resumes[0];
  const targetResume =
    sourceMode === 'upload' && uploadedResume ? uploadedResume : selectedSavedResume;

  const analysis = analyzeResumeATS(targetResume, jobDescription);
  const strengths = analysis.checks.filter((c) => c.status === 'pass');
  const suggestions = analysis.checks.filter((c) => c.status !== 'pass');

  const ringRadius = 40;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset =
    ringCircumference - (Math.min(100, Math.max(0, analysis.overallScore)) / 100) * ringCircumference;

  const handleFile = async (file: File) => {
    setUploadError(null);
    setIsParsing(true);
    try {
      const result = await parseUploadedResumeFile(file);
      setUploadedResume(result.resume);
      setUploadedFileName(file.name);
      setSourceMode('upload');
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? err.message
          : 'Unable to parse file. Try pasting your resume text instead.'
      );
    } finally {
      setIsParsing(false);
    }
  };

  const handleParsePasted = () => {
    setUploadError(null);
    if (pastedText.trim().length < 20) {
      setUploadError('Paste at least a few lines of your resume to run analysis.');
      return;
    }
    const parsed = parseResumeFromText(pastedText, 'Uploaded Text Resume');
    setUploadedResume(parsed);
    setUploadedFileName('Pasted Resume Text');
    setSourceMode('upload');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            ATS Resume Analyzer
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload a PDF or select a saved resume to inspect ATS score breakdown, strengths, and keyword suggestions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (sourceMode === 'upload' && uploadedResume) {
              onImportAnalyzedResume(uploadedResume);
            } else {
              onOpenInBuilder(targetResume);
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-sm shadow-indigo-600/15 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <FileEdit className="w-4 h-4" />
          <span>
            {sourceMode === 'upload' && uploadedResume
              ? 'Save & Edit in Builder'
              : 'Edit Active Resume'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Source Upload / Selection + Job Description */}
        <div className="lg:col-span-5 space-y-6">
          {/* Resume Source Card */}
          <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900">Resume Source</h2>
              <div className="inline-flex items-center gap-1 p-1 bg-[#F3F1FC] border border-indigo-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSourceMode('saved')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    sourceMode === 'saved'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-indigo-700'
                  }`}
                >
                  Saved Draft
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('upload')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    sourceMode === 'upload'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-indigo-700'
                  }`}
                >
                  Upload PDF / File
                </button>
              </div>
            </div>

            {sourceMode === 'saved' ? (
              <div className="space-y-2">
                <label
                  htmlFor="analyzer-resume-select"
                  className="block text-xs font-medium text-slate-600"
                >
                  Choose a saved resume to inspect
                </label>
                <select
                  id="analyzer-resume-select"
                  value={selectedSavedResume.id}
                  onChange={(e) => onSelectResume(e.target.value)}
                  className="w-full rounded-xl border border-indigo-100 bg-[#FAF9FF] px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title || 'Untitled Resume'} ({r.personal.fullName || 'No Name'})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) void handleFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/70'
                      : 'border-indigo-200 hover:border-indigo-400 bg-[#FAF9FF]/70 hover:bg-indigo-50/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.md,.json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleFile(file);
                    }}
                  />
                  <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/70 flex items-center justify-center text-indigo-600 mb-2.5">
                    <Upload className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {isParsing
                      ? 'Parsing resume file...'
                      : 'Drop PDF, TXT, MD, or JSON file here to analyze'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Or click to select from your computer
                  </p>
                </div>

                {uploadedResume && uploadedFileName && (
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-indigo-50/80 border border-indigo-200 px-3.5 py-2.5 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-semibold text-slate-900 truncate">
                        {uploadedFileName}
                      </span>
                    </div>
                    <span className="text-indigo-700 font-medium shrink-0 tabular-nums">
                      {uploadedResume.skills.length} skills ·{' '}
                      {uploadedResume.experience.filter((e) => e.role || e.company).length} roles
                    </span>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-indigo-50">
                  <label className="block text-xs font-medium text-slate-600">
                    Or paste resume text
                  </label>
                  <textarea
                    rows={4}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste plain resume text to analyze..."
                    className="w-full rounded-xl border border-indigo-100 bg-[#FAF9FF] px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleParsePasted}
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Analyze Pasted Text
                  </button>
                </div>

                {uploadError && (
                  <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Target Job Description */}
          <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Target Job Description
                </h2>
                <p className="text-xs text-slate-500">
                  Compare your resume against specific role requirements.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-purple-700 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sample</span>
                </button>
                {jobDescription && (
                  <button
                    type="button"
                    onClick={() => setJobDescription('')}
                    className="text-xs font-medium text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={7}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste a target job description here to measure keyword alignment..."
              className="w-full rounded-xl border border-indigo-100 bg-[#FAF9FF] px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Right Column: Score, Breakdown, Strengths, Suggestions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Score Overview Card with Circular Gauge */}
          <div className="rounded-2xl bg-gradient-to-br from-white via-white to-[#F5F3FF] border border-indigo-100/90 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-indigo-600">
                  Analyzing · {targetResume.personal.fullName || targetResume.title || 'Resume'}
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Overall ATS Compatibility Score
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {strengths.length} of {analysis.checks.length} structural benchmarks passed ·{' '}
                  <span className="tabular-nums font-medium">{analysis.wordCount}</span> words
                  {analysis.keywordMatchRate !== null && (
                    <>
                      {' · '}
                      <span className="tabular-nums font-semibold text-indigo-700">
                        {analysis.keywordMatchRate}% JD keyword match
                      </span>
                    </>
                  )}
                </p>
              </div>

              {/* Circular SVG Progress Gauge */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <linearGradient id="atsScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r={ringRadius}
                    fill="none"
                    stroke="#ede9fe"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={ringRadius}
                    fill="none"
                    stroke="url(#atsScoreGradient)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringDashOffset}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    {analysis.overallScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Category Mini Breakdown */}
            <div className="mt-6 pt-5 border-t border-indigo-100/80 grid grid-cols-3 gap-4">
              {(['structure', 'content', 'impact'] as const).map((cat) => {
                const catChecks = analysis.checks.filter((c) => c.category === cat);
                const catPassed = catChecks.filter((c) => c.status === 'pass').length;
                const pct = Math.round((catPassed / Math.max(1, catChecks.length)) * 100);
                return (
                  <div
                    key={cat}
                    className="rounded-xl bg-[#FAF9FF] border border-indigo-100/70 p-3.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 capitalize">{cat}</span>
                      <span className="font-mono font-bold text-indigo-700 tabular-nums">
                        {catPassed}/{catChecks.length}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-indigo-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${Math.max(8, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Suggestions Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Strengths</h3>
                <span className="text-xs font-mono font-semibold text-emerald-700 tabular-nums">
                  {strengths.length} passed
                </span>
              </div>

              {strengths.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Add contact info, work bullets, and skills to unlock passing checks.
                </p>
              ) : (
                <ul className="space-y-3">
                  {strengths.map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          {item.label}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {analysis.matchedKeywords.length > 0 && (
                <div className="pt-3 border-t border-indigo-50">
                  <div className="text-xs font-semibold text-slate-700 mb-1">
                    Matched Job Keywords ({analysis.matchedKeywords.length})
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysis.matchedKeywords.join(' · ')}
                  </p>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Suggestions</h3>
                <span className="text-xs font-mono font-semibold text-amber-700 tabular-nums">
                  {suggestions.length} to improve
                </span>
              </div>

              {suggestions.length === 0 && analysis.missingKeywords.length === 0 ? (
                <div className="flex items-start gap-2.5 text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Every structural rule and target keyword benchmark is satisfied.
                  </span>
                </div>
              ) : (
                <ul className="space-y-3">
                  {suggestions.map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5">
                      {item.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          {item.label}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {analysis.missingKeywords.length > 0 && (
                <div className="pt-3 border-t border-indigo-50 space-y-2">
                  <div className="text-xs font-semibold text-slate-700">
                    Missing Keywords{' '}
                    {sourceMode === 'saved' ? '(click to add to Skills)' : ''}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map((kw) =>
                      sourceMode === 'saved' ? (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => onAddSkillToResume(selectedSavedResume.id, kw)}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-800 bg-indigo-50/70 hover:bg-indigo-600 hover:text-white border border-indigo-200/80 rounded-lg transition-colors cursor-pointer"
                        >
                          + {kw}
                        </button>
                      ) : (
                        <span
                          key={kw}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-[#FAF9FF] border border-indigo-100 rounded-lg"
                        >
                          {kw}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
