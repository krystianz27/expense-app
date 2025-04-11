import React, { useEffect, useState } from "react";
import { Budget, getUserBudgets, deleteBudget } from "./budgetService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@src/firebase/config";

export const BudgetList: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const fetchBudgets = async () => {
        try {
          const userBudgets = await getUserBudgets();
          setBudgets(userBudgets);
        } catch (error) {
          console.error("Error while fetching budgets: ", error);
          toast.error("An error occurred while fetching the budgets.");
        } finally {
          setLoading(false);
        }
      };

      fetchBudgets();
    }
  }, [user]);

  const handleDelete = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId);
      setBudgets((prevBudgets) =>
        prevBudgets.filter((budget) => budget.id !== budgetId),
      );
      toast.success("Budget deleted successfully.");
    } catch (error) {
      console.error("Error while deleting budget: ", error);
      toast.error("An error occurred while deleting the budget.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-zinc-100 rounded-3xl">
      <div className="text-center mb-6">
        <Link
          to="/budgets/add"
          className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
          Create a new budget
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-6 text-center">Your Budgets</h1>

      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div>
          {budgets.length > 0 ? (
            <ul className="space-y-4">
              {budgets.map((budget) => (
                <li
                  key={budget.id}
                  className="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-xl">
                      Budget for {budget.month}/{budget.year}
                    </h2>
                    <p className="text-lg mt-2">
                      Amount:{" "}
                      <span className="font-bold">${budget.amount}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(budget.id!)}
                    className="text-red-600 hover:text-red-800 focus:outline-none">
                    <FaTrashAlt size={20} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-center mt-4">You have no budgets yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
