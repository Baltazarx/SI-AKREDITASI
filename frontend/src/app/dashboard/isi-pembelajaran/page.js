'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, History, BookOpen, Target, Calendar, Trash } from 'lucide-react';

export default function IsiPembelajaranPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingMk, setEditingMk] = useState(null);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [isTrashView, setIsTrashView] = useState(false);
  
  const [prodiList, setProdiList] = useState([]);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [profilLulusanList, setProfilLulusanList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_mk: '',
    id_pl: '',
    id_tahun: '',
  });
  const [selectedPls, setSelectedPls] = useState([]);

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
    if (prodiList.length > 0 && (!filterProdi || filterProdi === '')) {
      const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
      if (tiProdi) setFilterProdi(tiProdi.id_prodi.toString());
    }
  }, [prodiList, filterProdi]);

  useEffect(() => {
    if (filterProdi && filterTahun) {
      fetchData();
      fetchMataKuliahList();
      fetchProfilLulusanList();
    }
  }, [filterProdi, filterTahun, isTrashView]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b1-isi-pembelajaran?id_prodi=${filterProdi}&id_tahun=${filterTahun}&is_trash=${isTrashView}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setData(result.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setProdiList(result.data);
    } catch (err) {
      console.error('Error fetching prodi:', err);
    }
  };

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        const sortedTahun = result.data.sort((a, b) => a.tahun - b.tahun);
        setTahunList(sortedTahun);
      }
    } catch (err) {
      console.error('Error fetching tahun:', err);
    }
  };

  const fetchMataKuliahList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/mata-kuliah?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setMataKuliahList(result.data || []);
    } catch (err) {
      console.error('Error fetching mata kuliah:', err);
    }
  };

  const fetchProfilLulusanList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/profil-lulusan?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setProfilLulusanList(result.data || []);
    } catch (err) {
      console.error('Error fetching profil lulusan:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editingMk) {
      alert('Kolom Mata Kuliah wajib diisi');
      return;
    }
    
    if (!filterTahun) {
      alert('Kolom Tahun Akademik wajib diisi');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
      const originalMappedPls = data.filter(d => d.id_mk === editingMk.id_mk);
      const originalPlIds = originalMappedPls.map(d => d.id_pl);
      
      const toAdd = selectedPls.filter(id => !originalPlIds.includes(id));
      const toDelete = originalMappedPls.filter(d => !selectedPls.includes(d.id_pl));
      
      // Save added PLs
      for (const plId of toAdd) {
        const res = await fetch(`http://localhost:5000/api/prodi/2b1-isi-pembelajaran`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            id_mk: editingMk.id_mk,
            id_pl: plId,
            id_tahun: parseInt(filterTahun)
          }),
        });
        
        const result = await res.json();
        if (!result.success) {
          alert(result.message || 'Gagal menyimpan data');
          return;
        }
      }
      
      // Delete removed PLs
      for (const item of toDelete) {
        await fetch(`http://localhost:5000/api/prodi/2b1-isi-pembelajaran/${item.id_2b1}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      alert('Data berhasil disimpan');
      fetchData();
      resetForm();
    } catch (err) {
      console.error('Error saving data:', err);
      alert('Gagal menyimpan data');
    }
  };

  const handleEditMk = (mk) => {
    setEditingMk(mk);
    const existingPls = data
      .filter(item => item.id_mk === mk.id_mk)
      .map(item => item.id_pl);
    setSelectedPls(existingPls);
  };

  const handleEdit = (item) => {
    setFormData({
      id_mk: item.id_mk || '',
      id_pl: item.id_pl || '',
      id_tahun: item.id_tahun || '',
    });
    setEditingId(item.id_2b1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b1-isi-pembelajaran/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      console.error('Error deleting data:', err);
      alert('Gagal menghapus data');
    }
  };

  const handleHardDeleteGroup = async (mk) => {
    if (!confirm('Apakah Anda yakin ingin menghapus permanen semua pemetaan untuk Mata Kuliah ini? Data tidak dapat dikembalikan!')) return;
    
    const itemsToDelete = data.filter(item => item.id_mk === mk.id_mk);
    const token = localStorage.getItem('token');
    
    try {
      for (const item of itemsToDelete) {
        await fetch(`http://localhost:5000/api/prodi/2b1-isi-pembelajaran/${item.id_2b1}?hard=true`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      alert('Data berhasil dihapus permanen');
      fetchData();
    } catch (err) {
      console.error('Error hard deleting data:', err);
      alert('Gagal menghapus data secara permanen');
    }
  };

  const resetForm = () => {
    setFormData({
      id_mk: '',
      id_pl: '',
      id_tahun: '',
    });
    setEditingMk(null);
    setSelectedPls([]);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Isi Pembelajaran (2.B.1)</h1>
              <p className="text-gray-500 mt-1 font-medium">Pengelolaan mata kuliah dan profil lulusan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => window.open(`http://localhost:5000/api/prodi/2b1-isi-pembelajaran/export?id_prodi=${filterProdi}&token=${localStorage.getItem('token')}`, '_blank')} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-3 items-end mb-8">
          <div className="flex-1 lg:w-48">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun Akademik</label>
            <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer">
              <option value="">Pilih Tahun</option>
              {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
            </select>
          </div>
          <div className="flex-1 lg:w-48">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Program Studi</label>
            <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer">
              <option value="">Pilih Prodi</option>
              {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
            </select>
          </div>
          <button onClick={fetchData} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setIsTrashView(!isTrashView)} className={`p-2.5 border rounded-xl transition shadow-sm flex items-center gap-2 ${isTrashView ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-white border-gray-200 text-gray-400 hover:text-red-600 hover:bg-gray-50'}`} title={isTrashView ? "Tampilkan Data Aktif" : "Lihat Data Sampah"}>
            <Trash size={20} />
            <span className="font-bold text-sm hidden sm:inline">{isTrashView ? "Data Aktif" : "Lihat Sampah"}</span>
          </button>
        </div>

        {/* Form Section */}
        {editingMk && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-gray-900 mb-6">
              {editingId ? 'Edit Pemetaan Isi Pembelajaran' : 'Input Pemetaan Isi Pembelajaran Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mata Kuliah</label>
                  <div className="border border-gray-200 rounded-xl bg-white max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Kode</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Mata Kuliah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {editingMk ? (
                          <tr 
                            key={editingMk.id_mk} 
                            className="bg-blue-100"
                          >
                            <td className="px-4 py-2 font-mono text-xs font-bold text-gray-800">{editingMk.kode_mk}</td>
                            <td className="px-4 py-2 text-gray-600">{editingMk.nama_mk}</td>
                          </tr>
                        ) : (
                          mataKuliahList.map(mk => (
                          <tr 
                            key={mk.id_mk} 
                            className={`hover:bg-blue-50 cursor-pointer ${editingMk?.id_mk === mk.id_mk ? 'bg-blue-100' : ''}`}
                            onClick={() => {
                              setEditingMk(mk);
                              setSelectedPls([]);
                            }}
                          >
                            <td className="px-4 py-2 font-mono text-xs font-bold text-gray-800">{mk.kode_mk}</td>
                            <td className="px-4 py-2 text-gray-600">{mk.nama_mk}</td>
                          </tr>
                        ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Profil Lulusan</label>
                  <div className="border border-gray-200 rounded-xl bg-white max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Kode</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {profilLulusanList.map(pl => {
                          const isMapped = selectedPls.includes(pl.id_pl);
                          return (
                            <tr key={pl.id_pl} className="hover:bg-blue-50 cursor-pointer">
                              <td className="px-4 py-2 font-mono text-xs font-bold text-gray-800">{pl.kode_pl}</td>
                              <td className="px-4 py-2 text-gray-600">
                                <div className="flex items-center justify-between">
                                  <span>{pl.deskripsi_pl}</span>
                                  <input
                                    type="checkbox"
                                    checked={isMapped}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedPls(prev => [...prev, pl.id_pl]);
                                      } else {
                                        setSelectedPls(prev => prev.filter(id => id !== pl.id_pl));
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tahun Akademik</label>
                    <input
                      type="text"
                      value={filterTahun ? tahunList.find(t => t.id_tahun === parseInt(filterTahun))?.tahun : ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border-transparent border-2 border-gray-300 rounded-2xl outline-none transition font-medium text-gray-600"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-200">{editingId ? 'Update Data' : 'Simpan Data'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section - Matrix View */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : mataKuliahList.length === 0 || profilLulusanList.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Data Mata Kuliah atau Profil Lulusan belum tersedia</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] border-r border-gray-200 bg-gray-100 align-middle sticky left-0 z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e5e7eb]">
                      Mata Kuliah
                    </th>
                    <th className="px-4 py-3 text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] border-r border-gray-200 text-center min-w-[200px]">
                      Profil Lulusan
                    </th>
                    <th className="px-4 py-3 text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] border-r border-gray-200 text-center min-w-[80px]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mataKuliahList.map((mk) => {
                    const mappedPls = profilLulusanList.filter(pl => 
                      data.some(item => item.id_mk === mk.id_mk && item.id_pl === pl.id_pl)
                    );
                    
                    if (mappedPls.length === 0) {
                      if (isTrashView) return null; // Sembunyikan MK kosong di tampilan sampah
                      // Mata Kuliah dengan PL kosong
                      return (
                        <tr key={mk.id_mk} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-3 border-r border-gray-200 bg-gray-50 align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e5e7eb]">
                            <div className="font-black text-gray-900 text-sm">{mk.nama_mk || '-'}</div>
                            <div className="text-[10px] text-gray-600 mt-1 font-medium">{mk.kode_mk || '-'}</div>
                          </td>
                          <td className="px-4 py-3 border-r border-gray-200">
                            <div className="font-mono text-xs font-bold text-gray-800">-</div>
                            <div className="text-[10px] text-gray-600 mt-1">-</div>
                          </td>
                          <td className="px-4 py-3 border-r border-gray-200 text-center">
                            <button 
                              onClick={() => handleEditMk(mk)} 
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition shadow-sm"
                            >
                              <Plus size={14} />
                              Tambah
                            </button>
                          </td>
                        </tr>
                      );
                    }
                    
                    return (
                      <tr key={mk.id_mk} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-3 border-r border-gray-200 bg-gray-50 align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e5e7eb]">
                          <div className="font-black text-gray-900 text-sm">{mk.nama_mk || '-'}</div>
                          <div className="text-[10px] text-gray-600 mt-1 font-medium">{mk.kode_mk || '-'}</div>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200 align-top">
                          <div className="flex flex-wrap gap-3">
                            {mappedPls.map(pl => (
                              <div key={pl.id_pl} className="bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100/60 rounded-xl p-3 max-w-[280px] shadow-sm">
                                <div className="font-black text-indigo-900 text-xs mb-1">{pl.kode_pl}</div>
                                <div className="text-[10px] text-indigo-800/80 leading-relaxed font-medium">{pl.deskripsi_pl}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-200 text-center align-top w-[140px] min-w-[140px] max-w-[140px] bg-white">
                          {isTrashView ? (
                            <button 
                              onClick={() => handleHardDeleteGroup(mk)} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-red-100 shadow-sm"
                            >
                              <Trash2 size={12} />
                              Hapus
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleEditMk(mk)} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 shadow-sm"
                            >
                              <Edit size={12} />
                              Atur PL
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
