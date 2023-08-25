import i18n, {Module} from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager, NativeModules, Platform} from 'react-native';
import {FALLBACKLANGUAGECODE} from '../constants/localization';
import en from './en/';
import es from './es';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (cb: any) => {
    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : I18nManager.getConstants().localeIdentifier;
    const lang = deviceLanguage
      ? deviceLanguage.split(/[\s_-]+/)[0]
      : FALLBACKLANGUAGECODE;
    cb(lang);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

const resources = {
  en,
  es,
};

i18n
  .use(languageDetector as Module)
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
