import { Route } from "react-router-dom";
import { ExpenseList } from "./ExpenseList";
import { ExpenseCreateForm } from "./ExpenseCreateForm";
import ProtectedRoute from "@components/shared/ProtectedRoute";

const expenseRoutes = [
  <Route
    path="/expenses"
    element={
      <ProtectedRoute>
        <ExpenseList />
      </ProtectedRoute>
    }
    key="expenses"
  />,
  <Route
    path="/expense/add"
    element={
      <ProtectedRoute>
        <ExpenseCreateForm />
      </ProtectedRoute>
    }
    key="expense-add"
  />,
];

export default expenseRoutes;
