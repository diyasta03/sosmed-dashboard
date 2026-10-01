import React, { useState, useMemo } from 'react';
import { Search, Plus, Building2, User, Eye, Heart, MessageCircle, FileText, Activity } from 'lucide-react';
import { Member, Commission, CalculatedPerformance } from '../../types';
import { formatNumber, formatCompact } from '../../utils/formatters';
import { MemberDetailModal } from './MemberDetailModal';

interface MembersViewProps {
  members: Member[];
  commissions: Commission[];
  performances: CalculatedPerformance[];
  onAddMember: (data: { name: string; commissionId: string; status?: 'active' | 'inactive' }) => void;
  onEditMember: (id: string, data: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  commissions,
  performances,
  onAddMember,
  onEditMember,
  onDeleteMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommission, setSelectedCommission] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [activeMemberDetail, setActiveMemberDetail] = useState<Member | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberCommId, setNewMemberCommId] = useState(commissions[0]?.id || '');

  // Calculate aggregated stats per member
  const memberStats = useMemo(() => {
    const stats: Record<
      string,
      { views: number; likes: number; comments: number; posts: number; er: number }
    > = {};

    members.forEach((m) => {
      stats[m.id] = { views: 0, likes: 0, comments: 0, posts: 0, er: 0 };
    });

    for (const p of performances) {
      if (stats[p.memberId]) {
        stats[p.memberId].views += p.totalViews;
        stats[p.memberId].likes += p.totalLikes;
        stats[p.memberId].comments += p.totalComments;
        stats[p.memberId].posts += p.posts;
      }
    }

    for (const id of Object.keys(stats)) {
      const s = stats[id];
      s.er = s.views > 0 ? Number((((s.likes + s.comments) / s.views) * 100).toFixed(2)) : 0;
    }

    return stats;
  }, [members, performances]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (selectedCommission && m.commissionId !== selectedCommission) return false;
      if (selectedStatus && m.status !== selectedStatus) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!m.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [members, selectedCommission, selectedStatus, searchTerm]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember({
      name: newMemberName.trim(),
      commissionId: newMemberCommId || commissions[0]?.id,
    });
    setNewMemberName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama anggota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedCommission}
            onChange={(e) => setSelectedCommission(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Semua Komisi</option>
            {commissions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Non-aktif</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Anggota</span>
        </button>
      </div>

      {/* Members Directory Grid / Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Nama Anggota</th>
                <th className="py-3 px-4">Komisi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total Views</th>
                <th className="py-3 px-4 text-right">Total Likes</th>
                <th className="py-3 px-4 text-right">Comments</th>
                <th className="py-3 px-4 text-center">Posting</th>
                <th className="py-3 px-4 text-right">Engagement Rate</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada anggota yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const comm = commissions.find((c) => c.id === member.commissionId);
                  const st = memberStats[member.id] || { views: 0, likes: 0, comments: 0, posts: 0, er: 0 };
                  return (
                    <tr
                      key={member.id}
                      onClick={() => setActiveMemberDetail(member)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block hover:text-indigo-600">
                              {member.name}
                            </span>
                            <span className="text-[11px] text-slate-400">Klik untuk rincian profil</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {comm ? comm.name : 'Unknown'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            member.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {member.status === 'active' ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        {formatNumber(st.views)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {formatNumber(st.likes)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {formatNumber(st.comments)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className="inline-block px-2 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-800 text-[11px]">
                          {st.posts}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700">
                        {st.er}%
                      </td>
                      <td
                        className="py-3 px-4 text-center"
                        onClick={(e) => e.stopPropagation()} // don't open modal when clicking status toggle
                      >
                        <button
                          onClick={() => {
                            const newStatus = member.status === 'active' ? 'inactive' : 'active';
                            onEditMember(member.id, { status: newStatus });
                          }}
                          className="text-[11px] text-slate-500 hover:text-indigo-600 hover:underline"
                        >
                          {member.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Deep-Dive Modal */}
      {activeMemberDetail && (
        <MemberDetailModal
          member={activeMemberDetail}
          commission={commissions.find((c) => c.id === activeMemberDetail.commissionId)}
          performances={performances}
          onClose={() => setActiveMemberDetail(null)}
        />
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="font-semibold text-sm text-slate-900 mb-3">Tambah Anggota Baru</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Komisi *</label>
                <select
                  value={newMemberCommId}
                  onChange={(e) => setNewMemberCommId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {commissions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
