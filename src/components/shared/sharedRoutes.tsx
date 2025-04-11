import { Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "../Home";
import Settings from "./Settings";
import Spinner from "./Spinner";

const Dashboard = lazy(() => import("../Dashboard"));

const sharedRoutes = [
  <Route path="/" element={<Home />} key="home" />,
  <Route
    path="/dashboard"
    element={
      <Suspense fallback={<Spinner />}>
        <Dashboard />
      </Suspense>
    }
    key="dashboard"
  />,
  <Route path="/settings" element={<Settings />} key="settings" />,
];

export default sharedRoutes;
