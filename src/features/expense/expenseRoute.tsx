import { Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@components/shared/ProtectedRoute";
import Spinner from "@components/shared/Spinner";

const ExpenseList = lazy(() =>
  import("./ExpenseList").then((module) => ({ default: module.ExpenseList })),
);
const ExpenseCreateForm = lazy(() =>
  import("./ExpenseCreateForm").then((module) => ({
    default: module.ExpenseCreateForm,
  })),
);

const expenseRoutes = [
  <Route
    path="/expenses"
    element={
      <ProtectedRoute>
        <Suspense fallback={<Spinner />}>
          <ExpenseList />
        </Suspense>
      </ProtectedRoute>
    }
    key="expenses"
  />,
  <Route
    path="/expense/add"
    element={
      <ProtectedRoute>
        <Suspense fallback={<Spinner />}>
          <ExpenseCreateForm />
        </Suspense>
      </ProtectedRoute>
    }
    key="expense-add"
  />,
];

export default expenseRoutes;
