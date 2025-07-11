import React, { useState } from 'react';
import { ArrowLeft, Monitor, Play, Settings, ExternalLink, Download, Info } from 'lucide-react';
import { AppSettings } from '../types';

interface PlayerSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const PlayerSettings: React.FC<PlayerSettingsProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(settings.player);

  const players = [
    {
      id: 'default' as const,
      name: 'Default Player',
      description: 'Built-in HTML5 video player with basic controls',
      icon: Monitor,
      features: ['HTML5 Video', 'Basic Controls', 'Web Compatible', 'Fast Loading'],
      pros: ['No installation required', 'Works on all devices', 'Lightweight'],
      cons: ['Limited codec support', 'Basic features only']
    },
    {
      id: 'vlc' as const,
      name: 'VLC Media Player',
      description: 'Professional media player with extensive codec support',
      icon: Play,
      features: ['All Codecs', 'Advanced Controls', 'Subtitles', 'Audio Tracks'],
      pros: ['Excellent codec support', 'Advanced features', 'Stable playback'],
      cons: ['Requires VLC installation', 'May need configuration']
    },
    {
      id: 'mx' as const,
      name: 'MX Player',
      description: 'Popular mobile media player optimized for streaming',
      icon: Settings,
      features: ['Mobile Optimized', 'Hardware Acceleration', 'Gesture Controls', 'Subtitle Support'],
      pros: ['Great for mobile devices', 'Hardware acceleration', 'Touch controls'],
      cons: ['Mobile focused', 'Limited desktop support']
    }
  ];

  const handlePlayerSelect = (playerId: 'default' | 'vlc' | 'mx') => {
    setSelectedPlayer(playerId);
    onUpdateSettings({ player: playerId });
  };

  const handleInstallPlayer = (playerId: string) => {
    const installUrls = {
      vlc: 'https://www.videolan.org/vlc/',
      mx: 'https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad'
    };

    if (playerId === 'vlc' || playerId === 'mx') {
      window.open(installUrls[playerId], '_blank');
    }
  };

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
          <h1 className="text-4xl font-bold text-yellow-500">Player Settings</h1>
        </div>
      </div>

      {/* Current Player Info */}
      <div className="mb-8 p-6 border-2 border-yellow-500 rounded-2xl">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Current Player</h2>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            {React.createElement(players.find(p => p.id === selectedPlayer)?.icon || Monitor, {
              size: 32,
              className: 'text-yellow-500'
            })}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {players.find(p => p.id === selectedPlayer)?.name}
            </h3>
            <p className="text-gray-400">
              {players.find(p => p.id === selectedPlayer)?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Player Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
              selectedPlayer === player.id
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-gray-600 hover:border-yellow-500'
            }`}
            onClick={() => handlePlayerSelect(player.id)}
          >
            {/* Player Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedPlayer === player.id ? 'bg-yellow-500/20' : 'bg-gray-700'
                }`}>
                  <player.icon 
                    size={24} 
                    className={selectedPlayer === player.id ? 'text-yellow-500' : 'text-gray-400'} 
                  />
                </div>
                <div>
                  <h3 className={`font-bold ${
                    selectedPlayer === player.id ? 'text-yellow-500' : 'text-white'
                  }`}>
                    {player.name}
                  </h3>
                  {selectedPlayer === player.id && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4">{player.description}</p>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Features:</h4>
              <div className="flex flex-wrap gap-1">
                {player.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="space-y-3 mb-4">
              <div>
                <h5 className="text-green-500 font-medium text-sm mb-1">Pros:</h5>
                <ul className="text-xs text-gray-400 space-y-1">
                  {player.pros.map((pro, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <span className="text-green-500">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-red-500 font-medium text-sm mb-1">Cons:</h5>
                <ul className="text-xs text-gray-400 space-y-1">
                  {player.cons.map((con, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <span className="text-red-500">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayerSelect(player.id);
                }}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  selectedPlayer === player.id
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {selectedPlayer === player.id ? 'Currently Selected' : 'Select Player'}
              </button>

              {player.id !== 'default' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInstallPlayer(player.id);
                  }}
                  className="w-full py-2 px-4 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Download size={16} />
                  <span>Install {player.name}</span>
                  <ExternalLink size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Settings */}
      <div className="mt-8 p-6 border-2 border-yellow-500 rounded-2xl">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Player Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Video Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-gray-300">Hardware Acceleration</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-gray-300">Auto Quality</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Audio Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-gray-300">Audio Boost</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-gray-300">Surround Sound</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-blue-500 font-semibold mb-1">Player Installation Notes</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• VLC Player: Download and install from official website for best compatibility</li>
                <li>• MX Player: Available on mobile app stores, limited desktop support</li>
                <li>• Default Player: No installation required, works in all browsers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};