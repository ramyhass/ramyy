import React, { useState } from 'react';
import { ArrowLeft, Heart, Play, Grid, List } from 'lucide-react';
import { Channel } from '../types';
import { useIPTVPlayer } from '../hooks/useIPTVPlayer';

interface LiveTVProps {
  channels: Channel[];
  favorites: string[];
  currentChannel: Channel | null;
  isParentalUnlocked: boolean;
  onVerifyPin: (pin: string) => boolean;
  onChannelSelect: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  onBack: () => void;
}

export const LiveTV: React.FC<LiveTVProps> = ({
  channels,
  favorites,
  currentChannel,
  isParentalUnlocked,
  onVerifyPin,
  onChannelSelect,
  onToggleFavorite,
  onBack
}) => {
  const { settings } = useIPTVPlayer();
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pendingChannel, setPendingChannel] = useState<Channel | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(settings.layoutMode || 'grid');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(channels.map(ch => ch.category)))];
  
  // Filter out hidden categories
  const visibleCategories = categories.filter(cat => {
    if (cat === 'All' || cat === 'Favorites') return true;
    return !settings.hiddenCategories?.live?.includes(cat);
  });
  
  const filteredChannels = selectedCategory === 'All' 
    ? channels 
    : channels.filter(ch => ch.category === selectedCategory);

  const handleChannelSelect = (channel: Channel) => {
    // Check if channel category is locked
    // This would need to be passed from parent component with settings
    onChannelSelect(channel);
  };

  const handlePinSubmit = () => {
    if (onVerifyPin(pinInput)) {
      setShowPinDialog(false);
      setPinInput('');
      setPinError('');
      if (pendingChannel) {
        onChannelSelect(pendingChannel);
        setPendingChannel(null);
      }
    } else {
      setPinError('Incorrect PIN');
      setPinInput('');
    }
  };
  const ChannelCard = ({ channel }: { channel: Channel }) => (
    <div 
      className={`border-2 border-yellow-500 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-yellow-500 hover:text-black group ${
        currentChannel?.id === channel.id ? 'bg-yellow-500 text-black' : ''
      }`}
      onClick={() => handleChannelSelect(channel)}
    >
      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-3 relative">
        {channel.logo ? (
          <img 
            src={channel.logo} 
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400 group-hover:text-black">
              {channel.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
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
      
      <h3 className="font-semibold text-yellow-500 group-hover:text-black truncate">{channel.name}</h3>
      <p className="text-sm text-gray-400 group-hover:text-black/70 truncate">{channel.category}</p>
    </div>
  );

  const ChannelListItem = ({ channel }: { channel: Channel }) => (
    <div 
      className={`flex items-center p-4 border border-yellow-500 rounded-lg cursor-pointer transition-all duration-300 hover:bg-yellow-500 hover:text-black group ${
        currentChannel?.id === channel.id ? 'bg-yellow-500 text-black' : ''
      }`}
      onClick={() => handleChannelSelect(channel)}
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
        {channel.logo ? (
          <img 
            src={channel.logo} 
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-400 group-hover:text-black">
              {channel.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <h3 className="font-medium text-yellow-500 group-hover:text-black truncate">{channel.name}</h3>
        <p className="text-sm text-gray-400 group-hover:text-black/70 truncate">{channel.category}</p>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(channel.id);
        }}
        className="p-2 rounded-full hover:bg-black/20 transition-colors"
      >
        <Heart 
          size={16} 
          className={favorites.includes(channel.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-black'} 
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-yellow-500">Live TV Channels</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300"
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {visibleCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-yellow-500 text-black border-yellow-500'
                : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Channels */}
      <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
        {filteredChannels.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No channels found</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'space-y-3'
          }>
            {filteredChannels.map(channel => (
              viewMode === 'grid' ? (
                <ChannelCard key={channel.id} channel={channel} />
              ) : (
                <ChannelListItem key={channel.id} channel={channel} />
              )
            ))}
          </div>
        )}
      </div>

      {/* PIN Verification Dialog */}
      {showPinDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-yellow-500">
            <h3 className="text-lg font-semibold text-yellow-500 mb-4">Parental Control</h3>
            <p className="text-gray-300 mb-4">This content is restricted. Enter PIN to continue.</p>
            
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.slice(0, 4))}
              placeholder="Enter 4-digit PIN"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none text-center text-2xl tracking-widest mb-4"
              maxLength={4}
            />
            
            {pinError && (
              <p className="text-red-500 text-sm mb-4">{pinError}</p>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPinDialog(false);
                  setPinInput('');
                  setPinError('');
                  setPendingChannel(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                disabled={pinInput.length !== 4}
                className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};