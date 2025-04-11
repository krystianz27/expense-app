import { Route } from "react-router-dom";
import { BudgetList } from "./BudgetList";
import { BudgetCreateForm } from "./BudgetCreateForm";
import ProtectedRoute from "@components/shared/ProtectedRoute";

const budgetRoutes = [
  <Route
    path="/budgets"
    element={
      <ProtectedRoute>
        <BudgetList />
      </ProtectedRoute>
    }
    key="budgets"
  />,
  <Route
    path="/budgets/add"
    element={
      <ProtectedRoute>
        <BudgetCreateForm />
      </ProtectedRoute>
    }
    key="budget-add"
  />,
];

export default budgetRoutes;
