import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Member, Commission, SocialMediaPerformance } from '../../types';
import { excelService, ExcelImportStagingResult } from '../../services/excelService';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (
    records: Omit<SocialMediaPerformance, 'id' | 'createdAt' | 'updatedAt'>[],
    onDuplicate: 'skip' | 'update'
  ) => void;
  existingMembers: Member[];
  existingPerformances: SocialMediaPerformance[];
  commissions: Commission[];
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onConfirmImport,
  existingMembers,
  existingPerformances,
  commissions,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stagingResult, setStagingResult] = useState<ExcelImportStagingResult | null>(null);
  const [onDuplicateAction, setOnDuplicateAction] = useState<'skip' | 'update'>('skip');
  const [activeTab, setActiveTab] = useState<'summary' | 'invalid' | 'duplicates'>('summary');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    await processFile(selected);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    setFile(dropped);
    await processFile(dropped);
  };

  const processFile = async (f: File) => {
    setIsProcessing(true);
    try {
      const result = await excelService.parseExcelFile(f, existingMembers, existingPerformances);
      setStagingResult(result);
    } catch (err: any) {
      alert(`Gagal memproses file Excel: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommit = () => {
    if (!stagingResult) return;

    let recordsToImport = [...stagingResult.validRows];
    if (onDuplicateAction === 'update') {
      recordsToImport = [...recordsToImport, ...stagingResult.duplicateRows];
    }

    onConfirmImport(recordsToImport, onDuplicateAction);

    // Celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900">
                Import Data Performa Excel (.xlsx / .csv)
              </h3>
              <p className="text-xs text-slate-500">
                Verifikasi integritas otomatis sebelum commit ke database produksi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Download Template Bar */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-indigo-950 block">Butuh format template?</span>
              <span className="text-indigo-800 text-[11px]">
                Gunakan template resmi kami yang sudah disesuaikan dengan daftar anggota.
              </span>
            </div>
            <button
              onClick={() => excelService.downloadSampleTemplate(existingMembers, commissions)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-100/60 border border-indigo-200 rounded-lg shadow-2xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Upload Area */}
          {!stagingResult && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800 mb-1">
                {isProcessing ? 'Sedang Membaca & Memvalidasi Berkas...' : 'Pilih Berkas atau Tarik ke Sini'}
              </p>
              <p className="text-[11px] text-slate-500 mb-3">
                Mendukung file Excel (.xlsx, .xls) atau CSV (Maks. 10MB)
              </p>
              <span className="inline-block px-3 py-1 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg shadow-2xs">
                Pilih Dokumen
              </span>
            </div>
          )}

          {/* Staging Result Breakdown */}
          {stagingResult && (
            <div className="space-y-4">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Total Baris</span>
                  <span className="font-bold text-base text-slate-900 font-mono">
                    {stagingResult.totalRows}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <span className="text-[11px] text-emerald-700 block">Valid</span>
                  <span className="font-bold text-base font-mono">
                    {stagingResult.validRows.length}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  <span className="text-[11px] text-amber-700 block">Duplikat</span>
                  <span className="font-bold text-base font-mono">
                    {stagingResult.duplicateRows.length}
                  </span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
                  <span className="text-[11px] text-rose-700 block">Invalid Error</span>
                  <span className="font-bold text-base font-mono">
                    {stagingResult.invalidRows.length}
                  </span>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-3 py-1 rounded-md font-medium ${
                    activeTab === 'summary' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ringkasan & Opsi
                </button>
                {stagingResult.invalidRows.length > 0 && (
                  <button
                    onClick={() => setActiveTab('invalid')}
                    className={`px-3 py-1 rounded-md font-medium ${
                      activeTab === 'invalid'
                        ? 'bg-rose-600 text-white'
                        : 'text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    Daftar Error ({stagingResult.invalidRows.length})
                  </button>
                )}
                {stagingResult.duplicateRows.length > 0 && (
                  <button
                    onClick={() => setActiveTab('duplicates')}
                    className={`px-3 py-1 rounded-md font-medium ${
                      activeTab === 'duplicates'
                        ? 'bg-amber-600 text-white'
                        : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    Data Duplikat ({stagingResult.duplicateRows.length})
                  </button>
                )}
              </div>

              {/* Tab 1: Summary & Duplicate Policy */}
              {activeTab === 'summary' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="font-semibold text-slate-800 block mb-2">
                      Kebijakan Rekaman Duplikat (Anggota & Tanggal yang Sama):
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="duplicateAction"
                          value="skip"
                          checked={onDuplicateAction === 'skip'}
                          onChange={() => setOnDuplicateAction('skip')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>
                          <strong>Lewati Duplikat (Disarankan):</strong> Pertahankan data yang sudah ada di database, lewati baris duplikat dari berkas.
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="duplicateAction"
                          value="update"
                          checked={onDuplicateAction === 'update'}
                          onChange={() => setOnDuplicateAction('update')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>
                          <strong>Perbarui Data Lama (Overwrite):</strong> Timpa metrik di database dengan nilai dari file Excel yang diunggah.
                        </span>
                      </label>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    * Baris dengan status <strong>Invalid Error</strong> tidak akan disimpan untuk menjaga kualitas data.
                  </p>
                </div>
              )}

              {/* Tab 2: Invalid Rows List */}
              {activeTab === 'invalid' && (
                <div className="max-h-56 overflow-y-auto border border-rose-200 rounded-xl divide-y divide-rose-100 text-xs">
                  {stagingResult.invalidRows.map((err, i) => (
                    <div key={i} className="p-2.5 bg-rose-50/40">
                      <div className="flex items-center justify-between text-rose-950 font-semibold mb-1">
                        <span>
                          Baris #{err.rowNumber} · {err.memberName} ({err.date})
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">
                          {err.field}
                        </span>
                      </div>
                      <p className="text-rose-700 text-[11px]">{err.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Duplicates List */}
              {activeTab === 'duplicates' && (
                <div className="max-h-56 overflow-y-auto border border-amber-200 rounded-xl divide-y divide-amber-100 text-xs">
                  {stagingResult.duplicateRows.map((dup, i) => (
                    <div key={i} className="p-2.5 bg-amber-50/40 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800">
                          Baris #{dup.rowNumber} · {dup.memberName}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          Tanggal: {dup.date} · Posts: {dup.posts}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-amber-800 font-semibold px-2 py-0.5 rounded bg-amber-200">
                        Record Sudah Ada
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {stagingResult ? (
            <button
              onClick={() => {
                setStagingResult(null);
                setFile(null);
              }}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ganti File</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>

            {stagingResult && (
              <button
                onClick={handleCommit}
                disabled={stagingResult.validRows.length === 0 && onDuplicateAction === 'skip'}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>
                  Konfirmasi Import (
                  {onDuplicateAction === 'update'
                    ? stagingResult.validRows.length + stagingResult.duplicateRows.length
                    : stagingResult.validRows.length}{' '}
                  Baris)
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
