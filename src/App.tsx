import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/shared/navbar/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Toast from "@components/shared/Toast";
import PersistAuth from "./components/auth/PersistAuth";

import userRoutes from "./features/user/userRoutes";
import expenseRoutes from "./features/expense/expenseRoute";
import categoryRoutes from "./features/categories/categoryRoutes";
import budgetRoutes from "./features/budgets/budgetRoutes";
import authRoutes from "./components/auth/authRoutes";
import sharedRoutes from "./components/shared/sharedRoutes";
import ProtectedRoute from "@components/shared/ProtectedRoute";
import Home from "./components/Home";

const App = () => {
  return (
    <>
      <PersistAuth>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {userRoutes}
            {authRoutes}

            {expenseRoutes}
            {categoryRoutes}
            {sharedRoutes}
            {budgetRoutes}
          </Route>
        </Routes>
      </PersistAuth>

      <Toast />
    </>
  );
};

export default App;
