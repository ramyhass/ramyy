import React, { useState } from 'react';
import { ArrowLeft, Play, Star, Calendar, Tv } from 'lucide-react';
import { useIPTVPlayer } from '../hooks/useIPTVPlayer';

interface SeriesProps {
  onBack: () => void;
}

export const Series: React.FC<SeriesProps> = ({ onBack }) => {
  const { settings } = useIPTVPlayer();
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Drama', 'Comedy', 'Crime', 'Fantasy', 'Sci-Fi', 'Thriller'];
  
  // Filter out hidden categories
  const visibleGenres = genres.filter(genre => {
    if (genre === 'All') return true;
    return !settings.hiddenCategories?.series?.includes(genre);
  });
  
  const series = [
    { id: 1, title: 'Breaking Bad', year: '2008-2013', genre: 'Crime', rating: 9.5, seasons: 5, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 2, title: 'Game of Thrones', year: '2011-2019', genre: 'Fantasy', rating: 9.2, seasons: 8, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 3, title: 'Stranger Things', year: '2016-2022', genre: 'Sci-Fi', rating: 8.7, seasons: 4, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 4, title: 'The Crown', year: '2016-2023', genre: 'Drama', rating: 8.6, seasons: 6, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 5, title: 'Better Call Saul', year: '2015-2022', genre: 'Crime', rating: 8.8, seasons: 6, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 6, title: 'The Office', year: '2005-2013', genre: 'Comedy', rating: 8.9, seasons: 9, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 7, title: 'House of Cards', year: '2013-2018', genre: 'Drama', rating: 8.7, seasons: 6, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 8, title: 'The Mandalorian', year: '2019-2023', genre: 'Sci-Fi', rating: 8.5, seasons: 3, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 9, title: 'Ozark', year: '2017-2022', genre: 'Crime', rating: 8.4, seasons: 4, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 10, title: 'The Witcher', year: '2019-2023', genre: 'Fantasy', rating: 8.2, seasons: 3, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 11, title: 'Wednesday', year: '2022', genre: 'Comedy', rating: 8.1, seasons: 1, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 12, title: 'The Boys', year: '2019-2024', genre: 'Thriller', rating: 8.7, seasons: 4, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ];

  const filteredSeries = selectedGenre === 'All' 
    ? series 
    : series.filter(show => show.genre === selectedGenre);

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
          <h1 className="text-3xl font-bold text-yellow-500">TV Series</h1>
        </div>
      </div>

      {/* Genres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {visibleGenres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
              selectedGenre === genre
                ? 'bg-yellow-500 text-black border-yellow-500'
                : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Series Grid */}
      <div className={`overflow-y-auto max-h-[calc(100vh-250px)] ${
        settings.layoutMode === 'list' 
          ? 'space-y-3' 
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
      }`}>
        {filteredSeries.map(show => (
          settings.layoutMode === 'list' ? (
            <div
              key={show.id}
              className="flex items-center p-4 border border-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 cursor-pointer group"
            >
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                <img
                  src={show.poster}
                  alt={show.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-yellow-500 group-hover:text-black">{show.title}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-gray-400 group-hover:text-black/70 text-sm flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {show.year}
                  </p>
                  <span className="text-yellow-500 group-hover:text-black text-sm">{show.genre}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500 group-hover:text-black" size={14} />
                    <span className="text-yellow-500 group-hover:text-black text-sm font-bold">{show.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tv className="text-yellow-500 group-hover:text-black" size={14} />
                    <span className="text-yellow-500 group-hover:text-black text-sm font-bold">{show.seasons}S</span>
                  </div>
                </div>
              </div>
              
              <Play className="text-yellow-500 group-hover:text-black" size={24} />
            </div>
          ) : (
            <div
              key={show.id}
              className="border border-yellow-500 rounded-lg overflow-hidden hover:border-yellow-400 transition-all duration-300 cursor-pointer group"
            >
              <div className="aspect-[3/4] bg-gray-800 relative overflow-hidden">
                <img
                  src={show.poster}
                  alt={show.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Rating */}
                <div className="absolute top-2 left-2 bg-black/70 rounded px-2 py-1 flex items-center space-x-1">
                  <Star className="text-yellow-500" size={12} />
                  <span className="text-white text-xs font-bold">{show.rating}</span>
                </div>

                {/* Seasons */}
                <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 flex items-center space-x-1">
                  <Tv className="text-yellow-500" size={12} />
                  <span className="text-white text-xs font-bold">{show.seasons}S</span>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm truncate">{show.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-400 text-xs flex items-center">
                    <Calendar size={10} className="mr-1" />
                    {show.year}
                  </p>
                  <span className="text-yellow-500 text-xs">{show.genre}</span>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};