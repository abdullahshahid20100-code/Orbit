import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Edit2,
  Trash2,
  MessageSquareOff,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Share2,
  X,
} from 'lucide-react';
import { Post, User } from '../types';
import { store } from '../services/store';

interface FeedPostProps {
  post: Post;
  currentUser: User;
  onOpenUser?: (userId: string) => void;
  onOpenChatWith?: (userId: string) => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({
  post,
  currentUser,
  onOpenUser,
  onOpenChatWith,
}) => {
  const author = store.getUserById(post.userId);
  const isAuthor = post.userId === currentUser.id;
  const isLiked = post.likedBy.includes(currentUser.id);
  const isSaved = post.savedBy.includes(currentUser.id);

  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  // 3-dot menu state
  const [showMenu, setShowMenu] = useState(false);
  // Edit post state
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption);
  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Time formatter
  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleLike = () => {
    store.toggleLikePost(post.id, currentUser.id);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      store.toggleLikePost(post.id, currentUser.id);
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);
  };

  const handleSave = () => {
    store.toggleSavePost(post.id, currentUser.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (post.allowComments === false) return;
    store.addComment(post.id, currentUser.id, commentText.trim());
    setCommentText('');
    setShowComments(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    store.updatePostCaption(post.id, currentUser.id, editCaption);
    setIsEditing(false);
    showToast('Caption updated');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      store.deletePost(post.id, currentUser.id);
      setShowMenu(false);
    }
  };

  const handleToggleComments = () => {
    const allowed = store.togglePostCommentsAllowed(post.id, currentUser.id);
    setShowMenu(false);
    showToast(allowed ? 'Comments turned ON' : 'Comments turned OFF');
  };

  const handleShareToStory = () => {
    store.sharePostToStory(post.id, currentUser.id);
    setShowShareModal(false);
    setShowMenu(false);
    showToast('Added to your 24h Story! 🪐');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShowShareModal(false);
    setShowMenu(false);
    showToast('Link copied to clipboard! 📋');
  };

  if (!author) return null;

  return (
    <article className="w-full bg-[#12151e] border border-slate-800/80 rounded-2xl overflow-hidden mb-4 shadow-lg transition-all relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-xl bg-indigo-600/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Post Header */}
      <div className="p-3 sm:px-4 flex items-center justify-between">
        <div
          onClick={() => onOpenUser && onOpenUser(author.id)}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <img
            src={author.avatar}
            alt={author.displayName}
            className="w-9 h-9 rounded-full object-cover border border-slate-700/80 group-hover:border-indigo-500/60 transition-colors"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {author.username}
              </span>
              {author.isVerified && (
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              {getTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>

        {/* 3-dots Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
            title="Options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* 3-dots Options Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 rounded-xl bg-[#181c28] border border-slate-700 shadow-2xl py-1.5 z-40 animate-in fade-in duration-100 text-xs">
              {isAuthor ? (
                <>
                  {/* Edit Option */}
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-indigo-400" />
                    <span>Edit caption</span>
                  </button>

                  {/* Toggle Comments */}
                  <button
                    onClick={handleToggleComments}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    {post.allowComments !== false ? (
                      <>
                        <MessageSquareOff className="w-4 h-4 text-amber-400" />
                        <span>Turn off comments</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>Turn on comments</span>
                      </>
                    )}
                  </button>

                  {/* Delete Option */}
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-slate-800/60"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete post</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleShareToStory}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Add to your story</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy link</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Media Container with Double-tap */}
      <div
        onDoubleClick={handleDoubleTap}
        className="relative w-full aspect-square sm:aspect-[4/3] bg-black overflow-hidden select-none cursor-pointer flex items-center justify-center"
      >
        <img
          src={post.mediaUrl}
          alt={post.caption || 'Post image'}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Double-tap Heart Animation */}
        {showHeartOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-in zoom-in-50 fade-in duration-200">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-[0_0_24px_rgba(244,63,94,0.9)] animate-pulse" />
          </div>
        )}
      </div>

      {/* Post Actions Row */}
      <div className="p-3 sm:px-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`transition-transform active:scale-125 ${
                isLiked ? 'text-rose-500' : 'text-slate-300 hover:text-white'
              }`}
              title="Like"
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? 'fill-rose-500 stroke-rose-500' : 'stroke-[2]'
                }`}
              />
            </button>

            {/* Comment Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-slate-300 hover:text-white transition-colors"
              title="Comments"
            >
              <MessageCircle className="w-6 h-6 stroke-[2]" />
            </button>

            {/* Share Button (opens Share to story / copy link) */}
            <button
              onClick={() => setShowShareModal(true)}
              className="text-slate-300 hover:text-white transition-colors"
              title="Share post"
            >
              <Send className="w-5 h-5 stroke-[2] -rotate-12" />
            </button>
          </div>

          {/* Save / Bookmark Button */}
          <button
            onClick={handleSave}
            className={`transition-colors ${
              isSaved ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
            }`}
            title="Save post"
          >
            <Bookmark
              className={`w-6 h-6 ${
                isSaved ? 'fill-indigo-400 stroke-indigo-400' : 'stroke-[2]'
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="text-xs font-bold text-slate-200">
          {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
        </div>

        {/* Caption or Edit Caption Form */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-2 py-1">
            <textarea
              rows={2}
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              className="w-full bg-[#181c28] border border-indigo-500/70 rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
            />
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditCaption(post.caption);
                  setIsEditing(false);
                }}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          post.caption && (
            <div className="text-xs text-slate-300 leading-relaxed">
              <span
                onClick={() => onOpenUser && onOpenUser(author.id)}
                className="font-bold text-white mr-1.5 cursor-pointer hover:underline"
              >
                {author.username}
              </span>
              <span>{post.caption}</span>
            </div>
          )
        )}

        {/* Comments Section */}
        {post.allowComments === false ? (
          <div className="text-[11px] text-slate-500 italic pt-1">
            Comments are turned off for this post.
          </div>
        ) : (
          <>
            {post.comments.length > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-left text-[11px] text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showComments
                  ? 'Hide comments'
                  : `View all ${post.comments.length} comments`}
              </button>
            )}

            {/* Comments Expanded List */}
            {showComments && post.comments.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-slate-800/60 max-h-36 overflow-y-auto no-scrollbar">
                {post.comments.map((comm) => {
                  const commAuthor = store.getUserById(comm.userId);
                  return (
                    <div
                      key={comm.id}
                      className="text-xs text-slate-300 flex items-baseline gap-1.5"
                    >
                      <span className="font-semibold text-white">
                        {commAuthor?.username || 'user'}:
                      </span>
                      <span className="text-slate-300">{comm.text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inline Add Comment Input */}
            <form
              onSubmit={handleAddComment}
              className="flex items-center gap-2 pt-1 border-t border-slate-800/40"
            >
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none py-1"
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Post
                </button>
              )}
            </form>
          </>
        )}
      </div>

      {/* Share to Story / Copy Link Modal ("jab user share par click kare tu wo uder SE us post ko story par laga sake share kar sake copy") */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#11141e] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white">Share Post</span>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {/* Add to Story */}
              <button
                onClick={handleShareToStory}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-white hover:bg-indigo-600/25 transition-colors font-semibold"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Add post to your Story (24h)</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors font-medium"
              >
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy link to post</span>
              </button>

              {/* Direct message in chat if other user */}
              {author.id !== currentUser.id && onOpenChatWith && (
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    onOpenChatWith(author.id);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors font-medium"
                >
                  <Send className="w-4 h-4 text-slate-400" />
                  <span>Send in direct message to @{author.username}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
