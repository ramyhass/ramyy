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
import {useIPTV} from '../context/IPTVContext';
import {COLORS} from '../utils/constants';

interface Program {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: string;
}

const TVGuideScreen: React.FC<NavigationProps> = ({navigation}) => {
  const {state} = useIPTV();
  const {channels, currentChannel} = state;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Generate mock EPG data
  const generatePrograms = (channel: any): Program[] => {
    const programs: Program[] = [];
    
    for (let i = 0; i < 24; i++) {
      const startHour = i.toString().padStart(2, '0');
      const endHour = (i + 1).toString().padStart(2, '0');
      
      programs.push({
        id: `${channel.id}_${i}`,
        title: `${channel.name} Program ${i + 1}`,
        description: `Description for program ${i + 1} on ${channel.name}`,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        category: channel.category,
      });
    }
    
    return programs;
  };

  const isCurrentProgram = (program: Program) => {
    const now = new Date();
    const currentHour = now.getHours();
    const programHour = parseInt(program.startTime.split(':')[0]);
    
    return currentHour === programHour && selectedDate === new Date().toISOString().split('T')[0];
  };

  const renderChannel = ({item}: {item: any}) => (
    <View style={styles.channelContainer}>
      {/* Channel Header */}
      <TouchableOpacity
        style={[
          styles.channelHeader,
          currentChannel?.id === item.id && styles.currentChannelHeader,
        ]}
        onPress={() => navigation.navigate('Player', {channel: item})}>
        <Image source={{uri: item.logo}} style={styles.channelLogo} />
        <View style={styles.channelInfo}>
          <Text style={styles.channelName}>{item.name}</Text>
          <Text style={styles.channelCategory}>{item.category}</Text>
        </View>
      </TouchableOpacity>

      {/* Programs */}
      <View style={styles.programsContainer}>
        {generatePrograms(item).slice(0, 6).map(program => (
          <TouchableOpacity
            key={program.id}
            style={[
              styles.programCard,
              isCurrentProgram(program) && styles.currentProgramCard,
            ]}
            onPress={() => setSelectedProgram(program)}>
            <View style={styles.programHeader}>
              <Text style={styles.programTime}>
                {program.startTime} - {program.endTime}
              </Text>
              {isCurrentProgram(program) && (
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              )}
            </View>
            <Text style={styles.programTitle} numberOfLines={1}>
              {program.title}
            </Text>
            <Text style={styles.programDescription} numberOfLines={2}>
              {program.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
          <Text style={styles.headerTitle}>TV Guide</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="date-range" size={20} color={COLORS.primary} />
          <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* EPG Grid */}
      <FlatList
        data={channels.slice(0, 6)}
        renderItem={renderChannel}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.channelsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Program Details Modal */}
      {selectedProgram && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedProgram.title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedProgram(null)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.timeContainer}>
                <Icon name="access-time" size={16} color={COLORS.textSecondary} />
                <Text style={styles.timeText}>
                  {selectedProgram.startTime} - {selectedProgram.endTime}
                </Text>
              </View>
              
              <Text style={styles.modalDescription}>
                {selectedProgram.description}
              </Text>
              
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {selectedProgram.category}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
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
    paddingVertical: 15,
  },
  channelContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 15,
    overflow: 'hidden',
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  currentChannelHeader: {
    backgroundColor: COLORS.primary,
  },
  channelLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  channelInfo: {
    marginLeft: 12,
  },
  channelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  channelCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  programsContainer: {
    padding: 15,
  },
  programCard: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  currentProgramCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  programTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  liveBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  programTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  modalDescription: {
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 15,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TVGuideScreen;