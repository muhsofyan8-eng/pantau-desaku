import { UserAccount, UserRole } from '../types/clinic';
import { addActivityLog } from './storageService';

const AUTH_KEYS = {
  USERS: 'pantaudesaku_users_v1',
  CURRENT_USER: 'pantaudesaku_session_user_v1'
};

// Default seed accounts for instant login & demonstration
export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-DESA-01',
    nama: 'H. Ahmad Sobari, S.Pd',
    email: 'kades@sukamaju.desa.id',
    password: 'password123',
    role: 'desa',
    jabatan: 'Kepala Desa',
    instansi: 'Pemerintah Desa Sukamaju',
    namaDesaKelurahan: 'Desa Sukamaju',
    kecamatan: 'Kecamatan Cilaku',
    kabupaten: 'Kabupaten Cianjur',
    telepon: '0812-3456-7890',
    tanggalDaftar: '2026-01-10',
    terakhirLogin: '2026-10-18 09:15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-DESA-02',
    nama: 'Ir. Budi Santoso',
    email: 'sekdes@sukamaju.desa.id',
    password: 'password123',
    role: 'desa',
    jabatan: 'Sekretaris Desa',
    instansi: 'Pemerintah Desa Sukamaju',
    namaDesaKelurahan: 'Desa Sukamaju',
    kecamatan: 'Kecamatan Cilaku',
    kabupaten: 'Kabupaten Cianjur',
    telepon: '0813-8899-7711',
    tanggalDaftar: '2026-01-15',
    terakhirLogin: '2026-10-18 08:30',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-BIDANG-01',
    nama: 'Drs. H. Bambang Suhartono, M.Si',
    email: 'bidang.pemdes@dpmd.go.id',
    password: 'password123',
    role: 'narasumber',
    jabatan: 'Kepala Bidang Pemerintahan Desa & Kelurahan',
    instansi: 'Dinas Pemberdayaan Masyarakat dan Desa (DPMD)',
    nip: '19740512 199903 1 004',
    telepon: '0811-2233-4455',
    tanggalDaftar: '2025-11-01',
    terakhirLogin: '2026-10-18 10:00',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-BIDANG-02',
    nama: 'Agus Triyono, S.E., M.M.',
    email: 'bidang.ekonomi@dpmd.go.id',
    password: 'password123',
    role: 'narasumber',
    jabatan: 'Kepala Bidang Usaha Ekonomi Desa dan TTG',
    instansi: 'Dinas Pemberdayaan Masyarakat dan Desa (DPMD)',
    nip: '19850614 201001 1 015',
    telepon: '0812-9988-7766',
    tanggalDaftar: '2025-12-05',
    terakhirLogin: '2026-10-17 16:45',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-ADMIN-01',
    nama: 'Siti Aminah, S.STP',
    email: 'admin@pantaudesaku.go.id',
    password: 'password123',
    role: 'admin',
    jabatan: 'Sekretariat Fasilitasi & Penjadwalan DPMD',
    instansi: 'Dinas Pemberdayaan Masyarakat dan Desa',
    nip: '19880324 201001 2 003',
    telepon: '0813-1122-3344',
    tanggalDaftar: '2025-10-01',
    terakhirLogin: '2026-10-18 07:45',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

// Retrieve all stored accounts
export const getStoredUsers = (): UserAccount[] => {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
};

// Save accounts list
export const saveStoredUsers = (users: UserAccount[]) => {
  localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
};

// Get active session user
export const getCurrentUser = (): UserAccount | null => {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
    if (!raw) {
      // Default auto-login to Desa account for convenient exploration
      const defaultUser = INITIAL_USERS[0];
      localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS[0];
  }
};

