import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  QrCode,
  Building,
  Calendar,
  Users
} from 'lucide-react';
import { ConsultationTicket } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';

interface BeritaAcaraModalProps {
  ticket: ConsultationTicket;
  isOpen: boolean;
  onClose: () => void;
}

export const BeritaAcaraModal: React.FC<BeritaAcaraModalProps> = ({
  ticket,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const categoryMeta = CATEGORY_LABELS[ticket.bidang] || { label: ticket.bidang };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between text-white print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">Dokumen Resmi: Berita Acara & Lembar Rekomendasi</h3>
              <p className="text-[11px] text-slate-400">Nomor: {ticket.nomorBeritaAcara || 'BA-KD/PMD/2026/DRAFT'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Container */}
        <div className="p-8 sm:p-12 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-6 bg-white text-slate-900 font-serif">
          
          {/* Official Letterhead (KOP SURAT RESMI PEMKAB / PMD) */}
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center font-sans">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center shrink-0 bg-slate-50 font-bold text-xs">
                <Building className="w-8 h-8 text-slate-800" />
              </div>
              <div className="text-center">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-slate-700">
                  Pemerintah Daerah {ticket.kabupaten.toUpperCase()}
                </h4>
                <h2 className="text-lg sm:text-xl uppercase font-black tracking-tight text-slate-900">
                  Dinas Pemberdayaan Masyarakat dan Desa
                </h2>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
                  Sekretariat Fasilitasi & Layanan Terpadu “Klinik Desa”
                </h3>
                <p className="text-[10px] text-slate-500 font-normal">
                  Kompleks Perkantoran Pemerintah Daerah • Hotline Konsultasi Daring: (0263) 261889 • Email: klinikdesa@{ticket.kabupaten.toLowerCase().replace(/\s+/g, '')}.go.id
                </p>
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center mb-6">
            <h1 className="text-base sm:text-lg font-bold tracking-wide uppercase underline decoration-2 decoration-slate-800">
              BERITA ACARA FASILITASI & LEMBAR REKOMENDASI KLINIK DESA
            </h1>
            <p className="text-xs font-mono font-semibold text-slate-700 mt-1">
              Nomor: {ticket.nomorBeritaAcara || `BA-KD/PMD/2026/REG-${ticket.id.slice(-4).toUpperCase()}`}
            </p>
          </div>

          {/* Opening Paragraph */}
          <div className="text-xs sm:text-sm text-justify leading-relaxed mb-4">
            Pada hari ini, tanggal <span className="font-bold">{ticket.tanggalKonsultasi || ticket.tanggalPengajuan}</span>, telah diselenggarakan fasilitasi konsultasi daring melalui media resmi <em>Google Meet Klinik Desa</em> antara Tim Tenaga Ahli / Tim Pembina Organisasi Perangkat Daerah (OPD) dengan Pemerintah Desa pemohon dengan rincian sebagai berikut:
          </div>

          {/* Information Table */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2 mb-6 font-sans">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Desa / Kelurahan</span>
              <span className="col-span-2 font-bold text-slate-900">: {ticket.namaDesa}, Kec. {ticket.kecamatan}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Pemohon / Perangkat</span>
              <span className="col-span-2 text-slate-900">: {ticket.pemohonNama} ({ticket.pemohonJabatan})</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Bidang Masalah</span>
              <span className="col-span-2 text-slate-900 font-semibold">: {categoryMeta.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Judul Konsultasi</span>
              <span className="col-span-2 text-slate-900 font-medium">: {ticket.judulKonsultasi}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Fasilitator / Narasumber</span>
              <span className="col-span-2 text-slate-900 font-semibold">: {ticket.tenagaAhliNama || 'Tim Fasilitator Dinas PMD'} ({ticket.tenagaAhliInstansi || 'Dinas PMD'})</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Tautan Rekaman / Meet</span>
              <span className="col-span-2 text-slate-900 font-mono text-xs">: {ticket.googleMeetLink || 'https://meet.google.com/' + (ticket.googleMeetCode || 'klinik-desa')}</span>
            </div>
          </div>

          {/* Pokok Pembahasan */}
          <div className="mb-6 font-sans">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              I. Ringkasan Pokok Permasalahan & Pembahasan
            </h4>
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
              <p>
                {ticket.notulensiKonsultasi?.rangkumanPembahasan || ticket.uraianMasalah}
              </p>
              {ticket.notulensiKonsultasi?.pokokMasalahTeridentifikasi && (
                <div className="pl-4">
                  <p className="font-semibold text-slate-700 text-xs mb-1">Identifikasi Isu Kritis:</p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    {ticket.notulensiKonsultasi.pokokMasalahTeridentifikasi.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Rekomendasi & Tindak Lanjut Table */}
          <div className="mb-6 font-sans">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
              II. Matriks Rekomendasi & Tindak Lanjut Wajib
            </h4>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                  <tr>
                    <th className="p-2.5 w-10 text-center">No</th>
                    <th className="p-2.5">Poin Rekomendasi Solusi</th>
                    <th className="p-2.5 w-44">Dasar Regulasi</th>
                    <th className="p-2.5 w-28">Target Waktu</th>
                    <th className="p-2.5 w-28">Penanggung Jawab</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ticket.rekomendasi && ticket.rekomendasi.length > 0 ? (
                    ticket.rekomendasi.map((rec, idx) => (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="p-2.5 text-center font-bold text-slate-600">{idx + 1}</td>
                        <td className="p-2.5 font-medium text-slate-900">{rec.poinRekomendasi}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-700">{rec.dasarHukum}</td>
                        <td className="p-2.5 text-slate-800 font-semibold">{rec.targetWaktu}</td>
                        <td className="p-2.5 text-slate-700">{rec.penanggungJawab}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500 italic">
                        Fasilitasi telah selesai dilaksanakan. Lembar rekomendasi formal siap ditandatangani.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures & QR Code Section */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-center font-sans text-xs">
            {/* Pemohon Desa */}
            <div>
              <p className="text-slate-600 mb-1">Pihak Pemohon,</p>
              <p className="font-bold text-slate-800">{ticket.pemohonJabatan} {ticket.namaDesa}</p>
              <div className="h-16 flex items-center justify-center my-2 text-slate-400 italic text-[11px]">
                [ Ditandatangani Elektronik ]
              </div>
              <p className="font-bold underline text-slate-900">{ticket.pemohonNama}</p>
              <p className="text-[10px] text-slate-500">Pemerintah Desa {ticket.namaDesa}</p>
            </div>

            {/* QR Code Validation */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg flex items-center justify-center shadow-xs">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="text-[10px] font-bold text-emerald-800 mt-1 uppercase tracking-wider">
                Verifikasi Valid
              </span>
              <span className="text-[9px] text-slate-500 font-mono">
                KD-{ticket.id.toUpperCase()}
              </span>
            </div>

            {/* Tenaga Ahli / OPD */}
            <div>
              <p className="text-slate-600 mb-1">Narasumber / Fasilitator OPD,</p>
              <p className="font-bold text-slate-800">{ticket.tenagaAhliInstansi || 'Dinas PMD'}</p>
              <div className="h-16 flex items-center justify-center my-2 text-slate-400 italic text-[11px]">
                [ Ditandatangani Elektronik ]
              </div>
              <p className="font-bold underline text-slate-900">{ticket.tenagaAhliNama || 'Drs. H. Bambang Suhartono, M.Si'}</p>
              <p className="text-[10px] text-slate-500">NIP. 19740512 199903 1 004</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center font-sans">
            Dokumen ini diterbitkan secara sah melalui Sistem Informasi Klinik Desa Online berdasar asas transparansi dan fasilitasi tata kelola desa. Bukti tindak lanjut dipantau secara berkala melalui menu Monitoring Klinik Desa.
          </div>

        </div>
      </div>
    </div>
  );
};
