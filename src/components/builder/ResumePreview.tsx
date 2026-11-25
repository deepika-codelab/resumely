import React from 'react';
import { ResumeData, TemplateId } from '../../types/resume';

interface ResumePreviewProps {
  resume: ResumeData;
  templateOverride?: TemplateId;
  compact?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  templateOverride,
  compact = false,
}) => {
  const template = templateOverride ?? resume.template;
  const { personal, summary, experience, education, skills, projects, certifications } = resume;

  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter((item) => item && item.trim().length > 0);

  const validExperience = experience.filter(
    (item) => item.role.trim() || item.company.trim() || item.bullets.some((b) => b.trim())
  );

  const validEducation = education.filter(
    (item) => item.institution.trim() || item.degree.trim() || item.field.trim()
  );

  const validProjects = projects.filter(
    (item) => item.name.trim() || item.description.trim()
  );

  const validCerts = certifications.filter((c) => c.trim().length > 0);

  const isModern = template === 'modern';
  const isExecutive = template === 'executive';

  const sectionHeadingClass = isModern
    ? 'text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-700 border-b border-indigo-200 pb-1 mb-2.5'
    : isExecutive
    ? 'text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 border-b-2 border-slate-900 pb-1 mb-2.5'
    : 'text-[11px] font-bold uppercase tracking-[0.1em] text-slate-800 border-b border-slate-300 pb-1 mb-2.5';

  return (
    <article
      className={`bg-white text-slate-900 w-full ${
        compact ? 'p-5 text-[10px] leading-[1.45]' : 'p-8 sm:p-10 text-[12px] leading-[1.55]'
      } font-sans`}
      aria-label="ATS Resume Preview"
    >
      {/* Header */}
      <header
        className={`${
          template === 'classic' ? 'text-center border-b border-slate-200 pb-4' : 'pb-4 border-b border-slate-200'
        } mb-4`}
      >
        <h1
          className={`${
            compact ? 'text-[17px]' : 'text-[24px]'
          } font-bold tracking-tight text-slate-900 leading-tight`}
        >
          {personal.fullName.trim() || 'Your Full Name'}
        </h1>

        {(personal.jobTitle.trim() || !personal.fullName.trim()) && (
          <p
            className={`${
              compact ? 'text-[11px]' : 'text-[14px]'
            } font-medium mt-0.5 ${
              isModern
                ? 'text-indigo-600'
                : isExecutive
                ? 'text-purple-700'
                : 'text-slate-600'
            }`}
          >
            {personal.jobTitle.trim() || 'Target Job Title'}
          </p>
        )}

        {contactItems.length > 0 ? (
          <div
            className={`mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-slate-600 ${
              compact ? 'text-[9px]' : 'text-[11px]'
            } ${template === 'classic' ? 'justify-center' : 'justify-start'}`}
          >
            {contactItems.map((item, idx) => (
              <React.Fragment key={`${item}-${idx}`}>
                {idx > 0 && (
                  <span className="text-slate-300" aria-hidden="true">
                    ·
                  </span>
                )}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-slate-400">
            email@example.com · (555) 000-0000 · City, State
          </p>
        )}
      </header>

      {/* Summary */}
      {summary.trim() && (
        <section className="mb-4">
          <h2 className={sectionHeadingClass}>Professional Summary</h2>
          <p className="text-slate-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {validExperience.length > 0 && (
        <section className="mb-4">
          <h2 className={sectionHeadingClass}>Work Experience</h2>
          <div className={compact ? 'space-y-2.5' : 'space-y-3.5'}>
            {validExperience.map((exp) => {
              const dateRange = [
                exp.startDate.trim(),
                exp.current ? 'Present' : exp.endDate.trim(),
              ]
                .filter(Boolean)
                .join(' – ');

              const cleanBullets = exp.bullets.map((b) => b.trim()).filter(Boolean);

              return (
                <div key={exp.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="font-semibold text-slate-900">
                      {exp.role.trim() || 'Role Title'}
                      {exp.company.trim() ? (
                        <span className="font-normal text-slate-700">
                          {' '}
                          — {exp.company.trim()}
                        </span>
                      ) : null}
                    </h3>
                    {dateRange && (
                      <span className="text-slate-500 tabular-nums shrink-0 text-[0.92em]">
                        {dateRange}
                      </span>
                    )}
                  </div>
                  {exp.location.trim() && (
                    <p className="text-slate-500 text-[0.9em] mt-0.5">{exp.location}</p>
                  )}
                  {cleanBullets.length > 0 && (
                    <ul className="mt-1.5 space-y-1 list-disc pl-4 text-slate-700">
                      {cleanBullets.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className={sectionHeadingClass}>Skills</h2>
          <p className="text-slate-700 leading-relaxed">
            {skills.join(' · ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {validProjects.length > 0 && (
        <section className="mb-4">
          <h2 className={sectionHeadingClass}>Selected Projects</h2>
          <div className="space-y-2">
            {validProjects.map((proj) => (
              <div key={proj.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <span className="font-semibold text-slate-900">
                    {proj.name}
                    {proj.roleOrTech ? (
                      <span className="font-normal text-slate-600"> · {proj.roleOrTech}</span>
                    ) : null}
                  </span>
                  {proj.link && (
                    <span className="text-slate-500 text-[0.9em]">{proj.link}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-700 mt-0.5 leading-snug">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {validEducation.length > 0 && (
        <section className="mb-4">
          <h2 className={sectionHeadingClass}>Education</h2>
          <div className="space-y-2">
            {validEducation.map((edu) => (
              <div key={edu.id} className="flex flex-wrap items-baseline justify-between gap-x-3">
                <div>
                  <span className="font-semibold text-slate-900">
                    {edu.institution || 'University Name'}
                  </span>
                  {(edu.degree || edu.field) && (
                    <span className="text-slate-700">
                      {' '}
                      — {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                    </span>
                  )}
                  {edu.gpa && (
                    <span className="text-slate-500 text-[0.92em]"> · GPA: {edu.gpa}</span>
                  )}
                </div>
                {edu.graduationDate && (
                  <span className="text-slate-500 tabular-nums shrink-0 text-[0.92em]">
                    {edu.graduationDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {validCerts.length > 0 && (
        <section>
          <h2 className={sectionHeadingClass}>Certifications</h2>
          <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
            {validCerts.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
};
