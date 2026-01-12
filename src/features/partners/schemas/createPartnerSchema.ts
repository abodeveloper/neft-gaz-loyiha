import * as z from "zod";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Factory funksiya
export const createPartnerSchema = (t: (key: string) => string) =>
  z.object({
    title_uz: z
      .string()
      .min(1, { message: t("Required field") }),
    title_ru: z
      .string()
      .min(1, { message: t("Required field") }),
    title_en: z
      .string()
      .min(1, { message: t("Required field") }),

    position: z.number().min(1, { message: t("Required field") }),
    status: z.boolean().default(true),

    link: z
          .string()
          .url({ message: t("Invalid URL format") })
          .optional(),
    

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

export type PartnerDto = z.infer<ReturnType<typeof createPartnerSchema>>;