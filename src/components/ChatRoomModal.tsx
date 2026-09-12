import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  Mic,
  Square,
  Play,
  Pause,
  Video,
  Phone,
  Lock,
  CheckCheck,
  UserPlus,
  Clock,
  ShieldAlert,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { User, ChatMessage } from '../types';
import { store } from '../services/store';

interface ChatRoomModalProps {
  recipientId: string;
  currentUser: User;
  onClose: () => void;
}

export const ChatRoomModal: React.FC<ChatRoomModalProps> = ({
  recipientId,
  currentUser,
  onClose,
}) => {
  const recipient = store.getUserById(recipientId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // Check chat privacy permission
  // Rule: Users CANNOT send messages unless the recipient has accepted their follow request first
  const privacyCheck = store.canSendMessage(currentUser.id, recipientId);
  const followStatus = store.getFollowStatus(currentUser.id, recipientId);
  // Also check if recipient requested to follow current user
  const incomingStatus = store.getFollowStatus(recipientId, currentUser.id);

  // Load / listen to messages
  useEffect(() => {
    if (!recipient) return;
    const conv = store.getOrCreateConversation(currentUser.id, recipient.id);
    const msgs = store.getMessagesForConversation(conv.id);
    setMessages(msgs);
    store.markMessagesAsRead(conv.id, currentUser.id);

    const unsubscribe = store.subscribe(() => {
      const updatedConv = store.getOrCreateConversation(currentUser.id, recipient.id);
      setMessages(store.getMessagesForConversation(updatedConv.id));
    });

    return () => unsubscribe();
  }, [currentUser.id, recipientId, recipient]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !recipient) return;

    if (!privacyCheck.allowed) {
      setErrorBanner(
        privacyCheck.reason ||
          'Chat Privacy: You cannot send messages until they accept your follow request.'
      );
      return;
    }

    const res = store.sendMessage({
      senderId: currentUser.id,
      receiverId: recipient.id,
      type: 'text',
      content: inputText.trim(),
    });

    if (res.success) {
      setInputText('');
      setErrorBanner(null);
    } else {
      setErrorBanner(res.error || 'Failed to send');
    }
  };

  const handleSendVoiceNote = () => {
    if (!recipient) return;
    setIsRecording(false);

    if (!privacyCheck.allowed) {
      setErrorBanner(privacyCheck.reason || 'Chat Privacy: Follow request required.');
      return;
    }

    const duration = Math.max(1, recordingSeconds);
    store.sendMessage({
      senderId: currentUser.id,
      receiverId: recipient.id,
      type: 'voice',
      content: 'Voice note',
      audioDuration: duration,
    });
  };

  const handleSendSampleImage = () => {
    if (!recipient) return;
    if (!privacyCheck.allowed) {
      setErrorBanner(privacyCheck.reason || 'Chat Privacy: Follow request required.');
      return;
    }
    store.sendMessage({
      senderId: currentUser.id,
      receiverId: recipient.id,
      type: 'image',
      content:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    });
  };

  const handleFollowAction = () => {
    if (followStatus === 'none' || followStatus === 'rejected') {
      store.sendFollowRequest(currentUser.id, recipientId);
    }
  };

  const handleAcceptTheirRequest = () => {
    store.acceptFollowRequest(recipientId, currentUser.id);
  };

  if (!recipient) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg h-full sm:h-[90vh] bg-[#0c0f17] sm:rounded-3xl overflow-hidden flex flex-col border border-slate-800 shadow-2xl">
        {/* Chat Room Top Bar */}
        <div className="px-4 py-3 bg-[#11141e] border-b border-slate-800/80 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1.5 -ml-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <img
                src={recipient.avatar}
                alt={recipient.displayName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#11141e]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-100">
                  {recipient.displayName}
                </span>
                {recipient.isVerified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">@{recipient.username}</div>
            </div>
          </div>

          {/* Call actions */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                if (!privacyCheck.allowed) {
                  setErrorBanner('Video calls require accepted follow request first.');
                  return;
                }
                setIsVideoCallActive(true);
              }}
              className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-full transition-colors"
              title="Video Call"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (!privacyCheck.allowed) {
                  setErrorBanner('Voice calls require accepted follow request first.');
                  return;
                }
                alert(`Calling @${recipient.username}...`);
              }}
              className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-full transition-colors"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Call Simulation Modal */}
        {isVideoCallActive && (
          <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col justify-between p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="font-bold text-base">Orbit Video Call</h3>
                <p className="text-xs text-indigo-300">Connected with @{recipient.username}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                Live HD
              </span>
            </div>

            <div className="relative flex-1 my-4 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              <img
                src={recipient.avatar}
                alt={recipient.displayName}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-medium">
                {recipient.displayName}
              </div>
              {/* Picture-in-picture user video preview */}
              <div className="absolute top-4 right-4 w-28 h-36 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-2xl bg-black">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-2 text-[10px] text-white/90 font-semibold">
                  You
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsVideoCallActive(false)}
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/40"
              >
                <Phone className="w-4 h-4 rotate-[135deg]" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0c13] bg-[radial-gradient(#151926_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Privacy Protection Notice Banner */}
          {!privacyCheck.allowed && (
            <div className="bg-[#171a27] border border-indigo-500/40 rounded-2xl p-4 text-center space-y-2.5 shadow-lg animate-in fade-in">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Chat Privacy Protection</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Users <strong className="text-indigo-300 font-semibold">CANNOT</strong> send messages (text, voice, or video) to someone unless the other person accepts their follow request first.
                </p>
              </div>

              {/* Status & Actions */}
              <div className="pt-1 flex flex-wrap justify-center gap-2">
                {incomingStatus === 'pending' && (
                  <button
                    onClick={handleAcceptTheirRequest}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <span>Accept @{recipient.username}&apos;s Follow Request</span>
                  </button>
                )}

                {followStatus === 'none' && (
                  <button
                    onClick={handleFollowAction}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Send Follow Request to Unlock Chat</span>
                  </button>
                )}

                {followStatus === 'pending' && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-indigo-300 text-xs font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>Follow Request Pending Approval</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {errorBanner && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-between">
              <span>{errorBanner}</span>
              <button onClick={() => setErrorBanner(null)}>
                <X className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          )}

          {/* Conversation History */}
          {messages.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <span>No messages yet with @{recipient.username}.</span>
              {privacyCheck.allowed && (
                <span className="text-slate-400 mt-1">Say hello!</span>
              )}
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              const timeStr = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                      isMe
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none'
                        : 'bg-[#181c28] border border-slate-800 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {/* Text Message */}
                    {msg.type === 'text' && (
                      <p className="leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    )}

                    {/* Image Message */}
                    {msg.type === 'image' && (
                      <div className="rounded-xl overflow-hidden my-1 max-h-56">
                        <img
                          src={msg.content}
                          alt="Chat attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Voice Note Message with Playback */}
                    {msg.type === 'voice' && (
                      <div className="flex items-center space-x-2 py-0.5 min-w-[170px]">
                        <button
                          onClick={() => {
                            if (playingAudioId === msg.id) {
                              setPlayingAudioId(null);
                            } else {
                              setPlayingAudioId(msg.id);
                              setTimeout(() => setPlayingAudioId(null), (msg.audioDuration || 3) * 1000);
                            }
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isMe ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'
                          }`}
                        >
                          {playingAudioId === msg.id ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                        {/* Audio visualizer bars */}
                        <div className="flex-1 flex items-center space-x-0.5 h-6">
                          {[40, 70, 90, 60, 100, 50, 80, 45, 95, 30, 85].map((h, i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-full transition-all duration-200 ${
                                isMe ? 'bg-white/80' : 'bg-indigo-400'
                              } ${playingAudioId === msg.id ? 'animate-pulse' : ''}`}
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] opacity-80 shrink-0">
                          0:0{msg.audioDuration || 3}
                        </span>
                      </div>
                    )}

                    {/* Message metadata */}
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isMe ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{timeStr}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-indigo-300" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-[#11141e] border-t border-slate-800 shrink-0">
          {!privacyCheck.allowed ? (
            <div className="flex items-center justify-center p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 gap-2">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Messaging disabled until @{recipient.username} accepts your follow request.
              </span>
            </div>
          ) : isRecording ? (
            /* Voice recording interface */
            <div className="flex items-center justify-between bg-slate-900/90 border border-indigo-500/50 rounded-2xl px-4 py-2.5">
              <div className="flex items-center space-x-2 text-xs text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold">Recording voice note...</span>
                <span className="text-slate-300 font-mono">0:0{recordingSeconds}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRecording(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendVoiceNote}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Voice</span>
                </button>
              </div>
            </div>
          ) : (
            /* Normal Message Input */
            <form onSubmit={handleSendText} className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSendSampleImage}
                className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-full transition-colors"
                title="Send photo"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsRecording(true)}
                className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-full transition-colors"
                title="Record voice note"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder={`Message @${recipient.username}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-[#161a26] border border-slate-700/80 rounded-2xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-md active:scale-95"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
