import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import cs from "./locales/cs.json";
import en from "./locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    cs: { translation: cs },
    en: { translation: en },
  },
  lng: getLocales()[0].languageCode ?? "en",
  fallbackLng: "en",
});

export default i18n;
