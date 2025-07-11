import { useState, useEffect, useCallback } from 'react';
import { Channel, Playlist, AppSettings, EPGProgram } from '../types';
import { parseM3U, fetchM3UContent, convertM3UToChannels } from '../utils/m3uParser';
import { XtremeCodeAPI, XtremeCodeCredentials, createXtremeCodeAPI } from '../utils/xtremeCodeApi';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  autoplay: true,
  volume: 80,
  quality: 'auto',
  showEPG: true,
  gridSize: 'medium',
  layoutMode: 'grid',
  language: 'en',
  player: 'default',
  streamFormat: 'hls',
  timeFormat: '12h',
  deviceType: 'tv',
  subtitles: {
    enabled: false,
    language: 'en',
    fontSize: 'medium',
    color: '#ffffff',
    backgroundColor: '#000000',
    position: 'bottom'
  },
  parentalControl: {
    enabled: false,
    pin: '0000',
    lockedCategories: []
  },
  hiddenCategories: {
    live: [],
    vod: [],
    series: []
  },
  automaticUpdate: {
    enabled: false,
    frequency: 'daily',
    lastUpdate: null
  }
};

// Demo channels with placeholder content
const DEMO_CHANNELS: Channel[] = [
  {
    id: 'ch1',
    name: 'BBC One HD',
    url: 'demo://bbc-one',
    logo: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'News',
    favorite: false
  },
  {
    id: 'ch2',
    name: 'CNN International',
    url: 'demo://cnn',
    logo: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'News',
    favorite: false
  },
  {
    id: 'ch3',
    name: 'Discovery Channel',
    url: 'demo://discovery',
    logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Documentary',
    favorite: false
  },
  {
    id: 'ch4',
    name: 'ESPN Sports',
    url: 'demo://espn',
    logo: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports',
    favorite: false
  },
  {
    id: 'ch5',
    name: 'National Geographic',
    url: 'demo://natgeo',
    logo: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Documentary',
    favorite: false
  },
  {
    id: 'ch6',
    name: 'MTV Music',
    url: 'demo://mtv',
    logo: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Music',
    favorite: false
  },
  {
    id: 'ch7',
    name: 'Comedy Central',
    url: 'demo://comedy',
    logo: 'https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Entertainment',
    favorite: false
  },
  {
    id: 'ch8',
    name: 'Food Network',
    url: 'demo://food',
    logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Lifestyle',
    favorite: false
  },
  {
    id: 'ch9',
    name: 'History Channel',
    url: 'demo://history',
    logo: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Documentary',
    favorite: false
  },
  {
    id: 'ch10',
    name: 'Cartoon Network',
    url: 'demo://cartoon',
    logo: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Kids',
    favorite: false
  }
];

