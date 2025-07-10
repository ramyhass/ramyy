import React, { useState } from 'react';
import { ArrowLeft, Lock, Unlock, Eye, EyeOff, Shield } from 'lucide-react';
import { AppSettings } from '../types';

interface ParentalControlProps {
  settings: AppSettings;
  categories: string[];
  isParentalUnlocked: boolean;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onVerifyPin: (pin: string) => boolean;
  onToggleCategoryLock: (category: string) => void;
  onBack: () => void;
}

export const ParentalControl: React.FC<ParentalControlProps> = ({
  settings,
  categories,
  isParentalUnlocked,
  onUpdateSettings,
  onVerifyPin,
  onToggleCategoryLock,
  onBack
}) => {
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showChangePinDialog, setShowChangePinDialog] = useState(false);
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handlePinSubmit = () => {
    if (onVerifyPin(pinInput)) {
      setShowPinDialog(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Incorrect PIN');
      setPinInput('');
    }
  };

  const handleChangePinSubmit = () => {
    if (newPin.length !== 4) {
      setPinError('PIN must be 4 digits');
      return;
    }
    
    if (newPin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }

    onUpdateSettings({
      parentalControl: {
        ...settings.parentalControl,
        pin: newPin
      }
    });

    setShowChangePinDialog(false);
    setNewPin('');
    setConfirmPin('');
    setPinError('');
    alert('PIN changed successfully');
  };

  const toggleParentalControl = () => {
    if (settings.parentalControl.enabled && !isParentalUnlocked) {
      setShowPinDialog(true);
      return;
    }

    onUpdateSettings({
      parentalControl: {
        ...settings.parentalControl,
        enabled: !settings.parentalControl.enabled
      }
    });
  };

  const handleCategoryToggle = (category: string) => {
    if (!isParentalUnlocked) {
      setShowPinDialog(true);
      return;
    }
    onToggleCategoryLock(category);
  };

  const filteredCategories = categories.filter(cat => cat !== 'All' && cat !== 'Favorites');

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
          <h1 className="text-4xl font-bold text-yellow-500">Parental Control</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${
            settings.parentalControl.enabled ? 'border-red-500 bg-red-500/20' : 'border-gray-500'
          }`}>
            <Shield className={settings.parentalControl.enabled ? 'text-red-500' : 'text-gray-500'} size={20} />
            <span className={`font-medium ${settings.parentalControl.enabled ? 'text-red-500' : 'text-gray-500'}`}>
              {settings.parentalControl.enabled ? 'PROTECTED' : 'UNPROTECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Enable/Disable Parental Control */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-yellow-500">Parental Control</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Enable or disable parental control to restrict access to selected categories.
          </p>
          <button
            onClick={toggleParentalControl}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              settings.parentalControl.enabled
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {settings.parentalControl.enabled ? 'Disable Protection' : 'Enable Protection'}
          </button>
        </div>

        {/* Change PIN */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-yellow-500">Change PIN</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Current PIN: {showPin ? settings.parentalControl.pin : '••••'}
          </p>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setShowPin(!showPin)}
              className="p-2 rounded-lg border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300"
            >
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            onClick={() => setShowChangePinDialog(true)}
            className="w-full py-3 px-4 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300"
          >
            Change PIN
          </button>
        </div>

        {/* Status */}
        <div className="border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            {isParentalUnlocked ? (
              <Unlock className="text-green-500" size={24} />
            ) : (
              <Lock className="text-red-500" size={24} />
            )}
            <h3 className="text-xl font-bold text-yellow-500">Current Status</h3>
          </div>
          <p className={`font-semibold ${isParentalUnlocked ? 'text-green-500' : 'text-red-500'}`}>
            {isParentalUnlocked ? 'Unlocked (30 min session)' : 'Locked'}
          </p>
          <p className="text-gray-400 mt-2">
            Locked Categories: {settings.parentalControl.lockedCategories.length}
          </p>
        </div>
      </div>

      {/* Category Management */}
      <div className="border-2 border-yellow-500 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-yellow-500 mb-6">Category Access Control</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map(category => {
            const isLocked = settings.parentalControl.lockedCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  isLocked
                    ? 'border-red-500 bg-red-500/20 text-red-500'
                    : 'border-green-500 bg-green-500/20 text-green-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{category}</span>
                  {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                </div>
                <p className="text-xs opacity-80">
                  {isLocked ? 'Locked' : 'Accessible'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* PIN Verification Dialog */}
      {showPinDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-yellow-500">
            <h3 className="text-lg font-semibold text-yellow-500 mb-4">Enter PIN</h3>
            
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.slice(0, 4))}
              placeholder="Enter 4-digit PIN"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none text-center text-2xl tracking-widest mb-4"
              maxLength={4}
            />
            
            {pinError && (
              <p className="text-red-500 text-sm mb-4">{pinError}</p>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPinDialog(false);
                  setPinInput('');
                  setPinError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                disabled={pinInput.length !== 4}
                className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change PIN Dialog */}
      {showChangePinDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-yellow-500">
            <h3 className="text-lg font-semibold text-yellow-500 mb-4">Change PIN</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New PIN
                </label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.slice(0, 4))}
                  placeholder="Enter new 4-digit PIN"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none text-center text-2xl tracking-widest"
                  maxLength={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.slice(0, 4))}
                  placeholder="Confirm new PIN"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none text-center text-2xl tracking-widest"
                  maxLength={4}
                />
              </div>
            </div>
            
            {pinError && (
              <p className="text-red-500 text-sm mt-4">{pinError}</p>
            )}
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowChangePinDialog(false);
                  setNewPin('');
                  setConfirmPin('');
                  setPinError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePinSubmit}
                disabled={newPin.length !== 4 || confirmPin.length !== 4}
                className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Change PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};