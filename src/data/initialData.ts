import { ConsultationTicket, ExpertProfile, RepositoryDocument, IssueCategory, ActivityLog } from '../types/clinic';

export const CATEGORY_LABELS: Record<string, { label: string; badgeColor: string; iconName: string }> = {
  pemerintahan_desa: {
    label: '1. Bidang Pemerintahan Desa & Kelurahan',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconName: 'Building2'
  },
  kawasan_perdesaan: {
    label: '2. Bidang Kawasan Perdesaan',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    iconName: 'Landmark'
  },
  usaha_ekonomi_ttg: {
    label: '3. Bidang Usaha Ekonomi Desa dan TTG',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    iconName: 'Coins'
  },
  kelembagaan_sosbud: {
    label: '4. Bidang Pemberdayaan Kelembagaan dan Sosbud Masy.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    iconName: 'Users'
  },
  data_informasi: {
    label: '5. Bidang Data dan Informasi',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    iconName: 'FileSpreadsheet'
  },
  // Backwards compatibility mappings
  keuangan_apbdes: {
    label: 'Bidang Pemerintahan Desa & Kelurahan (Keuangan)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconName: 'Coins'
  },
  pengadaan_barang_jasa: {
    label: 'Bidang Pemerintahan Desa & Kelurahan (PBJ)',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    iconName: 'ShoppingCart'
  },
  bumdes: {
    label: 'Bidang Usaha Ekonomi Desa dan TTG (BUMDes)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    iconName: 'Building2'
  },
  hukum_perdes: {
    label: 'Bidang Pemerintahan Desa & Kelurahan (Peraturan Desa)',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    iconName: 'Scale'
  },
  perencanaan_desa: {
    label: 'Bidang Kawasan Perdesaan (Perencanaan Wilayah)',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    iconName: 'FileSpreadsheet'
  },
  aset_tanah_desa: {
    label: 'Bidang Pemerintahan Desa & Kelurahan (Aset Desa)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    iconName: 'Landmark'
  },
  sosial_stunting: {
    label: 'Bidang Pemberdayaan Kelembagaan dan Sosbud Masy.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    iconName: 'HeartPulse'
  },
  kelembagaan_bpd: {
    label: 'Bidang Pemberdayaan Kelembagaan dan Sosbud Masy. (BPD)',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    iconName: 'Users'
  }
};

