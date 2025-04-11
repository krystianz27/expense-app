import { z } from "zod";

export const budgetSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0.01, "Amount must be greater than 0"),
  month: z
    .number({ invalid_type_error: "Month must be a number" })
    .int()
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
  year: z
    .number({ invalid_type_error: "Year must be a number" })
    .int()
    .min(2000, "Year must be greater than 2000"),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;
