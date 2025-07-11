import React, { useState } from 'react';
import { ArrowLeft, Type, Eye, EyeOff, Palette, Move, Languages, Check } from 'lucide-react';
import { AppSettings } from '../types';

interface SubtitleSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const SubtitleSettings: React.FC<SubtitleSettingsProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const [previewText] = useState('This is a subtitle preview text');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  const fontSizes = [
    { id: 'small' as const, name: 'Small', size: '14px' },
    { id: 'medium' as const, name: 'Medium', size: '18px' },
    { id: 'large' as const, name: 'Large', size: '24px' }
  ];

  const colors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Yellow', value: '#ffff00' },
    { name: 'Red', value: '#ff0000' },
    { name: 'Green', value: '#00ff00' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Cyan', value: '#00ffff' },
    { name: 'Magenta', value: '#ff00ff' },
    { name: 'Black', value: '#000000' }
  ];

  const backgroundColors = [
    { name: 'Transparent', value: 'transparent' },
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#333333' },
    { name: 'Gray', value: '#666666' },
    { name: 'White', value: '#ffffff' }
  ];

  const positions = [
    { id: 'top' as const, name: 'Top' },
    { id: 'center' as const, name: 'Center' },
    { id: 'bottom' as const, name: 'Bottom' }
  ];

  const updateSubtitleSettings = (updates: Partial<typeof settings.subtitles>) => {
    onUpdateSettings({
      subtitles: {
        ...settings.subtitles,
        ...updates
      }
    });
  };

  const getPreviewStyle = () => {
    return {
      fontSize: fontSizes.find(f => f.id === settings.subtitles.fontSize)?.size || '18px',
      color: settings.subtitles.color,
      backgroundColor: settings.subtitles.backgroundColor === 'transparent' ? 'rgba(0,0,0,0.7)' : settings.subtitles.backgroundColor,
      padding: '8px 16px',
      borderRadius: '4px',
      display: 'inline-block',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
    };
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
          <h1 className="text-4xl font-bold text-yellow-500">Subtitle Settings</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${
            settings.subtitles.enabled ? 'border-green-500 bg-green-500/20' : 'border-gray-500'
          }`}>
            {settings.subtitles.enabled ? (
              <Eye className="text-green-500" size={20} />
            ) : (
              <EyeOff className="text-gray-500" size={20} />
            )}
            <span className={`font-medium ${
              settings.subtitles.enabled ? 'text-green-500' : 'text-gray-500'
            }`}>
              {settings.subtitles.enabled ? 'SUBTITLES ON' : 'SUBTITLES OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="border-2 border-yellow-500 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Preview</h2>
        <div className="bg-gray-900 rounded-lg p-8 min-h-32 flex items-center justify-center relative">
          <div className="w-full h-32 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg flex items-center justify-center relative">
            <span className="text-gray-400 text-lg">Video Content</span>
            {settings.subtitles.enabled && (
              <div 
                className={`absolute ${
                  settings.subtitles.position === 'top' ? 'top-4' :
                  settings.subtitles.position === 'center' ? 'top-1/2 transform -translate-y-1/2' :
                  'bottom-4'
                } left-1/2 transform -translate-x-1/2`}
              >
                <div style={getPreviewStyle()}>
                  {previewText}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enable/Disable & Language */}
        <div className="space-y-6">
          {/* Enable Subtitles */}
          <div className="border-2 border-yellow-500 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Type className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-yellow-500">Enable Subtitles</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Turn subtitles on or off for all video content.
            </p>
            <button
              onClick={() => updateSubtitleSettings({ enabled: !settings.subtitles.enabled })}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                settings.subtitles.enabled
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {settings.subtitles.enabled ? 'Disable Subtitles' : 'Enable Subtitles'}
            </button>
          </div>

          {/* Language Selection */}
          <div className="border-2 border-yellow-500 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Languages className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-yellow-500">Subtitle Language</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Select your preferred subtitle language.
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => updateSubtitleSettings({ language: lang.code })}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center justify-between ${
                    settings.subtitles.language === lang.code
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                      : 'border-gray-600 text-gray-300 hover:border-yellow-500'
                  }`}
                >
                  <span>{lang.name}</span>
                  {settings.subtitles.language === lang.code && (
                    <Check size={16} className="text-yellow-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="space-y-6">
          {/* Font Size */}
          <div className="border-2 border-yellow-500 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-4">Font Size</h3>
            <div className="grid grid-cols-3 gap-3">
              {fontSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => updateSubtitleSettings({ fontSize: size.id })}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    settings.subtitles.fontSize === size.id
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                      : 'border-gray-600 text-gray-300 hover:border-yellow-500'
                  }`}
                >
                  <div className="text-center">
                    <div style={{ fontSize: size.size }} className="mb-2">Aa</div>
                    <span className="text-sm">{size.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div className="border-2 border-yellow-500 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-yellow-500">Text Color</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateSubtitleSettings({ color: color.value })}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center space-x-2 ${
                    settings.subtitles.color === color.value
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 hover:border-yellow-500'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-400"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-sm text-gray-300">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div className="border-2 border-yellow-500 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-4">Background</h3>
            <div className="space-y-2">
              {backgroundColors.map((bgColor) => (
                <button
                  key={bgColor.value}
                  onClick={() => updateSubtitleSettings({ backgroundColor: bgColor.value })}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-300 flex items-center space-x-3 ${
                    settings.subtitles.backgroundColor === bgColor.value
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 hover:border-yellow-500'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded border border-gray-400"
                    style={{ 
                      backgroundColor: bgColor.value === 'transparent' ? 'transparent' : bgColor.value,
                      backgroundImage: bgColor.value === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                      backgroundSize: bgColor.value === 'transparent' ? '8px 8px' : 'auto',
                      backgroundPosition: bgColor.value === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                    }}
                  />
                  <span className="text-gray-300">{bgColor.name}</span>
                  {settings.subtitles.backgroundColor === bgColor.value && (
                    <Check size={16} className="text-yellow-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div className="border-2 border-yellow-500 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Move className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-yellow-500">Position</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {positions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => updateSubtitleSettings({ position: pos.id })}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    settings.subtitles.position === pos.id
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                      : 'border-gray-600 text-gray-300 hover:border-yellow-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-8 mx-auto mb-2 border border-gray-500 rounded relative">
                      <div 
                        className={`absolute w-8 h-1 bg-current left-1/2 transform -translate-x-1/2 ${
                          pos.id === 'top' ? 'top-1' :
                          pos.id === 'center' ? 'top-1/2 -translate-y-1/2' :
                          'bottom-1'
                        }`}
                      />
                    </div>
                    <span className="text-sm">{pos.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
        <div className="flex items-start space-x-3">
          <Type className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-blue-500 font-semibold mb-1">Subtitle Information</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Subtitle settings apply to all video content when available</li>
              <li>• Not all content may have subtitles in your selected language</li>
              <li>• Changes take effect immediately and are saved automatically</li>
              <li>• Use the preview above to see how your settings will look</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};