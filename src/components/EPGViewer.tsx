import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Info } from 'lucide-react';
import { Channel, EPGProgram } from '../types';

interface EPGViewerProps {
  channels: Channel[];
  currentChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
}

export const EPGViewer: React.FC<EPGViewerProps> = ({
  channels,
  currentChannel,
  onChannelSelect
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProgram, setSelectedProgram] = useState<EPGProgram | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    // Generate time slots for the day (every 30 minutes)
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    setTimeSlots(slots);
  }, []);

  // Mock EPG data - in real app, this would come from API
  const generateMockEPG = (channel: Channel): EPGProgram[] => {
    const programs: EPGProgram[] = [];
    const baseDate = new Date(selectedDate);
    
    for (let i = 0; i < 24; i++) {
      const startTime = new Date(baseDate);
      startTime.setHours(i, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(i + 1, 0, 0, 0);
      
      programs.push({
        id: `${channel.id}_${i}`,
        title: `Program ${i + 1}`,
        description: `Description for program ${i + 1} on ${channel.name}`,
        startTime,
        endTime,
        category: channel.category
      });
    }
    
    return programs;
  };

  const isCurrentProgram = (program: EPGProgram) => {
    const now = new Date();
    return now >= program.startTime && now <= program.endTime;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const ProgramCard = ({ program, channel }: { program: EPGProgram; channel: Channel }) => (
    <div 
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
        isCurrentProgram(program) ? 'bg-blue-900/50 border-l-4 border-blue-500' : 'bg-gray-800'
      }`}
      onClick={() => setSelectedProgram(program)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-400">
          {formatTime(program.startTime)} - {formatTime(program.endTime)}
        </span>
        {isCurrentProgram(program) && (
          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
            LIVE
          </span>
        )}
      </div>
      <h4 className="font-semibold text-white mb-1">{program.title}</h4>
      <p className="text-sm text-gray-400 line-clamp-2">{program.description}</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">TV Guide</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-400" size={20} />
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="bg-gray-800 text-white px-3 py-1 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* EPG Grid */}
      <div className="flex-1 overflow-y-auto">
        {channels.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Info className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No channels available</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {channels.slice(0, 9).map(channel => (
                <div key={channel.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  {/* Channel Header */}
                  <div 
                    className={`p-4 cursor-pointer transition-colors ${
                      currentChannel?.id === channel.id ? 'bg-blue-900/50' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => onChannelSelect(channel)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-700">
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
                      <div>
                        <h3 className="font-semibold text-white">{channel.name}</h3>
                        <p className="text-sm text-gray-400">{channel.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Programs */}
                  <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                    {generateMockEPG(channel).map(program => (
                      <ProgramCard key={program.id} program={program} channel={channel} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{selectedProgram.title}</h3>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock size={16} />
                <span>
                  {formatTime(selectedProgram.startTime)} - {formatTime(selectedProgram.endTime)}
                </span>
              </div>
              
              <p className="text-gray-300">{selectedProgram.description}</p>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded">
                  {selectedProgram.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};