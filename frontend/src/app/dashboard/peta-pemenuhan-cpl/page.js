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
  const [filterTahun, setFilterTahun] = useState('');
  
  const [prodiList, setProdiList] = useState([]);
  const [cplList, setCplList] = useState([]);
  const [cpmkList, setCpmkList] = useState([]);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_cpl: '',
    id_cpmk: '',
    id_tahun: '',
  });
  const [cpmkMkMapping, setCpmkMkMapping] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

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
    if (tahunList.length > 0 && (!filterTahun || filterTahun === '')) {
      // Default to latest year (which is the last element since it's sorted ascending)
      setFilterTahun(tahunList[tahunList.length - 1].id_tahun.toString());
    }
  }, [tahunList, filterTahun]);

  useEffect(() => {
    if (filterProdi && filterTahun) {
      fetchData();
      fetchCplList();
      fetchCpmkList();
      fetchMataKuliahList();
    }
  }, [filterProdi, filterTahun]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b3-peta-pemenuhan?id_prodi=${filterProdi}&id_tahun=${filterTahun}`, {
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
      if (result.success) {
        const sorted = [...result.data].sort((a, b) => a.tahun.toString().localeCompare(b.tahun.toString()));
        setTahunList(sorted);
      }
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
    if (!formData.id_cpl || !formData.id_tahun) {
      alert("Lengkapi semua form wajib");
      return;
    }

    const cpmksToProcess = isEditMode 
        ? [formData.id_cpmk] 
        : Object.keys(cpmkMkMapping).filter(cpmkId => cpmkMkMapping[cpmkId] && cpmkMkMapping[cpmkId].length > 0);

    if (cpmksToProcess.length === 0 && !isEditMode) {
      alert("Pilih minimal 1 Mata Kuliah untuk setidaknya 1 CPMK");
      return;
    }

    const token = localStorage.getItem('token');
    let hasChanges = false;

    try {
      for (const cpmkIdStr of cpmksToProcess) {
        const id_cpmk = parseInt(cpmkIdStr);
        const selectedMksForCpmk = cpmkMkMapping[id_cpmk] || [];

        // Find all currently mapped MKs for this CPL and CPMK
        const originalMappedMks = data.filter(d => 
            parseInt(d.id_cpl) === parseInt(formData.id_cpl) && 
            parseInt(d.id_cpmk) === id_cpmk &&
            (formData.id_tahun ? parseInt(d.id_tahun) === parseInt(formData.id_tahun) : true)
        );
        const originalMkIds = originalMappedMks.map(d => parseInt(d.id_mk));
        
        const toAdd = selectedMksForCpmk.filter(id => !originalMkIds.includes(parseInt(id)));
        const toDelete = originalMappedMks.filter(d => !selectedMksForCpmk.includes(parseInt(d.id_mk)));
        
        if (toAdd.length > 0 || toDelete.length > 0) hasChanges = true;

        // Add new mappings
        for (const mkId of toAdd) {
          await fetch(`http://localhost:5000/api/prodi/2b3-peta-pemenuhan`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              id_cpl: formData.id_cpl,
              id_cpmk: id_cpmk,
              id_mk: mkId,
              id_tahun: formData.id_tahun
            }),
          });
        }
        
        // Delete removed mappings
        for (const item of toDelete) {
          await fetch(`http://localhost:5000/api/prodi/2b3-peta-pemenuhan/${item.id_2b3}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      }
      
      if (!hasChanges) {
        alert('Tidak ada perubahan data');
        resetForm();
        return;
      }
      
      alert('Data pemetaan berhasil disimpan');
      fetchData();
      resetForm();
    } catch (err) {
      console.error('Error saving data:', err);
      alert('Gagal menyimpan pemetaan');
    }
  };

  const handleAddMapping = (cpl = null) => {
    setFormData({
      id_cpl: cpl ? cpl.id_cpl : '',
      id_cpmk: '',
      id_tahun: filterTahun,
    });
    setCpmkMkMapping({});
    setIsEditMode(false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleEditGroup = (cpl, cpmkGroup) => {
    setFormData({
      id_cpl: cpl.id_cpl,
      id_cpmk: cpmkGroup.id_cpmk,
      id_tahun: filterTahun,
    });
    
    const existingMappings = data.filter(d => d.id_cpl === cpl.id_cpl && d.id_cpmk === cpmkGroup.id_cpmk && d.id_tahun === parseInt(filterTahun));
    const existingMks = existingMappings.map(d => parseInt(d.id_mk));
      
    setCpmkMkMapping({
      [cpmkGroup.id_cpmk]: existingMks
    });
    setIsEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleMkToggle = (id_cpmk, id_mk) => {
    setCpmkMkMapping(prev => {
      const currentMks = prev[id_cpmk] || [];
      const newMks = currentMks.includes(parseInt(id_mk))
        ? currentMks.filter(id => id !== parseInt(id_mk))
        : [...currentMks, parseInt(id_mk)];
      return { ...prev, [id_cpmk]: newMks };
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b3-peta-pemenuhan/${id}`, {
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
      id_tahun: '',
    });
    setCpmkMkMapping({});
    setIsEditMode(false);
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
              {showForm && (
                <button onClick={() => setShowForm(false)} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition font-bold text-sm">
                  <span>Tutup Form</span>
                </button>
              )}

              <button onClick={() => window.open(`http://localhost:5000/api/prodi/2b3-peta-pemenuhan/export?id_prodi=${filterProdi}&token=${localStorage.getItem('token')}`, '_blank')} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
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
          <div className="flex-1 lg:w-48">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun Akademik</label>
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
            <h2 className="text-xl font-black text-gray-900 mb-6">{isEditMode ? 'Atur Pemetaan Mata Kuliah' : 'Input Peta Pemenuhan CPL Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`grid grid-cols-1 ${isEditMode ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">CPL</label>
                  <select disabled={isEditMode} value={formData.id_cpl} onChange={(e) => setFormData({...formData, id_cpl: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium disabled:opacity-60" required>
                    <option value="">Pilih CPL</option>
                    {cplList.map(cpl => (
                      <option key={cpl.id_cpl} value={cpl.id_cpl}>
                        {cpl.kode_cpl} {cpl.deskripsi_cpl ? `- ${cpl.deskripsi_cpl.substring(0, 60)}${cpl.deskripsi_cpl.length > 60 ? '...' : ''}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {isEditMode && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">CPMK</label>
                    <select disabled={true} value={formData.id_cpmk} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium disabled:opacity-60 cursor-not-allowed" required>
                      <option value="">Pilih CPMK</option>
                      {cpmkList.map(cpmk => <option key={cpmk.id_cpmk} value={cpmk.id_cpmk}>{cpmk.kode_cpmk}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tahun Akademik</label>
                  <select disabled={true} value={formData.id_tahun} onChange={(e) => setFormData({...formData, id_tahun: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium disabled:opacity-60 cursor-not-allowed" required>
                    <option value="">Pilih Tahun</option>
                    {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                  </select>
                </div>
              </div>

              {formData.id_cpl && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100/60 rounded-2xl p-5 flex gap-4 items-start shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm border border-blue-100/50 text-blue-600 shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-blue-900 uppercase tracking-widest mb-1.5">
                      Deskripsi {cplList.find(c => c.id_cpl.toString() === formData.id_cpl.toString())?.kode_cpl}
                    </div>
                    <div className="text-sm text-blue-900/80 leading-relaxed font-medium">
                      {cplList.find(c => c.id_cpl.toString() === formData.id_cpl.toString())?.deskripsi_cpl}
                    </div>
                  </div>
                </div>
              )}

              {formData.id_cpl && (
                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    {isEditMode ? 'Atur Mata Kuliah untuk CPMK ini' : 'Pemetaan CPMK ke Mata Kuliah'}
                  </label>
                  
                  {isEditMode ? (
                    // Edit Mode: show only the selected CPMK
                    cpmkList.filter(c => c.id_cpmk.toString() === formData.id_cpmk.toString()).map(cpmk => (
                      <div key={cpmk.id_cpmk} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-4">
                        <div className="text-sm font-black text-gray-800 mb-3 border-b border-gray-200 pb-2">
                          {cpmk.kode_cpmk} <span className="text-gray-500 font-medium ml-2">{cpmk.deskripsi_cpmk}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-2">
                          {mataKuliahList.map(mk => {
                            const isSelected = (cpmkMkMapping[cpmk.id_cpmk] || []).includes(parseInt(mk.id_mk));
                            return (
                              <label key={mk.id_mk} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-blue-50/80 border-blue-300 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'}`}>
                                <div className="mt-0.5">
                                  <input type="checkbox" checked={isSelected} onChange={() => handleMkToggle(cpmk.id_cpmk, mk.id_mk)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer" />
                                </div>
                                <div>
                                  <div className={`text-xs font-black tracking-tight ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>{mk.kode_mk}</div>
                                  <div className="text-[10px] text-gray-500 mt-1 font-medium leading-tight">{mk.nama_mk}</div>
                                  <div className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-black uppercase">Semester {mk.semester}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Input Baru: show all CPMKs
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {cpmkList.map(cpmk => (
                        <div key={cpmk.id_cpmk} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                          <div className="text-sm font-black text-gray-800 mb-3 border-b border-gray-200 pb-2">
                            {cpmk.kode_cpmk} <span className="text-gray-500 font-medium ml-2">{cpmk.deskripsi_cpmk}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2">
                            {mataKuliahList.map(mk => {
                              const isSelected = (cpmkMkMapping[cpmk.id_cpmk] || []).includes(parseInt(mk.id_mk));
                              return (
                                <label key={mk.id_mk} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-blue-50/80 border-blue-300 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'}`}>
                                  <div className="mt-0.5">
                                    <input type="checkbox" checked={isSelected} onChange={() => handleMkToggle(cpmk.id_cpmk, mk.id_mk)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer" />
                                  </div>
                                  <div>
                                    <div className={`text-xs font-black tracking-tight ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>{mk.kode_mk}</div>
                                    <div className="text-[10px] text-gray-500 mt-1 font-medium leading-tight">{mk.nama_mk}</div>
                                    <div className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-black uppercase">Semester {mk.semester}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-200">{isEditMode ? 'Update Pemetaan' : 'Simpan Pemetaan'}</button>
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
          ) : cplList.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data CPL. Silakan atur filter atau tambah data master.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {(() => {
                const uniqueSemesters = [...new Set(mataKuliahList.map(mk => parseInt(mk.semester) || 0))]
                  .filter(sem => sem > 0)
                  .sort((a, b) => a - b);
                
                const displaySemesters = uniqueSemesters.length > 0 ? uniqueSemesters : [1, 2, 3, 4, 5, 6, 7, 8];

                return (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-[11px] font-black text-gray-700 uppercase tracking-widest border-r border-gray-200 bg-gray-100 align-middle sticky left-0 z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e5e7eb]">CPL</th>
                        <th className="px-4 py-3 text-[11px] font-black text-gray-700 uppercase tracking-widest border-r border-gray-200 bg-white align-middle sticky left-[260px] z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e5e7eb]">CPMK</th>
                        {displaySemesters.map(sem => (
                          <th key={sem} className="px-4 py-3 text-[11px] font-black text-gray-700 uppercase tracking-widest border-r border-gray-200 text-center bg-gray-50/50 align-middle w-[160px] min-w-[160px] max-w-[160px]">
                            Semester {sem}
                          </th>
                        ))}
                      </tr>
                    </thead>
                <tbody className="divide-y divide-gray-100">
                  {cplList.map(cpl => {
                    const mappingsForCpl = data.filter(item => item.id_cpl === cpl.id_cpl);
                    
                    // Group by CPMK
                    const cpmkMap = new Map();
                    mappingsForCpl.forEach(m => {
                      if (!cpmkMap.has(m.id_cpmk)) {
                        cpmkMap.set(m.id_cpmk, {
                          cpmkKode: m.kode_cpmk || '-',
                          cpmkDesc: m.deskripsi_cpmk || '-',
                          id_cpmk: m.id_cpmk,
                          mks: []
                        });
                      }
                      cpmkMap.get(m.id_cpmk).mks.push(m);
                    });
                    
                    const cpmkArray = Array.from(cpmkMap.values());
                    
                    if (cpmkArray.length === 0) {
                      return (
                        <tr key={cpl.id_cpl} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-3 border-r border-gray-200 bg-gray-50 align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e5e7eb]">
                            <div className="font-black text-gray-900 text-sm">{cpl.kode_cpl || '-'}</div>
                            <div className="text-[10px] text-gray-600 mt-1 font-medium">{cpl.deskripsi_cpl || '-'}</div>
                          </td>
                          <td className="px-4 py-3 border-r border-gray-200 align-middle text-center bg-white group sticky left-[260px] z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e5e7eb]">
                            <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleAddMapping(cpl)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 shadow-sm">
                                <Plus size={14} />
                                Tambah Pemetaan
                              </button>
                            </div>
                          </td>
                          {displaySemesters.map(sem => (
                            <td key={sem} className="px-4 py-3 border-r border-gray-200 text-center w-[160px] min-w-[160px] max-w-[160px]"></td>
                          ))}
                        </tr>
                      );
                    }
                    
                    return cpmkArray.map((cpmkGroup, index) => (
                      <tr key={`${cpl.id_cpl}-${cpmkGroup.id_cpmk}`} className="hover:bg-blue-50/30 transition-colors">
                        {index === 0 && (
                          <td rowSpan={cpmkArray.length} className="px-4 py-3 border-r border-gray-200 bg-gray-50 align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e5e7eb]">
                            <div className="font-black text-gray-900 text-sm">{cpl.kode_cpl || '-'}</div>
                            <div className="text-[10px] text-gray-600 mt-1 font-medium">{cpl.deskripsi_cpl || '-'}</div>
                          </td>
                        )}
                        <td className="px-4 py-3 border-r border-gray-200 align-top bg-white group sticky left-[260px] z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e5e7eb]">
                          <div className="font-bold text-gray-800 text-sm">{cpmkGroup.cpmkKode}</div>
                          <div className="text-[10px] text-gray-500 mt-1 mb-6">{cpmkGroup.cpmkDesc}</div>
                          
                          <div className="mt-3">
                            <button onClick={() => handleEditGroup(cpl, cpmkGroup)} className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100">
                              <Edit size={12} />
                              Atur MK
                            </button>
                          </div>
                        </td>
                        {displaySemesters.map(sem => {
                          const mksInSem = cpmkGroup.mks.filter(m => parseInt(m.semester) === sem);
                          return (
                            <td key={sem} className="px-4 py-3 border-r border-gray-200 align-top w-[160px] min-w-[160px] max-w-[160px]">
                              {mksInSem.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                  {mksInSem.map(mk => (
                                    <div key={mk.id_2b3} className="bg-blue-50/80 border border-blue-200 rounded-lg p-2.5 transition-colors hover:bg-blue-100/80">
                                      <div className="text-xs font-black text-blue-900">{mk.kode_mk || '-'}</div>
                                      <div className="text-[10px] text-blue-700 leading-tight mt-0.5">{mk.nama_mk || '-'}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
              );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
