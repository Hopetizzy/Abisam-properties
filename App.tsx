
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import ChatInterface from './components/ChatInterface';
import AboutUs from './components/AboutUs';
import PropertyModal from './components/PropertyModal';
import GoogleReviews from './components/GoogleReviews';
import ScrollReveal from './components/ScrollReveal';
import { MOCK_PROPERTIES } from './constants';
import { Property } from './types';

const App: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="min-h-screen bg-[#050505]">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-wrap {
          overflow: hidden;
          background: #FFD700;
          padding: 10px 0;
          white-space: nowrap;
        }
        .ticker-content {
          display: inline-block;
          animation: ticker 30s linear infinite;
        }
        .ticker-item {
          display: inline-block;
          padding: 0 40px;
          color: black;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 14px;
          letter-spacing: 0.1em;
        }
      `}</style>

      <Navbar />

      <main>
        <Hero />

        {/* Crazy Ticker Section */}
        <div className="ticker-wrap border-y border-black/10">
          <div className="ticker-content">
            {Array(10).fill(0).map((_, i) => (
              <span key={i} className="ticker-item">
                <i className="fa-solid fa-fire-flame-curved mr-2"></i>
                NEW LISTING IN OKE-MOSAN • VERIFIED LAND AT OBANTOKO • LUXURY FLATS IN ADIGBE • ABISAM PROPERTIES • NO OMONILE ISSUES •
              </span>
            ))}
          </div>
        </div>

        {/* About Us Section */}
        <AboutUs />

        {/* Trust & Reviews Section */}
        <GoogleReviews />

        {/* Featured Listings */}
        <section className="py-20 md:py-32 px-6" id="listings">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-baseline justify-between mb-24 gap-10">
              <ScrollReveal className="relative">
                <div className="absolute -top-12 -left-6 text-[120px] font-black opacity-[0.03] select-none pointer-events-none">ABEOKUTA</div>
                <span className="text-yellow-500 text-sm font-black uppercase tracking-[0.4em] mb-4 block">Elite Inventory</span>
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-none">
                  PRIME <br />
                  <span className="text-gradient">REAL ESTATE</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={200} className="max-w-md">
                <p className="text-gray-500 text-lg font-medium leading-relaxed mb-6">
                  We bridge the gap between ancient heritage and modern luxury. Every land is surveyed, every home is vetted.
                </p>
                <div className="h-1 w-24 bg-yellow-500"></div>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {MOCK_PROPERTIES.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 100} animation="fade-up">
                  <PropertyCard
                    property={p}
                    onSelect={(prop) => setSelectedProperty(prop)}
                  />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={400} className="mt-24 flex justify-center">
              <button className="group relative glass px-16 py-6 rounded-full overflow-hidden transition-all hover:pr-20">
                <span className="relative z-10 font-black uppercase tracking-[0.2em] text-sm">Download Full Catalog</span>
                <div className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <i className="fa-solid fa-arrow-right absolute right-8 opacity-0 group-hover:opacity-100 transition-all text-black"></i>
              </button>
            </ScrollReveal>
          </div>
        </section>

        {/* Statistics "Crazy" Section */}
        <section className="py-12 md:py-20 px-6 border-y border-white/5 bg-[#080808]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Verified Lands', val: '500+' },
              { label: 'Happy Families', val: '1.2k' },
              { label: 'Years in Abeokuta', val: '15+' },
              { label: 'AI Responses', val: '24/7' }
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100} animation="scale-up">
                <div className="text-center group">
                  <div className="text-4xl md:text-6xl font-black mb-2 group-hover:text-yellow-500 transition-colors">{stat.val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <ChatInterface />
      </main>

      <footer className="py-20 md:py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20 mb-20">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-black">A</div>
                <h3 className="text-3xl font-black tracking-tighter uppercase">Abisam <span className="text-yellow-500">Properties</span></h3>
              </div>
              <p className="text-gray-500 leading-relaxed font-medium mb-10">
                Abeokuta's premier real estate ecosystem. We don't just sell property; we secure your future in the Gateway State.
              </p>
              <div className="flex gap-4">
                {['instagram', 'x-twitter', 'facebook-f', 'linkedin-in'].map(icon => (
                  <a key={icon} href="#" className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all">
                    <i className={`fa-brands fa-${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div>
                <h5 className="font-black mb-8 uppercase tracking-[0.2em] text-[11px] text-white">Hubs</h5>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Oke-Mosan</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Camp Junction</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Adigbe Hills</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Kuto Central</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-black mb-8 uppercase tracking-[0.2em] text-[11px] text-white">Company</h5>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Our Story</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Verification Process</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Omonile Policy</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact</a></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h5 className="font-black mb-8 uppercase tracking-[0.2em] text-[11px] text-white">Office</h5>
                <address className="not-italic text-sm font-medium text-gray-500 leading-loose">
                  12 Abisam Plaza,<br />
                  Opposite Cultural Centre,<br />
                  Kuto, Abeokuta,<br />
                  Ogun State.
                </address>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              &copy; 2024 Abisam Properties Ecosystem • Built with AI Precision
            </div>
            <div className="flex gap-10 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default App;