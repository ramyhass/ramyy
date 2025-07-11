import React, { useState } from 'react';
import { Plus, Download, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { Playlist } from '../types';

interface PlaylistManagerProps {
  playlists: Playlist[];
  onImportPlaylist: (url: string, name: string) => Promise<Playlist>;
  onRemovePlaylist: (playlistId: string) => void;
  onRefreshPlaylist: (playlistId: string) => void;
}

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  onImportPlaylist,
  onRemovePlaylist,
  onRefreshPlaylist
}) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importName, setImportName] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!importUrl || !importName) return;

    setIsImporting(true);
    try {
      await onImportPlaylist(importUrl, importName);
      setImportUrl('');
      setImportName('');
      setShowImportDialog(false);
    } catch (error) {
      console.error('Failed to import playlist:', error);
      alert('Failed to import playlist. Please check the URL and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Playlists</h2>
          <button
            onClick={() => setShowImportDialog(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* Playlists List */}
      <div className="flex-1 overflow-y-auto p-4">
        {playlists.length === 0 ? (
          <div className="text-center py-8">
            <Download className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400 mb-2">No playlists imported</p>
            <p className="text-sm text-gray-500">Import M3U8 playlists to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {playlists.map(playlist => (
              <div key={playlist.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{playlist.name}</h3>
                    <p className="text-sm text-gray-400">
                      {playlist.channels.length} channels
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onRefreshPlaylist(playlist.id)}
                      className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Refresh playlist"
                    >
                      <RefreshCw className="text-gray-400" size={16} />
                    </button>
                    <button
                      onClick={() => onRemovePlaylist(playlist.id)}
                      className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Remove playlist"
                    >
                      <Trash2 className="text-red-400" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ExternalLink size={14} />
                  <span className="truncate">{playlist.url}</span>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {playlist.lastUpdated.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Import Playlist</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={importName}
                  onChange={(e) => setImportName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  M3U8 URL
                </label>
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://example.com/playlist.m3u8"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowImportDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importUrl || !importName || isImporting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isImporting ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};