import React, { useMemo } from 'react';
import {
  X,
  User,
  Building2,
  Eye,
  Heart,
  MessageCircle,
  FileText,
  Activity,
  Trophy,
  Calendar,
} from 'lucide-react';
import { Member, Commission, CalculatedPerformance } from '../../types';
import { formatNumber, formatCompact, formatDate } from '../../utils/formatters';

interface MemberDetailModalProps {
  member: Member | null;
  commission?: Commission;
  performances: CalculatedPerformance[];
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  commission,
  performances,
  onClose,
}) => {
  if (!member) return null;

  // Filter performances for this member
  const memberPerfs = useMemo(() => {
    return performances.filter((p) => p.memberId === member.id);
  }, [performances, member.id]);

  // Aggregate stats
  const stats = useMemo(() => {
    let igViews = 0;
    let ttViews = 0;
    let igLikes = 0;
    let ttLikes = 0;
    let igComments = 0;
    let ttComments = 0;
    let posts = 0;

    for (const p of memberPerfs) {
      igViews += p.instagramViews;
      ttViews += p.tiktokViews;
      igLikes += p.instagramLikes;
      ttLikes += p.tiktokLikes;
      igComments += p.instagramComments;
      ttComments += p.tiktokComments;
      posts += p.posts;
    }

    const totalViews = igViews + ttViews;
    const totalLikes = igLikes + ttLikes;
    const totalComments = igComments + ttComments;
    const overallER = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;
    const igER = igViews > 0 ? ((igLikes + igComments) / igViews) * 100 : 0;
    const ttER = ttViews > 0 ? ((ttLikes + ttComments) / ttViews) * 100 : 0;

    // Monthly breakdown (Aug vs Sep)
    const augPerfs = memberPerfs.filter((p) => p.date.startsWith('2026-08'));
    const sepPerfs = memberPerfs.filter((p) => p.date.startsWith('2026-09'));

    const augViews = augPerfs.reduce((acc, p) => acc + p.totalViews, 0);
    const sepViews = sepPerfs.reduce((acc, p) => acc + p.totalViews, 0);

    return {
      totalViews,
      totalLikes,
      totalComments,
      posts,
      overallER: Number(overallER.toFixed(2)),
      igViews,
      ttViews,
      igER: Number(igER.toFixed(2)),
      ttER: Number(ttER.toFixed(2)),
      augViews,
      sepViews,
      recentRecords: memberPerfs.slice(0, 10),
    };
  }, [memberPerfs]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">{member.name}</h3>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    member.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {member.status === 'active' ? 'Aktif' : 'Non-aktif'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{commission ? commission.name : 'Belum Ditentukan'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick KPI Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block mb-0.5 text-[11px]">Akumulasi Views</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {formatNumber(stats.totalViews)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block mb-0.5 text-[11px]">Interaksi (L+C)</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {formatNumber(stats.totalLikes + stats.totalComments)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block mb-0.5 text-[11px]">Total Posting</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {stats.posts} Konten
              </span>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <span className="text-indigo-800 block mb-0.5 text-[11px]">Avg Engagement</span>
              <span className="text-lg font-bold text-indigo-700 font-mono">
                {stats.overallER}%
              </span>
            </div>
          </div>

          {/* Platform Performance Comparison (IG vs TikTok) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Instagram Card */}
            <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-pink-900 border-b border-pink-100 pb-1.5">
                <span>Performa Instagram</span>
                <span className="font-mono text-pink-700">ER {stats.igER}%</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Views</span>
                <span className="font-semibold font-mono">{formatNumber(stats.igViews)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Likes</span>
                <span className="font-mono">{formatNumber(stats.totalLikes)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Comments</span>
                <span className="font-mono">{formatNumber(stats.totalComments)}</span>
              </div>
            </div>

            {/* TikTok Card */}
            <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-900 border-b border-slate-200 pb-1.5">
                <span>Performa TikTok</span>
                <span className="font-mono text-slate-700">ER {stats.ttER}%</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Views</span>
                <span className="font-semibold font-mono">{formatNumber(stats.ttViews)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Likes</span>
                <span className="font-mono">{formatNumber(stats.totalLikes)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Comments</span>
                <span className="font-mono">{formatNumber(stats.totalComments)}</span>
              </div>
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <h4 className="font-semibold text-slate-900 mb-1">
              Perbandingan Kinerja Antar-Bulan
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 block">Agustus 2026</span>
                <span className="font-bold text-slate-900 text-sm font-mono">
                  {formatNumber(stats.augViews)} views
                </span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 block">September 2026</span>
                <span className="font-bold text-indigo-700 text-sm font-mono">
                  {formatNumber(stats.sepViews)} views
                </span>
                {stats.augViews > 0 && (
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                    {stats.sepViews >= stats.augViews ? '+' : ''}
                    {(((stats.sepViews - stats.augViews) / stats.augViews) * 100).toFixed(1)}% vs Ags
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Recent Performance Logs */}
          <div>
            <h4 className="font-semibold text-xs text-slate-900 mb-2">
              Log Rekaman Aktivitas Terakhir
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">Tanggal</th>
                    <th className="p-2.5 text-right">Views</th>
                    <th className="p-2.5 text-right">Likes</th>
                    <th className="p-2.5 text-right">Comments</th>
                    <th className="p-2.5 text-center">Post</th>
                    <th className="p-2.5 text-right">ER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400">
                        Belum ada aktivitas tercatat untuk anggota ini.
                      </td>
                    </tr>
                  ) : (
                    stats.recentRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono text-slate-600">{formatDate(r.date)}</td>
                        <td className="p-2.5 text-right font-mono font-medium text-slate-900">
                          {formatNumber(r.totalViews)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-600">
                          {formatNumber(r.totalLikes)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-600">
                          {formatNumber(r.totalComments)}
                        </td>
                        <td className="p-2.5 text-center font-mono">{r.posts}</td>
                        <td className="p-2.5 text-right font-mono font-semibold text-indigo-700">
                          {r.overallEngagementRate}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-2xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
