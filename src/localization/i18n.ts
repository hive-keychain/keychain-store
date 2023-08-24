import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {FALLBACKLANGUAGECODE} from '../constants/localization';
import en from './en/';
import es from './es';

const resources = {
  en,
  es,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3', //To make it work for Android devices, add this line.
    resources,
    fallbackLng: FALLBACKLANGUAGECODE,
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false,
    },
    detection: {
      lookupQuerystring: 'lng',
    },
  });
export default i18n;
