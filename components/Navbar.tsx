
import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-full px-6 md:px-8 py-4 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold">A</span>
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tighter uppercase">Abisam <span className="text-yellow-500">Properties</span></span>
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
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-yellow-500 transition-colors">Home</a>
          <a href="#listings" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-yellow-500 transition-colors">Listings</a>
          <a href="#about-us" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-yellow-500 transition-colors">About</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-yellow-500 transition-colors">Contact</a>

          <div className="h-px w-24 bg-white/10 my-4"></div>

          <button className="bg-yellow-500 text-black px-8 py-4 rounded-full text-lg font-black uppercase tracking-widest hover:scale-105 transition-all">
            List a Property
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
