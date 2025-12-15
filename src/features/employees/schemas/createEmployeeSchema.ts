import * as z from "zod";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Factory funksiya
export const createEmployeeSchema = (t: (key: string) => string) =>
  z.object({
    full_name_uz: z
      .string()
      .min(1, { message: t("Required field") }),
    full_name_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    full_name_en: z
      .string()
      .min(1, { message: t("Required field") }),

    position_uz: z
      .string()
      .min(1, { message: t("Required field") }),
    position_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    position_en: z
      .string()
      .min(1, { message: t("Required field") }),
    description_uz: z
      .string()
      .min(1, { message: t("Required field") }),
    description_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    description_en: z
      .string()
      .min(1, { message: t("Required field") }),

    phone: z.string().optional().nullable().or(z.literal("")), // Agar bo'sh string kelsa o'tkazib yuborish uchun

    email: z
      .string()
      .email({ message: t("Invalid email format") }) // "URL format" so'zini to'g'irlab qo'ydim
      .optional()
      .nullable()
      .or(z.literal("")), // Agar bo'sh string kelsa o'tkazib yuborish uchun

    order: z.coerce.number().min(1, { message: t("Required field") }), // coerce - string kelsa numberga o'giradi

    // --- PAGES (Tuzatildi) ---
    // ID lar arrayi (raqam yoki string bo'lishi mumkin)
    pages: z
      .array(z.union([z.number(), z.string()])).min(1, { message: t("Required field") })
      .default([]),

    // --- IMAGE (Tuzatildi) ---
    image: z.union([
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

export type EmployeeDto = z.infer<ReturnType<typeof createEmployeeSchema>>;