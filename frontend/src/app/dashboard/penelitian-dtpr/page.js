'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, BookOpen, Users, Map, Activity, ExternalLink, Database } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function PenelitianPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [dosenList, setDosenList] = useState([]);

  const [filterIdProdi, setFilterIdProdi] = useState('');
  const [filterIdTahun, setFilterIdTahun] = useState('');

  const [roadmap, setRoadmap] = useState(null);
  const [penelitianData, setPenelitianData] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('3a2'); // '3a2', '3c1', '3c2', '3c3'

  // Form State
  const [formData, setFormData] = useState({
    induk: { id_dosen: '', judul: '', jumlah_mahasiswa: 0, jenis_hibah: '', sumber: '', durasi: 1, jumlah_dana: 0, link_bukti: '' },
    kerjasama: [],
    publikasi: [],
    hki: []
  });

  const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 5000); };

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (tab) setActiveSubTab(tab);
  }, [tab]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    else loadInitialData();
  }, [router]);

  useEffect(() => {
    if (filterIdProdi && filterIdTahun) fetchRoadmap();
  }, [filterIdProdi, filterIdTahun]);

  const loadInitialData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [prodiRes, tahunRes, dosenRes] = await Promise.all([
        fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/dosen', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      const prodiResult = await prodiRes.json();
      const tahunResult = await tahunRes.json();
      const dosenResult = await dosenRes.json();

      if (prodiResult.success) {
        setProdiList(prodiResult.data);
        if (prodiResult.data.length > 0) setFilterIdProdi(prodiResult.data[0].id_prodi.toString());
      }
      if (tahunResult.success) {
        const sortedTahun = (tahunResult.data || []).sort((a, b) => parseInt(b.tahun) - parseInt(a.tahun));
        setTahunList(sortedTahun);
        if (sortedTahun.length > 0) setFilterIdTahun(sortedTahun[0].id_tahun.toString());
      }
      if (dosenResult.success) setDosenList(dosenResult.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoadmap = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/lppm/roadmap-lppm?id_prodi=${filterIdProdi}&id_tahun=${filterIdTahun}&jenis=Penelitian`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success && result.data.length > 0) {
        setRoadmap(result.data[0]);
        fetchData(result.data[0].id_roadmap);
      } else {
        setRoadmap(null);
        setPenelitianData([]);
      }
    } catch (err) {
      showError('Gagal memuat roadmap');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/lppm/3a2-penelitian-dtpr?id_prodi=${filterIdProdi}&id_tahun=${filterIdTahun}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setPenelitianData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- FORM HANDLERS ---
  const handleAddSubItem = (type) => setFormData(prev => ({ ...prev, [type]: [...prev[type], {}] }));
  const handleRemoveSubItem = (type, index) => setFormData(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  const handleSubItemChange = (type, index, field, value) => {
    setFormData(prev => {
      const newList = [...prev[type]];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, [type]: newList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roadmap) return alert('Roadmap tidak ditemukan!');
    const token = localStorage.getItem('token');

    const payload = {
      penelitian: {
        id_roadmap: roadmap.id_roadmap,
        id_dosen: formData.induk.id_dosen,
        id_tahun: filterIdTahun,
        judul_penelitian: formData.induk.judul,
        jumlah_mahasiswa: formData.induk.jumlah_mahasiswa,
        jenis_hibah: formData.induk.jenis_hibah,
        sumber: formData.induk.sumber,
        durasi: formData.induk.durasi,
        jumlah_dana: formData.induk.jumlah_dana,
        link_bukti: formData.induk.link_bukti
      },
      kerjasama: formData.kerjasama.map(k => ({
        id_tahun: filterIdTahun, judul_kerjasama: k.judul, mitra_kerja_sama: k.mitra, sumber: k.sumber, durasi: k.durasi, jumlah_dana: k.dana, link_bukti: k.link
      })),
      publikasi: formData.publikasi.map(p => ({
        id_tahun: filterIdTahun, judul_publikasi: p.judul, jenis_publikasi: p.jenis, link_bukti: p.link
      })),
      hki: formData.hki.map(h => ({
        id_tahun: filterIdTahun, judul_hki: h.judul, jenis_hki: h.jenis, link_bukti: h.link
      }))
    };

    const url = 'http://localhost:5000/api/lppm/3a2-penelitian-dtpr';
    try {
      const res = await fetch(editingId ? `${url}/${editingId}` : url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        setShowForm(false);
        fetchData();
        resetForm();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_3a2);
    setFormData({
      induk: {
        id_dosen: item.id_dosen, judul: item.judul_penelitian, jumlah_mahasiswa: item.jumlah_mahasiswa, jenis_hibah: item.jenis_hibah,
        sumber: item.sumber, durasi: item.durasi, jumlah_dana: item.jumlah_dana, link_bukti: item.link_bukti
      },
      kerjasama: item.kerjasama ? item.kerjasama.map(k => ({ judul: k.judul_kerjasama, mitra: k.mitra_kerja_sama, sumber: k.sumber, durasi: k.durasi, dana: k.jumlah_dana, link: k.link_bukti })) : [],
      publikasi: item.publikasi ? item.publikasi.map(p => ({ judul: p.judul_publikasi, jenis: p.jenis_publikasi, link: p.link_bukti })) : [],
      hki: item.hki ? item.hki.map(h => ({ judul: h.judul_hki, jenis: h.jenis_hki, link: h.link_bukti })) : []
    });
    setShowForm(true);
  };

  const formatSumberShort = (s) => {
    if (!s) return '-';
    const lower = s.toLowerCase();
    if (lower.includes('internasional')) return 'I';
    if (lower.includes('nasional')) return 'N';
    if (lower.includes('lokal')) return 'L';
    return s.charAt(0).toUpperCase();
  };

  const formatNominal = (val) => {
    if (!val || val === 0) return '-';
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      induk: { id_dosen: '', judul: '', jumlah_mahasiswa: 0, jenis_hibah: '', sumber: '', durasi: 1, jumlah_dana: 0, link_bukti: '' },
      kerjasama: [], publikasi: [], hki: []
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin memindahkan data ini ke tempat sampah?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/lppm/3a2-penelitian-dtpr/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
      }
    } catch (err) {
      alert('Gagal menghapus');
    }
  };

  const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterIdTahun);
  const currentTS = selectedTahunObj ? parseInt(selectedTahunObj.tahun) : 0;
  // Build id_tahun -> tahun year map for correct TS-2/TS-1/TS column logic
  const tahunMap = {};
  tahunList.forEach(t => { tahunMap[t.id_tahun] = parseInt(t.tahun); });

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-black text-white dark:text-white tracking-tight">(3.A.2) Penelitian DTPR, Hibah dan Pembiayaan Penelitian</h1>
            <p className="text-gray-400 dark:text-gray-400 mt-1 font-medium">Monitoring Hibah dan Pembiayaan Penelitian beserta Tabel Relasi 3.C</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 dark:border-gray-700 flex flex-wrap gap-4 items-end mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Program Studi</label>
            <select value={filterIdProdi} onChange={(e) => setFilterIdProdi(e.target.value)} className="w-full px-4 py-2.5 bg-gray-950/50 dark:bg-gray-800 border border-transparent rounded-xl outline-none font-bold text-sm cursor-pointer dark:text-white">
              {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun (TS)</label>
            <select value={filterIdTahun} onChange={(e) => setFilterIdTahun(e.target.value)} className="w-full px-4 py-2.5 bg-gray-950/50 dark:bg-gray-800 border border-transparent rounded-xl outline-none font-bold text-sm cursor-pointer dark:text-white">
              {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
            </select>
          </div>
          <button onClick={fetchRoadmap} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 dark:shadow-blue-900/20 hover:bg-blue-700 transition">
            Terapkan Filter
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="p-20 text-center"><RefreshCw className="animate-spin mx-auto text-blue-500 mb-4" size={40} /><p className="font-bold text-gray-400">Memuat data...</p></div>
        ) : !roadmap ? (
          <div className="bg-red-950/40 dark:bg-red-900/10 border-2 border-dashed border-red-800 dark:border-red-900/30 p-10 rounded-3xl text-center">
            <Map size={48} className="mx-auto text-red-400 dark:text-red-600 mb-4" />
            <h3 className="text-xl font-black text-red-300 dark:text-red-400 mb-2">Roadmap LPPM Belum Dibuat!</h3>
            <p className="text-red-600 dark:text-red-500 font-medium">Anda harus menetapkan Roadmap untuk Prodi dan Tahun TS ini terlebih dahulu di modul Master Roadmap LPPM.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Roadmap Status Info & Visualization */}
            <div className="bg-gray-900 dark:bg-gray-900 border-2 border-blue-900/50 dark:border-blue-900/30 p-6 rounded-3xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 dark:bg-blue-900/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">

                {/* Roadmap Node */}
                <div className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg shadow-emerald-900/20 dark:shadow-emerald-900/20 text-white w-full md:w-auto relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-900/20 rounded-lg backdrop-blur-sm"><Map size={24} className="text-white" /></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-50">Master Roadmap</span>
                  </div>
                  <h3 className="text-xl font-black mb-1">{roadmap.jenis_roadmap}</h3>
                  <p className="text-sm font-medium text-emerald-100 opacity-90 truncate max-w-[250px]">{roadmap.link_dokumen ? <a href={roadmap.link_dokumen} target="_blank" className="hover:underline flex items-center gap-1">Lihat Dokumen <ExternalLink size={12} /></a> : 'Dokumen tidak tersedia'}</p>
                </div>

                {/* Flow Connector (Hidden on Mobile) */}
                <div className="hidden md:flex flex-col items-center justify-center relative w-16">
                  <div className="w-full h-1 bg-blue-200 dark:bg-blue-800 rounded-full relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest absolute -top-5 bg-gray-900 dark:bg-gray-900 px-2">Flow</span>
                </div>

                {/* Penelitian Node (Modified to Mini-Table) */}
                <div className="flex-[1.5] bg-gray-900 dark:bg-gray-800 border-2 border-dashed border-blue-800 dark:border-blue-800 p-5 rounded-3xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-900/30 dark:bg-blue-900/40 rounded-xl"><BookOpen size={20} className="text-blue-600 dark:text-blue-400" /></div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-blue-500">Kaitan Data Penelitian</span>
                    </div>
                    <div className="px-3 py-1 bg-blue-900/20 dark:bg-blue-900/30 rounded-full text-[10px] font-bold text-blue-600">{penelitianData.length} Judul</div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setActiveSubTab('3a2')}
                      className={`flex flex-col items-center p-3 rounded-2xl transition-all border ${activeSubTab === '3a2' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-blue-900/20 dark:bg-blue-900/10 border-blue-900/50 dark:border-blue-900/30 text-blue-400 dark:text-blue-300 hover:scale-105'}`}
                    >
                      <Database size={16} className="mb-1" />
                      <span className="text-[18px] font-black leading-none">{penelitianData.length}</span>
                      <span className="text-[9px] font-bold uppercase mt-1">Penelitian</span>
                    </button>

                    <button
                      onClick={() => setActiveSubTab('3c1')}
                      className={`flex flex-col items-center p-3 rounded-2xl transition-all border ${activeSubTab === '3c1' ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-purple-900/20 dark:bg-purple-900/10 border-purple-900/50 dark:border-purple-900/30 text-purple-400 dark:text-purple-300 hover:scale-105'}`}
                    >
                      <Users size={16} className="mb-1" />
                      <span className="text-[18px] font-black leading-none">{penelitianData.reduce((acc, p) => acc + (p.kerjasama?.length || 0), 0)}</span>
                      <span className="text-[9px] font-bold uppercase mt-1">Kerjasama</span>
                    </button>

                    <button
                      onClick={() => setActiveSubTab('3c2')}
                      className={`flex flex-col items-center p-3 rounded-2xl transition-all border ${activeSubTab === '3c2' ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-orange-900/20 dark:bg-orange-900/10 border-orange-900/50 dark:border-orange-900/30 text-orange-400 dark:text-orange-300 hover:scale-105'}`}
                    >
                      <BookOpen size={16} className="mb-1" />
                      <span className="text-[18px] font-black leading-none">{penelitianData.reduce((acc, p) => acc + (p.publikasi?.length || 0), 0)}</span>
                      <span className="text-[9px] font-bold uppercase mt-1">Publikasi</span>
                    </button>

                    <button
                      onClick={() => setActiveSubTab('3c3')}
                      className={`flex flex-col items-center p-3 rounded-2xl transition-all border ${activeSubTab === '3c3' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-emerald-900/20 dark:bg-emerald-900/10 border-emerald-900/50 dark:border-emerald-900/30 text-emerald-400 dark:text-emerald-300 hover:scale-105'}`}
                    >
                      <Activity size={16} className="mb-1" />
                      <span className="text-[18px] font-black leading-none">{penelitianData.reduce((acc, p) => acc + (p.hki?.length || 0), 0)}</span>
                      <span className="text-[9px] font-bold uppercase mt-1">HKI (Granted)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Sub-Navbar */}
            {!showForm && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Sub-Navbar */}
                <div className="flex bg-gray-800 dark:bg-gray-800 p-1 rounded-2xl w-full md:w-auto">
                  <button
                    onClick={() => setActiveSubTab('3a2')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeSubTab === '3a2' ? 'bg-gray-900 dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-300 dark:hover:text-gray-300'}`}
                  >
                    Tabel 3.A.2
                  </button>
                  <button
                    onClick={() => setActiveSubTab('3c1')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeSubTab === '3c1' ? 'bg-gray-900 dark:bg-gray-700 shadow-sm text-purple-600' : 'text-gray-400 hover:text-gray-300 dark:hover:text-gray-300'}`}
                  >
                    Tabel 3.C.1 Kerjasama
                  </button>
                  <button
                    onClick={() => setActiveSubTab('3c2')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeSubTab === '3c2' ? 'bg-gray-900 dark:bg-gray-700 shadow-sm text-orange-600' : 'text-gray-400 hover:text-gray-300 dark:hover:text-gray-300'}`}
                  >
                    Tabel 3.C.2 Publikasi
                  </button>
                  <button
                    onClick={() => setActiveSubTab('3c3')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeSubTab === '3c3' ? 'bg-gray-900 dark:bg-gray-700 shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-300 dark:hover:text-gray-300'}`}
                  >
                    Tabel 3.C.3 HKI (Granted)
                  </button>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => { resetForm(); setShowForm(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-bold text-sm shadow-md">
                    <Plus size={18} /> Tambah Penelitian
                  </button>
                </div>
              </div>
            )}

            {/* Form Input */}
            {showForm && (
              <div className="bg-gray-900 dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-700 dark:border-gray-700 animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-6 border-b pb-4 border-gray-700 dark:border-gray-700 flex items-center gap-2">
                  {editingId ? <Edit size={24} /> : <Plus size={24} />}
                  {editingId ? 'Edit' : 'Input'} Data Penelitian (3.A.2)
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Bagian Induk */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-blue-600 dark:text-blue-400 text-lg flex items-center gap-2"><BookOpen size={20} /> 1. Data Induk (3.A.2 Penelitian DTPR)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-950/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-700 dark:border-gray-700">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 dark:text-gray-300 mb-1">Pilih Dosen</label>
                        <select value={formData.induk.id_dosen} onChange={e => setFormData({ ...formData, induk: { ...formData.induk, id_dosen: e.target.value } })} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border border-gray-700 dark:border-gray-700 rounded-lg text-sm text-white dark:text-white" required>
                          <option value="">-- Pilih --</option>
                          {dosenList.map(d => <option key={d.id_dosen} value={d.id_dosen}>{d.nama_lengkap}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-300 dark:text-gray-300 mb-1">Judul Penelitian</label>
                        <input type="text" value={formData.induk.judul} onChange={e => setFormData({ ...formData, induk: { ...formData.induk, judul: e.target.value } })} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border border-gray-700 dark:border-gray-700 rounded-lg text-sm text-white dark:text-white" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-300 dark:text-gray-300 mb-1">Jenis Hibah</label>
                        <input type="text" value={formData.induk.jenis_hibah} onChange={e => setFormData({ ...formData, induk: { ...formData.induk, jenis_hibah: e.target.value } })} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border border-gray-700 dark:border-gray-700 rounded-lg text-sm text-white dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-300 dark:text-gray-300 mb-1">Sumber</label>
                        <select value={formData.induk.sumber} onChange={e => setFormData({ ...formData, induk: { ...formData.induk, sumber: e.target.value } })} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border border-gray-700 dark:border-gray-700 rounded-lg text-sm text-white dark:text-white">
                          <option value="">-- Pilih --</option>
                          <option value="Internasional">Internasional</option>
                          <option value="Nasional">Nasional</option>
                          <option value="Lokal">Lokal</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-300 dark:text-gray-300 mb-1">Mhs Terlibat</label>
                          <input type="number" value={formData.induk.jumlah_mahasiswa} onChange={e => setFormData({ ...formData, induk: { ...formData.induk, jumlah_mahasiswa: e.target.value } })} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border border-gray-700 dark:border-gray-700 rounded-lg text-sm text-white dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-300 dark:text-gray-300 mb-1">Durasi (Thn)</label>
                          <input type="number" value={formData.induk.durasi} onChange={e => setFormData({ ...formData, induk: { ...formData.induk, durasi: e.target.value } })} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border border-gray-700 dark:border-gray-700 rounded-lg text-sm text-white dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-300 dark:text-gray-300 mb-1">Dana (Rp)</label>
                          <input type="number" value={formData.induk.jumlah_dana} onChange={e => setFormData({ ...formData, induk: { ...formData.induk, jumlah_dana: e.target.value } })} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border border-gray-700 dark:border-gray-700 rounded-lg text-sm text-white dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-300 dark:text-gray-300 mb-1">Link Bukti Induk</label>
                        <input type="url" value={formData.induk.link_bukti} onChange={e => setFormData({ ...formData, induk: { ...formData.induk, link_bukti: e.target.value } })} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border border-gray-700 dark:border-gray-700 rounded-lg text-sm text-white dark:text-white" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-700 dark:border-gray-700" />

                  {/* Bagian Kerjasama */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-purple-600 dark:text-purple-400 text-lg flex items-center gap-2"><Users size={20} /> 2. Kerjasama Penelitian (Tabel 3.C.1)</h3>
                      <button type="button" onClick={() => handleAddSubItem('kerjasama')} className="text-xs bg-purple-900/30 text-purple-400 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400">+ Tambah</button>
                    </div>
                    {formData.kerjasama.map((k, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-purple-900/50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-900/50 dark:border-purple-900/30 relative">
                        <button type="button" onClick={() => handleRemoveSubItem('kerjasama', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><Trash2 size={12} /></button>
                        <input type="text" placeholder="Judul Kerjasama" value={k.judul || ''} onChange={e => handleSubItemChange('kerjasama', i, 'judul', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white" />
                        <input type="text" placeholder="Mitra" value={k.mitra || ''} onChange={e => handleSubItemChange('kerjasama', i, 'mitra', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white" />
                        <select value={k.sumber || ''} onChange={e => handleSubItemChange('kerjasama', i, 'sumber', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white">
                          <option value="">- Sumber -</option><option value="Internasional">Internasional</option><option value="Nasional">Nasional</option><option value="Lokal">Lokal</option>
                        </select>
                        <input type="text" placeholder="Link Bukti" value={k.link || ''} onChange={e => handleSubItemChange('kerjasama', i, 'link', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white" />
                      </div>
                    ))}
                  </div>

                  {/* Bagian Publikasi */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-orange-600 dark:text-orange-400 text-lg flex items-center gap-2"><BookOpen size={20} /> 3. Publikasi Penelitian (Tabel 3.C.2)</h3>
                      <button type="button" onClick={() => handleAddSubItem('publikasi')} className="text-xs bg-orange-900/30 text-orange-400 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400">+ Tambah</button>
                    </div>
                    {formData.publikasi.map((p, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-orange-900/50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-900/50 dark:border-orange-900/30 relative">
                        <button type="button" onClick={() => handleRemoveSubItem('publikasi', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><Trash2 size={12} /></button>
                        <input type="text" placeholder="Judul Publikasi" value={p.judul || ''} onChange={e => handleSubItemChange('publikasi', i, 'judul', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white" />
                        <select value={p.jenis || ''} onChange={e => handleSubItemChange('publikasi', i, 'jenis', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white">
                          <option value="">- Jenis Publikasi -</option>
                          <option value="IB">Internasional Bereputasi (IB)</option>
                          <option value="I">Internasional tidak Bereputasi (I)</option>
                          <option value="S1">Jurnal Sinta 1 (S1)</option>
                          <option value="S2">Jurnal Sinta 2 (S2)</option>
                          <option value="S3">Jurnal Sinta 3 (S3)</option>
                          <option value="S4">Jurnal Sinta 4 (S4)</option>
                          <option value="T">Tidak Terakreditasi (T)</option>
                        </select>
                        <input type="text" placeholder="Link Bukti" value={p.link || ''} onChange={e => handleSubItemChange('publikasi', i, 'link', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white" />
                      </div>
                    ))}
                  </div>

                  {/* Bagian HKI */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-lg flex items-center gap-2"><Activity size={20} /> 4. Perolehan HKI (Granted) (Tabel 3.C.3)</h3>
                      <button type="button" onClick={() => handleAddSubItem('hki')} className="text-xs bg-emerald-900/30 text-emerald-400 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">+ Tambah</button>
                    </div>
                    {formData.hki.map((h, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-emerald-900/50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-900/50 dark:border-emerald-900/30 relative">
                        <button type="button" onClick={() => handleRemoveSubItem('hki', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><Trash2 size={12} /></button>
                        <input type="text" placeholder="Judul HKI" value={h.judul || ''} onChange={e => handleSubItemChange('hki', i, 'judul', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white" />
                        <select value={h.jenis || ''} onChange={e => handleSubItemChange('hki', i, 'jenis', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white">
                          <option value="">- Jenis HKI -</option><option value="Paten">Paten</option><option value="Hak Cipta">Hak Cipta</option><option value="Desain Industri">Desain Industri</option>
                        </select>
                        <input type="text" placeholder="Link Bukti" value={h.link || ''} onChange={e => handleSubItemChange('hki', i, 'link', e.target.value)} className="w-full px-3 py-2 bg-gray-900 dark:bg-gray-900 border rounded-lg text-xs text-white dark:text-white" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-800 dark:bg-gray-800 text-gray-300 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-700 transition">Batal</button>
                    <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-900/20 dark:shadow-blue-900/20 hover:bg-blue-700 transition">{editingId ? 'Simpan Perubahan' : 'Simpan Data'}</button>
                  </div>
                </form>
              </div>
            )}

            {/* Table Area */}
            {!showForm && (
              <div className="bg-gray-900 dark:bg-gray-900 rounded-[2rem] shadow-xl border border-gray-700 dark:border-gray-700 overflow-hidden mt-6">
                <div className="overflow-x-auto p-6">
                  {activeSubTab === '3a2' && (
                    <div className="overflow-x-auto rounded-2xl border border-gray-700 dark:border-gray-700 shadow-sm">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-800 dark:bg-gray-800 text-[11px] font-black text-gray-300 dark:text-gray-300 uppercase text-center">
                            <th rowSpan="2" className="px-4 py-3 border border-gray-600 dark:border-gray-700 w-12">No</th>
                            <th rowSpan="2" className="px-4 py-3 border border-gray-600 dark:border-gray-700 text-left min-w-[150px]">Nama DTPR (Ketua)</th>
                            <th rowSpan="2" className="px-4 py-3 border border-gray-600 dark:border-gray-700 text-left min-w-[200px]">Judul Penelitian</th>
                            <th rowSpan="2" className="px-4 py-3 border border-gray-600 dark:border-gray-700">Mhs</th>
                            <th rowSpan="2" className="px-4 py-3 border border-gray-600 dark:border-gray-700">Hibah</th>
                            <th className="px-4 py-3 border border-gray-600 dark:border-gray-700">Sumber</th>
                            <th rowSpan="2" className="px-4 py-3 border border-gray-600 dark:border-gray-700">Durasi</th>
                            <th colSpan="3" className="px-4 py-3 border border-gray-600 dark:border-gray-700">Pendanaan (Juta Rp)</th>
                            <th rowSpan="2" className="px-4 py-3 border border-gray-600 dark:border-gray-700">Link</th>
                            <th rowSpan="2" className="px-4 py-3 border border-gray-600 dark:border-gray-700 w-24">Aksi</th>
                          </tr>
                          <tr className="bg-gray-800 dark:bg-gray-800 text-[10px] font-black text-gray-300 dark:text-gray-300 uppercase text-center">
                            <th className="px-2 py-2 border border-gray-600 dark:border-gray-700">L/N/I</th>
                            <th className="px-2 py-2 border border-gray-600 dark:border-gray-700">TS-2</th>
                            <th className="px-2 py-2 border border-gray-600 dark:border-gray-700">TS-1</th>
                            <th className="px-2 py-2 border border-gray-600 dark:border-gray-700">TS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {penelitianData.length === 0 ? (
                            <tr>
                              <td colSpan="11" className="px-4 py-10 text-center font-bold text-gray-400 italic">Belum ada data di tahun/roadmap ini.</td>
                            </tr>
                          ) : (
                            penelitianData.map((item, idx) => {
                              const itemYear = tahunMap[item.id_tahun] || 0;
                              const ts2Val = itemYear === currentTS - 2 ? (item.jumlah_dana || 0) : 0;
                              const ts1Val = itemYear === currentTS - 1 ? (item.jumlah_dana || 0) : 0;
                              const tsVal = itemYear === currentTS ? (item.jumlah_dana || 0) : 0;

                              return (
                                <tr key={item.id_3a2} className="hover:bg-blue-900/50 dark:hover:bg-blue-900/10 transition-colors text-center text-gray-300 dark:text-gray-300">
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700 font-bold">{idx + 1}</td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700 text-left font-bold">{item.nama_dosen}</td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700 text-left">
                                    <div className="font-semibold text-white dark:text-white leading-snug">{item.judul_penelitian}</div>
                                    <div className="flex gap-1 mt-1">
                                      {item.kerjasama?.length > 0 && <span className="px-1.5 py-0.5 bg-purple-900/30 dark:bg-purple-900/40 text-purple-400 dark:text-purple-300 rounded text-[9px] font-black">K:{item.kerjasama.length}</span>}
                                      {item.publikasi?.length > 0 && <span className="px-1.5 py-0.5 bg-orange-900/30 dark:bg-orange-900/40 text-orange-400 dark:text-orange-300 rounded text-[9px] font-black">P:{item.publikasi.length}</span>}
                                      {item.hki?.length > 0 && <span className="px-1.5 py-0.5 bg-emerald-900/30 dark:bg-emerald-900/40 text-emerald-400 dark:text-emerald-300 rounded text-[9px] font-black">H:{item.hki.length}</span>}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700 font-bold">{item.jumlah_mahasiswa || 0}</td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700 text-xs">{item.jenis_hibah || '-'}</td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700 font-black text-blue-600">{formatSumberShort(item.sumber)}</td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700">{item.durasi || 0}</td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700 text-xs font-bold whitespace-nowrap">{formatNominal(ts2Val)}</td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700 text-xs font-bold whitespace-nowrap">{formatNominal(ts1Val)}</td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700 text-xs font-bold whitespace-nowrap">{formatNominal(tsVal)}</td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700">
                                    {item.link_bukti && <a href={item.link_bukti} target="_blank" className="p-1.5 bg-gray-800 dark:bg-gray-800 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition inline-block"><ExternalLink size={14} /></a>}
                                  </td>
                                  <td className="px-4 py-3 border border-gray-600 dark:border-gray-700">
                                    <div className="flex items-center justify-center gap-1">
                                      <button onClick={() => handleEdit(item)} className="p-1.5 bg-blue-900/20 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition" title="Edit"><Edit size={14} /></button>
                                      <button onClick={() => handleDelete(item.id_3a2)} className="p-1.5 bg-red-950/40 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition" title="Hapus"><Trash2 size={14} /></button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeSubTab === '3c1' && (
                    <div className="overflow-x-auto rounded-2xl border border-purple-900/50 dark:border-purple-900/30 shadow-sm">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-purple-900/20 dark:bg-purple-900/20 text-[11px] font-black text-purple-400 dark:text-purple-300 uppercase text-center">
                            <th rowSpan="2" className="px-4 py-3 border border-purple-800 dark:border-purple-800">No</th>
                            <th rowSpan="2" className="px-4 py-3 border border-purple-800 dark:border-purple-800 text-left min-w-[300px]">Judul Kerjasama & Ref</th>
                            <th rowSpan="2" className="px-4 py-3 border border-purple-800 dark:border-purple-800 text-left min-w-[200px]">Mitra Kerja Sama</th>
                            <th className="px-4 py-3 border border-purple-800 dark:border-purple-800">Sumber</th>
                            <th rowSpan="2" className="px-4 py-3 border border-purple-800 dark:border-purple-800">Durasi</th>
                            <th colSpan="3" className="px-4 py-3 border border-purple-800 dark:border-purple-800">Pendanaan (Juta Rp)</th>
                            <th rowSpan="2" className="px-4 py-3 border border-purple-800 dark:border-purple-800">Bukti</th>
                          </tr>
                          <tr className="bg-purple-900/20 dark:bg-purple-900/20 text-[10px] font-black text-purple-400 dark:text-purple-300 uppercase text-center">
                            <th className="px-2 py-2 border border-purple-800 dark:border-purple-800">L/N/I</th>
                            <th className="px-2 py-2 border border-purple-800 dark:border-purple-800">TS-2</th>
                            <th className="px-2 py-2 border border-purple-800 dark:border-purple-800">TS-1</th>
                            <th className="px-2 py-2 border border-purple-800 dark:border-purple-800">TS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {penelitianData.every(p => !p.kerjasama?.length) ? (
                            <tr><td colSpan="9" className="px-4 py-10 text-center font-bold text-gray-400">Belum ada data kerjasama.</td></tr>
                          ) : (
                            penelitianData.flatMap(p => (p.kerjasama || []).map(k => ({ ...k, nama_dosen: p.nama_dosen, judul_penelitian: p.judul_penelitian, parent_durasi: p.durasi, parent_dana: p.jumlah_dana, parent_tahun: p.id_tahun }))).map((item, idx) => (
                              <tr key={idx} className="hover:bg-purple-900/30 dark:hover:bg-purple-900/5 transition-colors text-center text-gray-300 dark:text-gray-300">
                                <td className="px-4 py-3 border border-purple-900/50 dark:border-purple-900/30 font-bold">{idx + 1}</td>
                                <td className="px-4 py-3 border border-purple-900/50 dark:border-purple-900/30 text-left">
                                  <div className="text-purple-400 dark:text-purple-400 font-black mb-1 flex items-center gap-1">🤝 {item.judul_kerjasama}</div>
                                  <div className="text-[10px] text-gray-400 dark:text-gray-400 flex items-center gap-1">Ref: {item.judul_penelitian}</div>
                                </td>
                                <td className="px-4 py-3 border border-purple-900/50 dark:border-purple-900/30 text-left font-bold">{item.mitra_kerja_sama}</td>
                                <td className="px-4 py-3 border border-purple-900/50 dark:border-purple-900/30 font-black text-purple-600">{item.sumber?.charAt(0)}</td>
                                <td className="px-4 py-3 border border-purple-900/50 dark:border-purple-900/30 font-bold">{item.parent_durasi || 0}</td>
                                <td className="px-4 py-3 border border-purple-900/50 dark:border-purple-900/30 text-xs font-bold whitespace-nowrap">{tahunMap[item.parent_tahun] === currentTS - 2 ? formatNominal(item.parent_dana) : '-'}</td>
                                <td className="px-4 py-3 border border-purple-900/50 dark:border-purple-900/30 text-xs font-bold whitespace-nowrap">{tahunMap[item.parent_tahun] === currentTS - 1 ? formatNominal(item.parent_dana) : '-'}</td>
                                <td className="px-4 py-3 border border-purple-900/50 dark:border-purple-900/30 text-xs font-bold whitespace-nowrap">{tahunMap[item.parent_tahun] === currentTS ? formatNominal(item.parent_dana) : '-'}</td>
                                <td className="px-4 py-3 border border-purple-900/50 dark:border-purple-900/30">
                                  {item.link_bukti && <a href={item.link_bukti} target="_blank" className="text-purple-600 hover:underline inline-flex p-2 bg-purple-900/20 dark:bg-purple-900/30 rounded-lg"><ExternalLink size={14} /></a>}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeSubTab === '3c2' && (
                    <div className="overflow-x-auto rounded-2xl border border-orange-900/50 dark:border-orange-900/30 shadow-sm">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-orange-900/20 dark:bg-orange-900/20 text-[11px] font-black text-orange-400 dark:text-orange-300 uppercase text-center">
                            <th rowSpan="2" className="px-4 py-3 border border-orange-800 dark:border-orange-800">No</th>
                            <th rowSpan="2" className="px-4 py-3 border border-orange-800 dark:border-orange-800 text-left">Nama DTPR</th>
                            <th rowSpan="2" className="px-4 py-3 border border-orange-800 dark:border-orange-800 text-left min-w-[200px]">Judul Publikasi & Ref</th>
                            <th rowSpan="2" className="px-4 py-3 border border-orange-800 dark:border-orange-800">Jenis</th>
                            <th colSpan="3" className="px-4 py-3 border border-orange-800 dark:border-orange-800">Tahun Terbit (√)</th>
                            <th rowSpan="2" className="px-4 py-3 border border-orange-800 dark:border-orange-800">Bukti</th>
                          </tr>
                          <tr className="bg-orange-900/20 dark:bg-orange-900/20 text-[10px] font-black text-orange-400 dark:text-orange-300 uppercase text-center">
                            <th className="px-2 py-2 border border-orange-800 dark:border-orange-800">TS-2</th>
                            <th className="px-2 py-2 border border-orange-800 dark:border-orange-800">TS-1</th>
                            <th className="px-2 py-2 border border-orange-800 dark:border-orange-800">TS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {penelitianData.every(p => !p.publikasi?.length) ? (
                            <tr><td colSpan="8" className="px-4 py-10 text-center font-bold text-gray-400">Belum ada data publikasi.</td></tr>
                          ) : (
                            penelitianData.flatMap(p => (p.publikasi || []).map(pb => ({ ...pb, nama_dosen: p.nama_dosen, judul_penelitian: p.judul_penelitian }))).map((item, idx) => (
                              <tr key={idx} className="hover:bg-orange-900/30 dark:hover:bg-orange-900/5 transition-colors text-center text-gray-300 dark:text-gray-300">
                                <td className="px-4 py-3 border border-orange-900/50 dark:border-orange-900/30 font-bold">{idx + 1}</td>
                                <td className="px-4 py-3 border border-orange-900/50 dark:border-orange-900/30 text-left font-bold">{item.nama_dosen}</td>
                                <td className="px-4 py-3 border border-orange-900/50 dark:border-orange-900/30 text-left">
                                  <div className="text-orange-400 dark:text-orange-400 font-black mb-1 flex items-center gap-1">📚 {item.judul_publikasi}</div>
                                  <div className="text-[10px] text-gray-400 dark:text-gray-400 flex items-center gap-1">Ref: {item.judul_penelitian}</div>
                                </td>
                                <td className="px-4 py-3 border border-orange-900/50 dark:border-orange-900/30 font-bold text-xs uppercase tracking-wider">{item.jenis_publikasi}</td>
                                <td className="px-4 py-3 border border-orange-900/50 dark:border-orange-900/30 font-black text-orange-600">{tahunMap[item.id_tahun] === currentTS - 2 ? '√' : ''}</td>
                                <td className="px-4 py-3 border border-orange-900/50 dark:border-orange-900/30 font-black text-orange-600">{tahunMap[item.id_tahun] === currentTS - 1 ? '√' : ''}</td>
                                <td className="px-4 py-3 border border-orange-900/50 dark:border-orange-900/30 font-black text-orange-600">{tahunMap[item.id_tahun] === currentTS ? '√' : ''}</td>
                                <td className="px-4 py-3 border border-orange-900/50 dark:border-orange-900/30">
                                  {item.link_bukti && <a href={item.link_bukti} target="_blank" className="text-orange-600 hover:underline inline-flex p-2 bg-orange-900/20 dark:bg-orange-900/30 rounded-lg"><ExternalLink size={14} /></a>}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeSubTab === '3c3' && (
                    <div className="overflow-x-auto rounded-2xl border border-emerald-900/50 dark:border-emerald-900/30 shadow-sm">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-emerald-900/20 dark:bg-emerald-900/20 text-[11px] font-black text-emerald-400 dark:text-emerald-300 uppercase text-center">
                            <th rowSpan="2" className="px-4 py-3 border border-emerald-800 dark:border-emerald-800">No</th>
                            <th rowSpan="2" className="px-4 py-3 border border-emerald-800 dark:border-emerald-800 text-left min-w-[200px]">Judul HKI & Ref</th>
                            <th rowSpan="2" className="px-4 py-3 border border-emerald-800 dark:border-emerald-800">Jenis HKI</th>
                            <th rowSpan="2" className="px-4 py-3 border border-emerald-800 dark:border-emerald-800 text-left">Nama DTPR</th>
                            <th colSpan="3" className="px-4 py-3 border border-emerald-800 dark:border-emerald-800">Tahun Perolehan (√)</th>
                            <th rowSpan="2" className="px-4 py-3 border border-emerald-800 dark:border-emerald-800">Bukti</th>
                          </tr>
                          <tr className="bg-emerald-900/20 dark:bg-emerald-900/20 text-[10px] font-black text-emerald-400 dark:text-emerald-300 uppercase text-center">
                            <th className="px-2 py-2 border border-emerald-800 dark:border-emerald-800">TS-2</th>
                            <th className="px-2 py-2 border border-emerald-800 dark:border-emerald-800">TS-1</th>
                            <th className="px-2 py-2 border border-emerald-800 dark:border-emerald-800">TS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {penelitianData.every(p => !p.hki?.length) ? (
                            <tr><td colSpan="8" className="px-4 py-10 text-center font-bold text-gray-400">Belum ada data HKI.</td></tr>
                          ) : (
                            penelitianData.flatMap(p => (p.hki || []).map(h => ({ ...h, nama_dosen: p.nama_dosen, judul_penelitian: p.judul_penelitian }))).map((item, idx) => (
                              <tr key={idx} className="hover:bg-emerald-900/30 dark:hover:bg-emerald-900/5 transition-colors text-center text-gray-300 dark:text-gray-300">
                                <td className="px-4 py-3 border border-emerald-900/50 dark:border-emerald-900/30 font-bold">{idx + 1}</td>
                                <td className="px-4 py-3 border border-emerald-900/50 dark:border-emerald-900/30 text-left font-bold">{item.nama_dosen}</td>
                                <td className="px-4 py-3 border border-emerald-900/50 dark:border-emerald-900/30 text-left">
                                  <div className="text-emerald-400 dark:text-emerald-400 font-black mb-1 flex items-center gap-1">🎖️ {item.judul_hki}</div>
                                  <div className="text-[10px] text-gray-400 dark:text-gray-400 flex items-center gap-1">Ref: {item.judul_penelitian}</div>
                                </td>
                                <td className="px-4 py-3 border border-emerald-900/50 dark:border-emerald-900/30 font-bold text-xs uppercase tracking-wider">{item.jenis_hki}</td>
                                <td className="px-4 py-3 border border-emerald-900/50 dark:border-emerald-900/30 font-black text-emerald-600">{tahunMap[item.id_tahun] === currentTS - 2 ? '√' : ''}</td>
                                <td className="px-4 py-3 border border-emerald-900/50 dark:border-emerald-900/30 font-black text-emerald-600">{tahunMap[item.id_tahun] === currentTS - 1 ? '√' : ''}</td>
                                <td className="px-4 py-3 border border-emerald-900/50 dark:border-emerald-900/30 font-black text-emerald-600">{tahunMap[item.id_tahun] === currentTS ? '√' : ''}</td>
                                <td className="px-4 py-3 border border-emerald-900/50 dark:border-emerald-900/30">
                                  {item.link_bukti && <a href={item.link_bukti} target="_blank" className="text-emerald-600 hover:underline inline-flex p-2 bg-emerald-900/20 dark:bg-emerald-900/30 rounded-lg"><ExternalLink size={14} /></a>}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