// Login with email and password
export const login = (email: string, password: string): { success: boolean; user?: UserAccount; message?: string } => {
  const users = getStoredUsers();
  const cleanEmail = email.trim().toLowerCase();
  
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!found) {
    return { 
      success: false, 
      message: 'Email belum terdaftar dalam sistem Pantau Desaku. Silakan periksa kembali atau lakukan pendaftaran.' 
    };
  }

  if (found.password && found.password !== password) {
    return { 
      success: false, 
      message: 'Kata sandi tidak sesuai. Pastikan huruf besar/kecil dimasukkan dengan benar.' 
    };
  }

  // Update last login
  const now = new Date();
  const dateStr = `${now.toISOString().substring(0, 10)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const updatedUser: UserAccount = {
    ...found,
    terakhirLogin: dateStr
  };

  const updatedList = users.map(u => u.id === found.id ? updatedUser : u);
  saveStoredUsers(updatedList);
  localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(updatedUser));

  addActivityLog(
    updatedUser.nama,
    updatedUser.role,
    `Berhasil masuk ke dalam sistem (${updatedUser.jabatan} - ${updatedUser.instansi})`
  );

  return { success: true, user: updatedUser };
};

// Register new account (Sign Up)
export const signup = (data: {
  nama: string;
  email: string;
  password: string;
  role: UserRole;
  jabatan: string;
  instansi: string;
  namaDesaKelurahan?: string;
  kecamatan?: string;
  kabupaten?: string;
  nip?: string;
  telepon: string;
}): { success: boolean; user?: UserAccount; message?: string } => {
  const users = getStoredUsers();
  const cleanEmail = data.email.trim().toLowerCase();

  // Check duplicate
  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { 
      success: false, 
      message: 'Email ini sudah terdaftar. Silakan masuk menggunakan akun yang sudah ada.' 
    };
  }

  const now = new Date();
  const dateStr = now.toISOString().substring(0, 10);
  const timeStr = `${dateStr} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const newId = `USR-${data.role.toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const newUser: UserAccount = {
    id: newId,
    nama: data.nama.trim(),
    email: cleanEmail,
    password: data.password,
    role: data.role,
    jabatan: data.jabatan.trim(),
    instansi: data.instansi.trim(),
    namaDesaKelurahan: data.namaDesaKelurahan?.trim(),
    kecamatan: data.kecamatan?.trim(),
    kabupaten: data.kabupaten?.trim() || 'Kabupaten Cianjur',
    nip: data.nip?.trim(),
    telepon: data.telepon.trim(),
    tanggalDaftar: dateStr,
    terakhirLogin: timeStr
  };

  const updatedUsers = [newUser, ...users];
  saveStoredUsers(updatedUsers);
  localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(newUser));

  addActivityLog(
    newUser.nama,
    newUser.role,
    `Pendaftaran akun baru berhasil sebagai ${newUser.jabatan} (${newUser.instansi})`
  );

  return { success: true, user: newUser };
};

// Log out active user
export const logout = () => {
  const current = getCurrentUser();
  if (current) {
    addActivityLog(
      current.nama,
      current.role,
      `Keluar dari sistem (Log Out)`
    );
  }
  localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
};

// Update profile details
export const updateProfile = (userId: string, updates: Partial<UserAccount>): UserAccount | null => {
  const users = getStoredUsers();
  let updatedUser: UserAccount | null = null;

  const newList = users.map(u => {
    if (u.id === userId) {
      updatedUser = { ...u, ...updates };
      return updatedUser;
    }
    return u;
  });

  if (updatedUser) {
    saveStoredUsers(newList);
    const current = getCurrentUser();
    if (current && current.id === userId) {
      localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    }
  }

  return updatedUser;
};

// Reset password simulation
export const resetPassword = (email: string, newPass: string): { success: boolean; message: string } => {
  const users = getStoredUsers();
  const cleanEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return { success: false, message: 'Email tidak ditemukan dalam basis data pengguna terdaftar.' };
  }

  const updatedUsers = users.map(u => {
    if (u.id === user.id) {
      return { ...u, password: newPass };
    }
    return u;
  });

  saveStoredUsers(updatedUsers);
  return { success: true, message: 'Kata sandi berhasil diperbarui. Silakan masuk menggunakan kata sandi baru.' };
};
