import React, { useState, useRef, useEffect } from 'react';
import { Home, Compass, Plus, MessageCircle, Bell } from 'lucide-react';
import { User } from '../types';

export type TabType = 'home' | 'explore' | 'create' | 'notifications' | 'chats' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCreate: (type: 'post' | 'story') => void;
  currentUser: User;
  unreadChatsCount?: number;
  unreadNotifsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreate,
  currentUser,
  unreadChatsCount = 0,
  unreadNotifsCount = 0,
}) => {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowCreatePopup(false);
      }
    };
    if (showCreatePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreatePopup]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0f17]/95 backdrop-blur-lg border-t border-slate-800/80">
      <div className="max-w-lg mx-auto px-3 py-2 flex items-center justify-around relative">
        {/* 1. Home Tab */}
        <button
          onClick={() => {
            setShowCreatePopup(false);
            onSelectTab('home');
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-indigo-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Home Feed"
        >
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* 2. Explore Tab */}
        <button
          onClick={() => {
            setShowCreatePopup(false);
            onSelectTab('explore');
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === 'explore'
              ? 'text-indigo-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Explore & Search"
        >
          <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Explore</span>
        </button>

        {/* 3. Center Create (+) Button with Popover */}
        <div className="relative" ref={popupRef}>
          {showCreatePopup && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-36 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-1.5 z-50 flex flex-col gap-1 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setShowCreatePopup(false);
                  onOpenCreate('post');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-white hover:bg-indigo-600/30 hover:text-indigo-200 transition-colors flex items-center justify-between"
              >
                <span>New Post</span>
                <span className="text-[10px] text-slate-400 font-normal">Feed</span>
              </button>
              <button
                onClick={() => {
                  setShowCreatePopup(false);
                  onOpenCreate('story');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-white hover:bg-indigo-600/30 hover:text-indigo-200 transition-colors flex items-center justify-between"
              >
                <span>New Story</span>
                <span className="text-[10px] text-slate-400 font-normal">24h</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setShowCreatePopup(!showCreatePopup)}
            className="w-12 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.4)] hover:shadow-[0_0_22px_rgba(99,102,241,0.6)] active:scale-95 transition-all"
            title="Create Post or Story"
          >
            <Plus
              className={`w-6 h-6 stroke-[2.5] transition-transform duration-200 ${
                showCreatePopup ? 'rotate-45' : ''
              }`}
            />
          </button>
        </div>

        {/* 4. Chats Tab */}
        <button
          onClick={() => {
            setShowCreatePopup(false);
            onSelectTab('chats');
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-xl relative transition-all ${
            activeTab === 'chats'
              ? 'text-indigo-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Direct Chats"
        >
          <div className="relative">
            <MessageCircle
              className={`w-6 h-6 ${activeTab === 'chats' ? 'stroke-[2.5]' : 'stroke-2'}`}
            />
            {unreadChatsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#0c0f17]">
                {unreadChatsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Chats</span>
        </button>

        {/* 5. Profile Tab */}
        <button
          onClick={() => {
            setShowCreatePopup(false);
            onSelectTab('profile');
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-indigo-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Profile"
        >
          <div
            className={`w-6 h-6 rounded-full overflow-hidden p-0.5 transition-all ${
              activeTab === 'profile'
                ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-[#0c0f17]'
                : 'ring-1 ring-slate-700'
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>
    </div>
  );
};
