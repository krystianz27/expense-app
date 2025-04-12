import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./components/shared/navbar/DashboardLayout";
import Toast from "@components/shared/Toast";
import PersistAuth from "./components/auth/PersistAuth";

import sharedRoutes from "./components/shared/sharedRoutes";
import userRoutes from "./features/user/userRoutes";
import expenseRoutes from "./features/expense/expenseRoute";
import categoryRoutes from "./features/categories/categoryRoutes";
import budgetRoutes from "./features/budgets/budgetRoutes";
import authRoutes from "./components/auth/authRoutes";

const App = () => {
  return (
    <>
      <PersistAuth>
        <Routes>
          <Route element={<DashboardLayout />}>
            {sharedRoutes}

            {authRoutes}

            {userRoutes}
            {expenseRoutes}
            {categoryRoutes}
            {budgetRoutes}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PersistAuth>

      <Toast />
    </>
  );
};

export default App;
