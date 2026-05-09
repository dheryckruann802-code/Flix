/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Play, Info, Star } from 'lucide-react';
import { Content, getTitle } from '../types';

interface HeroProps {
  content: Content;
}

export default function Hero({ content }: HeroProps) {
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
            <button className="px-10 py-4 bg-[#F5F5F5] text-black font-black uppercase tracking-tighter text-sm hover:bg-brand-red hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
              Watch Trailer
            </button>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="meta-text mb-0.5">Duration</span>
                <span className="text-sm font-medium tracking-tight">2h 46m</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-8">
                <span className="meta-text mb-0.5">Rating</span>
                <span className="text-sm font-medium tracking-tight">PG-13</span>
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
