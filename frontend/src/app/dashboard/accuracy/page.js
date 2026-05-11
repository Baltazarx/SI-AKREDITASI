'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function AccuracyPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    kemampuan: '',
    persentase_sangat_baik: '',
    persentase_baik: '',
    persentase_cukup: '',
    persentase_kurang: '',
    total_baris: '',
    rencana_tindak_lanjut: '',
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
    if (!filterTahun || filterTahun === '') {
      const currentYear = new Date().getFullYear();
      let targetTahun = tahunList.find(t => parseInt(t.tahun) === currentYear);
      if (!targetTahun && tahunList.length > 0) targetTahun = tahunList[tahunList.length - 1];
      if (targetTahun) setFilterTahun(targetTahun.id_tahun.toString());
    }
  }, [tahunList, filterTahun]);

  useEffect(() => {
    if (filterProdi && filterTahun) fetchData();
  }, [filterProdi, filterTahun]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/akademik/2b6-accuracy?id_prodi=${filterProdi}&id_tahun=${filterTahun}`, {
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
      ? `http://localhost:5000/api/akademik/2b6-accuracy/${editingId}`
      : 'http://localhost:5000/api/akademik/2b6-accuracy';

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
      kemampuan: item.kemampuan || '',
      persentase_sangat_baik: item.persentase_sangat_baik || '',
      persentase_baik: item.persentase_baik || '',
      persentase_cukup: item.persentase_cukup || '',
      persentase_kurang: item.persentase_kurang || '',
      total_baris: item.total_baris || '',
      rencana_tindak_lanjut: item.rencana_tindak_lanjut || '',
    });
    setEditingId(item.id_2b6);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/akademik/2b6-accuracy/${id}`, {
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
      id_prodi: filterProdi || '',
      id_tahun: filterTahun || '',
      kemampuan: '',
      persentase_sangat_baik: '',
      persentase_baik: '',
      persentase_cukup: '',
      persentase_kurang: '',
      total_baris: '',
      rencana_tindak_lanjut: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/akademik/2b6-accuracy/export?id_prodi=${filterProdi}&id_tahun=${filterTahun}&token=${token}`, '_blank');
  };

  const getStatusColor = (sb, b, c, k) => {
    const total = parseInt(sb) + parseInt(b) + parseInt(c) + parseInt(k);
    const sbPercent = (parseInt(sb) / total) * 100;
    
    if (sbPercent >= 80) return 'text-emerald-600 bg-emerald-50';
    if (sbPercent >= 60) return 'text-blue-600 bg-blue-50';
    if (sbPercent >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (sb, b, c, k) => {
    const total = parseInt(sb) + parseInt(b) + parseInt(c) + parseInt(k);
    const sbPercent = (parseInt(sb) / total) * 100;
    
    if (sbPercent >= 80) return <CheckCircle size={16} />;
    if (sbPercent >= 60) return <Target size={16} />;
    return <AlertCircle size={16} />;
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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Accuracy & Integrity (2.B.6)</h1>
              <p className="text-gray-500 mt-1 font-medium">Pengukuran akurasi dan integritas capaian pembelajaran</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data'}</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
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
          <div className="flex-1 lg:w-32">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun</label>
            <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer">
              <option value="">Pilih Tahun</option>
              {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
            </select>
          </div>
          <button onClick={fetchData} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Data Accuracy' : 'Input Data Accuracy Baru'}</h2>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kemampuan</label>
                  <input type="text" value={formData.kemampuan} onChange={(e) => setFormData({...formData, kemampuan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="Contoh: Pemrograman" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sangat Baik (%)</label>
                  <input type="number" step="0.1" value={formData.persentase_sangat_baik} onChange={(e) => setFormData({...formData, persentase_sangat_baik: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0.0" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Baik (%)</label>
                  <input type="number" step="0.1" value={formData.persentase_baik} onChange={(e) => setFormData({...formData, persentase_baik: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0.0" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cukup (%)</label>
                  <input type="number" step="0.1" value={formData.persentase_cukup} onChange={(e) => setFormData({...formData, persentase_cukup: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0.0" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kurang (%)</label>
                  <input type="number" step="0.1" value={formData.persentase_kurang} onChange={(e) => setFormData({...formData, persentase_kurang: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0.0" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Total Baris</label>
                  <input type="number" value={formData.total_baris} onChange={(e) => setFormData({...formData, total_baris: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" required />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rencana Tindak Lanjut</label>
                  <textarea value={formData.rencana_tindak_lanjut} onChange={(e) => setFormData({...formData, rencana_tindak_lanjut: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="Deskripsi rencana tindak lanjut" rows="3" required />
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
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data accuracy</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">Kemampuan</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">SB (%)</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">B (%)</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">C (%)</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">K (%)</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 text-center">Total Baris</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100">Rencana Tindak Lanjut</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.map((item) => (
                    <tr key={item.id_2b6} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${getStatusColor(item.persentase_sangat_baik, item.persentase_baik, item.persentase_cukup, item.persentase_kurang)}`}>
                            {getStatusIcon(item.persentase_sangat_baik, item.persentase_baik, item.persentase_cukup, item.persentase_kurang)}
                          </div>
                          <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.kemampuan}</div>
                        </div>
                      </td>
                      <td className="px-6 py-6 border-r border-gray-50 last:border-0 text-center">
                        <div className="text-sm font-bold text-gray-900">{item.persentase_sangat_baik || 0}%</div>
                      </td>
                      <td className="px-6 py-6 border-r border-gray-50 last:border-0 text-center">
                        <div className="text-sm font-bold text-gray-800">{item.persentase_baik || 0}%</div>
                      </td>
                      <td className="px-6 py-6 border-r border-gray-50 last:border-0 text-center">
                        <div className="text-sm font-bold text-gray-700">{item.persentase_cukup || 0}%</div>
                      </td>
                      <td className="px-6 py-6 border-r border-gray-50 last:border-0 text-center">
                        <div className="text-sm font-bold text-gray-600">{item.persentase_kurang || 0}%</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0 text-center">
                        <div className="text-sm font-black text-gray-900">{item.total_baris || 0}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-xs font-medium text-gray-600 line-clamp-2 max-w-xs">{item.rencana_tindak_lanjut || '-'}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-200 group-hover:shadow-md">
                          <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                          <div className="w-px h-4 bg-gray-200 mx-2"></div>
                          <button onClick={() => handleDelete(item.id_2b6)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
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
