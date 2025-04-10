import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/shared/navbar/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import UserProfile from "./features/user/UserProfile";
import LoginForm from "@components/auth/LoginForm";
import RegisterForm from "@components/auth/RegisterForm";
import Toast from "@components/shared/Toast";
import ProtectedRoute from "@components/shared/ProtectedRoute";
import PersistAuth from "./components/auth/PersistAuth";
import { ExpenseCreateForm } from "@features/expense/ExpenseCreateForm";
import { ExpenseList } from "./features/expense/ExpenseList";
import CategoryCreateForm from "./features/categories/CategoryCreateForm";

const App = () => {
  return (
    <>
      <PersistAuth>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <ExpenseList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense/add"
              element={
                <ProtectedRoute>
                  <ExpenseCreateForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category/add"
              element={
                <ProtectedRoute>
                  <CategoryCreateForm />
                </ProtectedRoute>
              }
            />
            <Route path="/settings" element={<Settings />} />

            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>
        </Routes>
      </PersistAuth>

      <Toast />
    </>
  );
};

export default App;
