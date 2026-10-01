import React from 'react';
import { Menu, Plus, Upload, Download, Bell, AlertTriangle } from 'lucide-react';
import { NavView } from './Sidebar';

interface TopbarProps {
  activeView: NavView;
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onTriggerExport: () => void;
  onNavigate: (view: NavView) => void;
  anomalyCount: number;
}

const VIEW_TITLES: Record<NavView, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Executive Dashboard',
    subtitle: 'Ikhtisar performa media sosial, metrik utama, dan capaian target organisasi.',
  },
  performance: {
    title: 'Data Performa Harian',
    subtitle: 'Kelola, filter, dan telusuri rekaman metrik Instagram & TikTok anggota.',
  },
  rankings: {
    title: 'Leaderboard & Scoring',
    subtitle: 'Peringkat dinamis berdasarkan views, interaksi, atau formula bobot performa.',
  },
  analytics: {
    title: 'Tren & Analisis Korelasi',
    subtitle: 'Grafik deret waktu multi-skala dan analisis korelasi aktivitas posting vs views.',
  },
  comparison: {
    title: 'Komparasi Antar-Periode',
    subtitle: 'Evaluasi pertumbuhan kinerja Periode A vs Periode B secara mendalam.',
  },
  members: {
    title: 'Manajemen Anggota',
    subtitle: 'Daftar personil, distribusi komisi, status keaktifan, dan profil individual.',
  },
  commissions: {
    title: 'Manajemen Komisi',
    subtitle: 'Analisis kontribusi komisi, perbandingan performa, dan personil kunci.',
  },
  reports: {
    title: 'Laporan Eksekutif',
    subtitle: 'Generate laporan berkala komprehensif siap cetak (PDF) dan Smart Excel.',
  },
  data_quality: {
    title: 'Audit Kualitas Data',
    subtitle: 'Diagnostik integritas data, anomali, deteksi duplikasi, dan kesehatan dataset.',
  },
  settings: {
    title: 'Pengaturan Sistem',
    subtitle: 'Konfigurasi bobot score performa, ambang batas anomali, dan target berkala.',
  },
};

export const Topbar: React.FC<TopbarProps> = ({
  activeView,
  onOpenMobileMenu,
  onOpenAddModal,
  onOpenImportModal,
  onTriggerExport,
  onNavigate,
  anomalyCount,
}) => {
  const current = VIEW_TITLES[activeView] || { title: 'Sistem Analitik', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {current.title}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block line-clamp-1">{current.subtitle}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {anomalyCount > 0 && (
          <button
            onClick={() => onNavigate('data_quality')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors"
            title={`${anomalyCount} anomali atau data perlu ditinjau`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold">{anomalyCount}</span>
            <span className="hidden md:inline">Alert</span>
          </button>
        )}

        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors"
          title="Upload file Excel (.xlsx, .xls, .csv)"
        >
          <Upload className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Import Excel</span>
        </button>

        <button
          onClick={onTriggerExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors"
          title="Download Smart Multi-Sheet Excel Report"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden md:inline">Smart Export</span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Input Data</span>
        </button>
      </div>
    </header>
  );
};
