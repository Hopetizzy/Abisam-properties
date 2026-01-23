
import React from 'react';
import ScrollReveal from './ScrollReveal';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax-like feeling */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Home"
          className="w-full h-full object-cover opacity-30 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <ScrollReveal delay={200}>
          <span className="inline-block glass px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 text-yellow-500">
            Exclusive Abeokuta Real Estate
          </span>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-none">
            OWN YOUR <span className="text-gradient">FUTURE</span> <br /> IN THE ANCIENT CITY.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={600}>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            From the heights of Oke-Mosan to the energy of Camp, Abisam connects you to verified lands and luxury homes with zero omonile stress.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={800}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#listings" className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 hover:scale-105 transition-all">
              Explore Listings
            </a>
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="w-full sm:w-auto glass px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              Talk to AI Agent
            </button>
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[bounce_2s_infinite]"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;