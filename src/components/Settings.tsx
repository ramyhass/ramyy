import React from 'react';
import { useState } from 'react';
import { 
  ArrowLeft, 
  List, 
  Lock, 
  Languages, 
  Grid3X3, 
  EyeOff, 
  Trash2, 
  Monitor, 
  Settings as SettingsIcon, 
  Clock, 
  Type, 
  RefreshCw,
  Smartphone,
  ArrowUpDown,
  X,
  Check,
  Download
} from 'lucide-react';
import { AppSettings } from '../types';
import { ParentalControl } from './ParentalControl';
import { PlayerSettings } from './PlayerSettings';
import { PlaylistSettings } from './PlaylistSettings';
import { StreamFormatSettings } from './StreamFormatSettings';
import { ClearHistoryModal } from './ClearHistoryModal';
import { UpdateSettings } from './UpdateSettings';
import { SubtitleSettings } from './SubtitleSettings';
import { TimeFormatSettings } from './TimeFormatSettings';
import { DeviceTypeSettings } from './DeviceTypeSettings';
import { LanguageSettings } from './LanguageSettings';
import { useIPTVPlayer } from '../hooks/useIPTVPlayer';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsProps {
  settings: AppSettings;
  categories: string[];
  isParentalUnlocked: boolean;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onVerifyPin: (pin: string) => boolean;
  onToggleCategoryLock: (category: string) => void;
  onBack?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  categories,
  isParentalUnlocked,
  onUpdateSettings,
  onVerifyPin,
  onToggleCategoryLock,
  onBack
}) => {
  const { t } = useTranslation();
  const { watchHistory, clearChannelHistory, clearMovieHistory, clearSeriesHistory } = useIPTVPlayer();
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);
  const [showHideModal, setShowHideModal] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState<string | null>(null);

  if (activeSubPage === 'parental') {
    return (
      <ParentalControl
        settings={settings}
        categories={categories}
        isParentalUnlocked={isParentalUnlocked}
        onUpdateSettings={onUpdateSettings}
        onVerifyPin={onVerifyPin}
        onToggleCategoryLock={onToggleCategoryLock}
        onBack={() => setActiveSubPage(null)}
      />
    );
  }

  if (activeSubPage === 'changePlayer') {
    return (
      <PlayerSettings
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onBack={() => setActiveSubPage(null)}
      />
    );
  }

  if (activeSubPage === 'playlists') {
    return (
      <PlaylistSettings
        onBack={() => setActiveSubPage(null)}
      />
    );
  }

  if (activeSubPage === 'streamFormat') {
    return (
      <StreamFormatSettings
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onBack={() => setActiveSubPage(null)}
      />
    );
  }

  if (activeSubPage === 'update') {
    return (
      <UpdateSettings
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onBack={() => setActiveSubPage(null)}
      />
    );
  }

  if (activeSubPage === 'language') {
    return (
      <LanguageSettings
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onBack={() => setActiveSubPage(null)}
      />
    );
  }

  if (activeSubPage === 'subtitle') {
    return (
      <SubtitleSettings
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onBack={() => setActiveSubPage(null)}
      />
    );
  }

  if (activeSubPage === 'timeFormat') {
    return (
      <TimeFormatSettings
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onBack={() => setActiveSubPage(null)}
      />
    );
  }

  if (activeSubPage === 'deviceType') {
    return (
      <DeviceTypeSettings
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onBack={() => setActiveSubPage(null)}
      />
    );
  }
  const settingsItems = [
    { id: 'parental', label: t('settings.parentalControl'), icon: Lock },
    { id: 'playlists', label: t('settings.managePlaylists'), icon: Download },
    { id: 'language', label: t('settings.changeLanguage'), icon: Languages },
    { id: 'hideLive', label: t('settings.hideLiveCategories'), icon: EyeOff },
    { id: 'hideVod', label: t('settings.hideVodCategories'), icon: EyeOff },
    { id: 'hideSeries', label: t('settings.hideSeriesCategories'), icon: EyeOff },
    { id: 'clearChannels', label: t('settings.clearChannelHistory'), icon: Trash2 },
    { id: 'clearMovies', label: t('settings.clearMovieHistory'), icon: Trash2 },
    { id: 'clearSeries', label: t('settings.clearSeriesHistory'), icon: Trash2 },
    { id: 'streamFormat', label: t('settings.liveStreamFormat'), icon: Monitor },
    { id: 'changePlayer', label: t('settings.changePlayer'), icon: SettingsIcon },
    { id: 'update', label: t('settings.update'), icon: RefreshCw },
    { id: 'timeFormat', label: t('settings.timeFormat'), icon: Clock },
    { id: 'subtitle', label: t('settings.subtitleSettings'), icon: Type },
    { id: 'deviceType', label: t('settings.deviceType'), icon: Smartphone }
  ];

  // Get categories excluding 'All' and 'Favorites'
  const availableCategories = categories.filter(cat => cat !== 'All' && cat !== 'Favorites');

  const getHiddenCategories = (type: string) => {
    switch (type) {
      case 'hideLive':
        return settings.hiddenCategories?.live || [];
      case 'hideVod':
        return settings.hiddenCategories?.vod || [];
      case 'hideSeries':
        return settings.hiddenCategories?.series || [];
      default:
        return [];
    }
  };

  const updateHiddenCategories = (type: string, categories: string[]) => {
    const currentHidden = settings.hiddenCategories || { live: [], vod: [], series: [] };
    
    switch (type) {
      case 'hideLive':
        onUpdateSettings({
          hiddenCategories: { ...currentHidden, live: categories }
        });
        break;
      case 'hideVod':
        onUpdateSettings({
          hiddenCategories: { ...currentHidden, vod: categories }
        });
        break;
      case 'hideSeries':
        onUpdateSettings({
          hiddenCategories: { ...currentHidden, series: categories }
        });
        break;
    }
  };

  const toggleCategoryHidden = (type: string, category: string) => {
    const currentHidden = getHiddenCategories(type);
    const isHidden = currentHidden.includes(category);
    
    const updatedHidden = isHidden
      ? currentHidden.filter(cat => cat !== category)
      : [...currentHidden, category];
    
    updateHiddenCategories(type, updatedHidden);
  };
  const handleSettingClick = (settingId: string) => {
    switch (settingId) {
      case 'parental':
        setActiveSubPage('parental');
        break;
      case 'changePlayer':
        setActiveSubPage('changePlayer');
        break;
      case 'playlists':
        setActiveSubPage('playlists');
        break;
      case 'streamFormat':
        setActiveSubPage('streamFormat');
        break;
      case 'update':
        setActiveSubPage('update');
        break;
      case 'subtitle':
        setActiveSubPage('subtitle');
        break;
      case 'timeFormat':
        setActiveSubPage('timeFormat');
        break;
      case 'deviceType':
        setActiveSubPage('deviceType');
        break;
      case 'language':
        setActiveSubPage('language');
        break;
      case 'hideLive':
      case 'hideVod':
      case 'hideSeries':
        setShowHideModal(settingId);
        break;
      case 'language':
        setActiveSubPage('language');
        break;
      case 'clearChannels':
      case 'clearMovies':
      case 'clearSeries':
        // Show clear history modal
        const historyType = settingId === 'clearChannels' ? 'channels' : 
                           settingId === 'clearMovies' ? 'movies' : 'series';
        setShowClearModal(historyType);
        break;
      default:
        // For other settings, show a placeholder action
        alert(`${settingId} setting clicked`);
    }
  };

  const getModalTitle = (type: string) => {
    switch (type) {
      case 'hideLive':
        return 'Hide Live TV Categories';
      case 'hideVod':
        return 'Hide Movie Categories';
      case 'hideSeries':
        return 'Hide Series Categories';
      default:
        return 'Hide Categories';
    }
  };
  return (
    <div className="min-h-screen bg-black p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-4xl font-bold text-yellow-500">Settings</h1>
          <h1 className="text-4xl font-bold text-yellow-500">{t('settings.title')}</h1>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-4 gap-6">
        {settingsItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSettingClick(item.id)}
            className="border-2 border-yellow-500 rounded-2xl p-6 hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="flex flex-col items-center space-y-3">
              <item.icon size={32} className="text-yellow-500 group-hover:text-black" />
              <span className="text-yellow-500 group-hover:text-black font-medium text-center text-sm leading-tight">
                {item.label}
              </span>
              {item.id === 'changePlayer' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70 capitalize">
                  Current: {settings.player}
                </span>
              )}
              {item.id === 'language' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70 uppercase">
                  {settings.language}
                </span>
              )}
              {item.id === 'streamFormat' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70 uppercase">
                  {settings.streamFormat}
                </span>
              )}
              {item.id === 'update' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70">
                  {settings.automaticUpdate.enabled ? 
                    `${settings.automaticUpdate.frequency}` : 
                    'Disabled'
                  }
                </span>
              )}
              {item.id === 'timeFormat' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70 uppercase">
                  {settings.timeFormat}
                </span>
              )}
              {item.id === 'subtitle' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70">
                  {settings.subtitles.enabled ? 'Enabled' : 'Disabled'}
                </span>
              )}
              {item.id === 'deviceType' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70 capitalize">
                  {settings.deviceType}
                </span>
              )}
              {(item.id === 'hideLive' || item.id === 'hideVod' || item.id === 'hideSeries') && (
                <span className="text-xs text-gray-400 group-hover:text-black/70">
                  {getHiddenCategories(item.id).length} hidden
                </span>
              )}
              {item.id === 'clearChannels' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70">
                  {watchHistory.channels.length} items
                </span>
              )}
              {item.id === 'clearMovies' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70">
                  {watchHistory.movies.length} items
                </span>
              )}
              {item.id === 'clearSeries' && (
                <span className="text-xs text-gray-400 group-hover:text-black/70">
                  {watchHistory.series.length} items
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Hide Categories Modal */}
      {showHideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden border border-yellow-500">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <EyeOff className="text-yellow-500" size={24} />
                <h2 className="text-xl font-bold text-yellow-500">{getModalTitle(showHideModal)}</h2>
              </div>
              <button
                onClick={() => setShowHideModal(null)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="text-gray-400" size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-400 mb-6">
                Select categories to hide from the {showHideModal === 'hideLive' ? 'Live TV' : showHideModal === 'hideVod' ? 'Movies' : 'Series'} section. 
                Hidden categories won't appear in the category filter.
              </p>

              {/* Categories List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableCategories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No categories available</p>
                  </div>
                ) : (
                  availableCategories.map(category => {
                    const isHidden = getHiddenCategories(showHideModal).includes(category);
                    return (
                      <div
                        key={category}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          isHidden
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-gray-600 hover:border-yellow-500'
                        }`}
                        onClick={() => toggleCategoryHidden(showHideModal, category)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            isHidden
                              ? 'border-red-500 bg-red-500'
                              : 'border-gray-500'
                          }`}>
                            {isHidden && <Check className="text-white" size={14} />}
                          </div>
                          <span className={`font-medium ${
                            isHidden ? 'text-red-400' : 'text-white'
                          }`}>
                            {category}
                          </span>
                        </div>
                        
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          isHidden
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {isHidden ? 'Hidden' : 'Visible'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Summary */}
              {availableCategories.length > 0 && (
                <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Total Categories: {availableCategories.length}
                    </span>
                    <span className="text-yellow-500">
                      Hidden: {getHiddenCategories(showHideModal).length}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => updateHiddenCategories(showHideModal, [])}
                  className="px-4 py-2 text-yellow-500 hover:bg-yellow-500 hover:text-black rounded-lg transition-colors"
                >
                  Show All
                </button>
                <button
                  onClick={() => setShowHideModal(null)}
                  className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear History Modal */}
      {showClearModal && (
        <ClearHistoryModal
          isOpen={true}
          onClose={() => setShowClearModal(null)}
          type={showClearModal as 'channels' | 'movies' | 'series'}
          items={
            showClearModal === 'channels' ? watchHistory.channels :
            showClearModal === 'movies' ? watchHistory.movies :
            watchHistory.series
          }
          onClear={(selectedItems) => {
            if (showClearModal === 'channels') {
              clearChannelHistory(selectedItems);
            } else if (showClearModal === 'movies') {
              clearMovieHistory(selectedItems);
            } else if (showClearModal === 'series') {
              clearSeriesHistory(selectedItems);
            }
            setShowClearModal(null);
          }}
        />
      )}
      {/* Device Info */}
    </div>
  );
};