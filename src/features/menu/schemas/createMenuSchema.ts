import * as z from "zod";

// Factory funksiya
export const createMenuSchema = (t: (key: string) => string) =>
  z.object({
    parent: z.number().nullable().optional(),
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

    page_slug: z.string().min(1, { message: t("Required field") }),

    position: z.number().min(1, { message: t("Required field") }),

    // STATUS — to‘g‘ri
    status: z.boolean().default(true),
  });

export type MenuDto = z.infer<ReturnType<typeof createMenuSchema>>;
