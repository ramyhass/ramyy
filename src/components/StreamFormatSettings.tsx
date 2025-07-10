import React, { useState } from 'react';
import { ArrowLeft, Monitor, Wifi, Signal, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { AppSettings } from '../types';

interface StreamFormatSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const StreamFormatSettings: React.FC<StreamFormatSettingsProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const [selectedFormat, setSelectedFormat] = useState(settings.streamFormat);

  const streamFormats = [
    {
      id: 'hls' as const,
      name: 'HLS (HTTP Live Streaming)',
      description: 'Adaptive bitrate streaming protocol developed by Apple',
      icon: Wifi,
      features: [
        'Adaptive bitrate streaming',
        'Better buffering control',
        'Wide device compatibility',
        'Automatic quality adjustment',
        'Lower latency on modern devices'
      ],
      pros: [
        'Excellent compatibility across devices',
        'Adaptive quality based on connection',
        'Better for mobile devices',
        'Reduced buffering issues',
        'Industry standard for streaming'
      ],
      cons: [
        'Slightly higher latency than MPEG-TS',
        'May use more bandwidth initially',
        'Requires modern player support'
      ],
      recommended: true,
      technicalInfo: {
        protocol: 'HTTP-based',
        container: 'TS segments in M3U8 playlist',
        latency: '2-6 seconds',
        bandwidth: 'Adaptive (auto-adjusts)'
      }
    },
    {
      id: 'mpeg-ts' as const,
      name: 'MPEG-TS (Transport Stream)',
      description: 'Traditional broadcast streaming format for live television',
      icon: Signal,
      features: [
        'Low latency streaming',
        'Direct stream access',
        'Traditional broadcast format',
        'Minimal processing overhead',
        'Real-time transmission'
      ],
      pros: [
        'Lower latency for live content',
        'Direct stream without segmentation',
        'Less processing required',
        'Traditional IPTV standard',
        'Better for real-time applications'
      ],
      cons: [
        'Fixed bitrate (no adaptation)',
        'More sensitive to network issues',
        'May cause more buffering',
        'Limited mobile compatibility'
      ],
      recommended: false,
      technicalInfo: {
        protocol: 'UDP/TCP direct stream',
        container: 'MPEG Transport Stream',
        latency: '0.5-2 seconds',
        bandwidth: 'Fixed bitrate'
      }
    }
  ];

  const handleFormatSelect = (formatId: 'hls' | 'mpeg-ts') => {
    setSelectedFormat(formatId);
    onUpdateSettings({ streamFormat: formatId });
  };

  const currentFormat = streamFormats.find(f => f.id === selectedFormat);

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
          <h1 className="text-4xl font-bold text-yellow-500">Live Stream Format</h1>
        </div>
      </div>

      {/* Current Format Info */}
      <div className="mb-8 p-6 border-2 border-yellow-500 rounded-2xl">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Current Format</h2>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            {React.createElement(currentFormat?.icon || Monitor, {
              size: 32,
              className: 'text-yellow-500'
            })}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {currentFormat?.name}
            </h3>
            <p className="text-gray-400">
              {currentFormat?.description}
            </p>
            {currentFormat?.recommended && (
              <div className="flex items-center space-x-1 mt-2">
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium">Recommended</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Format Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {streamFormats.map((format) => (
          <div
            key={format.id}
            className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
              selectedFormat === format.id
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-gray-600 hover:border-yellow-500'
            }`}
            onClick={() => handleFormatSelect(format.id)}
          >
            {/* Format Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedFormat === format.id ? 'bg-yellow-500/20' : 'bg-gray-700'
                }`}>
                  <format.icon 
                    size={24} 
                    className={selectedFormat === format.id ? 'text-yellow-500' : 'text-gray-400'} 
                  />
                </div>
                <div>
                  <h3 className={`font-bold ${
                    selectedFormat === format.id ? 'text-yellow-500' : 'text-white'
                  }`}>
                    {format.name}
                  </h3>
                  {selectedFormat === format.id && (
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                      SELECTED
                    </span>
                  )}
                </div>
              </div>
              
              {format.recommended && (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-green-500 text-xs font-medium">RECOMMENDED</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4">{format.description}</p>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Key Features:</h4>
              <div className="flex flex-wrap gap-1">
                {format.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Info */}
            <div className="mb-4 p-3 bg-gray-900 rounded-lg">
              <h5 className="text-white font-medium text-sm mb-2">Technical Specifications:</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Protocol:</span>
                  <span className="ml-1 text-white">{format.technicalInfo.protocol}</span>
                </div>
                <div>
                  <span className="text-gray-400">Container:</span>
                  <span className="ml-1 text-white">{format.technicalInfo.container}</span>
                </div>
                <div>
                  <span className="text-gray-400">Latency:</span>
                  <span className="ml-1 text-white">{format.technicalInfo.latency}</span>
                </div>
                <div>
                  <span className="text-gray-400">Bandwidth:</span>
                  <span className="ml-1 text-white">{format.technicalInfo.bandwidth}</span>
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="space-y-3">
              <div>
                <h5 className="text-green-500 font-medium text-sm mb-1">Advantages:</h5>
                <ul className="text-xs text-gray-400 space-y-1">
                  {format.pros.slice(0, 3).map((pro, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <span className="text-green-500">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-red-500 font-medium text-sm mb-1">Considerations:</h5>
                <ul className="text-xs text-gray-400 space-y-1">
                  {format.cons.slice(0, 2).map((con, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <span className="text-red-500">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Selection Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFormatSelect(format.id);
              }}
              className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                selectedFormat === format.id
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {selectedFormat === format.id ? 'Currently Selected' : 'Select Format'}
            </button>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Tips */}
        <div className="p-6 border-2 border-yellow-500 rounded-2xl">
          <h2 className="text-xl font-bold text-yellow-500 mb-4">Performance Tips</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-white font-medium">For Mobile Devices</p>
                <p className="text-gray-400">HLS is recommended for better compatibility and adaptive streaming</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-white font-medium">For Low Latency</p>
                <p className="text-gray-400">MPEG-TS provides lower latency for real-time content</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-white font-medium">For Unstable Networks</p>
                <p className="text-gray-400">HLS adapts better to changing network conditions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility Info */}
        <div className="p-6 border-2 border-yellow-500 rounded-2xl">
          <h2 className="text-xl font-bold text-yellow-500 mb-4">Compatibility</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">HLS Support:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">iOS/Safari</span>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Android</span>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Chrome</span>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Firefox</span>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Smart TVs</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">MPEG-TS Support:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">VLC Player</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Desktop Apps</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Set-top Boxes</span>
                <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">Limited Mobile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning for MPEG-TS */}
      {selectedFormat === 'mpeg-ts' && (
        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-orange-500 font-semibold mb-1">MPEG-TS Selected</h4>
              <p className="text-sm text-gray-300">
                You've selected MPEG-TS format. This provides lower latency but may have compatibility issues on some devices, 
                especially mobile browsers. Consider switching to HLS if you experience playback problems.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};