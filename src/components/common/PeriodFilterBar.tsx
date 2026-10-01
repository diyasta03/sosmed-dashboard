import React, { useState } from 'react';
import { Calendar, Filter, ChevronDown } from 'lucide-react';
import { PeriodFilter, Commission } from '../../types';

interface PeriodFilterBarProps {
  currentFilter: PeriodFilter;
  onFilterChange: (filter: PeriodFilter) => void;
  commissions: Commission[];
  selectedCommissionId: string;
  onCommissionChange: (id: string) => void;
}

export const PeriodFilterBar: React.FC<PeriodFilterBarProps> = ({
  currentFilter,
  onFilterChange,
  commissions,
  selectedCommissionId,
  onCommissionChange,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStart, setCustomStart] = useState(currentFilter.startDate);
  const [customEnd, setCustomEnd] = useState(currentFilter.endDate);

  const presets: Array<{ type: PeriodFilter['type']; label: string }> = [
    { type: 'this_month', label: 'Bulan Ini' },
    { type: 'last_month', label: 'Bulan Lalu' },
    { type: 'this_week', label: 'Minggu Ini' },
    { type: 'today', label: 'Hari Ini' },
    { type: 'this_year', label: 'Tahun 2026' },
  ];

  const handlePresetClick = (type: PeriodFilter['type']) => {
    if (type === 'this_month') {
      onFilterChange({
        type: 'this_month',
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        label: 'September 2026',
      });
    } else if (type === 'last_month') {
      onFilterChange({
        type: 'last_month',
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        label: 'Agustus 2026',
      });
    } else if (type === 'this_week') {
      onFilterChange({
        type: 'this_week',
        startDate: '2026-09-21',
        endDate: '2026-09-27',
        label: 'Minggu Ini (21 - 27 Sep)',
      });
    } else if (type === 'today') {
      onFilterChange({
        type: 'today',
        startDate: '2026-09-27',
        endDate: '2026-09-27',
        label: 'Hari Ini (27 Sep 2026)',
      });
    } else if (type === 'this_year') {
      onFilterChange({
        type: 'this_year',
        startDate: '2026-01-01',
        endDate: '2026-09-27',
        label: 'Tahun 2026 YTD',
      });
    }
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    onFilterChange({
      type: 'custom',
      startDate: customStart,
      endDate: customEnd,
      label: `${customStart} s/d ${customEnd}`,
    });
    setShowCustomModal(false);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Presets Button Segment */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
        {presets.map((p) => {
          const isActive = currentFilter.type === p.type;
          return (
            <button
              key={p.type}
              onClick={() => handlePresetClick(p.type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {p.label}
            </button>
          );
        })}

        <button
          onClick={() => setShowCustomModal(true)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
            currentFilter.type === 'custom'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Kustom...</span>
        </button>
      </div>

      {/* Date display & Commission filter */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Active Range Display */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-medium text-slate-900">{currentFilter.label}</span>
          <span className="text-slate-400 font-mono">[{currentFilter.startDate} - {currentFilter.endDate}]</span>
        </div>

        {/* Commission Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCommissionId}
            onChange={(e) => onCommissionChange(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Semua Komisi</option>
            {commissions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Pilih Rentang Tanggal Kustom
            </h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleApplyCustom}
                className="px-4 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
