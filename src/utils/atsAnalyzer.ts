import { ATSAnalysisResult, ATSCheckItem, ResumeData } from '../types/resume';

const STRONG_ACTION_VERBS = new Set([
  'architected',
  'automated',
  'built',
  'consolidated',
  'created',
  'delivered',
  'designed',
  'developed',
  'directed',
  'drove',
  'eliminated',
  'engineered',
  'established',
  'executed',
  'expanded',
  'generated',
  'implemented',
  'improved',
  'increased',
  'launched',
  'led',
  'managed',
  'mentored',
  'migrated',
  'optimized',
  'orchestrated',
  'partnered',
  'pioneered',
  'reduced',
  'refactored',
  'scaled',
  'shipped',
  'spearheaded',
  'streamlined',
  'transformed',
]);

const STOP_WORDS = new Set([
  'about', 'above', 'after', 'again', 'against', 'all', 'also', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', 'could', 'did', 'do', 'does', 'doing',
  'down', 'during', 'each', 'ensure', 'every', 'few', 'for', 'from', 'further',
  'get', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'join', 'just', 'looking', 'make', 'many', 'may', 'more', 'most', 'must', 'my',
  'need', 'new', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'our', 'ours', 'out', 'over', 'own', 'plus', 'proven', 'role',
  'same', 'seeking', 'she', 'should', 'so', 'some', 'strong', 'such', 'team',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until',
  'up', 'very', 'was', 'we', 'well', 'were', 'what', 'when', 'where', 'which',
  'while', 'who', 'whom', 'why', 'will', 'with', 'work', 'working', 'would',
  'years', 'year', 'you', 'your', 'yours', 'ability', 'experience', 'using',
  'including', 'closely', 'across', 'related', 'preferred', 'required', 'requirements',
  'responsibilities', 'ideal', 'candidate', 'company', 'position', 'background',
]);

function extractResumeCorpus(resume: ResumeData): string {
  const parts: string[] = [
    resume.personal.fullName,
    resume.personal.jobTitle,
    resume.summary,
    ...resume.skills,
    ...resume.certifications,
    ...resume.experience.flatMap((exp) => [exp.role, exp.company, ...exp.bullets]),
    ...resume.education.flatMap((edu) => [edu.degree, edu.field, edu.institution]),
    ...resume.projects.flatMap((proj) => [proj.name, proj.roleOrTech, proj.description]),
  ];
  return parts.join(' ').trim();
}

