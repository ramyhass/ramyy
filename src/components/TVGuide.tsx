import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Info } from 'lucide-react';
import { Channel } from '../types';

interface TVGuideProps {
  channels: Channel[];
  currentChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  onBack: () => void;
}

interface Program {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: string;
}

export const TVGuide: React.FC<TVGuideProps> = ({
  channels,
  currentChannel,
  onChannelSelect,
  onBack
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Generate mock EPG data
  const generatePrograms = (channel: Channel): Program[] => {
    const programs: Program[] = [];
    const baseDate = new Date(selectedDate);
    
    for (let i = 0; i < 24; i++) {
      const startHour = i.toString().padStart(2, '0');
      const endHour = (i + 1).toString().padStart(2, '0');
      
      programs.push({
        id: `${channel.id}_${i}`,
        title: `${channel.name} Program ${i + 1}`,
        description: `Description for program ${i + 1} on ${channel.name}`,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        category: channel.category
      });
    }
    
    return programs;
  };

  const isCurrentProgram = (program: Program) => {
    const now = new Date();
    const currentHour = now.getHours();
    const programHour = parseInt(program.startTime.split(':')[0]);
    
    return currentHour === programHour && selectedDate === new Date().toISOString().split('T')[0];
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
          <h1 className="text-3xl font-bold text-yellow-500">TV Guide</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="text-yellow-500" size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-yellow-500 focus:border-yellow-400 focus:outline-none"
          />
        </div>
      </div>

      {/* EPG Grid */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {channels.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Info className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No channels available</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {channels.slice(0, 9).map(channel => (
              <div key={channel.id} className="border border-yellow-500 rounded-lg overflow-hidden">
                {/* Channel Header */}
                <div 
                  className={`p-4 cursor-pointer transition-colors border-b border-yellow-500 ${
                    currentChannel?.id === channel.id ? 'bg-yellow-500 text-black' : 'hover:bg-yellow-500 hover:text-black'
                  }`}
                  onClick={() => onChannelSelect(channel)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
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
                      <h3 className="font-semibold text-yellow-500">{channel.name}</h3>
                      <p className="text-sm text-gray-400">{channel.category}</p>
                    </div>
                  </div>
                </div>

                {/* Programs */}
                <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                  {generatePrograms(channel).map(program => (
                    <div
                      key={program.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-yellow-500 hover:text-black group ${
                        isCurrentProgram(program) ? 'bg-yellow-500 text-black' : 'bg-gray-800'
                      }`}
                      onClick={() => setSelectedProgram(program)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-500 group-hover:text-black">
                          {program.startTime} - {program.endTime}
                        </span>
                        {isCurrentProgram(program) && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                            LIVE
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-white group-hover:text-black mb-1">{program.title}</h4>
                      <p className="text-sm text-gray-400 group-hover:text-black/70 line-clamp-2">{program.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-500">{selectedProgram.title}</h3>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock size={16} />
                <span>
                  {selectedProgram.startTime} - {selectedProgram.endTime}
                </span>
              </div>
              
              <p className="text-gray-300">{selectedProgram.description}</p>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded">
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