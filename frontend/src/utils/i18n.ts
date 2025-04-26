import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import kgCommon from "../locales/kg/common.json";
import ruCommon from "../locales/ru/common.json";
import enCommon from "../locales/en/common.json";

// Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
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
    lng: localStorage.getItem("language") || "kg", // Default language is Kyrgyz
    fallbackLng: "kg",
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Common namespace
    defaultNS: "common",
    ns: ["common"],
  });

export default i18n; 