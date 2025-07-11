import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  // Major World Languages
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', region: 'China' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', region: 'Taiwan' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Spain/Latin America' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'France' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East', rtl: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'Bangladesh' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Brazil/Portugal' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Russia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Japan' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Germany' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'South Korea' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Italy' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Turkey' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Vietnam' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Poland' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', region: 'Ukraine' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Netherlands' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Thailand' },
  
  // European Languages
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', region: 'Sweden' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', region: 'Denmark' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', region: 'Norway' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', region: 'Finland' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', region: 'Czech Republic' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', region: 'Slovakia' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', region: 'Hungary' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', region: 'Romania' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', region: 'Bulgaria' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', region: 'Croatia' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', region: 'Serbia' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', region: 'Slovenia' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', region: 'Estonia' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', region: 'Latvia' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', region: 'Lithuania' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', region: 'Greece' },
  
  // Middle Eastern & African Languages
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', region: 'Iran', rtl: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', region: 'Israel', rtl: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Pakistan', rtl: true },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', region: 'East Africa' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Ethiopia' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', region: 'West Africa' },
  
  // Asian Languages
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Malaysia' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', region: 'Philippines' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', region: 'Myanmar' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', region: 'Cambodia' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', region: 'Laos' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', region: 'Sri Lanka' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu/Sri Lanka' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam' },
  
  // Latin American Languages
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', region: 'Brazil' },
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)', region: 'Mexico' },
  { code: 'es-AR', name: 'Spanish (Argentina)', nativeName: 'Español (Argentina)', region: 'Argentina' },
  
  // Other Regional Languages
  { code: 'ca', name: 'Catalan', nativeName: 'Català', region: 'Catalonia' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera', region: 'Basque Country' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', region: 'Galicia' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', region: 'Wales' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', region: 'Ireland' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', region: 'Malta' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', region: 'Iceland' },
  { code: 'fo', name: 'Faroese', nativeName: 'Føroyskt', region: 'Faroe Islands' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', region: 'Luxembourg' },
  
  // African Languages
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', region: 'South Africa' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', region: 'South Africa' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', region: 'South Africa' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', region: 'Lesotho' },
  { code: 'tn', name: 'Setswana', nativeName: 'Setswana', region: 'Botswana' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Nigeria' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', region: 'Nigeria' },
  
  // Central Asian Languages
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', region: 'Kazakhstan' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', region: 'Kyrgyzstan' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', region: 'Uzbekistan' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe', region: 'Turkmenistan' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', region: 'Tajikistan' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', region: 'Mongolia' },
  
  // Pacific Languages
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', region: 'Hawaii' },
  { code: 'mi', name: 'Māori', nativeName: 'Te Reo Māori', region: 'New Zealand' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa', region: 'Samoa' },
  { code: 'to', name: 'Tongan', nativeName: 'Lea Fakatonga', region: 'Tonga' },
  { code: 'fj', name: 'Fijian', nativeName: 'Na Vosa Vakaviti', region: 'Fiji' }
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const getLanguagesByRegion = (region: string): Language[] => {
  return SUPPORTED_LANGUAGES.filter(lang => lang.region.includes(region));
};

export const getRTLLanguages = (): Language[] => {
  return SUPPORTED_LANGUAGES.filter(lang => lang.rtl);
};

export const searchLanguages = (query: string): Language[] => {
  const lowercaseQuery = query.toLowerCase();
  return SUPPORTED_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(lowercaseQuery) ||
    lang.nativeName.toLowerCase().includes(lowercaseQuery) ||
    lang.code.toLowerCase().includes(lowercaseQuery) ||
    lang.region.toLowerCase().includes(lowercaseQuery)
  );
};