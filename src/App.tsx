import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { User, Post, Story } from './types';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { StoriesTray } from './components/StoriesTray';
import { FeedPost } from './components/FeedPost';
import { ExploreView } from './components/ExploreView';
import { NotificationsView } from './components/NotificationsView';
import { ChatsView } from './components/ChatsView';
import { ProfileView } from './components/ProfileView';
import { StoryViewerModal } from './components/StoryViewerModal';
import { ChatRoomModal } from './components/ChatRoomModal';
import { CreateModal } from './components/CreateModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { ArrowLeft, X, Plus, Sparkles, Upload } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => store.getCurrentUser());
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  // Modals state
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [activeChatRecipientId, setActiveChatRecipientId] = useState<string | null>(null);
  const [createType, setCreateType] = useState<'post' | 'story' | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedPostModal, setSelectedPostModal] = useState<Post | null>(null);

  // Re-render trigger on store changes
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setTick((t) => t + 1);
    });
    return () => unsubscribe();
  }, []);

  // If no account exists yet (first time open), show Onboarding AuthModal immediately!
  // "yard ja koi first time open kare tu na is SE phale aye ak user name Jo ak name ak hi rakh sakta hai user phir age aye date of birth..."
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex items-center justify-center p-4">
        <AuthModal
          isFirstTime={true}
          onSuccess={(user) => {
            setCurrentUser(user);
          }}
        />
      </div>
    );
  }

  const allUsers = store.getUsers();
  // Filter stories: only show friends' stories (users you follow) and your own!
  // "or story sirf friend ki show ho abhi Kuch na ho na koi id na koi post na koi story"
  const friendStories = store.getStoriesForFriends(currentUser.id);

  // Filter posts: everyone can see public posts, or friends-only posts if following author
  const allPosts = store.getPosts();
  const visiblePosts = allPosts.filter((post) => {
    if (post.userId === currentUser.id) return true;
    if (post.visibility === 'friends') {
      return store.getFollowStatus(currentUser.id, post.userId) === 'following';
    }
    return true;
  });

  const unreadNotifs = store
    .getNotificationsForUser(currentUser.id)
    .filter((n) => !n.read);

  // Unread chats count
  const conversations = store.getConversations(currentUser.id);
  const unreadChatsCount = conversations.reduce((acc, conv) => {
    const unreadMsgs = store
      .getMessagesForConversation(conv.id)
      .filter((m) => m.receiverId === currentUser.id && !m.read);
    return acc + (unreadMsgs.length > 0 ? 1 : 0);
  }, 0);

  const handleSelectTab = (tab: TabType) => {
    setViewingUserId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchUser = (userId: string) => {
    store.setCurrentUser(userId);
    setCurrentUser(store.getCurrentUser());
    setViewingUserId(null);
  };

  const handleOpenUserProfile = (userId: string) => {
    if (userId === currentUser.id) {
      setActiveTab('profile');
      setViewingUserId(null);
    } else {
      setViewingUserId(userId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const targetProfileUser = viewingUserId
    ? store.getUserById(viewingUserId)
    : currentUser;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top App Header with Notification & Settings Icons */}
      <Header
        onSelectTab={handleSelectTab}
        onOpenSettings={() => setShowSettingsModal(true)}
        unreadNotifications={unreadNotifs}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto px-3.5 pt-3 pb-24">
        {/* If viewing another user's profile with a back button */}
        {viewingUserId && targetProfileUser && (
          <div className="mb-3">
            <button
              onClick={() => setViewingUserId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-2 py-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <ProfileView
              user={targetProfileUser}
              currentUser={currentUser}
              onOpenCreatePost={() => setCreateType('post')}
              onOpenCreateStory={() => setCreateType('story')}
              onOpenChatWith={(id) => setActiveChatRecipientId(id)}
              onSelectPost={(p) => setSelectedPostModal(p)}
              onOpenEditProfile={() => {
                setIsEditingProfile(true);
                setShowAuthModal(true);
              }}
            />
          </div>
        )}

        {/* 1. Home Feed Tab */}
        {!viewingUserId && activeTab === 'home' && (
          <div className="animate-in fade-in duration-200">
            {/* Top Stories Tray: Friend-only filter */}
            <StoriesTray
              currentUser={currentUser}
              users={allUsers}
              stories={friendStories}
              onOpenStory={(id) => setActiveStoryId(id)}
              onAddStory={() => setCreateType('story')}
            />

            {/* Posts Feed */}
            {visiblePosts.length === 0 ? (
              <div className="py-20 px-4 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    No posts yet
                  </p>
                  <p className="text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Start by sharing your first post from your gallery, or discover people in Explore!
                  </p>
                </div>
                <button
                  onClick={() => setCreateType('post')}
                  className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Post</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {visiblePosts.map((post) => (
                  <FeedPost
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onOpenUser={handleOpenUserProfile}
                    onOpenChatWith={(id) => setActiveChatRecipientId(id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Explore Tab (Search is handled here exclusively) */}
        {!viewingUserId && activeTab === 'explore' && (
          <ExploreView
            currentUser={currentUser}
            onOpenUserProfile={handleOpenUserProfile}
            onOpenChatWith={(id) => setActiveChatRecipientId(id)}
          />
        )}

        {/* 3. Notifications Tab */}
        {!viewingUserId && activeTab === 'notifications' && (
          <NotificationsView
            currentUser={currentUser}
            onOpenUserProfile={handleOpenUserProfile}
            onOpenChatWith={(id) => setActiveChatRecipientId(id)}
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        )}

        {/* 4. Chats Tab */}
        {!viewingUserId && activeTab === 'chats' && (
          <ChatsView
            currentUser={currentUser}
            onOpenChatWith={(id) => setActiveChatRecipientId(id)}
            onOpenExplore={() => handleSelectTab('explore')}
          />
        )}

        {/* 5. Profile Tab */}
        {!viewingUserId && activeTab === 'profile' && (
          <ProfileView
            user={currentUser}
            currentUser={currentUser}
            onOpenCreatePost={() => setCreateType('post')}
            onOpenCreateStory={() => setCreateType('story')}
            onOpenChatWith={(id) => setActiveChatRecipientId(id)}
            onSelectPost={(p) => setSelectedPostModal(p)}
            onOpenEditProfile={() => {
              setIsEditingProfile(true);
              setShowAuthModal(true);
            }}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenCreate={(type) => setCreateType(type)}
        currentUser={currentUser}
        unreadChatsCount={unreadChatsCount}
        unreadNotifsCount={unreadNotifs.length}
      />

      {/* Story Viewer Full-screen Modal */}
      {activeStoryId && (
        <StoryViewerModal
          initialStoryId={activeStoryId}
          currentUser={currentUser}
          stories={friendStories}
          onClose={() => setActiveStoryId(null)}
          onStoryReplySent={(recipientId) => {
            setActiveChatRecipientId(recipientId);
          }}
        />
      )}

      {/* Chat Room Dialog Modal */}
      {activeChatRecipientId && (
        <ChatRoomModal
          recipientId={activeChatRecipientId}
          currentUser={currentUser}
          onClose={() => setActiveChatRecipientId(null)}
        />
      )}

      {/* Create Post / Story Modal (with Gallery Upload) */}
      {createType && (
        <CreateModal
          initialType={createType}
          currentUser={currentUser}
          onClose={() => setCreateType(null)}
          onCreated={(type) => {
            if (type === 'post') {
              setActiveTab('home');
            }
          }}
        />
      )}

      {/* Auth / Signup / Edit Profile Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
          }}
          editUser={isEditingProfile ? currentUser : undefined}
        />
      )}

      {/* Comprehensive Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          currentUser={currentUser}
          onClose={() => setShowSettingsModal(false)}
          onSwitchUser={(id) => handleSwitchUser(id)}
          onAddNewAccount={() => {
            setIsEditingProfile(false);
            setShowAuthModal(true);
          }}
          onLogout={() => {
            setShowSettingsModal(false);
            store.resetToCleanState();
            setCurrentUser(store.getCurrentUser());
          }}
          onAccountDeleted={() => {
            setShowSettingsModal(false);
            setCurrentUser(store.getCurrentUser());
          }}
        />
      )}

      {/* Post Detail Modal (when tapped from profile thumbnail) */}
      {selectedPostModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#12151e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedPostModal(null)}
              className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <FeedPost
              post={selectedPostModal}
              currentUser={currentUser}
              onOpenUser={(id) => {
                setSelectedPostModal(null);
                handleOpenUserProfile(id);
              }}
              onOpenChatWith={(id) => {
                setSelectedPostModal(null);
                setActiveChatRecipientId(id);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
