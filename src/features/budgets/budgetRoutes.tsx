import { Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@components/shared/ProtectedRoute";
import Spinner from "@src/components/shared/Spinner";

const BudgetList = lazy(() =>
  import("./BudgetList").then((module) => ({ default: module.BudgetList })),
);
const BudgetCreateForm = lazy(() =>
  import("./BudgetCreateForm").then((module) => ({
    default: module.BudgetCreateForm,
  })),
);

const budgetRoutes = [
  <Route
    path="/budgets"
    element={
      <ProtectedRoute>
        <Suspense fallback={<Spinner />}>
          <BudgetList />
        </Suspense>
      </ProtectedRoute>
    }
    key="budgets"
  />,
  <Route
    path="/budgets/add"
    element={
      <ProtectedRoute>
        <Suspense fallback={<Spinner />}>
          <BudgetCreateForm />
        </Suspense>
      </ProtectedRoute>
    }
    key="budget-add"
  />,
];

export default budgetRoutes;
