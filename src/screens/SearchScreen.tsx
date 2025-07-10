import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationProps} from '../types';
import {useIPTV} from '../context/IPTVContext';
import {COLORS} from '../utils/constants';

const SearchScreen: React.FC<NavigationProps> = ({navigation}) => {
  const {state} = useIPTV();
  const {channels} = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'channels' | 'movies' | 'series'>('channels');

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockMovies = [
    {id: 1, title: 'The Dark Knight', year: '2008', genre: 'Action'},
    {id: 2, title: 'Inception', year: '2010', genre: 'Sci-Fi'},
    {id: 3, title: 'Interstellar', year: '2014', genre: 'Sci-Fi'},
  ].filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockSeries = [
    {id: 1, title: 'Breaking Bad', year: '2008-2013', genre: 'Crime'},
    {id: 2, title: 'Game of Thrones', year: '2011-2019', genre: 'Fantasy'},
    {id: 3, title: 'Stranger Things', year: '2016-2022', genre: 'Sci-Fi'},
  ].filter(series => 
    series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    series.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChannel = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigation.navigate('Player', {channel: item})}>
      <Image source={{uri: item.logo}} style={styles.channelImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.name}</Text>
        <Text style={styles.resultSubtitle}>{item.category}</Text>
      </View>
      <Icon name="play-arrow" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  );

  const renderMovie = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.resultCard}>
      <View style={styles.moviePoster}>
        <Text style={styles.movieInitial}>{item.title.charAt(0)}</Text>
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultSubtitle}>{item.year} • {item.genre}</Text>
      </View>
      <Icon name="play-arrow" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  );

  const renderSeries = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.resultCard}>
      <View style={styles.seriesPoster}>
        <Text style={styles.seriesInitial}>{item.title.charAt(0)}</Text>
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultSubtitle}>{item.year} • {item.genre}</Text>
      </View>
      <Icon name="play-arrow" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  );

  const getResultsData = () => {
    switch (searchType) {
      case 'channels':
        return filteredChannels;
      case 'movies':
        return mockMovies;
      case 'series':
        return mockSeries;
      default:
        return [];
    }
  };

  const renderResult = ({item}: {item: any}) => {
    switch (searchType) {
      case 'channels':
        return renderChannel({item});
      case 'movies':
        return renderMovie({item});
      case 'series':
        return renderSeries({item});
      default:
        return null;
    }
  };

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
          <Text style={styles.headerTitle}>Global Search</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search channels, movies, series..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Search Type Tabs */}
      <View style={styles.tabsContainer}>
        {(['channels', 'movies', 'series'] as const).map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.tabButton,
              searchType === type && styles.activeTabButton,
            ]}
            onPress={() => setSearchType(type)}>
            <Text
              style={[
                styles.tabButtonText,
                searchType === type && styles.activeTabButtonText,
              ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {searchQuery === '' ? (
          <View style={styles.emptyState}>
            <Icon name="search" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateText}>Start typing to search...</Text>
          </View>
        ) : (
          <FlatList
            data={getResultsData()}
            renderItem={renderResult}
            keyExtractor={item => `${searchType}-${item.id}`}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="search-off" size={64} color={COLORS.textSecondary} />
                <Text style={styles.emptyStateText}>No results found</Text>
              </View>
            }
          />
        )}
      </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 10,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: COLORS.background,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 15,
    marginBottom: 10,
  },
  channelImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  moviePoster: {
    width: 60,
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seriesPoster: {
    width: 60,
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  seriesInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 15,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: 20,
  },
});

export default SearchScreen;