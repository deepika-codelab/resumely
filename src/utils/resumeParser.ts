import { EducationItem, ExperienceItem, ResumeData } from '../types/resume';
import { createBlankResume } from '../data/sampleResume';

const SECTION_HEADERS = {
  summary: /^(summary|professional summary|profile|about|objective)$/i,
  experience: /^(experience|work experience|employment|professional experience|career history)$/i,
  education: /^(education|academic background|academics)$/i,
  skills: /^(skills|technical skills|core competencies|technologies|tools)$/i,
  projects: /^(projects|selected projects|key projects)$/i,
  certifications: /^(certifications|certificates|licenses)$/i,
};

function cleanLine(line: string): string {
  return line.replace(/\u0000/g, '').replace(/\s+/g, ' ').trim();
}

export function parseResumeFromText(rawText: string, fileName?: string): ResumeData {
  const base = createBlankResume();
  const lines = rawText
    .split(/\r?\n/)
    .map(cleanLine)
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return base;
  }

  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const urlMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|io|com|org|net)(?:\/[^\s,)]*)?/gi);

  base.personal.email = emailMatch?.[0] ?? '';
  base.personal.phone = phoneMatch?.[0] ?? '';
  base.personal.linkedin = linkedinMatch?.[0]?.replace(/^https?:\/\//i, '') ?? '';

  if (urlMatch) {
    const nonEmailOrLinkedin = urlMatch.find(
      (u) => !u.includes('@') && !u.toLowerCase().includes('linkedin.com')
    );
    if (nonEmailOrLinkedin) {
      base.personal.website = nonEmailOrLinkedin.replace(/^https?:\/\//i, '');
    }
  }

  // Name is typically the first non-contact line
  const firstCandidate = lines.find(
    (l) => !l.includes('@') && l.length <= 60 && !/^(resume|curriculum vitae)$/i.test(l)
  );
  if (firstCandidate) {
    base.personal.fullName = firstCandidate.replace(/^[#*-\s]+/, '');
  }

  // Check second line for job title or location
  if (lines[1] && !lines[1].includes('@') && lines[1].length <= 80) {
    const second = lines[1];
    if (!Object.values(SECTION_HEADERS).some((rx) => rx.test(second))) {
      const locationRx = /([A-Za-z\s]+,\s*[A-Z]{2})/;
      const locMatch = second.match(locationRx);
      if (locMatch) {
        base.personal.location = locMatch[1].trim();
      } else if (!phoneMatch || !second.includes(phoneMatch[0])) {
        base.personal.jobTitle = second.replace(/[|•·].*$/, '').trim();
      }
    }
  }

  // Partition lines into sections
  type SectionKey = keyof typeof SECTION_HEADERS | 'header';
  let currentSection: SectionKey = 'header';
  const buckets: Record<SectionKey, string[]> = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };

  for (const line of lines) {
    const normalizedHeading = line.replace(/[:#*_-]+/g, '').trim();
    let matchedSection: SectionKey | null = null;
    for (const [key, regex] of Object.entries(SECTION_HEADERS)) {
      if (regex.test(normalizedHeading)) {
        matchedSection = key as keyof typeof SECTION_HEADERS;
        break;
      }
    }
    if (matchedSection) {
      currentSection = matchedSection;
    } else {
      buckets[currentSection].push(line);
    }
  }

  // Look for City, ST in header bucket if not yet found
  if (!base.personal.location) {
    for (const hLine of buckets.header) {
      const loc = hLine.match(/\b([A-Za-z\s]{2,25},\s*[A-Z]{2})\b/);
      if (loc) {
        base.personal.location = loc[1].trim();
        break;
      }
    }
  }

  // Summary
  if (buckets.summary.length > 0) {
    base.summary = buckets.summary.join(' ');
  }

  // Skills
  if (buckets.skills.length > 0) {
    const rawSkills = buckets.skills
      .join(', ')
      .split(/[,|•·/]+/)
      .map((s) => s.replace(/^[-*\s]+/, '').trim())
      .filter((s) => s.length > 1 && s.length <= 45);
    base.skills = Array.from(new Set(rawSkills));
  }

  // Certifications
  if (buckets.certifications.length > 0) {
    base.certifications = buckets.certifications.map((c) => c.replace(/^[-*•\s]+/, '').trim());
  }

  // Experience parsing
  if (buckets.experience.length > 0) {
    const experiences: ExperienceItem[] = [];
    let currentExp: ExperienceItem | null = null;

    const datePattern =
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)/i;

    for (const line of buckets.experience) {
      const isBullet = /^[•\-*▪▸]/.test(line);
      const dateMatch = line.match(datePattern);

      if (!isBullet && (dateMatch || !currentExp || line.includes('|') || line.includes('—'))) {
        if (currentExp && (currentExp.role || currentExp.company || currentExp.bullets.length > 0)) {
          experiences.push(currentExp);
        }
        const cleaned = line.replace(datePattern, '').replace(/[|•—-]+$/, '').trim();
        const parts = cleaned.split(/\s*[|@–—]\s*|\s+at\s+/i).filter(Boolean);
        currentExp = {
          id: `exp-${Date.now()}-${experiences.length}`,
          role: parts[0] ?? cleaned,
          company: parts[1] ?? '',
          location: parts[2] ?? '',
          startDate: dateMatch?.[1] ?? '',
          endDate: dateMatch?.[2] ?? '',
          current: /present|current/i.test(dateMatch?.[2] ?? ''),
          bullets: [],
        };
      } else if (currentExp) {
        const cleanBullet = line.replace(/^[•\-*▪▸\s]+/, '').trim();
        if (cleanBullet) {
          if (!isBullet && !currentExp.company && currentExp.bullets.length === 0 && cleanBullet.length < 70) {
            currentExp.company = cleanBullet;
          } else {
            currentExp.bullets.push(cleanBullet);
          }
        }
      }
    }

    if (currentExp && (currentExp.role || currentExp.company || currentExp.bullets.length > 0)) {
      experiences.push(currentExp);
    }

    if (experiences.length > 0) {
      base.experience = experiences.map((e) => ({
        ...e,
        bullets: e.bullets.length > 0 ? e.bullets : [''],
      }));
    }
  }

  // Education parsing
  if (buckets.education.length > 0) {
    const educations: EducationItem[] = [];
    for (let i = 0; i < buckets.education.length; i += 2) {
      const line1 = buckets.education[i];
      const line2 = buckets.education[i + 1] ?? '';
      const yearMatch = `${line1} ${line2}`.match(/(?:May|Aug|Dec|Jun)?\s*\b(19|20)\d{2}\b/);
      educations.push({
        id: `edu-${Date.now()}-${i}`,
        institution: line1.replace(/[-–|,]\s*(19|20)\d{2}.*$/, '').trim(),
        degree: line2 ? line2.replace(/[-–|,]\s*(19|20)\d{2}.*$/, '').trim() : '',
        field: '',
        graduationDate: yearMatch?.[0]?.trim() ?? '',
      });
    }
    if (educations.length > 0) {
      base.education = educations;
    }
  }

  base.title = fileName
    ? fileName.replace(/\.[^.]+$/, '')
    : base.personal.fullName
    ? `${base.personal.fullName} — Resume`
    : 'Imported Resume';
  base.updatedAt = new Date().toISOString();

  return base;
}

async function tryInflateZlib(slice: Uint8Array): Promise<string | null> {
  if (typeof DecompressionStream === 'undefined' || slice.length < 6) {
    return null;
  }

  // Validate RFC 1950 zlib header: CM=8 (deflate), CINFO<=7, (CMF*256 + FLG) % 31 === 0
  const cmf = slice[0];
  const flg = slice[1];
  if ((cmf & 0x0f) !== 8 || (cmf >> 4) > 7 || ((cmf << 8) | flg) % 31 !== 0) {
    return null;
  }

  try {
    const ds = new DecompressionStream('deflate');
    const writer = ds.writable.getWriter();

    // Attach catch handlers to write/close so failed streams never emit unhandled rejections
    const writePromise = writer
      .write(new Uint8Array(slice))
      .then(() => writer.close())
      .catch(() => {
        // Handled via readable promise rejection
      });

    const readPromise = new Response(ds.readable).text();
    const [textResult] = await Promise.allSettled([readPromise, writePromise]);

    if (textResult.status === 'fulfilled') {
      return textResult.value;
    }
    return null;
  } catch {
    return null;
  }
}

async function extractTextFromPdfBuffer(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const latin1 = new TextDecoder('latin1').decode(bytes);
  const extractedLines: string[] = [];

  const streamRegex = /stream(?:\r\n|\r|\n)([\s\S]*?)(?:\r\n|\r|\n)?endstream/g;
  let match: RegExpExecArray | null;

  const decodePdfEscapes = (str: string): string =>
    str
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\t/g, ' ')
      .replace(/\\([()\\])/g, '$1');

  const extractPdfTextOperators = (content: string) => {
    const btBlocks = content.match(/BT[\s\S]*?ET/g) ?? [content];
    for (const block of btBlocks) {
      const lineParts: string[] = [];
      const opRegex = /\(([^()\\]*(?:\\.[^()\\]*)*)\)\s*(?:Tj|'|")|\[(.*?)\]\s*TJ/g;
      let opMatch: RegExpExecArray | null;
      while ((opMatch = opRegex.exec(block)) !== null) {
        if (opMatch[1] !== undefined) {
          lineParts.push(decodePdfEscapes(opMatch[1]));
        } else if (opMatch[2] !== undefined) {
          const parts = opMatch[2].match(/\(([^()\\]*(?:\\.[^()\\]*)*)\)/g);
          if (parts) {
            lineParts.push(
              parts.map((p) => decodePdfEscapes(p.slice(1, -1))).join('')
            );
          }
        }
      }
      const combined = lineParts.join(' ').replace(/\s+/g, ' ').trim();
      if (combined) {
        extractedLines.push(combined);
      }
    }
  };

  while ((match = streamRegex.exec(latin1)) !== null) {
    const streamBody = match[1];
    if (!streamBody) continue;

    const headerLen = match[0].indexOf(streamBody);
    const startOffset = match.index + headerLen;
    const slice = bytes.subarray(startOffset, startOffset + streamBody.length);

    const inflated = await tryInflateZlib(slice);
    if (inflated) {
      extractPdfTextOperators(inflated);
    } else {
      extractPdfTextOperators(streamBody);
    }
  }

  return extractedLines.join('\n').trim();
}

export async function parseUploadedResumeFile(file: File): Promise<{
  resume: ResumeData;
  format: 'json' | 'text' | 'pdf';
  extractedText?: string;
}> {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.json')) {
    const raw = await file.text();
    const parsed = JSON.parse(raw) as Partial<ResumeData>;
    const blank = createBlankResume();
    const merged: ResumeData = {
      ...blank,
      ...parsed,
      personal: {
        ...blank.personal,
        ...(parsed.personal ?? {}),
      },
      experience: Array.isArray(parsed.experience) && parsed.experience.length > 0 ? parsed.experience : blank.experience,
      education: Array.isArray(parsed.education) && parsed.education.length > 0 ? parsed.education : blank.education,
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      updatedAt: new Date().toISOString(),
    };
    return { resume: merged, format: 'json' };
  }

  if (lowerName.endsWith('.pdf')) {
    const buffer = await file.arrayBuffer();
    const text = await extractTextFromPdfBuffer(buffer);
    if (!text || text.length < 25) {
      throw new Error(
        'This PDF uses image/encoded fonts that cannot be read directly in the browser. Switch to "Paste Resume Text" below to import it cleanly.'
      );
    }
    return {
      resume: parseResumeFromText(text, file.name),
      format: 'pdf',
      extractedText: text,
    };
  }

  // .txt, .md, .rtf fallback
  const text = await file.text();
  return {
    resume: parseResumeFromText(text, file.name),
    format: 'text',
    extractedText: text,
  };
}
