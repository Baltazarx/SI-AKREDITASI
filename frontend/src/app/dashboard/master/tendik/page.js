'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, Briefcase, UserCheck, Settings } from 'lucide-react';

export default function TendikPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [jenisSelection, setJenisSelection] = useState('Administrasi');
  
  const [formData, setFormData] = useState({
    id_pegawai: '',
    jenis_tendik: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
      fetchPegawaiList();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tendik', {
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
      const res = await fetch('http://localhost:5000/api/master/pegawai', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/master/tendik/${editingId}`
      : 'http://localhost:5000/api/master/tendik';

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
    setEditingId(item.id_tendik);
    setFormData({
      id_pegawai: item.id_pegawai || '',
      jenis_tendik: item.jenis_tendik || '',
    });
    const defaults = ['Pustakawan', 'Laboran/Teknisi', 'Administrasi'];
    setJenisSelection(defaults.includes(item.jenis_tendik) ? item.jenis_tendik : 'Lainnya');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/tendik/${id}`, {
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
      id_pegawai: '',
      jenis_tendik: '',
    });
    setJenisSelection('Administrasi');
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
              <h1 className="text-3xl font-black text-white tracking-tight">Master Data - Tendik</h1>
              <p className="text-gray-400 mt-1 font-medium">Kelola database tenaga kependidikan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Tendik'}</span>
              </button>
              <button onClick={fetchData} className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-950/50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-blue-900/20 text-blue-600 rounded-xl"><Briefcase size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tendik</p>
              <p className="text-2xl font-black text-white">{data.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-purple-900/20 text-purple-600 rounded-xl"><UserCheck size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
              <p className="text-2xl font-black text-white">Aktif</p>
            </div>
          </div>
          <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-emerald-900/20 text-emerald-600 rounded-xl"><Settings size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sistem</p>
              <p className="text-2xl font-black text-white">Stabil</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Data Tendik' : 'Input Tendik Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Pilih Pegawai</label>
                  <select 
                    value={formData.id_pegawai} 
                    onChange={(e) => setFormData({...formData, id_pegawai: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" 
                    required
                  >
                    <option value="">-- Pilih Pegawai --</option>
                    {pegawaiList.map(pegawai => (
                      <option key={pegawai.id_pegawai} value={pegawai.id_pegawai}>{pegawai.nama_lengkap} - {pegawai.nikp}</option>
                    ))}
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Jenis Tenaga Kependidikan</label>
                  <select 
                    value={jenisSelection} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setJenisSelection(val);
                      if (val !== 'Lainnya') {
                        setFormData({...formData, jenis_tendik: val});
                      } else {
                        setFormData({...formData, jenis_tendik: ''});
                      }
                    }} 
                    className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium mb-3"
                  >
                    <option value="Administrasi">Administrasi</option>
                    <option value="Pustakawan">Pustakawan</option>
                    <option value="Laboran/Teknisi">Laboran/Teknisi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  
                  {jenisSelection === 'Lainnya' && (
                    <input 
                      type="text" 
                      value={formData.jenis_tendik} 
                      onChange={(e) => setFormData({...formData, jenis_tendik: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium animate-in slide-in-from-top-2" 
                      placeholder="Masukkan Jenis Tendik"
                      required
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20">{editingId ? 'Update Tendik' : 'Simpan Tendik'}</button>
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
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data tendik</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 last:border-0 text-center w-20">No</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 last:border-0">Nama Tenaga Kependidikan</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 last:border-0 text-center">Jenis Tendik</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {data.map((item, index) => (
                    <tr key={item.id_tendik} className="hover:bg-blue-900/30 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-700 last:border-0 text-center">
                        <span className="text-xs font-black text-gray-400">{index + 1}</span>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-700 last:border-0">
                        <div className="text-sm font-black text-white group-hover:text-blue-600 transition-colors">{item.nama_lengkap || '-'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-700 last:border-0 text-center">
                        <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-wider">{item.jenis_tendik || '-'}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center bg-gray-900 border border-gray-700 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-800 group-hover:shadow-md">
                          <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-900/20 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                          <div className="w-px h-4 bg-gray-700 mx-2"></div>
                          <button onClick={() => handleDelete(item.id_tendik)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
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
