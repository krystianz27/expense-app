import { useEffect, useState } from "react";
import { getUserExpenses } from "./expenseService";
import { toast } from "react-toastify";
import { auth } from "@src/firebase/config";
import { Link } from "react-router-dom";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";

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
  const [orderBy, setOrderBy] = useState<keyof Expense>("date"); // Poprawiona literówka

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
        toast.error("Musisz się najpierw zalogować.");
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
        console.error("Błąd podczas pobierania wydatków: ", error);
        toast.error("Wystąpił błąd podczas pobierania wydatków.");
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
    return <div className="text-center text-gray-500 py-6">Ładowanie...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Twoje Wydatki
        </h2>
        <Link
          to="/expense/add"
          className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out">
          Dodaj Wydatek
        </Link>
      </div>

      {expenses.length > 0 ? (
        <div className="rounded-md shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            <li className="bg-gray-50 px-4 py-3 grid grid-cols-5 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleRequestSort("description")}
                className="flex items-center focus:outline-none justify-start min-w-[150px]">
                Opis
                {orderBy === "description" &&
                  (order === "asc" ? (
                    <ArrowUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </button>
              <button
                onClick={() => handleRequestSort("category")}
                className="flex items-center focus:outline-none justify-start min-w-[100px]">
                Kategoria
                {orderBy === "category" &&
                  (order === "asc" ? (
                    <ArrowUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </button>
              <button
                onClick={() => handleRequestSort("amount")}
                className="flex items-center focus:outline-none justify-end min-w-[80px]">
                Kwota
                {orderBy === "amount" &&
                  (order === "asc" ? (
                    <ArrowUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </button>
              <button
                onClick={() => handleRequestSort("date")}
                className="flex items-center focus:outline-none justify-start min-w-[100px]">
                Data
                {orderBy === "date" &&
                  (order === "asc" ? (
                    <ArrowUpIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                  ))}
              </button>
              <span className="flex justify-center min-w-[50px]">Paragon</span>
            </li>
            {expenses.sort(getComparator(order, orderBy)).map((expense) => (
              <li
                key={expense.date + expense.description}
                className="px-4 py-4 grid grid-cols-5 gap-4 text-sm text-gray-700 items-center">
                <span className="truncate min-w-[150px]">
                  {expense.description}
                </span>
                <span className="text-gray-600 min-w-[100px]">
                  {expense.category}
                </span>
                <span className="font-medium text-indigo-600 justify-end min-w-[80px]">
                  {expense.amount} PLN
                </span>
                <span className="text-gray-500 min-w-[100px]">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
                <div className="flex justify-center min-w-[50px]">
                  {expense.receipt ? (
                    <a
                      href={expense.receipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline">
                      <ReceiptPercentIcon className="h-5 w-5" />
                    </a>
                  ) : (
                    <span className="text-gray-300">
                      <ReceiptPercentIcon className="h-5 w-5" />
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Brak wydatków do wyświetlenia.
        </div>
      )}
    </div>
  );
};
