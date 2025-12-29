import * as z from "zod";

// Factory funksiya
export const createEducationSchema = (t: (key: string) => string) =>
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

    direction_uz: z
      .string()
      .min(1, { message: t("Required field") }),
    direction_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    direction_en: z
      .string()
      .min(1, { message: t("Required field") }), 
      
    duration_uz: z
      .string()
      .min(1, { message: t("Required field") }),
    duration_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    duration_en: z
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
export type EducationDto = z.infer<ReturnType<typeof createEducationSchema>>;