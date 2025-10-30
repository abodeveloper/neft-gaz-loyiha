import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18next
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    supportedLngs: ['en', 'ru', 'uz'], // Explicitly list supported languages
    ns: ['common'], // Use only common namespace
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/common.json' // Path to translation files
    },
    interpolation: {
      escapeValue: false // React already escapes values
    },
    debug: true, // Enable debug logs
    react: {
      useSuspense: false // Disable suspense to avoid rendering issues
    }
  });

export default i18next;
