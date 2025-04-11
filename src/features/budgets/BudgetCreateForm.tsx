import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { addBudget } from "./budgetService";
import { useNavigate } from "react-router-dom";
import { BudgetFormData, budgetSchema } from "./budgetSchema";
import { Link } from "react-router-dom";

export const BudgetCreateForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
  });

  const onSubmit = async (data: BudgetFormData) => {
    try {
      await addBudget(data);
      toast.success("Budget has been successfully added!");
      reset();
      navigate("/budgets");
    } catch (error) {
      console.error("Error while adding budget: ", error);
      toast.error("An error occurred while adding the budget.");
    }
  };

  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];

  return (
    <div className="max-w-xl my-4 mx-auto p-6 bg-zinc-100 shadow-lg rounded-lg">
      <div className="text-center mb-6 space-2 space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
        <Link
          to="/budgets"
          className="inline-block w-full md:w-auto bg-green-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
          View all budgets
        </Link>
        <Link
          to="/categories"
          className="inline-block w-full md:w-auto bg-green-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
          View all categories
        </Link>
      </div>

      <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        Add New Budget
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            {...register("amount", {
              setValueAs: (v) => parseFloat(v),
            })}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.amount && (
            <span className="text-red-500 text-sm mt-1">
              {errors.amount.message}
            </span>
          )}
        </div>

        {/* Month */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Month
          </label>
          <select
            {...register("month", { valueAsNumber: true })}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          {errors.month && (
            <span className="text-red-500 text-sm mt-1">
              {errors.month.message}
            </span>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Year
          </label>
          <input
            type="number"
            {...register("year", { valueAsNumber: true })}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.year && (
            <span className="text-red-500 text-sm mt-1">
              {errors.year.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 w-full mt-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Add budget
        </button>
      </form>
    </div>
  );
};
