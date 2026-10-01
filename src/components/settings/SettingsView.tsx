import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AppSettings } from '../../types';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetSeed: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetSeed,
}) => {
  const [wViews, setWViews] = useState(settings.weightViews);
  const [wER, setWER] = useState(settings.weightEngagement);
  const [wPosts, setWPosts] = useState(settings.weightPosting);
  const [dropThreshold, setDropThreshold] = useState(settings.anomalyDropThreshold);
  const [spikeThreshold, setSpikeThreshold] = useState(settings.anomalySpikeThreshold);
  const [defaultPeriod, setDefaultPeriod] = useState(settings.defaultPeriod);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalWeights = wViews + wER + wPosts;
  const isWeightValid = totalWeights === 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWeightValid) {
      alert('Total ketiga bobot performa harus berjumlah tepat 100%.');
      return;
    }

    onSaveSettings({
      weightViews: Number(wViews),
      weightEngagement: Number(wER),
      weightPosting: Number(wPosts),
      anomalyDropThreshold: Number(dropThreshold),
      anomalySpikeThreshold: Number(spikeThreshold),
      defaultPeriod,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-1">
          <SettingsIcon className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-base text-slate-900">
            Konfigurasi Sistem & Parameter Algoritma
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Atur bobot komputasi ranking, ambang batas deteksi anomali, dan parameter default
        </p>

        {savedSuccess && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-2">
            <span>✓ Pengaturan berhasil disimpan dan langsung diterapkan ke seluruh sistem.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* 1. Score Weights */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">
                  Bobot Formula Performance Score
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Nilai total harus selalu 100% agar perhitungan ranking akurat.
                </p>
              </div>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                  isWeightValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                Total: {totalWeights}% {isWeightValid ? '✓' : '(Belum 100%)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Views Weight (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={wViews}
                  onChange={(e) => setWViews(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Engagement Rate Weight (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={wER}
                  onChange={(e) => setWER(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Posting Consistency Weight (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={wPosts}
                  onChange={(e) => setWPosts(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* 2. Anomaly Thresholds */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900">
                Ambang Batas Deteksi Anomali (Performance Alerts)
              </h4>
              <p className="text-slate-500 text-[11px]">
                Tentukan sensitivitas pemicu peringatan saat mendeteksi deviasi data.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Ambang Penurunan Views Kritis (%)
                </label>
                <input
                  type="number"
                  min={5}
                  max={90}
                  value={dropThreshold}
                  onChange={(e) => setDropThreshold(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Peringatan dipicu jika views turun melebihi nilai ini vs rata-rata.
                </span>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Ambang Lonjakan Luar Biasa / Spike (%)
                </label>
                <input
                  type="number"
                  min={20}
                  max={500}
                  value={spikeThreshold}
                  onChange={(e) => setSpikeThreshold(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Peringatan dipicu jika views melonjak di luar pola lazim.
                </span>
              </div>
            </div>
          </div>

          {/* 3. Default Period */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-semibold text-slate-900">Periode Default Dashboard</h4>
            <select
              value={defaultPeriod}
              onChange={(e) => setDefaultPeriod(e.target.value)}
              className="w-full max-w-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="this_month">Bulan Ini (Default: September 2026)</option>
              <option value="last_month">Bulan Lalu (Agustus 2026)</option>
              <option value="this_week">Minggu Ini</option>
              <option value="this_year">Tahun 2026 (YTD)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="submit"
              disabled={!isWeightValid}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger zone / Reset Demo Data */}
      <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-xs text-rose-950 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Reset Database ke Dataset Demo Realistis</span>
          </h4>
          <p className="text-[11px] text-rose-700 mt-0.5">
            Mengembalikan seluruh data anggota, komisi, dan ratusan rekaman historis Agustus-September 2026 ke kondisi awal.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Yakin ingin mereset seluruh database ke dataset awal?')) {
              onResetSeed();
            }
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-300 hover:bg-rose-100 rounded-lg shadow-2xs transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
