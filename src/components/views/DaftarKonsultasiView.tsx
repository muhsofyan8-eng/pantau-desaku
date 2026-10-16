import React, { useState } from 'react';
import { 
  FileEdit, 
  Send, 
  Upload, 
  Paperclip, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Building2, 
  Users, 
  FileText, 
  Sparkles, 
  Search, 
  Filter,
  Video,
  Share2,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';
import { ConsultationTicket, IssueCategory, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';
import { normalizeGoogleMeetCode, generateWhatsAppInvitation } from '../../services/storageService';

interface DaftarKonsultasiViewProps {
  consultations: ConsultationTicket[];
  activeRole: UserRole;
  onAddConsultation: (ticket: ConsultationTicket) => void;
  onSelectTicketForMeet: (ticket: ConsultationTicket) => void;
  onOpenBeritaAcara: (ticket: ConsultationTicket) => void;
  onOpenScheduleModal: (ticket: ConsultationTicket) => void;
}

export const DaftarKonsultasiView: React.FC<DaftarKonsultasiViewProps> = ({
  consultations,
  activeRole,
  onAddConsultation,
  onSelectTicketForMeet,
  onOpenBeritaAcara,
  onOpenScheduleModal
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'riwayat'>('form');

  // Form states
  const [namaDesa, setNamaDesa] = useState('Desa Sukamaju');
  const [kecamatan, setKecamatan] = useState('Kecamatan Cilaku');
  const [kabupaten, setKabupaten] = useState('Kabupaten Cianjur');
  const [pemohonNama, setPemohonNama] = useState('');
  const [pemohonJabatan, setPemohonJabatan] = useState('Sekretaris Desa');
  const [pemohonKontak, setPemohonKontak] = useState('');
  const [pemohonEmail, setPemohonEmail] = useState('');
  const [bidang, setBidang] = useState<IssueCategory>('keuangan_apbdes');
  const [urgensi, setUrgensi] = useState<'Biasa' | 'Penting' | 'Mendesak'>('Penting');
  const [judulKonsultasi, setJudulKonsultasi] = useState('');
  const [uraianMasalah, setUraianMasalah] = useState('');
  const [preferensiTanggal, setPreferensiTanggal] = useState('');
  const [preferensiWaktu, setPreferensiWaktu] = useState('Pagi (09:00 - 11:30 WIB)');
  const [pesertaHadir, setPesertaHadir] = useState('Kepala Desa, Sekretaris Desa, Ketua BPD');

  // Google Meet Code / Room creation options
  const [meetProvisionMode, setMeetProvisionMode] = useState<'auto' | 'mandiri'>('auto');
  const [customMeetUrlOrCode, setCustomMeetUrlOrCode] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Uploaded docs simulator
  const [attachedFiles, setAttachedFiles] = useState<{ nama: string; tipe: string; ukuran: string; tanggal: string }[]>([
    { nama: 'Draf_Usulan_Masalah_Desa.pdf', tipe: 'PDF', ukuran: '1.2 MB', tanggal: new Date().toISOString().substring(0, 10) }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & filter in history tab
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleAddFile = () => {
    const fileOptions = [
      'Lampiran_RAB_Kegiatan.xlsx',
      'Draf_Raperdes_Penyelarasan.pdf',
      'Berita_Acara_Musdes.pdf',
      'Foto_Kondisi_Lapangan.jpg'
    ];
    const picked = fileOptions[Math.floor(Math.random() * fileOptions.length)];
    const newFile = {
      nama: picked,
      tipe: picked.endsWith('pdf') ? 'PDF' : picked.endsWith('xlsx') ? 'XLSX' : 'JPG',
      ukuran: '2.1 MB',
      tanggal: new Date().toISOString().substring(0, 10)
    };
    setAttachedFiles(prev => [...prev, newFile]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.toISOString().substring(0, 10);
    const regNum = `KD-${now.getFullYear()}-X-${Math.floor(100 + Math.random() * 900)}`;

    const pesertaList = pesertaHadir.split(',').map(item => ({
      nama: item.trim(),
      jabatan: item.trim().includes('Kades') ? 'Kepala Desa' : item.trim().includes('Sekdes') ? 'Sekretaris Desa' : 'Perangkat Desa',
      instansi: 'Pemerintah Desa',
      kehadiran: true
    }));

    let assignedMeetCode: string | undefined = undefined;
    let assignedMeetLink: string | undefined = undefined;

    if (meetProvisionMode === 'mandiri' && customMeetUrlOrCode.trim()) {
      const normalized = normalizeGoogleMeetCode(customMeetUrlOrCode);
      assignedMeetCode = normalized.code;
      assignedMeetLink = normalized.url;
    }

    const newTicket: ConsultationTicket = {
      id: 'kd-' + Date.now(),
      nomorRegistrasi: regNum,
      namaDesa,
      kecamatan,
      kabupaten,
      provinsi: 'Jawa Barat',
      pemohonNama: pemohonNama || 'Perangkat Desa Pemohon',
      pemohonJabatan,
      pemohonKontak: pemohonKontak || '0812-9988-7766',
      pemohonEmail: pemohonEmail || 'pemdes@desa.id',
      bidang,
      judulKonsultasi,
      uraianMasalah,
      urgensi,
      tanggalPengajuan: dateStr,
      tanggalKonsultasi: preferensiTanggal || undefined,
      googleMeetCode: assignedMeetCode,
      googleMeetLink: assignedMeetLink,
      status: 'menunggu_verifikasi',
      dokumenPengajuan: attachedFiles,
      daftarPeserta: pesertaList
    };

    setTimeout(() => {
      onAddConsultation(newTicket);
      setIsSubmitting(false);
      setSuccessMessage(`Permohonan konsultasi berhasil dikirim dengan Nomor Registrasi: ${regNum}. ${assignedMeetCode ? `Kode Meet desa "${assignedMeetCode}" telah tersimpan.` : 'Tim Fasilitator PMD akan menetapkan jadwal dan kode Google Meet resmi.'}`);
      setActiveTab('riwayat');
      
      // Reset form
      setJudulKonsultasi('');
      setUraianMasalah('');
      setCustomMeetUrlOrCode('');
    }, 600);
  };

  const filteredTickets = consultations.filter(ticket => {
    const matchSearch = 
      ticket.namaDesa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.judulKonsultasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.nomorRegistrasi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || ticket.bidang === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-emerald-600" />
            <span>Pendaftaran Konsultasi Desa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Desa mengajukan masalah, kebutuhan asistensi regulasi, dan permohonan bimbingan teknis daring.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'form' 
                ? 'bg-white text-emerald-800 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Formulir Pengajuan Baru
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'riwayat' 
                ? 'bg-white text-emerald-800 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Usulan ({consultations.length})
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-medium text-emerald-900 flex items-start gap-3 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Pengajuan Berhasil Tercatat!</p>
            <p className="mt-0.5">{successMessage}</p>
          </div>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: FORMULIR PENGAJUAN */}
      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Form Banner */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Satu Pintu Layanan Bimbingan Online</span>
            </div>
            <h3 className="text-lg font-bold">Formulir Permohonan Fasilitasi Klinik Desa</h3>
            <p className="text-xs text-emerald-100 mt-1 max-w-2xl leading-relaxed">
              Silakan lengkapi data profil desa, uraian kronologis masalah yang dihadapi, dan lampirkan dokumen pendukung untuk ditelaah oleh Tim Tenaga Ahli OPD sebelum sesi Google Meet.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Bagian 1: Identitas Desa & Pemohon */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>I. Identitas Desa & Aparatur Pemohon</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Desa / Kelurahan *</label>
                  <input
                    type="text"
                    required
                    value={namaDesa}
                    onChange={(e) => setNamaDesa(e.target.value)}
                    placeholder="Contoh: Desa Sukamaju"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan *</label>
                  <input
                    type="text"
                    required
                    value={kecamatan}
                    onChange={(e) => setKecamatan(e.target.value)}
                    placeholder="Contoh: Kecamatan Cilaku"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kabupaten / Kota *</label>
                  <input
                    type="text"
                    required
                    value={kabupaten}
                    onChange={(e) => setKabupaten(e.target.value)}
                    placeholder="Contoh: Kabupaten Cianjur"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Aparatur Pemohon *</label>
                  <input
                    type="text"
                    required
                    value={pemohonNama}
                    onChange={(e) => setPemohonNama(e.target.value)}
                    placeholder="Nama Lengkap & Gelar"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Pemohon *</label>
                  <select
                    value={pemohonJabatan}
                    onChange={(e) => setPemohonJabatan(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kepala Desa">Kepala Desa</option>
                    <option value="Sekretaris Desa">Sekretaris Desa</option>
                    <option value="Ketua BPD">Ketua BPD</option>
                    <option value="Kaur Keuangan / Bendahara">Kaur Keuangan / Bendahara</option>
                    <option value="Kaur Perencanaan">Kaur Perencanaan</option>
                    <option value="Ketua Tim Pelaksana Kegiatan (TPK)">Ketua TPK</option>
                    <option value="Direktur BUMDes">Direktur BUMDes</option>
                    <option value="Kader Pembangunan Manusia (KPM)">Kader Posyandu / KPM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    value={pemohonKontak}
                    onChange={(e) => setPemohonKontak(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi Desa *</label>
                  <input
                    type="email"
                    required
                    value={pemohonEmail}
                    onChange={(e) => setPemohonEmail(e.target.value)}
                    placeholder="desa@domain.id"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 2: Kategori & Pokok Permasalahan */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>II. Kategori Masalah & Kebutuhan Solusi</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bidang Konsultasi *</label>
                  <select
                    value={bidang}
                    onChange={(e) => setBidang(e.target.value as IssueCategory)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Urgensi Masalah *</label>
                  <select
                    value={urgensi}
                    onChange={(e) => setUrgensi(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Biasa">Biasa (Konsultasi Rutin)</option>
                    <option value="Penting">Penting (Tenggat Waktu dekat)</option>
                    <option value="Mendesak">Mendesak (Keadaan Darurat / Temuan Pemeriksaan)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Ringkas Masalah / Konsultasi *
                </label>
                <input
                  type="text"
                  required
                  value={judulKonsultasi}
                  onChange={(e) => setJudulKonsultasi(e.target.value)}
                  placeholder="Contoh: Konsultasi Penanganan Defisit APBDes dan Mekanisme Pergeseran Anggaran Bencana"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uraian Kronologis Permasalahan & Kebutuhan Solusi *
                </label>
                <textarea
                  rows={4}
                  required
                  value={uraianMasalah}
                  onChange={(e) => setUraianMasalah(e.target.value)}
                  placeholder="Jelaskan secara rinci kronologi kejadian, kendala teknis atau yuridis yang dihadapi, dasar hukum yang membingungkan, dan hasil yang diharapkan dari tim OPD..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Bagian 3: Peserta, Jadwal Preferensi & Upload Dokumen */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>III. Peserta Google Meet & Dokumen Pendukung</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Daftar Aparatur yang Akan Bergabung di Google Meet
                  </label>
                  <input
                    type="text"
                    value={pesertaHadir}
                    onChange={(e) => setPesertaHadir(e.target.value)}
                    placeholder="Pisahkan dengan koma, contoh: Kades, Sekdes, Ketua BPD, Bendahara"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Rekomendasi dihadiri Kades dan BPD agar hasil konsultasi langsung mengikat.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferensi Waktu Sesi Online
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={preferensiTanggal}
                      onChange={(e) => setPreferensiTanggal(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                      value={preferensiWaktu}
                      onChange={(e) => setPreferensiWaktu(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-xs"
                    >
                      <option>Pagi (09:00 - 11:30 WIB)</option>
                      <option>Siang (13:00 - 15:30 WIB)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pilihan Pembuatan Ruang & Kode Google Meet */}
              <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-emerald-600" />
                  <span>Metode Penyediaan Ruang & Kode Google Meet:</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    meetProvisionMode === 'auto'
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-200'
                      : 'bg-white/60 border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="meetOption"
                      value="auto"
                      checked={meetProvisionMode === 'auto'}
                      onChange={() => setMeetProvisionMode('auto')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Dibuat Otomatis oleh Sistem (Disarankan)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Admin Klinik Desa/PMD akan membuat tautan resmi saat verifikasi jadwal.
                      </div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    meetProvisionMode === 'mandiri'
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-200'
                      : 'bg-white/60 border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="meetOption"
                      value="mandiri"
                      checked={meetProvisionMode === 'mandiri'}
                      onChange={() => setMeetProvisionMode('mandiri')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Desa Menyediakan Ruang Sendiri</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Kirimkan kode rapat atau link Google Meet yang dibuat oleh desa.
                      </div>
                    </div>
                  </label>
                </div>

                {meetProvisionMode === 'mandiri' && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">
                        Masukkan Tautan atau Kode Google Meet Desa:
                      </span>
                      <a
                        href="https://meet.google.com/new"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Buka meet.google.com/new</span>
                      </a>
                    </div>
                    <input
                      type="text"
                      value={customMeetUrlOrCode}
                      onChange={(e) => setCustomMeetUrlOrCode(e.target.value)}
                      placeholder="Contoh: https://meet.google.com/abc-defg-hij atau abc-defg-hij"
                      className="w-full text-xs font-mono rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                    <p className="text-[10px] text-slate-500">
                      Sistem akan menormalkan kode menjadi format standar Google Meet dan menyediakannya untuk semua peserta dan narasumber OPD.
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Dokumen Pendukung */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-emerald-600" />
                    <span>Dokumen Pendukung (Draft Perdes, RAB, SPJ, Berita Acara)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddFile}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+ Tambah Berkas</span>
                  </button>
                </div>

                <div className="space-y-1.5 mt-2">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{file.nama}</span>
                        <span className="text-[10px] text-slate-400">({file.ukuran})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-red-500 hover:text-red-700 text-xs px-2"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Pendaftaran Konsultasi'}</span>
              </button>
            </div>

          </div>
        </form>
      )}

      {/* TAB 2: RIWAYAT USULAN DESA */}
      {activeTab === 'riwayat' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari desa, judul, nomor registrasi..."
                className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white"
              >
                <option value="all">Semua Bidang Masalah</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List of Applications */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const cat = CATEGORY_LABELS[ticket.bidang];
              return (
                <div key={ticket.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">{ticket.namaDesa}</span>
                        <span className="text-[11px] text-slate-500">({ticket.kecamatan})</span>
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {ticket.nomorRegistrasi}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.badgeColor}`}>
                          {cat.label}
                        </span>
                        <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                          Urgensi: {ticket.urgensi}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        {ticket.judulKonsultasi}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {ticket.uraianMasalah}
                      </p>

                      <div className="pt-2 text-[11px] text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>Pemohon: <strong className="text-slate-700">{ticket.pemohonNama}</strong> ({ticket.pemohonJabatan})</span>
                        <span>Diajukan: {ticket.tanggalPengajuan}</span>
                        {ticket.dokumenPengajuan && (
                          <span className="text-emerald-700 font-medium">
                            📎 {ticket.dokumenPengajuan.length} Berkas Pendukung
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div>
                        {ticket.status === 'menunggu_verifikasi' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            Menunggu Verifikasi PMD
                          </span>
                        )}
                        {ticket.status === 'terjadwal' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                            Terjadwal ({ticket.tanggalKonsultasi})
                          </span>
                        )}
                        {ticket.status === 'berlangsung' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-600 text-white animate-pulse">
                            Sedang Berlangsung
                          </span>
                        )}
                        {ticket.status === 'tindak_lanjut' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                            Tindak Lanjut ({ticket.progressTindakLanjut || 0}%)
                          </span>
                        )}
                        {ticket.status === 'selesai' && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Selesai & Tuntas
                          </span>
                        )}
                      </div>

                      {/* Interactive Action buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {/* WhatsApp Invite Share Button */}
                        {(ticket.googleMeetLink || ticket.googleMeetCode) && (
                          <button
                            onClick={() => {
                              const text = generateWhatsAppInvitation(ticket);
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors"
                            title="Kirim Undangan & Kode Meet via WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Kirim ke WA</span>
                          </button>
                        )}

                        {/* Copy Code Button */}
                        {ticket.googleMeetCode && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(ticket.googleMeetCode!);
                              setCopiedCodeId(ticket.id);
                              setTimeout(() => setCopiedCodeId(null), 2000);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                            title="Salin Kode Meet"
                          >
                            {copiedCodeId === ticket.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span>{ticket.googleMeetCode}</span>
                              </>
                            )}
                          </button>
                        )}

                        {ticket.status === 'menunggu_verifikasi' && (
                          <button
                            onClick={() => onOpenScheduleModal(ticket)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                          >
                            Verifikasi & Buat Jadwal
                          </button>
                        )}
                        {(ticket.status === 'terjadwal' || ticket.status === 'berlangsung') && (
                          <button
                            onClick={() => onSelectTicketForMeet(ticket)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs"
                          >
                            <span>Masuk Google Meet</span>
                          </button>
                        )}
                        {ticket.nomorBeritaAcara && (
                          <button
                            onClick={() => onOpenBeritaAcara(ticket)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300"
                          >
                            Berita Acara
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
