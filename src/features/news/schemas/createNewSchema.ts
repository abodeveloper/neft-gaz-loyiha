import * as z from "zod";
import { NewsType } from "../types";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// 1-QADAM: Enum qiymatlarini Zod tushunadigan formatga (massivga) o'giramiz
// 'as [string, ...string[]]' bu Zodga massiv bo'sh emasligini bildirish uchun kerak
const newsTypeValues = Object.values(NewsType) as [string, ...string[]];

// Factory funksiya
export const createNewSchema = (t: (key: string) => string) =>
  z.object({

    pages: z
          .array(z.union([z.number(), z.string()])).min(1, { message: t("Required field") })
          .default([]),

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

    // TYPE
    // type: z.enum(NewsType, {
    //   errorMap: () => ({ message: t("Required field") }),
    // }),

    type: z.enum(newsTypeValues, {
      message: t("Required field"),
    }),

    // STATUS
    status: z.boolean().default(true),

    // PUBLISHED DATE
    published_date: z
      .preprocess(
        (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
        z.date({
          message: t("Required field"),
        })
      )
      .refine((date) => date !== undefined && !isNaN(date.getTime()), {
        message: t("Invalid date format"),
      }),

    // ARRAY OF IMAGES
    images: z
      .array(
        z.union([
          // 1. Yangi yuklangan fayl (File)
          z.instanceof(File).refine(
            (file) => IMAGE_MIME_TYPES.includes(file.type),
            { message: t("Only JPG, PNG, WEBP files are allowed") }
          ),

          // 2. Serverdan kelgan ESKI fayl ({ id, image })
          z.object({
            id: z.number().or(z.string()), // Ba'zan id string kelishi mumkin, ehtiyot shart
            image: z.string(),
          }),

          // 3. Shunchaki URL string (agar backenddan shunday kelsa)
          z.string(),
        ])
      )
      // Agar rasm majburiy bo'lsa, pastdagi qatorni oching:
      // .min(1, { message: t("At least one image is required") })
      .optional()
      .default([]), // Null yoki undefined bo'lmasligi uchun bo'sh massivga o'zgartirdik
  });

// DTO tipi
export type NewDto = z.infer<ReturnType<typeof createNewSchema>>;