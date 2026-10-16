import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { DaftarKonsultasiView } from './components/views/DaftarKonsultasiView';
import { JadwalKlinikView } from './components/views/JadwalKlinikView';
import { GoogleMeetRoomView } from './components/views/GoogleMeetRoomView';
import { TenagaAhliView } from './components/views/TenagaAhliView';
import { KonsultasiView } from './components/views/KonsultasiView';
import { RekomendasiView } from './components/views/RekomendasiView';
import { MonitoringView } from './components/views/MonitoringView';
import { DokumenView } from './components/views/DokumenView';
import { LaporanView } from './components/views/LaporanView';
import { AdminView } from './components/views/AdminView';

import { VerifikasiJadwalModal } from './components/modals/VerifikasiJadwalModal';
import { BeritaAcaraModal } from './components/modals/BeritaAcaraModal';
import { TindakLanjutModal } from './components/modals/TindakLanjutModal';
import { GoogleMeetLauncherModal } from './components/modals/GoogleMeetLauncherModal';

import { 
  ConsultationTicket, 
  ExpertProfile, 
  RepositoryDocument, 
  ActivityLog, 
  UserRole,
  RecommendationItem 
} from './types/clinic';

import { 
  getStoredConsultations, 
  saveStoredConsultations, 
  getStoredExperts, 
  saveStoredExperts, 
  getStoredDocuments, 
  saveStoredDocuments, 
  getStoredLogs, 
  addActivityLog, 
  getActiveRole, 
  setActiveRole, 
  resetToInitialData,
  calculateFollowUpProgress
} from './services/storageService';

import { Menu, X, CheckCircle, Bell } from 'lucide-react';

