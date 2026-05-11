export default function Home() {
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
        
        {/* Floating circles with different sizes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-40 w-6 h-6 bg-white/10 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-white/15 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-white/10 rounded-full animate-pulse animation-delay-3000"></div>
        
        {/* Additional floating decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-indigo-400/30 rounded-full animate-float animation-delay-3000"></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-16 right-16 text-2xl animate-pulse">✨</div>
        <div className="absolute bottom-24 left-24 text-xl animate-pulse animation-delay-1000">⭐</div>
        <div className="absolute top-1/3 left-16 text-lg animate-pulse animation-delay-2000">💫</div>
      </div>
      
      {/* Main card */}
      <div className="relative bg-white/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl w-full max-w-lg border border-white/30 text-center transform hover:scale-105 transition-all duration-500 animate-fade-in">
        {/* Decorative elements */}
        <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl animate-pulse-glow"></div>
        <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-pulse-glow animation-delay-1000"></div>
        
        {/* Logo */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-8 shadow-2xl animate-bounce-subtle animate-pulse-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
          <span className="text-4xl font-bold text-white relative z-10">A</span>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in">
          Panel Akreditasi
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-700 mb-8 text-xl font-medium">STIKOM PGRI Banyuwangi</p>
        
        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <p className="text-xs text-gray-600 font-semibold">Laporan</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
            <p className="text-xs text-gray-600 font-semibold">Akreditasi</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 hover:shadow-lg transition-shadow group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📈</div>
            <p className="text-xs text-gray-600 font-semibold">Analisis</p>
          </div>
        </div>
        
        {/* CTA Button */}
        <a 
          href="/login" 
          className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/50 transition-all transform hover:scale-105 shadow-2xl relative overflow-hidden group animate-pulse-glow"
        >
          <span className="relative z-10">Login Sekarang</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
        </a>
        
        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700">Sistem Akreditasi v2.1</p>
          <p className="text-xs text-gray-500 mt-1">LAM INFOKOM - Badan Akreditasi Nasional</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse animation-delay-400"></div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-2xl">
            <span className="hover:scale-125 transition-transform cursor-pointer">🎓</span>
            <span className="hover:scale-125 transition-transform cursor-pointer">🏛️</span>
            <span className="hover:scale-125 transition-transform cursor-pointer">📚</span>
          </div>
        </div>
      </div>
    </div>
  );
}
