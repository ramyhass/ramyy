import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationProps} from '../types';
import {useIPTV} from '../context/IPTVContext';
import {COLORS} from '../utils/constants';

const SettingsScreen: React.FC<NavigationProps> = ({navigation}) => {
  const {state, dispatch} = useIPTV();

  const settingsItems = [
    {
      id: 'parental',
      label: 'Parental Control',
      icon: 'child-care',
      onPress: () => Alert.alert('Parental Control', 'Feature coming soon'),
    },
    {
      id: 'playlists',
      label: 'Manage Playlists',
      icon: 'playlist-play',
      onPress: () => Alert.alert('Playlists', 'Feature coming soon'),
    },
    {
      id: 'language',
      label: 'Change Language',
      icon: 'language',
      value: state.settings.language.toUpperCase(),
      onPress: () => Alert.alert('Language', 'Feature coming soon'),
    },
    {
      id: 'player',
      label: 'Change Player',
      icon: 'play-circle-outline',
      value: state.settings.player,
      onPress: () => Alert.alert('Player', 'Feature coming soon'),
    },
    {
      id: 'streamFormat',
      label: 'Stream Format',
      icon: 'settings-input-antenna',
      value: state.settings.streamFormat.toUpperCase(),
      onPress: () => Alert.alert('Stream Format', 'Feature coming soon'),
    },
    {
      id: 'timeFormat',
      label: 'Time Format',
      icon: 'access-time',
      value: state.settings.timeFormat,
      onPress: () => Alert.alert('Time Format', 'Feature coming soon'),
    },
    {
      id: 'deviceType',
      label: 'Device Type',
      icon: 'devices',
      value: state.settings.deviceType,
      onPress: () => Alert.alert('Device Type', 'Feature coming soon'),
    },
    {
      id: 'subtitles',
      label: 'Subtitle Settings',
      icon: 'subtitles',
      value: state.settings.subtitles.enabled ? 'Enabled' : 'Disabled',
      onPress: () => Alert.alert('Subtitles', 'Feature coming soon'),
    },
    {
      id: 'update',
      label: 'Update Settings',
      icon: 'system-update',
      value: state.settings.automaticUpdate.enabled ? 'Auto' : 'Manual',
      onPress: () => Alert.alert('Updates', 'Feature coming soon'),
    },
    {
      id: 'about',
      label: 'About',
      icon: 'info',
      onPress: () => Alert.alert('About', 'LEOIPTV v1.0.0\nProfessional IPTV Solution for Android TV'),
    },
  ];

  const renderSettingItem = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.settingItem} onPress={item.onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={24} color={COLORS.primary} />
        </View>
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      <View style={styles.settingRight}>
        {item.value && (
          <Text style={styles.settingValue}>{item.value}</Text>
        )}
        <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      {/* Settings List */}
      <FlatList
        data={settingsItems}
        renderItem={renderSettingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.settingsList}
        showsVerticalScrollIndicator={false}
      />

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>LEOIPTV</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appDescription}>
          Professional IPTV Solution for Android TV
        </Text>
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
  settingsList: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 15,
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 10,
    textTransform: 'capitalize',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  appDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SettingsScreen;