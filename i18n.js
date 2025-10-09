import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";

const LANG_KEY = "user-language";

// 🔄 Function to change and persist language
export const changeAppLanguage = async (lang) => {
  try {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANG_KEY, lang);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};

// 🧠 Function to initialize language safely
async function initLanguage() {
  try {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);

    // ✅ Safely handle undefined or empty locale
    const systemLocale = Localization.locale
      ? Localization.locale.split("-")[0]
      : "en";

    return savedLang || systemLocale || "en";
  } catch (error) {
    console.warn("Error initializing language:", error);
    return "en";
  }
}

// ⚙️ Initialize i18next
(async () => {
  const lang = await initLanguage();
  console.log("🌍 Loaded language:", lang);

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v3",
      lng: lang,
      fallbackLng: "en",
      resources: {
        en: { translation: en },
        hi: { translation: hi },
        mr: { translation: mr },
      },
      interpolation: { escapeValue: false },
    });
})();

export default i18n;
