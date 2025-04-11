import { Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Spinner from "../shared/Spinner";

const LoginForm = lazy(() => import("@components/auth/LoginForm"));
const RegisterForm = lazy(() => import("@components/auth/RegisterForm"));

const authRoutes = [
  <Route
    path="/login"
    element={
      <Suspense fallback={<Spinner />}>
        <LoginForm />
      </Suspense>
    }
    key="login"
  />,
  <Route
    path="/register"
    element={
      <Suspense fallback={<Spinner />}>
        <RegisterForm />
      </Suspense>
    }
    key="register"
  />,
];

export default authRoutes;
