
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am your Beauzead Personal Shopper. How can I help you discover our premium collection today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      // Fix: Strictly following @google/genai guidelines for initialization (direct process.env.API_KEY access)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are a world-class luxury shopping assistant for the brand "Beauzead".
          Our current products include: ${JSON.stringify(PRODUCTS.map(p => ({ title: p.title, price: p.price, category: p.category })))}.
          Be elegant, helpful, and prioritize recommending these products based on user needs.`,
          temperature: 0.7,
        },
      });

      // Fix: Strictly using the .text property getter as per SDK guidelines
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm sorry, I couldn't process that right now." }]);
    } catch (err) {
      console.error('AI Error:', err);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm currently experiencing a high volume of requests. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen ? (
        <div className="bg-white w-[350px] h-[500px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in ring-1 ring-black/5">
          <div className="bg-[#111827] p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center font-black text-xs text-gray-900">AI</div>
              <div>
                <h3 className="text-white text-sm font-black uppercase tracking-tighter">Personal Shopper</h3>
                <p className="text-[10px] text-green-400 font-bold uppercase">Online Now</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-semibold leading-relaxed ${
                  m.role === 'user' ? 'bg-[#2874f0] text-white' : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for recommendations..."
                className="flex-grow bg-gray-100 px-4 py-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 text-black"
              />
              <button 
                onClick={handleSend}
                className="bg-[#111827] text-white p-3 rounded-xl hover:bg-black transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5"/></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#111827] text-[#D4AF37] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-[#D4AF37]/20 relative group"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2"/></svg>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
      )}
    </div>
  );
};

export default AiAssistant;
