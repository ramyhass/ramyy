import React from 'react';
import { 
  Play, 
  List, 
  Calendar, 
  Settings, 
  Heart, 
  Download,
  Monitor,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const menuItems = [
    { id: 'player', label: 'Player', icon: Play },
    { id: 'channels', label: 'Channels', icon: List },
    { id: 'playlists', label: 'Playlists', icon: Download },
    { id: 'epg', label: 'TV Guide', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Monitor className="text-blue-500" size={24} />
              <h1 className="text-xl font-bold text-white">IPTV Pro</h1>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="text-gray-400" size={20} />
            ) : (
              <ChevronLeft className="text-gray-400" size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};