
import React from 'react';
import ScrollReveal from './ScrollReveal';

const AboutUs: React.FC = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden" id="about-us">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-yellow-500/10 blur-[120px] rounded-full -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Visual & Mission */}
          <div className="lg:col-span-5 space-y-12">
            <ScrollReveal animation="scale-up">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-yellow-500/20 to-orange-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" 
                  alt="Modern Architecture" 
                  className="relative rounded-[3rem] aspect-[4/5] object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl"
                />
                <div className="absolute -bottom-8 -right-8 glass p-8 rounded-3xl max-w-[240px] hidden md:block border-yellow-500/20">
                  <p className="text-yellow-500 font-black text-4xl mb-2">15+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Years of local dominance in the Rock City</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="glass p-10 rounded-[2.5rem] border-white/5">
                <h4 className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs mb-6">Our Mission</h4>
                <p className="text-2xl font-bold tracking-tight leading-snug">
                  To eliminate the "Omonile" friction and provide <span className="text-white/50">secure, transparent, and luxury-grade</span> real estate assets to every indigene and investor in Abeokuta.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Expertise & Details */}
          <div className="lg:col-span-7 space-y-16">
            <ScrollReveal>
              <div className="relative">
                <span className="text-yellow-500 text-sm font-black uppercase tracking-[0.4em] mb-4 block">Abeokuta's Premier Choice</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                  THE SOUL OF <br />
                  <span className="text-gradient">ROCK CITY</span>
                </h2>
                <div className="w-full h-px bg-gradient-to-r from-yellow-500/50 to-transparent mb-12"></div>
              </div>
            </ScrollReveal>

            <div className="prose prose-invert max-w-none">
              <ScrollReveal delay={100}>
                <p className="text-xl text-gray-400 font-light leading-relaxed mb-8">
                  Abisam Properties isn't just a brokerage; we are the custodians of the Gateway State's real estate future. Founded on the principles of integrity and deep local heritage, we understand the unique landscape of Abeokuta—from the high-brow serenity of <span className="text-white font-bold">Oke-Mosan</span> to the bustling academic energy of <span className="text-white font-bold">Camp</span>.
                </p>
              </ScrollReveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <ScrollReveal delay={200} className="space-y-4">
                  <h5 className="text-white font-bold text-lg flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    Local Expertise
                  </h5>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    We navigate the complexities of local land laws and traditional clearances so you don't have to. Our network spans across Alake's palace to the modern boardrooms of Ogun State.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={300} className="space-y-4">
                  <h5 className="text-white font-bold text-lg flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    Verified Guarantee
                  </h5>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Every C of O, Survey, and Deed of Assignment in our portfolio is double-vetted by our in-house legal team at the Bureau of Lands.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={400} className="space-y-4">
                  <h5 className="text-white font-bold text-lg flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    Modern Luxury
                  </h5>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    We curate only the finest properties. Whether it's a penthouse with a view of Olumo Rock or a smart flat in Adigbe, we prioritize quality.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={500} className="space-y-4">
                  <h5 className="text-white font-bold text-lg flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    AI Integration
                  </h5>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Leveraging cutting-edge Gemini AI, we provide instant support and property matching, ensuring zero-latency in your search for home.
                  </p>
                </ScrollReveal>
              </div>
            </div>

            <ScrollReveal delay={600} className="flex flex-wrap gap-6 pt-8">
              <div className="px-6 py-3 glass rounded-full border-white/5 flex items-center gap-3">
                <i className="fa-solid fa-mountain-sun text-yellow-500"></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">Heritage Driven</span>
              </div>
              <div className="px-6 py-3 glass rounded-full border-white/5 flex items-center gap-3">
                <i className="fa-solid fa-handshake-simple text-yellow-500"></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">Community Focused</span>
              </div>
              <div className="px-6 py-3 glass rounded-full border-white/5 flex items-center gap-3">
                <i className="fa-solid fa-award text-yellow-500"></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">Licensed & Insured</span>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;