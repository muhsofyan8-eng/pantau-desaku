import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  UserCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Filter, 
  Search, 
  Plus, 
  CheckCircle2,
  AlertCircle,
  Share2,
  KeyRound
} from 'lucide-react';
import { ConsultationTicket, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';
import { generateWhatsAppInvitation } from '../../services/storageService';

interface JadwalKlinikViewProps {
  consultations: ConsultationTicket[];
  activeRole: UserRole;
  onSelectTicketForMeet: (ticket: ConsultationTicket) => void;
  onOpenScheduleModal: (ticket: ConsultationTicket) => void;
  onOpenBeritaAcara: (ticket: ConsultationTicket) => void;
}

export const JadwalKlinikView: React.FC<JadwalKlinikViewProps> = ({
  consultations,
  activeRole,
  onSelectTicketForMeet,
  onOpenScheduleModal,
  onOpenBeritaAcara
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const todayStr = '2026-10-04';

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Filter scheduled items
  const scheduledTickets = consultations.filter(ticket => {
    const hasSchedule = !!ticket.tanggalKonsultasi || ticket.status === 'menunggu_verifikasi';
    if (!hasSchedule) return false;

    const matchesSearch = 
      ticket.namaDesa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.judulKonsultasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.tenagaAhliNama && ticket.tenagaAhliNama.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === 'today') {
      return ticket.tanggalKonsultasi === todayStr || ticket.status === 'berlangsung';
    }
    if (filterTab === 'upcoming') {
      return ticket.tanggalKonsultasi && ticket.tanggalKonsultasi > todayStr;
    }
    if (filterTab === 'completed') {
      return ticket.status === 'selesai' || ticket.status === 'tindak_lanjut';
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Jadwal Klinik Desa Online</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen agenda konsultasi virtual via Google Meet antara aparatur desa dan narasumber OPD.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              filterTab === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Semua Agenda
          </button>
          <button
            onClick={() => setFilterTab('today')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              filterTab === 'today' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              filterTab === 'upcoming' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Mendatang
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              filterTab === 'completed' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Telah Selesai
          </button>
        </div>
      </div>

      {/* Search Bar & Active Notice */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari desa, topik, atau narasumber..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Google Meet Link siap diakses 15 menit sebelum waktu konsultasi</span>
        </div>
      </div>

      {/* Scheduled Cards List */}
      <div className="space-y-4">
        {scheduledTickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada jadwal konsultasi yang sesuai dengan filter.</p>
            <p className="text-xs text-slate-400 mt-1">Gunakan tab filter lain atau cari usulan baru.</p>
          </div>
        ) : (
          scheduledTickets.map((ticket) => {
            const cat = CATEGORY_LABELS[ticket.bidang];
            const isLive = ticket.status === 'berlangsung';
            const isToday = ticket.tanggalKonsultasi === todayStr;

            return (
              <div 
                key={ticket.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                  isLive 
                    ? 'border-emerald-400 ring-2 ring-emerald-200 bg-emerald-50/20' 
                    : isToday 
                    ? 'border-blue-300 bg-blue-50/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Date & Time Box */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl text-center shrink-0 w-24 border ${
                      isLive 
                        ? 'bg-emerald-600 text-white border-emerald-700' 
                        : isToday 
                        ? 'bg-blue-600 text-white border-blue-700' 
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}>
                      <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                        {isToday ? 'HARI INI' : ticket.tanggalKonsultasi ? 'TANGGAL' : 'BELUM'}
                      </div>
                      <div className="text-base font-extrabold mt-0.5">
                        {ticket.tanggalKonsultasi ? ticket.tanggalKonsultasi.slice(8, 10) : '--'}
                      </div>
                      <div className="text-[10px] font-semibold mt-0.5">
                        {ticket.waktuMulai ? `${ticket.waktuMulai} WIB` : 'Menunggu'}
                      </div>
                    </div>

                    {/* Middle Info */}
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{ticket.namaDesa}</span>
                        <span className="text-xs text-slate-500">({ticket.kecamatan})</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.badgeColor}`}>
                          {cat.label}
                        </span>
                        {isLive && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                            LIVE SEKARANG
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        {ticket.judulKonsultasi}
                      </h4>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Fasilitator Bidang: <strong>{ticket.tenagaAhliNama || 'Belum Ditugaskan'}</strong></span>
                        </span>
                        <span>•</span>
                        <span>Instansi: {ticket.tenagaAhliInstansi || 'Dinas PMD'}</span>
                        <span>•</span>
                        <span>Urgensi: <strong className="text-amber-700">{ticket.urgensi}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Google Meet Link & Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap items-stretch sm:items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {ticket.googleMeetLink ? (
                      <>
                        {/* WhatsApp Invite Button */}
                        <button
                          onClick={() => {
                            const text = generateWhatsAppInvitation(ticket);
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                          }}
                          className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
                          title="Kirim Undangan Jadwal & Kode ke WhatsApp Peserta"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kirim ke WA</span>
                        </button>

                        {/* Copy Code / Link Button */}
                        <button
                          onClick={() => handleCopyLink(ticket.googleMeetCode || ticket.googleMeetLink!, ticket.id)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors font-mono"
                          title="Salin Kode Akses Google Meet"
                        >
                          {copiedLink === ticket.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-sans">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>{ticket.googleMeetCode || 'Salin Link'}</span>
                            </>
                          )}
                        </button>

                        {/* Direct Launch Meet */}
                        <button
                          onClick={() => onSelectTicketForMeet(ticket)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Video className="w-4 h-4" />
                          <span>Masuk Google Meet</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onOpenScheduleModal(ticket)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Verifikasi & Setel Jadwal</span>
                      </button>
                    )}

                    {/* Reschedule Button for Admin */}
                    {activeRole === 'admin' && ticket.googleMeetLink && (
                      <button
                        onClick={() => onOpenScheduleModal(ticket)}
                        className="px-2.5 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium"
                        title="Ubah Jadwal & Narasumber"
                      >
                        Ubah
                      </button>
                    )}
                  </div>
                </div>

                {/* Attendees list banner */}
                {ticket.daftarPeserta && ticket.daftarPeserta.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Peserta Terkonfirmasi:</span>
                    {ticket.daftarPeserta.map((peserta, pIdx) => (
                      <span key={pIdx} className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                        {peserta.nama} ({peserta.jabatan})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
