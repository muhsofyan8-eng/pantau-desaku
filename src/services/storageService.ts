import { 
  ConsultationTicket, 
  ExpertProfile, 
  RepositoryDocument, 
  ActivityLog, 
  UserRole,
  RecommendationItem
} from '../types/clinic';
import { 
  INITIAL_CONSULTATIONS, 
  INITIAL_EXPERTS, 
  INITIAL_DOCUMENTS, 
  INITIAL_LOGS 
} from '../data/initialData';

const STORAGE_KEYS = {
  CONSULTATIONS: 'klinikdesa_consultations_v1',
  EXPERTS: 'klinikdesa_experts_v1',
  DOCUMENTS: 'klinikdesa_documents_v1',
  LOGS: 'klinikdesa_logs_v1',
  ACTIVE_ROLE: 'klinikdesa_user_role_v1'
};

export const getStoredConsultations = (): ConsultationTicket[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(INITIAL_CONSULTATIONS));
      return INITIAL_CONSULTATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CONSULTATIONS;
  }
};

export const saveStoredConsultations = (items: ConsultationTicket[]) => {
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('klinikdesa_data_changed'));
};

export const getStoredExperts = (): ExpertProfile[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPERTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.EXPERTS, JSON.stringify(INITIAL_EXPERTS));
      return INITIAL_EXPERTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_EXPERTS;
  }
};

export const saveStoredExperts = (items: ExpertProfile[]) => {
  localStorage.setItem(STORAGE_KEYS.EXPERTS, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('klinikdesa_data_changed'));
};

export const getStoredDocuments = (): RepositoryDocument[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_DOCUMENTS;
  }
};

export const saveStoredDocuments = (items: RepositoryDocument[]) => {
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('klinikdesa_data_changed'));
};

export const getStoredLogs = (): ActivityLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_LOGS;
  }
};

export const addActivityLog = (user: string, role: string, activity: string, targetId?: string) => {
  const currentLogs = getStoredLogs();
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
  
  const newLog: ActivityLog = {
    id: 'log-' + Date.now(),
    waktu: dateStr,
    pengguna: user,
    peran: role,
    aktivitas: activity,
    targetId
  };
  
  const updated = [newLog, ...currentLogs.slice(0, 49)];
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('klinikdesa_data_changed'));
};

export const getActiveRole = (): UserRole => {
  try {
    const role = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as UserRole;
    return role || 'desa';
  } catch {
    return 'desa';
  }
};

export const setActiveRole = (role: UserRole) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  window.dispatchEvent(new CustomEvent('klinikdesa_role_changed', { detail: role }));
};

// Generate realistic Google Meet link code
export const generateGoogleMeetCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part1}-${part2}-${part3}`;
};

// Normalize Google Meet code from URL or raw text
export const normalizeGoogleMeetCode = (input: string): { code: string; url: string } => {
  if (!input || !input.trim()) {
    const fresh = generateGoogleMeetCode();
    return { code: fresh, url: `https://meet.google.com/${fresh}` };
  }

  const clean = input.trim().replace(/^https?:\/\//i, '').replace(/^meet\.google\.com\//i, '').split('?')[0].trim();
  const lettersOnly = clean.replace(/[^a-zA-Z]/g, '').toLowerCase();

  let formattedCode = clean.toLowerCase();
  if (lettersOnly.length === 10) {
    formattedCode = `${lettersOnly.slice(0, 3)}-${lettersOnly.slice(3, 7)}-${lettersOnly.slice(7, 10)}`;
  }

  return {
    code: formattedCode,
    url: `https://meet.google.com/${formattedCode}`
  };
};

// Format official WhatsApp invitation message
export const generateWhatsAppInvitation = (ticket: ConsultationTicket): string => {
  const code = ticket.googleMeetCode || (ticket.googleMeetLink ? ticket.googleMeetLink.split('/').pop() : 'klinik-desa');
  const meetLink = ticket.googleMeetLink || `https://meet.google.com/${code}`;
  const jam = ticket.waktuMulai ? `${ticket.waktuMulai} - ${ticket.waktuSelesai || '11:15'} WIB` : 'Menyesuaikan Jadwal';
  const tgl = ticket.tanggalKonsultasi || ticket.tanggalPengajuan;

  return `*UNDANGAN KONSULTASI ONLINE KLINIK DESA*
No. Registrasi: ${ticket.nomorRegistrasi}

Yth. Bapak/Ibu Aparatur ${ticket.namaDesa} & Tim Narasumber OPD,

Berikut adalah jadwal dan akses ruang tatap muka Google Meet resmi:

🏛️ *Desa/Kelurahan:* ${ticket.namaDesa} (${ticket.kecamatan})
📅 *Hari/Tanggal:* ${tgl}
⏰ *Waktu:* ${jam}
📋 *Agenda/Masalah:* ${ticket.judulKonsultasi}
👨‍💼 *Narasumber OPD:* ${ticket.tenagaAhliNama || 'Tim Fasilitator Dinas PMD'}

🎥 *Tautan Google Meet Langsung:*
${meetLink}

🔑 *Kode Rapat (Meet Code):*
*${code}*

_Panduan Peserta:_
1. Klik tautan di atas atau buka Google Meet lalu masukkan kode rapat: *${code}*
2. Dimohon hadir 10 menit sebelum jadwal konsultasi dimulai.
3. Siapkan dokumen APBDes / Draf Perdes / SPJ terkait untuk pembahasan.
4. Lembar Rekomendasi Resmi & Berita Acara akan langsung diterbitkan setelah sesi selesai.

Terima kasih.
— *Sekretariat Layanan Klinik Desa Online*`;
};

// Reset app data
export const resetToInitialData = () => {
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(INITIAL_CONSULTATIONS));
  localStorage.setItem(STORAGE_KEYS.EXPERTS, JSON.stringify(INITIAL_EXPERTS));
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
  window.dispatchEvent(new CustomEvent('klinikdesa_data_changed'));
};

// Calculate progress for a consultation
export const calculateFollowUpProgress = (recommendations?: RecommendationItem[]): number => {
  if (!recommendations || recommendations.length === 0) return 0;
  const completed = recommendations.filter(r => r.status === 'tuntas').length;
  const inProgress = recommendations.filter(r => r.status === 'dalam_proses' || r.status === 'menunggu_verifikasi').length;
  
  // Completed = 100%, in progress = 50%
  const score = (completed * 100) + (inProgress * 50);
  return Math.round(score / recommendations.length);
};
