import React from 'react';
import { ArrowLeft, Smartphone, Tv, Check, Monitor, Tablet } from 'lucide-react';
import { AppSettings } from '../types';

interface DeviceTypeSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const DeviceTypeSettings: React.FC<DeviceTypeSettingsProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const deviceTypes = [
    {
      id: 'tv' as const,
      name: 'Smart TV / Set-Top Box',
      description: 'Optimized for large screens and remote control navigation',
      icon: Tv,
      features: [
        'Large UI elements for easy navigation',
        'Remote control friendly interface',
        'Optimized for 10-foot viewing distance',
        'Enhanced focus indicators',
        'Simplified navigation patterns'
      ],
      benefits: [
        'Better visibility from across the room',
        'Easier navigation with TV remote',
        'Optimized for living room experience',
        'Reduced eye strain on large displays'
      ],
      recommended: true,
      screenSizes: '32" - 85" and larger',
      viewingDistance: '6-12 feet'
    },
    {
      id: 'mobile' as const,
      name: 'Mobile / Tablet',
      description: 'Optimized for touch screens and portable devices',
      icon: Smartphone,
      features: [
        'Touch-friendly interface elements',
        'Compact layout for small screens',
        'Gesture-based navigation',
        'Mobile-optimized controls',
        'Portrait and landscape support'
      ],
      benefits: [
        'Better touch interaction',
        'Optimized for handheld use',
        'Efficient use of screen space',
        'Mobile-friendly gestures'
      ],
      recommended: false,
      screenSizes: '4" - 13" screens',
      viewingDistance: '1-3 feet'
    }
  ];

  const handleDeviceTypeChange = (deviceType: 'tv' | 'mobile') => {
    onUpdateSettings({ deviceType });
    
    // Also update related settings based on device type
    const relatedSettings: Partial<AppSettings> = {
      deviceType,
      // Adjust grid size based on device type
      gridSize: deviceType === 'tv' ? 'large' : 'medium',
      // Adjust layout mode
      layoutMode: deviceType === 'tv' ? 'grid' : 'list'
    };
    
    onUpdateSettings(relatedSettings);
  };

  const currentDevice = deviceTypes.find(d => d.id === settings.deviceType);

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
          <h1 className="text-4xl font-bold text-yellow-500">Device Type</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-yellow-500 bg-yellow-500/20">
            {React.createElement(currentDevice?.icon || Monitor, {
              size: 20,
              className: 'text-yellow-500'
            })}
            <span className="font-medium text-yellow-500 capitalize">
              Current: {settings.deviceType}
            </span>
          </div>
        </div>
      </div>

      {/* Current Device Info */}
      <div className="border-2 border-yellow-500 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Current Device Configuration</h2>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            {React.createElement(currentDevice?.icon || Monitor, {
              size: 32,
              className: 'text-yellow-500'
            })}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {currentDevice?.name}
            </h3>
            <p className="text-gray-400">
              {currentDevice?.description}
            </p>
            {currentDevice?.recommended && (
              <div className="flex items-center space-x-1 mt-2">
                <Check className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium">Recommended for most users</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Device Type Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {deviceTypes.map((device) => (
          <div
            key={device.id}
            className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
              settings.deviceType === device.id
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-gray-600 hover:border-yellow-500'
            }`}
            onClick={() => handleDeviceTypeChange(device.id)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  settings.deviceType === device.id ? 'bg-yellow-500/20' : 'bg-gray-700'
                }`}>
                  <device.icon 
                    size={24} 
                    className={settings.deviceType === device.id ? 'text-yellow-500' : 'text-gray-400'} 
                  />
                </div>
                <div>
                  <h3 className={`font-bold ${
                    settings.deviceType === device.id ? 'text-yellow-500' : 'text-white'
                  }`}>
                    {device.name}
                  </h3>
                  {settings.deviceType === device.id && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                      SELECTED
                    </span>
                  )}
                </div>
              </div>
              
              {device.recommended && (
                <div className="flex items-center space-x-1">
                  <Check className="text-green-500" size={16} />
                  <span className="text-green-500 text-xs font-medium">RECOMMENDED</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4">{device.description}</p>

            {/* Device Specifications */}
            <div className="mb-4 p-3 bg-gray-900 rounded-lg">
              <h5 className="text-white font-medium text-sm mb-2">Device Specifications:</h5>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Screen Size:</span>
                  <span className="ml-2 text-white">{device.screenSizes}</span>
                </div>
                <div>
                  <span className="text-gray-400">Viewing Distance:</span>
                  <span className="ml-2 text-white">{device.viewingDistance}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Interface Features:</h4>
              <div className="space-y-1">
                {device.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-4">
              <h4 className="text-green-500 font-medium text-sm mb-2">Benefits:</h4>
              <div className="space-y-1">
                {device.benefits.slice(0, 2).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="text-green-500" size={12} />
                    <span className="text-xs text-gray-400">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeviceTypeChange(device.id);
              }}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                settings.deviceType === device.id
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {settings.deviceType === device.id ? 'Currently Selected' : 'Select Device Type'}
            </button>
          </div>
        ))}
      </div>

      {/* Current Settings Impact */}
      <div className="border-2 border-yellow-500 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-yellow-500 mb-4">Current Configuration Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Grid Size</h3>
            <p className="text-gray-400 text-sm capitalize">{settings.gridSize}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Layout Mode</h3>
            <p className="text-gray-400 text-sm capitalize">{settings.layoutMode}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Device Type</h3>
            <p className="text-gray-400 text-sm capitalize">{settings.deviceType}</p>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
        <div className="flex items-start space-x-3">
          <Monitor className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-blue-500 font-semibold mb-1">Device Type Information</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Device type affects interface layout, button sizes, and navigation patterns</li>
              <li>• TV mode is optimized for remote control navigation and large screen viewing</li>
              <li>• Mobile mode provides touch-friendly controls and compact layouts</li>
              <li>• Changes take effect immediately and adjust related settings automatically</li>
              <li>• You can change this setting anytime based on your current device</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};