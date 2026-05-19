import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import AdminLayout from "./layouts/AdminLayout";
import BaristaLayout from "./layouts/BaristaLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Dashboard from "./pages/admin/DashboardPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import UsersPage from "./pages/admin/UsersPage";
import OrdersPage from "./pages/admin/OrdersPage";
import BaristasPage from "./pages/admin/BaristasPage";
import CreateBaristaPage from "./pages/admin/CreateBaristaPage";
import EditBaristaPage from "./pages/admin/EditBaristaPage";

import BaristaOrdersPage from "./pages/barista/BaristaOrdersPage";
import BaristaProductsPage from "./pages/barista/BaristaProductsPage";

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
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="baristas" element={<BaristasPage />} />
          <Route path="baristas/create" element={<CreateBaristaPage />} />
          <Route path="baristas/:id" element={<EditBaristaPage />} />

        </Route>

        <Route
          path="/barista"
          element={
            <ProtectedRoute allowedRoles={["barista"]}>
              <BaristaLayout />
            </ProtectedRoute>
          }
        >
          <Route path="orders" element={<BaristaOrdersPage />}/>
          <Route path="products" element={<BaristaProductsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}