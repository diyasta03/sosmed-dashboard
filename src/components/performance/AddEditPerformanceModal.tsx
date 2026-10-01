import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Activity,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  Calculator,
  Sparkles,
} from 'lucide-react';
import { CalculatedPerformance, Member, Commission, SocialMediaPerformance, PostDetailItem } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface AddEditPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SocialMediaPerformance, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editData?: CalculatedPerformance | null;
  members: Member[];
  commissions: Commission[];
}

export const AddEditPerformanceModal: React.FC<AddEditPerformanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editData,
  members,
  commissions,
}) => {
  const [memberId, setMemberId] = useState('');
  const [date, setDate] = useState('2026-09-27');
  const [posts, setPosts] = useState(1);

  // Input Mode: 'breakdown' (per post auto-sum) vs 'aggregate' (single direct input)
  const [inputMode, setInputMode] = useState<'breakdown' | 'aggregate'>('aggregate');

  // Breakdown post items
  const [postItems, setPostItems] = useState<PostDetailItem[]>([
    {
      postNumber: 1,
      titleOrTopic: 'Konten #1',
      instagramViews: 0,
      instagramLikes: 0,
      instagramComments: 0,
      tiktokViews: 0,
      tiktokLikes: 0,
      tiktokComments: 0,
    },
  ]);

  // Aggregate single inputs
  const [igViews, setIgViews] = useState(0);
  const [igLikes, setIgLikes] = useState(0);
  const [igComments, setIgComments] = useState(0);

  const [ttViews, setTtViews] = useState(0);
  const [ttLikes, setTtLikes] = useState(0);
  const [ttComments, setTtComments] = useState(0);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editData) {
      setMemberId(editData.memberId);
      setDate(editData.date);
      setPosts(editData.posts);
      setIgViews(editData.instagramViews);
      setIgLikes(editData.instagramLikes);
      setIgComments(editData.instagramComments);
      setTtViews(editData.tiktokViews);
      setTtLikes(editData.tiktokLikes);
      setTtComments(editData.tiktokComments);

      if (editData.postBreakdown && editData.postBreakdown.length > 0) {
        setPostItems(editData.postBreakdown);
        setInputMode('breakdown');
      } else {
        setInputMode('aggregate');
      }
    } else {
      setMemberId(members[0]?.id || '');
      setDate('2026-09-27');
      setPosts(1);
      setIgViews(0);
      setIgLikes(0);
      setIgComments(0);
      setTtViews(0);
      setTtLikes(0);
      setTtComments(0);
      setPostItems([
        {
          postNumber: 1,
          titleOrTopic: 'Konten #1',
          instagramViews: 0,
          instagramLikes: 0,
          instagramComments: 0,
          tiktokViews: 0,
          tiktokLikes: 0,
          tiktokComments: 0,
        },
      ]);
      setInputMode('aggregate');
    }
    setErrorMsg('');
  }, [editData, isOpen, members]);

  // When posts count changes from input, sync postItems if in breakdown mode
  const handlePostsCountChange = (count: number) => {
    const validCount = Math.max(1, count);
    setPosts(validCount);

    if (validCount > 1 && inputMode === 'aggregate') {
      // Auto-suggest breakdown mode when posts > 1
      setInputMode('breakdown');
    }

    setPostItems((prev) => {
      const next = [...prev];
      while (next.length < validCount) {
        next.push({
          postNumber: next.length + 1,
          titleOrTopic: `Konten #${next.length + 1}`,
          instagramViews: 0,
          instagramLikes: 0,
          instagramComments: 0,
          tiktokViews: 0,
          tiktokLikes: 0,
          tiktokComments: 0,
        });
      }
      return next.slice(0, validCount);
    });
  };

  const handleAddPostItem = () => {
    const nextCount = postItems.length + 1;
    setPosts(nextCount);
    setPostItems((prev) => [
      ...prev,
      {
        postNumber: nextCount,
        titleOrTopic: `Konten #${nextCount}`,
        instagramViews: 0,
        instagramLikes: 0,
        instagramComments: 0,
        tiktokViews: 0,
        tiktokLikes: 0,
        tiktokComments: 0,
      },
    ]);
  };

  const handleRemovePostItem = (idx: number) => {
    if (postItems.length <= 1) return;
    const next = postItems.filter((_, i) => i !== idx).map((item, i) => ({
      ...item,
      postNumber: i + 1,
    }));
    setPostItems(next);
    setPosts(next.length);
  };

  const handleUpdatePostItem = (idx: number, field: keyof PostDetailItem, val: any) => {
    setPostItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  if (!isOpen) return null;

  // Selected member's commission
  const selectedMember = members.find((m) => m.id === memberId);
  const commission = selectedMember
    ? commissions.find((c) => c.id === selectedMember.commissionId)
    : null;

  // Calculate live sums
  let currentIgViews = Number(igViews || 0);
  let currentIgLikes = Number(igLikes || 0);
  let currentIgComments = Number(igComments || 0);

  let currentTtViews = Number(ttViews || 0);
  let currentTtLikes = Number(ttLikes || 0);
  let currentTtComments = Number(ttComments || 0);

  if (inputMode === 'breakdown') {
    currentIgViews = postItems.reduce((acc, p) => acc + (Number(p.instagramViews) || 0), 0);
    currentIgLikes = postItems.reduce((acc, p) => acc + (Number(p.instagramLikes) || 0), 0);
    currentIgComments = postItems.reduce((acc, p) => acc + (Number(p.instagramComments) || 0), 0);

    currentTtViews = postItems.reduce((acc, p) => acc + (Number(p.tiktokViews) || 0), 0);
    currentTtLikes = postItems.reduce((acc, p) => acc + (Number(p.tiktokLikes) || 0), 0);
    currentTtComments = postItems.reduce((acc, p) => acc + (Number(p.tiktokComments) || 0), 0);
  }

  const totalViews = currentIgViews + currentTtViews;
  const totalLikes = currentIgLikes + currentTtLikes;
  const totalComments = currentIgComments + currentTtComments;
  const liveOverallER = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;
  const liveIgER = currentIgViews > 0 ? ((currentIgLikes + currentIgComments) / currentIgViews) * 100 : 0;
  const liveTtER = currentTtViews > 0 ? ((currentTtLikes + currentTtComments) / currentTtViews) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) {
      setErrorMsg('Pilih anggota terlebih dahulu.');
      return;
    }
    if (!date) {
      setErrorMsg('Tanggal harus diisi.');
      return;
    }
    if (posts < 1) {
      setErrorMsg('Jumlah posting minimal 1.');
      return;
    }

    try {
      onSave({
        memberId,
        date,
        posts: Number(posts),
        instagramViews: currentIgViews,
        instagramLikes: currentIgLikes,
        instagramComments: currentIgComments,
        tiktokViews: currentTtViews,
        tiktokLikes: currentTtLikes,
        tiktokComments: currentTtComments,
        postBreakdown: inputMode === 'breakdown' ? postItems : undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-semibold text-base text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>{editData ? 'Perbarui Data Performa' : 'Input Data Performa Harian'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Otomatis menghitung total & engagement rate per hari (mendukung multi-posting per hari)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Member & Commission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Anggota *
              </label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({commissions.find((c) => c.id === m.commissionId)?.name || 'Komisi'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Komisi Terdaftar
              </label>
              <input
                type="text"
                disabled
                value={commission ? commission.name : '-'}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-100 text-slate-600 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Date & Posts Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Publikasi *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Posting Pada Hari Ini *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={posts}
                  onChange={(e) => handlePostsCountChange(Number(e.target.value))}
                  className="w-24 text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-center"
                  required
                />
                <span className="text-xs text-slate-500">
                  {posts > 1 ? `${posts} konten terpublikasi hari ini` : '1 konten'}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher when Posts > 1 */}
          {posts > 1 && (
            <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-indigo-950 font-semibold">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Lebih Dari 1 Posting Terdeteksi ({posts} Konten)</span>
                </div>

                <div className="flex items-center gap-1 p-0.5 bg-white border border-indigo-200 rounded-lg text-[11px]">
                  <button
                    type="button"
                    onClick={() => setInputMode('breakdown')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      inputMode === 'breakdown'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Rincian Per Konten (Auto-Sum)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('aggregate')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      inputMode === 'aggregate'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Total Sekaligus
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                {inputMode === 'breakdown'
                  ? 'Ketik views, likes, dan comments untuk masing-masing konten. Sistem akan menjumlahkannya secara otomatis ke total harian tanpa perlu kalkulator manual.'
                  : 'Masukkan angka total langsung jika Anda sudah memiliki hasil penjumlahan.'}
              </p>
            </div>
          )}

          {/* MODE 1: BREAKDOWN PER POSTING (AUTO-SUM) */}
          {inputMode === 'breakdown' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Rincian Tiap Konten ({postItems.length} Konten)
                </span>
                <button
                  type="button"
                  onClick={handleAddPostItem}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded-md hover:bg-indigo-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Konten #{postItems.length + 1}</span>
                </button>
              </div>

              {postItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.titleOrTopic || ''}
                        onChange={(e) => handleUpdatePostItem(idx, 'titleOrTopic', e.target.value)}
                        placeholder={`Judul/Topik Postingan #${idx + 1} (Opsional)`}
                        className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-60 sm:w-80"
                      />
                    </div>

                    {postItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePostItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Hapus Konten Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Sub inputs for Post i: IG & TikTok */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* IG */}
                    <div className="p-2.5 bg-pink-50/60 border border-pink-100 rounded-lg space-y-1.5">
                      <span className="font-semibold text-pink-900 block text-[11px]">
                        Instagram Post #{idx + 1}
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <div>
                          <label className="block text-[10px] text-slate-500">Views</label>
                          <input
                            type="number"
                            min={0}
                            value={item.instagramViews || ''}
                            onChange={(e) =>
                              handleUpdatePostItem(idx, 'instagramViews', Number(e.target.value))
                            }
                            className="w-full text-xs border border-pink-200 rounded px-1.5 py-1 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Likes</label>
                          <input
                            type="number"
                            min={0}
                            value={item.instagramLikes || ''}
                            onChange={(e) =>
                              handleUpdatePostItem(idx, 'instagramLikes', Number(e.target.value))
                            }
                            className="w-full text-xs border border-pink-200 rounded px-1.5 py-1 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Comments</label>
                          <input
                            type="number"
                            min={0}
                            value={item.instagramComments || ''}
                            onChange={(e) =>
                              handleUpdatePostItem(idx, 'instagramComments', Number(e.target.value))
                            }
                            className="w-full text-xs border border-pink-200 rounded px-1.5 py-1 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* TikTok */}
                    <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg space-y-1.5">
                      <span className="font-semibold text-slate-900 block text-[11px]">
                        TikTok Post #{idx + 1}
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <div>
                          <label className="block text-[10px] text-slate-500">Views</label>
                          <input
                            type="number"
                            min={0}
                            value={item.tiktokViews || ''}
                            onChange={(e) =>
                              handleUpdatePostItem(idx, 'tiktokViews', Number(e.target.value))
                            }
                            className="w-full text-xs border border-slate-300 rounded px-1.5 py-1 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Likes</label>
                          <input
                            type="number"
                            min={0}
                            value={item.tiktokLikes || ''}
                            onChange={(e) =>
                              handleUpdatePostItem(idx, 'tiktokLikes', Number(e.target.value))
                            }
                            className="w-full text-xs border border-slate-300 rounded px-1.5 py-1 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Comments</label>
                          <input
                            type="number"
                            min={0}
                            value={item.tiktokComments || ''}
                            onChange={(e) =>
                              handleUpdatePostItem(idx, 'tiktokComments', Number(e.target.value))
                            }
                            className="w-full text-xs border border-slate-300 rounded px-1.5 py-1 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODE 2: DIRECT AGGREGATE INPUT (Used when posts=1 or toggled) */}
          {inputMode === 'aggregate' && (
            <div className="space-y-3">
              {/* Instagram Section */}
              <div className="p-3.5 bg-pink-50/50 border border-pink-100 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-pink-900 border-b border-pink-100 pb-1.5">
                  <span>Metrik Instagram Total</span>
                  <span className="font-mono text-pink-700 text-[11px]">
                    Preview ER: {liveIgER.toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Views</label>
                    <input
                      type="number"
                      min={0}
                      value={igViews}
                      onChange={(e) => setIgViews(Number(e.target.value))}
                      className="w-full text-xs border border-pink-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Likes</label>
                    <input
                      type="number"
                      min={0}
                      value={igLikes}
                      onChange={(e) => setIgLikes(Number(e.target.value))}
                      className="w-full text-xs border border-pink-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Comments</label>
                    <input
                      type="number"
                      min={0}
                      value={igComments}
                      onChange={(e) => setIgComments(Number(e.target.value))}
                      className="w-full text-xs border border-pink-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* TikTok Section */}
              <div className="p-3.5 bg-slate-100/70 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 border-b border-slate-200 pb-1.5">
                  <span>Metrik TikTok Total</span>
                  <span className="font-mono text-slate-700 text-[11px]">
                    Preview ER: {liveTtER.toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Views</label>
                    <input
                      type="number"
                      min={0}
                      value={ttViews}
                      onChange={(e) => setTtViews(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Likes</label>
                    <input
                      type="number"
                      min={0}
                      value={ttLikes}
                      onChange={(e) => setTtLikes(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Comments</label>
                    <input
                      type="number"
                      min={0}
                      value={ttComments}
                      onChange={(e) => setTtComments(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Calculated Auto-Sum Banner */}
          <div className="p-3.5 bg-indigo-900 text-white rounded-xl shadow-xs text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-indigo-200">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>
                  Hasil Penjumlahan Otomatis Hari Ini ({posts} Posting)
                </span>
              </span>
              <span className="font-mono text-emerald-300 font-bold text-sm">
                ER: {liveOverallER.toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-indigo-800/80 text-[11px]">
              <div>
                <span className="text-indigo-300 block">Total Views:</span>
                <span className="font-bold font-mono text-white text-xs">{formatNumber(totalViews)}</span>
              </div>
              <div>
                <span className="text-indigo-300 block">Total Likes:</span>
                <span className="font-bold font-mono text-white text-xs">{formatNumber(totalLikes)}</span>
              </div>
              <div>
                <span className="text-indigo-300 block">Total Comments:</span>
                <span className="font-bold font-mono text-white text-xs">{formatNumber(totalComments)}</span>
              </div>
              <div>
                <span className="text-indigo-300 block">Rasio IG / TT:</span>
                <span className="font-bold font-mono text-white text-xs">
                  {currentIgViews > 0 ? ((currentIgViews / (totalViews || 1)) * 100).toFixed(0) : 0}% /{' '}
                  {currentTtViews > 0 ? ((currentTtViews / (totalViews || 1)) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Rekaman Hari Ini</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
