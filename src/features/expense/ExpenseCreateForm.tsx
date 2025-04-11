import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseFormData, expenseSchema } from "@lib/validation/expenseSchema";
import { useForm } from "react-hook-form";
import { addExpense } from "./expenseService";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Category, getUserCategories } from "../categories/categoryService"; // Assuming categoryService is in the same directory
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "@src/firebase/config";
import { Link, useNavigate } from "react-router-dom";

export const ExpenseCreateForm = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getUserCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
        toast.error("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

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
      navigate("/expenses"); // Redirect to the expense list page after adding
    } catch (error) {
      console.error("Error while adding expense: ", error);
      toast.error("An error occurred while adding the expense.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl my-4 mx-auto p-6 bg-zinc-100 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
          Add Expense
        </h2>
        <div className="flex space-x-4">
          <Link to="/category/add">
            <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">
              Add Category
            </button>
          </Link>
        </div>
      </div>

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
          <select
            {...register("category")}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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
