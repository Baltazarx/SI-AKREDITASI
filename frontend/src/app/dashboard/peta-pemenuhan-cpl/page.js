'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Target, MapPin, Calendar, BookOpen, CheckCircle } from 'lucide-react';

export default function PetaPemenuhanCplPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterProdi, setFilterProdi] = useState('');
  
  const [prodiList, setProdiList] = useState([]);
  const [cplList, setCplList] = useState([]);
  const [cpmkList, setCpmkList] = useState([]);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_cpl: '',
    id_cpmk: '',
    id_mk: '',
    id_tahun: '',
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
    if (filterProdi) {
      fetchData();
      fetchCplList();
      fetchCpmkList();
      fetchMataKuliahList();
    }
  }, [filterProdi]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/akademik/2b3-peta-pemenuhan-cpl?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setData(result.data || []);
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
      if (result.success) setTahunList(result.data);
    } catch (err) {
      console.error('Error fetching tahun:', err);
    }
  };

  const fetchCplList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/cpl?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setCplList(result.data || []);
    } catch (err) {
      console.error('Error fetching CPL:', err);
    }
  };

  const fetchCpmkList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/cpmk?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setCpmkList(result.data || []);
    } catch (err) {
      console.error('Error fetching CPMK:', err);
    }
  };

  const fetchMataKuliahList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/mata-kuliah?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setMataKuliahList(result.data || []);
    } catch (err) {
      console.error('Error fetching mata kuliah:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/akademik/2b3-peta-pemenuhan-cpl/${editingId}`
      : 'http://localhost:5000/api/akademik/2b3-peta-pemenuhan-cpl';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          id_prodi: filterProdi
        }),
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
      resetForm();
    } catch (err) {
      console.error('Error saving data:', err);
      alert('Gagal menyimpan data');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id_cpl: item.id_cpl || '',
      id_cpmk: item.id_cpmk || '',
      id_mk: item.id_mk || '',
      id_tahun: item.id_tahun || '',
    });
    setEditingId(item.id_2b3);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/akademik/2b3-peta-pemenuhan-cpl/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      console.error('Error deleting data:', err);
      alert('Gagal menghapus data');
    }
  };

  const resetForm = () => {
    setFormData({
      id_cpl: '',
      id_cpmk: '',
      id_mk: '',
      id_tahun: '',
    });
    setEditingId(null);
    setShowForm(false);
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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Peta Pemenuhan CPL (2.B.3)</h1>
              <p className="text-gray-500 mt-1 font-medium">Pengelolaan hubungan CPL, CPMK, dan Mata Kuliah</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Pemetaan'}</span>
              </button>
              <button onClick={() => window.open(`http://localhost:5000/api/akademik/2b3-peta-pemenuhan-cpl/export?id_prodi=${filterProdi}&token=${localStorage.getItem('token')}`, '_blank')} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-3 items-end mb-8">
          <div className="flex-1 lg:w-48">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Program Studi</label>
            <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer">
              <option value="">Pilih Prodi</option>
              {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
            </select>
          </div>
          <button onClick={fetchData} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Peta Pemenuhan CPL' : 'Input Peta Pemenuhan CPL Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">CPL</label>
                  <select value={formData.id_cpl} onChange={(e) => setFormData({...formData, id_cpl: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih CPL</option>
                    {cplList.map(cpl => <option key={cpl.id_cpl} value={cpl.id_cpl}>{cpl.kode_cpl}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">CPMK</label>
                  <select value={formData.id_cpmk} onChange={(e) => setFormData({...formData, id_cpmk: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih CPMK</option>
                    {cpmkList.map(cpmk => <option key={cpmk.id_cpmk} value={cpmk.id_cpmk}>{cpmk.kode_cpmk}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mata Kuliah</label>
                  <select value={formData.id_mk} onChange={(e) => setFormData({...formData, id_mk: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Mata Kuliah</option>
                    {mataKuliahList.map(mk => <option key={mk.id_mk} value={mk.id_mk}>{mk.nama_mk}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tahun Akademik</label>
                  <select value={formData.id_tahun} onChange={(e) => setFormData({...formData, id_tahun: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Tahun</option>
                    {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                  </select>
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
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data peta pemenuhan CPL</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">CPL</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">CPMK</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">Mata Kuliah</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">Tahun</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.map((item) => (
                    <tr key={item.id_2b3} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.kode_cpl || '-'}</div>
                        <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{item.deskripsi_cpl || '-'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-sm font-bold text-gray-800">{item.kode_cpmk || '-'}</div>
                        <div className="text-[10px] text-gray-400 font-bold mt-0.5">{item.deskripsi_cpmk || '-'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-sm font-bold text-gray-800">{item.nama_mk || '-'}</div>
                        <div className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase">{item.kode_mk || '-'}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0 text-center">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-wider border border-blue-100">{item.tahun}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-200 group-hover:shadow-md">
                          <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                          <div className="w-px h-4 bg-gray-200 mx-2"></div>
                          <button onClick={() => handleDelete(item.id_2b3)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
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
