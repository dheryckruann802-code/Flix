import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, X, Check } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
}

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
];

export default function LanguageSelector({ currentLanguage, onLanguageChange, isOpen, onClose, isMandatory }: LanguageSelectorProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isMandatory ? undefined : onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-app-black border border-white/10 rounded-[40px] overflow-hidden z-[101] shadow-2xl"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Global <span className="text-brand-red">Linguistics</span></h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Select your primary viewing language</p>
              </div>
              {!isMandatory && (
                <button onClick={onClose} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto hide-scrollbar">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.name);
                    onClose();
                  }}
                  className={`flex flex-col p-4 rounded-2xl border transition-all text-left relative group ${
                    currentLanguage === lang.name 
                      ? 'bg-brand-red border-brand-red' 
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${currentLanguage === lang.name ? 'text-white/60' : 'text-white/20'}`}>
                    {lang.name}
                  </span>
                  <span className="text-sm font-black uppercase italic tracking-tight">
                    {lang.native}
                  </span>
                  
                  {currentLanguage === lang.name && (
                    <motion.div 
                      layoutId="check"
                      className="absolute top-4 right-4"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-8 bg-white/5 border-t border-white/10 flex justify-center text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
                This setting personalizes your Movie Hub, news recommendations, and audio preferences.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
