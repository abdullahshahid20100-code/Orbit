import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { User } from '../types';

interface AvatarPreviewModalProps {
  user: User | null;
  onClose: () => void;
}

export const AvatarPreviewModal: React.FC<AvatarPreviewModalProps> = ({
  user,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!user) return null;

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-sm w-full bg-[#121520] border border-slate-700/80 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Close preview"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Profile Picture View</span>
        </div>

        {/* Enlarged Avatar */}
        <div className="relative group w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-indigo-500/40 shadow-[0_0_40px_rgba(99,102,241,0.25)] bg-black mb-4">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Details */}
        <div className="w-full space-y-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {user.displayName}
            </h3>
            {user.isVerified && (
              <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            )}
          </div>

          <p className="text-xs text-indigo-300 font-medium">@{user.username}</p>

          {/* User ID Pill */}
          <div className="pt-1 flex items-center justify-center">
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Click to copy ID"
            >
              <span className="font-mono text-slate-400">ID: {user.id}</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>

          {user.bio && (
            <p className="text-xs text-slate-400 pt-2 px-2 max-w-xs line-clamp-3 leading-relaxed">
              {user.bio}
            </p>
          )}

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-around text-xs text-slate-300 w-full">
            <div>
              <span className="font-bold text-white">{user.postsCount}</span>
              <span className="text-slate-400 ml-1">posts</span>
            </div>
            <div>
              <span className="font-bold text-white">{user.followersCount}</span>
              <span className="text-slate-400 ml-1">followers</span>
            </div>
            <div>
              <span className="font-bold text-white">{user.followingCount}</span>
              <span className="text-slate-400 ml-1">following</span>
            </div>
          </div>
        </div>

        {/* Tip */}
        <p className="text-[10px] text-slate-500 mt-4">
          Tip: Tap anywhere outside or press Esc to close
        </p>
      </div>
    </div>
  );
};
