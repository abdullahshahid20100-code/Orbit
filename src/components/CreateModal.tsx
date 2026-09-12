import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Sparkles, Upload, Check, Globe, Users } from 'lucide-react';
import { User } from '../types';
import { store, SAMPLE_ASSETS } from '../services/store';

interface CreateModalProps {
  initialType: 'post' | 'story';
  currentUser: User;
  onClose: () => void;
  onCreated: (type: 'post' | 'story') => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  initialType,
  currentUser,
  onClose,
  onCreated,
}) => {
  const [type, setType] = useState<'post' | 'story'>(initialType);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [customUrl, setCustomUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<'everyone' | 'friends'>(
    currentUser.postVisibility || 'everyone'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick aesthetic presets if user wants inspiration
  const presets = [
    { label: 'Minimal Luxury', url: SAMPLE_ASSETS.zhamCard },
    { label: 'Sunset Glow', url: SAMPLE_ASSETS.sunsetPost },
    { label: 'Cyber City', url: SAMPLE_ASSETS.neonArchitecture },
    { label: 'Orbit Nebula', url: SAMPLE_ASSETS.orbitConcept },
  ];

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setCustomUrl('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mediaUrl = selectedImage || customUrl.trim();
    if (!mediaUrl) {
      // Prompt user to select an image from gallery
      fileInputRef.current?.click();
      return;
    }

    setIsSubmitting(true);

    if (type === 'post') {
      const newPost = store.createPost({
        userId: currentUser.id,
        mediaUrl,
        caption: caption.trim(),
      });
      newPost.visibility = visibility;
      newPost.allowComments = currentUser.allowComments !== false;
    } else {
      store.createStory({
        userId: currentUser.id,
        mediaUrl,
        caption: caption.trim() || undefined,
      });
    }

    setIsSubmitting(false);
    onCreated(type);
    onClose();
  };

  const activeMedia = selectedImage || customUrl.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#11141e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          {/* Toggle Post vs Story */}
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => setType('post')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                type === 'post'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Post
            </button>
            <button
              onClick={() => setType('story')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                type === 'story'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Story (24h)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {/* Main Gallery Upload Dropzone ("dp story or post gallery SE lagate yarrrrr") */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Media from Gallery</span>
              <span className="text-[10px] text-indigo-400 font-normal">Choose from device</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
              className="hidden"
            />

            {activeMedia ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-indigo-500/50 group shadow-inner">
                <img
                  src={activeMedia}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md hover:bg-black text-white text-xs font-medium border border-white/20 flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-[#161a27] hover:bg-[#1a2030] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 group-hover:scale-110 flex items-center justify-center mb-2 transition-transform">
                  <Upload className="w-6 h-6 stroke-[2.2]" />
                </div>
                <p className="text-xs font-bold text-white mb-0.5">
                  Select Photo from Gallery
                </p>
                <p className="text-[11px] text-slate-400">
                  Tap to browse photos on your device
                </p>
              </div>
            )}
          </div>

          {/* Quick aesthetic presets / alternate option */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">
              Or pick sample aesthetic:
            </span>
            <div className="flex space-x-2 overflow-x-auto no-scrollbar py-0.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedImage(p.url);
                    setCustomUrl('');
                  }}
                  className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === p.url
                      ? 'border-indigo-500 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                  title={p.label}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Post Visibility Selector (if Post) ("apni posts sirf friends ko show krana chate hai ya sab ko") */}
          {type === 'post' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Who can see this post?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('everyone')}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    visibility === 'everyone'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Everyone</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('friends')}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    visibility === 'friends'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Friends Only</span>
                </button>
              </div>
            </div>
          )}

          {/* Caption Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              {type === 'post' ? 'Caption' : 'Story Text Overlay'}
            </label>
            <textarea
              rows={3}
              placeholder={
                type === 'post'
                  ? 'Write a caption for your post...'
                  : 'Add a thought or caption to your story...'
              }
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-[#181c28] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !activeMedia}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-[0_0_16px_rgba(99,102,241,0.4)] disabled:opacity-40 transition-all active:scale-98"
            >
              {isSubmitting
                ? 'Publishing...'
                : type === 'post'
                ? 'Share to Feed'
                : 'Share to Story (24h)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
