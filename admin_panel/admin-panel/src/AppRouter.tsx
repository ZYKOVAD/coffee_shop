import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import CreateProductPage from "./pages/admin/CreateProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import CreateCategoryPage from "./pages/admin/CreateCategoryPage";
import EditCategoryPage from "./pages/admin/EditCategoryPage";
import UsersPage from "./pages/admin/UsersPage";
import OrdersPage from "./pages/admin/OrdersPage";
import BaristasPage from "./pages/admin/BaristasPage";
import CreateBaristaPage from "./pages/admin/CreateBaristaPage";
import EditBaristaPage from "./pages/admin/EditBaristaPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="products/:id" element={<EditProductPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/create" element={<CreateCategoryPage />} />
          <Route path="categories/:id" element={<EditCategoryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="baristas" element={<BaristasPage />} />
          <Route path="baristas/create" element={<CreateBaristaPage />} />
          <Route path="baristas/:id" element={<EditBaristaPage />} />

        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}