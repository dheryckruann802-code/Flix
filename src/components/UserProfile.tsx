/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Eye, 
  DollarSign, 
  Settings, 
  Grid, 
  Video, 
  TrendingUp,
  LayoutGrid,
  Edit2
} from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  profile: UserProfileType | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function UserProfile({ profile, onLogin, onLogout }: UserProfileProps) {
  if (!profile) {
    return (
      <div className="w-full max-w-lg mx-auto py-32 px-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-white/5 rounded-[32px] border border-white/10 flex items-center justify-center mb-8">
           <Users className="w-10 h-10 text-brand-red opacity-40" />
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Join the <span className="text-brand-red">Flix</span> Hub</h2>
        <p className="text-white/40 mb-12 text-sm leading-relaxed">
          Log in with Google to manage your SocialFlix videos, track earnings, and engage with the community.
        </p>
        <button 
          onClick={onLogin}
          className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-brand-red hover:text-white transition-all transform active:scale-95 group shadow-2xl shadow-white/5"
        >
          <svg className="w-5 h-5 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.63l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="uppercase tracking-widest text-[10px]">Continue with Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6">
      {/* Profile Header */}
      <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 blur-[100px] -z-10" />
        
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-2 border-white/20 group-hover:border-brand-red transition-colors">
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-brand-red rounded-xl shadow-lg hover:scale-110 transition-transform">
              <Edit2 className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-2">
              {profile.username}
            </h2>
            <p className="text-white/60 mb-6 max-w-md">{profile.bio}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button 
                onClick={onLogout}
                className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-brand-red hover:text-white transition-all uppercase text-xs tracking-widest"
              >
                Logout
              </button>
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI Monetization Stats */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <StatCard 
              icon={<DollarSign className="w-4 h-4 text-yellow-500" />} 
              label="Earnings" 
              value={`$${profile.totalEarnings.toFixed(2)}`}
              subValue="AI Monetized"
              color="border-yellow-500/20"
            />
            <StatCard 
              icon={<TrendingUp className="w-4 h-4 text-brand-red" />} 
              label="Growth" 
              value="+12%" 
              subValue="Last 7 days"
              color="border-brand-red/20"
            />
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <MetricCard icon={<Users className="w-6 h-6" />} label="Subscribers" value={profile.subscribers.toLocaleString()} />
        <MetricCard icon={<Eye className="w-6 h-6" />} label="Total Views" value={profile.totalViews.toLocaleString()} />
        <MetricCard icon={<Video className="w-6 h-6" />} label="Total Posts" value={profile.posts.length} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-white/10 mb-8">
        <button className="pb-4 border-b-2 border-brand-red text-white flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
          <LayoutGrid className="w-4 h-4" /> My Videos
        </button>
        <button className="pb-4 border-b-2 border-transparent text-white/40 hover:text-white flex items-center gap-2 font-bold uppercase text-xs tracking-widest transition-colors">
          <Grid className="w-4 h-4" /> Saved
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {profile.posts.map(post => (
          <motion.div 
            key={post.id}
            whileHover={{ y: -5 }}
            className="aspect-[9/16] bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative group cursor-pointer"
          >
            <img src={post.thumbnailUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity" />
            
            <div className="absolute bottom-4 left-4 right-4 group-hover:hidden">
              <div className="flex items-center gap-2 text-white/60 mb-1">
                <Eye className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase">{post.views.toLocaleString()}</span>
              </div>
              <p className="text-[10px] font-bold text-white uppercase tracking-tighter truncate">{post.description}</p>
            </div>

            <div className="absolute inset-0 bg-brand-red/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-110 group-hover:scale-100">
               <Video className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }: { icon: React.ReactNode, label: string, value: string, subValue: string, colorText?: string, color: string }) {
  return (
    <div className={`p-4 bg-white/5 border ${color} rounded-2xl flex flex-col gap-1`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] uppercase font-black tracking-widest text-white/40">{label}</span>
      </div>
      <span className="text-xl font-black text-white">{value}</span>
      <span className="text-[8px] uppercase font-bold text-white/20 italic">{subValue}</span>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
      <div className="p-3 bg-white/5 rounded-2xl text-brand-red mb-2 italic">
        {icon}
      </div>
      <span className="text-[10px] uppercase font-black tracking-widest text-white/40">{label}</span>
      <span className="text-3xl font-black text-white">{value}</span>
    </div>
  );
}
