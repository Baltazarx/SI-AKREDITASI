'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, ShieldCheck, UserCheck, History, ExternalLink, Activity } from 'lucide-react';

export default function TPMPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterIdTahun, setFilterIdTahun] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');
  const [unitList, setUnitList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    jenis_unit: 'PT',
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
      fetchMasterData();
    }
  }, [router]);

  useEffect(() => {
    if (filterIdTahun) fetchData();
  }, [filterIdTahun]);

  const fetchMasterData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [unitRes, tahunRes] = await Promise.all([
        fetch('http://localhost:5000/api/master/unit-kerja', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const unitResult = await unitRes.json();
      const tahunResult = await tahunRes.json();
      if (unitResult.success) setUnitList(unitResult.data);
      if (tahunResult.success) {
        const sortedTahun = (tahunResult.data || []).sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));
        setTahunList(sortedTahun);
        const activeTahun = sortedTahun.find(t => t.is_active === 1);
        if (activeTahun) setFilterIdTahun(activeTahun.id_tahun.toString());
      }
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchData = async () => {
    if (!filterIdTahun) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const url = `http://localhost:5000/api/tpm/1b-spmi?id_tahun=${filterIdTahun}`;
      const [activeRes, trashRes] = await Promise.all([
        fetch(url, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${url}/trash`, { headers: { 'Authorization': `Bearer ${token}` } }),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/tpm/1b-spmi/${editingId}`
      : 'http://localhost:5000/api/tpm/1b-spmi';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, id_tahun: filterIdTahun }),
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
      jenis_unit: item.jenis_unit || 'PT',
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
    if (!confirm('Pindahkan ke tempat sampah?')) return;
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
      showError('Gagal menghapus data');
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
      showError('Gagal memulihkan data');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('HAPUS PERMANEN?')) return;
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
      showError('Gagal menghapus permanen');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      jenis_unit: 'PT',
      id_unit: '',
      dokumen_spmi: '',
      auditor_certified: 0,
      auditor_non_certified: 0,
      frekuensi_audit: 1,
      bukti_certified_auditor: '',
      laporan_audit: '',
    });
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/tpm/1b-spmi/export?id_tahun=${filterIdTahun}&token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-white tracking-tight">Unit SPMI & SDM (1.B)</h1>
              <p className="text-gray-400 mt-1 font-medium">Monitoring sistem penjaminan mutu internal dan sdm auditor (TPM Access)</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data Unit'}</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/20 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-blue-900/20 text-blue-600 rounded-xl"><ShieldCheck size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit SPMI</p>
                <p className="text-2xl font-black text-white">{activeData.length}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-indigo-900/20 text-indigo-600 rounded-xl"><UserCheck size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Auditor</p>
                <p className="text-2xl font-black text-white">{activeData.reduce((acc, curr) => acc + (curr.jumlah_auditor || 0), 0)}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-orange-900/20 text-orange-600 rounded-xl"><History size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mode View</p>
                <p className="text-2xl font-black text-white">{showTrash ? 'Sampah' : 'Aktif'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-48">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun Akademik</label>
              <select value={filterIdTahun} onChange={(e) => setFilterIdTahun(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition cursor-pointer">
                {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
              </select>
            </div>
            <button onClick={fetchData} className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-950/50 transition text-gray-400 hover:text-blue-600 shadow-sm">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setShowTrash(!showTrash)} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition border shadow-sm ${showTrash ? 'bg-orange-900/20 border-orange-800 text-orange-600' : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-950/50'}`}>
              {showTrash ? 'Lihat Aktif' : 'Lihat Sampah'}
            </button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Data SPMI' : 'Input Data SPMI Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Jenis Unit SPMI</label>
                  <select value={formData.jenis_unit} onChange={(e) => setFormData({...formData, jenis_unit: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" required>
                    <option value="PT">PT</option>
                    <option value="UPPS">UPPS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Unit Kerja</label>
                  <select value={formData.id_unit} onChange={(e) => setFormData({...formData, id_unit: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Unit Kerja</option>
                    {unitList.map(u => <option key={u.id_unit} value={u.id_unit}>{u.nama_unit}</option>)}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Link Dokumen SPMI</label>
                  <input type="url" value={formData.dokumen_spmi} onChange={(e) => setFormData({...formData, dokumen_spmi: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="https://..." />
                </div>
                <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-700">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">SDM Auditor</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Certified</label>
                      <input type="number" value={formData.auditor_certified} onChange={(e) => setFormData({...formData, auditor_certified: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/40 transition font-bold" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 mb-1">Non-Cert.</label>
                      <input type="number" value={formData.auditor_non_certified} onChange={(e) => setFormData({...formData, auditor_non_certified: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/40 transition font-bold" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Frekuensi Audit / Tahun</label>
                  <input type="number" value={formData.frekuensi_audit} onChange={(e) => setFormData({...formData, frekuensi_audit: parseInt(e.target.value) || 1})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Link Bukti Sertifikat</label>
                  <input type="url" value={formData.bukti_certified_auditor} onChange={(e) => setFormData({...formData, bukti_certified_auditor: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="https://..." />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Link Laporan Audit Mutu Internal (AMI)</label>
                  <input type="url" value={formData.laporan_audit} onChange={(e) => setFormData({...formData, laporan_audit: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="https://..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20">{editingId ? 'Update Data' : 'Simpan Data SPMI'}</button>
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
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data unit SPMI</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 border-b border-gray-700">
                  {showTrash ? (
                    <tr>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Unit Kerja</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Dokumen SPMI</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Aksi</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Unit SPMI</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Nama Unit SPMI</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Dokumen SPMI</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Jumlah Auditor Mutu Internal</th>
                      <th className="px-4 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Certified</th>
                      <th className="px-4 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Non Certified</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Frekuensi audit/monev per tahun</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Bukti Certified Auditor</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Laporan Audit</th>
                      <th className="px-6 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">Aksi</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(showTrash ? trashData : activeData).map((row) => (
                    <tr key={row.id_unit_spmi} className={`hover:bg-blue-900/30 transition-colors group ${showTrash ? 'hover:bg-orange-900/30' : ''}`}>
                      {showTrash ? (
                        <>
                          <td className="px-6 py-6 border-r border-gray-700 text-sm font-black text-white">{row.nama_unit}</td>
                          <td className="px-6 py-6 border-r border-gray-700 text-xs text-gray-400 font-medium truncate max-w-[200px]">
                            {row.dokumen_spmi || '-'}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-6 border-r border-gray-700 text-center font-black text-white text-sm">
                            {row.jenis_unit || '-'}
                          </td>
                          <td className="px-6 py-6 border-r border-gray-700 text-center font-medium text-white text-sm">
                            {row.nama_unit || '-'}
                          </td>
                          <td className="px-6 py-6 border-r border-gray-700 text-center">
                            {row.dokumen_spmi ? (
                              <a href={row.dokumen_spmi} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-300 font-black text-[10px] uppercase tracking-wider">
                                <ExternalLink size={12} /> Buka
                              </a>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-6 border-r border-gray-700 text-center font-extrabold text-white text-sm">
                            {row.jumlah_auditor || 0}
                          </td>
                          <td className="px-4 py-6 border-r border-gray-700 text-center text-gray-300 text-sm">
                            {row.auditor_certified || 0}
                          </td>
                          <td className="px-4 py-6 border-r border-gray-700 text-center text-gray-300 text-sm">
                            {row.auditor_non_certified || 0}
                          </td>
                          <td className="px-6 py-6 border-r border-gray-700 text-center text-gray-300 text-sm font-bold">
                            {row.frekuensi_audit || 0}x
                          </td>
                          <td className="px-6 py-6 border-r border-gray-700 text-center">
                            {row.bukti_certified_auditor ? (
                              <a href={row.bukti_certified_auditor} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-300 font-black text-[10px] uppercase tracking-wider">
                                <ExternalLink size={12} /> Buka
                              </a>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-6 border-r border-gray-700 text-center">
                            {row.laporan_audit ? (
                              <a href={row.laporan_audit} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-300 font-black text-[10px] uppercase tracking-wider">
                                <ExternalLink size={12} /> Buka
                              </a>
                            ) : '-'}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-6">
                        <div className="flex justify-center">
                          <div className={`inline-flex items-center bg-gray-900 border border-gray-700 p-1.5 rounded-xl shadow-sm transition-all group-hover:shadow-md ${showTrash ? 'group-hover:border-orange-800' : 'group-hover:border-blue-800'}`}>
                            {showTrash ? (
                              <>
                                <button onClick={() => handleRestore(row.id_unit_spmi)} className="p-1.5 text-emerald-600 hover:bg-emerald-900/20 rounded-lg transition" title="Restore"><RotateCcw size={16} /></button>
                                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                                <button onClick={() => handleHardDelete(row.id_unit_spmi)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus Permanen"><Trash size={16} /></button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-900/20 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                                <button onClick={() => handleSoftDelete(row.id_unit_spmi)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
                              </>
                            )}
                          </div>
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
