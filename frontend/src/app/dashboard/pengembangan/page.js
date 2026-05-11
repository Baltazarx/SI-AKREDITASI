'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, BookOpen, UserCheck, History, ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function PengembanganPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterIdTahun, setFilterIdTahun] = useState('');
  const [filterIdProdi, setFilterIdProdi] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});
  
  const [prodiList, setProdiList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_dosen: '',
    id_tahun: '',
    jenis_pengembangan: '',
    nama_pengembangan: '',
    link_bukti: '',
  });

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      loadInitialData();
    }
  }, [router]);

  useEffect(() => {
    if (filterIdTahun) {
      fetchData();
    }
  }, [filterIdTahun, filterIdProdi]);

  const loadInitialData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [prodiRes, tahunRes, dosenRes] = await Promise.all([
        fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/dosen', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      
      const prodiResult = await prodiRes.json();
      const tahunResult = await tahunRes.json();
      const dosenResult = await dosenRes.json();
      
      if (prodiResult.success) {
        setProdiList(prodiResult.data);
        const defaultProdi = prodiResult.data.find(p => p.nama_prodi.includes('Teknik Informatika'));
        if (defaultProdi) setFilterIdProdi(defaultProdi.id_prodi.toString());
      }
      if (tahunResult.success) {
        const sortedTahun = (tahunResult.data || []).sort((a, b) => (parseInt(a.tahun) || 0) - (parseInt(b.tahun) || 0));
        setTahunList(sortedTahun);
        const activeTahun = sortedTahun.find(t => t.is_active === 1);
        if (activeTahun) {
          setFilterIdTahun(activeTahun.id_tahun.toString());
        } else if (sortedTahun.length > 0) {
          setFilterIdTahun(sortedTahun[0].id_tahun.toString());
        }
      }
      if (dosenResult.success) setDosenList(dosenResult.data);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseUrl = 'http://localhost:5000/api/upps/3a3-pengembangan';
      const params = `?id_tahun=${filterIdTahun}${filterIdProdi ? `&id_prodi=${filterIdProdi}` : ''}`;
      
      const [activeRes, trashRes] = await Promise.all([
        fetch(`${baseUrl}${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/trash${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      
      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();
      
      if (activeResult.success) {
        setActiveData(activeResult.data || []);
        const statMap = {};
        if (activeResult.stats) {
          activeResult.stats.forEach(s => statMap[s.id_tahun] = s.jumlah_dosen);
        }
        setStats(statMap);
      }
      if (trashResult.success) setTrashData(trashResult.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      showError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/upps/3a3-pengembangan/${editingId}`
      : 'http://localhost:5000/api/upps/3a3-pengembangan';

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
      fetchData();
      resetForm();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_pengembangan);
    setFormData({
      id_dosen: item.id_dosen || '',
      id_tahun: item.id_tahun || '',
      jenis_pengembangan: item.jenis_pengembangan || '',
      nama_pengembangan: item.nama_pengembangan || '',
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/3a3-pengembangan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/3a3-pengembangan/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('Hapus permanen?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/3a3-pengembangan/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      id_dosen: '',
      id_tahun: filterIdTahun,
      jenis_pengembangan: '',
      nama_pengembangan: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/upps/3a3-pengembangan/export?id_tahun=${filterIdTahun}${filterIdProdi ? `&id_prodi=${filterIdProdi}` : ''}&token=${token}`, '_blank');
  };

  const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterIdTahun);
  const currentTSYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) : 0;

  const tsMinus1Obj = tahunList.find(t => parseInt(t.tahun) === currentTSYear - 1);
  const tsMinus2Obj = tahunList.find(t => parseInt(t.tahun) === currentTSYear - 2);
  
  const statTS = stats[filterIdTahun] || 0;
  const statTS1 = tsMinus1Obj ? (stats[tsMinus1Obj.id_tahun] || 0) : 0;
  const statTS2 = tsMinus2Obj ? (stats[tsMinus2Obj.id_tahun] || 0) : 0;

  const pivotedDataInfo = useMemo(() => {
    const dataToProcess = activeData || [];
    if (dataToProcess.length === 0) return { data: [], ts: currentTSYear };
    const ts = currentTSYear;
    const pivot = {};
    dataToProcess.forEach(item => {
      const lecturer = item.nama_dtpr || '-';
      const jenis = item.jenis_pengembangan || '-';
      const key = `${lecturer}_${jenis}`;
      if (!pivot[key]) {
        pivot[key] = {
          id_dosen: item.id_dosen,
          nama_dtpr: lecturer,
          jenis_pengembangan: jenis,
          ts2: 0, ts1: 0, ts: 0,
          link_bukti: item.link_bukti,
          raw: []
        };
      }
      const itemTahunObj = tahunList.find(t => t.id_tahun === item.id_tahun);
      const itemYear = itemTahunObj ? parseInt(itemTahunObj.tahun) : 0;
      if (itemYear === ts) pivot[key].ts += 1;
      else if (itemYear === ts - 1) pivot[key].ts1 += 1;
      else if (itemYear === ts - 2) pivot[key].ts2 += 1;
      pivot[key].raw.push(item);
    });
    return { data: Object.values(pivot), ts };
  }, [activeData, currentTSYear, tahunList]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Pengembangan DTPR (3.A.3)</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Monitoring pengembangan DTPR di bidang penelitian & pendidikan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Pengembangan'}</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 font-medium text-sm">
            {error}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-colors">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><BookOpen size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Kegiatan</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{activeData.length}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-colors">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><UserCheck size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Dosen DTPR</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{statTS}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-colors">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl"><History size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mode</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{showTrash ? 'Sampah' : 'Aktif'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-48">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Prodi</label>
              <select value={filterIdProdi} onChange={(e) => setFilterIdProdi(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none font-bold text-sm transition cursor-pointer dark:text-white">
                {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
              </select>
            </div>
            <div className="flex-1 lg:w-32">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Tahun (TS)</label>
              <select value={filterIdTahun} onChange={(e) => setFilterIdTahun(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none font-bold text-sm transition cursor-pointer dark:text-white">
                {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
              </select>
            </div>
            <button onClick={fetchData} className="p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setShowTrash(!showTrash)} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition border shadow-sm ${showTrash ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {showTrash ? 'Lihat Aktif' : 'Lihat Sampah'}
            </button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 p-8 mb-8 animate-in slide-in-from-top-4 duration-500 transition-colors">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">{editingId ? 'Edit Pengembangan' : 'Input Pengembangan Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Pilih Dosen</label>
                  <select value={formData.id_dosen} onChange={(e) => setFormData({...formData, id_dosen: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-transparent border-2 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl outline-none transition font-medium dark:text-white" required>
                    <option value="">Pilih Dosen</option>
                    {dosenList.map(d => <option key={d.id_dosen} value={d.id_dosen}>{d.nama_lengkap}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tahun Akademik</label>
                  <select value={formData.id_tahun} onChange={(e) => setFormData({...formData, id_tahun: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-transparent border-2 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl outline-none transition font-medium dark:text-white" required>
                    <option value="">Pilih Tahun</option>
                    {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Jenis Pengembangan</label>
                  <input type="text" value={formData.jenis_pengembangan} onChange={(e) => setFormData({...formData, jenis_pengembangan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-transparent border-2 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl outline-none transition font-medium dark:text-white" placeholder="Contoh: Tugas Belajar, Sertifikasi, Pelatihan Riset" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nama Kegiatan / Instansi</label>
                  <input type="text" value={formData.nama_pengembangan} onChange={(e) => setFormData({...formData, nama_pengembangan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-transparent border-2 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl outline-none transition font-medium dark:text-white" placeholder="Contoh: S3 Ilmu Komputer - Universitas Indonesia" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Link Bukti (Sertifikat / SK)</label>
                  <input type="url" value={formData.link_bukti} onChange={(e) => setFormData({...formData, link_bukti: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-transparent border-2 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl outline-none transition font-medium dark:text-white" placeholder="https://..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-200 dark:shadow-blue-900/40">{editingId ? 'Update Data' : 'Simpan Data'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/30 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 dark:text-gray-600 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (showTrash ? trashData : pivotedDataInfo.data).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 dark:text-gray-600 font-bold text-xl tracking-tight">Belum ada data pengembangan DTPR</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  {showTrash ? (
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] border-r border-gray-100 dark:border-gray-800">Dosen DTPR</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] border-r border-gray-100 dark:border-gray-800">Pengembangan</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] border-r border-gray-100 dark:border-gray-800 text-center">Tahun</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Aksi</th>
                    </tr>
                  ) : (
                    <>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <th colSpan="2" className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50/30 dark:bg-gray-800/20 border-r border-gray-100 dark:border-gray-800 text-center">Tahun Akademik</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] border-r border-gray-100 dark:border-gray-800 text-center">TS-2</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] border-r border-gray-100 dark:border-gray-800 text-center">TS-1</th>
                        <th className="px-6 py-4 text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] border-r border-gray-100 dark:border-gray-800 text-center bg-blue-50/50 dark:bg-blue-900/20">TS ({pivotedDataInfo.ts})</th>
                        <th rowSpan="3" className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] border-l border-gray-100 dark:border-gray-800 text-center align-middle">Link Bukti</th>
                        <th rowSpan="3" className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center align-middle">Aksi</th>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-800/10">
                        <th colSpan="2" className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-r border-gray-100 dark:border-gray-800 text-center">Jumlah Dosen DTPR</th>
                        <th className="px-6 py-4 text-sm font-black text-gray-900 dark:text-white border-r border-gray-100 dark:border-gray-800 text-center">{statTS2}</th>
                        <th className="px-6 py-4 text-sm font-black text-gray-900 dark:text-white border-r border-gray-100 dark:border-gray-800 text-center">{statTS1}</th>
                        <th className="px-6 py-4 text-sm font-black text-blue-600 dark:text-blue-400 border-r border-gray-100 dark:border-gray-800 text-center bg-blue-50/30 dark:bg-blue-900/30">{statTS}</th>
                      </tr>
                      <tr>
                        <th className="px-8 py-5 text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] border-r border-gray-100 dark:border-gray-800">Jenis Pengembangan DTPR</th>
                        <th className="px-8 py-5 text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] border-r border-gray-100 dark:border-gray-800">Nama DTPR</th>
                        <th colSpan="3" className="px-6 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] border-r border-gray-100 dark:border-gray-800 text-center bg-gray-50/10 dark:bg-gray-800/20">Jumlah</th>
                      </tr>
                    </>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {showTrash ? (
                    trashData.map((item) => (
                      <tr key={item.id_pengembangan} className="hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors group">
                        <td className="px-8 py-6 border-r border-gray-50 dark:border-gray-800 last:border-0 font-black text-gray-900 dark:text-white">{item.nama_dtpr}</td>
                        <td className="px-8 py-6 border-r border-gray-50 dark:border-gray-800 last:border-0 text-sm text-gray-600 dark:text-gray-400">{item.jenis_pengembangan}</td>
                        <td className="px-8 py-6 border-r border-gray-50 dark:border-gray-800 last:border-0 text-center">
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-black">{item.nama_tahun}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1.5 rounded-xl shadow-sm">
                            <button onClick={() => handleRestore(item.id_pengembangan)} className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition" title="Restore"><RotateCcw size={16} /></button>
                            <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-2"></div>
                            <button onClick={() => handleHardDelete(item.id_pengembangan)} className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Hapus Permanen"><Trash size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    pivotedDataInfo.data.map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                        <td className="px-8 py-6 border-r border-gray-50 dark:border-gray-800 last:border-0 text-sm font-bold text-gray-600 dark:text-gray-400">{row.jenis_pengembangan}</td>
                        <td className="px-8 py-6 border-r border-gray-50 dark:border-gray-800 last:border-0 font-black text-gray-900 dark:text-white">{row.nama_dtpr}</td>
                        <td className="px-6 py-6 border-r border-gray-50 dark:border-gray-800 last:border-0 text-center">
                          <div className={`text-sm font-bold ${row.ts2 > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-200 dark:text-gray-700'}`}>{row.ts2 || '-'}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-50 dark:border-gray-800 last:border-0 text-center">
                          <div className={`text-sm font-bold ${row.ts1 > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-200 dark:text-gray-700'}`}>{row.ts1 || '-'}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-50 dark:border-gray-800 last:border-0 text-center bg-blue-50/20 dark:bg-blue-900/10">
                          <div className={`text-sm font-black ${row.ts > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-200 dark:text-gray-700'}`}>{row.ts || '-'}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-50 dark:border-gray-800 last:border-0 text-center">
                          {row.link_bukti ? (
                            <a href={row.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-black text-[9px] uppercase tracking-widest">
                              <ExternalLink size={10} /> Lihat Bukti
                            </a>
                          ) : <span className="text-gray-300 dark:text-gray-700">-</span>}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-2">
                            {(() => {
                              const currentYearItem = row.raw.find(ri => {
                                const tObj = tahunList.find(t => t.id_tahun === ri.id_tahun);
                                return tObj && parseInt(tObj.tahun) === currentTSYear;
                              });
                              if (currentYearItem) {
                                return (
                                  <div className="inline-flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-200 dark:group-hover:border-blue-800 group-hover:shadow-md">
                                    <button onClick={() => handleEdit(currentYearItem)} className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Edit TS"><Edit size={16} /></button>
                                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-2"></div>
                                    <button onClick={() => handleSoftDelete(currentYearItem.id_pengembangan)} className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Hapus TS"><Trash2 size={16} /></button>
                                  </div>
                                );
                              } else {
                                return (
                                  <button 
                                    onClick={() => {
                                      setFormData({
                                        id_dosen: row.id_dosen || '',
                                        id_tahun: filterIdTahun || '',
                                        jenis_pengembangan: row.jenis_pengembangan || '',
                                        nama_pengembangan: '',
                                        link_bukti: row.link_bukti || '',
                                      });
                                      setEditingId(null);
                                      setShowForm(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all font-black text-[10px] uppercase tracking-widest border border-blue-100 dark:border-blue-900/30"
                                  >
                                    <Plus size={14} /> Isi TS
                                  </button>
                                );
                              }
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-6 p-4 bg-gray-100/50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/50 dark:border-gray-800 text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <History size={14} />
          <span>Keterangan: Pengisian data tidak berulang. Jika dosen dikirim tugas belajar di tahun TS-2, maka tidak lagi dihitung di TS-1.</span>
        </div>
      </div>
    </div>
  );
}
