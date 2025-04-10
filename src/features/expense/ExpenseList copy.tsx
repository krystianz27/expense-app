import { useEffect, useState } from "react";
import { getUserExpenses } from "./expenseService";
import { toast } from "react-toastify";
import { auth } from "@src/firebase/config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

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
  const [order, setOrder] = useState<"asc" | "desc">("asc");
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
      if (!userLoggedIn) return;

      try {
        const fetchedExpenses = await getUserExpenses();
        setExpenses(fetchedExpenses as Expense[]);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("An error occurred while fetching expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userLoggedIn]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Expense,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (loading) {
    return <div className="text-center text-blue-600">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-center text-blue-600">
          Your Expenses
        </h2>
        <Link to="/expense/add">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Add Expense
          </button>
        </Link>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="expenses table">
          <TableHead>
            <TableRow>
              {[
                { id: "description", label: "Description", align: "left" },
                { id: "category", label: "Category", align: "left" },
                { id: "amount", label: "Amount", align: "right" },
                { id: "date", label: "Date", align: "left" },
              ].map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align as "left" | "right"}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{
                    backgroundColor: "#f1f5f9",
                    color: "#1e3a8a",
                    fontWeight: "bold",
                    ...(headCell.id === "description"
                      ? { borderRadius: "8px 0 0 0" }
                      : headCell.id === "date"
                        ? { borderRadius: "0 8px 0 0" }
                        : {}),
                  }}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={(event) =>
                      handleRequestSort(event, headCell.id as keyof Expense)
                    }>
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell
                sx={{
                  backgroundColor: "#f1f5f9",
                  color: "#1e3a8a",
                  fontWeight: "bold",
                }}>
                Receipt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses
              .sort(getComparator(order, orderBy))
              .map((expense, idx) => (
                <TableRow
                  hover
                  key={idx}
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#f9fafb",
                    },
                    "&:hover": {
                      backgroundColor: "#e1e7f2",
                    },
                  }}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell align="right">{expense.amount} PLN</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    {expense.receipt ? (
                      <a
                        href={expense.receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline">
                        View Receipt
                      </a>
                    ) : (
                      "No receipt"
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
