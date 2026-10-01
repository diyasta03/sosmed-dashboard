import {
  CalculatedPerformance,
  MetricSummary,
  PeriodFilter,
  AppSettings,
  PerformanceInsight,
  AnomalyAlert,
  Commission,
  Member,
} from '../types';

export interface MemberRankingItem {
  rank: number;
  memberId: string;
  memberName: string;
  commissionId: string;
  commissionName: string;
  status: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalPosts: number;
  instagramViews: number;
  tiktokViews: number;
  instagramLikes?: number;
  instagramComments?: number;
  tiktokLikes?: number;
  tiktokComments?: number;
  overallEngagementRate: number;
  instagramEngagementRate: number;
  tiktokEngagementRate: number;
  performanceScore: number;
  normalizedViews: number;
  normalizedER: number;
  normalizedPosts: number;
}

export interface CommissionRankingItem {
  rank: number;
  commissionId: string;
  commissionName: string;
  totalMembers: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalPosts: number;
  overallEngagementRate: number;
  topMemberName: string;
  shareOfViewsPercent: number;
}

export interface TimeSeriesPoint {
  date: string;
  label: string;
  views: number;
  instagramViews: number;
  tiktokViews: number;
  likes: number;
  comments: number;
  posts: number;
  engagementRate: number;
}

export interface CorrelationPoint {
  memberId: string;
  memberName: string;
  commissionName: string;
  posts: number;
  views: number;
  engagementRate: number;
}

export interface ComparisonResult {
  periodA: { label: string; views: number; likes: number; comments: number; posts: number; er: number };
  periodB: { label: string; views: number; likes: number; comments: number; posts: number; er: number };
  delta: {
    views: { value: number; percent: number; trend: 'up' | 'down' | 'stable' };
    likes: { value: number; percent: number; trend: 'up' | 'down' | 'stable' };
    comments: { value: number; percent: number; trend: 'up' | 'down' | 'stable' };
    posts: { value: number; percent: number; trend: 'up' | 'down' | 'stable' };
    er: { value: number; percent: number; trend: 'up' | 'down' | 'stable' };
  };
}

class AnalyticsService {
  // Pre-configured current date anchor for consistent simulation (September 2026)
  private readonly CURRENT_DATE = '2026-09-27';

  // 1. Period Range Generator
  public getPeriodRange(
    type: PeriodFilter['type'],
    custom?: { startDate: string; endDate: string }
  ): { current: { startDate: string; endDate: string; label: string }; previous: { startDate: string; endDate: string; label: string } } {
    if (type === 'today') {
      return {
        current: { startDate: this.CURRENT_DATE, endDate: this.CURRENT_DATE, label: 'Hari Ini (27 Sep 2026)' },
        previous: { startDate: '2026-09-26', endDate: '2026-09-26', label: 'Kemarin (26 Sep 2026)' },
      };
    }

    if (type === 'this_week') {
      return {
        current: { startDate: '2026-09-21', endDate: '2026-09-27', label: 'Minggu Ini (21 - 27 Sep 2026)' },
        previous: { startDate: '2026-09-14', endDate: '2026-09-20', label: 'Minggu Lalu (14 - 20 Sep 2026)' },
      };
    }

    if (type === 'last_month') {
      return {
        current: { startDate: '2026-08-01', endDate: '2026-08-31', label: 'Bulan Lalu (Agustus 2026)' },
        previous: { startDate: '2026-07-01', endDate: '2026-07-31', label: 'Juli 2026' },
      };
    }

    if (type === 'this_year') {
      return {
        current: { startDate: '2026-01-01', endDate: '2026-09-27', label: 'Tahun 2026 (YTD)' },
        previous: { startDate: '2025-01-01', endDate: '2025-09-27', label: 'Periode Sama 2025' },
      };
    }

    if (type === 'custom' && custom?.startDate && custom?.endDate) {
      return {
        current: { startDate: custom.startDate, endDate: custom.endDate, label: `${custom.startDate} s/d ${custom.endDate}` },
        previous: { startDate: '2026-08-01', endDate: '2026-08-31', label: 'Periode Pembanding' },
      };
    }

    // Default: 'this_month' (September 2026)
    return {
      current: { startDate: '2026-09-01', endDate: '2026-09-30', label: 'Bulan Ini (September 2026)' },
      previous: { startDate: '2026-08-01', endDate: '2026-08-31', label: 'Bulan Lalu (Agustus 2026)' },
    };
  }

