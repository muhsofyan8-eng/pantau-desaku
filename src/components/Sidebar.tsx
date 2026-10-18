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
  ShieldCheck,
  Building,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types/clinic';

export interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: any;
  badge?: number;
  badgeType?: 'alert' | 'info' | 'live';
}

interface MenuSection {
  title: string;
  items: MenuItem[];
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
  const sections: MenuSection[] = [
    {
      title: 'Layanan Konsultasi',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Ikhtisar',
          description: 'Statistik & agenda utama',
          icon: Home,
        },
        {
          id: 'daftar_konsultasi',
          label: 'Daftar Konsultasi',
          description: 'Pengajuan & verifikasi berkas',
          icon: FileEdit,
          badge: counts.pendingCount > 0 ? counts.pendingCount : undefined,
          badgeType: 'alert'
        },
        {
          id: 'jadwal_klinik',
          label: 'Jadwal Fasilitasi',
          description: 'Kalender sesi online OPD',
          icon: Calendar,
          badge: counts.scheduledCount > 0 ? counts.scheduledCount : undefined,
          badgeType: 'info'
        },
        {
          id: 'google_meet',
          label: 'Ruang Tatap Muka',
          description: 'Sesi video & notulensi langsung',
          icon: Video,
          badge: counts.ongoingCount > 0 ? counts.ongoingCount : undefined,
          badgeType: 'live'
        },
      ]
    },
    {
      title: 'Hasil & Akuntabilitas',
      items: [
        {
          id: 'konsultasi',
          label: 'Risalah Pembahasan',
          description: 'Identifikasi masalah & telaah',
          icon: FileText,
        },
        {
          id: 'rekomendasi',
          label: 'Lembar Rekomendasi',
          description: 'Solusi & Berita Acara resmi',
          icon: CheckCircle2,
        },
        {
          id: 'monitoring',
          label: 'Monitoring Progres',
          description: 'Kepatuhan tindak lanjut desa',
          icon: BarChart3,
          badge: counts.followUpCount > 0 ? counts.followUpCount : undefined,
          badgeType: 'info'
        },
      ]
    },
    {
      title: 'Referensi & Data',
      items: [
        {
          id: 'dokumen',
          label: 'Bank Regulasi & SOP',
          description: 'Permendagri, Perda & Draf Perdes',
          icon: FolderArchive,
        },
        {
          id: 'tenaga_ahli',
          label: 'Direktori Narasumber',
          description: 'Daftar pejabat fungsional & OPD',
          icon: Users,
        },
        {
          id: 'laporan',
          label: 'Laporan Rekapitulasi',
          description: 'Ekspor data evaluasi berkala',
          icon: TrendingUp,
        },
      ]
    },
    {
      title: 'Pengaturan',
      items: [
        {
          id: 'admin',
          label: 'Administrasi Sistem',
          description: 'Hak akses & audit aktivitas',
          icon: Settings,
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed lg:sticky top-0 lg:top-18 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 h-screen lg:h-[calc(100vh-4.5rem)] shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between lg:hidden bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold tracking-tight text-sm">PANTAU DESAKU</span>
          </div>
          <button 
            onClick={onCloseMobile}
            className="text-slate-400 hover:text-white p-1 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Workflow Breadcrumb Strip */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-slate-500">
            <span>SOP Tata Kelola</span>
            <span className="text-emerald-700 font-extrabold">Terverifikasi</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
            Alur Terpadu: Usulan → Verifikasi → Jadwal → Meet → Rekomendasi
          </p>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {sections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-black tracking-wider uppercase text-slate-400">
                {sec.title}
              </div>

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectMenu(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 group border ${
                      isActive 
                        ? 'bg-emerald-800 text-white font-bold border-emerald-900 shadow-xs' 
                        : 'border-transparent text-slate-700 hover:bg-slate-100/90 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-emerald-900/80 text-emerald-300' 
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs truncate">{item.label}</div>
                        <div className={`text-[10px] truncate ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${
                        isActive 
                          ? 'bg-white text-emerald-900' 
                          : item.badgeType === 'alert'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : item.badgeType === 'live'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Institutional Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="text-[10px] leading-tight text-slate-500">
              <strong className="text-slate-800 block">Sistem Resmi Terpadu</strong>
              Bebas Pungli • Akuntabel • Berintegritas
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
