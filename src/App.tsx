import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/shared/navbar/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import UserProfile from "./features/user/UserProfile";
import LoginForm from "@components/auth/LoginForm";
import RegisterForm from "@components/auth/RegisterForm";
import Toast from "@components/shared/Toast";
import ProtectedRoute from "@components/shared/ProtectedRoute";

const App = () => {
  return (
    <>
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
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>
      </Routes>

      <Toast />
    </>
  );
};

export default App;
