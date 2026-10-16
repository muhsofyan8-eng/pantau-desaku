import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  Calendar, 
  Building2, 
  Download, 
  ChevronRight,
  Sparkles,
  Printer
} from 'lucide-react';
import { ConsultationTicket, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';

interface KonsultasiViewProps {
  consultations: ConsultationTicket[];
  activeRole: UserRole;
  onOpenBeritaAcara: (ticket: ConsultationTicket) => void;
  onSelectTicketForMeet: (ticket: ConsultationTicket) => void;
}

export const KonsultasiView: React.FC<KonsultasiViewProps> = ({
  consultations,
  activeRole,
  onOpenBeritaAcara,
  onSelectTicketForMeet
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(consultations[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTicket = consultations.find(c => c.id === selectedTicketId) || consultations[0];

  const filteredTickets = consultations.filter(ticket => 
    ticket.namaDesa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.judulKonsultasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.nomorRegistrasi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Dokumentasi Konsultasi & Hasil Pembahasan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arsip lengkap catatan notulensi pembahasan masalah desa, telaah aturan hukum, dan presensi.
          </p>
        </div>

        {activeTicket?.nomorBeritaAcara && (
          <button
            onClick={() => onOpenBeritaAcara(activeTicket)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Berita Acara Resmi</span>
          </button>
        )}
      </div>

      {/* Main Grid: Left List (4 cols) & Right Detailed Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari desa atau topik..."
                className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filteredTickets.map(ticket => {
              const isSelected = ticket.id === activeTicket?.id;
              const cat = CATEGORY_LABELS[ticket.bidang];

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-extrabold text-slate-900 truncate">
                      {ticket.namaDesa}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ticket.nomorRegistrasi}
                    </span>
                  </div>

                  <h5 className="text-xs font-semibold text-slate-700 line-clamp-2 leading-snug">
                    {ticket.judulKonsultasi}
                  </h5>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className={`px-2 py-0.5 rounded-full font-medium border ${cat.badgeColor}`}>
                      {cat.label}
                    </span>
                    <span>{ticket.tanggalKonsultasi || ticket.tanggalPengajuan}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-8">
          {activeTicket ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              
              {/* Header Badge */}
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      {activeTicket.namaDesa} ({activeTicket.kecamatan})
                    </span>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                      {activeTicket.nomorRegistrasi}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mt-1">
                    {activeTicket.judulKonsultasi}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {activeTicket.googleMeetLink && (
                    <button
                      onClick={() => onSelectTicketForMeet(activeTicket)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold"
                    >
                      Buka Ruang Meet
                    </button>
                  )}
                </div>
              </div>

              {/* Data Umum Konsultasi */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tanggal Konsultasi:</span>
                  <span className="font-bold text-slate-800">{activeTicket.tanggalKonsultasi || activeTicket.tanggalPengajuan}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Waktu Sesi:</span>
                  <span className="font-bold text-slate-800">{activeTicket.waktuMulai || '10:00'} - {activeTicket.waktuSelesai || '11:15'} WIB</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Narasumber Utama:</span>
                  <span className="font-bold text-slate-800">{activeTicket.tenagaAhliNama || 'DPMD'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status Fasilitasi:</span>
                  <span className="font-bold text-emerald-700 capitalize">{activeTicket.status.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Uraian Masalah Awal */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Uraian Masalah yang Dikonsultasikan
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {activeTicket.uraianMasalah}
                </div>
              </div>

              {/* Hasil Pembahasan Google Meet */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Notulensi Hasil Pembahasan Tatap Muka Online</span>
                </h4>
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-slate-800 leading-relaxed space-y-3">
                  <p>
                    {activeTicket.notulensiKonsultasi?.rangkumanPembahasan || 
                     'Pembahasan tatap muka telah mencakup sinkronisasi regulasi terkait, pencocokan bukti lampiran administrasi desa, serta formulasi langkah perbaikan.'}
                  </p>

                  {/* Points */}
                  {activeTicket.notulensiKonsultasi?.pokokMasalahTeridentifikasi && (
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">
                        Poin Kritis yang Harus Diselesaikan:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        {activeTicket.notulensiKonsultasi.pokokMasalahTeridentifikasi.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Telaah Regulasi & Dasar Hukum */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Dasar Yuridis & Rujukan Kebijakan</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(activeTicket.notulensiKonsultasi?.telaahAturan || [
                    'Permendagri No. 20 Tahun 2018 tentang Pengelolaan Keuangan Desa',
                    'UU No. 3 Tahun 2024 tentang Desa'
                  ]).map((rule, rIdx) => (
                    <div key={rIdx} className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-lg text-xs font-medium text-blue-900">
                      § {rule}
                    </div>
                  ))}
                </div>
              </div>

              {/* Daftar Presensi Peserta */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Presensi Kehadiran Sesi</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(activeTicket.daftarPeserta || [
                    { nama: activeTicket.pemohonNama, jabatan: activeTicket.pemohonJabatan, instansi: 'Pemerintah Desa', kehadiran: true },
                    { nama: activeTicket.tenagaAhliNama || 'Drs. H. Bambang Suhartono, M.Si', jabatan: 'Fasilitator', instansi: 'Dinas PMD', kehadiran: true }
                  ]).map((peserta, pIdx) => (
                    <div key={pIdx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{peserta.nama}</div>
                        <div className="text-[10px] text-slate-500">{peserta.jabatan} • {peserta.instansi}</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Hadir Daring
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Pilih salah satu konsultasi di sebelah kiri.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
