'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, Building2, Layout, Maximize } from 'lucide-react';

export default function SarprasPkMPage() {
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
        const informatikaProdi = result.data.filter(p => p.nama_prodi.includes('Informatika'));
        setProdiList(informatikaProdi);
        if (informatikaProdi.length > 0 && !filterIdProdi) {
          setFilterIdProdi(informatikaProdi[0].id_prodi.toString());
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
      const baseUrl = 'http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm';
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
      ? `http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/${editingId}`
      : 'http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm';

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
    setEditingId(item.id_4a1);
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
      const res = await fetch(`http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      showError('Gagal restore data');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('Yakin hapus permanen?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      showError('Gagal hapus permanen');
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
    window.open(`http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/export?id_prodi=${filterIdProdi}&token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sarpras PkM (4.A.1)</h1>
              <p className="text-gray-500 mt-1 font-medium">Tabel 4.A.1 Sarana dan Prasarana PkM</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Sarpras'}</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 animate-in fade-in duration-300 font-medium">
            {error}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Building2 size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sarpras</p>
                <p className="text-2xl font-black text-gray-900">{activeData.length}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Maximize size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Luas</p>
                <p className="text-2xl font-black text-gray-900">{activeData.reduce((acc, curr) => acc + (parseFloat(curr.luas_ruang) || 0), 0).toFixed(1)} <span className="text-sm font-bold text-gray-400">m²</span></p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Trash size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sampah</p>
                <p className="text-2xl font-black text-gray-900">{trashData.length}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-64">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Filter Prodi</label>
              <select 
                value={filterIdProdi} 
                onChange={(e) => setFilterIdProdi(e.target.value)} 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer"
              >
                {prodiList.map(prodi => (
                  <option key={prodi.id_prodi} value={prodi.id_prodi}>{prodi.nama_prodi}</option>
                ))}
              </select>
            </div>
            <button onClick={fetchData} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => setShowTrash(!showTrash)} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition border shadow-sm ${showTrash ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {showTrash ? 'Lihat Aktif' : 'Lihat Sampah'}
            </button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-600 text-white rounded-lg"><Layout size={20} /></div>
              <h2 className="text-xl font-black text-gray-900">{editingId ? 'Edit Data Sarpras' : 'Input Sarpras Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Program Studi</label>
                  <select 
                    value={formData.id_prodi} 
                    onChange={(e) => setFormData({...formData, id_prodi: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium"
                    required
                  >
                    <option value="">Pilih Program Studi</option>
                    {prodiList.map(p => (
                      <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Prasarana</label>
                  <input 
                    type="text" 
                    value={formData.nama_prasarana} 
                    onChange={(e) => setFormData({...formData, nama_prasarana: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" 
                    placeholder="Nama Laboratorium / Ruang"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Daya Tampung</label>
                  <input 
                    type="number" 
                    value={formData.daya_tampung} 
                    onChange={(e) => setFormData({...formData, daya_tampung: parseInt(e.target.value) || 0})} 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" 
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Luas Ruang (m²)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.luas_ruang} 
                    onChange={(e) => setFormData({...formData, luas_ruang: parseFloat(e.target.value) || 0})} 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" 
                    min="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Status Milik</label>
                    <select 
                      value={formData.status_milik} 
                      onChange={(e) => setFormData({...formData, status_milik: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium text-sm"
                    >
                      <option value="M">Milik Sendiri (M)</option>
                      <option value="W">Sewa (W)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Status Lisensi</label>
                    <select 
                      value={formData.status_lisensi} 
                      onChange={(e) => setFormData({...formData, status_lisensi: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium text-sm"
                    >
                      <option value="L">Berlisensi (L)</option>
                      <option value="P">Public Domain (P)</option>
                      <option value="T">Tidak Berlisensi (T)</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Detail Perangkat</label>
                  <textarea 
                    value={formData.perangkat} 
                    onChange={(e) => setFormData({...formData, perangkat: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" 
                    placeholder="Daftar Perangkat (Hard/Soft, Bandwidth, Tool, dll)"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Info Tambahan</label>
                  <input 
                    type="text" 
                    value={formData.info_tambahan} 
                    onChange={(e) => setFormData({...formData, info_tambahan: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" 
                    placeholder="Kegunaan / Informasi lainnya"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Link Bukti</label>
                  <input 
                    type="text" 
                    value={formData.link_bukti} 
                    onChange={(e) => setFormData({...formData, link_bukti: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" 
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-200">{editingId ? 'Update Data' : 'Simpan Sarpras'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Layout size={40} />
              </div>
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data sarpras</p>
              <p className="text-gray-300 text-sm mt-1">Gunakan tombol "Tambah Sarpras" untuk mulai mengisi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-wider border">Nama Prasarana</th>
                    <th className="px-4 py-5 text-[10px] font-black text-gray-400 uppercase tracking-wider border text-center">Daya Tampung</th>
                    <th className="px-4 py-5 text-[10px] font-black text-gray-400 uppercase tracking-wider border text-center">Luas Ruang (m²)</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-wider border text-center">Milik Sendiri (M)/ Sewa (W)</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-wider border text-center">Berlisensi (L)/ Public Domain (P)/ Tidak Berlisensi (T)</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-wider border">Perangkat</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-wider border text-center">Info Tambahan</th>
                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-wider border">Link Bukti</th>
                    {!showTrash && <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-wider border">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(showTrash ? trashData : activeData).map((item) => (
                    <tr key={item.id_4a1} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-6 border text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.nama_prasarana}</td>
                      <td className="px-4 py-6 border text-center">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-black">{item.daya_tampung}</span>
                      </td>
                      <td className="px-4 py-6 border text-center">
                        <div className="text-sm font-bold text-gray-900">{item.luas_ruang}</div>
                      </td>
                      <td className="px-6 py-6 border text-center">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${item.status_milik === 'M' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                          {item.status_milik}
                        </span>
                      </td>
                      <td className="px-6 py-6 border text-center">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${item.status_lisensi === 'L' ? 'bg-blue-100 text-blue-600' : item.status_lisensi === 'P' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                          {item.status_lisensi}
                        </span>
                      </td>
                      <td className="px-6 py-6 border text-xs text-gray-500 font-medium max-w-xs truncate">{item.perangkat || '-'}</td>
                      <td className="px-6 py-6 border text-center text-xs text-gray-500 font-medium">{item.info_tambahan || '-'}</td>
                      <td className="px-6 py-6 border">
                        {item.link_bukti ? (
                          <a href={item.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-black text-xs uppercase tracking-wider">
                            Buka <Download size={12} />
                          </a>
                        ) : <span className="text-gray-300 text-xs">-</span>}
                      </td>
                      {!showTrash && (
                        <td className="px-6 py-6 border">
                          <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
                            <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                            <div className="w-px h-4 bg-gray-200 mx-2"></div>
                            <button onClick={() => handleSoftDelete(item.id_4a1)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      )}
                      {showTrash && (
                         <td className="px-6 py-6 border">
                           <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
                             <button onClick={() => handleRestore(item.id_4a1)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Restore"><RotateCcw size={16} /></button>
                             <div className="w-px h-4 bg-gray-200 mx-2"></div>
                             <button onClick={() => handleHardDelete(item.id_4a1)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus Permanen"><Trash size={16} /></button>
                           </div>
                         </td>
                      )}
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
