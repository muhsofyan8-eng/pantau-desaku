import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  FileText, 
  Printer, 
  Clock, 
  Building2, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { ConsultationTicket, RecommendationItem, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';

interface RekomendasiViewProps {
  consultations: ConsultationTicket[];
  activeRole: UserRole;
  onOpenBeritaAcara: (ticket: ConsultationTicket) => void;
  onOpenTindakLanjutModal: (ticket: ConsultationTicket) => void;
  onAddRecommendationItem: (ticketId: string, item: RecommendationItem) => void;
}

export const RekomendasiView: React.FC<RekomendasiViewProps> = ({
  consultations,
  activeRole,
  onOpenBeritaAcara,
  onOpenTindakLanjutModal,
  onAddRecommendationItem
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New recommendation item state
  const [newPoin, setNewPoin] = useState('');
  const [newDasarHukum, setNewDasarHukum] = useState('');
  const [newTargetWaktu, setNewTargetWaktu] = useState('14 Hari Kerja');
  const [newPJ, setNewPJ] = useState('Kepala Desa & Sekretaris Desa');

  // Filter consultations with recommendations or finished status
  const ticketsWithRecs = consultations.filter(t => 
    t.rekomendasi && t.rekomendasi.length > 0 || t.nomorBeritaAcara || t.status === 'tindak_lanjut' || t.status === 'selesai'
  );

  const filteredTickets = ticketsWithRecs.filter(ticket => 
    ticket.namaDesa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.judulKonsultasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ticket.nomorBeritaAcara && ticket.nomorBeritaAcara.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNewItem = (ticketId: string) => {
    if (!newPoin.trim()) return;

    const newItem: RecommendationItem = {
      id: 'rec-' + Date.now(),
      poinRekomendasi: newPoin.trim(),
      dasarHukum: newDasarHukum.trim() || 'Permendagri No. 20 Tahun 2018',
      targetWaktu: newTargetWaktu.trim(),
      penanggungJawab: newPJ.trim(),
      status: 'dalam_proses',
      catatanTindakLanjut: 'Baru ditambahkan oleh Tim Fasilitator Klinik Desa'
    };

    onAddRecommendationItem(ticketId, newItem);
    setNewPoin('');
    setNewDasarHukum('');
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Lembar Rekomendasi & Arahan Solusi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar putusan rekomendasi resmi, dasar hukum pembinaan, dan target penyelesaian tindak lanjut desa.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200">
          <span>Terbit: <strong className="text-emerald-700">{ticketsWithRecs.length} Berita Acara Rekomendasi</strong></span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari desa atau nomor berita acara..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Setiap rekomendasi wajib ditindaklanjuti dan diunggah bukti dukungnya.
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-5">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-600">Belum ada rekomendasi yang sesuai.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const cat = CATEGORY_LABELS[ticket.bidang];
            const recList = ticket.rekomendasi || [];
            const completedCount = recList.filter(r => r.status === 'tuntas').length;

            return (
              <div 
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Top Row: Village, BA Number, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{ticket.namaDesa}</span>
                      <span className="text-xs text-slate-500">({ticket.kecamatan})</span>
                      <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                        {ticket.nomorBeritaAcara || 'BA-KD/PMD/2026/000'}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.badgeColor}`}>
                        {cat.label}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-700 mt-1">
                      {ticket.judulKonsultasi}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenTindakLanjutModal(ticket)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold border border-indigo-200 transition-colors"
                    >
                      Update Progres
                    </button>
                    <button
                      onClick={() => onOpenBeritaAcara(ticket)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Berita Acara</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">
                      Kemajuan Pelaksanaan Rekomendasi:
                    </span>
                    <span className="font-bold text-emerald-700">
                      {completedCount} dari {recList.length} Poin Tuntas ({ticket.progressTindakLanjut || 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ticket.progressTindakLanjut || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Table of Recommendation Items */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <tr>
                        <th className="p-3 w-10 text-center">No</th>
                        <th className="p-3">Arahan Solusi & Rekomendasi OPD</th>
                        <th className="p-3 w-40">Dasar Regulasi</th>
                        <th className="p-3 w-32">Target Waktu</th>
                        <th className="p-3 w-36">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recList.map((rec, rIdx) => {
                        const isDone = rec.status === 'tuntas';
                        return (
                          <tr key={rec.id} className="hover:bg-slate-50/60">
                            <td className="p-3 text-center font-bold text-slate-500">{rIdx + 1}</td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-800">{rec.poinRekomendasi}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                PJ: <span className="text-slate-700">{rec.penanggungJawab}</span>
                                {rec.catatanTindakLanjut && (
                                  <span className="italic block text-emerald-800 mt-0.5">
                                    Catatan: {rec.catatanTindakLanjut}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-slate-600">{rec.dasarHukum}</td>
                            <td className="p-3 text-slate-700 font-medium">{rec.targetWaktu}</td>
                            <td className="p-3">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                isDone 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : rec.status === 'dalam_proses'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {isDone ? 'Tuntas' : rec.status === 'dalam_proses' ? 'Dalam Proses' : 'Belum Dimulai'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Add new recommendation item form for Admin/OPD */}
                {activeRole !== 'desa' && (
                  <div>
                    {isAddingNew && selectedTicketId === ticket.id ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-3">
                        <h5 className="text-xs font-bold text-slate-800">+ Tambah Poin Arahan Rekomendasi Baru</h5>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Uraian poin rekomendasi solusi..."
                            value={newPoin}
                            onChange={(e) => setNewPoin(e.target.value)}
                            className="w-full text-xs rounded-lg border border-slate-300 p-2"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Dasar Hukum (contoh: Permendagri 20/2018)"
                              value={newDasarHukum}
                              onChange={(e) => setNewDasarHukum(e.target.value)}
                              className="text-xs rounded-lg border border-slate-300 p-2"
                            />
                            <input
                              type="text"
                              placeholder="Target Waktu (contoh: 14 Hari)"
                              value={newTargetWaktu}
                              onChange={(e) => setNewTargetWaktu(e.target.value)}
                              className="text-xs rounded-lg border border-slate-300 p-2"
                            />
                            <input
                              type="text"
                              placeholder="Penanggung Jawab (contoh: Kades)"
                              value={newPJ}
                              onChange={(e) => setNewPJ(e.target.value)}
                              className="text-xs rounded-lg border border-slate-300 p-2"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingNew(false)}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCreateNewItem(ticket.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                          >
                            Simpan Poin Rekomendasi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedTicketId(ticket.id);
                          setIsAddingNew(true);
                        }}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Tambah Poin Arahan Rekomendasi untuk Desa Ini</span>
                      </button>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
