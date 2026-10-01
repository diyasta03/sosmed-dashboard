import {
  Commission,
  Member,
  SocialMediaPerformance,
  CalculatedPerformance,
  ImportLog,
  AppSettings,
  PerformanceTarget,
} from '../types';
import {
  INITIAL_COMMISSIONS,
  INITIAL_MEMBERS,
  INITIAL_SETTINGS,
  INITIAL_TARGETS,
  generateSeedPerformances,
} from '../data/seedData';

const STORAGE_KEYS = {
  COMMISSIONS: 'smp_commissions_v2',
  MEMBERS: 'smp_members_v2',
  PERFORMANCES: 'smp_performances_v2',
  IMPORT_LOGS: 'smp_import_logs_v2',
  SETTINGS: 'smp_settings_v2',
  TARGETS: 'smp_targets_v2',
};

class StorageService {
  private commissions: Commission[] = [];
  private members: Member[] = [];
  private performances: SocialMediaPerformance[] = [];
  private importLogs: ImportLog[] = [];
  private settings: AppSettings = INITIAL_SETTINGS;
  private targets: PerformanceTarget[] = INITIAL_TARGETS;

  constructor() {
    this.init();
  }

  public init() {
    try {
      // 1. Commissions
      const rawCommissions = localStorage.getItem(STORAGE_KEYS.COMMISSIONS);
      if (rawCommissions) {
        this.commissions = JSON.parse(rawCommissions);
      } else {
        this.commissions = [...INITIAL_COMMISSIONS];
        this.saveCommissions();
      }

      // 2. Members
      const rawMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (rawMembers) {
        this.members = JSON.parse(rawMembers);
      } else {
        this.members = [...INITIAL_MEMBERS];
        this.saveMembers();
      }

      // 3. Settings
      const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (rawSettings) {
        this.settings = { ...INITIAL_SETTINGS, ...JSON.parse(rawSettings) };
      } else {
        this.settings = { ...INITIAL_SETTINGS };
        this.saveSettings();
      }

      // 4. Targets
      const rawTargets = localStorage.getItem(STORAGE_KEYS.TARGETS);
      if (rawTargets) {
        this.targets = JSON.parse(rawTargets);
      } else {
        this.targets = [...INITIAL_TARGETS];
        this.saveTargets();
      }

      // 5. Import Logs
      const rawLogs = localStorage.getItem(STORAGE_KEYS.IMPORT_LOGS);
      if (rawLogs) {
        this.importLogs = JSON.parse(rawLogs);
      } else {
        this.importLogs = [];
        this.saveImportLogs();
      }

      // 6. Performances
      const rawPerformances = localStorage.getItem(STORAGE_KEYS.PERFORMANCES);
      if (rawPerformances) {
        this.performances = JSON.parse(rawPerformances);
      } else {
        this.performances = generateSeedPerformances();
        this.savePerformances();
      }
    } catch (e) {
      console.error('Failed to initialize storage:', e);
      this.commissions = [...INITIAL_COMMISSIONS];
      this.members = [...INITIAL_MEMBERS];
      this.settings = { ...INITIAL_SETTINGS };
      this.targets = [...INITIAL_TARGETS];
      this.performances = generateSeedPerformances();
    }
  }

  public resetAllToSeed() {
    localStorage.removeItem(STORAGE_KEYS.COMMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.PERFORMANCES);
    localStorage.removeItem(STORAGE_KEYS.IMPORT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.TARGETS);

    this.commissions = [...INITIAL_COMMISSIONS];
    this.members = [...INITIAL_MEMBERS];
    this.settings = { ...INITIAL_SETTINGS };
    this.targets = [...INITIAL_TARGETS];
    this.importLogs = [];
    this.performances = generateSeedPerformances();

    this.saveCommissions();
    this.saveMembers();
    this.saveSettings();
    this.saveTargets();
    this.saveImportLogs();
    this.savePerformances();
  }

