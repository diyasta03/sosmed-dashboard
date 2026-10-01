import React from 'react';
import {
  Users,
  Building2,
  Eye,
  Heart,
  MessageCircle,
  FileText,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { MetricSummary } from '../../types';
import { formatNumber, formatCompact, formatPercent } from '../../utils/formatters';

interface KpiCardsProps {
  summary: MetricSummary;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary }) => {
  const getGrowth = (current: number, previous?: number) => {
    if (previous === undefined || previous === 0) return null;
    const diff = current - previous;
    const pct = (diff / previous) * 100;
    return {
      diff,
      pct,
      isPositive: diff > 0,
      isZero: Math.abs(diff) < 0.001,
    };
  };

  const viewsGrowth = getGrowth(summary.totalViews, summary.previousPeriod?.totalViews);
  const likesGrowth = getGrowth(summary.totalLikes, summary.previousPeriod?.totalLikes);
  const commentsGrowth = getGrowth(summary.totalComments, summary.previousPeriod?.totalComments);
  const postsGrowth = getGrowth(summary.totalPosts, summary.previousPeriod?.totalPosts);
  const erGrowth = getGrowth(summary.overallEngagementRate, summary.previousPeriod?.overallEngagementRate);

  const renderTrend = (growth: ReturnType<typeof getGrowth>, isRate = false) => {
    if (!growth) return <span className="text-[11px] text-slate-400">vs periode lalu</span>;
    if (growth.isZero) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500 font-medium">
          <Minus className="w-3 h-3" /> 0.0%
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
          growth.isPositive ? 'text-emerald-600' : 'text-rose-600'
        }`}
      >
        {growth.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {growth.isPositive ? '+' : ''}
        {growth.pct.toFixed(1)}% {isRate ? 'pts' : ''}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* 1. Total Views (IG + TikTok) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-600">Total Views (Semua)</span>
          <Eye className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {formatNumber(summary.totalViews)}
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500 font-mono text-[11px]">
            {formatCompact(summary.totalViews)} views
          </span>
          {renderTrend(viewsGrowth)}
        </div>
      </div>

      {/* 2. Instagram Views */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-600">Instagram Views</span>
          <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">IG</span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {formatNumber(summary.totalInstagramViews)}
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500 text-[11px]">
            ER: <strong className="text-slate-800">{summary.instagramEngagementRate}%</strong>
          </span>
          <span className="text-[11px] text-slate-400">
            {summary.totalViews > 0
              ? `${((summary.totalInstagramViews / summary.totalViews) * 100).toFixed(0)}% total`
              : '0%'}
          </span>
        </div>
      </div>

      {/* 3. TikTok Views */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-600">TikTok Views</span>
          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">TikTok</span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {formatNumber(summary.totalTiktokViews)}
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500 text-[11px]">
            ER: <strong className="text-slate-800">{summary.tiktokEngagementRate}%</strong>
          </span>
          <span className="text-[11px] text-slate-400">
            {summary.totalViews > 0
              ? `${((summary.totalTiktokViews / summary.totalViews) * 100).toFixed(0)}% total`
              : '0%'}
          </span>
        </div>
      </div>

      {/* 4. Average Engagement Rate */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-600">Avg Engagement Rate</span>
          <Activity className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight mb-1">
          {summary.overallEngagementRate}%
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500 text-[11px] font-mono">
            (Likes+Comments)/Views
          </span>
          {renderTrend(erGrowth, true)}
        </div>
      </div>

      {/* 5. Total Likes */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-600">Total Likes</span>
          <Heart className="w-4 h-4 text-rose-500" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {formatNumber(summary.totalLikes)}
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500 text-[11px]">
            IG {formatCompact(summary.totalInstagramLikes)} · TT {formatCompact(summary.totalTiktokLikes)}
          </span>
          {renderTrend(likesGrowth)}
        </div>
      </div>

      {/* 6. Total Comments */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-600">Total Comments</span>
          <MessageCircle className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {formatNumber(summary.totalComments)}
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500 text-[11px]">
            IG {formatCompact(summary.totalInstagramComments)} · TT {formatCompact(summary.totalTiktokComments)}
          </span>
          {renderTrend(commentsGrowth)}
        </div>
      </div>

      {/* 7. Total Posts */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-600">Total Posting</span>
          <FileText className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {formatNumber(summary.totalPosts)}
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500 text-[11px]">Konten Terpublikasi</span>
          {renderTrend(postsGrowth)}
        </div>
      </div>

      {/* 8. Total Members & Commissions */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-600">Anggota & Komisi</span>
          <Users className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {summary.totalMembers} <span className="text-sm font-normal text-slate-500">Anggota</span>
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-[11px] text-slate-500">
          <span>{summary.totalCommissions} Divisi Komisi</span>
          <span className="text-emerald-600 font-medium">100% Terintegrasi</span>
        </div>
      </div>
    </div>
  );
};
