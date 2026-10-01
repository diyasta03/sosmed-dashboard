import React, { useState } from 'react';
import {
  TrendingUp,
  Share2,
  Activity,
  Layers,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { TimeSeriesPoint } from '../../services/analyticsService';
import { MetricSummary } from '../../types';
import { formatNumber, formatCompact } from '../../utils/formatters';

interface ChartsSectionProps {
  timeSeries: TimeSeriesPoint[];
  summary: MetricSummary;
}

export type ChartMetric = 'views' | 'likes' | 'comments' | 'posts' | 'er';

export const ChartsSection: React.FC<ChartsSectionProps> = ({ timeSeries, summary }) => {
  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('views');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Platform share calculation
  const totalViews = summary.totalViews || 1;
  const igShare = ((summary.totalInstagramViews / totalViews) * 100);
  const ttShare = ((summary.totalTiktokViews / totalViews) * 100);

  // Prep data points
  const points = timeSeries.slice(-30); // show last 30 data points for clarity
  const values = points.map((p) => {
    if (selectedMetric === 'likes') return p.likes;
    if (selectedMetric === 'comments') return p.comments;
    if (selectedMetric === 'posts') return p.posts;
    if (selectedMetric === 'er') return p.engagementRate;
    return p.views;
  });

  const maxValue = Math.max(...values, 10);
  const chartHeight = 200;
  const chartWidth = 600;

  // Generate SVG path for line/area
  const getCoordinates = (val: number, idx: number) => {
    const x = points.length <= 1 ? chartWidth / 2 : (idx / (points.length - 1)) * chartWidth;
    const y = chartHeight - (val / maxValue) * (chartHeight - 30) - 15;
    return { x, y };
  };

  const coords = points.map((p, idx) => getCoordinates(values[idx], idx));
  const linePath = coords.length > 0
    ? `M ${coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' L ')}`
    : '';
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)},${chartHeight} L ${coords[0].x.toFixed(1)},${chartHeight} Z`
    : '';

  const getMetricLabel = () => {
    if (selectedMetric === 'likes') return 'Total Likes';
    if (selectedMetric === 'comments') return 'Total Comments';
    if (selectedMetric === 'posts') return 'Frekuensi Posting';
    if (selectedMetric === 'er') return 'Engagement Rate (%)';
    return 'Total Views';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Main Chart (Trend with Metric Selector) - 2 cols */}
      <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-sm text-slate-900">
                Tren Performa Harian
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Perkembangan metrik {getMetricLabel()} sepanjang periode aktif
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs self-stretch sm:self-auto justify-between">
            <button
              onClick={() => setSelectedMetric('views')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedMetric === 'views'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Views
            </button>
            <button
              onClick={() => setSelectedMetric('likes')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedMetric === 'likes'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Likes
            </button>
            <button
              onClick={() => setSelectedMetric('comments')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedMetric === 'comments'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setSelectedMetric('posts')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedMetric === 'posts'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setSelectedMetric('er')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedMetric === 'er'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ER (%)
            </button>
          </div>
        </div>

        {/* Chart Viewport */}
        {points.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            Tidak ada rekaman data pada rentang tanggal ini.
          </div>
        ) : (
          <div className="relative pt-2">
            {/* SVG Trend Line */}
            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-52 overflow-visible"
              >
                <defs>
                  <linearGradient id="metricGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight - 15} x2={chartWidth} y2={chartHeight - 15} stroke="#e2e8f0" />

                {/* Area fill */}
                <path d={areaPath} fill="url(#metricGradient)" />

                {/* Line stroke */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points & hover triggers */}
                {coords.map((c, i) => (
                  <g key={i}>
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={hoveredIndex === i ? 5 : 2.5}
                      fill={hoveredIndex === i ? '#312e81' : '#4f46e5'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Hover Tooltip display */}
            <div className="h-6 mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              {hoveredIndex !== null && points[hoveredIndex] ? (
                <div className="flex items-center gap-3 font-medium text-slate-800">
                  <span className="font-mono text-indigo-600">{points[hoveredIndex].date}</span>
                  <span>
                    {getMetricLabel()}:{' '}
                    <strong>
                      {selectedMetric === 'er'
                        ? `${points[hoveredIndex].engagementRate}%`
                        : formatNumber(values[hoveredIndex])}
                    </strong>
                  </span>
                  {selectedMetric === 'views' && (
                    <span className="text-slate-400 font-normal">
                      (IG: {formatCompact(points[hoveredIndex].instagramViews)} · TT:{' '}
                      {formatCompact(points[hoveredIndex].tiktokViews)})
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Arahkan kursor ke titik grafik untuk rincian harian
                </div>
              )}

              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Min: {selectedMetric === 'er' ? `${Math.min(...values).toFixed(1)}%` : formatCompact(Math.min(...values))}</span>
                <span>·</span>
                <span>Max: {selectedMetric === 'er' ? `${maxValue.toFixed(1)}%` : formatCompact(maxValue)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Platform Comparison (Instagram vs TikTok) - 1 col */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold text-sm text-slate-900">
              Instagram vs TikTok
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Komparasi jangkauan audiens & interaksi kedua platform
          </p>

          {/* Visual Progress Bar Ratio */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-pink-600">Instagram {igShare.toFixed(1)}%</span>
              <span className="text-slate-900">TikTok {ttShare.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-500"
                style={{ width: `${igShare}%` }}
                title={`Instagram: ${formatNumber(summary.totalInstagramViews)} views`}
              />
              <div
                className="bg-slate-900 h-full transition-all duration-500"
                style={{ width: `${ttShare}%` }}
                title={`TikTok: ${formatNumber(summary.totalTiktokViews)} views`}
              />
            </div>
          </div>

          {/* Comparative Metrics Table */}
          <div className="space-y-3 text-xs">
            {/* Views Comparison */}
            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Total Views</span>
                <span className="font-semibold text-slate-800">
                  {formatCompact(summary.totalInstagramViews)} vs {formatCompact(summary.totalTiktokViews)}
                </span>
              </div>
              <span className="font-mono text-slate-600 font-medium">
                {summary.totalTiktokViews > summary.totalInstagramViews
                  ? `TikTok +${formatCompact(summary.totalTiktokViews - summary.totalInstagramViews)}`
                  : `IG +${formatCompact(summary.totalInstagramViews - summary.totalTiktokViews)}`}
              </span>
            </div>

            {/* Engagement Rate Comparison */}
            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Engagement Rate</span>
                <span className="font-semibold text-slate-800">
                  IG {summary.instagramEngagementRate}% vs TT {summary.tiktokEngagementRate}%
                </span>
              </div>
              <span
                className={`font-semibold ${
                  summary.tiktokEngagementRate > summary.instagramEngagementRate
                    ? 'text-emerald-700'
                    : 'text-indigo-700'
                }`}
              >
                {summary.tiktokEngagementRate > summary.instagramEngagementRate ? 'TT Lebih Aktif' : 'IG Lebih Aktif'}
              </span>
            </div>

            {/* Total Interactions (Likes + Comments) */}
            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Interaksi (Likes + Comments)</span>
                <span className="font-semibold text-slate-800">
                  IG {formatCompact(summary.totalInstagramLikes + summary.totalInstagramComments)} · TT{' '}
                  {formatCompact(summary.totalTiktokLikes + summary.totalTiktokComments)}
                </span>
              </div>
              <span className="text-slate-600 font-medium font-mono">
                {formatNumber(summary.totalLikes + summary.totalComments)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          Formula ER: <code className="font-mono text-slate-700">(Likes + Comments) / Views × 100</code>
        </div>
      </div>
    </div>
  );
};
