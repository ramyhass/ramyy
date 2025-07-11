import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';
import KeepAwake from 'react-native-keep-awake';
import {NavigationProps} from '../types';
import {useIPTV} from '../context/IPTVContext';
import {COLORS} from '../utils/constants';

const {width, height} = Dimensions.get('window');

const PlayerScreen: React.FC<NavigationProps> = ({navigation, route}) => {
  const {channel} = route.params;
  const {state, dispatch} = useIPTV();
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    // Lock orientation to landscape for TV experience
    Orientation.lockToLandscape();
    // Keep screen awake during playback
    KeepAwake.activate();
    // Hide status bar
    StatusBar.setHidden(true);

    // Auto-hide controls after 5 seconds
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      Orientation.unlockAllOrientations();
      KeepAwake.deactivate();
      StatusBar.setHidden(false);
    };
  }, []);

  const toggleControls = () => {
    setShowControls(!showControls);
    if (!showControls) {
      // Auto-hide after 5 seconds
      setTimeout(() => setShowControls(false), 5000);
    }
  };

  const togglePlayPause = () => {
    dispatch({type: 'SET_PLAYING', payload: !state.isPlaying});
  };

  const handleVolumeChange = (change: number) => {
    const newVolume = Math.max(0, Math.min(100, state.volume + change));
    dispatch({type: 'SET_VOLUME', payload: newVolume});
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onProgress = (data: any) => {
    setCurrentTime(data.currentTime);
    dispatch({type: 'SET_CURRENT_TIME', payload: data.currentTime});
  };

  const onLoad = (data: any) => {
    setDuration(data.duration);
    dispatch({type: 'SET_DURATION', payload: data.duration});
  };

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={toggleControls}>
        <Video
          source={{uri: channel.url}}
          style={styles.video}
          resizeMode="contain"
          paused={!state.isPlaying}
          volume={state.volume / 100}
          onProgress={onProgress}
          onLoad={onLoad}
          onBuffer={({isBuffering}) => setIsBuffering(isBuffering)}
          onError={(error) => console.log('Video Error:', error)}
        />

        {/* Buffering Indicator */}
        {isBuffering && (
          <View style={styles.bufferingContainer}>
            <Text style={styles.bufferingText}>Buffering...</Text>
          </View>
        )}

        {/* Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <View style={styles.channelInfo}>
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelCategory}>{channel.category}</Text>
              </View>
              <TouchableOpacity style={styles.settingsButton}>
                <Icon name="settings" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Center Controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleVolumeChange(-10)}>
                <Icon name="volume-down" size={32} color={COLORS.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playButton}
                onPress={togglePlayPause}>
                <Icon
                  name={state.isPlaying ? 'pause' : 'play-arrow'}
                  size={48}
                  color={COLORS.text}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleVolumeChange(10)}>
                <Icon name="volume-up" size={32} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${
                          duration > 0 ? (currentTime / duration) * 100 : 0
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.volumeText}>Vol: {state.volume}%</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bufferingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bufferingText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  channelInfo: {
    flex: 1,
    marginLeft: 20,
  },
  channelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  channelCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  settingsButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    marginHorizontal: 20,
  },
  playButton: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    marginHorizontal: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  timeText: {
    color: COLORS.text,
    fontSize: 14,
    minWidth: 80,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  volumeText: {
    color: COLORS.text,
    fontSize: 14,
    minWidth: 60,
    textAlign: 'right',
  },
});

export default PlayerScreen;