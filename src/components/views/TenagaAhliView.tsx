import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Building,
  ShieldCheck,
  ArrowRight,
  Layers,
  FileText,
  Landmark,
  Coins,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import { ExpertProfile, IssueCategory, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';

interface TenagaAhliViewProps {
  experts: ExpertProfile[];
  activeRole: UserRole;
  onRequestConsultationWithExpert: (expert: ExpertProfile) => void;
}

interface BidangDetail {
  id: string;
  nomor: number;
  nama: string;
  categoryKey: IssueCategory;
  deskripsi: string;
  ruangLingkup: string[];
  pejabatDefault: {
    nama: string;
    nip: string;
    jabatan: string;
    kontak: string;
    email: string;
    jadwal: string;
  };
  icon: any;
  color: string;
  badgeBg: string;
}

export const TenagaAhliView: React.FC<TenagaAhliViewProps> = ({
  experts,
  activeRole,
  onRequestConsultationWithExpert
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const bidangList: BidangDetail[] = [
    {
      id: 'bidang-01',
      nomor: 1,
      nama: 'Bidang Pemerintahan Desa & Kelurahan',
      categoryKey: 'pemerintahan_desa',
      deskripsi: 'Memfasilitasi tata kelola administrasi pemerintahan desa dan kelurahan, penyusunan produk hukum (Perdes & Perkades), pengelolaan keuangan APBDes, penatausahaan Siskeudes, siltap aparatur, serta evaluasi perkembangan desa.',
      ruangLingkup: [
        'Pengelolaan Keuangan & APBDes (Pergeseran BTT, BLT-DD)',
        'Penyusunan Peraturan Desa (Perdes) & Peraturan Kepala Desa',
        'Penatausahaan dan Laporan Pertanggungjawaban di Siskeudes',
        'Administrasi Penghasilan Tetap (Siltap) & Tunjangan Aparatur',
        'Pengelolaan Aset & Tanah Kas Desa (TKD)'
      ],
      pejabatDefault: {
        nama: 'Drs. H. Bambang Suhartono, M.Si',
        nip: '19740512 199903 1 004',
        jabatan: 'Kepala Bidang Pemerintahan Desa & Kelurahan',
        kontak: '0812-3456-7890',
        email: 'pemdes.dpmd@kabupaten.go.id',
        jadwal: 'Senin & Rabu (09:00 - 15:00 WIB)'
      },
      icon: Building2,
      color: 'border-emerald-500 bg-emerald-50/40 text-emerald-800',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    {
      id: 'bidang-02',
      nomor: 2,
      nama: 'Bidang Kawasan Perdesaan',
      categoryKey: 'kawasan_perdesaan',
      deskripsi: 'Memfasilitasi perencanaan pembangunan kawasan perdesaan, penegasan dan penetapan batas wilayah desa/kelurahan, kerja sama antardesa, penataan ruang perdesaan, dan infrastruktur kawasan terpadu.',
      ruangLingkup: [
        'Penetapan & Penegasan Batas Wilayah Desa / Kelurahan',
        'Perencanaan Tata Ruang & Pembangunan Kawasan Perdesaan',
        'Kerja Sama Antar Desa (BKAD / KAD)',
        'Pembangunan Sarana & Prasarana Infrastruktur Antar-Desa',
        'Pengembangan Kawasan Tematik (Desa Wisata / Agropolitan)'
      ],
      pejabatDefault: {
        nama: 'Ir. H. Dedi Mulyadi, M.T.',
        nip: '19780315 200212 1 003',
        jabatan: 'Kepala Bidang Kawasan Perdesaan',
        kontak: '0813-8899-2211',
        email: 'kawasan.dpmd@kabupaten.go.id',
        jadwal: 'Selasa & Kamis (09:00 - 14:00 WIB)'
      },
      icon: Landmark,
      color: 'border-blue-500 bg-blue-50/40 text-blue-800',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    {
      id: 'bidang-03',
      nomor: 3,
      nama: 'Bidang Usaha Ekonomi Desa dan TTG',
      categoryKey: 'usaha_ekonomi_ttg',
      deskripsi: 'Memfasilitasi pendaftaran badan hukum dan pengembangan BUMDes/BUMDesma di Kemenkumham, pasar desa, permodalan usaha desa, pemanfaatan inovasi Teknologi Tepat Guna (TTG), dan ketahanan pangan.',
      ruangLingkup: [
        'Pendaftaran Badan Hukum & Sertifikasi BUMDes / BUMDesma',
        'Kelayakan Usaha & Rencana Penyertaan Modal Desa ke BUMDes',
        'Pengembangan & Revitalisasi Pasar Desa',
        'Penerapan Inovasi Teknologi Tepat Guna (Posyantek Desa)',
        'Program Ketahanan Pangan & Hewani Desa'
      ],
      pejabatDefault: {
        nama: 'Agus Triyono, S.E., M.M.',
        nip: '19850614 201001 1 015',
        jabatan: 'Kepala Bidang Usaha Ekonomi Desa dan TTG',
        kontak: '0815-6789-012',
        email: 'ekonomi.ttg@kabupaten.go.id',
        jadwal: 'Senin s/d Kamis (10:00 - 15:30 WIB)'
      },
      icon: Coins,
      color: 'border-amber-500 bg-amber-50/40 text-amber-800',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'bidang-04',
      nomor: 4,
      nama: 'Bidang Pemberdayaan Kelembagaan dan Sosbud Masy.',
      categoryKey: 'kelembagaan_sosbud',
      deskripsi: 'Memfasilitasi pembinaan dan penguatan kelembagaan BPD, RT/RW, Karang Taruna, PKK, LPMD, lembaga adat desa, integrasi penanganan stunting, posyandu, dan pelestarian nilai sosial budaya masyarakat.',
      ruangLingkup: [
        'Hubungan Kerja & Pembinaan Badan Permusyawaratan Desa (BPD)',
        'Penguatan Lembaga Kemasyarakatan Desa (LKD: RT, RW, PKK, LPM)',
        'Integrasi Penanganan Stunting & Posyandu Terintegrasi Desa',
        'Pemberdayaan Pemuda, Karang Taruna & Lembaga Adat',
        'Pelestarian Tradisi, Adat Istiadat & Gotong Royong Masyarakat'
      ],
      pejabatDefault: {
        nama: 'Hj. Ratna Komala, S.Sos., M.AP.',
        nip: '19821018 200604 2 009',
        jabatan: 'Kepala Bidang Pemberdayaan Kelembagaan dan Sosbud Masy.',
        kontak: '0812-4433-2211',
        email: 'kelembagaan.sosbud@kabupaten.go.id',
        jadwal: 'Rabu & Jumat (08:30 - 14:30 WIB)'
      },
      icon: Users,
      color: 'border-purple-500 bg-purple-50/40 text-purple-800',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    {
      id: 'bidang-05',
      nomor: 5,
      nama: 'Bidang Data dan Informasi',
      categoryKey: 'data_informasi',
      deskripsi: 'Memfasilitasi pengelolaan Sistem Informasi Desa (SID), pemutakhiran data Profil Desa dan Kelurahan (Prodeskel), statistik Satu Data Desa, digitalisasi arsip, dan monitoring keterbukaan informasi publik desa.',
      ruangLingkup: [
        'Pengelolaan & Integrasi Sistem Informasi Desa (SID)',
        'Pemutakhiran Data Profil Desa dan Kelurahan (Prodeskel Kemendagri)',
        'Statistik & Analisis Data Spasial / Geospasial Desa',
        'Digitalisasi Pelayanan Administrasi Surat-Menyurat Desa',
        'Keterbukaan Informasi Publik & Pengelolaan Website Desa'
      ],
      pejabatDefault: {
        nama: 'Ahmad Fauzi, S.Kom., M.T.I.',
        nip: '19880722 201101 1 007',
        jabatan: 'Kepala Bidang Data dan Informasi / Pranata Komputer Madya',
        kontak: '0852-7788-9900',
        email: 'datainfo.dpmd@kabupaten.go.id',
        jadwal: 'Setiap Hari Kerja (08:30 - 16:00 WIB)'
      },
      icon: FileSpreadsheet,
      color: 'border-teal-500 bg-teal-50/40 text-teal-800',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300'
    }
  ];

  const filteredBidang = bidangList.filter(b => 
    b.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.pejabatDefault.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.ruangLingkup.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>5 Bidang Dinas Pemberdayaan Masyarakat dan Desa (DPMD)</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              Struktur Resmi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit kerja pembina teknis yang melayani konsultasi daring dan fasilitasi tata kelola desa & kelurahan.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
          <span>Struktur: <strong className="text-emerald-800">5 Bidang Teknis DPMD</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bidang, tupoksi, atau nama pejabat fasilitator..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="text-xs text-slate-500 hidden md:block">
          Terintegrasi dengan jadwal konsultasi Google Meet resmi
        </div>
      </div>

      {/* 5 Bidang Cards */}
      <div className="space-y-5">
        {filteredBidang.map((bidang) => {
          const Icon = bidang.icon;
          
          // Match with existing expert if available
          const matchedExpert = experts.find(e => e.id === bidang.id) || {
            id: bidang.id,
            nama: bidang.pejabatDefault.nama,
            nip: bidang.pejabatDefault.nip,
            instansi: 'Dinas Pemberdayaan Masyarakat dan Desa (DPMD)',
            bidangDinas: bidang.nama,
            jabatan: bidang.pejabatDefault.jabatan,
            bidangKeahlian: [bidang.categoryKey],
            foto: '',
            email: bidang.pejabatDefault.email,
            telepon: bidang.pejabatDefault.kontak,
            statusKetersediaan: 'Tersedia' as const,
            jadwalPiket: bidang.pejabatDefault.jadwal,
            totalKonsultasiDitangani: 30,
            ratingKepuasan: 4.9
          };

          return (
            <div 
              key={bidang.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Header Card */}
              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        BIDANG 0{bidang.nomor}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${bidang.badgeBg}`}>
                        Dinas PMD
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {bidang.nama}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRequestConsultationWithExpert(matchedExpert)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-all hover:scale-[1.01]"
                  >
                    <span>Ajukan Konsultasi ke Bidang Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Body: Deskripsi & Ruang Lingkup */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
                
                {/* Left (7 cols): Tugas Fungsi & Lingkup Konsultasi */}
                <div className="lg:col-span-7 space-y-3">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">
                      Deskripsi Tugas & Pelayanan:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {bidang.deskripsi}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block mb-1.5">
                      Ruang Lingkup Fasilitasi Utama:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {bidang.ruangLingkup.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right (5 cols): Pejabat / Tim Fasilitator & Kontak */}
                <div className="lg:col-span-5 bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Pejabat / Tim Fasilitator
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      Tersedia Daring
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      {bidang.pejabatDefault.nama}
                    </h4>
                    <p className="text-[11px] text-slate-500">{bidang.pejabatDefault.jabatan}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">NIP: {bidang.pejabatDefault.nip}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{bidang.pejabatDefault.jadwal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Hotline: {bidang.pejabatDefault.kontak}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{bidang.pejabatDefault.email}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
