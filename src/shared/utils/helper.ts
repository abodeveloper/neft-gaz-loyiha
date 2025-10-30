import { format, isValid, parseISO } from "date-fns";

export const buildFilterQuery = (
  filters: Record<string, string | number | undefined> | unknown
): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      params.append(key, value.toString());
  });
  const query = params.toString();
  return query ? `&${query}` : "";
};

// Xavfsiz sana formatlash
export const formatPublishedDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";

  let date: Date;

  try {
    date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, "dd MMMM yyyy, HH:mm");
    }
  } catch {}

  date = new Date(dateString);
  if (isValid(date)) {
    return format(date, "dd MMMM yyyy, HH:mm");
  }

  return "—";
};

// Joriy tilga qarab matn olish
export const getLocalizedText = (
  translations: Record<string, string | null>,
  lang: string,
  fallback: string = ""
): string => {
  const keys = [lang, `${lang}_uz`, `${lang}_ru`, `${lang}_en`];
  for (const key of keys) {
    if (translations[key]) return translations[key]!;
  }
  return fallback;
};
