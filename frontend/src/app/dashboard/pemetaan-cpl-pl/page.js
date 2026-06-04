'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Target, Map, Calendar, Award, Trash } from 'lucide-react';

export default function PemetaanCplPlPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingCpl, setEditingCpl] = useState(null);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [isTrashView, setIsTrashView] = useState(false);

  const [prodiList, setProdiList] = useState([]);
  const [cplList, setCplList] = useState([]);
  const [profilLulusanList, setProfilLulusanList] = useState([]);
  const [tahunList, setTahunList] = useState([]);

  const [formData, setFormData] = useState({
    id_cpl: '',
    id_pl: '',
    id_tahun: '',
  });
  const [selectedPls, setSelectedPls] = useState([]);

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
    if (filterProdi && filterTahun) {
      fetchData();
      fetchCplList();
      fetchProfilLulusanList();
    }
  }, [filterProdi, filterTahun, isTrashView]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl?id_prodi=${filterProdi}&id_tahun=${filterTahun}&is_trash=${isTrashView}`, {
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
        const sortedTahun = result.data.sort((a, b) => a.tahun - b.tahun);
        setTahunList(sortedTahun);
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

  const fetchProfilLulusanList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/profil-lulusan?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setProfilLulusanList(result.data || []);
    } catch (err) {
      console.error('Error fetching profil lulusan:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!editingCpl) {
      alert('Kolom CPL wajib diisi');
      return;
    }

    if (!filterTahun) {
      alert('Kolom Tahun Akademik wajib diisi');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const originalMappedPls = data.filter(d => d.id_cpl === editingCpl.id_cpl);
      const originalPlIds = originalMappedPls.map(d => d.id_pl);

      const toAdd = selectedPls.filter(id => !originalPlIds.includes(id));
      const toDelete = originalMappedPls.filter(d => !selectedPls.includes(d.id_pl));

      // Save added PLs
      for (const plId of toAdd) {
        const res = await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            id_cpl: editingCpl.id_cpl,
            id_pl: plId,
            id_tahun: parseInt(filterTahun)
          }),
        });

        const result = await res.json();
        if (!result.success) {
          alert(result.message || 'Gagal menyimpan data');
          return;
        }
      }

      // Delete removed PLs
      for (const item of toDelete) {
        await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl/${item.id_2b2}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      alert('Data berhasil disimpan');
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
      id_pl: item.id_pl || '',
      id_tahun: item.id_tahun || '',
    });
    setEditingId(item.id_2b2);
    setShowForm(true);
  };

  const handleEditCpl = (cpl) => {
    setEditingCpl(cpl);
    const existingPls = data
      .filter(item => item.id_cpl === cpl.id_cpl)
      .map(item => item.id_pl);
    setSelectedPls(existingPls);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl/${id}`, {
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

  const handleHardDeleteGroup = async (cpl) => {
    if (!confirm('Apakah Anda yakin ingin menghapus permanen semua pemetaan untuk CPL ini? Data tidak dapat dikembalikan!')) return;

    const itemsToDelete = data.filter(item => item.id_cpl === cpl.id_cpl);
    const token = localStorage.getItem('token');

    try {
      for (const item of itemsToDelete) {
        await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl/${item.id_2b2}?hard=true`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      alert('Data berhasil dihapus permanen');
      fetchData();
    } catch (err) {
      console.error('Error hard deleting data:', err);
      alert('Gagal menghapus data secara permanen');
    }
  };

  const resetForm = () => {
    setFormData({
      id_cpl: '',
      id_pl: '',
      id_tahun: '',
    });
    setEditingCpl(null);
    setSelectedPls([]);
    setEditingId(null);
    setShowForm(false);
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
              <h1 className="text-3xl font-black text-white tracking-tight">Pemetaan CPL dan PL (2.B.2)</h1>
              <p className="text-gray-400 mt-1 font-medium">Pengelolaan hubungan CPL dengan Profil Lulusan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => window.open(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl/export?id_prodi=${filterProdi}&token=${localStorage.getItem('token')}`, '_blank')} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/20 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-3 items-end mb-8">
          <div className="flex-1 lg:w-48">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun Akademik</label>
            <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer">
              <option value="">Pilih Tahun</option>
              {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
            </select>
          </div>
          <div className="flex-1 lg:w-48">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Program Studi</label>
            <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer">
              <option value="">Pilih Prodi</option>
              {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
            </select>
          </div>
          <button onClick={fetchData} className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-950/50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setIsTrashView(!isTrashView)} className={`p-2.5 border rounded-xl transition shadow-sm flex items-center gap-2 ${isTrashView ? 'bg-red-950/40 border-red-800 text-red-600 hover:bg-red-900/30' : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-red-600 hover:bg-gray-950/50'}`} title={isTrashView ? "Tampilkan Data Aktif" : "Lihat Data Sampah"}>
            <Trash size={20} />
            <span className="font-bold text-sm hidden sm:inline">{isTrashView ? "Data Aktif" : "Lihat Sampah"}</span>
          </button>
        </div>

        {/* Form Section */}
        {editingCpl && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">
              {editingId ? 'Edit Pemetaan CPL dan PL' : 'Input Pemetaan CPL dan PL Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">CPL</label>
                  <div className="border border-gray-700 rounded-xl bg-gray-900 max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-300">Kode</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-300">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {editingCpl ? (
                          <tr
                            key={editingCpl.id_cpl}
                            className="bg-blue-900/30"
                          >
                            <td className="px-4 py-2 font-mono text-xs font-bold text-gray-200">{editingCpl.kode_cpl}</td>
                            <td className="px-4 py-2 text-gray-400">{editingCpl.deskripsi_cpl}</td>
                          </tr>
                        ) : (
                          cplList.map(cpl => (
                            <tr
                              key={cpl.id_cpl}
                              className={`hover:bg-blue-900/20 cursor-pointer ${editingCpl?.id_cpl === cpl.id_cpl ? 'bg-blue-900/30' : ''}`}
                              onClick={() => {
                                setEditingCpl(cpl);
                                setSelectedPls([]); // Reset selected PLs when CPL changes
                              }}
                            >
                              <td className="px-4 py-2 font-mono text-xs font-bold text-gray-200">{cpl.kode_cpl}</td>
                              <td className="px-4 py-2 text-gray-400">{cpl.deskripsi_cpl}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Profil Lulusan</label>
                  <div className="border border-gray-700 rounded-xl bg-gray-900 max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-300">Kode</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-300">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {profilLulusanList.map(pl => {
                          const isMapped = selectedPls.includes(pl.id_pl);
                          return (
                            <tr key={pl.id_pl} className="hover:bg-blue-900/20 cursor-pointer">
                              <td className="px-4 py-2 font-mono text-xs font-bold text-gray-200">{pl.kode_pl}</td>
                              <td className="px-4 py-2 text-gray-400">
                                <div className="flex items-center justify-between">
                                  <span>{pl.deskripsi_pl}</span>
                                  <input
                                    type="checkbox"
                                    checked={isMapped}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedPls(prev => [...prev, pl.id_pl]);
                                      } else {
                                        setSelectedPls(prev => prev.filter(id => id !== pl.id_pl));
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Tahun Akademik</label>
                    <input
                      type="text"
                      value={filterTahun ? tahunList.find(t => t.id_tahun === parseInt(filterTahun))?.tahun : ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-800 border-transparent border-2 border-gray-600 rounded-2xl outline-none transition font-medium text-gray-400"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20">{editingId ? 'Update Data' : 'Simpan Data'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section - Matrix View */}
        <div className="bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-950/30 border border-gray-700 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : cplList.length === 0 || profilLulusanList.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Data CPL atau Profil Lulusan belum tersedia</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 border-b-2 border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 bg-gray-800 align-middle sticky left-0 z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#1f2937]">
                      CPL
                    </th>
                    <th className="px-4 py-3 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center min-w-[200px]">
                      PL
                    </th>
                    <th className="px-4 py-3 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center min-w-[80px]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {cplList.map((cpl) => {
                    const mappedPls = profilLulusanList.filter(pl =>
                      data.some(item => item.id_cpl === cpl.id_cpl && item.id_pl === pl.id_pl)
                    );

                    if (mappedPls.length === 0) {
                      if (isTrashView) return null; // Sembunyikan CPL kosong di tampilan sampah
                      // CPL dengan PL kosong
                      return (
                        <tr key={cpl.id_cpl} className="hover:bg-blue-900/30 transition-colors">
                          <td className="px-4 py-3 border-r border-gray-700 bg-gray-950/50 align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#1f2937]">
                            <div className="font-black text-white text-sm">{cpl.kode_cpl || '-'}</div>
                            <div className="text-[10px] text-gray-400 mt-1 font-medium">{cpl.deskripsi_cpl || '-'}</div>
                          </td>
                          <td className="px-4 py-3 border-r border-gray-700">
                            <div className="font-mono text-xs font-bold text-gray-200">-</div>
                            <div className="text-[10px] text-gray-400 mt-1">-</div>
                          </td>
                          <td className="px-4 py-3 border-r border-gray-700 text-center">
                            <button
                              onClick={() => handleEditCpl(cpl)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition shadow-sm"
                            >
                              <Plus size={14} />
                              Tambah
                            </button>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={cpl.id_cpl} className="hover:bg-blue-900/30 transition-colors">
                        <td className="px-4 py-3 border-r border-gray-700 bg-gray-950/50 align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#1f2937]">
                          <div className="font-black text-white text-sm">{cpl.kode_cpl || '-'}</div>
                          <div className="text-[10px] text-gray-400 mt-1 font-medium">{cpl.deskripsi_cpl || '-'}</div>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-700 align-top">
                          <div className="flex flex-wrap gap-3">
                            {mappedPls.map(pl => (
                              <div key={pl.id_pl} className="bg-gradient-to-br from-indigo-950/50 to-blue-900/20 border border-indigo-900/60 rounded-xl p-3 max-w-[280px] shadow-sm">
                                <div className="font-black text-indigo-300 text-xs mb-1">{pl.kode_pl}</div>
                                <div className="text-[10px] text-indigo-400/80 leading-relaxed font-medium">{pl.deskripsi_pl}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-700 text-center align-top w-[140px] min-w-[140px] max-w-[140px] bg-gray-900">
                          {isTrashView ? (
                            <button
                              onClick={() => handleHardDeleteGroup(cpl)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-red-950/40 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-red-900/50 shadow-sm"
                            >
                              <Trash2 size={12} />
                              Hapus
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditCpl(cpl)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-blue-900/20 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-blue-900/50 shadow-sm"
                            >
                              <Edit size={12} />
                              Atur PL
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
