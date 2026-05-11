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
      // Set user role based on token (simulate role detection)
      // In real app, this should come from login response
      const userRole = localStorage.getItem('userRole') || 'pmb'; // Default to pmb
      localStorage.setItem('userRole', userRole);
      
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
    if (filterProdi && filterTahun) fetchData();
  }, [filterProdi, filterTahun]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Detect user role from localStorage or token
      const userRole = localStorage.getItem('userRole') || 'pmb'; // Default to pmb
      
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
    const userRole = localStorage.getItem('userRole') || 'pmb';
    
    // Log untuk debugging
    console.log('User Role:', userRole);
    console.log('Form Data:', formData);
    
    // Untuk role ADMIN, tentukan endpoint berdasarkan field yang diisi
    let endpoint;
    if (userRole === 'admin') {
      // Jika user mengisi field Mahasiswa Aktif, gunakan endpoint ALA
      if (formData.aktif_reg_diterima || formData.aktif_reg_afirmasi || formData.aktif_reg_khusus || 
          formData.aktif_rpl_diterima || formData.aktif_rpl_afirmasi || formData.aktif_rpl_khusus) {
        endpoint = 'ala';
      } else {
        // Jika user mengisi field PMB, gunakan endpoint PMB
        endpoint = 'pmb';
      }
    } else {
      endpoint = userRole === 'ala' ? 'ala' : 'pmb';
    }
    
    // Convert all undefined values to null or empty string
    // Map field names to match backend expectations based on endpoint
    let cleanedFormData;
    
    if (endpoint === 'pmb') {
      // PMB field mapping - sesuai dengan controller expectations
      cleanedFormData = {
        id_prodi: formData.id_prodi || null,
        id_tahun: formData.id_tahun || null,
        daya: formData.daya_tampung || null,              // ← controller expects 'daya'
        pendaftar: formData.pendaftar || null,
        p_afirmasi: formData.pendaftar_afirmasi || null,  // ← controller expects 'p_afirmasi'
        p_khusus: formData.pendaftar_khusus || null,     // ← controller expects 'p_khusus'
        reg_in: formData.maba_reg_diterima || null,      // ← controller expects 'reg_in'
        reg_af: formData.maba_reg_afirmasi || null,      // ← controller expects 'reg_af'
        reg_ks: formData.maba_reg_khusus || null,       // ← controller expects 'reg_ks'
        rpl_in: formData.maba_rpl_diterima || null,      // ← controller expects 'rpl_in'
        rpl_af: formData.maba_rpl_afirmasi || null,      // ← controller expects 'rpl_af'
        rpl_ks: formData.maba_rpl_khusus || null,       // ← controller expects 'rpl_ks'
        user_id: 1, // Hardcoded for now, should come from auth
      };
    } else {
      // ALA field mapping - sesuai dengan controller expectations
      cleanedFormData = {
        id_prodi: formData.id_prodi || null,
        id_tahun: formData.id_tahun || null,
        a_reg_in: formData.aktif_reg_diterima || null,      // ← controller expects 'a_reg_in'
        a_reg_af: formData.aktif_reg_afirmasi || null,      // ← controller expects 'a_reg_af'
        a_reg_ks: formData.aktif_reg_khusus || null,       // ← controller expects 'a_reg_ks'
        a_rpl_in: formData.aktif_rpl_diterima || null,      // ← controller expects 'a_rpl_in'
        a_rpl_af: formData.aktif_rpl_afirmasi || null,      // ← controller expects 'a_rpl_af'
        a_rpl_ks: formData.aktif_rpl_khusus || null,       // ← controller expects 'a_rpl_ks'
        user_id: 1, // Hardcoded for now, should come from auth
      };
    }
    
    console.log('Endpoint:', endpoint);
    console.log('Cleaned Form Data:', cleanedFormData);
    
    try {
      console.log('Sending request to:', `http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/store`);
      console.log('Request payload:', cleanedFormData);
      
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanedFormData),
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      const result = await res.json();
      console.log('Response result:', result);
      
      if (result.success) {
        alert(result.message);
        fetchData();
        resetForm();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('Error saving data:', err);
      console.error('Error details:', err.message);
      alert('Gagal menyimpan data: ' + err.message);
    }
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
    const userRole = localStorage.getItem('userRole') || 'pmb';
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
    } catch (err) {
      console.error('Error deleting data:', err);
      alert('Gagal menghapus data');
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
    const userRole = localStorage.getItem('userRole') || 'pmb';
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';
    window.open(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/export/${filterProdi}?token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Data Mahasiswa (2.A.1)</h1>
              <p className="text-gray-500 mt-1 font-medium">Pengelolaan data mahasiswa aktif dan statistik akademik</p>
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

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Mahasiswa</p>
                <p className="text-2xl font-black text-gray-900">{data.length}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><BookOpen size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tahun Aktif</p>
                <p className="text-2xl font-black text-gray-900">{filterTahun || '-'}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Filter size={24} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Program Studi</p>
                <p className="text-2xl font-black text-gray-900">{prodiList.find(p => p.id_prodi == filterProdi)?.nama_prodi || '-'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-end">
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
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Data Mahasiswa' : 'Input Data Mahasiswa Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Daya Tampung</label>
                    <input type="number" value={formData.daya_tampung} onChange={(e) => setFormData({...formData, daya_tampung: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Jumlah Calon Mahasiswa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Pendaftar</label>
                      <input type="number" value={formData.pendaftar} onChange={(e) => setFormData({...formData, pendaftar: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Afirmasi</label>
                      <input type="number" value={formData.pendaftar_afirmasi} onChange={(e) => setFormData({...formData, pendaftar_afirmasi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Kebutuhan Khusus</label>
                      <input type="number" value={formData.pendaftar_khusus} onChange={(e) => setFormData({...formData, pendaftar_khusus: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Jumlah Mahasiswa Baru</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-md font-bold text-blue-600 mb-3">Reguler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Diterima</label>
                          <input type="number" value={formData.maba_reg_diterima} onChange={(e) => setFormData({...formData, maba_reg_diterima: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Afirmasi</label>
                          <input type="number" value={formData.maba_reg_afirmasi} onChange={(e) => setFormData({...formData, maba_reg_afirmasi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.maba_reg_khusus} onChange={(e) => setFormData({...formData, maba_reg_khusus: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-blue-600 mb-3">RPL</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Diterima</label>
                          <input type="number" value={formData.maba_rpl_diterima} onChange={(e) => setFormData({...formData, maba_rpl_diterima: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Afirmasi</label>
                          <input type="number" value={formData.maba_rpl_afirmasi} onChange={(e) => setFormData({...formData, maba_rpl_afirmasi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.maba_rpl_khusus} onChange={(e) => setFormData({...formData, maba_rpl_khusus: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Jumlah Mahasiswa Aktif</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-md font-bold text-green-600 mb-3">Reguler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Diterima</label>
                          <input type="number" value={formData.aktif_reg_diterima} onChange={(e) => setFormData({...formData, aktif_reg_diterima: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-green-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Afirmasi</label>
                          <input type="number" value={formData.aktif_reg_afirmasi} onChange={(e) => setFormData({...formData, aktif_reg_afirmasi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-green-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.aktif_reg_khusus} onChange={(e) => setFormData({...formData, aktif_reg_khusus: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-green-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-green-600 mb-3">RPL</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Diterima</label>
                          <input type="number" value={formData.aktif_rpl_diterima} onChange={(e) => setFormData({...formData, aktif_rpl_diterima: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-green-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Afirmasi</label>
                          <input type="number" value={formData.aktif_rpl_afirmasi} onChange={(e) => setFormData({...formData, aktif_rpl_afirmasi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-green-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.aktif_rpl_khusus} onChange={(e) => setFormData({...formData, aktif_rpl_khusus: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-green-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition font-medium">
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
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
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
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <th rowSpan="3" className="px-8 py-5 border-r border-gray-100">TS</th>
                    <th rowSpan="3" className="px-8 py-5 border-r border-gray-100">Daya Tampung</th>
                    <th colSpan="3" className="px-8 py-5 border-r border-gray-100">Jumlah Calon Mahasiswa</th>
                    <th colSpan="6" className="px-8 py-5 border-r border-gray-100 font-bold bg-blue-50/50 text-blue-600">Jumlah Mahasiswa Baru</th>
                    <th colSpan="6" className="px-8 py-5 border-r border-gray-100 font-bold bg-green-50/50 text-green-600">Jumlah Mahasiswa Aktif</th>
                    <th rowSpan="3" className="px-8 py-5">Aksi</th>
                  </tr>
                  <tr className="text-[10px] font-bold text-gray-500">
                    <th rowSpan="2" className="px-6 py-3 border-r border-gray-100">Pendaftar</th>
                    <th rowSpan="2" className="px-6 py-3 border-r border-gray-100">Afirmasi</th>
                    <th rowSpan="2" className="px-6 py-3 border-r border-gray-100">Kebutuhan Khusus</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-gray-100 bg-blue-50/30">Reguler</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-gray-100 bg-blue-50/30">RPL</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-gray-100 bg-green-50/30">Reguler</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-gray-100 bg-green-50/30">RPL</th>
                  </tr>
                  <tr className="text-[9px] text-gray-600">
                    <th className="px-4 py-2 border-r border-gray-100">Diterima</th>
                    <th className="px-4 py-2 border-r border-gray-100">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-gray-100">Kebutuhan Khusus</th>
                    <th className="px-4 py-2 border-r border-gray-100 bg-blue-50/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-gray-100 bg-blue-50/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-gray-100 bg-blue-50/20">Kebutuhan Khusus</th>
                    <th className="px-4 py-2 border-r border-gray-100 bg-green-50/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-gray-100 bg-green-50/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-gray-100 bg-green-50/20">Kebutuhan Khusus</th>
                    <th className="px-4 py-2 border-r border-gray-100 bg-green-50/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-gray-100 bg-green-50/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-gray-100 bg-green-50/20">Kebutuhan Khusus</th>
                  </tr>
                  <tr className="bg-gray-100 font-black text-[7px] text-gray-400 italic">
                    <td className="px-8 py-2 border-r border-gray-100">(1)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(2)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(3)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(4)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(5)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(6)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(7)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(8)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(9)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(10)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(11)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(12)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(13)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(14)</td>
                    <td className="px-8 py-2 border-r border-gray-100">(15)</td>
                    <td className="px-8 py-2">-</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.map((item) => (
                    <tr key={item.id_2a1} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-4 border-r border-gray-100 text-center font-black text-gray-900">{item.tahun || "???"}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center font-black text-blue-600">{item.daya_tampung || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-blue-50/20">{item.pendaftar || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-blue-50/20">{item.pendaftar_afirmasi || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-blue-50/20">{item.pendaftar_khusus || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-blue-50/10">{item.maba_reg_diterima || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-blue-50/10">{item.maba_reg_afirmasi || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-blue-50/10">{item.maba_reg_khusus || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-blue-50/10">{item.maba_rpl_diterima || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-blue-50/10">{item.maba_rpl_afirmasi || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-blue-50/10">{item.maba_rpl_khusus || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-green-50/20">{item.aktif_reg_diterima || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-green-50/20">{item.aktif_reg_afirmasi || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-green-50/20">{item.aktif_reg_khusus || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-green-50/20">{item.aktif_rpl_diterima || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-green-50/20">{item.aktif_rpl_afirmasi || 0}</td>
                      <td className="px-8 py-4 border-r border-gray-100 text-center bg-green-50/20">{item.aktif_rpl_khusus || 0}</td>
                      <td className="px-8 py-4">
                        <div className="inline-flex items-center bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-200 group-hover:shadow-md">
                          <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                          <div className="w-px h-4 bg-gray-200 mx-2"></div>
                          <button onClick={() => handleDelete(item.id_2a1)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
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
