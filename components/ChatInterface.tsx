import React, { useState, useRef, useEffect } from 'react';
import { Property } from '../types';
import { MOCK_PROPERTIES, ABISAM_PHONE } from '../constants';
import PropertyCard from './PropertyCard';
import { pushToGoogleSheets, openWhatsAppInquiry } from '../services/leadService';
import { getGeminiResponse } from '../services/geminiService';

type ChatState =
  | 'CHAT'
  | 'NAME_INPUT'
  | 'SCHEDULING'
  | 'PHONE_INPUT'
  | 'CONCLUSION';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  type?: 'text' | 'property-grid' | 'date-selection';
  timestamp: Date;
  dateOptions?: string[];
  property?: Property; // Added property field
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  contextProperty: Property | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onToggle, contextProperty }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentState, setCurrentState] = useState<ChatState>('CHAT');
  const [userInput, setUserInput] = useState('');
  const [leadData, setLeadData] = useState({
    name: '',
    phone: '',
    property: '',
    date: '',
    timestamp: ''
  });
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const prevContextRef = useRef<string | undefined>(undefined);
  const hasGreetingRun = useRef(false);

  // Initialize Chat
  useEffect(() => {
    if (contextProperty && contextProperty.title !== prevContextRef.current) {
      prevContextRef.current = contextProperty.title;
      handleContextStart(contextProperty);
    } else if (messages.length === 0 && !hasGreetingRun.current) {
      addSystemMessage("Hello! I am your Abisam Senior Consultant. I can help you find the perfect home or land investment in Abeokuta. What is your budget or preferred location?");
      hasGreetingRun.current = true;
    }
  }, [contextProperty]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const getNextDates = () => {
    const days = [1, 3, 6];
    const today = new Date();
    const nextDates: string[] = [];

    days.forEach(dayIndex => {
      const d = new Date();
      const diff = (dayIndex + 7 - today.getDay()) % 7;
      const daysToAdd = diff === 0 ? 7 : diff;
      d.setDate(today.getDate() + daysToAdd);
      nextDates.push(d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    });
    return nextDates;
  };

  const addSystemMessage = (text: string, delay = 800, type: Message['type'] = 'text', dateOptions?: string[], property?: Property) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text,
        type,
        dateOptions,
        property,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    }]);
  };

  const handleContextStart = async (property: Property) => {
    if (!isOpen) onToggle(true);

    // Reset to chat mode but keep history? Better to clear for new context or just append?
    // Let's clear to focus.
    setMessages([]);
    setCurrentState('CHAT');

    // Simulate user asking about it (hidden or visible? Visible is better for context)
    const userQuery = `Tell me about ${property.title}`;
    addUserMessage(userQuery);

    handleAIQuery(userQuery);
  };

  const handleAIQuery = async (query: string) => {
    setIsTyping(true);

    // Filter history to ensure it starts with a USER message to satisfy Gemini API requirements
    const firstUserIndex = messages.findIndex(m => m.role === 'user');
    const validMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : [];

    const history = validMessages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.text }]
    }));

    const responseText = await getGeminiResponse(history, query);

    // Check for [BOOK: ID] token (High Priority)
    const bookMatch = responseText.match(/\[BOOK:\s*(.*?)\]/);

    // Check for [CARD: ID] token
    const cardMatch = responseText.match(/\[CARD:\s*(.*?)\]/);

    if (bookMatch) {
      const propertyId = bookMatch[1];
      const property = MOCK_PROPERTIES.find(p => p.id === propertyId);
      const cleanText = responseText.replace(/\[BOOK:.*?\]/, '').trim();

      addSystemMessage(cleanText, 0);

      if (property) {
        setLeadData(prev => ({ ...prev, property: property.title }));
        setTimeout(() => {
          setCurrentState('NAME_INPUT');
          addSystemMessage(`Great. To finalize the inspection for ${property.title}, may I have your full name?`);
        }, 1000);
      } else {
        // Fallback if ID is weird
        setCurrentState('NAME_INPUT');
        addSystemMessage("Excellent. May I have your name to proceed with the booking?");
      }
    } else if (cardMatch) {
      const propertyId = cardMatch[1];
      const property = MOCK_PROPERTIES.find(p => p.id === propertyId);
      const cleanText = responseText.replace(/\[CARD:.*?\]/, '').trim();

      // 1. Add the text response
      addSystemMessage(cleanText, 0);

      // 2. If property found, add the Card component bubble
      if (property) {
        addSystemMessage('', 400, 'property-grid', undefined, property);
      }

    } else {
      // Normal response
      addSystemMessage(responseText, 0);
    }
  };

  const handleNameSubmit = () => {
    if (!userInput.trim()) return;
    const name = userInput.trim();
    setLeadData(prev => ({ ...prev, name }));
    addUserMessage(name);
    setUserInput('');

    setCurrentState('SCHEDULING');
    const dates = getNextDates();
    addSystemMessage(`Pleasure, ${name}. When will you be available for a live site visit?`, 800, 'date-selection', dates);
  };

  const handleDateSelect = (date: string) => {
    setLeadData(prev => ({ ...prev, date }));
    addUserMessage(date);

    setCurrentState('PHONE_INPUT');
    addSystemMessage("Noted. Finally, please provide your WhatsApp number so we can send you the location pin.");
  };

  const handlePhoneSubmit = () => {
    if (!userInput.trim()) return;
    const phone = userInput.trim();
    const finalLeadData = {
      ...leadData,
      phone,
      timestamp: new Date().toISOString()
    };

    setLeadData(finalLeadData);
    addUserMessage(phone);
    setUserInput('');

    pushToGoogleSheets(finalLeadData);

    setCurrentState('CONCLUSION');
    addSystemMessage(`Done. Your inspection is confirmed. A senior agent will contact you on ${phone} shortly.`);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (currentState === 'CHAT') {
      const text = userInput.trim();
      addUserMessage(text);
      setUserInput('');
      handleAIQuery(text);
      return;
    }

    if (currentState === 'NAME_INPUT') handleNameSubmit();
    if (currentState === 'PHONE_INPUT') handlePhoneSubmit();
  };

  // Minimized State
  if (!isOpen) {
    return (
      <button
        onClick={() => onToggle(true)}
        className="fixed bottom-6 right-6 z-50 group flex items-center justify-center p-0 border-0 outline-none focus:outline-none active:scale-90 transition-transform"
      >
        <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl">
          Start Concierge
        </span>
        <div className="relative w-16 h-16 rounded-full bg-black border border-white/20 glass flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.2)] hover:scale-110 transition-all duration-300">
          <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping opacity-20"></div>
          <i className="fa-solid fa-robot text-yellow-500 text-2xl animate-spin-slow"></i>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 z-[60] w-full md:w-[400px] h-[85dvh] md:h-[600px] md:max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-500 origin-bottom md:origin-bottom-right">
      <div className="glass rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden flex flex-col h-full border-t md:border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-[0_0_100px_rgba(0,0,0,0.5)] relative bg-[#0a0a0a]">

        {/* Mobile Drag Handle Visual */}
        <div className="md:hidden absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full z-20 pointer-events-none"></div>

        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.03] backdrop-blur-md relative z-10 cursor-pointer" onClick={() => onToggle(false)}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/10">
                <i className="fa-solid fa-robot text-yellow-500 text-lg"></i>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-tight text-white">Abisam Elite AI</h4>
              <p className="text-[9px] text-yellow-500/80 font-bold tracking-[0.2em] uppercase">Online | Consultant</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(false); }}
            className="w-8 h-8 rounded-full hover:bg-white/10 transition-all flex items-center justify-center text-gray-400"
          >
            <i className="fa-solid fa-chevron-down"></i>
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth relative z-10 custom-scrollbar bg-black/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}>

              {/* TEXT MESSAGE */}
              {msg.text && (
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-600 text-black font-bold shadow-lg'
                  : 'glass text-gray-200 border-white/5 bg-white/[0.05]'
                  }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              )}

              {/* CARD MESSAGE */}
              {msg.type === 'property-grid' && msg.property && (
                <div className="w-[85%] self-start transform scale-95 origin-left mb-2">
                  <PropertyCard property={msg.property} onSelect={() => { }} onChat={undefined} />
                </div>
              )}

              {/* DATE SELECTION */}
              {msg.type === 'date-selection' && msg.dateOptions && (
                <div className="flex flex-col gap-2">
                  {msg.dateOptions.map(day => (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(day)}
                      className="glass w-full px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all border-white/10 flex justify-between items-center group"
                    >
                      <span>{day}</span>
                      <i className="fa-solid fa-chevron-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* CONCLUSION ACTION BUTTON - REMOVED AS REQUESTED */}
          {currentState === 'CONCLUSION' && (
            <div className="flex flex-col gap-3 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Button removed to prevent manual WhatsApp confirmation */}
            </div>
          )}

          {isTyping && (
            <div className="glass w-12 h-8 rounded-full flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/[0.03] border-t border-white/5 relative z-10 backdrop-blur-sm">
          <form onSubmit={handleInputSubmit} className="relative group flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={['SCHEDULING', 'CONCLUSION'].includes(currentState)}
              placeholder={
                currentState === 'NAME_INPUT' ? "Enter your full name..." :
                  currentState === 'PHONE_INPUT' ? "Enter WhatsApp number..." :
                    "Message Abisam AI..."
              }
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/40 transition-all text-sm font-medium placeholder:text-gray-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || ['SCHEDULING', 'CONCLUSION'].includes(currentState)}
              className="bg-yellow-500 text-black w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white disabled:opacity-50 transition-all font-bold"
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </form>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 215, 0, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ChatInterface;
