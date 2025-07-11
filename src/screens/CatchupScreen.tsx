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

const CatchupScreen: React.FC<NavigationProps> = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedChannel, setSelectedChannel] = useState('All');

  const channels = ['All', 'BBC One', 'CNN', 'Discovery', 'ESPN', 'National Geographic'];
  
  const catchupPrograms = [
    {id: 1, title: 'Morning News', channel: 'BBC One', time: '08:00', duration: '60 min', date: selectedDate},
    {id: 2, title: 'World Report', channel: 'CNN', time: '09:00', duration: '30 min', date: selectedDate},
    {id: 3, title: 'Nature Documentary', channel: 'Discovery', time: '10:00', duration: '45 min', date: selectedDate},
    {id: 4, title: 'Sports Center', channel: 'ESPN', time: '11:00', duration: '60 min', date: selectedDate},
    {id: 5, title: 'Wild Life', channel: 'National Geographic', time: '12:00', duration: '50 min', date: selectedDate},
  ];

  const filteredPrograms = selectedChannel === 'All' 
    ? catchupPrograms 
    : catchupPrograms.filter(program => program.channel === selectedChannel);

  const renderProgram = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.programCard}>
      <View style={styles.programHeader}>
        <Text style={styles.programTitle}>{item.title}</Text>
        <View style={styles.channelBadge}>
          <Text style={styles.channelBadgeText}>{item.channel}</Text>
        </View>
      </View>
      <View style={styles.programMeta}>
        <View style={styles.timeInfo}>
          <Icon name="access-time" size={16} color={COLORS.textSecondary} />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.durationText}>{item.duration}</Text>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Icon name="play-arrow" size={20} color={COLORS.background} />
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
          <Text style={styles.headerTitle}>Catch Up TV</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="date-range" size={20} color={COLORS.primary} />
          <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Channel Filter */}
      <FlatList
        data={channels}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.channelButton,
              selectedChannel === item && styles.selectedChannelButton,
            ]}
            onPress={() => setSelectedChannel(item)}>
            <Text
              style={[
                styles.channelButtonText,
                selectedChannel === item && styles.selectedChannelButtonText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.channelsList}
      />

      {/* Programs List */}
      <FlatList
        data={filteredPrograms}
        renderItem={renderProgram}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.programsList}
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
    alignItems: 'center',
  },
  dateText: {
    color: COLORS.primary,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  channelsList: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  channelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 10,
  },
  selectedChannelButton: {
    backgroundColor: COLORS.primary,
  },
  channelButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  selectedChannelButtonText: {
    color: COLORS.background,
  },
  programsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  programCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  programHeader: {
    flex: 1,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  channelBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  channelBadgeText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 5,
  },
  durationText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginRight: 15,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 10,
  },
});

export default CatchupScreen;