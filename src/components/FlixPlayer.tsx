/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw,
  Subtitles,
  Activity,
  ChevronDown,
  Star,
  MessageCircle,
  X,
  FastForward
} from 'lucide-react';
import { Content, Comment } from '../types';
import AgeRatingBadge from './AgeRatingBadge';

interface FlixPlayerProps {
  content: Content;
  onClose: () => void;
  user: any; // User profile for commenting
}

export default function FlixPlayer({ content, onClose, user }: FlixPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [audioQuality, setAudioQuality] = useState('Dolby Atmos');
  
  // Subtitle custom state
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [subtitleFontSize, setSubtitleFontSize] = useState(24);
  const [subtitleColor, setSubtitleColor] = useState('#FFFFFF');
  const [subtitleBgOpacity, setSubtitleBgOpacity] = useState(0.5);
  const [subtitleFontFamily, setSubtitleFontFamily] = useState('Inter');
  const [isSpeechActive, setIsSpeechActive] = useState(false); // AI Speech detection mock

  const [showSettings, setShowSettings] = useState(false);
  const [showSubSettings, setShowSubSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  
  // Review state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      userId: 'u_crit',
      username: 'MovieBuff42',
      text: 'The visual effects in this are absolutely stunning. A must watch in 4K!',
      rating: 5,
      timestamp: '2h ago',
      likes: 24
    },
    {
      id: 'c2',
      userId: 'u_norm',
      username: 'CasualViewer',
      text: 'Good movie, a bit slow in the middle though.',
      rating: 4,
      timestamp: '5h ago',
      likes: 12
    }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock AI Speech Detection logic
    const interval = setInterval(() => {
      if (isPlaying) {
        setIsSpeechActive(Math.random() > 0.3);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
      setCurrentTime(formatTime(current));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert("Please login to comment");
        return;
    }
    if (!reviewText.trim() || rating === 0) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      text: reviewText,
      rating: rating,
      timestamp: 'Just now',
      likes: 0
    };

    setComments([newComment, ...comments]);
    setReviewText('');
    setRating(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-y-auto flex flex-col pt-24 md:pt-0"
    >
      {/* Back Button */}
      <button 
        onClick={onClose}
        className="absolute top-8 left-8 z-[110] p-4 bg-white/5 hover:bg-brand-red rounded-full backdrop-blur-xl border border-white/10 transition-all text-white"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Player Area */}
      <div 
        ref={playerRef}
        className="relative aspect-video w-full max-w-7xl mx-auto bg-black shadow-2xl group"
      >
          <video 
            ref={videoRef}
            src={content.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
          />

          {/* AI Active Captions */}
          <AnimatePresence>
            {showSubtitles && isSpeechActive && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none text-center"
              >
                <span 
                  style={{ 
                    fontSize: `${subtitleFontSize}px`, 
                    color: subtitleColor, 
                    backgroundColor: `rgba(0,0,0,${subtitleBgOpacity})`,
                    fontFamily: subtitleFontFamily 
                  }}
                  className="px-6 py-2 rounded-xl backdrop-blur-sm shadow-2xl font-bold transition-all"
                >
                  AI Judy: "Welcome to SocialFlix, where cinema meets intelligence."
                </span>
              </motion.div>
            )}
          </AnimatePresence>

        {/* Custom Controls Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8 transition-opacity opacity-0 group-hover:opacity-100 flex flex-col gap-6">
          
          {/* Progress Bar */}
          <input 
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={seek}
            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer accent-brand-red appearance-none hover:h-2 transition-all"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
               <button onClick={togglePlay} className="text-white hover:text-brand-red transition-colors">
                 {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
               </button>

               <div className="flex items-center gap-6">
                 <button onClick={() => skip(-10)} className="text-white/60 hover:text-white"><RotateCcw className="w-5 h-5" /></button>
                 <button onClick={() => skip(10)} className="text-white/60 hover:text-white"><RotateCw className="w-5 h-5" /></button>
               </div>

               <div className="flex items-center gap-4 group/vol">
                  <button onClick={() => setIsMuted(!isMuted)}>
                    {(isMuted || volume === 0) ? <VolumeX className="w-6 h-6 text-white/60" /> : <Volume2 className="w-6 h-6 text-white/60" />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-0 group-hover/vol:w-24 transition-all accent-white appearance-none h-1 bg-white/20 rounded-full"
                  />
               </div>

               <span className="text-xs font-mono text-white/60">{currentTime} / {duration}</span>
            </div>

            <div className="flex items-center gap-6">
               <button 
                 onClick={() => setShowSettings(!showSettings)}
                 className={`p-2 rounded-full transition-all ${showSettings ? 'bg-brand-red text-white' : 'text-white/60 hover:text-white'}`}
               >
                 <Settings className="w-6 h-6" />
               </button>
               <button onClick={toggleFullscreen} className="text-white/60 hover:text-white">
                 <Maximize className="w-6 h-6" />
               </button>
            </div>
          </div>

          {/* Settings Sub-Menu */}
          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-32 right-8 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 w-80 shadow-2xl z-50 overflow-hidden"
              >
                <div className="space-y-6">
                  <SettingTab 
                    label="Playback Speed" 
                    icon={<FastForward className="w-4 h-4" />} 
                    options={[0.5, 1, 1.5, 2]} 
                    value={playbackSpeed} 
                    onSelect={(v) => {
                        setPlaybackSpeed(v);
                        if(videoRef.current) videoRef.current.playbackRate = v;
                    }}
                    suffix="x"
                  />
                  <SettingTab 
                    label="Video Quality" 
                    icon={<Activity className="w-4 h-4" />} 
                    options={['4K', '1080p', '720p']} 
                    value={quality} 
                    onSelect={setQuality} 
                  />
                  <SettingTab 
                    label="Audio Quality" 
                    icon={<Settings className="w-4 h-4" />} 
                    options={['Dolby Atmos', 'Stereo']} 
                    value={audioQuality} 
                    onSelect={setAudioQuality} 
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Subtitles className="w-4 h-4 text-white/40" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/40">Captions</span>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setShowSubSettings(!showSubSettings)}
                         className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[8px] font-black uppercase tracking-widest"
                       >
                         Customize
                       </button>
                       <button 
                         onClick={() => setShowSubtitles(!showSubtitles)}
                         className={`w-12 h-6 rounded-full transition-all relative ${showSubtitles ? 'bg-brand-red' : 'bg-white/10'}`}
                       >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showSubtitles ? 'left-7' : 'left-1'}`} />
                       </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showSubSettings && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                      >
                         <SettingTab 
                            label="Font Size" 
                            options={[16, 24, 32, 48]} 
                            value={subtitleFontSize} 
                            onSelect={setSubtitleFontSize} 
                            suffix="px"
                         />
                         <SettingTab 
                            label="Captions Color" 
                            options={['#FFFFFF', '#FFFF00', '#00FFFF', '#FF00FF']} 
                            value={subtitleColor} 
                            onSelect={setSubtitleColor} 
                         />
                         <div className="space-y-3">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Background Opacity</span>
                            <div className="flex gap-2">
                               {[0, 0.25, 0.5, 0.75, 1].map(op => (
                                 <button 
                                   key={op}
                                   onClick={() => setSubtitleBgOpacity(op)}
                                   className={`flex-1 py-1 rounded-lg text-[8px] font-bold ${subtitleBgOpacity === op ? 'bg-brand-red' : 'bg-white/5'}`}
                                 >
                                   {op * 100}%
                                 </button>
                               ))}
                            </div>
                         </div>
                         <SettingTab 
                            label="Font Family (Google Docs)" 
                            options={['Inter', 'Space Grotesk', 'Outfit', 'Playfair Display']} 
                            value={subtitleFontFamily} 
                            onSelect={setSubtitleFontFamily} 
                         />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info & Reviews Section */}
      <div className="w-full max-w-4xl mx-auto py-16 px-8 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
              {content.title || content.name}
            </h1>
            <div className="flex items-center gap-6 meta-text">
               <div className="flex items-center gap-2">
                 <div className="flex flex-col items-center">
                    <span className="text-[8px] font-black text-white/40 uppercase mb-1">N</span>
                    <AgeRatingBadge rating={content.isExplicit ? (content.ageRating || 18) : 0} />
                 </div>
               </div>
               <span className="text-brand-red font-black">98% Match</span>
               <span>{('releaseDate' in content ? content.releaseDate : content.firstAirDate)?.split('-')[0]}</span>
               <span className="px-2 py-0.5 border border-white/20 rounded text-[10px]">4K HDR</span>
               <span className="px-2 py-0.5 border border-white/20 rounded text-[10px]">ULTRA HD</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="flex text-yellow-500">
               {[1,2,3,4,5].map(i => <Star key={i} className={`w-6 h-6 ${i <= 5 ? 'fill-current' : ''}`} />)}
             </div>
             <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Global Rating</span>
          </div>
        </div>

        <p className="text-lg text-white/60 leading-relaxed max-w-3xl">
          {content.overview}
        </p>

        {/* Review Form */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 blur-[80px] -z-10" />
          
          <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-4">
             <MessageCircle className="w-6 h-6 text-brand-red" /> Post a Review
          </h2>

          <form onSubmit={handleAddComment} className="space-y-8">
            <div className="flex flex-col gap-4">
               <span className="text-xs font-black uppercase tracking-widest text-white/40">Select Your Rating</span>
               <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="group"
                    >
                      <Star 
                        className={`w-10 h-10 transition-all ${star <= rating ? 'fill-yellow-500 text-yellow-500 scale-110' : 'text-white/10 group-hover:text-yellow-500/50'}`} 
                      />
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <span className="text-xs font-black uppercase tracking-widest text-white/40">Your Thoughts</span>
               <textarea 
                 value={reviewText}
                 onChange={(e) => setReviewText(e.target.value)}
                 className="w-full bg-black border border-white/10 rounded-3xl p-6 outline-none focus:border-brand-red transition-all min-h-[150px] text-white/80"
                 placeholder="What did you think of the cinematography, story, and acting?"
               />
            </div>

            <button 
              type="submit"
              className="w-full md:w-auto px-12 py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-brand-red hover:text-white transition-all shadow-2xl shadow-white/5"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Comments Feed */}
        <div className="space-y-8 pb-32">
          {comments.map((comment) => (
            <div key={comment.id} className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-zinc-800 rounded-2xl overflow-hidden shadow-lg">
                      <img src={comment.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`} alt="" />
                   </div>
                   <div>
                      <h4 className="font-bold text-lg">{comment.username}</h4>
                      <div className="flex items-center gap-3">
                         <div className="flex text-yellow-500 scale-75 -ml-3">
                           {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= comment.rating ? 'fill-current' : 'text-white/10'}`} />)}
                         </div>
                         <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{comment.timestamp}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-xs font-bold text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                   Like ({comment.likes})
                </div>
              </div>
              <p className="text-white/60 leading-relaxed">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SettingTab({ label, icon, options, value, onSelect, suffix = '' }: { 
    label: string, 
    icon?: React.ReactNode, 
    options: any[], 
    value: any, 
    onSelect: (v: any) => void,
    suffix?: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {icon && <div className="text-white/40">{icon}</div>}
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            style={label.includes('Color') ? { backgroundColor: opt } : {}}
            className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all truncate px-1 ${opt === value ? 'bg-brand-red text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            {label.includes('Color') ? '' : `${opt}${suffix}`}
          </button>
        ))}
      </div>
    </div>
  );
}
