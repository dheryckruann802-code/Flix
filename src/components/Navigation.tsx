/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Tv, Search, User, PlayCircle, Plus, Users, Clapperboard, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewType } from '../types';

interface NavigationProps {
  onSearchClick: () => void;
  onImportClick: () => void;
  onViewChange: (view: ViewType) => void;
  currentView: ViewType;
}

export default function Navigation({ onSearchClick, onImportClick, onViewChange, currentView }: NavigationProps) {
  return (
    <>
      {/* Dynamic Top Bar for Mobile */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 bg-gradient-to-b from-black to-transparent">
        <div 
          className="text-brand-red font-black text-3xl tracking-tighter italic cursor-pointer"
          onClick={() => onViewChange('home')}
        >FLIX</div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onViewChange('social')} 
              className={`p-2 rounded-full ${currentView === 'social' ? 'bg-brand-red text-white' : 'bg-white/10 text-white/60'}`}
            >
              <Clapperboard className="w-5 h-5" />
            </button>
            <button onClick={onImportClick} className="p-2 bg-white/10 rounded-full text-white/60">
              <Plus className="w-5 h-5" />
            </button>
            <button onClick={onSearchClick} className="p-2 bg-white/10 rounded-full text-white/60">
               <Search className="w-5 h-5" />
            </button>
          </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-24 border-r border-white/10 flex-col items-center py-10 justify-between z-[60] bg-app-black">
        <div className="flex flex-col gap-16 items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-brand-red font-black text-2xl tracking-tighter italic cursor-pointer"
            onClick={() => onViewChange('home')}
          >
            FLIX
          </motion.div>
          
          <div className="flex flex-col gap-10 text-white/40">
            <NavIcon icon={<Home className="w-6 h-6" />} active={currentView === 'home'} onClick={() => onViewChange('home')} />
            <NavIcon icon={<Users className="w-6 h-6" />} active={currentView === 'community'} onClick={() => onViewChange('community')} />
            <NavIcon icon={<Clapperboard className="w-6 h-6" />} active={currentView === 'social'} onClick={() => onViewChange('social')} />
            <NavIcon icon={<Sparkles className="w-6 h-6" />} active={currentView === 'judy'} onClick={() => onViewChange('judy')} />
            <NavIcon icon={<Tv className="w-6 h-6" />} />
            <button onClick={onSearchClick} className="p-3 hover:text-brand-red transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button onClick={onImportClick} className="p-3 hover:text-brand-red transition-colors">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          onClick={() => onViewChange('profile')}
          className={`w-10 h-10 border rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${currentView === 'profile' ? 'bg-brand-red border-brand-red text-white' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/40'}`}
        >
          U
        </div>
      </nav>

      {/* Mobile Bottom Rail */}
      <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-surface rounded-full p-2 flex items-center gap-1 shadow-2xl px-4 scale-90">
        <NavIcon icon={<Home className="w-5 h-5" />} active={currentView === 'home'} onClick={() => onViewChange('home')} mobile />
        <NavIcon icon={<Users className="w-5 h-5" />} active={currentView === 'community'} onClick={() => onViewChange('community')} mobile />
        <NavIcon icon={<Clapperboard className="w-5 h-5" />} active={currentView === 'social'} onClick={() => onViewChange('social')} mobile />
        <button onClick={onImportClick} className="p-3 rounded-xl transition-all text-white/60 hover:text-white">
          <Plus className="w-5 h-5" />
        </button>
        <NavIcon icon={<Sparkles className="w-5 h-5" />} active={currentView === 'judy'} onClick={() => onViewChange('judy')} mobile />
        <NavIcon icon={<User className="w-5 h-5" />} active={currentView === 'profile'} onClick={() => onViewChange('profile')} mobile />
      </nav>
    </>
  );
}

function NavIcon({ icon, active = false, mobile = false, onClick }: { icon: React.ReactNode, active?: boolean, mobile?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-xl transition-all ${active ? 'text-brand-red scale-110' : 'hover:text-white'}`}
    >
      {icon}
    </button>
  );
}
