import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Hand, 
  MessageSquare, 
  Users, 
  FileText, 
  PhoneOff, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Send, 
  Settings,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { ConsultationTicket, UserRole } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';
import { generateWhatsAppInvitation } from '../../services/storageService';

interface IntegratedMeetRoomProps {
  ticket: ConsultationTicket;
  activeRole: UserRole;
  onLeaveRoom: () => void;
  onFinishAndIssueRecommendation: (ticket: ConsultationTicket) => void;
  onOpenBeritaAcara: (ticket: ConsultationTicket) => void;
  onSaveLiveNotes: (ticketId: string, notes: { rangkuman: string; masalah: string[]; aturan: string[] }) => void;
}

export const IntegratedMeetRoom: React.FC<IntegratedMeetRoomProps> = ({
  ticket,
  activeRole,
  onLeaveRoom,
  onFinishAndIssueRecommendation,
  onOpenBeritaAcara,
  onSaveLiveNotes
}) => {
  // Device states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  
  // Side panels
  const [activeSidePanel, setActiveSidePanel] = useState<'none' | 'chat' | 'people' | 'notes'>('notes');
  const [copiedCode, setCopiedCode] = useState(false);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(245); // e.g. 04:05 start

  // Video stream
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraStream, setHasCameraStream] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; time: string; text: string; isMe: boolean }>>([
    {
      sender: 'Drs. H. Bambang Suhartono (DPMD)',
      time: '10:02',
      text: 'Selamat pagi Bapak Kades dan Sekdes. Dokumen draf pergeseran sudah kami telaah.',
      isMe: false
    },
    {
      sender: ticket.pemohonNama,
      time: '10:04',
      text: 'Pagi Pak Tenaga Ahli, kami siap memaparkan kendala nomenklatur di sistem Siskeudes.',
      isMe: true
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Notulensi state
  const [rangkuman, setRangkuman] = useState(
    ticket.notulensiKonsultasi?.rangkumanPembahasan || 
    'Fasilitasi tatap muka virtual resmi dibuka. Pemerintah desa memaparkan kondisi mendesak pergeseran anggaran APBDes untuk tanggap darurat bencana.'
  );
  const [masalahPoints, setMasalahPoints] = useState<string[]>(
    ticket.notulensiKonsultasi?.pokokMasalahTeridentifikasi || [
      'Penyelarasan nomenklatur belanja darurat dengan sistem Siskeudes',
      'Kewajiban surat keterangan penetapan tanggap darurat dari Camat'
    ]
  );
  const [newMasalahInput, setNewMasalahInput] = useState('');
  const [isSavedNotes, setIsSavedNotes] = useState(false);

  const meetCode = ticket.googleMeetCode || (ticket.googleMeetLink ? ticket.googleMeetLink.split('/').pop() : 'qvr-tzmh-xwk');
  const meetUrl = ticket.googleMeetLink || `https://meet.google.com/${meetCode}`;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Request actual camera stream if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCamOn && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
          setHasCameraStream(true);
        })
        .catch(() => {
          setHasCameraStream(false);
        });
    } else {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const currentStream = localVideoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
      }
      setHasCameraStream(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCamOn]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setChatMessages(prev => [
      ...prev,
      {
        sender: activeRole === 'desa' ? ticket.pemohonNama : 'Tenaga Ahli PMD',
        time: timeStr,
        text: chatInput.trim(),
        isMe: true
      }
    ]);
    setChatInput('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(meetCode || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveNotes = () => {
    onSaveLiveNotes(ticket.id, {
      rangkuman,
      masalah: masalahPoints,
      aturan: ticket.notulensiKonsultasi?.telaahAturan || ['Permendagri No. 20 Tahun 2018', 'UU No. 3 Tahun 2024']
    });
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  const handleAddMasalah = () => {
    if (!newMasalahInput.trim()) return;
    setMasalahPoints(prev => [...prev, newMasalahInput.trim()]);
    setNewMasalahInput('');
  };

  return (
    <div className="bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col h-[82vh] min-h-[580px] relative font-sans">
      
      {/* Top Meeting Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              LIVE KONSULTASI RESMI
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-bold text-slate-200 truncate">{ticket.namaDesa}</span>
            <span className="text-[11px] text-slate-400 truncate hidden sm:inline">— {ticket.judulKonsultasi}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          {/* Copy Meet Code */}
          <button
            onClick={handleCopyCode}
            className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 transition-colors font-mono"
            title="Salin Kode Rapat"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{meetCode}</span>
          </button>

          {/* Open in external Google Meet */}
          <a
            href={meetUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors"
            title="Buka juga di Tab Browser Google Meet Asli"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Buka meet.google.com</span>
          </a>
        </div>
      </div>

      {/* Main Center Video Area + Optional Side Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Video Grid Area */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center overflow-y-auto">
          
          {/* When screen sharing is active: presentation mode */}
          {isScreenSharing ? (
            <div className="w-full h-full flex flex-col rounded-xl bg-slate-900 border border-slate-800 overflow-hidden p-4 relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  <span>Presentasi Layar: Draf_Raperdes_Penyelarasan_Anggaran.pdf</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  Sedang Ditampilkan ke Seluruh Peserta
                </span>
              </div>
              <div className="flex-1 bg-white text-slate-900 rounded-lg p-6 overflow-y-auto mt-3 shadow-inner text-xs space-y-3 font-serif">
                <div className="text-center border-b pb-3">
                  <h4 className="font-bold uppercase text-sm">PEMERINTAH KABUPATEN CIANJUR</h4>
                  <h5 className="font-bold text-xs uppercase">RANCANGAN PERATURAN DESA SUKAMAJU NOMOR 04 TAHUN 2026</h5>
                  <p className="text-[11px] italic text-slate-600 mt-1">Tentang Pergeseran Belanja Tak Terduga untuk Penanganan Bencana Alam</p>
                </div>
                <div className="space-y-2 text-justify leading-relaxed">
                  <p><strong>Pasal 1:</strong> Dalam hal terjadi keadaan darurat dan/atau keadaan mendesak, Kepala Desa berwenang melakukan pergeseran anggaran dari Belanja Tidak Terduga (BTT)...</p>
                  <p><strong>Pasal 2:</strong> Pergeseran sebagaimana dimaksud pada Pasal 1 dikoordinasikan bersama Badan Permusyawaratan Desa (BPD) dan dilaporkan kepada Bupati melalui Camat paling lambat 7 (tujuh) hari kerja...</p>
                  <p className="bg-amber-50 p-2 rounded border border-amber-200 text-amber-900 font-sans font-semibold text-[11px]">
                    🔍 Catatan Telaah Tenaga Ahli PMD: Rumusan Pasal 2 telah selaras dengan Permendagri No. 20 Tahun 2018 Pasal 69.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Tile Video Grid (4 Participants) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full max-h-[560px]">
              
              {/* Tile 1: Anda (Local Camera Stream or Avatar) */}
              <div className="relative rounded-2xl bg-slate-900 border-2 border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-lg group">
                {isCamOn && hasCameraStream ? (
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-18 h-18 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold border-2 border-emerald-400 shadow-md">
                      {activeRole === 'desa' ? 'DS' : 'TA'}
                    </div>
                    <span className="text-xs font-semibold text-slate-300 mt-2">
                      {activeRole === 'desa' ? ticket.pemohonNama : 'Tenaga Ahli PMD'} (Anda)
                    </span>
                    <span className="text-[10px] text-slate-500">Kamera Dinonaktifkan</span>
                  </div>
                )}

                {/* Local name badge and mic status */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-xs rounded-lg text-[11px] text-slate-200 border border-white/10">
                  <span className="font-semibold truncate max-w-[120px]">{ticket.pemohonNama} (Anda)</span>
                  {isMicOn ? (
                    <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  )}
                </div>

                {isHandRaised && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white p-1.5 rounded-full shadow-md animate-bounce">
                    <Hand className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Tile 2: Narasumber Utama (Dinas PMD) */}
              <div className="relative rounded-2xl bg-slate-900 border-2 border-emerald-500/80 overflow-hidden flex flex-col items-center justify-center shadow-lg ring-2 ring-emerald-500/30">
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-18 h-18 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold border-2 border-blue-400 shadow-md">
                    BS
                  </div>
                  <span className="text-xs font-bold text-slate-200 mt-2">
                    {ticket.tenagaAhliNama || 'Drs. H. Bambang Suhartono, M.Si'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                    Fasilitator Utama • Dinas PMD
                  </span>
                </div>

                {/* Speaking indicator wave */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md text-[10px] font-semibold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Sedang Berbicara</span>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-xs rounded-lg text-[11px] text-slate-200 border border-white/10">
                  <span className="font-semibold">Narasumber OPD</span>
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Tile 3: Rombongan Desa (Kades & Sekdes) */}
              <div className="relative rounded-2xl bg-slate-900 border-2 border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-lg">
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-18 h-18 rounded-full bg-teal-700 text-white flex items-center justify-center text-xl font-bold border-2 border-teal-500 shadow-md">
                    KD
                  </div>
                  <span className="text-xs font-bold text-slate-200 mt-2">
                    H. Ahmad Sobari & Tim Desa
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Kepala Desa & Bendahara {ticket.namaDesa}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-xs rounded-lg text-[11px] text-slate-200 border border-white/10">
                  <span className="font-semibold">Pemerintah Desa</span>
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Tile 4: Badan Permusyawaratan Desa (BPD) */}
              <div className="relative rounded-2xl bg-slate-900 border-2 border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-lg">
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-18 h-18 rounded-full bg-purple-700 text-white flex items-center justify-center text-xl font-bold border-2 border-purple-500 shadow-md">
                    BP
                  </div>
                  <span className="text-xs font-bold text-slate-200 mt-2">
                    Ir. Rahmat Hidayat
                  </span>
                  <span className="text-[10px] text-purple-300 font-semibold mt-0.5">
                    Ketua BPD {ticket.namaDesa}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-xs rounded-lg text-[11px] text-slate-200 border border-white/10">
                  <span className="font-semibold">BPD Desa</span>
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Side Panel (Chat / Notes / People) */}
        {activeSidePanel !== 'none' && (
          <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-20">
            
            {/* Panel Tabs */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveSidePanel('notes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSidePanel === 'notes' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Notulensi
                </button>
                <button
                  onClick={() => setActiveSidePanel('chat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSidePanel === 'chat' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Obrolan ({chatMessages.length})
                </button>
                <button
                  onClick={() => setActiveSidePanel('people')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSidePanel === 'people' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Peserta (4)
                </button>
              </div>

              <button
                onClick={() => setActiveSidePanel('none')}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* TAB: NOTULENSI LANGSUNG */}
            {activeSidePanel === 'notes' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Catatan Notulensi Sesi</span>
                  {isSavedNotes && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                      Tersimpan!
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                    Rangkuman Pembahasan Langsung:
                  </label>
                  <textarea
                    rows={4}
                    value={rangkuman}
                    onChange={(e) => setRangkuman(e.target.value)}
                    className="w-full text-xs rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                    Pokok Masalah Teridentifikasi ({masalahPoints.length}):
                  </label>
                  <div className="space-y-1 mb-2">
                    {masalahPoints.map((m, idx) => (
                      <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
                        <span>• {m}</span>
                        <button
                          onClick={() => setMasalahPoints(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300 text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newMasalahInput}
                      onChange={(e) => setNewMasalahInput(e.target.value)}
                      placeholder="Tambah poin..."
                      className="flex-1 text-[11px] rounded-lg bg-slate-950 border border-slate-700 p-1.5 text-slate-200"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddMasalah()}
                    />
                    <button
                      onClick={handleAddMasalah}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs"
                  >
                    Simpan Catatan Sesi
                  </button>
                </div>
              </div>
            )}

            {/* TAB: OBROLAN / CHAT */}
            {activeSidePanel === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2.5 rounded-xl border max-w-[88%] ${
                        msg.isMe 
                          ? 'ml-auto bg-emerald-900/50 border-emerald-700 text-emerald-100' 
                          : 'bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-slate-400 font-semibold">
                        <span className="truncate">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Tulis pesan obrolan..."
                    className="flex-1 text-xs rounded-xl bg-slate-950 border border-slate-700 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: PESERTA */}
            {activeSidePanel === 'people' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                <span className="font-bold text-slate-200 block mb-2">Daftar Aparatur & Narasumber Hadir:</span>
                
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{ticket.pemohonNama} (Anda)</div>
                    <div className="text-[10px] text-slate-400">{ticket.pemohonJabatan} • {ticket.namaDesa}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Hadir</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{ticket.tenagaAhliNama || 'Drs. H. Bambang Suhartono, M.Si'}</div>
                    <div className="text-[10px] text-slate-400">Narasumber Utama • Dinas PMD</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Hadir</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">H. Ahmad Sobari</div>
                    <div className="text-[10px] text-slate-400">Kepala Desa {ticket.namaDesa}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Hadir</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">Ir. Rahmat Hidayat</div>
                    <div className="text-[10px] text-slate-400">Ketua BPD {ticket.namaDesa}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Hadir</span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Bottom Floating Control Bar (Styled exactly like Google Meet) */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-between z-20">
        
        {/* Left Info */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-200 font-bold">{meetCode}</span>
          <span>•</span>
          <span className="text-emerald-400">Terkoneksi</span>
        </div>

        {/* Center Media Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mx-auto">
          {/* Mic */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-full transition-all ${
              isMicOn 
                ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
            }`}
            title={isMicOn ? 'Matikan Mikrofon' : 'Nyalakan Mikrofon'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera */}
          <button
            onClick={() => setIsCamOn(!isCamOn)}
            className={`p-3 rounded-full transition-all ${
              isCamOn 
                ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
            }`}
            title={isCamOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}
          >
            {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-full transition-all ${
              isScreenSharing 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isScreenSharing ? 'Hentikan Presentasi' : 'Bagikan Layar Dokumen Desa'}
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* Hand Raise */}
          <button
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`p-3 rounded-full transition-all ${
              isHandRaised 
                ? 'bg-amber-500 text-white shadow-lg' 
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title="Angkat Tangan Bicara"
          >
            <Hand className="w-5 h-5" />
          </button>

          {/* End Call / Finish */}
          <button
            onClick={() => {
              if (window.confirm('Akhiri sesi tatap muka dan terbitkan Lembar Rekomendasi Resmi?')) {
                onFinishAndIssueRecommendation(ticket);
              }
            }}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all hover:scale-105"
            title="Selesaikan Konsultasi & Terbitkan Hasil"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Selesai & Rekomendasi</span>
          </button>
        </div>

        {/* Right Toggle Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'notes' ? 'none' : 'notes')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
              activeSidePanel === 'notes' 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Buka Lembar Notulensi"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden lg:inline">Notulensi</span>
          </button>

          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? 'none' : 'chat')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
              activeSidePanel === 'chat' 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Buka Obrolan"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'people' ? 'none' : 'people')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
              activeSidePanel === 'people' 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Daftar Peserta"
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={onLeaveRoom}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs ml-1"
            title="Keluar dari Tampilan Rapat"
          >
            Tutup
          </button>
        </div>

      </div>

    </div>
  );
};
