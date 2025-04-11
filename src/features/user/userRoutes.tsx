import { Route } from "react-router-dom";
import UserProfile from "./UserProfile";
import ProtectedRoute from "@components/shared/ProtectedRoute";

const userRoutes = [
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    }
    key="profile"
  />,
];

export default userRoutes;
