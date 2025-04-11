import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must not exceed 50 characters"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
