'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Download, RefreshCw, Edit, Trash2, Users, BookOpen, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DataMahasiswaPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('main'); // 'main' or 'trash'
  const [trashData, setTrashData] = useState([]);
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    daya_tampung: '',
    pendaftar: '',
    pendaftar_afirmasi: '',
    pendaftar_khusus: '',
    maba_reg_diterima: '',
    maba_reg_afirmasi: '',
    maba_reg_khusus: '',
    maba_rpl_diterima: '',
    maba_rpl_afirmasi: '',
    maba_rpl_khusus: '',
    aktif_reg_diterima: '',
    aktif_reg_afirmasi: '',
    aktif_reg_khusus: '',
    aktif_rpl_diterima: '',
    aktif_rpl_afirmasi: '',
    aktif_rpl_khusus: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      // Set user role based on token/user object correctly
      let detectedRole = 'pmb'; // default
      try {
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        if (userObj.role) {
          detectedRole = userObj.role.toLowerCase();
        } else if (userObj.username) {
          detectedRole = userObj.username.toLowerCase();
        } else {
          detectedRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
        }
      } catch (e) {
        detectedRole = 'pmb';
      }

      localStorage.setItem('userRole', detectedRole);

      fetchProdiList();
      fetchTahunList();
    }
  }, [router]);

  useEffect(() => {
    if (prodiList.length > 0 && (!filterProdi || filterProdi === '')) {
      const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
      if (tiProdi) setFilterProdi(tiProdi.id_prodi.toString());
    }
  }, [prodiList]);

  useEffect(() => {
    if (tahunList.length > 0 && (!filterTahun || filterTahun === '')) {
      const latestTahun = tahunList.length > 0 ? tahunList[0].id_tahun.toString() : '';
      setFilterTahun(latestTahun);
    }
  }, [tahunList]);

  useEffect(() => {
    if (filterProdi) {
      if (viewMode === 'main') fetchData();
      else fetchTrashData();
    }
  }, [filterProdi, viewMode]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Detect user role from localStorage or token
      const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();

      // Use appropriate endpoint based on user role
      const endpoint = userRole === 'ala' ? 'ala' : 'pmb';
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/${filterProdi}`, {
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

  const fetchTrashData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
      const endpoint = userRole === 'ala' ? 'ala' : 'pmb';
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/trash/${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setTrashData(result.data || []);
    } catch (err) {
      console.error('Error fetching trash data:', err);
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
      if (result.success) setProdiList(result.data || []);
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
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();

    // Log untuk debugging
    console.log('User Role:', userRole);
    console.log('Form Data:', formData);

    try {
      let successPmb = true;
      let successAla = true;
      let message = '';

      // Prepare PMB payload
      const pmbPayload = {
        id_prodi: formData.id_prodi || null,
        id_tahun: formData.id_tahun || null,
        daya: formData.daya_tampung || null,
        pendaftar: formData.pendaftar || null,
        p_afirmasi: formData.pendaftar_afirmasi || null,
        p_khusus: formData.pendaftar_khusus || null,
        reg_in: formData.maba_reg_diterima || null,
        reg_af: formData.maba_reg_afirmasi || null,
        reg_ks: formData.maba_reg_khusus || null,
        rpl_in: formData.maba_rpl_diterima || null,
        rpl_af: formData.maba_rpl_afirmasi || null,
        rpl_ks: formData.maba_rpl_khusus || null,
        user_id: 1, // Hardcoded for now, should come from auth
      };

      // Prepare ALA payload
      const alaPayload = {
        id_prodi: formData.id_prodi || null,
        id_tahun: formData.id_tahun || null,
        a_reg_in: formData.aktif_reg_diterima || null,
        a_reg_af: formData.aktif_reg_afirmasi || null,
        a_reg_ks: formData.aktif_reg_khusus || null,
        a_rpl_in: formData.aktif_rpl_diterima || null,
        a_rpl_af: formData.aktif_rpl_afirmasi || null,
        a_rpl_ks: formData.aktif_rpl_khusus || null,
        user_id: 1, // Hardcoded for now, should come from auth
      };

      if (userRole === 'admin' || userRole === 'pmb') {
        console.log('Sending request to PMB endpoint...');
        const resPmb = await fetch(`http://localhost:5000/api/pmb/2a1-data-mahasiswa/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(pmbPayload),
        });
        const resultPmb = await resPmb.json();
        successPmb = resultPmb.success;
        if (!message) message = resultPmb.message;
        if (!resultPmb.success) console.error('PMB Error:', resultPmb.message);
      }

      if (userRole === 'admin' || userRole === 'ala') {
        console.log('Sending request to ALA endpoint...');
        const resAla = await fetch(`http://localhost:5000/api/ala/2a1-data-mahasiswa/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(alaPayload),
        });
        const resultAla = await resAla.json();
        successAla = resultAla.success;
        if (!message || userRole === 'ala') message = resultAla.message;
        if (!resultAla.success) console.error('ALA Error:', resultAla.message);
      }

      if (successPmb && successAla) {
        alert(userRole === 'admin' ? 'Data berhasil disimpan' : message);
        fetchData();
        resetForm();
      } else {
        alert('Terjadi kesalahan saat menyimpan data');
      }
    } catch (err) {
      console.error('Error saving data:', err);
      console.error('Error details:', err.message);
      alert('Gagal menyimpan data: ' + err.message);
    }
  };

  const handleAddForYear = (targetYear) => {
    const tObj = tahunList.find(t => parseInt(t.tahun) === targetYear);
    if (!tObj) {
      alert(`Tahun Akademik ${targetYear} belum terdaftar di Master Data Tahun. Silakan tambah tahun tersebut terlebih dahulu.`);
      return;
    }
    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: tObj.id_tahun,
      daya_tampung: '',
      pendaftar: '', pendaftar_afirmasi: '', pendaftar_khusus: '',
      maba_reg_diterima: '', maba_reg_afirmasi: '', maba_reg_khusus: '',
      maba_rpl_diterima: '', maba_rpl_afirmasi: '', maba_rpl_khusus: '',
      aktif_reg_diterima: '', aktif_reg_afirmasi: '', aktif_reg_khusus: '',
      aktif_rpl_diterima: '', aktif_rpl_afirmasi: '', aktif_rpl_khusus: '',
    });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddMain = () => {
    if (showForm) {
      setShowForm(false);
      resetForm();
      return;
    }
    const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
    const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
    const anchorTahunObj = tahunList.find(t => parseInt(t.tahun) === anchorYear);

    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: anchorTahunObj ? anchorTahunObj.id_tahun : '',
      daya_tampung: '',
      pendaftar: '', pendaftar_afirmasi: '', pendaftar_khusus: '',
      maba_reg_diterima: '', maba_reg_afirmasi: '', maba_reg_khusus: '',
      maba_rpl_diterima: '', maba_rpl_afirmasi: '', maba_rpl_khusus: '',
      aktif_reg_diterima: '', aktif_reg_afirmasi: '', aktif_reg_khusus: '',
      aktif_rpl_diterima: '', aktif_rpl_afirmasi: '', aktif_rpl_khusus: '',
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData({
      id_prodi: item.prodi_id_prodi || filterProdi || '',
      id_tahun: item.tahun_akademik_id_tahun || filterTahun || '',
      daya_tampung: item.daya_tampung || '',
      pendaftar: item.pendaftar || '',
      pendaftar_afirmasi: item.pendaftar_afirmasi || '',
      pendaftar_khusus: item.pendaftar_khusus || '',
      maba_reg_diterima: item.maba_reg_diterima || '',
      maba_reg_afirmasi: item.maba_reg_afirmasi || '',
      maba_reg_khusus: item.maba_reg_khusus || '',
      maba_rpl_diterima: item.maba_rpl_diterima || '',
      maba_rpl_afirmasi: item.maba_rpl_afirmasi || '',
      maba_rpl_khusus: item.maba_rpl_khusus || '',
      aktif_reg_diterima: item.aktif_reg_diterima || '',
      aktif_reg_afirmasi: item.aktif_reg_afirmasi || '',
      aktif_reg_khusus: item.aktif_reg_khusus || '',
      aktif_rpl_diterima: item.aktif_rpl_diterima || '',
      aktif_rpl_afirmasi: item.aktif_rpl_afirmasi || '',
      aktif_rpl_khusus: item.aktif_rpl_khusus || '',
    });
    setEditingId(item.id_2a1);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    const token = localStorage.getItem('token');
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_2a1: id, user_id: 1 })
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
      fetchTrashData();
    } catch (err) {
      console.error('Error deleting data:', err);
      alert('Gagal menghapus data');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
      fetchTrashData();
    } catch (err) {
      console.error('Error restoring data:', err);
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('Peringatan: Data akan dihapus PERMANEN dari database. Lanjutkan?')) return;
    
    const token = localStorage.getItem('token');
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/hard-delete/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchTrashData();
    } catch (err) {
      console.error('Error hard deleting data:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: filterTahun || '',
      daya_tampung: '',
      pendaftar: '',
      pendaftar_afirmasi: '',
      pendaftar_khusus: '',
      maba_reg_diterima: '',
      maba_reg_afirmasi: '',
      maba_reg_khusus: '',
      maba_rpl_diterima: '',
      maba_rpl_afirmasi: '',
      maba_rpl_khusus: '',
      aktif_reg_diterima: '',
      aktif_reg_afirmasi: '',
      aktif_reg_khusus: '',
      aktif_rpl_diterima: '',
      aktif_rpl_afirmasi: '',
      aktif_rpl_khusus: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';
    window.open(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/export/${filterProdi}?token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-white tracking-tight">Data Mahasiswa (2.A.1)</h1>
              <p className="text-gray-400 mt-1 font-medium">Pengelolaan data mahasiswa aktif dan statistik akademik</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleAddMain} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
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

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-blue-900/20 text-blue-600 rounded-xl"><Users size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Mahasiswa</p>
                <p className="text-2xl font-black text-white">{data.length}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-green-950/40 text-green-600 rounded-xl"><BookOpen size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tahun Aktif</p>
                <p className="text-2xl font-black text-white">{filterTahun || '-'}</p>
              </div>
            </div>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-purple-900/20 text-purple-600 rounded-xl"><Filter size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Program Studi</p>
                <p className="text-2xl font-black text-white">{prodiList.find(p => p.id_prodi == filterProdi)?.nama_prodi || '-'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-48">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Program Studi</label>
              <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer">
                <option value="">Pilih Prodi</option>
                {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
              </select>
            </div>
            <div className="flex-1 lg:w-32">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Anchor (TS)</label>
              <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer">
                <option value="">Otomatis</option>
                {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
              </select>
            </div>
            <button onClick={viewMode === 'main' ? fetchData : fetchTrashData} className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-950/50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setViewMode('main')}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase ${
              viewMode === 'main'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-400 hover:text-gray-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setViewMode('trash')}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase flex items-center gap-2 ${
              viewMode === 'trash'
                ? 'border-b-4 border-red-600 text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            Trash
            <span className="bg-red-900/30 text-red-600 px-2 py-0.5 rounded-full text-xs font-black">
              {trashData.length}
            </span>
          </button>
        </div>

        {viewMode === 'main' && (
          <>
            {/* Form Section */}
            {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Data Mahasiswa' : 'Input Data Mahasiswa Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Program Studi</label>
                    <select value={formData.id_prodi} onChange={(e) => setFormData({ ...formData, id_prodi: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" required>
                      <option value="">Pilih Prodi</option>
                      {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Tahun Akademik</label>
                    <select value={formData.id_tahun} onChange={(e) => setFormData({ ...formData, id_tahun: e.target.value })} disabled={true} className="w-full px-4 py-3 bg-gray-800 border-transparent border-2 rounded-2xl outline-none font-medium opacity-70 cursor-not-allowed" required>
                      <option value="">Pilih Tahun</option>
                      {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Daya Tampung</label>
                    <input type="number" value={formData.daya_tampung} onChange={(e) => setFormData({ ...formData, daya_tampung: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-black text-white mb-4">Jumlah Calon Mahasiswa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Pendaftar</label>
                      <input type="number" value={formData.pendaftar} onChange={(e) => setFormData({ ...formData, pendaftar: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Afirmasi</label>
                      <input type="number" value={formData.pendaftar_afirmasi} onChange={(e) => setFormData({ ...formData, pendaftar_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Kebutuhan Khusus</label>
                      <input type="number" value={formData.pendaftar_khusus} onChange={(e) => setFormData({ ...formData, pendaftar_khusus: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-black text-white mb-4">Jumlah Mahasiswa Baru</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-md font-bold text-blue-600 mb-3">Reguler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Diterima</label>
                          <input type="number" value={formData.maba_reg_diterima} onChange={(e) => setFormData({ ...formData, maba_reg_diterima: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Afirmasi</label>
                          <input type="number" value={formData.maba_reg_afirmasi} onChange={(e) => setFormData({ ...formData, maba_reg_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.maba_reg_khusus} onChange={(e) => setFormData({ ...formData, maba_reg_khusus: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-blue-600 mb-3">RPL</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Diterima</label>
                          <input type="number" value={formData.maba_rpl_diterima} onChange={(e) => setFormData({ ...formData, maba_rpl_diterima: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Afirmasi</label>
                          <input type="number" value={formData.maba_rpl_afirmasi} onChange={(e) => setFormData({ ...formData, maba_rpl_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.maba_rpl_khusus} onChange={(e) => setFormData({ ...formData, maba_rpl_khusus: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-black text-white mb-4">Jumlah Mahasiswa Aktif</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-md font-bold text-green-600 mb-3">Reguler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Diterima</label>
                          <input type="number" value={formData.aktif_reg_diterima} onChange={(e) => setFormData({ ...formData, aktif_reg_diterima: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-green-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Afirmasi</label>
                          <input type="number" value={formData.aktif_reg_afirmasi} onChange={(e) => setFormData({ ...formData, aktif_reg_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-green-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.aktif_reg_khusus} onChange={(e) => setFormData({ ...formData, aktif_reg_khusus: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-green-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-green-600 mb-3">RPL</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Diterima</label>
                          <input type="number" value={formData.aktif_rpl_diterima} onChange={(e) => setFormData({ ...formData, aktif_rpl_diterima: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-green-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Afirmasi</label>
                          <input type="number" value={formData.aktif_rpl_afirmasi} onChange={(e) => setFormData({ ...formData, aktif_rpl_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-green-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.aktif_rpl_khusus} onChange={(e) => setFormData({ ...formData, aktif_rpl_khusus: e.target.value })} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-green-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition font-medium">
                  Batal
                </button>
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                  {editingId ? 'Update Data' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data mahasiswa</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <th rowSpan="3" className="px-8 py-5 border-r border-gray-700">TS</th>
                    <th rowSpan="3" className="px-8 py-5 border-r border-gray-700">Daya Tampung</th>
                    <th colSpan="3" className="px-8 py-5 border-r border-gray-700">Jumlah Calon Mahasiswa</th>
                    <th colSpan="6" className="px-8 py-5 border-r border-gray-700 font-bold bg-blue-900/50 text-blue-600">Jumlah Mahasiswa Baru</th>
                    <th colSpan="6" className="px-8 py-5 border-r border-gray-700 font-bold bg-green-950/50 text-green-600">Jumlah Mahasiswa Aktif</th>
                    <th rowSpan="3" className="px-8 py-5">Aksi</th>
                  </tr>
                  <tr className="text-[11px] font-black text-gray-400 text-center">
                    <th rowSpan="2" className="px-6 py-3 border-r border-gray-700 align-middle">Pendaftar</th>
                    <th rowSpan="2" className="px-6 py-3 border-r border-gray-700 align-middle">Pendaftar<br/>Afirmasi</th>
                    <th rowSpan="2" className="px-6 py-3 border-r border-gray-700 align-middle">Pendaftar<br/>Kebutuhan<br/>Khusus</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-gray-700 bg-blue-900/30">Reguler</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-gray-700 bg-blue-900/30">RPL</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-gray-700 bg-green-950/30">Reguler</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-gray-700 bg-green-950/30">RPL</th>
                  </tr>
                  <tr className="text-[9px] text-gray-400">
                    <th className="px-4 py-2 border-r border-gray-700">Diterima</th>
                    <th className="px-4 py-2 border-r border-gray-700">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-gray-700">Kebutuhan Khusus</th>
                    <th className="px-4 py-2 border-r border-gray-700 bg-blue-900/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-gray-700 bg-blue-900/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-gray-700 bg-blue-900/20">Kebutuhan Khusus</th>
                    <th className="px-4 py-2 border-r border-gray-700 bg-green-950/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-gray-700 bg-green-950/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-gray-700 bg-green-950/20">Kebutuhan Khusus</th>
                    <th className="px-4 py-2 border-r border-gray-700 bg-green-950/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-gray-700 bg-green-950/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-gray-700 bg-green-950/20">Kebutuhan Khusus</th>
                  </tr>
                  <tr className="bg-gray-800 font-black text-[7px] text-gray-400 italic">
                    <td className="px-8 py-2 border-r border-gray-700">(1)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(2)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(3)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(4)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(5)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(6)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(7)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(8)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(9)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(10)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(11)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(12)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(13)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(14)</td>
                    <td className="px-8 py-2 border-r border-gray-700">(15)</td>
                    <td className="px-8 py-2">-</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(() => {
                    const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                    const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                    
                    const rows = [];
                    for(let diff = 2; diff >= 0; diff--) {
                      const targetYear = anchorYear - diff;
                      const tsLabel = diff === 0 ? "TS" : `TS-${diff}`;
                      
                      const item = data.find(d => parseInt(d.tahun) === targetYear);
                      
                      if (item) {
                        rows.push(
                          <tr key={item.id_2a1} className="hover:bg-blue-900/30 transition-colors group">
                            <td className="px-8 py-4 border-r border-gray-700 text-center font-black text-white">{tsLabel} <span className="text-[9px] text-gray-400 block font-normal">({item.tahun})</span></td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center font-black text-blue-600">{item.daya_tampung || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-blue-900/20">{item.pendaftar || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-blue-900/20">{item.pendaftar_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-blue-900/20">{item.pendaftar_khusus || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-blue-900/10">{item.maba_reg_diterima || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-blue-900/10">{item.maba_reg_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-blue-900/10">{item.maba_reg_khusus || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-blue-900/10">{item.maba_rpl_diterima || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-blue-900/10">{item.maba_rpl_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-blue-900/10">{item.maba_rpl_khusus || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-green-950/20">{item.aktif_reg_diterima || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-green-950/20">{item.aktif_reg_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-green-950/20">{item.aktif_reg_khusus || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-green-950/20">{item.aktif_rpl_diterima || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-green-950/20">{item.aktif_rpl_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center bg-green-950/20">{item.aktif_rpl_khusus || 0}</td>
                            <td className="px-8 py-4">
                              <div className="inline-flex items-center bg-gray-900 border border-gray-700 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-800 group-hover:shadow-md">
                                <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-900/20 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                                <button onClick={() => handleDelete(item.id_2a1)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      } else {
                        rows.push(
                          <tr key={`empty-${targetYear}`} className="bg-gray-950/30 hover:bg-gray-800 transition-colors group">
                            <td className="px-8 py-4 border-r border-gray-700 text-center font-black text-gray-400">{tsLabel} <span className="text-[9px] text-gray-400 block font-normal">({targetYear})</span></td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center font-bold text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 border-r border-gray-700 text-center text-gray-400">0</td>
                            <td className="px-8 py-4 text-center">
                              <button onClick={() => handleAddForYear(targetYear)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-[10px] hover:bg-blue-700 transition uppercase tracking-wider shadow-sm flex items-center justify-center gap-1 mx-auto">
                                <Plus size={14} /> Tambah
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    }
                    return rows;
                  })()}
                </tbody>
                <tfoot className="bg-amber-950/40">
                  <tr className="text-center font-black text-gray-200 border-t-2 border-amber-800">
                    <td className="px-8 py-5 border-r border-amber-900/50">Jumlah</td>
                    <td className="px-8 py-5 border-r border-amber-900/50">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.daya_tampung) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50 bg-amber-900/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.pendaftar) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50 bg-amber-900/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.pendaftar_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50 bg-amber-900/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.pendaftar_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_reg_diterima) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_reg_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_reg_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_rpl_diterima) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_rpl_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_rpl_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50 bg-amber-900/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_reg_diterima) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50 bg-amber-900/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_reg_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50 bg-amber-900/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_reg_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50 bg-amber-900/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_rpl_diterima) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50 bg-amber-900/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_rpl_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-amber-900/50 bg-amber-900/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_rpl_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 bg-gray-900"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
            {/* Table Section Ends */}
          </>
        )}

        {/* Trash Section */}
        {viewMode === 'trash' && (
          <div className="bg-red-950/40 rounded-3xl p-8 border border-red-900/50 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-red-400 tracking-tight">Tempat Sampah</h3>
                <p className="text-sm text-red-500 font-medium">Data yang dihapus sementara dapat dikembalikan atau dihapus permanen.</p>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-2xl shadow-xl shadow-red-100/50 overflow-hidden border border-red-900/50">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-800 border-b border-red-900/50">
                    <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      <th className="px-6 py-4">Tahun Akademik</th>
                      <th className="px-6 py-4">Waktu Penghapusan</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {trashData.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center">
                          <p className="text-sm font-bold text-gray-400">Tidak ada data di tempat sampah</p>
                        </td>
                      </tr>
                    ) : (
                      trashData.map((item) => (
                        <tr key={item.id_2a1} className="hover:bg-red-950/30 transition-colors">
                          <td className="px-6 py-4 font-black text-white">{item.tahun}</td>
                          <td className="px-6 py-4 text-gray-400 font-medium">{new Date().toLocaleDateString('id-ID')}</td>
                          <td className="px-6 py-4 flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleRestore(item.id_2a1)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition uppercase shadow-lg shadow-blue-900/20"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => handleHardDelete(item.id_2a1)}
                              className="px-4 py-2 bg-red-950/40 text-red-600 border border-red-900/50 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition uppercase"
                            >
                              Hard Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
