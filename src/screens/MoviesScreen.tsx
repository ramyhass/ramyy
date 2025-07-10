import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationProps} from '../types';
import {COLORS} from '../utils/constants';

const MoviesScreen: React.FC<NavigationProps> = ({navigation}) => {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller'];
  
  const movies = [
    {id: 1, title: 'The Dark Knight', year: '2008', genre: 'Action', rating: 9.0},
    {id: 2, title: 'Inception', year: '2010', genre: 'Sci-Fi', rating: 8.8},
    {id: 3, title: 'Interstellar', year: '2014', genre: 'Sci-Fi', rating: 8.6},
    {id: 4, title: 'The Joker', year: '2019', genre: 'Drama', rating: 8.4},
    {id: 5, title: 'Tenet', year: '2020', genre: 'Action', rating: 7.3},
    {id: 6, title: 'Dune', year: '2021', genre: 'Sci-Fi', rating: 8.0},
    {id: 7, title: 'Top Gun: Maverick', year: '2022', genre: 'Action', rating: 8.3},
    {id: 8, title: 'Avatar: The Way of Water', year: '2022', genre: 'Sci-Fi', rating: 7.6},
  ];

  const filteredMovies = selectedGenre === 'All' 
    ? movies 
    : movies.filter(movie => movie.genre === selectedGenre);

  const renderMovie = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.movieCard}>
      <View style={styles.moviePoster}>
        <Text style={styles.movieInitial}>{item.title.charAt(0)}</Text>
        <View style={styles.ratingBadge}>
          <Icon name="star" size={12} color={COLORS.primary} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.movieMeta}>
          <Text style={styles.movieYear}>{item.year}</Text>
          <Text style={styles.movieGenre}>{item.genre}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Movies</Text>
        </View>
      </View>

      {/* Genres */}
      <FlatList
        data={genres}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.genreButton,
              selectedGenre === item && styles.selectedGenreButton,
            ]}
            onPress={() => setSelectedGenre(item)}>
            <Text
              style={[
                styles.genreButtonText,
                selectedGenre === item && styles.selectedGenreButtonText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genresList}
      />

      {/* Movies Grid */}
      <FlatList
        data={filteredMovies}
        renderItem={renderMovie}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.moviesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  genresList: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  genreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 10,
  },
  selectedGenreButton: {
    backgroundColor: COLORS.primary,
  },
  genreButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  selectedGenreButtonText: {
    color: COLORS.background,
  },
  moviesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  movieCard: {
    flex: 1,
    margin: 5,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  moviePoster: {
    aspectRatio: 3 / 4,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  movieInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  movieInfo: {
    padding: 8,
  },
  movieTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieYear: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  movieGenre: {
    fontSize: 10,
    color: COLORS.primary,
  },
});

export default MoviesScreen;