import en from "@/constants/localization/en.json";
import es from "@/constants/localization/es.json";
import { getLocales } from "expo-localization";
import { I18n, Scope, TranslateOptions } from "i18n-js";

const locales = getLocales();

export const getMainLocale = () => {
  return locales[0].languageCode!;
};

const i18n = new I18n({ en, es });

if (Array.isArray(locales)) {
  i18n.locale = getMainLocale();
}

i18n.enableFallback = true;
i18n.defaultLocale = "en";

export const translate = (scope: Scope, options?: TranslateOptions) =>
  i18n.t(scope, options);
export default I18n;