export const INITIAL_EXPERTS: ExpertProfile[] = [
  {
    id: 'bidang-01',
    nama: 'Drs. H. Bambang Suhartono, M.Si',
    nip: '19740512 199903 1 004',
    instansi: 'Dinas Pemberdayaan Masyarakat dan Desa (DPMD)',
    bidangDinas: 'Bidang Pemerintahan Desa & Kelurahan',
    jabatan: 'Kepala Bidang Pemerintahan Desa & Kelurahan',
    bidangKeahlian: ['pemerintahan_desa', 'keuangan_apbdes'],
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    email: 'pemdes.dpmd@kabupaten.go.id',
    telepon: '0812-3456-7890',
    statusKetersediaan: 'Tersedia',
    jadwalPiket: 'Senin & Rabu (09:00 - 15:00 WIB)',
    totalKonsultasiDitangani: 38,
    ratingKepuasan: 4.9
  },
  {
    id: 'bidang-02',
    nama: 'Ir. H. Dedi Mulyadi, M.T.',
    nip: '19780315 200212 1 003',
    instansi: 'Dinas Pemberdayaan Masyarakat dan Desa (DPMD)',
    bidangDinas: 'Bidang Kawasan Perdesaan',
    jabatan: 'Kepala Bidang Kawasan Perdesaan',
    bidangKeahlian: ['kawasan_perdesaan', 'perencanaan_desa'],
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    email: 'kawasan.dpmd@kabupaten.go.id',
    telepon: '0813-8899-2211',
    statusKetersediaan: 'Tersedia',
    jadwalPiket: 'Selasa & Kamis (09:00 - 14:00 WIB)',
    totalKonsultasiDitangani: 27,
    ratingKepuasan: 4.85
  },
  {
    id: 'bidang-03',
    nama: 'Agus Triyono, S.E., M.M.',
    nip: '19850614 201001 1 015',
    instansi: 'Dinas Pemberdayaan Masyarakat dan Desa (DPMD)',
    bidangDinas: 'Bidang Usaha Ekonomi Desa dan TTG',
    jabatan: 'Kepala Bidang Usaha Ekonomi Desa dan TTG',
    bidangKeahlian: ['usaha_ekonomi_ttg', 'bumdes'],
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    email: 'ekonomi.ttg@kabupaten.go.id',
    telepon: '0815-6789-012',
    statusKetersediaan: 'Tersedia',
    jadwalPiket: 'Senin s/d Kamis (10:00 - 15:30 WIB)',
    totalKonsultasiDitangani: 31,
    ratingKepuasan: 4.8
  },
  {
    id: 'bidang-04',
    nama: 'Hj. Ratna Komala, S.Sos., M.AP.',
    nip: '19821018 200604 2 009',
    instansi: 'Dinas Pemberdayaan Masyarakat dan Desa (DPMD)',
    bidangDinas: 'Bidang Pemberdayaan Kelembagaan dan Sosbud Masy.',
    jabatan: 'Kepala Bidang Pemberdayaan Kelembagaan dan Sosbud Masy.',
    bidangKeahlian: ['kelembagaan_sosbud', 'kelembagaan_bpd'],
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    email: 'kelembagaan.sosbud@kabupaten.go.id',
    telepon: '0812-4433-2211',
    statusKetersediaan: 'Tersedia',
    jadwalPiket: 'Rabu & Jumat (08:30 - 14:30 WIB)',
    totalKonsultasiDitangani: 24,
    ratingKepuasan: 4.9
  },
  {
    id: 'bidang-05',
    nama: 'Ahmad Fauzi, S.Kom., M.T.I.',
    nip: '19880722 201101 1 007',
    instansi: 'Dinas Pemberdayaan Masyarakat dan Desa (DPMD)',
    bidangDinas: 'Bidang Data dan Informasi',
    jabatan: 'Kepala Bidang Data dan Informasi / Pranata Komputer Madya',
    bidangKeahlian: ['data_informasi'],
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    email: 'datainfo.dpmd@kabupaten.go.id',
    telepon: '0852-7788-9900',
    statusKetersediaan: 'Tersedia',
    jadwalPiket: 'Setiap Hari Kerja (08:30 - 16:00 WIB)',
    totalKonsultasiDitangani: 42,
    ratingKepuasan: 4.92
  }
];

