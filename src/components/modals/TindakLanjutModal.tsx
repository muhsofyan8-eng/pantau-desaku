import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  CheckCircle, 
  Clock, 
  FileText, 
  AlertCircle,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { ConsultationTicket, RecommendationItem } from '../../types/clinic';

interface TindakLanjutModalProps {
  ticket: ConsultationTicket;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRecommendations: (ticketId: string, updatedRecommendations: RecommendationItem[]) => void;
}

export const TindakLanjutModal: React.FC<TindakLanjutModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdateRecommendations
}) => {
  const [recs, setRecs] = useState<RecommendationItem[]>(ticket.rekomendasi || []);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStatusChange = (recId: string, newStatus: RecommendationItem['status']) => {
    setRecs(prev => prev.map(item => {
      if (item.id === recId) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const handleNotesChange = (recId: string, notes: string) => {
    setRecs(prev => prev.map(item => {
      if (item.id === recId) {
        return { ...item, catatanTindakLanjut: notes };
      }
      return item;
    }));
  };

  const handleSimulateUpload = (recId: string) => {
    const sampleFiles = [
      'Bukti_Revisi_Perdes_Telah_Disahkan.pdf',
      'SPJ_Realisasi_BTT_Darurat.pdf',
      'Foto_Musdes_Penyelarasan.jpg',
      'Surat_Pernyataan_Tanggungjawab_Mutlak.pdf'
    ];
    const pickedFile = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];

    setRecs(prev => prev.map(item => {
      if (item.id === recId) {
        const currentFiles = item.buktiDukung || [];
        const newFile = {
          namaFile: pickedFile,
          tanggalUnggah: new Date().toISOString().substring(0, 10),
          ukuran: '1.4 MB'
        };
        return {
          ...item,
          status: item.status === 'belum_dimulai' ? 'dalam_proses' : item.status,
          buktiDukung: [...currentFiles, newFile]
        };
      }
      return item;
    }));

    setUploadFeedback(`Dokumen "${pickedFile}" berhasil diunggah.`);
    setTimeout(() => setUploadFeedback(null), 3500);
  };

  const handleSave = () => {
    onUpdateRecommendations(ticket.id, recs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">Progres Tindak Lanjut Rekomendasi Desa</h3>
              <p className="text-[11px] text-slate-400">{ticket.namaDesa} • {ticket.nomorRegistrasi}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {uploadFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadFeedback}</span>
            </div>
          )}

          <div className="text-xs text-slate-600">
            Perbaharui status pelaksanaan rekomendasi dan lampirkan bukti dokumen (SPJ, Perdes revisi, foto musdes) untuk diverifikasi oleh Tim Fasilitator Klinik Desa.
          </div>

          <div className="space-y-4">
            {recs.map((rec, index) => (
              <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">
                        {rec.poinRekomendasi}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Dasar: <span className="font-medium text-slate-700">{rec.dasarHukum}</span> • Target: <span className="font-semibold text-emerald-700">{rec.targetWaktu}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={rec.status}
                    onChange={(e) => handleStatusChange(rec.id, e.target.value as any)}
                    className="text-xs font-semibold rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="belum_dimulai">Belum Dimulai</option>
                    <option value="dalam_proses">Dalam Proses</option>
                    <option value="menunggu_verifikasi">Menunggu Reviu OPD</option>
                    <option value="tuntas">Tuntas (Selesai)</option>
                  </select>
                </div>

                {/* Catatan Tindak Lanjut */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Uraian Catatan Kemajuan Tindak Lanjut:
                  </label>
                  <textarea
                    value={rec.catatanTindakLanjut || ''}
                    onChange={(e) => handleNotesChange(rec.id, e.target.value)}
                    placeholder="Contoh: Telah dilaksanakan musdes penyelarasan tanggal 5 Oktober, draft perkades sedang dievaluasi camat..."
                    rows={2}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Upload Bukti Dukung */}
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Bukti Dukung ({rec.buktiDukung?.length || 0})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload(rec.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Unggah Bukti Baru</span>
                    </button>
                  </div>

                  {rec.buktiDukung && rec.buktiDukung.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {rec.buktiDukung.map((file, fIdx) => (
                        <div key={fIdx} className="flex items-center justify-between text-[11px] bg-white p-1.5 px-2.5 rounded-md border border-slate-200">
                          <span className="truncate font-medium text-slate-700">{file.namaFile}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{file.ukuran} • {file.tanggalUnggah}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Simpan Pembaruan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
