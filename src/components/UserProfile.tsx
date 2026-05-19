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
  Edit2,
  Youtube,
  Globe
} from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';
import { useTranslation } from '../lib/i18n';

interface UserProfileProps {
  profile: UserProfileType | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenLanguage: () => void;
}

export default function UserProfile({ profile, onLogin, onLogout, onOpenLanguage }: UserProfileProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(profile?.username || '');
  const [editBio, setEditBio] = React.useState(profile?.bio || '');
  const [editAvatarUrl, setEditAvatarUrl] = React.useState(profile?.avatarUrl || '');
  const [editYoutubeUrl, setEditYoutubeUrl] = React.useState(profile?.youtubeLink || '');

  if (!profile) {
    return (
      <div className="w-full max-w-lg mx-auto py-32 px-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-white/5 rounded-[32px] border border-white/10 flex items-center justify-center mb-8 animate-pulse">
           <Users className="w-10 h-10 text-brand-red opacity-40" />
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Initializing <span className="text-brand-red">Flix</span> Hub</h2>
        <p className="text-white/40 mb-12 text-sm leading-relaxed">
          Setting up your local cinematic profile...
        </p>
      </div>
    );
  }

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      username: editName,
      bio: editBio,
      avatarUrl: editAvatarUrl,
      youtubeLink: editYoutubeUrl
    };
    // We can't call a prop here to update parent state directly unless we add it, 
    // but we can update localStorage and suggest a refresh or assume parent handles it.
    // Better yet, let's assume the user will refresh or the parent will be updated via a callback.
    localStorage.setItem('flix_user_profile', JSON.stringify(updatedProfile));
    setIsEditing(false);
    // In a real app we'd trigger a reload or parent state update
    window.location.reload(); 
  };

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
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2 block">Username</label>
                    <input 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 w-full text-xl font-black uppercase tracking-tighter italic outline-none focus:border-brand-red"
                      placeholder="Username"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2 block">Avatar URL</label>
                    <input 
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 w-full text-sm outline-none focus:border-brand-red"
                      placeholder="https://image.url"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2 block">YouTube Link</label>
                  <input 
                    value={editYoutubeUrl}
                    onChange={(e) => setEditYoutubeUrl(e.target.value)}
                    className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 w-full text-sm outline-none focus:border-brand-red"
                    placeholder="https://youtube.com/@channel"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2 block">Bio</label>
                  <textarea 
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 w-full text-sm text-white/60 outline-none focus:border-brand-red resize-none"
                    rows={2}
                    placeholder="Bio"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-6 py-2 bg-brand-red text-white font-black rounded-lg uppercase text-[10px]">Save Profile</button>
                  <button onClick={() => {
                    setIsEditing(false);
                    setEditName(profile.username);
                    setEditBio(profile.bio);
                    setEditAvatarUrl(profile.avatarUrl);
                    setEditYoutubeUrl(profile.youtubeLink || '');
                  }} className="px-6 py-2 bg-white/10 text-white font-black rounded-lg uppercase text-[10px]">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-2">
                  {profile.username}
                </h2>
                <p className="text-white/60 mb-4 max-w-md">{profile.bio}</p>
                
                {profile.youtubeLink && (
                  <a 
                    href={profile.youtubeLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-brand-red mb-6 hover:opacity-80 transition-opacity w-fit"
                  >
                    <Youtube className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">YouTube Channel</span>
                  </a>
                )}
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-brand-red hover:text-white transition-all uppercase text-xs tracking-widest flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </button>
                  <button 
                    onClick={onOpenLanguage}
                    className="px-8 py-3 bg-white/5 border border-white/10 text-brand-red font-black rounded-xl hover:bg-brand-red hover:text-white transition-all uppercase text-xs tracking-widest flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" /> {profile.preferredLanguage || 'Language'}
                  </button>
                  <button 
                    onClick={onLogout}
                    className="px-8 py-3 bg-white/5 border border-white/10 text-white/40 font-black rounded-xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest"
                  >
                    Reset Profile
                  </button>
                  <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* AI Monetization Stats */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <StatCard 
              icon={<DollarSign className="w-4 h-4 text-yellow-500" />} 
              label="Earnings" 
              value={`$${(profile.totalEarnings || 0).toFixed(2)}`}
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
        <MetricCard icon={<Users className="w-6 h-6" />} label={t('subscribers')} value={(profile.subscribers || 0).toLocaleString()} />
        <MetricCard icon={<Eye className="w-6 h-6" />} label={t('total_views')} value={(profile.totalViews || 0).toLocaleString()} />
        <MetricCard icon={<Video className="w-6 h-6" />} label={t('total_posts')} value={profile.posts.length} />
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
                <span className="text-[10px] font-bold uppercase">{(post.views || 0).toLocaleString()}</span>
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