export const INITIAL_CONSULTATIONS: ConsultationTicket[] = [
  {
    id: 'kd-2026-001',
    nomorRegistrasi: 'KD-2026-X-041',
    namaDesa: 'Desa Sukamaju',
    kecamatan: 'Kecamatan Cilaku',
    kabupaten: 'Kabupaten Cianjur',
    provinsi: 'Jawa Barat',
    pemohonNama: 'Ahmad Syafi\'i, S.IP',
    pemohonJabatan: 'Sekretaris Desa',
    pemohonKontak: '0812-3344-5566',
    pemohonEmail: 'sekdes.sukamaju@desa.id',
    bidang: 'keuangan_apbdes',
    judulKonsultasi: 'Konsultasi Pergeseran Anggaran APBDes TA 2026 untuk Penanganan Darurat Bencana Banjir Bandang',
    uraianMasalah: 'Telah terjadi longsor dan luapan drainase utama desa pada minggu lalu yang merusak akses jalan lingkar dusun 3. Pemerintah desa berencana melakukan pergeseran anggaran belanja tak terduga (BTT) ke belanja modal fisik perbaikan darurat. Kami memerlukan panduan regulasi penyusunan Perubahan Penjabaran APBDes dan penyampaian laporannya ke BPD dan Camat agar tidak melanggar ketentuan perundang-undangan.',
    urgensi: 'Mendesak',
    tanggalPengajuan: '2026-10-02',
    tanggalKonsultasi: '2026-10-04',
    waktuMulai: '10:00',
    waktuSelesai: '11:15',
    googleMeetLink: 'https://meet.google.com/qvr-tzmh-xwk',
    googleMeetCode: 'qvr-tzmh-xwk',
    tenagaAhliId: 'exp-01',
    tenagaAhliNama: 'Drs. H. Bambang Suhartono, M.Si',
    tenagaAhliInstansi: 'Dinas Pemberdayaan Masyarakat dan Desa (DPMD)',
    status: 'berlangsung',
    dokumenPengajuan: [
      { nama: 'Draft_Perdes_Perubahan_Penjabaran_APBDes.pdf', tipe: 'PDF', ukuran: '1.8 MB', tanggal: '2026-10-02' },
      { nama: 'Berita_Acara_Musdes_Khusus_Bencana.pdf', tipe: 'PDF', ukuran: '2.4 MB', tanggal: '2026-10-02' },
      { nama: 'Dokumentasi_Foto_Kerusakan_Jalan.zip', tipe: 'ZIP', ukuran: '8.2 MB', tanggal: '2026-10-02' }
    ],
    daftarPeserta: [
      { nama: 'Drs. H. Bambang Suhartono, M.Si', jabatan: 'Kabid Pemerintahan Desa & Kelurahan', instansi: 'DPMD', kehadiran: true },
      { nama: 'Kuswandi', jabatan: 'Kepala Desa Sukamaju', instansi: 'Pemerintah Desa', kehadiran: true },
      { nama: 'Ahmad Syafi\'i, S.IP', jabatan: 'Sekretaris Desa', instansi: 'Pemerintah Desa', kehadiran: true },
      { nama: 'Endang Sumarna', jabatan: 'Ketua BPD Sukamaju', instansi: 'BPD', kehadiran: true },
      { nama: 'Dewi Lestari', jabatan: 'Kaur Keuangan', instansi: 'Pemerintah Desa', kehadiran: false }
    ],
    notulensiKonsultasi: {
      waktuMulaiRiil: '10:02 WIB',
      waktuSelesaiRiil: 'Sedang berlangsung...',
      rangkumanPembahasan: 'Konsultasi daring dibuka oleh Tim Bidang Pemerintahan Desa & Kelurahan DPMD. Pemdes memaparkan urgensi alokasi BTT pasca bencana luapan banjir. DPMD menegaskan bahwa sesuai Permendagri No. 20/2018 Pasal 69, penanganan keadaan darurat dan mendesak dapat dilakukan mendahului perubahan APBDes dengan menerbitkan Peraturan Kepala Desa (Perkades) tentang Perubahan Penjabaran APBDes.',
      pokokMasalahTeridentifikasi: [
        'Mekanisme pergeseran pos Belanja Tidak Terduga (BTT) ke kegiatan operasional fisik kebencanaan',
        'Persyaratan administrasi surat penetapan status darurat dari Camat / BPBD setempat',
        'Kewajiban pelaporan kepada BPD paling lambat 1 bulan setelah kejadian'
      ],
      telaahAturan: [
        'Permendagri No. 20 Tahun 2018 tentang Pengelolaan Keuangan Desa (Pasal 68 - 70)',
        'Peraturan Bupati No. 14 Tahun 2023 tentang Pedoman Penyusunan APBDes',
        'UU No. 3 Tahun 2024 tentang Perubahan Kedua atas UU No. 6 Tahun 2014 tentang Desa'
      ],
      catatanKhusus: 'Fasilitator DPMD siap menerbitkan Berita Acara Rekomendasi segera setelah sesi video call berakhir.'
    },
    nomorBeritaAcara: 'BA-KD/PMD/2026/X/018',
    tanggalTerbitRekomendasi: '2026-10-04',
    progressTindakLanjut: 30,
    rekomendasi: [
      {
        id: 'rec-01-a',
        poinRekomendasi: 'Terbitkan Peraturan Kepala Desa (Perkades) tentang Perubahan Penjabaran APBDes TA 2026 untuk menggeser Belanja Tidak Terduga (BTT) ke Bidang 5 (Penanggulangan Bencana)',
        dasarHukum: 'Permendagri 20/2018 Pasal 69 ayat (2)',
        targetWaktu: '7 Hari Kerja (Maksimal 12 Oktober 2026)',
        penanggungJawab: 'Kepala Desa & Sekdes Sukamaju',
        status: 'dalam_proses',
        catatanTindakLanjut: 'Draft Perkades sudah selesai disinkronkan dengan telaah DPMD, sedang proses tandatangan Kades.'
      },
      {
        id: 'rec-01-b',
        poinRekomendasi: 'Lampirkan Surat Keterangan / Laporan Kejadian Kebencanaan dari BPBD / Camat Cilaku sebagai dasar pengeluaran kas BTT',
        dasarHukum: 'Perbup Pedoman APBDes Pasal 45',
        targetWaktu: '5 Hari Kerja',
        penanggungJawab: 'Kaur Perencanaan & BPBD',
        status: 'tuntas',
        catatanTindakLanjut: 'Surat laporan kaji cepat BPBD Nomor 360/412/BPBD telah diterbitkan dan diarsipkan.'
      }
    ]
  },
  {
    id: 'kd-2026-002',
    nomorRegistrasi: 'KD-2026-X-042',
    namaDesa: 'Desa Karangrejo',
    kecamatan: 'Kecamatan Cibeber',
    kabupaten: 'Kabupaten Cianjur',
    provinsi: 'Jawa Barat',
    pemohonNama: 'Suryadi, S.E.',
    pemohonJabatan: 'Direktur BUMDes Karya Mandiri',
    pemohonKontak: '0857-1122-3344',
    pemohonEmail: 'bumdes.karangrejo@gmail.com',
    bidang: 'bumdes',
    judulKonsultasi: 'Fasilitasi Sertifikasi Badan Hukum BUMDes di Kemenkumham dan Rencana Penyertaan Modal Desa',
    uraianMasalah: 'BUMDes Karya Mandiri telah menyelenggarakan Musyawarah Desa untuk penyesuaian AD/ART sesuai PP No. 11/2021. Namun saat melakukan pendaftaran di portal BUMDes Kemendesa, verifikasi nama sempat ditolak karena terdapat redaksi unit usaha simpan pinjam yang belum sesuai regulasi OJK/LKD. Kami membutuhkan fasilitasi telaah redaksi AD/ART dan kelayakan analisis investasi penyertaan modal desa Rp 150.000.000.',
    urgensi: 'Penting',
    tanggalPengajuan: '2026-10-03',
    tanggalKonsultasi: '2026-10-05',
    waktuMulai: '13:30',
    waktuSelesai: '14:45',
    googleMeetLink: 'https://meet.google.com/abc-mopq-xyz',
    googleMeetCode: 'abc-mopq-xyz',
    tenagaAhliId: 'exp-04',
    tenagaAhliNama: 'Agus Triyono, S.E., M.M.',
    tenagaAhliInstansi: 'Dinas Koperasi, UKM & Perdagangan / DPMD',
    status: 'terjadwal',
    dokumenPengajuan: [
      { nama: 'Draft_AD_ART_BUMDes_Karya_Mandiri.pdf', tipe: 'PDF', ukuran: '3.1 MB', tanggal: '2026-10-03' },
      { nama: 'Proposal_Kelayakan_Usaha_Penyertaan_Modal.pdf', tipe: 'PDF', ukuran: '4.5 MB', tanggal: '2026-10-03' },
      { nama: 'BA_Musdes_Penyelarasan_BUMDes.pdf', tipe: 'PDF', ukuran: '1.2 MB', tanggal: '2026-10-03' }
    ],
    daftarPeserta: [
      { nama: 'Agus Triyono, S.E., M.M.', jabatan: 'Narasumber OPD BUMDes', instansi: 'DPMD' },
      { nama: 'Suryadi, S.E.', jabatan: 'Direktur BUMDes', instansi: 'BUMDes Karya Mandiri' },
      { nama: 'Mulyadi', jabatan: 'Kepala Desa Karangrejo', instansi: 'Pemerintah Desa' },
      { nama: 'Drs. Subagio', jabatan: 'Pengawas BUMDes', instansi: 'BPD' }
    ]
  },
  {
    id: 'kd-2026-003',
    nomorRegistrasi: 'KD-2026-X-038',
    namaDesa: 'Desa Tirta Jaya',
    kecamatan: 'Kecamatan Mande',
    kabupaten: 'Kabupaten Cianjur',
    provinsi: 'Jawa Barat',
    pemohonNama: 'Hj. Ratna Sari, M.Pd',
    pemohonJabatan: 'Ketua BPD Tirta Jaya',
    pemohonKontak: '0813-7766-5544',
    pemohonEmail: 'bpd.tirtajaya@gmail.com',
    bidang: 'hukum_perdes',
    judulKonsultasi: 'Harmonisasi Draft Peraturan Desa tentang Pemanfaatan Sempadan Waduk untuk Ekowisata Desa',
    uraianMasalah: 'Desa Tirta Jaya berbatasan langsung dengan perairan waduk yang memiliki potensi wisata air. Pemdes dan BPD telah menyusun draft Rancangan Perdes Ekowisata, namun terdapat kekhawatiran benturan kewenangan pengelolaan sempadan air dengan Balai Besar Wilayah Sungai (BBWS). Kami mohon telaah harmonisasi produk hukum desa agar tidak cacat formal dan materiil.',
    urgensi: 'Penting',
    tanggalPengajuan: '2026-09-28',
    tanggalKonsultasi: '2026-09-30',
    waktuMulai: '09:00',
    waktuSelesai: '10:30',
    googleMeetLink: 'https://meet.google.com/def-uvwx-rst',
    googleMeetCode: 'def-uvwx-rst',
    tenagaAhliId: 'exp-02',
    tenagaAhliNama: 'Siti Rahmawati, S.H., M.H.',
    tenagaAhliInstansi: 'Bagian Hukum Sekretariat Daerah',
    status: 'tindak_lanjut',
    dokumenPengajuan: [
      { nama: 'Draft_Raperdes_Pemanfaatan_Sempadan.pdf', tipe: 'PDF', ukuran: '2.8 MB', tanggal: '2026-09-28' },
      { nama: 'Peta_Lokasi_Rencana_Ekowisata.pdf', tipe: 'PDF', ukuran: '5.6 MB', tanggal: '2026-09-28' }
    ],
    notulensiKonsultasi: {
      waktuMulaiRiil: '09:05 WIB',
      waktuSelesaiRiil: '10:28 WIB',
      rangkumanPembahasan: 'Konsultasi virtual dihadiri Bagian Hukum Setda, Kades Tirta Jaya, dan BPD. Disepakati bahwa kewenangan tanah sempadan waduk adalah domain Kementerian PUPR / BBWS. Desa tidak boleh menetapkan retribusi sepihak, melainkan harus menggunakan mekanisme Perjanjian Kerja Sama (PKS) Pemanfaatan Aset dengan BBWS sebelum Perdes disahkan.',
      pokokMasalahTeridentifikasi: [
        'Klausul retribusi desa yang berpotensi menjadi pungutan liar tanpa PKS resmi',
        'Penetapan zonasi konservasi sempadan 50 meter dari muka air pasang',
        'Mekanisme konsultasi dan evaluasi Raperdes ke Camat sesuai Permendagri 111/2014'
      ],
      telaahAturan: [
        'Permendagri No. 111 Tahun 2014 tentang Pedoman Teknis Peraturan di Desa',
        'UU No. 17 Tahun 2019 tentang Sumber Daya Air',
        'Permen PUPR No. 28/PRT/M/2015 tentang Penetapan Garis Sempadan Sungai dan Danau'
      ]
    },
    nomorBeritaAcara: 'BA-KD/HKM/2026/IX/012',
    tanggalTerbitRekomendasi: '2026-09-30',
    progressTindakLanjut: 75,
    rekomendasi: [
      {
        id: 'rec-03-a',
        poinRekomendasi: 'Hapus pasal pemungutan retribusi langsung dan gantikan dengan klausul bagi hasil berbasis PKS kemitraan BUMDes dan BBWS',
        dasarHukum: 'UU 17/2019 & Permendagri 111/2014',
        targetWaktu: '10 Hari Kerja',
        penanggungJawab: 'Tim Perumus Raperdes BPD & Pemdes',
        status: 'tuntas',
        catatanTindakLanjut: 'Draft telah direvisi dan disesuaikan klausulnya, pasal retribusi telah dihapus.'
      },
      {
        id: 'rec-03-b',
        poinRekomendasi: 'Kirimkan surat permohonan rekomendasi teknis dan draf PKS ke kantor BBWS Citarum',
        dasarHukum: 'PP No. 11 Tahun 2021',
        targetWaktu: '20 Hari Kerja',
        penanggungJawab: 'Kepala Desa Tirta Jaya',
        status: 'dalam_proses',
        catatanTindakLanjut: 'Surat permohonan PKS sudah dikirimkan via Pos Kilat Khusus dan tanda terima terlampir.'
      }
    ],
    skorKepuasan: 5,
    ulasanDesa: 'Penjelasan Bu Siti dari Bagian Hukum sangat lugas dan menyelamatkan desa dari risiko pungli.'
  },
  {
    id: 'kd-2026-004',
    nomorRegistrasi: 'KD-2026-X-043',
    namaDesa: 'Desa Cibodas',
    kecamatan: 'Kecamatan Pacet',
    kabupaten: 'Kabupaten Cianjur',
    provinsi: 'Jawa Barat',
    pemohonNama: 'Dadan Ramdani',
    pemohonJabatan: 'Ketua Tim Pelaksana Kegiatan (TPK)',
    pemohonKontak: '0878-9900-1122',
    pemohonEmail: 'tpk.cibodas@desa.id',
    bidang: 'pengadaan_barang_jasa',
    judulKonsultasi: 'Mekanisme Pengadaan Bahan Bangunan Proyek Pembangunan Jembatan Gantung Desa Senilai Rp 230 Juta',
    uraianMasalah: 'Desa kami menerima bantuan keuangan khusus untuk jembatan penghubung dusun. Nilai pengadaan material besi dan kawat sling diperkirakan Rp 230.000.000. TPK memerlukan bimbingan apakah wajib lelang elektronik atau cukup sistem permintaan penawaran kepada 2 rekanan terdaftar sesuai Perka LKPP No. 12/2019.',
    urgensi: 'Penting',
    tanggalPengajuan: '2026-10-04',
    status: 'menunggu_verifikasi',
    dokumenPengajuan: [
      { nama: 'RAB_Jembatan_Gantung_Cibodas.xlsx', tipe: 'XLSX', ukuran: '850 KB', tanggal: '2026-10-04' },
      { nama: 'Gambar_Teknis_DED.pdf', tipe: 'PDF', ukuran: '6.4 MB', tanggal: '2026-10-04' }
    ]
  },
  {
    id: 'kd-2026-005',
    nomorRegistrasi: 'KD-2026-IX-035',
    namaDesa: 'Desa Mekarwangi',
    kecamatan: 'Kecamatan Warungkondang',
    kabupaten: 'Kabupaten Cianjur',
    provinsi: 'Jawa Barat',
    pemohonNama: 'Neneng Maryati, A.Md.Keb',
    pemohonJabatan: 'Kader Pembangunan Manusia (KPM)',
    pemohonKontak: '0821-3322-1100',
    pemohonEmail: 'kpm.mekarwangi@gmail.com',
    bidang: 'sosial_stunting',
    judulKonsultasi: 'Optimalisasi Anggaran Dana Desa untuk Pemberian Makanan Tambahan (PMT) Berbasis Pangan Lokal Balita Gizi Kurang',
    uraianMasalah: 'Terdapat 14 balita terindikasi stunting di Posyandu Melati. Pemdes Mekarwangi menganggarkan PMT, namun bingung dalam penyusunan standarisasi menu gizi seimbang sesuai Permenkes dan SPJ pembelanjaan kader tanpa melanggar ketentuan pencairan kas desa.',
    urgensi: 'Biasa',
    tanggalPengajuan: '2026-09-20',
    tanggalKonsultasi: '2026-09-24',
    waktuMulai: '10:00',
    waktuSelesai: '11:15',
    googleMeetLink: 'https://meet.google.com/stn-pmt-desa',
    googleMeetCode: 'stn-pmt-desa',
    tenagaAhliId: 'exp-05',
    tenagaAhliNama: 'dr. Novita Anggraini, M.Kes',
    tenagaAhliInstansi: 'Dinas Kesehatan & Sub-Koordinator Kesmas',
    status: 'selesai',
    nomorBeritaAcara: 'BA-KD/KES/2026/IX/009',
    tanggalTerbitRekomendasi: '2026-09-24',
    progressTindakLanjut: 100,
    rekomendasi: [
      {
        id: 'rec-05-a',
        poinRekomendasi: 'Gunakan juknis PMT Pangan Lokal Kemenkes dengan komposisi 1 butir telur + protein hewani lokal per porsi',
        dasarHukum: 'Permenkes Juknis PMT 2024 & Permendes Prioritas DD',
        targetWaktu: 'Selesai',
        penanggungJawab: 'KPM & Bidan Desa',
        status: 'tuntas',
        catatanTindakLanjut: 'Menu 90 hari siklus PMT telah diterapkan di 5 posyandu.'
      }
    ],
    skorKepuasan: 5,
    ulasanDesa: 'Sangat terbantu, ibu-ibu kader posyandu sekarang paham takaran gizi dan cara bikin SPJ nota sayurnya.'
  }
];

