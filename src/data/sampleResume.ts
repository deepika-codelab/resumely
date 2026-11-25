import { ResumeData } from '../types/resume';

export const SAMPLE_RESUME: ResumeData = {
  id: 'sample-resume-1',
  title: 'Senior Product Engineer — Resume',
  template: 'modern',
  personal: {
    fullName: 'Elena Rostova',
    jobTitle: 'Senior Software Engineer',
    email: 'elena.rostova@example.com',
    phone: '(415) 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/elenarostova',
    website: 'elenarostova.dev',
  },
  summary:
    'Senior Software Engineer with 7+ years of experience architecting high-throughput TypeScript and React web applications, distributed APIs, and accessible design systems. Proven track record reducing page load latency by 42% and mentoring cross-functional product engineering squads.',
  experience: [
    {
      id: 'exp-1',
      company: 'Northstar Cloud Systems',
      role: 'Senior Frontend Engineer',
      location: 'San Francisco, CA',
      startDate: 'Mar 2023',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected a modular React 19 and TypeScript analytics workbench serving 180,000+ monthly active enterprise users.',
        'Reduced core bundle size by 38% and improved Largest Contentful Paint from 2.9s to 1.4s through route-level code splitting.',
        'Established automated WCAG 2.1 AA accessibility checks in CI, eliminating 94% of keyboard navigation regressions prior to release.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Meridian Financial Tech',
      role: 'Software Engineer II',
      location: 'Seattle, WA',
      startDate: 'Jun 2020',
      endDate: 'Feb 2023',
      current: false,
      bullets: [
        'Built real-time reconciliation dashboards processing $42M in daily transaction volume with zero client-side data loss.',
        'Migrated legacy REST endpoints to typed GraphQL and Node.js services, cutting integration defects by 31%.',
        'Partnered with product design to launch an internal Tailwind CSS component library adopted across 6 engineering teams.',
      ],
    },
    {
      id: 'exp-3',
      company: 'Harborline Digital',
      role: 'Frontend Developer',
      location: 'Portland, OR',
      startDate: 'Aug 2018',
      endDate: 'May 2020',
      current: false,
      bullets: [
        'Delivered responsive customer onboarding flows that increased self-serve trial conversion by 22% over two quarters.',
        'Implemented automated end-to-end Playwright test coverage for 14 critical checkout and billing workflows.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Washington',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: 'May 2018',
      gpa: '3.8 / 4.0',
    },
  ],
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Tailwind CSS',
    'GraphQL',
    'PostgreSQL',
    'Playwright',
    'CI/CD',
    'Web Accessibility (WCAG)',
    'System Design',
    'Performance Optimization',
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OpenTableGrid',
      roleOrTech: 'TypeScript · React · Virtualization',
      link: 'github.com/erostova/opentablegrid',
      description:
        'Open-source virtualized data grid rendering 100k+ rows at 60fps with full keyboard navigation and zero external runtime dependencies.',
    },
  ],
  certifications: [
    'AWS Certified Developer – Associate (2024)',
    'IAAP Certified Professional in Accessibility Core Competencies (CPACC)',
  ],
  updatedAt: new Date().toISOString(),
};

export function createBlankResume(): ResumeData {
  return {
    id: `resume-${Date.now()}`,
    title: 'Untitled Resume',
    template: 'classic',
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    summary: '',
    experience: [
      {
        id: `exp-${Date.now()}`,
        company: '',
        role: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        bullets: [''],
      },
    ],
    education: [
      {
        id: `edu-${Date.now()}`,
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: '',
      },
    ],
    skills: [],
    projects: [],
    certifications: [],
    updatedAt: new Date().toISOString(),
  };
}

export const SAMPLE_JOB_DESCRIPTION = `We are seeking a Senior Software Engineer to lead frontend architecture for our enterprise analytics platform.
Requirements:
- 5+ years of experience with TypeScript, React, and modern CSS frameworks such as Tailwind CSS
- Proven experience optimizing web performance, bundle size, and Core Web Vitals
- Strong background in Node.js, GraphQL, or REST API integration
- Deep familiarity with WCAG accessibility standards and automated testing (Playwright, Jest, CI/CD)
- Track record mentoring engineers and partnering closely with product design`;
