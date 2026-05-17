'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, History, RotateCcw, Monitor, TrendingUp, Users, ExternalLink } from 'lucide-react';

export default function BebanPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isTrashMode, setIsTrashMode] = useState(false);
  
  const [filterIdTahun, setFilterIdTahun] = useState('');
  const [filterIdProdi, setFilterIdProdi] = useState('');
  
  const [tahunList, setTahunList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [dosenList, setDosenList] = useState([]);

  const [formData, setFormData] = useState({
    id_dosen: '',
    id_tahun: '',
    sks_ps_sendiri: '',
    sks_ps_lain: '',
    sks_pt_lain: '',
    sks_penelitian: '',
    sks_pkm: '',
    sks_manajemen_pt_lain: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchMasterData();
    }
  }, [router]);

  const fetchMasterData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [tahunRes, prodiRes, dosenRes] = await Promise.all([
        fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/dosen', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const [tahunData, prodiData, dosenData] = await Promise.all([
        tahunRes.json(),
        prodiRes.json(),
        dosenRes.json()
      ]);

      if (tahunData.success) {
        const sortedTahun = tahunData.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));
        setTahunList(sortedTahun);
        const activeTahun = sortedTahun.find(t => t.is_active === 1);
        if (activeTahun) setFilterIdTahun(activeTahun.id_tahun.toString());
      }
      if (prodiData.success) {
        setProdiList(prodiData.data);
        const defaultProdi = prodiData.data.find(p => p.nama_prodi.includes('Teknik Informatika'));
        if (defaultProdi) setFilterIdProdi(defaultProdi.id_prodi.toString());
      }
      if (dosenData.success) setDosenList(dosenData.data);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  useEffect(() => {
    if (filterIdTahun) fetchData();
  }, [filterIdTahun, filterIdProdi]);

  const fetchData = async () => {
    if (!filterIdTahun) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseParams = `id_tahun=${filterIdTahun}${filterIdProdi ? `&id_prodi=${filterIdProdi}` : ''}`;
      const activeUrl = `http://localhost:5000/api/upps/1a4-beban?${baseParams}`;
      const trashUrl = `http://localhost:5000/api/upps/1a4-beban/trash?${baseParams}`;
      
      const [activeRes, trashRes] = await Promise.all([
        fetch(activeUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(trashUrl, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();
      
      if (activeResult.success) {
        setActiveData(activeResult.data || []);
        setSummary(activeResult.summary || null);
      }
      if (trashResult.success) setTrashData(trashResult.data || []);
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
      ? `http://localhost:5000/api/upps/1a4-beban/${editingId}`
      : 'http://localhost:5000/api/upps/1a4-beban';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          id_tahun: filterIdTahun
        }),
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
      resetForm();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_beban_kerja);
    const dosenMatch = dosenList.find(d => d.nama_lengkap === item.nama_dtpr);
    setFormData({
      id_dosen: String(dosenMatch?.id_dosen || ''),
      id_tahun: String(filterIdTahun),
      sks_ps_sendiri: String(item.sks_ps_sendiri || 0),
      sks_ps_lain: String(item.sks_ps_lain || 0),
      sks_pt_lain: String(item.sks_pt_lain || 0),
      sks_penelitian: String(item.sks_penelitian || 0),
      sks_pkm: String(item.sks_pkm || 0),
      sks_manajemen_pt_lain: String(item.sks_manajemen_pt_lain || 0),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a4-beban/${id}`, {
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

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a4-beban/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('Hapus permanen?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a4-beban/hard/${id}`, {
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
      id_dosen: '',
      id_tahun: '',
      sks_ps_sendiri: '',
      sks_ps_lain: '',
      sks_pt_lain: '',
      sks_penelitian: '',
      sks_pkm: '',
      sks_manajemen_pt_lain: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/upps/1a4-beban/export?id_tahun=${filterIdTahun}&token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-white tracking-tight">Beban DTPR (1.A.4)</h1>
              <p className="text-gray-400 mt-1 font-medium">Monitoring beban kerja dosen tetap program studi (EWMP)</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Beban'}</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/20 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-blue-900/20 text-blue-600 rounded-xl"><Monitor size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Beban (Active)</p>
                <p className="text-2xl font-black text-white">{activeData.length}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-indigo-900/20 text-indigo-600 rounded-xl"><TrendingUp size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rata-rata SKS</p>
                <p className="text-2xl font-black text-white">{summary ? parseFloat(summary.avg_total).toFixed(1) : '0'}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-orange-900/20 text-orange-600 rounded-xl"><History size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mode</p>
                <p className="text-2xl font-black text-white">{isTrashMode ? 'Sampah' : 'Aktif'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-48">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Prodi</label>
              <select value={filterIdProdi} onChange={(e) => setFilterIdProdi(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition cursor-pointer">
                <option value="">Semua Prodi</option>
                {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
              </select>
            </div>
            <div className="flex-1 lg:w-32">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun Akademik</label>
              <select value={filterIdTahun} onChange={(e) => setFilterIdTahun(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition cursor-pointer">
                <option value="">Pilih Tahun</option>
                {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
              </select>
            </div>
            <button onClick={fetchData} className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-950/50 transition text-gray-400 hover:text-blue-600 shadow-sm">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setIsTrashMode(!isTrashMode)} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition border shadow-sm ${isTrashMode ? 'bg-orange-900/20 border-orange-800 text-orange-600' : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-950/50'}`}>
              {isTrashMode ? 'Lihat Aktif' : 'Lihat Sampah'}
            </button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Beban Kerja' : 'Input Beban Kerja Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="md:col-span-2 lg:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Pilih DTPR (Dosen)</label>
                  <select value={formData.id_dosen} onChange={(e) => setFormData({...formData, id_dosen: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Dosen</option>
                    {dosenList.map(d => <option key={d.id_dosen} value={d.id_dosen}>{d.nama_lengkap}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">SKS PS Sendiri</label>
                  <input type="number" step="0.01" value={formData.sks_ps_sendiri} onChange={(e) => setFormData({...formData, sks_ps_sendiri: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">SKS PS Lain</label>
                  <input type="number" step="0.01" value={formData.sks_ps_lain} onChange={(e) => setFormData({...formData, sks_ps_lain: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">SKS PT Lain</label>
                  <input type="number" step="0.01" value={formData.sks_pt_lain} onChange={(e) => setFormData({...formData, sks_pt_lain: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">SKS Penelitian</label>
                  <input type="number" step="0.01" value={formData.sks_penelitian} onChange={(e) => setFormData({...formData, sks_penelitian: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">SKS PkM</label>
                  <input type="number" step="0.01" value={formData.sks_pkm} onChange={(e) => setFormData({...formData, sks_pkm: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">SKS Manajemen PT Lain</label>
                  <input type="number" step="0.01" value={formData.sks_manajemen_pt_lain} onChange={(e) => setFormData({...formData, sks_manajemen_pt_lain: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0.00" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20">{editingId ? 'Update Data' : 'Simpan Data'}</button>
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
          ) : (isTrashMode ? trashData : activeData).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data beban kerja</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th rowSpan="2" className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-700 text-center align-middle">No</th>
                    <th rowSpan="2" className="px-8 py-4 text-[11px] font-black text-white uppercase tracking-[0.2em] border-r border-gray-700 align-middle">Nama DTPR</th>
                    <th colSpan="3" className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-700 text-center bg-gray-950/30">SKS Pengajaran</th>
                    <th rowSpan="2" className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-700 text-center align-middle">Riset</th>
                    <th rowSpan="2" className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-700 text-center align-middle">PkM</th>
                    <th colSpan="2" className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-700 text-center bg-gray-950/30">SKS Manajemen</th>
                    <th rowSpan="2" className="px-6 py-4 text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-r border-gray-700 text-center align-middle bg-blue-900/50">Total</th>
                    <th rowSpan="2" className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center align-middle">Aksi</th>
                  </tr>
                  <tr className="border-b border-gray-700 bg-gray-950/20">
                    <th className="px-3 py-3 text-[9px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-700 text-center">PS Sendiri</th>
                    <th className="px-3 py-3 text-[9px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-700 text-center">PS Lain</th>
                    <th className="px-3 py-3 text-[9px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-700 text-center">PT Lain</th>
                    <th className="px-3 py-3 text-[9px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-700 text-center">PT Sendiri</th>
                    <th className="px-3 py-3 text-[9px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-700 text-center">PT Lain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(isTrashMode ? trashData : activeData).map((item, index) => (
                    <tr key={item.id_beban_kerja} className="hover:bg-blue-900/30 transition-colors group">
                      <td className="px-6 py-5 border-r border-gray-700 text-center text-[11px] font-black text-gray-300">{index + 1}</td>
                      <td className="px-8 py-5 border-r border-gray-700">
                        <div className="text-sm font-black text-white group-hover:text-blue-600 transition-colors">{item.nama_dtpr}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.nama_prodi}</div>
                      </td>
                      <td className="px-4 py-5 border-r border-gray-700 text-center text-sm font-bold text-gray-400">{item.sks_ps_sendiri || '-'}</td>
                      <td className="px-4 py-5 border-r border-gray-700 text-center text-sm font-bold text-gray-400">{item.sks_ps_lain || '-'}</td>
                      <td className="px-4 py-5 border-r border-gray-700 text-center text-sm font-bold text-gray-400">{item.sks_pt_lain || '-'}</td>
                      <td className="px-4 py-5 border-r border-gray-700 text-center text-sm font-bold text-emerald-600">{item.sks_penelitian || '-'}</td>
                      <td className="px-4 py-5 border-r border-gray-700 text-center text-sm font-bold text-purple-600">{item.sks_pkm || '-'}</td>
                      <td className="px-4 py-5 border-r border-gray-700 text-center text-sm font-bold text-indigo-600">{item.sks_manajemen_pt_sendiri || '-'}</td>
                      <td className="px-4 py-5 border-r border-gray-700 text-center text-sm font-bold text-gray-400">{item.sks_manajemen_pt_lain || '-'}</td>
                      <td className="px-6 py-5 border-r border-gray-700 text-center bg-blue-900/20">
                        <div className="text-sm font-black text-blue-600">{parseFloat(item.total_sks).toFixed(1)}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center">
                          <div className="inline-flex items-center bg-gray-900 border border-gray-700 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-800 group-hover:shadow-md">
                            {isTrashMode ? (
                              <>
                                <button onClick={() => handleRestore(item.id_beban_kerja)} className="p-1.5 text-emerald-600 hover:bg-emerald-900/20 rounded-lg transition" title="Restore"><RotateCcw size={16} /></button>
                                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                                <button onClick={() => handleHardDelete(item.id_beban_kerja)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus Permanen"><Trash size={16} /></button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-900/20 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                                <button onClick={() => handleDelete(item.id_beban_kerja)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {summary && !isTrashMode && (
                  <tfoot className="bg-gray-950/50 font-black border-t-2 border-gray-700">
                    <tr className="text-white">
                      <td colSpan="2" className="px-8 py-5 text-right text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Total Keseluruhan (Sum)</td>
                      <td className="px-4 py-5 text-center text-sm font-black">{parseFloat(summary.sum_ps_sendiri || 0).toFixed(1)}</td>
                      <td className="px-4 py-5 text-center text-sm font-black">{parseFloat(summary.sum_ps_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-5 text-center text-sm font-black">{parseFloat(summary.sum_pt_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-5 text-center text-sm font-black text-emerald-600">{parseFloat(summary.sum_penelitian || 0).toFixed(1)}</td>
                      <td className="px-4 py-5 text-center text-sm font-black text-purple-600">{parseFloat(summary.sum_pkm || 0).toFixed(1)}</td>
                      <td className="px-4 py-5 text-center text-sm font-black text-indigo-600">{parseFloat(summary.sum_manajemen_sendiri || 0).toFixed(1)}</td>
                      <td className="px-4 py-5 text-center text-sm font-black">{parseFloat(summary.sum_manajemen_lain || 0).toFixed(1)}</td>
                      <td className="px-6 py-5 text-center bg-blue-900/50 text-blue-400 font-black text-sm">{parseFloat(summary.sum_total || 0).toFixed(1)}</td>
                      <td></td>
                    </tr>
                    <tr className="text-gray-400 bg-gray-900/50 italic border-t border-gray-700">
                      <td colSpan="2" className="px-8 py-4 text-right text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Rata-rata (Avg)</td>
                      <td className="px-4 py-4 text-center text-xs font-bold">{parseFloat(summary.avg_ps_sendiri || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-xs font-bold">{parseFloat(summary.avg_ps_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-xs font-bold">{parseFloat(summary.avg_pt_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-xs font-bold text-emerald-500">{parseFloat(summary.avg_penelitian || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-xs font-bold text-purple-500">{parseFloat(summary.avg_pkm || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-xs font-bold text-indigo-500">{parseFloat(summary.avg_manajemen_sendiri || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-xs font-bold">{parseFloat(summary.avg_manajemen_lain || 0).toFixed(1)}</td>
                      <td className="px-6 py-4 text-center bg-blue-900/50 text-blue-600 font-black text-xs">{parseFloat(summary.avg_total || 0).toFixed(1)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
