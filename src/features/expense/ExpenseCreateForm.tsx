import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseFormData, expenseSchema } from "@lib/validation/expenseSchema";
import { useForm } from "react-hook-form";
import { addExpense } from "./expenseService";
import { toast } from "react-toastify";

export const ExpenseCreateForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      console.log(data);
      await addExpense(data);
      toast.success("Expense has been successfully added!");
      reset({
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error while adding expense: ", error);
      toast.error("An error occurred while adding the expense.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        Add a new expense
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Amount
          </label>
          <input
            type="number"
            {...register("amount", {
              setValueAs: (value) => parseFloat(value),
            })}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.amount && (
            <span className="text-red-500 text-sm mt-1">
              {errors.amount.message}
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Description
          </label>
          <input
            type="text"
            {...register("description")}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <span className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Category
          </label>
          <input
            type="text"
            {...register("category")}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.category && (
            <span className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </span>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Date
          </label>
          <input
            type="date"
            {...register("date")}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
          {errors.date && (
            <span className="text-red-500 text-sm mt-1">
              {errors.date.message}
            </span>
          )}
        </div>

        {/* Receipt */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Receipt
          </label>
          <input
            type="file"
            {...register("receipt")}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* {errors.receipt && (
            <span className="text-red-500 text-sm mt-1">
              {errors.receipt.message}
            </span>
          )} */}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 w-full mt-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Add expense
        </button>
      </form>
    </div>
  );
};
