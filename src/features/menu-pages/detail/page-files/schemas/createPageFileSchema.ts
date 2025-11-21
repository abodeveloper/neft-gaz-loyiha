import * as z from "zod";

export const createPageFileSchema = (t: (key: string) => string) =>
  z.object({
    title_uz: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255),
    title_ru: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255),
    title_en: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255),
    position: z.coerce.number().min(1, { message: t("Required field") }),
    status: z.boolean().default(true),
    page: z.number().nullable().optional(),

    /** Ixtiyoriy – har qanday fayl, URL yoki null/undefined */
    file: z.any().optional().nullable(),
  });

export type PageFileDto = z.infer<ReturnType<typeof createPageFileSchema>>;
