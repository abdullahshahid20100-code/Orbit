import React, { useState, useMemo, useEffect } from 'react';
import { Search, UserCheck, Clock, UserPlus, Sparkles, Hash } from 'lucide-react';
import { User } from '../types';
import { store } from '../services/store';
import { useLongPress } from '../hooks/useLongPress';
import { AvatarPreviewModal } from './AvatarPreviewModal';

interface ExploreViewProps {
  currentUser: User;
  onOpenUserProfile: (userId: string) => void;
  onOpenChatWith: (userId: string) => void;
}

const ExploreUserItem: React.FC<{
  user: User;
  currentUser: User;
  onOpenUserProfile: (userId: string) => void;
  onOpenChatWith: (userId: string) => void;
  onZoomAvatar: (user: User) => void;
}> = ({ user, currentUser, onOpenUserProfile, onOpenChatWith, onZoomAvatar }) => {
  const followStatus = store.getFollowStatus(currentUser.id, user.id);
  const isFollowing = followStatus === 'following';
  const isPending = followStatus === 'pending';

  const avatarLongPressProps = useLongPress({
    threshold: 320,
    onLongPress: () => onZoomAvatar(user),
    onClick: () => onOpenUserProfile(user.id),
  });

  const handleFollowAction = () => {
    if (followStatus === 'none' || followStatus === 'rejected') {
      store.sendFollowRequest(currentUser.id, user.id);
    } else if (followStatus === 'following') {
      store.unfollowUser(currentUser.id, user.id);
    }
  };

  return (
    <div className="bg-[#121622] border border-slate-800/90 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg hover:border-slate-700 transition-all group relative">
      {/* Avatar with click to profile and hold to enlarge */}
      <div
        {...avatarLongPressProps}
        className="w-20 h-20 rounded-full overflow-hidden mb-2.5 border-2 border-slate-700/60 group-hover:border-indigo-500/60 transition-colors cursor-pointer select-none active:scale-95"
        title="Hold to enlarge profile picture"
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
      <span className="text-xs text-indigo-400 font-medium mb-1 truncate max-w-full">
        @{user.username}
      </span>

      {/* ID Tag */}
      <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2 font-mono">
        <Hash className="w-2.5 h-2.5" />
        <span className="truncate max-w-[110px]">{user.id}</span>
      </div>

      {/* Bio snippet */}
      {user.bio && (
        <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
          {user.bio}
        </p>
      )}

      {/* Action Buttons: Follow Button + Quick Message button */}
      <div className="w-full flex flex-col gap-1.5 mt-auto">
        <button
          onClick={handleFollowAction}
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
};

export const ExploreView: React.FC<ExploreViewProps> = ({
  currentUser,
  onOpenUserProfile,
  onOpenChatWith,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [storeVersion, setStoreVersion] = useState(0);
  const [zoomedUser, setZoomedUser] = useState<User | null>(null);

  // Subscribe to live store changes
  useEffect(() => {
    return store.subscribe(() => {
      setStoreVersion((v) => v + 1);
    });
  }, []);

  // Filter users based on search (by username, displayName, or ID)
  const filteredUsers = useMemo(() => {
    void storeVersion;
    return store.searchUsers(searchQuery, currentUser.id);
  }, [searchQuery, currentUser.id, storeVersion]);

  return (
    <div className="w-full flex flex-col space-y-4 pb-20 animate-in fade-in duration-200">
      {zoomedUser && (
        <AvatarPreviewModal
          user={zoomedUser}
          onClose={() => setZoomedUser(null)}
        />
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search usernames or IDs (@shahid, elenarostova...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#131622] border border-slate-800 text-sm text-slate-100 placeholder-slate-400 rounded-xl pl-10 pr-16 py-2.5 focus:outline-none focus:border-indigo-500/70 transition-all shadow-inner"
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
          <span>{searchQuery ? 'Search results' : 'Discover people & IDs'}</span>
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
          <p className="text-xs text-slate-500">Search by username like @shahidiqbal, @elenarostova, or ID</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredUsers.map((user) => (
            <ExploreUserItem
              key={user.id}
              user={user}
              currentUser={currentUser}
              onOpenUserProfile={onOpenUserProfile}
              onOpenChatWith={onOpenChatWith}
              onZoomAvatar={(u) => setZoomedUser(u)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
