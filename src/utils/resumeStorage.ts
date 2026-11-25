import { ActivityItem, ResumeData } from '../types/resume';
import { SAMPLE_RESUME } from '../data/sampleResume';

const LEGACY_ACTIVE_KEY = 'cleardraft_active_resume_v1';
const RESUMES_LIST_KEY = 'cleardraft_resumes_v1';
const ACTIVE_ID_KEY = 'cleardraft_active_id_v1';
const ACTIVITY_KEY = 'cleardraft_activity_v1';

export function loadInitialWorkspaceData(): {
  resumes: ResumeData[];
  activeResumeId: string;
  activities: ActivityItem[];
} {
  let resumes: ResumeData[] = [];

  try {
    const rawList = localStorage.getItem(RESUMES_LIST_KEY);
    if (rawList) {
      const parsed = JSON.parse(rawList) as ResumeData[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        resumes = parsed.filter((r) => r && r.id && r.personal && Array.isArray(r.experience));
      }
    }

    if (resumes.length === 0) {
      const legacyRaw = localStorage.getItem(LEGACY_ACTIVE_KEY);
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw) as ResumeData;
        if (legacyParsed && legacyParsed.personal && Array.isArray(legacyParsed.experience)) {
          resumes = [
            {
              ...legacyParsed,
              id: legacyParsed.id || `resume-${Date.now()}`,
            },
          ];
        }
      }
    }
  } catch {
    // Ignore storage read errors
  }

  if (resumes.length === 0) {
    resumes = [SAMPLE_RESUME];
  }

  let activeResumeId = resumes[0].id;
  try {
    const savedActiveId = localStorage.getItem(ACTIVE_ID_KEY);
    if (savedActiveId && resumes.some((r) => r.id === savedActiveId)) {
      activeResumeId = savedActiveId;
    }
  } catch {
    // Ignore storage read errors
  }

  let activities: ActivityItem[] = [];
  try {
    const rawActivities = localStorage.getItem(ACTIVITY_KEY);
    if (rawActivities) {
      const parsedAct = JSON.parse(rawActivities) as ActivityItem[];
      if (Array.isArray(parsedAct)) {
        activities = parsedAct;
      }
    }
  } catch {
    // Ignore storage read errors
  }

  if (activities.length === 0) {
    activities = [
      {
        id: 'act-init',
        action: 'Workspace ready',
        detail: `${resumes[0].title || 'Sample resume'} loaded locally`,
        timestamp: resumes[0].updatedAt || new Date().toISOString(),
        type: 'create',
      },
    ];
  }

  return { resumes, activeResumeId, activities };
}

export function saveWorkspaceResumes(resumes: ResumeData[], activeResumeId: string): void {
  try {
    localStorage.setItem(RESUMES_LIST_KEY, JSON.stringify(resumes));
    localStorage.setItem(ACTIVE_ID_KEY, activeResumeId);
    const active = resumes.find((r) => r.id === activeResumeId) ?? resumes[0];
    if (active) {
      localStorage.setItem(LEGACY_ACTIVE_KEY, JSON.stringify(active));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function saveWorkspaceActivities(activities: ActivityItem[]): void {
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities.slice(0, 20)));
  } catch {
    // Ignore storage quota errors
  }
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Recently';
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
