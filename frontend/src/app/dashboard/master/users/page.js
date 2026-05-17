'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, UserCheck, Shield, Key, ToggleLeft, ToggleRight } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [unitList, setUnitList] = useState([]);
  const [openUnit, setOpenUnit] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: 'stikom2026',
    id_unit: '',
    status: 'Aktif',
  });

  const [showResetModal, setShowResetModal] = useState(false);
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
      fetchUnitList();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data || []);
      }
    } finally {
      setLoading(false);
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
      ? `http://localhost:5000/api/master/users/${editingId}`
      : 'http://localhost:5000/api/master/users';

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
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_user);
    setFormData({
      username: item.username || '',
      password: '', // Hidden in edit anyway
      id_unit: item.id_unit || '',
      status: item.status || 'Aktif',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus user ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const toggleStatus = async (item) => {
    const token = localStorage.getItem('token');
    const newStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    try {
      const res = await fetch(`http://localhost:5000/api/master/users/${item.id_user}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          username: item.username,
          id_unit: item.id_unit,
          status: newStatus 
        }),
      });
      const result = await res.json();
      if (result.success) {
        fetchData();
      }
    } catch (err) {
      alert('Gagal mengubah status');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: 'stikom2026',
      id_unit: '',
      status: 'Aktif',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, answer: '' });
    setShowResetModal(true);
  };

  const handleResetPassword = async () => {
    if (parseInt(captcha.answer) !== (captcha.a + captcha.b)) {
      alert('Jawaban Captcha Salah!');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/users/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, password: 'stikom2026' }),
      });
      const result = await res.json();
      alert(result.message);
      setShowResetModal(false);
    } catch (err) {
      alert('Gagal mereset password');
    }
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
              <h1 className="text-3xl font-black text-white tracking-tight">Master Users</h1>
              <p className="text-gray-400 mt-1 font-medium">Kelola hak akses dan akun pengguna sistem</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah User'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-blue-900/20 text-blue-600 rounded-xl"><UserCheck size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-black text-white">{data.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-4">
            <div className="p-3 bg-emerald-900/20 text-emerald-600 rounded-xl"><Shield size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit Terdaftar</p>
              <p className="text-2xl font-black text-white">{new Set(data.map(u => u.id_unit)).size}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900 rounded-3xl shadow-xl shadow-gray-950/50 border border-gray-700 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6">{editingId ? 'Edit Data User' : 'Input Data User Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Username</label>
                  <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium" placeholder="Ex: admin_prodi" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Unit Terkait</label>
                  <div className="relative">
                    <div 
                      onClick={() => setOpenUnit(!openUnit)}
                      className="w-full px-4 py-3 bg-gray-950/50 border-transparent border-2 focus:border-blue-500 focus:bg-gray-900 rounded-2xl outline-none transition font-medium text-white cursor-pointer flex justify-between items-center"
                    >
                      <span>{formData.id_unit ? unitList.find(u => u.id_unit == formData.id_unit)?.nama_unit : '-- Pilih Unit --'}</span>
                      <Plus size={16} className={`transition-transform duration-300 ${openUnit ? 'rotate-0' : 'rotate-45'}`} />
                    </div>
                    {openUnit && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        {unitList.map(unit => (
                          <div 
                            key={unit.id_unit}
                            onClick={() => {
                              setFormData({...formData, id_unit: unit.id_unit});
                              setOpenUnit(false);
                            }}
                            className="px-4 py-3 hover:bg-blue-600 hover:text-white transition cursor-pointer font-bold text-sm border-b border-gray-800 last:border-0"
                          >
                            {unit.nama_unit}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                  {!editingId ? (
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={formData.password} 
                        readOnly 
                        className="w-full px-4 py-3 bg-gray-800/50 border-gray-700 border-2 rounded-2xl outline-none font-bold text-blue-500 cursor-not-allowed select-none" 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-900 px-2 py-1 rounded-md border border-gray-800">Default</div>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={generateCaptcha}
                      className="w-full py-3 bg-red-900/20 border-2 border-red-900/50 hover:bg-red-900/40 text-red-500 rounded-2xl transition font-black flex items-center justify-center gap-2 group"
                    >
                      <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                      RESET PASSWORD KE DEFAULT
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl hover:bg-gray-700 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20">{editingId ? 'Update Akun' : 'Buat Akun Baru'}</button>
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
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data user</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center w-20">No</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Username</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700">Unit</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] border-r border-gray-700 text-center">Status</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {data.map((item, index) => (
                    <tr key={item.id_user} className="hover:bg-blue-900/30 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-700 text-center font-bold text-gray-400">{index + 1}</td>
                      <td className="px-8 py-6 border-r border-gray-700">
                        <div className="text-sm font-black text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.username}</div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-bold text-gray-300 uppercase tracking-tight">{item.nama_unit || '-'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 border-r border-gray-700 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Aktif' ? 'bg-emerald-900/30 text-emerald-500 border border-emerald-900/50' : 'bg-red-900/30 text-red-500 border border-red-900/50'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <div className="inline-flex items-center bg-gray-900 border border-gray-700 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-800 group-hover:shadow-md">
                            <button 
                              onClick={() => toggleStatus(item)} 
                              className={`p-1.5 transition rounded-lg ${item.status === 'Aktif' ? 'text-emerald-500 hover:bg-emerald-900/20' : 'text-gray-500 hover:bg-gray-800'}`}
                              title={item.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                            >
                              {item.status === 'Aktif' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            </button>
                            <div className="w-px h-4 bg-gray-700 mx-2"></div>
                            <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-900/20 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                            <div className="w-px h-4 bg-gray-700 mx-2"></div>
                            <button onClick={() => handleDelete(item.id_user)} className="p-1.5 text-red-600 hover:bg-red-950/40 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
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

        {/* Reset Password Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-950/30 text-red-600 rounded-full flex items-center justify-center mb-6 border border-red-900/50">
                  <Key size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Konfirmasi Reset</h3>
                <p className="text-gray-400 font-medium mb-8">Password akan dikembalikan ke default: <span className="text-blue-500 font-bold">stikom2026</span></p>
                
                <div className="w-full bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-6">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Verifikasi Keamanan (Captcha)</label>
                  <div className="flex items-center justify-center gap-4 text-2xl font-black text-white mb-4">
                    <span className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-700">{captcha.a}</span>
                    <span className="text-blue-500">+</span>
                    <span className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-700">{captcha.b}</span>
                    <span className="text-blue-500">=</span>
                  </div>
                  <input 
                    type="number" 
                    value={captcha.answer}
                    onChange={(e) => setCaptcha({...captcha, answer: e.target.value})}
                    placeholder="Hasil?"
                    className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 focus:border-blue-500 rounded-xl outline-none text-center font-black text-white transition"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button 
                    onClick={() => setShowResetModal(false)}
                    className="px-6 py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition font-bold"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleResetPassword}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-900/20"
                  >
                    Reset Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
