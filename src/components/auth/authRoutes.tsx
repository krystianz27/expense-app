import { Route } from "react-router-dom";
import LoginForm from "@components/auth/LoginForm";
import RegisterForm from "@components/auth/RegisterForm";

const authRoutes = [
  <Route path="/login" element={<LoginForm />} key="login" />,
  <Route path="/register" element={<RegisterForm />} key="register" />,
];

export default authRoutes;
