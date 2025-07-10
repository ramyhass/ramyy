import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationProps} from '../types';
import {useIPTV} from '../context/IPTVContext';
import {COLORS} from '../utils/constants';

const {width} = Dimensions.get('window');

const MainScreen: React.FC<NavigationProps> = ({navigation}) => {
  const {state, dispatch} = useIPTV();
  const {channels, favorites, currentChannel, userInfo} = state;

  const favoriteChannels = channels.filter(ch => favorites.includes(ch.id));

  const navigationButtons = [
    {id: 'LiveTV', label: 'Live TV', icon: 'live-tv'},
    {id: 'Movies', label: 'Movies', icon: 'movie'},
    {id: 'Series', label: 'Series', icon: 'tv'},
    {id: 'Catchup', label: 'Catchup', icon: 'history'},
    {id: 'Search', label: 'Search', icon: 'search'},
    {id: 'TVGuide', label: 'TV Guide', icon: 'guide'},
    {id: 'Settings', label: 'Settings', icon: 'settings'},
  ];

  const recentMovies = [
    {id: 1, title: 'The Dark Knight', year: '2008'},
    {id: 2, title: 'Inception', year: '2010'},
    {id: 3, title: 'Interstellar', year: '2014'},
    {id: 4, title: 'Tenet', year: '2020'},
    {id: 5, title: 'Dune', year: '2021'},
    {id: 6, title: 'Top Gun: Maverick', year: '2022'},
  ];

  const getCurrentTime = () => {
    const now = new Date();
    return state.settings.timeFormat === '24h'
      ? now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})
      : now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true});
  };

  const renderFavoriteChannel = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.favoriteChannel}
      onPress={() => {
        dispatch({type: 'SET_CURRENT_CHANNEL', payload: item});
        navigation.navigate('Player', {channel: item});
      }}>
      <Image source={{uri: item.logo}} style={styles.favoriteChannelLogo} />
      <Text style={styles.favoriteChannelName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderMovie = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.movieCard}>
      <View style={styles.moviePoster}>
        <Text style={styles.movieTitle}>{item.title.charAt(0)}</Text>
      </View>
      <Text style={styles.movieTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.movieYear}>{item.year}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
            }}
            style={styles.headerLogo}
          />
          <Text style={styles.headerTitle}>LEOIPTV</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="account-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.timeContainer}>
            <Icon name="access-time" size={24} color={COLORS.primary} />
            <Text style={styles.timeText}>{getCurrentTime()}</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Watch Now Section */}
        <View style={styles.watchNowSection}>
          <Text style={styles.sectionTitle}>WATCH NOW</Text>
          <View style={styles.watchNowCard}>
            {currentChannel ? (
              <View style={styles.currentChannelInfo}>
                <Image
                  source={{uri: currentChannel.logo}}
                  style={styles.currentChannelLogo}
                />
                <Text style={styles.currentChannelName}>
                  {currentChannel.name}
                </Text>
                <Text style={styles.currentChannelCategory}>
                  {currentChannel.category}
                </Text>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() =>
                    navigation.navigate('Player', {channel: currentChannel})
                  }>
                  <Icon name="play-arrow" size={20} color={COLORS.background} />
                  <Text style={styles.continueButtonText}>Continue Watching</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noChannelInfo}>
                <Icon name="tv" size={64} color={COLORS.textSecondary} />
                <Text style={styles.noChannelText}>No recent media</Text>
                <Text style={styles.noChannelSubtext}>
                  Select a channel to start watching
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Favorite Channels */}
        <View style={styles.favoritesSection}>
          <Text style={styles.sectionTitle}>Favorite Channels</Text>
          {favoriteChannels.length > 0 ? (
            <FlatList
              data={favoriteChannels.slice(0, 6)}
              renderItem={renderFavoriteChannel}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoritesList}
            />
          ) : (
            <View style={styles.noFavoritesContainer}>
              <Icon name="star" size={48} color={COLORS.textSecondary} />
              <Text style={styles.noFavoritesText}>No favorite channels</Text>
              <Text style={styles.noFavoritesSubtext}>
                Mark channels as favorites to see them here
              </Text>
            </View>
          )}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          <View style={styles.navigationGrid}>
            {navigationButtons.map(button => (
              <TouchableOpacity
                key={button.id}
                style={styles.navigationButton}
                onPress={() => navigation.navigate(button.id)}>
                <Icon
                  name={button.icon}
                  size={32}
                  color={COLORS.primary}
                />
                <Text style={styles.navigationButtonText}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Latest Movies */}
        <View style={styles.moviesSection}>
          <Text style={styles.sectionTitle}>Latest Added Movies</Text>
          <FlatList
            data={recentMovies}
            renderItem={renderMovie}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moviesList}
          />
        </View>
      </View>
    </ScrollView>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 5,
  },
  mainContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  watchNowSection: {
    marginBottom: 30,
  },
  watchNowCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentChannelInfo: {
    alignItems: 'center',
  },
  currentChannelLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  currentChannelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  currentChannelCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  continueButtonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  noChannelInfo: {
    alignItems: 'center',
  },
  noChannelText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  noChannelSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  favoritesSection: {
    marginBottom: 30,
  },
  favoritesList: {
    paddingHorizontal: 5,
  },
  favoriteChannel: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 80,
  },
  favoriteChannelLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  favoriteChannelName: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  noFavoritesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noFavoritesText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  noFavoritesSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  navigationSection: {
    marginBottom: 30,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navigationButton: {
    width: (width - 60) / 4,
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  navigationButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  moviesSection: {
    marginBottom: 30,
  },
  moviesList: {
    paddingHorizontal: 5,
  },
  movieCard: {
    width: 120,
    marginHorizontal: 8,
  },
  moviePoster: {
    width: 120,
    height: 160,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  movieTitle: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  movieYear: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default MainScreen;