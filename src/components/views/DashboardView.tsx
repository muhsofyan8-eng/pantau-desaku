import React from 'react';
import { 
  Building2, 
  Calendar, 
  Video, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Users,
  FileText,
  Sparkles
} from 'lucide-react';
import { ConsultationTicket, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';

interface DashboardViewProps {
  consultations: ConsultationTicket[];
  activeRole: UserRole;
  onNavigate: (menu: string) => void;
  onSelectTicketForMeet: (ticket: ConsultationTicket) => void;
  onOpenBeritaAcara: (ticket: ConsultationTicket) => void;
  onOpenScheduleModal: (ticket: ConsultationTicket) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  consultations,
  activeRole,
  onNavigate,
  onSelectTicketForMeet,
  onOpenBeritaAcara,
  onOpenScheduleModal
}) => {
  // Statistics calculations
  const total = consultations.length;
  const pending = consultations.filter(c => c.status === 'menunggu_verifikasi').length;
  const scheduled = consultations.filter(c => c.status === 'terjadwal' || c.status === 'berlangsung').length;
  const ongoing = consultations.filter(c => c.status === 'berlangsung');
  const inFollowUp = consultations.filter(c => c.status === 'tindak_lanjut' || c.status === 'rekomendasi_diterbitkan').length;
  const completed = consultations.filter(c => c.status === 'selesai').length;

  // Unique villages count
  const uniqueVillages = new Set(consultations.map(c => c.namaDesa)).size;

  // Today sessions
  const todayStr = '2026-10-04'; // Simulated current date
  const todaySessions = consultations.filter(c => c.tanggalKonsultasi === todayStr || c.status === 'berlangsung');

  // Issue category tally
  const categoryCounts = consultations.reduce((acc, curr) => {
    acc[curr.bidang] = (acc[curr.bidang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Slogan & Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Konsultasi & Fasilitasi Desa Daring Terpadu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            KLINIK DESA ONLINE
          </h1>
          <p className="text-lg sm:text-xl font-medium text-emerald-100 italic mt-1">
            “Datang dengan Masalah, Pulang dengan Solusi”
          </p>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Menghubungkan Pemerintah Desa secara langsung dengan Tenaga Ahli OPD (Dinas PMD, Inspektorat, Bagian Hukum, Bappeda) melalui Google Meet dengan rekomendasi tertulis dan pemantauan tindak lanjut berkala.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigate('daftar_konsultasi')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <span>+ Ajukan Konsultasi Desa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('jadwal_klinik')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Lihat Agenda Klinik</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-emerald-400 to-transparent pointer-events-none"></div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Konsultasi */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Konsultasi</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <Building2 className="w-3 h-3 text-emerald-600" />
            <span>{uniqueVillages} Desa Terlayani</span>
          </div>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Menunggu Reviu</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pending}</div>
          <div className="text-[11px] text-amber-700 mt-1">Usulan baru dari desa</div>
        </div>

        {/* Terjadwal */}
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-xs">
          <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Terjadwal</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{scheduled}</div>
          <div className="text-[11px] text-blue-700 mt-1">Link Meet sudah siap</div>
        </div>

        {/* Sedang Berlangsung */}
        <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Live Meet</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{ongoing.length}</div>
          <div className="text-[11px] text-emerald-700 mt-1">Sesi sedang berjalan</div>
        </div>

        {/* Tindak Lanjut */}
        <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 shadow-xs">
          <div className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">Tindak Lanjut</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{inFollowUp}</div>
          <div className="text-[11px] text-indigo-700 mt-1">Pelaksanaan desa</div>
        </div>

        {/* Selesai / Tuntas */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tuntas & Selesai</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{completed}</div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Rekomendasi</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Agenda Sesi Hari Ini & Grafik Bidang */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Agenda Google Meet Hari Ini */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Agenda Ruang Google Meet Terkini</h3>
                  <p className="text-xs text-slate-500">Sesi tatap muka daring terjadwal hari ini</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('jadwal_klinik')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Lihat Semua Jadwal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySessions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">Tidak ada jadwal sesi konsultasi untuk hari ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((session) => {
                  const cat = CATEGORY_LABELS[session.bidang];
                  const isLive = session.status === 'berlangsung';
                  return (
                    <div 
                      key={session.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isLive 
                          ? 'border-emerald-300 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-300' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {session.namaDesa} ({session.kecamatan})
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.badgeColor}`}>
                              {cat.label}
                            </span>
                            {isLive && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                                SEDANG BERLANGSUNG
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-slate-700 line-clamp-1">
                            {session.judulKonsultasi}
                          </h4>
                          <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{session.waktuMulai} - {session.waktuSelesai || '11:15'} WIB</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-slate-400" />
                              <span>Narasumber: <strong className="text-slate-700">{session.tenagaAhliNama}</strong></span>
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => onSelectTicketForMeet(session)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Buka Ruang Meet</span>
                          </button>
                          {session.nomorBeritaAcara && (
                            <button
                              onClick={() => onOpenBeritaAcara(session)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs"
                              title="Lihat Berita Acara"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pengajuan Terbaru Perlu Diverifikasi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Pengajuan Konsultasi Baru Menunggu Jadwal</span>
              </h3>
              <button
                onClick={() => onNavigate('daftar_konsultasi')}
                className="text-xs font-medium text-emerald-700 hover:underline"
              >
                Semua Pengajuan
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {consultations.filter(c => c.status === 'menunggu_verifikasi').map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{item.namaDesa}</span>
                      <span className="text-[10px] text-slate-500">({item.nomorRegistrasi})</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                        Urgensi: {item.urgensi}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{item.judulKonsultasi}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Pemohon: {item.pemohonNama} • Diajukan: {item.tanggalPengajuan}</p>
                  </div>

                  <button
                    onClick={() => onOpenScheduleModal(item)}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 shrink-0"
                  >
                    Verifikasi & Jadwalkan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Distribusi Masalah & Alur Panduan */}
        <div className="space-y-4">
          {/* Distribusi Topik Masalah */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Bidang Masalah Terbanyak</span>
            </h3>

            <div className="space-y-2.5">
              {Object.entries(CATEGORY_LABELS).map(([key, info]) => {
                const count = categoryCounts[key] || 0;
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{info.label}</span>
                      <span className="font-bold text-slate-900">{count} Kasus</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-1.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 8 Alur Layanan Desa Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Alur 8 Langkah Klinik Desa
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">1</span>
                <span className="text-slate-200">Desa mendaftar usulan permasalahan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">2</span>
                <span className="text-slate-200">Verifikasi kelengkapan oleh Dinas PMD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">3</span>
                <span className="text-slate-200">Penetapan jadwal & pembuatan link Meet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">4</span>
                <span className="text-slate-200">Konsultasi interaktif via Google Meet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">5</span>
                <span className="text-slate-200">Pencatatan notulensi & telaah regulasi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">6</span>
                <span className="text-slate-200">Penerbitan Berita Acara & Rekomendasi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">7</span>
                <span className="text-slate-200">Pelaksanaan tindak lanjut oleh Desa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">8</span>
                <span className="text-slate-200">Monitoring berkala sampai tuntas</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
