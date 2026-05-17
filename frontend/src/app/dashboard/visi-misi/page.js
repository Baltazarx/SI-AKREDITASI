'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Eye, Target, Compass } from 'lucide-react';

export default function VisiMisiPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterIdProdi, setFilterIdProdi] = useState('');
  const [prodiList, setProdiList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_prodi: '',
    visi_pt: '',
    misi_pt: '',
    visi_upps: '',
    misi_upps: '',
    visi_keilmuan_ps: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchProdiList();
    }
  }, [router]);

  useEffect(() => {
    if (filterIdProdi || prodiList.length > 0) {
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
      const url = filterIdProdi 
        ? `http://localhost:5000/api/upps/6-visi-misi?id_prodi=${filterIdProdi}`
        : 'http://localhost:5000/api/upps/6-visi-misi';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/upps/6-visi-misi/${editingId}`
      : 'http://localhost:5000/api/upps/6-visi-misi';

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
    setEditingId(item.id_vm);
    setFormData({
      id_prodi: item.id_prodi || '',
      visi_pt: item.visi_pt || '',
      misi_pt: item.misi_pt || '',
      visi_upps: item.visi_upps || '',
      misi_upps: item.misi_upps || '',
      visi_keilmuan_ps: item.visi_keilmuan_ps || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/6-visi-misi/${id}`, {
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
      id_prodi: filterIdProdi,
      visi_pt: '',
      misi_pt: '',
      visi_upps: '',
      misi_upps: '',
      visi_keilmuan_ps: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/upps/6-visi-misi/export?id_prodi=${filterIdProdi}&token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-950/50 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Visi Misi (Tabel 6)</h1>
              <p className="text-gray-400 mt-1 font-medium">Visi, Misi, UPPS, dan Visi Keilmuan PS</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {!data.length && (
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                  <Plus size={18} />
                  <span>{showForm ? 'Tutup Form' : 'Tambah Data'}</span>
                </button>
              )}
              {data.length > 0 && showForm && editingId && (
                <button onClick={resetForm} className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-xl hover:bg-gray-600 transition font-bold text-sm">
                  <span>Tutup Edit</span>
                </button>
              )}
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
              <div className="p-3 bg-blue-900/20 text-blue-600 rounded-xl"><Eye size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visi PT</p>
                <p className="text-xl font-black text-white">{data.length > 0 ? 'Tersedia' : '-'}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-purple-900/20 text-purple-600 rounded-xl"><Target size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visi UPPS</p>
                <p className="text-xl font-black text-white">{data.length > 0 ? 'Aktif' : '-'}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-emerald-900/20 text-emerald-600 rounded-xl"><Compass size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keilmuan PS</p>
                <p className="text-xl font-black text-white">{data.length > 0 ? 'Terkelola' : '-'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-64">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Filter Prodi</label>
              <select 
                value={filterIdProdi} 
                onChange={(e) => setFilterIdProdi(e.target.value)} 
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer text-white"
              >
                {prodiList.map(prodi => (
                  <option key={prodi.id_prodi} value={prodi.id_prodi} className="bg-gray-900 text-white">{prodi.nama_prodi}</option>
                ))}
              </select>
            </div>
            <button onClick={fetchData} className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-950/50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Visi Misi' : 'Input Visi Misi Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Program Studi (Sesuai Filter)</label>
                  <select 
                    value={formData.id_prodi} 
                    disabled={true}
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-gray-500 rounded-2xl outline-none transition font-black cursor-not-allowed appearance-none"
                  >
                    <option value="">Pilih Program Studi</option>
                    {prodiList.map(p => (
                      <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-blue-500 mt-2 font-bold uppercase tracking-wider italic">* Mengikuti prodi yang Anda pilih di filter utama</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Visi PT</label>
                  <textarea value={formData.visi_pt} onChange={(e) => setFormData({...formData, visi_pt: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white" rows="3" placeholder="Visi Perguruan Tinggi..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Misi PT</label>
                  <textarea value={formData.misi_pt} onChange={(e) => setFormData({...formData, misi_pt: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white" rows="3" placeholder="Misi Perguruan Tinggi..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Visi UPPS</label>
                  <textarea value={formData.visi_upps} onChange={(e) => setFormData({...formData, visi_upps: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white" rows="3" placeholder="Visi Unit Pengelola Program Studi..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Misi UPPS</label>
                  <textarea value={formData.misi_upps} onChange={(e) => setFormData({...formData, misi_upps: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white" rows="3" placeholder="Misi Unit Pengelola Program Studi..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Visi Keilmuan Program Studi</label>
                  <textarea value={formData.visi_keilmuan_ps} onChange={(e) => setFormData({...formData, visi_keilmuan_ps: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white" rows="4" placeholder="Visi Keilmuan PS..." />
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
        <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/30 border border-gray-700 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data visi misi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-gray-800">
                  {data.map((item) => (
                    <React.Fragment key={item.id_vm}>
                      {/* Row 1: Visi Headers */}
                      <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-700 w-1/3">Visi PT</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-700 w-1/3">Visi UPPS</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-widest w-1/3">Visi Keilmuan PS</th>
                      </tr>
                      {/* Row 2: Visi Content */}
                      <tr className="border-b border-gray-800">
                        <td className="px-6 py-6 border-r border-gray-800 align-top">
                          <div className="text-sm font-bold text-white leading-relaxed">{item.visi_pt || '-'}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-800 align-top">
                          <div className="text-sm font-bold text-white leading-relaxed">{item.visi_upps || '-'}</div>
                        </td>
                        <td className="px-6 py-6 align-top">
                          <div className="text-sm font-bold text-white leading-relaxed">{item.visi_keilmuan_ps || '-'}</div>
                        </td>
                      </tr>
                      {/* Row 3: Misi Headers */}
                      <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-700">Misi PT</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-700">Misi UPPS</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-widest">Aksi Data</th>
                      </tr>
                      {/* Row 4: Misi Content & Actions */}
                      <tr>
                        <td className="px-6 py-6 border-r border-gray-800 align-top">
                          <div className="text-sm font-medium text-gray-300 leading-relaxed">{item.misi_pt || '-'}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-gray-800 align-top">
                          <div className="text-sm font-medium text-gray-300 leading-relaxed">{item.misi_upps || '-'}</div>
                        </td>
                        <td className="px-6 py-6 align-middle text-center">
                          <div className="flex justify-center gap-3">
                            <button onClick={() => handleEdit(item)} className="px-6 py-2 bg-blue-900/20 text-blue-400 border border-blue-900/50 rounded-xl hover:bg-blue-600 hover:text-white transition font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/10">Edit</button>
                            <button onClick={() => handleDelete(item.id_vm)} className="px-6 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-xl hover:bg-red-600 hover:text-white transition font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-900/10">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
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
