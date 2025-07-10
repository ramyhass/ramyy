import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationProps} from '../types';
import {COLORS} from '../utils/constants';

const SeriesScreen: React.FC<NavigationProps> = ({navigation}) => {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Drama', 'Comedy', 'Crime', 'Fantasy', 'Sci-Fi', 'Thriller'];
  
  const series = [
    {id: 1, title: 'Breaking Bad', year: '2008-2013', genre: 'Crime', rating: 9.5, seasons: 5},
    {id: 2, title: 'Game of Thrones', year: '2011-2019', genre: 'Fantasy', rating: 9.2, seasons: 8},
    {id: 3, title: 'Stranger Things', year: '2016-2022', genre: 'Sci-Fi', rating: 8.7, seasons: 4},
    {id: 4, title: 'The Crown', year: '2016-2023', genre: 'Drama', rating: 8.6, seasons: 6},
    {id: 5, title: 'Better Call Saul', year: '2015-2022', genre: 'Crime', rating: 8.8, seasons: 6},
    {id: 6, title: 'The Office', year: '2005-2013', genre: 'Comedy', rating: 8.9, seasons: 9},
  ];

  const filteredSeries = selectedGenre === 'All' 
    ? series 
    : series.filter(show => show.genre === selectedGenre);

  const renderSeries = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.seriesCard}>
      <View style={styles.seriesPoster}>
        <Text style={styles.seriesInitial}>{item.title.charAt(0)}</Text>
        <View style={styles.ratingBadge}>
          <Icon name="star" size={12} color={COLORS.primary} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.seasonsBadge}>
          <Icon name="tv" size={12} color={COLORS.primary} />
          <Text style={styles.seasonsText}>{item.seasons}S</Text>
        </View>
      </View>
      <View style={styles.seriesInfo}>
        <Text style={styles.seriesTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.seriesMeta}>
          <Text style={styles.seriesYear}>{item.year}</Text>
          <Text style={styles.seriesGenre}>{item.genre}</Text>
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
          <Text style={styles.headerTitle}>TV Series</Text>
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

      {/* Series Grid */}
      <FlatList
        data={filteredSeries}
        renderItem={renderSeries}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.seriesList}
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
  seriesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  seriesCard: {
    flex: 1,
    margin: 5,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  seriesPoster: {
    aspectRatio: 3 / 4,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  seriesInitial: {
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
  seasonsBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  seasonsText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  seriesInfo: {
    padding: 8,
  },
  seriesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  seriesMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seriesYear: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  seriesGenre: {
    fontSize: 10,
    color: COLORS.primary,
  },
});

export default SeriesScreen;