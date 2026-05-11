'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, History, UserCheck, Briefcase, Calendar } from 'lucide-react';

export default function PimpinanPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [isTrashMode, setIsTrashMode] = useState(false);

  const [formData, setFormData] = useState({
    id_pegawai: '',
    id_jafung: '',
    periode_mulai: '',
    periode_selesai: '',
    tupoksi: '',
    sks_jabatan: '',
    nama_jafung_display: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData(false);
      fetchPegawaiList();
      fetchDosenList();
    }
  }, [router]);

  const fetchData = async (trash = isTrashMode) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const url = trash 
        ? 'http://localhost:5000/api/upps/1a1-pimpinan/trash' 
        : 'http://localhost:5000/api/upps/1a1-pimpinan';
      const res = await fetch(url, {
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

  const fetchPegawaiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/upps/1a1-pimpinan/available-pegawai', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setPegawaiList(result.data);
      }
    } catch (err) {
      console.error('Error fetching pegawai list:', err);
    }
  };

  const fetchDosenList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/dosen', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setDosenList(result.data);
      }
    } catch (err) {
      console.error('Error fetching dosen list:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Validasi duplikasi tidak diperlukan lagi untuk mode create 
    // karena backend sudah menyediakan pegawai yang tersedia saja

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/upps/1a1-pimpinan/${editingId}`
      : 'http://localhost:5000/api/upps/1a1-pimpinan';

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
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_pimpinan);
    let resolvedIdPegawai = item.id_pegawai ? String(item.id_pegawai) : '';
    if (!resolvedIdPegawai || resolvedIdPegawai === 'undefined') {
      const match = pegawaiList.find(p => p.nama_lengkap === item.nama_lengkap);
      resolvedIdPegawai = match ? String(match.id_pegawai) : '';
    }

    setFormData({
      id_pegawai: resolvedIdPegawai,
      id_jafung: String(item.id_jafung || ''),
      periode_mulai: item.periode_mulai || '',
      periode_selesai: item.periode_selesai || '',
      tupoksi: item.tupoksi || '',
      sks_jabatan: String(item.sks_jabatan || ''),
      nama_jafung_display: item.nama_jafung || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a1-pimpinan/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/upps/1a1-pimpinan/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData(true);
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('⚠️ PERHATIAN: Data akan dihapus PERMANEN.')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a1-pimpinan/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData(true);
    } catch (err) {
      alert('Terjadi kesalahan server');
    }
  };

  const resetForm = () => {
    setFormData({
      id_pegawai: '',
      id_jafung: '',
      periode_mulai: '',
      periode_selesai: '',
      tupoksi: '',
      sks_jabatan: '',
      nama_jafung_display: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/upps/1a1-pimpinan/export?token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pimpinan (1.A.1)</h1>
              <p className="text-gray-500 mt-1 font-medium">Kelola data pimpinan UPPS & Tupoksi</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {!isTrashMode && (
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold text-sm">
                  <Plus size={18} />
                  <span>{showForm ? 'Tutup Form' : 'Tambah Pimpinan'}</span>
                </button>
              )}
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><UserCheck size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Aktif</p>
                <p className="text-2xl font-black text-gray-900">{isTrashMode ? '-' : data.length}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Briefcase size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit UPPS</p>
                <p className="text-2xl font-black text-gray-900">{isTrashMode ? '-' : [...new Set(data.map(d => d.nama_unit_display))].length}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><History size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mode</p>
                <p className="text-2xl font-black text-gray-900">{isTrashMode ? 'Sampah' : 'Aktif'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <button onClick={() => fetchData(isTrashMode)} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => {
                const newMode = !isTrashMode;
                setIsTrashMode(newMode);
                fetchData(newMode);
                if(newMode) setShowForm(false);
              }} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition border shadow-sm ${isTrashMode ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {isTrashMode ? 'Lihat Aktif' : 'Lihat Sampah'}
            </button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Data Pimpinan' : 'Input Pimpinan Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Pegawai</label>
                  <select 
                    value={formData.id_pegawai} 
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const dosenInfo = dosenList.find(d => String(d.id_pegawai) === selectedId);
                      setFormData({
                        ...formData,
                        id_pegawai: selectedId,
                        nama_jafung_display: dosenInfo?.nama_jafung || 'Non-Jafung'
                      });
                    }} 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" 
                    required
                  >
                    <option value="">-- Pilih Pegawai --</option>
                    {pegawaiList.map(pegawai => (
                      <option key={pegawai.id_pegawai} value={String(pegawai.id_pegawai)}>{pegawai.nama_lengkap}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jabatan Fungsional</label>
                  <input type="text" value={formData.nama_jafung_display} readOnly className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-2xl outline-none font-medium text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Periode Mulai</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="number" value={formData.periode_mulai} onChange={(e) => setFormData({ ...formData, periode_mulai: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="Tahun Mulai (e.g. 2023)" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Periode Selesai</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="number" value={formData.periode_selesai} onChange={(e) => setFormData({ ...formData, periode_selesai: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="Tahun Selesai (e.g. 2026)" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tupoksi (Tugas Pokok & Fungsi)</label>
                  <textarea value={formData.tupoksi} onChange={(e) => setFormData({ ...formData, tupoksi: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" rows="3" placeholder="Masukkan rincian tupoksi..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-200">{editingId ? 'Update Data' : 'Simpan Data'}</button>
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
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data pimpinan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-0">Unit / Jabatan</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-0">Nama Pimpinan</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-0 text-center">Periode</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-0">Pendidikan Terakhir</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-0">Tupoksi</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.map((item) => (
                    <tr key={item.id_pimpinan} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.nama_unit_display || '-'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-sm font-bold text-gray-800">{item.nama_lengkap || '-'}</div>
                        <div className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase">{item.nama_jafung || 'Non-Jafung'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 inline-block text-[10px] font-black tracking-wider whitespace-nowrap">{item.periode_mulai} - {item.periode_selesai}</span>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">{item.pendidikan_terakhir || '-'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-xs font-medium text-gray-600 line-clamp-2 max-w-xs">{item.tupoksi || '-'}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {isTrashMode ? (
                            <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-orange-200">
                              <button onClick={() => handleRestore(item.id_pimpinan)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Restore"><History size={16} /></button>
                              <div className="w-px h-4 bg-gray-200 mx-2"></div>
                              <button onClick={() => handleHardDelete(item.id_pimpinan)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus Permanen"><Trash2 size={16} /></button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-200 group-hover:shadow-md">
                              <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                              <div className="w-px h-4 bg-gray-200 mx-2"></div>
                              <button onClick={() => handleDelete(item.id_pimpinan)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
                            </div>
                          )}
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
