import React, { useState } from 'react';
import { ArrowLeft, Play, Star, Calendar } from 'lucide-react';
import { useIPTVPlayer } from '../hooks/useIPTVPlayer';

interface MoviesProps {
  onBack: () => void;
}

export const Movies: React.FC<MoviesProps> = ({ onBack }) => {
  const { settings } = useIPTVPlayer();
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller'];
  
  // Filter out hidden categories
  const visibleGenres = genres.filter(genre => {
    if (genre === 'All') return true;
    return !settings.hiddenCategories?.vod?.includes(genre);
  });
  
  const movies = [
    { id: 1, title: 'The Dark Knight', year: '2008', genre: 'Action', rating: 9.0, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 2, title: 'Inception', year: '2010', genre: 'Sci-Fi', rating: 8.8, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 3, title: 'Interstellar', year: '2014', genre: 'Sci-Fi', rating: 8.6, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 4, title: 'The Joker', year: '2019', genre: 'Drama', rating: 8.4, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 5, title: 'Tenet', year: '2020', genre: 'Action', rating: 7.3, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 6, title: 'Dune', year: '2021', genre: 'Sci-Fi', rating: 8.0, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 7, title: 'Top Gun: Maverick', year: '2022', genre: 'Action', rating: 8.3, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 8, title: 'Avatar: The Way of Water', year: '2022', genre: 'Sci-Fi', rating: 7.6, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 9, title: 'Black Panther', year: '2018', genre: 'Action', rating: 7.3, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 10, title: 'Spider-Man: No Way Home', year: '2021', genre: 'Action', rating: 8.2, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 11, title: 'The Batman', year: '2022', genre: 'Action', rating: 7.8, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 12, title: 'Doctor Strange', year: '2022', genre: 'Action', rating: 6.9, poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ];

  const filteredMovies = selectedGenre === 'All' 
    ? movies 
    : movies.filter(movie => movie.genre === selectedGenre);

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
          <h1 className="text-3xl font-bold text-yellow-500">Movies</h1>
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

      {/* Movies Grid */}
      <div className={`overflow-y-auto max-h-[calc(100vh-250px)] ${
        settings.layoutMode === 'list' 
          ? 'space-y-3' 
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
      }`}>
        {filteredMovies.map(movie => (
          settings.layoutMode === 'list' ? (
            <div
              key={movie.id}
              className="flex items-center p-4 border border-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 cursor-pointer group"
            >
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-yellow-500 group-hover:text-black">{movie.title}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-gray-400 group-hover:text-black/70 text-sm flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {movie.year}
                  </p>
                  <span className="text-yellow-500 group-hover:text-black text-sm">{movie.genre}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500 group-hover:text-black" size={14} />
                    <span className="text-yellow-500 group-hover:text-black text-sm font-bold">{movie.rating}</span>
                  </div>
                </div>
              </div>
              
              <Play className="text-yellow-500 group-hover:text-black" size={24} />
            </div>
          ) : (
            <div
              key={movie.id}
              className="border border-yellow-500 rounded-lg overflow-hidden hover:border-yellow-400 transition-all duration-300 cursor-pointer group"
            >
              <div className="aspect-[3/4] bg-gray-800 relative overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Rating */}
                <div className="absolute top-2 left-2 bg-black/70 rounded px-2 py-1 flex items-center space-x-1">
                  <Star className="text-yellow-500" size={12} />
                  <span className="text-white text-xs font-bold">{movie.rating}</span>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-400 text-xs flex items-center">
                    <Calendar size={10} className="mr-1" />
                    {movie.year}
                  </p>
                  <span className="text-yellow-500 text-xs">{movie.genre}</span>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};