import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Clock, 
  Tv, 
  Film, 
  Monitor, 
  Check, 
  AlertTriangle,
  Calendar,
  Play,
  RotateCcw
} from 'lucide-react';

interface HistoryItem {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  genre?: string;
  lastWatched: Date;
  watchTime?: number;
  progress?: number;
  season?: number;
  episode?: number;
}

interface ClearHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'channels' | 'movies' | 'series';
  items: HistoryItem[];
  onClear: (selectedItems?: string[]) => void;
}

export const ClearHistoryModal: React.FC<ClearHistoryModalProps> = ({
  isOpen,
  onClose,
  type,
  items,
  onClear
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const getTypeInfo = () => {
    switch (type) {
      case 'channels':
        return {
          title: 'Clear Channel History',
          icon: Tv,
          description: 'Select channels to remove from your watch history',
          emptyMessage: 'No channel history found'
        };
      case 'movies':
        return {
          title: 'Clear Movie History',
          icon: Film,
          description: 'Select movies to remove from your watch history',
          emptyMessage: 'No movie history found'
        };
      case 'series':
        return {
          title: 'Clear Series History',
          icon: Monitor,
          description: 'Select series to remove from your watch history',
          emptyMessage: 'No series history found'
        };
    }
  };

  const typeInfo = getTypeInfo();

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => {
      const updated = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      setSelectAll(updated.length === items.length);
      return updated;
    });
  };

  const handleClear = () => {
    if (confirmClear) {
      onClear(selectedItems.length > 0 ? selectedItems : undefined);
      onClose();
      setSelectedItems([]);
      setSelectAll(false);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatLastWatched = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderItem = (item: HistoryItem) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <div
        key={item.id}
        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
          isSelected
            ? 'border-red-500 bg-red-500/10'
            : 'border-gray-600 hover:border-yellow-500'
        }`}
        onClick={() => handleItemToggle(item.id)}
      >
        {/* Selection Checkbox */}
        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-4 ${
          isSelected
            ? 'border-red-500 bg-red-500'
            : 'border-gray-500'
        }`}>
          {isSelected && <Check className="text-white" size={14} />}
        </div>

        {/* Item Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
          isSelected ? 'bg-red-500/20' : 'bg-gray-700'
        }`}>
          <typeInfo.icon 
            size={20} 
            className={isSelected ? 'text-red-400' : 'text-gray-400'} 
          />
        </div>

        {/* Item Details */}
        <div className="flex-1">
          <h3 className={`font-semibold ${
            isSelected ? 'text-red-400' : 'text-white'
          }`}>
            {item.name || item.title}
          </h3>
          
          <div className="flex items-center space-x-4 mt-1 text-sm">
            <span className={`${isSelected ? 'text-red-400' : 'text-gray-400'}`}>
              {item.category || item.genre}
            </span>
            
            <div className="flex items-center space-x-1">
              <Calendar size={12} className={isSelected ? 'text-red-400' : 'text-gray-500'} />
              <span className={`${isSelected ? 'text-red-400' : 'text-gray-500'}`}>
                {formatLastWatched(item.lastWatched)}
              </span>
            </div>

            {type === 'channels' && item.watchTime && (
              <div className="flex items-center space-x-1">
                <Clock size={12} className={isSelected ? 'text-red-400' : 'text-gray-500'} />
                <span className={`${isSelected ? 'text-red-400' : 'text-gray-500'}`}>
                  {formatWatchTime(item.watchTime)}
                </span>
              </div>
            )}

            {type === 'movies' && item.progress !== undefined && (
              <div className="flex items-center space-x-1">
                <Play size={12} className={isSelected ? 'text-red-400' : 'text-gray-500'} />
                <span className={`${isSelected ? 'text-red-400' : 'text-gray-500'}`}>
                  {item.progress}% watched
                </span>
              </div>
            )}

            {type === 'series' && item.season && item.episode && (
              <div className="flex items-center space-x-1">
                <Monitor size={12} className={isSelected ? 'text-red-400' : 'text-gray-500'} />
                <span className={`${isSelected ? 'text-red-400' : 'text-gray-500'}`}>
                  S{item.season}E{item.episode}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selection Status */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isSelected
            ? 'bg-red-500/20 text-red-400'
            : 'bg-gray-700 text-gray-400'
        }`}>
          {isSelected ? 'Selected' : 'Keep'}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden border border-yellow-500">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <typeInfo.icon className="text-yellow-500" size={24} />
            <div>
              <h2 className="text-xl font-bold text-yellow-500">{typeInfo.title}</h2>
              <p className="text-gray-400 text-sm">{typeInfo.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <typeInfo.icon className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">{typeInfo.emptyMessage}</h3>
              <p className="text-gray-500">Start watching content to build your history</p>
            </div>
          ) : (
            <>
              {/* Selection Controls */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-4 py-2 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300"
                  >
                    <Check size={16} />
                    <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
                  </button>
                  
                  <div className="text-sm text-gray-400">
                    {selectedItems.length} of {items.length} items selected
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  Total items: {items.length}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map(renderItem)}
              </div>

              {/* Warning */}
              {selectedItems.length > 0 && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-red-500 font-semibold mb-1">Warning</h4>
                      <p className="text-sm text-gray-300">
                        {selectedItems.length === items.length
                          ? `This will permanently delete all ${items.length} items from your ${type} history.`
                          : `This will permanently delete ${selectedItems.length} selected items from your ${type} history.`
                        } This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex space-x-3">
                {selectedItems.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedItems([]);
                      setSelectAll(false);
                      setConfirmClear(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-500 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>Reset Selection</span>
                  </button>
                )}
                
                <button
                  onClick={handleClear}
                  disabled={selectedItems.length === 0}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    confirmClear
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : selectedItems.length > 0
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Trash2 size={16} />
                  <span>
                    {confirmClear 
                      ? 'Confirm Delete' 
                      : selectedItems.length > 0 
                        ? `Clear ${selectedItems.length} Items`
                        : 'Select Items to Clear'
                    }
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};