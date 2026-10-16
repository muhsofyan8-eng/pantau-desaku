import React, { useState } from 'react';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  FileText, 
  BookOpen, 
  CheckCircle, 
  Plus, 
  Clock, 
  Tag 
} from 'lucide-react';
import { RepositoryDocument, UserRole } from '../../types/clinic';

interface DokumenViewProps {
  documents: RepositoryDocument[];
  activeRole: UserRole;
  onAddDocument: (doc: RepositoryDocument) => void;
  onIncrementDownload: (docId: string) => void;
}

export const DokumenView: React.FC<DokumenViewProps> = ({
  documents,
  activeRole,
  onAddDocument,
  onIncrementDownload
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [downloadSuccessFeedback, setDownloadSuccessFeedback] = useState<string | null>(null);

  // New doc form states
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<RepositoryDocument['kategori']>('Template & Format');
  const [nomorPeraturan, setNomorPeraturan] = useState('');
  const [penerbit, setPenerbit] = useState('Dinas Pemberdayaan Masyarakat dan Desa (DPMD)');
  const [deskripsi, setDeskripsi] = useState('');
  const [tipeFile, setTipeFile] = useState<'PDF' | 'DOCX' | 'XLSX'>('PDF');

  const filteredDocs = documents.filter(doc => {
    const matchSearch = 
      doc.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.nomorPeraturan && doc.nomorPeraturan.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategory === 'all' || doc.kategori === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleDownload = (doc: RepositoryDocument) => {
    onIncrementDownload(doc.id);
    setDownloadSuccessFeedback(`Mengunduh berkas: "${doc.judul}" (${doc.tipeFile})`);
    setTimeout(() => setDownloadSuccessFeedback(null), 3000);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) return;

    const newDoc: RepositoryDocument = {
      id: 'doc-' + Date.now(),
      judul,
      kategori,
      nomorPeraturan: nomorPeraturan || undefined,
      tahun: new Date().getFullYear().toString(),
      penerbit,
      deskripsi,
      ukuranFile: '1.5 MB',
      tipeFile,
      unduhanCount: 0,
      tanggalUnggah: new Date().toISOString().substring(0, 10),
      terkaitBidang: 'Umum'
    };

    onAddDocument(newDoc);
    setIsUploading(false);
    setJudul('');
    setDeskripsi('');
    setNomorPeraturan('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-emerald-600" />
            <span>Repositori Dokumen & Regulasi Desa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat arsip digital: regulasi perundang-undangan desa, juknis, format berita acara, dan dokumen pendukung.
          </p>
        </div>

        <button
          onClick={() => setIsUploading(!isUploading)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>+ Unggah Dokumen Baru</span>
        </button>
      </div>

      {downloadSuccessFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccessFeedback}</span>
        </div>
      )}

      {/* Upload Form Drawer / Collapsible */}
      {isUploading && (
        <form onSubmit={handleCreateDocument} className="bg-white rounded-2xl border border-slate-300 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Unggah Dokumen atau Template Baru</span>
            </h4>
            <button 
              type="button" 
              onClick={() => setIsUploading(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Dokumen *</label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Format Berita Acara Musrenbangdes RKPDes TA 2027"
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Dokumen *</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as any)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
              >
                <option value="Regulasi & Juknis">Regulasi & Juknis</option>
                <option value="Template & Format">Template & Format</option>
                <option value="Berita Acara">Berita Acara</option>
                <option value="Laporan Hasil">Laporan Hasil</option>
                <option value="Materi Bimbingan">Materi Bimbingan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Regulasi (Jika Ada)</label>
              <input
                type="text"
                value={nomorPeraturan}
                onChange={(e) => setNomorPeraturan(e.target.value)}
                placeholder="Contoh: Permendagri No. 20/2018"
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instansi Penerbit</label>
              <input
                type="text"
                value={penerbit}
                onChange={(e) => setPenerbit(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Format Berkas</label>
              <select
                value={tipeFile}
                onChange={(e) => setTipeFile(e.target.value as any)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
              >
                <option value="PDF">PDF Document (.pdf)</option>
                <option value="DOCX">Microsoft Word (.docx)</option>
                <option value="XLSX">Microsoft Excel (.xlsx)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat Dokumen</label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan isi pokok dokumen atau pedoman penggunaannya..."
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Simpan ke Repositori
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, nomor aturan, juknis..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white"
          >
            <option value="all">Semua Kategori Dokumen</option>
            <option value="Regulasi & Juknis">Regulasi & Juknis</option>
            <option value="Template & Format">Template & Format</option>
            <option value="Berita Acara">Berita Acara</option>
            <option value="Laporan Hasil">Laporan Hasil</option>
            <option value="Materi Bimbingan">Materi Bimbingan</option>
          </select>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const isPdf = doc.tipeFile === 'PDF';
          const isDocx = doc.tipeFile === 'DOCX';

          return (
            <div 
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isPdf 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : isDocx
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {doc.tipeFile} • {doc.kategori}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {doc.ukuranFile}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {doc.judul}
                </h3>

                {doc.nomorPeraturan && (
                  <p className="text-[11px] font-semibold text-slate-600 mt-1">
                    {doc.nomorPeraturan}
                  </p>
                )}

                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {doc.deskripsi}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <div className="text-[10px] text-slate-400">
                  <span>{doc.unduhanCount} kali diunduh</span>
                </div>

                <button
                  onClick={() => handleDownload(doc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Berkas</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