  // --- Persistence savers ---
  private saveCommissions() {
    localStorage.setItem(STORAGE_KEYS.COMMISSIONS, JSON.stringify(this.commissions));
  }
  private saveMembers() {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(this.members));
  }
  private savePerformances() {
    localStorage.setItem(STORAGE_KEYS.PERFORMANCES, JSON.stringify(this.performances));
  }
  private saveImportLogs() {
    localStorage.setItem(STORAGE_KEYS.IMPORT_LOGS, JSON.stringify(this.importLogs));
  }
  private saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
  }
  private saveTargets() {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(this.targets));
  }

  // --- Getters ---
  public getCommissions(): Commission[] {
    return [...this.commissions];
  }

  public getCommissionById(id: string): Commission | undefined {
    return this.commissions.find(c => c.id === id);
  }

  public getMembers(status?: 'active' | 'inactive'): Member[] {
    if (status) {
      return this.members.filter(m => m.status === status);
    }
    return [...this.members];
  }

  public getMemberById(id: string): Member | undefined {
    return this.members.find(m => m.id === id);
  }

  public getPerformances(): SocialMediaPerformance[] {
    return [...this.performances];
  }

  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public getTargets(): PerformanceTarget[] {
    return [...this.targets];
  }

  public getImportLogs(): ImportLog[] {
    return [...this.importLogs];
  }

  // --- Relational Joining & Calculation ---
  public getCalculatedPerformances(filters?: {
    startDate?: string;
    endDate?: string;
    memberId?: string;
    commissionId?: string;
    search?: string;
  }): CalculatedPerformance[] {
    const memberMap = new Map<string, Member>();
    this.members.forEach(m => memberMap.set(m.id, m));

    const commMap = new Map<string, Commission>();
    this.commissions.forEach(c => commMap.set(c.id, c));

    let list = this.performances;

    if (filters?.startDate) {
      list = list.filter(p => p.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      list = list.filter(p => p.date <= filters.endDate!);
    }
    if (filters?.memberId) {
      list = list.filter(p => p.memberId === filters.memberId);
    }

    const calculated: CalculatedPerformance[] = [];

    for (const p of list) {
      const member = memberMap.get(p.memberId);
      if (!member) continue;

      if (filters?.commissionId && member.commissionId !== filters.commissionId) {
        continue;
      }

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        if (!member.name.toLowerCase().includes(q) && !p.date.includes(q)) {
          continue;
        }
      }

      const comm = commMap.get(member.commissionId);
      const totalViews = p.instagramViews + p.tiktokViews;
      const totalLikes = p.instagramLikes + p.tiktokLikes;
      const totalComments = p.instagramComments + p.tiktokComments;

      const igER = p.instagramViews > 0 
        ? ((p.instagramLikes + p.instagramComments) / p.instagramViews) * 100 
        : 0;
      const ttER = p.tiktokViews > 0 
        ? ((p.tiktokLikes + p.tiktokComments) / p.tiktokViews) * 100 
        : 0;
      const overallER = totalViews > 0 
        ? ((totalLikes + totalComments) / totalViews) * 100 
        : 0;

      calculated.push({
        ...p,
        memberName: member.name,
        commissionId: member.commissionId,
        commissionName: comm ? comm.name : 'Unknown Commission',
        totalViews,
        totalLikes,
        totalComments,
        instagramEngagementRate: Number(igER.toFixed(2)),
        tiktokEngagementRate: Number(ttER.toFixed(2)),
        overallEngagementRate: Number(overallER.toFixed(2)),
      });
    }

    // Default sort by date desc
    return calculated.sort((a, b) => b.date.localeCompare(a.date));
  }

  // --- Performance Mutations ---
  public addPerformance(data: Omit<SocialMediaPerformance, 'id' | 'createdAt' | 'updatedAt'>): SocialMediaPerformance {
    // Check duplicate
    const exists = this.performances.find(p => p.memberId === data.memberId && p.date === data.date);
    if (exists) {
      throw new Error(`Data untuk anggota ini pada tanggal ${data.date} sudah ada.`);
    }

    const newPerf: SocialMediaPerformance = {
      ...data,
      id: `perf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.performances.unshift(newPerf);
    this.savePerformances();
    return newPerf;
  }

  public updatePerformance(id: string, data: Partial<Omit<SocialMediaPerformance, 'id' | 'createdAt'>>): SocialMediaPerformance {
    const idx = this.performances.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error(`Data performa dengan ID ${id} tidak ditemukan.`);
    }

    // Check duplicate if member or date changed
    if (data.date || data.memberId) {
      const targetMember = data.memberId || this.performances[idx].memberId;
      const targetDate = data.date || this.performances[idx].date;
      const dup = this.performances.find(p => p.id !== id && p.memberId === targetMember && p.date === targetDate);
      if (dup) {
        throw new Error(`Data untuk anggota ini pada tanggal ${targetDate} sudah ada.`);
      }
    }

    this.performances[idx] = {
      ...this.performances[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.savePerformances();
    return this.performances[idx];
  }

  public deletePerformance(id: string): boolean {
    const prevLen = this.performances.length;
    this.performances = this.performances.filter(p => p.id !== id);
    if (this.performances.length !== prevLen) {
      this.savePerformances();
      return true;
    }
    return false;
  }

  // Bulk upsert for Excel Import
  public bulkImportPerformances(
    records: Omit<SocialMediaPerformance, 'id' | 'createdAt' | 'updatedAt'>[],
    onDuplicate: 'skip' | 'update' = 'skip'
  ): { inserted: number; updated: number; skipped: number } {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const rec of records) {
      const idx = this.performances.findIndex(p => p.memberId === rec.memberId && p.date === rec.date);

      if (idx !== -1) {
        if (onDuplicate === 'update') {
          this.performances[idx] = {
            ...this.performances[idx],
            ...rec,
            updatedAt: new Date().toISOString(),
          };
          updated++;
        } else {
          skipped++;
        }
      } else {
        this.performances.unshift({
          ...rec,
          id: `perf-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        inserted++;
      }
    }

    this.savePerformances();
    return { inserted, updated, skipped };
  }

  // --- Member Mutations ---
  public addMember(data: { name: string; commissionId: string; status?: 'active' | 'inactive' }): Member {
    const newMember: Member = {
      id: `mem-${Date.now()}`,
      name: data.name.trim(),
      commissionId: data.commissionId,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.members.push(newMember);
    this.saveMembers();
    return newMember;
  }

  public updateMember(id: string, data: Partial<Omit<Member, 'id' | 'createdAt'>>): Member {
    const idx = this.members.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Member tidak ditemukan.');

    this.members[idx] = {
      ...this.members[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.saveMembers();
    return this.members[idx];
  }

  public deleteMember(id: string): boolean {
    const hasData = this.performances.some(p => p.memberId === id);
    if (hasData) {
      throw new Error('Tidak dapat menghapus anggota yang memiliki rekaman data performa. Silakan nonaktifkan statusnya menjadi Inactive.');
    }
    const prev = this.members.length;
    this.members = this.members.filter(m => m.id !== id);
    if (this.members.length !== prev) {
      this.saveMembers();
      return true;
    }
    return false;
  }

  // --- Commission Mutations ---
  public addCommission(data: { name: string; description?: string }): Commission {
    const newComm: Commission = {
      id: `comm-${Date.now()}`,
      name: data.name.trim(),
      description: data.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.commissions.push(newComm);
    this.saveCommissions();
    return newComm;
  }

  public updateCommission(id: string, data: Partial<Omit<Commission, 'id' | 'createdAt'>>): Commission {
    const idx = this.commissions.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Komisi tidak ditemukan.');
    this.commissions[idx] = {
      ...this.commissions[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.saveCommissions();
    return this.commissions[idx];
  }

  public deleteCommission(id: string): boolean {
    const hasMembers = this.members.some(m => m.commissionId === id);
    if (hasMembers) {
      throw new Error('Tidak dapat menghapus komisi yang masih memiliki anggota terdaftar.');
    }
    const prev = this.commissions.length;
    this.commissions = this.commissions.filter(c => c.id !== id);
    if (this.commissions.length !== prev) {
      this.saveCommissions();
      return true;
    }
    return false;
  }

  // --- Settings & Targets Mutations ---
  public updateSettings(settings: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
    return this.settings;
  }

  public setTarget(target: Omit<PerformanceTarget, 'id'>): PerformanceTarget {
    const idx = this.targets.findIndex(t => t.periodMonth === target.periodMonth);
    if (idx !== -1) {
      this.targets[idx] = { ...this.targets[idx], ...target };
      this.saveTargets();
      return this.targets[idx];
    } else {
      const newT: PerformanceTarget = {
        ...target,
        id: `target-${Date.now()}`,
      };
      this.targets.push(newT);
      this.saveTargets();
      return newT;
    }
  }

  // --- Import Logs ---
  public addImportLog(log: Omit<ImportLog, 'id' | 'importedAt'>): ImportLog {
    const newLog: ImportLog = {
      ...log,
      id: `log-${Date.now()}`,
      importedAt: new Date().toISOString(),
    };
    this.importLogs.unshift(newLog);
    this.saveImportLogs();
    return newLog;
  }
}

export const storageService = new StorageService();
