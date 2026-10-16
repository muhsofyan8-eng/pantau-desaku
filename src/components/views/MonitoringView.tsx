import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Paperclip, 
  Building2, 
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { ConsultationTicket, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';

interface MonitoringViewProps {
  consultations: ConsultationTicket[];
  activeRole: UserRole;
  onOpenTindakLanjutModal: (ticket: ConsultationTicket) => void;
  onOpenBeritaAcara: (ticket: ConsultationTicket) => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  consultations,
  activeRole,
  onOpenTindakLanjutModal,
  onOpenBeritaAcara
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter consultations with active recommendations or follow-up
  const followUpTickets = consultations.filter(t => 
    t.rekomendasi && t.rekomendasi.length > 0 || t.status === 'tindak_lanjut' || t.status === 'selesai' || t.nomorBeritaAcara
  );

  const filteredTickets = followUpTickets.filter(ticket => {
    const matchSearch = 
      ticket.namaDesa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.judulKonsultasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || ticket.bidang === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Buckets for Kanban columns
  const columnBelumDimulai = filteredTickets.filter(t => (t.progressTindakLanjut || 0) === 0 && t.status !== 'selesai');
  const columnProses = filteredTickets.filter(t => (t.progressTindakLanjut || 0) > 0 && (t.progressTindakLanjut || 0) < 80 && t.status !== 'selesai');
  const columnReviu = filteredTickets.filter(t => (t.progressTindakLanjut || 0) >= 80 && t.status !== 'selesai');
  const columnTuntas = filteredTickets.filter(t => t.status === 'selesai' || (t.progressTindakLanjut || 0) === 100);

  const renderTicketCard = (ticket: ConsultationTicket) => {
    const cat = CATEGORY_LABELS[ticket.bidang];
    const recCount = ticket.rekomendasi?.length || 0;
    const completedCount = ticket.rekomendasi?.filter(r => r.status === 'tuntas').length || 0;

    return (
      <div 
        key={ticket.id}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-extrabold text-xs text-slate-900 block">{ticket.namaDesa}</span>
            <span className="text-[10px] text-slate-500">{ticket.kecamatan}</span>
          </div>
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${cat.badgeColor}`}>
            {cat.label}
          </span>
        </div>

        <h5 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
          {ticket.judulKonsultasi}
        </h5>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Progres Tindak Lanjut</span>
            <span className="font-extrabold text-emerald-700">{ticket.progressTindakLanjut || 0}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-1.5 rounded-full transition-all"
              style={{ width: `${ticket.progressTindakLanjut || 0}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-500">
            {completedCount} dari {recCount} Rekomendasi Terpenuhi
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onOpenBeritaAcara(ticket)}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
          >
            BA Rekomendasi
          </button>

          <button
            onClick={() => onOpenTindakLanjutModal(ticket)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-colors"
          >
            Update Bukti & Status
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Monitoring Tindak Lanjut Desa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Papan pemantauan kepatuhan pelaksanaan rekomendasi hasil konsultasi secara berkesinambungan.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200">
          <span>Total Terpantau: <strong className="text-slate-900">{followUpTickets.length} Desa</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari desa atau kecamatan..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white"
          >
            <option value="all">Semua Bidang Masalah</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Columns (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        
        {/* Col 1: Belum Dimulai */}
        <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span className="text-xs font-bold text-slate-700">Belum Dimulai</span>
            </div>
            <span className="text-xs font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
              {columnBelumDimulai.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[120px]">
            {columnBelumDimulai.length === 0 ? (
              <div className="text-center py-8 text-[11px] text-slate-400 italic">
                Tidak ada desa di tahap ini
              </div>
            ) : (
              columnBelumDimulai.map(renderTicketCard)
            )}
          </div>
        </div>

        {/* Col 2: Proses Pelaksanaan */}
        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-900">Proses Pelaksanaan</span>
            </div>
            <span className="text-xs font-bold bg-white text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
              {columnProses.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[120px]">
            {columnProses.length === 0 ? (
              <div className="text-center py-8 text-[11px] text-blue-400 italic">
                Tidak ada desa di tahap ini
              </div>
            ) : (
              columnProses.map(renderTicketCard)
            )}
          </div>
        </div>

        {/* Col 3: Menunggu Reviu OPD */}
        <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold text-amber-900">Menunggu Reviu OPD</span>
            </div>
            <span className="text-xs font-bold bg-white text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
              {columnReviu.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[120px]">
            {columnReviu.length === 0 ? (
              <div className="text-center py-8 text-[11px] text-amber-400 italic">
                Tidak ada desa di tahap ini
              </div>
            ) : (
              columnReviu.map(renderTicketCard)
            )}
          </div>
        </div>

        {/* Col 4: Tuntas Selesai */}
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-emerald-900">Tuntas & Selesai</span>
            </div>
            <span className="text-xs font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
              {columnTuntas.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[120px]">
            {columnTuntas.length === 0 ? (
              <div className="text-center py-8 text-[11px] text-emerald-400 italic">
                Belum ada desa yang tuntas
              </div>
            ) : (
              columnTuntas.map(renderTicketCard)
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
