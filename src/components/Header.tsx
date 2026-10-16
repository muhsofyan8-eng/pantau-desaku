import React from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  PlusCircle, 
  Bell, 
  ExternalLink,
  ChevronDown
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

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: any; color: string }> = {
    desa: {
      title: 'Pemerintah Desa',
      subtitle: 'Aparatur / Pemohon Konsultasi',
      icon: Building2,
      color: 'bg-emerald-600 text-white'
    },
    narasumber: {
      title: 'Tenaga Ahli / OPD',
      subtitle: 'Fasilitator & Pengawas',
      icon: UserCheck,
      color: 'bg-blue-600 text-white'
    },
    admin: {
      title: 'Admin Sekretariat',
      subtitle: 'Dinas PMD / Penjadwal',
      icon: ShieldCheck,
      color: 'bg-amber-600 text-white'
    }
  };

  const currentRole = roleLabels[activeRole];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-100">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  KLINIK<span className="text-emerald-600">DESA</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium italic">
                “Datang dengan Masalah, Pulang dengan Solusi”
              </p>
            </div>
          </div>

          {/* Center Info / Banner */}
          <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Fasilitasi Terpadu Berbasis Google Meet
            </div>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="text-slate-500">
              Sesi Hari Ini: <span className="font-bold text-emerald-700">{todaySessionCount} Terjadwal</span>
            </div>
          </div>

          {/* Right Action & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Quick Register Consultation */}
            <button
              onClick={() => onNavigate('daftar_konsultasi')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all duration-150"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Daftar Konsultasi</span>
            </button>

            {/* Google Meet Direct Launch */}
            <button
              onClick={() => onNavigate('google_meet')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              title="Buka Ruang Google Meet"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Ruang Meet</span>
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition-colors text-left"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentRole.color} text-xs font-bold shadow-xs`}>
                  {activeRole === 'desa' && 'DS'}
                  {activeRole === 'narasumber' && 'TA'}
                  {activeRole === 'admin' && 'AD'}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentRole.title}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {currentRole.subtitle}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Simulasi Hak Akses Pengguna
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Pilih peran untuk menguji alur kerja sistem Klinik Desa
                    </p>
                  </div>

                  <button
                    onClick={() => { onRoleChange('desa'); setDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-slate-50 ${activeRole === 'desa' ? 'bg-emerald-50/60 font-medium' : ''}`}
                  >
                    <div className="w-7 h-7 rounded bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      DS
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Aparatur Desa / Kelurahan</div>
                      <div className="text-[11px] text-slate-500">Mendaftar konsultasi & unggah bukti tindak lanjut</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { onRoleChange('narasumber'); setDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-slate-50 ${activeRole === 'narasumber' ? 'bg-blue-50/60 font-medium' : ''}`}
                  >
                    <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      TA
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Tenaga Ahli OPD / Fasilitator</div>
                      <div className="text-[11px] text-slate-500">Isi notulensi Meet & terbitkan rekomendasi</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { onRoleChange('admin'); setDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-slate-50 ${activeRole === 'admin' ? 'bg-amber-50/60 font-medium' : ''}`}
                  >
                    <div className="w-7 h-7 rounded bg-amber-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      AD
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Administrator Dinas PMD</div>
                      <div className="text-[11px] text-slate-500">Verifikasi usulan, buat jadwal & link GMeet</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