export const INITIAL_DOCUMENTS: RepositoryDocument[] = [
  {
    id: 'doc-01',
    judul: 'Undang-Undang Nomor 3 Tahun 2024 tentang Perubahan Kedua atas UU No. 6 Tahun 2014 tentang Desa',
    kategori: 'Regulasi & Juknis',
    nomorPeraturan: 'UU No. 3 Tahun 2024',
    tahun: '2024',
    penerbit: 'Pemerintah Pusat / Lembaran Negara RI',
    deskripsi: 'Regulasi induk mengenai masa jabatan kepala desa, sumber pendapatan desa, dan alokasi dana konservasi/rehabilitasi.',
    ukuranFile: '1.4 MB',
    tipeFile: 'PDF',
    unduhanCount: 312,
    tanggalUnggah: '2026-01-15',
    terkaitBidang: 'hukum_perdes'
  },
  {
    id: 'doc-02',
    judul: 'Permendagri Nomor 20 Tahun 2018 tentang Pengelolaan Keuangan Desa',
    kategori: 'Regulasi & Juknis',
    nomorPeraturan: 'Permendagri No. 20/2018',
    tahun: '2018',
    penerbit: 'Kementerian Dalam Negeri Republik Indonesia',
    deskripsi: 'Pedoman lengkap azas, struktur APBDes, pergeseran anggaran keadaan darurat, dan akuntansi Siskeudes.',
    ukuranFile: '3.2 MB',
    tipeFile: 'PDF',
    unduhanCount: 520,
    tanggalUnggah: '2026-01-10',
    terkaitBidang: 'keuangan_apbdes'
  },
  {
    id: 'doc-03',
    judul: 'Format Baku Berita Acara Konsultasi & Lembar Rekomendasi Klinik Desa',
    kategori: 'Template & Format',
    nomorPeraturan: 'Juknis Klinik Desa No. 04/2026',
    tahun: '2026',
    penerbit: 'Sekretariat Klinik Desa - DPMD',
    deskripsi: 'Format standar notulensi, lembar telaah yuridis OPD, dan berita acara penyerahan rekomendasi tindak lanjut.',
    ukuranFile: '145 KB',
    tipeFile: 'DOCX',
    unduhanCount: 189,
    tanggalUnggah: '2026-03-01',
    terkaitBidang: 'Umum'
  },
  {
    id: 'doc-04',
    judul: 'Pedoman Tata Cara Pendaftaran Badan Hukum BUMDes / BUMDes Bersama (PP 11/2021)',
    kategori: 'Regulasi & Juknis',
    nomorPeraturan: 'PP No. 11 Tahun 2021',
    tahun: '2021',
    penerbit: 'Kemendesa PDTT & Kemenkumham',
    deskripsi: 'Tahapan pendaftaran nama, verifikasi AD/ART di sistem kemendesa, hingga sertifikat Kemenkumham.',
    ukuranFile: '2.7 MB',
    tipeFile: 'PDF',
    unduhanCount: 245,
    tanggalUnggah: '2026-02-12',
    terkaitBidang: 'bumdes'
  },
  {
    id: 'doc-05',
    judul: 'Template Dokumen Rencana Kerja Pemerintah Desa (RKPDes) dan Format Berita Acara Musrenbangdes',
    kategori: 'Template & Format',
    nomorPeraturan: 'Lampiran Permendagri 114/2014',
    tahun: '2024',
    penerbit: 'DPMD & TAPM Kemendesa',
    deskripsi: 'Format spreadsheet matriks program kerja, pagu indikatif, dan penyelarasan prioritas SDGs Desa.',
    ukuranFile: '420 KB',
    tipeFile: 'XLSX',
    unduhanCount: 410,
    tanggalUnggah: '2026-04-18',
    terkaitBidang: 'perencanaan_desa'
  },
  {
    id: 'doc-06',
    judul: 'Petunjuk Teknis Tata Cara Pengadaan Barang/Jasa di Desa (Perka LKPP No. 12 Tahun 2019)',
    kategori: 'Regulasi & Juknis',
    nomorPeraturan: 'Perka LKPP 12/2019',
    tahun: '2019',
    penerbit: 'Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP)',
    deskripsi: 'Ketentuan swakelola desa, batas nilai lelang/pembelian langsung oleh TPK, dan format surat perjanjian.',
    ukuranFile: '1.9 MB',
    tipeFile: 'PDF',
    unduhanCount: 388,
    tanggalUnggah: '2026-01-20',
    terkaitBidang: 'pengadaan_barang_jasa'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-01',
    waktu: '2026-10-04 10:02:15',
    pengguna: 'Drs. H. Bambang Suhartono, M.Si (DPMD)',
    peran: 'Narasumber OPD',
    aktivitas: 'Membuka ruang konsultasi daring Google Meet (qvr-tzmh-xwk) bersama Pemdes Sukamaju',
    targetId: 'kd-2026-001'
  },
  {
    id: 'log-02',
    waktu: '2026-10-04 09:15:30',
    pengguna: 'Dadan Ramdani (TPK Cibodas)',
    peran: 'Aparatur Desa',
    aktivitas: 'Mengajukan permohonan konsultasi baru: Pengadaan Bahan Jembatan Gantung',
    targetId: 'kd-2026-004'
  },
  {
    id: 'log-03',
    waktu: '2026-10-03 16:40:10',
    pengguna: 'Admin Sekretariat Klinik Desa',
    peran: 'Administrator PMD',
    aktivitas: 'Memverifikasi dan menetapkan jadwal konsultasi Desa Karangrejo bersama Narasumber BUMDes Agus Triyono',
    targetId: 'kd-2026-002'
  },
  {
    id: 'log-04',
    waktu: '2026-10-01 11:20:00',
    pengguna: 'Siti Rahmawati, S.H. (Bagian Hukum)',
    peran: 'Narasumber OPD',
    aktivitas: 'Menerbitkan Lembar Rekomendasi Resmi BA-KD/HKM/2026/IX/012 untuk Desa Tirta Jaya',
    targetId: 'kd-2026-003'
  }
];
