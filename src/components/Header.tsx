import React from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Plus, 
  Video,
  ChevronDown,
  Calendar,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types/clinic';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (menu: string) => void;
  todaySessionCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeRole, 
  onRoleChange, 
  onNavigate,
  todaySessionCount 
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const roleConfig: Record<UserRole, { title: string; subtitle: string; code: string; color: string; badge: string }> = {
    desa: {
      title: 'Pemerintah Desa',
      subtitle: 'Aparatur Pemohon',
      code: 'PEMDES',
      color: 'bg-emerald-700 text-white border-emerald-800',
      badge: 'border-emerald-300 text-emerald-800 bg-emerald-50'
    },
    narasumber: {
      title: 'Tenaga Ahli OPD',
      subtitle: 'Fasilitator & Pengawas',
      code: 'FASILITATOR',
      color: 'bg-blue-700 text-white border-blue-800',
      badge: 'border-blue-300 text-blue-800 bg-blue-50'
    },
    admin: {
      title: 'Sekretariat PMD',
      subtitle: 'Administrator & Penjadwal',
      code: 'ADMIN',
      color: 'bg-slate-800 text-white border-slate-900',
      badge: 'border-slate-300 text-slate-800 bg-slate-100'
    }
  };

  const currentRole = roleConfig[activeRole];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      {/* Official Top National Accent Ribbon */}
      <div className="h-1 bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-700 w-full" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Official Brand & Agency */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigate('dashboard')}
          >
            {/* Official Crest / Logo */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-800 overflow-hidden group-hover:ring-emerald-600 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-transparent"></div>
              <Building2 className="w-5 h-5 text-emerald-400 relative z-10" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-950 font-sans">
                  PANTAU <span className="text-emerald-700">DESAKU</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                  TERPADU
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight truncate max-w-[260px] sm:max-w-md">
                Pusat Informasi Terpadu Desa dan Kelurahan
              </p>
            </div>
          </div>

          {/* Center Meta: Sesi Hari Ini & Status Sistem */}
          <div className="hidden xl:flex items-center gap-5 text-xs text-slate-600 border-x border-slate-200 px-6 h-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800">Layanan Daring Aktif</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Agenda Hari Ini:</span>
              <strong className="text-slate-900">{todaySessionCount} Sesi Tatap Muka</strong>
            </div>
          </div>

          {/* Right Actions: Quick Access & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Action: Daftar Konsultasi */}
            <button
              onClick={() => onNavigate('daftar_konsultasi')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs hover:shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Konsultasi Baru</span>
            </button>

            {/* Quick Action: Google Meet Live */}
            <button
              onClick={() => onNavigate('google_meet')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors"
              title="Buka Ruang Tatap Muka Virtual"
            >
              <Video className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Ruang Meet</span>
            </button>

            {/* Executive Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-2xs transition-colors text-left"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${currentRole.color} text-[10px] font-black tracking-wider shadow-2xs`}>
                  {activeRole === 'desa' && 'DS'}
                  {activeRole === 'narasumber' && 'TA'}
                  {activeRole === 'admin' && 'AD'}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentRole.title}
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 leading-tight">
                    {currentRole.subtitle}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Simulasi Otoritas Akses
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        Ganti peran untuk memverifikasi alur kerja dari sudut pandang pemohon, tenaga ahli, dan dinas.
                      </p>
                    </div>

                    <div className="p-1 space-y-1">
                      {/* Desa */}
                      <button
                        onClick={() => { onRoleChange('desa'); setDropdownOpen(false); }}
                        className={`w-full px-3 py-2 text-left rounded-lg flex items-start gap-2.5 transition-colors ${
                          activeRole === 'desa' ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-md bg-emerald-700 text-white flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                          DS
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900">Aparatur Desa / Pemohon</div>
                          <div className="text-[10px] text-slate-500 leading-tight">Mengajukan konsultasi, unggah dokumen & tindak lanjut</div>
                        </div>
                      </button>

                      {/* Narasumber */}
                      <button
                        onClick={() => { onRoleChange('narasumber'); setDropdownOpen(false); }}
                        className={`w-full px-3 py-2 text-left rounded-lg flex items-start gap-2.5 transition-colors ${
                          activeRole === 'narasumber' ? 'bg-blue-50 text-blue-950 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-md bg-blue-700 text-white flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                          TA
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900">Tenaga Ahli OPD / Fasilitator</div>
                          <div className="text-[10px] text-slate-500 leading-tight">Telaah regulasi, notulensi Google Meet & terbitkan telaah</div>
                        </div>
                      </button>

                      {/* Admin */}
                      <button
                        onClick={() => { onRoleChange('admin'); setDropdownOpen(false); }}
                        className={`w-full px-3 py-2 text-left rounded-lg flex items-start gap-2.5 transition-colors ${
                          activeRole === 'admin' ? 'bg-slate-100 text-slate-950 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                          AD
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900">Sekretariat Administrator DPMD</div>
                          <div className="text-[10px] text-slate-500 leading-tight">Verifikasi kelayakan berkas, setel narasumber & kode rapat</div>
                        </div>
                      </button>
                    </div>

                    <div className="px-3.5 pt-2 pb-1 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-slate-400" />
                      <span>Sistem Terproteksi Protokol SPBE</span>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
