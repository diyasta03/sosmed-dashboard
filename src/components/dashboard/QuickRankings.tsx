import React from 'react';
import { Trophy, ArrowRight, Building2 } from 'lucide-react';
import { MemberRankingItem, CommissionRankingItem } from '../../services/analyticsService';
import { formatNumber, formatCompact } from '../../utils/formatters';

interface QuickRankingsProps {
  memberRankings: MemberRankingItem[];
  commissionRankings: CommissionRankingItem[];
  onViewAllRankings: () => void;
  onSelectMember: (memberId: string) => void;
  onSelectCommission: (commissionId: string) => void;
}

export const QuickRankings: React.FC<QuickRankingsProps> = ({
  memberRankings,
  commissionRankings,
  onViewAllRankings,
  onSelectMember,
  onSelectCommission,
}) => {
  const topMembers = memberRankings.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Top 5 Members */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-sm text-slate-900">
              Top 5 Performers (Skor Tertinggi)
            </h3>
          </div>
          <button
            onClick={onViewAllRankings}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {topMembers.map((m, idx) => (
            <div
              key={m.memberId}
              onClick={() => onSelectMember(m.memberId)}
              className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    idx === 0
                      ? 'bg-amber-100 text-amber-800 font-mono'
                      : idx === 1
                      ? 'bg-slate-200 text-slate-700 font-mono'
                      : idx === 2
                      ? 'bg-amber-50 text-amber-700 font-mono'
                      : 'text-slate-500 font-mono'
                  }`}
                >
                  #{m.rank}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-900">{m.memberName}</h4>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span>{m.commissionName.split('-')[0].trim()}</span>
                    <span>·</span>
                    <span>{m.totalPosts} posts</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-indigo-700 text-xs font-mono">
                  {m.performanceScore} pts
                </div>
                <div className="text-[11px] text-slate-500">
                  {formatCompact(m.totalViews)} views · ER {m.overallEngagementRate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Leaderboard */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold text-sm text-slate-900">
              Peringkat & Kontribusi Komisi
            </h3>
          </div>
          <span className="text-xs text-slate-400">Total {commissionRankings.length} Komisi</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {commissionRankings.map((c, idx) => (
            <div
              key={c.commissionId}
              onClick={() => onSelectCommission(c.commissionId)}
              className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-mono font-semibold text-xs">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-900">{c.commissionName}</h4>
                  <div className="text-[11px] text-slate-400">
                    {c.totalMembers} Personil · Top: <span className="text-slate-600 font-medium">{c.topMemberName}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-slate-900 font-mono">
                  {formatCompact(c.totalViews)} views
                </div>
                <div className="text-[11px] text-slate-500">
                  {c.shareOfViewsPercent}% total · ER {c.overallEngagementRate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
