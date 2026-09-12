export interface User {
  id: string;
  username: string; // all lowercase letters
  displayName: string;
  avatar: string;
  bio: string;
  dob?: string;
  password?: string;
  postVisibility?: 'everyone' | 'friends';
  allowComments?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  likesReceived: number;
  isVerified?: boolean;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  caption?: string;
  createdAt: string;
  expiresAt: string;
  likesCount: number;
  likedBy: string[]; // user IDs
}

export interface PostComment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  likesCount: number;
  likedBy: string[]; // user IDs
  comments: PostComment[];
  savedBy: string[]; // user IDs
  visibility?: 'everyone' | 'friends';
  allowComments?: boolean;
  createdAt: string;
}

export type FollowStatus = 'none' | 'pending' | 'following' | 'rejected';

export interface FollowRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: FollowStatus;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  toUserId: string;
  fromUserId: string;
  type: 'follow_request' | 'follow_accept' | 'post_like' | 'post_comment' | 'story_like' | 'story_reply';
  text: string;
  read: boolean;
  relatedPostId?: string;
  relatedStoryId?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  type: 'text' | 'voice' | 'image' | 'video_call';
  content: string; // text message or media URL or audio duration
  audioDuration?: number;
  createdAt: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  participantIds: string[]; // [user1Id, user2Id]
  lastMessage?: ChatMessage;
  updatedAt: string;
}

export interface StoryHighlight {
  id: string;
  userId: string;
  title: string;
  coverUrl: string;
  storiesCount: number;
}
