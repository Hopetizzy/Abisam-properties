
import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-0 md:px-6 md:py-4">
      <div className="max-w-7xl mx-auto bg-[#050505] md:glass w-full md:w-auto rounded-none md:rounded-full px-5 md:px-8 py-4 md:py-4 flex items-center justify-between relative z-50 border-b border-white/10 md:border-b-0 md:border-x md:border-t">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <span className="text-black font-black text-sm">A</span>
          </div>
          <span className="text-base md:text-xl font-bold tracking-tighter uppercase">Abisam <span className="text-yellow-500">Properties</span></span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#listings" className="hover:text-white transition-colors">Listings</a>
          <a href="#about-us" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        <button className="hidden md:block bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-yellow-500 transition-all active:scale-95">
          List a Property
        </button>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full glass border-white/10 active:scale-90 transition-all"
        >
          <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-white`}></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 transition-all duration-500 md:hidden flex flex-col items-center justify-center ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 hover:to-yellow-500 transition-all">Home</a>
          <a href="#listings" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 hover:to-yellow-500 transition-all">Listings</a>
          <a href="#about-us" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 hover:to-yellow-500 transition-all">About</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 hover:to-yellow-500 transition-all">Contact</a>

          <div className="h-px w-24 bg-white/10 my-4"></div>

          <button className="bg-yellow-500 text-black px-10 py-4 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/20">
            List a Property
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