function extractTargetKeywords(jobDescription: string): string[] {
  if (!jobDescription.trim()) return [];

  // Capture multi-word technical terms + meaningful single keywords
  const multiWordPatterns = [
    /\bCI\/CD\b/gi,
    /\bCore Web Vitals\b/gi,
    /\bSystem Design\b/gi,
    /\bMachine Learning\b/gi,
    /\bProduct Management\b/gi,
    /\bData Analysis\b/gi,
    /\bProject Management\b/gi,
    /\bTailwind CSS\b/gi,
    /\bNode\.js\b/gi,
    /\bNext\.js\b/gi,
    /\bREST API\b/gi,
  ];

  const found = new Set<string>();
  for (const pattern of multiWordPatterns) {
    const matches = jobDescription.match(pattern);
    if (matches) {
      matches.forEach((m) => found.add(m.trim()));
    }
  }

  const tokens = jobDescription
    .replace(/[(),:;•\-–—]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^[./]+|[./]+$/g, ''))
    .filter((t) => t.length >= 2);

  const freq = new Map<string, { display: string; count: number }>();

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (STOP_WORDS.has(lower)) continue;
    if (/^\d+\+?$/.test(lower)) continue;
    const existing = freq.get(lower);
    if (existing) {
      existing.count += 1;
    } else {
      freq.set(lower, { display: token, count: 1 });
    }
  }

  // Prioritize capitalized / tech words or repeated domain terms
  const ranked = Array.from(freq.entries())
    .sort((a, b) => {
      const aTech = /[A-Z0-9.#+/]/.test(a[1].display) ? 1 : 0;
      const bTech = /[A-Z0-9.#+/]/.test(b[1].display) ? 1 : 0;
      if (b[1].count !== a[1].count) return b[1].count - a[1].count;
      return bTech - aTech;
    })
    .slice(0, 18);

  for (const [, val] of ranked) {
    found.add(val.display);
  }

  return Array.from(found).slice(0, 18);
}

export function analyzeResumeATS(
  resume: ResumeData,
  jobDescription = ''
): ATSAnalysisResult {
  const checks: ATSCheckItem[] = [];
  const corpus = extractResumeCorpus(resume);
  const words = corpus ? corpus.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // 1. Contact Information Completeness
  const hasName = Boolean(resume.personal.fullName.trim());
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.personal.email.trim());
  const hasPhone = resume.personal.phone.trim().length >= 7;
  const hasLocation = Boolean(resume.personal.location.trim());
  const contactCount = [hasName, hasEmail, hasPhone, hasLocation].filter(Boolean).length;

  checks.push({
    id: 'contact',
    label: 'Parseable Contact Header',
    category: 'structure',
    status: contactCount === 4 ? 'pass' : contactCount >= 2 ? 'warning' : 'missing',
    detail:
      contactCount === 4
        ? 'Full name, valid email, phone, and city/state are cleanly structured.'
        : 'Include full name, valid email address, phone number, and city/state.',
  });

  // 2. Professional Summary
  const summaryWords = resume.summary.trim().split(/\s+/).filter(Boolean).length;
  checks.push({
    id: 'summary',
    label: 'Executive Summary Depth',
    category: 'content',
    status: summaryWords >= 25 && summaryWords <= 85 ? 'pass' : summaryWords > 0 ? 'warning' : 'missing',
    detail:
      summaryWords === 0
        ? 'Add a 2–4 sentence summary highlighting core role focus and years of impact.'
        : summaryWords < 25
        ? `Summary is brief (${summaryWords} words). Target 30–70 words with key role keywords.`
        : summaryWords > 85
        ? `Summary is long (${summaryWords} words). Tighten to under 75 words for fast recruiter scanning.`
        : `Well-paced summary (${summaryWords} words) ready for parser indexing.`,
  });

  // 3. Experience & Bullet Structure
  const validExp = resume.experience.filter((e) => e.company.trim() || e.role.trim());
  const allBullets = validExp.flatMap((e) => e.bullets.map((b) => b.trim()).filter(Boolean));
  checks.push({
    id: 'experience',
    label: 'Chronological Experience',
    category: 'structure',
    status: validExp.length >= 2 && allBullets.length >= 4 ? 'pass' : validExp.length >= 1 ? 'warning' : 'missing',
    detail:
      validExp.length === 0
        ? 'Add at least one work experience entry with company, role, and dates.'
        : `${validExp.length} role${validExp.length > 1 ? 's' : ''} and ${allBullets.length} achievement bullet${allBullets.length === 1 ? '' : 's'} detected.`,
  });

  // 4. Quantified Impact Metrics
  const metricBullets = allBullets.filter((b) => /\d+%|\$\d+|\d+x|\d+\+|\d{2,}/i.test(b));
  checks.push({
    id: 'metrics',
    label: 'Quantified Outcomes',
    category: 'impact',
    status:
      allBullets.length > 0 && metricBullets.length >= Math.min(3, allBullets.length)
        ? 'pass'
        : metricBullets.length >= 1
        ? 'warning'
        : 'missing',
    detail:
      metricBullets.length === 0
        ? 'Add measurable metrics (%, $, time saved, user scale) to your experience bullets.'
        : `${metricBullets.length} of ${allBullets.length} bullets include concrete numbers or percentages.`,
  });

  // 5. Action Verb Discipline
  const actionVerbBullets = allBullets.filter((b) => {
    const firstWord = b.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') ?? '';
    return STRONG_ACTION_VERBS.has(firstWord);
  });
  checks.push({
    id: 'verbs',
    label: 'Action-Verb Bullet Openers',
    category: 'impact',
    status:
      allBullets.length > 0 && actionVerbBullets.length / allBullets.length >= 0.65
        ? 'pass'
        : actionVerbBullets.length >= 1
        ? 'warning'
        : 'missing',
    detail:
      allBullets.length === 0
        ? 'Lead each bullet point with a strong past-tense action verb (e.g., Built, Reduced, Led).'
        : `${actionVerbBullets.length} of ${allBullets.length} bullets open with recognized high-impact verbs.`,
  });

  // 6. Skills & Education
  const hasSkills = resume.skills.length >= 6;
  const hasEducation = resume.education.some((e) => e.institution.trim() || e.degree.trim());
  checks.push({
    id: 'skills-edu',
    label: 'Skills Index & Education',
    category: 'content',
    status: hasSkills && hasEducation ? 'pass' : resume.skills.length > 0 || hasEducation ? 'warning' : 'missing',
    detail:
      hasSkills && hasEducation
        ? `${resume.skills.length} indexed skills and ${resume.education.length} education credential${resume.education.length > 1 ? 's' : ''}.`
        : 'List at least 6 plain-text skills and your highest education credential.',
  });

  // 7. Word Count / Length
  checks.push({
    id: 'length',
    label: 'Optimal Document Length',
    category: 'structure',
    status: wordCount >= 220 && wordCount <= 850 ? 'pass' : wordCount > 0 ? 'warning' : 'missing',
    detail:
      wordCount === 0
        ? 'Resume has no content yet.'
        : wordCount < 220
        ? `Currently ${wordCount} words. Aim for 300–700 words for strong 1-page density.`
        : wordCount > 850
        ? `Currently ${wordCount} words. Consider trimming older details to stay crisp.`
        : `${wordCount} words fits cleanly within standard 1–2 page ATS benchmarks.`,
  });

  // Keyword matching against Job Description
  const targetKeywords = extractTargetKeywords(jobDescription);
  const lowerCorpus = corpus.toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of targetKeywords) {
    const escaped = kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    if (regex.test(lowerCorpus)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const keywordMatchRate =
    targetKeywords.length > 0
      ? Math.round((matchedKeywords.length / targetKeywords.length) * 100)
      : null;

  // Compute deterministic overall score
  const checkPoints = checks.reduce((acc, item) => {
    if (item.status === 'pass') return acc + 100;
    if (item.status === 'warning') return acc + 55;
    return acc;
  }, 0);

  const baseScore = Math.round(checkPoints / checks.length);
  const overallScore =
    keywordMatchRate !== null
      ? Math.round(baseScore * 0.65 + keywordMatchRate * 0.35)
      : baseScore;

  return {
    overallScore,
    checks,
    matchedKeywords,
    missingKeywords,
    keywordMatchRate,
    wordCount,
  };
}
