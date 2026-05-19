/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Play, Info, Star, Plus, ListPlus } from 'lucide-react';
import { Content, getTitle } from '../types';
import AgeRatingBadge from './AgeRatingBadge';
import { useTranslation } from '../lib/i18n';

interface HeroProps {
  content: Content;
  onPlay: () => void;
  onAddToPlaylist?: (content: Content) => void;
  onAddToWishlist?: (content: Content) => void;
  inWishlist?: boolean;
}

export default function Hero({ content, onPlay, onAddToPlaylist, onAddToWishlist, inWishlist }: HeroProps) {
  const { t } = useTranslation();
  const title = getTitle(content);
  return (
    <div className="relative h-screen w-full mb-12">
      {/* Background with cinematic overlays */}
      <div className="absolute inset-0">
        <img
          src={content.backdropPath || 'https://via.placeholder.com/1920x1080?text=Flix+Experience'}
          alt={title}
          className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-app-black via-app-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-app-black via-transparent to-transparent" />
      </div>

      {/* Floating Badges */}
      <div className="absolute top-8 right-8 z-20 hidden md:flex gap-4">
        <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-widest border border-white/20 font-bold backdrop-blur-md">Trending #1</span>
        <span className="px-3 py-1 bg-red-600 rounded-full text-[10px] uppercase tracking-widest font-black">Free Now</span>
      </div>

      {/* Hero Body Content */}
      <div className="relative h-full flex flex-col justify-end px-6 md:px-16 pb-24 md:pb-32">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="meta-text text-brand-red">Dennis Villeneuve's Masterpiece</span>
          </div>

          <h1 className="text-[70px] md:text-[120px] font-black leading-[0.85] tracking-tighter uppercase mb-10 max-w-5xl drop-shadow-2xl">
            {title.split(':')[0]}<br/>
            <span className="text-brand-red">{title.split(':')[1] || ''}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-10">
            <div className="flex gap-4">
              <button 
                onClick={onPlay}
                className="px-12 py-4 bg-brand-red text-white font-black uppercase tracking-tighter text-sm hover:bg-white hover:text-black transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" /> {t('watch_now')}
              </button>
              <button 
                onClick={() => onAddToWishlist?.(content)}
                className={`px-10 py-4 border font-black uppercase tracking-tighter text-sm transition-all transform active:scale-95 flex items-center gap-3 ${inWishlist ? 'bg-brand-red border-brand-red text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
              >
                <Plus className={`w-5 h-5 ${inWishlist ? 'rotate-45' : ''} transition-transform`} /> {t('add_to_wishlist')}
              </button>
              <button 
                onClick={() => onAddToPlaylist?.(content)}
                className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-tighter text-sm hover:bg-white/10 transition-all transform active:scale-95 flex items-center gap-3"
              >
                <ListPlus className="w-5 h-5" /> Playlist
              </button>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="meta-text mb-0.5">Duration</span>
                <span className="text-sm font-medium tracking-tight">2h 46m</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-8">
                <span className="meta-text mb-0.5">Rating</span>
                <div className="mt-1 flex flex-col items-center">
                   <span className="text-[8px] font-black opacity-40 mb-1">N</span>
                   <AgeRatingBadge rating={content.isExplicit ? (content.ageRating || 18) : 0} />
                </div>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-8">
                <span className="meta-text mb-0.5">Vote</span>
                <span className="text-sm font-medium tracking-tight flex items-center gap-1.5 underline decoration-brand-red decoration-2 underline-offset-4">
                  <Star className="w-3 h-3 fill-brand-red text-brand-red" />
                  {content.voteAverage.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
