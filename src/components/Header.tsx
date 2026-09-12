import React from 'react';
import { OrbitLogo } from './OrbitLogo';
import { NotificationItem } from '../types';
import { Bell, Settings } from 'lucide-react';

interface HeaderProps {
  onSelectTab: (tab: 'home' | 'explore' | 'notifications' | 'chats' | 'profile') => void;
  onOpenSettings: () => void;
  unreadNotifications: NotificationItem[];
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTab,
  onOpenSettings,
  unreadNotifications,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-800/70 px-4 py-2.5 max-w-lg mx-auto w-full flex items-center justify-between">
      {/* Brand & Logo */}
      <div
        onClick={() => onSelectTab('home')}
        className="flex items-center space-x-2.5 cursor-pointer group select-none"
      >
        <OrbitLogo size="sm" showBackground={true} />
        <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
          Orbit
        </span>
      </div>

      {/* Right Controls: Notification Bell + Settings Gear */}
      <div className="flex items-center space-x-1.5">
        {/* Notifications Icon with Badge */}
        <button
          onClick={() => onSelectTab('notifications')}
          className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0c0f17] animate-pulse" />
          )}
        </button>

        {/* Settings Icon (Next to Notification bell as requested: "noticocation ka Sath settings ka option ho") */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>
    </header>
  );
};
