import React, { useEffect, useState } from "react";
import { Budget, getUserBudgets } from "./budgetService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const BudgetList: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Your Budgets</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {budgets.length > 0 ? (
            <ul>
              {budgets.map((budget) => (
                <li key={budget.id} className="mb-4">
                  <div className="p-4 border rounded-md">
                    <h2 className="font-semibold">
                      Budget for {budget.month}/{budget.year}
                    </h2>
                    <p>Amount: ${budget.amount}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no budgets yet.</p>
          )}
        </div>
      )}
      <Link to="/budgets/create" className="mt-4 text-blue-500 hover:underline">
        Create a new budget
      </Link>
    </div>
  );
};
