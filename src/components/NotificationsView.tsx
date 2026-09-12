import React from 'react';
import { User, NotificationItem } from '../types';
import { store } from '../services/store';
import { UserCheck, Heart, MessageCircle, Sparkles, Check, X, ShieldCheck, Settings } from 'lucide-react';

interface NotificationsViewProps {
  currentUser: User;
  onOpenUserProfile: (userId: string) => void;
  onOpenChatWith: (userId: string) => void;
  onOpenSettings: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  currentUser,
  onOpenUserProfile,
  onOpenChatWith,
  onOpenSettings,
}) => {
  const notifications = store.getNotificationsForUser(currentUser.id);

  // Group notifications: Follow Requests vs General Activities
  const followRequestsNotifs = notifications.filter(
    (n) => n.type === 'follow_request'
  );
  const otherNotifs = notifications.filter(
    (n) => n.type !== 'follow_request'
  );

  const handleAcceptRequest = (fromUserId: string, notifId: string) => {
    store.acceptFollowRequest(fromUserId, currentUser.id);
    store.markNotificationAsRead(notifId);
  };

  const handleRejectRequest = (fromUserId: string, notifId: string) => {
    store.rejectFollowRequest(fromUserId, currentUser.id);
  };

  return (
    <div className="w-full flex flex-col space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header with Settings Button */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-400">Follow requests & activity on Orbit</p>
        </div>
        <div className="flex items-center space-x-2">
          {notifications.length > 0 && (
            <button
              onClick={() => store.markAllNotificationsAsRead(currentUser.id)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium mr-1"
            >
              Mark read
            </button>
          )}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
            title="Open Settings"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* 1. Pending Follow Requests Section */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 tracking-wide uppercase">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Follow Requests ({followRequestsNotifs.length})</span>
        </div>

        {followRequestsNotifs.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#12151e]/60 border border-slate-800/60 text-center text-xs text-slate-400">
            No pending follow requests right now.
          </div>
        ) : (
          <div className="space-y-2">
            {followRequestsNotifs.map((notif) => {
              const sender = store.getUserById(notif.fromUserId);
              if (!sender) return null;
              const currentStatus = store.getFollowStatus(sender.id, currentUser.id);
              const isAccepted = currentStatus === 'following';

              return (
                <div
                  key={notif.id}
                  className="bg-[#121622] border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md"
                >
                  <div
                    onClick={() => onOpenUserProfile(sender.id)}
                    className="flex items-center space-x-3 cursor-pointer group flex-1 min-w-0"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={sender.avatar}
                        alt={sender.displayName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-700 group-hover:border-indigo-500 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px]">
                        +
                      </div>
                    </div>

                    <div className="truncate">
                      <div className="text-xs text-slate-100 font-semibold group-hover:text-indigo-300 transition-colors truncate">
                        {sender.displayName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        @{sender.username} requested to follow you
                      </div>
                      <span className="text-[10px] text-slate-500">5h</span>
                    </div>
                  </div>

                  {/* Accept / Reject Action Buttons */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    {isAccepted ? (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Accepted</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(sender.id, notif.id)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_12px_rgba(99,102,241,0.35)] active:scale-95 transition-all flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(sender.id, notif.id)}
                          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors active:scale-95"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. General Activity Notifications */}
      <div className="space-y-2 pt-3">
        <div className="text-xs font-bold text-slate-400 tracking-wide uppercase">
          Earlier Activity
        </div>

        {otherNotifs.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#12151e]/40 border border-slate-800/40 text-center text-xs text-slate-500">
            No other activity yet.
          </div>
        ) : (
          <div className="space-y-2">
            {otherNotifs.map((notif) => {
              const sender = store.getUserById(notif.fromUserId);
              if (!sender) return null;

              return (
                <div
                  key={notif.id}
                  className={`bg-[#12151e] border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-3 transition-colors ${
                    !notif.read ? 'border-indigo-500/30 bg-[#141724]' : ''
                  }`}
                >
                  <div
                    onClick={() => onOpenUserProfile(sender.id)}
                    className="flex items-center space-x-3 cursor-pointer group flex-1 min-w-0"
                  >
                    <img
                      src={sender.avatar}
                      alt={sender.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />

                    <div className="truncate">
                      <p className="text-xs text-slate-200">
                        <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {sender.username}
                        </span>{' '}
                        {notif.text}
                      </p>
                      <span className="text-[10px] text-slate-500">Recent</span>
                    </div>
                  </div>

                  {/* Icon badge or direct action */}
                  <div className="shrink-0 flex items-center">
                    {notif.type.includes('like') && (
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    )}
                    {notif.type.includes('comment') && (
                      <MessageCircle className="w-4 h-4 text-indigo-400" />
                    )}
                    {notif.type.includes('follow_accept') && (
                      <button
                        onClick={() => onOpenChatWith(sender.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Chat now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
