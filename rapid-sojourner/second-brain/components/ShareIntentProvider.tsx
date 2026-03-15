import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useShareIntent } from 'expo-share-intent';

interface ShareIntentContextType {
  hasShareIntent: boolean;
  sharedUrl: string | null;
  resetShareIntent: () => void;
}

const ShareIntentContext = createContext<ShareIntentContextType | undefined>(undefined);

export function ShareIntentProvider({ children }: { children: ReactNode }) {
  const { hasShareIntent, shareIntent, resetShareIntent, error } = useShareIntent();
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      console.error('Share Intent Error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (hasShareIntent && shareIntent.type === 'weburl' && shareIntent.webUrl) {
      setSharedUrl(shareIntent.webUrl);
    } else if (hasShareIntent && shareIntent.type === 'text' && shareIntent.text?.startsWith('http')) {
      setSharedUrl(shareIntent.text);
    } else {
      setSharedUrl(null);
    }
  }, [hasShareIntent, shareIntent]);

  const handleReset = () => {
    resetShareIntent();
    setSharedUrl(null);
  };

  return (
    <ShareIntentContext.Provider value={{ hasShareIntent, sharedUrl, resetShareIntent: handleReset }}>
      {children}
    </ShareIntentContext.Provider>
  );
}

export function useShareIntentContext() {
  const context = useContext(ShareIntentContext);
  if (context === undefined) {
    throw new Error('useShareIntentContext must be used within a ShareIntentProvider');
  }
  return context;
}
