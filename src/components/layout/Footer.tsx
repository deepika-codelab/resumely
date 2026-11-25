import React from 'react';
import { WorkspaceView } from '../../types/resume';

interface FooterProps {
  onNavigateView: (view: WorkspaceView) => void;
  onCreateResume: () => void;
  onUploadResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateView,
  onCreateResume,
  onUploadResume,
}) => {
  return (
    <footer className="border-t border-indigo-100/90 bg-[#FAF9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-indigo-100/80">
          <div>
            <div className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900">
              <span
                className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold"
                aria-hidden="true"
              >
                R
              </span>
              <span>Resumely</span>
            </div>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              ATS-friendly resume authoring with single-column typography, real-time keyword checks, and browser-local privacy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => onNavigateView('dashboard')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigateView('builder')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Resume Builder
            </button>
            <button
              type="button"
              onClick={() => onNavigateView('templates')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Templates
            </button>
            <button
              type="button"
              onClick={() => onNavigateView('analyzer')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              ATS Analyzer
            </button>
            <button
              type="button"
              onClick={onCreateResume}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors cursor-pointer"
            >
              Create Resume
            </button>
            <button
              type="button"
              onClick={onUploadResume}
              className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors cursor-pointer"
            >
              Upload Resume
            </button>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Resumely. All rights reserved.</p>
          <p>Drafts are stored locally in your browser. Export PDF or JSON anytime.</p>
        </div>
      </div>
    </footer>
  );
};
