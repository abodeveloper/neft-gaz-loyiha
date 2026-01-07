import * as z from "zod";

// Factory funksiya
export const createScientificSchema = (t: (key: string) => string) =>
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
      .string()
      .min(1, { message: t("Required field") }),
    description_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    description_en: z
      .string()
      .min(1, { message: t("Required field") }),  

    sub_title_uz: z
      .string()
      .min(1, { message: t("Required field") }),
    sub_title_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    sub_title_en: z
      .string()
      .min(1, { message: t("Required field") }),

    logo: z
      .string()
      .min(1, { message: t("Required field") }),

    // STATUS
    status: z.boolean().default(true),

    slug: z.string().optional(),
    
    position: z.number().min(1, { message: t("Required field") }),
  });

// DTO tipi
export type ScientificDto = z.infer<ReturnType<typeof createScientificSchema>>;