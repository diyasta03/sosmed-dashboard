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
 
};
