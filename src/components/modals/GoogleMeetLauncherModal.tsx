import React, { useState } from 'react';
import { 
  X, 
  Video, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Copy, 
  AlertCircle, 
  HelpCircle, 
  Share2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ConsultationTicket } from '../../types/clinic';
import { normalizeGoogleMeetCode, generateWhatsAppInvitation } from '../../services/storageService';

interface GoogleMeetLauncherModalProps {
  ticket: ConsultationTicket;
  isOpen: boolean;
  onClose: () => void;
  onUpdateMeetCode: (ticketId: string, newCode: string, newLink: string) => void;
  onLaunchEmbeddedRoom?: (ticket: ConsultationTicket) => void;
}

export const GoogleMeetLauncherModal: React.FC<GoogleMeetLauncherModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdateMeetCode,
  onLaunchEmbeddedRoom
}) => {
  const currentCode = ticket.googleMeetCode || (ticket.googleMeetLink ? ticket.googleMeetLink.split('/').pop() : 'klinik-desa');
  const currentLink = ticket.googleMeetLink || `https://meet.google.com/${currentCode}`;

  const [inputUrlOrCode, setInputUrlOrCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!isOpen) return null;

  const handleOpenGoogleNew = () => {
    window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer');
  };

  const handleSaveAndJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrlOrCode.trim()) {
      // Just join current link
      window.open(currentLink, '_blank', 'noopener,noreferrer');
      onClose();
      return;
    }

    const normalized = normalizeGoogleMeetCode(inputUrlOrCode);
    onUpdateMeetCode(ticket.id, normalized.code, normalized.url);
    setSaveSuccess(true);
    setTimeout(() => {
      window.open(normalized.url, '_blank', 'noopener,noreferrer');
      onClose();
    }, 400);
  };

  const handleDirectLaunchCurrent = () => {
    window.open(currentLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppInvitation(ticket);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Masuk Ruang Google Meet Konsultasi</h3>
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
        <div className="p-6 space-y-4">
          
          {/* Important Google Meet Explainer Banner */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Penting: Mengatasi Pesan "Periksa Kode Rapat" Google</span>
              </span>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-[11px] font-semibold text-amber-800 underline"
              >
                {showExplanation ? 'Sembunyikan' : 'Pelajari'}
              </button>
            </div>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              Google Meet <strong>hanya mengizinkan masuk</strong> jika ruang rapat dibuat melalui akun Google resmi (Gmail / Google Workspace). Jika Anda melihat pesan <em>"Periksa kode rapat. Pastikan Anda memasukkan kode rapat yang benar di URL"</em>, buat rapat baru di Google lalu tempelkan kodenya di bawah.
            </p>
          </div>

          {/* Current Meeting Info */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Tautan Google Meet Tersimpan:</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {currentCode}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentLink}
                className="flex-1 text-xs font-mono bg-white text-slate-800 rounded-lg border border-slate-300 p-2 font-medium truncate"
              />
              <button
                onClick={handleCopy}
                className="px-2.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1 shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Option 1: Buat Rapat Asli di Google & Tempelkan */}
          <form onSubmit={handleSaveAndJoin} className="space-y-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Buat atau Masukkan Ruang Rapat Asli</span>
              </label>
              <button
                type="button"
                onClick={handleOpenGoogleNew}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                <span>1. Buka Google Meet Baru</span>
              </button>
            </div>

            <p className="text-[11px] text-emerald-800">
              Langkah: Klik tombol di atas untuk membuka tab Google Meet baru → salin tautannya → tempelkan pada kolom di bawah:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputUrlOrCode}
                onChange={(e) => setInputUrlOrCode(e.target.value)}
                placeholder="2. Tempel tautan asli (contoh: https://meet.google.com/xxx-yyyy-zzz)"
                className="flex-1 text-xs font-mono rounded-lg border border-emerald-300 p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shrink-0 shadow-xs"
              >
                3. Simpan & Masuk
              </button>
            </div>
          </form>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors w-full sm:w-auto justify-center"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bagikan Undangan ke WA</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleDirectLaunchCurrent}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <span>Buka Link Tersimpan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
