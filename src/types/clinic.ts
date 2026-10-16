export type ConsultationStatus = 
  | 'menunggu_verifikasi' // Submitted by village, awaiting PMD check
  | 'terjadwal'           // Verified, expert assigned, GMeet link generated
  | 'berlangsung'         // Currently in consultation
  | 'rekomendasi_diterbitkan' // Consultation finished, official recommendation issued
  | 'tindak_lanjut'       // Village is executing the recommendations
  | 'selesai'             // Follow-up verified and closed
  | 'ditolak';            // Needs revision or out of scope

export type IssueCategory = 
  | 'keuangan_apbdes'     // Pengelolaan Keuangan & APBDes, Siltap, BLT-DD
  | 'pengadaan_barang_jasa' // Pengadaan Barang dan Jasa di Desa (PBJ)
  | 'bumdes'              // Pendirian, Pendaftaran Berbadan Hukum & Pengelolaan BUMDes
  | 'hukum_perdes'        // Penyusunan Produk Hukum & Peraturan Desa
  | 'perencanaan_desa'    // RKPDes, RPJMDes, Musrenbangdes
  | 'aset_tanah_desa'     // Pengelolaan Aset & Tanah Kas Desa (TKD)
  | 'sosial_stunting'     // Penanganan Stunting, Posyandu, bansos desa
  | 'kelembagaan_bpd';    // Hubungan Kerja Pemdes & BPD, Lembaga Kemasyarakatan

export type UserRole = 
  | 'desa'       // Aparatur Desa / Kelurahan (Kades, Sekdes, BPD)
  | 'narasumber' // Tenaga Ahli OPD / Pendamping Desa (Inspektorat, PMD, Hukum, dll)
  | 'admin';     // Tim Fasilitasi Sekretariat Klinik Desa (Dinas PMD)

export interface ExpertProfile {
  id: string;
  nama: string;
  nip?: string;
  instansi: string; // e.g. "Inspektorat Daerah", "Dinas PMD", "Bagian Hukum Setda", "BPKAD"
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
