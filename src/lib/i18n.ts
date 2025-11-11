import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

const translations = {
  en,
  tr,
} as const;

export type Locale = keyof typeof translations;

export function getTranslation(locale: Locale = 'en') {
  return translations[locale] || translations.en;
}
