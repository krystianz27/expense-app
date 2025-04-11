import { Route } from "react-router-dom";
import CategoryList from "./CategoryList";
import CategoryCreateForm from "./CategoryCreateForm";
import ProtectedRoute from "@components/shared/ProtectedRoute";

const categoryRoutes = [
  <Route
    path="/categories"
    element={
      <ProtectedRoute>
        <CategoryList />
      </ProtectedRoute>
    }
    key="categories"
  />,
  <Route
    path="/category/add"
    element={
      <ProtectedRoute>
        <CategoryCreateForm />
      </ProtectedRoute>
    }
    key="category-add"
  />,
];

export default categoryRoutes;
