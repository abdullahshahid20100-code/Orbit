import React from 'react';
import { Plus } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesTrayProps {
  currentUser: User;
  users: User[];
  stories: Story[];
  onOpenStory: (storyId: string) => void;
  onAddStory: () => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  currentUser,
  users,
  stories,
  onOpenStory,
  onAddStory,
}) => {
  // Group active stories by userId
  const storiesByUser = React.useMemo(() => {
    const map = new Map<string, Story[]>();
    stories.forEach((story) => {
      const list = map.get(story.userId) || [];
      list.push(story);
      map.set(story.userId, list);
    });
    return map;
  }, [stories]);

  const currentUserStories = storiesByUser.get(currentUser.id) || [];
  const hasUserStory = currentUserStories.length > 0;

  // Other users with stories
  const otherUsersWithStories = users.filter(
    (u) => u.id !== currentUser.id && (storiesByUser.get(u.id) || []).length > 0
  );

  return (
    <div className="w-full bg-[#11141e] border-b border-slate-800/60 py-3.5 px-4 mb-3 rounded-2xl">
      <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Current User Story Item */}
        <div className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer group">
          <div className="relative">
            <button
              onClick={() => {
                if (hasUserStory) {
                  onOpenStory(currentUserStories[0].id);
                } else {
                  onAddStory();
                }
              }}
              className={`w-16 h-16 rounded-full p-[2px] transition-transform active:scale-95 ${
                hasUserStory
                  ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-slate-800'
              }`}
            >
              <div className="w-full h-full rounded-full bg-[#0c0f17] p-0.5 overflow-hidden">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </button>

            {/* Plus badge on current user avatar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddStory();
              }}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-600 border-2 border-[#0c0f17] text-white flex items-center justify-center shadow-md hover:bg-indigo-500 transition-colors"
              title="Add to your story"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
          <span className="text-[11px] font-medium text-slate-300 truncate max-w-[68px]">
            Your story
          </span>
        </div>

        {/* Other Users Stories */}
        {otherUsersWithStories.map((user) => {
          const userStories = storiesByUser.get(user.id) || [];
          if (userStories.length === 0) return null;
          const firstStory = userStories[0];

          return (
            <div
              key={user.id}
              onClick={() => onOpenStory(firstStory.id)}
              className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_14px_rgba(168,85,247,0.35)] transition-transform group-hover:scale-105 group-active:scale-95">
                <div className="w-full h-full rounded-full bg-[#0c0f17] p-0.5 overflow-hidden">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-300 truncate max-w-[68px]">
                {user.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
