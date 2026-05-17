'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user || {}));
        router.push('/dashboard');
      } else {
        setError(result.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Large gradient blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating circles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-40 w-6 h-6 bg-white/10 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-white/15 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-white/10 rounded-full animate-pulse animation-delay-3000"></div>
        
        {/* Additional floating decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-float animation-delay-2000"></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-16 right-16 text-2xl animate-pulse">✨</div>
        <div className="absolute bottom-24 left-24 text-xl animate-pulse animation-delay-1000">⭐</div>
      </div>
      
      {/* Main card */}
      <div className="relative bg-gray-950/80 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800 transform hover:scale-105 transition-all duration-500 animate-fade-in">
        {/* Decorative elements */}
        <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full opacity-20 blur-xl animate-pulse-glow"></div>
        <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-20 blur-xl animate-pulse-glow animation-delay-1000"></div>
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-6 shadow-2xl animate-bounce-subtle animate-pulse-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
            <span className="text-3xl font-bold text-white relative z-10">A</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">Panel Akreditasi</h1>
          <p className="text-gray-400 mt-2 font-medium">STIKOM PGRI Banyuwangi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-700 pl-12 shadow-sm text-white"
                placeholder="Masukkan username"
                required
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">👤</div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-700 pl-12 shadow-sm text-white"
                placeholder="Masukkan password"
                required
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">🔒</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-900/30 text-red-400 px-4 py-3 rounded-xl text-sm font-bold animate-pulse flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl relative overflow-hidden group animate-pulse-glow"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Memproses...
                </>
              ) : (
                <>
                  <span>🔐</span>
                  Login Sekarang
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 pt-6 border-t border-gray-800">
          <p className="font-bold text-gray-400">Sistem Akreditasi v2.1</p>
          <p className="text-[10px] mt-1 text-gray-600 uppercase tracking-widest">LAM INFOKOM - BAN-PT</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
