import React, { useState, useMemo } from 'react';
import { GitCompare, TrendingUp, TrendingDown, Minus, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { CalculatedPerformance } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface ComparisonViewProps {
  performances: CalculatedPerformance[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ performances }) => {
  const [periodA, setPeriodA] = useState<'2026-08' | '2026-07'>('2026-08');
  const [periodB, setPeriodB] = useState<'2026-09' | '2026-08'>('2026-09');

  const labelA = periodA === '2026-08' ? 'Agustus 2026' : 'Juli 2026';
  const labelB = periodB === '2026-09' ? 'September 2026' : 'Agustus 2026';

  const perfsA = useMemo(() => {
    return performances.filter((p) => p.date.startsWith(periodA));
  }, [performances, periodA]);

  const perfsB = useMemo(() => {
    return performances.filter((p) => p.date.startsWith(periodB));
  }, [performances, periodB]);

  // Aggregate exact metrics matching user's Excel sheet 'PERBANDINGAN BULAN'
  const calcTotals = (list: CalculatedPerformance[]) => {
    let likeIG = 0;
    let commentIG = 0;
    let viewIG = 0;
    let likeTT = 0;
    let commentTT = 0;
    let viewTT = 0;
    let posting = 0;

    for (const p of list) {
      likeIG += p.instagramLikes;
      commentIG += p.instagramComments;
      viewIG += p.instagramViews;
      likeTT += p.tiktokLikes;
      commentTT += p.tiktokComments;
      viewTT += p.tiktokViews;
      posting += p.posts;
    }

    const grandTotal = likeIG + commentIG + viewIG + likeTT + commentTT + viewTT;
    const er = (viewIG + viewTT) > 0 ? (((likeIG + likeTT) + (commentIG + commentTT)) / (viewIG + viewTT)) * 100 : 0;

    return {
      likeIG,
      commentIG,
      viewIG,
      likeTT,
      commentTT,
      viewTT,
      posting,
      grandTotal,
      er: Number(er.toFixed(2)),
    };
  };

  const totalsA = useMemo(() => calcTotals(perfsA), [perfsA]);
  const totalsB = useMemo(() => calcTotals(perfsB), [perfsB]);

  const getRowDelta = (valB: number, valA: number) => {
    const diff = valB - valA;
    const pct = valA === 0 ? (valB > 0 ? 100 : 0) : ((valB - valA) / valA) * 100;
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (diff > 0.001) trend = 'up';
    else if (diff < -0.001) trend = 'down';
    return {
      diff,
      pct: Number(pct.toFixed(1)),
      trend,
    };
  };

  const renderTrendBadge = (trend: 'up' | 'down' | 'stable', percent: number) => {
    if (trend === 'up') {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded font-mono">
          <TrendingUp className="w-3.5 h-3.5" />
          +{percent}%
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded font-mono">
          <TrendingDown className="w-3.5 h-3.5" />
          {percent}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded font-mono">
        <Minus className="w-3.5 h-3.5" />
        0.0%
      </span>
    );
  };

  const rows = [
    { label: 'LIKE IG', valA: totalsA.likeIG, valB: totalsB.likeIG },
    { label: 'COMMENT IG', valA: totalsA.commentIG, valB: totalsB.commentIG },
    { label: 'VIEW IG', valA: totalsA.viewIG, valB: totalsB.viewIG },
    { label: 'LIKE TIKTOK', valA: totalsA.likeTT, valB: totalsB.likeTT },
    { label: 'COMMENT TIKTOK', valA: totalsA.commentTT, valB: totalsB.commentTT },
    { label: 'VIEW TIKTOK', valA: totalsA.viewTT, valB: totalsB.viewTT },
    { label: 'POSTING', valA: totalsA.posting, valB: totalsB.posting },
  ];

  const grandDelta = getRowDelta(totalsB.grandTotal, totalsA.grandTotal);

  return (
    <div className="space-y-6">
   

      {/* Selector bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              PERBANDINGAN GRAND TOTAL — BULAN LALU vs BULAN INI
            </h3>
            <p className="text-xs text-slate-500">
              Format baku sesuai template laporan resmi organisasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">BULAN LALU:</span>
            <select
              value={periodA}
              onChange={(e: any) => setPeriodA(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="2026-08">Agustus 2026</option>
              <option value="2026-07">Juli 2026</option>
            </select>
          </div>

          <span className="font-bold text-slate-400">VS</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">BULAN INI:</span>
            <select
              value={periodB}
              onChange={(e: any) => setPeriodB(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="2026-09">September 2026</option>
              <option value="2026-08">Agustus 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Scorecard Table matching exact Excel rows */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-white font-semibold text-[10px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">METRIK</th>
              <th className="py-3.5 px-4 text-right bg-slate-800">BULAN LALU ({labelA})</th>
              <th className="py-3.5 px-4 text-right bg-indigo-900">BULAN INI ({labelB})</th>
              <th className="py-3.5 px-4 text-right">SELISIH (Δ)</th>
              <th className="py-3.5 px-4 text-right">% PERUBAHAN</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((r) => {
              const delta = getRowDelta(r.valB, r.valA);
              return (
                <tr key={r.label} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.label}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600 bg-slate-50/50">
                    {formatNumber(r.valA)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700 bg-indigo-50/30">
                    {formatNumber(r.valB)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium">
                    {delta.diff >= 0 ? '+' : ''}
                    {formatNumber(delta.diff)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {renderTrendBadge(delta.trend, delta.pct)}
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    <span className="uppercase text-[10px] font-mono font-semibold text-slate-600">
                      {delta.trend === 'up' ? 'Meningkat' : delta.trend === 'down' ? 'Menurun' : 'Stabil'}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* GRAND TOTAL ROW */}
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
              <td className="py-3.5 px-4 text-slate-900 font-extrabold uppercase">GRAND TOTAL</td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-800">
                {formatNumber(totalsA.grandTotal)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-indigo-800 font-extrabold text-sm">
                {formatNumber(totalsB.grandTotal)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono">
                {grandDelta.diff >= 0 ? '+' : ''}
                {formatNumber(grandDelta.diff)}
              </td>
              <td className="py-3.5 px-4 text-right">
                {renderTrendBadge(grandDelta.trend, grandDelta.pct)}
              </td>
              <td className="py-3.5 px-4 text-center">
                <span className="uppercase text-[10px] font-mono font-bold text-emerald-800">
                  {grandDelta.trend === 'up' ? 'MENINGKAT' : 'MENURUN'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Narrative Synthesis */}
      <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-indigo-950">Wawasan Komparasi Otomatis</h4>
          <p className="text-slate-700 leading-relaxed">
            Pada periode {labelB}, total capaian metrik tumbuh sebesar{' '}
            <strong>+{grandDelta.pct}%</strong> dibandingkan {labelA}, dipicu oleh peningkatan publikasi menjadi{' '}
            <strong>{totalsB.posting} konten</strong> dengan akumulasi penonton (views) mencapai{' '}
            <strong>{formatNumber(totalsB.viewIG + totalsB.viewTT)} views</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
