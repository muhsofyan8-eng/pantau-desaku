import React from 'react';
import { 
  Home, 
  FileEdit, 
  Calendar, 
  Video, 
  Users, 
  FileText, 
  CheckCircle2, 
  BarChart3, 
  FolderArchive, 
  TrendingUp, 
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types/clinic';

export interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: any;
  badge?: number;
  badgeColor?: string;
}

interface SidebarProps {
  activeMenu: string;
  onSelectMenu: (menuId: string) => void;
  counts: {
    pendingCount: number;
    scheduledCount: number;
    ongoingCount: number;
    followUpCount: number;
  };
  activeRole: UserRole;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  counts,
  activeRole,
  isMobileOpen,
  onCloseMobile
}) => {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Statistik & agenda Klinik Desa',
      icon: Home,
    },
    {
      id: 'daftar_konsultasi',
      label: 'Daftar Konsultasi',
      description: 'Pengajuan masalah & kebutuhan desa',
      icon: FileEdit,
      badge: counts.pendingCount > 0 ? counts.pendingCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'jadwal_klinik',
      label: 'Jadwal Klinik',
      description: 'Jadwal konsultasi online & status',
      icon: Calendar,
      badge: counts.scheduledCount > 0 ? counts.scheduledCount : undefined,
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      id: 'google_meet',
      label: 'Google Meet',
      description: 'Ruang konsultasi tatap muka virtual',
      icon: Video,
      badge: counts.ongoingCount > 0 ? counts.ongoingCount : undefined,
      badgeColor: 'bg-emerald-500 text-white animate-pulse'
    },
    {
      id: 'tenaga_ahli',
      label: 'Tenaga Ahli / OPD',
      description: 'Daftar bidang & profil narasumber',
      icon: Users,
    },
    {
      id: 'konsultasi',
      label: 'Konsultasi',
      description: 'Catatan masalah & hasil pembahasan',
      icon: FileText,
    },
    {
      id: 'rekomendasi',
      label: 'Rekomendasi',
      description: 'Solusi & Berita Acara resmi',
      icon: CheckCircle2,
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      description: 'Status tindak lanjut setiap desa',
      icon: BarChart3,
      badge: counts.followUpCount > 0 ? counts.followUpCount : undefined,
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'dokumen',
      label: 'Dokumen',
      description: 'Repositori regulasi & dokumen pendukung',
      icon: FolderArchive,
    },
    {
      id: 'laporan',
      label: 'Laporan',
      description: 'Rekapitulasi per kab/kota/desa',
      icon: TrendingUp,
    },
    {
      id: 'admin',
      label: 'Admin',
      description: 'Pengaturan slot, bidang & peran',
      icon: Settings,
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">KLINIK DESA</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">Online</span>
          </div>
          <button 
            onClick={onCloseMobile}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            ✕
          </button>
        </div>

        {/* Workflow Quick Strip */}
        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Alur Layanan Desa</span>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              8 Tahapan
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Daftar → Verifikasi → Jadwal → Meet → Konsultasi → Rekomendasi → Tindak Lanjut → Monitoring
          </p>
        </div>

        {/* Navigation Menu List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectMenu(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                  isActive 
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/30' 
                    : 'text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-emerald-700/50 text-white' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                  }`}>
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs truncate">{item.label}</div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Slogan & Support footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200/50 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Klinik Desa Berintegritas</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Layanan konsultasi fasilitasi regulasi, keuangan & BUMDes tanpa dipungut biaya (Gratis).
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
