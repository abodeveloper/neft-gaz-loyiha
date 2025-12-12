import i18n from "i18next";

/**
 * Global funksiya — loyihaning istalgan joyidan chaqiriladi
 * Masalan: localized(item, "title") → hozirgi tilga mos title
 */
export const localized = (
    obj: Record<string, any> | undefined | null,
    baseKey: string,
    fallbackLang = "uz"
): string => {
    if (!obj) return "";

    const currentLang = i18n.language || fallbackLang;

    // 1-usul: joriy til → fallback → uz → ru → en
    const priority = [
        currentLang,
        fallbackLang,
        "uz",
        "ru",
        "en",
    ];

    for (const lang of priority) {
        const value = obj[`${baseKey}_${lang}`];
        if (value != null && value !== "") return String(value).trim();
    }

    // 2-usul: agar yuqoridagilar boʻlmasa — mavjud boʻlgan birinchi _xx ni qaytar
    for (const key of Object.keys(obj)) {
        if (key.startsWith(`${baseKey}_`) && obj[key] != null && obj[key] !== "") {
            return String(obj[key]).trim();
        }
    }

    return "";
};