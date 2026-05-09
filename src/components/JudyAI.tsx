/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Bot, Film, Info, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'judy';
}

export default function JudyAI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm Judy, your AI cinematic assistant. Need a movie recommendation or help with Flix?", sender: 'judy' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate Judy's thinking
    setTimeout(() => {
      const judyMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: getJudyResponse(input), 
        sender: 'judy' 
      };
      setMessages(prev => [...prev, judyMsg]);
    }, 1000);
  };

  const getJudyResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('movie') || q.includes('recommend')) return "Based on your taste, I'd recommend 'Dune: Part Two' for its epic scale or 'Arrival' if you want something more cerebral.";
    if (q.includes('import') || q.includes('add')) return "To import media, just click the '+' icon in the sidebar! Remember to provide a valid video file and a vertical poster.";
    if (q.includes('money') || q.includes('monetization')) return "SocialFlix uses AI to calculate your earnings based on engagement. You can check your stats in your Profile!";
    if (q.includes('social')) return "SocialFlix is our short-video platform where you can watch cuts and reviews. It's the Clapperboard icon!";
    return "I'm not quite sure about that yet, but I can help with movie names, import instructions, or explaining SocialFlix!";
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col bg-app-black border border-white/10 rounded-[40px] overflow-hidden mt-12 mb-12">
      {/* Header */}
      <div className="p-8 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center shadow-lg shadow-brand-red/20">
             <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Judy AI</h2>
            <p className="meta-text text-brand-red">Your Cinematography Guide</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase border border-green-500/20">Online</div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 hide-scrollbar bg-[radial-gradient(circle_at_50%_0%,#E5091405,transparent)]">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-brand-red text-white rounded-tr-none shadow-xl' 
                : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="px-8 py-4 flex gap-3 overflow-x-auto hide-scrollbar bg-black/40">
         <Suggestion title="Recommend a Movie" onClick={() => setInput("Can you recommend a sci-fi movie?")} />
         <Suggestion title="How to Import?" onClick={() => setInput("How do I import a movie?")} />
         <Suggestion title="SocialFlix Help" onClick={() => setInput("Tell me about SocialFlix monetization.")} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-8 bg-white/5 border-t border-white/10 flex gap-4">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Judy anything..."
          className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-red transition-all"
        />
        <button 
          type="submit"
          className="p-4 bg-brand-red text-white rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-brand-red/20"
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}

function Suggestion({ title, onClick }: { title: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/40 transition-all whitespace-nowrap"
    >
      {title}
    </button>
  );
}
