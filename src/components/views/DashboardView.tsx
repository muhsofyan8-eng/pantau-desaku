import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Video, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Users, 
  FileText, 
  ShieldCheck,
  Search,
  Share2,
  ExternalLink,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { ConsultationTicket, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';
import { generateWhatsAppInvitation } from '../../services/storageService';

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
  const todayStr = '2026-10-04';
  const todaySessions = consultations.filter(c => c.tanggalKonsultasi === todayStr || c.status === 'berlangsung');

  // Issue category tally
  const categoryCounts = consultations.reduce((acc, curr) => {
    acc[curr.bidang] = (acc[curr.bidang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const [activeTab, setActiveTab] = useState<'semua' | 'hari_ini' | 'menunggu'>('hari_ini');

  return (
    <div className="space-y-6">
      
      {/* Executive Institutional Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-sm">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 opacity-90" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-emerald-400 uppercase tracking-widest text-[10px] bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              Kementerian & Dinas PMD Republik Indonesia
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Portal Fasilitasi & Tata Kelola Desa</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
              PANTAU DESAKU
            </h1>
            <p className="text-sm sm:text-base font-bold text-emerald-300">
              Pusat Informasi Terpadu Desa dan Kelurahan
            </p>
            <p className="text-xs text-slate-400 italic">
              “Datang dengan Masalah, Pulang dengan Solusi”
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Pusat informasi dan fasilitasi terpadu tata kelola pemerintahan, regulasi, keuangan, dan pelayanan masyarakat yang menghubungkan aparatur desa & kelurahan secara langsung dengan 5 Bidang Dinas Pemberdayaan Masyarakat dan Desa (DPMD) melalui ruang tatap muka digital dan rekomendasi resmi.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('daftar_konsultasi')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-[1.01]"
            >
              <span>+ Ajukan Konsultasi Desa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('google_meet')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-100 font-semibold text-xs rounded-xl border border-white/15 transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ruang Tatap Muka Terintegrasi</span>
            </button>

            <button
              onClick={() => onNavigate('jadwal_klinik')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-400 hover:text-white font-medium text-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Lihat Kalender OPD</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Density Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Total Konsultasi */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">Total Registrasi</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <Building2 className="w-3 h-3 text-emerald-700" />
            <span>{uniqueVillages} Desa Binaan</span>
          </div>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 block">Menunggu Reviu</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{pending}</div>
          <div className="text-[11px] text-amber-800 mt-1 font-medium">Usulan verifikasi baru</div>
        </div>

        {/* Terjadwal */}
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-800 block">Sesi Terjadwal</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{scheduled}</div>
          <div className="text-[11px] text-blue-800 mt-1 font-medium">Jadwal & link siap</div>
        </div>

        {/* Sedang Berlangsung */}
        <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-900">Live Rapat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{ongoing.length}</div>
          <div className="text-[11px] text-emerald-800 mt-1 font-medium">Tatap muka aktif</div>
        </div>

        {/* Tindak Lanjut */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 block">Dalam Pemantauan</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{inFollowUp}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Pelaksanaan desa</div>
        </div>

        {/* Selesai / Tuntas */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 block">Tuntas Berita Acara</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{completed}</div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>100% Sesuai SOP</span>
          </div>
        </div>

      </div>

      {/* Main Content Layout: Live Agenda Table & Right Sidebar Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Agenda & Consultations Hub */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card: Agenda Sesi Google Meet & Konsultasi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            
            {/* Header with Segmented Filter Tabs */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Agenda Konsultasi & Tatap Muka Online</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar sesi tatap muka virtual dan tindak lanjut aparatur desa
                </p>
              </div>

              {/* Segmented Filter */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('hari_ini')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'hari_ini' 
                      ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hari Ini ({todaySessions.length})
                </button>
                <button
                  onClick={() => setActiveTab('menunggu')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'menunggu' 
                      ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Menunggu ({pending})
                </button>
                <button
                  onClick={() => setActiveTab('semua')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'semua' 
                      ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({total})
                </button>
              </div>
            </div>

            {/* List Content */}
            <div className="divide-y divide-slate-100">
              {((activeTab === 'hari_ini' ? todaySessions : activeTab === 'menunggu' ? consultations.filter(c => c.status === 'menunggu_verifikasi') : consultations)).map((item) => {
                const cat = CATEGORY_LABELS[item.bidang];
                const isLive = item.status === 'berlangsung';
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 sm:p-5 transition-colors ${
                      isLive ? 'bg-emerald-50/40' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Left Info */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-slate-900">{item.namaDesa}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 font-mono text-[11px]">{item.nomorRegistrasi}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600 font-medium">{cat.label}</span>
                          {isLive && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                              LIVE
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                          {item.judulKonsultasi}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.tanggalKonsultasi || item.tanggalPengajuan} {item.waktuMulai ? `(${item.waktuMulai} WIB)` : ''}</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>Narasumber: <strong className="text-slate-700">{item.tenagaAhliNama || 'Menunggu Penugasan'}</strong></span>
                          </span>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.googleMeetLink ? (
                          <>
                            <button
                              onClick={() => {
                                const text = generateWhatsAppInvitation(item);
                                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                              }}
                              className="p-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                              title="Kirim Undangan WhatsApp"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => onSelectTicketForMeet(item)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-all"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Masuk Meet</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onOpenScheduleModal(item)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-all"
                          >
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Verifikasi Jadwal</span>
                          </button>
                        )}

                        {item.nomorBeritaAcara && (
                          <button
                            onClick={() => onOpenBeritaAcara(item)}
                            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs transition-colors"
                            title="Buka Berita Acara Resmi"
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

            {/* Footer Table Link */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Menampilkan data terverifikasi Sistem Pantau Desaku
              </span>
              <button
                onClick={() => onNavigate('jadwal_klinik')}
                className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>Lihat Seluruh Kalender Fasilitasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Column (4 cols): Institutional Governance Stats & Regulations */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Distribusi Masalah Menurut Bidang */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Distribusi Masalah Desa</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Total: {total} Kasus</span>
            </div>

            <div className="space-y-3">
              {Object.entries(CATEGORY_LABELS).map(([key, info]) => {
                const count = categoryCounts[key] || 0;
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{info.label}</span>
                      <span className="font-bold text-slate-900 font-mono">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-700 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: SOP & Alur Pelayanan Resmi */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Standar Operasional Prosedur</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-white block">Pendaftaran Konsultasi</strong>
                  <span className="text-[11px] text-slate-400">Desa mengunggah pokok masalah dan dokumen draf/lampiran.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-white block">Verifikasi & Penjadwalan</strong>
                  <span className="text-[11px] text-slate-400">Sekretariat DPMD menugaskan narasumber OPD yang berkompeten.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white block">Tatap Muka & Berita Acara</strong>
                  <span className="text-[11px] text-slate-400">Fasilitasi via Google Meet dengan telaah hukum dan rekomendasi resmi.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="text-white block">Pemantauan Tindak Lanjut</strong>
                  <span className="text-[11px] text-slate-400">Monitoring kepatuhan desa hingga tuntas 100%.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Dasar: Permendagri No. 73/2020</span>
              <span className="text-emerald-400 font-semibold">Terkontrol</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
