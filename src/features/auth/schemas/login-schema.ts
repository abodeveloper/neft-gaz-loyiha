import { z } from "zod";

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    username: z
      .string()
      .min(1, t("Username is required"))
      .regex(
        /^[a-zA-Z0-9_]+$/,
        t("Only letters, numbers, and underscores are allowed.")
      ),
    password: z.string().min(1, t("Password is required")),
  });

// To‘g‘ri type
export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;
