import { useEffect, useState } from "react";
import { getUserExpenses, deleteExpense } from "./expenseService";
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
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Category, getUserCategories } from "../categories/categoryService";
import Spinner from "@src/components/shared/Spinner";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  receipt: string | null;
}

const headCells = [
  { id: "description", label: "Description", align: "left" },
  { id: "category", label: "Category", align: "left" },
  { id: "amount", label: "Amount", align: "right" },
  { id: "date", label: "Date", align: "left" },
];

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
  const [categories, setCategories] = useState<Category[]>([]);
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
    if (!userLoggedIn) return;

    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getUserCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("An error occurred while fetching categories.");
      }
    };

    const fetchExpenses = async () => {
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

    fetchCategories();
    fetchExpenses();
  }, [userLoggedIn]);

  const handleRequestSort = (property: keyof Expense) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      toast.success("Expense deleted.");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense.");
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-4xl overflow- mx-auto p-6 bg-zinc-200 shadow-lg rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-4 sm:mb-0">
          Your Expenses
        </h2>
        <div className="flex flex-col sm:flex-row space-x-4 gap-2">
          <Link to="/expense/add">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
              Add Expense
            </button>
          </Link>
          <Link to="/category/add">
            <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">
              Add Category
            </button>
          </Link>
        </div>
      </div>

      <TableContainer className="overflow-auto" component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="expenses table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
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
                    onClick={() =>
                      handleRequestSort(headCell.id as keyof Expense)
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
              <TableCell
                sx={{
                  backgroundColor: "#f1f5f9",
                  color: "#1e3a8a",
                  fontWeight: "bold",
                }}>
                Actions
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
                  <TableCell>{getCategoryName(expense.category)}</TableCell>
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
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteExpense(expense.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
