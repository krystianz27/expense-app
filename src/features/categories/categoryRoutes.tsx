import { Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@components/shared/ProtectedRoute";
import Spinner from "@src/components/shared/Spinner";

const CategoryList = lazy(() => import("./CategoryList"));
const CategoryCreateForm = lazy(() => import("./CategoryCreateForm"));

const categoryRoutes = [
  <Route
    path="/categories"
    element={
      <ProtectedRoute>
        <Suspense fallback={<Spinner />}>
          <CategoryList />
        </Suspense>
      </ProtectedRoute>
    }
    key="categories"
  />,
  <Route
    path="/category/add"
    element={
      <ProtectedRoute>
        <Suspense fallback={<Spinner />}>
          <CategoryCreateForm />
        </Suspense>
      </ProtectedRoute>
    }
    key="category-add"
  />,
];

export default categoryRoutes;
