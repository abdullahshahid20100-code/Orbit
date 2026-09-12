import React, { useState } from 'react';
import {
  X,
  Shield,
  MessageSquare,
  Users,
  UserPlus,
  LogOut,
  Trash2,
  Lock,
  Check,
  AlertTriangle,
  Globe,
  UserCheck,
} from 'lucide-react';
import { User } from '../types';
import { store } from '../services/store';

interface SettingsModalProps {
  currentUser: User;
  onClose: () => void;
  onSwitchUser: (userId: string) => void;
  onAddNewAccount: () => void;
  onLogout: () => void;
  onAccountDeleted: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  onClose,
  onSwitchUser,
  onAddNewAccount,
  onLogout,
  onAccountDeleted,
}) => {
  const [postVisibility, setPostVisibility] = useState<'everyone' | 'friends'>(
    currentUser.postVisibility || 'everyone'
  );
  const [allowComments, setAllowComments] = useState<boolean>(
    currentUser.allowComments !== false
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Delete account confirmation states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const allUsers = store.getUsers();

  const handleSavePrivacy = (
    newVisibility: 'everyone' | 'friends',
    newComments: boolean
  ) => {
    setPostVisibility(newVisibility);
    setAllowComments(newComments);
    store.updateUserProfile(currentUser.id, {
      postVisibility: newVisibility,
      allowComments: newComments,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleConfirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword.trim()) {
      setDeleteError('Please enter your password');
      return;
    }

    const res = store.deleteAccount(currentUser.id, deletePassword);
    if (res.success) {
      onAccountDeleted();
    } else {
      setDeleteError(res.error || 'Failed to delete account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#10131d] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white">Settings</h2>
            {savedSuccess && (
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-5 no-scrollbar text-xs">
          {/* Current User Card */}
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#141824] border border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-12 h-12 rounded-full object-cover border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm truncate">
                {currentUser.displayName}
              </h3>
              <p className="text-indigo-400 text-xs">@{currentUser.username}</p>
              {currentUser.dob && (
                <p className="text-slate-500 text-[11px]">DOB: {currentUser.dob}</p>
              )}
            </div>
          </div>

          {/* 1. Privacy & Post Visibility ("apni posts sirf friends ko show krana chate hai ya sab ko") */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-slate-200 font-bold tracking-wide uppercase text-[11px]">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Post Visibility & Privacy</span>
            </div>

            <div className="space-y-2 bg-[#141824] p-3 rounded-2xl border border-slate-800/80">
              <p className="text-slate-400 text-[11px]">
                Choose who can view your published posts:
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSavePrivacy('everyone', allowComments)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                    postVisibility === 'everyone'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4 mb-1 text-indigo-400" />
                  <span className="font-bold text-xs">Everyone</span>
                  <span className="text-[10px] text-slate-400">Public feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSavePrivacy('friends', allowComments)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                    postVisibility === 'friends'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 mb-1 text-indigo-400" />
                  <span className="font-bold text-xs">Friends Only</span>
                  <span className="text-[10px] text-slate-400">Followers only</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Comments Control ("comments on ya phir off") */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-200 font-bold tracking-wide uppercase text-[11px]">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Comments on Posts</span>
            </div>

            <div className="bg-[#141824] p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-xs">Allow comments</p>
                <p className="text-slate-400 text-[11px]">
                  {allowComments ? 'People can comment on your posts' : 'Comments are turned off'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSavePrivacy(postVisibility, !allowComments)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  allowComments ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    allowComments ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 3. Account Switcher / Add Account */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-200 font-bold tracking-wide uppercase text-[11px]">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Accounts</span>
            </div>

            <div className="bg-[#141824] p-3 rounded-2xl border border-slate-800/80 space-y-2">
              {allUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    if (u.id !== currentUser.id) {
                      onSwitchUser(u.id);
                      onClose();
                    }
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                    u.id === currentUser.id
                      ? 'bg-indigo-600/10 border border-indigo-500/30'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <img
                      src={u.avatar}
                      alt={u.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">
                        {u.displayName}
                      </p>
                      <p className="text-[11px] text-slate-400">@{u.username}</p>
                    </div>
                  </div>

                  {u.id === currentUser.id ? (
                    <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 hover:text-white">
                      Switch
                    </span>
                  )}
                </div>
              ))}

              <button
                onClick={() => {
                  onClose();
                  onAddNewAccount();
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span>Add new account</span>
              </button>
            </div>
          </div>

          {/* 4. Logout Action */}
          <div>
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full py-2.5 rounded-2xl bg-slate-800/70 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700/80 transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Log out (@{currentUser.username})</span>
            </button>
          </div>

          {/* 5. Danger Zone: Permanent Account Deletion with Password */}
          <div className="pt-2 border-t border-slate-800/80">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2 px-3 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Permanently delete account</span>
              </button>
            ) : (
              <form
                onSubmit={handleConfirmDelete}
                className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2.5 animate-in fade-in"
              >
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Permanent Account Deletion</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Enter your account password to confirm. This will permanently remove your account, posts, stories, and chat history:
                </p>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter password..."
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      setDeleteError(null);
                    }}
                    className="w-full bg-slate-900 border border-rose-500/50 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  />
                </div>

                {deleteError && (
                  <p className="text-[11px] text-rose-400 font-medium">
                    {deleteError}
                  </p>
                )}

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword('');
                      setDeleteError(null);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
                  >
                    Delete Forever
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
