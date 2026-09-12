import React, { useState, useMemo } from 'react';
import { Search, UserCheck, Clock, UserPlus, Sparkles } from 'lucide-react';
import { User } from '../types';
import { store } from '../services/store';

interface ExploreViewProps {
  currentUser: User;
  onOpenUserProfile: (userId: string) => void;
  onOpenChatWith: (userId: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  currentUser,
  onOpenUserProfile,
  onOpenChatWith,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const allUsers = store.getUsers();

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allUsers.filter((u) => {
      // Exclude currentUser from discovery grid
      if (u.id === currentUser.id) return false;
      if (!q) return true;
      return (
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q)
      );
    });
  }, [allUsers, searchQuery, currentUser.id]);

  const handleFollowAction = (targetUserId: string, currentStatus: string) => {
    if (currentStatus === 'none' || currentStatus === 'rejected') {
      store.sendFollowRequest(currentUser.id, targetUserId);
    } else if (currentStatus === 'following') {
      store.unfollowUser(currentUser.id, targetUserId);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Search Bar matching video (00:02) */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search usernames..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#131622] border border-slate-800 text-sm text-slate-100 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500/70 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Discover People Section Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm font-bold text-slate-200 tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Discover people</span>
        </h2>
        <span className="text-[11px] text-slate-400">
          {filteredUsers.length} found
        </span>
      </div>

      {/* People Grid */}
      {filteredUsers.length === 0 ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium">No one found matching "{searchQuery}"</p>
          <p className="text-xs text-slate-500">Try searching for other usernames on Orbit</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredUsers.map((user) => {
            const followStatus = store.getFollowStatus(currentUser.id, user.id);
            const isFollowing = followStatus === 'following';
            const isPending = followStatus === 'pending';

            return (
              <div
                key={user.id}
                className="bg-[#121622] border border-slate-800/90 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg hover:border-slate-700 transition-all group relative"
              >
                {/* Avatar with click to profile */}
                <div
                  onClick={() => onOpenUserProfile(user.id)}
                  className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-slate-700/60 group-hover:border-indigo-500/60 transition-colors cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Display Name & Username */}
                <h3
                  onClick={() => onOpenUserProfile(user.id)}
                  className="font-bold text-slate-100 text-sm truncate max-w-full cursor-pointer hover:text-indigo-300 transition-colors"
                >
                  {user.displayName}
                </h3>
                <span className="text-xs text-slate-400 mb-2 truncate max-w-full">
                  @{user.username}
                </span>

                {/* Bio snippet */}
                {user.bio && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                    {user.bio}
                  </p>
                )}

                {/* Action Buttons: Follow Button + Quick Message button */}
                <div className="w-full flex flex-col gap-1.5 mt-auto">
                  <button
                    onClick={() => handleFollowAction(user.id, followStatus)}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      isFollowing
                        ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                        : isPending
                        ? 'bg-slate-800/80 border border-slate-700 text-indigo-300'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)] hover:opacity-95'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Following</span>
                      </>
                    ) : isPending ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                        <span>Requested</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenChatWith(user.id)}
                    className="w-full py-1 text-[11px] font-medium text-slate-400 hover:text-indigo-300 transition-colors"
                  >
                    {isFollowing ? 'Send message' : 'Chat (Private)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
