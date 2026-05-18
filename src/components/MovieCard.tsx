/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Info, Star } from 'lucide-react';
import { Content, getTitle } from '../types';

interface MovieCardProps {
  content: Content;
  onClick: (content: Content) => void;
  [key: string]: any;
}

export default function MovieCard({ content, onClick }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const title = getTitle(content);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      layoutId={`card-${content.id}`}
      className="relative flex-none w-48 md:w-64 aspect-video rounded-none overflow-hidden cursor-pointer group bg-white/5 border border-white/10"
      onClick={() => onClick(content)}
    >
      <AnimatePresence mode="wait">
        {isHovered && content.trailerUrl ? (
          <motion.div 
            key="trailer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <video 
              src={content.trailerUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <motion.img
            key="poster"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0.6 }}
            src={content.backdropPath || content.posterPath || 'https://via.placeholder.com/500x750?text=No+Preview'}
            alt={title}
            className="w-full h-full object-cover group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}
      </AnimatePresence>
      
      {/* Custom Progress Bar for cinematic look */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
        <div 
          className="h-full bg-brand-red shadow-[0_0_8px_rgba(229,9,20,0.8)]" 
          style={{ width: `${Math.random() * 80 + 20}%` }} 
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="flex flex-col gap-1">
          <h3 className="meta-text text-white leading-tight line-clamp-1">{title}</h3>
          <p className="text-[9px] uppercase text-white/40 tracking-[0.2em]">New Addition • {content.mediaType}</p>
        </div>
      </div>
    </motion.div>
  );
}
