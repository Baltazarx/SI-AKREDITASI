'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, ShieldCheck, UserCheck, FileText } from 'lucide-react';

export default function SPMIPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterIdTahun, setFilterIdTahun] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');
  const [tahunList, setTahunList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_unit: '',
    dokumen_spmi: '',
    auditor_certified: 0,
    auditor_non_certified: 0,
    frekuensi_audit: 1,
    bukti_certified_auditor: '',
    laporan_audit: '',
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
      fetchTahunList();
      fetchUnitList();
    }
  }, [router]);

  useEffect(() => {
    if (filterIdTahun) {
      fetchData();
    }
  }, [filterIdTahun]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseUrl = 'http://localhost:5000/api/tpm/1b-spmi';
      const params = `?id_tahun=${filterIdTahun}`;
      
      const activeUrl = `${baseUrl}${params}`;
      const trashUrl = `${baseUrl}/trash${params}`;

      const [activeRes, trashRes] = await Promise.all([
        fetch(activeUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(trashUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
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

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        const sortedData = result.data.sort((a, b) => b.tahun - a.tahun);
        setTahunList(sortedData);
        if (!filterIdTahun && sortedData.length > 0) {
          setFilterIdTahun(sortedData[0].id_tahun.toString());
        }
      }
    } catch (err) {
      console.error('Error fetching tahun list:', err);
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
      ? `http://localhost:5000/api/tpm/1b-spmi/${editingId}`
      : 'http://localhost:5000/api/tpm/1b-spmi';

    try {
      const body = {
        ...formData,
        id_tahun: filterIdTahun,
        jenis_unit: 'Unit Penjaminan Mutu Internal',
      };
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
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
    setEditingId(item.id_unit_spmi);
    setFormData({
      id_unit: item.id_unit || '',
      dokumen_spmi: item.dokumen_spmi || '',
      auditor_certified: item.auditor_certified || 0,
      auditor_non_certified: item.auditor_non_certified || 0,
      frekuensi_audit: item.frekuensi_audit || 1,
      bukti_certified_auditor: item.bukti_certified_auditor || '',
      laporan_audit: item.laporan_audit || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/tpm/1b-spmi/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/tpm/1b-spmi/restore/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/tpm/1b-spmi/hard/${id}`, {
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
      id_unit: '',
      dokumen_spmi: '',
      auditor_certified: 0,
      auditor_non_certified: 0,
      frekuensi_audit: 1,
      bukti_certified_auditor: '',
      laporan_audit: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/tpm/1b-spmi/export?id_tahun=${filterIdTahun}&token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">SPMI (1.B)</h1>
              <p className="text-gray-500 mt-1 font-medium">Sistem Penjaminan Mutu Internal</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah SPMI'}</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShieldCheck size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit SPMI</p>
                <p className="text-2xl font-black text-gray-900">{activeData.length}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><UserCheck size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Auditor Cert.</p>
                <p className="text-2xl font-black text-gray-900">{activeData.reduce((acc, curr) => acc + (parseInt(curr.auditor_certified) || 0), 0)}</p>
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
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun Akademik</label>
              <select 
                value={filterIdTahun} 
                onChange={(e) => setFilterIdTahun(e.target.value)} 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer"
              >
                {tahunList.map(t => (
                  <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>
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
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Data SPMI' : 'Input Data SPMI Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Unit Kerja</label>
                  <select 
                    value={formData.id_unit} 
                    onChange={(e) => setFormData({...formData, id_unit: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium"
                    required
                  >
                    <option value="">Pilih Unit Kerja</option>
                    {unitList.map(unit => (
                      <option key={unit.id_unit} value={unit.id_unit}>{unit.nama_unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Dokumen SPMI (Link)</label>
                  <input type="text" value={formData.dokumen_spmi} onChange={(e) => setFormData({...formData, dokumen_spmi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Auditor Certified</label>
                  <input type="number" value={formData.auditor_certified} onChange={(e) => setFormData({...formData, auditor_certified: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Auditor Non-Certified</label>
                  <input type="number" value={formData.auditor_non_certified} onChange={(e) => setFormData({...formData, auditor_non_certified: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Frekuensi Audit / Tahun</label>
                  <input type="number" value={formData.frekuensi_audit} onChange={(e) => setFormData({...formData, frekuensi_audit: parseInt(e.target.value) || 1})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" min="1" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Link Bukti Sertifikat Auditor</label>
                  <input type="text" value={formData.bukti_certified_auditor} onChange={(e) => setFormData({...formData, bukti_certified_auditor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Link Laporan Hasil Audit</label>
                  <input type="text" value={formData.laporan_audit} onChange={(e) => setFormData({...formData, laporan_audit: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="https://..." />
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
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data SPMI</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-0">Unit Kerja</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-0 text-center">Auditor (C/N)</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-0 text-center">Freq</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-0 text-center">Lampiran</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(showTrash ? trashData : activeData).map((item) => (
                    <tr key={item.id_unit_spmi} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.nama_unit || '-'}</div>
                        <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Unit Penjaminan Mutu</div>
                      </td>
                      <td className="px-6 py-6 border-r border-gray-50 last:border-0 text-center">
                        <div className="flex flex-col gap-1 items-center">
                          <span className="text-sm font-black text-gray-900">{item.jumlah_auditor || 0}</span>
                          <div className="flex gap-1">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black">{item.auditor_certified || 0}C</span>
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[9px] font-black">{item.auditor_non_certified || 0}N</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 border-r border-gray-50 last:border-0 text-center">
                        <span className="text-sm font-bold text-gray-700">{item.frekuensi_audit || 0}x</span>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="flex flex-col gap-2">
                          {item.dokumen_spmi && (
                            <a href={item.dokumen_spmi} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-wider">
                              <FileText size={12} /> Dokumen SPMI
                            </a>
                          )}
                          {item.bukti_certified_auditor && (
                            <a href={item.bukti_certified_auditor} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-800 font-black text-[10px] uppercase tracking-wider">
                              <ShieldCheck size={12} /> Bukti Auditor
                            </a>
                          )}
                          {item.laporan_audit && (
                            <a href={item.laporan_audit} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-black text-[10px] uppercase tracking-wider">
                              <FileText size={12} /> Laporan Audit
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {showTrash ? (
                            <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-orange-200">
                              <button onClick={() => handleRestore(item.id_unit_spmi)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Restore"><RotateCcw size={16} /></button>
                              <div className="w-px h-4 bg-gray-200 mx-2"></div>
                              <button onClick={() => handleHardDelete(item.id_unit_spmi)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus Permanen"><Trash size={16} /></button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-200 group-hover:shadow-md">
                              <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                              <div className="w-px h-4 bg-gray-200 mx-2"></div>
                              <button onClick={() => handleSoftDelete(item.id_unit_spmi)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
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
