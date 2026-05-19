import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Film, Newspaper, Mic2, Tv2, Clock, MessageCircle, ExternalLink, Globe, Plus, ListPlus } from 'lucide-react';
import { Content, NewsItem, getTitle, UserProfile } from '../types';
import { useTranslation } from '../lib/i18n';

interface MovieHubProps {
  importedItems: Content[];
  onPlay: (content: Content) => void;
  onAddToPlaylist?: (content: Content) => void;
  onAddToWishlist?: (content: Content) => void;
  user?: UserProfile | null;
  preferredLanguage?: string;
}

const NEWS_MOCK: NewsItem[] = [
  {
    id: 'n1',
    title: 'New Dubbing Records for "Dune: Part Two" in Brazil',
    category: 'Dubbing',
    excerpt: 'Brazilian voice actors break records for technical precision in the latest sci-fi epic.',
    content: 'Full story here...',
    imageUrl: 'https://images.unsplash.com/photo-1598897349489-3d008404a4fe?w=800&q=80',
    date: '10 min ago'
  },
  {
    id: 'n2',
    title: 'Actor Profile: Pedro Pascal on Indie Cinema',
    category: 'Actor',
    excerpt: 'From blockbusters to smaller roles Pascal discusses the importance of user-shared content.',
    content: 'Full story...',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
    date: '2 hours ago'
  },
  {
    id: 'n3',
    title: 'Top Voice Actresses You Should Follow',
    category: 'Dubbing',
    excerpt: 'Meet the voices behind your favorite characters across international versions.',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    content: 'Full story...',
    date: '5 hours ago'
  }
];

export default function MovieHub({ importedItems, onPlay, onAddToPlaylist, onAddToWishlist, user, preferredLanguage }: MovieHubProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'releases' | 'news'>('releases');
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(preferredLanguage || 'All');
  const [selectedDubbing, setSelectedDubbing] = useState<'All' | 'Dubbed' | 'Original'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const languages = ['All', ...new Set(importedItems.map(item => item.language).filter(Boolean) as string[])];
  const categories = ['All', ...new Set(importedItems.map(item => item.category).filter(Boolean) as string[])];

  const filteredReleases = importedItems.filter(item => {
    const matchesSearch = getTitle(item).toLowerCase().includes(search.toLowerCase());
    const matchesLanguage = selectedLanguage === 'All' || item.language === selectedLanguage;
    const matchesDubbing = selectedDubbing === 'All' || 
      (selectedDubbing === 'Dubbed' && item.isDubbed) || 
      (selectedDubbing === 'Original' && !item.isDubbed);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesLanguage && matchesDubbing && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">
          {t('hub_title').split(' ')[0]} <span className="text-brand-red">{t('hub_title').split(' ')[1] || 'Hub'}</span>
        </h1>
        <p className="text-white/40 max-w-2xl text-lg mb-8 uppercase tracking-widest font-black text-[10px]">
          {t('hub_subtitle')}
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/5 p-4 border border-white/10 rounded-2xl mb-8">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('releases')}
              className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'releases' ? 'bg-brand-red text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}
            >
              Recent Releases
            </button>
            <button 
              onClick={() => setActiveTab('news')}
              className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'news' ? 'bg-brand-red text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}
            >
              Cinema News
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the hub..."
              className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-red transition-all text-xs"
            />
          </div>
        </div>

        {activeTab === 'releases' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl"
          >
            <div className="flex-1 min-w-[150px]">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-2 block">Language</label>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-red appearance-none"
              >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-2 block">Audio Format</label>
              <div className="flex gap-2">
                {(['All', 'Dubbed', 'Original'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedDubbing(status)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedDubbing === status ? 'bg-brand-red border-brand-red text-white' : 'bg-black/40 border-white/10 text-white/40'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-2 block">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-red appearance-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </motion.div>
        )}
      </header>

      {activeTab === 'releases' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredReleases.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <Film className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">No user-imported releases found</p>
            </div>
          ) : (
            filteredReleases.map((movie) => (
              <motion.div 
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative"
              >
                <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative group-hover:border-brand-red transition-all cursor-pointer" onClick={() => onPlay(movie)}>
                  <img 
                    src={movie.posterPath} 
                    alt={getTitle(movie)} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                  
                  {movie.isDubbed && (
                    <div className="absolute top-4 right-4 bg-brand-red px-2 py-1 rounded text-[8px] font-black uppercase flex items-center gap-1">
                      <Mic2 className="w-2 h-2" /> Dubbed
                    </div>
                  )}

                  <div className="absolute top-4 left-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToWishlist?.(movie);
                      }}
                      className={`p-2 rounded-lg border transition-all ${user?.wishlist?.includes(movie.id.toString()) ? 'bg-brand-red border-brand-red text-white' : 'bg-black/40 border-white/10 text-white hover:bg-white/20'}`}
                    >
                      <Plus className={`w-3 h-3 ${user?.wishlist?.includes(movie.id.toString()) ? 'rotate-45' : ''} transition-transform`} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToPlaylist?.(movie);
                      }}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 text-white hover:bg-brand-red hover:border-brand-red transition-all"
                    >
                      <ListPlus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-black text-brand-red uppercase mb-1">{movie.language || 'Original'}</p>
                    <h3 className="text-sm font-black uppercase italic tracking-tighter leading-tight mb-2">{getTitle(movie)}</h3>
                    <div className="flex items-center gap-2 text-[8px] font-black text-white/40 uppercase">
                      <div className="flex items-center gap-1"><Globe className="w-2 h-2" /> {movie.language || 'INT'}</div>
                      <div className="flex items-center gap-1"><Clock className="w-2 h-2" /> 2h 15m</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center px-1">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <Film className="w-3 h-3 text-white/60" />
                     </div>
                     <span className="text-[10px] font-black text-white/40 uppercase">{movie.importedBy || 'Community'}</span>
                   </div>
                   <button className="text-white/20 hover:text-brand-red transition-colors">
                      <ExternalLink className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {NEWS_MOCK.map((news) => (
            <motion.div 
              key={news.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all flex h-64 group"
            >
              <div className="w-2/5 relative overflow-hidden">
                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white text-black px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">{news.category}</div>
              </div>
              <div className="w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white/20 text-[8px] font-black uppercase mb-4">
                    <Clock className="w-3 h-3" /> {news.date}
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-brand-red transition-colors">{news.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{news.excerpt}</p>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Read Full Story <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
