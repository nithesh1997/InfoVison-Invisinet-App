import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  // init i18next
  // learn more: 🌐 https://www.i18next.com/overview/configuration-options
  // detect user language
  // learn more: 🌐 https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Pull resoures from %PUBLIC%/locale/<lang>/translations.json
  // learn more: 🌐 https://github.com/i18next/i18next-http-backend
  .init({
    debug: process.env.NODE_ENV === "development",
    supportedLngs: ["en", "es"],
    fallbackLng: "en",
    load: "languageOnly",
    // detection: {
    //   order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
    //   caches: ["cookie"],
    // },
    // interpolation: {
    //   escapeValue: false, // not needed for react as it escapes by default
    // },
    backend: {
      loadPath: "/app/locales/{{ lng }}/{{ ns }}.json",
    },
  });

export default i18n;
