import React from 'react';
import { Settings } from './Settings';
import { useIPTVPlayer } from '../hooks/useIPTVPlayer';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { 
    settings, 
    updateSettings, 
    categories,
    isParentalUnlocked,
    verifyParentalPin,
    toggleCategoryLock
  } = useIPTVPlayer();

  return (
    <Settings 
      settings={settings} 
      categories={categories}
      isParentalUnlocked={isParentalUnlocked}
      onUpdateSettings={updateSettings}
      onVerifyPin={verifyParentalPin}
      onToggleCategoryLock={toggleCategoryLock}
      onBack={onBack}
    />
  );
};