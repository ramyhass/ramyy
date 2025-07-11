import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationProps} from '../types';
import {useIPTV} from '../context/IPTVContext';
import {COLORS} from '../utils/constants';

const LiveTVScreen: React.FC<NavigationProps> = ({navigation}) => {
  const {state, dispatch} = useIPTV();
  const {channels, favorites, currentChannel} = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'All',
    ...Array.from(new Set(channels.map(ch => ch.category))),
  ];

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (channelId: string) => {
    dispatch({type: 'TOGGLE_FAVORITE', payload: channelId});
  };

  const playChannel = (channel: any) => {
    dispatch({type: 'SET_CURRENT_CHANNEL', payload: channel});
    navigation.navigate('Player', {channel});
  };

  const renderChannelGrid = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[
        styles.channelCardGrid,
        currentChannel?.id === item.id && styles.currentChannelCard,
      ]}
      onPress={() => playChannel(item)}>
      <View style={styles.channelImageContainer}>
        <Image source={{uri: item.logo}} style={styles.channelImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}>
          <Icon
            name={favorites.includes(item.id) ? 'favorite' : 'favorite-border'}
            size={20}
            color={favorites.includes(item.id) ? COLORS.error : COLORS.text}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.channelInfo}>
        <Text style={styles.channelName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.channelCategory} numberOfLines={1}>
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderChannelList = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[
        styles.channelCardList,
        currentChannel?.id === item.id && styles.currentChannelCard,
      ]}
      onPress={() => playChannel(item)}>
      <Image source={{uri: item.logo}} style={styles.channelImageList} />
      <View style={styles.channelInfoList}>
        <Text style={styles.channelName}>{item.name}</Text>
        <Text style={styles.channelCategory}>{item.category}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButtonList}
        onPress={() => toggleFavorite(item.id)}>
        <Icon
          name={favorites.includes(item.id) ? 'favorite' : 'favorite-border'}
          size={24}
          color={favorites.includes(item.id) ? COLORS.error : COLORS.textSecondary}
        />
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Live TV Channels</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.viewModeButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            <Icon
              name={viewMode === 'grid' ? 'view-list' : 'view-module'}
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search channels..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(item)}>
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === item && styles.selectedCategoryButtonText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      {/* Channels */}
      <FlatList
        data={filteredChannels}
        renderItem={viewMode === 'grid' ? renderChannelGrid : renderChannelList}
        keyExtractor={item => item.id}
        numColumns={viewMode === 'grid' ? 3 : 1}
        key={viewMode}
        contentContainerStyle={styles.channelsList}
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
  headerRight: {
    flexDirection: 'row',
  },
  viewModeButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 12,
  },
  categoriesList: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  selectedCategoryButtonText: {
    color: COLORS.background,
  },
  channelsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  channelCardGrid: {
    flex: 1,
    margin: 5,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  channelCardList: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 10,
    padding: 15,
  },
  currentChannelCard: {
    backgroundColor: COLORS.primary,
  },
  channelImageContainer: {
    position: 'relative',
  },
  channelImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  channelImageList: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  favoriteButtonList: {
    padding: 8,
  },
  channelInfo: {
    padding: 12,
  },
  channelInfoList: {
    flex: 1,
    marginLeft: 15,
  },
  channelName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  channelCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default LiveTVScreen;