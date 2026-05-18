/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MessageSquare, Heart, ThumbsUp, Filter, User, Calendar } from 'lucide-react';
import { Comment, CommunityCategory } from '../types';

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    userId: 'u1',
    username: 'CinematicExpert',
    contentId: '1',
    contentTitle: 'Dune: Part Two',
    category: 'Review',
    text: "Absolutely breathtaking. The sound design and the scale of the production are unlike anything we've seen in the last decade. Villeneuve is a visionary.",
    timestamp: '2 hours ago',
    likes: 124
  },
  {
    id: '2',
    userId: 'u2',
    username: 'NolanFanboy',
    contentId: '2',
    contentTitle: 'Oppenheimer',
    category: 'Theory',
    text: "The ending sequence still haunts me. I noticed a detail in the silence during the blast that suggests a deeper meaning about the chain reaction...",
    timestamp: '5 hours ago',
    likes: 89
  },
  {
    id: '3',
    userId: 'u3',
    username: 'SeriesBinge',
    contentId: '3',
    contentTitle: 'Succession',
    category: 'Discussion',
    text: "Does anyone else feel like the Roy kids were doomed from the start? Re-watching Season 1 makes the finale so much more impactful.",
    timestamp: '1 day ago',
    likes: 56
  },
  {
    id: '4',
    userId: 'u4',
    username: 'HorrorLover',
    contentId: '4',
    contentTitle: 'Talk To Me',
    category: 'Review',
    text: "Freshest horror concept in years. Simple, effective, and truly terrifying without relying on jump scares.",
    timestamp: '2 days ago',
    likes: 210
  }
];

const CATEGORIES: CommunityCategory[] = ['All', 'Discussion', 'Review', 'Theory', 'News'];

export default function Community() {
  const [activeCategory, setActiveCategory] = useState<CommunityCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

  const filteredComments = useMemo(() => {
    return comments.filter(comment => {
      const matchesCategory = activeCategory === 'All' || comment.category === activeCategory;
      const matchesSearch = (comment.contentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || false) || 
                            comment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            comment.username.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, comments]);

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h2 className="text-[60px] font-black tracking-tighter uppercase italic leading-none mb-4">
          Community<span className="text-brand-red">Hub</span>
        </h2>
        <p className="meta-text text-white/40">Connect with fellow cinephiles and share your thoughts</p>
      </header>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-red transition-colors" />
          <input 
            type="text"
            placeholder="Search discussions, reviews, theories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-red transition-all"
          />
        </div>
        
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl overflow-x-auto hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-xl meta-text whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-brand-red text-white' : 'hover:bg-white/5 text-white/40'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 font-black text-brand-red">
                    {comment.username[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-brand-red transition-colors">{comment.username}</h4>
                    <div className="flex items-center gap-2 mt-0.5 opacity-40">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] uppercase font-semibold">{comment.timestamp}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  comment.category === 'Review' ? 'bg-green-600' : 
                  comment.category === 'Theory' ? 'bg-purple-600' :
                  'bg-white/10'
                }`}>
                  {comment.category}
                </span>
              </div>

              <div className="mb-6">
                <span className="meta-text text-brand-red block mb-2">{comment.contentTitle}</span>
                <p className="text-white/70 leading-relaxed italic">"{comment.text}"</p>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                <button className="flex items-center gap-2 text-white/40 hover:text-brand-red transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs font-bold">{comment.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold">Reply</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredComments.length === 0 && (
        <div className="py-32 text-center">
          <MessageSquare className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h3 className="text-2xl font-black tracking-tighter uppercase opacity-20">No discussions found</h3>
          <p className="meta-text opacity-10 mt-2">Try adjusting your search or category</p>
        </div>
      )}
    </div>
  );
}
