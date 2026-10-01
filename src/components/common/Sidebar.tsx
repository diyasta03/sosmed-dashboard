import React from 'react';
import {
  LayoutDashboard,
  TableProperties,
  Users,
  Building2,
  Trophy,
  LineChart,
  GitCompare,
  FileSpreadsheet,
  ShieldCheck,
  Settings,
  Bell,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export type NavView =
  | 'dashboard'
  | 'performance'
  | 'members'
  | 'commissions'
  | 'rankings'
  | 'analytics'
  | 'comparison'
  | 'reports'
  | 'data_quality'
  | 'settings';

interface SidebarProps {
  activeView: NavView;
  onNavigate: (view: NavView) => void;
  anomalyCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  anomalyCount,
  isOpen,
  onClose,
}) => {
  const navItems: Array<{ id: NavView; label: string; icon: React.ElementType; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'performance', label: 'Data Performa', icon: TableProperties },
    { id: 'rankings', label: 'Leaderboard & Skor', icon: Trophy },
    { id: 'comparison', label: 'Komparasi Periode', icon: GitCompare },
    { id: 'members', label: 'Anggota', icon: Users },
    { id: 'commissions', label: 'Komisi', icon: Building2 },
    { id: 'reports', label: 'Laporan Eksekutif', icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              S
            </div>
            <div>
              <h1 className="font-semibold text-sm text-white tracking-tight leading-tight">
                Social Media Dashbaord
              </h1>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight"></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 lg:hidden"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Menu Utama
          </div>
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="px-3 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Entitas & Manajemen
          </div>
          {navItems.slice(5).map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-xs bg-slate-950/40">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Database Status</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Aktif & Terhubung
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            Instagram & TikTok Engine · v1.2
          </div>
        </div>
      </aside>
    </>
  );
};
