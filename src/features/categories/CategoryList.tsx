import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCategories, deleteCategory } from "./categoryService";
import { toast } from "react-toastify";
import { auth } from "@src/firebase/config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface Category {
  id: string;
  name: string;
}

function descendingComparator(
  a: Category,
  b: Category,
  orderBy: keyof Category,
) {
  const aValue = a[orderBy]?.toLowerCase() ?? "";
  const bValue = b[orderBy]?.toLowerCase() ?? "";

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function getComparator(order: "asc" | "desc", orderBy: keyof Category) {
  return order === "desc"
    ? (a: Category, b: Category) => descendingComparator(a, b, orderBy)
    : (a: Category, b: Category) => -descendingComparator(a, b, orderBy);
}

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Category>("name");

  const navigate = useNavigate();

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
    const fetchCategories = async () => {
      if (!userLoggedIn) return;

      try {
        const fetched = await getUserCategories();
        setCategories(fetched as Category[]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [userLoggedIn]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Category deleted.");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    }
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Category,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (loading) {
    return <div className="text-center text-blue-600">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-600">
          Your Categories
        </h2>
        <div className="flex space-x-4 gap-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/category/add")}>
            Add Category
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/category/add")}>
            Add Category
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "#f1f5f9",
                  color: "#1e3a8a",
                  fontWeight: "bold",
                  borderRadius: "8px 0 0 0",
                }}>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "name")}>
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: "#f1f5f9",
                  color: "#1e3a8a",
                  fontWeight: "bold",
                  borderRadius: "0 8px 0 0",
                }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.sort(getComparator(order, orderBy)).map((category) => (
              <TableRow
                key={category.id}
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: "#f9fafb",
                  },
                  "&:hover": {
                    backgroundColor: "#e1e7f2",
                  },
                }}>
                <TableCell>{category.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(category.id)}>
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
