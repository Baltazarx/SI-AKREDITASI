'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, GraduationCap, Building2, TrendingUp, FileText, LogOut, Menu, X, Landmark, Wallet, ShieldCheck, History, Activity, Sparkles, UserPlus, Moon, Sun, BookOpen, Map, Target, Users2, Award, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', emoji: '🏠', color: 'blue' },
    { icon: Users, label: '(1.A.1) Pimpinan', href: '/dashboard/pimpinan', emoji: '👥', color: 'blue' },
    { icon: Landmark, label: '(1.A.2) Sumber Dana', href: '/dashboard/sumber-dana', emoji: '💰', color: 'indigo' },
    { icon: Wallet, label: '(1.A.3) Penggunaan Dana', href: '/dashboard/penggunaan-dana', emoji: '💵', color: 'emerald' },
    { icon: Activity, label: '(1.A.4) Beban DTPR', href: '/dashboard/beban', emoji: '📋', color: 'green' },
    { icon: GraduationCap, label: '(1.A.5) Tendik', href: '/dashboard/tendik-kualifikasi', emoji: '📈', color: 'amber' },
    { icon: ShieldCheck, label: '(1.B) SPMI', href: '/dashboard/spmi', emoji: '🔍', color: 'sky' },
    { icon: Users, label: '(2.A.1) Data Mahasiswa', href: '/dashboard/data-mahasiswa', emoji: '👥', color: 'violet' },
    { icon: BookOpen, label: '(2.B.1) Isi Pembelajaran', href: '/dashboard/isi-pembelajaran', emoji: '📚', color: 'cyan' },
    { icon: Map, label: '(2.B.2) Pemetaan CPL-PL', href: '/dashboard/pemetaan-cpl-pl', emoji: '🗺️', color: 'teal' },
    { icon: Target, label: '(2.B.3) Peta Pemenuhan CPL', href: '/dashboard/peta-pemenuhan-cpl', emoji: '🎯', color: 'lime' },
    { icon: Users2, label: '(2.B.4-2.B.5) Alumni', href: '/dashboard/alumni', emoji: '🎓', color: 'indigo' },
    { icon: CheckCircle, label: '(2.B.6) Accuracy', href: '/dashboard/accuracy', emoji: '✅', color: 'emerald' },
    { icon: Award, label: '(2.D) Rekognisi', href: '/dashboard/rekognisi', emoji: '🏆', color: 'purple' },
    { icon: Sparkles, label: '(3.A.1) Sarpras Penelitian', href: '/dashboard/sarpras-penelitian', emoji: '🔬', color: 'purple' },
    { icon: BookOpen, label: '(3.A.2) Penelitian DTPR', href: '/dashboard/penelitian-dtpr', emoji: '🔬', color: 'blue' },
    { icon: TrendingUp, label: '(3.A.3) Pengembangan', href: '/dashboard/pengembangan', emoji: '🎯', color: 'violet' },
    { icon: UserPlus, label: '(4.A.1) Sarpras PkM', href: '/dashboard/sarpras-pkm', emoji: '🤝', color: 'pink' },
    { icon: Activity, label: '(4.A.2) PkM DTPR', href: '/dashboard/pkm-dtpr', emoji: '🤝', color: 'orange' },
    { icon: Building2, label: '(5.2) Sarpras Pendidikan', href: '/dashboard/sarpras-pendidikan', emoji: '🏫', color: 'rose' },
    { icon: FileText, label: '(6) Visi Misi', href: '/dashboard/visi-misi', emoji: '📝', color: 'orange' },
  ];

  const masterMenuItems = [
    { icon: Users, label: 'Pegawai', href: '/dashboard/master/pegawai', emoji: '👨‍💼' },
    { icon: GraduationCap, label: 'Dosen', href: '/dashboard/master/dosen', emoji: '🎓' },
    { icon: Briefcase, label: 'Tendik', href: '/dashboard/master/tendik', emoji: '💼' },
    { icon: Building2, label: 'Prodi', href: '/dashboard/master/prodi', emoji: '🏛️' },
    { icon: Users, label: 'Users', href: '/dashboard/master/users', emoji: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 overflow-x-hidden transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            <span className="text-white font-black">A</span>
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Panel Akreditasi</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl transition hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl transition hover:bg-gray-200 dark:hover:bg-gray-700">
            {sidebarOpen ? <X size={24} className="text-gray-900 dark:text-white" /> : <Menu size={24} className="text-gray-900 dark:text-white" />}
          </button>
        </div>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 z-50 w-80 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-all duration-500 ease-out shadow-2xl lg:shadow-none flex flex-col`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200 dark:shadow-blue-900/40">
                  <span className="text-2xl font-black text-white">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">Panel Akreditasi</h1>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">STIKOM PGRI BWX</p>
                </div>
              </div>
              <button onClick={toggleTheme} className="hidden lg:flex p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm border border-gray-100 dark:border-gray-700">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            <nav className="space-y-8 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 scrollbar-hide">
              <div>
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">Main Navigation</h3>
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 rounded-2xl transition-all duration-300 group hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 ${router.pathname === item.href ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${router.pathname === item.href ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110'}`}>
                          <item.icon size={16} />
                        </div>
                        <span className="text-xs font-bold tracking-tight">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">Master Data System</h3>
                <ul className="space-y-1">
                  {masterMenuItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 rounded-2xl transition-all duration-300 group hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                      >
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                          <item.icon size={16} />
                        </div>
                        <span className="text-xs font-bold tracking-tight">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>

          <div className="mt-auto p-8 border-t border-gray-50 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-4 text-gray-400 dark:text-gray-500 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 font-bold group border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
            >
              <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-6 lg:p-12 relative overflow-hidden transition-colors">
          <div className="max-w-6xl mx-auto">
            {/* User Profile Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
              <div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                  Hello, <span className="text-blue-600 dark:text-blue-400">{user?.username || 'Admin'}!</span> 👋
                </h2>
                <p className="text-gray-400 dark:text-gray-500 font-medium tracking-tight">Manage and monitor accreditation data with ease.</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-black">
                  {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="pr-4">
                  <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">{user?.username || 'Administrator'}</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Session</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-200 dark:shadow-blue-900/40 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500"><Activity size={80} /></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Status Sistem</p>
                <p className="text-3xl font-black tracking-tight mb-1 leading-none">Optimal</p>
                <p className="text-xs font-bold opacity-80">All services running</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 relative overflow-hidden group transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-600 group-hover:scale-125 transition-transform duration-500"><Landmark size={80} /></div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Total Modules</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1 leading-none">12 Units</p>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Accreditation Standards</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 relative overflow-hidden group transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 group-hover:scale-125 transition-transform duration-500"><ShieldCheck size={80} /></div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Quality Control</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1 leading-none">SPMI Active</p>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Internal Audit Ready</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 relative overflow-hidden group transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-600 group-hover:scale-125 transition-transform duration-500"><Sparkles size={80} /></div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Update Terakhir</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1 leading-none">Hari Ini</p>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Data Synchronization</p>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="mb-12">
              <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-8 ml-4">Standardized Accreditation Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-1000 delay-500">
                {menuItems.slice(1).map((item) => {
                  const colorMap = {
                    blue: 'hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-blue-100 dark:hover:shadow-blue-900/10',
                    indigo: 'hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-indigo-100 dark:hover:shadow-indigo-900/10',
                    emerald: 'hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-emerald-100 dark:hover:shadow-emerald-900/10',
                    green: 'hover:border-green-200 dark:hover:border-green-900/50 hover:shadow-green-100 dark:hover:shadow-green-900/10',
                    amber: 'hover:border-amber-200 dark:hover:border-amber-900/50 hover:shadow-amber-100 dark:hover:shadow-amber-900/10',
                    sky: 'hover:border-sky-200 dark:hover:border-sky-900/50 hover:shadow-sky-100 dark:hover:shadow-sky-900/10',
                    purple: 'hover:border-purple-200 dark:hover:border-purple-900/50 hover:shadow-purple-100 dark:hover:shadow-purple-900/10',
                    violet: 'hover:border-violet-200 dark:hover:border-violet-900/50 hover:shadow-violet-100 dark:hover:shadow-violet-900/10',
                    pink: 'hover:border-pink-200 dark:hover:border-pink-900/50 hover:shadow-pink-100 dark:hover:shadow-pink-900/10',
                    rose: 'hover:border-rose-200 dark:hover:border-rose-900/50 hover:shadow-rose-100 dark:hover:shadow-rose-900/10',
                    orange: 'hover:border-orange-200 dark:hover:border-orange-900/50 hover:shadow-orange-100 dark:hover:shadow-orange-900/10',
                  };
                  
                  const hoverTheme = colorMap[item.color] || colorMap.blue;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/30 dark:shadow-black/20 transition-all duration-500 hover:-translate-y-2 group ${hoverTheme}`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900/40">
                          <item.icon size={24} />
                        </div>
                        <div className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                          {item.label.split(' ')[0]}
                        </div>
                      </div>
                      <h4 className="text-base font-black text-gray-900 dark:text-white tracking-tight leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.label.split(' ').slice(1).join(' ')}
                      </h4>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-tight">Click to manage and view reports.</p>
                      <div className="mt-6 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-blue-600 rounded-full group-hover:w-full transition-all duration-1000 ease-out"></div>
                        </div>
                        <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-widest">Open</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
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
