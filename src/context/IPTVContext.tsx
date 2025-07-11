import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Channel, AppSettings, Playlist} from '../types';
import {DEMO_CHANNELS, DEFAULT_SETTINGS} from '../utils/constants';

interface IPTVState {
  channels: Channel[];
  playlists: Playlist[];
  currentChannel: Channel | null;
  favorites: string[];
  settings: AppSettings;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isParentalUnlocked: boolean;
  userInfo: any;
  isRefreshing: boolean;
}

interface IPTVAction {
  type: string;
  payload?: any;
}

const initialState: IPTVState = {
  channels: DEMO_CHANNELS,
  playlists: [],
  currentChannel: null,
  favorites: [],
  settings: DEFAULT_SETTINGS,
  isPlaying: false,
  volume: 80,
  currentTime: 0,
  duration: 3600,
  isParentalUnlocked: false,
  userInfo: {
    username: 'demo_user',
    email: 'demo@leoiptv.com',
    subscriptionType: 'Premium',
    expiryDate: '2024-12-31',
    status: 'Active',
  },
  isRefreshing: false,
};

const iptvReducer = (state: IPTVState, action: IPTVAction): IPTVState => {
  switch (action.type) {
    case 'SET_CHANNELS':
      return {...state, channels: action.payload};
    case 'SET_CURRENT_CHANNEL':
      return {...state, currentChannel: action.payload};
    case 'TOGGLE_FAVORITE':
      const channelId = action.payload;
      const newFavorites = state.favorites.includes(channelId)
        ? state.favorites.filter(id => id !== channelId)
        : [...state.favorites, channelId];
      return {...state, favorites: newFavorites};
    case 'UPDATE_SETTINGS':
      return {...state, settings: {...state.settings, ...action.payload}};
    case 'SET_PLAYING':
      return {...state, isPlaying: action.payload};
    case 'SET_VOLUME':
      return {...state, volume: action.payload};
    case 'SET_CURRENT_TIME':
      return {...state, currentTime: action.payload};
    case 'SET_DURATION':
      return {...state, duration: action.payload};
    case 'SET_PARENTAL_UNLOCKED':
      return {...state, isParentalUnlocked: action.payload};
    case 'SET_USER_INFO':
      return {...state, userInfo: action.payload};
    case 'SET_REFRESHING':
      return {...state, isRefreshing: action.payload};
    case 'ADD_PLAYLIST':
      return {...state, playlists: [...state.playlists, action.payload]};
    case 'REMOVE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.filter(p => p.id !== action.payload),
      };
    default:
      return state;
  }
};

const IPTVContext = createContext<{
  state: IPTVState;
  dispatch: React.Dispatch<IPTVAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const IPTVProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(iptvReducer, initialState);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  // Save data to AsyncStorage when state changes
  useEffect(() => {
    saveStoredData();
  }, [state.favorites, state.settings, state.userInfo]);

  const loadStoredData = async () => {
    try {
      const [favorites, settings, userInfo] = await Promise.all([
        AsyncStorage.getItem('iptv-favorites'),
        AsyncStorage.getItem('iptv-settings'),
        AsyncStorage.getItem('iptv-user-info'),
      ]);

      if (favorites) {
        dispatch({type: 'TOGGLE_FAVORITE', payload: JSON.parse(favorites)});
      }
      if (settings) {
        dispatch({type: 'UPDATE_SETTINGS', payload: JSON.parse(settings)});
      }
      if (userInfo) {
        dispatch({type: 'SET_USER_INFO', payload: JSON.parse(userInfo)});
      }
    } catch (error) {
      console.warn('Failed to load stored data:', error);
    }
  };

  const saveStoredData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('iptv-favorites', JSON.stringify(state.favorites)),
        AsyncStorage.setItem('iptv-settings', JSON.stringify(state.settings)),
        AsyncStorage.setItem('iptv-user-info', JSON.stringify(state.userInfo)),
      ]);
    } catch (error) {
      console.warn('Failed to save data:', error);
    }
  };

  return (
    <IPTVContext.Provider value={{state, dispatch}}>
      {children}
    </IPTVContext.Provider>
  );
};

export const useIPTV = () => {
  const context = useContext(IPTVContext);
  if (!context) {
    throw new Error('useIPTV must be used within an IPTVProvider');
  }
  return context;
};