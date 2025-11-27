import * as z from "zod";
import { NewsType } from "../types";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Factory funksiya
export const createNewSchema = (t: (key: string) => string) =>
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

    // TYPE
    type: z.nativeEnum(NewsType, {
      message: t("Required field"),
    }),

    // STATUS
    status: z.boolean().default(true),

    // ARRAY OF IMAGES
    upload_images: z
      .array(
        z.union([
          z
            .instanceof(File)
            .refine((file) => IMAGE_MIME_TYPES.includes(file.type), {
              message: t("Only JPG, PNG, WEBP files are allowed"),
            }),
          z.string().url(),
          z.null(),
        ])
      )
      .min(1, { message: t("At least one image is required") })
      .optional()
      .nullable(),
  });

// DTO tipi
export type NewDto = z.infer<ReturnType<typeof createNewSchema>>;
