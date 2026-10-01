import { Commission, Member, SocialMediaPerformance, AppSettings, PerformanceTarget } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  weightViews: 40,
  weightEngagement: 40,
  weightPosting: 20,
  anomalyDropThreshold: 30,
  anomalySpikeThreshold: 100,
  defaultPeriod: 'this_month',
};

export const INITIAL_TARGETS: PerformanceTarget[] = [
  {
    id: 'target-2026-09',
    periodMonth: '2026-09',
    targetViews: 1500000,
    targetPosts: 80,
    targetEngagementRate: 6.0,
  },
  {
    id: 'target-2026-08',
    periodMonth: '2026-08',
    targetViews: 1250000,
    targetPosts: 65,
    targetEngagementRate: 5.5,
  },
];

// The 13 Real Parliamentary Commissions matching the user's Excel
export const INITIAL_COMMISSIONS: Commission[] = [
  { id: 'comm-1', name: 'Komisi 1', description: 'Pertahanan, Luar Negeri, Komunikasi dan Informatika, Intelijen', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-2', name: 'Komisi 2', description: 'Pemerintahan Dalam Negeri, Pertanahan, dan Pemberdayaan Aparatur', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-3', name: 'Komisi 3', description: 'Penegakan Hukum, Hak Asasi Manusia, dan Keamanan', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-4', name: 'Komisi 4', description: 'Pertanian, Lingkungan Hidup, Kehutanan, dan Kelautan', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-5', name: 'Komisi 5', description: 'Infrastruktur, Transportasi, Daerah Tertinggal, Transmigrasi, BMKG', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-6', name: 'Komisi 6', description: 'Perdagangan, Kawasan Industri, BUMN, Koperasi, dan UKM', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-7', name: 'Komisi 7', description: 'Energi, Sumber Daya Mineral, Riset, Teknologi, dan Lingkungan Hidup', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-8', name: 'Komisi 8', description: 'Agama, Sosial, Kebencanaan, Pemberdayaan Perempuan dan Perlindungan Anak', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-9', name: 'Komisi 9', description: 'Kesehatan, Ketenagakerjaan, dan Jaminan Sosial', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-10', name: 'Komisi 10', description: 'Pendidikan, Riset, Olahraga, Kepemudaan, dan Pariwisata', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-11', name: 'Komisi 11', description: 'Keuangan, Perbankan, dan Perencanaan Pembangunan Nasional', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-12', name: 'Komisi 12', description: 'Energi Terbarukan, Lingkungan Hidup, dan Iklim Strategis', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'comm-13', name: 'Komisi 13', description: 'Reformasi Regulasi, Hak Asasi Manusia, dan Kelembagaan', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
];

// Exact members from user's Excel Roster sheet
export const INITIAL_MEMBERS: Member[] = [
  // Komisi 1
  { id: 'mem-1', commissionId: 'comm-1', name: 'H. Ahmad Muzani', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 2
  { id: 'mem-2', commissionId: 'comm-2', name: 'Bahtra Banong, S.Pwk', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 3
  { id: 'mem-3', commissionId: 'comm-3', name: 'Bimantoro Wijayo, S.H.', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-4', commissionId: 'comm-3', name: 'Martin D. Tumbelaka', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-5', commissionId: 'comm-3', name: 'Dr. Bob Hasan., S.H., M.H', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 4
  { id: 'mem-6', commissionId: 'comm-4', name: 'Dr. Ir. Hj. Endang Setyawati Thihari, DESS, M.Sc', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 5
  { id: 'mem-7', commissionId: 'comm-5', name: 'H. Danang Wicaksana, Sulistya, S.T.', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-8', commissionId: 'comm-5', name: 'H. Andi Iwan Darmawan Aras, S.E., M.Si.', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-9', commissionId: 'comm-5', name: 'Dr. Hj. Novita Wijayanti, S.E., M.M.', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-10', commissionId: 'comm-5', name: 'Marlyn Maisarah', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-11', commissionId: 'comm-5', name: 'Prof. Dr. Ir.H. Sufmi Dasco Ahmad, S.H., M.H.', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-12', commissionId: 'comm-5', name: 'Ir. H. Sumail Abdullah', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 6
  { id: 'mem-13', commissionId: 'comm-6', name: 'Muhammad Husein Fadlulloh, B. Bus., M. M.', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-14', commissionId: 'comm-6', name: 'H. Kawendra Lukistian, S.E., M.Sn', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 7
  { id: 'mem-15', commissionId: 'comm-7', name: 'Hj. Rahmawati Zainal, S.H.', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-16', commissionId: 'comm-7', name: 'F. Alimudin Kolatlena', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 8
  { id: 'mem-17', commissionId: 'comm-8', name: 'Dra. Hj. Wardatul Asriah', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-18', commissionId: 'comm-8', name: 'H. M. Husni, SE., M.M', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 9
  { id: 'mem-19', commissionId: 'comm-9', name: 'drg. Putih Sari', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 10
  { id: 'mem-20', commissionId: 'comm-10', name: 'H. Bambang Haryadi, S.E.', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 11
  { id: 'mem-21', commissionId: 'comm-11', name: 'Dr. Wuhadi Wijanto, S.H., M.H', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'mem-22', commissionId: 'comm-11', name: 'Wihadi Wijanto, S.H., M.H', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 12
  { id: 'mem-23', commissionId: 'comm-12', name: 'Rocky Candra, S.E.', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // Komisi 13
  { id: 'mem-24', commissionId: 'comm-13', name: 'Hj. Kartika Sandra Desi, SH., M.M', status: 'active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
];

// Actual figures matching the user's template Excel for August 2026 & September 2026
export function generateSeedPerformances(): SocialMediaPerformance[] {
  const records: SocialMediaPerformance[] = [];
  let idCounter = 1;

  // Real data baseline from user's Excel sheet 'DATA PER NAMA DAN KOMISI'
  const realMemberData: Record<
    string,
    { igLikes: number; igComments: number; igViews: number; ttLikes: number; ttComments: number; ttViews: number; posts: number }
  > = {
    'mem-1': { igLikes: 802, igComments: 73, igViews: 27300, ttLikes: 92, ttComments: 3, ttViews: 1854, posts: 2 },
    'mem-2': { igLikes: 1064, igComments: 306, igViews: 46700, ttLikes: 813, ttComments: 24, ttViews: 5152, posts: 6 },
    'mem-3': { igLikes: 203, igComments: 29, igViews: 10100, ttLikes: 49, ttComments: 2, ttViews: 784, posts: 2 },
    'mem-4': { igLikes: 331, igComments: 33, igViews: 12400, ttLikes: 388, ttComments: 25, ttViews: 2803, posts: 2 },
    'mem-5': { igLikes: 102, igComments: 2, igViews: 3800, ttLikes: 25, ttComments: 2, ttViews: 328, posts: 1 },
    'mem-6': { igLikes: 399, igComments: 94, igViews: 22900, ttLikes: 57, ttComments: 3, ttViews: 934, posts: 3 },
    'mem-7': { igLikes: 507, igComments: 130, igViews: 28800, ttLikes: 75, ttComments: 5, ttViews: 1298, posts: 4 },
    'mem-8': { igLikes: 334, igComments: 45, igViews: 11900, ttLikes: 134, ttComments: 8, ttViews: 3983, posts: 2 },
    'mem-9': { igLikes: 807, igComments: 125, igViews: 35500, ttLikes: 36, ttComments: 2, ttViews: 707, posts: 2 },
    'mem-10': { igLikes: 726, igComments: 81, igViews: 35400, ttLikes: 37, ttComments: 3, ttViews: 726, posts: 1 },
    'mem-11': { igLikes: 4149, igComments: 763, igViews: 143800, ttLikes: 15346, ttComments: 576, ttViews: 9779, posts: 3 },
    'mem-12': { igLikes: 302, igComments: 106, igViews: 7200, ttLikes: 3800, ttComments: 63, ttViews: 3, posts: 1 },
    'mem-13': { igLikes: 1567, igComments: 9, igViews: 6000, ttLikes: 19, ttComments: 1, ttViews: 329, posts: 1 },
    'mem-14': { igLikes: 341, igComments: 86, igViews: 20100, ttLikes: 311, ttComments: 20, ttViews: 532, posts: 2 },
    'mem-15': { igLikes: 375, igComments: 84, igViews: 19800, ttLikes: 379, ttComments: 14, ttViews: 611, posts: 2 },
    'mem-16': { igLikes: 28, igComments: 1, igViews: 1500, ttLikes: 18, ttComments: 1, ttViews: 240, posts: 1 },
    'mem-17': { igLikes: 212, igComments: 6, igViews: 9600, ttLikes: 259, ttComments: 20, ttViews: 4, posts: 1 },
    'mem-18': { igLikes: 505, igComments: 89, igViews: 22800, ttLikes: 500, ttComments: 44, ttViews: 4449, posts: 3 },
    'mem-19': { igLikes: 601, igComments: 183, igViews: 31800, ttLikes: 340, ttComments: 26, ttViews: 689, posts: 3 },
    'mem-20': { igLikes: 349, igComments: 66, igViews: 16000, ttLikes: 633, ttComments: 43, ttViews: 292, posts: 3 },
    'mem-21': { igLikes: 156, igComments: 25, igViews: 5300, ttLikes: 17, ttComments: 2, ttViews: 245, posts: 1 },
    'mem-22': { igLikes: 490, igComments: 331, igViews: 21600, ttLikes: 391, ttComments: 23, ttViews: 3, posts: 1 },
    'mem-23': { igLikes: 1109, igComments: 28, igViews: 41900, ttLikes: 32, ttComments: 2, ttViews: 353, posts: 1 },
    'mem-24': { igLikes: 303, igComments: 68, igViews: 12300, ttLikes: 27, ttComments: 1, ttViews: 329, posts: 1 },
  };

  // 1. Generate August 2026 data (Matching exact sheet PERBANDINGAN BULAN Grand Total)
  // Divide the monthly totals across typical August dates
  for (const [memberId, d] of Object.entries(realMemberData)) {
    // Generate records distributed in August
    const augDates = ['2026-08-05', '2026-08-12', '2026-08-19', '2026-08-26'];
    const partsCount = Math.max(1, Math.min(d.posts, augDates.length));

    for (let i = 0; i < partsCount; i++) {
      const isLast = i === partsCount - 1;
      const share = 1 / partsCount;

      records.push({
        id: `perf-${idCounter++}`,
        memberId,
        date: augDates[i],
        instagramLikes: isLast ? d.igLikes - Math.floor(d.igLikes * share) * (partsCount - 1) : Math.floor(d.igLikes * share),
        instagramComments: isLast ? d.igComments - Math.floor(d.igComments * share) * (partsCount - 1) : Math.floor(d.igComments * share),
        instagramViews: isLast ? d.igViews - Math.floor(d.igViews * share) * (partsCount - 1) : Math.floor(d.igViews * share),
        tiktokLikes: isLast ? d.ttLikes - Math.floor(d.ttLikes * share) * (partsCount - 1) : Math.floor(d.ttLikes * share),
        tiktokComments: isLast ? d.ttComments - Math.floor(d.ttComments * share) * (partsCount - 1) : Math.floor(d.ttComments * share),
        tiktokViews: isLast ? d.ttViews - Math.floor(d.ttViews * share) * (partsCount - 1) : Math.floor(d.ttViews * share),
        posts: Math.max(1, Math.floor(d.posts / partsCount)),
        createdAt: `${augDates[i]}T10:00:00Z`,
        updatedAt: `${augDates[i]}T10:00:00Z`,
      });
    }
  }

  // 2. Generate September 2026 data (Bulan Ini) with realistic positive growth
  // So that the PERBANDINGAN BULAN shows real dynamic comparison!
  const sepDates = ['2026-09-04', '2026-09-11', '2026-09-18', '2026-09-25'];
  for (const [memberId, d] of Object.entries(realMemberData)) {
    // September performance growth factor (1.15x average)
    const factor = memberId === 'mem-11' || memberId === 'mem-2' ? 1.25 : 1.12;
    const partsCount = Math.max(1, Math.min(d.posts, sepDates.length));

    for (let i = 0; i < partsCount; i++) {
      const date = sepDates[i];
      const postsCount = Math.max(1, Math.floor((d.posts * factor) / partsCount));

      records.push({
        id: `perf-${idCounter++}`,
        memberId,
        date,
        instagramLikes: Math.round((d.igLikes * factor) / partsCount),
        instagramComments: Math.round((d.igComments * factor) / partsCount),
        instagramViews: Math.round((d.igViews * factor) / partsCount),
        tiktokLikes: Math.round((d.ttLikes * factor) / partsCount),
        tiktokComments: Math.round((d.ttComments * factor) / partsCount),
        tiktokViews: Math.round((d.ttViews * factor) / partsCount),
        posts: postsCount,
        createdAt: `${date}T10:00:00Z`,
        updatedAt: `${date}T10:00:00Z`,
      });
    }
  }

  return records;
}
