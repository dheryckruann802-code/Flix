/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Maximize2, HardDrive, BrainCircuit } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'judy';
}

export default function JudyAI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm Judy, your AI cinematic assistant. I can now upscale your imports to 4K and sync your cloud assets for offline playback!", sender: 'judy' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const simulateTask = (taskName: string) => {
    setActiveTask(taskName);
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setActiveTask(null);
          setMessages(prevMsgs => [...prevMsgs, { 
            id: Date.now().toString(), 
            text: `✅ ${taskName} complete! Your content is now optimized.`, 
            sender: 'judy' 
          }]);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleAction = (type: 'upscale' | 'sync') => {
    if (type === 'upscale') simulateTask('AI 4K Upscaling');
    else simulateTask('Offline Cloud Sync');
  };

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
    if (q.includes('upscale')) return "I can enhance any low-resolution content using my deep-learning models. Click the 'Upscale 4K' button to begin!";
    if (q.includes('offline') || q.includes('sync')) return "I can download and cache your entire cloud library so you can watch movies without an internet connection. Try 'Offline Sync'!";
    if (q.includes('movie') || q.includes('recommend')) return "Based on your taste, I'd recommend 'Dune: Part Two' for its epic scale or 'Arrival' if you want something more cerebral.";
    return "I'm your cinematic brain! I handle 4K enhancement, offline syncing, and recommendations.";
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col bg-app-black border border-white/10 rounded-[40px] overflow-hidden mt-12 mb-12 shadow-2xl shadow-brand-red/10">
      {/* Header */}
      <div className="p-8 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center shadow-lg shadow-brand-red/20">
             <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Judy AI</h2>
            <p className="meta-text text-brand-red">Quantum Cinematic Intelligence</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleAction('upscale')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-brand-red hover:text-white transition-all disabled:opacity-50 group"
          >
            <Maximize2 className="w-4 h-4 text-brand-red group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">Upscale 4K</span>
          </button>
          <button 
            onClick={() => handleAction('sync')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 group"
          >
            <HardDrive className="w-4 h-4 text-orange-500 group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">Offline Sync</span>
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="px-8 py-4 bg-brand-red/10 border-b border-brand-red/20 space-y-2">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">{activeTask}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">{progress}%</span>
           </div>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-brand-red" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
           </div>
        </div>
      )}

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

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-8 bg-white/5 border-t border-white/10 flex gap-4">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Judy about 4K upscaling or offline play..."
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
