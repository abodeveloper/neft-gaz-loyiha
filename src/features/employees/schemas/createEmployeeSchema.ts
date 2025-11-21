import * as z from "zod";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Factory funksiya
export const createEmployeeSchema = (t: (key: string) => string) =>
  z.object({
    full_name_uz: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255, { message: t("Title must be at most 255 characters") }),
    full_name_ru: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255, { message: t("Title must be at most 255 characters") }),
    full_name_en: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255, { message: t("Title must be at most 255 characters") }),

    position_uz: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255, { message: t("Position must be at most 255 characters") }),
    position_ru: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255, { message: t("Position must be at most 255 characters") }),
    position_en: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255, { message: t("Position must be at most 255 characters") }),

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

    phone: z.string().optional(),
    email: z
      .string()
      .email({ message: t("Invalid URL format") })
      .optional(),

    order: z.number().min(1, { message: t("Required field") }),

    pages: z
      .array(z.union([z.number(), z.string()]))
      // .optional()
      // .default([]),
      ,

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

export type EmployeeDto = z.infer<ReturnType<typeof createEmployeeSchema>>;
