import React, { useState } from 'react';
import {
  Trophy,
  Sliders,
  HelpCircle,
  TrendingUp,
  ArrowUpDown,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { MemberRankingItem } from '../../services/analyticsService';
import { AppSettings, Commission } from '../../types';
import { formatNumber, formatCompact } from '../../utils/formatters';

interface RankingsViewProps {
  memberRankings: MemberRankingItem[];
  rankBy: 'views' | 'likes' | 'comments' | 'posts' | 'er' | 'score';
  onRankByChange: (rankBy: 'views' | 'likes' | 'comments' | 'posts' | 'er' | 'score') => void;
  settings: AppSettings;
  onUpdateWeights: (weights: { weightViews: number; weightEngagement: number; weightPosting: number }) => void;
  commissions: Commission[];
  selectedCommissionId: string;
  onCommissionChange: (id: string) => void;
}

export const RankingsView: React.FC<RankingsViewProps> = ({
  memberRankings,
  rankBy,
  onRankByChange,
  settings,
  onUpdateWeights,
  commissions,
  selectedCommissionId,
  onCommissionChange,
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showWeightSliders, setShowWeightSliders] = useState(false);

  // Temporary weight state for slider editing
  const [wViews, setWViews] = useState(settings.weightViews);
  const [wER, setWER] = useState(settings.weightEngagement);
  const [wPosts, setWPosts] = useState(settings.weightPosting);

  const totalWeight = wViews + wER + wPosts;
  const isWeightValid = totalWeight === 100;

  const handleApplyWeights = () => {
    if (!isWeightValid) return;
    onUpdateWeights({
      weightViews: wViews,
      weightEngagement: wER,
      weightPosting: wPosts,
    });
    setShowWeightSliders(false);
  };

  const handleResetWeights = () => {
    setWViews(40);
    setWER(40);
    setWPosts(20);
    onUpdateWeights({
      weightViews: 40,
      weightEngagement: 40,
      weightPosting: 20,
    });
  };

  // Filter rankings by commission if selected
  const displayRankings = selectedCommissionId
    ? memberRankings.filter((m) => m.commissionId === selectedCommissionId)
    : memberRankings;

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <span className="text-[11px] font-semibold text-slate-500 px-2 uppercase tracking-wider">
            Urut Berdasarkan:
          </span>
          <button
            onClick={() => onRankByChange('score')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
              rankBy === 'score'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Performance Score</span>
          </button>
          <button
            onClick={() => onRankByChange('views')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              rankBy === 'views'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Views
          </button>
          <button
            onClick={() => onRankByChange('er')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              rankBy === 'er'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Engagement Rate
          </button>
          <button
            onClick={() => onRankByChange('likes')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              rankBy === 'likes'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Likes
          </button>
          <button
            onClick={() => onRankByChange('comments')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              rankBy === 'comments'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => onRankByChange('posts')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              rankBy === 'posts'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Posting
          </button>
        </div>

        {/* Buttons: Config Weights & Formula Modal */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFormulaModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Rumus Skor</span>
          </button>

          <button
            onClick={() => setShowWeightSliders(!showWeightSliders)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              showWeightSliders
                ? 'bg-slate-900 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Bobot Skor ({settings.weightViews}:{settings.weightEngagement}:{settings.weightPosting})</span>
          </button>
        </div>
      </div>

      {/* Collapsible Sliders for Performance Score Weights */}
      {showWeightSliders && (
        <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-xs text-slate-900">
                Sesuaikan Bobot Formula Performance Score
              </h4>
              <p className="text-[11px] text-slate-500">
                Total persentase ketiga komponen harus berjumlah tepat 100%.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded ${
                  isWeightValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                Total: {totalWeight}% {isWeightValid ? '✓' : '(Harus 100%)'}
              </span>
              <button
                onClick={handleResetWeights}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
                title="Reset ke default (40-40-20)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Views Slider */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Views Weight</span>
                <span className="font-mono font-bold text-indigo-700">{wViews}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={wViews}
                onChange={(e) => setWViews(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* ER Slider */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Engagement Rate Weight</span>
                <span className="font-mono font-bold text-indigo-700">{wER}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={wER}
                onChange={(e) => setWER(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Posting Slider */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Posting Consistency Weight</span>
                <span className="font-mono font-bold text-indigo-700">{wPosts}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={wPosts}
                onChange={(e) => setWPosts(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowWeightSliders(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Tutup
            </button>
            <button
              onClick={handleApplyWeights}
              disabled={!isWeightValid}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg shadow-xs"
            >
              Terapkan Bobot
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Nama Anggota</th>
                <th className="py-3 px-4">Komisi</th>
                <th className="py-3 px-4 text-right">Performance Score</th>
                <th className="py-3 px-4 text-right">Total Views</th>
                <th className="py-3 px-4 text-right">Engagement Rate</th>
                <th className="py-3 px-4 text-right">Likes</th>
                <th className="py-3 px-4 text-right">Comments</th>
                <th className="py-3 px-4 text-center">Posting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayRankings.map((m, idx) => (
                <tr
                  key={m.memberId}
                  className={`hover:bg-slate-50 transition-colors ${
                    idx === 0 ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono font-bold text-xs ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{m.memberName}</div>
                    <div className="text-[10px] text-slate-400">ID: {m.memberId}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {m.commissionName.split('-')[0].trim()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-indigo-700 text-sm font-mono block">
                      {m.performanceScore} pts
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (v:{m.normalizedViews} e:{m.normalizedER} p:{m.normalizedPosts})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                    {formatNumber(m.totalViews)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    {m.overallEngagementRate}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    {formatNumber(m.totalLikes)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    {formatNumber(m.totalComments)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-800 text-[11px]">
                      {m.totalPosts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula Transparency Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Formula Performance Score
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-700 leading-relaxed">
              <p>
                Sistem tidak menggunakan angka acak atau hardcoded. Performance Score dihitung menggunakan metode <strong>Min-Max Normalization</strong> dengan rentang nilai [0 - 1], kemudian dikalikan dengan bobot terkonfigurasi:
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 text-[11px]">
                Score = (W_views × NormViews + W_er × NormER + W_posts × NormPosts) × 100
              </div>

              <div>
                <strong>Konfigurasi Bobot Saat Ini:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                  <li>Views = {settings.weightViews}% (Volume jangkauan pemirsa)</li>
                  <li>Engagement Rate = {settings.weightEngagement}% (Relevansi & kualitas interaksi)</li>
                  <li>Posting = {settings.weightPosting}% (Konsistensi publikasi konten)</li>
                </ul>
              </div>

              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 text-[11px]">
                <strong>Transparansi:</strong> Nilai normalisasi dihitung relatif terhadap performa tertinggi dan terendah pada kelompok anggota di periode aktif yang sama.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
