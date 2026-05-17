'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark, ShieldCheck, Activity, Sparkles, Building2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const menuItems = [
    { label: '(1.A.1) Pimpinan', href: '/dashboard/pimpinan', color: 'blue' },
    { label: '(1.A.2) Sumber Dana', href: '/dashboard/sumber-dana', color: 'indigo' },
    { label: '(1.A.3) Penggunaan Dana', href: '/dashboard/penggunaan-dana', color: 'emerald' },
    { label: '(1.A.4) Beban DTPR', href: '/dashboard/beban', color: 'green' },
    { label: '(1.A.5) Tendik', href: '/dashboard/tendik-kualifikasi', color: 'amber' },
    { label: '(1.B) SPMI', href: '/dashboard/spmi', color: 'sky' },
    { label: '(2.A.1) Data Mahasiswa', href: '/dashboard/data-mahasiswa', color: 'violet' },
    { label: '(2.B.1) Isi Pembelajaran', href: '/dashboard/isi-pembelajaran', color: 'cyan' },
    { label: '(2.B.2) Pemetaan CPL-PL', href: '/dashboard/pemetaan-cpl-pl', color: 'teal' },
    { label: '(2.B.3) Peta Pemenuhan CPL', href: '/dashboard/peta-pemenuhan-cpl', color: 'lime' },
    { label: '(2.B.4-2.B.5) Alumni', href: '/dashboard/alumni', color: 'indigo' },
    { label: '(2.B.6) Accuracy', href: '/dashboard/accuracy', color: 'emerald' },
    { label: '(2.D) Rekognisi', href: '/dashboard/rekognisi', color: 'purple' },
    { label: '(3.A.1) Sarpras Penelitian', href: '/dashboard/sarpras-penelitian', color: 'purple' },
    { label: '(3.A.2) Penelitian DTPR', href: '/dashboard/penelitian-dtpr', color: 'blue' },
    { label: '(3.A.3) Pengembangan', href: '/dashboard/pengembangan', color: 'violet' },
    { label: '(4.A.1) Sarpras PkM', href: '/dashboard/sarpras-pkm', color: 'pink' },
    { label: '(4.A.2) PkM DTPR', href: '/dashboard/pkm-dtpr', color: 'orange' },
    { label: '(5.2) Sarpras Pendidikan', href: '/dashboard/sarpras-pendidikan', color: 'rose' },
    { label: '(6) Visi Misi', href: '/dashboard/visi-misi', color: 'orange' },
  ];

  return (
    <div className="p-6 lg:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        {/* User Profile Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-white dark:text-white tracking-tight mb-2">
              Hello, <span className="text-blue-600 dark:text-blue-400">{user?.username || 'Admin'}!</span> 👋
            </h2>
            <p className="text-gray-400 dark:text-gray-400 font-medium tracking-tight">Manage and monitor accreditation data with ease.</p>
          </div>
          <div className="bg-gray-900 dark:bg-gray-900 p-2 rounded-2xl shadow-xl shadow-gray-950/50 dark:shadow-black/20 border border-gray-700 dark:border-gray-700 flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 bg-blue-900/20 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-black">
              {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="pr-4">
              <p className="text-xs font-black text-white dark:text-white tracking-tight leading-none mb-1">{user?.username || 'Administrator'}</p>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest">Active Session</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 dark:shadow-blue-900/40 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500"><Activity size={80} /></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Status Sistem</p>
            <p className="text-3xl font-black tracking-tight mb-1 leading-none">Optimal</p>
            <p className="text-xs font-bold opacity-80">All services running</p>
          </div>
          <div className="bg-gray-900 dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-950/50 dark:shadow-black/20 border border-gray-700 dark:border-gray-700 relative overflow-hidden group transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-600 group-hover:scale-125 transition-transform duration-500"><Landmark size={80} /></div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.2em] mb-4">Total Modules</p>
            <p className="text-3xl font-black text-white dark:text-white tracking-tight mb-1 leading-none">20 Units</p>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-400">Accreditation Standards</p>
          </div>
          <div className="bg-gray-900 dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-950/50 dark:shadow-black/20 border border-gray-700 dark:border-gray-700 relative overflow-hidden group transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 group-hover:scale-125 transition-transform duration-500"><ShieldCheck size={80} /></div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.2em] mb-4">Quality Control</p>
            <p className="text-3xl font-black text-white dark:text-white tracking-tight mb-1 leading-none">SPMI Active</p>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-400">Internal Audit Ready</p>
          </div>
          <div className="bg-gray-900 dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-950/50 dark:shadow-black/20 border border-gray-700 dark:border-gray-700 relative overflow-hidden group transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-600 group-hover:scale-125 transition-transform duration-500"><Sparkles size={80} /></div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.2em] mb-4">Update Terakhir</p>
            <p className="text-3xl font-black text-white dark:text-white tracking-tight mb-1 leading-none">Hari Ini</p>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-400">Data Synchronization</p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mb-12">
          <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.3em] mb-8 ml-4">Standardized Accreditation Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => {
              const colorMap = {
                blue: 'hover:border-blue-800 dark:hover:border-blue-900/50 hover:shadow-blue-100 dark:hover:shadow-blue-900/10',
                indigo: 'hover:border-indigo-800 dark:hover:border-indigo-900/50 hover:shadow-indigo-100 dark:hover:shadow-indigo-900/10',
                emerald: 'hover:border-emerald-800 dark:hover:border-emerald-900/50 hover:shadow-emerald-100 dark:hover:shadow-emerald-900/10',
                green: 'hover:border-green-800 dark:hover:border-green-900/50 hover:shadow-green-100 dark:hover:shadow-green-900/10',
                amber: 'hover:border-amber-800 dark:hover:border-amber-900/50 hover:shadow-amber-100 dark:hover:shadow-amber-900/10',
                sky: 'hover:border-sky-800 dark:hover:border-sky-900/50 hover:shadow-sky-100 dark:hover:shadow-sky-900/10',
                purple: 'hover:border-purple-800 dark:hover:border-purple-900/50 hover:shadow-purple-100 dark:hover:shadow-purple-900/10',
                violet: 'hover:border-violet-800 dark:hover:border-violet-900/50 hover:shadow-violet-100 dark:hover:shadow-violet-900/10',
                pink: 'hover:border-pink-800 dark:hover:border-pink-900/50 hover:shadow-pink-100 dark:hover:shadow-pink-900/10',
                rose: 'hover:border-rose-800 dark:hover:border-rose-900/50 hover:shadow-rose-100 dark:hover:shadow-rose-900/10',
                orange: 'hover:border-orange-800 dark:hover:border-orange-900/50 hover:shadow-orange-100 dark:hover:shadow-orange-900/10',
                cyan: 'hover:border-cyan-800 dark:hover:border-cyan-900/50 hover:shadow-cyan-100 dark:hover:shadow-cyan-900/10',
                teal: 'hover:border-teal-800 dark:hover:border-teal-900/50 hover:shadow-teal-100 dark:hover:shadow-teal-900/10',
                lime: 'hover:border-lime-800 dark:hover:border-lime-900/50 hover:shadow-lime-100 dark:hover:shadow-lime-900/10',
              };
              
              const hoverTheme = colorMap[item.color] || colorMap.blue;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`bg-gray-900 dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-700 dark:border-gray-700 shadow-xl shadow-gray-950/30 dark:shadow-black/20 transition-all duration-500 hover:-translate-y-2 group ${hoverTheme}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gray-950/50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-900/20 dark:group-hover:shadow-blue-900/40">
                      <Sparkles size={24} />
                    </div>
                    <div className="text-[10px] font-black text-gray-300 dark:text-gray-400 uppercase tracking-widest group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {item.label.split(' ')[0]}
                    </div>
                  </div>
                  <h4 className="text-base font-black text-white dark:text-white tracking-tight leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.label.split(' ').slice(1).join(' ')}
                  </h4>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-400 tracking-tight">Click to manage and view reports.</p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-gray-950/50 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-blue-600 rounded-full group-hover:w-full transition-all duration-1000 ease-out"></div>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-widest">Open</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
