import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  UserCheck, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { ConsultationTicket, ExpertProfile } from '../../types/clinic';
import { generateGoogleMeetCode, normalizeGoogleMeetCode } from '../../services/storageService';

interface VerifikasiJadwalModalProps {
  ticket: ConsultationTicket;
  experts: ExpertProfile[];
  isOpen: boolean;
  onClose: () => void;
  onSaveSchedule: (
    ticketId: string, 
    data: {
      tanggal: string;
      waktuMulai: string;
      waktuSelesai: string;
      tenagaAhliId: string;
      googleMeetCode: string;
      googleMeetLink: string;
    }
  ) => void;
}

export const VerifikasiJadwalModal: React.FC<VerifikasiJadwalModalProps> = ({
  ticket,
  experts,
  isOpen,
  onClose,
  onSaveSchedule
}) => {
  const [tanggal, setTanggal] = useState(ticket.tanggalKonsultasi || new Date().toISOString().substring(0, 10));
  const [waktuMulai, setWaktuMulai] = useState(ticket.waktuMulai || '10:00');
  const [waktuSelesai, setWaktuSelesai] = useState(ticket.waktuSelesai || '11:15');
  const [selectedExpertId, setSelectedExpertId] = useState(ticket.tenagaAhliId || experts[0]?.id || '');
  const [meetInput, setMeetInput] = useState(ticket.googleMeetCode || generateGoogleMeetCode());

  if (!isOpen) return null;

  const handleRegenerateMeet = () => {
    setMeetInput(generateGoogleMeetCode());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeGoogleMeetCode(meetInput);
    onSaveSchedule(ticket.id, {
      tanggal,
      waktuMulai,
      waktuSelesai,
      tenagaAhliId: selectedExpertId,
      googleMeetCode: normalized.code,
      googleMeetLink: normalized.url
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Verifikasi & Penjadwalan Konsultasi</h3>
              <p className="text-[11px] text-slate-400">No. Registrasi: {ticket.nomorRegistrasi}</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Desa Info Summary */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-800">{ticket.namaDesa} ({ticket.kecamatan})</div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">{ticket.judulKonsultasi}</div>
            <div className="text-[11px] text-slate-500 mt-1">Pemohon: {ticket.pemohonNama} ({ticket.pemohonJabatan})</div>
          </div>

          {/* Pilih Tenaga Ahli / OPD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Pilih Narasumber / Tenaga Ahli OPD</span>
            </label>
            <select
              value={selectedExpertId}
              onChange={(e) => setSelectedExpertId(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              required
            >
              {experts.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.nama} — {exp.instansi} ({exp.statusKetersediaan})
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal & Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Tanggal Sesi</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Jam Mulai</span>
              </label>
              <input
                type="time"
                value={waktuMulai}
                onChange={(e) => setWaktuMulai(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Jam Selesai</span>
              </label>
              <input
                type="time"
                value={waktuSelesai}
                onChange={(e) => setWaktuSelesai(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Google Meet Link Generator */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-emerald-700" />
                <span>Kode atau Tautan Google Meet</span>
              </label>
              <div className="flex items-center gap-2">
                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buat Baru di Google</span>
                </a>
                <button
                  type="button"
                  onClick={handleRegenerateMeet}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-emerald-200"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Acak Otomatis</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={meetInput}
                onChange={(e) => setMeetInput(e.target.value)}
                placeholder="Contoh: qvr-tzmh-xwk atau https://meet.google.com/qvr-tzmh-xwk"
                className="flex-1 text-xs bg-white text-slate-800 rounded-lg border border-emerald-300 p-2 font-mono font-medium focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg">
                Siap
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1.5">
              Anda dapat menggunakan kode otomatis dari sistem atau menempelkan tautan/kode Google Meet yang sudah dibuat sebelumnya.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Tetapkan Jadwal & Buat Sesi Meet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
