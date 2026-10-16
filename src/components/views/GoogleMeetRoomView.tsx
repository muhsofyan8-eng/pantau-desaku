import React, { useState } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldAlert,
  Send,
  Plus,
  BookOpen,
  Share2,
  KeyRound,
  RotateCcw,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { ConsultationTicket, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';
import { 
  generateWhatsAppInvitation, 
  normalizeGoogleMeetCode, 
  generateGoogleMeetCode 
} from '../../services/storageService';
import { IntegratedMeetRoom } from './IntegratedMeetRoom';

interface GoogleMeetRoomViewProps {
  consultations: ConsultationTicket[];
  selectedTicket: ConsultationTicket | null;
  onSelectTicket: (ticket: ConsultationTicket) => void;
  activeRole: UserRole;
  onSaveLiveNotes: (ticketId: string, notes: { rangkuman: string; masalah: string[]; aturan: string[] }) => void;
  onUpdateMeetCode?: (ticketId: string, newCode: string, newLink: string) => void;
  onOpenLauncherModal?: (ticket: ConsultationTicket) => void;
  onFinishAndIssueRecommendation: (ticket: ConsultationTicket) => void;
  onOpenBeritaAcara: (ticket: ConsultationTicket) => void;
}

export const GoogleMeetRoomView: React.FC<GoogleMeetRoomViewProps> = ({
  consultations,
  selectedTicket,
  onSelectTicket,
  activeRole,
  onSaveLiveNotes,
  onUpdateMeetCode,
  onOpenLauncherModal,
  onFinishAndIssueRecommendation,
  onOpenBeritaAcara
}) => {
  // Fallback to first available or scheduled
  const activeTicket = selectedTicket || consultations.find(c => c.status === 'berlangsung') || consultations[0];

  // Pre-call equipment test states
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeOnly, setCopiedCodeOnly] = useState(false);
  const [copiedInviteText, setCopiedInviteText] = useState(false);

  // In-App Embedded Video Room vs Setup Hub mode
  const [displayMode, setDisplayMode] = useState<'integrated_room' | 'hub_setup'>('integrated_room');

  // Edit custom meet code states
  const [isEditingMeetCode, setIsEditingMeetCode] = useState(false);
  const [customCodeInput, setCustomCodeInput] = useState('');

  // Live minutes notepad state
  const [rangkuman, setRangkuman] = useState(
    activeTicket?.notulensiKonsultasi?.rangkumanPembahasan || 
    'Fasilitasi daring dibuka secara resmi. Pihak pemerintah desa menyampaikan kronologi masalah...'
  );
  const [masalahPoints, setMasalahPoints] = useState<string[]>(
    activeTicket?.notulensiKonsultasi?.pokokMasalahTeridentifikasi || [
      'Penyelarasan nomenklatur belanja darurat dengan sistem Siskeudes',
      'Kewajiban surat keterangan penetapan tanggap darurat dari Camat'
    ]
  );
  const [newMasalahInput, setNewMasalahInput] = useState('');

  const [aturanList, setAturanList] = useState<string[]>(
    activeTicket?.notulensiKonsultasi?.telaahAturan || [
      'Permendagri No. 20 Tahun 2018 Pasal 69 (Pergeseran Anggaran Bencana)',
      'UU No. 3 Tahun 2024 tentang Perubahan Kedua UU Desa'
    ]
  );
  const [newAturanInput, setNewAturanInput] = useState('');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  if (!activeTicket) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        <Video className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">Belum Ada Sesi Konsultasi</h3>
        <p className="text-xs text-slate-400 mt-1">Daftarkan konsultasi terlebih dahulu di menu Daftar Konsultasi.</p>
      </div>
    );
  }

  const meetLink = activeTicket.googleMeetLink || `https://meet.google.com/${activeTicket.googleMeetCode || 'klinik-desa-live'}`;
  const meetCode = activeTicket.googleMeetCode || (activeTicket.googleMeetLink ? activeTicket.googleMeetLink.split('/').pop() : 'klinik-desa');
  const cat = CATEGORY_LABELS[activeTicket.bidang];

  const handleCopy = () => {
    navigator.clipboard.writeText(meetLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCodeOnly = () => {
    navigator.clipboard.writeText(meetCode || '');
    setCopiedCodeOnly(true);
    setTimeout(() => setCopiedCodeOnly(false), 2000);
  };

  const handleCopyInviteText = () => {
    const text = generateWhatsAppInvitation(activeTicket);
    navigator.clipboard.writeText(text);
    setCopiedInviteText(true);
    setTimeout(() => setCopiedInviteText(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppInvitation(activeTicket);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSaveCustomCode = () => {
    if (!customCodeInput.trim() || !onUpdateMeetCode) return;
    const normalized = normalizeGoogleMeetCode(customCodeInput);
    onUpdateMeetCode(activeTicket.id, normalized.code, normalized.url);
    setIsEditingMeetCode(false);
    setCustomCodeInput('');
  };

  const handleGenerateFreshCode = () => {
    if (!onUpdateMeetCode) return;
    const fresh = generateGoogleMeetCode();
    onUpdateMeetCode(activeTicket.id, fresh, `https://meet.google.com/${fresh}`);
  };

  const handleLaunchMeet = () => {
    window.open(meetLink, '_blank', 'noopener,noreferrer');
  };

  const handleAddMasalah = () => {
    if (!newMasalahInput.trim()) return;
    setMasalahPoints(prev => [...prev, newMasalahInput.trim()]);
    setNewMasalahInput('');
  };

  const handleAddAturan = () => {
    if (!newAturanInput.trim()) return;
    setAturanList(prev => [...prev, newAturanInput.trim()]);
    setNewAturanInput('');
  };

  const handleSaveNotes = () => {
    onSaveLiveNotes(activeTicket.id, {
      rangkuman,
      masalah: masalahPoints,
      aturan: aturanList
    });
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-600" />
              <span>Ruang Konsultasi Tatap Muka Online</span>
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Media Konsultasi Utama
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Layanan tatap muka virtual resmi antara aparatur desa dan narasumber OPD.
          </p>
        </div>

        {/* Action Controls: Mode Switcher & Session Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setDisplayMode('integrated_room')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                displayMode === 'integrated_room' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Ruang Video (Di Aplikasi)</span>
            </button>
            <button
              onClick={() => setDisplayMode('hub_setup')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                displayMode === 'hub_setup' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Pengaturan & Tautan Meet</span>
            </button>
          </div>

          {/* Switch Session selector */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
            <label className="text-xs font-semibold text-slate-500 pl-2">Sesi:</label>
            <select
              value={activeTicket.id}
              onChange={(e) => {
                const found = consultations.find(c => c.id === e.target.value);
                if (found) onSelectTicket(found);
              }}
              className="text-xs font-bold rounded-lg border-0 px-2 py-1 bg-transparent text-slate-800 focus:ring-0 max-w-[200px] truncate"
            >
              {consultations.map(ticket => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.namaDesa}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MODE 1: INTEGRATED VIDEO ROOM (RUNS DIRECTLY INSIDE KLINIK DESA APP) */}
      {displayMode === 'integrated_room' ? (
        <IntegratedMeetRoom
          ticket={activeTicket}
          activeRole={activeRole}
          onLeaveRoom={() => setDisplayMode('hub_setup')}
          onFinishAndIssueRecommendation={onFinishAndIssueRecommendation}
          onOpenBeritaAcara={onOpenBeritaAcara}
          onSaveLiveNotes={onSaveLiveNotes}
        />
      ) : (
        /* MODE 2: HUB SETUP & EXTERNAL LAUNCHPAD */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Google Meet Launchpad & Pre-check */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card Google Meet Hero */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  Google Meet Terverifikasi
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  {activeTicket.status === 'berlangsung' ? 'Sesi Sedang Aktif' : 'Ruang Siap'}
                </span>
              </div>
              <h3 className="text-base font-bold mt-1 text-white">{activeTicket.namaDesa}</h3>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{activeTicket.judulKonsultasi}</p>
            </div>

            {/* Video Preview Simulator */}
            <div className="p-4 bg-slate-950 flex flex-col items-center justify-center relative min-h-[220px]">
              {camActive ? (
                <div className="w-full h-44 rounded-xl bg-slate-800 flex flex-col items-center justify-center border border-slate-700 text-center p-4 relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-emerald-600/30 border border-emerald-500 text-emerald-300 flex items-center justify-center text-lg font-bold mb-2">
                    {activeRole === 'desa' ? 'DESA' : 'OPD'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    Kamera Aktif • Siap Masuk Ruang
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Audio input terdeteksi normal
                  </span>

                  {/* Mic status indicator */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 rounded-md text-[10px] text-slate-300">
                    {micActive ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Mic On</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span>Mic Off</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-44 rounded-xl bg-slate-900 flex flex-col items-center justify-center border border-slate-800 text-slate-500">
                  <CameraOff className="w-8 h-8 mb-2" />
                  <span className="text-xs">Kamera Dinonaktifkan</span>
                </div>
              )}

              {/* Hardware Test Controls */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setMicActive(!micActive)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    micActive 
                      ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' 
                      : 'bg-red-500 text-white border-red-600'
                  }`}
                  title={micActive ? 'Matikan Mikrofon' : 'Nyalakan Mikrofon'}
                >
                  {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  <span>{micActive ? 'Mic Nyala' : 'Mic Bisu'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCamActive(!camActive)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    camActive 
                      ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' 
                      : 'bg-red-500 text-white border-red-600'
                  }`}
                  title={camActive ? 'Matikan Kamera' : 'Nyalakan Kamera'}
                >
                  {camActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  <span>{camActive ? 'Kamera On' : 'Kamera Off'}</span>
                </button>
              </div>
            </div>

            {/* Launch & Copy Link */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={meetLink}
                  className="flex-1 text-xs font-mono text-slate-700 bg-transparent truncate outline-none font-medium"
                />
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-200 rounded-lg text-xs flex items-center gap-1 shrink-0"
                  title="Salin Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Big Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setDisplayMode('integrated_room')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Video className="w-5 h-5" />
                  <span>Masuk Ruang Rapat Virtual (Di Dalam Aplikasi)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleLaunchMeet}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs text-center"
                    title="Buka URL Google Meet di tab browser baru"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buka meet.google.com</span>
                  </button>

                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs text-center"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buat Baru di Google</span>
                  </a>
                </div>
              </div>

              {/* Troubleshooting Note for Google Meet "Periksa Kode Rapat" */}
              <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Mengapa Google Menampilkan "Periksa Kode Rapat"?</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Pesan tersebut muncul apabila kode rapat di URL belum pernah dibuat di Google. 
                  Untuk rapat dinas resmi: Klik <strong>"Buat Rapat Baru di Google"</strong> di atas, salin link yang muncul di tab Google (contoh: <code>meet.google.com/xxx-yyyy-zzz</code>), lalu klik tombol pensil <strong>Edit Kode</strong> di bawah untuk menyimpannya.
                </p>
              </div>
            </div>

            {/* Kotak Pengelolaan & Pengiriman Kode Meet ke Peserta */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <span>Kode Google Meet Peserta:</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  Resmi Aktif
                </span>
              </div>

              {/* Big Code Highlight */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-300 shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">KODE RAPAT GOOGLE MEET</span>
                  <span className="text-base font-extrabold font-mono text-emerald-800 tracking-wider">
                    {meetCode}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyCodeOnly}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Salin Kode Meet"
                  >
                    {copiedCodeOnly ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeOnly ? 'Tersalin' : 'Salin Kode'}</span>
                  </button>
                  <button
                    onClick={() => setIsEditingMeetCode(!isEditingMeetCode)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs"
                    title="Ubah atau Masukkan Kode Meet Sendiri"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Edit / Input Custom Code Box */}
              {isEditingMeetCode && (
                <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Ganti / Masukkan Kode Google Meet Baru
                    </span>
                    <a
                      href="https://meet.google.com/new"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buat di meet.google.com/new</span>
                    </a>
                  </div>

                  <input
                    type="text"
                    value={customCodeInput}
                    onChange={(e) => setCustomCodeInput(e.target.value)}
                    placeholder="Contoh: qvr-tzmh-xwk atau link https://meet.google.com/..."
                    className="w-full text-xs font-mono rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateFreshCode}
                      className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Acak Kode Sistem Baru</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsEditingMeetCode(false)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveCustomCode}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                      >
                        Terapkan Kode
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions to Send WhatsApp Invitation */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleShareWhatsApp}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all hover:scale-[1.01]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Kirim Undangan ke WA</span>
                </button>

                <button
                  onClick={handleCopyInviteText}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  {copiedInviteText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Teks Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin Teks Undangan</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-center">
                Pesan WhatsApp mencakup nomor registrasi, agenda, jadwal, link, dan kode akses meet untuk Kades & Narasumber.
              </p>
            </div>
          </div>

          {/* Tata Tertib Konsultasi Online */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-2.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Tata Tertib Konsultasi Daring Desa</span>
            </h4>
            <ul className="space-y-1.5 text-slate-600 list-disc pl-4 text-[11px] leading-relaxed">
              <li>Wajib berpakaian dinas rapi / batik sopan dan berada di kantor desa.</li>
              <li>Pastikan Kepala Desa, Sekdes atau Ketua BPD hadir dalam ruang meet.</li>
              <li>Siapkan dokumen APBDes / Draf Perdes / RAB yang akan dikonsultasikan.</li>
              <li>Hasil konsultasi akan langsung dituangkan ke dalam Lembar Rekomendasi Resmi.</li>
            </ul>
          </div>

        </div>

        {/* Right Column (7 cols): Live Shared Notes & Consultation Log */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Lembar Kerja Notulensi & Telaah Yuridis Sesi</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Dicatat langsung selama video call Google Meet berlangsung
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isSavedFeedback && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Tersimpan!
                  </span>
                )}
                <button
                  onClick={handleSaveNotes}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>

            {/* Rangkuman Pembahasan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Rangkuman Pembahasan & Fakta Masalah:
              </label>
              <textarea
                rows={4}
                value={rangkuman}
                onChange={(e) => setRangkuman(e.target.value)}
                placeholder="Tuliskan poin-poin penjelasan kepala desa, tanggapan awal narasumber OPD, dan kronologi keadaan..."
                className="w-full text-xs rounded-xl border border-slate-300 p-3 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Pokok Masalah Teridentifikasi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pokok Masalah Kritis Teridentifikasi ({masalahPoints.length})</span>
                </label>
              </div>

              <div className="space-y-1.5 mb-2">
                {masalahPoints.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="text-slate-800">• {item}</span>
                    <button
                      onClick={() => setMasalahPoints(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 text-[11px] px-1 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMasalahInput}
                  onChange={(e) => setNewMasalahInput(e.target.value)}
                  placeholder="Tambah pokok masalah baru..."
                  className="flex-1 text-xs rounded-lg border border-slate-300 p-2"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMasalah()}
                />
                <button
                  type="button"
                  onClick={handleAddMasalah}
                  className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100"
                >
                  + Tambah
                </button>
              </div>
            </div>

            {/* Telaah Regulasi & Dasar Hukum */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Rujukan Regulasi & Solusi Hukum:</span>
              </label>

              <div className="space-y-1.5 mb-2">
                {aturanList.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg border border-blue-200 text-xs">
                    <span className="text-blue-900 font-medium">§ {item}</span>
                    <button
                      onClick={() => setAturanList(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 text-[11px] px-1 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newAturanInput}
                  onChange={(e) => setNewAturanInput(e.target.value)}
                  placeholder="Contoh: Permendagri 20/2018 Pasal 69 ayat 2..."
                  className="flex-1 text-xs rounded-lg border border-slate-300 p-2"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAturan()}
                />
                <button
                  type="button"
                  onClick={handleAddAturan}
                  className="px-3 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100"
                >
                  + Tambah Rujukan
                </button>
              </div>
            </div>

            {/* Final Action: Selesaikan Konsultasi & Terbitkan Rekomendasi */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Setelah Google Meet selesai, terbitkan Berita Acara & Lembar Rekomendasi.
              </span>

              <div className="flex items-center gap-2">
                {activeTicket.nomorBeritaAcara && (
                  <button
                    onClick={() => onOpenBeritaAcara(activeTicket)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Lihat Berita Acara
                  </button>
                )}

                <button
                  onClick={() => onFinishAndIssueRecommendation(activeTicket)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesaikan Sesi & Terbitkan Rekomendasi</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
      )}
    </div>
  );
};
