import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginPage } from "@/pages/auth/login-page";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardPage } from "@/pages/dashboard";
import { EmployeePage } from "@/pages/employee/index";
import { ProductPage } from "@/pages/product/index";
import { ProfilePage } from "@/pages/account/profile/index";
import { KanbanPage } from "@/pages/kanban/index";

/**
 * AppRoutes 组件
 *
 * 职责:
 * - 集中管理应用的所有路由规则。
 * - 定义路径与页面组件的映射关系。
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Pathless Layout Route for Dashboard pages */}
      <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="employees" element={<EmployeePage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="account/profile" element={<ProfilePage />} />
        <Route path="kanban" element={<KanbanPage />} />
      </Route>

      {/* Default redirect for the root path */}
      <Route path="/" element={<Navigate to="/overview" replace />} />
      
      {/* Catch-all for unmatched paths, redirect to overview */}
      {/* This should be the last route to ensure it only catches truly unhandled paths */}
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
} 