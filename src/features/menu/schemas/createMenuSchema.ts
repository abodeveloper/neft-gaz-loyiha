import * as z from "zod";

export const createMenuSchema = (t: (key: string) => string) => {
  // 1. Hamma holatlar uchun umumiy bo'lgan maydonlar (Common Fields)
  const baseSchema = z.object({
    parent: z.number().nullable().optional(),
    title_uz: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255),
    title_ru: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255),
    title_en: z
      .string()
      .min(1, { message: t("Required field") })
      .max(255),
    position: z.number().min(1, { message: t("Required field") }),
    status: z.boolean().default(true),
  });

  // 2. Discriminated Union yordamida ikkita holatni birlashtiramiz
  return z.discriminatedUnion("has_page", [
    // A HOLAT: has_page = FALSE (sahifa yo'q)
    baseSchema.extend({
      has_page: z.literal(false), // Bu yerda aniq false bo'lishi kerak
      type: z.string().nullable().optional(),
      page_slug: z.string().nullable().optional(),
    }),

    // B HOLAT: has_page = TRUE (sahifa bor)
    baseSchema.extend({
      has_page: z.literal(true), // Bu yerda aniq true bo'lishi kerak

      // Endi bular oddiy required maydonlar kabi ishlaydi
      // va boshqa inputlar bilan bir vaqtda qizaradi
      page_type: z.string({ message: t("Required field") }).min(1, { message: t("Required field") }),
      page_slug: z.string({ message: t("Required field") }).min(1, { message: t("Required field") }),
    }),
  ]);
};

export type MenuDto = z.infer<ReturnType<typeof createMenuSchema>>;