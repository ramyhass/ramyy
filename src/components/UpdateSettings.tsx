import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Settings as SettingsIcon,
  Play,
  Pause,
  Info,
  AlertTriangle,
  Download,
  Wifi,
  WifiOff
} from 'lucide-react';
import { AppSettings } from '../types';
import { useIPTVPlayer } from '../hooks/useIPTVPlayer';

interface UpdateSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const UpdateSettings: React.FC<UpdateSettingsProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const { playlists, refreshData } = useIPTVPlayer();
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateStatus, setLastUpdateStatus] = useState<'success' | 'error' | null>(null);
  const [nextUpdateTime, setNextUpdateTime] = useState<Date | null>(null);

  const updateFrequencies = [
    {
      id: 'startup' as const,
      name: 'On Startup',
      description: 'Update playlists every time the application starts',
      icon: Play,
      interval: 'Application startup only',
      recommended: false
    },
    {
      id: 'daily' as const,
      name: 'Daily',
      description: 'Update playlists once every 24 hours automatically',
      icon: Calendar,
      interval: 'Every 24 hours',
      recommended: true
    },
    {
      id: 'every2days' as const,
      name: 'Every 2 Days',
      description: 'Update playlists every 48 hours to reduce server load',
      icon: Clock,
      interval: 'Every 48 hours',
      recommended: false
    }
  ];

  // Calculate next update time
  useEffect(() => {
    if (settings.automaticUpdate.enabled && settings.automaticUpdate.lastUpdate) {
      const lastUpdate = new Date(settings.automaticUpdate.lastUpdate);
      let nextUpdate = new Date(lastUpdate);
      
      switch (settings.automaticUpdate.frequency) {
        case 'startup':
          nextUpdate = new Date(); // Next startup
          break;
        case 'daily':
          nextUpdate.setDate(lastUpdate.getDate() + 1);
          break;
        case 'every2days':
          nextUpdate.setDate(lastUpdate.getDate() + 2);
          break;
      }
      
      setNextUpdateTime(nextUpdate);
    } else {
      setNextUpdateTime(null);
    }
  }, [settings.automaticUpdate]);

  const handleToggleAutoUpdate = () => {
    const newEnabled = !settings.automaticUpdate.enabled;
    onUpdateSettings({
      automaticUpdate: {
        ...settings.automaticUpdate,
        enabled: newEnabled,
        lastUpdate: newEnabled ? new Date() : settings.automaticUpdate.lastUpdate
      }
    });
  };

  const handleFrequencyChange = (frequency: 'startup' | 'daily' | 'every2days') => {
    onUpdateSettings({
      automaticUpdate: {
        ...settings.automaticUpdate,
        frequency,
        lastUpdate: new Date() // Reset last update time when changing frequency
      }
    });
  };

  const handleManualUpdate = async () => {
    setIsUpdating(true);
    setLastUpdateStatus(null);
    
    try {
      await refreshData();
      
      // Update the last update time
      onUpdateSettings({
        automaticUpdate: {
          ...settings.automaticUpdate,
          lastUpdate: new Date()
        }
      });
      
      setLastUpdateStatus('success');
    } catch (error) {
      console.error('Manual update failed:', error);
      setLastUpdateStatus('error');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTimeUntilNext = (nextUpdate: Date) => {
    const now = new Date();
    const diffMs = nextUpdate.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Overdue';
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
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
          <h1 className="text-4xl font-bold text-yellow-500">Update Settings</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${
            settings.automaticUpdate.enabled ? 'border-green-500 bg-green-500/20' : 'border-gray-500'
          }`}>
            {settings.automaticUpdate.enabled ? (
              <Wifi className="text-green-500" size={20} />
            ) : (
              <WifiOff className="text-gray-500" size={20} />
            )}
            <span className={`font-medium ${
              settings.automaticUpdate.enabled ? 'text-green-500' : 'text-gray-500'
            }`}>
              {settings.automaticUpdate.enabled ? 'AUTO UPDATE ON' : 'AUTO UPDATE OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Auto Update Toggle */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SettingsIcon className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-yellow-500">Auto Update</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Automatically update playlists to get the latest channels and content.
          </p>
          <button
            onClick={handleToggleAutoUpdate}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              settings.automaticUpdate.enabled
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {settings.automaticUpdate.enabled ? 'Disable Auto Update' : 'Enable Auto Update'}
          </button>
        </div>

        {/* Last Update */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-yellow-500">Last Update</h3>
          </div>
          {settings.automaticUpdate.lastUpdate ? (
            <div>
              <p className="text-white font-semibold">
                {new Date(settings.automaticUpdate.lastUpdate).toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {Math.floor((Date.now() - new Date(settings.automaticUpdate.lastUpdate).getTime()) / (1000 * 60 * 60))} hours ago
              </p>
            </div>
          ) : (
            <p className="text-gray-400">Never updated automatically</p>
          )}
        </div>

        {/* Next Update */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <RefreshCw className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-yellow-500">Next Update</h3>
          </div>
          {settings.automaticUpdate.enabled && nextUpdateTime ? (
            <div>
              <p className="text-white font-semibold">
                {settings.automaticUpdate.frequency === 'startup' ? 'Next app startup' : nextUpdateTime.toLocaleString()}
              </p>
              {settings.automaticUpdate.frequency !== 'startup' && (
                <p className="text-gray-400 text-sm mt-1">
                  In {formatTimeUntilNext(nextUpdateTime)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Auto update disabled</p>
          )}
        </div>
      </div>

      {/* Update Frequency Selection */}
      <div className="border-2 border-yellow-500 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6">Update Frequency</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {updateFrequencies.map((freq) => (
            <div
              key={freq.id}
              className={`border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer ${
                settings.automaticUpdate.frequency === freq.id
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-600 hover:border-yellow-500'
              }`}
              onClick={() => handleFrequencyChange(freq.id)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    settings.automaticUpdate.frequency === freq.id ? 'bg-yellow-500/20' : 'bg-gray-700'
                  }`}>
                    <freq.icon 
                      size={24} 
                      className={settings.automaticUpdate.frequency === freq.id ? 'text-yellow-500' : 'text-gray-400'} 
                    />
                  </div>
                  <div>
                    <h3 className={`font-bold ${
                      settings.automaticUpdate.frequency === freq.id ? 'text-yellow-500' : 'text-white'
                    }`}>
                      {freq.name}
                    </h3>
                    {settings.automaticUpdate.frequency === freq.id && (
                      <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                        SELECTED
                      </span>
                    )}
                  </div>
                </div>
                
                {freq.recommended && (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-green-500 text-xs font-medium">RECOMMENDED</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">{freq.description}</p>

              {/* Interval */}
              <div className="flex items-center space-x-2 mb-4">
                <Clock size={14} className="text-gray-500" />
                <span className="text-gray-300 text-sm">{freq.interval}</span>
              </div>

              {/* Selection Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFrequencyChange(freq.id);
                }}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  settings.automaticUpdate.frequency === freq.id
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {settings.automaticUpdate.frequency === freq.id ? 'Currently Selected' : 'Select Frequency'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Update & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Update */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Manual Update</h2>
          <p className="text-gray-400 mb-6">
            Update all playlists immediately without waiting for the automatic schedule.
          </p>
          
          {lastUpdateStatus && (
            <div className={`flex items-center space-x-2 mb-4 p-3 rounded-lg ${
              lastUpdateStatus === 'success' ? 'bg-green-500/10 border border-green-500' : 'bg-red-500/10 border border-red-500'
            }`}>
              {lastUpdateStatus === 'success' ? (
                <CheckCircle className="text-green-500" size={16} />
              ) : (
                <XCircle className="text-red-500" size={16} />
              )}
              <span className={getStatusColor(lastUpdateStatus)}>
                {lastUpdateStatus === 'success' ? 'Update completed successfully!' : 'Update failed. Please try again.'}
              </span>
            </div>
          )}
          
          <button
            onClick={handleManualUpdate}
            disabled={isUpdating}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              isUpdating
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-500 text-black hover:bg-yellow-400'
            }`}
          >
            <RefreshCw size={20} className={isUpdating ? 'animate-spin' : ''} />
            <span>{isUpdating ? 'Updating...' : 'Update Now'}</span>
          </button>
        </div>

        {/* Update Statistics */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Update Statistics</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Playlists:</span>
              <span className="text-white font-semibold">{playlists.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Auto Update Status:</span>
              <span className={`font-semibold ${
                settings.automaticUpdate.enabled ? 'text-green-500' : 'text-red-500'
              }`}>
                {settings.automaticUpdate.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Update Frequency:</span>
              <span className="text-white font-semibold capitalize">
                {settings.automaticUpdate.frequency.replace('every2days', 'Every 2 Days')}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Last Manual Update:</span>
              <span className="text-white font-semibold">
                {settings.automaticUpdate.lastUpdate 
                  ? new Date(settings.automaticUpdate.lastUpdate).toLocaleDateString()
                  : 'Never'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-blue-500 font-semibold mb-1">Update Information</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Automatic updates refresh all imported playlists to get the latest channels</li>
              <li>• Updates run in the background and won't interrupt your viewing</li>
              <li>• Failed automatic updates will be retried on the next scheduled time</li>
              <li>• You can always trigger a manual update regardless of the automatic schedule</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Warning for disabled auto update */}
      {!settings.automaticUpdate.enabled && (
        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-orange-500 font-semibold mb-1">Automatic Updates Disabled</h4>
              <p className="text-sm text-gray-300">
                Your playlists won't be updated automatically. Enable automatic updates to ensure you always have 
                the latest channels and content. You can still update manually at any time.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};