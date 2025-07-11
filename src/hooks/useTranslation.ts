import { useCallback } from 'react';
import { useIPTVPlayer } from './useIPTVPlayer';
import { translate } from '../utils/translations';

export const useTranslation = () => {
  const { settings } = useIPTVPlayer();

  const t = useCallback((key: string): string => {
    return translate(key, settings.language);
  }, [settings.language]);

  return { t, currentLanguage: settings.language };
};