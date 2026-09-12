import React, { useState } from 'react';
import { User } from '../types';
import { store } from '../services/store';
import { MessageSquare, Edit3, Search, Lock, UserCheck, Clock, X } from 'lucide-react';

interface ChatsViewProps {
  currentUser: User;
  onOpenChatWith: (userId: string) => void;
  onOpenExplore: () => void;
}

export const ChatsView: React.FC<ChatsViewProps> = ({
  currentUser,
  onOpenChatWith,
  onOpenExplore,
}) => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState('');

  const conversations = store.getConversations(currentUser.id);
  const allUsers = store.getUsers().filter((u) => u.id !== currentUser.id);

  const filteredNewChatUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Chats Header matching video (00:15) */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
        <h1 className="text-lg font-bold text-white tracking-tight">Chats</h1>
        <button
          onClick={() => setShowNewChatModal(true)}
          className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors"
          title="New Chat"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      {/* Conversations List or Empty State */}
      {conversations.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-1">
            <MessageSquare className="w-8 h-8 stroke-1" />
          </div>
          <h2 className="text-base font-bold text-slate-200">No conversations</h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Search someone and send a request to chat.
          </p>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
          >
            Start a new chat
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => {
            const partnerId = conv.participantIds.find((id) => id !== currentUser.id);
            const partner = partnerId ? store.getUserById(partnerId) : null;
            if (!partner) return null;

            const privacy = store.canSendMessage(currentUser.id, partner.id);
            const lastMsg = conv.lastMessage;
            const timeStr = lastMsg
              ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div
                key={conv.id}
                onClick={() => onOpenChatWith(partner.id)}
                className="bg-[#121622] hover:bg-[#151928] border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={partner.avatar}
                      alt={partner.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-700"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#121622]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-semibold text-white truncate">
                        {partner.displayName}
                      </span>
                      <span className="text-[10px] text-slate-400">@{partner.username}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400 truncate mt-0.5">
                      {!privacy.allowed && (
                        <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                      )}
                      <span className="truncate">
                        {lastMsg ? lastMsg.content : 'Started a conversation'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 space-y-1">
                  <span className="text-[10px] text-slate-500">{timeStr}</span>
                  {!privacy.allowed && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20">
                      Follow req needed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Start New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#11141e] border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Start a New Chat</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter */}
            <div className="relative my-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search usernames..."
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                className="w-full bg-[#181c28] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Users list */}
            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
              {filteredNewChatUsers.map((user) => {
                const privacy = store.canSendMessage(currentUser.id, user.id);
                const followStatus = store.getFollowStatus(currentUser.id, user.id);

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      setShowNewChatModal(false);
                      onOpenChatWith(user.id);
                    }}
                    className="p-3 rounded-2xl bg-[#141824] hover:bg-[#1a1f30] border border-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-xs text-white">
                          {user.displayName}
                        </div>
                        <div className="text-[11px] text-slate-400">@{user.username}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      {privacy.allowed ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Ready to chat</span>
                        </span>
                      ) : followStatus === 'pending' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Request pending</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Requires follow</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 text-center">
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  onOpenExplore();
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Or explore new people to follow →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
