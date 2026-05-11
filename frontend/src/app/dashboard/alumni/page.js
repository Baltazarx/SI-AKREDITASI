'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Users, GraduationCap, Calendar, TrendingUp, Award } from 'lucide-react';

export default function AlumniPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    jumlah_lulusan: '',
    jumlah_terlacak: '',
    masa_tunggu: '',
    ipk_rata_rata: '',
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
      const activeUrl = `http://localhost:5000/api/akademik/2b4-2b5-alumni?${baseParams}`;
      const trashUrl  = `http://localhost:5000/api/akademik/2b4-2b5-alumni/trash?${baseParams}`;
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
      ? `http://localhost:5000/api/akademik/2b4-2b5-alumni/${editingId}`
      : 'http://localhost:5000/api/akademik/2b4-2b5-alumni';

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
      console.error('Error saving data:', err);
      alert('Gagal menyimpan data');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id_prodi: item.id_prodi || '',
      id_tahun: item.id_tahun || '',
      jumlah_lulusan: item.jumlah_lulusan || '',
      jumlah_terlacak: item.jumlah_terlacak || '',
      masa_tunggu: item.masa_tunggu || '',
      ipk_rata_rata: item.ipk_rata_rata || '',
    });
    setEditingId(item.id_alumni);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/akademik/2b4-2b5-alumni/${id}`, {
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

  const handleRestore = async (id) => {
    if (!confirm('Apakah Anda yakin ingin memulihkan data ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/akademik/2b4-2b5-alumni/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      console.error('Error restoring data:', err);
      alert('Gagal memulihkan data');
    }
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: filterTahun || '',
      jumlah_lulusan: '',
      jumlah_terlacak: '',
      masa_tunggu: '',
      ipk_rata_rata: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = (type) => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/akademik/2b4-2b5-alumni/export/${type}?id_prodi=${filterProdi}&id_tahun=${filterTahun}&token=${token}`, '_blank');
  };

  const formatRupiah = (angka) => {
    if (!angka) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Alumni (2.B.4 & 2.B.5)</h1>
              <p className="text-gray-500 mt-1 font-medium">Pengelolaan data tracer study dan lulusan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data'}</span>
              </button>
              <button onClick={() => handleExport('2b4')} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
                <Download size={18} />
                <span>Export 2.B.4</span>
              </button>
              <button onClick={() => handleExport('2b5')} className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-200 font-bold text-sm">
                <Download size={18} />
                <span>Export 2.B.5</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Lulusan</p>
                <p className="text-2xl font-black text-gray-900">{activeData.reduce((acc, curr) => acc + (curr.jumlah_lulusan || 0), 0)}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Terlacak</p>
                <p className="text-2xl font-black text-gray-900">{activeData.reduce((acc, curr) => acc + (curr.jumlah_terlacak || 0), 0)}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Award size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mode</p>
                <p className="text-2xl font-black text-gray-900">{showTrash ? 'Sampah' : 'Aktif'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-48">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Prodi</label>
              <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer">
                {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
              </select>
            </div>
            <div className="flex-1 lg:w-32">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun</label>
              <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer">
                {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
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
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Data Alumni' : 'Input Data Alumni Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Program Studi</label>
                  <select value={formData.id_prodi} onChange={(e) => setFormData({...formData, id_prodi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Prodi</option>
                    {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tahun Akademik</label>
                  <select value={formData.id_tahun} onChange={(e) => setFormData({...formData, id_tahun: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Tahun</option>
                    {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Lulusan</label>
                  <input type="number" value={formData.jumlah_lulusan} onChange={(e) => setFormData({...formData, jumlah_lulusan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Terlacak</label>
                  <input type="number" value={formData.jumlah_terlacak} onChange={(e) => setFormData({...formData, jumlah_terlacak: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Masa Tunggu (bulan)</label>
                  <input type="number" step="0.1" value={formData.masa_tunggu} onChange={(e) => setFormData({...formData, masa_tunggu: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0.0" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">IPK Rata-rata</label>
                  <input type="number" step="0.01" value={formData.ipk_rata_rata} onChange={(e) => setFormData({...formData, ipk_rata_rata: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0.00" required />
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
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data alumni</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  {showTrash ? (
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">Prodi</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">Tahun</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">Lulusan</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">Terlacak</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Aksi</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">Program Studi</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">Tahun Lulus</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">Jumlah Lulusan</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">Jumlah Terlacak</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">Masa Tunggu</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">IPK Rata-rata</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em">Aksi</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {showTrash ? (
                    trashData.map((item) => (
                      <tr key={item.id_alumni} className="hover:bg-orange-50/30 transition-colors group">
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                          <div className="text-sm font-black text-gray-900">{item.nama_prodi}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0 text-center">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black">{item.tahun}</span>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0 font-bold text-gray-700">
                          {item.jumlah_lulusan || 0}
                        </td>
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0 font-bold text-gray-700">
                          {item.jumlah_terlacak || 0}
                        </td>
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
                            <button onClick={() => handleRestore(item.id_alumni)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Restore"><RefreshCw size={16} /></button>
                            <div className="w-px h-4 bg-gray-200 mx-2"></div>
                            <button onClick={() => handleDelete(item.id_alumni)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus Permanen"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    activeData.map((item) => (
                      <tr key={item.id_alumni} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                          <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.nama_prodi}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0 text-center">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-wider border border-blue-100">{item.tahun}</span>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0 text-center">
                          <div className="text-sm font-black text-gray-900">{item.jumlah_lulusan || 0}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0 text-center">
                          <div className="text-sm font-bold text-gray-800">{item.jumlah_terlacak || 0}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0 text-center">
                          <div className="text-sm font-bold text-gray-800">{item.masa_tunggu || 0} bulan</div>
                        </td>
                        <td className="px-8 py-6 border-r border-gray-50 last:border-0 text-center">
                          <div className="text-sm font-bold text-gray-800">{item.ipk_rata_rata || 0}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-200 group-hover:shadow-md">
                            <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                            <div className="w-px h-4 bg-gray-200 mx-2"></div>
                            <button onClick={() => handleDelete(item.id_alumni)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
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
