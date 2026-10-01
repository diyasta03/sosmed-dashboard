import React, { useState, useMemo } from 'react';
import { Building2, Plus, Users, Eye, Heart, MessageCircle, FileText, Activity, ArrowRight, X } from 'lucide-react';
import { Commission, Member, CalculatedPerformance } from '../../types';
import { formatNumber, formatCompact } from '../../utils/formatters';

interface CommissionsViewProps {
  commissions: Commission[];
  members: Member[];
  performances: CalculatedPerformance[];
  onAddCommission: (data: { name: string; description?: string }) => void;
  onEditCommission: (id: string, data: Partial<Commission>) => void;
}

export const CommissionsView: React.FC<CommissionsViewProps> = ({
  commissions,
  members,
  performances,
  onAddCommission,
  onEditCommission,
}) => {
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');

  // Calculate aggregated metrics per commission
  const commStats = useMemo(() => {
    const stats: Record<
      string,
      {
        views: number;
        likes: number;
        comments: number;
        posts: number;
        er: number;
        members: Member[];
        topMemberName: string;
      }
    > = {};

    commissions.forEach((c) => {
      const commMembers = members.filter((m) => m.commissionId === c.id);
      stats[c.id] = {
        views: 0,
        likes: 0,
        comments: 0,
        posts: 0,
        er: 0,
        members: commMembers,
        topMemberName: '-',
      };
    });

    const memberViews: Record<string, { name: string; views: number; commId: string }> = {};

    for (const p of performances) {
      if (stats[p.commissionId]) {
        stats[p.commissionId].views += p.totalViews;
        stats[p.commissionId].likes += p.totalLikes;
        stats[p.commissionId].comments += p.totalComments;
        stats[p.commissionId].posts += p.posts;
      }

      if (!memberViews[p.memberId]) {
        memberViews[p.memberId] = { name: p.memberName, views: 0, commId: p.commissionId };
      }
      memberViews[p.memberId].views += p.totalViews;
    }

    // Top performer per commission
    for (const [commId, s] of Object.entries(stats)) {
      s.er = s.views > 0 ? Number((((s.likes + s.comments) / s.views) * 100).toFixed(2)) : 0;

      let maxV = -1;
      let topName = '-';
      for (const mv of Object.values(memberViews)) {
        if (mv.commId === commId && mv.views > maxV) {
          maxV = mv.views;
          topName = mv.name;
        }
      }
      s.topMemberName = topName;
    }

    return stats;
  }, [commissions, members, performances]);

  const totalOrgViews = performances.reduce((a, b) => a + b.totalViews, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim()) return;
    onAddCommission({ name: newCommName.trim(), description: newCommDesc.trim() });
    setNewCommName('');
    setNewCommDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-slate-900">
            Daftar Komisi & Divisi ({commissions.length} Komisi)
          </h3>
          <p className="text-xs text-slate-500">
            Klik pada kartu komisi untuk melihat personil dan rincian kontribusi
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Komisi</span>
        </button>
      </div>

      {/* Commission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {commissions.map((comm) => {
          const st = commStats[comm.id] || {
            views: 0,
            likes: 0,
            comments: 0,
            posts: 0,
            er: 0,
            members: [],
            topMemberName: '-',
          };
          const sharePct = totalOrgViews > 0 ? (st.views / totalOrgViews) * 100 : 0;

          return (
            <div
              key={comm.id}
              onClick={() => setSelectedCommission(comm)}
              className="bg-white border border-slate-200/90 hover:border-indigo-400 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {sharePct.toFixed(1)}% Share
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 mb-1 line-clamp-1">{comm.name}</h4>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{comm.description || 'Tidak ada deskripsi'}</p>

                {/* Stat pills */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Views</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {formatCompact(st.views)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Interaksi</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {formatCompact(st.likes + st.comments)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg ER</span>
                    <span className="font-bold text-indigo-700 font-mono">{st.er}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{st.members.length} Anggota</span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  Top: {st.topMemberName}
                  <ArrowRight className="w-3 h-3 text-indigo-600" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commission Detail Modal */}
      {selectedCommission && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedCommission.name}</h3>
                <p className="text-xs text-slate-500">{selectedCommission.description}</p>
              </div>
              <button
                onClick={() => setSelectedCommission(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-indigo-800 text-[11px] block">Top Performer Komisi</span>
                  <span className="font-bold text-sm text-indigo-950">
                    {commStats[selectedCommission.id]?.topMemberName || '-'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-indigo-800 text-[11px] block">Akumulasi Views Komisi</span>
                  <span className="font-bold text-sm text-indigo-950 font-mono">
                    {formatNumber(commStats[selectedCommission.id]?.views || 0)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Daftar Personil ({commStats[selectedCommission.id]?.members.length || 0} Anggota)
                </h4>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {(commStats[selectedCommission.id]?.members || []).map((m) => (
                    <div key={m.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block">{m.name}</span>
                          <span className="text-[11px] text-slate-400">
                            Status: {m.status === 'active' ? 'Aktif' : 'Non-aktif'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ID: {m.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedCommission(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-2xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Commission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="font-semibold text-sm text-slate-900 mb-3">Tambah Komisi Baru</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Komisi *</label>
                <input
                  type="text"
                  required
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  placeholder="Contoh: Komisi F - Pengembangan Bisnis"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Deskripsi Tugas</label>
                <textarea
                  rows={3}
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                  placeholder="Rincian fokus divisi dan tanggung jawab..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
                >
                  Simpan Komisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
