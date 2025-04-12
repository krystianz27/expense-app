import { Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "../Home";
import Settings from "./Settings";
import Spinner from "./Spinner";
import UserLocationMap from "../UserLocationMap";

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
  <Route
    path="/map"
    element={
      <Suspense fallback={<Spinner />}>
        <UserLocationMap />
      </Suspense>
    }
    key="map"
  />,
  <Route path="/settings" element={<Settings />} key="settings" />,
];

export default sharedRoutes;
