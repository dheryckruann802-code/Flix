/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Coins, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Clapperboard,
  Music2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye
} from 'lucide-react';
import { SocialPost } from '../types';

const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 's1',
    userId: 'u1',
    username: 'FilmCutter',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-in-the-mountains-under-the-clouds-42211-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644ef7467?w=800&q=80',
    description: 'The cinematography in this scene is unmatched! #Dune #Cinema #Visuals',
    contentTitle: 'Dune: Part Two',
    tags: ['Cinema', 'Epic'],
    likes: 12400,
    views: 85400,
    comments: 450,
    isExplicit: false,
    monetizationEnabled: true,
    earnings: 45.20
  },
  {
    id: 's2',
    userId: 'u2',
    username: 'HorrorNights',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mysterious-forest-at-night-with-moonlight-41851-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&q=80',
    description: 'Check out this jump scare from the new late night release. ⚠️ WARNING: EXPLICIT CONTENT',
    contentTitle: 'Late Night with the Devil',
    tags: ['Horror', 'Explicit'],
    likes: 8900,
    views: 42100,
    comments: 1100,
    isExplicit: true,
    monetizationEnabled: true,
    earnings: 128.50
  },
  {
    id: 's3',
    userId: 'u3',
    username: 'ReviewQueen',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-a-sunny-field-42777-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492446845049-9c50cc313f00?w=800&q=80',
    description: 'Succession finale recap - did they really win? #Succession #TVShow',
    contentTitle: 'Succession',
    tags: ['Succession', 'TV'],
    likes: 45200,
    views: 120500,
    comments: 3200,
    isExplicit: false,
    monetizationEnabled: true,
    earnings: 342.10
  }
];

interface SocialFlixProps {
  userAge: number;
}

export default function SocialFlix({ userAge }: SocialFlixProps) {
  const [posts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredPosts = useMemo(() => {
    // SafeSearch logic: filter out explicit content if user is under 18
    if (userAge < 18) {
      return posts.filter(post => !post.isExplicit);
    }
    return posts;
  }, [posts, userAge]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const index = Math.round(scrollContainerRef.current.scrollTop / scrollContainerRef.current.clientHeight);
      setActiveIndex(index);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-black overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col w-80 border-r border-white/10 p-8 h-full bg-app-black">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
          Social<span className="text-brand-red">Flix</span>
        </h2>
        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-8">Creative Feed</p>
        
        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3 text-brand-red">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-sm">SafeSearch Active</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Content is automatically filtered based on your profile age ({userAge}y). 
              Explicit content is only visible to 18+.
            </p>
          </div>

          <div className="p-4 bg-brand-red/10 rounded-2xl border border-brand-red/20">
            <div className="flex items-center gap-3 mb-3 text-brand-red">
              <DollarSign className="w-5 h-5" />
              <span className="font-bold text-sm">AI Monetization</span>
            </div>
            <p className="text-[10px] text-brand-red/80 leading-relaxed font-medium">
              Your content earns reward tokens based on engagement quality and AI safety scores.
            </p>
          </div>

          <button className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-red hover:text-white transition-all uppercase tracking-tighter">
            <Plus className="w-5 h-5" /> Post Video
          </button>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>Trending Tags</span>
            <TrendingUp className="w-3 h-3" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['#Cinema', '#Oscars', '#Bloopers', '#Cuts'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/60 hover:text-white cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Video Feed */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 h-screen overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
      >
        {filteredPosts.map((post, index) => (
          <div 
            key={post.id}
            className="h-screen w-full relative snap-start bg-black flex items-center justify-center"
          >
            {/* Background Video Layer */}
            <div className="absolute inset-0 z-0">
               <video 
                  src={post.videoUrl} 
                  autoPlay={activeIndex === index}
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover opacity-60 grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            </div>

            {/* Content Overlay */}
            <div className="z-10 w-full max-w-lg px-8 flex items-end justify-between pb-32 md:pb-12 md:mb-12">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center font-bold">
                       {post.username[0]}
                    </div>
                    <div>
                       <h3 className="font-bold text-lg">@{post.username}</h3>
                       <span className="text-[10px] text-brand-red font-black uppercase tracking-widest flex items-center gap-1">
                         <Clapperboard className="w-3 h-3" /> {post.contentTitle}
                       </span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex gap-2 mb-6">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-white/40">#{tag}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    {post.monetizationEnabled && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                         <Coins className="w-3 h-3 text-yellow-500" />
                         <span className="text-[10px] font-black text-yellow-500 uppercase">AI EARNED: ${post.earnings}</span>
                      </div>
                    )}
                    {post.isExplicit ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-red/10 border border-brand-red/20 rounded-full">
                         <ShieldAlert className="w-3 h-3 text-brand-red" />
                         <span className="text-[10px] font-black text-brand-red uppercase">ADULT ONLY</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                         <ShieldCheck className="w-3 h-3 text-green-500" />
                         <span className="text-[10px] font-black text-green-500 uppercase">SAFE FOR ALL</span>
                      </div>
                    )}
                  </div>
               </div>

               {/* Interaction Buttons */}
               <div className="flex flex-col gap-6 ml-6 pb-2">
                  <InteractionButton icon={<Eye className="w-7 h-7" />} label={post.views} />
                  <InteractionButton icon={<Heart className="w-7 h-7" />} label={post.likes} />
                  <InteractionButton icon={<MessageCircle className="w-7 h-7" />} label={post.comments} />
                  <InteractionButton icon={<Share2 className="w-7 h-7" />} />
                  <div className="w-12 h-12 bg-white/10 rounded-full border border-white/20 flex items-center justify-center animate-spin-slow">
                    <Music2 className="w-6 h-6 text-white/40" />
                  </div>
               </div>
            </div>

            {/* Mobile Header Info */}
            <div className="md:hidden absolute top-12 left-0 right-0 px-8 flex items-center justify-between z-20">
               <div className="text-brand-red font-black text-2xl tracking-tighter italic">SocialFlix</div>
               <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  <span className="text-[8px] font-black uppercase text-white/60">Age: {userAge}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Alert for Minor (if they try to scroll too fast or similar) */}
      <AnimatePresence>
        {userAge < 18 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden fixed bottom-24 left-8 right-8 z-30"
          >
            <div className="bg-blue-600/20 backdrop-blur-xl border border-blue-600/30 p-3 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">
                SafeSearch is protecting your experience. Adult content hidden.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InteractionButton({ icon, label }: { icon: React.ReactNode, label?: string | number }) {
  return (
    <button className="group flex flex-col items-center gap-1">
      <div className="p-3 bg-white/5 rounded-full backdrop-blur-xl border border-white/10 group-hover:bg-brand-red group-hover:text-white transition-all transform group-active:scale-90">
        {icon}
      </div>
      {label && <span className="text-xs font-bold text-white shadow-sm">{typeof label === 'number' && label > 1000 ? (label/1000).toFixed(1)+'k' : label}</span>}
    </button>
  );
}
