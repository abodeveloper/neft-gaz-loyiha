import * as z from "zod";

// Factory funksiya
export const updateMenuPageSchema = (t: (key: string) => string) =>
  z.object({
    title_uz: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255, { message: t("Title must be at most 255 characters") }),
    title_ru: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255, { message: t("Title must be at most 255 characters") }),
    title_en: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255, { message: t("Title must be at most 255 characters") }),
    description_uz: z
      .string(),
    description_ru: z
      .string(),
    description_en: z
      .string()
  });

export type MenuPageDto = z.infer<ReturnType<typeof updateMenuPageSchema>>;
