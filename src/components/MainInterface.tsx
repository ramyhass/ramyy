import React from 'react';
import { useState } from 'react';
import { Crown, Clock, Tv, Film, Monitor, Search as SearchIcon, Calendar, LogOut, Star, User, RefreshCw, Play, Settings } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { AccountModal } from './AccountModal';
import { ExitConfirmModal } from './ExitConfirmModal';
import { Channel } from '../types';
import { useIPTVPlayer } from '../hooks/useIPTVPlayer';
import { useTranslation } from '../hooks/useTranslation';

interface MainInterfaceProps {
  currentChannel: Channel | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  channels: Channel[];
  favorites: string[];
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onChannelSelect: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  onNavigate: (view: string) => void;
  userInfo: any;
  onUpdateUserInfo: (info: any) => void;
  isRefreshing: boolean;
  onRefreshData: () => void;
  onExit: () => void;
}

export const MainInterface: React.FC<MainInterfaceProps> = ({
  currentChannel,
  isPlaying,
  volume,
  currentTime,
  duration,
  channels,
  favorites,
  onTogglePlay,
  onVolumeChange,
  onSeek,
  onChannelSelect,
  onToggleFavorite,
  onNavigate,
  userInfo,
  onUpdateUserInfo,
  isRefreshing,
  onRefreshData,
  onExit
}) => {
  const { settings } = useIPTVPlayer();
  const { t } = useTranslation();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const favoriteChannels = channels.filter(ch => favorites.includes(ch.id)).slice(0, 20);
  const recentMovies = [
    { id: 1, title: 'The Dark Knight', year: '2008', poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 2, title: 'Inception', year: '2010', poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 3, title: 'Interstellar', year: '2014', poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 4, title: 'Tenet', year: '2020', poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 5, title: 'Dune', year: '2021', poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 6, title: 'Top Gun: Maverick', year: '2022', poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ];

  const getCurrentTime = () => {
    const now = new Date();
    if (settings.timeFormat === '24h') {
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  };

  const navigationButtons = [
    { id: 'live', label: t('nav.liveTV'), icon: Tv },
    { id: 'movies', label: t('nav.movies'), icon: Film },
    { id: 'series', label: t('nav.series'), icon: Monitor },
    { id: 'catchup', label: t('nav.catchup'), icon: Clock },
    { id: 'search', label: t('nav.search'), icon: SearchIcon },
    { id: 'tvguide', label: t('nav.tvGuide'), icon: Calendar },
    { id: 'exit', label: t('nav.exit'), icon: LogOut }
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/golden-lion-with-crown-logo-vector-45981373.png" 
              alt="LEOIPTV Logo" 
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl font-bold text-yellow-500 tracking-wider">LEOIPTV</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-yellow-500">
          <button 
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300"
          >
            <Settings size={24} />
          </button>
          <button 
            onClick={() => setShowAccountModal(true)}
            className="p-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300"
          >
            <User size={24} />
          </button>
          <button 
            onClick={onRefreshData}
            disabled={isRefreshing}
            className={`p-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw size={24} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <Clock size={24} />
          <span className="text-2xl font-bold">{getCurrentTime()}</span>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Watch Now and Favorite Channels - Horizontal Layout */}
        <div className="flex gap-8 mb-8 flex-grow-0 flex-shrink-0" style={{ height: '400px' }}>
          {/* Watch Now Section */}
          <div className="w-2/3">
            <div className="border-2 border-yellow-500 rounded-2xl p-6 h-full flex flex-col">
              <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center">{t('main.watchNow')}</h2>
              
              <div className="flex-grow flex items-center justify-center">
                {currentChannel ? (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-500">
                      {currentChannel.logo ? (
                        <img 
                          src={currentChannel.logo} 
                          alt={currentChannel.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">
                            {currentChannel.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-yellow-500 mb-2">{currentChannel.name}</h3>
                    <p className="text-white/80 mb-6">{currentChannel.category}</p>
                    
                    <button
                      onClick={onTogglePlay}
                      className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-all duration-300 font-semibold"
                    >
                      <Play size={20} />
                      <span>{t('main.continueWatching')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Tv className="mx-auto mb-4" size={64} />
                    <p className="text-xl">{t('main.noRecentMedia')}</p>
                    <p className="text-sm">{t('main.selectChannel')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Favorite Channels Section */}
          <div className="w-1/3">
            <div className="border-2 border-yellow-500 rounded-2xl p-6 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">{t('main.favoriteChannels')}</h2>
              <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800">
                {favoriteChannels.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {favoriteChannels.map(channel => (
                      <button
                        key={channel.id}
                        onClick={() => onChannelSelect(channel)}
                        className="border border-yellow-500 rounded-lg p-2 hover:bg-yellow-500 hover:text-black transition-all duration-300 group"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            {channel.logo ? (
                              <img 
                                src={channel.logo} 
                                alt={channel.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center">
                                <span className="text-xs font-bold text-white group-hover:text-black">
                                  {channel.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-yellow-500 group-hover:text-black text-center truncate w-full">
                            {channel.name}
                          </span>
                        </div>
                      </button>
                    ))}
                    {/* Fill remaining slots to maintain grid structure */}
                    {Array.from({ length: Math.max(0, 18 - favoriteChannels.length) }).map((_, index) => (
                      <div key={`empty-${index}`} className="border border-gray-700 rounded-lg p-2 opacity-30">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-lg bg-gray-800"></div>
                          <span className="text-xs text-gray-600">Empty</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Star className="mx-auto mb-4" size={48} />
                    <p className="text-lg">{t('main.noFavorites')}</p>
                    <p className="text-sm">{t('main.markFavorites')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Horizontal Bar */}
        <div className="flex justify-between gap-4 mb-8 flex-grow-0 flex-shrink-0">
          {navigationButtons.map(button => (
            <button
              key={button.id}
              onClick={() => button.id === 'exit' ? setShowExitModal(true) : onNavigate(button.id)}
              className="flex-1 border-2 border-yellow-500 rounded-xl p-4 hover:bg-yellow-500 hover:text-black transition-all duration-300 group"
            >
              <div className="flex flex-col items-center space-y-2">
                <button.icon size={32} className="text-yellow-500 group-hover:text-black" />
                <span className="text-lg font-semibold text-yellow-500 group-hover:text-black">
                  {button.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Latest Added Movies */}
        <div className="flex-grow overflow-hidden">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">{t('main.latestMovies')}</h2>
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800">
            <div className="grid grid-cols-7 gap-3">
              {recentMovies.map(movie => (
                <div
                  key={movie.id}
                  className="border border-yellow-500 rounded-lg overflow-hidden hover:border-yellow-400 transition-all duration-300 cursor-pointer group"
                >
                  <div className="aspect-[3/4] bg-gray-800 relative overflow-hidden">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-yellow-500 font-semibold text-xs truncate">{movie.title}</h3>
                    <p className="text-gray-400 text-xs">{movie.year}</p>
                  </div>
                </div>
              ))}
              {/* Fill remaining slots to show empty containers (35 total - 6 existing = 29 empty) */}
              {Array.from({ length: 29 }).map((_, index) => (
                <div
                  key={`empty-movie-${index}`}
                  className="border border-yellow-500 rounded-lg overflow-hidden opacity-50 hover:opacity-70 transition-opacity duration-300"
                >
                  <div className="aspect-[3/4] bg-gray-800 flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <div className="w-8 h-8 mx-auto mb-1 bg-gray-700 rounded"></div>
                      <div className="text-xs">Empty</div>
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="text-gray-500 font-semibold text-xs">Empty Slot</h3>
                    <p className="text-gray-600 text-xs">Available</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Modal */}
      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        userInfo={userInfo}
        onUpdateAccount={onUpdateUserInfo}
      />

      {/* Exit Confirmation Modal */}
      <ExitConfirmModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          onExit();
        }}
      />
    </div>
  );
};