import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { WorkspaceView } from '../../types/resume';

interface NavbarProps {
  onNavigateView: (view: WorkspaceView) => void;
  onCreateResume: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateView,
  onCreateResume,
  onNavigateHome,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; view: WorkspaceView }[] = [
    { label: 'Dashboard', view: 'dashboard' },
    { label: 'Resume Builder', view: 'builder' },
    { label: 'ATS Analyzer', view: 'analyzer' },
    { label: 'Templates', view: 'templates' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/88 backdrop-blur-lg border-b border-indigo-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md"
        >
          <span
            className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs"
            aria-hidden="true"
          >
            R
          </span>
          <span>Resumely</span>
        </a>

        {/* Zone 2: 4 functional workspace view links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => onNavigateView(item.view)}
              className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-indigo-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onCreateResume}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-sm shadow-indigo-600/20 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
          >
            Create Resume
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-sm">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onNavigateView(item.view);
                }}
                className="text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onCreateResume();
              }}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
            >
              Create Resume
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
