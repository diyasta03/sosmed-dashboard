import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, CheckCircle, Info } from 'lucide-react';
import { PerformanceInsight, AnomalyAlert } from '../../types';

interface InsightsAlertsSectionProps {
  insights: PerformanceInsight[];
  alerts: AnomalyAlert[];
  onOpenDataQuality?: () => void;
}

export const InsightsAlertsSection: React.FC<InsightsAlertsSectionProps> = ({
  insights,
  alerts,
  onOpenDataQuality,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. Performance Insights */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 leading-tight">
                Automatic Performance Insights
              </h3>
              <p className="text-xs text-slate-500">
                Wawasan otomatis dihasilkan dari pola data aktual periode aktif
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {insights.length} Insight Terdeteksi
          </span>
        </div>

        <div className="space-y-2.5">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className={`p-3 rounded-lg border text-xs transition-all ${
                ins.tone === 'positive'
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                  : ins.tone === 'caution'
                  ? 'bg-amber-50/50 border-amber-200/80 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-semibold">{ins.title}</span>
                {ins.dataPoint && (
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/80 border border-slate-200/60 shadow-2xs">
                    {ins.dataPoint}
                  </span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed">{ins.narrative}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Performance & Data Alerts */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 leading-tight">
                Anomaly Detection & Alerts
              </h3>
              <p className="text-xs text-slate-500">
                Peringatan anomali performa, zero-posting, atau integritas data
              </p>
            </div>
          </div>
          {onOpenDataQuality && (
            <button
              onClick={onOpenDataQuality}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            >
              Audit Data →
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-800">
              Tidak Ada Anomali Kritis
            </p>
            <p className="text-[11px] text-slate-500">
              Semua metrik berada dalam batas normal dan tidak terdeteksi inkonsistensi rekaman.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border text-xs ${
                  alert.severity === 'danger'
                    ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                    : alert.severity === 'warning'
                    ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                    : 'bg-blue-50/60 border-blue-200 text-blue-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold flex items-center gap-1.5">
                    {alert.severity === 'danger' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block" />
                    ) : alert.severity === 'warning' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    {alert.title}
                  </span>
                  {alert.date && (
                    <span className="text-[10px] font-mono text-slate-500">{alert.date}</span>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed">{alert.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
