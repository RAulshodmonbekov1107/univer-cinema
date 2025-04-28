import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import kgCommon from "../locales/kg/common.json";
import ruCommon from "../locales/ru/common.json";
import enCommon from "../locales/en/common.json";

// Get stored language or detect browser language
const getInitialLanguage = () => {
  const storedLanguage = localStorage.getItem("language");
  if (storedLanguage && ["kg", "ru", "en"].includes(storedLanguage)) {
    return storedLanguage;
  }
  
  // Browser language detection (fallback)
  const browserLang = navigator.language.split("-")[0];
  if (browserLang === "ru") return "ru";
  if (browserLang === "ky") return "kg"; // Kyrgyz ISO code is 'ky'
  return "kg"; // Default to Kyrgyz
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      kg: {
        common: kgCommon,
      },
      ru: {
        common: ruCommon,
      },
      en: {
        common: enCommon,
      },
    },
    lng: getInitialLanguage(),
    fallbackLng: "kg",
    
    interpolation: {
      escapeValue: false,
    },
    
    // Common namespace
    defaultNS: "common",
    ns: ["common"],
    
    // Cache language detection to improve performance
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    
    // Debug only in development
    debug: process.env.NODE_ENV === "development",
  });

// Add language change listener to update html lang attribute
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng === "kg" ? "ky" : lng;
  document.documentElement.dir = "ltr";
});

export default i18n; 