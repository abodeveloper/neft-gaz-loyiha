import * as z from "zod";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Factory funksiya
export const createCompanySchema = (t: (key: string) => string) =>
  z.object({
    name_uz: z
      .string()
      .min(1, { message: t("Required field") }),
    name_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    name_en: z
      .string()
      .min(1, { message: t("Required field") }),
    address_uz: z
      .string()
      .min(1, { message: t("Required field") }),
    address_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    address_en: z
      .string()
      .min(1, { message: t("Required field") }),
    stat_1: z
      .string()
      .min(1, { message: t("Required field") }),
    stat_2: z
      .string()
      .min(1, { message: t("Required field") }),
    stat_3: z
      .string()
      .min(1, { message: t("Required field") }),
    stat_4: z
      .string()
      .min(1, { message: t("Required field") }),
    instagram: z.string().optional().nullable().or(z.literal("")),
    telegram: z.string().optional().nullable().or(z.literal("")),
    facebook: z.string().optional().nullable().or(z.literal("")),
    youtube: z.string().optional().nullable().or(z.literal("")),
    linkedin: z.string().optional().nullable().or(z.literal("")),

    phone_number: z.string().optional().nullable().or(z.literal("")), // Agar bo'sh string kelsa o'tkazib yuborish uchun

    email: z
      .string()
      .email({ message: t("Invalid email format") }) // "URL format" so'zini to'g'irlab qo'ydim
      .optional()
      .nullable()
      .or(z.literal("")), // Agar bo'sh string kelsa o'tkazib yuborish uchun

    logo: z.union([
      // 1. Yangi yuklangan fayl (File)
      z.instanceof(File).refine(
        (file) => IMAGE_MIME_TYPES.includes(file.type),
        { message: t("Only JPG, PNG, WEBP files are allowed") }
      ),

      // 2. Serverdan kelgan ESKI fayl ({ id, image })
      z.object({
        id: z.number().or(z.string()),
        image: z.string(),
      }),

      // 3. Shunchaki URL string
      z.string(),

      // 4. Null
      z.null(),
    ])
      .optional()
      .nullable(),
  });

export type CompanyDto = z.infer<ReturnType<typeof createCompanySchema>>;