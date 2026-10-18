import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Clock, 
  Layers, 
  Activity, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Building2, 
  UserCheck, 
  FileText 
} from 'lucide-react';
import { UserRole, ActivityLog } from '../../types/clinic';
import { CATEGORY_LABELS } from '../../data/initialData';

interface AdminViewProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  logs: ActivityLog[];
  onResetData: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  activeRole,
  onRoleChange,
  logs,
  onResetData
}) => {
  // Config state
  const [maxSessionsPerDay, setMaxSessionsPerDay] = useState(6);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(60);
  const [allowDirectMeet, setAllowDirectMeet] = useState(true);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>Pengaturan Administrasi Klinik Desa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi sistem, pengaturan hak akses pengguna, kuota slot Google Meet, dan log audit operasional.
          </p>
        </div>
      </div>

      {/* Section 1: Role Switcher & Access Control */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>I. Manajemen Hak Akses Pengguna (Simulasi Role)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Role: Desa */}
          <div 
            onClick={() => onRoleChange('desa')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeRole === 'desa' 
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-300' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                DS
              </div>
              {activeRole === 'desa' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Aktif
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900">Aparatur Desa / Kelurahan</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Dapat mengajukan konsultasi, mengunggah dokumen APBDes/Perdes, menghadiri Google Meet, dan mengirim bukti tindak lanjut.
            </p>
          </div>

          {/* Role: Tim Bidang Dinas PMD */}
          <div 
            onClick={() => onRoleChange('narasumber')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeRole === 'narasumber' 
                ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-300' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                BD
              </div>
              {activeRole === 'narasumber' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  Aktif
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900">Tim 5 Bidang Dinas PMD</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Menerima agenda konsultasi Google Meet sesuai bidang keahlian, mencatat notulensi telaah hukum, dan merumuskan lembar rekomendasi resmi.
            </p>
          </div>

          {/* Role: Admin */}
          <div 
            onClick={() => onRoleChange('admin')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeRole === 'admin' 
                ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-300' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                AD
              </div>
              {activeRole === 'admin' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                  Aktif
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900">Administrator Dinas PMD</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Memverifikasi kelengkapan usulan desa, menetapkan jadwal & narasumber, membuat link Google Meet, dan mengelola arsip.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Slot & Google Meet Rules */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>II. Konfigurasi Jadwal & Kuota Sesi Daring</span>
        </h3>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maksimal Sesi Google Meet / Hari
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={maxSessionsPerDay}
                onChange={(e) => setMaxSessionsPerDay(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Durasi Standar Konsultasi (Menit)
              </label>
              <input
                type="number"
                min={30}
                max={180}
                step={15}
                value={sessionDurationMinutes}
                onChange={(e) => setSessionDurationMinutes(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tautan Google Meet
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="directMeetCheck"
                  checked={allowDirectMeet}
                  onChange={(e) => setAllowDirectMeet(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="directMeetCheck" className="text-xs text-slate-700 font-medium">
                  Buat kode otomatis saat diverifikasi
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSavedFeedback && (
              <span className="text-xs font-semibold text-emerald-700">
                Pengaturan berhasil disimpan.
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Simpan Konfigurasi
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Bidang Konsultasi Aktif */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>III. Bidang Pembinaan & Fasilitasi Desa Aktif</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(CATEGORY_LABELS).map(([key, item]) => (
            <div key={key} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">{item.label}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Aktif
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Log Audit Operasional Sistem */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>IV. Riwayat Log Aktivitas Sistem (Audit Trail)</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Terakhir {logs.length} catatan aktivitas
          </span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-bold text-slate-800">{log.pengguna}</span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({log.peran})</span>
                <p className="text-slate-600 text-[11px] mt-0.5">{log.aktivitas}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {log.waktu}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Data Reset */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Reset Data Demo ke Kondisi Awal</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Kembalikan seluruh data konsultasi, profil 5 bidang PMD, dokumen regulasi, dan notulensi ke kondisi standar.
          </p>
        </div>

        <button
          onClick={onResetData}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Data Awal</span>
        </button>
      </div>
    </div>
  );
};
