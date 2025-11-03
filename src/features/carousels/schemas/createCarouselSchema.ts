import * as z from "zod";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Factory funksiya
export const createCarouselSchema = (t: (key: string) => string) =>
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
      .min(1, { message: t("Required field") })
      .max(1000, { message: t("Description must be at most 1000 characters") }),
    description_ru: z
      .string()
      .min(1, { message: t("Required field") })
      .max(1000, { message: t("Description must be at most 1000 characters") }),
    description_en: z
      .string()
      .min(1, { message: t("Required field") })
      .max(1000, { message: t("Description must be at most 1000 characters") }),

    link: z
      .string()
      .url({ message: t("Invalid URL format") })
      .optional(),

    position: z.string().min(1, { message: t("Required field") }),

    // STATUS — to‘g‘ri
    status: z.boolean().default(true),

    // IMAGE — to‘g‘ri
    image: z
      .union(
        [
          z
            .instanceof(File)
            .refine((file) => IMAGE_MIME_TYPES.includes(file.type), {
              message: t("Only JPG, PNG, WEBP files are allowed"),
            }),
          z.string().url(),
          z.null(),
        ],
        {
          message: t("Required field"),
        }
      )
      .optional()
      .nullable(),
  });

// To‘g‘ri CarouselDto
export type CarouselDto = z.infer<ReturnType<typeof createCarouselSchema>>;
