import React, { useState } from 'react';
import { ArrowLeft, Clock, Calendar, Play } from 'lucide-react';

interface CatchupProps {
  onBack: () => void;
}

export const Catchup: React.FC<CatchupProps> = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedChannel, setSelectedChannel] = useState('All');

  const channels = ['All', 'BBC One', 'CNN', 'Discovery', 'ESPN', 'National Geographic'];
  
  const catchupPrograms = [
    { id: 1, title: 'Morning News', channel: 'BBC One', time: '08:00', duration: '60 min', date: selectedDate },
    { id: 2, title: 'World Report', channel: 'CNN', time: '09:00', duration: '30 min', date: selectedDate },
    { id: 3, title: 'Nature Documentary', channel: 'Discovery', time: '10:00', duration: '45 min', date: selectedDate },
    { id: 4, title: 'Sports Center', channel: 'ESPN', time: '11:00', duration: '60 min', date: selectedDate },
    { id: 5, title: 'Wild Life', channel: 'National Geographic', time: '12:00', duration: '50 min', date: selectedDate },
    { id: 6, title: 'Evening News', channel: 'BBC One', time: '18:00', duration: '30 min', date: selectedDate },
    { id: 7, title: 'Breaking News', channel: 'CNN', time: '19:00', duration: '60 min', date: selectedDate },
    { id: 8, title: 'Ocean Mysteries', channel: 'Discovery', time: '20:00', duration: '45 min', date: selectedDate },
    { id: 9, title: 'Football Tonight', channel: 'ESPN', time: '21:00', duration: '90 min', date: selectedDate },
    { id: 10, title: 'Space Exploration', channel: 'National Geographic', time: '22:00', duration: '60 min', date: selectedDate }
  ];

  const filteredPrograms = selectedChannel === 'All' 
    ? catchupPrograms 
    : catchupPrograms.filter(program => program.channel === selectedChannel);

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
          <h1 className="text-3xl font-bold text-yellow-500">Catch Up TV</h1>
        </div>
        
        <div className="flex items-center space-x-4">
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
      </div>

      {/* Channel Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {channels.map(channel => (
          <button
            key={channel}
            onClick={() => setSelectedChannel(channel)}
            className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
              selectedChannel === channel
                ? 'bg-yellow-500 text-black border-yellow-500'
                : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
            }`}
          >
            {channel}
          </button>
        ))}
      </div>

      {/* Programs List */}
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]">
        {filteredPrograms.map(program => (
          <div
            key={program.id}
            className="border border-yellow-500 rounded-lg p-4 hover:bg-yellow-500 hover:text-black transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-xl font-semibold text-yellow-500 group-hover:text-black">
                    {program.title}
                  </h3>
                  <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded group-hover:bg-black group-hover:text-yellow-500">
                    {program.channel}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-400 group-hover:text-black/70">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{program.time}</span>
                  </div>
                  <span>•</span>
                  <span>{program.duration}</span>
                  <span>•</span>
                  <span>{new Date(program.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <button className="p-3 rounded-full border border-yellow-500 text-yellow-500 hover:bg-black hover:text-yellow-500 group-hover:border-black transition-all duration-300">
                <Play size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};