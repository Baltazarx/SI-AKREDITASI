'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard, Users, Briefcase, GraduationCap, Building2,
  TrendingUp, FileText, LogOut, Menu, X, Landmark, Wallet,
  ShieldCheck, Activity, Sparkles, UserPlus, Moon, Sun,
  BookOpen, Map, Target, Users2, Award, CheckCircle,
  ChevronDown, ChevronRight, Folder, FileJson, UserCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
    } else if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }

    // Auto-expand items based on current path
    const currentMenuItem = menuItems.find(item => pathname.startsWith(item.href));
    if (currentMenuItem && currentMenuItem.children) {
      setExpandedItems(prev => ({ ...prev, [currentMenuItem.label]: true }));
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const toggleExpand = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Semua roles yang dapat mengakses menu (ADMIN bisa akses semua)
  const ALL_ROLES = ['ADMIN', 'UPPS', 'WAKET 2', 'KEUANGAN', 'SARPRAS', 'TPM', 'PMB', 'ALA', 'PRODI', 'KEMAHASISWAAN', 'LPPM', 'SISFO'];

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard Home', href: '/dashboard', emoji: '🏠', color: 'blue', roles: ALL_ROLES },
    { icon: Users, label: '(1.A.1) Pimpinan', href: '/dashboard/pimpinan', emoji: '👥', color: 'blue', roles: ['ADMIN', 'UPPS'] },
    { icon: Landmark, label: '(1.A.2) Sumber Dana', href: '/dashboard/sumber-dana', emoji: '💰', color: 'indigo', roles: ['ADMIN', 'WAKET 2', 'KEUANGAN'] },
    { icon: Wallet, label: '(1.A.3) Penggunaan Dana', href: '/dashboard/penggunaan-dana', emoji: '💵', color: 'emerald', roles: ['ADMIN', 'WAKET 2', 'KEUANGAN'] },
    { icon: Activity, label: '(1.A.4) Beban DTPR', href: '/dashboard/beban', emoji: '📋', color: 'green', roles: ['ADMIN', 'UPPS'] },
    { icon: GraduationCap, label: '(1.A.5) Tendik', href: '/dashboard/tendik-kualifikasi', emoji: '📈', color: 'amber', roles: ['ADMIN', 'SARPRAS'] },
    { icon: ShieldCheck, label: '(1.B) SPMI', href: '/dashboard/spmi', emoji: '🔍', color: 'sky', roles: ['ADMIN', 'TPM'] },
    { icon: Users, label: '(2.A.1) Data Mahasiswa', href: '/dashboard/data-mahasiswa', emoji: '👥', color: 'violet', roles: ['ADMIN', 'PMB', 'ALA'] },
    { icon: Users, label: '(2.A.2) Keragaman Asal Mhs', href: '/dashboard/pmb/2a2-keragaman-asal', emoji: '🌍', color: 'blue', roles: ['ADMIN', 'PMB'] },
    { icon: Users, label: '(2.A.3) Kondisi Jumlah Mhs', href: '/dashboard/pmb/2a3-kondisi-mahasiswa', emoji: '📊', color: 'emerald', roles: ['ADMIN', 'ALA'] },
    { icon: BookOpen, label: '(2.B.1) Isi Pembelajaran', href: '/dashboard/isi-pembelajaran', emoji: '📚', color: 'cyan', roles: ['ADMIN', 'PRODI'] },
    { icon: Map, label: '(2.B.2) Pemetaan CPL-PL', href: '/dashboard/pemetaan-cpl-pl', emoji: '🗺️', color: 'teal', roles: ['ADMIN', 'PRODI'] },
    { icon: Target, label: '(2.B.3) Peta Pemenuhan CPL', href: '/dashboard/peta-pemenuhan-cpl', emoji: '🎯', color: 'lime', roles: ['ADMIN', 'PRODI'] },
    { icon: Activity, label: '(2.C) Fleksibilitas Pembelajaran', href: '/dashboard/fleksibilitas-pembelajaran', emoji: '🔄', color: 'emerald', roles: ['ADMIN', 'PRODI'] },
    { icon: Target, label: 'CPL', href: '/dashboard/master/cpl', emoji: '🎯', color: 'teal', roles: ['ADMIN', 'PRODI'] },
    { icon: Target, label: 'CPMK', href: '/dashboard/master/cpmk', emoji: '⚙️', color: 'cyan', roles: ['ADMIN', 'PRODI'] },
    { icon: BookOpen, label: 'Mata Kuliah', href: '/dashboard/master/mata-kuliah', emoji: '📚', color: 'sky', roles: ['ADMIN', 'PRODI'] },
    { icon: UserCheck, label: 'Profil Lulusan', href: '/dashboard/master/profil-lulusan', emoji: '👤', color: 'indigo', roles: ['ADMIN', 'PRODI'] },
    { icon: Users2, label: '(2.B.4) Masa Tunggu Lulusan', href: '/dashboard/alumni', emoji: '🎓', color: 'indigo', roles: ['ADMIN', 'KEMAHASISWAAN'] },
    { icon: TrendingUp, label: '(2.B.5) Kesesuaian & Lingkup Kerja', href: '/dashboard/alumni', emoji: '📈', color: 'violet', roles: ['ADMIN', 'KEMAHASISWAAN'] },
    { icon: CheckCircle, label: '(2.B.6) Accuracy', href: '/dashboard/accuracy', emoji: '✅', color: 'emerald', roles: ['ADMIN', 'KEMAHASISWAAN'] },
    { icon: Award, label: '(2.D) Rekognisi', href: '/dashboard/rekognisi', emoji: '🏆', color: 'purple', roles: ['ADMIN', 'KEMAHASISWAAN'] },
    { icon: Sparkles, label: '(3.A.1) Sarpras Penelitian', href: '/dashboard/sarpras-penelitian', emoji: '🔬', color: 'purple', roles: ['ADMIN', 'SARPRAS'] },
    {
      icon: Folder,
      label: '(3.A.2) Penelitian DTPR, Hibah dan Pembiayaan Penelitian',
      href: '/dashboard/penelitian-dtpr',
      emoji: '🔬',
      color: 'blue',
      alwaysExpanded: true,
      roles: ['ADMIN', 'LPPM'],
      children: [
        { label: 'Tabel 3.C.1 Kerjasama Penelitian', href: '/dashboard/penelitian-dtpr?tab=3c1' },
        { label: 'Tabel 3.C.2 Publikasi Penelitian', href: '/dashboard/penelitian-dtpr?tab=3c2' },
        { label: 'Tabel 3.C.3 Perolehan HKI (Granted)', href: '/dashboard/penelitian-dtpr?tab=3c3' },
      ]
    },
    { icon: TrendingUp, label: '(3.A.3) Pengembangan', href: '/dashboard/pengembangan', emoji: '🎯', color: 'violet', roles: ['ADMIN', 'UPPS'] },
    { icon: UserPlus, label: '(4.A.1) Sarpras PkM', href: '/dashboard/sarpras-pkm', emoji: '🤝', color: 'pink', roles: ['ADMIN', 'SARPRAS'] },
    {
      icon: Folder,
      label: '(4.A.2) PkM DTPR, Hibah dan Pembiayaan PkM',
      href: '/dashboard/pkm-dtpr',
      emoji: '🤝',
      color: 'orange',
      alwaysExpanded: true,
      roles: ['ADMIN', 'LPPM'],
      children: [
        { label: 'Tabel 4.C.1 Kerjasama PkM', href: '/dashboard/pkm-dtpr?tab=4c1' },
        { label: 'Tabel 4.C.2 Diseminasi Hasil PkM', href: '/dashboard/pkm-dtpr?tab=4c2' },
        { label: 'Tabel 4.C.3 Perolehan HKI PkM', href: '/dashboard/pkm-dtpr?tab=4c3' },
      ]
    },
    { icon: ShieldCheck, label: '(5.1) Sistem Tata Kelola', href: '/dashboard/tata-kelola', emoji: '🖥️', color: 'blue', roles: ['ADMIN', 'SISFO'] },
    { icon: Building2, label: '(5.2) Sarpras Pendidikan', href: '/dashboard/sarpras-pendidikan', emoji: '🏫', color: 'rose', roles: ['ADMIN', 'SARPRAS', 'SISFO'] },
    { icon: Map, label: 'Roadmap LPPM', href: '/dashboard/master/roadmap-lppm', emoji: '🗺️', color: 'teal', roles: ['ADMIN', 'LPPM'] },
    { icon: FileText, label: '(6) Visi Misi', href: '/dashboard/visi-misi', emoji: '📝', color: 'orange', roles: ['ADMIN', 'UPPS'] },
  ];

  // Filter menu sesuai role user yang login
  const userUnit = user?.unit || '';
  const isAdmin = userUnit === 'ADMIN';
  const filteredMenuItems = menuItems.filter(item => 
    isAdmin || !item.roles || item.roles.includes(userUnit)
  );

  const masterMenuItems = [
    { icon: Users, label: 'Pegawai', href: '/dashboard/master/pegawai', emoji: '👨‍💼' },
    { icon: GraduationCap, label: 'Dosen', href: '/dashboard/master/dosen', emoji: '🎓' },
    { icon: Briefcase, label: 'Tendik', href: '/dashboard/master/tendik', emoji: '💼' },
    { icon: Building2, label: 'Prodi', href: '/dashboard/master/prodi', emoji: '🏛️' },
    { icon: Users, label: 'Users', href: '/dashboard/master/users', emoji: '👥' },
  ];

  // Default viewMode adalah 'standard' (tampilan flat/langsung tabel)
  const [viewMode, setViewMode] = useState('standard');
  useEffect(() => {
    // Admin bisa pilih, tapi user biasa dipaksa ke standard view (flat)
    if (user && user.unit !== 'ADMIN') {
      setViewMode('standard');
    }
  }, [user]);

  // Route Guard: Redirect non-admin jika akses URL yang tidak diizinkan
  useEffect(() => {
    if (!user || user.unit === 'ADMIN') return;
    const currentMenuItem = menuItems.find(item => {
      if (item.children) return item.children.some(c => pathname === c.href.split('?')[0]);
      return pathname === item.href;
    });
    if (currentMenuItem && currentMenuItem.roles && !currentMenuItem.roles.includes(user.unit)) {
      router.push('/dashboard');
    }
  }, [pathname, user]);

  const roleBasedMenuItems = [
    {
      label: 'UPPS',
      icon: ShieldCheck,
      emoji: '🏛️',
      color: 'blue',
      roles: ['UPPS'],
      children: [
        { label: 'Tabel 1.A.1 Pimpinan & Tupoksi', href: '/dashboard/pimpinan' },
        { label: 'Tabel 1.A.4 Beban DTPR', href: '/dashboard/beban' },
        { label: 'Tabel 3.A.3 Pengembangan DTPR', href: '/dashboard/pengembangan' },
        { label: 'Tabel 6 Visi Misi', href: '/dashboard/visi-misi' },
      ]
    },
    {
      label: 'WAKET 2 & KEUANGAN',
      icon: Wallet,
      emoji: '💰',
      color: 'emerald',
      roles: ['WAKET 2', 'KEUANGAN'],
      children: [
        { label: 'Tabel 1.A.2 Sumber Dana', href: '/dashboard/sumber-dana' },
        { label: 'Tabel 1.A.3 Penggunaan Dana', href: '/dashboard/penggunaan-dana' },
      ]
    },
    {
      label: 'SARPRAS',
      icon: Building2,
      emoji: '🏫',
      color: 'rose',
      roles: ['SARPRAS'],
      children: [
        { label: 'Tabel 1.A.5 Tendik (Kualifikasi)', href: '/dashboard/tendik-kualifikasi' },
        { label: 'Tabel 3.A.1 Sarpras Penelitian', href: '/dashboard/sarpras-penelitian' },
        { label: 'Tabel 4.A.1 Sarpras PkM', href: '/dashboard/sarpras-pkm' },
        { label: 'Tabel 5.2 Sarpras Pendidikan', href: '/dashboard/sarpras-pendidikan' },
      ]
    },
    {
      label: 'TPM',
      icon: ShieldCheck,
      emoji: '🔍',
      color: 'sky',
      roles: ['TPM'],
      children: [
        { label: 'Tabel 1.B SPMI', href: '/dashboard/spmi' },
      ]
    },
    {
      label: 'PMB',
      icon: Users,
      emoji: '👥',
      color: 'violet',
      roles: ['PMB'],
      children: [
        { label: 'Tabel 2.A.1 Data Mahasiswa', href: '/dashboard/data-mahasiswa' },
        { label: 'Tabel 2.A.2 Keragaman Asal Mhs', href: '/dashboard/pmb/2a2-keragaman-asal' },
      ]
    },
    {
      label: 'ALA',
      icon: Users,
      emoji: '👥',
      color: 'indigo',
      roles: ['ALA'],
      children: [
        { label: 'Tabel 2.A.1 Data Mahasiswa', href: '/dashboard/data-mahasiswa' },
        { label: 'Tabel 2.A.3 Kondisi Jumlah Mhs', href: '/dashboard/pmb/2a3-kondisi-mahasiswa' },
      ]
    },
    {
      label: 'PRODI',
      icon: BookOpen,
      emoji: '🎓',
      color: 'cyan',
      roles: ['PRODI'],
      children: [
        { label: 'Tabel 2.B.1 Isi Pembelajaran', href: '/dashboard/isi-pembelajaran' },
        { label: 'Tabel 2.B.2 Pemetaan CPL-PL', href: '/dashboard/pemetaan-cpl-pl' },
        { label: 'Tabel 2.B.3 Peta Pemenuhan CPL', href: '/dashboard/peta-pemenuhan-cpl' },
        { label: 'Tabel 2.C Fleksibilitas Pembelajaran', href: '/dashboard/fleksibilitas-pembelajaran' },
        { label: 'Tabel CPL', href: '/dashboard/master/cpl' },
        { label: 'Tabel CPMK', href: '/dashboard/master/cpmk' },
        { label: 'Tabel Mata Kuliah', href: '/dashboard/master/mata-kuliah' },
        { label: 'Tabel Profil Lulusan', href: '/dashboard/master/profil-lulusan' },
      ]
    },
    {
      label: 'KEMAHASISWAAN',
      icon: Award,
      emoji: '🏆',
      color: 'purple',
      roles: ['KEMAHASISWAAN'],
      children: [
        { label: 'Tabel 2.B.4 Masa Tunggu', href: '/dashboard/alumni' },
        { label: 'Tabel 2.B.5 Kesesuaian Kerja', href: '/dashboard/alumni' },
        { label: 'Tabel 2.B.6 Kepuasan Pengguna', href: '/dashboard/accuracy' },
        { label: 'Tabel 2.D Rekognisi', href: '/dashboard/rekognisi' },
      ]
    },
    {
      label: 'LPPM',
      icon: Map,
      emoji: '🗺️',
      color: 'teal',
      roles: ['LPPM'],
      children: [
        { label: 'Tabel 3.A.2 Penelitian DTPR & Hibah', href: '/dashboard/penelitian-dtpr' },
        { label: '└─ 3.C.1 Kerjasama Penelitian', href: '/dashboard/penelitian-dtpr?tab=3c1' },
        { label: '└─ 3.C.2 Publikasi Penelitian', href: '/dashboard/penelitian-dtpr?tab=3c2' },
        { label: '└─ 3.C.3 Perolehan HKI (Granted)', href: '/dashboard/penelitian-dtpr?tab=3c3' },
        { label: 'Tabel 4.A.2 PkM DTPR & Hibah', href: '/dashboard/pkm-dtpr' },
        { label: '└─ 4.C.1 Kerjasama PkM', href: '/dashboard/pkm-dtpr?tab=4c1' },
        { label: '└─ 4.C.2 Diseminasi Hasil PkM', href: '/dashboard/pkm-dtpr?tab=4c2' },
        { label: '└─ 4.C.3 Perolehan HKI PkM', href: '/dashboard/pkm-dtpr?tab=4c3' },
        { label: 'Tabel Roadmap LPPM', href: '/dashboard/master/roadmap-lppm' },
      ]
    },
    {
      label: 'SISFO',
      icon: ShieldCheck,
      emoji: '🖥️',
      color: 'blue',
      roles: ['SISFO'],
      children: [
        { label: 'Tabel 5.1 Sistem Tata Kelola', href: '/dashboard/tata-kelola' },
      ]
    }
  ];

  const renderMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.alwaysExpanded || expandedItems[item.label];
    const isActive = pathname === item.href || (hasChildren && pathname.startsWith(item.href));

    // Dynamic color mapping for glow effects
    const colorMap = {
      blue: 'from-blue-600/20 to-transparent shadow-blue-900/10',
      emerald: 'from-emerald-600/20 to-transparent shadow-emerald-900/10',
      rose: 'from-rose-600/20 to-transparent shadow-rose-900/10',
      sky: 'from-sky-600/20 to-transparent shadow-sky-900/10',
      violet: 'from-violet-600/20 to-transparent shadow-violet-900/10',
      cyan: 'from-cyan-600/20 to-transparent shadow-cyan-900/10',
      purple: 'from-purple-600/20 to-transparent shadow-purple-900/10',
      teal: 'from-teal-600/20 to-transparent shadow-teal-900/10',
      orange: 'from-orange-600/20 to-transparent shadow-orange-900/10',
    };

    const activeColorMap = {
      blue: 'bg-blue-600',
      emerald: 'bg-emerald-600',
      rose: 'bg-rose-600',
      sky: 'bg-sky-600',
      violet: 'bg-violet-600',
      cyan: 'bg-cyan-600',
      purple: 'bg-purple-600',
      teal: 'bg-teal-600',
      orange: 'bg-orange-600',
    };

    return (
      <li key={item.label} className="list-none mb-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 group/item">
            <Link
              href={item.href || '#'}
              onClick={(e) => {
                // Hanya blokir navigasi untuk item collapsible (bukan alwaysExpanded)
                if (!item.href || (hasChildren && !item.alwaysExpanded)) e.preventDefault();
                if (hasChildren && !item.alwaysExpanded) {
                  toggleExpand(item.label);
                }
              }}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-500 border border-transparent relative overflow-hidden ${isActive ? `bg-gradient-to-r ${colorMap[item.color || 'blue']} border-white/5 shadow-2xl` : 'hover:bg-gray-800/40 hover:border-white/5'}`}
            >
              {/* Active Glow */}
              {isActive && <div className={`absolute left-0 top-0 w-1 h-full ${activeColorMap[item.color || 'blue']} shadow-[0_0_15px_rgba(37,99,235,0.5)]`}></div>}

              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${isActive ? `${activeColorMap[item.color || 'blue']} text-white shadow-xl scale-110` : 'bg-gray-800 text-gray-500 group-hover/item:text-white group-hover/item:scale-110 group-hover/item:bg-gray-700'}`}>
                {hasChildren ? (isExpanded ? <Folder size={18} className="animate-pulse" /> : <Folder size={18} />) : <item.icon size={18} />}
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <span className={`text-[10px] font-black tracking-[0.05em] uppercase whitespace-nowrap truncate transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover/item:text-gray-200'}`}>
                  {item.label}
                </span>
                {item.emoji && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs opacity-20 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500">{item.emoji}</span>}
              </div>

              {hasChildren && (
                <div className={`flex items-center gap-2 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  <span className="text-[9px] font-black px-2 py-0.5 bg-gray-950/50 rounded-full border border-white/5">{item.children.length}</span>
                </div>
              )}
            </Link>

            {hasChildren && !item.alwaysExpanded && (
              <button
                onClick={(e) => { e.preventDefault(); toggleExpand(item.label); }}
                className={`p-2.5 rounded-xl transition-all duration-500 ${isExpanded ? 'bg-gray-800 text-blue-500 rotate-180' : 'text-gray-500 hover:bg-gray-800 hover:text-white'}`}
              >
                <ChevronDown size={14} />
              </button>
            )}
          </div>

          {/* Children / State-of-the-art Submenu */}
          {hasChildren && isExpanded && (
            <div className="ml-12 mt-2 mb-3 space-y-1 relative">
              {/* Tree Line */}
              <div className="absolute left-[-16px] top-0 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-gray-800 to-transparent"></div>
              
              {item.children.map((child, idx) => {
                const childTab = child.href.split('tab=')[1];
                const activeTab = searchParams.get('tab');
                const isChildActive = pathname === child.href.split('?')[0] && (childTab ? activeTab === childTab : true);
                
                return (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="relative group/child block"
                  >
                    {/* Horizontal Connector */}
                    <div className={`absolute left-[-16px] top-1/2 w-4 h-px transition-colors duration-300 ${isChildActive ? 'bg-blue-500' : 'bg-gray-800 group-hover/child:bg-gray-600'}`}></div>
                    
                    <div className={`flex items-center gap-3 pl-5 py-2.5 rounded-xl transition-all duration-300 ${isChildActive ? 'bg-blue-900/20 text-blue-400 border-l-2 border-blue-500 pl-4' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isChildActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] scale-125' : 'bg-gray-700 group-hover/child:bg-gray-400'}`}></div>
                      <span className="text-[9px] font-bold tracking-wide uppercase leading-tight">{child.label.replace('└─ ', '')}</span>
                      
                      {isChildActive && (
                        <div className="absolute right-3 w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 relative selection:bg-blue-900 selection:text-blue-100 overflow-x-hidden transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-900/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-900/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-4 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <span className="text-white font-black">A</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">Panel Akreditasi</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme toggle removed */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-800 rounded-xl transition hover:bg-gray-700">
            {sidebarOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed top-0 left-0 z-50 w-[400px] h-screen bg-gray-900 border-r border-gray-800 transform transition-all duration-500 ease-out shadow-2xl lg:shadow-none flex flex-col`}>
          <div className="p-8 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/40">
                  <span className="text-2xl font-black text-white">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight leading-none mb-1">Panel Akreditasi</h1>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">STIKOM PGRI BWX</p>
                </div>
              </div>
            </div>

            {/* View Switcher - Hanya untuk ADMIN */}
            {isAdmin && (
              <div className="flex p-1 bg-gray-950/50 rounded-2xl border border-gray-800 mb-8">
                <button
                  onClick={() => setViewMode('standard')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'standard' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <TrendingUp size={14} />
                  Standard View
                </button>
                <button
                  onClick={() => setViewMode('role')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'role' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Users size={14} />
                  Role View
                </button>
              </div>
            )}

            <nav className="space-y-8 overflow-y-auto pr-2 scrollbar-hide flex-1 pb-10">
              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">
                  {isAdmin && viewMode === 'role' ? 'Role-Based Folders' : 'Main Navigation'}
                </h3>
                <ul className="space-y-1">
                  {isAdmin && viewMode === 'role'
                    ? roleBasedMenuItems.map(renderMenuItem)
                    : filteredMenuItems.map(renderMenuItem)
                  }
                </ul>
              </div>

              {/* Master Data - Hanya ADMIN */}
              {isAdmin && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4 text-emerald-500/80">Master Data System</h3>
                  <ul className="space-y-1">
                    {masterMenuItems.map(renderMenuItem)}
                  </ul>
                </div>
              )}
            </nav>
          </div>

          <div className="p-8 border-t border-gray-800">
            {user && (
              <div className="mb-6 flex items-center gap-3 p-3 bg-gray-800/50 rounded-2xl border border-gray-700 transition-colors">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
                  {user.username?.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-[10px] font-black text-white truncate">{user.username}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-blue-900/50 text-blue-400 border border-blue-900/50">
                      {user.unit}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-4 text-gray-500 rounded-2xl hover:bg-red-900/10 hover:text-red-400 transition-all duration-300 font-bold group border border-transparent hover:border-red-900/30"
            >
              <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-[400px] min-h-screen relative overflow-x-hidden min-w-0 transition-colors">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
