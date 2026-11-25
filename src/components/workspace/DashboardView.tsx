import React from 'react';
import {
  Plus,
  Upload,
  ScanSearch,
  LayoutTemplate,
  FileEdit,
  FileDown,
  Copy,
  Trash2,
  Clock,
  FileText,
  Target,
  AlignLeft,
  Layers,
} from 'lucide-react';
import { ActivityItem, ResumeData, WorkspaceView } from '../../types/resume';
import { analyzeResumeATS } from '../../utils/atsAnalyzer';
import { formatRelativeTime } from '../../utils/resumeStorage';

interface DashboardViewProps {
  resumes: ResumeData[];
  activeResumeId: string;
  activities: ActivityItem[];
  onSelectResumeForEdit: (id: string) => void;
  onSelectResumeForAnalyze: (id: string) => void;
  onCreateNewResume: () => void;
  onDuplicateResume: (id: string) => void;
  onDeleteResume: (id: string) => void;
  onExportPdf: (resume: ResumeData) => void;
  onOpenUpload: () => void;
  onNavigate: (view: WorkspaceView) => void;
}

const TEMPLATE_LABELS: Record<string, string> = {
  classic: 'Classic ATS',
  modern: 'Modern Indigo',
  executive: 'Executive Minimal',
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  resumes,
  activeResumeId,
  activities,
  onSelectResumeForEdit,
  onSelectResumeForAnalyze,
  onCreateNewResume,
  onDuplicateResume,
  onDeleteResume,
  onExportPdf,
  onOpenUpload,
  onNavigate,
}) => {
  const activeResume = resumes.find((r) => r.id === activeResumeId) ?? resumes[0];
  const activeAnalysis = analyzeResumeATS(activeResume);
  const passedChecks = activeAnalysis.checks.filter((c) => c.status === 'pass').length;

  const overviewStats = [
    {
      label: 'Saved Resumes',
      value: String(resumes.length),
      detail: 'Stored locally in browser',
      icon: FileText,
    },
    {
      label: 'Active ATS Score',
      value: `${activeAnalysis.overallScore}%`,
      detail: `${passedChecks}/${activeAnalysis.checks.length} rules passed`,
      icon: Target,
    },
    {
      label: 'Active Word Count',
      value: String(activeAnalysis.wordCount),
      detail: 'Target: 300–750 words',
      icon: AlignLeft,
    },
    {
      label: 'Active Template',
      value: TEMPLATE_LABELS[activeResume.template] ?? 'Modern Indigo',
      detail: 'Single-column ATS-safe',
      icon: Layers,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
      {/* Premium Indigo/Purple Workspace Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-7 text-white shadow-lg shadow-indigo-950/10">
        <div
          className="pointer-events-none absolute -right-16 -top-20 w-64 h-64 rounded-full bg-purple-400/25 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-xs font-medium text-indigo-100">
              Active Draft · {activeResume.title || 'Untitled Resume'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Resume Dashboard
            </h1>
            <p className="text-sm text-indigo-100/95 leading-relaxed">
              Manage your saved resumes, compare ATS diagnostics, or switch layouts before exporting crisp vector PDFs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onCreateNewResume}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Resume</span>
            </button>

            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-white/12 hover:bg-white/20 border border-white/25 rounded-xl backdrop-blur-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Resume</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('analyzer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-white/12 hover:bg-white/20 border border-white/25 rounded-xl backdrop-blur-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <ScanSearch className="w-4 h-4" />
              <span>ATS Analyzer</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-white/12 hover:bg-white/20 border border-white/25 rounded-xl backdrop-blur-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>Templates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500">
                  {stat.label}
                </span>
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 tabular-nums font-display truncate">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-slate-500">{stat.detail}</div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Saved Resumes + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Saved Resumes List */}
        <section aria-label="Saved Resumes" className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Saved Resumes</h2>
            <span className="text-xs font-medium text-indigo-600 tabular-nums">
              {resumes.length} {resumes.length === 1 ? 'document' : 'documents'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resumes.map((item) => {
              const isCurrent = item.id === activeResume.id;
              const score = analyzeResumeATS(item).overallScore;
              return (
                <article
                  key={item.id}
                  className={`rounded-2xl bg-white border p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between ${
                    isCurrent
                      ? 'border-indigo-300 ring-2 ring-indigo-500/15'
                      : 'border-indigo-100/90 hover:border-indigo-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span>{TEMPLATE_LABELS[item.template] ?? 'Classic ATS'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">
                            {formatRelativeTime(item.updatedAt)}
                          </span>
                          {isCurrent && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-indigo-600">Active</span>
                            </>
                          )}
                        </div>
                        <h3 className="mt-1 text-base font-bold text-slate-900 truncate">
                          {item.title || 'Untitled Resume'}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold font-mono tabular-nums text-indigo-600">
                          {score}%
                        </div>
                        <div className="text-[11px] text-slate-400">ATS</div>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 truncate">
                      {item.personal.fullName || 'No name added'}
                      {item.personal.jobTitle ? ` — ${item.personal.jobTitle}` : ''}
                    </p>

                    {/* Subtle ATS Progress Bar */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-indigo-50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${Math.min(100, Math.max(6, score))}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-indigo-50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectResumeForEdit(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-2xs transition-all cursor-pointer"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectResumeForAnalyze(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100/80 rounded-lg transition-colors cursor-pointer"
                      >
                        <ScanSearch className="w-3.5 h-3.5 text-purple-600" />
                        <span>ATS</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onExportPdf(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100/80 rounded-lg transition-colors cursor-pointer"
                        title="Export PDF"
                      >
                        <FileDown className="w-3.5 h-3.5 text-indigo-600" />
                        <span>PDF</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onDuplicateResume(item.id)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Duplicate resume"
                        aria-label={`Duplicate ${item.title}`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {resumes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteResume(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete resume"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Create Blank Card */}
            <button
              type="button"
              onClick={onCreateNewResume}
              className="rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white/70 hover:bg-white p-6 flex flex-col items-center justify-center text-center min-h-[188px] transition-all cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/70 flex items-center justify-center text-indigo-600 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all mb-3">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                Create Blank Resume
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Start fresh in a single-column template
              </span>
            </button>
          </div>
        </section>

        {/* Recent Activity Column */}
        <aside aria-label="Recent Activity" className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <div className="rounded-2xl bg-white border border-indigo-100/90 p-5 shadow-xs">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Actions like editing, importing, and exporting PDFs will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-indigo-50">
                {activities.slice(0, 8).map((act) => (
                  <li key={act.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {act.action}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-indigo-500 tabular-nums shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{act.detail}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
