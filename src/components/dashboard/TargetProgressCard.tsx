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

  

};
