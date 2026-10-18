import React, { useState } from 'react';
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
  Sparkles,
  User,
  LogOut,
  KeyRound,
  Settings
} from 'lucide-react';
import { UserAccount, UserRole } from '../types/clinic';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (menu: string) => void;
  todaySessionCount: number;
  currentUser?: UserAccount | null;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeRole, 
  onRoleChange, 
  onNavigate,
  todaySessionCount,
  currentUser,
  onOpenProfile,
  onLogout
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const roleConfig: Record<UserRole, { title: string; subtitle: string; code: string; color: string; badge: string }> = {
    desa: {
      title: 'Pemerintah Desa',
      subtitle: 'Aparatur Pemohon',
      code: 'PEMDES',
      color: 'bg-emerald-700 text-white border-emerald-800',
      badge: 'border-emerald-300 text-emerald-800 bg-emerald-50'
    },
    narasumber: {
      title: 'Tim Bidang DPMD',
      subtitle: 'Fasilitator 5 Bidang DPMD',
      code: 'BIDANG',
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

          {/* Right Actions: Quick Access & User Account Dropdown */}
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

            {/* Authenticated User Account Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-2xs transition-colors text-left"
              >
                {/* User Avatar or Initials */}
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.nama}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-200 shadow-2xs"
                  />
                ) : (
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${currentRole.color} text-[10px] font-black tracking-wider shadow-2xs`}>
                    {activeRole === 'desa' && 'DS'}
                    {activeRole === 'narasumber' && 'TA'}
                    {activeRole === 'admin' && 'AD'}
                  </div>
                )}

                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
                    {currentUser ? currentUser.nama : currentRole.title}
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 leading-tight truncate max-w-[140px]">
                    {currentUser ? (currentUser.jabatan || currentRole.subtitle) : currentRole.subtitle}
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
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    
                    {/* Active User Card */}
                    {currentUser && (
                      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 mb-1">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${currentRole.color} text-xs font-black shrink-0`}>
                            {activeRole === 'desa' && 'DS'}
                            {activeRole === 'narasumber' && 'TA'}
                            {activeRole === 'admin' && 'AD'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.nama}</h4>
                            <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                            <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 mt-0.5 border border-emerald-200">
                              {currentUser.jabatan}
                            </span>
                          </div>
                        </div>

                        {onOpenProfile && (
                          <button
                            onClick={() => {
                              onOpenProfile();
                              setDropdownOpen(false);
                            }}
                            className="w-full mt-2.5 py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Settings className="w-3.5 h-3.5 text-slate-500" />
                            <span>Kelola Profil & Kata Sandi</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Role Switcher Section */}
                    <div className="px-3.5 py-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Ganti Otoritas Simulasi
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Uji alur kerja dari sudut pandang pemohon desa/kelurahan, 5 bidang dinas PMD, dan sekretariat.
                      </p>
                    </div>

                    <div className="px-2 space-y-1">
                      {/* Desa */}
                      <button
                        onClick={() => { onRoleChange('desa'); setDropdownOpen(false); }}
                        className={`w-full px-3 py-2 text-left rounded-lg flex items-start gap-2.5 transition-colors ${
                          activeRole === 'desa' ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                          DS
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900">Aparatur Desa / Pemohon</div>
                          <div className="text-[10px] text-slate-500 leading-tight">Pengajuan, unggah draf & tindak lanjut</div>
                        </div>
                      </button>

                      {/* Narasumber */}
                      <button
                        onClick={() => { onRoleChange('narasumber'); setDropdownOpen(false); }}
                        className={`w-full px-3 py-2 text-left rounded-lg flex items-start gap-2.5 transition-colors ${
                          activeRole === 'narasumber' ? 'bg-blue-50 text-blue-950 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md bg-blue-700 text-white flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                          BD
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900">Tim Bidang Dinas PMD</div>
                          <div className="text-[10px] text-slate-500 leading-tight">Fasilitasi 5 Bidang Teknis DPMD</div>
                        </div>
                      </button>

                      {/* Admin */}
                      <button
                        onClick={() => { onRoleChange('admin'); setDropdownOpen(false); }}
                        className={`w-full px-3 py-2 text-left rounded-lg flex items-start gap-2.5 transition-colors ${
                          activeRole === 'admin' ? 'bg-slate-100 text-slate-950 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                          AD
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900">Administrator Sekretariat DPMD</div>
                          <div className="text-[10px] text-slate-500 leading-tight">Verifikasi usulan & jadwal rapat</div>
                        </div>
                      </button>
                    </div>

                    {/* Log Out Option */}
                    {onLogout && (
                      <div className="pt-2 mt-2 border-t border-slate-100 px-2">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 text-xs font-bold transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar Sistem (Log Out)</span>
                        </button>
                      </div>
                    )}

                    <div className="px-3.5 pt-2 pb-1 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1.5 mt-1">
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
