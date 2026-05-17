'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, Map, Calendar, Link as LinkIcon, GraduationCap, Database } from 'lucide-react';

export default function RoadmapPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [openProdi, setOpenProdi] = useState(false);
  const [openTahun, setOpenTahun] = useState(false);

  // Filters
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('all');
  const [filterJenis, setFilterJenis] = useState('all');
  const [openFilterProdi, setOpenFilterProdi] = useState(false);
  const [openFilterTahun, setOpenFilterTahun] = useState(false);
  const [openFilterJenis, setOpenFilterJenis] = useState(false);

  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    jenis_roadmap: 'Penelitian',
    link_dokumen: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchProdiList();
      fetchTahunList();
    }
  }, [router]);

  useEffect(() => {
    if (filterProdi && filterTahun) {
      fetchData();
    } else {
      setData([]);
    }
  }, [filterProdi, filterTahun, filterJenis]);

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setProdiList(result.data);
    } catch (err) { console.error(err); }
  };

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setTahunList(result.data);
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const jenisParam = filterJenis === 'all' ? '' : `&jenis=${filterJenis}`;
    try {
      const res = await fetch(`http://localhost:5000/api/lppm/roadmap-lppm?id_prodi=${filterProdi}&id_tahun=${filterTahun}${jenisParam}`, {
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
      ? `http://localhost:5000/api/lppm/roadmap-lppm/${editingId}`
      : 'http://localhost:5000/api/lppm/roadmap-lppm';

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
      if (filterProdi && filterTahun) fetchData();
      resetForm();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_roadmap);
    setFormData({
      id_prodi: item.id_prodi,
      id_tahun: item.id_tahun,
      jenis_roadmap: item.jenis_roadmap,
      link_dokumen: item.link_dokumen,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Pindahkan data ke tempat sampah?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/lppm/roadmap-lppm/${id}`, {
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
      id_prodi: '',
      id_tahun: '',
      jenis_roadmap: 'Penelitian',
      link_dokumen: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-950/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Master Roadmap LPPM</h1>
              <p className="text-gray-400 mt-1 font-medium italic">Kelola dokumen Roadmap Penelitian dan PkM Program Studi</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Roadmap'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 p-6 mb-8 shadow-xl shadow-gray-950/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Filter Program Studi</label>
              <div className="relative">
                <div 
                  onClick={() => setOpenFilterProdi(!openFilterProdi)}
                  className="w-full px-4 py-3 bg-gray-950/50 border-gray-800 border-2 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center hover:border-blue-500/50 transition"
                >
                  <span className="truncate">{filterProdi ? prodiList.find(p => p.id_prodi == filterProdi)?.nama_prodi : '-- Pilih Prodi --'}</span>
                  <GraduationCap size={16} className="text-gray-500" />
                </div>
                {openFilterProdi && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[150] max-h-60 overflow-y-auto">
                    {prodiList.map(p => (
                      <div key={p.id_prodi} onClick={() => { setFilterProdi(p.id_prodi); setOpenFilterProdi(false); }} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 last:border-0">{p.nama_prodi}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Filter Tahun Akademik</label>
              <div className="relative">
                <div 
                  onClick={() => setOpenFilterTahun(!openFilterTahun)}
                  className="w-full px-4 py-3 bg-gray-950/50 border-gray-800 border-2 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center hover:border-blue-500/50 transition"
                >
                  <span>{filterTahun === 'all' ? 'Semua Tahun' : filterTahun ? tahunList.find(t => t.id_tahun == filterTahun)?.tahun : '-- Pilih Tahun --'}</span>
                  <Calendar size={16} className="text-gray-500" />
                </div>
                {openFilterTahun && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[150] max-h-60 overflow-y-auto">
                    <div 
                      onClick={() => { setFilterTahun('all'); setOpenFilterTahun(false); }} 
                      className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 text-blue-500"
                    >
                      Semua Tahun
                    </div>
                    {tahunList.map(t => (
                      <div key={t.id_tahun} onClick={() => { setFilterTahun(t.id_tahun); setOpenFilterTahun(false); }} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 last:border-0">{t.tahun}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-[200px] relative">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Jenis Roadmap</label>
              <div 
                onClick={() => setOpenFilterJenis(!openFilterJenis)}
                className="w-full px-4 py-3 bg-gray-950/50 border-gray-800 border-2 rounded-2xl text-white font-bold cursor-pointer flex justify-between items-center hover:border-blue-500/50 transition"
              >
                <span>{filterJenis === 'all' ? 'Semua Jenis' : filterJenis}</span>
                <Database size={16} className="text-gray-500" />
              </div>
              {openFilterJenis && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[150]">
                  <div onClick={() => { setFilterJenis('all'); setOpenFilterJenis(false); }} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 text-blue-500">Semua Jenis</div>
                  <div onClick={() => { setFilterJenis('Penelitian'); setOpenFilterJenis(false); }} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800">Penelitian</div>
                  <div onClick={() => { setFilterJenis('PkM'); setOpenFilterJenis(false); }} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm last:border-0">PkM</div>
                </div>
              )}
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
              {editingId ? 'Edit Data Roadmap' : 'Input Data Roadmap Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Program Studi</label>
                  <div className="relative">
                    <div 
                      onClick={() => setOpenProdi(!openProdi)}
                      className={`w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white cursor-pointer flex justify-between items-center ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span>{formData.id_prodi ? prodiList.find(p => p.id_prodi == formData.id_prodi)?.nama_prodi : '-- Pilih Prodi --'}</span>
                      <Plus size={16} className={`transition-transform duration-300 ${openProdi ? 'rotate-0' : 'rotate-45'}`} />
                    </div>
                    {!editingId && openProdi && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto">
                        {prodiList.map(p => (
                          <div key={p.id_prodi} onClick={() => { setFormData({...formData, id_prodi: p.id_prodi}); setOpenProdi(false); }} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 last:border-0">{p.nama_prodi}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Tahun Akademik</label>
                  <div className="relative">
                    <div 
                      onClick={() => setOpenTahun(!openTahun)}
                      className={`w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white cursor-pointer flex justify-between items-center ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span>{formData.id_tahun ? tahunList.find(t => t.id_tahun == formData.id_tahun)?.tahun : '-- Pilih Tahun --'}</span>
                      <Plus size={16} className={`transition-transform duration-300 ${openTahun ? 'rotate-0' : 'rotate-45'}`} />
                    </div>
                    {!editingId && openTahun && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto">
                        {tahunList.map(t => (
                          <div key={t.id_tahun} onClick={() => { setFormData({...formData, id_tahun: t.id_tahun}); setOpenTahun(false); }} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 last:border-0">{t.tahun}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Jenis Roadmap</label>
                  <select value={formData.jenis_roadmap} onChange={(e) => setFormData({...formData, jenis_roadmap: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white">
                    <option value="Penelitian">Penelitian</option>
                    <option value="PkM">PkM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Link Dokumen Roadmap</label>
                  <input type="text" value={formData.link_dokumen} onChange={(e) => setFormData({...formData, link_dokumen: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white" placeholder="Contoh: https://link-dokumen.com/roadmap.pdf" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20">{editingId ? 'Simpan Perubahan' : 'Tambah Roadmap'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-950/30 border border-gray-700 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : !filterProdi || !filterTahun ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-gray-700">
                <Map className="text-gray-500" size={32} />
              </div>
              <p className="text-gray-400 font-bold text-xl tracking-tight max-w-sm">Pilih Prodi dan Tahun di filter atas untuk melihat Roadmap LPPM</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data roadmap untuk kriteria ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center w-20">No</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Jenis Roadmap</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Tahun</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Link Dokumen</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {data.map((item, index) => (
                    <tr key={item.id_roadmap} className="hover:bg-blue-900/30 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-700 text-center font-bold text-gray-400">{index + 1}</td>
                      <td className="px-8 py-6 border-r border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${item.jenis_roadmap === 'Penelitian' ? 'bg-blue-950/30 text-blue-500' : item.jenis_roadmap === 'PkM' ? 'bg-emerald-950/30 text-emerald-500' : 'bg-indigo-950/30 text-indigo-500'}`}>
                            <Map size={18} />
                          </div>
                          <span className="text-sm font-black text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.jenis_roadmap}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-700 text-center">
                        <span className="text-sm font-bold text-gray-300">{tahunList.find(t => t.id_tahun == item.id_tahun)?.tahun || item.id_tahun}</span>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-700">
                        <a href={item.link_dokumen} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition font-bold text-sm truncate max-w-[200px]">
                          <LinkIcon size={14} />
                          Buka Dokumen
                        </a>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <div className="inline-flex items-center bg-gray-900 border border-gray-700 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-800 group-hover:shadow-md">
                            <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-900/20 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                            <div className="w-px h-4 bg-gray-700 mx-2"></div>
                            <button onClick={() => handleDelete(item.id_roadmap)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
                          </div>
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
