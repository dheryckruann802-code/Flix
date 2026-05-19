import React, { createContext, useContext, useState, useEffect } from 'react';

interface TranslationContextType {
  t: (key: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
}

const DEFAULT_STRINGS = {
  // Navigation
  'home': 'Home',
  'hub': 'Hub',
  'community': 'Community',
  'social': 'Social',
  'ai_assistant': 'Judy AI',
  'profile': 'Profile',
  'search_placeholder': 'Search for everything...',
  'import_content': 'Import Content',
  
  // Home / Hero
  'trending_now': 'Trending Now',
  'watch_now': 'Watch Now',
  'add_to_wishlist': 'Wishlist',
  
  // Hub
  'hub_title': 'The Hub',
  'hub_subtitle': 'User Releases • Industry News • Voice Actor Spotlights',
  'recent_releases': 'Recent Releases',
  'cinema_news': 'Cinema News',
  'no_releases': 'No user-imported releases found',
  'read_full_story': 'Read Full Story',
  
  // User Profile
  'edit_profile': 'Edit Profile',
  'save_profile': 'Save Profile',
  'cancel': 'Cancel',
  'logout': 'Logout',
  'subscribers': 'Subscribers',
  'total_views': 'Total Views',
  'total_posts': 'Total Posts',
  'earnings': 'Earnings',
  'youtube_channel': 'YouTube Channel',
  
  // Language Selector
  'global_linguistics': 'Global Linguistics',
  'select_language': 'Select your primary viewing language',
  
  // Common
  'dubbed': 'Dubbed',
  'original': 'Original',
  'loading': 'Loading...',
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('English');
  const [translations, setTranslations] = useState<Record<string, string>>(DEFAULT_STRINGS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTranslations = async (targetLang: string, retryCount = 0) => {
    if (targetLang === 'English') {
      setTranslations(DEFAULT_STRINGS);
      return;
    }

    // Check cache first
    const cacheKey = `flix_trans_${targetLang}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTranslations(JSON.parse(cached));
      // Optionally re-fetch in background to keep it fresh
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strings: DEFAULT_STRINGS,
          targetLanguage: targetLang
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Translation failed');
      }
      
      const data = await response.json();
      if (data.translations) {
        setTranslations(data.translations);
        localStorage.setItem(cacheKey, JSON.stringify(data.translations));
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      
      // If it failed and we don't have a cache, and it's a retryable looking error
      const isHighDemand = error.message?.includes('high demand');
      if (isHighDemand && retryCount < 2) {
        console.log(`Frontend retry ${retryCount + 1} for high demand API...`);
        setTimeout(() => fetchTranslations(targetLang, retryCount + 1), 5000 * (retryCount + 1));
        return;
      }

      // Fallback to default if error and no cache
      if (!localStorage.getItem(cacheKey)) {
        setTranslations(DEFAULT_STRINGS);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    fetchTranslations(lang);
  };

  const t = (key: string) => {
    return translations[key] || DEFAULT_STRINGS[key as keyof typeof DEFAULT_STRINGS] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