export default function App() {
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [activeRole, setActiveRoleState] = useState<UserRole>('desa');
  const [consultations, setConsultations] = useState<ConsultationTicket[]>([]);
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [documents, setDocuments] = useState<RepositoryDocument[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [scheduleModalTicket, setScheduleModalTicket] = useState<ConsultationTicket | null>(null);
  const [beritaAcaraModalTicket, setBeritaAcaraModalTicket] = useState<ConsultationTicket | null>(null);
  const [tindakLanjutModalTicket, setTindakLanjutModalTicket] = useState<ConsultationTicket | null>(null);
  const [selectedTicketForMeet, setSelectedTicketForMeet] = useState<ConsultationTicket | null>(null);
  const [launcherModalTicket, setLauncherModalTicket] = useState<ConsultationTicket | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load initial data
  const loadData = () => {
    setConsultations(getStoredConsultations());
    setExperts(getStoredExperts());
    setDocuments(getStoredDocuments());
    setLogs(getStoredLogs());
    setActiveRoleState(getActiveRole());
  };

  useEffect(() => {
    loadData();

    const handleDataChanged = () => {
      loadData();
    };

    const handleRoleChanged = (e: any) => {
      setActiveRoleState(e.detail);
    };

    window.addEventListener('klinikdesa_data_changed', handleDataChanged);
    window.addEventListener('klinikdesa_role_changed', handleRoleChanged);

    return () => {
      window.removeEventListener('klinikdesa_data_changed', handleDataChanged);
      window.removeEventListener('klinikdesa_role_changed', handleRoleChanged);
    };
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setActiveRoleState(role);
    showToast(`Beralih ke peran: ${role === 'desa' ? 'Pemerintah Desa' : role === 'narasumber' ? 'Tenaga Ahli OPD' : 'Admin PMD'}`);
  };

  // Add new consultation
  const handleAddConsultation = (newTicket: ConsultationTicket) => {
    const updated = [newTicket, ...consultations];
    saveStoredConsultations(updated);
    addActivityLog(
      newTicket.pemohonNama,
      'Aparatur Desa',
      `Mendaftarkan permohonan konsultasi baru: "${newTicket.judulKonsultasi}" (${newTicket.namaDesa})`,
      newTicket.id
    );
    showToast(`Pengajuan konsultasi Desa ${newTicket.namaDesa} berhasil dicatat.`);
  };

  // Schedule consultation (from VerifikasiJadwalModal)
  const handleSaveSchedule = (
    ticketId: string, 
    data: {
      tanggal: string;
      waktuMulai: string;
      waktuSelesai: string;
      tenagaAhliId: string;
      googleMeetCode: string;
      googleMeetLink: string;
    }
  ) => {
    const expert = experts.find(e => e.id === data.tenagaAhliId);
    const updated = consultations.map(c => {
      if (c.id === ticketId) {
        return {
          ...c,
          status: 'terjadwal' as const,
          tanggalKonsultasi: data.tanggal,
          waktuMulai: data.waktuMulai,
          waktuSelesai: data.waktuSelesai,
          tenagaAhliId: data.tenagaAhliId,
          tenagaAhliNama: expert?.nama || 'Fasilitator Dinas PMD',
          tenagaAhliInstansi: expert?.instansi || 'DPMD',
          googleMeetCode: data.googleMeetCode,
          googleMeetLink: data.googleMeetLink
        };
      }
      return c;
    });

    saveStoredConsultations(updated);
    addActivityLog(
      'Admin Klinik Desa',
      'Administrator PMD',
      `Menetapkan jadwal Google Meet untuk ${data.tanggal} pukul ${data.waktuMulai} WIB bersama ${expert?.nama}`,
      ticketId
    );
    showToast('Jadwal konsultasi dan tautan Google Meet berhasil ditetapkan.');
  };

  // Update or customize Google Meet code for a ticket
  const handleUpdateMeetCode = (ticketId: string, newCode: string, newLink: string) => {
    const updated = consultations.map(c => {
      if (c.id === ticketId) {
        return {
          ...c,
          googleMeetCode: newCode,
          googleMeetLink: newLink
        };
      }
      return c;
    });

    saveStoredConsultations(updated);
    addActivityLog(
      activeRole === 'desa' ? 'Pemerintah Desa' : 'Admin Klinik Desa',
      activeRole,
      `Memperbarui kode Google Meet menjadi ${newCode}`,
      ticketId
    );
    showToast(`Kode Google Meet berhasil diperbarui: ${newCode}`);
  };

  // Save live notes from Google Meet room
  const handleSaveLiveNotes = (
    ticketId: string, 
    notes: { rangkuman: string; masalah: string[]; aturan: string[] }
  ) => {
    const updated = consultations.map(c => {
      if (c.id === ticketId) {
        return {
          ...c,
          notulensiKonsultasi: {
            ...c.notulensiKonsultasi,
            rangkumanPembahasan: notes.rangkuman,
            pokokMasalahTeridentifikasi: notes.masalah,
            telaahAturan: notes.aturan
          }
        };
      }
      return c;
    });

    saveStoredConsultations(updated);
    addActivityLog(
      activeRole === 'desa' ? 'Pemerintah Desa' : 'Tenaga Ahli OPD',
      activeRole,
      `Memperbarui catatan notulensi hasil pembahasan Google Meet`,
      ticketId
    );
    showToast('Notulensi Google Meet tersimpan ke sistem.');
  };

  // Finish session and issue official recommendations
  const handleFinishAndIssueRecommendation = (ticket: ConsultationTicket) => {
    const baNumber = ticket.nomorBeritaAcara || `BA-KD/PMD/2026/X/${Math.floor(10 + Math.random() * 89)}`;
    const defaultRecs: RecommendationItem[] = ticket.rekomendasi && ticket.rekomendasi.length > 0 
      ? ticket.rekomendasi 
      : [
        {
          id: 'rec-' + Date.now() + '-1',
          poinRekomendasi: `Lakukan perbaikan administrasi dan harmonisasi dokumen sesuai arahan dalam sesi Meet`,
          dasarHukum: 'Permendagri No. 20 Tahun 2018',
          targetWaktu: '14 Hari Kerja',
          penanggungJawab: `${ticket.pemohonJabatan} ${ticket.namaDesa}`,
          status: 'dalam_proses',
          catatanTindakLanjut: 'Rekomendasi resmi baru diterbitkan oleh narasumber OPD'
        }
      ];

    const updated = consultations.map(c => {
      if (c.id === ticket.id) {
        return {
          ...c,
          status: 'tindak_lanjut' as const,
          nomorBeritaAcara: baNumber,
          tanggalTerbitRekomendasi: new Date().toISOString().substring(0, 10),
          rekomendasi: defaultRecs,
          progressTindakLanjut: calculateFollowUpProgress(defaultRecs)
        };
      }
      return c;
    });

    saveStoredConsultations(updated);
    addActivityLog(
      ticket.tenagaAhliNama || 'Tenaga Ahli OPD',
      'Narasumber OPD',
      `Menuntaskan sesi konsultasi daring dan menerbitkan Lembar Rekomendasi Resmi (${baNumber})`,
      ticket.id
    );

    const updatedTicket = updated.find(c => c.id === ticket.id);
    if (updatedTicket) {
      setBeritaAcaraModalTicket(updatedTicket);
    }
    showToast(`Sesi selesai! Berita Acara Rekomendasi Resmi (${baNumber}) telah diterbitkan.`);
  };

  // Update recommendations from modal
  const handleUpdateRecommendations = (ticketId: string, updatedRecs: RecommendationItem[]) => {
    const progress = calculateFollowUpProgress(updatedRecs);
    const isAllDone = progress === 100;

    const updated = consultations.map(c => {
      if (c.id === ticketId) {
        return {
          ...c,
          rekomendasi: updatedRecs,
          progressTindakLanjut: progress,
          status: isAllDone ? ('selesai' as const) : ('tindak_lanjut' as const)
        };
      }
      return c;
    });

    saveStoredConsultations(updated);
    addActivityLog(
      activeRole === 'desa' ? 'Pemerintah Desa' : 'Tenaga Ahli PMD',
      activeRole,
      `Memperbarui bukti dukung & progres tindak lanjut (${progress}% tercapai)`,
      ticketId
    );
    showToast(`Progres tindak lanjut diperbarui: ${progress}% tercapai.`);
  };

  // Add individual recommendation item
  const handleAddRecommendationItem = (ticketId: string, item: RecommendationItem) => {
    const ticket = consultations.find(c => c.id === ticketId);
    if (!ticket) return;

    const currentRecs = ticket.rekomendasi || [];
    const updatedRecs = [...currentRecs, item];
    const progress = calculateFollowUpProgress(updatedRecs);

    const updated = consultations.map(c => {
      if (c.id === ticketId) {
        return {
          ...c,
          rekomendasi: updatedRecs,
          progressTindakLanjut: progress,
          status: 'tindak_lanjut' as const
        };
      }
      return c;
    });

    saveStoredConsultations(updated);
    addActivityLog(
      'Narasumber OPD',
      'Tenaga Ahli',
      `Menambahkan poin arahan solusi baru untuk ${ticket.namaDesa}`,
      ticketId
    );
    showToast('Poin rekomendasi baru berhasil ditambahkan.');
  };

  // Add document to repository
  const handleAddDocument = (newDoc: RepositoryDocument) => {
    const updated = [newDoc, ...documents];
    saveStoredDocuments(updated);
    addActivityLog(
      'Administrator PMD',
      activeRole,
      `Mengunggah dokumen baru ke repositori: "${newDoc.judul}"`,
      newDoc.id
    );
    showToast(`Dokumen "${newDoc.judul}" berhasil diunggah ke repositori.`);
  };

  // Increment document download count
  const handleIncrementDownload = (docId: string) => {
    const updated = documents.map(d => {
      if (d.id === docId) {
        return { ...d, unduhanCount: d.unduhanCount + 1 };
      }
      return d;
    });
    saveStoredDocuments(updated);
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang seluruh data Klinik Desa ke setelan awal?')) {
      resetToInitialData();
      showToast('Data demo berhasil direset ke kondisi awal.');
    }
  };

  // Open Google Meet Room with a specific ticket
  const handleSelectTicketForMeet = (ticket: ConsultationTicket) => {
    setSelectedTicketForMeet(ticket);
    setLauncherModalTicket(ticket);
    setActiveMenu('google_meet');
  };

  // Counts for sidebar badges
  const pendingCount = consultations.filter(c => c.status === 'menunggu_verifikasi').length;
  const scheduledCount = consultations.filter(c => c.status === 'terjadwal').length;
  const ongoingCount = consultations.filter(c => c.status === 'berlangsung').length;
  const followUpCount = consultations.filter(c => c.status === 'tindak_lanjut').length;
  const todaySessionsCount = consultations.filter(c => c.tanggalKonsultasi === '2026-10-04' || c.status === 'berlangsung').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        onNavigate={(menu) => setActiveMenu(menu)}
        todaySessionCount={todaySessionsCount}
      />

      {/* Mobile Top Bar with Toggle Button */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
        >
          <Menu className="w-4 h-4" />
          <span>Menu Navigasi</span>
        </button>

        <span className="text-xs font-extrabold text-emerald-800">
          {activeMenu.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* App Body: Sidebar + Main Content View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          activeMenu={activeMenu}
          onSelectMenu={(menuId) => setActiveMenu(menuId)}
          counts={{
            pendingCount,
            scheduledCount,
            ongoingCount,
            followUpCount
          }}
          activeRole={activeRole}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeMenu === 'dashboard' && (
            <DashboardView
              consultations={consultations}
              activeRole={activeRole}
              onNavigate={(menu) => setActiveMenu(menu)}
              onSelectTicketForMeet={handleSelectTicketForMeet}
              onOpenBeritaAcara={(ticket) => setBeritaAcaraModalTicket(ticket)}
              onOpenScheduleModal={(ticket) => setScheduleModalTicket(ticket)}
            />
          )}

          {activeMenu === 'daftar_konsultasi' && (
            <DaftarKonsultasiView
              consultations={consultations}
              activeRole={activeRole}
              onAddConsultation={handleAddConsultation}
              onSelectTicketForMeet={handleSelectTicketForMeet}
              onOpenBeritaAcara={(ticket) => setBeritaAcaraModalTicket(ticket)}
              onOpenScheduleModal={(ticket) => setScheduleModalTicket(ticket)}
            />
          )}

          {activeMenu === 'jadwal_klinik' && (
            <JadwalKlinikView
              consultations={consultations}
              activeRole={activeRole}
              onSelectTicketForMeet={handleSelectTicketForMeet}
              onOpenScheduleModal={(ticket) => setScheduleModalTicket(ticket)}
              onOpenBeritaAcara={(ticket) => setBeritaAcaraModalTicket(ticket)}
            />
          )}

          {activeMenu === 'google_meet' && (
            <GoogleMeetRoomView
              consultations={consultations}
              selectedTicket={selectedTicketForMeet}
              onSelectTicket={(ticket) => setSelectedTicketForMeet(ticket)}
              activeRole={activeRole}
              onSaveLiveNotes={handleSaveLiveNotes}
              onUpdateMeetCode={handleUpdateMeetCode}
              onOpenLauncherModal={(ticket) => setLauncherModalTicket(ticket)}
              onFinishAndIssueRecommendation={handleFinishAndIssueRecommendation}
              onOpenBeritaAcara={(ticket) => setBeritaAcaraModalTicket(ticket)}
            />
          )}

          {activeMenu === 'tenaga_ahli' && (
            <TenagaAhliView
              experts={experts}
              activeRole={activeRole}
              onRequestConsultationWithExpert={(expert) => {
                setActiveMenu('daftar_konsultasi');
                showToast(`Narasumber ${expert.nama} dipilih. Silakan isi form usulan desa.`);
              }}
            />
          )}

          {activeMenu === 'konsultasi' && (
            <KonsultasiView
              consultations={consultations}
              activeRole={activeRole}
              onOpenBeritaAcara={(ticket) => setBeritaAcaraModalTicket(ticket)}
              onSelectTicketForMeet={handleSelectTicketForMeet}
            />
          )}

          {activeMenu === 'rekomendasi' && (
            <RekomendasiView
              consultations={consultations}
              activeRole={activeRole}
              onOpenBeritaAcara={(ticket) => setBeritaAcaraModalTicket(ticket)}
              onOpenTindakLanjutModal={(ticket) => setTindakLanjutModalTicket(ticket)}
              onAddRecommendationItem={handleAddRecommendationItem}
            />
          )}

          {activeMenu === 'monitoring' && (
            <MonitoringView
              consultations={consultations}
              activeRole={activeRole}
              onOpenTindakLanjutModal={(ticket) => setTindakLanjutModalTicket(ticket)}
              onOpenBeritaAcara={(ticket) => setBeritaAcaraModalTicket(ticket)}
            />
          )}

          {activeMenu === 'dokumen' && (
            <DokumenView
              documents={documents}
              activeRole={activeRole}
              onAddDocument={handleAddDocument}
              onIncrementDownload={handleIncrementDownload}
            />
          )}

          {activeMenu === 'laporan' && (
            <LaporanView
              consultations={consultations}
            />
          )}

          {activeMenu === 'admin' && (
            <AdminView
              activeRole={activeRole}
              onRoleChange={handleRoleChange}
              logs={logs}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {scheduleModalTicket && (
        <VerifikasiJadwalModal
          ticket={scheduleModalTicket}
          experts={experts}
          isOpen={!!scheduleModalTicket}
          onClose={() => setScheduleModalTicket(null)}
          onSaveSchedule={handleSaveSchedule}
        />
      )}

      {beritaAcaraModalTicket && (
        <BeritaAcaraModal
          ticket={beritaAcaraModalTicket}
          isOpen={!!beritaAcaraModalTicket}
          onClose={() => setBeritaAcaraModalTicket(null)}
        />
      )}

      {tindakLanjutModalTicket && (
        <TindakLanjutModal
          ticket={tindakLanjutModalTicket}
          isOpen={!!tindakLanjutModalTicket}
          onClose={() => setTindakLanjutModalTicket(null)}
          onUpdateRecommendations={handleUpdateRecommendations}
        />
      )}

      {launcherModalTicket && (
        <GoogleMeetLauncherModal
          ticket={launcherModalTicket}
          isOpen={!!launcherModalTicket}
          onClose={() => setLauncherModalTicket(null)}
          onUpdateMeetCode={handleUpdateMeetCode}
        />
      )}
    </div>
  );
}
