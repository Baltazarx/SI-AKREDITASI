'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Download, RefreshCw, AlertTriangle, CheckCircle2, Save } from 'lucide-react';

const KEMAMPUAN_ITEMS = [
  "Kerjasama Tim",
  "Keahlian di Bidang Prodi",
  "Kemampuan Berbahasa Asing (Inggris)",
  "Kemampuan Berkomunikasi",
  "Pengembangan Diri",
  "Kepemimpinan",
  "Etos Kerja"
];

export default function AccuracyPage() {
  const router = useRouter();

  // UI States
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('main'); // 'main' or 'trash'

  // Filter States
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);

  // Data States
  const [trashData, setTrashData] = useState([]);

  const [penilaian, setPenilaian] = useState(
    KEMAMPUAN_ITEMS.map(item => ({
      jenis_kemampuan: item,
      id_2b6: null,
      sangat_baik: '', baik: '', cukup: '', kurang: '',
      rencana_tindak_lanjut: ''
    }))
  );

  const [metadata, setMetadata] = useState({
    jml_alumni_3_tahun: 0,
    jml_mhs_aktif_ts: 0,
    jml_responden: ''
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
    if (prodiList.length > 0 && !filterProdi) {
      const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika')) || prodiList[0];
      if (tiProdi) setFilterProdi(tiProdi.id_prodi.toString());
    }
  }, [prodiList, filterProdi]);

  useEffect(() => {
    if (tahunList.length > 0 && !filterTahun) {
      const currentYear = new Date().getFullYear();
      let targetTahun = tahunList.find(t => parseInt(t.tahun) === currentYear);
      if (!targetTahun) targetTahun = tahunList[tahunList.length - 1];
      if (targetTahun) setFilterTahun(targetTahun.id_tahun.toString());
    }
  }, [tahunList, filterTahun]);

  useEffect(() => {
    if (filterProdi && filterTahun) {
      if (viewMode === 'main') fetchData();
      else fetchTrashData();
    }
  }, [filterProdi, filterTahun, viewMode]);

  const API_BASE = 'http://localhost:5000/api/kemahasiswaan/2b6-kepuasan';

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}?id_prodi=${filterProdi}&id_tahun=${filterTahun}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();

      if (result.success) {
        setMetadata({
          jml_alumni_3_tahun: result.metadata.jml_alumni_3_tahun || 0,
          jml_mhs_aktif_ts: result.metadata.jml_mhs_aktif_ts || 0,
          jml_responden: result.metadata.jml_responden || ''
        });

        // Map data to the fixed 7 items
        const newData = KEMAMPUAN_ITEMS.map(item => {
          const found = (result.data || []).find(d => d.jenis_kemampuan === item);
          if (found) {
            return {
              jenis_kemampuan: item,
              id_2b6: found.id_2b6,
              sangat_baik: found.sangat_baik,
              baik: found.baik,
              cukup: found.cukup,
              kurang: found.kurang,
              rencana_tindak_lanjut: found.rencana_tindak_lanjut || ''
            };
          }
          return {
            jenis_kemampuan: item, id_2b6: null,
            sangat_baik: '', baik: '', cukup: '', kurang: '', rencana_tindak_lanjut: ''
          };
        });
        setPenilaian(newData);
      }
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
      const res = await fetch(`${API_BASE}/trash?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const r = await res.json();
      if (r.success) setTrashData(r.data || []);
    } catch (err) {
      console.error('Error fetching trash:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setProdiList(result.data);
    } catch (err) { console.error('Error fetching prodi:', err); }
  };

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setTahunList(result.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun)));
    } catch (err) { console.error('Error fetching tahun:', err); }
  };

  const handleInputChange = (index, field, value) => {
    const newPenilaian = [...penilaian];
    newPenilaian[index][field] = value;
    setPenilaian(newPenilaian);
  };

  // Validation Logic
  const checkRowValid = (row) => {
    const sb = parseFloat(row.sangat_baik) || 0;
    const b = parseFloat(row.baik) || 0;
    const c = parseFloat(row.cukup) || 0;
    const k = parseFloat(row.kurang) || 0;
    return (sb + b + c + k) === 100;
  };

  const isAllRowsValid = penilaian.every(checkRowValid);
  const hasResponden = metadata.jml_responden > 0;

  const handleSubmit = async () => {
    if (!isAllRowsValid) return alert("Pastikan total (SB + B + C + K) = 100% pada semua baris penilaian.");
    if (!hasResponden) return alert("Jumlah responden harus diisi!");

    const token = localStorage.getItem('token');

    const payload = {
      penilaian: penilaian.map(p => ({
        id_prodi: filterProdi,
        id_tahun: filterTahun,
        jenis_kemampuan: p.jenis_kemampuan,
        sangat_baik: p.sangat_baik,
        baik: p.baik,
        cukup: p.cukup,
        kurang: p.kurang,
        rencana_tindak_lanjut: p.rencana_tindak_lanjut
      })),
      metadata: {
        id_prodi: filterProdi,
        id_tahun: filterTahun,
        jml_alumni_3_tahun: metadata.jml_alumni_3_tahun,
        jml_mhs_aktif_ts: metadata.jml_mhs_aktif_ts,
        jml_responden: metadata.jml_responden
      }
    };

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) fetchData();
    } catch (err) {
      console.error('Error saving data:', err);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleSoftDelete = async (id) => {
    if (!id) return;
    if (!confirm('Pindahkan data ke keranjang sampah?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchData();
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/restore/${id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
    fetchTrashData();
    fetchData();
  };

  const handleHardDelete = async (id) => {
    if (!confirm('HAPUS PERMANEN? Data tidak bisa dikembalikan.')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/hard/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchTrashData();
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_BASE}/export?id_prodi=${filterProdi}&id_tahun=${filterTahun}&token=${token}`, '_blank');
  };

  // Calculating Averages
  const calcAvg = (field) => {
    const sum = penilaian.reduce((acc, row) => acc + (parseFloat(row[field]) || 0), 0);
    return (sum / penilaian.length).toFixed(2);
  };
  const avgSB = calcAvg('sangat_baik');
  const avgB = calcAvg('baik');
  const avgC = calcAvg('cukup');
  const avgK = calcAvg('kurang');
  const avgTotal = ((parseFloat(avgSB) + parseFloat(avgB) + parseFloat(avgC) + parseFloat(avgK))).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Kepuasan Pengguna (2.B.6)</h1>
              <p className="text-gray-500 mt-1 font-medium">Penilaian kemampuan lulusan dan rencana tindak lanjut</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
                <Download size={18} /><span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Program Studi</label>
            <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm">
              {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun (TS)</label>
            <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm">
              <option value="">Semua Tahun</option>
              {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
            </select>
          </div>
          <button onClick={viewMode === 'main' ? fetchData : fetchTrashData} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-blue-600">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button onClick={() => setViewMode('main')} className={`px-6 py-3 font-bold text-sm uppercase ${viewMode === 'main' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400'}`}>Formulir Penilaian</button>
          <button onClick={() => setViewMode('trash')} className={`px-6 py-3 font-bold text-sm uppercase flex items-center gap-2 ${viewMode === 'trash' ? 'border-b-4 border-red-600 text-red-600' : 'text-gray-400'}`}>
            Trash <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-black">{trashData.length}</span>
          </button>
        </div>

        {/* Main Dashboard */}
        {viewMode === 'main' && (
          <div className="animate-in fade-in duration-500">
            {/* Metadata Panel */}
            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Lulusan (3 Tahun Terakhir)</p>
                    <p className="text-3xl font-black text-gray-900">{metadata.jml_alumni_3_tahun}</p>
                  </div>
                </div>
                <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Mahasiswa Aktif (TS)</p>
                    <p className="text-3xl font-black text-gray-900">{metadata.jml_mhs_aktif_ts}</p>
                  </div>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
                  <label className="block text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Jumlah Responden Lulusan</label>
                  <input type="number" value={metadata.jml_responden} onChange={e => setMetadata({ ...metadata, jml_responden: e.target.value })} className="w-full bg-white px-4 py-2 rounded-xl border border-amber-200 font-bold text-xl outline-none focus:ring-4 ring-amber-100 transition shadow-sm" placeholder="Input..." />
                </div>
              </div>
            </div>

            {/* Validation Notification */}
            {!isAllRowsValid ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-6 flex items-start gap-3">
                <AlertTriangle className="text-red-500 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-red-800">Terdapat Baris Penilaian Yang Belum 100%</p>
                  <p className="text-xs text-red-600 mt-1">Pastikan total Persentase (SB + B + C + K) di setiap jenis kemampuan bernilai pas 100%. Tombol simpan dinonaktifkan hingga syarat terpenuhi.</p>
                </div>
              </div>
            ) : !hasResponden ? (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6 flex items-start gap-3">
                <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
                <p className="text-sm font-bold text-amber-800">Jumlah responden belum diisi di atas.</p>
              </div>
            ) : (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl mb-6 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 mt-0.5" size={20} />
                <p className="text-sm font-bold text-emerald-800">Semua baris valid 100%. Data siap disimpan.</p>
              </div>
            )}

            {/* Main Form Table */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="overflow-x-auto p-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 text-[11px] font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-100">Jenis Kemampuan</th>
                      <th className="p-4 text-[11px] font-black text-center text-blue-600 bg-blue-50/50 uppercase tracking-widest border-b-2 border-blue-100 rounded-tl-xl w-24">SB (%)</th>
                      <th className="p-4 text-[11px] font-black text-center text-emerald-600 bg-emerald-50/50 uppercase tracking-widest border-b-2 border-emerald-100 w-24">B (%)</th>
                      <th className="p-4 text-[11px] font-black text-center text-amber-600 bg-amber-50/50 uppercase tracking-widest border-b-2 border-amber-100 w-24">C (%)</th>
                      <th className="p-4 text-[11px] font-black text-center text-red-600 bg-red-50/50 uppercase tracking-widest border-b-2 border-red-100 rounded-tr-xl w-24">K (%)</th>
                      <th className="p-4 text-[11px] font-black text-center text-gray-500 uppercase tracking-widest border-b-2 border-gray-100 w-28">Status</th>
                      <th className="p-4 text-[11px] font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-100">Rencana Tindak Lanjut</th>
                      <th className="p-4 text-[11px] font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-100 text-center">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {penilaian.map((row, idx) => {
                      const total = (parseFloat(row.sangat_baik) || 0) + (parseFloat(row.baik) || 0) + (parseFloat(row.cukup) || 0) + (parseFloat(row.kurang) || 0);
                      const isValid = total === 100;
                      return (
                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 font-bold text-gray-800 text-sm whitespace-nowrap">{row.jenis_kemampuan}</td>
                          <td className="p-2"><input type="number" step="0.1" value={row.sangat_baik} onChange={e => handleInputChange(idx, 'sangat_baik', e.target.value)} className="w-full text-center py-2 px-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-400 outline-none" /></td>
                          <td className="p-2"><input type="number" step="0.1" value={row.baik} onChange={e => handleInputChange(idx, 'baik', e.target.value)} className="w-full text-center py-2 px-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-400 outline-none" /></td>
                          <td className="p-2"><input type="number" step="0.1" value={row.cukup} onChange={e => handleInputChange(idx, 'cukup', e.target.value)} className="w-full text-center py-2 px-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-amber-400 outline-none" /></td>
                          <td className="p-2"><input type="number" step="0.1" value={row.kurang} onChange={e => handleInputChange(idx, 'kurang', e.target.value)} className="w-full text-center py-2 px-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-red-400 outline-none" /></td>

                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 text-xs font-black rounded-full inline-block min-w-[60px] ${isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{total}%</span>
                          </td>
                          <td className="p-2"><input type="text" value={row.rencana_tindak_lanjut} onChange={e => handleInputChange(idx, 'rencana_tindak_lanjut', e.target.value)} className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Tindak Lanjut..." /></td>
                          <td className="p-2 text-center">
                            {row.id_2b6 && (
                              <button onClick={() => handleSoftDelete(row.id_2b6)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Pindah ke Trash"><Trash2 size={18} /></button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td className="p-4 font-black text-gray-700 text-sm text-right pr-6">RATA-RATA (%)</td>
                      <td className="p-4 text-center font-black text-blue-700">{avgSB}</td>
                      <td className="p-4 text-center font-black text-emerald-700">{avgB}</td>
                      <td className="p-4 text-center font-black text-amber-700">{avgC}</td>
                      <td className="p-4 text-center font-black text-red-700">{avgK}</td>
                      <td className="p-4 text-center font-black text-gray-800">{avgTotal}%</td>
                      <td colSpan="2" className="p-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button onClick={handleSubmit} disabled={!isAllRowsValid || !hasResponden} className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-xl ${isAllRowsValid && hasResponden ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-transparent'}`}>
                  <Save size={20} /> Simpan Seluruh Penilaian
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trash View */}
        {viewMode === 'trash' && (
          <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center"><Trash2 size={24} /></div>
              <div>
                <h3 className="text-xl font-black text-red-700">Keranjang Sampah</h3>
                <p className="text-sm font-medium text-red-500 mt-1">Baris penilaian yang dihapus sementara</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-red-100/50 border border-red-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-red-100">
                    <tr>
                      <th className="p-5 border-r border-gray-100">Jenis Kemampuan</th>
                      <th className="p-5 border-r border-gray-100">Tahun</th>
                      <th className="p-5 border-r border-gray-100 text-center">Sangat Baik</th>
                      <th className="p-5 border-r border-gray-100 text-center">Baik</th>
                      <th className="p-5 border-r border-gray-100 text-center">Cukup</th>
                      <th className="p-5 border-r border-gray-100 text-center">Kurang</th>
                      <th className="p-5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {trashData.length === 0 ? (
                      <tr><td colSpan="7" className="p-10 text-center text-sm font-bold text-gray-400">Keranjang sampah kosong</td></tr>
                    ) : (
                      trashData.map(t => (
                        <tr key={t.id_2b6} className="hover:bg-red-50/30 transition">
                          <td className="p-5 font-black text-gray-800 border-r border-gray-50">{t.jenis_kemampuan}</td>
                          <td className="p-5 font-bold text-gray-500 border-r border-gray-50">{t.nama_tahun || t.tahun}</td>
                          <td className="p-5 text-center font-bold text-gray-600 border-r border-gray-50">{t.sangat_baik}%</td>
                          <td className="p-5 text-center font-bold text-gray-600 border-r border-gray-50">{t.baik}%</td>
                          <td className="p-5 text-center font-bold text-gray-600 border-r border-gray-50">{t.cukup}%</td>
                          <td className="p-5 text-center font-bold text-gray-600 border-r border-gray-50">{t.kurang}%</td>
                          <td className="p-5 flex justify-center gap-3">
                            <button onClick={() => handleRestore(t.id_2b6)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 uppercase shadow-md shadow-blue-200 transition">Restore</button>
                            <button onClick={() => handleHardDelete(t.id_2b6)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white uppercase transition">Permanen</button>
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
