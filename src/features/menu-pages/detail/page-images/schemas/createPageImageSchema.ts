import * as z from "zod";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Factory funksiya
export const createPageImageSchema = (t: (key: string) => string) =>
  z.object({
    // IMAGE — to‘g‘ri

    page: z.number().nullable().optional(),

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
export type PageImageDto = z.infer<ReturnType<typeof createPageImageSchema>>;
