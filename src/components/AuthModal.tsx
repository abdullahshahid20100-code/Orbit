import React, { useState, useEffect, useRef } from 'react';
import { X, Check, AlertCircle, Camera, Upload, Calendar, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { OrbitLogo } from './OrbitLogo';
import { store } from '../services/store';
import { User } from '../types';

interface AuthModalProps {
  onClose?: () => void;
  onSuccess: (user: User) => void;
  editUser?: User;
  isFirstTime?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onSuccess,
  editUser,
  isFirstTime = false,
}) => {
  const isEditing = Boolean(editUser);

  const [displayName, setDisplayName] = useState(editUser?.displayName || '');
  const [username, setUsername] = useState(editUser?.username || '');
  const [dob, setDob] = useState(editUser?.dob || '');
  const [password, setPassword] = useState(editUser?.password || '');
  const [bio, setBio] = useState(editUser?.bio || '');
  const [avatar, setAvatar] = useState(editUser?.avatar || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [validationState, setValidationState] = useState<{
    valid: boolean;
    error: string | null;
  }>({ valid: false, error: null });

  const [isChecking, setIsChecking] = useState(false);

  // Live unique username validation - enforcing small letters
  useEffect(() => {
    const clean = username.trim().toLowerCase();
    if (!clean) {
      setValidationState({ valid: false, error: null });
      return;
    }

    setIsChecking(true);
    const timeout = setTimeout(() => {
      const res = store.validateUsername(clean, editUser?.id);
      setValidationState(res);
      setIsChecking(false);
    }, 120);

    return () => clearTimeout(timeout);
  }, [username, editUser?.id]);

  // Direct Gallery / File upload for DP
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername || (!validationState.valid && (!isEditing || cleanUsername !== editUser?.username))) {
      return;
    }

    if (isEditing && editUser) {
      const updateRes = store.updateUserProfile(editUser.id, {
        displayName: displayName.trim(),
        username: cleanUsername,
        dob: dob || undefined,
        password: password.trim() || editUser.password,
        bio: bio.trim(),
        avatar: avatar || editUser.avatar,
      });
      if (updateRes.success) {
        const updated = store.getUserById(editUser.id);
        if (updated) onSuccess(updated);
        if (onClose) onClose();
      }
    } else {
      const finalAvatar =
        avatar ||
        `https://api.dicebear.com/7.x/shapes/svg?seed=${cleanUsername}`;

      const createRes = store.createUser({
        displayName: displayName.trim() || cleanUsername,
        username: cleanUsername,
        dob: dob || undefined,
        password: password.trim() || 'orbit123',
        bio: bio.trim(),
        avatar: finalAvatar,
      });

      if (createRes.success && createRes.user) {
        onSuccess(createRes.user);
        if (onClose) onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#10131d] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative flex flex-col max-h-[95vh] overflow-y-auto no-scrollbar">
        {/* Close Button if not first time forced onboarding */}
        {!isFirstTime && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <OrbitLogo size="lg" showBackground={true} className="mb-2.5" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isEditing ? 'Edit Profile' : 'Welcome to Orbit'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            {isEditing
              ? 'Update your personal details & handle'
              : 'Create your unique profile to start sharing stories & connecting'}
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* 1. Display Name ("ak name bhi ho wo ak jasa ho Sakta hai") */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Your Name <span className="text-slate-500 font-normal">(can be anything)</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Abdullah Shahid"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[#181c28] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* 2. Unique Username ("user name Jo ak name ak hi rakh sakta hai user" + "sare letter small ho") */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Unique Username <span className="text-indigo-400">*</span>
              </label>
              <span className="text-[10px] text-slate-400">
                Small letters only (a-z)
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                @
              </span>
              <input
                type="text"
                required
                placeholder="abdullahshahid"
                value={username}
                // Automatically convert to lowercase letters and remove spaces
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))
                }
                className={`w-full bg-[#181c28] border rounded-xl pl-8 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  username.trim().length >= 3
                    ? validationState.valid
                      ? 'border-emerald-500/70 focus:border-emerald-500'
                      : 'border-rose-500/70 focus:border-rose-500'
                    : 'border-slate-700/80 focus:border-indigo-500'
                }`}
              />

              {/* Status Indicator Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isChecking ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                ) : username.trim().length >= 3 ? (
                  validationState.valid ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )
                ) : null}
              </div>
            </div>

            {/* Validation Text Feedback */}
            {username.trim().length > 0 && (
              <div className="mt-1 text-[11px]">
                {validationState.valid ? (
                  <span className="text-emerald-400 font-medium">
                    ✓ @{username.toLowerCase()} is available!
                  </span>
                ) : validationState.error ? (
                  <span className="text-rose-400 font-medium">
                    ✕ {validationState.error}
                  </span>
                ) : null}
              </div>
            )}
          </div>

          {/* 3. Date of Birth ("phir age aye date of birth") */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Date of Birth / Age
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-[#181c28] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 4. Password ("is k Lia phale password laga na ho ga") */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Password <span className="text-slate-400 font-normal">(for login & deletion)</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="Create secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181c28] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 5. Profile Picture (DP) from Gallery ("dp story or post gallery SE lagate yarrrrr" + "(optional) baad Mai bhi set kar le") */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Profile Photo (DP) <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <span className="text-[10px] text-indigo-400">From gallery</span>
            </div>

            <div className="flex items-center space-x-3 bg-[#181c28] p-2.5 rounded-2xl border border-slate-700/70">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-900 border-2 border-indigo-500/50 shrink-0">
                {avatar ? (
                  <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <UserIcon className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose from Gallery</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
                <p className="text-[10px] text-slate-400">
                  {avatar ? 'Image selected! Click again to change.' : 'You can also add or change this later.'}
                </p>
              </div>
            </div>
          </div>

          {/* 6. About / Bio ("phir about (optional)") */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              About / Bio <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Hi / Exploring the orbit..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#181c28] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit / Finish Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={
                !username.trim() ||
                !displayName.trim() ||
                !password.trim() ||
                (!validationState.valid && (!isEditing || username.trim().toLowerCase() !== editUser?.username.toLowerCase()))
              }
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-[0_0_16px_rgba(99,102,241,0.4)] disabled:opacity-40 transition-all active:scale-98 flex items-center justify-center gap-1.5"
            >
              <span>{isEditing ? 'Save Profile' : 'Enter Orbit'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
