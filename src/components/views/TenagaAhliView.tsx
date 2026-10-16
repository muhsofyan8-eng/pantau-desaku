import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Building,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { ExpertProfile, IssueCategory, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';

interface TenagaAhliViewProps {
  experts: ExpertProfile[];
  activeRole: UserRole;
  onRequestConsultationWithExpert: (expert: ExpertProfile) => void;
}

export const TenagaAhliView: React.FC<TenagaAhliViewProps> = ({
  experts,
  activeRole,
  onRequestConsultationWithExpert
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstansi, setSelectedInstansi] = useState('all');

  const filteredExperts = experts.filter(expert => {
    const matchSearch = 
      expert.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.instansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchInstansi = selectedInstansi === 'all' || expert.instansi.includes(selectedInstansi);

    return matchSearch && matchInstansi;
  });

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Direktori Tenaga Ahli & Narasumber OPD</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar tim fasilitator, auditor inspektorat, analis hukum, dan pembina desa yang bertugas di Klinik Desa.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <span>Total: <strong className="text-slate-800">{experts.length} Tenaga Ahli</strong> Terdaftar</span>
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
            placeholder="Cari nama, NIP, atau kepakaran..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedInstansi}
            onChange={(e) => setSelectedInstansi(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white"
          >
            <option value="all">Semua Instansi Pembina</option>
            <option value="DPMD">Dinas PMD</option>
            <option value="Inspektorat">Inspektorat Daerah</option>
            <option value="Hukum">Bagian Hukum Setda</option>
            <option value="Kesehatan">Dinas Kesehatan</option>
            <option value="TAPM">TAPM Kemendesa</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExperts.map((expert) => {
          const isAvailable = expert.statusKetersediaan === 'Tersedia';

          return (
            <div 
              key={expert.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Photo & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={expert.foto} 
                      alt={expert.nama}
                      className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {expert.nama}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {expert.nip !== '-' ? `NIP. ${expert.nip}` : 'Tenaga Ahli Kemendesa'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isAvailable 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {expert.statusKetersediaan}
                  </span>
                </div>

                {/* Instansi & Jabatan */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-3 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{expert.instansi}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-1">
                    {expert.jabatan}
                  </div>
                </div>

                {/* Bidang Keahlian */}
                <div className="mb-3">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                    Bidang Kepakaran:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {expert.bidangKeahlian.map((b) => {
                      const meta = CATEGORY_LABELS[b];
                      return (
                        <span 
                          key={b}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${meta.badgeColor}`}
                        >
                          {meta.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Piket & Kontak */}
                <div className="text-[11px] text-slate-600 space-y-1 py-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jadwal Piket: <strong className="text-slate-700">{expert.jadwalPiket}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>WA: <span className="font-mono text-slate-700">{expert.telepon}</span></span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-800">{expert.ratingKepuasan}</span>
                  <span className="text-[10px] text-slate-400">({expert.totalKonsultasiDitangani} Sesi)</span>
                </div>

                <button
                  onClick={() => onRequestConsultationWithExpert(expert)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                >
                  <span>Pilih Narasumber</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
