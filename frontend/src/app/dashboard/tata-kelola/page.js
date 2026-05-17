'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, Monitor, Link as LinkIcon, ExternalLink, ShieldCheck, Globe, Shield } from 'lucide-react';

export default function SistemTataKelolaPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    jenis_tata_kelola: '',
    nama_sistem: '',
    akses: 'Internet',
    id_unit: '',
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
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseUrl = 'http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola';
      
      const [activeRes, trashRes] = await Promise.all([
        fetch(baseUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/trash`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      
      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();
      
      if (activeResult.success) {
        setActiveData(activeResult.data || []);
        setUnits(activeResult.units || []);
      }
      if (trashResult.success) {
        setTrashData(trashResult.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      showError('Gagal memuat data dari server');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/${editingId}`
      : 'http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          id_unit: formData.id_unit ? parseInt(formData.id_unit) : null
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
        resetForm();
      } else {
        showError(result.message || 'Terjadi kesalahan saat menyimpan data');
      }
    } catch (err) {
      showError('Terjadi kesalahan koneksi server');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_5_1);
    setFormData({
      jenis_tata_kelola: item.jenis_tata_kelola || '',
      nama_sistem: item.nama_sistem || '',
      akses: item.akses || 'Internet',
      id_unit: item.id_unit ? item.id_unit.toString() : '',
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Pindahkan data tata kelola ini ke tempat sampah?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
      } else {
        showError(result.message || 'Gagal menghapus data');
      }
    } catch (err) {
      showError('Terjadi kesalahan server');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
      } else {
        showError(result.message || 'Gagal memulihkan data');
      }
    } catch (err) {
      showError('Terjadi kesalahan server');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('HAPUS PERMANEN? Tindakan ini tidak dapat dibatalkan.')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
      } else {
        showError(result.message || 'Gagal menghapus permanen');
      }
    } catch (err) {
      showError('Terjadi kesalahan server');
    }
  };

  const resetForm = () => {
    setFormData({
      jenis_tata_kelola: '',
      nama_sistem: '',
      akses: 'Internet',
      id_unit: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/export?token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-white tracking-tight">Sistem Tata Kelola (5.1)</h1>
              <p className="text-gray-400 mt-1 font-medium">Kelola sistem informasi pendukung operasional & tata kelola institusi</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Tata Kelola'}</span>
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

        {/* Stats & Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-blue-900/20 text-blue-400 rounded-xl"><ShieldCheck size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sistem</p>
                <p className="text-2xl font-black text-white">{activeData.length}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-emerald-900/20 text-emerald-400 rounded-xl"><Globe size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Akses Internet</p>
                <p className="text-2xl font-black text-white">{activeData.filter(d => d.akses === 'Internet').length}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-amber-900/20 text-amber-400 rounded-xl"><Shield size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Akses Lokal</p>
                <p className="text-2xl font-black text-white">{activeData.filter(d => d.akses === 'Lokal').length}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-orange-900/20 text-orange-400 rounded-xl"><Trash size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sampah</p>
                <p className="text-2xl font-black text-white">{trashData.length}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end justify-end">
            <button onClick={fetchData} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-950/50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => setShowTrash(!showTrash)} 
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition border shadow-sm ${showTrash ? 'bg-orange-900/20 border-orange-800 text-orange-600' : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-950/50'}`}
            >
              {showTrash ? 'Lihat Aktif' : 'Lihat Sampah'}
            </button>
          </div>
        </div>

        {/* Input Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl border border-gray-800 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Data Tata Kelola' : 'Input Sistem Tata Kelola Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Jenis Tata Kelola</label>
                  <input 
                    type="text" 
                    value={formData.jenis_tata_kelola} 
                    onChange={(e) => setFormData({...formData, jenis_tata_kelola: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white" 
                    placeholder="Contoh: Sistem Informasi Akademik" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Nama Sistem Informasi</label>
                  <input 
                    type="text" 
                    value={formData.nama_sistem} 
                    onChange={(e) => setFormData({...formData, nama_sistem: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white" 
                    placeholder="Contoh: SIAKAD" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Akses</label>
                  <select 
                    value={formData.akses} 
                    onChange={(e) => setFormData({...formData, akses: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white cursor-pointer"
                  >
                    <option value="Internet">Internet</option>
                    <option value="Lokal">Lokal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Unit Pengelola</label>
                  <select 
                    value={formData.id_unit} 
                    onChange={(e) => setFormData({...formData, id_unit: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white cursor-pointer"
                  >
                    <option value="">-- Pilih Unit --</option>
                    {units.map(u => (
                      <option key={u.id_unit} value={u.id_unit}>{u.nama_unit}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Link Bukti Dokumen/Sistem</label>
                  <input 
                    type="url" 
                    value={formData.link_bukti} 
                    onChange={(e) => setFormData({...formData, link_bukti: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white" 
                    placeholder="Contoh: https://siakad.stikompgri-bwy.ac.id" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={resetForm} className="px-6 py-2.5 text-gray-400 hover:text-gray-200 font-bold uppercase text-xs transition">
                  Batal
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-lg transition">
                  {editingId ? 'Simpan Perubahan' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <RefreshCw className="animate-spin text-blue-500" size={32} />
              <span className="font-bold text-sm uppercase tracking-wider">Memuat Data...</span>
            </div>
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Monitor size={48} className="mb-4 text-gray-700" />
              <p className="font-bold text-lg text-gray-400 uppercase tracking-widest">Tidak Ada Data</p>
              <p className="text-gray-500 text-sm mt-1">{showTrash ? 'Tempat sampah kosong.' : 'Belum ada data sistem tata kelola.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr className="text-[11px] font-black text-gray-300 uppercase tracking-widest">
                    <th className="px-4 py-4 border border-gray-700">No</th>
                    <th className="px-6 py-4 border border-gray-700 text-left min-w-[200px]">Jenis Tata Kelola</th>
                    <th className="px-6 py-4 border border-gray-700 text-left min-w-[200px]">Nama Sistem Informasi</th>
                    <th className="px-4 py-4 border border-gray-700">Akses</th>
                    <th className="px-6 py-4 border border-gray-700 text-left">Unit Pengelola</th>
                    <th className="px-4 py-4 border border-gray-700">Bukti</th>
                    <th className="px-4 py-4 border border-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(showTrash ? trashData : activeData).map((item, idx) => (
                    <tr key={item.id_5_1} className="hover:bg-blue-900/10 transition-colors group text-gray-300">
                      <td className="px-4 py-4 border border-gray-700 font-black">{idx + 1}</td>
                      <td className="px-6 py-4 border border-gray-700 text-left font-black text-white">{item.jenis_tata_kelola || '-'}</td>
                      <td className="px-6 py-4 border border-gray-700 text-left font-black text-blue-400">{item.nama_sistem || '-'}</td>
                      <td className="px-4 py-4 border border-gray-700">
                        <span 
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                            item.akses === 'Internet' 
                              ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' 
                              : 'bg-amber-950/40 border-amber-900/50 text-amber-400'
                          }`}
                        >
                          {item.akses}
                        </span>
                      </td>
                      <td className="px-6 py-4 border border-gray-700 text-left font-bold text-gray-400">{item.nama_unit || '-'}</td>
                      <td className="px-4 py-4 border border-gray-700">
                        {item.link_bukti ? (
                          <a 
                            href={item.link_bukti} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300 px-2.5 py-1.5 rounded-lg border border-gray-700 text-xs font-bold transition"
                          >
                            <LinkIcon size={12} />
                            <span>Buka</span>
                            <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-gray-600 text-xs font-bold">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 border border-gray-700">
                        <div className="flex items-center justify-center gap-3">
                          {!showTrash ? (
                            <>
                              <button 
                                onClick={() => handleEdit(item)} 
                                className="p-1.5 bg-gray-800 hover:bg-blue-900/40 border border-gray-700 hover:border-blue-900/60 rounded-lg text-gray-400 hover:text-blue-400 transition"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={() => handleSoftDelete(item.id_5_1)} 
                                className="p-1.5 bg-gray-800 hover:bg-red-900/40 border border-gray-700 hover:border-red-900/60 rounded-lg text-gray-400 hover:text-red-400 transition"
                                title="Hapus ke Sampah"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleRestore(item.id_5_1)} 
                                className="flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-emerald-900/40 border border-gray-700 hover:border-emerald-900/60 rounded-lg text-gray-400 hover:text-emerald-400 text-xs font-bold transition"
                                title="Restore"
                              >
                                <RotateCcw size={12} />
                                <span>Pulihkan</span>
                              </button>
                              <button 
                                onClick={() => handleHardDelete(item.id_5_1)} 
                                className="flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-red-900/40 border border-gray-700 hover:border-red-900/60 rounded-lg text-gray-400 hover:text-red-400 text-xs font-bold transition"
                                title="Hapus Permanen"
                              >
                                <Trash size={12} />
                                <span>Hapus</span>
                              </button>
                            </>
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
