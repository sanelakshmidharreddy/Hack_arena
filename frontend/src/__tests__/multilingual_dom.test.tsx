import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../components/Header';
import { VoiceHero } from '../components/VoiceHero';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';

const TELUGU_UNICODE_REGEX = /[\u0C00-\u0C7F]/;

// Helper component that forces language to English
function EnglishWrapper({ children }: { children: React.ReactNode }) {
  const { setLanguage } = useLanguage();
  React.useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <>{children}</>;
}

describe('Multilingual DOM Assertions (Zero Telugu in English Mode)', () => {
  beforeEach(() => {
    localStorage.setItem('jansakhi_selected_language', 'en');
  });

  it('renders Header in English mode with zero Telugu characters in text content', () => {
    const { container } = render(
      <LanguageProvider>
        <EnglishWrapper>
          <Header
            onOpenLanguageModal={() => {}}
            onReset={() => {}}
            privacyMode={false}
            onTogglePrivacy={() => {}}
          />
        </EnglishWrapper>
      </LanguageProvider>
    );

    const fullText = container.textContent || '';
    expect(fullText).not.toMatch(TELUGU_UNICODE_REGEX);
    expect(fullText).toContain('Jansakhi');
    expect(fullText).toContain('Verified Government Information');
  });

  it('renders VoiceHero in English mode with zero Telugu characters in text content', () => {
    const { container } = render(
      <LanguageProvider>
        <EnglishWrapper>
          <VoiceHero
            voiceState="idle"
            onStartListening={() => {}}
            onStopListening={() => {}}
            onSubmitText={() => {}}
            onSelectSampleNeed={() => {}}
          />
        </EnglishWrapper>
      </LanguageProvider>
    );

    const fullText = container.textContent || '';
    expect(fullText).not.toMatch(TELUGU_UNICODE_REGEX);
    expect(fullText).toContain('What do you need help with?');
    expect(fullText).toContain('Tap and speak in your language');
  });
});
