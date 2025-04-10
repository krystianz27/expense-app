import { useForm } from "react-hook-form";
import {
  categorySchema,
  CategoryFormData,
} from "@src/lib/validation/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCategory } from "@src/features/categories/categoryService"; // Upewnij się, że masz odpowiednią ścieżkę
import { toast } from "react-toastify";

const CategoryCreateForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      //   const userId = auth.currentUser?.uid;
      //   if (!userId) {
      //     throw new Error("Użytkownik nie jest zalogowany");
      //   }

      const category = {
        name: data.name,
      };

      await addCategory(category);
      toast.success("Kategoria została dodana!");
      reset(); // Resetowanie formularza po pomyślnym dodaniu
    } catch (error) {
      toast.error("Błąd podczas dodawania kategorii.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        Dodaj nową kategorię
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Nazwa kategorii
          </label>
          <input
            type="text"
            {...register("name")}
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 w-full mt-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Dodaj kategorię
        </button>
      </form>
    </div>
  );
};

export default CategoryCreateForm;
