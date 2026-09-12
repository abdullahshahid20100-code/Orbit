import {
  User,
  Post,
  Story,
  FollowRequest,
  NotificationItem,
  ChatMessage,
  ChatConversation,
  StoryHighlight,
  FollowStatus,
} from '../types';

// High-definition sample assets matching the user's video & aesthetic
export const SAMPLE_ASSETS = {
  // Abdullah Shahid's avatar (matching the user portrait from the video)
  abdullahAvatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  // Alternative portrait resembling the youth in black shirt
  abdullahPhoto:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  // Shahid Iqbal avatar (sunset ocean from video 00:02)
  shahidAvatar:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  // Elena Rostova avatar
  elenaAvatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  // Marcus Vance avatar
  marcusAvatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',

  // ZHAM Collections luxury showcase image (from video 00:00 & 00:23)
  zhamPostImage:
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
  // Alternate luxury dark card with monogram style
  zhamCard:
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80',
  // Sunset post
  sunsetPost:
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80',
  // Neon architecture post
  neonArchitecture:
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80',
  // Orbit concept
  orbitConcept:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
};

// Initial Users: empty by default so ONLY real accounts created by users appear
const INITIAL_USERS: User[] = [];

// Initial Seed Posts (Matching Abdullah Shahid's ZHAM post in video)
const INITIAL_POSTS: Post[] = [
  {
    id: 'post_zham',
    userId: 'usr_abdullah',
    mediaUrl: SAMPLE_ASSETS.zhamPostImage,
    caption: 'zham collections',
    likesCount: 2,
    likedBy: ['usr_shahid', 'usr_elena'],
    savedBy: ['usr_abdullah'],
    comments: [
      {
        id: 'comm_1',
        userId: 'usr_shahid',
        text: 'Minimalist luxury aesthetic! 🔥',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // "5h"
  },
  {
    id: 'post_sunset',
    userId: 'usr_shahid',
    mediaUrl: SAMPLE_ASSETS.sunsetPost,
    caption: 'Golden hour reflections over the ocean. Orbit vibes ✨',
    likesCount: 5,
    likedBy: ['usr_abdullah', 'usr_elena'],
    savedBy: [],
    comments: [
      {
        id: 'comm_2',
        userId: 'usr_elena',
        text: 'Incredible lighting!',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
  },
  {
    id: 'post_elena',
    userId: 'usr_elena',
    mediaUrl: SAMPLE_ASSETS.neonArchitecture,
    caption: 'Urban cybernetics. Tokyo night architecture study.',
    likesCount: 28,
    likedBy: ['usr_abdullah', 'usr_marcus'],
    savedBy: ['usr_abdullah'],
    comments: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Initial Seed Stories
const INITIAL_STORIES: Story[] = [
  {
    id: 'story_abdullah',
    userId: 'usr_abdullah',
    mediaUrl: SAMPLE_ASSETS.zhamCard,
    caption: 'ZHAM Collections preview 2026',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5h ago
    expiresAt: new Date(Date.now() + 3600000 * 19).toISOString(),
    likesCount: 1,
    likedBy: ['usr_shahid'],
  },
  {
    id: 'story_shahid',
    userId: 'usr_shahid',
    mediaUrl: SAMPLE_ASSETS.sunsetPost,
    caption: 'Calm seaside evening 🌅',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 21).toISOString(),
    likesCount: 2,
    likedBy: ['usr_abdullah'],
  },
  {
    id: 'story_elena',
    userId: 'usr_elena',
    mediaUrl: SAMPLE_ASSETS.orbitConcept,
    caption: 'Orbit interface exploration',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 23).toISOString(),
    likesCount: 4,
    likedBy: ['usr_marcus'],
  },
];

// Initial Follow Requests
// As seen in video 00:07: "Shahid Iqbal requested to follow you 5h"
const INITIAL_FOLLOW_REQUESTS: FollowRequest[] = [
  {
    id: 'freq_1',
    fromUserId: 'usr_shahid',
    toUserId: 'usr_abdullah',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    toUserId: 'usr_abdullah',
    fromUserId: 'usr_shahid',
    type: 'follow_request',
    text: 'requested to follow you',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'notif_2',
    toUserId: 'usr_abdullah',
    fromUserId: 'usr_shahid',
    type: 'post_like',
    text: 'liked your post: "zham collections"',
    read: false,
    relatedPostId: 'post_zham',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'notif_3',
    toUserId: 'usr_abdullah',
    fromUserId: 'usr_shahid',
    type: 'story_like',
    text: 'liked your story',
    read: true,
    relatedStoryId: 'story_abdullah',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

// Initial Highlights for Abdullah
const INITIAL_HIGHLIGHTS: StoryHighlight[] = [
  {
    id: 'hl_1',
    userId: 'usr_abdullah',
    title: 'Stories',
    coverUrl: SAMPLE_ASSETS.zhamCard,
    storiesCount: 3,
  },
  {
    id: 'hl_2',
    userId: 'usr_abdullah',
    title: 'Zham',
    coverUrl: SAMPLE_ASSETS.zhamPostImage,
    storiesCount: 5,
  },
];

const STORAGE_KEY = 'orbit_app_store_v2';

interface OrbitStoreData {
  users: User[];
  posts: Post[];
  stories: Story[];
  followRequests: FollowRequest[];
  notifications: NotificationItem[];
  conversations: ChatConversation[];
  messages: ChatMessage[];
  highlights: StoryHighlight[];
  currentUserId: string | null;
}

class OrbitStore {
  private data: OrbitStoreData;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.data = this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.data = this.loadFromStorage();
          this.notify();
        }
      });
    }
  }

  private loadFromStorage(): OrbitStoreData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.users)) {
          // Remove seed dummy accounts (usr_shahid, usr_elena, usr_marcus)
          // so ONLY REAL user IDs created in Orbit are present!
          const DUMMY_SEED_IDS = new Set(['usr_shahid', 'usr_elena', 'usr_marcus']);
          parsed.users = parsed.users.filter((u: User) => {
            if (u.id === parsed.currentUserId) return true;
            return !DUMMY_SEED_IDS.has(u.id);
          });

          // Ensure all posts have visibility, viewsCount, and viewedBy initialized
          if (Array.isArray(parsed.posts)) {
            parsed.posts.forEach((p: Post) => {
              if (!p.visibility) p.visibility = 'everyone';
              if (p.allowComments === undefined) p.allowComments = true;
              if (!p.viewedBy) p.viewedBy = [];
              if (typeof p.viewsCount !== 'number') p.viewsCount = p.viewedBy.length;
            });
          }

          return parsed;
        }
      }
    } catch {
      // ignore
    }

    // Clean initial state: no dummy data
    return {
      users: [],
      posts: [],
      stories: [],
      followRequests: [],
      notifications: [],
      conversations: [],
      messages: [],
      highlights: [],
      currentUserId: null,
    };
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Storage quota or error:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public hasAccount(): boolean {
    return Boolean(this.data.currentUserId);
  }

  public resetToCleanState() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = {
      users: [],
      posts: [],
      stories: [],
      followRequests: [],
      notifications: [],
      conversations: [],
      messages: [],
      highlights: [],
      currentUserId: null,
    };
    this.saveToStorage();
  }

  // --- Current User Management ---
  public getCurrentUser(): User | null {
    if (!this.data.currentUserId) return null;
    const user = this.data.users.find((u) => u.id === this.data.currentUserId);
    return user || (this.data.users.length > 0 ? this.data.users[0] : null);
  }

  public setCurrentUser(userId: string) {
    if (this.data.users.some((u) => u.id === userId)) {
      this.data.currentUserId = userId;
      this.saveToStorage();
    }
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByUsername(username: string): User | undefined {
    return this.data.users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
  }

  // --- Unique Username Validation during Signup (Small letters only) ---
  public validateUsername(
    username: string,
    excludeUserId?: string
  ): { valid: boolean; error: string | null } {
    const clean = username.trim().toLowerCase();
    if (!clean) {
      return { valid: false, error: 'Username is required' };
    }
    if (clean.length < 3) {
      return { valid: false, error: 'Username must be at least 3 characters' };
    }
    if (clean.length > 25) {
      return { valid: false, error: 'Username cannot exceed 25 characters' };
    }
    // All letters must be lowercase, numbers, dots, underscores
    const validRegex = /^[a-z0-9_.]+$/;
    if (!validRegex.test(clean)) {
      return {
        valid: false,
        error: 'Only small lowercase letters (a-z), numbers, dots, and underscores allowed',
      };
    }
    const taken = this.data.users.some(
      (u) =>
        u.id !== excludeUserId &&
        u.username.toLowerCase() === clean
    );
    if (taken) {
      return { valid: false, error: 'Username already taken by another user' };
    }
    return { valid: true, error: null };
  }

  public createUser(params: {
    username: string;
    displayName: string;
    dob?: string;
    password?: string;
    avatar?: string;
    bio?: string;
  }): { success: boolean; user?: User; error?: string } {
    const cleanUsername = params.username.trim().toLowerCase();
    const validation = this.validateUsername(cleanUsername);
    if (!validation.valid) {
      return { success: false, error: validation.error || 'Invalid username' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      username: cleanUsername,
      displayName: params.displayName.trim() || cleanUsername,
      dob: params.dob,
      password: params.password || 'orbit123',
      postVisibility: 'everyone',
      allowComments: true,
      avatar:
        params.avatar?.trim() ||
        `https://api.dicebear.com/7.x/shapes/svg?seed=${cleanUsername}`,
      bio: params.bio?.trim() || '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      likesReceived: 0,
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.data.currentUserId = newUser.id;
    this.saveToStorage();
    return { success: true, user: newUser };
  }

  public updateUserProfile(
    userId: string,
    updates: Partial<Pick<User, 'displayName' | 'username' | 'bio' | 'avatar' | 'dob' | 'password' | 'postVisibility' | 'allowComments'>>
  ): { success: boolean; error?: string } {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };

    if (updates.username && updates.username.toLowerCase() !== user.username.toLowerCase()) {
      const clean = updates.username.trim().toLowerCase();
      const check = this.validateUsername(clean, userId);
      if (!check.valid) return { success: false, error: check.error! };
      user.username = clean;
    }
    if (updates.displayName !== undefined) user.displayName = updates.displayName.trim();
    if (updates.bio !== undefined) user.bio = updates.bio;
    if (updates.avatar !== undefined) user.avatar = updates.avatar;
    if (updates.dob !== undefined) user.dob = updates.dob;
    if (updates.password !== undefined) user.password = updates.password;
    if (updates.postVisibility !== undefined) user.postVisibility = updates.postVisibility;
    if (updates.allowComments !== undefined) user.allowComments = updates.allowComments;

    this.saveToStorage();
    return { success: true };
  }

  // --- Change Password Feature ---
  public changePassword(
    userId: string,
    currentPass: string,
    newPass: string
  ): { success: boolean; error?: string } {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };

    if (user.password && user.password !== currentPass.trim()) {
      return { success: false, error: 'Current password does not match' };
    }

    if (!newPass || newPass.trim().length < 4) {
      return { success: false, error: 'New password must be at least 4 characters' };
    }

    user.password = newPass.trim();
    this.saveToStorage();
    return { success: true };
  }

  // --- Robust Search for IDs, Usernames, and Names ---
  public searchUsers(query: string, excludeUserId?: string): User[] {
    const raw = query.toLowerCase().trim();
    if (!raw) {
      return this.data.users.filter((u) => !excludeUserId || u.id !== excludeUserId);
    }
    const clean = raw.replace(/^@/, '');
    const noSpaces = clean.replace(/\s+/g, '');

    return this.data.users.filter((u) => {
      if (excludeUserId && u.id === excludeUserId) return false;
      const uId = u.id.toLowerCase();
      const uName = u.username.toLowerCase();
      const dName = u.displayName.toLowerCase();
      const uBio = (u.bio || '').toLowerCase();

      return (
        uName.includes(clean) ||
        uName.includes(noSpaces) ||
        dName.includes(clean) ||
        uId.includes(clean) ||
        uId.replace(/^(usr_)/, '').includes(clean) ||
        uBio.includes(clean)
      );
    });
  }

  // --- Permanent Account Deletion with Password Verification ---
  public deleteAccount(userId: string, passwordConfirm: string): { success: boolean; error?: string } {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };

    // Verify password if user set one
    if (user.password && user.password !== passwordConfirm.trim()) {
      return { success: false, error: 'Incorrect password! Account deletion aborted.' };
    }

    // Delete user's posts
    this.data.posts = this.data.posts.filter((p) => p.userId !== userId);
    // Delete user's stories
    this.data.stories = this.data.stories.filter((s) => s.userId !== userId);
    // Delete follow requests
    this.data.followRequests = this.data.followRequests.filter(
      (r) => r.fromUserId !== userId && r.toUserId !== userId
    );
    // Delete notifications
    this.data.notifications = this.data.notifications.filter(
      (n) => n.toUserId !== userId && n.fromUserId !== userId
    );
    // Delete messages and convs
    this.data.conversations = this.data.conversations.filter(
      (c) => !c.participantIds.includes(userId)
    );
    this.data.messages = this.data.messages.filter(
      (m) => m.senderId !== userId && m.receiverId !== userId
    );
    // Remove user
    this.data.users = this.data.users.filter((u) => u.id !== userId);

    if (this.data.currentUserId === userId) {
      this.data.currentUserId = this.data.users.length > 0 ? this.data.users[0].id : null;
    }

    this.saveToStorage();
    return { success: true };
  }

  // --- Followers & Following Lists ---
  public getFollowers(userId: string): User[] {
    const followerIds = this.data.followRequests
      .filter((r) => r.toUserId === userId && r.status === 'following')
      .map((r) => r.fromUserId);
    return this.data.users.filter((u) => followerIds.includes(u.id));
  }

  public getFollowing(userId: string): User[] {
    const followingIds = this.data.followRequests
      .filter((r) => r.fromUserId === userId && r.status === 'following')
      .map((r) => r.toUserId);
    return this.data.users.filter((u) => followingIds.includes(u.id));
  }

  // --- Follow Requests & Privacy Restrictions ---
  public getFollowStatus(fromUserId: string, toUserId: string): FollowStatus {
    if (fromUserId === toUserId) return 'none';
    const req = this.data.followRequests.find(
      (r) => r.fromUserId === fromUserId && r.toUserId === toUserId
    );
    return req ? req.status : 'none';
  }

  // Checks if currentUser is allowed to message targetUserId
  // Rule: "Users CANNOT send messages (text, voice, or video) to someone unless the other person accepts their follow request first."
  public canSendMessage(
    senderId: string,
    recipientId: string
  ): {
    allowed: boolean;
    reason?: string;
    status: FollowStatus;
  } {
    if (senderId === recipientId) return { allowed: true, status: 'following' };

    // Has sender requested to follow recipient AND recipient accepted?
    const senderToRecipient = this.getFollowStatus(senderId, recipientId);
    if (senderToRecipient === 'following') {
      return { allowed: true, status: 'following' };
    }

    if (senderToRecipient === 'pending') {
      return {
        allowed: false,
        reason: 'Your follow request is pending approval. You can message once accepted.',
        status: 'pending',
      };
    }

    return {
      allowed: false,
      reason: 'Privacy Protected: You must send a follow request and have it accepted before messaging.',
      status: 'none',
    };
  }

  public sendFollowRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) return;
    const existing = this.data.followRequests.find(
      (r) => r.fromUserId === fromUserId && r.toUserId === toUserId
    );
    if (existing) {
      if (existing.status === 'rejected' || existing.status === 'none') {
        existing.status = 'pending';
        existing.createdAt = new Date().toISOString();
      }
    } else {
      const newReq: FollowRequest = {
        id: `freq_${Date.now()}`,
        fromUserId,
        toUserId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      this.data.followRequests.push(newReq);
    }

    // Add notification to toUserId
    const sender = this.getUserById(fromUserId);
    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      toUserId,
      fromUserId,
      type: 'follow_request',
      text: 'requested to follow you',
      read: false,
      createdAt: new Date().toISOString(),
    });

    this.saveToStorage();
  }

  public acceptFollowRequest(fromUserId: string, toUserId: string) {
    const req = this.data.followRequests.find(
      (r) => r.fromUserId === fromUserId && r.toUserId === toUserId
    );
    if (req) {
      req.status = 'following';
    } else {
      this.data.followRequests.push({
        id: `freq_${Date.now()}`,
        fromUserId,
        toUserId,
        status: 'following',
        createdAt: new Date().toISOString(),
      });
    }

    // Increment followers count of recipient (toUserId)
    const recipient = this.getUserById(toUserId);
    if (recipient) recipient.followersCount += 1;

    // Increment following count of sender (fromUserId)
    const sender = this.getUserById(fromUserId);
    if (sender) sender.followingCount += 1;

    // Notify sender that request was accepted
    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      toUserId: fromUserId,
      fromUserId: toUserId,
      type: 'follow_accept',
      text: 'accepted your follow request! You can now send messages.',
      read: false,
      createdAt: new Date().toISOString(),
    });

    this.saveToStorage();
  }

  public rejectFollowRequest(fromUserId: string, toUserId: string) {
    const req = this.data.followRequests.find(
      (r) => r.fromUserId === fromUserId && r.toUserId === toUserId
    );
    if (req) {
      req.status = 'rejected';
    }
    // Dismiss corresponding notification
    this.data.notifications = this.data.notifications.filter(
      (n) =>
        !(
          n.toUserId === toUserId &&
          n.fromUserId === fromUserId &&
          n.type === 'follow_request'
        )
    );
    this.saveToStorage();
  }

  public unfollowUser(fromUserId: string, toUserId: string) {
    const req = this.data.followRequests.find(
      (r) => r.fromUserId === fromUserId && r.toUserId === toUserId
    );
    if (req) {
      const wasFollowing = req.status === 'following';
      req.status = 'none';
      if (wasFollowing) {
        const recipient = this.getUserById(toUserId);
        if (recipient && recipient.followersCount > 0) recipient.followersCount -= 1;
        const sender = this.getUserById(fromUserId);
        if (sender && sender.followingCount > 0) sender.followingCount -= 1;
      }
    }
    this.saveToStorage();
  }

  // --- Notifications ---
  public getNotificationsForUser(userId: string): NotificationItem[] {
    return this.data.notifications.filter((n) => n.toUserId === userId);
  }

  public markNotificationAsRead(notifId: string) {
    const notif = this.data.notifications.find((n) => n.id === notifId);
    if (notif) {
      notif.read = true;
      this.saveToStorage();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    this.data.notifications.forEach((n) => {
      if (n.toUserId === userId) n.read = true;
    });
    this.saveToStorage();
  }

  // --- Posts & Feed ---
  public getPosts(): Post[] {
    return [...this.data.posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getPostsByUser(userId: string): Post[] {
    return this.getPosts().filter((p) => p.userId === userId);
  }

  public getSavedPostsByUser(userId: string): Post[] {
    return this.getPosts().filter((p) => p.savedBy.includes(userId));
  }

  public createPost(params: {
    userId: string;
    mediaUrl: string;
    caption: string;
    visibility?: 'everyone' | 'friends';
    allowComments?: boolean;
  }): Post {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: params.userId,
      mediaUrl: params.mediaUrl,
      caption: params.caption,
      visibility: params.visibility || 'everyone',
      allowComments: params.allowComments !== false,
      likesCount: 0,
      likedBy: [],
      savedBy: [],
      comments: [],
      viewsCount: 0,
      viewedBy: [],
      createdAt: new Date().toISOString(),
    };

    this.data.posts.unshift(newPost);
    const user = this.getUserById(params.userId);
    if (user) {
      user.postsCount += 1;
    }
    this.saveToStorage();
    return newPost;
  }

  // Like a post once (idempotent: 1 user = 1 like maximum).
  // Perfect for double-tap / double-click so tapping repeatedly does not add multiple likes!
  public likePostOnce(postId: string, userId: string): boolean {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post) return false;

    if (!post.likedBy.includes(userId)) {
      post.likedBy.push(userId);
      post.likesCount += 1;

      // Add notification to post author
      if (post.userId !== userId) {
        this.data.notifications.unshift({
          id: `notif_${Date.now()}`,
          toUserId: post.userId,
          fromUserId: userId,
          type: 'post_like',
          text: `liked your post: "${post.caption.substring(0, 24)}"`,
          read: false,
          relatedPostId: post.id,
          createdAt: new Date().toISOString(),
        });
        const author = this.getUserById(post.userId);
        if (author) author.likesReceived += 1;
      }
      this.saveToStorage();
      return true;
    }
    return false; // already liked, so count does not duplicate!
  }

  // Record a unique view on a post (1 user = 1 view maximum).
  public recordPostView(postId: string, userId: string): boolean {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post) return false;

    if (!post.viewedBy) {
      post.viewedBy = [];
    }
    if (typeof post.viewsCount !== 'number') {
      post.viewsCount = post.viewedBy.length;
    }

    if (!post.viewedBy.includes(userId)) {
      post.viewedBy.push(userId);
      post.viewsCount += 1;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public toggleLikePost(postId: string, userId: string): boolean {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post) return false;

    const hasLiked = post.likedBy.includes(userId);
    if (hasLiked) {
      post.likedBy = post.likedBy.filter((id) => id !== userId);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      post.likedBy.push(userId);
      post.likesCount += 1;

      // Add notification to post author
      if (post.userId !== userId) {
        this.data.notifications.unshift({
          id: `notif_${Date.now()}`,
          toUserId: post.userId,
          fromUserId: userId,
          type: 'post_like',
          text: `liked your post: "${post.caption.substring(0, 24)}"`,
          read: false,
          relatedPostId: post.id,
          createdAt: new Date().toISOString(),
        });
        const author = this.getUserById(post.userId);
        if (author) author.likesReceived += 1;
      }
    }

    this.saveToStorage();
    return !hasLiked;
  }

  public toggleSavePost(postId: string, userId: string): boolean {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post) return false;

    const isSaved = post.savedBy.includes(userId);
    if (isSaved) {
      post.savedBy = post.savedBy.filter((id) => id !== userId);
    } else {
      post.savedBy.push(userId);
    }

    this.saveToStorage();
    return !isSaved;
  }

  public addComment(postId: string, userId: string, text: string) {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post || !text.trim()) return null;

    const newComment = {
      id: `comm_${Date.now()}`,
      userId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    post.comments.push(newComment);

    if (post.userId !== userId) {
      this.data.notifications.unshift({
        id: `notif_${Date.now()}`,
        toUserId: post.userId,
        fromUserId: userId,
        type: 'post_comment',
        text: `commented: "${text.trim().substring(0, 30)}"`,
        read: false,
        relatedPostId: post.id,
        createdAt: new Date().toISOString(),
      });
    }

    this.saveToStorage();
    return newComment;
  }

  public updatePostCaption(postId: string, userId: string, newCaption: string): boolean {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post || post.userId !== userId) return false;
    post.caption = newCaption.trim();
    this.saveToStorage();
    return true;
  }

  public deletePost(postId: string, userId: string): boolean {
    const postIndex = this.data.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return false;
    const post = this.data.posts[postIndex];
    if (post.userId !== userId) return false;

    this.data.posts.splice(postIndex, 1);
    const user = this.getUserById(userId);
    if (user && user.postsCount > 0) {
      user.postsCount -= 1;
    }
    this.saveToStorage();
    return true;
  }

  public togglePostCommentsAllowed(postId: string, userId: string): boolean {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post || post.userId !== userId) return false;
    post.allowComments = post.allowComments === false ? true : false;
    this.saveToStorage();
    return Boolean(post.allowComments);
  }

  public sharePostToStory(postId: string, userId: string): Story | null {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post) return null;
    const author = this.getUserById(post.userId);

    return this.createStory({
      userId,
      mediaUrl: post.mediaUrl,
      caption: `Shared post by @${author?.username || 'user'}: "${post.caption.substring(0, 40)}"`,
    });
  }

  // --- Stories ---
  public getStories(): Story[] {
    const now = new Date().getTime();
    // Active stories not expired
    return this.data.stories.filter(
      (s) => new Date(s.expiresAt).getTime() > now
    );
  }

  // Story sirf friend ki show ho (users you follow) + your own story
  public getStoriesForFriends(currentUserId: string): Story[] {
    const now = new Date().getTime();
    const active = this.data.stories.filter(
      (s) => new Date(s.expiresAt).getTime() > now
    );

    // Friend user IDs: users that currentUserId is following, plus currentUserId
    const followingIds = this.getFollowing(currentUserId).map((u) => u.id);
    const allowedUserIds = new Set([...followingIds, currentUserId]);

    return active.filter((s) => allowedUserIds.has(s.userId));
  }

  public getStoriesByUser(userId: string): Story[] {
    return this.getStories().filter((s) => s.userId === userId);
  }

  public createStory(params: {
    userId: string;
    mediaUrl: string;
    mediaType?: 'image' | 'video';
    caption?: string;
  }): Story {
    const isVideo =
      params.mediaType === 'video' ||
      params.mediaUrl.startsWith('data:video') ||
      Boolean(params.mediaUrl.match(/\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i));

    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: params.userId,
      mediaUrl: params.mediaUrl,
      mediaType: isVideo ? 'video' : 'image',
      caption: params.caption,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours
      likesCount: 0,
      likedBy: [],
    };

    this.data.stories.unshift(newStory);
    this.saveToStorage();
    return newStory;
  }

  public toggleLikeStory(storyId: string, userId: string): boolean {
    const story = this.data.stories.find((s) => s.id === storyId);
    if (!story) return false;

    const hasLiked = story.likedBy.includes(userId);
    if (hasLiked) {
      story.likedBy = story.likedBy.filter((id) => id !== userId);
      story.likesCount = Math.max(0, story.likesCount - 1);
    } else {
      story.likedBy.push(userId);
      story.likesCount += 1;

      if (story.userId !== userId) {
        this.data.notifications.unshift({
          id: `notif_${Date.now()}`,
          toUserId: story.userId,
          fromUserId: userId,
          type: 'story_like',
          text: 'liked your story',
          read: false,
          relatedStoryId: story.id,
          createdAt: new Date().toISOString(),
        });
      }
    }

    this.saveToStorage();
    return !hasLiked;
  }

  // --- Chat & Messaging with Strict Privacy Enforcement ---
  public getConversations(userId: string): ChatConversation[] {
    return this.data.conversations
      .filter((c) => c.participantIds.includes(userId))
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }

  public getOrCreateConversation(
    user1Id: string,
    user2Id: string
  ): ChatConversation {
    let conv = this.data.conversations.find(
      (c) =>
        c.participantIds.includes(user1Id) && c.participantIds.includes(user2Id)
    );

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        participantIds: [user1Id, user2Id],
        updatedAt: new Date().toISOString(),
      };
      this.data.conversations.unshift(conv);
      this.saveToStorage();
    }

    return conv;
  }

  public getMessagesForConversation(convId: string): ChatMessage[] {
    return this.data.messages
      .filter((m) => m.chatId === convId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }

  public sendMessage(params: {
    senderId: string;
    receiverId: string;
    type: 'text' | 'voice' | 'image' | 'video_call';
    content: string;
    audioDuration?: number;
  }): { success: boolean; message?: ChatMessage; error?: string } {
    // ENFORCE STRICT CHAT PRIVACY RULE:
    // "Users CANNOT send messages (text, voice, or video) to someone unless the other person accepts their follow request first."
    const check = this.canSendMessage(params.senderId, params.receiverId);
    if (!check.allowed) {
      return {
        success: false,
        error:
          check.reason ||
          'Message blocked: The recipient must accept your follow request before you can chat.',
      };
    }

    const conv = this.getOrCreateConversation(params.senderId, params.receiverId);

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      chatId: conv.id,
      senderId: params.senderId,
      receiverId: params.receiverId,
      type: params.type,
      content: params.content,
      audioDuration: params.audioDuration,
      createdAt: new Date().toISOString(),
      read: false,
    };

    this.data.messages.push(newMessage);
    conv.lastMessage = newMessage;
    conv.updatedAt = newMessage.createdAt;

    this.saveToStorage();
    return { success: true, message: newMessage };
  }

  public markMessagesAsRead(convId: string, currentUserId: string) {
    let changed = false;
    this.data.messages.forEach((m) => {
      if (m.chatId === convId && m.receiverId === currentUserId && !m.read) {
        m.read = true;
        changed = true;
      }
    });
    if (changed) this.saveToStorage();
  }

  // Highlights
  public getHighlightsByUser(userId: string): StoryHighlight[] {
    return this.data.highlights.filter((h) => h.userId === userId);
  }

  public addHighlight(userId: string, title: string, coverUrl: string) {
    const hl: StoryHighlight = {
      id: `hl_${Date.now()}`,
      userId,
      title,
      coverUrl,
      storiesCount: 1,
    };
    this.data.highlights.push(hl);
    this.saveToStorage();
    return hl;
  }
}

export const store = new OrbitStore();
