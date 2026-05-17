'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, Landmark, PieChart, History, ExternalLink } from 'lucide-react';

export default function SumberDanaPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [showTrash, setShowTrash] = useState(false);
  
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    nama_sumber: '',
    jumlah_dana: '',
    link_bukti: '',
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
    if (prodiList.length > 0 && (!filterProdi || filterProdi === '')) {
      const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
      if (tiProdi) setFilterProdi(tiProdi.id_prodi.toString());
    }
  }, [prodiList, filterProdi]);

  useEffect(() => {
    if (!showTrash && (!filterTahun || filterTahun === '')) {
      const currentYear = new Date().getFullYear();
      let targetTahun = tahunList.find(t => parseInt(t.tahun) === currentYear);
      if (!targetTahun && tahunList.length > 0) targetTahun = tahunList[tahunList.length - 1];
      if (targetTahun) setFilterTahun(targetTahun.id_tahun.toString());
    }
  }, [showTrash, tahunList, filterTahun]);

  useEffect(() => {
    if (filterProdi && filterTahun) fetchData();
  }, [filterProdi, filterTahun]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseParams = `id_prodi=${filterProdi}&id_tahun=${filterTahun}`;
      const activeUrl = `http://localhost:5000/api/keuangan/1a2-sumber-pendanaan?${baseParams}`;
      const trashUrl  = `http://localhost:5000/api/keuangan/1a2-sumber-pendanaan/trash?${baseParams}`;
      const [activeRes, trashRes] = await Promise.all([
        fetch(activeUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(trashUrl,  { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();
      if (activeResult.success) setActiveData(activeResult.data || []);
      if (trashResult.success) setTrashData(trashResult.data || []);
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
      if (result.success) setTahunList(result.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun)));
    } catch (err) {
      console.error('Error fetching tahun:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/keuangan/1a2-sumber-pendanaan/${editingId}`
      : 'http://localhost:5000/api/keuangan/1a2-sumber-pendanaan';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          jumlah_dana: Number(formData.jumlah_dana) || 0
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
    setEditingId(item.id_sumber);
    setFormData({
      id_prodi: item.id_prodi || '',
      id_tahun: item.id_tahun || '',
      nama_sumber: item.nama_sumber || '',
      jumlah_dana: item.jumlah_dana || '',
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/keuangan/1a2-sumber-pendanaan/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/keuangan/1a2-sumber-pendanaan/${id}/restore`, {
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
      const res = await fetch(`http://localhost:5000/api/keuangan/1a2-sumber-pendanaan/${id}/hard`, {
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
      id_tahun: filterTahun || '',
      nama_sumber: '',
      jumlah_dana: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const pivotedDataInfo = useMemo(() => {
    const dataToProcess = activeData || [];
    if (dataToProcess.length === 0) return { data: [], ts: new Date().getFullYear() };
    let ts;
    if (filterTahun) {
      const selectedTahun = tahunList.find(t => String(t.id_tahun) === String(filterTahun));
      ts = selectedTahun ? parseInt(selectedTahun.tahun) : new Date().getFullYear();
    } else {
      ts = Math.max(...dataToProcess.map(d => parseInt(d.nama_tahun) || 0));
    }
    const pivot = {};
    dataToProcess.forEach(item => {
      const prodi = item.nama_prodi || '-';
      const sumber = item.nama_sumber || '-';
      const key = `${prodi}_${sumber}`;
      if (!pivot[key]) {
        pivot[key] = { 
          nama_prodi: prodi,
          nama_sumber: sumber,
          link_bukti: item.link_bukti,
          ts2: 0, ts1: 0, ts: 0, 
          raw: [] 
        };
      }
      const itemTahun = parseInt(item.nama_tahun);
      if (itemTahun === ts) pivot[key].ts = item.jumlah_dana;
      else if (itemTahun === ts - 1) pivot[key].ts1 = item.jumlah_dana;
      else if (itemTahun === ts - 2) pivot[key].ts2 = item.jumlah_dana;
      pivot[key].raw.push(item);
    });
    return { data: Object.values(pivot), ts };
  }, [activeData, filterTahun, tahunList]);

  const formatRupiah = (angka) => {
    if (!angka) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/keuangan/1a2-sumber-pendanaan/export?id_prodi=${filterProdi}&id_tahun=${filterTahun}&token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-white tracking-tight">Sumber Dana (1.A.2)</h1>
              <p className="text-gray-400 mt-1 font-medium">Pengelolaan sumber pendanaan operasional & pengembangan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Sumber'}</span>
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
              <div className="p-3 bg-blue-900/20 text-blue-600 rounded-xl"><Landmark size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pendanaan</p>
                <p className="text-2xl font-black text-white">{formatRupiah(pivotedDataInfo.data.reduce((acc, curr) => acc + (curr.ts || 0), 0))}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-purple-900/20 text-purple-600 rounded-xl"><PieChart size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sumber Aktif</p>
                <p className="text-2xl font-black text-white">{pivotedDataInfo.data.length}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-orange-900/20 text-orange-600 rounded-xl"><History size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mode</p>
                <p className="text-2xl font-black text-white">{showTrash ? 'Sampah' : 'Aktif'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-48">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Prodi</label>
              <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer">
                {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
              </select>
            </div>
            <div className="flex-1 lg:w-32">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun (TS)</label>
              <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer">
                {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
              </select>
            </div>
            <button onClick={fetchData} className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-950/50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => setShowTrash(!showTrash)} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition border shadow-sm ${showTrash ? 'bg-orange-900/20 border-orange-800 text-orange-600' : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-950/50'}`}
            >
              {showTrash ? 'Lihat Aktif' : 'Lihat Sampah'}
            </button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Sumber Dana' : 'Input Sumber Dana Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Program Studi</label>
                  <select value={formData.id_prodi} onChange={(e) => setFormData({...formData, id_prodi: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Prodi</option>
                    {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Tahun Akademik</label>
                  <select value={formData.id_tahun} onChange={(e) => setFormData({...formData, id_tahun: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Tahun</option>
                    {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Jenis / Sumber Pendanaan</label>
                  <input type="text" value={formData.nama_sumber} onChange={(e) => setFormData({...formData, nama_sumber: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="Contoh: Dana Rutin Yayasan" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Jumlah Dana (Rp)</label>
                  <input type="number" value={formData.jumlah_dana} onChange={(e) => setFormData({...formData, jumlah_dana: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="Masukkan angka saja" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Link Bukti (G-Drive / PDF)</label>
                  <input type="url" value={formData.link_bukti} onChange={(e) => setFormData({...formData, link_bukti: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="https://..." />
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
          ) : (showTrash ? trashData : pivotedDataInfo.data).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data sumber dana</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 border-b border-gray-700">
                  {showTrash ? (
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Sumber Dana</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Jumlah</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Tahun</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Aksi</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Sumber Pendanaan</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">TS-2 ({pivotedDataInfo.ts - 2})</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">TS-1 ({pivotedDataInfo.ts - 1})</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center bg-blue-900/50">TS ({pivotedDataInfo.ts})</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 last:border-0">Link Bukti</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Aksi</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {showTrash ? (
                    trashData.map((item) => (
                      <tr key={item.id_sumber} className="hover:bg-orange-900/30 transition-colors group">
                        <td className="px-8 py-6 border-r border-gray-700 last:border-0">
                          <div className="text-sm font-black text-white">{item.nama_sumber}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-700 last:border-0 font-bold text-gray-300">
                          {formatRupiah(item.jumlah_dana)}
                        </td>
                        <td className="px-8 py-6 border-r border-gray-700 last:border-0 text-center">
                          <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-[10px] font-black">{item.nama_tahun}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center bg-gray-900 border border-gray-700 p-1.5 rounded-xl shadow-sm">
                            <button onClick={() => handleRestore(item.id_sumber)} className="p-1.5 text-emerald-600 hover:bg-emerald-900/20 rounded-lg transition" title="Restore"><RotateCcw size={16} /></button>
                            <div className="w-px h-4 bg-gray-700 mx-2"></div>
                            <button onClick={() => handleHardDelete(item.id_sumber)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus Permanen"><Trash size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    pivotedDataInfo.data.map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-900/30 transition-colors group">
                        <td className="px-8 py-6 border-r border-gray-700 last:border-0">
                          <div className="text-sm font-black text-white group-hover:text-blue-600 transition-colors">{row.nama_sumber}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-700 last:border-0 text-center">
                          <div className="text-sm font-bold text-gray-400">{formatRupiah(row.ts2)}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-700 last:border-0 text-center">
                          <div className="text-sm font-bold text-gray-400">{formatRupiah(row.ts1)}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-700 last:border-0 text-center bg-blue-900/20">
                          <div className="text-sm font-black text-blue-600">{formatRupiah(row.ts)}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-700 last:border-0">
                          {row.link_bukti && (
                            <a href={row.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-300 font-black text-[9px] uppercase tracking-widest">
                              <ExternalLink size={10} /> Bukti
                            </a>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const currentYearItem = row.raw.find(item => parseInt(item.nama_tahun) === pivotedDataInfo.ts);
                              if (currentYearItem) {
                                return (
                                  <div className="inline-flex items-center bg-gray-900 border border-gray-700 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-800 group-hover:shadow-md">
                                    <button onClick={() => handleEdit(currentYearItem)} className="p-1.5 text-blue-600 hover:bg-blue-900/20 rounded-lg transition" title="Edit TS"><Edit size={16} /></button>
                                    <div className="w-px h-4 bg-gray-700 mx-2"></div>
                                    <button onClick={() => handleSoftDelete(currentYearItem.id_sumber)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus TS"><Trash2 size={16} /></button>
                                  </div>
                                );
                              } else {
                                return (
                                  <button 
                                    onClick={() => {
                                      setFormData({
                                        id_prodi: filterProdi || '',
                                        id_tahun: filterTahun || '',
                                        nama_sumber: row.nama_sumber || '',
                                        jumlah_dana: '',
                                        link_bukti: row.link_bukti || '',
                                      });
                                      setEditingId(null);
                                      setShowForm(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 bg-blue-900/20 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-900/30 transition-all font-black text-[10px] uppercase tracking-widest border border-blue-900/50"
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
      </div>
    </div>
  );
}
