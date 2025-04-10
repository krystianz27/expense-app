import { z } from "zod";

export const expenseSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(0.01, "Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  category: z.string().nonempty("Category is required"),
  date: z.string().nonempty("Date is required"),
  receipt: z.any().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