  // 2. Metric Summary
  public calculateSummary(
    performances: CalculatedPerformance[],
    previousPerformances?: CalculatedPerformance[],
    membersCount = 0,
    commissionsCount = 0
  ): MetricSummary {
    let totalIGViews = 0;
    let totalTTViews = 0;
    let totalIGLikes = 0;
    let totalTTLikes = 0;
    let totalIGComments = 0;
    let totalTTComments = 0;
    let totalPosts = 0;

    for (const p of performances) {
      totalIGViews += p.instagramViews;
      totalTTViews += p.tiktokViews;
      totalIGLikes += p.instagramLikes;
      totalTTLikes += p.tiktokLikes;
      totalIGComments += p.instagramComments;
      totalTTComments += p.tiktokComments;
      totalPosts += p.posts;
    }

    const totalViews = totalIGViews + totalTTViews;
    const totalLikes = totalIGLikes + totalTTLikes;
    const totalComments = totalIGComments + totalTTComments;

    const igER = totalIGViews > 0 ? ((totalIGLikes + totalIGComments) / totalIGViews) * 100 : 0;
    const ttER = totalTTViews > 0 ? ((totalTTLikes + totalTTComments) / totalTTViews) * 100 : 0;
    const overallER = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

    let previousSummary: MetricSummary['previousPeriod'];
    if (previousPerformances && previousPerformances.length > 0) {
      let pViews = 0;
      let pLikes = 0;
      let pComments = 0;
      let pPosts = 0;
      for (const p of previousPerformances) {
        pViews += (p.instagramViews + p.tiktokViews);
        pLikes += (p.instagramLikes + p.tiktokLikes);
        pComments += (p.instagramComments + p.tiktokComments);
        pPosts += p.posts;
      }
      const pER = pViews > 0 ? ((pLikes + pComments) / pViews) * 100 : 0;
      previousSummary = {
        totalViews: pViews,
        totalLikes: pLikes,
        totalComments: pComments,
        totalPosts: pPosts,
        overallEngagementRate: Number(pER.toFixed(2)),
      };
    }

    return {
      totalMembers: membersCount,
      activeMembers: membersCount,
      totalCommissions: commissionsCount,
      totalInstagramViews: totalIGViews,
      totalTiktokViews: totalTTViews,
      totalViews,
      totalInstagramLikes: totalIGLikes,
      totalTiktokLikes: totalTTLikes,
      totalLikes,
      totalInstagramComments: totalIGComments,
      totalTiktokComments: totalTTComments,
      totalComments,
      totalPosts,
      instagramEngagementRate: Number(igER.toFixed(2)),
      tiktokEngagementRate: Number(ttER.toFixed(2)),
      overallEngagementRate: Number(overallER.toFixed(2)),
      previousPeriod: previousSummary,
    };
  }

