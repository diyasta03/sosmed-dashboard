export type Status = 'active' | 'inactive';

export interface Commission {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  commissionId: string;
  name: string;
  status: Status;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostDetailItem {
  postNumber: number;
  titleOrTopic?: string;
  instagramLikes: number;
  instagramComments: number;
  instagramViews: number;
  tiktokLikes: number;
  tiktokComments: number;
  tiktokViews: number;
}

export interface SocialMediaPerformance {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  instagramLikes: number;
  instagramComments: number;
  instagramViews: number;
  tiktokLikes: number;
  tiktokComments: number;
  tiktokViews: number;
  posts: number;
  postBreakdown?: PostDetailItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CalculatedPerformance extends SocialMediaPerformance {
  memberName: string;
  commissionId: string;
  commissionName: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  instagramEngagementRate: number;
  tiktokEngagementRate: number;
  overallEngagementRate: number;
  performanceScore?: number;
}

export interface ImportLog {
  id: string;
  filename: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  duplicateRows: number;
  importedAt: string;
  errors?: ImportErrorDetail[];
}

export interface ImportErrorDetail {
  rowNumber: number;
  memberName: string;
  date: string;
  field: string;
  message: string;
  rawData?: Record<string, any>;
}

export interface AppSettings {
  weightViews: number; // e.g. 40
  weightEngagement: number; // e.g. 40
  weightPosting: number; // e.g. 20
  anomalyDropThreshold: number; // e.g. 30 (%)
  anomalySpikeThreshold: number; // e.g. 100 (%)
  defaultPeriod: string;
}

export interface PerformanceTarget {
  id: string;
  periodMonth: string; // YYYY-MM
  targetViews: number;
  targetPosts: number;
  targetEngagementRate: number;
}

export interface MetricSummary {
  totalMembers: number;
  activeMembers: number;
  totalCommissions: number;
  totalInstagramViews: number;
  totalTiktokViews: number;
  totalViews: number;
  totalInstagramLikes: number;
  totalTiktokLikes: number;
  totalLikes: number;
  totalInstagramComments: number;
  totalTiktokComments: number;
  totalComments: number;
  totalPosts: number;
  instagramEngagementRate: number;
  tiktokEngagementRate: number;
  overallEngagementRate: number;
  previousPeriod?: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalPosts: number;
    overallEngagementRate: number;
  };
}

export interface PeriodFilter {
  type: 'today' | 'this_week' | 'this_month' | 'last_month' | 'this_year' | 'custom';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  label: string;
}

export interface AnomalyAlert {
  id: string;
  type: 'drop' | 'spike' | 'zero_posts' | 'duplicate' | 'low_engagement';
  severity: 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  date?: string;
  memberId?: string;
  memberName?: string;
}

export interface PerformanceInsight {
  id: string;
  category: 'growth' | 'platform' | 'commission' | 'engagement' | 'posting';
  tone: 'positive' | 'neutral' | 'caution';
  title: string;
  narrative: string;
  dataPoint?: string;
}
