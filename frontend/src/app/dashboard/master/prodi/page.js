'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, GraduationCap, School, BookOpen } from 'lucide-react';

export default function ProdiPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [unitList, setUnitList] = useState([]);
  const [openUnit, setOpenUnit] = useState(false);
  
  const [formData, setFormData] = useState({
    nama_prodi: '',
    id_unit: 9,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
      fetchUnitList();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
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
  
  const fetchUnitList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/unit-kerja', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setUnitList(result.data);
      }
    } catch (err) {
      console.error('Error fetching unit list:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/master/prodi/${editingId}`
      : 'http://localhost:5000/api/master/prodi';

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
    setEditingId(item.id_prodi);
    setFormData({
      nama_prodi: item.nama_prodi || '',
      id_unit: item.id_unit || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/prodi/${id}`, {
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
      nama_prodi: '',
      id_unit: 9,
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
              <h1 className="text-3xl font-black text-white tracking-tight">Master Data - Prodi</h1>
              <p className="text-gray-400 mt-1 font-medium">Kelola database program studi universitas</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Prodi'}</span>
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
            <div className="p-3 bg-blue-900/20 text-blue-600 rounded-xl"><GraduationCap size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Prodi</p>
              <p className="text-2xl font-black text-white">{data.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-purple-900/20 text-purple-600 rounded-xl"><School size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Fakultas</p>
              <p className="text-2xl font-black text-white">1</p>
            </div>
          </div>
          <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-emerald-900/20 text-emerald-600 rounded-xl"><BookOpen size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
              <p className="text-2xl font-black text-white">Aktif</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Data Prodi' : 'Input Prodi Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Nama Program Studi</label>
                  <input type="text" value={formData.nama_prodi} onChange={(e) => setFormData({...formData, nama_prodi: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" required placeholder="Contoh: S1 Teknik Informatika" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Unit</label>
                  <div className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-800 rounded-2xl text-gray-500 font-bold flex items-center gap-2 cursor-not-allowed select-none">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    PRODI
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20">{editingId ? 'Update Prodi' : 'Simpan Prodi'}</button>
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
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data prodi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 last:border-0 text-center w-20">No</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 last:border-0">Nama Program Studi</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 last:border-0 text-center">Unit / Fakultas</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {data.map((item, index) => (
                    <tr key={item.id_prodi} className="hover:bg-blue-900/30 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-700 last:border-0 text-center">
                        <span className="text-xs font-black text-gray-400">{index + 1}</span>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-700 last:border-0">
                        <div className="text-sm font-black text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.nama_prodi || '-'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-700 last:border-0 text-center">
                        <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-wider">{item.nama_unit || `ID ${item.id_unit}` || '-'}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center bg-gray-900 border border-gray-700 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-800 group-hover:shadow-md">
                          <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-900/20 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                          <div className="w-px h-4 bg-gray-700 mx-2"></div>
                          <button onClick={() => handleDelete(item.id_prodi)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
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
