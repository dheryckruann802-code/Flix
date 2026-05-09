/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Content } from '../types';
import MovieCard from './MovieCard';

interface ContentRowProps {
  title: string;
  items: Content[];
  onSelect: (content: Content) => void;
}

export default function ContentRow({ title, items, onSelect }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/row mb-8 px-4 md:px-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 ml-1">{title}</h2>
      
      <div className="relative flex items-center">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/80 -translate-x-1/2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 scroll-smooth"
        >
          {items.map((item) => (
            <MovieCard key={item.id} content={item} onClick={onSelect} />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/80 translate-x-1/2"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