  // 3. Dynamic Ranking with Configurable Performance Score
  public calculateMemberRankings(
    performances: CalculatedPerformance[],
    members: Member[],
    commissions: Commission[],
    rankBy: 'views' | 'likes' | 'comments' | 'posts' | 'er' | 'score' = 'score',
    settings: AppSettings
  ): MemberRankingItem[] {
    const memberMap = new Map<string, Member>();
    members.forEach(m => memberMap.set(m.id, m));

    const commMap = new Map<string, Commission>();
    commissions.forEach(c => commMap.set(c.id, c));

    // Aggregate by member
    const aggMap = new Map<string, {
      memberId: string;
      totalViews: number;
      totalLikes: number;
      totalComments: number;
      totalPosts: number;
      instagramViews: number;
      tiktokViews: number;
      igLikes: number;
      igComments: number;
      ttLikes: number;
      ttComments: number;
    }>();

    for (const p of performances) {
      if (!aggMap.has(p.memberId)) {
        aggMap.set(p.memberId, {
          memberId: p.memberId,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          totalPosts: 0,
          instagramViews: 0,
          tiktokViews: 0,
          igLikes: 0,
          igComments: 0,
          ttLikes: 0,
          ttComments: 0,
        });
      }
      const agg = aggMap.get(p.memberId)!;
      agg.totalViews += (p.instagramViews + p.tiktokViews);
      agg.totalLikes += (p.instagramLikes + p.tiktokLikes);
      agg.totalComments += (p.instagramComments + p.tiktokComments);
      agg.totalPosts += p.posts;
      agg.instagramViews += p.instagramViews;
      agg.tiktokViews += p.tiktokViews;
      agg.igLikes += p.instagramLikes;
      agg.igComments += p.instagramComments;
      agg.ttLikes += p.tiktokLikes;
      agg.ttComments += p.tiktokComments;
    }

    const items: Array<Omit<MemberRankingItem, 'rank' | 'normalizedViews' | 'normalizedER' | 'normalizedPosts' | 'performanceScore'>> = [];

    // Include all active members (even if 0 posts in period)
    members.forEach(m => {
      const agg = aggMap.get(m.id) || {
        memberId: m.id,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalPosts: 0,
        instagramViews: 0,
        tiktokViews: 0,
        igLikes: 0,
        igComments: 0,
        ttLikes: 0,
        ttComments: 0,
      };

      const comm = commMap.get(m.commissionId);
      const overallER = agg.totalViews > 0 ? ((agg.totalLikes + agg.totalComments) / agg.totalViews) * 100 : 0;
      const igER = agg.instagramViews > 0 ? ((agg.igLikes + agg.igComments) / agg.instagramViews) * 100 : 0;
      const ttER = agg.tiktokViews > 0 ? ((agg.ttLikes + agg.ttComments) / agg.tiktokViews) * 100 : 0;

      items.push({
        memberId: m.id,
        memberName: m.name,
        commissionId: m.commissionId,
        commissionName: comm ? comm.name : 'Unknown',
        status: m.status,
        totalViews: agg.totalViews,
        totalLikes: agg.totalLikes,
        totalComments: agg.totalComments,
        totalPosts: agg.totalPosts,
        instagramViews: agg.instagramViews,
        tiktokViews: agg.tiktokViews,
        instagramLikes: agg.igLikes,
        instagramComments: agg.igComments,
        tiktokLikes: agg.ttLikes,
        tiktokComments: agg.ttComments,
        overallEngagementRate: Number(overallER.toFixed(2)),
        instagramEngagementRate: Number(igER.toFixed(2)),
        tiktokEngagementRate: Number(ttER.toFixed(2)),
      });
    });

    // Min-Max Normalization for Performance Score
    const maxViews = Math.max(...items.map(i => i.totalViews), 1);
    const minViews = Math.min(...items.map(i => i.totalViews), 0);

    const maxER = Math.max(...items.map(i => i.overallEngagementRate), 1);
    const minER = Math.min(...items.map(i => i.overallEngagementRate), 0);

    const maxPosts = Math.max(...items.map(i => i.totalPosts), 1);
    const minPosts = Math.min(...items.map(i => i.totalPosts), 0);

    const wViews = settings.weightViews / 100;
    const wER = settings.weightEngagement / 100;
    const wPosts = settings.weightPosting / 100;

    const scoredItems: MemberRankingItem[] = items.map(item => {
      const normViews = maxViews === minViews ? 1 : (item.totalViews - minViews) / (maxViews - minViews);
      const normER = maxER === minER ? 1 : (item.overallEngagementRate - minER) / (maxER - minER);
      const normPosts = maxPosts === minPosts ? 1 : (item.totalPosts - minPosts) / (maxPosts - minPosts);

      const score = (wViews * normViews + wER * normER + wPosts * normPosts) * 100;

      return {
        ...item,
        rank: 0,
        normalizedViews: Number(normViews.toFixed(2)),
        normalizedER: Number(normER.toFixed(2)),
        normalizedPosts: Number(normPosts.toFixed(2)),
        performanceScore: Number(score.toFixed(1)),
      };
    });

    // Sorting
    scoredItems.sort((a, b) => {
      if (rankBy === 'views') return b.totalViews - a.totalViews;
      if (rankBy === 'likes') return b.totalLikes - a.totalLikes;
      if (rankBy === 'comments') return b.totalComments - a.totalComments;
      if (rankBy === 'posts') return b.totalPosts - a.totalPosts;
      if (rankBy === 'er') return b.overallEngagementRate - a.overallEngagementRate;
      return b.performanceScore - a.performanceScore;
    });

    // Assign rank 1..N
    return scoredItems.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  // 4. Commission Rankings & Performance Breakdown
  public calculateCommissionRankings(
    performances: CalculatedPerformance[],
    commissions: Commission[],
    members: Member[]
  ): CommissionRankingItem[] {
    const totalDatasetViews = performances.reduce((acc, p) => acc + p.totalViews, 0);

    const list: CommissionRankingItem[] = commissions.map(comm => {
      const commMembers = members.filter(m => m.commissionId === comm.id);
      const commPerfs = performances.filter(p => p.commissionId === comm.id);

      let views = 0;
      let likes = 0;
      let comments = 0;
      let posts = 0;

      const memberViewMap: Record<string, number> = {};

      for (const p of commPerfs) {
        views += p.totalViews;
        likes += p.totalLikes;
        comments += p.totalComments;
        posts += p.posts;
        memberViewMap[p.memberName] = (memberViewMap[p.memberName] || 0) + p.totalViews;
      }

      let topMemberName = '-';
      let maxMemberViews = -1;
      for (const [name, v] of Object.entries(memberViewMap)) {
        if (v > maxMemberViews) {
          maxMemberViews = v;
          topMemberName = name;
        }
      }

      const er = views > 0 ? ((likes + comments) / views) * 100 : 0;
      const share = totalDatasetViews > 0 ? (views / totalDatasetViews) * 100 : 0;

      return {
        rank: 0,
        commissionId: comm.id,
        commissionName: comm.name,
        totalMembers: commMembers.length,
        totalViews: views,
        totalLikes: likes,
        totalComments: comments,
        totalPosts: posts,
        overallEngagementRate: Number(er.toFixed(2)),
        topMemberName,
        shareOfViewsPercent: Number(share.toFixed(1)),
      };
    });

    list.sort((a, b) => b.totalViews - a.totalViews);
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  // 5. Time Series Trend Generator (Daily, Weekly, Monthly)
  public getTimeSeries(
    performances: CalculatedPerformance[],
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): TimeSeriesPoint[] {
    if (performances.length === 0) return [];

    const map = new Map<string, {
      date: string;
      label: string;
      views: number;
      instagramViews: number;
      tiktokViews: number;
      likes: number;
      comments: number;
      posts: number;
    }>();

    for (const p of performances) {
      let key = p.date;
      let label = p.date;

      if (granularity === 'weekly') {
        const d = new Date(p.date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        key = monday.toISOString().split('T')[0];
        label = `W-${key.substring(5)}`;
      } else if (granularity === 'monthly') {
        key = p.date.substring(0, 7); // YYYY-MM
        label = key;
      }

      if (!map.has(key)) {
        map.set(key, {
          date: key,
          label,
          views: 0,
          instagramViews: 0,
          tiktokViews: 0,
          likes: 0,
          comments: 0,
          posts: 0,
        });
      }

      const pt = map.get(key)!;
      pt.views += p.totalViews;
      pt.instagramViews += p.instagramViews;
      pt.tiktokViews += p.tiktokViews;
      pt.likes += p.totalLikes;
      pt.comments += p.totalComments;
      pt.posts += p.posts;
    }

    const sortedKeys = Array.from(map.keys()).sort();
    return sortedKeys.map(k => {
      const pt = map.get(k)!;
      const er = pt.views > 0 ? ((pt.likes + pt.comments) / pt.views) * 100 : 0;
      return {
        ...pt,
        engagementRate: Number(er.toFixed(2)),
      };
    });
  }

  // 6. Scatter Correlation: Posts vs Total Views
  public getScatterCorrelation(
    performances: CalculatedPerformance[],
    members: Member[]
  ): { points: CorrelationPoint[]; pearsonR: number; correlationText: string } {
    const memberMap = new Map<string, Member>();
    members.forEach(m => memberMap.set(m.id, m));

    const agg: Record<string, { memberName: string; commissionName: string; posts: number; views: number; likes: number; comments: number }> = {};

    for (const p of performances) {
      if (!agg[p.memberId]) {
        agg[p.memberId] = {
          memberName: p.memberName,
          commissionName: p.commissionName,
          posts: 0,
          views: 0,
          likes: 0,
          comments: 0,
        };
      }
      agg[p.memberId].posts += p.posts;
      agg[p.memberId].views += p.totalViews;
      agg[p.memberId].likes += p.totalLikes;
      agg[p.memberId].comments += p.totalComments;
    }

    const points: CorrelationPoint[] = [];
    for (const [id, val] of Object.entries(agg)) {
      const er = val.views > 0 ? ((val.likes + val.comments) / val.views) * 100 : 0;
      points.push({
        memberId: id,
        memberName: val.memberName,
        commissionName: val.commissionName,
        posts: val.posts,
        views: val.views,
        engagementRate: Number(er.toFixed(2)),
      });
    }

    // Pearson Correlation Coefficient calculation
    const n = points.length;
    if (n < 3) {
      return { points, pearsonR: 0, correlationText: 'Data belum mencukupi untuk menghitung korelasi.' };
    }

    const avgX = points.reduce((acc, p) => acc + p.posts, 0) / n;
    const avgY = points.reduce((acc, p) => acc + p.views, 0) / n;

    let num = 0;
    let denX = 0;
    let denY = 0;

    for (const p of points) {
      const dx = p.posts - avgX;
      const dy = p.views - avgY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }

    const denom = Math.sqrt(denX * denY);
    const r = denom === 0 ? 0 : num / denom;
    const pearsonR = Number(r.toFixed(2));

    let correlationText = '';
    if (pearsonR >= 0.7) {
      correlationText = `Korelasi Positif Kuat (r = ${pearsonR}). Anggota dengan frekuensi posting lebih tinggi secara konsisten menghasilkan akumulasi views yang jauh lebih besar.`;
    } else if (pearsonR >= 0.4) {
      correlationText = `Korelasi Positif Moderat (r = ${pearsonR}). Peningkatan aktivitas posting berkontribusi positif terhadap perolehan views, diimbangi kualitas format video.`;
    } else if (pearsonR >= 0) {
      correlationText = `Korelasi Lemah (r = ${pearsonR}). Perolehan views lebih dipengaruhi oleh viralitas konten individu daripada sekadar kuantitas posting.`;
    } else {
      correlationText = `Korelasi Negatif (r = ${pearsonR}). Tidak ditemukan hubungan positif linier antara kuantitas posting dan capaian views.`;
    }

    return { points, pearsonR, correlationText };
  }

  // 7. Comparison: Period A vs Period B
  public comparePeriods(
    labelA: string,
    perfsA: CalculatedPerformance[],
    labelB: string,
    perfsB: CalculatedPerformance[]
  ): ComparisonResult {
    const sumA = this.calculateSummary(perfsA);
    const sumB = this.calculateSummary(perfsB);

    const getDelta = (valB: number, valA: number) => {
      const diff = valB - valA;
      const pct = valA === 0 ? (valB > 0 ? 100 : 0) : ((valB - valA) / valA) * 100;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (diff > 0.001) trend = 'up';
      else if (diff < -0.001) trend = 'down';
      return {
        value: Number(diff.toFixed(2)),
        percent: Number(pct.toFixed(1)),
        trend,
      };
    };

    return {
      periodA: {
        label: labelA,
        views: sumA.totalViews,
        likes: sumA.totalLikes,
        comments: sumA.totalComments,
        posts: sumA.totalPosts,
        er: sumA.overallEngagementRate,
      },
      periodB: {
        label: labelB,
        views: sumB.totalViews,
        likes: sumB.totalLikes,
        comments: sumB.totalComments,
        posts: sumB.totalPosts,
        er: sumB.overallEngagementRate,
      },
      delta: {
        views: getDelta(sumB.totalViews, sumA.totalViews),
        likes: getDelta(sumB.totalLikes, sumA.totalLikes),
        comments: getDelta(sumB.totalComments, sumA.totalComments),
        posts: getDelta(sumB.totalPosts, sumA.totalPosts),
        er: getDelta(sumB.overallEngagementRate, sumA.overallEngagementRate),
      },
    };
  }

  // 8. Automatic Rule-Based Insights Engine
  public generateInsights(
    summary: MetricSummary,
    commissionRankings: CommissionRankingItem[],
    memberRankings: MemberRankingItem[]
  ): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];

    if (summary.totalViews === 0 || summary.totalPosts === 0) {
      return [{
        id: 'ins-empty',
        category: 'growth',
        tone: 'neutral',
        title: 'Data Belum Cukup',
        narrative: 'Insufficient data to generate performance insights untuk filter periode yang dipilih.',
      }];
    }

    // 1. Growth Insight (vs Previous Period)
    if (summary.previousPeriod && summary.previousPeriod.totalViews > 0) {
      const viewsGrowth = ((summary.totalViews - summary.previousPeriod.totalViews) / summary.previousPeriod.totalViews) * 100;
      const postsGrowth = summary.previousPeriod.totalPosts > 0
        ? ((summary.totalPosts - summary.previousPeriod.totalPosts) / summary.previousPeriod.totalPosts) * 100
        : 0;

      if (viewsGrowth >= 10) {
        insights.push({
          id: 'ins-growth-up',
          category: 'growth',
          tone: 'positive',
          title: 'Lonjakan Performa Views',
          narrative: `Total views meningkat ${viewsGrowth.toFixed(1)}% dibanding periode sebelumnya, didukung oleh peningkatan aktivitas posting sebesar ${postsGrowth >= 0 ? '+' : ''}${postsGrowth.toFixed(1)}%.`,
          dataPoint: `+${viewsGrowth.toFixed(1)}% Views`,
        });
      } else if (viewsGrowth <= -10) {
        insights.push({
          id: 'ins-growth-down',
          category: 'growth',
          tone: 'caution',
          title: 'Penurunan Perolehan Views',
          narrative: `Total views terkoreksi ${Math.abs(viewsGrowth).toFixed(1)}% dibanding periode sebelumnya. Evaluasi variasi topik dan jadwal jam unggah konten anggota.`,
          dataPoint: `${viewsGrowth.toFixed(1)}% Views`,
        });
      } else {
        insights.push({
          id: 'ins-growth-stable',
          category: 'growth',
          tone: 'neutral',
          title: 'Stabilitas Performa Organik',
          narrative: `Total views stabil pada kisaran ${summary.totalViews.toLocaleString()} views dengan variasi pertumbuhan ${viewsGrowth >= 0 ? '+' : ''}${viewsGrowth.toFixed(1)}%.`,
          dataPoint: 'Performa Stabil',
        });
      }
    }

    // 2. Platform Comparison Insight (IG vs TikTok)
    const ttShare = summary.totalViews > 0 ? (summary.totalTiktokViews / summary.totalViews) * 100 : 0;
    const igShare = 100 - ttShare;

    if (ttShare >= 55) {
      insights.push({
        id: 'ins-platform-tt',
        category: 'platform',
        tone: 'positive',
        title: 'Dominasi Jangkauan TikTok',
        narrative: `TikTok menjadi motor utama jangkauan dengan kontribusi ${ttShare.toFixed(1)}% dari total views (${summary.totalTiktokViews.toLocaleString()} views) dengan Engagement Rate ${summary.tiktokEngagementRate}%.`,
        dataPoint: `${ttShare.toFixed(1)}% Pangsa TikTok`,
      });
    } else if (igShare >= 55) {
      insights.push({
        id: 'ins-platform-ig',
        category: 'platform',
        tone: 'positive',
        title: 'Kekuatan Komunitas Instagram',
        narrative: `Instagram mendominasi distribusi audiens sebesar ${igShare.toFixed(1)}% dari total views dengan Engagement Rate ${summary.instagramEngagementRate}%.`,
        dataPoint: `${igShare.toFixed(1)}% Pangsa IG`,
      });
    }

    // 3. Top Commission Contributor
    if (commissionRankings.length > 0) {
      const topComm = commissionRankings[0];
      insights.push({
        id: 'ins-top-comm',
        category: 'commission',
        tone: 'positive',
        title: `Pilar Utama: ${topComm.commissionName.split('-')[0].trim()}`,
        narrative: `${topComm.commissionName} mencatat kontribusi views terbesar (${topComm.totalViews.toLocaleString()} views atau ${topComm.shareOfViewsPercent}% total agregat) dipimpin oleh top performer ${topComm.topMemberName}.`,
        dataPoint: `${topComm.shareOfViewsPercent}% Kontribusi Komisi`,
      });
    }

    // 4. Engagement Health vs Views
    if (summary.overallEngagementRate >= 7.0) {
      insights.push({
        id: 'ins-er-high',
        category: 'engagement',
        tone: 'positive',
        title: 'Tingkat Keterlibatan Prima',
        narrative: `Average Engagement Rate mencapai ${summary.overallEngagementRate}%, melampaui standar industri (4.5% - 6.0%), menandakan relevansi konten sangat tinggi di mata audiens.`,
        dataPoint: `${summary.overallEngagementRate}% Avg ER`,
      });
    } else if (summary.overallEngagementRate < 4.0) {
      insights.push({
        id: 'ins-er-low',
        category: 'engagement',
        tone: 'caution',
        title: 'Peluang Optimasi Interaksi',
        narrative: `Meskipun jangkauan views tercatat ${summary.totalViews.toLocaleString()}, Engagement Rate berada di angka ${summary.overallEngagementRate}%. Dorong call-to-action di kolom komentar untuk meningkatkan interaksi.`,
        dataPoint: `${summary.overallEngagementRate}% ER Terpantau Rendah`,
      });
    }

    // 5. Star Member Consistency
    if (memberRankings.length > 0) {
      const star = memberRankings[0];
      insights.push({
        id: 'ins-star-member',
        category: 'posting',
        tone: 'positive',
        title: `Top Performer: ${star.memberName}`,
        narrative: `${star.memberName} meraih ranking #1 dengan Performance Score ${star.performanceScore} pts, memproduksi ${star.totalPosts} konten dengan total ${star.totalViews.toLocaleString()} views.`,
        dataPoint: `#1 Score ${star.performanceScore}`,
      });
    }

    return insights;
  }

  // 9. Anomaly & Alerts Detection Engine
  public detectAnomalies(
    performances: CalculatedPerformance[],
    members: Member[],
    settings: AppSettings
  ): AnomalyAlert[] {
    const alerts: AnomalyAlert[] = [];

    // Group by member
    const memberPerfMap: Record<string, CalculatedPerformance[]> = {};
    for (const p of performances) {
      if (!memberPerfMap[p.memberId]) memberPerfMap[p.memberId] = [];
      memberPerfMap[p.memberId].push(p);
    }

    // 1. Zero Posting alert for active members
    for (const m of members) {
      if (m.status === 'active') {
        const perfs = memberPerfMap[m.id] || [];
        const totalPosts = perfs.reduce((acc, p) => acc + p.posts, 0);
        if (totalPosts === 0 && performances.length > 0) {
          alerts.push({
            id: `alert-zero-${m.id}`,
            type: 'zero_posts',
            severity: 'warning',
            title: `Tidak Ada Posting Aktif: ${m.name}`,
            description: `Anggota berstatus aktif ini belum mempublikasikan konten sama sekali pada rentang waktu yang sedang difilter.`,
            memberId: m.id,
            memberName: m.name,
          });
        }
      }
    }

    // 2. Drop / Spike check per member daily vs average
    for (const [memberId, perfs] of Object.entries(memberPerfMap)) {
      if (perfs.length < 3) continue;

      const member = members.find(m => m.id === memberId);
      const name = member ? member.name : 'Anggota';

      const avgViews = perfs.reduce((acc, p) => acc + p.totalViews, 0) / perfs.length;

      for (const p of perfs) {
        // Spike check (> spike threshold %)
        const spikeRatio = avgViews > 0 ? ((p.totalViews - avgViews) / avgViews) * 100 : 0;
        if (spikeRatio >= settings.anomalySpikeThreshold && p.totalViews > 25000) {
          alerts.push({
            id: `alert-spike-${p.id}`,
            type: 'spike',
            severity: 'info',
            title: `Lonjakan Views Luar Biasa: ${name}`,
            description: `Mencatat ${p.totalViews.toLocaleString()} views pada tanggal ${p.date}, melompat +${spikeRatio.toFixed(0)}% di atas rata-rata hariannya.`,
            date: p.date,
            memberId,
            memberName: name,
          });
        }

        // Anomaly low ER check on high views
        if (p.totalViews > 10000 && p.overallEngagementRate < 2.0) {
          alerts.push({
            id: `alert-lower-${p.id}`,
            type: 'low_engagement',
            severity: 'warning',
            title: `Engagement Rate Sangat Rendah: ${name}`,
            description: `Pada ${p.date}, konten meraih ${p.totalViews.toLocaleString()} views namun interaksi hanya ${p.overallEngagementRate}% (indikasi drop interaksi).`,
            date: p.date,
            memberId,
            memberName: name,
          });
        }
      }
    }

    // 3. Duplicate check in dataset
    const seen = new Set<string>();
    for (const p of performances) {
      const key = `${p.memberId}-${p.date}`;
      if (seen.has(key)) {
        alerts.push({
          id: `alert-dup-${p.id}`,
          type: 'duplicate',
          severity: 'danger',
          title: `Duplikasi Data Terdeteksi: ${p.memberName}`,
          description: `Terdapat lebih dari satu rekaman performa untuk anggota ini pada tanggal ${p.date}. Silakan periksa di Data Quality.`,
          date: p.date,
          memberId: p.memberId,
          memberName: p.memberName,
        });
      }
      seen.add(key);
    }

    return alerts.slice(0, 10); // return top 10 relevant alerts
  }

  // 10. Data Quality Audit Diagnostics
  public auditDataQuality(
    performances: CalculatedPerformance[],
    members: Member[],
    commissions: Commission[]
  ): {
    totalRecords: number;
    validRecords: number;
    duplicateRecords: number;
    missingPosts: number;
    zeroViewRecords: number;
    unknownMembers: number;
    healthScorePercent: number;
    commissionCoveragePercent: number;
  } {
    const totalRecords = performances.length;
    let duplicateRecords = 0;
    let missingPosts = 0;
    let zeroViewRecords = 0;
    let unknownMembers = 0;

    const seen = new Set<string>();
    const validMemberIds = new Set(members.map(m => m.id));

    for (const p of performances) {
      const key = `${p.memberId}-${p.date}`;
      if (seen.has(key)) duplicateRecords++;
      seen.add(key);

      if (p.posts <= 0) missingPosts++;
      if (p.totalViews <= 0) zeroViewRecords++;
      if (!validMemberIds.has(p.memberId)) unknownMembers++;
    }

    const validRecords = Math.max(0, totalRecords - duplicateRecords - unknownMembers);
    const health = totalRecords > 0 ? (validRecords / totalRecords) * 100 : 100;

    const activeCommissionsWithPerfs = new Set(performances.map(p => p.commissionId)).size;
    const commCoverage = commissions.length > 0 ? (activeCommissionsWithPerfs / commissions.length) * 100 : 100;

    return {
      totalRecords,
      validRecords,
      duplicateRecords,
      missingPosts,
      zeroViewRecords,
      unknownMembers,
      healthScorePercent: Number(health.toFixed(1)),
      commissionCoveragePercent: Number(commCoverage.toFixed(1)),
    };
  }
}

export const analyticsService = new AnalyticsService();
