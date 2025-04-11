import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/shared/navbar/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Toast from "@components/shared/Toast";
import PersistAuth from "./components/auth/PersistAuth";

import userRoutes from "./features/user/userRoutes";
import expenseRoutes from "./features/expense/expenseRoute";
import categoryRoutes from "./features/categories/categoryRoutes";
import authRoutes from "./components/auth/authRoutes";
import sharedRoutes from "./components/shared/sharedRoutes";
import ProtectedRoute from "@components/shared/ProtectedRoute";

const App = () => {
  return (
    <>
      <PersistAuth>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {userRoutes}
            {expenseRoutes}
            {categoryRoutes}
            {sharedRoutes}
            {authRoutes}
          </Route>
        </Routes>
      </PersistAuth>

      <Toast />
    </>
  );
};

export default App;