export const useIPTVPlayer = () => {
  const [channels, setChannels] = useState<Channel[]>(DEMO_CHANNELS);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600); // 1 hour demo duration
  const [isParentalUnlocked, setIsParentalUnlocked] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: 'demo_user',
    email: 'demo@leoiptv.com',
    subscriptionType: 'Premium',
    expiryDate: '2024-12-31',
    status: 'Active'
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [watchHistory, setWatchHistory] = useState({
    channels: [] as Array<{ id: string; name: string; category: string; lastWatched: Date; watchTime: number }>,
    movies: [] as Array<{ id: string; title: string; genre: string; lastWatched: Date; progress: number }>,
    series: [] as Array<{ id: string; title: string; genre: string; lastWatched: Date; season: number; episode: number }>
  });
  const [automaticUpdateTimer, setAutomaticUpdateTimer] = useState<NodeJS.Timeout | null>(null);

  // Deep merge function to combine saved settings with defaults
  const mergeSettings = (saved: any, defaults: AppSettings): AppSettings => {
    const merged = { ...defaults };
    
    if (saved && typeof saved === 'object') {
      // Merge top-level properties
      Object.keys(defaults).forEach(key => {
        if (key === 'parentalControl' && saved[key]) {
          // Deep merge parental control object
          merged.parentalControl = {
            ...defaults.parentalControl,
            ...saved[key]
          };
        } else if (saved[key] !== undefined) {
          merged[key as keyof AppSettings] = saved[key];
        }
      });
    }
    
    return merged;
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('iptv-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const mergedSettings = mergeSettings(parsed, DEFAULT_SETTINGS);
        setSettings(mergedSettings);
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage, using defaults:', error);
      setSettings(DEFAULT_SETTINGS);
    }
    
    try {
      const savedFavorites = localStorage.getItem('iptv-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
      setFavorites([]);
    }
    
    // Load watch history
    try {
      const savedHistory = localStorage.getItem('iptv-watch-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Convert date strings back to Date objects
        const processedHistory = {
          channels: parsed.channels?.map((item: any) => ({
            ...item,
            lastWatched: new Date(item.lastWatched)
          })) || [],
          movies: parsed.movies?.map((item: any) => ({
            ...item,
            lastWatched: new Date(item.lastWatched)
          })) || [],
          series: parsed.series?.map((item: any) => ({
            ...item,
            lastWatched: new Date(item.lastWatched)
          })) || []
        };
        setWatchHistory(processedHistory);
      }
    } catch (error) {
      console.warn('Failed to load watch history from localStorage:', error);
    }
  }, []);

  // Demo time progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentChannel) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            return 0; // Loop back to start
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentChannel, duration]);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('iptv-settings', JSON.stringify(updated));
  }, [settings]);

  // Toggle favorite
  const toggleFavorite = useCallback((channelId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId];
      
      localStorage.setItem('iptv-favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Import M3U8 playlist (demo version)
  const importPlaylist = useCallback(async (url: string, name: string) => {
    try {
      // Fetch the M3U content
      const m3uContent = await fetchM3UContent(url);
      
      // Parse the M3U content
      const m3uEntries = parseM3U(m3uContent);
      
      if (m3uEntries.length === 0) {
        throw new Error('No valid channels found in the playlist');
      }
      
      // Convert to Channel objects
      const channels = convertM3UToChannels(m3uEntries);

    const newPlaylist: Playlist = {
      id: `pl_${Date.now()}`,
      name,
      url,
      channels: channels,
      lastUpdated: new Date()
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    setChannels(prev => [...prev, ...channels]);
    
    return newPlaylist;
    } catch (error) {
      console.error('Failed to import playlist:', error);
      throw error;
    }
  }, []);

  // Import from Xtreme Code
  const importFromXtremeCode = useCallback(async (credentials: XtremeCodeCredentials) => {
    try {
      const api = createXtremeCodeAPI(credentials);
      
      // Test connection first
      const isConnected = await api.testConnection();
      if (!isConnected) {
        throw new Error('Failed to authenticate with Xtreme Code server');
      }
      
      // Get user info
      const userInfo = await api.getUserInfo();
      
      // Import Live TV
      try {
        const liveStreams = await api.getLiveStreams();
        if (liveStreams.length > 0) {
          const livePlaylistUrl = api.generatePlaylistUrl('live');
          const livePlaylist: Playlist = {
            id: `xtreme_live_${Date.now()}`,
            name: `${credentials.username} - Live TV`,
            url: livePlaylistUrl,
            channels: liveStreams.map((stream, index) => ({
              id: `xtreme_live_${stream.stream_id}`,
              name: stream.name,
              url: api.getStreamUrl(stream.stream_id, 'live'),
              logo: stream.stream_icon || undefined,
              category: 'Live TV',
              favorite: false
            })),
            lastUpdated: new Date()
          };
          
          setPlaylists(prev => [...prev, livePlaylist]);
          setChannels(prev => [...prev, ...livePlaylist.channels]);
        }
      } catch (error) {
        console.warn('Failed to import live streams:', error);
      }
      
      // Import VOD (Movies)
      try {
        const vodStreams = await api.getVodStreams();
        if (vodStreams.length > 0) {
          const vodPlaylistUrl = api.generatePlaylistUrl('vod');
          const vodPlaylist: Playlist = {
            id: `xtreme_vod_${Date.now()}`,
            name: `${credentials.username} - Movies`,
            url: vodPlaylistUrl,
            channels: vodStreams.map((stream, index) => ({
              id: `xtreme_vod_${stream.stream_id}`,
              name: stream.name,
              url: api.getStreamUrl(stream.stream_id, 'vod'),
              logo: stream.stream_icon || undefined,
              category: 'Movies',
              favorite: false
            })),
            lastUpdated: new Date()
          };
          
          setPlaylists(prev => [...prev, vodPlaylist]);
          setChannels(prev => [...prev, ...vodPlaylist.channels]);
        }
      } catch (error) {
        console.warn('Failed to import VOD streams:', error);
      }
      
      // Import Series
      try {
        const seriesStreams = await api.getSeries();
        if (seriesStreams.length > 0) {
          const seriesPlaylistUrl = api.generatePlaylistUrl('series');
          const seriesPlaylist: Playlist = {
            id: `xtreme_series_${Date.now()}`,
            name: `${credentials.username} - Series`,
            url: seriesPlaylistUrl,
            channels: seriesStreams.map((stream, index) => ({
              id: `xtreme_series_${stream.stream_id}`,
              name: stream.name,
              url: api.getStreamUrl(stream.stream_id, 'series'),
              logo: stream.stream_icon || undefined,
              category: 'Series',
              favorite: false
            })),
            lastUpdated: new Date()
          };
          
          setPlaylists(prev => [...prev, seriesPlaylist]);
          setChannels(prev => [...prev, ...seriesPlaylist.channels]);
        }
      } catch (error) {
        console.warn('Failed to import series streams:', error);
      }
      
      return {
        success: true,
        userInfo,
        message: 'Xtreme Code playlists imported successfully'
      };
      
    } catch (error) {
      console.error('Failed to import from Xtreme Code:', error);
      throw error;
    }
  }, []);
  // Remove playlist
  const removePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => {
      const playlist = prev.find(p => p.id === playlistId);
      if (playlist) {
        // Remove channels that belong to this playlist
        setChannels(currentChannels => 
          currentChannels.filter(ch => !playlist.channels.some(pc => pc.id === ch.id))
        );
      }
      return prev.filter(p => p.id !== playlistId);
    });
  }, []);

  // Refresh playlist
  const refreshPlaylist = useCallback(async (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update the playlist's last updated time
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, lastUpdated: new Date() }
        : p
    ));
  }, [playlists]);
  // Filter channels based on search and category
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           selectedCategory === 'Favorites' ? favorites.includes(channel.id) : 
                           channel.category === selectedCategory;
    
    // Check parental control
    const isLocked = settings.parentalControl?.enabled && 
                    settings.parentalControl?.lockedCategories?.includes(channel.category) &&
                    !isParentalUnlocked;
    
    return matchesSearch && matchesCategory && !isLocked;
  });

  // Get unique categories
  const categories = ['All', 'Favorites', ...Array.from(new Set(channels.map(ch => ch.category)))];

  // Play channel
  const playChannel = useCallback((channel: Channel) => {
    setCurrentChannel(channel);
    setIsPlaying(true);
    setCurrentTime(0); // Reset time when switching channels
    
    // Add to watch history
    setWatchHistory(prev => {
      const existingIndex = prev.channels.findIndex(item => item.id === channel.id);
      const historyItem = {
        id: channel.id,
        name: channel.name,
        category: channel.category,
        lastWatched: new Date(),
        watchTime: 0
      };
      
      let updatedChannels;
      if (existingIndex >= 0) {
        // Update existing entry
        updatedChannels = [...prev.channels];
        updatedChannels[existingIndex] = historyItem;
      } else {
        // Add new entry (keep only last 50 items)
        updatedChannels = [historyItem, ...prev.channels.slice(0, 49)];
      }
      
      const updated = { ...prev, channels: updatedChannels };
      localStorage.setItem('iptv-watch-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Playback controls
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    updateSettings({ volume: newVolume });
  }, [updateSettings]);

  // Parental control functions
  const verifyParentalPin = useCallback((pin: string) => {
    if (pin === settings.parentalControl?.pin) {
      setIsParentalUnlocked(true);
      // Auto-lock after 30 minutes
      setTimeout(() => {
        setIsParentalUnlocked(false);
      }, 30 * 60 * 1000);
      return true;
    }
    return false;
  }, [settings.parentalControl?.pin]);

  const lockParentalControl = useCallback(() => {
    setIsParentalUnlocked(false);
  }, []);

  const toggleCategoryLock = useCallback((category: string) => {
    const lockedCategories = settings.parentalControl?.lockedCategories || [];
    const isLocked = lockedCategories.includes(category);
    
    const updatedCategories = isLocked
      ? lockedCategories.filter(cat => cat !== category)
      : [...lockedCategories, category];
    
    updateSettings({
      parentalControl: {
        ...settings.parentalControl,
        lockedCategories: updatedCategories
      }
    });
  }, [settings.parentalControl?.lockedCategories, updateSettings]);

  // Account management functions
  const updateUserInfo = useCallback((newInfo: any) => {
    setUserInfo(newInfo);
    localStorage.setItem('iptv-user-info', JSON.stringify(newInfo));
  }, []);

  // Refresh data function
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate API calls to refresh data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh channels (simulate getting updated channel list)
      const refreshedChannels = DEMO_CHANNELS.map(channel => ({
        ...channel,
        // Simulate some channels being updated
        name: Math.random() > 0.8 ? `${channel.name} [Updated]` : channel.name
      }));
      
      setChannels(refreshedChannels);
      
      // Refresh user info (simulate getting updated subscription info)
      const updatedUserInfo = {
        ...userInfo,
        status: 'Active', // Ensure status is refreshed
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Extend by 1 year
      };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('iptv-user-info', JSON.stringify(updatedUserInfo));
      
      // Show success message
      alert('Data refreshed successfully!');
      
    } catch (error) {
      console.error('Failed to refresh data:', error);
      alert('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  }, [userInfo]);

  // Exit application function
  const exitApplication = useCallback(() => {
    // Save current state before exiting
    try {
      localStorage.setItem('iptv-settings', JSON.stringify(settings));
      localStorage.setItem('iptv-favorites', JSON.stringify(favorites));
      localStorage.setItem('iptv-user-info', JSON.stringify(userInfo));
      
      // Stop any playing media
      setIsPlaying(false);
      setCurrentChannel(null);
      
      // Clear any intervals or timeouts
      setCurrentTime(0);
      
      // Show exit message
      const exitMessage = document.createElement('div');
      exitMessage.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          color: #eab308;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: system-ui;
          z-index: 9999;
        ">
          <img src="/golden-lion-with-crown-logo-vector-45981373.png" alt="LEOIPTV" style="width: 120px; height: 120px; margin-bottom: 20px; opacity: 0.8;" />
          <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 10px;">Thank you for using LEOIPTV</h1>
          <p style="font-size: 1rem; opacity: 0.8;">Application is closing...</p>
          <div style="margin-top: 20px;">
            <div style="width: 40px; height: 40px; border: 4px solid #eab308; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      
      document.body.appendChild(exitMessage);
      
      // Attempt to close the window/tab after a delay
      setTimeout(() => {
        // Try different methods to close the application
        if (window.close) {
          window.close();
        }
        
        // If window.close doesn't work, try to navigate away
        if (typeof window !== 'undefined') {
          try {
            window.location.href = 'about:blank';
          } catch (e) {
            // If all else fails, show a message
            exitMessage.innerHTML = `
              <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: black;
                color: #eab308;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: system-ui;
                z-index: 9999;
              ">
                <img src="/golden-lion-with-crown-logo-vector-45981373.png" alt="LEOIPTV" style="width: 120px; height: 120px; margin-bottom: 20px; opacity: 0.8;" />
                <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 10px;">LEOIPTV Session Ended</h1>
                <p style="font-size: 1rem; opacity: 0.8; margin-bottom: 20px;">You can safely close this tab/window</p>
                <button onclick="window.close()" style="
                  background: #eab308;
                  color: black;
                  border: none;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-size: 1rem;
                  font-weight: bold;
                  cursor: pointer;
                ">Close Window</button>
              </div>
            `;
          }
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error during application exit:', error);
      // Still attempt to close even if saving fails
      if (window.close) {
        window.close();
      }
    }
  }, [settings, favorites, userInfo]);

  // Clear history functions
  const clearChannelHistory = useCallback((selectedItems?: string[]) => {
    setWatchHistory(prev => {
      const updated = {
        ...prev,
        channels: selectedItems 
          ? prev.channels.filter(item => !selectedItems.includes(item.id))
          : []
      };
      localStorage.setItem('iptv-watch-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearMovieHistory = useCallback((selectedItems?: string[]) => {
    setWatchHistory(prev => {
      const updated = {
        ...prev,
        movies: selectedItems 
          ? prev.movies.filter(item => !selectedItems.includes(item.id))
          : []
      };
      localStorage.setItem('iptv-watch-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearSeriesHistory = useCallback((selectedItems?: string[]) => {
    setWatchHistory(prev => {
      const updated = {
        ...prev,
        series: selectedItems 
          ? prev.series.filter(item => !selectedItems.includes(item.id))
          : []
      };
      localStorage.setItem('iptv-watch-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Add mock data to history for demonstration
  useEffect(() => {
    // Only add mock data if history is empty
    if (watchHistory.channels.length === 0 && watchHistory.movies.length === 0 && watchHistory.series.length === 0) {
      const mockHistory = {
        channels: [
          { id: 'ch1', name: 'BBC One HD', category: 'News', lastWatched: new Date(Date.now() - 1000 * 60 * 30), watchTime: 1800 },
          { id: 'ch2', name: 'CNN International', category: 'News', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 2), watchTime: 3600 },
          { id: 'ch3', name: 'Discovery Channel', category: 'Documentary', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24), watchTime: 2700 },
          { id: 'ch4', name: 'ESPN Sports', category: 'Sports', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), watchTime: 5400 },
          { id: 'ch5', name: 'National Geographic', category: 'Documentary', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), watchTime: 4200 }
        ],
        movies: [
          { id: 'mov1', title: 'The Dark Knight', genre: 'Action', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 12), progress: 85 },
          { id: 'mov2', title: 'Inception', genre: 'Sci-Fi', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24), progress: 100 },
          { id: 'mov3', title: 'Interstellar', genre: 'Sci-Fi', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), progress: 45 },
          { id: 'mov4', title: 'Tenet', genre: 'Action', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), progress: 30 },
          { id: 'mov5', title: 'Dune', genre: 'Sci-Fi', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), progress: 70 }
        ],
        series: [
          { id: 'ser1', title: 'Breaking Bad', genre: 'Crime', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 6), season: 3, episode: 7 },
          { id: 'ser2', title: 'Game of Thrones', genre: 'Fantasy', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24), season: 8, episode: 6 },
          { id: 'ser3', title: 'Stranger Things', genre: 'Sci-Fi', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), season: 4, episode: 3 },
          { id: 'ser4', title: 'The Crown', genre: 'Drama', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), season: 5, episode: 2 },
          { id: 'ser5', title: 'Better Call Saul', genre: 'Crime', lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), season: 6, episode: 13 }
        ]
      };
      setWatchHistory(mockHistory);
      localStorage.setItem('iptv-watch-history', JSON.stringify(mockHistory));
    }
  }, [watchHistory.channels.length, watchHistory.movies.length, watchHistory.series.length]);

  // Automatic update functionality
  useEffect(() => {
    // Clear existing timer
    if (automaticUpdateTimer) {
      clearTimeout(automaticUpdateTimer);
    }

    if (!settings.automaticUpdate.enabled) {
      return;
    }

    const scheduleNextUpdate = () => {
      const now = new Date();
      let nextUpdateTime = new Date();
      
      if (settings.automaticUpdate.lastUpdate) {
        const lastUpdate = new Date(settings.automaticUpdate.lastUpdate);
        
        switch (settings.automaticUpdate.frequency) {
          case 'startup':
            // For startup, we don't schedule automatic updates
            return;
          case 'daily':
            nextUpdateTime = new Date(lastUpdate.getTime() + 24 * 60 * 60 * 1000);
            break;
          case 'every2days':
            nextUpdateTime = new Date(lastUpdate.getTime() + 48 * 60 * 60 * 1000);
            break;
        }
      } else {
        // If no last update, schedule for immediate update
        nextUpdateTime = now;
      }

      const timeUntilUpdate = nextUpdateTime.getTime() - now.getTime();
      
      if (timeUntilUpdate <= 0) {
        // Update is due now
        performAutomaticUpdate();
      } else {
        // Schedule the update
        const timer = setTimeout(() => {
          performAutomaticUpdate();
        }, timeUntilUpdate);
        
        setAutomaticUpdateTimer(timer);
      }
    };

    const performAutomaticUpdate = async () => {
      try {
        console.log('Performing automatic playlist update...');
        
        // Update all playlists
        for (const playlist of playlists) {
          await refreshPlaylist(playlist.id);
        }
        
        // Update the last update time
        const updatedSettings = {
          ...settings,
          automaticUpdate: {
            ...settings.automaticUpdate,
            lastUpdate: new Date()
          }
        };
        
        setSettings(updatedSettings);
        localStorage.setItem('iptv-settings', JSON.stringify(updatedSettings));
        
        console.log('Automatic update completed successfully');
        
        // Schedule the next update
        scheduleNextUpdate();
        
      } catch (error) {
        console.error('Automatic update failed:', error);
        
        // Retry in 1 hour on failure
        const retryTimer = setTimeout(() => {
          performAutomaticUpdate();
        }, 60 * 60 * 1000);
        
        setAutomaticUpdateTimer(retryTimer);
      }
    };

    // Handle startup updates
    if (settings.automaticUpdate.frequency === 'startup') {
      // Check if this is a fresh startup (no last update or last update was more than 1 hour ago)
      const lastUpdate = settings.automaticUpdate.lastUpdate ? new Date(settings.automaticUpdate.lastUpdate) : null;
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (!lastUpdate || lastUpdate < oneHourAgo) {
        // Perform startup update after a short delay
        const startupTimer = setTimeout(() => {
          performAutomaticUpdate();
        }, 5000); // 5 second delay after startup
        
        setAutomaticUpdateTimer(startupTimer);
      }
    } else {
      scheduleNextUpdate();
    }

    // Cleanup function
    return () => {
      if (automaticUpdateTimer) {
        clearTimeout(automaticUpdateTimer);
      }
    };
  }, [settings.automaticUpdate, playlists.length]);

  // Load user info from localStorage on mount
  useEffect(() => {
    try {
      const savedUserInfo = localStorage.getItem('iptv-user-info');
      if (savedUserInfo) {
        setUserInfo(JSON.parse(savedUserInfo));
      }
    } catch (error) {
      console.warn('Failed to load user info from localStorage:', error);
    }
  }, []);

  return {
    channels,
    playlists,
    currentChannel,
    favorites,
    searchQuery,
    selectedCategory,
    settings,
    isPlaying,
    volume,
    currentTime,
    duration,
    filteredChannels,
    categories,
    setSearchQuery,
    setSelectedCategory,
    toggleFavorite,
    importPlaylist,
    importFromXtremeCode,
    removePlaylist,
    refreshPlaylist,
    playChannel,
    togglePlay,
    seekTo,
    changeVolume,
    updateSettings,
    setCurrentTime,
    setDuration,
    isParentalUnlocked,
    verifyParentalPin,
    lockParentalControl,
    toggleCategoryLock,
    userInfo,
    updateUserInfo,
    isRefreshing,
    refreshData,
    exitApplication,
    watchHistory,
    clearChannelHistory,
    clearMovieHistory,
    clearSeriesHistory
  };
};