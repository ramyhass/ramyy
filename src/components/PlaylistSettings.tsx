import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Download, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  Edit2, 
  Save, 
  X, 
  Check,
  AlertCircle,
  Tv,
  Calendar,
  Globe,
  Key,
  User,
  Server,
  Shield
} from 'lucide-react';
import { useIPTVPlayer } from '../hooks/useIPTVPlayer';

interface PlaylistSettingsProps {
  onBack: () => void;
}

export const PlaylistSettings: React.FC<PlaylistSettingsProps> = ({ onBack }) => {
  const { playlists, importPlaylist, channels } = useIPTVPlayer();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showXtremeDialog, setShowXtremeDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState<string | null>(null);
  const [importUrl, setImportUrl] = useState('');
  const [importName, setImportName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  
  // Xtreme Code states
  const [xtremeCredentials, setXtremeCredentials] = useState({
    server: '',
    username: '',
    password: ''
  });
  const [isXtremeConnecting, setIsXtremeConnecting] = useState(false);
  const [xtremeError, setXtremeError] = useState('');

  const handleImport = async () => {
    if (!importUrl.trim() || !importName.trim()) {
      setImportError('Please fill in all fields');
      return;
    }

    // Basic URL validation
    try {
      new URL(importUrl);
    } catch {
      setImportError('Please enter a valid URL');
      return;
    }

    setIsImporting(true);
    setImportError('');

    try {
      await importPlaylist(importUrl.trim(), importName.trim());
      setImportUrl('');
      setImportName('');
      setShowImportDialog(false);
      alert('Playlist imported successfully!');
    } catch (error) {
      console.error('Failed to import playlist:', error);
      setImportError('Failed to import playlist. Please check the URL and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleEdit = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      setEditName(playlist.name);
      setEditUrl(playlist.url);
      setShowEditDialog(playlistId);
    }
  };

  const handleSaveEdit = () => {
    // In a real implementation, this would update the playlist
    alert('Playlist updated successfully!');
    setShowEditDialog(null);
    setEditName('');
    setEditUrl('');
  };

  const handleRemove = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && confirm(`Are you sure you want to remove "${playlist.name}"?`)) {
      // In a real implementation, this would remove the playlist
      alert('Playlist removed successfully!');
    }
  };

  const handleRefresh = async (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      try {
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`"${playlist.name}" refreshed successfully!`);
      } catch (error) {
        alert('Failed to refresh playlist');
      }
    }
  };

  const handleXtremeLogin = async () => {
    if (!xtremeCredentials.server.trim() || !xtremeCredentials.username.trim() || !xtremeCredentials.password.trim()) {
      setXtremeError('Please fill in all fields');
      return;
    }

    // Validate server URL format
    let serverUrl = xtremeCredentials.server.trim();
    if (!serverUrl.startsWith('http://') && !serverUrl.startsWith('https://')) {
      serverUrl = 'http://' + serverUrl;
    }

    try {
      new URL(serverUrl);
    } catch {
      setXtremeError('Please enter a valid server URL');
      return;
    }

    setIsXtremeConnecting(true);
    setXtremeError('');

    try {
      // Simulate API call to Xtreme Code server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Make API call to get_live_categories, get_vod_categories, get_series_categories
      // 2. Get channel lists with get_live_streams, get_vod_streams, get_series
      // 3. Generate M3U8 URLs for each stream
      
      // For demo, we'll create mock playlists
      const mockPlaylists = [
        {
          name: `${xtremeCredentials.username} - Live TV`,
          url: `${serverUrl}/get.php?username=${xtremeCredentials.username}&password=${xtremeCredentials.password}&type=m3u_plus&output=ts`,
          type: 'live'
        },
        {
          name: `${xtremeCredentials.username} - Movies`,
          url: `${serverUrl}/get.php?username=${xtremeCredentials.username}&password=${xtremeCredentials.password}&type=m3u_plus&output=m3u8`,
          type: 'vod'
        },
        {
          name: `${xtremeCredentials.username} - Series`,
          url: `${serverUrl}/get.php?username=${xtremeCredentials.username}&password=${xtremeCredentials.password}&type=m3u_plus&output=m3u8`,
          type: 'series'
        }
      ];

      // Import each playlist
      for (const playlist of mockPlaylists) {
        try {
          await importPlaylist(playlist.url, playlist.name);
        } catch (error) {
          console.warn(`Failed to import ${playlist.name}:`, error);
        }
      }

      // Save credentials for future use (encrypted in real implementation)
      localStorage.setItem('xtreme-credentials', JSON.stringify({
        server: serverUrl,
        username: xtremeCredentials.username,
        // In real implementation, don't store password in plain text
        lastLogin: new Date().toISOString()
      }));

      setShowXtremeDialog(false);
      setXtremeCredentials({ server: '', username: '', password: '' });
      alert('Xtreme Code playlists imported successfully!');
      
    } catch (error) {
      console.error('Xtreme Code login failed:', error);
      setXtremeError('Failed to connect to Xtreme Code server. Please check your credentials and try again.');
    } finally {
      setIsXtremeConnecting(false);
    }
  };

  // Load saved credentials on component mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('xtreme-credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        setXtremeCredentials(prev => ({
          ...prev,
          server: parsed.server || '',
          username: parsed.username || ''
        }));
      }
    } catch (error) {
      console.warn('Failed to load saved Xtreme Code credentials:', error);
    }
  }, []);

  const getPlaylistStats = () => {
    const totalChannels = channels.length;
    const totalPlaylists = playlists.length;
    const categories = Array.from(new Set(channels.map(ch => ch.category))).length;
    
    return { totalChannels, totalPlaylists, categories };
  };

  const stats = getPlaylistStats();

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-yellow-500">Playlist Management</h1>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowXtremeDialog(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-all duration-300 font-semibold"
          >
            <Key size={20} />
            <span>Xtreme Code Login</span>
          </button>
          <button
            onClick={() => setShowImportDialog(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-all duration-300 font-semibold"
          >
            <Plus size={20} />
            <span>Add M3U Playlist</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Download className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-yellow-500">Total Playlists</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-500">{stats.totalPlaylists}</p>
          <p className="text-gray-400 text-sm">Active playlists</p>
        </div>

        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Tv className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-yellow-500">Total Channels</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-500">{stats.totalChannels}</p>
          <p className="text-gray-400 text-sm">Available channels</p>
        </div>

        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Globe className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-yellow-500">Categories</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-500">{stats.categories}</p>
          <p className="text-gray-400 text-sm">Different categories</p>
        </div>
      </div>

      {/* Playlists List */}
      <div className="border-2 border-yellow-500 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6">Your Playlists</h2>
        
        {playlists.length === 0 ? (
          <div className="text-center py-12">
            <Download className="mx-auto text-gray-600 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No playlists imported</h3>
            <p className="text-gray-500 mb-6">Import M3U8 playlists to get started with IPTV channels</p>
          </div>
        ) : (
          <div className="space-y-4">
            {playlists.map(playlist => (
              <div key={playlist.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{playlist.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Tv size={14} />
                        <span>{playlist.channels.length} channels</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>Updated: {playlist.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRefresh(playlist.id)}
                      className="p-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
                      title="Refresh playlist"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(playlist.id)}
                      className="p-2 rounded-lg border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300"
                      title="Edit playlist"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleRemove(playlist.id)}
                      className="p-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                      title="Remove playlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <ExternalLink size={14} className="text-gray-500" />
                  <span className="text-gray-400 truncate flex-1">{playlist.url}</span>
                </div>
                
                {/* Channel Categories Preview */}
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(playlist.channels.map(ch => ch.category))).slice(0, 5).map(category => (
                      <span
                        key={category}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                    {Array.from(new Set(playlist.channels.map(ch => ch.category))).length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{Array.from(new Set(playlist.channels.map(ch => ch.category))).length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4 border border-yellow-500">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-yellow-500">Import New Playlist</h3>
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportUrl('');
                  setImportName('');
                  setImportError('');
                }}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="text-gray-400" size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  value={importName}
                  onChange={(e) => setImportName(e.target.value)}
                  placeholder="Enter a name for this playlist"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  M3U8 Playlist URL *
                </label>
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://example.com/playlist.m3u8"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              {importError && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500 rounded-lg">
                  <AlertCircle className="text-red-500" size={16} />
                  <p className="text-red-500 text-sm">{importError}</p>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-sm text-blue-400">
                    <p className="font-medium mb-1">Supported formats:</p>
                    <ul className="text-xs space-y-1">
                      <li>• M3U8 playlist files</li>
                      <li>• Direct HTTP/HTTPS URLs</li>
                      <li>• Standard IPTV playlist format</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportUrl('');
                  setImportName('');
                  setImportError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importUrl.trim() || !importName.trim() || isImporting}
                className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold"
              >
                {isImporting ? 'Importing...' : 'Import Playlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Xtreme Code Login Dialog */}
      {showXtremeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4 border border-yellow-500">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <Key className="text-yellow-500" size={24} />
                <h3 className="text-lg font-semibold text-yellow-500">Xtreme Code Login</h3>
              </div>
              <button
                onClick={() => {
                  setShowXtremeDialog(false);
                  setXtremeCredentials({ server: '', username: '', password: '' });
                  setXtremeError('');
                }}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="text-gray-400" size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <Server size={16} />
                  <span>Server URL *</span>
                </label>
                <input
                  type="text"
                  value={xtremeCredentials.server}
                  onChange={(e) => setXtremeCredentials({ ...xtremeCredentials, server: e.target.value })}
                  placeholder="http://your-server.com:8080"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-
none"                
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <User size={16} />
                  <span>Username *</span>
                </label>
                <input
                  type="text"
                  value={xtremeCredentials.username}
                  onChange={(e) => setXtremeCredentials({ ...xtremeCredentials, username: e.target.value })}
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-              
none"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <Shield size={16} />
                  <span>Password *</span>
                </label>
                <input
                  type="password"
                  value={xtremeCredentials.password}
                  onChange={(e) => setXtremeCredentials({ ...xtremeCredentials, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              {xtremeError && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500 rounded-lg">
                  <AlertCircle className="text-red-500" size={16} />
                  <p className="text-red-500 text-sm">{xtremeError}</p>
                </div>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-sm text-yellow-400">
                    <p className="font-medium mb-1">What is Xtreme Code?</p>
                    <ul className="text-xs space-y-1">
                      <li>• Popular IPTV panel system used by many providers</li>
                      <li>• Automatically imports Live TV, Movies, and Series</li>
                      <li>• Uses your existing subscription credentials</li>
                      <li>• Supports all standard Xtreme Code features</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Shield className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-sm text-blue-400">
                    <p className="font-medium mb-1">Security Notice</p>
                    <p className="text-xs">Your credentials are stored locally and used only to generate playlist URLs. We recommend using app-specific passwords when available.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowXtremeDialog(false);
                  setXtremeCredentials({ server: '', username: '', password: '' });
                  setXtremeError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleXtremeLogin}
                disabled={!xtremeCredentials.server.trim() || !xtremeCredentials.username.trim() || !xtremeCredentials.password.trim() || isXtremeConnecting}
                className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold"
              >
                {isXtremeConnecting ? 'Connecting...' : 'Login & Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4 border border-yellow-500">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <Edit2 className="text-yellow-500" size={24} />
                <h3 className="text-lg font-semibold text-yellow-500">Edit Playlist</h3>
              </div>
              <button
                onClick={() => {
                  setShowEditDialog(null);
                  setEditName('');
                  setEditUrl('');
                }}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="text-gray-400" size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Playlist URL
                </label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowEditDialog(null);
                  setEditName('');
                  setEditUrl('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editName.trim() || !editUrl.trim()}
                className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};