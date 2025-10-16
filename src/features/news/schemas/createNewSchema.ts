import * as z from "zod";
import { NewsType } from "../types";

export const createNewSchema = z.object({
  title_uz: z
    .string()
    .min(1, { message: "O‘zbekcha sarlavha majburiy" })
    .max(255, {
      message: "O‘zbekcha sarlavha 255 belgidan kam bo‘lishi kerak",
    }),
  title_ru: z
    .string()
    .max(255, { message: "Ruscha sarlavha 255 belgidan kam bo‘lishi kerak" })
    .optional(),
  title_en: z
    .string()
    .max(255, { message: "Inglizcha sarlavha 255 belgidan kam bo‘lishi kerak" })
    .optional(),
  description_uz: z
    .string()
    .min(1, { message: "O‘zbekcha tavsif majburiy" })
    .optional(),
  description_ru: z.string().optional(),
  description_en: z.string().optional(),
  type: z.enum([NewsType.NEWS, NewsType.ANNOUNCEMENT]).default(NewsType.NEWS),
  status: z.boolean().default(true),
  image: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine((file) => !file || file instanceof File, {
      message: "Rasm fayli to‘g‘ri bo‘lishi kerak",
    }),
});

export type NewDto = z.infer<typeof createNewSchema>;
