import React from 'react';
import { LogOut, X, Power } from 'lucide-react';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4 border-2 border-yellow-500">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Power className="text-red-500" size={24} />
            <h2 className="text-xl font-bold text-yellow-500">Exit Application</h2>
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
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <LogOut className="text-red-500" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Are you sure you want to exit?
            </h3>
            <p className="text-gray-400">
              This will close the LEOIPTV application and stop all streaming.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <LogOut size={16} />
              <span>Exit App</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 pb-4">
          <div className="text-xs text-gray-500 text-center">
            <p>Your settings and favorites will be saved automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
};