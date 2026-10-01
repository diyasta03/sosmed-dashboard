import React, { useState } from 'react';
import { Target, Edit3, Check, X } from 'lucide-react';
import { PerformanceTarget, MetricSummary } from '../../types';
import { formatNumber, formatCompact } from '../../utils/formatters';

interface TargetProgressCardProps {
  target?: PerformanceTarget;
  summary: MetricSummary;
  onUpdateTarget: (newTarget: { targetViews: number; targetPosts: number; targetEngagementRate: number }) => void;
}

export const TargetProgressCard: React.FC<TargetProgressCardProps> = ({
  target,
  summary,
  onUpdateTarget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editViews, setEditViews] = useState(target?.targetViews || 2500000);
  const [editPosts, setEditPosts] = useState(target?.targetPosts || 280);
  const [editER, setEditER] = useState(target?.targetEngagementRate || 6.5);

  const tViews = target?.targetViews || 2500000;
  const tPosts = target?.targetPosts || 280;
  const tER = target?.targetEngagementRate || 6.5;

  const viewsPct = Math.min(200, Math.round((summary.totalViews / tViews) * 100));
  const postsPct = Math.min(200, Math.round((summary.totalPosts / tPosts) * 100));
  const erPct = Math.min(200, Math.round((summary.overallEngagementRate / tER) * 100));

  const handleSave = () => {
    onUpdateTarget({
      targetViews: Number(editViews) || 1000000,
      targetPosts: Number(editPosts) || 100,
      targetEngagementRate: Number(editER) || 5.0,
    });
    setIsEditing(false);
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 100) return 'bg-emerald-500';
    if (pct >= 75) return 'bg-indigo-600';
    if (pct >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 leading-tight">
              Pencapaian Target KPI Organisasi
            </h3>
            <p className="text-xs text-slate-500">
              Periode target berjalan · Realisasi data aktual terhadap sasaran strategis
            </p>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Atur Target</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs bg-indigo-600 text-white font-medium px-2.5 py-1 rounded-md hover:bg-indigo-700"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 mb-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Target Views</label>
            <input
              type="number"
              value={editViews}
              onChange={(e) => setEditViews(Number(e.target.value))}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Target Posts</label>
            <input
              type="number"
              value={editPosts}
              onChange={(e) => setEditPosts(Number(e.target.value))}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Target ER (%)</label>
            <input
              type="number"
              step="0.1"
              value={editER}
              onChange={(e) => setEditER(Number(e.target.value))}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Target Views */}
          <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600">Target Views</span>
              <span className="font-semibold text-slate-900">
                {formatCompact(summary.totalViews)} / {formatCompact(tViews)} ({viewsPct}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(viewsPct)}`}
                style={{ width: `${Math.min(100, viewsPct)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>{formatNumber(summary.totalViews)} tercapai</span>
              <span>Sasaran {formatNumber(tViews)}</span>
            </div>
          </div>

          {/* Target Posts */}
          <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600">Target Posting</span>
              <span className="font-semibold text-slate-900">
                {summary.totalPosts} / {tPosts} ({postsPct}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(postsPct)}`}
                style={{ width: `${Math.min(100, postsPct)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>{summary.totalPosts} dipublikasikan</span>
              <span>Sasaran {tPosts} posts</span>
            </div>
          </div>

          {/* Target ER */}
          <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600">Target Engagement Rate</span>
              <span className="font-semibold text-slate-900">
                {summary.overallEngagementRate}% / {tER}% ({erPct}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(erPct)}`}
                style={{ width: `${Math.min(100, erPct)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Realisasi {summary.overallEngagementRate}%</span>
              <span>Standar {tER}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
