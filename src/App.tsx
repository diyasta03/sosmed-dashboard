import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, NavView } from './components/common/Sidebar';
import { Topbar } from './components/common/Topbar';
import { PeriodFilterBar } from './components/common/PeriodFilterBar';
import { KpiCards } from './components/dashboard/KpiCards';
import { TargetProgressCard } from './components/dashboard/TargetProgressCard';
import { ChartsSection } from './components/dashboard/ChartsSection';
import { InsightsAlertsSection } from './components/dashboard/InsightsAlertsSection';
import { QuickRankings } from './components/dashboard/QuickRankings';
import { PerformanceDataView } from './components/performance/PerformanceDataView';
import { AddEditPerformanceModal } from './components/performance/AddEditPerformanceModal';
import { ImportExcelModal } from './components/performance/ImportExcelModal';
import { MembersView } from './components/members/MembersView';
import { MemberDetailModal } from './components/members/MemberDetailModal';
import { CommissionsView } from './components/commissions/CommissionsView';
import { RankingsView } from './components/rankings/RankingsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ComparisonView } from './components/comparison/ComparisonView';
import { ReportsView } from './components/reports/ReportsView';
import { DataQualityView } from './components/dataquality/DataQualityView';
import { SettingsView } from './components/settings/SettingsView';

import { storageService } from './services/storageService';
import { analyticsService } from './services/analyticsService';
import { excelService } from './services/excelService';
import {
  PeriodFilter,
  CalculatedPerformance,
  SocialMediaPerformance,
  Member,
  Commission,
  AppSettings,
  PerformanceTarget,
} from './types';

