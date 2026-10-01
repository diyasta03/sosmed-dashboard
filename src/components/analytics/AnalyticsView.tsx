import React, { useState, useMemo } from 'react';
import { LineChart, BarChart2, ScatterChart as ScatterIcon, Activity, Calendar, Info } from 'lucide-react';
import { CalculatedPerformance, Member } from '../../types';
import { analyticsService, TimeSeriesPoint, CorrelationPoint } from '../../services/analyticsService';
import { formatNumber, formatCompact } from '../../utils/formatters';

interface AnalyticsViewProps {
  performances: CalculatedPerformance[];
  members: Member[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ performances, members }) => {
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'likes' | 'comments' | 'posts' | 'er'>('views');
  const [hoveredScatter, setHoveredScatter] = useState<CorrelationPoint | null>(null);

  // Time series points based on granularity
  const timeSeries = useMemo(() => {
    return analyticsService.getTimeSeries(performances, granularity);
  }, [performances, granularity]);

  // Scatter correlation points
  const correlationData = useMemo(() => {
    return analyticsService.getScatterCorrelation(performances, members);
  }, [performances, members]);

  // Time Series SVG Dimensions
  const chartHeight = 220;
  const chartWidth = 700;
  const tsValues = timeSeries.map((p) => {
    if (selectedMetric === 'likes') return p.likes;
    if (selectedMetric === 'comments') return p.comments;
    if (selectedMetric === 'posts') return p.posts;
    if (selectedMetric === 'er') return p.engagementRate;
    return p.views;
  });
  const maxTS = Math.max(...tsValues, 10);

  // Scatter SVG Dimensions
  const scatterHeight = 260;
  const scatterWidth = 600;
  const maxPosts = Math.max(...correlationData.points.map((p) => p.posts), 10);
  const maxViews = Math.max(...correlationData.points.map((p) => p.views), 50000);

  return (
    <div className="space-y-6">
      {/* 1. Historical Trends with Granularity Switcher */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-sm text-slate-900">
                Analisis Deret Waktu Historis
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Evaluasi fluktuasi kinerja performa antar waktu dengan agregasi dinamis
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Granularity switch */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setGranularity('daily')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  granularity === 'daily'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Harian
              </button>
              <button
                onClick={() => setGranularity('weekly')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  granularity === 'weekly'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mingguan
              </button>
              <button
                onClick={() => setGranularity('monthly')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  granularity === 'monthly'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulanan
              </button>
            </div>

            {/* Metric switch */}
            <select
              value={selectedMetric}
              onChange={(e: any) => setSelectedMetric(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="views">Metrik: Views</option>
              <option value="likes">Metrik: Likes</option>
              <option value="comments">Metrik: Comments</option>
              <option value="posts">Metrik: Posting</option>
              <option value="er">Metrik: Engagement Rate (%)</option>
            </select>
          </div>
        </div>

        {/* Time series SVG bars / lines */}
        {timeSeries.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            Tidak ada rekaman untuk periode ini.
          </div>
        ) : (
          <div>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 overflow-visible">
              {/* Reference Grid lines */}
              <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight - 25} x2={chartWidth} y2={chartHeight - 25} stroke="#cbd5e1" />

              {/* Render bars */}
              {timeSeries.map((pt, i) => {
                const barWidth = Math.max(6, (chartWidth / timeSeries.length) * 0.65);
                const x = (i / timeSeries.length) * chartWidth + (chartWidth / timeSeries.length - barWidth) / 2;
                const val = tsValues[i];
                const h = (val / maxTS) * (chartHeight - 50);
                const y = chartHeight - 25 - h;

                return (
                  <g key={pt.date} className="group">
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(2, h)}
                      rx="3"
                      fill="#4f46e5"
                      className="transition-all hover:fill-indigo-800 cursor-pointer"
                    />
                    {/* Tiny date label on bottom */}
                    {timeSeries.length <= 15 && (
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#64748b"
                        className="font-mono"
                      >
                        {pt.label.substring(5)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span className="font-mono">
                Total Titik Data: {timeSeries.length} sampel ({granularity})
              </span>
              <span className="font-semibold text-slate-800">
                Puncak: {selectedMetric === 'er' ? `${maxTS.toFixed(1)}%` : formatNumber(maxTS)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Performance vs Activity: Posting Activity vs Views (Scatter Plot) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="font-semibold text-sm text-slate-900">
                Korelasi: Aktivitas Posting vs Total Views
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Scatter diagram memetakan produktivitas konten anggota terhadap akumulasi jangkauan views
            </p>
          </div>

          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-500">Koefisien Pearson (r): </span>
            <strong className="font-mono text-indigo-700 font-bold">
              {correlationData.pearsonR}
            </strong>
          </div>
        </div>

        {/* Scatter Canvas */}
        <div className="relative">
          <svg viewBox={`0 0 ${scatterWidth} ${scatterHeight}`} className="w-full h-64 overflow-visible">
            {/* Axes */}
            <line x1="40" y1="20" x2="40" y2={scatterHeight - 30} stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="40" y1={scatterHeight - 30} x2={scatterWidth - 20} y2={scatterHeight - 30} stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Grid */}
            <line x1="40" y1={(scatterHeight - 30) / 2} x2={scatterWidth - 20} y2={(scatterHeight - 30) / 2} stroke="#f1f5f9" strokeDasharray="3 3" />

            {/* Axis labels */}
            <text x={scatterWidth / 2} y={scatterHeight - 8} textAnchor="middle" fontSize="10" fill="#64748b" className="font-medium">
              Jumlah Posting Konten (X) →
            </text>
            <text x="15" y={scatterHeight / 2} textAnchor="middle" fontSize="10" fill="#64748b" className="font-medium" transform={`rotate(-90 15,${scatterHeight / 2})`}>
              Total Views (Y) →
            </text>

            {/* Points */}
            {correlationData.points.map((pt) => {
              const cx = 50 + (pt.posts / maxPosts) * (scatterWidth - 90);
              const cy = scatterHeight - 35 - (pt.views / maxViews) * (scatterHeight - 65);

              return (
                <circle
                  key={pt.memberId}
                  cx={cx}
                  cy={cy}
                  r={hoveredScatter?.memberId === pt.memberId ? 7 : 5}
                  fill={hoveredScatter?.memberId === pt.memberId ? '#4338ca' : '#10b981'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredScatter(pt)}
                  onMouseLeave={() => setHoveredScatter(null)}
                />
              );
            })}
          </svg>

          {/* Hover details badge */}
          <div className="h-8 mt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
            {hoveredScatter ? (
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">{hoveredScatter.memberName}</span>
                <span className="text-slate-500 font-mono">
                  {hoveredScatter.posts} Posts · {formatNumber(hoveredScatter.views)} Views · ER {hoveredScatter.engagementRate}%
                </span>
                <span className="text-[11px] text-slate-400">({hoveredScatter.commissionName.split('-')[0].trim()})</span>
              </div>
            ) : (
              <span className="text-slate-400 text-[11px]">
                Arahkan kursor ke titik hijau untuk melihat profil performa anggota
              </span>
            )}
          </div>
        </div>

        {/* Narrative Correlation Interpretation */}
        <div className="mt-4 p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-semibold text-emerald-950">Analisis Korelasi & Rekomendasi</h5>
            <p className="text-slate-700 leading-relaxed">{correlationData.correlationText}</p>
            <p className="text-[11px] text-slate-500 italic">
              * Catatan metodologis: Korelasi statistik tidak secara otomatis mencerminkan hubungan sebab-akibat (kausalitas) mutlak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
