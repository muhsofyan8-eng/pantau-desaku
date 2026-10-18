import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  Building,
  KeyRound,
  Users
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types/clinic';
import { login, signup, resetPassword, INITIAL_USERS } from '../../services/authService';

interface AuthViewProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In states
  const [signInEmail, setSignInEmail] = useState('kades@sukamaju.desa.id');
  const [signInPassword, setSignInPassword] = useState('password123');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up states
  const [signUpRole, setSignUpRole] = useState<UserRole>('desa');
  const [signUpNama, setSignUpNama] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpTelepon, setSignUpTelepon] = useState('');
  
  // Specific to Desa
  const [signUpDesa, setSignUpDesa] = useState('Desa Sukamaju');
  const [signUpKecamatan, setSignUpKecamatan] = useState('Kecamatan Cilaku');
  const [signUpKabupaten, setSignUpKabupaten] = useState('Kabupaten Cianjur');
  const [signUpJabatanDesa, setSignUpJabatanDesa] = useState('Kepala Desa');

  // Specific to OPD / Ahli
  const [signUpInstansi, setSignUpInstansi] = useState('Dinas Pemberdayaan Masyarakat dan Desa (DPMD)');
  const [signUpJabatanOPD, setSignUpJabatanOPD] = useState('Analis Kebijakan Ahli Muda');
  const [signUpNIP, setSignUpNIP] = useState('');

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Quick fill demo user
  const handleSelectDemoUser = (user: UserAccount) => {
    setSignInEmail(user.email);
    setSignInPassword(user.password || 'password123');
    setErrorMessage(null);
  };

  // Submit Sign In
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInEmail || !signInPassword) {
      setErrorMessage('Harap masukkan email dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(signInEmail, signInPassword);
      setLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.message || 'Login gagal. Periksa kembali email dan kata sandi.');
      }
    }, 400);
  };

  // Submit Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signUpNama.trim() || !signUpEmail.trim() || !signUpPassword || !signUpTelepon.trim()) {
      setErrorMessage('Harap lengkapi semua kolom wajib.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Kata sandi harus minimal 6 karakter.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let finalJabatan = '';
      let finalInstansi = '';

      if (signUpRole === 'desa') {
        finalJabatan = signUpJabatanDesa;
        finalInstansi = `Pemerintah ${signUpDesa}`;
      } else if (signUpRole === 'narasumber') {
        finalJabatan = signUpJabatanOPD;
        finalInstansi = signUpInstansi;
      } else {
        finalJabatan = 'Sekretariat Fasilitasi DPMD';
        finalInstansi = 'Dinas Pemberdayaan Masyarakat dan Desa';
      }

      const res = signup({
        nama: signUpNama,
        email: signUpEmail,
        password: signUpPassword,
        role: signUpRole,
        jabatan: finalJabatan,
        instansi: finalInstansi,
        namaDesaKelurahan: signUpRole === 'desa' ? signUpDesa : undefined,
        kecamatan: signUpRole === 'desa' ? signUpKecamatan : undefined,
        kabupaten: signUpKabupaten,
        nip: signUpNIP || undefined,
        telepon: signUpTelepon
      });

      setLoading(false);

      if (res.success && res.user) {
        setSuccessMessage('Pendaftaran akun berhasil! Mengalihkan ke dashboard...');
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 800);
      } else {
        setErrorMessage(res.message || 'Pendaftaran gagal.');
      }
    }, 500);
  };

  // Submit Forgot Password Reset
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !newPasswordInput) {
      setForgotFeedback({ type: 'error', text: 'Harap lengkapi email dan kata sandi baru.' });
      return;
    }

    const res = resetPassword(forgotEmail, newPasswordInput);
    if (res.success) {
      setForgotFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setSignInEmail(forgotEmail);
        setSignInPassword(newPasswordInput);
        setForgotFeedback(null);
      }, 1500);
    } else {
      setForgotFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center relative overflow-hidden font-sans">
      
      {/* Top National Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-700 z-10" />

      {/* Background radial gradient & patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 opacity-90 pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-20">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 border-2 border-emerald-500/30 text-white shadow-xl shadow-emerald-900/30 mb-2">
            <Building2 className="w-7 h-7 text-emerald-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            PANTAU <span className="text-emerald-400">DESAKU</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-emerald-300">
            Pusat Informasi Terpadu Desa dan Kelurahan
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Sistem Informasi Pemerintahan Berbasis Elektronik (SPBE) untuk asistensi, penjadwalan tatap muka virtual, dan tindak lanjut rekomendasi desa.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Segmented Mode Selector: Masuk vs Daftar */}
          <div className="flex border-b border-slate-200 bg-slate-50/80">
            <button
              onClick={() => { setAuthMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-3.5 text-center text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                authMode === 'signin'
                  ? 'border-emerald-600 text-emerald-800 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Sistem (Sign In)</span>
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-3.5 text-center text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                authMode === 'signup'
                  ? 'border-emerald-600 text-emerald-800 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Daftar Akun Baru (Sign Up)</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{successMessage}</span>
              </div>
            )}

            {/* TAB 1: FORMULIR MASUK (SIGN IN) */}
            {authMode === 'signin' && (
              <div className="space-y-6">
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  
                  {/* Email Field */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Alamat Email Terdaftar
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="contoh: kades@sukamaju.desa.id"
                        className="w-full text-xs rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(signInEmail);
                          setIsForgotModalOpen(true);
                        }}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        Lupa kata sandi?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        className="w-full text-xs rounded-xl border border-slate-300 pl-10 pr-10 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Ingat sesi masuk pada perangkat ini</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Memverifikasi Akses...</span>
                    ) : (
                      <>
                        <span>Masuk ke Dashboard Pantau Desaku</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick 1-Click Demo Accounts Selector */}
                <div className="pt-5 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Akun Pengujian Cepat (1-Klik Masuk)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Pilih salah satu profil</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Demo 1: Kades Sukamaju */}
                    <button
                      type="button"
                      onClick={() => handleSelectDemoUser(INITIAL_USERS[0])}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-left transition-all group"
                    >
                      <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 truncate">
                        Aparatur Desa
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">H. Ahmad (Kades)</div>
                      <div className="text-[10px] font-mono text-emerald-700 mt-1">kades@sukamaju.desa.id</div>
                    </button>

                    {/* Demo 2: Tim Bidang DPMD */}
                    <button
                      type="button"
                      onClick={() => handleSelectDemoUser(INITIAL_USERS[2])}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-left transition-all group"
                    >
                      <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900 truncate">
                        Tim Bidang DPMD
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">Drs. H. Bambang (Bid. Pemdes)</div>
                      <div className="text-[10px] font-mono text-blue-700 mt-1">ahli@dpmd.go.id</div>
                    </button>

                    {/* Demo 3: Admin DPMD */}
                    <button
                      type="button"
                      onClick={() => handleSelectDemoUser(INITIAL_USERS[4])}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-800 bg-slate-50 hover:bg-slate-100 text-left transition-all group"
                    >
                      <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 truncate">
                        Admin Sekretariat
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">Siti Aminah, S.STP</div>
                      <div className="text-[10px] font-mono text-slate-700 mt-1">admin@pantaudesaku.go.id</div>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: FORMULIR PENDAFTARAN (SIGN UP) */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                
                {/* Pilih Peran Pendaftaran */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-2">
                    Pilih Kategori Peran / Otoritas Pengguna:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                      signUpRole === 'desa' 
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        className="sr-only"
                        checked={signUpRole === 'desa'}
                        onChange={() => setSignUpRole('desa')}
                      />
                      <div className="font-bold text-xs text-slate-900">Aparatur Desa / Kelurahan</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Kades, Sekdes, BPD, Perangkat Desa</div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                      signUpRole === 'narasumber' 
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        className="sr-only"
                        checked={signUpRole === 'narasumber'}
                        onChange={() => setSignUpRole('narasumber')}
                      />
                      <div className="font-bold text-xs text-slate-900">Tim Bidang DPMD</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">5 Bidang Teknis Fasilitator Dinas PMD</div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                      signUpRole === 'admin' 
                        ? 'border-slate-800 bg-slate-100 ring-1 ring-slate-800' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        className="sr-only"
                        checked={signUpRole === 'admin'}
                        onChange={() => setSignUpRole('admin')}
                      />
                      <div className="font-bold text-xs text-slate-900">Admin Sekretariat</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Verifikator & Penjadwal DPMD</div>
                    </label>
                  </div>
                </div>

                {/* Identitas Diri */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nama Lengkap (dengan Gelar) *
                    </label>
                    <input
                      type="text"
                      required
                      value={signUpNama}
                      onChange={(e) => setSignUpNama(e.target.value)}
                      placeholder="contoh: H. Ahmad Sobari, S.Pd"
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={signUpTelepon}
                      onChange={(e) => setSignUpTelepon(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Conditional Fields based on Role */}
                {signUpRole === 'desa' && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Identitas Desa / Kelurahan
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">Nama Desa / Kelurahan</label>
                        <input
                          type="text"
                          required
                          value={signUpDesa}
                          onChange={(e) => setSignUpDesa(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">Kecamatan</label>
                        <input
                          type="text"
                          required
                          value={signUpKecamatan}
                          onChange={(e) => setSignUpKecamatan(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">Jabatan dalam Pemdes</label>
                        <select
                          value={signUpJabatanDesa}
                          onChange={(e) => setSignUpJabatanDesa(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white font-semibold"
                        >
                          <option value="Kepala Desa">Kepala Desa</option>
                          <option value="Lurah">Lurah</option>
                          <option value="Sekretaris Desa">Sekretaris Desa</option>
                          <option value="Kaur Keuangan / Bendahara">Kaur Keuangan / Bendahara</option>
                          <option value="Kaur Perencanaan">Kaur Perencanaan</option>
                          <option value="Ketua BPD">Ketua BPD</option>
                          <option value="Direktur BUMDes">Direktur BUMDes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {signUpRole === 'narasumber' && (
                  <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
                    <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                      Instansi & Keahlian Teknis
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">Instansi / Lembaga</label>
                        <select
                          value={signUpInstansi}
                          onChange={(e) => setSignUpInstansi(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white font-semibold"
                        >
                          <option value="Dinas Pemberdayaan Masyarakat dan Desa (DPMD)">Dinas PMD</option>
                          <option value="Inspektorat Daerah Kabupaten">Inspektorat Daerah</option>
                          <option value="Bagian Hukum Sekretariat Daerah">Bagian Hukum Setda</option>
                          <option value="Badan Perencanaan Pembangunan Daerah (Bappeda)">Bappeda</option>
                          <option value="Badan Pengelolaan Keuangan & Aset Daerah (BPKAD)">BPKAD</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">Jabatan Fungsional</label>
                        <input
                          type="text"
                          required
                          value={signUpJabatanOPD}
                          onChange={(e) => setSignUpJabatanOPD(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">NIP (Opsional)</label>
                        <input
                          type="text"
                          value={signUpNIP}
                          onChange={(e) => setSignUpNIP(e.target.value)}
                          placeholder="1980xxxx..."
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Kedinasan */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Alamat Email Resmi *
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="nama@instansi.desa.id atau nama@gmail.com"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Kata Sandi Baru *
                    </label>
                    <div className="relative">
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full text-xs rounded-xl border border-slate-300 p-2.5 pr-10 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Konfirmasi Kata Sandi *
                    </label>
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  Dengan mendaftar, Anda menyetujui <strong>Pakta Integritas Pelayanan Publik SPBE</strong> dan bertanggung jawab atas kebenaran dokumen yang diunggah untuk keperluan fasilitasi tata kelola desa.
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {loading ? (
                    <span>Mendaftarkan Akun...</span>
                  ) : (
                    <>
                      <span>Daftar Akun Resmi Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Footer Security Notice */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Koneksi Terproteksi Standar SPBE</span>
            </span>
            <span>Tahun Anggaran 2026</span>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 mb-3 text-slate-900">
              <KeyRound className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold">Pemulihan Kata Sandi Akun</h3>
            </div>
            
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Masukkan alamat email terdaftar Anda beserta kata sandi baru untuk mengatur ulang akses ke sistem Pantau Desaku.
            </p>

            {forgotFeedback && (
              <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                forgotFeedback.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {forgotFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{forgotFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Terdaftar</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="email@desa.id"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Simpan Kata Sandi Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
