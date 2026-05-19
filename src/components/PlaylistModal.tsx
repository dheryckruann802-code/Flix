import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, List, Check, FolderPlus } from 'lucide-react';
import { Content, getTitle, UserProfile } from '../types';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
  user: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
}

export default function PlaylistModal({ isOpen, onClose, content, user, onUpdateUser }: PlaylistModalProps) {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  if (!content || !user) return null;

  const contentId = content.id.toString();
  const playlists = user.playlists || [];

  const handleTogglePlaylistItem = (playlistId: string) => {
    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === playlistId) {
        const hasItem = pl.items.includes(contentId);
        return {
          ...pl,
          items: hasItem 
            ? pl.items.filter(id => id !== contentId)
            : [...pl.items, contentId]
        };
      }
      return pl;
    });

    const updatedUser = { ...user, playlists: updatedPlaylists };
    onUpdateUser(updatedUser);
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      items: [contentId]
    };

    const updatedUser = {
      ...user,
      playlists: [...playlists, newPlaylist]
    };

    onUpdateUser(updatedUser);
    setNewPlaylistName('');
    setShowCreate(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-app-black border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden relative z-10 shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Add to <span className="text-brand-red">Playlist</span></h3>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1 truncate max-w-[200px]">
                  {getTitle(content)}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[40vh] overflow-y-auto hide-scrollbar space-y-2">
              {playlists.length === 0 && !showCreate && (
                <div className="text-center py-8">
                  <List className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest">No playlists yet</p>
                </div>
              )}

              {playlists.map((pl) => {
                const isInPlaylist = pl.items.includes(contentId);
                return (
                  <button
                    key={pl.id}
                    onClick={() => handleTogglePlaylistItem(pl.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                      isInPlaylist 
                        ? 'bg-brand-red/20 border-brand-red text-white' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isInPlaylist ? 'bg-brand-red text-white' : 'bg-white/10 text-white/40 group-hover:text-white'}`}>
                        <List className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-black uppercase italic tracking-tight">{pl.name}</span>
                        <p className="text-[9px] opacity-40 uppercase font-bold">{pl.items.length} items</p>
                      </div>
                    </div>
                    {isInPlaylist ? (
                      <Check className="w-5 h-5 text-brand-red" />
                    ) : (
                      <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-6 bg-white/5 border-t border-white/10">
              {showCreate ? (
                <form onSubmit={handleCreatePlaylist} className="space-y-4">
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 mb-2 block">Playlist Name</label>
                    <input
                      autoFocus
                      required
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="e.g. Weekend Vibes"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red transition-all text-sm font-bold uppercase tracking-tight"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-brand-red text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-900/20"
                    >
                      Create
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowCreate(true)}
                  className="w-full py-4 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-3 text-white/40 hover:text-white hover:border-white/40 transition-all group"
                >
                  <FolderPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Create New Playlist</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
