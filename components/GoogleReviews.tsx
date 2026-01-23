
import React from 'react';
import ScrollReveal from './ScrollReveal';

const GoogleReviews: React.FC = () => {
  const reviews = [
    {
      name: "Olawale Johnson",
      rating: 5,
      text: "Abisam Properties is the most reliable in Abeokuta. I got my land at Obantoko with all documents verified within days. Highly recommended!",
      date: "2 weeks ago",
      initials: "OJ"
    },
    {
      name: "Abigail Adeyemi",
      rating: 5,
      text: "The AI assistant on their website actually works! I was skeptical but it helped me find a great self-contain in Camp. Very innovative.",
      date: "1 month ago",
      initials: "AA"
    },
    {
      name: "Engr. Tunde",
      rating: 5,
      text: "Professionalism at its peak. No omonile issues, no hidden charges. They are truly the soul of Rock City real estate.",
      date: "3 days ago",
      initials: "ET"
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#070707]">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <ScrollReveal>
            <div>
              <h4 className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Social Proof</h4>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                TRUSTED BY <br />
                <span className="text-gradient">THE COMMUNITY</span>
              </h2>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-black text-white">4.9</div>
                <div className="flex text-yellow-500 text-xs gap-1 mt-1">
                  {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                </div>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div>
                <div className="text-sm font-bold text-gray-400">Google Rating</div>
                <a 
                  href="https://maps.app.goo.gl/nHuYCnj1GbmrhPPd9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:text-white transition-colors flex items-center gap-2 mt-1"
                >
                  View on Maps <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <ScrollReveal key={idx} delay={idx * 150} animation="fade-up">
              <div className="glass h-full p-8 rounded-[2.5rem] border-white/5 hover:border-yellow-500/20 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center font-black text-yellow-500 border border-yellow-500/10">
                    {review.initials}
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-yellow-500 transition-colors">{review.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{review.date}</div>
                  </div>
                </div>
                <div className="flex text-yellow-500 text-[10px] gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={600} className="mt-16 text-center">
          <a 
            href="https://maps.app.goo.gl/nHuYCnj1GbmrhPPd9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 glass px-8 py-4 rounded-full border-white/10 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
          >
            <i className="fa-brands fa-google text-yellow-500"></i>
            See more reviews on Google Maps
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default GoogleReviews;