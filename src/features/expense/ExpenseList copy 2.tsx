import { useEffect, useState } from "react";
import { getUserExpenses } from "./expenseService";
import { toast } from "react-toastify";
import { auth } from "@src/firebase/config";
import { Link } from "react-router-dom";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  receipt: string | null;
}

function descendingComparator(a: Expense, b: Expense, orderBy: keyof Expense) {
  const aValue = a[orderBy] ?? "";
  const bValue = b[orderBy] ?? "";

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

function getComparator(order: "asc" | "desc", orderBy: keyof Expense) {
  return order === "desc"
    ? (a: Expense, b: Expense) => descendingComparator(a, b, orderBy)
    : (a: Expense, b: Expense) => -descendingComparator(a, b, orderBy);
}

export const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const [orderBy, setOrderBy] = useState<keyof Expense>("date");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
        toast.error("You need to log in first.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userLoggedIn) {
        return;
      }

      try {
        const fetchedExpenses = await getUserExpenses();
        setExpenses(fetchedExpenses as Expense[]);
      } catch (error) {
        console.error("Error fetching expenses: ", error);
        toast.error("An error occurred while fetching expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userLoggedIn]);

  const handleRequestSort = (property: keyof Expense) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (loading) {
    return (
      <div className="text-center text-blue-500 py-8">
        Ładowanie wydatków...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Twoje Wydatki</h2>
        <Link
          to="/expense/add"
          className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out">
          Dodaj
        </Link>
      </div>

      {expenses.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-md p-2 flex items-center justify-between text-sm text-gray-600">
            <button
              onClick={() => handleRequestSort("description")}
              className="flex items-center focus:outline-none">
              Opis
              {orderBy === "description" &&
                (order === "asc" ? (
                  <ChevronUpIcon className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                ))}
            </button>
            <button
              onClick={() => handleRequestSort("category")}
              className="flex items-center focus:outline-none">
              Kategoria
              {orderBy === "category" &&
                (order === "asc" ? (
                  <ChevronUpIcon className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                ))}
            </button>
            <button
              onClick={() => handleRequestSort("amount")}
              className="flex items-center focus:outline-none">
              Kwota
              {orderBy === "amount" &&
                (order === "asc" ? (
                  <ChevronUpIcon className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                ))}
            </button>
            <button
              onClick={() => handleRequestSort("date")}
              className="flex items-center focus:outline-none">
              Data
              {orderBy === "date" &&
                (order === "asc" ? (
                  <ChevronUpIcon className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                ))}
            </button>
            <span className="text-center w-16">Paragon</span>
          </div>
          {expenses.sort(getComparator(order, orderBy)).map((expense) => (
            <div
              key={expense.date + expense.description}
              className="bg-white rounded-md shadow-sm p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-800">
                  {expense.description}
                </span>
                <span className="text-gray-600">{expense.category}</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-semibold text-indigo-600">
                  {expense.amount} PLN
                </span>
                <span className="text-gray-500">{expense.date}</span>
              </div>
              {expense.receipt && (
                <div className="mt-2">
                  <a
                    href={expense.receipt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm">
                    Zobacz paragon
                  </a>
                </div>
              )}
              {!expense.receipt && (
                <div className="mt-2">
                  <span className="text-gray-400 text-sm">Brak paragonu</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">
          Brak dodanych wydatków.
        </p>
      )}
    </div>
  );
};
