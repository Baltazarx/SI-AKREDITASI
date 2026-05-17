'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, Beaker, Maximize, ExternalLink } from 'lucide-react';

export default function SarprasPenelitianPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterIdProdi, setFilterIdProdi] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');
  const [prodiList, setProdiList] = useState([]);

  const [formData, setFormData] = useState({
    id_prodi: '',
    nama_prasarana: '',
    daya_tampung: 0,
    luas_ruang: 0,
    status_milik: 'M',
    status_lisensi: 'L',
    perangkat: '',
    info_tambahan: '',
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
      fetchProdiList();
    }
  }, [router]);

  useEffect(() => {
    if (filterIdProdi) {
      fetchData();
    }
  }, [filterIdProdi]);

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setProdiList(result.data);
        if (result.data.length > 0 && !filterIdProdi) {
          setFilterIdProdi(result.data[0].id_prodi.toString());
        }
      }
    } catch (err) {
      console.error('Error fetching prodi list:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseUrl = 'http://localhost:5000/api/sarpras/3a1-sarana-prasarana';
      const params = `?id_prodi=${filterIdProdi}`;

      const [activeRes, trashRes] = await Promise.all([
        fetch(`${baseUrl}${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/trash${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();

      if (activeResult.success) setActiveData(activeResult.data || []);
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
      ? `http://localhost:5000/api/sarpras/3a1-sarana-prasarana/${editingId}`
      : 'http://localhost:5000/api/sarpras/3a1-sarana-prasarana';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          id_prodi: filterIdProdi
        }),
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
    setEditingId(item.id_3a1);
    setFormData({
      id_prodi: item.id_prodi,
      nama_prasarana: item.nama_prasarana,
      daya_tampung: item.daya_tampung,
      luas_ruang: item.luas_ruang,
      status_milik: item.status_milik,
      status_lisensi: item.status_lisensi,
      perangkat: item.perangkat || '',
      info_tambahan: item.info_tambahan || '',
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sarpras/3a1-sarana-prasarana/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/sarpras/3a1-sarana-prasarana/restore/${id}`, {
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
    if (!confirm('Yakin hapus permanen?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sarpras/3a1-sarana-prasarana/hard/${id}`, {
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
      id_prodi: filterIdProdi,
      nama_prasarana: '',
      daya_tampung: 0,
      luas_ruang: 0,
      status_milik: 'M',
      status_lisensi: 'L',
      perangkat: '',
      info_tambahan: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/sarpras/3a1-sarana-prasarana/export?id_prodi=${filterIdProdi}&token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-white tracking-tight">Sarpras Penelitian (3.A.1)</h1>
              <p className="text-gray-400 mt-1 font-medium">Kelola data sarana dan prasarana laboratorium / ruang penelitian</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Sarpras'}</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/20 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-blue-900/20 text-blue-600 rounded-xl"><Beaker size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Fasilitas</p>
                <p className="text-2xl font-black text-white">{activeData.length}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-purple-900/20 text-purple-600 rounded-xl"><Maximize size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Luas Total</p>
                <p className="text-2xl font-black text-white">{activeData.reduce((acc, curr) => acc + (parseFloat(curr.luas_ruang) || 0), 0).toFixed(2)} m²</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-orange-900/20 text-orange-600 rounded-xl"><Trash size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sampah</p>
                <p className="text-2xl font-black text-white">{trashData.length}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-64">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Program Studi</label>
              <select
                value={filterIdProdi}
                onChange={(e) => setFilterIdProdi(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer"
              >
                {prodiList.map(p => (
                  <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                ))}
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
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Data Sarpras' : 'Input Sarpras Penelitian Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Nama Prasarana Penelitian</label>
                  <input type="text" value={formData.nama_prasarana} onChange={(e) => setFormData({ ...formData, nama_prasarana: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="Contoh: Laboratorium Riset AI & Data Science" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Daya Tampung</label>
                  <input type="number" value={formData.daya_tampung} onChange={(e) => setFormData({ ...formData, daya_tampung: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Luas Ruang (m²)</label>
                  <input type="number" step="0.01" value={formData.luas_ruang} onChange={(e) => setFormData({ ...formData, luas_ruang: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Status Milik</label>
                  <select value={formData.status_milik} onChange={(e) => setFormData({ ...formData, status_milik: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium">
                    <option value="M">Milik Sendiri (M)</option>
                    <option value="W">Sewa (W)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Status Lisensi</label>
                  <select value={formData.status_lisensi} onChange={(e) => setFormData({ ...formData, status_lisensi: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium">
                    <option value="L">Berlisensi (L)</option>
                    <option value="P">Public Domain (P)</option>
                    <option value="T">Tidak Berlisensi (T)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Perangkat Riset & Spesifikasi</label>
                  <textarea value={formData.perangkat} onChange={(e) => setFormData({ ...formData, perangkat: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" rows="3" placeholder="Server, GPU, Alat Ukur, Software Riset, dll" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Info Tambahan / Fokus Riset</label>
                  <input type="text" value={formData.info_tambahan} onChange={(e) => setFormData({ ...formData, info_tambahan: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="Bidang fokus penelitian" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Link Bukti Penelitian (Drive/Web)</label>
                  <input type="text" value={formData.link_bukti} onChange={(e) => setFormData({ ...formData, link_bukti: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="https://..." />
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
        <div className="bg-gray-900 rounded-[2rem] shadow-2xl shadow-black/50 border border-gray-800 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight italic">Belum ada data sarpras penelitian</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-800">
                    <th className="px-6 py-5 text-center">No</th>
                    <th className="px-6 py-5">Nama Prasarana</th>
                    <th className="px-6 py-5 text-center">Kapasitas</th>
                    <th className="px-6 py-5 text-center">Luas (m²)</th>
                    <th className="px-6 py-5 text-center">Status Milik</th>
                    <th className="px-6 py-5 text-center">Lisensi</th>
                    <th className="px-6 py-5">Perangkat</th>
                    <th className="px-6 py-5">Info Tambahan</th>
                    <th className="px-6 py-5 text-center">Bukti</th>
                    <th className="px-6 py-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {(showTrash ? trashData : activeData).map((item, index) => (
                    <tr key={item.id_3a1} className="hover:bg-gray-800/30 transition-all duration-300 group">
                      <td className="px-6 py-5 text-center font-bold text-gray-500 text-xs">{index + 1}</td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{item.nama_prasarana || '-'}</div>
                      </td>
                      <td className="px-6 py-5 text-center font-medium text-gray-300">{item.daya_tampung ?? '-'}</td>
                      <td className="px-6 py-5 text-center font-medium text-gray-300">{item.luas_ruang ?? '-'}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full font-black text-[10px] border ${item.status_milik === 'M' ? 'bg-blue-900/20 border-blue-800/50 text-blue-400' : 'bg-gray-800/50 border-gray-700 text-gray-500'
                          }`}>
                          {item.status_milik === 'M' ? 'MILIK' : 'SEWA'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full font-black text-[10px] border ${item.status_lisensi === 'L' ? 'bg-emerald-900/20 border-emerald-800/50 text-emerald-400' :
                            item.status_lisensi === 'P' ? 'bg-purple-900/20 border-purple-800/50 text-purple-400' :
                              'bg-rose-900/20 border-rose-800/50 text-rose-400'
                          }`}>
                          {item.status_lisensi === 'L' ? 'LISENSI' : item.status_lisensi === 'P' ? 'PUBLIC' : 'TDK LISENSI'}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-medium text-gray-400 text-xs max-w-[200px] leading-relaxed italic">{item.perangkat || '-'}</td>
                      <td className="px-6 py-5 font-medium text-gray-500 text-xs">{item.info_tambahan || '-'}</td>
                      <td className="px-6 py-5 text-center">
                        {item.link_bukti ? (
                          <a href={item.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-white font-bold bg-blue-900/20 hover:bg-blue-600 px-3 py-1.5 rounded-xl transition-all duration-300 text-[10px] uppercase tracking-wider">
                            <ExternalLink size={14} /> Buka
                          </a>
                        ) : (
                          <span className="text-gray-700 italic">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {showTrash ? (
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleRestore(item.id_3a1)} className="p-2 bg-emerald-900/20 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl transition-all duration-300" title="Restore"><RotateCcw size={16} /></button>
                            <button onClick={() => handleHardDelete(item.id_3a1)} className="p-2 bg-rose-900/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all duration-300" title="Hapus Permanen"><Trash size={16} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEdit(item)} className="px-4 py-2 bg-blue-900/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300 border border-blue-900/30">Edit</button>
                            <button onClick={() => handleSoftDelete(item.id_3a1)} className="p-2 bg-rose-900/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all duration-300 border border-rose-900/30" title="Hapus"><Trash2 size={16} /></button>
                          </div>
                        )}
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
