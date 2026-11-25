import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  ActivityItem,
  AppView,
  ResumeData,
  TemplateId,
  WorkspaceView,
} from './types/resume';
import { createBlankResume } from './data/sampleResume';
import {
  loadInitialWorkspaceData,
  saveWorkspaceActivities,
  saveWorkspaceResumes,
} from './utils/resumeStorage';
import { exportResumeToPdf } from './utils/pdfExporter';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WorkspaceLayout } from './components/layout/WorkspaceLayout';
import { HeroSection } from './components/landing/HeroSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { WorkflowSection } from './components/landing/WorkflowSection';
import { DashboardView } from './components/workspace/DashboardView';
import { AtsAnalyzerView } from './components/workspace/AtsAnalyzerView';
import { TemplatesView } from './components/workspace/TemplatesView';
import { UploadResumeModal } from './components/upload/UploadResumeModal';
import { ResumeBuilder } from './components/builder/ResumeBuilder';

const VALID_VIEWS = new Set<AppView>([
  'landing',
  'dashboard',
  'builder',
  'analyzer',
  'templates',
]);

function readInitialViewFromHash(): AppView {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (VALID_VIEWS.has(hash as AppView)) {
    return hash as AppView;
  }
  return 'landing';
}

export default function App() {
  const [initial] = useState(() => loadInitialWorkspaceData());
  const [view, setView] = useState<AppView>(() => readInitialViewFromHash());
  const [resumes, setResumes] = useState<ResumeData[]>(initial.resumes);
  const [activeResumeId, setActiveResumeId] = useState<string>(initial.activeResumeId);
  const [activities, setActivities] = useState<ActivityItem[]>(initial.activities);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const activeResume =
    resumes.find((r) => r.id === activeResumeId) ?? resumes[0];

  useEffect(() => {
    saveWorkspaceResumes(resumes, activeResumeId);
  }, [resumes, activeResumeId]);

  useEffect(() => {
    saveWorkspaceActivities(activities);
  }, [activities]);

  useEffect(() => {
    const onHashChange = () => {
      setView(readInitialViewFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const navigateTo = (target: AppView) => {
    setView(target);
    const nextHash = target === 'landing' ? '' : `#${target}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash || window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logActivity = (
    action: string,
    detail: string,
    type: ActivityItem['type']
  ) => {
    const entry: ActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action,
      detail,
      timestamp: new Date().toISOString(),
      type,
    };
    setActivities((prev) => [entry, ...prev].slice(0, 20));
  };

  const handleUpdateActiveResume = (updated: ResumeData) => {
    setResumes((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleCreateNewResume = (template: TemplateId = 'modern') => {
    const blank = {
      ...createBlankResume(),
      template,
      title: `Resume ${resumes.length + 1}`,
    };
    setResumes((prev) => [blank, ...prev]);
    setActiveResumeId(blank.id);
    logActivity('Created new resume', blank.title, 'create');
    navigateTo('builder');
    setToast('New blank resume created.');
  };

  const handleOpenBuilderWithTemplate = (template?: TemplateId) => {
    if (template) {
      const updated: ResumeData = {
        ...activeResume,
        template,
        updatedAt: new Date().toISOString(),
      };
      handleUpdateActiveResume(updated);
      logActivity(
        'Switched template',
        `${updated.title} → ${template}`,
        'template'
      );
    }
    navigateTo('builder');
  };

  const handleImportResume = (imported: ResumeData) => {
    const newId = `resume-${Date.now()}`;
    const savedCopy: ResumeData = {
      ...imported,
      id: newId,
      updatedAt: new Date().toISOString(),
    };
    setResumes((prev) => [savedCopy, ...prev]);
    setActiveResumeId(newId);
    logActivity(
      'Imported resume',
      savedCopy.title || savedCopy.personal.fullName || 'Uploaded file',
      'import'
    );
    navigateTo('builder');
    setToast('Resume imported into the builder.');
  };

  const handleDuplicateResume = (id: string) => {
    const source = resumes.find((r) => r.id === id);
    if (!source) return;
    const copy: ResumeData = {
      ...source,
      id: `resume-${Date.now()}`,
      title: `${source.title || 'Resume'} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setResumes((prev) => [copy, ...prev]);
    setActiveResumeId(copy.id);
    logActivity('Duplicated resume', copy.title, 'create');
    setToast('Resume duplicated.');
  };

  const handleDeleteResume = (id: string) => {
    if (resumes.length <= 1) return;
    const target = resumes.find((r) => r.id === id);
    const remaining = resumes.filter((r) => r.id !== id);
    setResumes(remaining);
    if (activeResumeId === id && remaining[0]) {
      setActiveResumeId(remaining[0].id);
    }
    if (target) {
      logActivity('Deleted resume', target.title || 'Untitled Resume', 'edit');
    }
    setToast('Resume removed from local library.');
  };

  const handleExportPdf = (target: ResumeData) => {
    try {
      const { filename, pageCount } = exportResumeToPdf(target);
      logActivity(
        'Exported PDF',
        `${filename} (${pageCount}p)`,
        'export'
      );
      setToast(
        `Downloaded ${filename} (${pageCount} ${pageCount === 1 ? 'page' : 'pages'}).`
      );
    } catch (err) {
      setToast(
        err instanceof Error
          ? `PDF export failed: ${err.message}`
          : 'PDF export failed. Please try again.'
      );
    }
  };

  const handleAddSkillToResume = (resumeId: string, skill: string) => {
    setResumes((prev) =>
      prev.map((item) => {
        if (item.id !== resumeId || item.skills.includes(skill)) return item;
        return {
          ...item,
          skills: [...item.skills, skill],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    logActivity('Added keyword skill', skill, 'analyze');
    setToast(`Added "${skill}" to skills.`);
  };

  const handleApplyTemplate = (template: TemplateId, openBuilder: boolean) => {
    const updated: ResumeData = {
      ...activeResume,
      template,
      updatedAt: new Date().toISOString(),
    };
    handleUpdateActiveResume(updated);
    logActivity('Applied template', `${updated.title} → ${template}`, 'template');
    setToast(`Applied ${template} template to "${updated.title}".`);
    if (openBuilder) {
      navigateTo('builder');
    }
  };

  const getHeaderTitle = (currentView: WorkspaceView): string => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'builder':
        return 'Resume Builder';
      case 'analyzer':
        return 'ATS Analyzer';
      case 'templates':
        return 'Templates';
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {view === 'landing' ? (
        <>
          <Navbar
            onNavigateView={(target) => navigateTo(target)}
            onCreateResume={() => handleOpenBuilderWithTemplate()}
            onNavigateHome={() => navigateTo('landing')}
          />

          <main>
            <HeroSection
              onCreateResume={(tpl) => handleOpenBuilderWithTemplate(tpl)}
              onUploadResume={() => setIsUploadOpen(true)}
            />

            <FeaturesSection
              onCreateResume={() => handleOpenBuilderWithTemplate()}
              onUploadResume={() => setIsUploadOpen(true)}
            />

            <WorkflowSection
              onCreateResume={() => handleOpenBuilderWithTemplate()}
              onUploadResume={() => setIsUploadOpen(true)}
            />
          </main>

          <Footer
            onNavigateView={(target) => navigateTo(target)}
            onCreateResume={() => handleOpenBuilderWithTemplate()}
            onUploadResume={() => setIsUploadOpen(true)}
          />
        </>
      ) : (
        <WorkspaceLayout
          activeView={view}
          onNavigate={(target) => navigateTo(target)}
          onBackToLanding={() => navigateTo('landing')}
          onNewResume={() => handleCreateNewResume()}
          onOpenUpload={() => setIsUploadOpen(true)}
          headerTitle={getHeaderTitle(view)}
        >
          {view === 'dashboard' && (
            <DashboardView
              resumes={resumes}
              activeResumeId={activeResume.id}
              activities={activities}
              onSelectResumeForEdit={(id) => {
                setActiveResumeId(id);
                navigateTo('builder');
              }}
              onSelectResumeForAnalyze={(id) => {
                setActiveResumeId(id);
                navigateTo('analyzer');
              }}
              onCreateNewResume={() => handleCreateNewResume()}
              onDuplicateResume={handleDuplicateResume}
              onDeleteResume={handleDeleteResume}
              onExportPdf={handleExportPdf}
              onOpenUpload={() => setIsUploadOpen(true)}
              onNavigate={(target) => navigateTo(target)}
            />
          )}

          {view === 'builder' && (
            <ResumeBuilder
              resume={activeResume}
              resumes={resumes}
              onSelectResume={(id) => setActiveResumeId(id)}
              onChange={handleUpdateActiveResume}
              onOpenUpload={() => setIsUploadOpen(true)}
              onNotify={(msg) => setToast(msg)}
              onExportedPdf={(filename) =>
                logActivity('Exported PDF', filename, 'export')
              }
            />
          )}

          {view === 'analyzer' && (
            <AtsAnalyzerView
              resumes={resumes}
              activeResumeId={activeResume.id}
              onSelectResume={(id) => setActiveResumeId(id)}
              onOpenInBuilder={(target) => {
                setActiveResumeId(target.id);
                navigateTo('builder');
              }}
              onAddSkillToResume={handleAddSkillToResume}
              onImportAnalyzedResume={handleImportResume}
            />
          )}

          {view === 'templates' && (
            <TemplatesView
              activeResume={activeResume}
              onApplyTemplate={handleApplyTemplate}
            />
          )}
        </WorkspaceLayout>
      )}

      <UploadResumeModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onImportResume={handleImportResume}
      />

      {toast && (
        <div
          role="status"
          className="no-print fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-medium shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
