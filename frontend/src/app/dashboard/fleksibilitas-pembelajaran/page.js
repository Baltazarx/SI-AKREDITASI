'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, Monitor, Link as LinkIcon, ExternalLink, Activity, Info } from 'lucide-react';

export default function FleksibilitasPembelajaranPage() {
  const router = useRouter();
  
  // Auth & Roles States
  const [userRole, setUserRole] = useState('');
  const [prodiLock, setProdiLock] = useState(null); // 'PRODI-TI', 'PRODI-MI' or null

  // Data States
  const [masterProdi, setMasterProdi] = useState([]);
  const [masterTahun, setMasterTahun] = useState([]);
  const [masterBentuk, setMasterBentuk] = useState([]);
  
  const [borangHeaders, setBorangHeaders] = useState([]);
  const [borangRows, setBorangRows] = useState([]);
  const [borangMhsAktif, setBorangMhsAktif] = useState([]);
  
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahunTS, setFilterTahunTS] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    id_bentuk: '',
    jumlah_mhs: '',
    link_bukti: '',
  });

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  // 1. Initial Auth & Role Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUserRole(userData.unit || '');
        
        // Enforce role locks (using loose checks aligned with master pages)
        const username = (userData.username || '').toUpperCase();
        const unit = (userData.unit || '').toUpperCase();
        
        if (username.includes('PRODI-TI') || unit.includes('PRODI-TI') || username.includes('PRODITI') || unit.includes('PRODITI') || username === 'TI' || unit === 'TI') {
          setProdiLock('PRODI-TI');
          setFilterProdi('1'); // TI maps to id_prodi = 1
        } else if (username.includes('PRODI-MI') || unit.includes('PRODI-MI') || username.includes('PRODIMI') || unit.includes('PRODIMI') || username === 'MI' || unit === 'MI') {
          setProdiLock('PRODI-MI');
          setFilterProdi('2'); // MI maps to id_prodi = 2
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, [router]);

  // 2. Fetch Data trigger when filterProdi or filterTahunTS updates
  useEffect(() => {
    fetchData();
  }, [filterProdi, filterTahunTS]);

  // Fetch Data function
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseUrl = 'http://localhost:5000/api/prodi/2c-fleksibilitas';
      const params = `?id_prodi=${filterProdi}&id_tahun_ts=${filterTahunTS}`;
      
      const [activeRes, trashRes] = await Promise.all([
        fetch(`${baseUrl}${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/trash?id_prodi=${filterProdi}`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      
      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();
      
      if (activeResult.success) {
        // Populasikan masters jika masih kosong
        if (masterProdi.length === 0) {
          const sortedYears = [...(activeResult.master?.tahun || [])].sort((a, b) => {
            const valA = String(a.tahun || '');
            const valB = String(b.tahun || '');
            return valA.localeCompare(valB);
          });
          setMasterProdi(activeResult.master?.prodi || []);
          setMasterTahun(sortedYears);
          setMasterBentuk(activeResult.master?.bentuk || []);
          
          // Form default values
          setFormData(prev => ({
            ...prev,
            id_prodi: filterProdi || (activeResult.master?.prodi[0]?.id_prodi?.toString() || ''),
            id_tahun: sortedYears[0]?.id_tahun?.toString() || '',
            id_bentuk: activeResult.master?.bentuk[0]?.id_bentuk?.toString() || '',
          }));
        }

        // Simpan borang dan transaksi aktif
        setBorangHeaders(activeResult.borang?.tahunHeaders || []);
        setBorangRows(activeResult.borang?.barisBentuk || []);
        setBorangMhsAktif(activeResult.borang?.mhsAktif || []);
        setActiveData(activeResult.data || []);
      }

      if (trashResult.success) {
        setTrashData(trashResult.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      showError('Gagal memuat data fleksibilitas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const jumlah_mhs = parseInt(formData.jumlah_mhs) || 0;
    
    // Front-end Validation Block: Check against active student limits
    const limitObj = borangMhsAktif.find(m => m.id_tahun === parseInt(formData.id_tahun));
    const totalAktif = limitObj ? limitObj.total_aktif : 0;
    
    if (jumlah_mhs > totalAktif) {
      showError(`Gagal! Jumlah mahasiswa (${jumlah_mhs}) melebihi total mahasiswa aktif (${totalAktif}) di Tabel 2.A.1.`);
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/prodi/2c-fleksibilitas/${editingId}`
      : 'http://localhost:5000/api/prodi/2c-fleksibilitas';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_prodi: parseInt(formData.id_prodi),
          id_tahun: parseInt(formData.id_tahun),
          id_bentuk: parseInt(formData.id_bentuk),
          jumlah_mhs: jumlah_mhs,
          link_bukti: formData.link_bukti || '',
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
        resetForm();
      } else {
        showError(result.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      showError('Terjadi kesalahan koneksi server');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_2c);
    setFormData({
      id_prodi: item.id_prodi.toString(),
      id_tahun: item.id_tahun.toString(),
      id_bentuk: item.id_bentuk.toString(),
      jumlah_mhs: item.jumlah_mhs.toString(),
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Pindahkan data fleksibilitas ini ke tempat sampah?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2c-fleksibilitas/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/prodi/2c-fleksibilitas/restore/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/prodi/2c-fleksibilitas/hard/${id}`, {
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
      id_prodi: filterProdi || (masterProdi[0]?.id_prodi?.toString() || ''),
      id_tahun: masterTahun[0]?.id_tahun?.toString() || '',
      id_bentuk: masterBentuk[0]?.id_bentuk?.toString() || '',
      jumlah_mhs: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/prodi/2c-fleksibilitas/export?id_prodi=${filterProdi}&id_tahun_ts=${filterTahunTS}&token=${token}`, '_blank');
  };

  // Perhitungan Borang Sums & Percentages
  const columnTotals = borangHeaders.map(th => {
    return borangRows.reduce((sum, row) => sum + (row.values[th.id_tahun] || 0), 0);
  });

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
              <h1 className="text-3xl font-black text-white tracking-tight">Fleksibilitas Pembelajaran (2.C)</h1>
              <p className="text-gray-400 mt-1 font-medium">Bentuk pembelajaran yang memberikan fleksibilitas / pemenuhan SKS mahasiswa</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data'}</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/20 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium animate-in fade-in duration-300 flex items-center gap-2">
            <Info size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats & Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-blue-900/20 text-blue-400 rounded-xl"><Activity size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Transaksi</p>
                <p className="text-2xl font-black text-white">{activeData.length}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-emerald-900/20 text-emerald-400 rounded-xl"><Monitor size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bentuk Belajar</p>
                <p className="text-2xl font-black text-white">{masterBentuk.length}</p>
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
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Program Studi</label>
              <div className="relative">
                <select 
                  disabled={!!prodiLock}
                  value={filterProdi} 
                  onChange={(e) => setFilterProdi(e.target.value)} 
                  className={`w-full px-4 py-2.5 bg-gray-900 border border-gray-850 rounded-xl outline-none font-bold text-sm transition appearance-none cursor-pointer ${
                    prodiLock 
                      ? 'bg-gray-950 border-gray-800/80 text-gray-500/80 cursor-not-allowed pr-10' 
                      : 'focus:ring-4 focus:ring-blue-900/40 text-white'
                  }`}
                >
                  {prodiLock ? (
                    <option value={filterProdi}>🔒 {prodiLock === 'PRODI-TI' ? 'TEKNIK INFORMATIKA' : 'MANAJEMEN INFORMATIKA'}</option>
                  ) : (
                    <>
                      <option value="">-- Pilih Prodi --</option>
                      {masterProdi.map(p => (
                        <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun TS (Latest)</label>
              <select 
                value={filterTahunTS} 
                onChange={(e) => setFilterTahunTS(e.target.value)} 
                className="px-4 py-2.5 bg-gray-900 border border-gray-850 rounded-xl outline-none font-bold text-sm text-white focus:ring-4 focus:ring-blue-900/40 transition cursor-pointer"
              >
                <option value="">-- TAHUN TS (LATEST) --</option>
                {masterTahun.map(t => (
                  <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>
                ))}
              </select>
            </div>
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
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Data Fleksibilitas' : 'Input Data Fleksibilitas Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Program Studi</label>
                  <select 
                    disabled={!!prodiLock}
                    value={formData.id_prodi} 
                    onChange={(e) => setFormData({...formData, id_prodi: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white cursor-pointer"
                  >
                    {masterProdi.map(p => (
                      <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Tahun Akademik</label>
                  <select 
                    value={formData.id_tahun} 
                    onChange={(e) => setFormData({...formData, id_tahun: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white cursor-pointer"
                  >
                    {masterTahun.map(t => (
                      <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Bentuk Pembelajaran</label>
                  <select 
                    value={formData.id_bentuk} 
                    onChange={(e) => setFormData({...formData, id_bentuk: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white cursor-pointer"
                  >
                    {masterBentuk.map(b => (
                      <option key={b.id_bentuk} value={b.id_bentuk}>{b.nama_bentuk}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Jumlah Mahasiswa</label>
                  <input 
                    type="number" 
                    value={formData.jumlah_mhs} 
                    onChange={(e) => setFormData({...formData, jumlah_mhs: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white" 
                    placeholder="0" 
                    required 
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Link Bukti Pembelajaran (URL)</label>
                  <input 
                    type="url" 
                    value={formData.link_bukti} 
                    onChange={(e) => setFormData({...formData, link_bukti: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-white" 
                    placeholder="Contoh: https://link-sertifikat-atau-bukti.com" 
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

        {/* Matrix Table (Borang style) */}
        {!showTrash && (
          <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl mb-8">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Preview Borang Fleksibilitas Pembelajaran (2.C)</h2>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <RefreshCw className="animate-spin text-emerald-500" size={32} />
                <span className="font-bold text-sm uppercase tracking-wider">Mempersiapkan Borang...</span>
              </div>
            ) : borangHeaders.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-medium">
                Pilih Program Studi atau Tahun TS untuk memuat matriks laporan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-gray-800 border-b border-gray-700 font-black text-[11px] text-gray-300 uppercase tracking-wider">
                      <th rowSpan="2" className="px-6 py-4 border border-gray-700 text-left w-[30%]">Tahun Akademik</th>
                      {borangHeaders.map((th, idx) => {
                        const label = idx === 2 ? 'TS' : `TS-${2 - idx}`;
                        return (
                          <th key={th.id_tahun} className="px-4 py-3 border border-gray-700">
                            {th.tahun} ({label})
                          </th>
                        );
                      })}
                      <th rowSpan="2" className="px-6 py-4 border border-gray-700 w-[20%]">Link Bukti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {/* Baris Jumlah Mahasiswa Aktif */}
                    <tr className="bg-blue-950/20 border-b border-gray-700 font-bold text-white">
                      <td className="px-6 py-4 border border-gray-700 text-left font-black text-blue-300">
                        Jumlah Mahasiswa Aktif
                      </td>
                      {borangHeaders.map(th => {
                        const mhs = borangMhsAktif.find(m => m.id_tahun === th.id_tahun);
                        return (
                          <td key={th.id_tahun} className="px-4 py-4 border border-gray-700 font-black text-blue-400">
                            {mhs ? mhs.total_aktif : 0}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 border border-gray-700"></td>
                    </tr>

                    {/* Baris Judul Bentuk */}
                    <tr className="bg-gray-950/40 text-[10px] font-black uppercase text-gray-500 tracking-widest text-left">
                      <td colSpan={borangHeaders.length + 2} className="px-6 py-2.5 border border-gray-700 italic">
                        Bentuk Pembelajaran (Jumlah mahasiswa untuk setiap bentuk pembelajaran)
                      </td>
                    </tr>

                    {/* Baris Data Bentuk */}
                    {borangRows.map(b => {
                      let links = [];
                      return (
                        <tr key={b.id_bentuk} className="hover:bg-blue-900/10 transition-colors text-gray-300">
                          <td className="px-6 py-4 border border-gray-700 text-left font-medium pl-8 text-gray-400">
                            {b.nama_bentuk}
                          </td>
                          {borangHeaders.map(th => {
                            const val = b.values[th.id_tahun] || 0;
                            const foundTrans = activeData.find(d => d.id_bentuk === b.id_bentuk && d.id_tahun === th.id_tahun);
                            if (foundTrans && foundTrans.link_bukti && foundTrans.link_bukti !== '-') {
                              links.push(foundTrans.link_bukti);
                            }
                            return (
                              <td key={th.id_tahun} className="px-4 py-4 border border-gray-700 font-black">
                                {val}
                              </td>
                            );
                          })}
                          <td className="px-6 py-4 border border-gray-700 text-left">
                            {links.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {Array.from(new Set(links)).map((l, i) => (
                                  <a 
                                    key={i} 
                                    href={l} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:underline max-w-[150px] truncate"
                                  >
                                    <LinkIcon size={10} />
                                    <span>Bukti {i + 1}</span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Footer Jumlah */}
                    <tr className="bg-gray-800/40 font-bold border-t border-gray-700 text-gray-200">
                      <td className="px-6 py-4 border border-gray-700 text-left font-black uppercase text-[10px]">
                        Jumlah
                      </td>
                      {columnTotals.map((tot, idx) => (
                        <td key={idx} className="px-4 py-4 border border-gray-700 font-black text-emerald-400">
                          {tot}
                        </td>
                      ))}
                      <td className="px-6 py-4 border border-gray-700"></td>
                    </tr>

                    {/* Footer Persentase */}
                    <tr className="bg-gray-800/60 font-bold text-gray-200">
                      <td className="px-6 py-4 border border-gray-700 text-left font-black uppercase text-[10px]">
                        Persentase (%)
                      </td>
                      {columnTotals.map((tot, idx) => {
                        const th = borangHeaders[idx];
                        const limitObj = borangMhsAktif.find(m => m.id_tahun === th?.id_tahun);
                        const totalAktif = limitObj ? limitObj.total_aktif : 0;
                        const pct = totalAktif > 0 ? ((tot / totalAktif) * 100).toFixed(2) : '0.00';
                        return (
                          <td key={idx} className="px-4 py-4 border border-gray-700 font-black text-blue-400">
                            {pct}%
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 border border-gray-700"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* History Table (Active List or Trash List) */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">
              {showTrash ? 'Tempat Sampah Data Fleksibilitas (2.C)' : 'Riwayat Input Pengisian Data (2.C)'}
            </h2>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <RefreshCw className="animate-spin text-blue-500" size={32} />
              <span className="font-bold text-sm uppercase tracking-wider">Memuat Riwayat...</span>
            </div>
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Monitor size={48} className="mb-4 text-gray-700" />
              <p className="font-bold text-lg text-gray-400 uppercase tracking-widest">Tidak Ada Data</p>
              <p className="text-gray-500 text-sm mt-1">{showTrash ? 'Tempat sampah kosong.' : 'Belum ada riwayat transaksi pengisian.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr className="text-[11px] font-black text-gray-300 uppercase tracking-widest">
                    <th className="px-4 py-4 border border-gray-700">No</th>
                    <th className="px-6 py-4 border border-gray-700 text-left min-w-[200px]">Program Studi</th>
                    <th className="px-4 py-4 border border-gray-700">Tahun Akademik</th>
                    <th className="px-6 py-4 border border-gray-700 text-left">Bentuk Pembelajaran</th>
                    <th className="px-4 py-4 border border-gray-700">Jumlah Mahasiswa</th>
                    <th className="px-4 py-4 border border-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(showTrash ? trashData : activeData).map((item, idx) => (
                    <tr key={item.id_2c} className="hover:bg-blue-900/10 transition-colors group text-gray-300">
                      <td className="px-4 py-4 border border-gray-700 font-black">{idx + 1}</td>
                      <td className="px-6 py-4 border border-gray-700 text-left font-black text-white">{item.nama_prodi || '-'}</td>
                      <td className="px-4 py-4 border border-gray-700 font-black text-blue-400 text-xs tracking-wider">{item.tahun || '-'}</td>
                      <td className="px-6 py-4 border border-gray-700 text-left font-bold text-gray-400">{item.nama_bentuk || '-'}</td>
                      <td className="px-4 py-4 border border-gray-700 font-black text-white">{item.jumlah_mhs || 0}</td>
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
                                onClick={() => handleSoftDelete(item.id_2c)} 
                                className="p-1.5 bg-gray-800 hover:bg-red-900/40 border border-gray-700 hover:border-red-900/60 rounded-lg text-gray-400 hover:text-red-400 transition"
                                title="Hapus ke Sampah"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleRestore(item.id_2c)} 
                                className="flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-emerald-900/40 border border-gray-700 hover:border-emerald-900/60 rounded-lg text-gray-400 hover:text-emerald-400 text-xs font-bold transition"
                                title="Restore"
                              >
                                <RotateCcw size={12} />
                                <span>Pulihkan</span>
                              </button>
                              <button 
                                onClick={() => handleHardDelete(item.id_2c)} 
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
