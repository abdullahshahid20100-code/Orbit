import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Story, User } from '../types';
import { store } from '../services/store';

interface StoryViewerModalProps {
  initialStoryId: string;
  currentUser: User;
  onClose: () => void;
  onStoryReplySent?: (recipientId: string, text: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  initialStoryId,
  currentUser,
  onClose,
  onStoryReplySent,
}) => {
  const stories = store.getStories();
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = stories.findIndex((s) => s.id === initialStoryId);
    return idx !== -1 ? idx : 0;
  });
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<string | null>(null);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const currentStory = stories[currentIndex] || stories[0];
  const author = currentStory ? store.getUserById(currentStory.userId) : null;
  const hasLiked = currentStory?.likedBy.includes(currentUser.id) || false;

  const timerRef = useRef<number | null>(null);

  // Story auto-advance timer (5 seconds per story)
  useEffect(() => {
    if (isPaused) return;

    const step = 50; // ms
    const totalDuration = 5000; // 5s
    const increment = (step / totalDuration) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + increment;
      });
    }, step);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, stories.length]);

  const handleNextStory = () => {
    setProgress(0);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    setProgress(0);
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleToggleLike = () => {
    if (!currentStory) return;
    const nowLiked = store.toggleLikeStory(currentStory.id, currentUser.id);
    if (nowLiked) {
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 900);
    }
  };

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !currentStory || !author) return;

    // Check chat privacy: can current user send message to author?
    const check = store.canSendMessage(currentUser.id, author.id);
    if (!check.allowed) {
      setReplyStatus(check.reason || 'Cannot send reply: Follow request required.');
      setTimeout(() => setReplyStatus(null), 3500);
      return;
    }

    const replyContent = `Story reply: "${replyText.trim()}"`;
    const res = store.sendMessage({
      senderId: currentUser.id,
      receiverId: author.id,
      type: 'text',
      content: replyContent,
    });

    if (res.success) {
      setReplyText('');
      setReplyStatus('Reply sent to chat! ✓');
      if (onStoryReplySent) {
        onStoryReplySent(author.id, replyContent);
      }
      setTimeout(() => setReplyStatus(null), 2500);
    } else {
      setReplyStatus(res.error || 'Failed to send reply');
      setTimeout(() => setReplyStatus(null), 3000);
    }
  };

  if (!currentStory || !author) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md select-none">
      <div
        className="relative w-full max-w-md h-[100dvh] sm:h-[86vh] sm:max-h-[820px] bg-slate-950 sm:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Progress Segment Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center space-x-1.5">
          {stories.map((s, idx) => {
            let widthPercent = 0;
            if (idx < currentIndex) widthPercent = 100;
            else if (idx === currentIndex) widthPercent = progress;
            return (
              <div
                key={s.id}
                className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Author Header */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img
              src={author.avatar}
              alt={author.displayName}
              className="w-9 h-9 rounded-full object-cover border border-white/40 shadow"
            />
            <div className="flex items-baseline space-x-2">
              <span className="text-white text-sm font-semibold drop-shadow-md">
                {author.username}
              </span>
              <span className="text-white/70 text-xs drop-shadow-md">5h</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 rounded-full bg-black/40 text-white/90 hover:text-white hover:bg-black/60 transition-colors"
            title="Close story"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Media Viewport */}
        <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
          <img
            src={currentStory.mediaUrl}
            alt="Story media"
            className="w-full h-full object-contain"
          />

          {/* Double tap / Like heart burst */}
          {showHeartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-in zoom-in-50 fade-in duration-200">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-pulse" />
            </div>
          )}

          {/* Navigation Click Targets (Left / Right) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevStory();
            }}
            className="absolute left-0 top-16 bottom-20 w-1/4 z-10 flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity text-white/50 hover:text-white"
            title="Previous story"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextStory();
            }}
            className="absolute right-0 top-16 bottom-20 w-1/4 z-10 flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity text-white/50 hover:text-white"
            title="Next story"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Optional Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20 text-center">
              <span className="inline-block px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                {currentStory.caption}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Interactive Bar (Like & Reply Input) */}
        <div
          className="relative z-30 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {replyStatus && (
            <div className="text-[11px] font-medium text-center text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 rounded-lg py-1 px-2">
              {replyStatus}
            </div>
          )}

          <div className="flex items-center space-x-2.5">
            {/* Heart Like Button with Count */}
            <button
              onClick={handleToggleLike}
              className={`flex items-center space-x-1 p-2 rounded-full transition-all active:scale-125 ${
                hasLiked
                  ? 'text-rose-500 hover:text-rose-400'
                  : 'text-white/80 hover:text-white'
              }`}
              title="Like story"
            >
              <Heart
                className={`w-6 h-6 transition-transform ${
                  hasLiked ? 'fill-rose-500 stroke-rose-500' : 'stroke-2'
                }`}
              />
              <span className="text-xs font-semibold text-white">
                {currentStory.likesCount}
              </span>
            </button>

            {/* Reply Input */}
            <form
              onSubmit={handleSendReply}
              className="flex-1 flex items-center bg-white/15 border border-white/20 rounded-full px-3.5 py-1.5 backdrop-blur-md focus-within:border-indigo-400/80 transition-colors"
            >
              <input
                type="text"
                placeholder="Reply to story..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="w-full bg-transparent text-xs text-white placeholder-white/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="p-1 text-white/80 hover:text-white disabled:opacity-40 transition-colors"
                title="Send reply"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
