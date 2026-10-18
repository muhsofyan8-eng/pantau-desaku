export type ConsultationStatus = 
  | 'menunggu_verifikasi' // Submitted by village, awaiting PMD check
  | 'terjadwal'           // Verified, expert assigned, GMeet link generated
  | 'berlangsung'         // Currently in consultation
  | 'rekomendasi_diterbitkan' // Consultation finished, official recommendation issued
  | 'tindak_lanjut'       // Village is executing the recommendations
  | 'selesai'             // Follow-up verified and closed
  | 'ditolak';            // Needs revision or out of scope

export type IssueCategory = 
  | 'pemerintahan_desa'   // 1. Bidang Pemerintahan Desa & Kelurahan
  | 'kawasan_perdesaan'   // 2. Bidang Kawasan Perdesaan
  | 'usaha_ekonomi_ttg'   // 3. Bidang Usaha Ekonomi Desa dan TTG
  | 'kelembagaan_sosbud'  // 4. Bidang Pemberdayaan Kelembagaan dan Sosbud Masy.
  | 'data_informasi'      // 5. Bidang Data dan Informasi
  | 'keuangan_apbdes'
  | 'pengadaan_barang_jasa'
  | 'bumdes'
  | 'hukum_perdes'
  | 'perencanaan_desa'
  | 'aset_tanah_desa'
  | 'sosial_stunting'
  | 'kelembagaan_bpd';

export type UserRole = 
  | 'desa'       // Aparatur Desa / Kelurahan (Kades, Lurah, Sekdes, BPD)
  | 'narasumber' // Tim Bidang Dinas PMD (5 Bidang Dinas PMD)
  | 'admin';     // Tim Fasilitasi Sekretariat DPMD

export interface ExpertProfile {
  id: string;
  nama: string;
  nip?: string;
  instansi: string; // e.g. "Dinas Pemberdayaan Masyarakat dan Desa (DPMD)"
  bidangDinas: string; // e.g. "Bidang Pemerintahan Desa & Kelurahan"
  jabatan: string;
  bidangKeahlian: IssueCategory[];
  foto: string;
  email: string;
  telepon: string;
  statusKetersediaan: 'Tersedia' | 'Sedang Konsultasi' | 'Cuti/Tugas Luar';
  jadwalPiket: string;
  totalKonsultasiDitangani: number;
  ratingKepuasan: number;
}

export interface PesertaKonsultasi {
  nama: string;
  jabatan: string; // e.g. "Kepala Desa", "Sekretaris Desa", "Ketua BPD", "Kaur Keuangan"
  instansi: string;
  kehadiran?: boolean;
}

export interface RecommendationItem {
  id: string;
  poinRekomendasi: string;
  dasarHukum: string; // e.g. Permendagri No. 20 Tahun 2018
  targetWaktu: string; // e.g. "14 Hari Kerja" / "30 Oktober 2026"
  penanggungJawab: string;
  status: 'belum_dimulai' | 'dalam_proses' | 'menunggu_verifikasi' | 'tuntas';
  catatanTindakLanjut?: string;
  buktiDukung?: {
    namaFile: string;
    tanggalUnggah: string;
    url?: string;
    ukuran?: string;
  }[];
}

export interface ConsultationTicket {
  id: string;
  nomorRegistrasi: string; // e.g. "KD-2026-X-042"
  namaDesa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  pemohonNama: string;
  pemohonJabatan: string;
  pemohonKontak: string;
  pemohonEmail: string;
  bidang: IssueCategory;
  judulKonsultasi: string;
  uraianMasalah: string;
  urgensi: 'Biasa' | 'Penting' | 'Mendesak';
  tanggalPengajuan: string;
  
  // Penjadwalan & Meet
  tanggalKonsultasi?: string;
  waktuMulai?: string;
  waktuSelesai?: string;
  googleMeetLink?: string;
  googleMeetCode?: string;
  tenagaAhliId?: string;
  tenagaAhliNama?: string;
  tenagaAhliInstansi?: string;
  
  // Status
  status: ConsultationStatus;
  
  // Dokumen dari desa
  dokumenPengajuan?: {
    nama: string;
    tipe: string;
    ukuran: string;
    tanggal: string;
  }[];

  // Peserta terdaftar
  daftarPeserta?: PesertaKonsultasi[];

  // Notulensi & Rekomendasi
  notulensiKonsultasi?: {
    waktuMulaiRiil?: string;
    waktuSelesaiRiil?: string;
    rangkumanPembahasan: string;
    pokokMasalahTeridentifikasi: string[];
    telaahAturan: string[];
    catatanKhusus?: string;
  };
  
  // Berita Acara & Rekomendasi
  nomorBeritaAcara?: string;
  tanggalTerbitRekomendasi?: string;
  rekomendasi?: RecommendationItem[];
  progressTindakLanjut?: number; // 0 - 100%
  
  // Evaluasi
  skorKepuasan?: number; // 1 - 5
  ulasanDesa?: string;
}

export interface RepositoryDocument {
  id: string;
  judul: string;
  kategori: 'Regulasi & Juknis' | 'Template & Format' | 'Berita Acara' | 'Laporan Hasil' | 'Materi Bimbingan';
  nomorPeraturan?: string;
  tahun: string;
  penerbit: string;
  deskripsi: string;
  ukuranFile: string;
  tipeFile: 'PDF' | 'DOCX' | 'XLSX';
  unduhanCount: number;
  tanggalUnggah: string;
  terkaitBidang: IssueCategory | 'Umum';
}

export interface ActivityLog {
  id: string;
  waktu: string;
  pengguna: string;
  peran: string;
  aktivitas: string;
  targetId?: string;
}

export interface UserAccount {
  id: string;
  nama: string;
  email: string;
  password?: string;
  role: UserRole;
  jabatan: string;
  instansi: string;
  namaDesaKelurahan?: string;
  kecamatan?: string;
  kabupaten?: string;
  nip?: string;
  telepon: string;
  tanggalDaftar: string;
  terakhirLogin: string;
  avatar?: string;
}

