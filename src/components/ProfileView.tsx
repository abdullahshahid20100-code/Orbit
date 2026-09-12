import React, { useState } from 'react';
import { User, Post } from '../types';
import { store } from '../services/store';
import {
  Grid,
  Bookmark,
  Heart,
  Plus,
  Edit2,
  Camera,
  Share2,
  Settings,
  MessageCircle,
  Users,
  X,
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  onOpenCreatePost: () => void;
  onOpenCreateStory: () => void;
  onOpenChatWith: (userId: string) => void;
  onSelectPost?: (post: Post) => void;
  onOpenEditProfile: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  onOpenCreatePost,
  onOpenCreateStory,
  onOpenChatWith,
  onSelectPost,
  onOpenEditProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [showSocialList, setShowSocialList] = useState<'followers' | 'following' | null>(null);

  const isMe = user.id === currentUser.id;
  const posts = store.getPostsByUser(user.id);
  const savedPosts = store.getSavedPostsByUser(user.id);
  const highlights = store.getHighlightsByUser(user.id);
  const userStories = store.getStoriesByUser(user.id);
  const hasActiveStory = userStories.length > 0;

  const followStatus = store.getFollowStatus(currentUser.id, user.id);
  const privacyCheck = store.canSendMessage(currentUser.id, user.id);

  const displayedPosts = activeTab === 'posts' ? posts : savedPosts;

  const handleFollowAction = () => {
    if (followStatus === 'none' || followStatus === 'rejected') {
      store.sendFollowRequest(currentUser.id, user.id);
    } else if (followStatus === 'following') {
      store.unfollowUser(currentUser.id, user.id);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-5 pb-24 animate-in fade-in duration-200">
      {/* Profile Header Card */}
      <div className="flex flex-col items-center text-center pt-2">
        {/* Avatar with gradient story ring & heart count badge */}
        <div className="relative mb-3">
          <div
            onClick={() => {
              if (hasActiveStory) {
                // View story
              } else if (isMe) {
                onOpenCreateStory();
              }
            }}
            className={`w-24 h-24 rounded-full p-[3px] cursor-pointer transition-transform hover:scale-105 ${
              hasActiveStory
                ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-slate-800'
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#0c0f17] p-1 overflow-hidden">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Heart count badge below avatar (as seen in video: heart 2) */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#181c28] border border-slate-700/80 text-rose-400 text-xs font-bold flex items-center gap-1 shadow-md">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            <span className="text-white text-[11px]">{user.likesReceived || 2}</span>
          </div>
        </div>

        {/* Display Name & Username */}
        <h1 className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
          <span>{user.displayName}</span>
          {user.isVerified && (
            <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[9px] font-bold">
              ✓
            </span>
          )}
        </h1>

        <span className="text-xs text-indigo-300 font-medium">@{user.username}</span>

        {/* Quick Action Button ("New post" button as in video 00:22) */}
        <div className="flex items-center gap-2 mt-3.5">
          {isMe ? (
            <>
              <button
                onClick={onOpenCreatePost}
                className="px-4 py-2 rounded-2xl bg-[#141824] hover:bg-[#1a2030] border border-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-all shadow active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>New post</span>
              </button>

              <button
                onClick={onOpenEditProfile}
                className="px-3 py-2 rounded-2xl bg-[#141824] hover:bg-[#1a2030] border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-all"
                title="Edit profile"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleFollowAction}
                className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all shadow active:scale-95 ${
                  followStatus === 'following'
                    ? 'bg-slate-800 border border-slate-700 text-slate-300'
                    : followStatus === 'pending'
                    ? 'bg-slate-800 border border-indigo-500/50 text-indigo-300'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                }`}
              >
                {followStatus === 'following'
                  ? 'Following'
                  : followStatus === 'pending'
                  ? 'Requested'
                  : 'Follow'}
              </button>

              <button
                onClick={() => onOpenChatWith(user.id)}
                className="px-4 py-2 rounded-2xl bg-[#141824] border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1a2030]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>{privacyCheck.allowed ? 'Message' : 'Chat (Locked)'}</span>
              </button>
            </>
          )}
        </div>

        {/* Stats Row matching video: "1 posts", "0 followers", "0 following" */}
        <div className="flex items-center justify-center space-x-6 mt-4 py-2 border-y border-slate-800/60 w-full max-w-xs">
          <div className="text-center">
            <span className="font-bold text-sm text-white">{posts.length}</span>
            <span className="text-xs text-slate-400 ml-1">posts</span>
          </div>
          <button
            onClick={() => setShowSocialList('followers')}
            className="text-center hover:opacity-80 transition-opacity"
          >
            <span className="font-bold text-sm text-white">{user.followersCount}</span>
            <span className="text-xs text-slate-400 ml-1 hover:text-indigo-300">followers</span>
          </button>
          <button
            onClick={() => setShowSocialList('following')}
            className="text-center hover:opacity-80 transition-opacity"
          >
            <span className="font-bold text-sm text-white">{user.followingCount}</span>
            <span className="text-xs text-slate-400 ml-1 hover:text-indigo-300">following</span>
          </button>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-slate-300 mt-3 max-w-xs leading-relaxed font-normal">
            {user.bio}
          </p>
        )}
      </div>

      {/* Stories Highlights Tray matching video (00:23) */}
      <div className="space-y-1.5 pt-1">
        <span className="text-xs font-semibold text-slate-400 px-1">Stories</span>
        <div className="flex items-center space-x-3.5 overflow-x-auto no-scrollbar py-1">
          {/* Add Highlight Button for user */}
          {isMe && (
            <div
              onClick={onOpenCreateStory}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group"
            >
              <div className="w-16 h-22 rounded-2xl border border-dashed border-slate-700 group-hover:border-indigo-500 bg-[#121622] flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
              </div>
              <span className="text-[10px] text-slate-400">New</span>
            </div>
          )}

          {highlights.map((hl) => (
            <div
              key={hl.id}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group"
            >
              <div className="w-16 h-22 rounded-2xl overflow-hidden border border-slate-800 group-hover:border-indigo-500/80 bg-slate-900 shadow transition-all relative">
                <img
                  src={hl.coverUrl}
                  alt={hl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <span className="text-[10px] font-medium text-slate-300 truncate max-w-[64px]">
                {hl.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Header: "Posts" vs "Saved" (matching video 00:24) */}
      <div className="border-t border-slate-800/80 pt-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-2 py-2.5 px-6 border-b-2 text-xs font-bold transition-colors ${
              activeTab === 'posts'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts</span>
          </button>

          {isMe && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center space-x-2 py-2.5 px-6 border-b-2 text-xs font-bold transition-colors ${
                activeTab === 'saved'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </button>
          )}
        </div>

        {/* Posts 3-Column Grid Thumbnail (matching video 00:23) */}
        {displayedPosts.length === 0 ? (
          <div className="py-14 text-center text-slate-500 text-xs">
            {activeTab === 'posts' ? 'No posts yet.' : 'No saved posts.'}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            {displayedPosts.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectPost && onSelectPost(p)}
                className="relative aspect-square bg-slate-900 rounded-lg overflow-hidden group cursor-pointer border border-slate-800/50"
              >
                <img
                  src={p.mediaUrl}
                  alt={p.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* Hover overlay with likes and comments */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-3 text-white text-xs font-bold transition-opacity">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    {p.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    {p.comments.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Followers / Following List Modal */}
      {showSocialList && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#12151e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white capitalize">
                  {showSocialList} ({showSocialList === 'followers' ? user.followersCount : user.followingCount})
                </h3>
              </div>
              <button
                onClick={() => setShowSocialList(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-2.5 no-scrollbar text-xs">
              {(() => {
                const list =
                  showSocialList === 'followers'
                    ? store.getFollowers(user.id)
                    : store.getFollowing(user.id);

                if (list.length === 0) {
                  return (
                    <div className="py-10 text-center text-slate-500">
                      No {showSocialList} yet.
                    </div>
                  );
                }

                return list.map((u) => {
                  const isFollowingThisUser = store.getFollowStatus(currentUser.id, u.id) === 'following';
                  return (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#171b28] border border-slate-800/80"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <img
                          src={u.avatar}
                          alt={u.displayName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-white truncate">
                            {u.displayName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            @{u.username}
                          </p>
                        </div>
                      </div>

                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (isFollowingThisUser) {
                              store.unfollowUser(currentUser.id, u.id);
                            } else {
                              store.sendFollowRequest(currentUser.id, u.id);
                            }
                          }}
                          className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                            isFollowingThisUser
                              ? 'bg-slate-800 text-slate-300 border border-slate-700'
                              : 'bg-indigo-600 text-white'
                          }`}
                        >
                          {isFollowingThisUser ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
