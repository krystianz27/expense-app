import { Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@components/shared/ProtectedRoute";
import Spinner from "@src/components/shared/Spinner";

const UserProfile = lazy(() => import("./UserProfile"));

const userRoutes = [
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Suspense fallback={<Spinner />}>
          <UserProfile />
        </Suspense>
      </ProtectedRoute>
    }
    key="profile"
  />,
];

export default userRoutes;
