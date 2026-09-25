import React, { useState, useEffect, useRef } from 'react';
import { drawCertificateCanvas, downloadCertificateImage, printCertificateWindow, CertificateData } from '../utils/certificateCanvas';
import { sounds } from '../utils/audio';
import { Award, Download, Printer, CheckCircle2, Edit3, X, Sparkles, ShieldCheck, Copy, Share2 } from 'lucide-react';

interface CertificateModalProps {
  initialName: string;
  initialSchool: string;
  categoryTitle: string;
  ageTitle: string;
  score: number;
  accuracy: number;
  correctCount: number;
  totalCount: number;
  onClose: () => void;
  onSaveProfileInfo?: (name: string, school: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  initialName,
  initialSchool,
  categoryTitle,
  ageTitle,
  score,
  accuracy,
  correctCount,
  totalCount,
  onClose,
  onSaveProfileInfo
}) => {
  const [name, setName] = useState(initialName || '');
  const [school, setSchool] = useState(initialSchool || '');
  const [isEditing, setIsEditing] = useState(!initialName || initialName.trim().length === 0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Generate unique certificate ID
  const certIdRef = useRef<string>(
    `QD-2026-${Math.floor(1000 + Math.random() * 9000)}-${categoryTitle.slice(0, 2).toUpperCase()}`
  );

  const currentDateStr = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certificateData: CertificateData = {
    name: name.trim() || 'Участник Квантума',
    school: school.trim(),
    categoryTitle,
    ageTitle,
    score,
    accuracy,
    correctCount,
    totalCount,
    dateStr: currentDateStr,
    certId: certIdRef.current
  };

  // Re-draw canvas preview when data changes
  useEffect(() => {
    const canvas = drawCertificateCanvas(certificateData);
    setPreviewUrl(canvas.toDataURL('image/png'));
  }, [name, school]);

  const handleDownload = () => {
    sounds.playClick();
    if (onSaveProfileInfo) {
      onSaveProfileInfo(name, school);
    }
    downloadCertificateImage(certificateData);
  };

  const handlePrint = () => {
    sounds.playClick();
    if (onSaveProfileInfo) {
      onSaveProfileInfo(name, school);
    }
    printCertificateWindow(certificateData);
  };

  const handleCopyId = () => {
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(certIdRef.current);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const isWinner = accuracy >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl my-auto text-left max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>Именной электронный сертификат</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {isWinner ? 'Диплом' : 'Сертификат'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Детский технопарк «Квантум Добра» · Подтверждение участия
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Editable Name & School Bar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Персональные данные для сертификата
              </label>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Свернуть' : 'Редактировать ФИО'}</span>
              </button>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                    Имя и Отчество <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (onSaveProfileInfo) onSaveProfileInfo(e.target.value, school);
                    }}
                    placeholder="Например: Иван Александрович"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-medium">
                    Школа / Учебное заведение / Класс
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => {
                      setSchool(e.target.value);
                      if (onSaveProfileInfo) onSaveProfileInfo(name, e.target.value);
                    }}
                    placeholder="Например: МБОУ СОШ №12, 7А класс"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Участник: </span>
                  <strong className="text-white text-sm">{name || 'Участник Квантума'}</strong>
                  {school && <span className="text-cyan-400 ml-2">({school})</span>}
                </div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Готово к скачиванию
                </span>
              </div>
            )}
          </div>

          {/* High-Tech Certificate Image Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-2xl group">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Предпросмотр сертификата"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto rounded-2xl shadow-inner"
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                Формирование графики сертификата...
              </div>
            )}

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="px-4 py-2 rounded-xl bg-slate-900/90 text-cyan-300 border border-cyan-500/50 text-xs font-bold shadow-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Высокое разрешение 1920×1080 (HQ Render)
              </span>
            </div>
          </div>

          {/* Cert ID & Verification info */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">ID сертификата:</span>
              <code className="text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono font-bold">
                {certIdRef.current}
              </code>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Скопировать ID"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {isCopied && <span className="text-emerald-400 text-[10px] font-bold">Скопировано!</span>}
            </div>

            <div className="text-slate-400 text-[11px]">
              Дата выдачи: <strong className="text-slate-200">{currentDateStr}</strong>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Сертификат можно распечатать или прикрепить к школьному портфолио!
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Печать / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Скачать сертификат (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
