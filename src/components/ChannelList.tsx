import React, { useState } from 'react';
import { Grid, List, Search, Heart, Play, Settings as SettingsIcon } from 'lucide-react';
import { Channel, ViewMode } from '../types';

interface ChannelListProps {
  channels: Channel[];
  favorites: string[];
  currentChannel: Channel | null;
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  viewMode: ViewMode;
  onChannelSelect: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  favorites,
  currentChannel,
  searchQuery,
  selectedCategory,
  categories,
  viewMode,
  onChannelSelect,
  onToggleFavorite,
  onSearchChange,
  onCategoryChange,
  onViewModeChange
}) => {
  const [showSearch, setShowSearch] = useState(false);

  const ChannelCard = ({ channel }: { channel: Channel }) => (
    <div 
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
        currentChannel?.id === channel.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onChannelSelect(channel)}
    >
      <div className="aspect-video bg-gray-800 flex items-center justify-center relative group">
        {channel.logo ? (
          <img 
            src={channel.logo} 
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">
              {channel.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(channel.id);
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <Heart 
            size={16} 
            className={favorites.includes(channel.id) ? 'fill-red-500 text-red-500' : 'text-white'} 
          />
        </button>
      </div>
      
      <div className="p-3 bg-gray-900">
        <h3 className="font-semibold text-white truncate">{channel.name}</h3>
        <p className="text-sm text-gray-400 truncate">{channel.category}</p>
      </div>
    </div>
  );

  const ChannelListItem = ({ channel }: { channel: Channel }) => (
    <div 
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800 ${
        currentChannel?.id === channel.id ? 'bg-blue-900/50 border-l-4 border-blue-500' : ''
      }`}
      onClick={() => onChannelSelect(channel)}
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
        {channel.logo ? (
          <img 
            src={channel.logo} 
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-400">
              {channel.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <h3 className="font-medium text-white truncate">{channel.name}</h3>
        <p className="text-sm text-gray-400 truncate">{channel.category}</p>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(channel.id);
        }}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
      >
        <Heart 
          size={16} 
          className={favorites.includes(channel.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
        />
      </button>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Channels</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Search className="text-gray-400" size={20} />
            </button>
            <button
              onClick={() => onViewModeChange({ 
                ...viewMode, 
                type: viewMode.type === 'grid' ? 'list' : 'grid' 
              })}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {viewMode.type === 'grid' ? 
                <List className="text-gray-400" size={20} /> : 
                <Grid className="text-gray-400" size={20} />
              }
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto p-4">
        {channels.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No channels found</p>
          </div>
        ) : (
          <div className={
            viewMode.type === 'grid' 
              ? `grid gap-4 ${
                  viewMode.size === 'small' ? 'grid-cols-3' :
                  viewMode.size === 'medium' ? 'grid-cols-2' :
                  'grid-cols-1'
                }`
              : 'space-y-2'
          }>
            {channels.map(channel => (
              viewMode.type === 'grid' ? (
                <ChannelCard key={channel.id} channel={channel} />
              ) : (
                <ChannelListItem key={channel.id} channel={channel} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};