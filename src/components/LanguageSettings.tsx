import React, { useState, useMemo } from 'react';
import { ArrowLeft, Languages, Search, Globe, Check, Info } from 'lucide-react';
import { AppSettings, Language } from '../types';
import { SUPPORTED_LANGUAGES, searchLanguages, getLanguageByCode } from '../utils/languages';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const currentLanguage = getLanguageByCode(settings.language);

  const regions = [
    { id: 'all', name: t('language.all'), count: SUPPORTED_LANGUAGES.length },
    { id: 'popular', name: t('language.popular'), count: 20 },
    { id: 'european', name: t('language.european'), count: 25 },
    { id: 'asian', name: t('language.asian'), count: 30 },
    { id: 'african', name: t('language.african'), count: 15 },
    { id: 'middleEastern', name: t('language.middleEastern'), count: 8 },
    { id: 'americas', name: t('language.americas'), count: 12 },
    { id: 'pacific', name: t('language.pacific'), count: 8 },
    { id: 'rtl', name: t('language.rtl'), count: 6 }
  ];

  const filteredLanguages = useMemo(() => {
    let languages = SUPPORTED_LANGUAGES;

    // Apply search filter
    if (searchQuery.trim()) {
      languages = searchLanguages(searchQuery);
    }

    // Apply region filter
    if (selectedRegion !== 'all') {
      switch (selectedRegion) {
        case 'popular':
          const popularCodes = ['en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ja', 'de', 'ko', 'it', 'tr', 'vi', 'pl', 'uk', 'nl', 'th', 'id'];
          languages = languages.filter(lang => popularCodes.includes(lang.code));
          break;
        case 'european':
          languages = languages.filter(lang => 
            ['Spain', 'France', 'Germany', 'Italy', 'Poland', 'Ukraine', 'Netherlands', 'Sweden', 'Denmark', 'Norway', 'Finland', 'Czech Republic', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Serbia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Greece', 'Catalonia', 'Basque Country', 'Galicia', 'Wales', 'Ireland', 'Malta', 'Iceland', 'Faroe Islands', 'Luxembourg'].some(region => lang.region.includes(region))
          );
          break;
        case 'asian':
          languages = languages.filter(lang => 
            ['China', 'Taiwan', 'India', 'Japan', 'South Korea', 'Vietnam', 'Thailand', 'Indonesia', 'Malaysia', 'Philippines', 'Myanmar', 'Cambodia', 'Laos', 'Sri Lanka', 'Tamil Nadu', 'Andhra Pradesh', 'Kerala', 'Karnataka', 'Gujarat', 'Punjab', 'Maharashtra', 'Odisha', 'Assam', 'Kazakhstan', 'Kyrgyzstan', 'Uzbekistan', 'Turkmenistan', 'Tajikistan', 'Mongolia'].some(region => lang.region.includes(region))
          );
          break;
        case 'african':
          languages = languages.filter(lang => 
            ['East Africa', 'Ethiopia', 'West Africa', 'South Africa', 'Lesotho', 'Botswana', 'Nigeria'].some(region => lang.region.includes(region))
          );
          break;
        case 'middleEastern':
          languages = languages.filter(lang => 
            ['Middle East', 'Iran', 'Israel', 'Pakistan', 'Turkey'].some(region => lang.region.includes(region))
          );
          break;
        case 'americas':
          languages = languages.filter(lang => 
            ['Brazil', 'Mexico', 'Argentina', 'Latin America'].some(region => lang.region.includes(region))
          );
          break;
        case 'pacific':
          languages = languages.filter(lang => 
            ['Hawaii', 'New Zealand', 'Samoa', 'Tonga', 'Fiji'].some(region => lang.region.includes(region))
          );
          break;
        case 'rtl':
          languages = languages.filter(lang => lang.rtl);
          break;
      }
    }

    return languages.sort((a, b) => {
      // Current language first
      if (a.code === settings.language) return -1;
      if (b.code === settings.language) return 1;
      // Then alphabetically by name
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedRegion, settings.language]);

  const handleLanguageChange = (languageCode: string) => {
    onUpdateSettings({ language: languageCode });
    
    // Show confirmation message
    const newLanguage = getLanguageByCode(languageCode);
    if (newLanguage) {
      // Small delay to allow the language change to take effect
      setTimeout(() => {
        alert(`Language changed to ${newLanguage.name} (${newLanguage.nativeName})`);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8" dir={currentLanguage?.rtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-yellow-500">{t('language.title')}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-yellow-500 bg-yellow-500/20">
            <Languages className="text-yellow-500" size={20} />
            <span className="font-medium text-yellow-500">
              {t('language.current')}: {currentLanguage?.nativeName || 'English'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Language Display */}
      <div className="border-2 border-yellow-500 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">{t('language.current')}</h2>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Languages className="text-yellow-500" size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white">
              {currentLanguage?.nativeName || 'English'}
            </h3>
            <p className="text-gray-400 text-lg">
              {currentLanguage?.name || 'English'} • {currentLanguage?.region || 'Global'}
            </p>
            {currentLanguage?.rtl && (
              <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                Right-to-Left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Search */}
        <div className="lg:col-span-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('language.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-yellow-500 focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Region Filter */}
        <div>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-yellow-500 focus:border-yellow-400 focus:outline-none"
          >
            {regions.map(region => (
              <option key={region.id} value={region.id}>
                {region.name} ({region.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Languages Grid */}
      <div className="border-2 border-yellow-500 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6">{t('language.select')}</h2>
        
        {filteredLanguages.length === 0 ? (
          <div className="text-center py-12">
            <Languages className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-400 text-lg">No languages found</p>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {filteredLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  settings.language === language.code
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                    : 'border-gray-600 text-gray-300 hover:border-yellow-500 hover:bg-yellow-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Globe size={16} className={settings.language === language.code ? 'text-yellow-500' : 'text-gray-400'} />
                    <span className="font-medium text-sm">{language.code.toUpperCase()}</span>
                  </div>
                  {settings.language === language.code && (
                    <Check size={16} className="text-yellow-500" />
                  )}
                </div>
                
                <h3 className="font-semibold mb-1">{language.nativeName}</h3>
                <p className="text-sm opacity-80">{language.name}</p>
                <p className="text-xs opacity-60 mt-1">{language.region}</p>
                
                {language.rtl && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                    RTL
                  </span>
                )}
                
                {settings.language === language.code && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs font-medium">
                      {t('common.current')}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Information */}
      <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-blue-500 font-semibold mb-1">{t('language.info')}</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• {t('language.infoText')}</li>
              <li>• {t('language.restart')}</li>
              <li>• RTL languages will automatically adjust the interface direction</li>
              <li>• Your language preference is saved and will persist between sessions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};