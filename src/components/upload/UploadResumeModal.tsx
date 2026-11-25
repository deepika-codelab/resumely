import React, { useRef, useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { parseResumeFromText, parseUploadedResumeFile } from '../../utils/resumeParser';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportResume: (resume: ResumeData) => void;
}

export const UploadResumeModal: React.FC<UploadResumeModalProps> = ({
  isOpen,
  onClose,
  onImportResume,
}) => {
  const [mode, setMode] = useState<'file' | 'paste'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<ResumeData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setError(null);
    setIsParsing(true);
    try {
      const result = await parseUploadedResumeFile(file);
      setParsedPreview(result.resume);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not read this file. Try uploading a .txt, .md, .json file or pasting the resume text.'
      );
      setParsedPreview(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const handleParseText = () => {
    setError(null);
    if (pastedText.trim().length < 20) {
      setError('Please paste at least a few lines of your resume to extract sections.');
      return;
    }
    const parsed = parseResumeFromText(pastedText, 'Pasted Resume');
    setParsedPreview(parsed);
  };

  const handleConfirmImport = () => {
    if (!parsedPreview) return;
    onImportResume(parsedPreview);
    setParsedPreview(null);
    setPastedText('');
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/35 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div className="w-full max-w-xl rounded-2xl bg-white border border-indigo-100 shadow-2xl shadow-indigo-950/15 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-100/90 bg-gradient-to-r from-[#FAF9FF] to-white">
          <div>
            <h2 id="upload-modal-title" className="text-lg font-bold text-slate-900">
              Upload Existing Resume
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Import a .json, .txt, .md, or text-based .pdf file—or paste resume text directly.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close upload dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Segmented Mode Tabs */}
          <div className="inline-flex items-center gap-1 p-1 bg-[#F3F1FC] border border-indigo-100/80 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('file');
                setError(null);
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'file'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('paste');
                setError(null);
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'paste'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paste Resume Text
            </button>
          </div>

          {mode === 'file' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/70'
                  : 'border-indigo-200/90 bg-[#FAF9FF]/70 hover:border-indigo-400 hover:bg-[#F5F3FF]/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt,.md,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                }}
              />
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-200/80 flex items-center justify-center text-indigo-600 mb-3 shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {isParsing
                  ? 'Extracting resume sections...'
                  : 'Drop your resume file here, or click to browse'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports Resumely JSON, TXT, Markdown, and text-selectable PDF files
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={7}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={`Paste your resume content here...\n\nJane Doe\njane@example.com | (555) 123-4567 | Austin, TX\n\nSUMMARY\nProduct Manager with 6+ years...\n\nEXPERIENCE\nSenior PM | Acme Corp | Jan 2022 - Present\n- Led launch of...`}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={handleParseText}
                className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              >
                Extract Sections
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {parsedPreview && (
            <div className="rounded-xl bg-[#FAF9FF] border border-indigo-100 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resume parsed and ready to edit</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Name:</span>{' '}
                  <span className="font-medium text-slate-800">
                    {parsedPreview.personal.fullName || 'Not detected'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>{' '}
                  <span className="font-medium text-slate-800">
                    {parsedPreview.personal.email || 'Not detected'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Roles found:</span>{' '}
                  <span className="font-medium text-slate-800 tabular-nums">
                    {parsedPreview.experience.filter((e) => e.role || e.company).length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Skills found:</span>{' '}
                  <span className="font-medium text-slate-800 tabular-nums">
                    {parsedPreview.skills.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-indigo-100/90 bg-[#FAF9FF]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!parsedPreview}
            onClick={handleConfirmImport}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed rounded-xl shadow-sm shadow-indigo-600/20 disabled:shadow-none transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open in Builder</span>
          </button>
        </div>
      </div>
    </div>
  );
};
