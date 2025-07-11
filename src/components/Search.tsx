import React, { useState } from 'react';
import { ArrowLeft, Search as SearchIcon, Play, Heart } from 'lucide-react';
import { Channel } from '../types';

interface SearchProps {
  channels: Channel[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChannelSelect: (channel: Channel) => void;
  onBack: () => void;
}

export const Search: React.FC<SearchProps> = ({
  channels,
  searchQuery,
  onSearchChange,
  onChannelSelect,
  onBack
}) => {
  const [searchType, setSearchType] = useState<'channels' | 'movies' | 'series'>('channels');

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockMovies = [
    { id: 1, title: 'The Dark Knight', year: '2008', genre: 'Action' },
    { id: 2, title: 'Inception', year: '2010', genre: 'Sci-Fi' },
    { id: 3, title: 'Interstellar', year: '2014', genre: 'Sci-Fi' }
  ].filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockSeries = [
    { id: 1, title: 'Breaking Bad', year: '2008-2013', genre: 'Crime' },
    { id: 2, title: 'Game of Thrones', year: '2011-2019', genre: 'Fantasy' },
    { id: 3, title: 'Stranger Things', year: '2016-2022', genre: 'Sci-Fi' }
  ].filter(series => 
    series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    series.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-yellow-500">Global Search</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500" size={20} />
        <input
          type="text"
          placeholder="Search channels, movies, series..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-900 text-white rounded-lg border-2 border-yellow-500 focus:border-yellow-400 focus:outline-none text-lg"
        />
      </div>

      {/* Search Type Tabs */}
      <div className="flex space-x-2 mb-6">
        {(['channels', 'movies', 'series'] as const).map(type => (
          <button
            key={type}
            onClick={() => setSearchType(type)}
            className={`px-4 py-2 rounded-full border-2 transition-all duration-300 capitalize ${
              searchType === type
                ? 'bg-yellow-500 text-black border-yellow-500'
                : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
        {searchQuery === '' ? (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-400 text-lg">Start typing to search...</p>
          </div>
        ) : (
          <>
            {/* Channels Results */}
            {searchType === 'channels' && (
              <div className="space-y-3">
                {filteredChannels.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No channels found</p>
                ) : (
                  filteredChannels.map(channel => (
                    <div
                      key={channel.id}
                      className="flex items-center p-4 border border-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 cursor-pointer group"
                      onClick={() => onChannelSelect(channel)}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                        {channel.logo ? (
                          <img 
                            src={channel.logo} 
                            alt={channel.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-400 group-hover:text-black">
                              {channel.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-yellow-500 group-hover:text-black">{channel.name}</h3>
                        <p className="text-gray-400 group-hover:text-black/70">{channel.category}</p>
                      </div>
                      
                      <Play className="text-yellow-500 group-hover:text-black" size={24} />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Movies Results */}
            {searchType === 'movies' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {mockMovies.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 col-span-full">No movies found</p>
                ) : (
                  mockMovies.map(movie => (
                    <div
                      key={movie.id}
                      className="border border-yellow-500 rounded-lg p-4 hover:bg-yellow-500 hover:text-black transition-all duration-300 cursor-pointer group"
                    >
                      <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-400 group-hover:text-black">
                            {movie.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-yellow-500 group-hover:text-black text-sm truncate">{movie.title}</h3>
                      <p className="text-gray-400 group-hover:text-black/70 text-xs">{movie.year} • {movie.genre}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Series Results */}
            {searchType === 'series' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {mockSeries.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 col-span-full">No series found</p>
                ) : (
                  mockSeries.map(series => (
                    <div
                      key={series.id}
                      className="border border-yellow-500 rounded-lg p-4 hover:bg-yellow-500 hover:text-black transition-all duration-300 cursor-pointer group"
                    >
                      <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-400 group-hover:text-black">
                            {series.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-yellow-500 group-hover:text-black text-sm truncate">{series.title}</h3>
                      <p className="text-gray-400 group-hover:text-black/70 text-xs">{series.year} • {series.genre}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};