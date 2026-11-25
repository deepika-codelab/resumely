import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileEdit,
  ScanSearch,
  LayoutTemplate,
  Plus,
  Upload,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { WorkspaceView } from '../../types/resume';

interface WorkspaceLayoutProps {
  activeView: WorkspaceView;
  onNavigate: (view: WorkspaceView) => void;
  onBackToLanding: () => void;
  onNewResume: () => void;
  onOpenUpload: () => void;
  headerTitle?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

const NAV_ITEMS: {
  id: WorkspaceView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'builder', label: 'Resume Builder', icon: FileEdit },
  { id: 'analyzer', label: 'ATS Analyzer', icon: ScanSearch },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
];

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  activeView,
  onNavigate,
  onBackToLanding,
  onNewResume,
  onOpenUpload,
  headerTitle,
  headerActions,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentNav = NAV_ITEMS.find((item) => item.id === activeView);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#FDFCFF] border-r border-indigo-100/90 w-64">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-indigo-100/80 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => {
              setSidebarOpen(false);
              onBackToLanding();
            }}
            aria-label="Home"
            title="Home"
            className="relative group inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50/90 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border border-indigo-200/70 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <Home className="w-4 h-4" />
            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-1 rounded-md bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity shadow-sm z-50"
            >
              Home
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSidebarOpen(false);
              onBackToLanding();
            }}
            title="Home"
            className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md"
          >
            <span
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs"
              aria-hidden="true"
            >
              R
            </span>
            <span>Resumely</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-indigo-50 cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Navigation */}
      <nav aria-label="Workspace Navigation" className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                onNavigate(item.id);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-semibold border border-indigo-200/70 shadow-2xs'
                  : 'text-slate-600 font-medium hover:text-indigo-900 hover:bg-indigo-50/50 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="pt-6 mt-6 border-t border-indigo-100/80 space-y-2.5 px-1">
          <button
            type="button"
            onClick={() => {
              setSidebarOpen(false);
              onNewResume();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-sm shadow-indigo-600/15 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Resume</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSidebarOpen(false);
              onOpenUpload();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-indigo-950 bg-white hover:bg-indigo-50/70 border border-indigo-200/80 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload Resume</span>
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F5FD] flex">
      {/* Desktop Persistent Sidebar */}
      <aside className="no-print hidden lg:block shrink-0 sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {sidebarOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-indigo-950/35 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full shadow-2xl">{SidebarContent}</aside>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Contextual Header */}
        <header className="no-print sticky top-0 z-30 h-16 bg-white/88 backdrop-blur-md border-b border-indigo-100/80 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 cursor-pointer"
              aria-label="Open workspace navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onBackToLanding}
              aria-label="Home"
              title="Home"
              className="lg:hidden relative group inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50/90 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border border-indigo-200/70 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <Home className="w-4 h-4" />
              <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-1 rounded-md bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity shadow-sm z-50"
              >
                Home
              </span>
            </button>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="hidden sm:inline text-slate-500 hover:text-indigo-600 font-medium cursor-pointer whitespace-nowrap transition-colors"
              >
                Workspace
              </button>
              <span className="hidden sm:inline text-indigo-200" aria-hidden="true">
                /
              </span>
              <span className="font-semibold text-slate-900 truncate">
                {headerTitle ?? currentNav?.label ?? 'Dashboard'}
              </span>
            </div>
          </div>

          {headerActions ? (
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">{headerActions}</div>
          ) : null}
        </header>

        {/* Active View Viewport */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