export default function App() {
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Storage states
  const [commissions, setCommissions] = useState<Commission[]>(() => storageService.getCommissions());
  const [members, setMembers] = useState<Member[]>(() => storageService.getMembers());
  const [performances, setPerformances] = useState<SocialMediaPerformance[]>(() => storageService.getPerformances());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [targets, setTargets] = useState<PerformanceTarget[]>(() => storageService.getTargets());

  // Filter states
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>({
    type: 'this_month',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    label: 'September 2026',
  });
  const [selectedCommissionId, setSelectedCommissionId] = useState<string>('');
  const [rankBy, setRankBy] = useState<'views' | 'likes' | 'comments' | 'posts' | 'er' | 'score'>('score');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CalculatedPerformance | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<Member | null>(null);

  // Sync data refresh helper
  const refreshData = () => {
    setCommissions(storageService.getCommissions());
    setMembers(storageService.getMembers());
    setPerformances(storageService.getPerformances());
    setSettings(storageService.getSettings());
    setTargets(storageService.getTargets());
  };

  // Calculated current period performances
  const currentCalculatedPerformances = useMemo(() => {
    return storageService.getCalculatedPerformances({
      startDate: periodFilter.startDate,
      endDate: periodFilter.endDate,
      commissionId: selectedCommissionId || undefined,
    });
  }, [performances, members, commissions, periodFilter, selectedCommissionId]);

  // Previous comparison period performances (for KPI growth deltas)
  const previousCalculatedPerformances = useMemo(() => {
    const ranges = analyticsService.getPeriodRange(periodFilter.type, {
      startDate: periodFilter.startDate,
      endDate: periodFilter.endDate,
    });
    return storageService.getCalculatedPerformances({
      startDate: ranges.previous.startDate,
      endDate: ranges.previous.endDate,
      commissionId: selectedCommissionId || undefined,
    });
  }, [performances, members, commissions, periodFilter, selectedCommissionId]);

  // All calculated performances across all dates (for historical charts & reports)
  const allCalculatedPerformances = useMemo(() => {
    return storageService.getCalculatedPerformances();
  }, [performances, members, commissions]);

  // Metric Summary
  const summary = useMemo(() => {
    return analyticsService.calculateSummary(
      currentCalculatedPerformances,
      previousCalculatedPerformances,
      members.filter((m) => m.status === 'active').length,
      commissions.length
    );
  }, [currentCalculatedPerformances, previousCalculatedPerformances, members, commissions]);

  // Member Rankings
  const memberRankings = useMemo(() => {
    return analyticsService.calculateMemberRankings(
      currentCalculatedPerformances,
      members,
      commissions,
      rankBy,
      settings
    );
  }, [currentCalculatedPerformances, members, commissions, rankBy, settings]);

  // Commission Rankings
  const commissionRankings = useMemo(() => {
    return analyticsService.calculateCommissionRankings(
      currentCalculatedPerformances,
      commissions,
      members
    );
  }, [currentCalculatedPerformances, commissions, members]);

  // Time series points for charts
  const timeSeries = useMemo(() => {
    return analyticsService.getTimeSeries(currentCalculatedPerformances, 'daily');
  }, [currentCalculatedPerformances]);

  // Automatic Insights & Alerts
  const insights = useMemo(() => {
    return analyticsService.generateInsights(summary, commissionRankings, memberRankings);
  }, [summary, commissionRankings, memberRankings]);

  const alerts = useMemo(() => {
    return analyticsService.detectAnomalies(currentCalculatedPerformances, members, settings);
  }, [currentCalculatedPerformances, members, settings]);

  // Current month's target
  const currentTarget = useMemo(() => {
    const currentMonthKey = periodFilter.startDate.substring(0, 7);
    return (
      targets.find((t) => t.periodMonth === currentMonthKey) || {
        id: 'target-def',
        periodMonth: currentMonthKey,
        targetViews: 2500000,
        targetPosts: 280,
        targetEngagementRate: 6.5,
      }
    );
  }, [targets, periodFilter.startDate]);

  // Handlers for Performance CRUD
  const handleSavePerformance = (data: Omit<SocialMediaPerformance, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingRecord) {
      storageService.updatePerformance(editingRecord.id, data);
      setEditingRecord(null);
    } else {
      storageService.addPerformance(data);
    }
    refreshData();
  };

  const handleDeletePerformance = (id: string) => {
    storageService.deletePerformance(id);
    refreshData();
  };

  // Handler for Excel Import
  const handleConfirmImport = (
    records: Omit<SocialMediaPerformance, 'id' | 'createdAt' | 'updatedAt'>[],
    onDuplicate: 'skip' | 'update'
  ) => {
    const res = storageService.bulkImportPerformances(records, onDuplicate);
    storageService.addImportLog({
      filename: `Import_${new Date().toISOString()}.xlsx`,
      totalRows: records.length,
      successfulRows: res.inserted + res.updated,
      failedRows: 0,
      duplicateRows: res.skipped,
    });
    refreshData();
  };

  // Handler for Smart Excel Export
  const handleExportExcel = () => {
    excelService.exportSmartReportWorkbook({
      periodLabel: periodFilter.label,
      performances: currentCalculatedPerformances,
      memberRankings,
      commissionRankings,
    });
  };

  // Handler for Target updates
  const handleUpdateTarget = (newTarget: { targetViews: number; targetPosts: number; targetEngagementRate: number }) => {
    const currentMonthKey = periodFilter.startDate.substring(0, 7);
    storageService.setTarget({
      periodMonth: currentMonthKey,
      ...newTarget,
    });
    refreshData();
  };

  // Handler for Settings updates
  const handleUpdateWeights = (weights: { weightViews: number; weightEngagement: number; weightPosting: number }) => {
    storageService.updateSettings(weights);
    refreshData();
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    storageService.updateSettings(newSettings);
    refreshData();
  };

  const handleResetSeed = () => {
    storageService.resetAllToSeed();
    refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        anomalyCount={alerts.length}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Topbar */}
        <Topbar
          activeView={activeView}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          onOpenAddModal={() => {
            setEditingRecord(null);
            setIsAddModalOpen(true);
          }}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onTriggerExport={handleExportExcel}
          onNavigate={setActiveView}
          anomalyCount={alerts.length}
        />

        {/* View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Universal Period Filter Bar (Shown on Dashboard, Performance, Rankings, Reports) */}
          {(activeView === 'dashboard' || activeView === 'performance' || activeView === 'rankings') && (
            <PeriodFilterBar
              currentFilter={periodFilter}
              onFilterChange={setPeriodFilter}
              commissions={commissions}
              selectedCommissionId={selectedCommissionId}
              onCommissionChange={setSelectedCommissionId}
            />
          )}

          {/* 1. DASHBOARD VIEW */}
          {activeView === 'dashboard' && (
            <div>
              {/* Executive KPI Scorecard */}
              <KpiCards summary={summary} />

              {/* Monthly Target Progress */}
              <TargetProgressCard
                target={currentTarget}
                summary={summary}
                onUpdateTarget={handleUpdateTarget}
              />

              {/* Interactive Performance Charts */}
              <ChartsSection timeSeries={timeSeries} summary={summary} />

              {/* Automatic Insights & Anomaly Alerts */}
              <InsightsAlertsSection
                insights={insights}
                alerts={alerts}
                onOpenDataQuality={() => setActiveView('data_quality')}
              />

              {/* Quick Rankings Leaderboards */}
              <QuickRankings
                memberRankings={memberRankings}
                commissionRankings={commissionRankings}
                onViewAllRankings={() => setActiveView('rankings')}
                onSelectMember={(memId) => {
                  const m = members.find((x) => x.id === memId);
                  if (m) setSelectedMemberDetail(m);
                }}
                onSelectCommission={() => setActiveView('commissions')}
              />
            </div>
          )}

          {/* 2. PERFORMANCE DATA VIEW */}
          {activeView === 'performance' && (
            <PerformanceDataView
              performances={currentCalculatedPerformances}
              commissions={commissions}
              members={members}
              onAdd={() => {
                setEditingRecord(null);
                setIsAddModalOpen(true);
              }}
              onEdit={(record) => {
                setEditingRecord(record);
                setIsAddModalOpen(true);
              }}
              onDelete={handleDeletePerformance}
              onImport={() => setIsImportModalOpen(true)}
              onExport={handleExportExcel}
            />
          )}

          {/* 3. RANKINGS & PERFORMANCE SCORE VIEW */}
          {activeView === 'rankings' && (
            <RankingsView
              memberRankings={memberRankings}
              rankBy={rankBy}
              onRankByChange={setRankBy}
              settings={settings}
              onUpdateWeights={handleUpdateWeights}
              commissions={commissions}
              selectedCommissionId={selectedCommissionId}
              onCommissionChange={setSelectedCommissionId}
            />
          )}

          {/* 4. ANALYTICS & CORRELATION VIEW */}
          {activeView === 'analytics' && (
            <AnalyticsView
              performances={allCalculatedPerformances}
              members={members}
            />
          )}

          {/* 5. MONTHLY COMPARISON VIEW */}
          {activeView === 'comparison' && (
            <ComparisonView performances={allCalculatedPerformances} />
          )}

          {/* 6. MEMBERS DIRECTORY VIEW */}
          {activeView === 'members' && (
            <MembersView
              members={members}
              commissions={commissions}
              performances={allCalculatedPerformances}
              onAddMember={(data) => {
                storageService.addMember(data);
                refreshData();
              }}
              onEditMember={(id, data) => {
                storageService.updateMember(id, data);
                refreshData();
              }}
              onDeleteMember={(id) => {
                storageService.deleteMember(id);
                refreshData();
              }}
            />
          )}

          {/* 7. COMMISSIONS DIRECTORY VIEW */}
          {activeView === 'commissions' && (
            <CommissionsView
              commissions={commissions}
              members={members}
              performances={allCalculatedPerformances}
              onAddCommission={(data) => {
                storageService.addCommission(data);
                refreshData();
              }}
              onEditCommission={(id, data) => {
                storageService.updateCommission(id, data);
                refreshData();
              }}
            />
          )}

          {/* 8. EXECUTIVE REPORTS VIEW */}
          {activeView === 'reports' && (
            <ReportsView
              summary={summary}
              performances={currentCalculatedPerformances}
              memberRankings={memberRankings}
              commissionRankings={commissionRankings}
              commissions={commissions}
              insights={insights}
              alerts={alerts}
              periodLabel={periodFilter.label}
              onExportExcel={handleExportExcel}
              allPerformances={allCalculatedPerformances}
              members={members}
              settings={settings}
            />
          )}

          {/* 9. DATA QUALITY AUDIT VIEW */}
          {activeView === 'data_quality' && (
            <DataQualityView
              performances={allCalculatedPerformances}
              members={members}
              commissions={commissions}
              onResetSeed={handleResetSeed}
            />
          )}

          {/* 10. SETTINGS VIEW */}
          {activeView === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onResetSeed={handleResetSeed}
            />
          )}
        </main>
      </div>

      {/* Manual Input / Edit Modal */}
      <AddEditPerformanceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSavePerformance}
        editData={editingRecord}
        members={members}
        commissions={commissions}
      />

      {/* Excel Import Staging Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirmImport={handleConfirmImport}
        existingMembers={members}
        existingPerformances={performances}
        commissions={commissions}
      />

      {/* Member Deep-Dive Profile Modal */}
      {selectedMemberDetail && (
        <MemberDetailModal
          member={selectedMemberDetail}
          commission={commissions.find((c) => c.id === selectedMemberDetail.commissionId)}
          performances={allCalculatedPerformances}
          onClose={() => setSelectedMemberDetail(null)}
        />
      )}
    </div>
  );
}
