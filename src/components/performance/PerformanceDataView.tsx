import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Edit2,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { CalculatedPerformance, Commission, Member } from '../../types';
import { formatNumber, formatCompact, formatDate } from '../../utils/formatters';

interface PerformanceDataViewProps {
  performances: CalculatedPerformance[];
  commissions: Commission[];
  members: Member[];
  onAdd: () => void;
  onEdit: (record: CalculatedPerformance) => void;
  onDelete: (id: string) => void;
  onImport: () => void;
  onExport: () => void;
}

type SortField =
  | 'date'
  | 'memberName'
  | 'commissionName'
  | 'totalViews'
  | 'totalLikes'
  | 'totalComments'
  | 'posts'
  | 'overallEngagementRate'
  | 'instagramViews'
  | 'tiktokViews';

export const PerformanceDataView: React.FC<PerformanceDataViewProps> = ({
  performances,
  commissions,
  members,
  onAdd,
  onEdit,
  onDelete,
  onImport,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommission, setSelectedCommission] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter & Search
  const filteredData = useMemo(() => {
    return performances.filter((item) => {
      if (selectedCommission && item.commissionId !== selectedCommission) return false;
      if (selectedMember && item.memberId !== selectedMember) return false;
      if (startDate && item.date < startDate) return false;
      if (endDate && item.date > endDate) return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = item.memberName.toLowerCase().includes(q);
        const matchesComm = item.commissionName.toLowerCase().includes(q);
        const matchesDate = item.date.includes(q);
        if (!matchesName && !matchesComm && !matchesDate) return false;
      }

      return true;
    });
  }, [performances, selectedCommission, selectedMember, startDate, endDate, searchTerm]);

  // Sort
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
    return sorted;
  }, [filteredData, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
      {/* Table Action & Filter Toolbar */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-slate-900">
              Tabel Rekaman Performa ({filteredData.length} baris)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onImport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Import Excel</span>
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export</span>
            </button>
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rekaman</span>
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama anggota / tanggal..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Commission filter */}
          <div>
            <select
              value={selectedCommission}
              onChange={(e) => {
                setSelectedCommission(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Komisi</option>
              {commissions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Member filter */}
          <div>
            <select
              value={selectedMember}
              onChange={(e) => {
                setSelectedMember(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Anggota</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="Dari tanggal"
            />
          </div>

          {/* End Date */}
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="Sampai tanggal"
            />
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Tanggal</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('memberName')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Anggota & Komisi</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('totalViews')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Views</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-right whitespace-nowrap">IG Views / TT Views</th>
              <th
                onClick={() => handleSort('totalLikes')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Likes</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('totalComments')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Comments</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('posts')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-center whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Posts</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('overallEngagementRate')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>ER (%)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Tidak ada rekaman data yang cocok dengan kriteria filter.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                    {formatDate(row.date)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">{row.memberName}</div>
                    <div className="text-[11px] text-slate-400">{row.commissionName}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-900 font-mono whitespace-nowrap">
                    {formatNumber(row.totalViews)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[11px] text-slate-500 whitespace-nowrap font-mono">
                    <span className="text-pink-600 font-medium">{formatCompact(row.instagramViews)}</span> /{' '}
                    <span className="text-slate-800 font-medium">{formatCompact(row.tiktokViews)}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                    {formatNumber(row.totalLikes)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                    {formatNumber(row.totalComments)}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-800 text-[11px]">
                      {row.posts}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <span
                      className={`font-semibold font-mono ${
                        row.overallEngagementRate >= 7.0
                          ? 'text-emerald-700'
                          : row.overallEngagementRate <= 3.5
                          ? 'text-rose-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {row.overallEngagementRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit Rekaman"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus data performa ${row.memberName} tanggal ${row.date}?`)) {
                            onDelete(row.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Hapus Rekaman"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Menampilkan</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-800 focus:outline-hidden"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>dari total {sortedData.length} baris</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 border border-slate-200 rounded bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-slate-200 rounded bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
