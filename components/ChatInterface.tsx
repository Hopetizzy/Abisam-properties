
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Property } from '../types';
import { getAssistantResponseStream, generateLeadSummary } from '../services/geminiService';
import { ABISAM_PHONE, MOCK_PROPERTIES } from '../constants';
import PropertyCard from './PropertyCard';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      id: 'init',
      role: 'assistant',
      text: "Welcome to Abisam Properties. I'm your elite AI sales partner for the Abeokuta market. Are you looking to Buy, Rent, or Sell today?",
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const cleanTextOutput = (text: string) => {
    // Remove property tokens
    let cleaned = text.replace(/\[PROP:\d+\]/g, '');
    // Remove markdown symbols strictly
    cleaned = cleaned.replace(/[*#_~`>|]/g, '');
    // Replace multiple newlines with single ones for a clean look
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    return cleaned.trim();
  };

  const findPropertyFromToken = (text: string): Property | undefined => {
    const match = text.match(/\[PROP:(\d+)\]/);
    if (match) {
      const propId = match[1];
      return MOCK_PROPERTIES.find(p => p.id === propId);
    }
    return undefined;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.concat(userMsg).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const assistantId = (Date.now() + 1).toString();
      let fullText = "";

      // Pre-emptive message slot to reduce perceived latency
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        text: "",
        timestamp: new Date()
      }]);

      const stream = await getAssistantResponseStream(history);

      let firstChunkReceived = false;

      for await (const chunk of stream) {
        if (!firstChunkReceived) {
          setIsTyping(false); // Hide the loading indicator as soon as text starts flowing
          firstChunkReceived = true;
        }

        const chunkText = chunk.text;
        fullText += chunkText;

        const foundProp = findPropertyFromToken(fullText);

        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? {
              ...m,
              text: cleanTextOutput(fullText),
              property: foundProp || m.property
            }
            : m
        ));

        if (fullText.length > 40 && !showHandoff) setShowHandoff(true);
      }

      if (fullText.toLowerCase().includes('whatsapp') || messages.length > 2) {
        setShowHandoff(true);
      }

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: 'assistant',
        text: "I'm experiencing a high volume of requests. Please use the WhatsApp button to connect with our team directly.",
        timestamp: new Date()
      }]);
      setShowHandoff(true);
      setIsTyping(false);
    }
  };

  const handleWhatsAppHandoff = async () => {
    const chatTranscript = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
    const lead = await generateLeadSummary(chatTranscript);

    const waText = `*ABISAM AI LEAD PROFILE*
---------------------------
*Goal:* ${lead.intent || 'Unknown'}
*Location:* ${lead.location || 'Abeokuta'}
*Budget:* ${lead.budget || 'N/A'}
*Type:* ${lead.propertyType || 'Residential'}

*Summary:* ${lead.summary}

_Generated via Abisam Zero-Latency Ecosystem_`;

    window.open(`https://wa.me/${ABISAM_PHONE}?text=${encodeURIComponent(waText)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-24" id="contact">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-4 tracking-tighter italic opacity-20">ZERO LATENCY</h2>
        <h3 className="text-4xl font-bold -mt-10 mb-4">THE <span className="text-gradient underline decoration-yellow-500/30">ABISAM ASSISTANT</span></h3>
        <p className="text-gray-500 max-w-lg mx-auto uppercase tracking-widest text-[10px] font-bold">Powered by Gemini-3 Flash for instant closures</p>
      </div>

      <div className="glass rounded-3xl md:rounded-[3.5rem] overflow-hidden flex flex-col h-[85vh] md:h-[750px] border border-white/5 shadow-[0_0_100px_rgba(255,215,0,0.05)] relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-[120px] pointer-events-none"></div>

        <div className="p-4 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01] backdrop-blur-md relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-14 h-14 rounded-2xl bg-black flex items-center justify-center float-anim border border-white/10">
                <i className="fa-solid fa-bolt-lightning text-yellow-500 text-2xl"></i>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
            </div>
            <div>
              <h4 className="font-bold text-lg tracking-tight">Abisam Concierge</h4>
              <p className="text-[9px] text-yellow-500/80 font-bold tracking-[0.2em] uppercase">Status: Live & Verified</p>
            </div>
          </div>
          <button
            onClick={() => { setMessages([messages[0]]); setShowHandoff(false); }}
            className="w-11 h-11 rounded-full glass hover:bg-white/10 transition-all flex items-center justify-center border-white/10"
          >
            <i className="fa-solid fa-rotate-left text-xs text-gray-400"></i>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 scroll-smooth relative z-10 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] p-6 rounded-[2rem] ${msg.role === 'user'
                ? 'bg-gradient-to-br from-yellow-500 to-orange-600 text-black font-bold shadow-xl shadow-yellow-500/10'
                : 'glass text-gray-200 border-white/5 bg-white/[0.02]'
                }`}>
                <p className="text-[16px] leading-relaxed whitespace-pre-wrap">{msg.text || "Thinking..."}</p>
                <div className="mt-4 flex items-center justify-between opacity-30">
                  <span className="text-[9px] uppercase font-black tracking-[0.2em]">{msg.role === 'user' ? 'Direct Buyer' : 'Abisam Agent'}</span>
                  <span className="text-[9px] font-bold">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              {msg.property && (
                <div className="w-full max-w-[340px] transform hover:scale-[1.02] transition-transform animate-in zoom-in-95 duration-700">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-yellow-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-black/40 border border-white/5 p-2 rounded-[2.5rem]">
                      <div className="text-[9px] font-black text-center text-yellow-500/50 uppercase tracking-[0.3em] my-2">Verified Selection</div>
                      <PropertyCard property={msg.property} onSelect={() => { }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="glass px-8 py-5 rounded-[2rem] flex gap-2 items-center relative overflow-hidden">
                {/* Shimmering indicator */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-duration:1s]"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1s]"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1s]"></div>
              </div>
            </div>
          )}
        </div>

        {showHandoff && (
          <div className="px-10 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
            <button
              onClick={handleWhatsAppHandoff}
              className="group w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-6 rounded-2xl flex items-center justify-center gap-4 transition-all transform hover:translate-y-[-4px] shadow-2xl shadow-green-500/20 active:scale-95"
            >
              <i className="fa-brands fa-whatsapp text-2xl group-hover:scale-110 transition-transform"></i>
              START WHATSAPP HANDOFF
              <i className="fa-solid fa-arrow-right text-xs opacity-50 group-hover:translate-x-1 transition-all"></i>
            </button>
          </div>
        )}

        <div className="p-10 bg-white/[0.01] border-t border-white/5 relative z-10 backdrop-blur-sm">
          <div className="relative group">
            <div className="absolute -inset-1 bg-yellow-500/10 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about properties in Adigbe, Camp, Oke-Mosan..."
              className="relative w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-8 pr-20 py-6 focus:outline-none focus:border-yellow-500/40 transition-all text-base font-medium placeholder:text-gray-600 shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black w-12 h-12 rounded-xl flex items-center justify-center hover:bg-yellow-500 disabled:opacity-20 transition-all active:scale-90 shadow-xl"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
          <div className="flex justify-between items-center mt-6 px-2">
            <p className="text-[9px] text-gray-700 font-black tracking-[0.3em] uppercase">Verified Land Registry Sync</p>
            <p className="text-[9px] text-yellow-500/40 font-black tracking-[0.3em] uppercase">Abeokuta Real Estate Hub</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
