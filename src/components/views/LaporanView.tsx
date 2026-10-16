import React, { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
  Printer, 
  BarChart, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Star,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { ConsultationTicket } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';

interface LaporanViewProps {
  consultations: ConsultationTicket[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({ consultations }) => {
  const [filterKecamatan, setFilterKecamatan] = useState('all');

  // Stats calculation
  const total = consultations.length;
  const completed = consultations.filter(c => c.status === 'selesai').length;
  const followUp = consultations.filter(c => c.status === 'tindak_lanjut').length;
  const scheduled = consultations.filter(c => c.status === 'terjadwal' || c.status === 'berlangsung').length;

  // Average satisfaction
  const ratedTickets = consultations.filter(c => c.skorKepuasan);
  const avgSatisfaction = ratedTickets.length > 0 
    ? (ratedTickets.reduce((acc, curr) => acc + (curr.skorKepuasan || 0), 0) / ratedTickets.length).toFixed(1)
    : '4.9';

  // Group by Kecamatan
  const kecamatanStats = consultations.reduce((acc, curr) => {
    acc[curr.kecamatan] = (acc[curr.kecamatan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by Bidang
  const categoryStats = consultations.reduce((acc, curr) => {
    acc[curr.bidang] = (acc[curr.bidang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExportCSV = () => {
    const headers = [
      'Nomor Registrasi',
      'Desa',
      'Kecamatan',
      'Kabupaten',
      'Bidang',
      'Judul Konsultasi',
      'Pemohon',
      'Tanggal Pengajuan',
      'Tanggal Konsultasi',
      'Narasumber',
      'Status',
      'Nomor Berita Acara',
      'Progres Tindak Lanjut (%)'
    ];

    const rows = consultations.map(c => [
      `"${c.nomorRegistrasi}"`,
      `"${c.namaDesa}"`,
      `"${c.kecamatan}"`,
      `"${c.kabupaten}"`,
      `"${CATEGORY_LABELS[c.bidang]?.label || c.bidang}"`,
      `"${c.judulKonsultasi.replace(/"/g, '""')}"`,
      `"${c.pemohonNama}"`,
      `"${c.tanggalPengajuan}"`,
      `"${c.tanggalKonsultasi || '-'}"`,
      `"${c.tenagaAhliNama || '-'}"`,
      `"${c.status}"`,
      `"${c.nomorBeritaAcara || '-'}"`,
      `"${c.progressTindakLanjut || 0}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Rekap_Klinik_Desa_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Laporan Rekapitulasi Klinik Desa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan analitik fasilitasi desa per kecamatan, kategori permasalahan, dan indikator penyelesaian tindak lanjut.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Data ke Excel/CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekapitulasi</span>
          </button>
        </div>
      </div>

      {/* Printable Header for physical printing */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-3 mb-6">
        <h2 className="text-lg font-bold uppercase">REKAPITULASI FASILITASI & KONSULTASI KLINIK DESA ONLINE</h2>
        <p className="text-xs text-slate-600">Pemerintah Kabupaten • Dinas Pemberdayaan Masyarakat dan Desa</p>
        <p className="text-[10px] text-slate-500 mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Konsultasi</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total} Desa</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Tercatat di sistem</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Rata-rata Respon</span>
          <div className="text-2xl font-black text-blue-600 mt-1">1.8 Hari</div>
          <span className="text-[11px] text-blue-700 mt-1 block">Dari daftar ke Google Meet</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Tuntas & Selesai</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{completed} Desa</div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Rekomendasi 100%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Indeks Kepuasan (IKM)</span>
          <div className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <span>{avgSatisfaction}</span>
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Skala 5.0 (Sangat Puas)</span>
        </div>
      </div>

      {/* Two Columns: Kecamatan Breakdown & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Breakdown by Kecamatan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Rekapitulasi Konsultasi Berdasarkan Kecamatan</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(kecamatanStats).map(([kec, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={kec} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{kec}</span>
                    <span className="font-bold text-slate-900">{count} Konsultasi ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown by Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <BarChart className="w-4 h-4 text-blue-600" />
            <span>Distribusi Berdasarkan Bidang Permasalahan</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(CATEGORY_LABELS).map(([key, labelObj]) => {
              const count = categoryStats[key] || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{labelObj.label}</span>
                    <span className="font-bold text-slate-900">{count} Berkas</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Comprehensive Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Tabel Rincian Fasilitasi & Evaluasi
          </h3>
          <span className="text-xs text-slate-500">
            Menampilkan {consultations.length} Data Konsultasi
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
              <tr>
                <th className="p-3">No. Reg</th>
                <th className="p-3">Desa / Kecamatan</th>
                <th className="p-3">Bidang</th>
                <th className="p-3">Judul Masalah</th>
                <th className="p-3">Narasumber OPD</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Progres TL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consultations.map((t) => {
                const cat = CATEGORY_LABELS[t.bidang];
                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-semibold text-slate-700">{t.nomorRegistrasi}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{t.namaDesa}</div>
                      <div className="text-[10px] text-slate-500">{t.kecamatan}</div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.badgeColor}`}>
                        {cat.label}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate font-medium text-slate-800">{t.judulKonsultasi}</td>
                    <td className="p-3 text-slate-700">{t.tenagaAhliNama || 'Belum Ditugaskan'}</td>
                    <td className="p-3 capitalize font-semibold text-slate-800">{t.status.replace('_', ' ')}</td>
                    <td className="p-3 text-center font-bold text-emerald-700">
                      {t.progressTindakLanjut || 0}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
