// src/i18n.ts (yoki src/lib/i18n.ts)

import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// Bu funksiyani shu faylda e'lon qilamiz (yoki import qilamiz)
export const localized = (obj: any, key: string, fallbackLang = "uz"): string => {
  if (!obj || typeof obj !== "object") return "";

  const currentLang = i18next.resolvedLanguage || i18next.language || fallbackLang;
  const order = [currentLang, fallbackLang, "uz", "ru", "en"];

  for (const lang of order) {
    const value = obj[`${key}_${lang}`];
    if (value != null && value !== "") {
      return String(value).trim();
    }
  }

  // Agar hech narsa topilmasa — birinchi mavjud _xx ni qaytar
  for (const k of Object.keys(obj)) {
    if (k.startsWith(`${key}_`) && obj[k] != null && obj[k] !== "") {
      return String(obj[k]).trim();
    }
  }

  return "";
};

// i18next ga localized funksiyasini qo'shamiz
(i18next as any).localized = localized;

// Global window ga qo'shish (faqat development/debug uchun tavsiya etiladi)
// Agar productionda xavfsizlik muammosi bo'lsa — o'chirib qo'ying
if (typeof window !== "undefined") {
  (window as any).localized = localized;
}

// i18next ni ishga tushirish
i18next
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: "uz", // Sizning loyihangiz uchun asosiy til — uz bo'lishi kerak
    fallbackLng: "uz",
    supportedLngs: ["uz", "ru", "en"],
    ns: ["common"],
    defaultNS: "common",

    backend: {
      loadPath: "/locales/{{lng}}/common.json",
    },

    interpolation: {
      escapeValue: false, // React o'zi XSS dan himoya qiladi
    },

    react: {
      useSuspense: false, // Agar SSR bo'lmasa — false yaxshi
    },

    debug: import.meta.env.DEV, // Faqat developmentda debug
  });

// i18next o'zgarganda — localized funksiyasi yangilanishi uchun
i18next.on("languageChanged", () => {
  // Har safar til o'zgarganda — yangi tilga moslash uchun hech narsa qilish shart emas,
  // chunki localized ichida i18next.resolvedLanguage ishlatilgan
});

export default i18next;