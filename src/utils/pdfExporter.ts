import { jsPDF } from 'jspdf';
import { ResumeData, TemplateId } from '../types/resume';

function sanitizePdfText(text: string): string {
  return text
    .replace(/[▸▪➤◆]/g, '-')
    .replace(/\u202f/g, ' ')
    .replace(/\u00a0/g, ' ')
    // Strip unsupported non-WinAnsi symbols/emojis while preserving punctuation & Latin-1
    .replace(/[^\x20-\x7E\xA0-\xFF\u2013\u2014\u2018\u2019\u201C\u201D\u2022\n]/g, '')
    .trim();
}

export interface PdfExportResult {
  filename: string;
  pageCount: number;
}

export function buildResumePdfDocument(
  resume: ResumeData,
  templateOverride?: TemplateId
): { doc: jsPDF; filename: string } {
  const template = templateOverride ?? resume.template;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
    compress: true,
  });

  doc.setProperties({
    title: resume.personal.fullName ? `${resume.personal.fullName} — Resume` : 'Resume',
    creator: 'Resumely',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 612pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 792pt
  const marginX = 46;
  const marginTop = 44;
  const marginBottom = 44;
  const contentWidth = pageWidth - marginX * 2; // 520pt

  const isModern = template === 'modern';
  const isExecutive = template === 'executive';
  const isClassic = template === 'classic';

  const colors = {
    slate900: [15, 23, 42] as const,
    slate800: [30, 41, 59] as const,
    slate700: [51, 65, 85] as const,
    slate600: [71, 85, 105] as const,
    slate500: [100, 116, 139] as const,
    slate300: [203, 213, 225] as const,
    slate200: [226, 232, 240] as const,
    indigo700: [67, 56, 202] as const,
    indigo600: [79, 70, 229] as const,
    indigo200: [199, 210, 254] as const,
    purple700: [126, 34, 206] as const,
  };

  let y = marginTop;

  const ensureSpace = (neededPt: number) => {
    if (y + neededPt > pageHeight - marginBottom) {
      doc.addPage();
      y = marginTop;
    }
  };

  const drawSectionHeading = (title: string) => {
    ensureSpace(42);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);

    if (isModern) {
      doc.setTextColor(...colors.indigo700);
    } else if (isExecutive) {
      doc.setTextColor(...colors.slate900);
    } else {
      doc.setTextColor(...colors.slate800);
    }

    doc.text(title.toUpperCase(), marginX, y, { charSpace: 0.7 });
    y += 5;

    if (isModern) {
      doc.setDrawColor(...colors.indigo200);
      doc.setLineWidth(0.75);
    } else if (isExecutive) {
      doc.setDrawColor(...colors.slate900);
      doc.setLineWidth(1.4);
    } else {
      doc.setDrawColor(...colors.slate300);
      doc.setLineWidth(0.75);
    }

    doc.line(marginX, y, marginX + contentWidth, y);
    y += 14;
  };

  const drawWrappedParagraph = (
    text: string,
    x: number,
    maxWidth: number,
    fontSize: number,
    lineHeight: number,
    style: 'normal' | 'bold' = 'normal',
    color: readonly [number, number, number] = colors.slate700
  ) => {
    const clean = sanitizePdfText(text);
    if (!clean) return;
    doc.setFont('helvetica', style);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(clean, maxWidth) as string[];
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, x, y);
      y += lineHeight;
    }
  };

  // --- Header ---
  const { personal, summary, experience, education, skills, projects, certifications } = resume;
  const fullName = sanitizePdfText(personal.fullName) || 'Your Full Name';
  const jobTitle = sanitizePdfText(personal.jobTitle);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...colors.slate900);

  if (isClassic) {
    doc.text(fullName, pageWidth / 2, y, { align: 'center' });
  } else {
    doc.text(fullName, marginX, y);
  }
  y += 17;

  if (jobTitle) {
    doc.setFont('helvetica', isModern || isExecutive ? 'bold' : 'normal');
    doc.setFontSize(11);
    if (isModern) {
      doc.setTextColor(...colors.indigo600);
    } else if (isExecutive) {
      doc.setTextColor(...colors.purple700);
    } else {
      doc.setTextColor(...colors.slate600);
    }

    if (isClassic) {
      doc.text(jobTitle, pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text(jobTitle, marginX, y);
    }
    y += 15;
  }

  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ]
    .map(sanitizePdfText)
    .filter(Boolean);

  const contactLine =
    contactItems.length > 0
      ? contactItems.join('  \u00b7  ')
      : 'email@example.com  \u00b7  (555) 000-0000  \u00b7  City, State';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.slate600);
  const wrappedContact = doc.splitTextToSize(contactLine, contentWidth) as string[];
  for (const line of wrappedContact) {
    if (isClassic) {
      doc.text(line, pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text(line, marginX, y);
    }
    y += 12;
  }

  y += 4;
  doc.setDrawColor(...colors.slate200);
  doc.setLineWidth(0.75);
  doc.line(marginX, y, marginX + contentWidth, y);
  y += 14;

  // --- Professional Summary ---
  if (sanitizePdfText(summary)) {
    drawSectionHeading('Professional Summary');
    drawWrappedParagraph(summary, marginX, contentWidth, 9.5, 13.5, 'normal', colors.slate700);
    y += 6;
  }

  // --- Work Experience ---
  const validExperience = experience.filter(
    (item) => item.role.trim() || item.company.trim() || item.bullets.some((b) => b.trim())
  );

  if (validExperience.length > 0) {
    drawSectionHeading('Work Experience');
    for (const exp of validExperience) {
      ensureSpace(34);
      const roleText = sanitizePdfText(exp.role) || 'Role Title';
      const companyText = sanitizePdfText(exp.company);
      const dateRange = [
        sanitizePdfText(exp.startDate),
        exp.current ? 'Present' : sanitizePdfText(exp.endDate),
      ]
        .filter(Boolean)
        .join(' \u2013 ');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...colors.slate900);

      const dateWidth = dateRange ? doc.getTextWidth(dateRange) + 12 : 0;
      const titleMaxWidth = contentWidth - dateWidth;
      const roleAndCompany = companyText ? `${roleText} — ${companyText}` : roleText;
      const titleLines = doc.splitTextToSize(roleAndCompany, titleMaxWidth) as string[];

      if (dateRange) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...colors.slate500);
        doc.text(dateRange, marginX + contentWidth, y, { align: 'right' });
      }

      titleLines.forEach((line, idx) => {
        if (idx > 0) ensureSpace(13);
        // Render role bold and company regular on first line if they fit cleanly
        if (idx === 0 && companyText && doc.getTextWidth(roleAndCompany) <= titleMaxWidth) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(...colors.slate900);
          doc.text(roleText, marginX, y);
          const roleW = doc.getTextWidth(roleText);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.slate700);
          doc.text(` \u2014 ${companyText}`, marginX + roleW, y);
        } else {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(...colors.slate900);
          doc.text(line, marginX, y);
        }
        y += 13;
      });

      const locText = sanitizePdfText(exp.location);
      if (locText) {
        ensureSpace(12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...colors.slate500);
        doc.text(locText, marginX, y);
        y += 12;
      }

      const cleanBullets = exp.bullets.map(sanitizePdfText).filter(Boolean);
      for (const bullet of cleanBullets) {
        const bulletIndent = 12;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.3);
        doc.setTextColor(...colors.slate700);
        const lines = doc.splitTextToSize(bullet, contentWidth - bulletIndent) as string[];
        lines.forEach((line, lineIdx) => {
          ensureSpace(13);
          if (lineIdx === 0) {
            doc.text('\u2022', marginX + 2, y);
          }
          doc.text(line, marginX + bulletIndent, y);
          y += 12.5;
        });
      }

      y += 6;
    }
  }

  // --- Skills ---
  const cleanSkills = skills.map(sanitizePdfText).filter(Boolean);
  if (cleanSkills.length > 0) {
    drawSectionHeading('Skills');
    drawWrappedParagraph(
      cleanSkills.join('  \u00b7  '),
      marginX,
      contentWidth,
      9.5,
      13.5,
      'normal',
      colors.slate700
    );
    y += 6;
  }

  // --- Selected Projects ---
  const validProjects = projects.filter(
    (item) => item.name.trim() || item.description.trim()
  );
  if (validProjects.length > 0) {
    drawSectionHeading('Selected Projects');
    for (const proj of validProjects) {
      ensureSpace(26);
      const projName = sanitizePdfText(proj.name) || 'Project';
      const projTech = sanitizePdfText(proj.roleOrTech);
      const projLink = sanitizePdfText(proj.link ?? '');

      if (projLink) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(...colors.slate500);
        doc.text(projLink, marginX + contentWidth, y, { align: 'right' });
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.8);
      doc.setTextColor(...colors.slate900);
      doc.text(projName, marginX, y);

      if (projTech) {
        const nameW = doc.getTextWidth(projName);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.slate600);
        doc.text(`  \u00b7  ${projTech}`, marginX + nameW, y);
      }
      y += 13;

      if (sanitizePdfText(proj.description)) {
        drawWrappedParagraph(
          proj.description,
          marginX,
          contentWidth,
          9.2,
          12.5,
          'normal',
          colors.slate700
        );
      }
      y += 5;
    }
  }

  // --- Education ---
  const validEducation = education.filter(
    (item) => item.institution.trim() || item.degree.trim() || item.field.trim()
  );
  if (validEducation.length > 0) {
    drawSectionHeading('Education');
    for (const edu of validEducation) {
      ensureSpace(22);
      const inst = sanitizePdfText(edu.institution) || 'University Name';
      const degreeField = [sanitizePdfText(edu.degree), sanitizePdfText(edu.field)]
        .filter(Boolean)
        .join(' in ');
      const gpa = sanitizePdfText(edu.gpa ?? '');
      const gradDate = sanitizePdfText(edu.graduationDate);

      if (gradDate) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...colors.slate500);
        doc.text(gradDate, marginX + contentWidth, y, { align: 'right' });
      }

      const dateW = gradDate ? doc.getTextWidth(gradDate) + 12 : 0;
      const fullEduLine = [
        inst,
        degreeField ? `\u2014 ${degreeField}` : '',
        gpa ? `\u00b7 GPA: ${gpa}` : '',
      ]
        .filter(Boolean)
        .join(' ');

      const lines = doc.splitTextToSize(fullEduLine, contentWidth - dateW) as string[];
      lines.forEach((line, idx) => {
        if (idx > 0) ensureSpace(13);
        if (idx === 0 && doc.getTextWidth(fullEduLine) <= contentWidth - dateW) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.8);
          doc.setTextColor(...colors.slate900);
          doc.text(inst, marginX, y);
          const instW = doc.getTextWidth(inst);
          const rest = [
            degreeField ? ` \u2014 ${degreeField}` : '',
            gpa ? ` \u00b7 GPA: ${gpa}` : '',
          ].join('');
          if (rest) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colors.slate700);
            doc.text(rest, marginX + instW, y);
          }
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.8);
          doc.setTextColor(...colors.slate900);
          doc.text(line, marginX, y);
        }
        y += 13.5;
      });
      y += 3;
    }
  }

  // --- Certifications ---
  const validCerts = certifications.map(sanitizePdfText).filter(Boolean);
  if (validCerts.length > 0) {
    drawSectionHeading('Certifications');
    for (const cert of validCerts) {
      const bulletIndent = 12;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.3);
      doc.setTextColor(...colors.slate700);
      const lines = doc.splitTextToSize(cert, contentWidth - bulletIndent) as string[];
      lines.forEach((line, idx) => {
        ensureSpace(13);
        if (idx === 0) {
          doc.text('\u2022', marginX + 2, y);
        }
        doc.text(line, marginX + bulletIndent, y);
        y += 13;
      });
    }
  }

  const baseName = (personal.fullName || resume.title || 'resume')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const filename = `${baseName || 'resume'}.pdf`;

  return { doc, filename };
}

export function exportResumeToPdf(
  resume: ResumeData,
  templateOverride?: TemplateId
): PdfExportResult {
  const { doc, filename } = buildResumePdfDocument(resume, templateOverride);
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);

  return {
    filename,
    pageCount: doc.getNumberOfPages(),
  };
}
