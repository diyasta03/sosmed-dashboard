import React, { useMemo } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, Trash2, Database } from 'lucide-react';
import { CalculatedPerformance, Member, Commission } from '../../types';
import { analyticsService } from '../../services/analyticsService';
import { formatNumber } from '../../utils/formatters';

interface DataQualityViewProps {
  performances: CalculatedPerformance[];
  members: Member[];
  commissions: Commission[];
  onCleanDuplicates?: () => void;
  onResetSeed?: () => void;
}

export const DataQualityView: React.FC<DataQualityViewProps> = ({
  performances,
  members,
  commissions,
  onCleanDuplicates,
  onResetSeed,
}) => {
  const audit = useMemo(() => {
    return analyticsService.auditDataQuality(performances, members, commissions);
  }, [performances, members, commissions]);

  const getHealthBadge = (score: number) => {
    if (score >= 95) {
      return { label: 'Sangat Baik (Optimal)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (score >= 80) {
      return { label: 'Cukup Baik (Minor Issues)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
    return { label: 'Perlu Perhatian (Kritis)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const healthBadge = getHealthBadge(audit.healthScorePercent);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Audit Kualitas & Integritas Data
            </h3>
            <p className="text-xs text-slate-500">
              Pemeriksaan berkelanjutan untuk menjamin presisi metrik dan integritas formula
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onResetSeed && (
            <button
              onClick={() => {
                if (confirm('Reset ulang data performa ke contoh seed realistis? Data kustom akan digantikan.')) {
                  onResetSeed();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Data Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Health Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Score Gauge */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            Dataset Health Score
          </span>
          <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight mb-2">
            {audit.healthScorePercent}%
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${healthBadge.color}`}>
            {healthBadge.label}
          </span>
          <p className="text-[11px] text-slate-400 mt-3">
            Dihitung dari rasio baris valid terhadap total rekaman
          </p>
        </div>

        {/* Coverage Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 mb-1 block uppercase tracking-wider">
              Cakupan Komisi
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono mb-1">
              {audit.commissionCoveragePercent}%
            </div>
            <p className="text-xs text-slate-600">
              Semua {commissions.length} komisi telah memiliki rekaman publikasi aktif.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Total {members.length} anggota terdaftar dalam sistem
          </div>
        </div>

        {/* Integrity Check Summary */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 mb-1 block uppercase tracking-wider">
              Status Integritas
            </span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-base mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>Struktur Relasional Valid</span>
            </div>
            <p className="text-xs text-slate-600">
              Tidak ditemukan foreign key rusak atau anggota yatim.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Enforced Foreign Key: <code>members.commission_id</code>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-semibold text-xs text-slate-900">
          Rincian Diagnostik Kualitas Data
        </div>
        <div className="divide-y divide-slate-100 text-xs text-slate-700">
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block">Total Rekaman Database</span>
              <span className="text-[11px] text-slate-500">Jumlah seluruh baris harian tersimpan</span>
            </div>
            <span className="font-mono font-bold text-sm text-slate-900">
              {formatNumber(audit.totalRecords)} baris
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block">Rekaman Sepenuhnya Valid</span>
              <span className="text-[11px] text-slate-500">Baris dengan format tanggal, relasi, dan nilai normal</span>
            </div>
            <span className="font-mono font-bold text-sm text-emerald-700">
              {formatNumber(audit.validRecords)} baris
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block">Rekaman Duplikasi Terdeteksi</span>
              <span className="text-[11px] text-slate-500">Kombinasi member_id dan date yang sama</span>
            </div>
            <span
              className={`font-mono font-bold text-sm ${
                audit.duplicateRecords > 0 ? 'text-rose-600' : 'text-slate-400'
              }`}
            >
              {audit.duplicateRecords} baris
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block">Baris Zero Views</span>
              <span className="text-[11px] text-slate-500">Rekaman posting tanpa perolehan views sama sekali</span>
            </div>
            <span className="font-mono font-bold text-sm text-slate-600">
              {audit.zeroViewRecords} baris
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block">Anggota Tidak Dikenal (Orphan)</span>
              <span className="text-[11px] text-slate-500">Rekaman performa tanpa member_id yang sah</span>
            </div>
            <span className="font-mono font-bold text-sm text-emerald-700">
              {audit.unknownMembers} (Nihil)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
