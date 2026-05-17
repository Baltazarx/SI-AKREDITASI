'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, UserCheck, GraduationCap, FileText, AlignLeft, Lock } from 'lucide-react';

export default function ProfilLulusanPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [prodiList, setProdiList] = useState([]);
  const [user, setUser] = useState(null);

  // Filters
  const [filterProdi, setFilterProdi] = useState('');
  const [openFilterProdi, setOpenFilterProdi] = useState(false);

  const [formData, setFormData] = useState({
    id_prodi: '',
    deskripsi_pl: '',
  });

  const checkProdiRole = (currentUser) => {
    if (!currentUser) return null;
    const username = (currentUser.username || '').toUpperCase();
    const unit = (currentUser.unit || '').toUpperCase();
    
    if (username.includes('PRODI-TI') || unit.includes('PRODI-TI') || username.includes('PRODITI') || unit.includes('PRODITI') || username === 'TI' || unit === 'TI') {
      return 'TI'; // Teknik Informatika
    }
    if (username.includes('PRODI-MI') || unit.includes('PRODI-MI') || username.includes('PRODIMI') || unit.includes('PRODIMI') || username === 'MI' || unit === 'MI') {
      return 'MI'; // Manajemen Informatika
    }
    return null;
  };

  const prodiRole = checkProdiRole(user);
  const isLocked = prodiRole === 'TI' || prodiRole === 'MI';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      router.push('/login');
    } else {
      let currentUser = null;
      if (userData) {
        currentUser = JSON.parse(userData);
        setUser(currentUser);
      }
      fetchProdiList(currentUser);
    }
  }, [router]);

  useEffect(() => {
    if (filterProdi) {
      fetchData();
    } else {
      setData([]);
    }
  }, [filterProdi]);

  const fetchProdiList = async (currentUser) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setProdiList(result.data);
        if (result.data.length > 0) {
          const prodiRole = checkProdiRole(currentUser);
          if (prodiRole === 'TI') {
            const tiProdi = result.data.find(p => p.nama_prodi.toUpperCase().includes('TEKNIK INFORMATIKA') || p.nama_prodi.toUpperCase().includes('INFORMATIKA'));
            if (tiProdi) {
              setFilterProdi(tiProdi.id_prodi);
              return;
            }
          } else if (prodiRole === 'MI') {
            const miProdi = result.data.find(p => p.nama_prodi.toUpperCase().includes('MANAJEMEN INFORMATIKA') || p.nama_prodi.toUpperCase().includes('MANAJEMEN'));
            if (miProdi) {
              setFilterProdi(miProdi.id_prodi);
              return;
            }
          }
          // Default fallback
          setFilterProdi(result.data[0].id_prodi);
        }
      }
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/profil-lulusan?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/master/profil-lulusan/${editingId}`
      : 'http://localhost:5000/api/master/profil-lulusan';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      alert(result.message);
      if (filterProdi) fetchData();
      resetForm();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_pl);
    setFormData({
      id_prodi: item.id_prodi,
      deskripsi_pl: item.deskripsi_pl,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus profil lulusan ini secara permanen?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/profil-lulusan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || '',
      deskripsi_pl: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-950/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Master Profil Lulusan (PL)</h1>
              <p className="text-gray-400 mt-1 font-medium italic">Kelola profil lulusan Program Studi sebagai acuan capaian pembelajaran</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Profil Lulusan'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 p-6 mb-8 shadow-xl shadow-gray-950/30">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 min-w-[300px]">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Filter Program Studi</label>
              <div className="relative">
                <div 
                  onClick={() => !isLocked && setOpenFilterProdi(!openFilterProdi)}
                  className={`w-full px-4 py-3 border-2 rounded-2xl text-white font-bold flex justify-between items-center transition ${
                    isLocked 
                      ? 'bg-gray-950/30 border-gray-800/80 cursor-not-allowed opacity-75' 
                      : 'bg-gray-950/50 border-gray-800 cursor-pointer hover:border-blue-500/50'
                  }`}
                >
                  <span className="truncate">{filterProdi ? prodiList.find(p => p.id_prodi == filterProdi)?.nama_prodi : '-- Pilih Prodi --'}</span>
                  {isLocked ? (
                    <div className="flex items-center gap-1.5 text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20 text-[9px] font-black uppercase tracking-wider">
                      <Lock size={10} />
                      Readonly
                    </div>
                  ) : (
                    <GraduationCap size={16} className="text-gray-500" />
                  )}
                </div>
                {openFilterProdi && !isLocked && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[150] max-h-60 overflow-y-auto">
                    {prodiList.map(p => (
                      <div key={p.id_prodi} onClick={() => { setFilterProdi(p.id_prodi); setOpenFilterProdi(false); }} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 last:border-0">{p.nama_prodi}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center h-full pt-6">
              {loading && (
                <div className="flex items-center gap-2 text-blue-500 font-bold animate-pulse">
                  <RefreshCw size={16} className="animate-spin" />
                  <span className="text-[10px] uppercase tracking-widest">Updating...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
              {editingId ? 'Edit Data Profil Lulusan' : 'Input Data Profil Lulusan Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Program Studi</label>
                  <div className="w-full px-4 py-3 bg-gray-950/30 border-gray-800 border-2 rounded-2xl outline-none transition font-black text-blue-500 cursor-not-allowed">
                    {prodiList.find(p => p.id_prodi == formData.id_prodi)?.nama_prodi || '-- Pilih Prodi --'}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 ml-1 italic font-medium">* Otomatis mengikuti filter prodi yang aktif</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Deskripsi Profil Lulusan</label>
                  <div className="relative">
                    <textarea 
                      value={formData.deskripsi_pl} 
                      onChange={(e) => setFormData({...formData, deskripsi_pl: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white pl-11 min-h-[120px]" 
                      placeholder="Masukkan deskripsi kompetensi profil lulusan..." 
                      required 
                    />
                    <AlignLeft size={18} className="absolute left-4 top-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20">{editingId ? 'Simpan Perubahan' : 'Tambah Profil Lulusan'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-950/30 border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-gray-700">
                <UserCheck className="text-gray-500" size={32} />
              </div>
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data profil lulusan untuk prodi ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center w-20">No</th>
                    <th className="px-4 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 w-44 text-center">Kode PL</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Deskripsi Profil Lulusan</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {data.map((item, index) => (
                    <tr key={item.id_pl} className="hover:bg-blue-900/10 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-700 text-center font-bold text-gray-500">{index + 1}</td>
                      <td className="px-4 py-6 border-r border-gray-700 text-center font-black text-blue-500 text-xs tracking-wider whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                           <FileText size={14} className="text-blue-500/50" />
                           {item.kode_pl}
                        </div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-700 font-bold text-white group-hover:text-blue-400 transition-colors leading-relaxed">{item.deskripsi_pl}</td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-900/20 rounded-xl transition" title="Edit"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(item.id_pl)} className="p-2 text-red-600 hover:bg-red-950/40 rounded-xl transition" title="Hapus"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
