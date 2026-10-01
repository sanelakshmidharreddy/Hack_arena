import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, SupportedLanguage } from '../i18n/translations';

describe('i18n Layer Completeness', () => {
  const languages: SupportedLanguage[] = ['te', 'ta', 'hi', 'en'];
  const referenceKeys = Object.keys(TRANSLATIONS.en).sort();

  it('all 4 languages have exactly the same set of translation keys', () => {
    languages.forEach((lang) => {
      const keys = Object.keys(TRANSLATIONS[lang]).sort();
      expect(keys).toEqual(referenceKeys);
    });
  });

  it('no translation value is empty or undefined across all languages', () => {
    languages.forEach((lang) => {
      const dict = TRANSLATIONS[lang] as unknown as Record<string, string>;
      referenceKeys.forEach((key) => {
        expect(dict[key], `Missing/empty value for ${lang}.${key}`).toBeDefined();
        expect(dict[key].trim().length, `Empty string for ${lang}.${key}`).toBeGreaterThan(0);
      });
    });
  });
});
