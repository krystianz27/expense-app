import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/shared/navbar/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import LoginForm from "@components/auth/LoginForm";
import RegisterForm from "@components/auth/RegisterForm";
import Toast from "@components/shared/Toast";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>

      <Toast />
    </>
  );
};

export default App;
