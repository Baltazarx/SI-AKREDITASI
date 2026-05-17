'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, Briefcase, UserPlus, Users } from 'lucide-react';

export default function PegawaiPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [jabatanList, setJabatanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openUnit, setOpenUnit] = useState(false);
  const [openJabatan, setOpenJabatan] = useState(false);
  
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nikp: '',
    id_unit: '',
    id_jabatan_struktural: '',
    pendidikan_terakhir: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
      fetchUnitList();
      fetchJabatanList();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/pegawai', {
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

  const fetchJabatanList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/jabatan-struktural', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setJabatanList(result.data);
      }
    } catch (err) {
      console.error('Error fetching jabatan list:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/master/pegawai/${editingId}`
      : 'http://localhost:5000/api/master/pegawai';

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
    setEditingId(item.id_pegawai);
    setFormData({
      nama_lengkap: item.nama_lengkap || '',
      nikp: item.nikp || '',
      id_unit: item.id_unit || '',
      id_jabatan_struktural: item.id_jabatan_struktural || '',
      pendidikan_terakhir: item.pendidikan_terakhir || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/pegawai/${id}`, {
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
      nama_lengkap: '',
      nikp: '',
      id_unit: '',
      id_jabatan_struktural: '',
      pendidikan_terakhir: '',
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
              <h1 className="text-3xl font-black text-white tracking-tight">Master Data - Pegawai</h1>
              <p className="text-gray-400 mt-1 font-medium">Kelola database pegawai universitas</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Pegawai'}</span>
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
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pegawai</p>
              <p className="text-2xl font-black text-white">{data.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-purple-900/20 text-purple-600 rounded-xl"><UserPlus size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit Kerja</p>
              <p className="text-2xl font-black text-white">{unitList.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-emerald-900/20 text-emerald-600 rounded-xl"><Users size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Aktif</p>
              <p className="text-2xl font-black text-white">{data.length}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Data Pegawai' : 'Input Data Pegawai Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Nama Lengkap</label>
                  <input type="text" value={formData.nama_lengkap} onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" required placeholder="Nama Lengkap dengan Gelar" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">NIKP</label>
                  <input type="text" value={formData.nikp} onChange={(e) => setFormData({...formData, nikp: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="Nomor Induk Karyawan/Pegawai" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Unit Kerja</label>
                  <div className="relative">
                    <div 
                      onClick={() => setOpenUnit(!openUnit)}
                      className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white cursor-pointer flex justify-between items-center"
                    >
                      <span>{formData.id_unit ? unitList.find(u => u.id_unit == formData.id_unit)?.nama_unit : 'Pilih Unit Kerja'}</span>
                      <Plus size={16} className={`transition-transform duration-300 ${openUnit ? 'rotate-0' : 'rotate-45'}`} />
                    </div>
                    {openUnit && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        {unitList.map(unit => (
                          <div 
                            key={unit.id_unit}
                            onClick={() => {
                              setFormData({...formData, id_unit: unit.id_unit});
                              setOpenUnit(false);
                            }}
                            className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 last:border-0"
                          >
                            {unit.nama_unit}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Jabatan Struktural</label>
                  <div className="relative">
                    <div 
                      onClick={() => setOpenJabatan(!openJabatan)}
                      className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white cursor-pointer flex justify-between items-center"
                    >
                      <span>{formData.id_jabatan_struktural ? jabatanList.find(j => j.id_jabatan_struktural == formData.id_jabatan_struktural)?.nama_jabatan : 'Pilih Jabatan Struktural'}</span>
                      <Plus size={16} className={`transition-transform duration-300 ${openJabatan ? 'rotate-0' : 'rotate-45'}`} />
                    </div>
                    {openJabatan && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        {jabatanList.map(jabatan => (
                          <div 
                            key={jabatan.id_jabatan_struktural}
                            onClick={() => {
                              setFormData({...formData, id_jabatan_struktural: jabatan.id_jabatan_struktural});
                              setOpenJabatan(false);
                            }}
                            className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 last:border-0"
                          >
                            {jabatan.nama_jabatan}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Pendidikan Terakhir</label>
                  <input type="text" value={formData.pendidikan_terakhir} onChange={(e) => setFormData({...formData, pendidikan_terakhir: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="Contoh: S2 Teknik Informatika" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20">{editingId ? 'Update Pegawai' : 'Simpan Pegawai'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-950/30 border border-gray-700 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan database...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data pegawai</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center border-r border-gray-700 w-16">No</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Nama Pegawai</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">NIKP</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Unit / Jabatan</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Pendidikan</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {data.map((item, index) => (
                    <tr key={item.id_pegawai} className="hover:bg-blue-900/10 transition-colors group">
                      <td className="px-6 py-6 border-r border-gray-800 text-center">
                        <span className="text-xs font-black text-gray-500">{index + 1}</span>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-800">
                        <div className="text-sm font-black text-white group-hover:text-blue-500 transition-colors">{item.nama_lengkap || '-'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-800">
                        <span className="text-xs font-bold text-gray-300 tracking-wider">{item.nikp || '-'}</span>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-800">
                        <div className="text-xs font-bold text-gray-300 uppercase tracking-tight">{item.nama_unit || '-'}</div>
                        <div className="text-[10px] text-gray-500 font-bold mt-0.5">{item.nama_jabatan || '-'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-800 text-center">
                        <span className="px-3 py-1 bg-gray-800/50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-gray-700">{item.pendidikan_terakhir || '-'}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition shadow-lg shadow-blue-900/10 border border-blue-900/30" title="Edit"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(item.id_pegawai)} className="p-2 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition shadow-lg shadow-red-900/10 border border-red-900/30" title="Hapus"><Trash2 size={16} /></button>
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
