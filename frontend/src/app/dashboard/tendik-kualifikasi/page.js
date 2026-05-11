'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, RefreshCw, ExternalLink, Info, Users, GraduationCap, Briefcase } from 'lucide-react';

export default function TendikKualifikasiPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    s3: 0, s2: 0, s1: 0, d4: 0, d3: 0, d2: 0, d1: 0, sma: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/kepegawaian/1a5-tendik', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        processData(result.summary);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const processData = (rawSummary) => {
    let newTotals = { s3: 0, s2: 0, s1: 0, d4: 0, d3: 0, d2: 0, d1: 0, sma: 0 };
    const dataWithNo = (rawSummary || []).map((item, index) => {
      newTotals.s3 += item.s3 || 0;
      newTotals.s2 += item.s2 || 0;
      newTotals.s1 += item.s1 || 0;
      newTotals.d4 += item.d4 || 0;
      newTotals.d3 += item.d3 || 0;
      newTotals.d2 += item.d2 || 0;
      newTotals.d1 += item.d1 || 0;
      newTotals.sma += item.sma || 0;
      return { ...item, no: index + 1 };
    });
    setData(dataWithNo);
    setTotals(newTotals);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/kepegawaian/1a5-tendik/export?token=${token}`, '_blank');
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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Kualifikasi Tendik (1.A.5)</h1>
              <p className="text-gray-500 mt-1 font-medium">Rekapitulasi kualifikasi pendidikan terakhir tenaga kependidikan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={fetchData} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm font-bold text-sm">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                <span>Refresh Data</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-200 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel LKPS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tendik</p>
              <p className="text-2xl font-black text-gray-900">{Object.values(totals).reduce((a, b) => a + b, 0)}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><GraduationCap size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kualifikasi S1-S3</p>
              <p className="text-2xl font-black text-gray-900">{totals.s1 + totals.s2 + totals.s3}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Briefcase size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit Kerja Aktif</p>
              <p className="text-2xl font-black text-gray-900">{data.length}</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 mb-8 flex items-start gap-4">
          <div className="p-2 bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-200">
            <Info size={20} />
          </div>
          <div>
            <p className="text-blue-900 font-black text-sm uppercase tracking-wider">Sinkronisasi Otomatis</p>
            <p className="text-blue-700/70 text-xs mt-1 font-medium leading-relaxed">
              Tabel ini dihasilkan secara otomatis dari data Master Tenaga Kependidikan. 
              Perubahan pada data master akan langsung tercermin di sini.
            </p>
            <button 
              onClick={() => router.push('/dashboard/master/tendik')}
              className="mt-3 text-blue-600 text-[10px] font-black flex items-center gap-1.5 hover:gap-2 transition-all uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm"
            >
              <ExternalLink size={12} /> Kelola Master Tendik
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th rowSpan="2" className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-100 text-center align-middle">No</th>
                    <th rowSpan="2" className="px-8 py-4 text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] border-r border-gray-100 align-middle">Jenis Tenaga Kependidikan</th>
                    <th colSpan="8" className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-100 text-center bg-gray-50/30">Jumlah Berdasarkan Pendidikan Terakhir</th>
                    <th rowSpan="2" className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] align-middle">Unit Kerja</th>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/20">
                    {['S3', 'S2', 'S1', 'D4', 'D3', 'D2', 'D1', 'SMA'].map(edu => (
                      <th key={edu} className="px-3 py-3 text-[9px] font-black text-gray-500 uppercase tracking-widest border-r border-gray-100 text-center">{edu}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.map((row) => (
                    <tr key={row.no} className="hover:bg-amber-50/30 transition-colors group">
                      <td className="px-6 py-5 border-r border-gray-50 text-center text-[11px] font-black text-gray-300">{row.no}</td>
                      <td className="px-8 py-5 border-r border-gray-50">
                        <div className="text-sm font-black text-gray-900 group-hover:text-amber-600 transition-colors">{row.jenis}</div>
                      </td>
                      <td className="px-3 py-5 border-r border-gray-50 text-center text-sm font-bold text-gray-600">{row.s3 || '-'}</td>
                      <td className="px-3 py-5 border-r border-gray-50 text-center text-sm font-bold text-gray-600">{row.s2 || '-'}</td>
                      <td className="px-3 py-5 border-r border-gray-50 text-center text-sm font-bold text-gray-600">{row.s1 || '-'}</td>
                      <td className="px-3 py-5 border-r border-gray-50 text-center text-sm font-bold text-gray-600">{row.d4 || '-'}</td>
                      <td className="px-3 py-5 border-r border-gray-50 text-center text-sm font-bold text-gray-600">{row.d3 || '-'}</td>
                      <td className="px-3 py-5 border-r border-gray-50 text-center text-sm font-bold text-gray-600">{row.d2 || '-'}</td>
                      <td className="px-3 py-5 border-r border-gray-50 text-center text-sm font-bold text-gray-600">{row.d1 || '-'}</td>
                      <td className="px-3 py-5 border-r border-gray-50 text-center text-sm font-bold text-gray-600">{row.sma || '-'}</td>
                      <td className="px-8 py-5 text-xs text-gray-400 italic font-medium">{row.unit_kerja || '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50/80 font-black border-t-2 border-gray-100">
                  <tr className="text-gray-900">
                    <td colSpan="2" className="px-8 py-5 text-right text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Total Keseluruhan</td>
                    <td className="px-3 py-5 border-r border-gray-100 text-center text-sm font-black text-blue-600">{totals.s3}</td>
                    <td className="px-3 py-5 border-r border-gray-100 text-center text-sm font-black text-blue-600">{totals.s2}</td>
                    <td className="px-3 py-5 border-r border-gray-100 text-center text-sm font-black text-blue-600">{totals.s1}</td>
                    <td className="px-3 py-5 border-r border-gray-100 text-center text-sm font-black text-gray-900">{totals.d4}</td>
                    <td className="px-3 py-5 border-r border-gray-100 text-center text-sm font-black text-gray-900">{totals.d3}</td>
                    <td className="px-3 py-5 border-r border-gray-100 text-center text-sm font-black text-gray-900">{totals.d2}</td>
                    <td className="px-3 py-5 border-r border-gray-100 text-center text-sm font-black text-gray-900">{totals.d1}</td>
                    <td className="px-3 py-5 border-r border-gray-100 text-center text-sm font-black text-gray-900">{totals.sma}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Footnote Section */}
        <div className="mt-8 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Info size={14} className="text-amber-500" /> Keterangan Tambahan
          </p>
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              <span className="text-amber-600 font-bold">*)</span> Pustakawan adalah staf perpustakaan yang memiliki ijazah atau sertifikat kompetensi pada bidang ilmu perpustakaan.
            </p>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              <span className="text-blue-600 font-bold">**)</span> Data diperbarui secara real-time berdasarkan input pada modul kepegawaian.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
