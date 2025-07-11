import React from 'react';
import { ArrowLeft, Clock, Check } from 'lucide-react';
import { AppSettings } from '../types';

interface TimeFormatSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const TimeFormatSettings: React.FC<TimeFormatSettingsProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const timeFormats = [
    {
      id: '12h' as const,
      name: '12-Hour Format',
      description: 'Display time with AM/PM indicator',
      example: '2:30 PM',
      details: 'Standard format used in the United States and other countries'
    },
    {
      id: '24h' as const,
      name: '24-Hour Format',
      description: 'Display time in military/international format',
      example: '14:30',
      details: 'International standard format used worldwide'
    }
  ];

  const handleFormatChange = (format: '12h' | '24h') => {
    onUpdateSettings({ timeFormat: format });
  };

  const getCurrentTimeExample = (format: '12h' | '24h') => {
    const now = new Date();
    if (format === '24h') {
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
          <h1 className="text-4xl font-bold text-yellow-500">Time Format</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-yellow-500 bg-yellow-500/20">
            <Clock className="text-yellow-500" size={20} />
            <span className="font-medium text-yellow-500">
              Current: {getCurrentTimeExample(settings.timeFormat)}
            </span>
          </div>
        </div>
      </div>

      {/* Current Format Display */}
      <div className="border-2 border-yellow-500 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Current Time Format</h2>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-4">
              {getCurrentTimeExample(settings.timeFormat)}
            </div>
            <p className="text-gray-400 text-lg">
              {timeFormats.find(f => f.id === settings.timeFormat)?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Format Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {timeFormats.map((format) => (
          <div
            key={format.id}
            className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
              settings.timeFormat === format.id
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-gray-600 hover:border-yellow-500'
            }`}
            onClick={() => handleFormatChange(format.id)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  settings.timeFormat === format.id ? 'bg-yellow-500/20' : 'bg-gray-700'
                }`}>
                  <Clock 
                    size={24} 
                    className={settings.timeFormat === format.id ? 'text-yellow-500' : 'text-gray-400'} 
                  />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${
                    settings.timeFormat === format.id ? 'text-yellow-500' : 'text-white'
                  }`}>
                    {format.name}
                  </h3>
                  {settings.timeFormat === format.id && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                      SELECTED
                    </span>
                  )}
                </div>
              </div>
              
              {settings.timeFormat === format.id && (
                <Check className="text-yellow-500" size={24} />
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4">{format.description}</p>

            {/* Example */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Example:</p>
                <div className="text-2xl font-bold text-white">
                  {format.example}
                </div>
              </div>
            </div>

            {/* Details */}
            <p className="text-gray-500 text-xs mb-4">{format.details}</p>

            {/* Live Preview */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">Live Preview:</p>
                <div className="text-lg font-semibold text-white">
                  {getCurrentTimeExample(format.id)}
                </div>
              </div>
            </div>

            {/* Selection Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFormatChange(format.id);
              }}
              className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                settings.timeFormat === format.id
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {settings.timeFormat === format.id ? 'Currently Selected' : 'Select Format'}
            </button>
          </div>
        ))}
      </div>

      {/* Usage Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Where Time Format is Used */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-500 mb-4">Where This Applies</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Main interface clock display</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">TV Guide program times</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Catch-up TV schedules</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Recording schedules</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">System notifications</span>
            </div>
          </div>
        </div>

        {/* Regional Information */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-500 mb-4">Regional Usage</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">12-Hour Format</h3>
              <p className="text-gray-400 text-sm">
                Commonly used in the United States, Canada, Australia, New Zealand, 
                Philippines, and several other countries.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">24-Hour Format</h3>
              <p className="text-gray-400 text-sm">
                International standard used in most countries worldwide, military, 
                aviation, computing, and scientific contexts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
        <div className="flex items-start space-x-3">
          <Clock className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-blue-500 font-semibold mb-1">Time Format Information</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Changes take effect immediately across the entire application</li>
              <li>• Your preference is saved and will persist between sessions</li>
              <li>• This setting only affects time display, not functionality</li>
              <li>• All times are displayed in your local timezone</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};