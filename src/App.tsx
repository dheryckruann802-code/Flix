/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Loader2, Plus, Upload, Film, Tv } from 'lucide-react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ContentRow from './components/ContentRow';
import Community from './components/Community';
import SocialFlix from './components/SocialFlix';
import UserProfile from './components/UserProfile';
import JudyAI from './components/JudyAI';
import { getTrending, searchContent } from './services/api';
import { Content, getTitle, ViewType, UserProfile as UserProfileType } from './types';

export default function App() {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [trending, setTrending] = useState<Content[]>([]);
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [importedItems, setImportedItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [userAge, setUserAge] = useState(16); // Default for testing SafeSearch
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Import form state
  const [importTitle, setImportTitle] = useState('');
  const [importType, setImportType] = useState<'movie' | 'tv'>('movie');
  const [importPoster, setImportPoster] = useState('');
  const [importPosterFile, setImportPosterFile] = useState<File | null>(null);
  const [aspectRatioError, setAspectRatioError] = useState<string | null>(null);
  const [importOverview, setImportOverview] = useState('');
  const [importVideo, setImportVideo] = useState<File | null>(null);
  const [importAuthor, setImportAuthor] = useState('');
  const [importDirector, setImportDirector] = useState('');
  const [importDubbers, setImportDubbers] = useState('');
  const [importCategory, setImportCategory] = useState('');
  const [importIsExplicit, setImportIsExplicit] = useState(false);
  const [importAgeRating, setImportAgeRating] = useState(14);

  useEffect(() => {
    async function init() {
      const all = await getTrending('all');
      setTrending(all);
      
      const mov = await getTrending('movie');
      setMovies(mov);
      
      const tv = await getTrending('tv');
      setSeries(tv);
      
      setLoading(false);
    }
    init();

    // Fetch user info
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          // Enhance mock data for demonstration if stats aren't in session yet
          setUser({
            ...userData,
            bio: 'Filmmaker and tech enthusiast. Sharing my favorite cuts and reviews from the world of cinema.',
            subscribers: 12500,
            totalViews: 850300,
            totalEarnings: 1540.25,
            posts: [
              {
                id: 'p1',
                userId: userData.id,
                username: userData.username,
                videoUrl: '',
                thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644ef7467?w=800&q=80',
                description: 'The lighting in Dune is just perfection.',
                contentTitle: 'Dune: Part Two',
                tags: ['Dune', 'Cinematography'],
                likes: 4500,
                views: 45000,
                comments: 120,
                isExplicit: false,
                monetizationEnabled: true,
                earnings: 25.40
              }
            ]
          });
        }
      } catch (e) {
        console.error('Failed to fetch user', e);
      }
    };
    fetchUser();

    // Handle OAuth messages
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        fetchUser();
      }
    };
    window.addEventListener('message', handleAuthMessage);

    // Load from local storage
    const saved = localStorage.getItem('flix_imported');
    if (saved) {
      setImportedItems(JSON.parse(saved));
    }

    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      window.open(url, 'google_auth', 'width=600,height=700');
    } catch (e) {
      console.error('Login failed', e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const validatePoster = (file: File) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = img.width / img.height;
      const minRatio = 9 / 16; // 0.5625
      const maxRatio = 68.6 / 101.6; // 0.6752
      
      if (ratio < minRatio || ratio > maxRatio) {
        setAspectRatioError(`Invalid aspect ratio (${ratio.toFixed(3)}). Please use a vertical poster (Standard One-Sheet or 9:16).`);
        setImportPosterFile(null);
      } else {
        setAspectRatioError(null);
        setImportPosterFile(file);
      }
      URL.revokeObjectURL(img.src);
    };
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      const handler = setTimeout(async () => {
        const results = await searchContent(searchQuery);
        setSearchResults(results);
      }, 500);
      return () => clearTimeout(handler);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (aspectRatioError) return;
    
    // Create a temporary URL for the video if provided
    let videoUrl = '';
    if (importVideo) {
      videoUrl = URL.createObjectURL(importVideo);
    }

    let posterUrl = importPoster;
    if (importPosterFile) {
      posterUrl = URL.createObjectURL(importPosterFile);
    }

    const newItem: Content = {
      id: Date.now(),
      title: importTitle,
      name: importTitle,
      overview: importOverview,
      posterPath: posterUrl || 'https://via.placeholder.com/500x750?text=Imported+Media',
      backdropPath: posterUrl || 'https://via.placeholder.com/1920x1080?text=Imported+Media',
      releaseDate: new Date().toISOString(),
      voteAverage: 10,
      mediaType: importType,
      videoUrl: videoUrl,
      author: importAuthor,
      director: importDirector,
      dubbers: importDubbers,
      category: importCategory,
      isExplicit: importIsExplicit,
      ageRating: importIsExplicit ? importAgeRating : undefined
    };

    const updated = [newItem, ...importedItems];
    setImportedItems(updated);
    localStorage.setItem('flix_imported', JSON.stringify(updated));
    
    // Reset and close
    setImportTitle('');
    setImportPoster('');
    setImportPosterFile(null);
    setImportOverview('');
    setImportAuthor('');
    setImportDirector('');
    setImportDubbers('');
    setImportCategory('');
    setImportIsExplicit(false);
    setImportAgeRating(14);
    setImportVideo(null);
    setAspectRatioError(null);
    setShowImport(false);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-netflix-black gap-4">
        <Loader2 className="w-12 h-12 text-brand-red animate-spin" />
        <div className="text-brand-red font-display text-4xl font-black italic tracking-tighter animate-pulse">
            FLIX
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-black cinematic-gradient flex">
      <Navigation 
        onSearchClick={() => setShowSearch(true)} 
        onImportClick={() => setShowImport(true)} 
        onViewChange={setCurrentView}
        currentView={currentView}
      />

          <div className="flex-1 md:pl-24">
            <AnimatePresence mode="wait">
              {currentView === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {trending.length > 0 && <Hero content={trending[0]} />}

                  <main className="relative z-10 px-0 md:px-0 -mt-16 md:-mt-32 space-y-16 pb-32">
                    {importedItems.length > 0 && (
                      <ContentRow title="Imported by You" items={importedItems} onSelect={setSelectedContent} />
                    )}
                    <ContentRow title="Continue Browsing" items={movies} onSelect={setSelectedContent} />
                    <ContentRow title="Top Series Pick" items={series} onSelect={setSelectedContent} />
                    <ContentRow title="New Releases" items={[...trending].reverse()} onSelect={setSelectedContent} />
                    
                    <footer className="mt-24 border-t border-white/5 py-10 px-8 flex flex-col md:flex-row items-center justify-between meta-text opacity-40">
                      <div className="flex gap-12 mb-4 md:mb-0">
                         <span>Free License: v4.2.0</span>
                         <span>Server: Primary-West</span>
                      </div>
                      <div className="flex gap-10">
                         <span className="cursor-pointer hover:text-white">Privacy Policy</span>
                         <span className="cursor-pointer hover:text-white">Terms of Use</span>
                      </div>
                    </footer>
                  </main>
                </motion.div>
              )}
              {currentView === 'community' && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pt-24 md:pt-0"
                >
                  <Community />
                </motion.div>
              )}
              {currentView === 'social' && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SocialFlix userAge={userAge} />
                </motion.div>
              )}
              {currentView === 'judy' && (
                <motion.div
                  key="judy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <JudyAI />
                </motion.div>
              )}
              {currentView === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UserProfile 
                    profile={user} 
                    onLogin={handleLogin} 
                    onLogout={handleLogout} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-app-black border border-white/20 w-full max-w-2xl rounded-[40px] overflow-hidden p-10 shadow-2xl shadow-brand-red/10"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Import Media</h2>
                  <p className="meta-text text-white/40 mt-1">Add a custom title to your library</p>
                </div>
                <button onClick={() => setShowImport(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X />
                </button>
              </div>

              <form onSubmit={handleImport} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 hide-scrollbar">
                <div className="bg-brand-red/10 p-6 rounded-[32px] border border-brand-red/20 mb-8 text-center">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Initialize AI Monetization</h3>
                  <p className="text-[10px] text-brand-red/60 font-bold uppercase tracking-widest">Enable AI-driven revenue sharing for this content</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="meta-text mb-2 block">Content Title</label>
                    <input 
                      required
                      value={importTitle}
                      onChange={(e) => setImportTitle(e.target.value)}
                      placeholder="e.g. My Awesome Short Film"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="meta-text mb-2 block">Category</label>
                    <select 
                      value={importCategory}
                      onChange={(e) => setImportCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red transition-colors appearance-none"
                    >
                      <option value="" className="bg-app-black">Select Category</option>
                      <option value="Action" className="bg-app-black">Action</option>
                      <option value="Comedy" className="bg-app-black">Comedy</option>
                      <option value="Drama" className="bg-app-black">Drama</option>
                      <option value="Horror" className="bg-app-black">Horror</option>
                      <option value="Sci-Fi" className="bg-app-black">Sci-Fi</option>
                      <option value="Documentary" className="bg-app-black">Documentary</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setImportType('movie')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${importType === 'movie' ? 'bg-brand-red border-brand-red' : 'bg-white/5 border-white/10 opacity-50'}`}
                  >
                    <Film />
                    <span className="meta-text text-white">Movie</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setImportType('tv')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${importType === 'tv' ? 'bg-brand-red border-brand-red' : 'bg-white/5 border-white/10 opacity-50'}`}
                  >
                    <Tv />
                    <span className="meta-text text-white">Series</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="meta-text mb-2 block text-brand-red flex items-center gap-2">
                       <Upload className="w-4 h-4" /> Import Video File
                    </label>
                    <div className="relative group">
                      <input 
                        type="file"
                        accept="video/*"
                        onChange={(e) => setImportVideo(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2 group-hover:border-brand-red transition-colors">
                        <span className="text-sm text-white/40 truncate">
                          {importVideo ? importVideo.name : 'Click to select video'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="meta-text mb-2 block flex items-center justify-between">
                       <span>Poster Image (Cartaz)</span>
                       <span className="text-[9px] opacity-40">Ratio: 9:16 (Min) to 68.6:101.6 (Max)</span>
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1 group">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) validatePoster(file);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full bg-white/5 border border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center gap-2 transition-all ${aspectRatioError ? 'border-red-500 bg-red-500/5' : 'border-white/20 group-hover:border-brand-red'}`}>
                          <Upload className={`w-8 h-8 ${aspectRatioError ? 'text-red-500' : 'text-white/20'}`} />
                          <span className="text-sm text-white/40 font-bold uppercase tracking-tighter">
                            {importPosterFile ? importPosterFile.name : 'Drag or click to upload poster'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <span className="meta-text text-white/20">OR External URL</span>
                        <input 
                          value={importPoster}
                          onChange={(e) => {
                            setImportPoster(e.target.value);
                            setImportPosterFile(null);
                            setAspectRatioError(null);
                          }}
                          placeholder="https://example.com/poster.jpg"
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red text-sm"
                        />
                      </div>
                    </div>
                    {aspectRatioError && (
                      <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-wider">{aspectRatioError}</p>
                    )}
                    {(importPosterFile || importPoster) && !aspectRatioError && (
                      <div className="mt-4 flex items-center gap-4 bg-green-500/10 border border-green-500/20 p-2 rounded-lg">
                        <div className="w-10 h-14 bg-white/10 rounded overflow-hidden">
                           <img 
                              src={importPosterFile ? URL.createObjectURL(importPosterFile) : importPoster} 
                              className="w-full h-full object-cover"
                           />
                        </div>
                        <span className="text-[10px] text-green-500 font-bold uppercase">Poster ready for import</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="meta-text mb-2 block">Author</label>
                    <input 
                      value={importAuthor}
                      onChange={(e) => setImportAuthor(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="meta-text mb-2 block">Director</label>
                    <input 
                      value={importDirector}
                      onChange={(e) => setImportDirector(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="meta-text mb-2 block">Voice Actors</label>
                    <input 
                      value={importDubbers}
                      onChange={(e) => setImportDubbers(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <label className="meta-text">Content Rating</label>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setImportIsExplicit(false)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${!importIsExplicit ? 'bg-green-600 text-white' : 'bg-white/10 text-white/40'}`}
                      >
                        Not Explicit
                      </button>
                      <button 
                        type="button"
                        onClick={() => setImportIsExplicit(true)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${importIsExplicit ? 'bg-brand-red text-white' : 'bg-white/10 text-white/40'}`}
                      >
                        Explicit
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {importIsExplicit && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <label className="meta-text mb-2 block text-white/40 italic">Minimum Age Required</label>
                          <select 
                            value={importAgeRating}
                            onChange={(e) => setImportAgeRating(Number(e.target.value))}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-brand-red transition-colors appearance-none"
                          >
                            <option value={14} className="bg-app-black text-white">14+</option>
                            <option value={16} className="bg-app-black text-white">16+</option>
                            <option value={18} className="bg-app-black text-white">18+</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="meta-text mb-2 block">Overview / Description</label>
                  <textarea 
                    value={importOverview}
                    onChange={(e) => setImportOverview(e.target.value)}
                    rows={2}
                    placeholder="What is this media about?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-tighter rounded-xl hover:bg-brand-red hover:text-white transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  Confirm Import
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-4 md:p-12 overflow-y-auto"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div className="flex-1 flex items-center gap-4 bg-white/10 rounded-2xl px-6 py-4 border border-white/20">
                  <Search className="text-white/40" />
                  <input
                    autoFocus
                    placeholder="Search movies, series, actors..."
                    className="flex-1 bg-transparent border-none outline-none text-xl font-medium placeholder:text-white/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setShowSearch(false)}
                  className="ml-6 p-4 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
                  {searchResults.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedContent(item);
                        setShowSearch(false);
                      }}
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2">
                        <img 
                          src={item.posterPath || 'https://via.placeholder.com/500x750?text=No+Poster'} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h3 className="font-medium text-sm truncate">{getTitle(item)}</h3>
                    </motion.div>
                  ))}
                </div>
              ) : searchQuery.length > 2 ? (
                <div className="text-center py-24 text-white/40">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="text-center py-24 text-white/20">
                   Start typing to discover amazing content...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Detail Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedContent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-netflix-black w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedContent(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/80 transition-colors"
              >
                <X />
              </button>
              
              <div className="flex flex-col md:flex-row">
                 <div className="w-full md:w-1/3 aspect-[2/3]">
                    <img 
                       src={selectedContent.posterPath} 
                       className="w-full h-full object-cover"
                       referrerPolicy="no-referrer"
                    />
                 </div>
                 <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <div className="uppercase tracking-[0.3em] text-brand-red font-bold text-xs mb-4">
                        Featured {selectedContent.mediaType}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-black mb-6 italic">{getTitle(selectedContent)}</h2>
                    <div className="flex items-center gap-6 mb-8 text-white/60">
                        <span className="flex items-center gap-1.5 text-yellow-500">
                             <Search className="w-4 h-4 fill-current" />
                             <span className="font-bold text-lg">{selectedContent.voteAverage.toFixed(1)}</span>
                        </span>
                        <span>{selectedContent.releaseDate?.split('-')[0]}</span>
                        <span className="px-2 py-0.5 border border-white/20 rounded text-xs">{selectedContent.category || '4K Ultra HD'}</span>
                        {selectedContent.isExplicit && (
                          <span className="px-2 py-0.5 bg-brand-red text-white rounded text-[10px] font-black uppercase">
                            {selectedContent.ageRating}+
                          </span>
                        )}
                    </div>
                    
                    {/* Metadata Grid */}
                    {(selectedContent.director || selectedContent.author || selectedContent.dubbers) && (
                      <div className="grid grid-cols-2 gap-4 mb-8 text-xs p-4 bg-white/5 border border-white/10 rounded-xl">
                        {selectedContent.director && (
                          <div>
                            <span className="meta-text block opacity-40 mb-1">Director</span>
                            <span className="font-medium">{selectedContent.director}</span>
                          </div>
                        )}
                        {selectedContent.author && (
                          <div>
                            <span className="meta-text block opacity-40 mb-1">Author</span>
                            <span className="font-medium">{selectedContent.author}</span>
                          </div>
                        )}
                        {selectedContent.dubbers && (
                          <div className="col-span-2">
                            <span className="meta-text block opacity-40 mb-1">Voice Actors</span>
                            <span className="font-medium">{selectedContent.dubbers}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-lg text-white/70 leading-relaxed mb-10">
                        {selectedContent.overview}
                    </p>
                    <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            if (selectedContent.videoUrl) {
                              window.open(selectedContent.videoUrl, '_blank');
                            }
                          }}
                          className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-brand-red text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
                        >
                            Play
                        </button>
                        <button className="flex items-center justify-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border border-white/10">
                            <Search className="w-6 h-6 rotate-45" />
                        </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
