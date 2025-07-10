import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {NavigationProps} from '../types';
import {COLORS} from '../utils/constants';

const {width, height} = Dimensions.get('window');

const SplashScreen: React.FC<NavigationProps> = ({navigation}) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to main screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>LEOIPTV</Text>
        <Text style={styles.subtitle}>Professional IPTV Solution</Text>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <View style={styles.loadingDots}>
          <Animated.View style={[styles.dot, {opacity: fadeAnim}]} />
          <Animated.View
            style={[
              styles.dot,
              {opacity: fadeAnim, animationDelay: '0.2s' as any},
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {opacity: fadeAnim, animationDelay: '0.4s' as any},
            ]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 50,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginHorizontal: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  copyright: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SplashScreen;